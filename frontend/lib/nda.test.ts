import { describe, expect, it } from "vitest";
import {
  clampYears,
  confidentialityTermText,
  defaultNdaFormData,
  formatDate,
  governingLawText,
  jurisdictionText,
  mergeNdaFormData,
  mndaTermText,
  partyFieldText,
  purposeText,
  standardTermsClauses,
} from "./nda";

describe("clampYears", () => {
  it("floors empty input to 1", () => {
    expect(clampYears("")).toBe(1);
  });

  it("floors zero to 1", () => {
    expect(clampYears("0")).toBe(1);
  });

  it("floors negative numbers to 1", () => {
    expect(clampYears("-5")).toBe(1);
  });

  it("floors non-numeric input to 1", () => {
    expect(clampYears("abc")).toBe(1);
  });

  it("passes through valid positive integers", () => {
    expect(clampYears("7")).toBe(7);
  });
});

describe("formatDate", () => {
  it("returns a placeholder for an empty date", () => {
    expect(formatDate("")).toBe("[Today's date]");
  });

  it("formats a yyyy-mm-dd date without an off-by-one day shift", () => {
    expect(formatDate("2026-01-01")).toBe("January 1, 2026");
    expect(formatDate("2026-12-31")).toBe("December 31, 2026");
  });
});

describe("mndaTermText", () => {
  it("describes an expiring term", () => {
    const data = defaultNdaFormData();
    data.mndaTermType = "expires";
    data.mndaTermYears = 3;
    expect(mndaTermText(data)).toBe("Expires 3 year(s) from Effective Date.");
  });

  it("describes a term that continues until terminated", () => {
    const data = defaultNdaFormData();
    data.mndaTermType = "continues";
    expect(mndaTermText(data)).toBe(
      "Continues until terminated in accordance with the terms of the MNDA."
    );
  });
});

describe("confidentialityTermText", () => {
  it("describes a fixed number of years", () => {
    const data = defaultNdaFormData();
    data.confidentialityTermType = "years";
    data.confidentialityTermYears = 2;
    expect(confidentialityTermText(data)).toContain("2 year(s) from Effective Date");
  });

  it("describes perpetuity", () => {
    const data = defaultNdaFormData();
    data.confidentialityTermType = "perpetuity";
    expect(confidentialityTermText(data)).toBe("In perpetuity.");
  });
});

describe("fallback text helpers", () => {
  it("shows placeholders when fields are blank", () => {
    const data = defaultNdaFormData();
    data.purpose = "";
    data.governingLaw = "";
    data.jurisdiction = "";
    expect(purposeText(data)).toBe("[Purpose]");
    expect(governingLawText(data)).toBe("[Fill in state]");
    expect(jurisdictionText(data)).toBe("[Fill in city or county and state]");
  });

  it("shows the actual value when fields are filled", () => {
    const data = defaultNdaFormData();
    data.purpose = "Evaluating a partnership.";
    data.governingLaw = "Delaware";
    data.jurisdiction = "New Castle, DE";
    expect(purposeText(data)).toBe("Evaluating a partnership.");
    expect(governingLawText(data)).toBe("Delaware");
    expect(jurisdictionText(data)).toBe("New Castle, DE");
  });

  it("falls back to an em dash for blank party fields", () => {
    expect(partyFieldText("")).toBe("—");
    expect(partyFieldText("Jane Doe")).toBe("Jane Doe");
  });
});

describe("mergeNdaFormData", () => {
  it("applies a top-level scalar patch without touching other fields", () => {
    const data = defaultNdaFormData();
    const merged = mergeNdaFormData(data, { governingLaw: "Delaware" });
    expect(merged.governingLaw).toBe("Delaware");
    expect(merged.purpose).toBe(data.purpose);
  });

  it("merges a partial party1 patch without wiping out other party1 fields", () => {
    const data = defaultNdaFormData();
    data.party1 = { name: "Jane Doe", title: "CEO", company: "Acme", noticeAddress: "1 Main St" };
    const merged = mergeNdaFormData(data, { party1: { company: "Acme Inc." } });
    expect(merged.party1).toEqual({
      name: "Jane Doe",
      title: "CEO",
      company: "Acme Inc.",
      noticeAddress: "1 Main St",
    });
  });

  it("merges party2 independently of party1", () => {
    const data = defaultNdaFormData();
    data.party1 = { name: "Jane Doe", title: "", company: "", noticeAddress: "" };
    const merged = mergeNdaFormData(data, { party2: { name: "John Smith" } });
    expect(merged.party1.name).toBe("Jane Doe");
    expect(merged.party2.name).toBe("John Smith");
  });

  it("is a no-op for an empty patch", () => {
    const data = defaultNdaFormData();
    expect(mergeNdaFormData(data, {})).toEqual(data);
  });
});

describe("standardTermsClauses", () => {
  it("substitutes the purpose into clauses 1 and 2", () => {
    const data = defaultNdaFormData();
    data.purpose = "Evaluating a strategic partnership";
    const introduction = standardTermsClauses.find((c) => c.number === 1)!;
    const useAndProtection = standardTermsClauses.find((c) => c.number === 2)!;
    expect(introduction.body(data)).toContain("Evaluating a strategic partnership");
    expect(useAndProtection.body(data)).toContain("Evaluating a strategic partnership");
  });

  it("substitutes governing law and jurisdiction into clause 9", () => {
    const data = defaultNdaFormData();
    data.governingLaw = "Delaware";
    data.jurisdiction = "New Castle, DE";
    const governingLawClause = standardTermsClauses.find((c) => c.number === 9)!;
    const text = governingLawClause.body(data);
    expect(text).toContain("State of Delaware");
    expect(text).toContain("located in New Castle, DE");
  });

  it("keeps preview-facing placeholders in clause bodies when fields are blank", () => {
    const data = defaultNdaFormData();
    data.governingLaw = "";
    data.jurisdiction = "";
    const governingLawClause = standardTermsClauses.find((c) => c.number === 9)!;
    expect(governingLawClause.body(data)).toContain("[Fill in state]");
    expect(governingLawClause.body(data)).toContain("[Fill in city or county and state]");
  });
});
