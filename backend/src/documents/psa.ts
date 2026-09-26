import { CONVERSATION_GUIDANCE, DocumentModule } from "../llm.js";

export interface EntityInfoPatch {
  legalName?: string;
  signatoryName?: string;
  signatoryTitle?: string;
  noticeAddress?: string;
}

export interface PsaFormPatch {
  provider?: EntityInfoPatch;
  customer?: EntityInfoPatch;
  effectiveDate?: string;
  sowTerm?: string;
  servicesDescription?: string;
  fees?: string;
  paymentPeriod?: string;
  rejectionPeriod?: string;
  resubmissionPeriod?: string;
  timeOfAssignment?: string;
  customerObligations?: string;
  generalCapAmount?: string;
  governingLaw?: string;
  chosenCourts?: string;
}

const ENTITY_FIELDS = ["legalName", "signatoryName", "signatoryTitle", "noticeAddress"] as const;

function buildSystemPrompt(currentData: unknown): string {
  return `You are helping a user fill out a Common Paper Professional Services Agreement (PSA) - an agreement under which a "Provider" performs services for a "Customer" under one or more Statements of Work (SOWs) - through conversation.

${CONVERSATION_GUIDANCE}

The fields you need to gather are:
- provider and customer, each an object with: legalName, signatoryName, signatoryTitle, noticeAddress (all strings) - "provider" is the party performing the services, "customer" is the party receiving them
- effectiveDate (string, format yyyy-mm-dd)
- sowTerm (string): how long the Statement of Work/engagement runs, e.g. "12 months from the Effective Date"
- servicesDescription (string): a description of the Services and Deliverables Provider will perform/produce
- fees (string): how Provider is compensated, e.g. "$150/hour, billed monthly" or "$25,000 fixed fee"
- paymentPeriod (string): how long Customer has to pay an invoice, e.g. "30 days from invoice date"
- rejectionPeriod (string): how long Customer has to reject a Deliverable, e.g. "10 business days"
- resubmissionPeriod (string): how long Provider has to correct and resubmit a rejected Deliverable, e.g. "10 business days"
- timeOfAssignment (string): when ownership of Deliverables transfers to Customer, e.g. "upon full payment of Fees"
- customerObligations (string, optional): anything Customer must provide or do to support the engagement - default to "no additional obligations beyond reasonable cooperation" if the user has none
- generalCapAmount (string): the general liability cap, e.g. "the Fees paid in the prior 12 months"
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

function sanitizePatch(value: unknown): PsaFormPatch {
  if (!isPlainObject(value)) return {};
  const patch: PsaFormPatch = {};

  for (const field of [
    "sowTerm",
    "servicesDescription",
    "fees",
    "paymentPeriod",
    "rejectionPeriod",
    "resubmissionPeriod",
    "timeOfAssignment",
    "customerObligations",
    "generalCapAmount",
    "governingLaw",
    "chosenCourts",
  ] as const) {
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

export const psaModule: DocumentModule<PsaFormPatch> = {
  id: "psa",
  buildSystemPrompt,
  sanitizePatch,
};
