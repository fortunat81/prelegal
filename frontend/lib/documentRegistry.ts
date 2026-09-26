import { DocumentModule } from "@/lib/genericDocument";
import { aiAddendumModule } from "@/lib/documents/aiAddendum";
import { baaModule } from "@/lib/documents/baa";
import { csaModule } from "@/lib/documents/csa";
import { designPartnerAgreementModule } from "@/lib/documents/designPartnerAgreement";
import { dpaModule } from "@/lib/documents/dpa";
import { partnershipAgreementModule } from "@/lib/documents/partnershipAgreement";
import { pilotAgreementModule } from "@/lib/documents/pilotAgreement";
import { psaModule } from "@/lib/documents/psa";
import { slaModule } from "@/lib/documents/sla";
import { softwareLicenseAgreementModule } from "@/lib/documents/softwareLicenseAgreement";

export type RegistryEntry = { kind: "nda" } | { kind: "generic"; module: DocumentModule };

export const documentRegistry: Record<string, RegistryEntry> = {
  "mutual-nda": { kind: "nda" },
  baa: { kind: "generic", module: baaModule },
  "pilot-agreement": { kind: "generic", module: pilotAgreementModule },
  csa: { kind: "generic", module: csaModule },
  "design-partner-agreement": { kind: "generic", module: designPartnerAgreementModule },
  sla: { kind: "generic", module: slaModule },
  psa: { kind: "generic", module: psaModule },
  dpa: { kind: "generic", module: dpaModule },
  "software-license-agreement": { kind: "generic", module: softwareLicenseAgreementModule },
  "partnership-agreement": { kind: "generic", module: partnershipAgreementModule },
  "ai-addendum": { kind: "generic", module: aiAddendumModule },
};
