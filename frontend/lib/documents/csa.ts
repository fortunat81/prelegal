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
  hint: "When the Framework Terms start",
};

const ORDER_DATE_FIELD: FieldDef = {
  key: "orderDate",
  label: "Order Date",
  kind: "date",
  hint: "When this Order Form (subscription) starts",
};

const SUBSCRIPTION_PERIOD_FIELD: FieldDef = {
  key: "subscriptionPeriod",
  label: "Subscription Period",
  kind: "text",
  hint: "How long the subscription lasts and renews",
  inputPlaceholder: "e.g. 12 months from the Order Date",
};

const NON_RENEWAL_NOTICE_PERIOD_FIELD: FieldDef = {
  key: "nonRenewalNoticePeriod",
  label: "Non-Renewal Notice Period",
  kind: "text",
  hint: "How far before the end of a Subscription Period a party must give notice to not renew",
  inputPlaceholder: "e.g. 60 days",
};

const FEES_FIELD: FieldDef = {
  key: "fees",
  label: "Fees",
  kind: "textarea",
  hint: "The subscription Fees and how they're structured",
  inputPlaceholder: "e.g. $5,000/month",
};

const PAYMENT_PROCESS_FIELD: FieldDef = {
  key: "paymentProcess",
  label: "Payment Process",
  kind: "text",
  hint: "How and when Customer pays",
  inputPlaceholder: "e.g. invoiced monthly in advance, due net 30",
};

const TECHNICAL_SUPPORT_FIELD: FieldDef = {
  key: "technicalSupport",
  label: "Technical Support",
  kind: "textarea",
  hint: "The level of support Provider will give",
  inputPlaceholder: "e.g. email support with 1 business day response time",
};

const USE_LIMITATIONS_FIELD: FieldDef = {
  key: "useLimitations",
  label: "Use Limitations",
  kind: "textarea",
  hint: "Any limits on Customer's use of the Product, e.g. seat or usage caps",
  fallback: "no additional use limitations",
};

const DPA_REFERENCE_FIELD: FieldDef = {
  key: "dpaReference",
  label: "DPA Reference",
  kind: "text",
  hint: "Whether/which Data Processing Agreement applies to Personal Data",
  fallback: "no separate Data Processing Agreement",
};

const GENERAL_CAP_AMOUNT_FIELD: FieldDef = {
  key: "generalCapAmount",
  label: "General Cap Amount",
  kind: "text",
  hint: "Each party's general liability cap",
  inputPlaceholder: "e.g. the total Fees paid in the 12 months before the claim",
};

const INCREASED_CAP_AMOUNT_FIELD: FieldDef = {
  key: "increasedCapAmount",
  label: "Increased Cap Amount",
  kind: "text",
  hint: "The higher liability cap for Increased Claims (e.g. confidentiality or indemnification breaches)",
  inputPlaceholder: "e.g. 2x the total Fees paid",
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
    title: "Service",
    body: (d) =>
      `During the ${fieldText(d, SUBSCRIPTION_PERIOD_FIELD)} and subject to the terms of this Agreement, ${customerName(d)} may access and use the Cloud Service and copy and use the included Software and Documentation only as needed to access and use the Cloud Service, in each case for its internal business purposes; if a ${customerName(d)} Affiliate enters a separate Order Form with ${providerName(d)}, that Order Form creates a separate agreement between ${providerName(d)} and the Affiliate for which ${customerName(d)} is not responsible. ${providerName(d)} will provide Technical Support (${fieldText(d, TECHNICAL_SUPPORT_FIELD)}) during the ${fieldText(d, SUBSCRIPTION_PERIOD_FIELD)}. ${customerName(d)} is responsible for all actions on Users' accounts and for Users' compliance with this Agreement, must protect the confidentiality of passwords and login credentials, and will promptly notify ${providerName(d)} of any suspected fraudulent activity or compromise. ${customerName(d)} may, but is not required to, give ${providerName(d)} Feedback "AS IS", which ${providerName(d)} may use freely without restriction; ${providerName(d)} may also collect and analyze Usage Data and use it to maintain, improve, and promote its products and services, but may only disclose Usage Data to others in aggregated, de-identified form. ${providerName(d)} may copy, display, modify, and use Customer Content only as needed to provide and maintain the Product, and ${customerName(d)} is responsible for its accuracy and content. Usage Data and Customer Content may be aggregated and used, with commercially reasonable de-identification efforts, to develop, train, or enhance artificial intelligence or machine learning models that are part of ${providerName(d)}'s products and services, and ${customerName(d)} authorizes ${providerName(d)} to process its Usage Data and Customer Content for that purpose, without reducing ${providerName(d)}'s obligations under applicable data protection laws.`,
  },
  {
    number: 2,
    title: "Restrictions & Obligations",
    body: (d) =>
      `Except as expressly permitted by this Agreement, ${customerName(d)} will not (and will not allow anyone else to) reverse engineer or attempt to discover the source code of the Product; resell, sublicense, rent, or otherwise allow others to access the Product; remove proprietary notices; copy or create derivative works of the Product; conduct security or vulnerability testing against, or otherwise interfere with, the Product; access accounts or data without authorization; use the Product to build a competing product; use the Product for High Risk Activities or in violation of applicable law; use the Product to gain unauthorized access to others' networks; or upload Customer Content it lacks the rights to. Use of the Product must comply with all Documentation and the following Use Limitations: ${fieldText(d, USE_LIMITATIONS_FIELD)}. If ${customerName(d)} maintains an outstanding, undisputed balance for more than 30 days, breaches the restrictions above, or uses the Product in a way that materially and negatively impacts the Product or others, ${providerName(d)} may temporarily suspend ${customerName(d)}'s access, trying to give notice when practical, and will reinstate access once ${customerName(d)} resolves the underlying issue.`,
  },
  {
    number: 3,
    title: "Privacy & Security",
    body: (d) =>
      `Before submitting Personal Data governed by the GDPR, ${customerName(d)} must enter into a data processing agreement with ${providerName(d)}. The parties' DPA for this Agreement is: ${fieldText(d, DPA_REFERENCE_FIELD)}. If the parties have a DPA, its terms will control each party's rights and obligations as to Personal Data and will control in the event of any conflict with this Agreement. ${customerName(d)} will not (and will not allow anyone else to) submit Prohibited Data — including protected health information, financial account numbers, government ID numbers, and other special categories of sensitive personal data — to the Product unless authorized by the Order Form or Key Terms.`,
  },
  {
    number: 4,
    title: "Payment & Taxes",
    body: (d) =>
      `The Fees for the Product are: ${fieldText(d, FEES_FIELD)}, payable according to the following Payment Process: ${fieldText(d, PAYMENT_PROCESS_FIELD)}. Unless the Order Form specifies a different currency, all Fees are in U.S. Dollars, exclusive of taxes, and non-refundable except for the prorated refund of prepaid Fees expressly provided elsewhere in this Agreement. Where the Payment Process calls for invoicing, ${providerName(d)} will send invoices for usage-based Fees in arrears and for all other Fees in advance; where it calls for automatic payment, ${providerName(d)} will automatically charge the payment method on file and ${customerName(d)} authorizes those charges, and ${providerName(d)} will make copies of ${customerName(d)}'s bills or transaction history available on request. ${customerName(d)} is responsible for all duties, taxes, and levies that apply to the Fees (other than ${providerName(d)}'s income taxes) that ${providerName(d)} itemizes and includes in an invoice. If ${customerName(d)} has a good-faith dispute about Fees charged or invoiced, it must notify ${providerName(d)} before payment is due (or within 30 days of an automatic payment) and pay all undisputed amounts on time; the parties will work together to resolve the dispute within 15 days, after which either party may pursue any remedy available under this Agreement or applicable law.`,
  },
  {
    number: 5,
    title: "Term & Termination",
    body: (d) =>
      `For each Order Form, this Agreement will start on the ${formatDate(fieldValue(d, "orderDate"))}, continue through the ${fieldText(d, SUBSCRIPTION_PERIOD_FIELD)}, and automatically renew for additional Subscription Periods unless a party gives notice of non-renewal at least ${fieldText(d, NON_RENEWAL_NOTICE_PERIOD_FIELD)} before the end of the then-current Subscription Period. These Framework Terms will start on the ${formatDate(fieldValue(d, "effectiveDate"))} and continue for the longer of one year or until all Order Forms governed by them have ended. Either party may terminate the Framework Terms or an Order Form immediately if the other party fails to cure a material breach following 30 days notice, materially breaches in a manner that cannot be cured, dissolves without a successor, makes an assignment for the benefit of creditors, or becomes subject to insolvency or bankruptcy proceedings continuing more than 60 days. Either party may also terminate an affected Order Form on notice if a Force Majeure Event prevents the Product from materially operating for 30 or more consecutive days, in which case ${providerName(d)} will pay ${customerName(d)} a prorated refund of prepaid Fees for the remainder of the ${fieldText(d, SUBSCRIPTION_PERIOD_FIELD)}, though this does not excuse Fees accrued before termination. Termination of the Framework Terms automatically terminates all Order Forms under them. Upon any expiration or termination, ${customerName(d)} will no longer have any right to use the Product, ${providerName(d)} will delete Customer Content within 60 days of ${customerName(d)}'s request, each party will return or destroy the other's Confidential Information in its possession, and ${providerName(d)} will submit a final invoice for outstanding Fees which ${customerName(d)} will pay. Sections covering Feedback and Usage Data, Machine Learning, Restrictions on Customer, Payment & Taxes (for Fees accrued before termination), Effect of Termination, Survival, Representations & Warranties, Disclaimer of Warranties, Limitation of Liability, Indemnification, Confidentiality, Reservation of Rights, General Terms, and Definitions all survive expiration or termination, and each party may retain the other's Confidential Information under its standard backup or record retention policies, subject to continuing confidentiality obligations.`,
  },
  {
    number: 6,
    title: "Representations & Warranties",
    body: (d) =>
      `Each party represents and warrants that it has the legal power and authority to enter into this Agreement, is duly organized, validly existing, and in good standing under the laws of its jurisdiction of origin, will comply with applicable law in performing its obligations, and will comply with the following additional warranties: ${fieldText(d, ADDITIONAL_WARRANTIES_FIELD)}. ${customerName(d)} further represents that it, its Users, and anyone submitting Customer Content have all rights necessary to submit Customer Content and to allow its use as described in this Agreement. ${providerName(d)} represents that it will not materially reduce the general functionality of the Cloud Service during the ${fieldText(d, SUBSCRIPTION_PERIOD_FIELD)}. If ${providerName(d)} breaches that warranty, ${customerName(d)} must give ${providerName(d)} notice within 45 days of discovering the issue; ${providerName(d)} will then have 45 days to attempt to restore the Cloud Service's general functionality, and if it cannot, ${customerName(d)} may terminate the affected Order Form and ${providerName(d)} will pay a prorated refund of prepaid Fees for the remainder of the ${fieldText(d, SUBSCRIPTION_PERIOD_FIELD)} — ${customerName(d)}'s exclusive remedy for a breach of this warranty.`,
  },
  {
    number: 7,
    title: "Disclaimer of Warranties",
    body: (d) =>
      `${providerName(d)} makes no guarantee that the Product will always be safe, secure, or error-free, or that it will function without disruption, delay, or imperfection, and the warranties above do not apply to any misuse or unauthorized modification of the Product or to any product or service provided by anyone other than ${providerName(d)}. Except for those warranties, ${providerName(d)} and ${customerName(d)} each disclaim all other warranties and conditions, whether express or implied, including the implied warranties of merchantability, fitness for a particular purpose, title, and non-infringement, to the maximum extent permitted by applicable law.`,
  },
  {
    number: 8,
    title: "Limitation of Liability",
    body: (d) =>
      `Except as described below, each party's total cumulative liability for all claims arising out of or relating to this Agreement will not exceed ${fieldText(d, GENERAL_CAP_AMOUNT_FIELD)}. For claims subject to an increased cap under the parties' Key Terms, each party's total cumulative liability for those claims will not exceed ${fieldText(d, INCREASED_CAP_AMOUNT_FIELD)}. Except for those increased-cap claims or a breach of Confidentiality, under no circumstances will either party be liable to the other for lost profits or revenues, or for consequential, special, indirect, exemplary, punitive, or incidental damages relating to this Agreement, even if informed of the possibility of such damages in advance. These limitations and waivers apply to all liability, whether in tort (including negligence), contract, breach of statutory duty, or otherwise, and do not apply to claims the Key Terms designate as unlimited or to the extent applicable law prohibits limiting liability.`,
  },
  {
    number: 9,
    title: "Indemnification",
    body: (d) =>
      `${providerName(d)} will indemnify, defend, and hold harmless ${customerName(d)} from all third-party claims covered under the parties' Key Terms as Provider Covered Claims, and all related out-of-pocket damages, awards, settlements, costs, and reasonable attorneys' fees. ${customerName(d)} will indemnify, defend, and hold harmless ${providerName(d)} from all third-party claims covered as Customer Covered Claims, and all related out-of-pocket damages, awards, settlements, costs, and reasonable attorneys' fees. Each indemnifying party's obligations are contingent on the protected party promptly notifying it of the claim, providing reasonable assistance at the indemnifying party's expense, and giving the indemnifying party sole control over the defense and settlement (though a settlement admitting fault or materially harming the protected party requires the protected party's consent, and the protected party may participate with its own counsel at its own expense). If required by a settlement or court order, or reasonably necessary in response to a Provider Covered Claim, ${providerName(d)} may obtain the right for ${customerName(d)} to keep using the Product, replace or modify the affected component without materially reducing functionality, or, if neither is reasonable, terminate the affected Order Form and issue a prorated refund of prepaid Fees. ${providerName(d)}'s indemnification obligation does not extend to claims resulting from unauthorized modifications, unauthorized use, use combined with third-party items, or use of an outdated version where a newer release would have avoided the claim; ${customerName(d)}'s indemnification obligation does not extend to claims resulting from unauthorized use of Customer Content. This Section, together with any termination rights, is each party's exclusive remedy and entire liability for a covered claim.`,
  },
  {
    number: 10,
    title: "Confidentiality",
    body: () =>
      `Except as authorized under this Agreement or needed to perform it, a Recipient will not use or disclose a Discloser's Confidential Information and will protect it using at least the same care it uses for its own similar information, but no less than a reasonable standard of care. Confidential Information excludes information the Recipient already knew without any confidentiality obligation, that becomes publicly available through no fault of the Recipient, that the Recipient receives from someone else without confidentiality restrictions, or that the Recipient independently develops without reference to it. A Recipient may disclose Confidential Information to the extent required by applicable law, giving the Discloser reasonable advance notice and cooperation where legally permitted, and may disclose it to Users, employees, advisors, contractors, and representatives who need to know it, provided they are bound by confidentiality obligations at least as protective as this Section and the Recipient remains responsible for their compliance.`,
  },
  {
    number: 11,
    title: "Reservation of Rights",
    body: (d) =>
      `Except for the limited license to copy and use the Software and Documentation described above, ${providerName(d)} retains all right, title, and interest in and to the Product, whether developed before or after the ${formatDate(fieldValue(d, "effectiveDate"))}. Except for the limited rights ${providerName(d)} has in Customer Content and in Usage Data used for machine learning, ${customerName(d)} retains all right, title, and interest in and to the Customer Content.`,
  },
  {
    number: 12,
    title: "General Terms",
    body: (d) =>
      `This Agreement is the only agreement between the parties about its subject and supersedes all prior statements about it; ${providerName(d)} rejects any terms in ${customerName(d)}'s purchase order or similar documents, which may only be used for accounting or administrative purposes, and no terms in ${customerName(d)} documentation or an online vendor portal apply unless expressly agreed in a signed writing. Any waiver, modification, or change must be in writing and signed or electronically accepted by each party; if a term is held invalid or unenforceable, the remaining terms stay in full force, and a party's failure to enforce a term does not waive it. The laws of ${fieldText(d, GOVERNING_LAW_FIELD)} govern all interpretations and disputes about this Agreement, and the parties submit to the exclusive jurisdiction of the courts in ${fieldText(d, CHOSEN_COURTS_FIELD)}. A breach of Confidentiality or violation of a party's intellectual property rights may cause irreparable harm, so the non-breaching party may seek equitable relief, including an injunction, without posting a bond, and seeking one remedy does not limit a party's other rights or remedies. Neither party may assign this Agreement without the other's prior written consent, except either party may assign it in connection with a merger, change of control, reorganization, or sale of substantially all its assets; a non-permitted assignment is void. If ${providerName(d)} gives ${customerName(d)} access to a Beta Product, it is provided "AS IS" without the functionality warranty above, and ${customerName(d)} acknowledges Beta Products may be modified or removed at ${providerName(d)}'s discretion. ${providerName(d)} may identify ${customerName(d)} and use its name and logo in marketing as a user of ${providerName(d)}'s products. Notices must be in writing and sent to the notice address above, and are deemed given upon confirmed delivery (by email, registered or certified mail, or personal delivery) or two days after mailing by overnight commercial delivery. The parties are independent contractors, not agents, partners, or joint venturers, with no third-party beneficiaries; neither party is liable for delay or failure to perform due to a Force Majeure Event, though this does not excuse ${customerName(d)}'s obligation to pay Fees. ${customerName(d)} may not export the Product in violation of U.S. export control laws and represents it is not a sanctioned party or located in an embargoed country; ${providerName(d)} may terminate this Agreement immediately to comply with export control or sanctions laws. Neither party will offer, give, or receive anything of value to improperly assist in retaining or obtaining business, in violation of laws such as the U.S. Foreign Corrupt Practices Act or the UK Bribery Act. Section titles are for convenience only, "including" is non-exhaustive, and the UN Convention on the International Sale of Goods and the Uniform Computer Information Transaction Act do not apply. This Agreement may be signed in counterparts, including by electronic copies or acceptance mechanism, each deemed an original.`,
  },
];

export const csaModule: DocumentModule = {
  id: "csa",
  title: "Cloud Service Agreement (CSA)",
  pdfFilename: "CSA.pdf",
  fields: [
    EFFECTIVE_DATE_FIELD,
    ORDER_DATE_FIELD,
    SUBSCRIPTION_PERIOD_FIELD,
    NON_RENEWAL_NOTICE_PERIOD_FIELD,
    FEES_FIELD,
    PAYMENT_PROCESS_FIELD,
    TECHNICAL_SUPPORT_FIELD,
    USE_LIMITATIONS_FIELD,
    DPA_REFERENCE_FIELD,
    GENERAL_CAP_AMOUNT_FIELD,
    INCREASED_CAP_AMOUNT_FIELD,
    ADDITIONAL_WARRANTIES_FIELD,
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
      orderDate: new Date().toISOString().slice(0, 10),
      subscriptionPeriod: "",
      nonRenewalNoticePeriod: "",
      fees: "",
      paymentProcess: "",
      technicalSupport: "",
      useLimitations: "",
      dpaReference: "",
      generalCapAmount: "",
      increasedCapAmount: "",
      additionalWarranties: "",
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
