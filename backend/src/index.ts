import cors from "cors";
import express from "express";
import { catalog, getDocumentModule } from "./documents/index.js";
import { db } from "./db.js";
import { ChatMessage, LlmError, callLlmForDocument, matchDocument } from "./llm.js";

const app = express();
const port = process.env.PORT ? Number(process.env.PORT) : 4000;

app.use(cors({ origin: process.env.FRONTEND_ORIGIN ?? "http://localhost:3000" }));
app.use(express.json());

app.get("/health", (_req, res) => {
  const row = db.prepare("SELECT 1 AS ok").get();
  res.json({ status: "ok", db: row ? "connected" : "unavailable" });
});

app.get("/api/documents", (_req, res) => {
  res.json({ documents: catalog });
});

app.post("/api/documents/match", async (req, res) => {
  const { query } = req.body ?? {};
  if (typeof query !== "string" || query.trim().length === 0) {
    res.status(400).json({ error: "Invalid request." });
    return;
  }

  try {
    const { matchedId } = await matchDocument(
      query,
      catalog.map(({ id, title, description }) => ({ id, title, description })),
    );
    const matched = matchedId ? catalog.find((entry) => entry.id === matchedId) : undefined;

    let alternativeId: string | null = null;
    if (matched && !matched.supported) {
      const supportedCatalog = catalog.filter((entry) => entry.supported);
      const { matchedId: altId } = await matchDocument(
        query,
        supportedCatalog.map(({ id, title, description }) => ({ id, title, description })),
      );
      alternativeId = altId;
    }

    res.json({
      matchedId: matched?.id ?? null,
      supported: matched?.supported ?? false,
      alternativeId,
    });
  } catch (err) {
    if (err instanceof LlmError) {
      console.error("LLM error:", err.message);
      res.status(502).json({ error: "Failed to reach the AI service. Please try again." });
      return;
    }
    console.error("Unexpected error in /api/documents/match:", err);
    res.status(500).json({ error: "Something went wrong." });
  }
});

function isChatMessage(value: unknown): value is ChatMessage {
  return (
    typeof value === "object" &&
    value !== null &&
    ((value as ChatMessage).role === "user" || (value as ChatMessage).role === "assistant") &&
    typeof (value as ChatMessage).content === "string"
  );
}

app.post("/api/chat", async (req, res) => {
  const { documentType, messages, currentData } = req.body ?? {};
  if (
    typeof documentType !== "string" ||
    !Array.isArray(messages) ||
    !messages.every(isChatMessage) ||
    typeof currentData !== "object"
  ) {
    res.status(400).json({ error: "Invalid request." });
    return;
  }

  const documentModule = getDocumentModule(documentType);
  if (!documentModule) {
    res.status(400).json({ error: `Unknown document type: ${documentType}` });
    return;
  }

  try {
    const result = await callLlmForDocument(documentModule, messages, currentData);
    res.json(result);
  } catch (err) {
    if (err instanceof LlmError) {
      console.error("LLM error:", err.message);
      res.status(502).json({ error: "Failed to reach the AI service. Please try again." });
      return;
    }
    console.error("Unexpected error in /api/chat:", err);
    res.status(500).json({ error: "Something went wrong." });
  }
});

app.listen(port, () => {
  console.log(`prelegal backend listening on http://localhost:${port}`);
});
