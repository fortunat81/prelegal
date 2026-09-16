import { Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer";
import {
  NdaFormData,
  confidentialityTermText,
  formatDate,
  mndaTermText,
  standardTermsClauses,
} from "@/lib/nda";

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

export default function NdaPdfDocument({ data }: { data: NdaFormData }) {
  return (
    <Document title="Mutual Non-Disclosure Agreement">
      <Page size="LETTER" style={styles.page}>
        <Text style={styles.title}>Mutual Non-Disclosure Agreement</Text>
        <Text style={styles.sectionHeading}>Cover Page</Text>

        <Text style={styles.fieldLabel}>Purpose</Text>
        <Text style={styles.hint}>How Confidential Information may be used</Text>
        <Text style={styles.fieldValue}>{data.purpose || "[Purpose]"}</Text>

        <Text style={styles.fieldLabel}>Effective Date</Text>
        <Text style={styles.fieldValue}>{formatDate(data.effectiveDate)}</Text>

        <Text style={styles.fieldLabel}>MNDA Term</Text>
        <Text style={styles.hint}>The length of this MNDA</Text>
        <Text style={styles.fieldValue}>{mndaTermText(data)}</Text>

        <Text style={styles.fieldLabel}>Term of Confidentiality</Text>
        <Text style={styles.hint}>How long Confidential Information is protected</Text>
        <Text style={styles.fieldValue}>{confidentialityTermText(data)}</Text>

        <Text style={styles.fieldLabel}>Governing Law &amp; Jurisdiction</Text>
        <Text style={styles.fieldValue}>
          Governing Law: {data.governingLaw || "[Fill in state]"}
        </Text>
        <Text style={styles.fieldValue}>
          Jurisdiction: {data.jurisdiction || "[Fill in city or county and state]"}
        </Text>

        {data.modifications ? (
          <>
            <Text style={styles.fieldLabel}>MNDA Modifications</Text>
            <Text style={styles.fieldValue}>{data.modifications}</Text>
          </>
        ) : null}

        <View style={styles.table}>
          <View style={styles.tableRow}>
            <Text style={styles.tableCellHeader}></Text>
            <Text style={styles.tableCellHeader}>Party 1</Text>
            <Text style={styles.tableCellHeaderLast}>Party 2</Text>
          </View>
          <View style={styles.tableRow}>
            <Text style={styles.tableCellLabel}>Signature</Text>
            <Text style={styles.tableCell}> </Text>
            <Text style={styles.tableCellLast}> </Text>
          </View>
          <View style={styles.tableRow}>
            <Text style={styles.tableCellLabel}>Print Name</Text>
            <Text style={styles.tableCell}>{data.party1.name}</Text>
            <Text style={styles.tableCellLast}>{data.party2.name}</Text>
          </View>
          <View style={styles.tableRow}>
            <Text style={styles.tableCellLabel}>Title</Text>
            <Text style={styles.tableCell}>{data.party1.title}</Text>
            <Text style={styles.tableCellLast}>{data.party2.title}</Text>
          </View>
          <View style={styles.tableRow}>
            <Text style={styles.tableCellLabel}>Company</Text>
            <Text style={styles.tableCell}>{data.party1.company}</Text>
            <Text style={styles.tableCellLast}>{data.party2.company}</Text>
          </View>
          <View style={styles.tableRow}>
            <Text style={styles.tableCellLabel}>Notice Address</Text>
            <Text style={styles.tableCell}>{data.party1.noticeAddress}</Text>
            <Text style={styles.tableCellLast}>{data.party2.noticeAddress}</Text>
          </View>
          <View style={styles.tableRowLast}>
            <Text style={styles.tableCellLabel}>Date</Text>
            <Text style={styles.tableCell}> </Text>
            <Text style={styles.tableCellLast}> </Text>
          </View>
        </View>

        <Text style={styles.sectionHeading}>Standard Terms</Text>
        {standardTermsClauses.map((clause) => (
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
