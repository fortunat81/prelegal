export { clampYears, formatDate } from "./nda";

export interface EntityInfo {
  legalName: string;
  signatoryName: string;
  signatoryTitle: string;
  noticeAddress: string;
}

export function emptyEntity(): EntityInfo {
  return { legalName: "", signatoryName: "", signatoryTitle: "", noticeAddress: "" };
}

export interface FieldDef {
  key: string;
  label: string;
  kind: "text" | "textarea" | "date";
  hint?: string;
  inputPlaceholder?: string;
  /** Fallback text shown in the preview/PDF when empty. Defaults to "[Fill in <label>]". */
  fallback?: string;
}

export interface EntityDef {
  key: string;
  roleLabel: string;
}

export interface ClauseDef {
  number: number;
  title: string;
  body: (data: GenericFormData) => string;
}

export interface GenericFormData {
  values: Record<string, string>;
  entities: Record<string, EntityInfo>;
}

export type GenericFormPatch = Record<string, string | Partial<EntityInfo> | undefined>;

export interface DocumentModule {
  id: string;
  title: string;
  pdfFilename: string;
  fields: FieldDef[];
  entities: EntityDef[];
  defaultData(): GenericFormData;
  clauses: ClauseDef[];
}

export function fieldValue(data: GenericFormData, key: string): string {
  return data.values[key] ?? "";
}

export function fieldText(data: GenericFormData, field: FieldDef): string {
  return data.values[field.key] || field.fallback || `[Fill in ${field.label}]`;
}

export function entityFieldText(value: string): string {
  return value || "—";
}

export function entityNameText(data: GenericFormData, entityKey: string, roleLabel: string): string {
  return data.entities[entityKey]?.legalName || `[${roleLabel}]`;
}

export function mergeGenericFormData(
  documentModule: DocumentModule,
  data: GenericFormData,
  patch: GenericFormPatch,
): GenericFormData {
  const entityKeys = new Set(documentModule.entities.map((entity) => entity.key));
  const nextValues = { ...data.values };
  const nextEntities = { ...data.entities };

  for (const [key, patchValue] of Object.entries(patch)) {
    if (patchValue === undefined) continue;
    if (entityKeys.has(key)) {
      nextEntities[key] = { ...nextEntities[key], ...(patchValue as Partial<EntityInfo>) };
    } else if (typeof patchValue === "string") {
      nextValues[key] = patchValue;
    }
  }

  return { values: nextValues, entities: nextEntities };
}
