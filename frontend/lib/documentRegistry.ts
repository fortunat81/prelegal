import { DocumentModule } from "@/lib/genericDocument";
import { baaModule } from "@/lib/documents/baa";
import { pilotAgreementModule } from "@/lib/documents/pilotAgreement";

export type RegistryEntry = { kind: "nda" } | { kind: "generic"; module: DocumentModule };

export const documentRegistry: Record<string, RegistryEntry> = {
  "mutual-nda": { kind: "nda" },
  baa: { kind: "generic", module: baaModule },
  "pilot-agreement": { kind: "generic", module: pilotAgreementModule },
};
