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
const customerName = (data: GenericFormData) => entityNameText(data, "customer", "Customer");

const EFFECTIVE_DATE_FIELD: FieldDef = {
  key: "effectiveDate",
  label: "Effective Date",
  kind: "date",
};

const PILOT_PERIOD_FIELD: FieldDef = {
  key: "pilotPeriod",
  label: "Pilot Period",
  kind: "text",
  hint: "How long the pilot lasts",
  inputPlaceholder: "e.g. 30 days from the Effective Date",
};

const PRODUCT_FIELD: FieldDef = {
  key: "product",
  label: "Product",
  kind: "textarea",
  hint: "A short description of the product being piloted",
};

const GENERAL_CAP_AMOUNT_FIELD: FieldDef = {
  key: "generalCapAmount",
  label: "General Cap Amount",
  kind: "text",
  hint: "The liability cap for the pilot",
  inputPlaceholder: "e.g. $10,000",
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
    title: "Pilot Access",
    body: (d) =>
      `During the ${fieldText(d, PILOT_PERIOD_FIELD)} and subject to the terms of this Agreement, ${customerName(d)} may access and use the Product solely for its Evaluation Purposes, and if the Product contains Software, ${providerName(d)} grants ${customerName(d)} a limited, non-exclusive, non-sublicensable, non-transferable license to install and use the Software on systems it owns or controls solely for its Evaluation Purposes. ${customerName(d)} is responsible for all actions on Users' accounts and for Users' compliance with this Agreement, must protect the confidentiality of passwords and login credentials, and will promptly notify ${providerName(d)} of any suspected fraudulent activity or compromise. ${providerName(d)} may copy, display, modify, and use Customer Content only as needed to provide and maintain the Product, and ${customerName(d)} is responsible for its accuracy and content. ${customerName(d)} may, but is not required to, give ${providerName(d)} Feedback "AS IS", which ${providerName(d)} may use freely without restriction, and ${providerName(d)} may collect, analyze, and freely use aggregated Usage Data that does not identify ${customerName(d)} or Users. Except as expressly permitted, ${customerName(d)} will not reverse engineer the Product, resell or sublicense it, remove proprietary notices, create derivative works, conduct security testing against it, access unauthorized data, use it to build a competing product, use it for unauthorized network access, use it with High Risk Activities, or upload content it lacks rights to. ${providerName(d)} retains all right, title, and interest in the Product, and ${customerName(d)} retains all right, title, and interest in the Customer Content.`,
  },
  {
    number: 2,
    title: "Term & Termination",
    body: (d) =>
      `This Agreement will start on the ${formatDate(fieldValue(d, "effectiveDate"))} and, unless terminated earlier, will continue through the ${fieldText(d, PILOT_PERIOD_FIELD)}. Either party may terminate immediately if the other fails to cure a material breach following 30 days notice, if the other party materially breaches in a manner that cannot be cured, dissolves, makes an assignment for the benefit of creditors, or becomes subject to insolvency or bankruptcy proceedings lasting more than 60 days, or for any or no reason following 30 days notice. If the parties do not have a Definitive Agreement, upon expiration or termination ${customerName(d)} will no longer have any right to use the Product and, if it contains Software, will uninstall or delete it and certify compliance; upon ${customerName(d)}'s request, ${providerName(d)} will delete Customer Content within 60 days; and each Recipient will return or destroy the other's Confidential Information. Certain sections — including Feedback and Usage Data, Restrictions, Reservation of Rights, Effect of Termination, Representations, Disclaimer of Warranties, Limitation of Liability, Confidentiality, and General Terms — survive expiration or termination, and a Recipient may retain Confidential Information under its standard backup or record retention policies, subject to continuing confidentiality obligations.`,
  },
  {
    number: 3,
    title: "Representations",
    body: () =>
      `Each party represents to the other that it has the legal power and authority to enter into this Agreement and is duly organized, validly existing, and in good standing under the applicable laws of its jurisdiction of origin.`,
  },
  {
    number: 4,
    title: "Disclaimer of Warranties",
    body: (d) =>
      `${providerName(d)} makes no guarantees that the Product will always be safe, secure, or error-free, or that it will function without disruptions, delays, or imperfections. The Product is provided on an "AS IS" and "AS AVAILABLE" basis, and ${providerName(d)} disclaims all warranties and conditions, whether express or implied, including the implied warranties and conditions of merchantability, fitness for a particular purpose, title, and non-infringement, to the maximum extent permitted by applicable laws.`,
  },
  {
    number: 5,
    title: "Limitation of Liability",
    body: (d) =>
      `Each party's total cumulative liability for all claims arising out of or relating to this Agreement will not be more than ${fieldText(d, GENERAL_CAP_AMOUNT_FIELD)}. Except for a breach of Confidentiality, under no circumstances will either party be liable to the other for lost profits or revenues, or for consequential, special, indirect, exemplary, punitive, or incidental damages relating to this Agreement, even if informed of the possibility of such damages in advance. These limitations and waivers apply to all liability, whether in tort (including negligence), contract, breach of statutory duty, or otherwise, except to the extent prohibited by applicable laws.`,
  },
  {
    number: 6,
    title: "Confidentiality",
    body: () =>
      `Except as otherwise authorized under this Agreement, a Recipient will not use or disclose a Discloser's Confidential Information and will protect it using at least the same protections it uses for its own similar information, but no less than a reasonable standard of care. Confidential Information excludes information the Recipient already knew without confidentiality obligations, that becomes publicly available through no fault of the Recipient, that it rightfully receives from a third party without confidentiality restrictions, or that it independently develops without reference to the Confidential Information. A Recipient may disclose Confidential Information to the extent required by applicable laws, with reasonable advance notice and cooperation where legally permitted, and may disclose it to Users, employees, advisors, contractors, and representatives with a need to know, so long as they are bound by confidentiality obligations at least as protective as this Section and the Recipient remains responsible for their compliance.`,
  },
  {
    number: 7,
    title: "General Terms",
    body: (d) =>
      `This Agreement is the only agreement between the parties about its subject matter and supersedes all prior statements about it; ${providerName(d)} rejects any terms in ${customerName(d)}'s purchase order or similar documents, which may only be used for accounting or administrative purposes. Any waiver, modification, or change must be in writing and signed or electronically accepted by each party, and if any term is held invalid or unenforceable, the remaining terms remain in full force and effect. The laws of ${fieldText(d, GOVERNING_LAW_FIELD)} will govern all interpretations and disputes about this Agreement, and the parties submit to the exclusive jurisdiction of the courts in ${fieldText(d, CHOSEN_COURTS_FIELD)}. A breach of Confidentiality or violation of intellectual property rights may cause irreparable harm for which the non-breaching party may seek equitable relief, including an injunction, without the need to post a bond, and seeking one remedy does not limit a party's other rights or remedies. Neither party may assign this Agreement without the other's prior written consent, except ${providerName(d)} may assign it in connection with a merger, change of control, reorganization, or sale of substantially all its assets, and any non-permitted assignment is void. Notices must be in writing and sent to the notice address specified for each party above. ${customerName(d)} is responsible for all duties, taxes, and levies (excluding ${providerName(d)}'s income taxes) that ${providerName(d)} itemizes and includes in an invoice. The parties are independent contractors, there are no third-party beneficiaries, and neither party is liable for delay or failure to perform due to a Force Majeure Event, though this does not excuse ${customerName(d)}'s obligation to pay Fees. This Agreement may be signed in counterparts, including electronic copies.`,
  },
];

export const pilotAgreementModule: DocumentModule = {
  id: "pilot-agreement",
  title: "Pilot Agreement",
  pdfFilename: "Pilot-Agreement.pdf",
  fields: [
    EFFECTIVE_DATE_FIELD,
    PILOT_PERIOD_FIELD,
    PRODUCT_FIELD,
    GENERAL_CAP_AMOUNT_FIELD,
    GOVERNING_LAW_FIELD,
    CHOSEN_COURTS_FIELD,
  ],
  entities: [
    { key: "provider", roleLabel: "Provider" },
    { key: "customer", roleLabel: "Customer" },
  ],
  defaultData: () => ({
    values: {
      effectiveDate: new Date().toISOString().slice(0, 10),
      pilotPeriod: "",
      product: "",
      generalCapAmount: "",
      governingLaw: "",
      chosenCourts: "",
    },
    entities: {
      provider: emptyEntity(),
      customer: emptyEntity(),
    },
  }),
  clauses,
};
