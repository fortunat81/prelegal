"use client";

import { NdaFormData, PartyInfo } from "@/lib/nda";

interface NdaFormProps {
  data: NdaFormData;
  onChange: (data: NdaFormData) => void;
}

function PartyFields({
  label,
  party,
  onChange,
}: {
  label: string;
  party: PartyInfo;
  onChange: (party: PartyInfo) => void;
}) {
  return (
    <div>
      <div className="field">
        <label>
          Print Name
          <input
            type="text"
            value={party.name}
            onChange={(e) => onChange({ ...party, name: e.target.value })}
          />
        </label>
      </div>
      <div className="field">
        <label>
          Title
          <input
            type="text"
            value={party.title}
            onChange={(e) => onChange({ ...party, title: e.target.value })}
          />
        </label>
      </div>
      <div className="field">
        <label>
          Company
          <input
            type="text"
            value={party.company}
            onChange={(e) => onChange({ ...party, company: e.target.value })}
          />
        </label>
      </div>
      <div className="field">
        <label>
          Notice Address
          <span className="hint">Email or postal address</span>
          <textarea
            value={party.noticeAddress}
            onChange={(e) => onChange({ ...party, noticeAddress: e.target.value })}
          />
        </label>
      </div>
    </div>
  );
}

export default function NdaForm({ data, onChange }: NdaFormProps) {
  const set = <K extends keyof NdaFormData>(key: K, value: NdaFormData[K]) =>
    onChange({ ...data, [key]: value });

  return (
    <>
      <div className="panel">
        <h2>Agreement Details</h2>

        <div className="field">
          <label>
            Purpose
            <span className="hint">How Confidential Information may be used</span>
            <textarea
              value={data.purpose}
              onChange={(e) => set("purpose", e.target.value)}
            />
          </label>
        </div>

        <div className="field">
          <label>
            Effective Date
            <input
              type="date"
              value={data.effectiveDate}
              onChange={(e) => set("effectiveDate", e.target.value)}
            />
          </label>
        </div>

        <div className="field">
          <label>MNDA Term</label>
          <span className="hint">The length of this MNDA</span>
          <div className="radio-option">
            <input
              type="radio"
              name="mndaTermType"
              checked={data.mndaTermType === "expires"}
              onChange={() => set("mndaTermType", "expires")}
            />
            <span>
              Expires
              <input
                type="number"
                min={1}
                className="years-input"
                value={data.mndaTermYears}
                onChange={(e) => set("mndaTermYears", Number(e.target.value))}
                disabled={data.mndaTermType !== "expires"}
              />
              year(s) from Effective Date.
            </span>
          </div>
          <div className="radio-option">
            <input
              type="radio"
              name="mndaTermType"
              checked={data.mndaTermType === "continues"}
              onChange={() => set("mndaTermType", "continues")}
            />
            <span>Continues until terminated in accordance with the terms of the MNDA.</span>
          </div>
        </div>

        <div className="field">
          <label>Term of Confidentiality</label>
          <span className="hint">How long Confidential Information is protected</span>
          <div className="radio-option">
            <input
              type="radio"
              name="confidentialityTermType"
              checked={data.confidentialityTermType === "years"}
              onChange={() => set("confidentialityTermType", "years")}
            />
            <span>
              <input
                type="number"
                min={1}
                className="years-input"
                value={data.confidentialityTermYears}
                onChange={(e) => set("confidentialityTermYears", Number(e.target.value))}
                disabled={data.confidentialityTermType !== "years"}
              />
              year(s) from Effective Date, but in the case of trade secrets until Confidential
              Information is no longer considered a trade secret under applicable laws.
            </span>
          </div>
          <div className="radio-option">
            <input
              type="radio"
              name="confidentialityTermType"
              checked={data.confidentialityTermType === "perpetuity"}
              onChange={() => set("confidentialityTermType", "perpetuity")}
            />
            <span>In perpetuity.</span>
          </div>
        </div>

        <div className="field">
          <label>
            Governing Law
            <span className="hint">State</span>
            <input
              type="text"
              value={data.governingLaw}
              onChange={(e) => set("governingLaw", e.target.value)}
              placeholder="e.g. Delaware"
            />
          </label>
        </div>

        <div className="field">
          <label>
            Jurisdiction
            <span className="hint">City or county and state, e.g. &ldquo;New Castle, DE&rdquo;</span>
            <input
              type="text"
              value={data.jurisdiction}
              onChange={(e) => set("jurisdiction", e.target.value)}
              placeholder="e.g. New Castle, DE"
            />
          </label>
        </div>

        <div className="field">
          <label>
            MNDA Modifications
            <span className="hint">Optional — list any modifications to the MNDA</span>
            <textarea
              value={data.modifications}
              onChange={(e) => set("modifications", e.target.value)}
            />
          </label>
        </div>
      </div>

      <div className="panel">
        <h2>Party 1</h2>
        <PartyFields
          label="Party 1"
          party={data.party1}
          onChange={(party) => set("party1", party)}
        />
      </div>

      <div className="panel">
        <h2>Party 2</h2>
        <PartyFields
          label="Party 2"
          party={data.party2}
          onChange={(party) => set("party2", party)}
        />
      </div>
    </>
  );
}
