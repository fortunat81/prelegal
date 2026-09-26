import { describe, expect, it } from "vitest";
import { baaModule } from "./documents/baa";
import {
  entityFieldText,
  entityNameText,
  fieldText,
  fieldValue,
  mergeGenericFormData,
} from "./genericDocument";

describe("fieldValue", () => {
  it("returns an empty string for a missing key", () => {
    const data = baaModule.defaultData();
    expect(fieldValue(data, "doesNotExist")).toBe("");
  });

  it("returns the stored value for a known key", () => {
    const data = baaModule.defaultData();
    data.values.agreement = "the Cloud Service Agreement";
    expect(fieldValue(data, "agreement")).toBe("the Cloud Service Agreement");
  });
});

describe("fieldText", () => {
  const agreementField = baaModule.fields.find((f) => f.key === "agreement")!;
  const limitationsField = baaModule.fields.find((f) => f.key === "limitations")!;

  it("falls back to the field's custom fallback text when empty", () => {
    const data = baaModule.defaultData();
    expect(fieldText(data, limitationsField)).toBe("no additional restrictions");
  });

  it("falls back to a generated [Fill in Label] placeholder when no custom fallback is set", () => {
    const data = baaModule.defaultData();
    expect(fieldText(data, agreementField)).toBe("[Fill in Base Agreement]");
  });

  it("returns the value when filled in", () => {
    const data = baaModule.defaultData();
    data.values.agreement = "the Cloud Service Agreement";
    expect(fieldText(data, agreementField)).toBe("the Cloud Service Agreement");
  });
});

describe("entityFieldText", () => {
  it("returns an em dash for an empty value", () => {
    expect(entityFieldText("")).toBe("—");
  });

  it("returns the value when filled in", () => {
    expect(entityFieldText("Acme Inc.")).toBe("Acme Inc.");
  });
});

describe("entityNameText", () => {
  it("returns a bracketed role placeholder when the entity's legal name is empty", () => {
    const data = baaModule.defaultData();
    expect(entityNameText(data, "provider", "Provider")).toBe("[Provider]");
  });

  it("returns the entity's legal name when set", () => {
    const data = baaModule.defaultData();
    data.entities.provider.legalName = "Acme Inc.";
    expect(entityNameText(data, "provider", "Provider")).toBe("Acme Inc.");
  });
});

describe("mergeGenericFormData", () => {
  it("merges a scalar field patch without disturbing other fields", () => {
    const data = baaModule.defaultData();
    data.values.agreement = "original agreement";
    const merged = mergeGenericFormData(baaModule, data, { breachNotificationPeriod: "10 days" });
    expect(merged.values.breachNotificationPeriod).toBe("10 days");
    expect(merged.values.agreement).toBe("original agreement");
  });

  it("merges a partial entity patch without wiping sibling entity fields", () => {
    const data = baaModule.defaultData();
    data.entities.provider.legalName = "Acme Inc.";
    const merged = mergeGenericFormData(baaModule, data, { provider: { signatoryName: "Jane Doe" } });
    expect(merged.entities.provider.legalName).toBe("Acme Inc.");
    expect(merged.entities.provider.signatoryName).toBe("Jane Doe");
  });

  it("merges each entity independently", () => {
    const data = baaModule.defaultData();
    const merged = mergeGenericFormData(baaModule, data, {
      provider: { legalName: "Acme Inc." },
      company: { legalName: "Beta LLC" },
    });
    expect(merged.entities.provider.legalName).toBe("Acme Inc.");
    expect(merged.entities.company.legalName).toBe("Beta LLC");
  });

  it("is a no-op for an empty patch", () => {
    const data = baaModule.defaultData();
    data.values.agreement = "original agreement";
    const merged = mergeGenericFormData(baaModule, data, {});
    expect(merged).toEqual(data);
  });

  it("ignores undefined patch values", () => {
    const data = baaModule.defaultData();
    data.values.agreement = "original agreement";
    const merged = mergeGenericFormData(baaModule, data, { agreement: undefined });
    expect(merged.values.agreement).toBe("original agreement");
  });
});
