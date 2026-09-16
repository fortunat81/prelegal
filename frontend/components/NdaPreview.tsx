import {
  NdaFormData,
  confidentialityTermText,
  formatDate,
  mndaTermText,
  standardTermsClauses,
} from "@/lib/nda";

export default function NdaPreview({ data }: { data: NdaFormData }) {
  return (
    <div className="document">
      <h1>Mutual Non-Disclosure Agreement</h1>

      <h2>Cover Page</h2>

      <h3>Purpose</h3>
      <p>{data.purpose || "[Purpose]"}</p>

      <h3>Effective Date</h3>
      <p>{formatDate(data.effectiveDate)}</p>

      <h3>MNDA Term</h3>
      <p>{mndaTermText(data)}</p>

      <h3>Term of Confidentiality</h3>
      <p>{confidentialityTermText(data)}</p>

      <h3>Governing Law &amp; Jurisdiction</h3>
      <p>Governing Law: {data.governingLaw || "[Fill in state]"}</p>
      <p>Jurisdiction: {data.jurisdiction || "[Fill in city or county and state]"}</p>

      {data.modifications && (
        <>
          <h3>MNDA Modifications</h3>
          <p>{data.modifications}</p>
        </>
      )}

      <table>
        <thead>
          <tr>
            <th></th>
            <th>Party 1</th>
            <th>Party 2</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Print Name</td>
            <td>{data.party1.name || "—"}</td>
            <td>{data.party2.name || "—"}</td>
          </tr>
          <tr>
            <td>Title</td>
            <td>{data.party1.title || "—"}</td>
            <td>{data.party2.title || "—"}</td>
          </tr>
          <tr>
            <td>Company</td>
            <td>{data.party1.company || "—"}</td>
            <td>{data.party2.company || "—"}</td>
          </tr>
          <tr>
            <td>Notice Address</td>
            <td>{data.party1.noticeAddress || "—"}</td>
            <td>{data.party2.noticeAddress || "—"}</td>
          </tr>
        </tbody>
      </table>

      <hr />

      <h2>Standard Terms</h2>
      {standardTermsClauses.map((clause) => (
        <p className="clause" key={clause.number}>
          <strong>
            {clause.number}. {clause.title}.
          </strong>{" "}
          {clause.body(data)}
        </p>
      ))}
    </div>
  );
}
