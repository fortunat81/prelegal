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

const companyName = (data: GenericFormData) => entityNameText(data, "company", "Company");
const partnerName = (data: GenericFormData) => entityNameText(data, "partner", "Partner");

const EFFECTIVE_DATE_FIELD: FieldDef = {
  key: "effectiveDate",
  label: "Effective Date",
  kind: "date",
};

const END_DATE_FIELD: FieldDef = {
  key: "endDate",
  label: "End Date",
  kind: "date",
};

const COMPANY_OBLIGATIONS_FIELD: FieldDef = {
  key: "companyObligations",
  label: "Company's Obligations",
  kind: "textarea",
  hint: "What Company will do under the partnership, e.g. providing product access, co-marketing, or paying referral fees",
};

const PARTNER_OBLIGATIONS_FIELD: FieldDef = {
  key: "partnerObligations",
  label: "Partner's Obligations",
  kind: "textarea",
  hint: "What Partner will do under the partnership, e.g. reselling the product, referring leads, or distributing Company's brand",
};

const PAYMENT_PROCESS_FIELD: FieldDef = {
  key: "paymentProcess",
  label: "Payment Process",
  kind: "text",
  hint: "How Fees, if any, will be billed or invoiced",
  inputPlaceholder: "e.g. invoiced monthly in arrears",
  fallback: "no Fees apply between the parties",
};

const PAYMENT_SCHEDULE_FIELD: FieldDef = {
  key: "paymentSchedule",
  label: "Payment Schedule",
  kind: "text",
  hint: "When payment is due after billing",
  inputPlaceholder: "e.g. net 30 days from invoice date",
  fallback: "no Fees apply between the parties",
};

const TERRITORY_FIELD: FieldDef = {
  key: "territory",
  label: "Territory",
  kind: "text",
  hint: "Where Partner may use Company's trademarks and brand elements",
  inputPlaceholder: "e.g. the United States, or worldwide",
};

const BRAND_GUIDELINES_FIELD: FieldDef = {
  key: "brandGuidelines",
  label: "Brand Guidelines",
  kind: "textarea",
  hint: "Any brand usage guidelines Company provides for its trademarks or logos",
  fallback: "no additional brand guidelines beyond this Agreement",
};

const GENERAL_CAP_AMOUNT_FIELD: FieldDef = {
  key: "generalCapAmount",
  label: "General Cap Amount",
  kind: "text",
  hint: "The liability cap for most claims under this Agreement",
  inputPlaceholder: "e.g. $50,000, or the Fees paid in the prior 12 months",
};

const ADDITIONAL_WARRANTIES_FIELD: FieldDef = {
  key: "additionalWarranties",
  label: "Additional Warranties",
  kind: "textarea",
  hint: "Any extra warranties either party makes beyond the standard ones",
  fallback: "no additional warranties",
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
    title: "Cooperation",
    body: (d) =>
      `${companyName(d)} will perform its obligations of ${fieldText(d, COMPANY_OBLIGATIONS_FIELD)}, and ${partnerName(d)} will perform its obligations of ${fieldText(d, PARTNER_OBLIGATIONS_FIELD)}. Either party may, but is not required to, give Feedback to the other party about its products, services, or related offerings. All Feedback is given "AS IS", and the party receiving Feedback may use it freely without any restriction or obligation.`,
  },
  {
    number: 2,
    title: "Payment & Taxes",
    body: (d) =>
      `If either party's obligations include the payment of Fees to the other, all Fees are in U.S. Dollars (unless the parties agree otherwise) and are exclusive of taxes, and — except for a prorated refund of prepaid Fees — are non-refundable. The party receiving payment will bill or invoice the other party according to the following Payment Process: ${fieldText(d, PAYMENT_PROCESS_FIELD)}. The paying party will pay all Fees and related taxes according to the following Payment Schedule: ${fieldText(d, PAYMENT_SCHEDULE_FIELD)}. The paying party is responsible for all duties, taxes, and levies that apply to Fees, including sales, use, VAT, GST, or withholding taxes, but is not responsible for the other party's income taxes.`,
  },
  {
    number: 3,
    title: "Trademark License",
    body: (d) =>
      `${companyName(d)} grants to ${partnerName(d)}, during the term of this Agreement and within the following Territory — ${fieldText(d, TERRITORY_FIELD)} — a non-exclusive, non-transferable, non-sublicensable, revocable, royalty-free, limited license to use ${companyName(d)}'s trademarks, service marks, names, logos, and related marketing materials ("Brand Elements") solely as necessary for ${partnerName(d)} to perform its obligations under this Agreement, and only in accordance with the following Brand Guidelines: ${fieldText(d, BRAND_GUIDELINES_FIELD)}. ${companyName(d)} remains the sole and exclusive owner of all right, title, and interest in the Brand Elements, and all goodwill from ${partnerName(d)}'s use will inure to ${companyName(d)}'s benefit; no other rights in either party's products, data, or intellectual property are transferred by this license. ${partnerName(d)} will not alter or modify the Brand Elements, combine them with other trademarks or logos, use them in a way that implies endorsement beyond the scope of this Agreement, or use them in any way that could harm ${companyName(d)}'s reputation or goodwill, and will promptly stop using the Brand Elements upon ${companyName(d)}'s written notice. ${companyName(d)} may inspect and approve all uses of the Brand Elements, and ${partnerName(d)} will submit samples of its proposed uses for prior written approval if requested.`,
  },
  {
    number: 4,
    title: "Privacy",
    body: () =>
      `If the parties have entered into a data processing agreement governing Personal Data shared under this Agreement, each party will comply with its obligations under that data processing agreement, which will control each party's rights and obligations as to Personal Data and will control in the event of any conflict with this Agreement.`,
  },
  {
    number: 5,
    title: "Escalation Procedure",
    body: () =>
      `Before seeking legal relief, each party will give the other written notice of any specific issue in dispute about this Agreement, including good-faith disagreements about amounts billed or invoiced. Within 30 days after that notice, at least one knowledgeable representative of each party will meet in good faith to try to resolve the dispute, and the parties will keep the existence and substance of the dispute — including any negotiations, mediation, or arbitration — confidential, except as necessary to pursue the dispute resolution process or as required by law.`,
  },
  {
    number: 6,
    title: "Term & Termination",
    body: (d) =>
      `This Agreement starts on the ${formatDate(fieldValue(d, "effectiveDate"))} and continues until the ${formatDate(fieldValue(d, "endDate"))}, unless terminated earlier. Either party may terminate immediately if the other fails to cure a material breach within 30 days after notice (or within 5 days for a breach of the trademark-use restrictions in Section 3), if the other party commits a material, incurable breach, dissolves or stops doing business without a successor, makes an assignment for the benefit of creditors, or becomes subject to insolvency, receivership, or bankruptcy proceedings lasting more than 60 days, or if a Force Majeure Event prevents either party from performing its obligations for 30 or more consecutive days (though this does not excuse any obligation to pay Fees). Upon expiration or termination, ${partnerName(d)}'s trademark license under Section 3 immediately ends and ${partnerName(d)} must stop all use of ${companyName(d)}'s Brand Elements; each party will return or destroy the other's Confidential Information in its possession, subject to standard backup and record-retention practices; and, if the Agreement was terminated for cause, the party owed payment will either submit a final bill for Fees accrued before termination or refund any unearned prepaid Fees, as applicable. The sections covering fees already accrued, reservation of rights, restrictions on Brand Element use, effect of termination, survival, representations and warranties, disclaimer of warranties, limitation of liability, indemnification, confidentiality, and general terms will survive expiration or termination.`,
  },
  {
    number: 7,
    title: "Representations & Warranties",
    body: (d) =>
      `Each party represents and warrants to the other that: it has the legal power and authority to enter into and perform this Agreement; it is duly organized, validly existing, and in good standing under the laws of its jurisdiction of origin; it will comply with applicable law in performing its obligations and exercising its rights under this Agreement; it has all rights necessary under applicable law to collect and share any Personal Data it collects or shares under this Agreement; its Brand Elements do not and will not infringe the copyright, trademark, right of publicity, or other proprietary rights of any third party; and it will comply with the following additional warranties: ${fieldText(d, ADDITIONAL_WARRANTIES_FIELD)}.`,
  },
  {
    number: 8,
    title: "Disclaimer of Warranties",
    body: (d) =>
      `Except for the warranties in Section 7 (Representations & Warranties), ${companyName(d)} and ${partnerName(d)} each disclaim all other warranties, whether express or implied, including the implied warranties of merchantability, fitness for a particular purpose, and title, to the maximum extent permitted by applicable law.`,
  },
  {
    number: 9,
    title: "Limitation of Liability",
    body: (d) =>
      `Except for any increased or unlimited claims the parties agree fall outside the ordinary cap, each party's total cumulative liability for all claims arising out of or relating to this Agreement will not exceed ${fieldText(d, GENERAL_CAP_AMOUNT_FIELD)}. Under no circumstances will either party be liable to the other for lost profits or revenues, or for consequential, special, indirect, exemplary, punitive, or incidental damages relating to this Agreement, even if informed of the possibility of such damages in advance, except for a breach of Section 11 (Confidentiality) or claims the parties have agreed fall outside these limits. Nothing in this Agreement limits a party's liability to the extent prohibited by applicable law.`,
  },
  {
    number: 10,
    title: "Indemnification",
    body: (d) =>
      `${companyName(d)} will indemnify, defend, and hold harmless ${partnerName(d)} from third-party claims and related damages, awards, settlements, costs, and reasonable attorneys' fees arising from ${companyName(d)}'s breach of this Agreement, and ${partnerName(d)} will likewise indemnify, defend, and hold harmless ${companyName(d)} from third-party claims and related costs arising from ${partnerName(d)}'s breach of this Agreement. The protected party must promptly notify the indemnifying party of any claim, provide reasonable assistance at the indemnifying party's expense, and give the indemnifying party sole control of the defense and settlement — though the protected party may participate with its own counsel at its own expense, and the indemnifying party may not agree to a settlement admitting fault or materially harming the protected party without its written consent. This section states each protected party's exclusive remedy and each indemnifying party's entire liability for a covered claim.`,
  },
  {
    number: 11,
    title: "Confidentiality",
    body: () =>
      `Except to fulfill its obligations or exercise its rights under this Agreement, a party receiving Confidential Information will not use or disclose the other party's Confidential Information, and will protect it using at least the same care it uses for its own similarly sensitive information, but no less than a reasonable standard of care. Confidential Information excludes information the recipient already knew without a confidentiality obligation, that becomes public through no fault of the recipient, that it rightfully receives from a third party without restriction, or that it independently develops without reference to the disclosed information. A recipient may disclose Confidential Information as required by law, with reasonable advance notice and cooperation where legally permitted, and may share it with employees, advisors, contractors, and representatives who need to know it and are bound by confidentiality obligations at least as protective as this Section, remaining responsible for their compliance.`,
  },
  {
    number: 12,
    title: "General Terms",
    body: (d) =>
      `This Agreement is the only agreement between the parties about its subject matter and supersedes all prior statements about it. Any waiver, modification, or change must be in writing and signed by each party, and if any term is held invalid or unenforceable, the remaining terms remain in full force and effect; a party's failure to enforce a term or exercise a right is not a waiver of it. The laws of ${fieldText(d, GOVERNING_LAW_FIELD)} govern all interpretations and disputes about this Agreement, and the parties submit to the exclusive jurisdiction of the courts in ${fieldText(d, CHOSEN_COURTS_FIELD)}. A breach of Section 11 (Confidentiality) or a violation of a party's intellectual property rights may cause irreparable harm for which money damages are inadequate, so the non-breaching party may seek an injunction or other equitable relief without posting a bond, without limiting its other remedies. Neither party may assign this Agreement without the other's prior written consent, and any non-permitted assignment is void; this Agreement binds and benefits the parties' permitted successors and assigns. Notices must be in writing and sent to the notice address listed for each party, and are deemed given upon confirmed delivery by email, registered or certified mail, or personal delivery, or two days after mailing by overnight courier. The parties are independent contractors, not agents, partners, or joint venturers, and neither may bind the other; there are no third-party beneficiaries; neither party is liable for delay caused by a Force Majeure Event (though this does not excuse payment of Fees); neither party will engage in bribery or improper payments in violation of laws like the U.S. Foreign Corrupt Practices Act or the UK Bribery Act 2010; and this Agreement may be signed in counterparts, including by electronic signature, each of which is deemed an original.`,
  },
];

export const partnershipAgreementModule: DocumentModule = {
  id: "partnership-agreement",
  title: "Partnership Agreement",
  pdfFilename: "Partnership-Agreement.pdf",
  fields: [
    EFFECTIVE_DATE_FIELD,
    END_DATE_FIELD,
    COMPANY_OBLIGATIONS_FIELD,
    PARTNER_OBLIGATIONS_FIELD,
    PAYMENT_PROCESS_FIELD,
    PAYMENT_SCHEDULE_FIELD,
    TERRITORY_FIELD,
    BRAND_GUIDELINES_FIELD,
    GENERAL_CAP_AMOUNT_FIELD,
    ADDITIONAL_WARRANTIES_FIELD,
    GOVERNING_LAW_FIELD,
    CHOSEN_COURTS_FIELD,
  ],
  entities: [
    { key: "company", roleLabel: "Company" },
    { key: "partner", roleLabel: "Partner" },
  ],
  defaultData: () => ({
    values: {
      effectiveDate: new Date().toISOString().slice(0, 10),
      endDate: "",
      companyObligations: "",
      partnerObligations: "",
      paymentProcess: "",
      paymentSchedule: "",
      territory: "",
      brandGuidelines: "",
      generalCapAmount: "",
      additionalWarranties: "",
      governingLaw: "",
      chosenCourts: "",
    },
    entities: {
      company: emptyEntity(),
      partner: emptyEntity(),
    },
  }),
  clauses,
};
