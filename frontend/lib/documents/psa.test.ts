import { describe, expect, it } from "vitest";
import { psaModule } from "./psa";

describe("psaModule", () => {
  it("has entities for provider and customer with empty default values", () => {
    const data = psaModule.defaultData();
    expect(data.entities.provider).toEqual({ legalName: "", signatoryName: "", signatoryTitle: "", noticeAddress: "" });
    expect(data.entities.customer).toEqual({ legalName: "", signatoryName: "", signatoryTitle: "", noticeAddress: "" });
  });

  it("shows bracketed placeholders for party names in clause bodies when unfilled", () => {
    const data = psaModule.defaultData();
    const servicesClause = psaModule.clauses.find((c) => c.title === "Services")!;
    const body = servicesClause.body(data);
    expect(body).toContain("[Provider]");
    expect(body).toContain("[Customer]");
  });

  it("substitutes party legal names into clause bodies once filled in", () => {
    const data = psaModule.defaultData();
    data.entities.provider.legalName = "Acme Inc.";
    data.entities.customer.legalName = "Beta LLC";
    const servicesClause = psaModule.clauses.find((c) => c.title === "Services")!;
    const body = servicesClause.body(data);
    expect(body).toContain("Acme Inc.");
    expect(body).toContain("Beta LLC");
    expect(body).not.toContain("[Provider]");
    expect(body).not.toContain("[Customer]");
  });

  it("falls back to the default text for an empty Customer Obligations field", () => {
    const data = psaModule.defaultData();
    const servicesClause = psaModule.clauses.find((c) => c.title === "Services")!;
    expect(servicesClause.body(data)).toContain("no additional obligations beyond reasonable cooperation");
  });

  it("formats the effective date consistently with the shared date formatter", () => {
    const data = psaModule.defaultData();
    data.values.effectiveDate = "2026-01-01";
    const termClause = psaModule.clauses.find((c) => c.title === "Term & Termination")!;
    expect(termClause.body(data)).toContain("January 1, 2026");
  });

  it("substitutes the governing law and chosen courts fields into the General Terms clause", () => {
    const data = psaModule.defaultData();
    data.values.governingLaw = "Delaware";
    data.values.chosenCourts = "New Castle, DE";
    const generalTermsClause = psaModule.clauses.find((c) => c.title === "General Terms")!;
    const body = generalTermsClause.body(data);
    expect(body).toContain("Delaware");
    expect(body).toContain("New Castle, DE");
  });
});
