import { describe, expect, it } from "vitest";
import { baaModule } from "./baa";
import { pilotAgreementModule } from "./pilotAgreement";

describe("baaModule", () => {
  it("has entities for provider and company with empty default values", () => {
    const data = baaModule.defaultData();
    expect(data.entities.provider).toEqual({ legalName: "", signatoryName: "", signatoryTitle: "", noticeAddress: "" });
    expect(data.entities.company).toEqual({ legalName: "", signatoryName: "", signatoryTitle: "", noticeAddress: "" });
  });

  it("shows bracketed placeholders for party names in clause bodies when unfilled", () => {
    const data = baaModule.defaultData();
    const obligationsClause = baaModule.clauses.find((c) => c.title === "Business Associate Obligations")!;
    const body = obligationsClause.body(data);
    expect(body).toContain("[Provider]");
    expect(body).toContain("[Company]");
  });

  it("substitutes party legal names into clause bodies once filled in", () => {
    const data = baaModule.defaultData();
    data.entities.provider.legalName = "Acme Inc.";
    data.entities.company.legalName = "Beta LLC";
    const obligationsClause = baaModule.clauses.find((c) => c.title === "Business Associate Obligations")!;
    const body = obligationsClause.body(data);
    expect(body).toContain("Acme Inc.");
    expect(body).toContain("Beta LLC");
    expect(body).not.toContain("[Provider]");
    expect(body).not.toContain("[Company]");
  });

  it("falls back to 'no additional restrictions' for an empty Limitations field", () => {
    const data = baaModule.defaultData();
    const restrictionsClause = baaModule.clauses.find((c) => c.title === "Data Rights & Restrictions")!;
    expect(restrictionsClause.body(data)).toContain("no additional restrictions");
  });

  it("formats the BAA effective date consistently with the shared date formatter", () => {
    const data = baaModule.defaultData();
    data.values.baaEffectiveDate = "2026-01-01";
    const termClause = baaModule.clauses.find((c) => c.title === "Term & Termination")!;
    expect(termClause.body(data)).toContain("January 1, 2026");
  });
});

describe("pilotAgreementModule", () => {
  it("has entities for provider and customer with empty default values", () => {
    const data = pilotAgreementModule.defaultData();
    expect(data.entities.provider).toEqual({ legalName: "", signatoryName: "", signatoryTitle: "", noticeAddress: "" });
    expect(data.entities.customer).toEqual({ legalName: "", signatoryName: "", signatoryTitle: "", noticeAddress: "" });
  });

  it("shows bracketed placeholders for party names in clause bodies when unfilled", () => {
    const data = pilotAgreementModule.defaultData();
    const accessClause = pilotAgreementModule.clauses.find((c) => c.title === "Pilot Access")!;
    const body = accessClause.body(data);
    expect(body).toContain("[Provider]");
    expect(body).toContain("[Customer]");
  });

  it("substitutes party legal names into clause bodies once filled in", () => {
    const data = pilotAgreementModule.defaultData();
    data.entities.provider.legalName = "Acme Inc.";
    data.entities.customer.legalName = "Beta LLC";
    const accessClause = pilotAgreementModule.clauses.find((c) => c.title === "Pilot Access")!;
    const body = accessClause.body(data);
    expect(body).toContain("Acme Inc.");
    expect(body).toContain("Beta LLC");
  });

  it("substitutes the governing law and chosen courts fields into the General Terms clause", () => {
    const data = pilotAgreementModule.defaultData();
    data.values.governingLaw = "Delaware";
    data.values.chosenCourts = "New Castle, DE";
    const generalTermsClause = pilotAgreementModule.clauses.find((c) => c.title === "General Terms")!;
    const body = generalTermsClause.body(data);
    expect(body).toContain("Delaware");
    expect(body).toContain("New Castle, DE");
  });
});
