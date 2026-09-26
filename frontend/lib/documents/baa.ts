import {
  ClauseDef,
  DocumentModule,
  FieldDef,
  GenericFormData,
  emptyEntity,
  entityNameText,
  fieldText,
  fieldValue,
  formatDate,
} from "../genericDocument";

const providerName = (data: GenericFormData) => entityNameText(data, "provider", "Provider");
const companyName = (data: GenericFormData) => entityNameText(data, "company", "Company");

const BAA_EFFECTIVE_DATE_FIELD: FieldDef = {
  key: "baaEffectiveDate",
  label: "BAA Effective Date",
  kind: "date",
};

const BREACH_NOTIFICATION_PERIOD_FIELD: FieldDef = {
  key: "breachNotificationPeriod",
  label: "Breach Notification Period",
  kind: "text",
  hint: "How quickly a breach must be reported, e.g. “10 business days”",
  inputPlaceholder: "e.g. 10 business days",
};

const LIMITATIONS_FIELD: FieldDef = {
  key: "limitations",
  label: "Limitations",
  kind: "textarea",
  hint: "Any restrictions on offshoring, de-identifying, or aggregating PHI",
  fallback: "no additional restrictions",
};

const AGREEMENT_FIELD: FieldDef = {
  key: "agreement",
  label: "Base Agreement",
  kind: "text",
  hint: "The base commercial agreement this BAA attaches to",
  inputPlaceholder: "e.g. the Cloud Service Agreement dated January 1, 2026",
};

const clauses: ClauseDef[] = [
  {
    number: 1,
    title: "Business Associate Obligations",
    body: (d) =>
      `${providerName(d)} may not use or disclose PHI other than as described in this BAA, as permitted under the Privacy Rule, or as otherwise required by applicable law, and may only use or disclose PHI as reasonably necessary to provide the Services or as otherwise required by applicable law. ${providerName(d)} will maintain a privacy and information security program — including training for its workforce, policies meeting current PHI protection standards, and appointed Privacy and Security Officials as required under HIPAA — and will implement appropriate administrative, physical, and technical safeguards to protect the confidentiality, integrity, and availability of PHI, complying with its obligations under the Security Rule. ${providerName(d)} will conduct regular assessments of its compliance with the Privacy Rule and Security Rule and make a summary available to ${companyName(d)} upon reasonable request, will mitigate any known harmful effects of an unauthorized use or disclosure of PHI and promptly communicate any actions taken, and will conduct due diligence on any Subcontractor before disclosing PHI to it, first obtaining a binding written agreement requiring the Subcontractor to protect PHI under terms no less stringent than this BAA. Upon request, ${providerName(d)} will make its books, records, and policies relating to PHI available to the Secretary of HHS and, upon reasonable request, to ${companyName(d)}, and will take reasonable efforts — never more than ten business days — to support ${companyName(d)} in completing individual requests related to rights under HIPAA, including maintaining an accounting of disclosures as required under 45 CFR §164.528(a). To the extent ${providerName(d)} carries out ${companyName(d)}'s obligations under the Privacy Rule, ${providerName(d)} will comply with the Privacy Rule requirements that apply to ${companyName(d)} in the performance of those obligations.`,
  },
  {
    number: 2,
    title: "Company Obligations",
    body: (d) =>
      `${companyName(d)} will, upon request, provide ${providerName(d)} with its current notice of privacy practices and notify ${providerName(d)} in a timely manner of any changes to how ${companyName(d)} uses or discloses PHI, or any restrictions agreed upon with an individual, to the extent these impact ${providerName(d)}'s use or disclosure of PHI under this BAA. ${companyName(d)} will only use and disclose PHI to ${providerName(d)} in accordance with its obligations under HIPAA and applicable law.`,
  },
  {
    number: 3,
    title: "Data Rights & Restrictions",
    body: (d) =>
      `Except as restricted by the following Limitations (${fieldText(d, LIMITATIONS_FIELD)}), ${providerName(d)} is permitted to use and disclose PHI outside of the United States to provide the Services, to de-identify PHI, and to aggregate PHI for its own purposes.`,
  },
  {
    number: 4,
    title: "Breach Notification",
    body: (d) =>
      `${providerName(d)} will report to ${companyName(d)} within the ${fieldText(d, BREACH_NOTIFICATION_PERIOD_FIELD)} each use or disclosure of PHI not permitted under this BAA of which it becomes aware, including breaches of unsecured PHI as required by §164.410 of HIPAA and any Security Incident involving PHI, and each party will comply with its notification obligations under HIPAA regarding a Security Incident. Periodic unsuccessful attempts at unauthorized access, use, or disclosure of PHI will be deemed sufficient notice under this Section. ${providerName(d)} will reimburse ${companyName(d)} for costs reasonably associated with a Security Incident caused by ${providerName(d)} or one of its Subcontractors and will not disclose information related to a Security Incident except as required by applicable law.`,
  },
  {
    number: 5,
    title: "Term & Termination",
    body: (d) =>
      `This BAA will start on the ${formatDate(fieldValue(d, "baaEffectiveDate"))} and will continue in effect until the later of when all obligations of the parties have been met or when ${fieldText(d, AGREEMENT_FIELD)} ends or expires. Either party may terminate this BAA if the other party fails to cure a material breach within 30 days after receiving notice, and a material breach of this BAA will be deemed a material breach of ${fieldText(d, AGREEMENT_FIELD)}. Upon any expiration or termination, or earlier if directed by ${companyName(d)}, ${providerName(d)} will return or destroy, at ${companyName(d)}'s discretion and according to ${companyName(d)}'s instructions, all PHI maintained in any form, and may not retain any copies of PHI unless directed to do so by ${companyName(d)} or unless return or destruction is infeasible, in which case ${providerName(d)} will continue to comply with this BAA and limit use or disclosure of the retained PHI to those purposes that made return or destruction infeasible.`,
  },
];

export const baaModule: DocumentModule = {
  id: "baa",
  title: "Business Associate Agreement (BAA)",
  pdfFilename: "BAA.pdf",
  fields: [BAA_EFFECTIVE_DATE_FIELD, BREACH_NOTIFICATION_PERIOD_FIELD, LIMITATIONS_FIELD, AGREEMENT_FIELD],
  entities: [
    { key: "provider", roleLabel: "Provider (Business Associate)" },
    { key: "company", roleLabel: "Company (Covered Entity)" },
  ],
  defaultData: () => ({
    values: {
      baaEffectiveDate: new Date().toISOString().slice(0, 10),
      breachNotificationPeriod: "",
      limitations: "",
      agreement: "",
    },
    entities: {
      provider: emptyEntity(),
      company: emptyEntity(),
    },
  }),
  clauses,
};
