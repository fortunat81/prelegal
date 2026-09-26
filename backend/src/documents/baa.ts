import { CONVERSATION_GUIDANCE, DocumentModule } from "../llm.js";

export interface EntityInfoPatch {
  legalName?: string;
  signatoryName?: string;
  signatoryTitle?: string;
  noticeAddress?: string;
}

export interface BaaFormPatch {
  provider?: EntityInfoPatch;
  company?: EntityInfoPatch;
  baaEffectiveDate?: string;
  breachNotificationPeriod?: string;
  limitations?: string;
  agreement?: string;
}

const ENTITY_FIELDS = ["legalName", "signatoryName", "signatoryTitle", "noticeAddress"] as const;

function buildSystemPrompt(currentData: unknown): string {
  return `You are helping a user fill out a Common Paper Business Associate Agreement (BAA) - a HIPAA compliance document between a "Provider" (the business associate performing services) and a "Company" (the covered entity) - through conversation.

${CONVERSATION_GUIDANCE}

The fields you need to gather are:
- provider and company, each an object with: legalName, signatoryName, signatoryTitle, noticeAddress (all strings) - "provider" is the business associate handling PHI on the company's behalf, "company" is the covered entity
- baaEffectiveDate (string, format yyyy-mm-dd)
- breachNotificationPeriod (string): how quickly the provider must report a breach, e.g. "10 business days"
- limitations (string, optional): any restrictions on the provider offshoring, de-identifying, or aggregating PHI - default to "None" if the user has no restrictions
- agreement (string): a short reference to the base commercial agreement this BAA attaches to, e.g. "the Cloud Service Agreement dated January 1, 2026"

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

function sanitizePatch(value: unknown): BaaFormPatch {
  if (!isPlainObject(value)) return {};
  const patch: BaaFormPatch = {};

  for (const field of ["breachNotificationPeriod", "limitations", "agreement"] as const) {
    const fieldValue = value[field];
    if (typeof fieldValue === "string") {
      patch[field] = fieldValue;
    }
  }

  if (typeof value.baaEffectiveDate === "string" && /^\d{4}-\d{2}-\d{2}$/.test(value.baaEffectiveDate)) {
    const [year, month, day] = value.baaEffectiveDate.split("-").map(Number);
    const date = new Date(year, month - 1, day);
    if (date.getFullYear() === year && date.getMonth() === month - 1 && date.getDate() === day) {
      patch.baaEffectiveDate = value.baaEffectiveDate;
    }
  }

  const provider = sanitizeEntityPatch(value.provider);
  if (provider) patch.provider = provider;
  const company = sanitizeEntityPatch(value.company);
  if (company) patch.company = company;

  return patch;
}

export const baaModule: DocumentModule<BaaFormPatch> = {
  id: "baa",
  buildSystemPrompt,
  sanitizePatch,
};
