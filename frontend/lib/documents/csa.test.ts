import { describe, expect, it } from "vitest";
import { csaModule } from "./csa";

describe("csaModule", () => {
  it("has entities for provider and customer with empty default values", () => {
    const data = csaModule.defaultData();
    expect(data.entities.provider).toEqual({ legalName: "", signatoryName: "", signatoryTitle: "", noticeAddress: "" });
    expect(data.entities.customer).toEqual({ legalName: "", signatoryName: "", signatoryTitle: "", noticeAddress: "" });
  });

  it("shows bracketed placeholders for party names in clause bodies when unfilled", () => {
    const data = csaModule.defaultData();
    const serviceClause = csaModule.clauses.find((c) => c.title === "Service")!;
    const body = serviceClause.body(data);
    expect(body).toContain("[Provider]");
    expect(body).toContain("[Customer]");
  });

  it("falls back to 'no additional use limitations' for an empty Use Limitations field", () => {
    const data = csaModule.defaultData();
    const restrictionsClause = csaModule.clauses.find((c) => c.title === "Restrictions & Obligations")!;
    expect(restrictionsClause.body(data)).toContain("no additional use limitations");
  });

  it("substitutes party legal names into clause bodies once filled in", () => {
    const data = csaModule.defaultData();
    data.entities.provider.legalName = "Acme Inc.";
    data.entities.customer.legalName = "Beta LLC";
    const serviceClause = csaModule.clauses.find((c) => c.title === "Service")!;
    const body = serviceClause.body(data);
    expect(body).toContain("Acme Inc.");
    expect(body).toContain("Beta LLC");
    expect(body).not.toContain("[Provider]");
    expect(body).not.toContain("[Customer]");
  });

  it("substitutes the liability cap fields into the Limitation of Liability clause", () => {
    const data = csaModule.defaultData();
    data.values.generalCapAmount = "$100,000";
    data.values.increasedCapAmount = "$500,000";
    const liabilityClause = csaModule.clauses.find((c) => c.title === "Limitation of Liability")!;
    const body = liabilityClause.body(data);
    expect(body).toContain("$100,000");
    expect(body).toContain("$500,000");
  });

  it("formats the Order Date consistently with the shared date formatter", () => {
    const data = csaModule.defaultData();
    data.values.orderDate = "2026-01-01";
    const termClause = csaModule.clauses.find((c) => c.title === "Term & Termination")!;
    expect(termClause.body(data)).toContain("January 1, 2026");
  });
});
