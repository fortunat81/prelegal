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
  hint: "The base commercial agreement this DPA attaches to",
  inputPlaceholder: "e.g. the Cloud Service Agreement dated January 1, 2026",
};

const CATEGORIES_OF_PERSONAL_DATA_FIELD: FieldDef = {
  key: "categoriesOfPersonalData",
  label: "Categories of Personal Data",
  kind: "textarea",
  hint: "The types of personal data Provider will process on Customer's behalf",
  inputPlaceholder: "e.g. names, email addresses, IP addresses",
};

const CATEGORIES_OF_DATA_SUBJECTS_FIELD: FieldDef = {
  key: "categoriesOfDataSubjects",
  label: "Categories of Data Subjects",
  kind: "textarea",
  hint: "The individuals whose personal data will be processed",
  inputPlaceholder: "e.g. Customer's employees and end users",
};

const SPECIAL_CATEGORY_DATA_RESTRICTIONS_FIELD: FieldDef = {
  key: "specialCategoryDataRestrictions",
  label: "Special Category Data Restrictions or Safeguards",
  kind: "textarea",
  hint: "Any restrictions or safeguards for Special Category Data (sensitive data under GDPR Article 9)",
  fallback: "no additional restrictions or safeguards",
};

const FREQUENCY_OF_TRANSFER_FIELD: FieldDef = {
  key: "frequencyOfTransfer",
  label: "Frequency of Transfer",
  kind: "text",
  hint: "How often Customer Personal Data is transferred to Provider",
  inputPlaceholder: "e.g. continuous, as needed to provide the Service",
};

const NATURE_AND_PURPOSE_OF_PROCESSING_FIELD: FieldDef = {
  key: "natureAndPurposeOfProcessing",
  label: "Nature and Purpose of Processing",
  kind: "textarea",
  hint: "Why Provider processes Customer Personal Data",
  inputPlaceholder: "e.g. to provide and support the Service",
};

const DURATION_OF_PROCESSING_FIELD: FieldDef = {
  key: "durationOfProcessing",
  label: "Duration of Processing",
  kind: "text",
  hint: "How long Provider will process Customer Personal Data",
  inputPlaceholder: "e.g. for the term of the Agreement plus 60 days",
};

const APPROVED_SUBPROCESSORS_FIELD: FieldDef = {
  key: "approvedSubprocessors",
  label: "Approved Subprocessors",
  kind: "textarea",
  hint: "Where Customer can find Provider's current list of approved Subprocessors",
  inputPlaceholder: "e.g. available at provider.com/subprocessors",
};

const GOVERNING_MEMBER_STATE_FIELD: FieldDef = {
  key: "governingMemberState",
  label: "Governing Member State",
  kind: "text",
  hint: "The EEA member state whose laws govern the EEA Standard Contractual Clauses (relevant only to EEA transfers)",
  inputPlaceholder: "e.g. Ireland",
};

const SECURITY_POLICY_FIELD: FieldDef = {
  key: "securityPolicy",
  label: "Security Policy",
  kind: "textarea",
  hint: "Where Customer can find Provider's information security policy or standards",
  inputPlaceholder: "e.g. available at provider.com/security, or SOC 2 Type II",
};

const PROVIDER_SECURITY_CONTACT_FIELD: FieldDef = {
  key: "providerSecurityContact",
  label: "Provider Security Contact",
  kind: "text",
  hint: "Who Customer should contact with security due-diligence questions",
  inputPlaceholder: "e.g. security@provider.com",
};

const clauses: ClauseDef[] = [
  {
    number: 1,
    title: "Processor and Subprocessor Relationships",
    body: (d) =>
      `Where ${customerName(d)} is a Controller of the Customer Personal Data, ${providerName(d)} will be deemed a Processor that is Processing Personal Data on behalf of ${customerName(d)}. Where ${customerName(d)} is a Processor of the Customer Personal Data, ${providerName(d)} will be deemed a Subprocessor of the Customer Personal Data.`,
  },
  {
    number: 2,
    title: "Processing",
    body: (d) =>
      `The Cover Page to this DPA describes the nature and purpose of this Processing (${fieldText(d, NATURE_AND_PURPOSE_OF_PROCESSING_FIELD)}), its duration (${fieldText(d, DURATION_OF_PROCESSING_FIELD)}), the frequency of transfer (${fieldText(d, FREQUENCY_OF_TRANSFER_FIELD)}), the categories of personal data collected (${fieldText(d, CATEGORIES_OF_PERSONAL_DATA_FIELD)}), the categories of data subjects (${fieldText(d, CATEGORIES_OF_DATA_SUBJECTS_FIELD)}), and any restrictions or safeguards on Special Category Data (${fieldText(d, SPECIAL_CATEGORY_DATA_RESTRICTIONS_FIELD)}). ${customerName(d)} instructs ${providerName(d)} to Process Customer Personal Data to provide and maintain the Service, as further specified through ${customerName(d)}'s use of the Service, as documented in ${fieldText(d, AGREEMENT_FIELD)}, and as documented in any other written instructions ${customerName(d)} gives and ${providerName(d)} acknowledges; ${providerName(d)} will abide by these instructions unless prohibited by Applicable Laws and will immediately inform ${customerName(d)} if it is unable to follow them, and ${customerName(d)} has given and will only give instructions that comply with Applicable Laws. ${providerName(d)} will only Process Customer Personal Data in accordance with this DPA, and may update the categories, restrictions, frequency, nature, purpose, or duration described above as needed to reflect new or updated products, features, or functionality, after notifying ${customerName(d)} of the change. Where ${customerName(d)} is a Processor and ${providerName(d)} is a Subprocessor, ${customerName(d)} will comply with all Applicable Laws that apply to its own Processing of Customer Personal Data, including the Subprocessor requirements in its agreement with its own Controller, and ${customerName(d)} has complied and will continue to comply with all Applicable Data Protection Laws concerning its provision of Customer Personal Data to ${providerName(d)}, including obtaining all necessary consents and implementing relevant safeguards. ${providerName(d)} will not disclose Customer Personal Data to a Subprocessor unless ${customerName(d)} has approved it; the current list of Approved Subprocessors is ${fieldText(d, APPROVED_SUBPROCESSORS_FIELD)}, and ${providerName(d)} will give at least 10 business days' written notice before adding or replacing a Subprocessor, giving ${customerName(d)} the chance to object within 30 days, after which the parties will cooperate in good faith to resolve the objection, or the change will be deemed accepted. ${providerName(d)} will have a written agreement with each Subprocessor limiting its access to Customer Personal Data to what is needed to perform its subcontracted obligations and consistent with ${fieldText(d, AGREEMENT_FIELD)}, and where the GDPR applies, that agreement will impose the same data protection obligations that apply to ${providerName(d)} under this DPA and address how the parties will coordinate on inquiries about the Processing; ${providerName(d)} will share a copy of its Subprocessor agreements with ${customerName(d)} on request, redacting confidential or personal information as needed. ${providerName(d)} remains fully liable for its Subprocessors' acts and omissions and will notify ${customerName(d)} of any Subprocessor's failure to fulfill a material obligation regarding Customer Personal Data.`,
  },
  {
    number: 3,
    title: "Restricted Transfers",
    body: (d) =>
      `${customerName(d)} agrees that ${providerName(d)} may transfer Customer Personal Data outside the EEA, the United Kingdom, or other relevant territory as necessary to provide the Service, and where the destination territory lacks an adequacy decision from the European Commission or other relevant supervisory authority, ${providerName(d)} will implement appropriate safeguards for the transfer consistent with Applicable Data Protection Laws. If the GDPR protects a transfer of Customer Personal Data from ${customerName(d)} within the EEA to ${providerName(d)} outside the EEA that is not covered by an adequacy decision, the parties are deemed to have signed the EEA Standard Contractual Clauses (EEA SCCs) and their Annexes by entering into this DPA, using Module Two (Controller to Processor) where ${customerName(d)} is a Controller and Module Three (Processor to Sub-Processor) where ${customerName(d)} is a Processor; the optional docking clause in Clause 7 does not apply, Clause 9 uses Option 2 (general written authorization) with a minimum of 10 business days' prior notice of Subprocessor changes, the optional language in Clause 11 does not apply, all square brackets in Clause 13 are removed, and the EEA SCCs are governed by the laws of, and disputes are resolved in the courts of, ${fieldText(d, GOVERNING_MEMBER_STATE_FIELD)} under Clauses 17 and 18(b), with the Cover Page supplying the information required by Annex I, II, and III of the EEA SCCs. If the UK GDPR similarly protects a transfer from ${customerName(d)} within the United Kingdom to ${providerName(d)} outside the United Kingdom that is not covered by a UK adequacy decision, the parties are deemed to have signed the UK Addendum and its Annexes by entering into this DPA; neither party may end the UK Addendum under its Section 19, the parties will cooperate in good faith if the ICO issues a revised Approved Addendum, and the Cover Page and this DPA supply the information required by Table 2 and Annexes 1A, 1B, II, and III of the UK Addendum. For transfers governed by Swiss law rather than the law of an EEA member state or the United Kingdom, references to the GDPR in Clause 4 of the EEA SCCs are read as referring to the Swiss Federal Data Protection Act, and the Swiss Federal Data Protection and Information Commissioner is treated as a supervisory authority.`,
  },
  {
    number: 4,
    title: "Security Incident Response",
    body: (d) =>
      `Upon becoming aware of a Security Incident, ${providerName(d)} will notify ${customerName(d)} without undue delay and no later than 72 hours after becoming aware, provide timely information about the incident as it becomes known or as reasonably requested, and promptly take reasonable steps to contain and investigate it. ${providerName(d)}'s notification of or response to a Security Incident will not be construed as an admission of fault or liability for it.`,
  },
  {
    number: 5,
    title: "Audit & Reports",
    body: (d) =>
      `${providerName(d)} will give ${customerName(d)} the information reasonably necessary to demonstrate compliance with this DPA and will allow for and contribute to audits, including inspections by ${customerName(d)}, to assess that compliance, though ${providerName(d)} may restrict access to information that would harm its intellectual property, confidentiality, or other legal obligations; ${customerName(d)} agrees to exercise its audit rights only by instructing ${providerName(d)} to comply with the reporting and due diligence requirements described here, and ${providerName(d)} will keep records of its compliance for 3 years after this DPA ends. ${providerName(d)} is regularly audited against the standards described in its Security Policy (${fieldText(d, SECURITY_POLICY_FIELD)}) by independent third-party auditors and will, on written request, give ${customerName(d)} a confidential summary copy of its current audit report so ${customerName(d)} can verify compliance with those standards. ${providerName(d)} will also respond to reasonable written information-security, due-diligence, and audit questionnaires sent to ${fieldText(d, PROVIDER_SECURITY_CONTACT_FIELD)}, no more than once a year.`,
  },
  {
    number: 6,
    title: "Coordination & Cooperation",
    body: (d) =>
      `If ${providerName(d)} receives an inquiry or request from anyone else about the Processing of Customer Personal Data - such as a judicial, administrative, or regulatory order, or a data subject request - ${providerName(d)} will notify ${customerName(d)} and will not respond without ${customerName(d)}'s prior consent unless Applicable Law prohibits notifying ${customerName(d)}, and will otherwise follow ${customerName(d)}'s reasonable instructions, including providing status updates. If a data subject makes a valid request to delete or opt out of ${customerName(d)}'s provision of Customer Personal Data to ${providerName(d)}, ${providerName(d)} will assist ${customerName(d)} in fulfilling it, and will cooperate with and provide reasonable assistance to ${customerName(d)}, at ${customerName(d)}'s expense, in any legal or procedural response to a third-party request about ${providerName(d)}'s Processing. Where required by Applicable Data Protection Laws, ${providerName(d)} will also reasonably assist ${customerName(d)} with data protection impact assessments, data transfer impact assessments, and consultations with data protection authorities.`,
  },
  {
    number: 7,
    title: "Deletion of Customer Personal Data",
    body: (d) =>
      `${providerName(d)} will enable ${customerName(d)} to delete Customer Personal Data consistent with the functionality of the Service and will comply with such a deletion instruction as soon as reasonably practicable, except where further storage is required by Applicable Law. After this DPA expires, ${providerName(d)} will return or delete Customer Personal Data at ${customerName(d)}'s instruction unless further storage is required or authorized by Applicable Law; if return or deletion is impracticable or prohibited, ${providerName(d)} will make reasonable efforts to prevent further Processing and will continue to protect any Customer Personal Data it retains. If the parties have entered the EEA SCCs or the UK Addendum as part of this DPA, ${providerName(d)} will provide the certification of deletion described in those instruments only if ${customerName(d)} asks for one.`,
  },
  {
    number: 8,
    title: "Limitation of Liability",
    body: (d) =>
      `Each party's total cumulative liability arising out of or related to this DPA is subject to the waivers, exclusions, and limitations of liability stated in ${fieldText(d, AGREEMENT_FIELD)}, to the maximum extent permitted under Applicable Data Protection Laws, and any claim against ${providerName(d)} or its Affiliates arising out of or related to this DPA may only be brought by the ${customerName(d)} entity that is a party to ${fieldText(d, AGREEMENT_FIELD)}. Nothing in this DPA limits any liability to an individual for their data protection rights under Applicable Data Protection Laws, or any liability between the parties for violations of the EEA SCCs or UK Addendum.`,
  },
  {
    number: 9,
    title: "Conflicts Between Documents",
    body: (d) =>
      `This DPA forms part of and supplements ${fieldText(d, AGREEMENT_FIELD)}. If this DPA, ${fieldText(d, AGREEMENT_FIELD)}, or any of their parts conflict, the following order of precedence controls, from highest to lowest: the EEA SCCs or the UK Addendum, then this DPA, and then ${fieldText(d, AGREEMENT_FIELD)}.`,
  },
  {
    number: 10,
    title: "Term of Agreement",
    body: (d) =>
      `This DPA starts when ${providerName(d)} and ${customerName(d)} agree to a Cover Page for it and sign or electronically accept ${fieldText(d, AGREEMENT_FIELD)}, and continues until ${fieldText(d, AGREEMENT_FIELD)} expires or is terminated. Even so, each party remains subject to its obligations under this DPA and Applicable Data Protection Laws until ${customerName(d)} stops transferring Customer Personal Data to ${providerName(d)} and ${providerName(d)} stops Processing it.`,
  },
];

export const dpaModule: DocumentModule = {
  id: "dpa",
  title: "Data Processing Agreement (DPA)",
  pdfFilename: "DPA.pdf",
  fields: [
    AGREEMENT_FIELD,
    CATEGORIES_OF_PERSONAL_DATA_FIELD,
    CATEGORIES_OF_DATA_SUBJECTS_FIELD,
    SPECIAL_CATEGORY_DATA_RESTRICTIONS_FIELD,
    FREQUENCY_OF_TRANSFER_FIELD,
    NATURE_AND_PURPOSE_OF_PROCESSING_FIELD,
    DURATION_OF_PROCESSING_FIELD,
    APPROVED_SUBPROCESSORS_FIELD,
    GOVERNING_MEMBER_STATE_FIELD,
    SECURITY_POLICY_FIELD,
    PROVIDER_SECURITY_CONTACT_FIELD,
  ],
  entities: [
    { key: "provider", roleLabel: "Provider" },
    { key: "customer", roleLabel: "Customer" },
  ],
  defaultData: () => ({
    values: {
      agreement: "",
      categoriesOfPersonalData: "",
      categoriesOfDataSubjects: "",
      specialCategoryDataRestrictions: "",
      frequencyOfTransfer: "",
      natureAndPurposeOfProcessing: "",
      durationOfProcessing: "",
      approvedSubprocessors: "",
      governingMemberState: "",
      securityPolicy: "",
      providerSecurityContact: "",
    },
    entities: {
      provider: emptyEntity(),
      customer: emptyEntity(),
    },
  }),
  clauses,
};
