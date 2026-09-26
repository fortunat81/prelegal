import { describe, expect, it } from "vitest";
import { aiAddendumModule } from "./aiAddendum";

describe("aiAddendumModule", () => {
  it("has entities for provider and customer with empty default values", () => {
    const data = aiAddendumModule.defaultData();
    expect(data.entities.provider).toEqual({ legalName: "", signatoryName: "", signatoryTitle: "", noticeAddress: "" });
    expect(data.entities.customer).toEqual({ legalName: "", signatoryName: "", signatoryTitle: "", noticeAddress: "" });
  });

  it("shows bracketed placeholders for party names in clause bodies when unfilled", () => {
    const data = aiAddendumModule.defaultData();
    const aiServicesClause = aiAddendumModule.clauses.find((c) => c.title === "AI Services")!;
    const body = aiServicesClause.body(data);
    expect(body).toContain("[Provider]");
    expect(body).toContain("[Customer]");
  });

  it("substitutes party legal names into clause bodies once filled in", () => {
    const data = aiAddendumModule.defaultData();
    data.entities.provider.legalName = "Acme Inc.";
    data.entities.customer.legalName = "Beta LLC";
    const aiServicesClause = aiAddendumModule.clauses.find((c) => c.title === "AI Services")!;
    const body = aiServicesClause.body(data);
    expect(body).toContain("Acme Inc.");
    expect(body).toContain("Beta LLC");
    expect(body).not.toContain("[Provider]");
    expect(body).not.toContain("[Customer]");
  });

  it("falls back to 'no additional restrictions' for empty Training and Improvement Restrictions fields", () => {
    const data = aiAddendumModule.defaultData();
    const aiServicesClause = aiAddendumModule.clauses.find((c) => c.title === "AI Services")!;
    const body = aiServicesClause.body(data);
    expect(body).toContain("no Training Data");
    expect(body).toContain("no Training Purposes");
    expect((body.match(/no additional restrictions/g) ?? []).length).toBe(2);
  });

  it("substitutes the Base Agreement field into the AI Services clause", () => {
    const data = aiAddendumModule.defaultData();
    data.values.agreement = "the Cloud Service Agreement dated January 1, 2026";
    const aiServicesClause = aiAddendumModule.clauses.find((c) => c.title === "AI Services")!;
    expect(aiServicesClause.body(data)).toContain("the Cloud Service Agreement dated January 1, 2026");
  });
});
