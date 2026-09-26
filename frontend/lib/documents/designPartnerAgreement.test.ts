import { describe, expect, it } from "vitest";
import { designPartnerAgreementModule } from "./designPartnerAgreement";

describe("designPartnerAgreementModule", () => {
  it("has entities for provider and partner with empty default values", () => {
    const data = designPartnerAgreementModule.defaultData();
    expect(data.entities.provider).toEqual({ legalName: "", signatoryName: "", signatoryTitle: "", noticeAddress: "" });
    expect(data.entities.partner).toEqual({ legalName: "", signatoryName: "", signatoryTitle: "", noticeAddress: "" });
  });

  it("shows bracketed placeholders for party names in clause bodies when unfilled", () => {
    const data = designPartnerAgreementModule.defaultData();
    const overviewClause = designPartnerAgreementModule.clauses.find((c) => c.title === "Design Partner Overview")!;
    const body = overviewClause.body(data);
    expect(body).toContain("[Provider]");
    expect(body).toContain("[Partner]");
  });

  it("substitutes party legal names into clause bodies once filled in", () => {
    const data = designPartnerAgreementModule.defaultData();
    data.entities.provider.legalName = "Acme Inc.";
    data.entities.partner.legalName = "Beta LLC";
    const overviewClause = designPartnerAgreementModule.clauses.find((c) => c.title === "Design Partner Overview")!;
    const body = overviewClause.body(data);
    expect(body).toContain("Acme Inc.");
    expect(body).toContain("Beta LLC");
    expect(body).not.toContain("[Provider]");
    expect(body).not.toContain("[Partner]");
  });

  it("falls back to '$0' for an empty Fees field", () => {
    const data = designPartnerAgreementModule.defaultData();
    const feesClause = designPartnerAgreementModule.clauses.find((c) => c.title === "Fees and Costs")!;
    expect(feesClause.body(data)).toContain("$0");
  });

  it("substitutes the governing law and chosen courts fields into the General Terms clause", () => {
    const data = designPartnerAgreementModule.defaultData();
    data.values.governingLaw = "Delaware";
    data.values.chosenCourts = "New Castle, DE";
    const generalTermsClause = designPartnerAgreementModule.clauses.find((c) => c.title === "General Terms")!;
    const body = generalTermsClause.body(data);
    expect(body).toContain("Delaware");
    expect(body).toContain("New Castle, DE");
  });

  it("formats the effective date consistently with the shared date formatter", () => {
    const data = designPartnerAgreementModule.defaultData();
    data.values.effectiveDate = "2026-01-01";
    const termClause = designPartnerAgreementModule.clauses.find((c) => c.title === "Term & Termination")!;
    expect(termClause.body(data)).toContain("January 1, 2026");
  });
});
