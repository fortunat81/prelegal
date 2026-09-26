import { ChatMessage } from "@/lib/chat";
import { GenericFormData, GenericFormPatch } from "@/lib/genericDocument";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:4000";

export async function sendGenericChatMessage(
  documentType: string,
  messages: ChatMessage[],
  currentData: GenericFormData,
): Promise<{ reply: string; patch: GenericFormPatch }> {
  const response = await fetch(`${API_BASE_URL}/api/chat`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ documentType, messages, currentData }),
  });

  if (!response.ok) {
    throw new Error("Failed to reach the AI service. Please try again.");
  }

  return response.json();
}
