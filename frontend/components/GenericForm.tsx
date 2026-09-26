"use client";

import { DocumentModule, EntityInfo, GenericFormData } from "@/lib/genericDocument";

function EntityFields({
  entity,
  onChange,
}: {
  entity: EntityInfo;
  onChange: (entity: EntityInfo) => void;
}) {
  return (
    <div>
      <div className="field">
        <label>
          Legal Name
          <input
            type="text"
            value={entity.legalName}
            onChange={(e) => onChange({ ...entity, legalName: e.target.value })}
          />
        </label>
      </div>
      <div className="field">
        <label>
          Signatory Name
          <input
            type="text"
            value={entity.signatoryName}
            onChange={(e) => onChange({ ...entity, signatoryName: e.target.value })}
          />
        </label>
      </div>
      <div className="field">
        <label>
          Signatory Title
          <input
            type="text"
            value={entity.signatoryTitle}
            onChange={(e) => onChange({ ...entity, signatoryTitle: e.target.value })}
          />
        </label>
      </div>
      <div className="field">
        <label>
          Notice Address
          <span className="hint">Email or postal address</span>
          <textarea
            value={entity.noticeAddress}
            onChange={(e) => onChange({ ...entity, noticeAddress: e.target.value })}
          />
        </label>
      </div>
    </div>
  );
}

interface GenericFormProps {
  documentModule: DocumentModule;
  data: GenericFormData;
  onChange: (data: GenericFormData) => void;
}

export default function GenericForm({ documentModule, data, onChange }: GenericFormProps) {
  const setValue = (key: string, value: string) =>
    onChange({ ...data, values: { ...data.values, [key]: value } });
  const setEntity = (key: string, entity: EntityInfo) =>
    onChange({ ...data, entities: { ...data.entities, [key]: entity } });

  return (
    <>
      <div className="panel">
        <h2>Agreement Details</h2>

        {documentModule.fields.map((field) => (
          <div className="field" key={field.key}>
            <label>
              {field.label}
              {field.hint && <span className="hint">{field.hint}</span>}
              {field.kind === "textarea" ? (
                <textarea
                  value={data.values[field.key] ?? ""}
                  onChange={(e) => setValue(field.key, e.target.value)}
                  placeholder={field.inputPlaceholder}
                />
              ) : (
                <input
                  type={field.kind === "date" ? "date" : "text"}
                  value={data.values[field.key] ?? ""}
                  onChange={(e) => setValue(field.key, e.target.value)}
                  placeholder={field.inputPlaceholder}
                />
              )}
            </label>
          </div>
        ))}
      </div>

      {documentModule.entities.map((entity) => (
        <div className="panel" key={entity.key}>
          <h2>{entity.roleLabel}</h2>
          <EntityFields
            entity={data.entities[entity.key]}
            onChange={(value) => setEntity(entity.key, value)}
          />
        </div>
      ))}
    </>
  );
}
