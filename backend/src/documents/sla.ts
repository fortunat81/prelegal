import { CONVERSATION_GUIDANCE, DocumentModule } from "../llm.js";

export interface EntityInfoPatch {
  legalName?: string;
  signatoryName?: string;
  signatoryTitle?: string;
  noticeAddress?: string;
}

export interface SlaFormPatch {
  provider?: EntityInfoPatch;
  customer?: EntityInfoPatch;
  agreement?: string;
  targetUptime?: string;
  subscriptionPeriod?: string;
  targetResponseTime?: string;
  supportChannel?: string;
  uptimeCredit?: string;
  responseTimeCredit?: string;
  scheduledDowntime?: string;
}

const ENTITY_FIELDS = ["legalName", "signatoryName", "signatoryTitle", "noticeAddress"] as const;

const STRING_FIELDS = [
  "agreement",
  "targetUptime",
  "subscriptionPeriod",
  "targetResponseTime",
  "supportChannel",
  "uptimeCredit",
  "responseTimeCredit",
  "scheduledDowntime",
] as const;

function buildSystemPrompt(currentData: unknown): string {
  return `You are helping a user fill out a Common Paper Service Level Agreement (SLA) - an addendum that attaches to a base Cloud Service Agreement and sets uptime and support response commitments between a "Provider" and a "Customer" - through conversation.

${CONVERSATION_GUIDANCE}

The fields you need to gather are:
- provider and customer, each an object with: legalName, signatoryName, signatoryTitle, noticeAddress (all strings)
- agreement (string): a short reference to the base Cloud Service Agreement this SLA attaches to, e.g. "the Cloud Service Agreement dated January 1, 2026"
- targetUptime (string): the minimum monthly uptime percentage Provider commits to, e.g. "99.9%"
- subscriptionPeriod (string): how long the underlying subscription lasts, e.g. "12 months from the Order Date"
- targetResponseTime (string): how quickly Provider commits to acknowledge support requests, e.g. "1 business day"
- supportChannel (string): where Customer should send support requests, e.g. "support@provider.com"
- uptimeCredit (string): the credit Customer receives when uptime falls below the Target Uptime, e.g. "5% of that month's Cloud Service Fees for each 1% below the Target Uptime, up to 100%"
- responseTimeCredit (string): the credit Customer receives when Provider misses the Target Response Time, e.g. "5% of that month's Cloud Service Fees per missed response"
- scheduledDowntime (string): planned maintenance windows excluded from downtime calculations, e.g. "up to 4 hours per month with at least 24 hours' notice"

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

function sanitizePatch(value: unknown): SlaFormPatch {
  if (!isPlainObject(value)) return {};
  const patch: SlaFormPatch = {};

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

export const slaModule: DocumentModule<SlaFormPatch> = {
  id: "sla",
  buildSystemPrompt,
  sanitizePatch,
};
