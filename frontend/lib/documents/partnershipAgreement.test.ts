import { describe, expect, it } from "vitest";
import { partnershipAgreementModule } from "./partnershipAgreement";

describe("partnershipAgreementModule", () => {
  it("has entities for company and partner with empty default values", () => {
    const data = partnershipAgreementModule.defaultData();
    expect(data.entities.company).toEqual({ legalName: "", signatoryName: "", signatoryTitle: "", noticeAddress: "" });
    expect(data.entities.partner).toEqual({ legalName: "", signatoryName: "", signatoryTitle: "", noticeAddress: "" });
  });

  it("shows bracketed placeholders for party names in clause bodies when unfilled", () => {
    const data = partnershipAgreementModule.defaultData();
    const cooperationClause = partnershipAgreementModule.clauses.find((c) => c.title === "Cooperation")!;
    const body = cooperationClause.body(data);
    expect(body).toContain("[Company]");
    expect(body).toContain("[Partner]");
  });

  it("falls back to placeholder text for empty obligations and brand guidelines fields", () => {
    const data = partnershipAgreementModule.defaultData();
    const cooperationClause = partnershipAgreementModule.clauses.find((c) => c.title === "Cooperation")!;
    expect(cooperationClause.body(data)).toContain("[Fill in Company's Obligations]");
    const trademarkClause = partnershipAgreementModule.clauses.find((c) => c.title === "Trademark License")!;
    expect(trademarkClause.body(data)).toContain("no additional brand guidelines beyond this Agreement");
  });

  it("substitutes party legal names into clause bodies once filled in", () => {
    const data = partnershipAgreementModule.defaultData();
    data.entities.company.legalName = "Acme Inc.";
    data.entities.partner.legalName = "Beta LLC";
    const cooperationClause = partnershipAgreementModule.clauses.find((c) => c.title === "Cooperation")!;
    const body = cooperationClause.body(data);
    expect(body).toContain("Acme Inc.");
    expect(body).toContain("Beta LLC");
    expect(body).not.toContain("[Company]");
    expect(body).not.toContain("[Partner]");
  });

  it("substitutes the governing law and chosen courts fields into the General Terms clause", () => {
    const data = partnershipAgreementModule.defaultData();
    data.values.governingLaw = "Delaware";
    data.values.chosenCourts = "New Castle, DE";
    const generalTermsClause = partnershipAgreementModule.clauses.find((c) => c.title === "General Terms")!;
    const body = generalTermsClause.body(data);
    expect(body).toContain("Delaware");
    expect(body).toContain("New Castle, DE");
  });

  it("formats the effective and end dates consistently with the shared date formatter", () => {
    const data = partnershipAgreementModule.defaultData();
    data.values.effectiveDate = "2026-01-01";
    data.values.endDate = "2027-01-01";
    const termClause = partnershipAgreementModule.clauses.find((c) => c.title === "Term & Termination")!;
    const body = termClause.body(data);
    expect(body).toContain("January 1, 2026");
    expect(body).toContain("January 1, 2027");
  });
});
