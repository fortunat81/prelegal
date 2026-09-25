import cors from "cors";
import express from "express";
import { db } from "./db.js";
import { ChatMessage, LlmError, getChatCompletion } from "./llm.js";

const app = express();
const port = process.env.PORT ? Number(process.env.PORT) : 4000;

app.use(cors({ origin: process.env.FRONTEND_ORIGIN ?? "http://localhost:3000" }));
app.use(express.json());

app.get("/health", (_req, res) => {
  const row = db.prepare("SELECT 1 AS ok").get();
  res.json({ status: "ok", db: row ? "connected" : "unavailable" });
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
  const { messages, currentData } = req.body ?? {};
  if (!Array.isArray(messages) || !messages.every(isChatMessage) || typeof currentData !== "object") {
    res.status(400).json({ error: "Invalid request." });
    return;
  }

  try {
    const result = await getChatCompletion(messages, currentData);
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
