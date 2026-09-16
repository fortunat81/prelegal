"use client";

import { useState } from "react";
import { pdf } from "@react-pdf/renderer";
import NdaForm from "@/components/NdaForm";
import NdaPreview from "@/components/NdaPreview";
import NdaPdfDocument from "@/components/NdaPdfDocument";
import { defaultNdaFormData } from "@/lib/nda";

export default function Home() {
  const [data, setData] = useState(defaultNdaFormData);
  const [isGenerating, setIsGenerating] = useState(false);

  async function handleDownload() {
    setIsGenerating(true);
    try {
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
          <NdaForm data={data} onChange={setData} />
        </div>

        <div className="sticky-preview">
          <div className="preview-toolbar">
            <h2 style={{ margin: 0 }}>Preview</h2>
            <button className="download-btn" onClick={handleDownload} disabled={isGenerating}>
              {isGenerating ? "Generating…" : "Download PDF"}
            </button>
          </div>
          <NdaPreview data={data} />
        </div>
      </div>
    </main>
  );
}
