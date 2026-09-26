import {
  ClauseDef,
  DocumentModule,
  FieldDef,
  GenericFormData,
  emptyEntity,
  entityNameText,
  fieldText,
} from "../genericDocument";

const providerName = (data: GenericFormData) => entityNameText(data, "provider", "Provider");
const customerName = (data: GenericFormData) => entityNameText(data, "customer", "Customer");

const AGREEMENT_FIELD: FieldDef = {
  key: "agreement",
  label: "Base Agreement",
  kind: "text",
  hint: "The base Cloud Service Agreement this SLA attaches to",
  inputPlaceholder: "e.g. the Cloud Service Agreement dated January 1, 2026",
};

const TARGET_UPTIME_FIELD: FieldDef = {
  key: "targetUptime",
  label: "Target Uptime",
  kind: "text",
  hint: "The minimum monthly uptime percentage Provider commits to",
  inputPlaceholder: "e.g. 99.9%",
};

const SUBSCRIPTION_PERIOD_FIELD: FieldDef = {
  key: "subscriptionPeriod",
  label: "Subscription Period",
  kind: "text",
  hint: "How long the underlying subscription lasts",
  inputPlaceholder: "e.g. 12 months from the Order Date",
};

const TARGET_RESPONSE_TIME_FIELD: FieldDef = {
  key: "targetResponseTime",
  label: "Target Response Time",
  kind: "text",
  hint: "How quickly Provider commits to acknowledge support requests",
  inputPlaceholder: "e.g. 1 business day",
};

const SUPPORT_CHANNEL_FIELD: FieldDef = {
  key: "supportChannel",
  label: "Support Channel",
  kind: "text",
  hint: "Where Customer should send support requests",
  inputPlaceholder: "e.g. support@provider.com",
};

const UPTIME_CREDIT_FIELD: FieldDef = {
  key: "uptimeCredit",
  label: "Uptime Credit",
  kind: "textarea",
  hint: "The credit Customer receives when uptime falls below the Target Uptime",
  inputPlaceholder: "e.g. 5% of that month's Cloud Service Fees for each 1% below the Target Uptime, up to 100%",
};

const RESPONSE_TIME_CREDIT_FIELD: FieldDef = {
  key: "responseTimeCredit",
  label: "Response Time Credit",
  kind: "textarea",
  hint: "The credit Customer receives when Provider misses the Target Response Time",
  inputPlaceholder: "e.g. 5% of that month's Cloud Service Fees per missed response",
};

const SCHEDULED_DOWNTIME_FIELD: FieldDef = {
  key: "scheduledDowntime",
  label: "Scheduled Downtime",
  kind: "textarea",
  hint: "Planned maintenance windows excluded from downtime calculations",
  inputPlaceholder: "e.g. up to 4 hours per month with at least 24 hours' notice",
};

const clauses: ClauseDef[] = [
  {
    number: 1,
    title: "Uptime",
    body: (d) =>
      `If there is a Target Uptime (${fieldText(d, TARGET_UPTIME_FIELD)}), ${providerName(d)} will use commercially reasonable efforts to make the Cloud Service available for at least the Target Uptime, calculated each calendar month. ${providerName(d)} and ${customerName(d)} agree to calculate availability of the Cloud Service as the total number of Available Minutes minus the number of Downtime Minutes, divided by the total number of Available Minutes, measured in a calendar month; if the Subscription Period (${fieldText(d, SUBSCRIPTION_PERIOD_FIELD)}) includes a partial month, the numerator and denominator will only include the days that are part of the Subscription Period for that month.`,
  },
  {
    number: 2,
    title: "Response Time",
    body: (d) =>
      `If there is a Target Response Time (${fieldText(d, TARGET_RESPONSE_TIME_FIELD)}), ${providerName(d)} will use commercially reasonable efforts to respond to support requests sent to the Support Channel (${fieldText(d, SUPPORT_CHANNEL_FIELD)}) within the Target Response Time. ${providerName(d)} and ${customerName(d)} agree to calculate ${providerName(d)}'s response time as the total time between when ${customerName(d)} submits a support request to the Support Channel and when ${providerName(d)} or ${providerName(d)}'s support representative specifically acknowledges the request; an automated response is not a specific acknowledgement for purposes of this SLA.`,
  },
  {
    number: 3,
    title: "Remedies",
    body: (d) =>
      `If there is a Target Uptime and Cloud Service availability falls below it, ${customerName(d)} is eligible to receive an Uptime Credit (${fieldText(d, UPTIME_CREDIT_FIELD)}); if there is a Target Response Time and neither ${providerName(d)} nor ${providerName(d)}'s support representative acknowledges a support request sent to the Support Channel within it, ${customerName(d)} is eligible to receive a Response Time Credit (${fieldText(d, RESPONSE_TIME_CREDIT_FIELD)}); Service Credits apply only toward future Cloud Service Fees owed by ${customerName(d)} to ${providerName(d)}. To receive a Service Credit, ${customerName(d)} must notify ${providerName(d)} within 7 days of the end of the month in which ${customerName(d)} believes the Service Credit was earned, after which eligibility for that month expires. For an Uptime Credit, ${customerName(d)} must describe when it was unable to access the Cloud Service and, if requested, provide additional detail about its attempts to access it; if ${providerName(d)} can verify the unavailability in its internal monitoring systems and the disruption does not qualify as Excluded Minutes or Scheduled Downtime (${fieldText(d, SCHEDULED_DOWNTIME_FIELD)}), ${providerName(d)} will calculate and issue the applicable Uptime Credit to ${customerName(d)}'s account to apply toward a future invoice. For a Response Time Credit, ${customerName(d)} must describe when and how it contacted ${providerName(d)} and, if requested, provide additional detail about the incident and its attempts to receive support; if ${providerName(d)} can verify that neither it nor its support representative responded within the Target Response Time, ${providerName(d)} will calculate and issue the applicable Response Time Credit on the same basis. Service Credits may not be exchanged for or converted into monetary amounts, do not earn interest, will not accumulate within a single Subscription Period in an amount more than 8% of Cloud Service Fees for that Subscription Period, and expire when the applicable Order Form ends. If the Cloud Service does not meet the Target Uptime for two out of any three consecutive months and ${customerName(d)} notified ${providerName(d)} of the failures within 7 days of the end of each impacted month, ${customerName(d)} may immediately terminate the affected Order Form by giving written notice to ${providerName(d)}, and ${providerName(d)} will pay ${customerName(d)} a prorated refund of prepaid fees for the remainder of the Subscription Period. This SLA describes ${customerName(d)}'s exclusive remedy and ${providerName(d)}'s entire liability for any failure of the Cloud Service to meet the Target Uptime and for any inability to meet the Target Response Time.`,
  },
];

export const slaModule: DocumentModule = {
  id: "sla",
  title: "Service Level Agreement (SLA)",
  pdfFilename: "SLA.pdf",
  fields: [
    AGREEMENT_FIELD,
    TARGET_UPTIME_FIELD,
    SUBSCRIPTION_PERIOD_FIELD,
    TARGET_RESPONSE_TIME_FIELD,
    SUPPORT_CHANNEL_FIELD,
    UPTIME_CREDIT_FIELD,
    RESPONSE_TIME_CREDIT_FIELD,
    SCHEDULED_DOWNTIME_FIELD,
  ],
  entities: [
    { key: "provider", roleLabel: "Provider" },
    { key: "customer", roleLabel: "Customer" },
  ],
  defaultData: () => ({
    values: {
      agreement: "",
      targetUptime: "",
      subscriptionPeriod: "",
      targetResponseTime: "",
      supportChannel: "",
      uptimeCredit: "",
      responseTimeCredit: "",
      scheduledDowntime: "",
    },
    entities: {
      provider: emptyEntity(),
      customer: emptyEntity(),
    },
  }),
  clauses,
};
