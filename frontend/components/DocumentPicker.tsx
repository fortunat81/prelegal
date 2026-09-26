"use client";

import { useEffect, useState } from "react";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:4000";

interface CatalogItem {
  id: string;
  title: string;
  description: string;
  supported: boolean;
}

interface MatchResponse {
  matchedId: string | null;
  supported: boolean;
  alternativeId: string | null;
}

interface DocumentPickerProps {
  onSelect: (id: string) => void;
}

export default function DocumentPicker({ onSelect }: DocumentPickerProps) {
  const [documents, setDocuments] = useState<CatalogItem[] | null>(null);
  const [query, setQuery] = useState("");
  const [isMatching, setIsMatching] = useState(false);
  const [matchError, setMatchError] = useState<string | null>(null);
  const [matchResult, setMatchResult] = useState<MatchResponse | null>(null);

  useEffect(() => {
    fetch(`${API_BASE_URL}/api/documents`)
      .then((res) => res.json())
      .then((body) => setDocuments(body.documents))
      .catch(() => setDocuments([]));
  }, []);

  async function handleMatch() {
    const text = query.trim();
    if (!text || isMatching) return;
    setIsMatching(true);
    setMatchError(null);
    setMatchResult(null);

    try {
      const response = await fetch(`${API_BASE_URL}/api/documents/match`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: text }),
      });
      if (!response.ok) throw new Error("Match failed.");
      setMatchResult(await response.json());
    } catch {
      setMatchError("Something went wrong — please try again.");
    } finally {
      setIsMatching(false);
    }
  }

  const matched = matchResult?.matchedId
    ? documents?.find((doc) => doc.id === matchResult.matchedId)
    : undefined;
  const alternative = matchResult?.alternativeId
    ? documents?.find((doc) => doc.id === matchResult.alternativeId)
    : undefined;

  return (
    <main>
      <h1>Create a Legal Document</h1>
      <p className="subtitle">Pick a document type below, or describe what you need.</p>

      <div className="panel">
        <div className="field">
          <label>
            Not sure which document you need?
            <span className="hint">Describe what you&rsquo;re trying to do</span>
            <textarea
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="e.g. I need something to cover a customer testing our product for a month"
            />
          </label>
        </div>
        <button className="primary-btn" onClick={handleMatch} disabled={isMatching || !query.trim()}>
          {isMatching ? "Finding…" : "Find my document"}
        </button>

        {matchError && <p className="chat-error">{matchError}</p>}

        {matchResult && !matchResult.matchedId && (
          <p className="chat-error">
            We couldn&rsquo;t find a good match for that. Take a look at the documents below.
          </p>
        )}

        {matched && matchResult?.supported && (
          <p className="hint">
            That sounds like a <strong>{matched.title}</strong>.{" "}
            <button className="link-btn" onClick={() => onSelect(matched.id)}>
              Start it now
            </button>
          </p>
        )}

        {matched && matchResult && !matchResult.supported && (
          <p className="chat-error">
            We don&rsquo;t support generating a {matched.title} yet.
            {alternative ? (
              <>
                {" "}
                The closest thing we can help with is a <strong>{alternative.title}</strong>.{" "}
                <button className="link-btn" onClick={() => onSelect(alternative.id)}>
                  Start it now
                </button>
              </>
            ) : (
              " Take a look at the documents below."
            )}
          </p>
        )}
      </div>

      <div className="document-grid">
        {documents === null && <p className="hint">Loading document types…</p>}
        {documents?.map((doc) => (
          <button
            key={doc.id}
            className="document-card"
            disabled={!doc.supported}
            onClick={() => doc.supported && onSelect(doc.id)}
          >
            <h3>{doc.title}</h3>
            <p>{doc.description}</p>
            {!doc.supported && <span className="coming-soon">Coming soon</span>}
          </button>
        ))}
      </div>
    </main>
  );
}
