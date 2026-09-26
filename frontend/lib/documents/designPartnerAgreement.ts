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
const partnerName = (data: GenericFormData) => entityNameText(data, "partner", "Partner");

const EFFECTIVE_DATE_FIELD: FieldDef = {
  key: "effectiveDate",
  label: "Effective Date",
  kind: "date",
};

const TERM_FIELD: FieldDef = {
  key: "term",
  label: "Term",
  kind: "text",
  hint: "How long Partner has early access under the Program",
  inputPlaceholder: "e.g. 12 months from the Effective Date",
};

const PROGRAM_FIELD: FieldDef = {
  key: "program",
  label: "Program",
  kind: "textarea",
  hint: "A short description of the design partner program - the feedback schedule, cadence, or scope",
  inputPlaceholder: "e.g. monthly feedback calls and a quarterly product review",
};

const FEES_FIELD: FieldDef = {
  key: "fees",
  label: "Fees",
  kind: "text",
  hint: "Any fees Partner pays to participate in the Program",
  fallback: "$0",
};

const GOVERNING_LAW_FIELD: FieldDef = {
  key: "governingLaw",
  label: "Governing Law",
  kind: "text",
  hint: "State",
  inputPlaceholder: "e.g. Delaware",
};

const CHOSEN_COURTS_FIELD: FieldDef = {
  key: "chosenCourts",
  label: "Chosen Courts",
  kind: "text",
  hint: "City or county and state",
  inputPlaceholder: "e.g. New Castle, DE",
};

const clauses: ClauseDef[] = [
  {
    number: 1,
    title: "Design Partner Overview",
    body: (d) =>
      `${partnerName(d)} would like to be one of the first users of the Product. During the ${fieldText(d, TERM_FIELD)}, ${partnerName(d)} will have early access to the Product for its internal business purposes and to give Feedback to ${providerName(d)} and participate in the Program (${fieldText(d, PROGRAM_FIELD)}), so long as ${partnerName(d)} complies with the terms of this Agreement. The purpose of the Program is for ${providerName(d)} to develop, build, and improve the Product for general use by all of ${providerName(d)}'s customers or users, and ${partnerName(d)} will give Feedback to ${providerName(d)} on a mutually agreed schedule and will participate in the Program. ${providerName(d)} will develop and improve the Product and may use all Feedback and insight about the Product from the Program freely without any restriction or obligation, and ${partnerName(d)} will not give any Feedback that ${providerName(d)} cannot use in this manner or for this purpose.`,
  },
  {
    number: 2,
    title: "Fees and Costs",
    body: (d) => `${partnerName(d)} will pay ${providerName(d)} the Fees, if any (${fieldText(d, FEES_FIELD)}).`,
  },
  {
    number: 3,
    title: "Term & Termination",
    body: (d) =>
      `This Agreement will start on the ${formatDate(fieldValue(d, "effectiveDate"))} and continue for the ${fieldText(d, TERM_FIELD)}; ${providerName(d)} and ${partnerName(d)} may mutually agree to extend the Term, including by email communication. Either party may terminate this Agreement for any or no reason by giving the other party 30 days advance notice. Upon expiration or termination, ${partnerName(d)} will no longer have any right to access or use the Product or be required to provide Feedback or participate in the Program, and each Recipient will return or destroy the Discloser's Confidential Information in its possession or control, though a Recipient may retain Confidential Information in accordance with its standard backup or record retention policies maintained in the ordinary course of business or as required by Applicable Laws, in which case Confidentiality will continue to apply to the retained Confidential Information. Sections 1.3 (Product Improvement), 3.3 (Effect of Termination), 3.4 (Survival), 4 (Disclaimer of Warranties), 5 (Confidentiality), 6 (Intellectual Property), 7 (General Terms), and 8 (Definitions), along with the portions of a Cover Page referenced by these sections, will survive expiration or termination of the Agreement.`,
  },
  {
    number: 4,
    title: "Disclaimer of Warranties",
    body: (d) =>
      `${providerName(d)} and ${partnerName(d)} each disclaim all warranties, whether express or implied, including the implied warranties of merchantability, fitness for a particular purpose, title, and non-infringement, to the maximum extent permitted by Applicable Laws.`,
  },
  {
    number: 5,
    title: "Confidentiality",
    body: (d) =>
      `Unless otherwise authorized under this Agreement, a Recipient will only use a Discloser's Confidential Information to fulfill its obligations or exercise its rights under this Agreement, will not disclose it to anyone else, and will protect it using at least the same protections it uses for its own similar information, but no less than a reasonable standard of care. Confidential Information excludes information the Recipient already knew without any confidentiality obligation, that is or becomes publicly available through no fault of the Recipient, that the Recipient receives without a confidentiality obligation from someone else authorized to disclose it, or that the Recipient independently developed without use of or reference to the Discloser's Confidential Information; Feedback does not constitute ${partnerName(d)}'s Confidential Information, and ${providerName(d)} may use ${partnerName(d)}'s Confidential Information to provide the Product. A Recipient may disclose Confidential Information to the extent required by Applicable Laws, provided that, unless prohibited, it gives the Discloser reasonable advance notice and reasonably cooperates, at the Discloser's expense, with efforts to obtain confidential treatment, and may disclose Confidential Information to Users, employees, advisors, contractors, and representatives with a need to know, so long as they are bound by confidentiality obligations at least as protective as this Section and the Recipient remains responsible for their compliance.`,
  },
  {
    number: 6,
    title: "Intellectual Property",
    body: (d) =>
      `Except for the limited license to access the Product granted under Product Access, ${providerName(d)} retains all right, title, and interest in and to the Product, including any aspects, features, or functionality created in response to Feedback or ${partnerName(d)}'s participation in the Program, whether developed before or after the ${formatDate(fieldValue(d, "effectiveDate"))}; each Discloser retains all right, title, and interest in and to its Confidential Information. ${providerName(d)} owns all Feedback, and ${partnerName(d)} hereby assigns to ${providerName(d)} all its right, title, and interest in and to Feedback and will reasonably cooperate with ${providerName(d)} as needed to establish, prove, or defend ${providerName(d)}'s ownership of Feedback.`,
  },
  {
    number: 7,
    title: "General Terms",
    body: (d) =>
      `This Agreement is the only agreement between the parties about its subject and supersedes all prior or contemporaneous statements, whether written or not, about its subject. Any waiver, modification, or change must be in writing and signed or electronically accepted by each party; if any term is determined invalid or unenforceable, the remaining terms will remain in full force and effect, and a party's failure to enforce a term or exercise a right will not be a waiver of it. The laws of ${fieldText(d, GOVERNING_LAW_FIELD)} will govern all interpretations and disputes about this Agreement, without regard to its conflict of laws provisions, and the parties will bring any suit, action, or proceeding about this Agreement in ${fieldText(d, CHOSEN_COURTS_FIELD)}, to whose exclusive jurisdiction each party irrevocably submits. Despite that choice of Governing Law and Chosen Courts, a breach of Confidentiality or violation of a party's intellectual property rights may cause irreparable harm for which monetary damages cannot adequately compensate, so the non-breaching or non-violating party may seek appropriate equitable relief, including an injunction, in any court of competent jurisdiction without posting a bond and without limiting its other rights or remedies; except where this Agreement provides an exclusive remedy, seeking or exercising a remedy does not limit a party's other rights or remedies. Except as expressly permitted, ${partnerName(d)} will not (and will not allow anyone else to) reverse engineer or decompile the Product or attempt to discover its source code or underlying ideas or algorithms, except to the extent Applicable Laws prohibit this restriction; provide, sell, transfer, sublicense, lend, distribute, rent, or otherwise allow others to access or use the Product; remove proprietary notices; copy, modify, or create derivative works of the Product; conduct security or vulnerability testing on it or interfere with or degrade its operation or circumvent its access restrictions; access accounts, data, or portions of the Product it is not authorized to access; use the Product to develop a competing product; use the Product in violation of Applicable Laws or to gain unauthorized access to others' networks or equipment; or upload content to the Product that it lacks the rights to. Neither party may assign this Agreement without the other's prior written consent, except either party may assign it upon notice in connection with a merger, change of control, reorganization, or sale of all or substantially all its equity, business, or assets to which this Agreement relates, and this Agreement binds and benefits the parties and their permitted successors and assigns. Notices must be in writing and sent to the notice address specified for each party above, and will be deemed given upon confirmed delivery if by email, registered or certified mail, or personal delivery, or two days after mailing if by overnight commercial delivery. The parties are independent contractors, not agents, partners, or joint venturers, and neither may bind the other to any liability or obligation; there are no third-party beneficiaries of this Agreement. Section titles are for convenience only, "including" and similar phrases are non-exhaustive, and the United Nations Convention for the International Sale of Goods and the Uniform Computer Information Transaction Act do not apply. This Agreement may be signed in counterparts, including by electronic copies or acceptance mechanism, each deemed an original and together the same agreement.`,
  },
];

export const designPartnerAgreementModule: DocumentModule = {
  id: "design-partner-agreement",
  title: "Design Partner Agreement",
  pdfFilename: "Design-Partner-Agreement.pdf",
  fields: [EFFECTIVE_DATE_FIELD, TERM_FIELD, PROGRAM_FIELD, FEES_FIELD, GOVERNING_LAW_FIELD, CHOSEN_COURTS_FIELD],
  entities: [
    { key: "provider", roleLabel: "Provider" },
    { key: "partner", roleLabel: "Partner" },
  ],
  defaultData: () => ({
    values: {
      effectiveDate: new Date().toISOString().slice(0, 10),
      term: "",
      program: "",
      fees: "",
      governingLaw: "",
      chosenCourts: "",
    },
    entities: {
      provider: emptyEntity(),
      partner: emptyEntity(),
    },
  }),
  clauses,
};
