import { describe, expect, it } from "vitest";
import { softwareLicenseAgreementModule } from "./softwareLicenseAgreement";

describe("softwareLicenseAgreementModule", () => {
  it("has entities for provider and customer with empty default values", () => {
    const data = softwareLicenseAgreementModule.defaultData();
    expect(data.entities.provider).toEqual({ legalName: "", signatoryName: "", signatoryTitle: "", noticeAddress: "" });
    expect(data.entities.customer).toEqual({ legalName: "", signatoryName: "", signatoryTitle: "", noticeAddress: "" });
  });

  it("shows bracketed placeholders for party names in clause bodies when unfilled", () => {
    const data = softwareLicenseAgreementModule.defaultData();
    const softwareClause = softwareLicenseAgreementModule.clauses.find((c) => c.title === "Software")!;
    const body = softwareClause.body(data);
    expect(body).toContain("[Provider]");
    expect(body).toContain("[Customer]");
  });

  it("falls back to a default License Limits description when the field is empty", () => {
    const data = softwareLicenseAgreementModule.defaultData();
    const restrictionsClause = softwareLicenseAgreementModule.clauses.find((c) => c.title === "Restrictions & Obligations")!;
    expect(restrictionsClause.body(data)).toContain("no additional limits beyond the Documentation");
  });

  it("substitutes party legal names into clause bodies once filled in", () => {
    const data = softwareLicenseAgreementModule.defaultData();
    data.entities.provider.legalName = "Acme Inc.";
    data.entities.customer.legalName = "Beta LLC";
    const softwareClause = softwareLicenseAgreementModule.clauses.find((c) => c.title === "Software")!;
    const body = softwareClause.body(data);
    expect(body).toContain("Acme Inc.");
    expect(body).toContain("Beta LLC");
    expect(body).not.toContain("[Provider]");
    expect(body).not.toContain("[Customer]");
  });

  it("substitutes the governing law and chosen courts fields into the General Terms clause", () => {
    const data = softwareLicenseAgreementModule.defaultData();
    data.values.governingLaw = "Delaware";
    data.values.chosenCourts = "New Castle, DE";
    const generalTermsClause = softwareLicenseAgreementModule.clauses.find((c) => c.title === "General Terms")!;
    const body = generalTermsClause.body(data);
    expect(body).toContain("Delaware");
    expect(body).toContain("New Castle, DE");
  });

  it("formats the order date consistently with the shared date formatter", () => {
    const data = softwareLicenseAgreementModule.defaultData();
    data.values.orderDate = "2026-01-01";
    const termClause = softwareLicenseAgreementModule.clauses.find((c) => c.title === "Term & Termination")!;
    expect(termClause.body(data)).toContain("January 1, 2026");
  });
});
