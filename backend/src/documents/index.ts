import { readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { DocumentModule } from "../llm.js";
import { aiAddendumModule } from "./aiAddendum.js";
import { baaModule } from "./baa.js";
import { csaModule } from "./csa.js";
import { designPartnerAgreementModule } from "./designPartnerAgreement.js";
import { dpaModule } from "./dpa.js";
import { mutualNdaModule } from "./mutualNda.js";
import { partnershipAgreementModule } from "./partnershipAgreement.js";
import { pilotAgreementModule } from "./pilotAgreement.js";
import { psaModule } from "./psa.js";
import { slaModule } from "./sla.js";
import { softwareLicenseAgreementModule } from "./softwareLicenseAgreement.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

interface CatalogEntry {
  name: string;
  description: string;
  filename: string;
}

// Maps each root catalog.json entry (by its "name") to a stable id used throughout
// the app. "Mutual NDA Cover Page" is intentionally omitted: it's a companion
// document to the Mutual NDA, not a standalone document type users pick.
const CATALOG_ID_BY_NAME: Record<string, string> = {
  "Mutual NDA": "mutual-nda",
  "Cloud Service Agreement (CSA)": "csa",
  "Design Partner Agreement": "design-partner-agreement",
  "Service Level Agreement (SLA)": "sla",
  "Professional Services Agreement (PSA)": "psa",
  "Data Processing Agreement (DPA)": "dpa",
  "Software License Agreement": "software-license-agreement",
  "Partnership Agreement": "partnership-agreement",
  "Business Associate Agreement (BAA)": "baa",
  "Pilot Agreement": "pilot-agreement",
  "AI Addendum": "ai-addendum",
};

const registeredModules: DocumentModule<any>[] = [
  mutualNdaModule,
  baaModule,
  pilotAgreementModule,
  csaModule,
  designPartnerAgreementModule,
  slaModule,
  psaModule,
  dpaModule,
  softwareLicenseAgreementModule,
  partnershipAgreementModule,
  aiAddendumModule,
];

export interface CatalogItem {
  id: string;
  title: string;
  description: string;
  supported: boolean;
}

function loadCatalog(): CatalogItem[] {
  const catalogPath = path.resolve(__dirname, "../../../catalog.json");
  const raw = JSON.parse(readFileSync(catalogPath, "utf-8")) as { templates: CatalogEntry[] };
  const supportedIds = new Set(registeredModules.map((mod) => mod.id));

  return raw.templates
    .filter((entry) => CATALOG_ID_BY_NAME[entry.name])
    .map((entry) => {
      const id = CATALOG_ID_BY_NAME[entry.name];
      return {
        id,
        title: entry.name,
        description: entry.description,
        supported: supportedIds.has(id),
      };
    });
}

export const catalog = loadCatalog();

export function getDocumentModule(id: string): DocumentModule<any> | undefined {
  return registeredModules.find((mod) => mod.id === id);
}
