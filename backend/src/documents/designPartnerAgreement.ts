import { CONVERSATION_GUIDANCE, DocumentModule } from "../llm.js";

export interface EntityInfoPatch {
  legalName?: string;
  signatoryName?: string;
  signatoryTitle?: string;
  noticeAddress?: string;
}

export interface DesignPartnerAgreementFormPatch {
  provider?: EntityInfoPatch;
  partner?: EntityInfoPatch;
  effectiveDate?: string;
  term?: string;
  program?: string;
  fees?: string;
  governingLaw?: string;
  chosenCourts?: string;
}

const ENTITY_FIELDS = ["legalName", "signatoryName", "signatoryTitle", "noticeAddress"] as const;

function buildSystemPrompt(currentData: unknown): string {
  return `You are helping a user fill out a Common Paper Design Partner Agreement - an early-access/feedback partnership between a "Provider" (who builds the product) and a "Partner" (a design partner who gets early access in exchange for Feedback) - through conversation.

${CONVERSATION_GUIDANCE}

The fields you need to gather are:
- provider and partner, each an object with: legalName, signatoryName, signatoryTitle, noticeAddress (all strings) - "provider" is the company building the product, "partner" is the design partner giving feedback
- effectiveDate (string, format yyyy-mm-dd)
- term (string): how long the partner has early access under the program, e.g. "12 months from the Effective Date"
- program (string): a short description of the design partner program - the feedback schedule, cadence, or scope
- fees (string, optional): any fees the partner pays to participate - default to "$0" if it's free
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

function sanitizePatch(value: unknown): DesignPartnerAgreementFormPatch {
  if (!isPlainObject(value)) return {};
  const patch: DesignPartnerAgreementFormPatch = {};

  for (const field of ["term", "program", "fees", "governingLaw", "chosenCourts"] as const) {
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
  const partner = sanitizeEntityPatch(value.partner);
  if (partner) patch.partner = partner;

  return patch;
}

export const designPartnerAgreementModule: DocumentModule<DesignPartnerAgreementFormPatch> = {
  id: "design-partner-agreement",
  buildSystemPrompt,
  sanitizePatch,
};
