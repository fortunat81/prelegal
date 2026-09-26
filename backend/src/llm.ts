export interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

export interface DocumentModule<TPatch> {
  id: string;
  buildSystemPrompt(currentData: unknown): string;
  sanitizePatch(value: unknown): TPatch;
}

export class LlmError extends Error {}

const OPENROUTER_URL = "https://openrouter.ai/api/v1/chat/completions";
const MODEL = "openai/gpt-oss-120b";

async function callOpenRouter(systemPrompt: string, messages: ChatMessage[]): Promise<string> {
  const apiKey = process.env.OPENROUTER_API_KEY;
  if (!apiKey) {
    throw new LlmError("OPENROUTER_API_KEY is not configured on the backend.");
  }

  let response: Response;
  try {
    response = await fetch(OPENROUTER_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: MODEL,
        provider: { order: ["cerebras"] },
        response_format: { type: "json_object" },
        temperature: 0.2,
        messages: [{ role: "system", content: systemPrompt }, ...messages],
      }),
      signal: AbortSignal.timeout(25_000),
    });
  } catch (err) {
    throw new LlmError(`Failed to reach OpenRouter: ${(err as Error).message}`);
  }

  if (!response.ok) {
    throw new LlmError(`OpenRouter returned ${response.status}: ${await response.text()}`);
  }

  const body = (await response.json()) as {
    choices?: { message?: { content?: unknown } }[];
  };
  const content = body?.choices?.[0]?.message?.content;
  if (typeof content !== "string") {
    throw new LlmError("OpenRouter response did not contain message content.");
  }
  return content;
}

export async function callLlmForDocument<TPatch>(
  documentModule: DocumentModule<TPatch>,
  messages: ChatMessage[],
  currentData: unknown,
): Promise<{ reply: string; patch: TPatch }> {
  const content = await callOpenRouter(documentModule.buildSystemPrompt(currentData), messages);

  try {
    const parsed = JSON.parse(content);
    const reply = typeof parsed?.reply === "string" ? parsed.reply : content;
    return { reply, patch: documentModule.sanitizePatch(parsed?.patch) };
  } catch {
    console.warn("Failed to parse model output as JSON:", content.slice(0, 500));
    return { reply: content, patch: documentModule.sanitizePatch(undefined) };
  }
}

export async function matchDocument(
  query: string,
  catalog: { id: string; title: string; description: string }[],
): Promise<{ matchedId: string | null }> {
  const systemPrompt = `You help route users to the correct legal document template from a fixed catalog.

The catalog of available document types is:
${catalog.map((entry) => `- id: "${entry.id}", title: "${entry.title}" - ${entry.description}`).join("\n")}

The user will describe what they need in one message. Reply with a single JSON object and nothing else - no markdown, no code fences, no text outside the JSON. The object must have exactly one key:
- "matchedId": the "id" of the single best-matching catalog entry, or null if nothing in the catalog is a reasonable match for what the user described.

Only pick an id from the catalog above. Do not invent ids.`;

  const content = await callOpenRouter(systemPrompt, [{ role: "user", content: query }]);

  try {
    const parsed = JSON.parse(content);
    const matchedId = typeof parsed?.matchedId === "string" ? parsed.matchedId : null;
    return { matchedId: catalog.some((entry) => entry.id === matchedId) ? matchedId : null };
  } catch {
    console.warn("Failed to parse document-match output as JSON:", content.slice(0, 500));
    return { matchedId: null };
  }
}
