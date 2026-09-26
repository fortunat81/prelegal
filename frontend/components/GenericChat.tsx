"use client";

import { useState } from "react";
import { ChatMessage } from "@/lib/chat";
import { sendGenericChatMessage } from "@/lib/genericChat";
import { DocumentModule, GenericFormData, mergeGenericFormData } from "@/lib/genericDocument";

interface GenericChatProps {
  documentModule: DocumentModule;
  data: GenericFormData;
  onChange: (updater: (data: GenericFormData) => GenericFormData) => void;
}

export default function GenericChat({ documentModule, data, onChange }: GenericChatProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSend() {
    const text = input.trim();
    if (!text || isSending) return;

    const nextMessages: ChatMessage[] = [...messages, { role: "user", content: text }];
    setMessages(nextMessages);
    setInput("");
    setIsSending(true);
    setError(null);

    try {
      const { reply, patch } = await sendGenericChatMessage(documentModule.id, nextMessages, data);
      setMessages([...nextMessages, { role: "assistant", content: reply }]);
      onChange((prev) => mergeGenericFormData(documentModule, prev, patch));
    } catch {
      setError("Something went wrong — please try again.");
      setInput(text);
      setMessages(messages);
    } finally {
      setIsSending(false);
    }
  }

  return (
    <div className="panel chat-panel">
      <h2>Chat</h2>
      <div className="chat-messages">
        {messages.length === 0 && (
          <p className="hint">
            Tell the AI about the {documentModule.title} you need, and it will fill in the form as
            you talk.
          </p>
        )}
        {messages.map((message, index) => (
          <div key={index} className={`chat-bubble ${message.role}`}>
            {message.content}
          </div>
        ))}
      </div>

      {error && <p className="chat-error">{error}</p>}

      <div className="chat-input-row">
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              handleSend();
            }
          }}
          placeholder="Type a message…"
          disabled={isSending}
        />
        <button className="primary-btn" onClick={handleSend} disabled={isSending || !input.trim()}>
          {isSending ? "Sending…" : "Send"}
        </button>
      </div>
    </div>
  );
}
