import { DocumentModule, GenericFormData, entityFieldText, fieldText, formatDate } from "@/lib/genericDocument";

export default function GenericPreview({
  documentModule,
  data,
}: {
  documentModule: DocumentModule;
  data: GenericFormData;
}) {
  return (
    <div className="document">
      <h1>{documentModule.title}</h1>

      <h2>Cover Page</h2>

      {documentModule.fields.map((field) => (
        <div key={field.key}>
          <h3>{field.label}</h3>
          <p>{field.kind === "date" ? formatDate(data.values[field.key] ?? "") : fieldText(data, field)}</p>
        </div>
      ))}

      <table>
        <thead>
          <tr>
            <th></th>
            {documentModule.entities.map((entity) => (
              <th key={entity.key}>{entity.roleLabel}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Legal Name</td>
            {documentModule.entities.map((entity) => (
              <td key={entity.key}>{entityFieldText(data.entities[entity.key]?.legalName ?? "")}</td>
            ))}
          </tr>
          <tr>
            <td>Signatory Name</td>
            {documentModule.entities.map((entity) => (
              <td key={entity.key}>{entityFieldText(data.entities[entity.key]?.signatoryName ?? "")}</td>
            ))}
          </tr>
          <tr>
            <td>Signatory Title</td>
            {documentModule.entities.map((entity) => (
              <td key={entity.key}>{entityFieldText(data.entities[entity.key]?.signatoryTitle ?? "")}</td>
            ))}
          </tr>
          <tr>
            <td>Notice Address</td>
            {documentModule.entities.map((entity) => (
              <td key={entity.key}>{entityFieldText(data.entities[entity.key]?.noticeAddress ?? "")}</td>
            ))}
          </tr>
        </tbody>
      </table>

      <hr />

      <h2>Standard Terms</h2>
      {documentModule.clauses.map((clause) => (
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
