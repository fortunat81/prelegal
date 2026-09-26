import { Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer";
import { DocumentModule, GenericFormData, entityFieldText, fieldText, formatDate } from "@/lib/genericDocument";

const styles = StyleSheet.create({
  page: {
    paddingTop: 48,
    paddingBottom: 48,
    paddingHorizontal: 56,
    fontSize: 10,
    fontFamily: "Helvetica",
    lineHeight: 1.4,
  },
  title: {
    fontSize: 16,
    fontFamily: "Helvetica-Bold",
    textAlign: "center",
    marginBottom: 18,
  },
  sectionHeading: {
    fontSize: 12,
    fontFamily: "Helvetica-Bold",
    marginTop: 16,
    marginBottom: 8,
  },
  fieldLabel: {
    fontSize: 10,
    fontFamily: "Helvetica-Bold",
    marginTop: 10,
    marginBottom: 2,
  },
  fieldValue: {
    marginBottom: 2,
  },
  table: {
    marginTop: 14,
    borderWidth: 1,
    borderColor: "#999999",
  },
  tableRow: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderColor: "#999999",
  },
  tableRowLast: {
    flexDirection: "row",
  },
  tableCellHeader: {
    flex: 1,
    padding: 6,
    fontFamily: "Helvetica-Bold",
    borderRightWidth: 1,
    borderColor: "#999999",
  },
  tableCellHeaderLast: {
    flex: 1,
    padding: 6,
    fontFamily: "Helvetica-Bold",
  },
  tableCellLabel: {
    flex: 0.6,
    padding: 6,
    fontFamily: "Helvetica-Bold",
    borderRightWidth: 1,
    borderColor: "#999999",
  },
  tableCell: {
    flex: 1,
    padding: 6,
    borderRightWidth: 1,
    borderColor: "#999999",
  },
  tableCellLast: {
    flex: 1,
    padding: 6,
  },
  clause: {
    marginBottom: 8,
  },
  clauseNumber: {
    fontFamily: "Helvetica-Bold",
  },
  hint: {
    fontSize: 8,
    color: "#666666",
    marginBottom: 2,
  },
});

export default function GenericPdfDocument({
  documentModule,
  data,
}: {
  documentModule: DocumentModule;
  data: GenericFormData;
}) {
  const lastEntityIndex = documentModule.entities.length - 1;

  return (
    <Document title={documentModule.title}>
      <Page size="LETTER" style={styles.page}>
        <Text style={styles.title}>{documentModule.title}</Text>
        <Text style={styles.sectionHeading}>Cover Page</Text>

        {documentModule.fields.map((field) => (
          <View key={field.key}>
            <Text style={styles.fieldLabel}>{field.label}</Text>
            {field.hint && <Text style={styles.hint}>{field.hint}</Text>}
            <Text style={styles.fieldValue}>
              {field.kind === "date" ? formatDate(data.values[field.key] ?? "") : fieldText(data, field)}
            </Text>
          </View>
        ))}

        <View style={styles.table}>
          <View style={styles.tableRow}>
            <Text style={styles.tableCellHeader}></Text>
            {documentModule.entities.map((entity, index) => (
              <Text
                key={entity.key}
                style={index === lastEntityIndex ? styles.tableCellHeaderLast : styles.tableCellHeader}
              >
                {entity.roleLabel}
              </Text>
            ))}
          </View>
          <View style={styles.tableRow}>
            <Text style={styles.tableCellLabel}>Signature</Text>
            {documentModule.entities.map((entity, index) => (
              <Text key={entity.key} style={index === lastEntityIndex ? styles.tableCellLast : styles.tableCell}>
                {" "}
              </Text>
            ))}
          </View>
          <View style={styles.tableRow}>
            <Text style={styles.tableCellLabel}>Legal Name</Text>
            {documentModule.entities.map((entity, index) => (
              <Text key={entity.key} style={index === lastEntityIndex ? styles.tableCellLast : styles.tableCell}>
                {entityFieldText(data.entities[entity.key]?.legalName ?? "")}
              </Text>
            ))}
          </View>
          <View style={styles.tableRow}>
            <Text style={styles.tableCellLabel}>Signatory Name</Text>
            {documentModule.entities.map((entity, index) => (
              <Text key={entity.key} style={index === lastEntityIndex ? styles.tableCellLast : styles.tableCell}>
                {entityFieldText(data.entities[entity.key]?.signatoryName ?? "")}
              </Text>
            ))}
          </View>
          <View style={styles.tableRow}>
            <Text style={styles.tableCellLabel}>Signatory Title</Text>
            {documentModule.entities.map((entity, index) => (
              <Text key={entity.key} style={index === lastEntityIndex ? styles.tableCellLast : styles.tableCell}>
                {entityFieldText(data.entities[entity.key]?.signatoryTitle ?? "")}
              </Text>
            ))}
          </View>
          <View style={styles.tableRow}>
            <Text style={styles.tableCellLabel}>Notice Address</Text>
            {documentModule.entities.map((entity, index) => (
              <Text key={entity.key} style={index === lastEntityIndex ? styles.tableCellLast : styles.tableCell}>
                {entityFieldText(data.entities[entity.key]?.noticeAddress ?? "")}
              </Text>
            ))}
          </View>
          <View style={styles.tableRowLast}>
            <Text style={styles.tableCellLabel}>Date</Text>
            {documentModule.entities.map((entity, index) => (
              <Text key={entity.key} style={index === lastEntityIndex ? styles.tableCellLast : styles.tableCell}>
                {" "}
              </Text>
            ))}
          </View>
        </View>

        <Text style={styles.sectionHeading}>Standard Terms</Text>
        {documentModule.clauses.map((clause) => (
          <Text key={clause.number} style={styles.clause}>
            <Text style={styles.clauseNumber}>
              {clause.number}. {clause.title}.{" "}
            </Text>
            {clause.body(data)}
          </Text>
        ))}
      </Page>
    </Document>
  );
}
