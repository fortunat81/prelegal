import { CONVERSATION_GUIDANCE, DocumentModule } from "../llm.js";

export interface EntityInfoPatch {
  legalName?: string;
  signatoryName?: string;
  signatoryTitle?: string;
  noticeAddress?: string;
}

export interface DpaFormPatch {
  provider?: EntityInfoPatch;
  customer?: EntityInfoPatch;
  agreement?: string;
  categoriesOfPersonalData?: string;
  categoriesOfDataSubjects?: string;
  specialCategoryDataRestrictions?: string;
  frequencyOfTransfer?: string;
  natureAndPurposeOfProcessing?: string;
  durationOfProcessing?: string;
  approvedSubprocessors?: string;
  governingMemberState?: string;
  securityPolicy?: string;
  providerSecurityContact?: string;
}

const ENTITY_FIELDS = ["legalName", "signatoryName", "signatoryTitle", "noticeAddress"] as const;

const STRING_FIELDS = [
  "agreement",
  "categoriesOfPersonalData",
  "categoriesOfDataSubjects",
  "specialCategoryDataRestrictions",
  "frequencyOfTransfer",
  "natureAndPurposeOfProcessing",
  "durationOfProcessing",
  "approvedSubprocessors",
  "governingMemberState",
  "securityPolicy",
  "providerSecurityContact",
] as const;

function buildSystemPrompt(currentData: unknown): string {
  return `You are helping a user fill out a Data Processing Agreement (DPA) - a GDPR/UK GDPR data-protection document between a "Provider" (who processes personal data on the other party's behalf) and a "Customer" - through conversation.

${CONVERSATION_GUIDANCE}

The fields you need to gather are:
- provider and customer, each an object with: legalName, signatoryName, signatoryTitle, noticeAddress (all strings) - "provider" is the party Processing Customer Personal Data, "customer" is the party that owns or controls it
- agreement (string): a short reference to the base commercial agreement this DPA attaches to, e.g. "the Cloud Service Agreement dated January 1, 2026"
- categoriesOfPersonalData (string): the types of personal data Provider will process, e.g. "names, email addresses, IP addresses"
- categoriesOfDataSubjects (string): the individuals whose personal data will be processed, e.g. "Customer's employees and end users"
- specialCategoryDataRestrictions (string, optional): any restrictions or safeguards for Special Category Data (sensitive data under GDPR Article 9) - default to "None" if the user has no restrictions
- frequencyOfTransfer (string): how often Customer Personal Data is transferred to Provider, e.g. "continuous, as needed to provide the Service"
- natureAndPurposeOfProcessing (string): why Provider processes Customer Personal Data, e.g. "to provide and support the Service"
- durationOfProcessing (string): how long Provider will process Customer Personal Data, e.g. "for the term of the Agreement plus 60 days"
- approvedSubprocessors (string): where Customer can find Provider's current list of approved Subprocessors, e.g. "available at provider.com/subprocessors"
- governingMemberState (string): the EEA member state whose laws govern the EEA Standard Contractual Clauses, relevant only if the parties transfer personal data out of the EEA, e.g. "Ireland"
- securityPolicy (string): where Customer can find Provider's information security policy or standards, e.g. "available at provider.com/security" or "SOC 2 Type II"
- providerSecurityContact (string): who Customer should contact with security due-diligence questions, e.g. "security@provider.com"

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

function sanitizePatch(value: unknown): DpaFormPatch {
  if (!isPlainObject(value)) return {};
  const patch: DpaFormPatch = {};

  for (const field of STRING_FIELDS) {
    const fieldValue = value[field];
    if (typeof fieldValue === "string") {
      patch[field] = fieldValue;
    }
  }

  const provider = sanitizeEntityPatch(value.provider);
  if (provider) patch.provider = provider;
  const customer = sanitizeEntityPatch(value.customer);
  if (customer) patch.customer = customer;

  return patch;
}

export const dpaModule: DocumentModule<DpaFormPatch> = {
  id: "dpa",
  buildSystemPrompt,
  sanitizePatch,
};
