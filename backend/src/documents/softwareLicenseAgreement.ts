import { CONVERSATION_GUIDANCE, DocumentModule } from "../llm.js";

export interface EntityInfoPatch {
  legalName?: string;
  signatoryName?: string;
  signatoryTitle?: string;
  noticeAddress?: string;
}

export interface SoftwareLicenseAgreementFormPatch {
  provider?: EntityInfoPatch;
  customer?: EntityInfoPatch;
  effectiveDate?: string;
  orderDate?: string;
  subscriptionPeriod?: string;
  nonRenewalNoticeDate?: string;
  permittedUses?: string;
  licenseLimits?: string;
  paymentProcess?: string;
  warrantyPeriod?: string;
  additionalWarranties?: string;
  generalCapAmount?: string;
  deletionProcedure?: string;
  governingLaw?: string;
  chosenCourts?: string;
}

const ENTITY_FIELDS = ["legalName", "signatoryName", "signatoryTitle", "noticeAddress"] as const;

const STRING_FIELDS = [
  "subscriptionPeriod",
  "nonRenewalNoticeDate",
  "permittedUses",
  "licenseLimits",
  "paymentProcess",
  "warrantyPeriod",
  "additionalWarranties",
  "generalCapAmount",
  "deletionProcedure",
  "governingLaw",
  "chosenCourts",
] as const;

const DATE_FIELDS = ["effectiveDate", "orderDate"] as const;

function buildSystemPrompt(currentData: unknown): string {
  return `You are helping a user fill out a Common Paper Software License Agreement - a license between a "Provider" (the company licensing its software) and a "Customer" (the company using it) - through conversation.

${CONVERSATION_GUIDANCE}

The fields you need to gather are:
- provider and customer, each an object with: legalName, signatoryName, signatoryTitle, noticeAddress (all strings) - "provider" licenses the Software, "customer" installs and uses it
- effectiveDate (string, format yyyy-mm-dd): when the Framework Terms (the overall relationship) starts
- orderDate (string, format yyyy-mm-dd): when this specific Order Form starts
- subscriptionPeriod (string): how long the license/subscription runs before it renews, e.g. "12 months"
- nonRenewalNoticeDate (string): how far before the end of the Subscription Period either party must give notice not to renew, e.g. "30 days before the end of the Subscription Period"
- permittedUses (string): what the customer is licensed to use the Software for, e.g. "internal business operations only"
- licenseLimits (string, optional): any limits on the license such as number of users, seats, or environments - default to "no additional limits beyond the Documentation" if the user has none
- paymentProcess (string): how and when Fees are invoiced or charged, e.g. "invoiced annually in advance, due net 30"
- warrantyPeriod (string): how long the provider warrants the Software will conform to the Documentation, e.g. "90 days from installation"
- additionalWarranties (string, optional): any extra warranties either party makes beyond the standard ones - default to "no additional warranties beyond those stated in this Agreement" if none
- generalCapAmount (string): the liability cap for most claims, e.g. "the Fees paid in the 12 months before the claim"
- deletionProcedure (string, optional): how the customer must delete/uninstall the Software after termination - default to "Provider's standard process for uninstalling and deleting the Software" if unspecified
- governingLaw (string): the state/jurisdiction whose law governs the agreement, e.g. "Delaware"
- chosenCourts (string): the courts where disputes will be brought, e.g. "New Castle, DE"

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

function sanitizePatch(value: unknown): SoftwareLicenseAgreementFormPatch {
  if (!isPlainObject(value)) return {};
  const patch: SoftwareLicenseAgreementFormPatch = {};

  for (const field of STRING_FIELDS) {
    const fieldValue = value[field];
    if (typeof fieldValue === "string") {
      patch[field] = fieldValue;
    }
  }

  for (const field of DATE_FIELDS) {
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

export const softwareLicenseAgreementModule: DocumentModule<SoftwareLicenseAgreementFormPatch> = {
  id: "software-license-agreement",
  buildSystemPrompt,
  sanitizePatch,
};
