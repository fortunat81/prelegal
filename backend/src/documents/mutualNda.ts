import { DocumentModule } from "../llm.js";

export interface PartyInfoPatch {
  name?: string;
  title?: string;
  company?: string;
  noticeAddress?: string;
}

export interface NdaFormPatch {
  purpose?: string;
  effectiveDate?: string;
  mndaTermType?: "expires" | "continues";
  mndaTermYears?: number;
  confidentialityTermType?: "years" | "perpetuity";
  confidentialityTermYears?: number;
  governingLaw?: string;
  jurisdiction?: string;
  modifications?: string;
  party1?: PartyInfoPatch;
  party2?: PartyInfoPatch;
}

const PARTY_FIELDS = ["name", "title", "company", "noticeAddress"] as const;

function buildSystemPrompt(currentData: unknown): string {
  return `You are helping a user fill out a Common Paper Mutual Non-Disclosure Agreement (NDA) through conversation.

Ask the user about the document conversationally, one topic at a time. The fields you need to gather are:
- purpose (string): why the parties are sharing confidential information
- effectiveDate (string, format yyyy-mm-dd)
- mndaTermType (exactly "expires" or "continues"): whether the MNDA expires after a term or continues until terminated
- mndaTermYears (number): only meaningful when mndaTermType is "expires"
- confidentialityTermType (exactly "years" or "perpetuity"): how long confidentiality lasts
- confidentialityTermYears (number): only meaningful when confidentialityTermType is "years"
- governingLaw (string): a US state
- jurisdiction (string): city/county and state
- modifications (string, optional): any modifications to the standard terms
- party1 and party2, each an object with: name, title, company, noticeAddress (all strings)

The current state of the form, gathered so far, is:
${JSON.stringify(currentData)}

Reply with a single JSON object and nothing else - no markdown, no code fences, no text outside the JSON. The object must have exactly two keys:
- "reply": a short, natural-language message to show the user (your next question, or an acknowledgement)
- "patch": an object containing every field you are confident about based on the whole conversation so far (not just this turn). Omit any field you don't know yet. Never invent a value the user didn't state or clearly imply. If nothing is known yet, use an empty object.`;
}

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function sanitizePartyPatch(value: unknown): PartyInfoPatch | undefined {
  if (!isPlainObject(value)) return undefined;
  const patch: PartyInfoPatch = {};
  for (const field of PARTY_FIELDS) {
    const fieldValue = value[field];
    if (typeof fieldValue === "string") {
      patch[field] = fieldValue;
    }
  }
  return Object.keys(patch).length > 0 ? patch : undefined;
}

function sanitizePatch(value: unknown): NdaFormPatch {
  if (!isPlainObject(value)) return {};
  const patch: NdaFormPatch = {};

  for (const field of ["purpose", "governingLaw", "jurisdiction", "modifications"] as const) {
    const fieldValue = value[field];
    if (typeof fieldValue === "string") {
      patch[field] = fieldValue;
    }
  }

  if (typeof value.effectiveDate === "string" && /^\d{4}-\d{2}-\d{2}$/.test(value.effectiveDate)) {
    const [year, month, day] = value.effectiveDate.split("-").map(Number);
    const date = new Date(year, month - 1, day);
    if (date.getFullYear() === year && date.getMonth() === month - 1 && date.getDate() === day) {
      patch.effectiveDate = value.effectiveDate;
    }
  }

  if (value.mndaTermType === "expires" || value.mndaTermType === "continues") {
    patch.mndaTermType = value.mndaTermType;
  }
  if (value.confidentialityTermType === "years" || value.confidentialityTermType === "perpetuity") {
    patch.confidentialityTermType = value.confidentialityTermType;
  }

  if (typeof value.mndaTermYears === "number" && Number.isFinite(value.mndaTermYears)) {
    patch.mndaTermYears = Math.max(1, Math.floor(value.mndaTermYears));
  }
  if (typeof value.confidentialityTermYears === "number" && Number.isFinite(value.confidentialityTermYears)) {
    patch.confidentialityTermYears = Math.max(1, Math.floor(value.confidentialityTermYears));
  }

  const party1 = sanitizePartyPatch(value.party1);
  if (party1) patch.party1 = party1;
  const party2 = sanitizePartyPatch(value.party2);
  if (party2) patch.party2 = party2;

  return patch;
}

export const mutualNdaModule: DocumentModule<NdaFormPatch> = {
  id: "mutual-nda",
  buildSystemPrompt,
  sanitizePatch,
};
