import { CONVERSATION_GUIDANCE, DocumentModule } from "../llm.js";

export interface EntityInfoPatch {
  legalName?: string;
  signatoryName?: string;
  signatoryTitle?: string;
  noticeAddress?: string;
}

export interface CsaFormPatch {
  provider?: EntityInfoPatch;
  customer?: EntityInfoPatch;
  effectiveDate?: string;
  orderDate?: string;
  subscriptionPeriod?: string;
  nonRenewalNoticePeriod?: string;
  fees?: string;
  paymentProcess?: string;
  technicalSupport?: string;
  useLimitations?: string;
  dpaReference?: string;
  generalCapAmount?: string;
  increasedCapAmount?: string;
  additionalWarranties?: string;
  governingLaw?: string;
  chosenCourts?: string;
}

const ENTITY_FIELDS = ["legalName", "signatoryName", "signatoryTitle", "noticeAddress"] as const;

function buildSystemPrompt(currentData: unknown): string {
  return `You are helping a user fill out a Common Paper Cloud Service Agreement (CSA) - an agreement for a "Provider" to provide a cloud/SaaS product to a "Customer" - through conversation.

${CONVERSATION_GUIDANCE}

The fields you need to gather are:
- provider and customer, each an object with: legalName, signatoryName, signatoryTitle, noticeAddress (all strings) - "provider" operates the Cloud Service, "customer" subscribes to use it
- effectiveDate (string, format yyyy-mm-dd): when the Framework Terms start
- orderDate (string, format yyyy-mm-dd): when the Order Form (and this specific subscription) starts
- subscriptionPeriod (string): how long the subscription lasts and renews, e.g. "12 months from the Order Date"
- nonRenewalNoticePeriod (string): how far before the end of a Subscription Period a party must give notice to not renew, e.g. "60 days"
- fees (string): the subscription Fees and how they're structured, e.g. "$5,000/month" or "$50,000/year"
- paymentProcess (string): how and when Customer pays, e.g. "invoiced monthly in advance, due net 30"
- technicalSupport (string): the level of support Provider will give, e.g. "email support with 1 business day response time"
- useLimitations (string, optional): any limits on Customer's use of the Product (e.g. seat/user caps, usage volume) - default to "no additional use limitations" if none
- dpaReference (string, optional): whether/which Data Processing Agreement applies to Personal Data, e.g. "the Data Processing Agreement dated January 1, 2026" - default to "no separate Data Processing Agreement" if none
- generalCapAmount (string): each party's general liability cap, e.g. "the total Fees paid in the 12 months before the claim"
- increasedCapAmount (string): the higher liability cap that applies to Increased Claims (e.g. breaches of confidentiality or indemnification obligations), e.g. "2x the total Fees paid"
- additionalWarranties (string, optional): any extra warranties either party makes beyond the standard ones - default to "no additional warranties" if none
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

function sanitizePatch(value: unknown): CsaFormPatch {
  if (!isPlainObject(value)) return {};
  const patch: CsaFormPatch = {};

  for (const field of [
    "subscriptionPeriod",
    "nonRenewalNoticePeriod",
    "fees",
    "paymentProcess",
    "technicalSupport",
    "useLimitations",
    "dpaReference",
    "generalCapAmount",
    "increasedCapAmount",
    "additionalWarranties",
    "governingLaw",
    "chosenCourts",
  ] as const) {
    const fieldValue = value[field];
    if (typeof fieldValue === "string") {
      patch[field] = fieldValue;
    }
  }

  for (const field of ["effectiveDate", "orderDate"] as const) {
    const fieldValue = value[field];
    if (typeof fieldValue === "string" && /^\d{4}-\d{2}-\d{2}$/.test(fieldValue)) {
      const [year, month, day] = fieldValue.split("-").map(Number);
      const date = new Date(year, month - 1, day);
      if (date.getFullYear() === year && date.getMonth() === month - 1 && date.getDate() === day) {
        patch[field] = fieldValue;
      }
    }
  }

  const provider = sanitizeEntityPatch(value.provider);
  if (provider) patch.provider = provider;
  const customer = sanitizeEntityPatch(value.customer);
  if (customer) patch.customer = customer;

  return patch;
}

export const csaModule: DocumentModule<CsaFormPatch> = {
  id: "csa",
  buildSystemPrompt,
  sanitizePatch,
};
