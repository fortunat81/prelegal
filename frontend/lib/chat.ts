import { NdaFormData, NdaFormPatch } from "@/lib/nda";

export interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:4000";

export async function sendChatMessage(
  messages: ChatMessage[],
  currentData: NdaFormData,
): Promise<{ reply: string; patch: NdaFormPatch }> {
  const response = await fetch(`${API_BASE_URL}/api/chat`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ messages, currentData }),
  });

  if (!response.ok) {
    throw new Error("Failed to reach the AI service. Please try again.");
  }

  return response.json();
}
