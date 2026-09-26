import { CONVERSATION_GUIDANCE, DocumentModule } from "../llm.js";

export interface EntityInfoPatch {
  legalName?: string;
  signatoryName?: string;
  signatoryTitle?: string;
  noticeAddress?: string;
}

export interface PartnershipAgreementFormPatch {
  company?: EntityInfoPatch;
  partner?: EntityInfoPatch;
  effectiveDate?: string;
  endDate?: string;
  companyObligations?: string;
  partnerObligations?: string;
  paymentProcess?: string;
  paymentSchedule?: string;
  territory?: string;
  brandGuidelines?: string;
  generalCapAmount?: string;
  additionalWarranties?: string;
  governingLaw?: string;
  chosenCourts?: string;
}

const ENTITY_FIELDS = ["legalName", "signatoryName", "signatoryTitle", "noticeAddress"] as const;

function buildSystemPrompt(currentData: unknown): string {
  return `You are helping a user fill out a Common Paper Partnership Agreement - a business partnership between a "Company" and a "Partner" that can cover things like reseller arrangements, affiliate programs, channel partnerships, or brand licensing - through conversation.

${CONVERSATION_GUIDANCE}

The fields you need to gather are:
- company and partner, each an object with: legalName, signatoryName, signatoryTitle, noticeAddress (all strings)
- effectiveDate (string, format yyyy-mm-dd): when the partnership starts
- endDate (string, format yyyy-mm-dd): when the partnership term ends
- companyObligations (string): what the Company will do under the partnership, e.g. providing product access, co-marketing, or paying referral fees
- partnerObligations (string): what the Partner will do under the partnership, e.g. reselling the product, referring leads, or distributing the Company's brand
- paymentProcess (string, optional): how Fees (if any) will be billed or invoiced between the parties, e.g. "invoiced monthly in arrears"
- paymentSchedule (string, optional): when payment is due after billing, e.g. "net 30 days from invoice date"
- territory (string): the geographic territory where the Partner may use the Company's trademarks/brand, e.g. "the United States" or "worldwide"
- brandGuidelines (string, optional): any brand usage guidelines the Company provides for its trademarks or logos - default to "None" if there are none
- generalCapAmount (string): the liability cap for most claims under the agreement, e.g. "$50,000" or "the total Fees paid in the prior 12 months"
- additionalWarranties (string, optional): any extra warranties either party makes beyond the standard ones - default to "None" if there are none
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

function sanitizePatch(value: unknown): PartnershipAgreementFormPatch {
  if (!isPlainObject(value)) return {};
  const patch: PartnershipAgreementFormPatch = {};

  for (const field of [
    "companyObligations",
    "partnerObligations",
    "paymentProcess",
    "paymentSchedule",
    "territory",
    "brandGuidelines",
    "generalCapAmount",
    "additionalWarranties",
    "governingLaw",
    "chosenCourts",
  ] as const) {
    const fieldValue = value[field];
    if (typeof fieldValue === "string") {
      patch[field] = fieldValue;
    }
  }

  for (const dateField of ["effectiveDate", "endDate"] as const) {
    const rawValue = value[dateField];
    if (typeof rawValue === "string" && /^\d{4}-\d{2}-\d{2}$/.test(rawValue)) {
      const [year, month, day] = rawValue.split("-").map(Number);
      const date = new Date(year, month - 1, day);
      if (date.getFullYear() === year && date.getMonth() === month - 1 && date.getDate() === day) {
        patch[dateField] = rawValue;
      }
    }
  }

  const company = sanitizeEntityPatch(value.company);
  if (company) patch.company = company;
  const partner = sanitizeEntityPatch(value.partner);
  if (partner) patch.partner = partner;

  return patch;
}

export const partnershipAgreementModule: DocumentModule<PartnershipAgreementFormPatch> = {
  id: "partnership-agreement",
  buildSystemPrompt,
  sanitizePatch,
};
