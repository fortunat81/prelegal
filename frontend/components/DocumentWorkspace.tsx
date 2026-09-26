"use client";

import { useState } from "react";
import GenericChat from "@/components/GenericChat";
import GenericForm from "@/components/GenericForm";
import GenericPreview from "@/components/GenericPreview";
import NdaChat from "@/components/NdaChat";
import NdaForm from "@/components/NdaForm";
import NdaPreview from "@/components/NdaPreview";
import { defaultNdaFormData } from "@/lib/nda";
import { documentRegistry } from "@/lib/documentRegistry";
import { GenericFormData } from "@/lib/genericDocument";

function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

interface DocumentWorkspaceProps {
  documentId: string;
  onBack: () => void;
}

export default function DocumentWorkspace({ documentId, onBack }: DocumentWorkspaceProps) {
  const entry = documentRegistry[documentId];
  const [ndaData, setNdaData] = useState(defaultNdaFormData);
  const [genericData, setGenericData] = useState(() =>
    entry.kind === "generic" ? entry.module.defaultData() : null,
  );
  const [isGenerating, setIsGenerating] = useState(false);
  const [activeTab, setActiveTab] = useState<"form" | "chat">("form");

  async function handleDownload() {
    setIsGenerating(true);
    try {
      if (entry.kind === "nda") {
        const [{ pdf }, { default: NdaPdfDocument }] = await Promise.all([
          import("@react-pdf/renderer"),
          import("@/components/NdaPdfDocument"),
        ]);
        const blob = await pdf(<NdaPdfDocument data={ndaData} />).toBlob();
        downloadBlob(blob, "Mutual-NDA.pdf");
      } else if (genericData) {
        const [{ pdf }, { default: GenericPdfDocument }] = await Promise.all([
          import("@react-pdf/renderer"),
          import("@/components/GenericPdfDocument"),
        ]);
        const blob = await pdf(
          <GenericPdfDocument documentModule={entry.module} data={genericData} />,
        ).toBlob();
        downloadBlob(blob, entry.module.pdfFilename);
      }
    } finally {
      setIsGenerating(false);
    }
  }

  function handleGenericChatChange(updater: (data: GenericFormData) => GenericFormData) {
    setGenericData((prev) => (prev ? updater(prev) : prev));
  }

  const title = entry.kind === "nda" ? "Mutual NDA Creator" : `${entry.module.title} Creator`;
  const subtitle =
    entry.kind === "nda"
      ? "Fill in the details below to generate a Common Paper Mutual NDA, then download it as a PDF."
      : `Fill in the details below to generate a Common Paper ${entry.module.title}, then download it as a PDF.`;

  return (
    <main>
      <button className="back-link" onClick={onBack}>
        ‹ Choose a different document
      </button>
      <h1>{title}</h1>
      <p className="subtitle">{subtitle}</p>

      <div className="layout">
        <div>
          <div className="tab-bar">
            <button
              className={`tab-button${activeTab === "form" ? " active" : ""}`}
              onClick={() => setActiveTab("form")}
            >
              Form
            </button>
            <button
              className={`tab-button${activeTab === "chat" ? " active" : ""}`}
              onClick={() => setActiveTab("chat")}
            >
              Chat
            </button>
          </div>
          <div style={{ display: activeTab === "form" ? "block" : "none" }}>
            {entry.kind === "nda" ? (
              <NdaForm data={ndaData} onChange={setNdaData} />
            ) : (
              genericData && (
                <GenericForm documentModule={entry.module} data={genericData} onChange={setGenericData} />
              )
            )}
          </div>
          <div style={{ display: activeTab === "chat" ? "block" : "none" }}>
            {entry.kind === "nda" ? (
              <NdaChat data={ndaData} onChange={setNdaData} />
            ) : (
              genericData && (
                <GenericChat
                  documentModule={entry.module}
                  data={genericData}
                  onChange={handleGenericChatChange}
                />
              )
            )}
          </div>
        </div>

        <div className="sticky-preview">
          <div className="preview-toolbar">
            <h2 style={{ margin: 0 }}>Preview</h2>
            <button className="primary-btn" onClick={handleDownload} disabled={isGenerating}>
              {isGenerating ? "Generating…" : "Download PDF"}
            </button>
          </div>
          {entry.kind === "nda" ? (
            <NdaPreview data={ndaData} />
          ) : (
            genericData && <GenericPreview documentModule={entry.module} data={genericData} />
          )}
        </div>
      </div>
    </main>
  );
}
