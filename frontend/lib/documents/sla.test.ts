import { describe, expect, it } from "vitest";
import { slaModule } from "./sla";

describe("slaModule", () => {
  it("has entities for provider and customer with empty default values", () => {
    const data = slaModule.defaultData();
    expect(data.entities.provider).toEqual({ legalName: "", signatoryName: "", signatoryTitle: "", noticeAddress: "" });
    expect(data.entities.customer).toEqual({ legalName: "", signatoryName: "", signatoryTitle: "", noticeAddress: "" });
  });

  it("shows bracketed placeholders for party names and field fallbacks in clause bodies when unfilled", () => {
    const data = slaModule.defaultData();
    const uptimeClause = slaModule.clauses.find((c) => c.title === "Uptime")!;
    const body = uptimeClause.body(data);
    expect(body).toContain("[Provider]");
    expect(body).toContain("[Customer]");
    expect(body).toContain("[Fill in Target Uptime]");
  });

  it("substitutes party legal names into clause bodies once filled in", () => {
    const data = slaModule.defaultData();
    data.entities.provider.legalName = "Acme Inc.";
    data.entities.customer.legalName = "Beta LLC";
    const responseClause = slaModule.clauses.find((c) => c.title === "Response Time")!;
    const body = responseClause.body(data);
    expect(body).toContain("Acme Inc.");
    expect(body).toContain("Beta LLC");
    expect(body).not.toContain("[Provider]");
    expect(body).not.toContain("[Customer]");
  });

  it("substitutes the Uptime Credit and Response Time Credit fields into the Remedies clause", () => {
    const data = slaModule.defaultData();
    data.values.uptimeCredit = "5% of monthly fees per 1% below target";
    data.values.responseTimeCredit = "5% of monthly fees per missed response";
    const remediesClause = slaModule.clauses.find((c) => c.title === "Remedies")!;
    const body = remediesClause.body(data);
    expect(body).toContain("5% of monthly fees per 1% below target");
    expect(body).toContain("5% of monthly fees per missed response");
  });
});
