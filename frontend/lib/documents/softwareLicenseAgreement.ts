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
  hint: "When the Framework Terms (the overall relationship) starts",
};

const ORDER_DATE_FIELD: FieldDef = {
  key: "orderDate",
  label: "Order Date",
  kind: "date",
  hint: "When this specific Order Form starts",
};

const SUBSCRIPTION_PERIOD_FIELD: FieldDef = {
  key: "subscriptionPeriod",
  label: "Subscription Period",
  kind: "text",
  hint: "How long the license runs before it renews",
  inputPlaceholder: "e.g. 12 months",
};

const NON_RENEWAL_NOTICE_DATE_FIELD: FieldDef = {
  key: "nonRenewalNoticeDate",
  label: "Non-Renewal Notice Date",
  kind: "text",
  hint: "How far before the Subscription Period ends either party must give notice not to renew",
  inputPlaceholder: "e.g. 30 days before the end of the Subscription Period",
};

const PERMITTED_USES_FIELD: FieldDef = {
  key: "permittedUses",
  label: "Permitted Uses",
  kind: "textarea",
  hint: "What Customer is licensed to use the Software for",
  inputPlaceholder: "e.g. internal business operations only",
};

const LICENSE_LIMITS_FIELD: FieldDef = {
  key: "licenseLimits",
  label: "License Limits",
  kind: "textarea",
  hint: "Any limits on the license, e.g. number of users, seats, or environments",
  fallback: "no additional limits beyond the Documentation",
};

const PAYMENT_PROCESS_FIELD: FieldDef = {
  key: "paymentProcess",
  label: "Payment Process",
  kind: "textarea",
  hint: "How and when Fees are invoiced or charged",
  inputPlaceholder: "e.g. invoiced annually in advance, due net 30",
};

const WARRANTY_PERIOD_FIELD: FieldDef = {
  key: "warrantyPeriod",
  label: "Warranty Period",
  kind: "text",
  hint: "How long Provider warrants the Software will conform to the Documentation",
  inputPlaceholder: "e.g. 90 days from installation",
};

const ADDITIONAL_WARRANTIES_FIELD: FieldDef = {
  key: "additionalWarranties",
  label: "Additional Warranties",
  kind: "textarea",
  hint: "Any extra warranties either party makes beyond the standard ones",
  fallback: "no additional warranties beyond those stated in this Agreement",
};

const GENERAL_CAP_AMOUNT_FIELD: FieldDef = {
  key: "generalCapAmount",
  label: "General Cap Amount",
  kind: "text",
  hint: "The liability cap for most claims",
  inputPlaceholder: "e.g. the Fees paid in the 12 months before the claim",
};

const DELETION_PROCEDURE_FIELD: FieldDef = {
  key: "deletionProcedure",
  label: "Deletion Procedure",
  kind: "text",
  hint: "How Customer must delete or uninstall the Software after termination",
  fallback: "Provider's standard process for uninstalling and deleting the Software",
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
    title: "Software",
    body: (d) =>
      `During the ${fieldText(d, SUBSCRIPTION_PERIOD_FIELD)} and subject to the terms of this Agreement, ${providerName(d)} grants ${customerName(d)} a limited, non-exclusive, non-sublicensable, non-transferable license to install and use the Software on systems ${customerName(d)} owns or controls for the following Permitted Uses: ${fieldText(d, PERMITTED_USES_FIELD)}. If a ${customerName(d)} Affiliate enters a separate Order Form with ${providerName(d)}, that creates a separate agreement between ${providerName(d)} and the Affiliate, and ${customerName(d)} is not responsible for its Affiliates' agreements. ${customerName(d)} is responsible for all actions on its Users' accounts and for Users' compliance with this Agreement, and must protect the confidentiality of passwords and login credentials, promptly notifying ${providerName(d)} of any suspected fraudulent activity or compromise. ${customerName(d)} may, but is not required to, give ${providerName(d)} Feedback "AS IS," which ${providerName(d)} may use freely without restriction, and ${providerName(d)} may collect and analyze Usage Data to maintain, improve, and promote its products and services, including using aggregated, de-identified Usage Data to develop or train artificial intelligence or machine learning models, without identifying ${customerName(d)} or its Users. If the Software contains Open Source Software, ${providerName(d)} will use reasonable efforts to deliver any required notices, source code, or materials, and the terms of the applicable Open Source Software license will apply instead of this Agreement to the extent required. During the ${fieldText(d, SUBSCRIPTION_PERIOD_FIELD)}, ${providerName(d)} will provide Updates, including updated Documentation, at no additional charge, and ${customerName(d)} will install all Updates as soon as practicable after receipt. ${providerName(d)} retains all right, title, and interest in and to the Product.`,
  },
  {
    number: 2,
    title: "Restrictions & Obligations",
    body: (d) =>
      `Except as expressly permitted by this Agreement, ${customerName(d)} will not (and will not allow anyone else to) reverse engineer or decompile the Product; sell, sublicense, rent, or otherwise make the Product available to third parties; remove proprietary notices; copy, modify, or create derivative works of the Product; circumvent any protection mechanisms in the Product; publish the results of any performance or functional evaluation without ${providerName(d)}'s prior written approval; use the Product to build a competing product; attempt to gain unauthorized access to any component of the Product or other systems or networks connected to it; use the Product for any High Risk Activity or in violation of Applicable Laws; or use the Product in an Embargoed Country or by a sanctioned party. Use of the Product must comply with the Documentation and the following License Limits: ${fieldText(d, LICENSE_LIMITS_FIELD)}. If ${customerName(d)} has an outstanding, undisputed balance on its account for more than 30 days, breaches the restrictions above, or uses the Product in a way that materially and negatively impacts the Product or others, ${providerName(d)} may temporarily suspend ${customerName(d)}'s access, trying to give notice beforehand when practical, and will reinstate access once ${customerName(d)} resolves the underlying issue.`,
  },
  {
    number: 3,
    title: "Payment & Taxes",
    body: (d) =>
      `Unless the Order Form specifies a different currency, all Fees are in U.S. Dollars, exclusive of taxes, and non-refundable except for the prorated refund of prepaid Fees allowed under specific termination rights in this Agreement. ${customerName(d)} will pay Fees and taxes according to the following Payment Process: ${fieldText(d, PAYMENT_PROCESS_FIELD)}. ${customerName(d)} is responsible for all duties, taxes, and levies that apply to Fees, other than ${providerName(d)}'s income taxes, that ${providerName(d)} itemizes and includes in an invoice. If ${customerName(d)} has a good-faith disagreement about Fees charged or invoiced, it must notify ${providerName(d)} before payment is due (or within 30 days of an automatic payment) and pay all undisputed amounts on time; the parties will work together to resolve the dispute within 15 days, after which either party may pursue any remedies available under this Agreement or Applicable Laws.`,
  },
  {
    number: 4,
    title: "Term & Termination",
    body: (d) =>
      `For each Order Form, this Agreement will start on the ${formatDate(fieldValue(d, "orderDate"))}, continue through the ${fieldText(d, SUBSCRIPTION_PERIOD_FIELD)}, and automatically renew for additional Subscription Periods unless a party gives notice of non-renewal by the ${fieldText(d, NON_RENEWAL_NOTICE_DATE_FIELD)}. The Framework Terms will start on the ${formatDate(fieldValue(d, "effectiveDate"))} and continue for the longer of one year or until all Order Forms governed by them have ended. Either party may terminate the Framework Terms or an Order Form immediately if the other party fails to cure a material breach following 30 days notice, materially breaches in a manner that cannot be cured, dissolves without a successor, makes an assignment for the benefit of creditors, or becomes subject to insolvency or bankruptcy proceedings lasting more than 60 days. Neither party is liable for a delay or failure to perform caused by a Force Majeure Event, and either party may terminate an affected Order Form if the Force Majeure Event prevents the Product from materially operating for 30 or more consecutive days, in which case ${providerName(d)} will refund a prorated share of prepaid Fees, though this does not excuse ${customerName(d)}'s obligation to pay Fees accrued before termination. Upon any expiration or termination, ${customerName(d)} will no longer have the right to use the Product and will follow the ${fieldText(d, DELETION_PROCEDURE_FIELD)} to remove the Software, each Recipient will return or destroy the other's Confidential Information in its possession, and ${providerName(d)} will submit a final invoice for outstanding Fees, which ${customerName(d)} will pay. Certain sections — including Feedback and Usage Data, Reservation of Rights, Restrictions, Payment & Taxes (for amounts accrued before termination), Effect of Termination, Representations & Warranties, Disclaimer of Warranties, Limitation of Liability, Indemnification, Confidentiality, and General Terms — survive expiration or termination, and each Recipient may retain the other's Confidential Information under its standard backup or record retention policies, subject to continuing confidentiality obligations.`,
  },
  {
    number: 5,
    title: "Representations & Warranties",
    body: (d) =>
      `Each party represents and warrants that it has the legal power and authority to enter into this Agreement, is duly organized, validly existing, and in good standing under the laws of its jurisdiction of origin, will comply with all Applicable Laws in performing its obligations, and will comply with the following Additional Warranties: ${fieldText(d, ADDITIONAL_WARRANTIES_FIELD)}. ${providerName(d)} warrants that, for the ${fieldText(d, WARRANTY_PERIOD_FIELD)}, the Software will substantially conform in all material respects to the Documentation when installed, operated, and used according to this Agreement. This warranty does not apply to Software modified or damaged by ${customerName(d)}, used other than as permitted, affected by ${customerName(d)}'s failure to install Updates within a reasonable time, or affected by ${customerName(d)}'s material breach of this Agreement. If ${providerName(d)} breaches this warranty, it will, as applicable, repair or replace the defective Software, amend or replace inaccurate Documentation, or replace the Software with a functionally equivalent alternative — ${customerName(d)}'s exclusive remedy and ${providerName(d)}'s entire liability for a breach of this warranty.`,
  },
  {
    number: 6,
    title: "Disclaimer of Warranties",
    body: (d) =>
      `${providerName(d)} makes no guarantee that the Product will always be safe, secure, or error-free, or that it will function without disruption, delay, or imperfection, and the warranties above do not apply to any misuse or unauthorized modification of the Product or to any product or service provided by anyone other than ${providerName(d)}. Except for those warranties, ${providerName(d)} and ${customerName(d)} each disclaim all other warranties and conditions, whether express or implied, including the implied warranties of merchantability, fitness for a particular purpose, title, and non-infringement, to the maximum extent permitted by Applicable Laws.`,
  },
  {
    number: 7,
    title: "Limitation of Liability",
    body: (d) =>
      `Except for any Increased Claims or Unlimited Claims specified in the Key Terms, each party's total cumulative liability for all claims arising out of or relating to this Agreement will not be more than ${fieldText(d, GENERAL_CAP_AMOUNT_FIELD)}. Except for those exceptions, under no circumstances will either party be liable to the other for lost profits or revenues, or for consequential, special, indirect, exemplary, punitive, or incidental damages relating to this Agreement, even if informed of the possibility of such damages in advance — including lost or corrupted data, the cost of replacing or restoring data, business interruption, failure to realize expected savings, the cost of substitute products or services, loss of goodwill, or reputational damage. These limitations and waivers apply to all liability, whether in tort (including negligence), contract, breach of statutory duty, or otherwise, and do not apply to a breach of Confidentiality, ${customerName(d)}'s breach of the license or restrictions above, or to the extent prohibited by Applicable Laws.`,
  },
  {
    number: 8,
    title: "Indemnification",
    body: (d) =>
      `${providerName(d)} will indemnify, defend, and hold harmless ${customerName(d)} from all Provider Covered Claims brought by third parties, and all related out-of-pocket damages, awards, settlements, costs, and reasonable attorneys' fees. ${customerName(d)} will indemnify, defend, and hold harmless ${providerName(d)} from all Customer Covered Claims brought by third parties, and all related out-of-pocket damages, awards, settlements, costs, and reasonable attorneys' fees. Each party's indemnification obligations are contingent on the other promptly notifying it of the claim, providing reasonable assistance at the indemnifying party's expense, and giving it sole control over the defense and settlement, provided any settlement admitting fault or materially and adversely affecting the protected party requires its prior written consent. If required by a settlement or court order, or reasonably necessary in response to a Provider Covered Claim, ${providerName(d)} may obtain the right for ${customerName(d)} to continue using the Product, replace or modify the affected component without materially reducing functionality, or, if neither is reasonable, terminate the affected Order Form and refund a prorated share of prepaid Fees. ${providerName(d)}'s indemnification obligations do not apply to claims resulting from unauthorized modifications, unauthorized use, use combined with items not provided by ${providerName(d)}, or use of an outdated version of the Product where an available Update would have avoided the claim. This section, together with any termination rights, is each party's exclusive remedy and the other's entire liability for a Covered Claim.`,
  },
  {
    number: 9,
    title: "Confidentiality",
    body: (d) =>
      `Except as authorized under this Agreement or needed to perform its obligations, a Recipient will not use or disclose a Discloser's Confidential Information and will protect it using at least the same protections it uses for its own similar information, but no less than a reasonable standard of care. Confidential Information excludes information the Recipient already knew without confidentiality obligations, that becomes publicly available through no fault of the Recipient, that it rightfully receives from someone else without confidentiality restrictions, or that it independently develops without reference to the Confidential Information. A Recipient may disclose Confidential Information to the extent required by Applicable Laws, giving the Discloser reasonable advance notice and cooperation where legally permitted, and may disclose it to Users, employees, advisors, contractors, and representatives with a need to know, so long as they are bound by confidentiality obligations at least as protective as this section and the Recipient remains responsible for their compliance. ${providerName(d)} may also use and disclose ${customerName(d)}'s Confidential Information as necessary to provide the Product and Services.`,
  },
  {
    number: 10,
    title: "General Terms",
    body: (d) =>
      `This Agreement is the only agreement between the parties about its subject and supersedes all prior statements about it; ${providerName(d)} rejects any terms in ${customerName(d)}'s purchase order or similar documents, which may only be used for accounting or administrative purposes. Any waiver, modification, or change must be in writing and signed or electronically accepted by each party, and if a term is held invalid or unenforceable, the remaining terms stay in full force and effect. The laws of ${fieldText(d, GOVERNING_LAW_FIELD)} will govern all interpretations and disputes about this Agreement, and the parties submit to the exclusive jurisdiction of the courts in ${fieldText(d, CHOSEN_COURTS_FIELD)}. Despite that choice of forum, a breach of Confidentiality or violation of a party's intellectual property rights may cause irreparable harm, and the non-breaching party may seek equitable relief, including an injunction, without the need to post a bond, and seeking one remedy does not limit a party's other rights or remedies. Neither party may assign this Agreement without the other's prior written consent, except either party may assign it in connection with a merger, change of control, reorganization, or sale of substantially all its assets, and any non-permitted assignment is void. If ${providerName(d)} gives ${customerName(d)} access to a Beta Product, it is provided "AS IS" without the Software warranty above and may be modified or removed at ${providerName(d)}'s discretion. ${providerName(d)} may identify ${customerName(d)} and use its name and logo in marketing as a user of its products, but may not otherwise make public announcements referencing ${customerName(d)} without its prior approval. Notices must be in writing and sent to the notice address specified for each party above. The parties are independent contractors, not agents, partners, or joint venturers, and there are no third-party beneficiaries of this Agreement. ${customerName(d)} may not export the Product in violation of U.S. export control laws and represents that it is not located in, organized under the laws of, or owned by a party from an Embargoed Country, nor on any government sanctions list, and ${providerName(d)} may terminate this Agreement immediately to comply with export controls or sanctions laws. Neither party will take any action that would violate anti-bribery laws such as the U.S. Foreign Corrupt Practices Act or the UK Bribery Act 2010. This Agreement may be signed in counterparts, including by electronic copies or acceptance mechanism, each of which will be deemed an original.`,
  },
];

export const softwareLicenseAgreementModule: DocumentModule = {
  id: "software-license-agreement",
  title: "Software License Agreement",
  pdfFilename: "Software-License-Agreement.pdf",
  fields: [
    EFFECTIVE_DATE_FIELD,
    ORDER_DATE_FIELD,
    SUBSCRIPTION_PERIOD_FIELD,
    NON_RENEWAL_NOTICE_DATE_FIELD,
    PERMITTED_USES_FIELD,
    LICENSE_LIMITS_FIELD,
    PAYMENT_PROCESS_FIELD,
    WARRANTY_PERIOD_FIELD,
    ADDITIONAL_WARRANTIES_FIELD,
    GENERAL_CAP_AMOUNT_FIELD,
    DELETION_PROCEDURE_FIELD,
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
      nonRenewalNoticeDate: "",
      permittedUses: "",
      licenseLimits: "",
      paymentProcess: "",
      warrantyPeriod: "",
      additionalWarranties: "",
      generalCapAmount: "",
      deletionProcedure: "",
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
