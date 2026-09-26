"use client";

import { useState } from "react";
import DocumentPicker from "@/components/DocumentPicker";
import DocumentWorkspace from "@/components/DocumentWorkspace";

export default function Home() {
  const [selectedDocumentId, setSelectedDocumentId] = useState<string | null>(null);

  if (!selectedDocumentId) {
    return <DocumentPicker onSelect={setSelectedDocumentId} />;
  }

  return (
    <DocumentWorkspace
      key={selectedDocumentId}
      documentId={selectedDocumentId}
      onBack={() => setSelectedDocumentId(null)}
    />
  );
}
