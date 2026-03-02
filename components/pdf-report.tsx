import {
  Document,
  Page,
  View,
  Text,
  StyleSheet,
} from "@react-pdf/renderer";
import {
  type CalculatorInputs,
  type CalculatorResults,
  formatCurrency,
} from "@/lib/calculator";
import { EQUIPMENT_AGE_OPTIONS } from "@/lib/constants";

// ── Brand Colors ─────────────────────────────────────────────────────
const NAVY = "#1a2332";
const RED = "#d32f2f";
const TEAL = "#00897b";
const GREEN = "#7ab800";
const GRAY = "#666666";
const LIGHT_GRAY = "#f5f5f5";
const WHITE = "#ffffff";

// ── Styles ───────────────────────────────────────────────────────────
const s = StyleSheet.create({
  page: {
    padding: 40,
    fontSize: 10,
    fontFamily: "Helvetica",
    color: "#333333",
  },
  // Header
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 24,
    borderBottom: `2px solid ${NAVY}`,
    paddingBottom: 12,
  },
  title: {
    fontSize: 20,
    fontFamily: "Helvetica-Bold",
    color: NAVY,
  },
  subtitle: {
    fontSize: 10,
    color: GRAY,
    marginTop: 4,
  },
  brand: {
    fontSize: 12,
    fontFamily: "Helvetica-Bold",
    color: GREEN,
  },
  // Section headers
  sectionHeader: {
    fontSize: 13,
    fontFamily: "Helvetica-Bold",
    color: NAVY,
    marginTop: 18,
    marginBottom: 8,
    borderBottom: `1px solid ${NAVY}`,
    paddingBottom: 4,
  },
  // Table
  tableRow: {
    flexDirection: "row",
    borderBottom: "1px solid #e0e0e0",
    paddingVertical: 4,
  },
  tableRowAlt: {
    flexDirection: "row",
    borderBottom: "1px solid #e0e0e0",
    paddingVertical: 4,
    backgroundColor: LIGHT_GRAY,
  },
  tableLabel: {
    width: "55%",
    paddingLeft: 6,
  },
  tableValue: {
    width: "45%",
    textAlign: "right",
    paddingRight: 6,
    fontFamily: "Helvetica-Bold",
  },
  // Cost summary box
  costBox: {
    flexDirection: "row",
    marginTop: 8,
    gap: 12,
  },
  costCard: {
    flex: 1,
    padding: 12,
    borderRadius: 4,
  },
  costCardLabel: {
    fontSize: 9,
    color: WHITE,
    marginBottom: 4,
  },
  costCardValue: {
    fontSize: 18,
    fontFamily: "Helvetica-Bold",
    color: WHITE,
  },
  // Breakdown table
  breakdownRow: {
    flexDirection: "row",
    borderBottom: "1px solid #e0e0e0",
    paddingVertical: 5,
  },
  breakdownName: {
    width: "50%",
    paddingLeft: 6,
  },
  breakdownCost: {
    width: "25%",
    textAlign: "right",
    fontFamily: "Helvetica-Bold",
  },
  breakdownPct: {
    width: "25%",
    textAlign: "right",
    paddingRight: 6,
    color: GRAY,
  },
  // Metrics grid
  metricsGrid: {
    flexDirection: "row",
    gap: 10,
    marginTop: 8,
  },
  metricCard: {
    flex: 1,
    padding: 10,
    backgroundColor: LIGHT_GRAY,
    borderRadius: 4,
    alignItems: "center",
  },
  metricValue: {
    fontSize: 16,
    fontFamily: "Helvetica-Bold",
    color: NAVY,
  },
  metricLabel: {
    fontSize: 8,
    color: GRAY,
    marginTop: 3,
    textAlign: "center",
  },
  // ROI section
  roiRow: {
    flexDirection: "row",
    gap: 12,
    marginTop: 8,
  },
  roiCard: {
    flex: 1,
    padding: 10,
    borderRadius: 4,
    alignItems: "center",
  },
  roiValue: {
    fontSize: 14,
    fontFamily: "Helvetica-Bold",
  },
  roiLabel: {
    fontSize: 8,
    marginTop: 3,
    textAlign: "center",
  },
  // Footer
  footer: {
    position: "absolute",
    bottom: 30,
    left: 40,
    right: 40,
    borderTop: `1px solid #e0e0e0`,
    paddingTop: 8,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  footerText: {
    fontSize: 7,
    color: GRAY,
  },
});

// ── Helpers ──────────────────────────────────────────────────────────

function getAgeLabel(age: string): string {
  return EQUIPMENT_AGE_OPTIONS.find((o) => o.value === age)?.label ?? `${age} years`;
}

function pct(cost: number, total: number): string {
  if (total === 0) return "0%";
  return ((cost / total) * 100).toFixed(1) + "%";
}

// ── Component ────────────────────────────────────────────────────────

interface PdfReportProps {
  inputs: CalculatorInputs;
  results: CalculatorResults;
  generatedDate: string;
}

export function PdfReport({ inputs, results, generatedDate }: PdfReportProps) {
  return (
    <Document>
      <Page size="LETTER" style={s.page}>
        {/* 1. Header */}
        <View style={s.headerRow}>
          <View>
            <Text style={s.title}>Cost of Inaction Analysis</Text>
            <Text style={s.subtitle}>Generated {generatedDate}</Text>
          </View>
          <Text style={s.brand}>Epiphan Video</Text>
        </View>

        {/* 2. Campus Profile */}
        <Text style={s.sectionHeader}>Campus Profile</Text>
        <View>
          {[
            ["Lecture-Capture Rooms", String(inputs.rooms)],
            ["Equipment Age", getAgeLabel(inputs.equipmentAge)],
            ["Lectures per Room / Week", String(inputs.lecturesPerWeek)],
            ["Teaching Weeks / Year", String(inputs.teachWeeks)],
            ["Enrolled Students", inputs.students.toLocaleString("en-US")],
            ["Average Tuition", formatCurrency(inputs.tuition)],
            ["IT Staff Salary (avg)", formatCurrency(inputs.itSalary)],
            ["Current AV Support FTEs", String(inputs.currentFTE)],
          ].map(([label, value], i) => (
            <View key={i} style={i % 2 === 0 ? s.tableRow : s.tableRowAlt}>
              <Text style={s.tableLabel}>{label}</Text>
              <Text style={s.tableValue}>{value}</Text>
            </View>
          ))}
        </View>

        {/* 3. Cost Summary */}
        <Text style={s.sectionHeader}>Cost Summary</Text>
        <View style={s.costBox}>
          <View style={[s.costCard, { backgroundColor: NAVY }]}>
            <Text style={s.costCardLabel}>Annual Cost of Inaction</Text>
            <Text style={s.costCardValue}>
              {formatCurrency(results.annualCost)}
            </Text>
          </View>
          <View style={[s.costCard, { backgroundColor: RED }]}>
            <Text style={s.costCardLabel}>3-Year Exposure</Text>
            <Text style={s.costCardValue}>
              {formatCurrency(results.threeYearCost)}
            </Text>
          </View>
        </View>

        {/* 4. Cost Breakdown */}
        <Text style={s.sectionHeader}>Cost Breakdown</Text>
        <View>
          {results.categories.map((cat, i) => (
            <View
              key={i}
              style={[
                s.breakdownRow,
                i % 2 !== 0 ? { backgroundColor: LIGHT_GRAY } : {},
              ]}
            >
              <Text style={s.breakdownName}>{cat.name}</Text>
              <Text style={s.breakdownCost}>{formatCurrency(cat.cost)}</Text>
              <Text style={s.breakdownPct}>
                {pct(cat.cost, results.annualCost)}
              </Text>
            </View>
          ))}
        </View>

        {/* 5. Key Metrics */}
        <Text style={s.sectionHeader}>Key Metrics</Text>
        <View style={s.metricsGrid}>
          <View style={s.metricCard}>
            <Text style={s.metricValue}>
              {results.hoursReclaimed.toLocaleString("en-US")}
            </Text>
            <Text style={s.metricLabel}>IT Hours Reclaimed / Year</Text>
          </View>
          <View style={s.metricCard}>
            <Text style={s.metricValue}>
              {results.missedLectures.toLocaleString("en-US")}
            </Text>
            <Text style={s.metricLabel}>Missed Lectures / Year</Text>
          </View>
          <View style={s.metricCard}>
            <Text style={s.metricValue}>{results.currentRoomsPerPerson}</Text>
            <Text style={s.metricLabel}>Rooms per FTE</Text>
          </View>
          <View style={s.metricCard}>
            <Text style={s.metricValue}>{results.paybackMonths} mo</Text>
            <Text style={s.metricLabel}>Payback Period</Text>
          </View>
        </View>

        {/* 6. Solution ROI */}
        <Text style={s.sectionHeader}>Solution ROI</Text>
        <View style={s.roiRow}>
          <View style={[s.roiCard, { backgroundColor: LIGHT_GRAY }]}>
            <Text style={[s.roiValue, { color: NAVY }]}>
              {formatCurrency(results.totalInvestment)}
            </Text>
            <Text style={[s.roiLabel, { color: GRAY }]}>
              Total Investment
            </Text>
          </View>
          <View style={[s.roiCard, { backgroundColor: TEAL }]}>
            <Text style={[s.roiValue, { color: WHITE }]}>
              {results.paybackMonths} months
            </Text>
            <Text style={[s.roiLabel, { color: WHITE }]}>Payback Period</Text>
          </View>
          <View style={[s.roiCard, { backgroundColor: GREEN }]}>
            <Text style={[s.roiValue, { color: WHITE }]}>
              {results.roi3Year}%
            </Text>
            <Text style={[s.roiLabel, { color: WHITE }]}>3-Year ROI</Text>
          </View>
        </View>

        {/* 7. Footer */}
        <View style={s.footer}>
          <Text style={s.footerText}>
            Based on industry research and Epiphan customer benchmarks.
            Individual results may vary.
          </Text>
          <Text style={s.footerText}>Generated {generatedDate}</Text>
        </View>
      </Page>
    </Document>
  );
}
