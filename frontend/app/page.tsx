"use client";

import { useState } from "react";
import NdaChat from "@/components/NdaChat";
import NdaForm from "@/components/NdaForm";
import NdaPreview from "@/components/NdaPreview";
import { defaultNdaFormData } from "@/lib/nda";

export default function Home() {
  const [data, setData] = useState(defaultNdaFormData);
  const [isGenerating, setIsGenerating] = useState(false);
  const [activeTab, setActiveTab] = useState<"form" | "chat">("form");

  async function handleDownload() {
    setIsGenerating(true);
    try {
      const [{ pdf }, { default: NdaPdfDocument }] = await Promise.all([
        import("@react-pdf/renderer"),
        import("@/components/NdaPdfDocument"),
      ]);
      const blob = await pdf(<NdaPdfDocument data={data} />).toBlob();
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = "Mutual-NDA.pdf";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } finally {
      setIsGenerating(false);
    }
  }

  return (
    <main>
      <h1>Mutual NDA Creator</h1>
      <p className="subtitle">
        Fill in the details below to generate a Common Paper Mutual NDA, then download it as a
        PDF.
      </p>

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
            <NdaForm data={data} onChange={setData} />
          </div>
          <div style={{ display: activeTab === "chat" ? "block" : "none" }}>
            <NdaChat data={data} onChange={setData} />
          </div>
        </div>

        <div className="sticky-preview">
          <div className="preview-toolbar">
            <h2 style={{ margin: 0 }}>Preview</h2>
            <button className="primary-btn" onClick={handleDownload} disabled={isGenerating}>
              {isGenerating ? "Generating…" : "Download PDF"}
            </button>
          </div>
          <NdaPreview data={data} />
        </div>
      </div>
    </main>
  );
}
