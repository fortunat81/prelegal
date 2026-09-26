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

const SOW_TERM_FIELD: FieldDef = {
  key: "sowTerm",
  label: "SOW Term",
  kind: "text",
  hint: "How long the Statement of Work/engagement runs",
  inputPlaceholder: "e.g. 12 months from the Effective Date",
};

const SERVICES_DESCRIPTION_FIELD: FieldDef = {
  key: "servicesDescription",
  label: "Services / Deliverables",
  kind: "textarea",
  hint: "What Provider will do and/or deliver under the SOW",
};

const FEES_FIELD: FieldDef = {
  key: "fees",
  label: "Fees",
  kind: "text",
  hint: "How Provider is compensated",
  inputPlaceholder: "e.g. $150/hour, billed monthly",
};

const PAYMENT_PERIOD_FIELD: FieldDef = {
  key: "paymentPeriod",
  label: "Payment Period",
  kind: "text",
  hint: "How long Customer has to pay an invoice",
  inputPlaceholder: "e.g. 30 days from invoice date",
};

const REJECTION_PERIOD_FIELD: FieldDef = {
  key: "rejectionPeriod",
  label: "Rejection Period",
  kind: "text",
  hint: "How long Customer has to reject a Deliverable",
  inputPlaceholder: "e.g. 10 business days",
};

const RESUBMISSION_PERIOD_FIELD: FieldDef = {
  key: "resubmissionPeriod",
  label: "Resubmission Period",
  kind: "text",
  hint: "How long Provider has to correct and resubmit a rejected Deliverable",
  inputPlaceholder: "e.g. 10 business days",
};

const TIME_OF_ASSIGNMENT_FIELD: FieldDef = {
  key: "timeOfAssignment",
  label: "Time of Assignment",
  kind: "text",
  hint: "When ownership of Deliverables transfers to Customer",
  inputPlaceholder: "e.g. upon full payment of Fees",
};

const CUSTOMER_OBLIGATIONS_FIELD: FieldDef = {
  key: "customerObligations",
  label: "Customer Obligations",
  kind: "textarea",
  hint: "Anything Customer must provide or do to support the engagement",
  fallback: "no additional obligations beyond reasonable cooperation",
};

const GENERAL_CAP_AMOUNT_FIELD: FieldDef = {
  key: "generalCapAmount",
  label: "General Cap Amount",
  kind: "text",
  hint: "The liability cap for most claims",
  inputPlaceholder: "e.g. the Fees paid in the prior 12 months",
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
    title: "Services",
    body: (d) =>
      `${customerName(d)} or its Affiliates may enter Statements of Work (SOWs) with ${providerName(d)}, and ${providerName(d)} will perform the Services described in each applicable SOW, complying with any Customer policies furnished for that purpose. Under the applicable SOW, ${providerName(d)} will provide the following Services and Deliverables: ${fieldText(d, SERVICES_DESCRIPTION_FIELD)}. ${customerName(d)} will reasonably cooperate with ${providerName(d)} to allow performance of the Services, and ${providerName(d)} is not responsible for delays caused by ${customerName(d)}'s failure to cooperate as reasonably requested; ${providerName(d)} will supply its own equipment and tools. Either party may propose a Change Order to amend an SOW, and the other party will consider it in good faith and respond within a reasonable time, though no Change Order binds the parties until both sign it in writing. Where an SOW makes Deliverables subject to acceptance, ${customerName(d)} will be deemed to have accepted a Deliverable unless it rejects the Deliverable within the ${fieldText(d, REJECTION_PERIOD_FIELD)}; if ${customerName(d)} rejects a Deliverable, it must describe in writing why the Deliverable fell short, and ${providerName(d)} will correct the issue and resubmit it within the ${fieldText(d, RESUBMISSION_PERIOD_FIELD)}. ${providerName(d)} may use Subcontractors to perform the Services only with ${customerName(d)}'s prior permission (except that ${providerName(d)} may use its own Affiliates without permission), and remains responsible for its Subcontractors' acts, omissions, compliance, and payment. ${customerName(d)} will comply with any Customer Obligations set out in an SOW, which absent other agreement are ${fieldText(d, CUSTOMER_OBLIGATIONS_FIELD)}.`,
  },
  {
    number: 2,
    title: "Intellectual Property",
    body: (d) =>
      `Except for Pre-Existing Materials and Third-Party Materials, ${providerName(d)} assigns all right, title, and interest in the Deliverables to ${customerName(d)} at the ${fieldText(d, TIME_OF_ASSIGNMENT_FIELD)}, after which ${providerName(d)} will assert no further rights over them. ${providerName(d)} may copy, display, modify, and use Customer Materials only as needed to provide the Services, and ${customerName(d)} is responsible for their accuracy and content. To the extent ${providerName(d)} incorporates its own Pre-Existing Materials into a Deliverable, ${providerName(d)} grants ${customerName(d)} a non-exclusive, non-transferable, perpetual, irrevocable, worldwide license to use those Pre-Existing Materials as necessary to use the Deliverables. ${providerName(d)} may incorporate Third-Party Materials into a Deliverable only if the SOW allows it and ${customerName(d)} authorizes it in writing; each party is responsible for obtaining the rights needed for the Third-Party Materials it procures, and ${providerName(d)} will reasonably assist ${customerName(d)} with rights for ${providerName(d)}-recommended Third-Party Materials that ${customerName(d)} itself procures. ${customerName(d)} may, but need not, give ${providerName(d)} Feedback "AS IS," which ${providerName(d)} may use freely, and ${providerName(d)} may collect and use Usage Data to improve its products and services, sharing it with others only in aggregated, non-identifying form. Apart from ${customerName(d)}'s ownership of the Deliverables, ${providerName(d)}'s license to use Customer Materials, and ${customerName(d)}'s rights in Pre-Existing Materials, neither party transfers any rights in its products, data, or other intellectual property.`,
  },
  {
    number: 3,
    title: "Privacy & Security",
    body: (d) =>
      `If the parties have a data processing agreement in place, each party will comply with its obligations under it, which will govern the parties' rights and obligations as to Personal Data and control over any conflict with this Agreement. ${providerName(d)} will comply with any security policy the parties have agreed applies to the Services.`,
  },
  {
    number: 4,
    title: "Payment & Taxes",
    body: (d) =>
      `Unless an SOW specifies otherwise, Fees are stated and payable in U.S. Dollars, exclusive of taxes, and are non-refundable except for the prorated refund of prepaid Fees allowed under specific termination rights. The Fees for the Services are ${fieldText(d, FEES_FIELD)}, and ${providerName(d)} will invoice ${customerName(d)} as described in the applicable SOW; ${customerName(d)} will pay each invoice, including applicable taxes, within the ${fieldText(d, PAYMENT_PERIOD_FIELD)}. ${customerName(d)} is responsible for all duties, taxes, and levies that apply to the Fees (excluding ${providerName(d)}'s income taxes) that ${providerName(d)} itemizes on an invoice. If ${customerName(d)} disputes an invoice in good faith, it must notify ${providerName(d)} during the ${fieldText(d, PAYMENT_PERIOD_FIELD)} for that invoice and timely pay all undisputed amounts; the parties will work to resolve the dispute within 15 days after that period ends, and if they cannot, each party may pursue any remedy available under the Agreement, the SOW, or applicable law.`,
  },
  {
    number: 5,
    title: "Term & Termination",
    body: (d) =>
      `This Agreement starts on the ${formatDate(fieldValue(d, "effectiveDate"))} and continues until 12 months after the end of the latest SOW Term, which the parties expect to run ${fieldText(d, SOW_TERM_FIELD)}. Either party may terminate this Agreement or an affected SOW immediately if the other fails to cure a material breach within 30 days of notice, materially breaches in a manner that cannot be cured, dissolves without a successor, makes an assignment for the benefit of creditors, or becomes subject to insolvency, receivership, or bankruptcy proceedings lasting more than 60 days; either party may also terminate an affected SOW if a Force Majeure Event prevents ${providerName(d)} from performing the Services for 30 or more consecutive days, and either party may terminate this Agreement for any or no reason once no SOWs remain active. A terminating party must state its reason for termination. Terminating the Agreement for cause automatically terminates all SOWs; upon any termination or expiration ${providerName(d)} will stop providing the Services, each party will return or destroy the other's Confidential Information, ${providerName(d)} will invoice ${customerName(d)} for outstanding Fees accrued before termination (except where ${customerName(d)} terminated for ${providerName(d)}'s uncured breach), and ${providerName(d)} will refund any unearned prepaid Fees (except where ${providerName(d)} terminated for ${customerName(d)}'s uncured breach). The Intellectual Property, Payment & Taxes, Effect of Termination, Survival, Representations & Warranties, Disclaimer of Warranties, Limitation of Liability, Indemnification, Insurance, Confidentiality, and General Terms sections survive expiration or termination, and each party may retain the other's Confidential Information under its standard backup or record-retention policies, subject to continuing confidentiality obligations.`,
  },
  {
    number: 6,
    title: "Representations & Warranties",
    body: (d) =>
      `Each party represents that it has the power and authority to enter into this Agreement, is duly organized and in good standing under the laws of its jurisdiction, will comply with applicable law in performing its obligations, and will comply with any additional warranties the parties have agreed to. ${customerName(d)} represents that ${providerName(d)}'s use of Customer Materials and ${customerName(d)}-procured Third-Party Materials will not infringe or misappropriate anyone's intellectual property rights, and that it holds the rights needed to provide them. ${providerName(d)} represents that it will perform the Services in a timely, competent, and professional manner, that the Deliverables (other than Customer Materials and ${customerName(d)}-procured Third-Party Materials) will not infringe or misappropriate anyone's intellectual property rights, will conform to the requirements in the SOW, and that ${providerName(d)} holds the rights needed to perform the Services and convey the Deliverables. If ${providerName(d)} breaches the warranty that Deliverables will conform to the SOW, ${customerName(d)} must notify ${providerName(d)} with reasonable detail within 45 days of discovering the issue, and ${providerName(d)} will reperform the Services within 45 days of receiving that notice; if ${providerName(d)} cannot resolve the issue, ${customerName(d)} may terminate the affected SOW and ${providerName(d)} will refund a prorated share of prepaid Fees for the remaining SOW Term, which are ${customerName(d)}'s exclusive remedies for that warranty.`,
  },
  {
    number: 7,
    title: "Disclaimer of Warranties",
    body: (d) =>
      `Except for the warranties described above, ${providerName(d)} and ${customerName(d)} each disclaim all other warranties, whether express or implied, including the implied warranties of merchantability, fitness for a particular purpose, title, and non-infringement, to the maximum extent permitted by applicable law.`,
  },
  {
    number: 8,
    title: "Limitation of Liability",
    body: (d) =>
      `If the parties have agreed to any claims subject to an increased liability cap, each party's total cumulative liability for those claims will not exceed the agreed increased cap amount; each party's total cumulative liability for all other claims arising out of or relating to this Agreement will not exceed ${fieldText(d, GENERAL_CAP_AMOUNT_FIELD)}. Each party's liability is limited to the fullest extent permitted by applicable law, and under no circumstances will either party be liable for lost profits or revenues, or for consequential, special, indirect, exemplary, punitive, or incidental damages, even if advised of the possibility in advance. These caps do not apply to claims the parties have agreed are unlimited, and the damages waiver does not apply to claims subject to an increased cap or to a breach of the Confidentiality section.`,
  },
  {
    number: 9,
    title: "Indemnification",
    body: (d) =>
      `${providerName(d)} will indemnify, defend, and hold ${customerName(d)} harmless from third-party claims covered under this Agreement and all related out-of-pocket damages, settlements, costs, and reasonable attorneys' fees, and ${customerName(d)} will do the same for ${providerName(d)} with respect to claims ${customerName(d)} has agreed to cover. Each indemnifying party's obligations are contingent on the protected party promptly notifying it of the claim, giving it reasonable assistance at the indemnifying party's expense, and giving it sole control over the defense and settlement, though the protected party may participate with its own counsel at its own expense; the indemnifying party may not settle a claim in a way that admits fault or materially harms the protected party without its written consent. This section states each protected party's exclusive remedy and each indemnifying party's entire liability for a covered claim.`,
  },
  {
    number: 10,
    title: "Insurance",
    body: () =>
      `During the term of this Agreement and for six months afterward, each party will carry commercial insurance meeting any minimum coverage levels the parties have agreed apply, and will provide a certificate of insurance upon request; a party's insurance is not evidence of its liability, and coverage will be on an occurrence basis and waive rights of subrogation or crossclaim.`,
  },
  {
    number: 11,
    title: "Confidentiality",
    body: () =>
      `Unless this Agreement says otherwise, a party receiving Confidential Information will use it only to fulfill its obligations or exercise its rights under this Agreement, will not disclose it to anyone else, and will protect it using at least the same care it uses for its own similar information, but no less than a reasonable standard of care. Confidential Information excludes information the recipient already knew without a confidentiality obligation, that becomes public through no fault of the recipient, that it receives from someone else without a confidentiality obligation, or that it independently develops without reference to the discloser's Confidential Information. A recipient may disclose Confidential Information as required by law, giving the discloser reasonable advance notice and cooperating (at the discloser's expense) with efforts to obtain confidential treatment, and may share it with employees, advisors, contractors, and representatives who need to know it and are bound by confidentiality obligations at least as protective as this section, remaining responsible for their compliance.`,
  },
  {
    number: 12,
    title: "General Terms",
    body: (d) =>
      `This Agreement, together with any SOWs, is the entire agreement between the parties about its subject and supersedes all prior statements about it; ${providerName(d)} rejects any terms in ${customerName(d)}'s purchase order or similar document, which may be used only for accounting or administrative purposes. Any waiver, modification, or change must be in writing and signed or electronically accepted by each party (though this does not limit updating an SOW through the Change Order process), and if a term is held invalid or unenforceable the remaining terms stay in full force; a party's failure to enforce a term or exercise a right is not a waiver of it. The laws of ${fieldText(d, GOVERNING_LAW_FIELD)} govern all interpretations and disputes about this Agreement, and the parties submit to the exclusive jurisdiction of the courts in ${fieldText(d, CHOSEN_COURTS_FIELD)}. A breach of Confidentiality or violation of a party's intellectual property rights may cause irreparable harm, so the non-breaching party may seek equitable relief, including an injunction, without posting a bond and without limiting its other remedies; except where this Agreement provides an exclusive remedy, pursuing one remedy does not limit a party's other rights or remedies. Neither party may assign this Agreement or an SOW without the other's prior written consent, except ${customerName(d)} may assign it upon notice in connection with a merger, change of control, reorganization, or sale of substantially all its relevant equity, business, or assets; any other attempted assignment is void, and this Agreement binds the parties' permitted successors and assigns. Neither party may publicize the existence of this Agreement or an SOW without the other's prior written approval. Notices must be in writing and sent to a party's notice address, and are deemed given upon confirmed delivery (if by email, registered or certified mail, or personal delivery) or two days after mailing (if by overnight commercial delivery). The parties are independent contractors, not agents, partners, or joint venturers, and neither may bind the other to any obligation; there are no third-party beneficiaries. Neither party is liable for a delay or failure to perform caused by a Force Majeure Event, though this does not excuse ${customerName(d)}'s obligation to pay Fees. ${customerName(d)} may not export the Services, Deliverables, or related technology in violation of U.S. export control laws or regulations. Neither party will offer, give, promise, or receive anything of value to improperly assist either party in retaining or obtaining business, in violation of laws such as the U.S. Foreign Corrupt Practices Act or the UK Bribery Act 2010. Section titles are for convenience only, and "including" and similar words are non-exhaustive; this Agreement may be signed in counterparts, including by electronic copies or acceptance mechanism, each of which is deemed an original.`,
  },
];

export const psaModule: DocumentModule = {
  id: "psa",
  title: "Professional Services Agreement (PSA)",
  pdfFilename: "PSA.pdf",
  fields: [
    EFFECTIVE_DATE_FIELD,
    SOW_TERM_FIELD,
    SERVICES_DESCRIPTION_FIELD,
    FEES_FIELD,
    PAYMENT_PERIOD_FIELD,
    REJECTION_PERIOD_FIELD,
    RESUBMISSION_PERIOD_FIELD,
    TIME_OF_ASSIGNMENT_FIELD,
    CUSTOMER_OBLIGATIONS_FIELD,
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
      sowTerm: "",
      servicesDescription: "",
      fees: "",
      paymentPeriod: "",
      rejectionPeriod: "",
      resubmissionPeriod: "",
      timeOfAssignment: "",
      customerObligations: "",
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
