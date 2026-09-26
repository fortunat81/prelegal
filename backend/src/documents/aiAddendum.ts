import { CONVERSATION_GUIDANCE, DocumentModule } from "../llm.js";

export interface EntityInfoPatch {
  legalName?: string;
  signatoryName?: string;
  signatoryTitle?: string;
  noticeAddress?: string;
}

export interface AiAddendumFormPatch {
  provider?: EntityInfoPatch;
  customer?: EntityInfoPatch;
  agreement?: string;
  trainingData?: string;
  trainingPurposes?: string;
  trainingRestrictions?: string;
  improvementRestrictions?: string;
}

const ENTITY_FIELDS = ["legalName", "signatoryName", "signatoryTitle", "noticeAddress"] as const;

function buildSystemPrompt(currentData: unknown): string {
  return `You are helping a user fill out a Common Paper AI Addendum - a short addendum that supplements a base Product agreement (such as a Cloud Service Agreement or Software License Agreement) to govern a "Provider"'s AI Services made available to a "Customer" - through conversation.

${CONVERSATION_GUIDANCE}

The fields you need to gather are:
- provider and customer, each an object with: legalName, signatoryName, signatoryTitle, noticeAddress (all strings) - "provider" makes the AI Services available, "customer" uses them
- agreement (string): a short reference to the base commercial agreement this AI Addendum attaches to, e.g. "the Cloud Service Agreement dated January 1, 2026"
- trainingData (string, optional): the data the provider may use to train its AI models, only if the parties are permitting Model Training - default to "None" if the customer isn't permitting any training
- trainingPurposes (string, optional): the purposes for which the provider may use the Training Data - only relevant if trainingData is set, default to "None" otherwise
- trainingRestrictions (string, optional): any restrictions on the provider's use of the Training Data for the Training Purposes - default to "None" if there are no restrictions
- improvementRestrictions (string, optional): any restrictions on the provider's use of Input, Output, and Training Data to otherwise maintain, develop, and improve its AI System outside of Training - default to "None" if there are no restrictions

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

function sanitizePatch(value: unknown): AiAddendumFormPatch {
  if (!isPlainObject(value)) return {};
  const patch: AiAddendumFormPatch = {};

  for (const field of [
    "agreement",
    "trainingData",
    "trainingPurposes",
    "trainingRestrictions",
    "improvementRestrictions",
  ] as const) {
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

export const aiAddendumModule: DocumentModule<AiAddendumFormPatch> = {
  id: "ai-addendum",
  buildSystemPrompt,
  sanitizePatch,
};
