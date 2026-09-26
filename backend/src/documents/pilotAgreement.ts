import { DocumentModule } from "../llm.js";

export interface EntityInfoPatch {
  legalName?: string;
  signatoryName?: string;
  signatoryTitle?: string;
  noticeAddress?: string;
}

export interface PilotAgreementFormPatch {
  provider?: EntityInfoPatch;
  customer?: EntityInfoPatch;
  effectiveDate?: string;
  pilotPeriod?: string;
  product?: string;
  generalCapAmount?: string;
  governingLaw?: string;
  chosenCourts?: string;
}

const ENTITY_FIELDS = ["legalName", "signatoryName", "signatoryTitle", "noticeAddress"] as const;

function buildSystemPrompt(currentData: unknown): string {
  return `You are helping a user fill out a Common Paper Pilot Agreement - a short-term trial/evaluation agreement between a "Provider" and a "Customer" - through conversation.

Ask the user about the document conversationally, one topic at a time. The fields you need to gather are:
- provider and customer, each an object with: legalName, signatoryName, signatoryTitle, noticeAddress (all strings)
- effectiveDate (string, format yyyy-mm-dd)
- pilotPeriod (string): how long the pilot lasts, e.g. "30 days from the Effective Date"
- product (string): a short description of the product being piloted
- generalCapAmount (string): the liability cap for the pilot, e.g. "$10,000" or "the total Fees paid"
- governingLaw (string): a US state
- chosenCourts (string): the city/county and state where disputes will be litigated

The current state of the form, gathered so far, is:
${JSON.stringify(currentData)}

Reply with a single JSON object and nothing else - no markdown, no code fences, no text outside the JSON. The object must have exactly two keys:
- "reply": a short, natural-language message to show the user (your next question, or an acknowledgement)
- "patch": an object containing every field you are confident about based on the whole conversation so far (not just this turn). Omit any field you don't know yet. Never invent a value the user didn't state or clearly imply. If nothing is known yet, use an empty object.`;
}

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function sanitizeEntityPatch(value: unknown): EntityInfoPatch | undefined {
  if (!isPlainObject(value)) return undefined;
  const patch: EntityInfoPatch = {};
  for (const field of ENTITY_FIELDS) {
    const fieldValue = value[field];
    if (typeof fieldValue === "string") {
      patch[field] = fieldValue;
    }
  }
  return Object.keys(patch).length > 0 ? patch : undefined;
}

function sanitizePatch(value: unknown): PilotAgreementFormPatch {
  if (!isPlainObject(value)) return {};
  const patch: PilotAgreementFormPatch = {};

  for (const field of ["pilotPeriod", "product", "generalCapAmount", "governingLaw", "chosenCourts"] as const) {
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

  const provider = sanitizeEntityPatch(value.provider);
  if (provider) patch.provider = provider;
  const customer = sanitizeEntityPatch(value.customer);
  if (customer) patch.customer = customer;

  return patch;
}

export const pilotAgreementModule: DocumentModule<PilotAgreementFormPatch> = {
  id: "pilot-agreement",
  buildSystemPrompt,
  sanitizePatch,
};
