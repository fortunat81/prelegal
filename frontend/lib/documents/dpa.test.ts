import { describe, expect, it } from "vitest";
import { dpaModule } from "./dpa";

describe("dpaModule", () => {
  it("has entities for provider and customer with empty default values", () => {
    const data = dpaModule.defaultData();
    expect(data.entities.provider).toEqual({ legalName: "", signatoryName: "", signatoryTitle: "", noticeAddress: "" });
    expect(data.entities.customer).toEqual({ legalName: "", signatoryName: "", signatoryTitle: "", noticeAddress: "" });
  });

  it("shows bracketed placeholders for party names in clause bodies when unfilled", () => {
    const data = dpaModule.defaultData();
    const processingClause = dpaModule.clauses.find((c) => c.title === "Processing")!;
    const body = processingClause.body(data);
    expect(body).toContain("[Provider]");
    expect(body).toContain("[Customer]");
  });

  it("substitutes party legal names into clause bodies once filled in", () => {
    const data = dpaModule.defaultData();
    data.entities.provider.legalName = "Acme Inc.";
    data.entities.customer.legalName = "Beta LLC";
    const relationshipsClause = dpaModule.clauses.find(
      (c) => c.title === "Processor and Subprocessor Relationships",
    )!;
    const body = relationshipsClause.body(data);
    expect(body).toContain("Acme Inc.");
    expect(body).toContain("Beta LLC");
    expect(body).not.toContain("[Provider]");
    expect(body).not.toContain("[Customer]");
  });

  it("falls back to 'no additional restrictions or safeguards' for an empty Special Category Data Restrictions field", () => {
    const data = dpaModule.defaultData();
    const processingClause = dpaModule.clauses.find((c) => c.title === "Processing")!;
    expect(processingClause.body(data)).toContain("no additional restrictions or safeguards");
  });

  it("substitutes the base agreement reference into the Conflicts Between Documents clause", () => {
    const data = dpaModule.defaultData();
    data.values.agreement = "the Cloud Service Agreement dated January 1, 2026";
    const conflictsClause = dpaModule.clauses.find((c) => c.title === "Conflicts Between Documents")!;
    expect(conflictsClause.body(data)).toContain("the Cloud Service Agreement dated January 1, 2026");
  });

  it("substitutes the governing member state into the Restricted Transfers clause", () => {
    const data = dpaModule.defaultData();
    data.values.governingMemberState = "Ireland";
    const transfersClause = dpaModule.clauses.find((c) => c.title === "Restricted Transfers")!;
    expect(transfersClause.body(data)).toContain("Ireland");
  });
});
