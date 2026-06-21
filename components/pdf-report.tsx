import {
  Document,
  Page,
  View,
  Text,
  StyleSheet,
  Font,
  Svg,
  Path,
} from "@react-pdf/renderer";
import {
  type CalculatorInputs,
  type CalculatorResults,
  formatCurrency,
} from "@/lib/calculator";
import { EQUIPMENT_AGE_OPTIONS } from "@/lib/constants";
import { SOEHNE_BUCH_DATA_URI, SOEHNE_HALBFETT_DATA_URI } from "@/lib/brand-fonts";
import {
  EPIPHAN_LOGO_VIEWBOX,
  EPIPHAN_WORDMARK_PATHS,
  EPIPHAN_MARK_PATH,
} from "./epiphan-logo-paths";

// Register Söhne (official Epiphan typeface) so the report renders on-brand
// in both the browser (PDFDownloadLink) and the Node report generator.
Font.register({ family: "Soehne", src: SOEHNE_BUCH_DATA_URI });
Font.register({ family: "Soehne-Bold", src: SOEHNE_HALBFETT_DATA_URI });

/** Epiphan Video logo (dark variant) for the white report header. */
function PdfEpiphanLogo() {
  return (
    <Svg width={84} height={23} viewBox={EPIPHAN_LOGO_VIEWBOX}>
      {EPIPHAN_WORDMARK_PATHS.map((d, i) => (
        <Path key={i} d={d} fill="#414042" />
      ))}
      <Path d={EPIPHAN_MARK_PATH} fill="#8CBE3F" />
    </Svg>
  );
}

// ── Brand Colors ─────────────────────────────────────────────────────
// Official Epiphan palette, validated against the Epiphan Brand MCP
// (get_brand_asset_kit / get_style_tokens) on 2026-06-19.
const NAVY = "#170F30"; // indigo-ink — primary dark (titles, headers, dark cards)
const RED = "#F4716E"; // coral — alarm / exposure
const TEAL = "#0C3D34"; // teal-base — payback card
const GREEN = "#83CE41"; // green-base — positive / ROI accent (use dark text on it)
const WORDMARK = "#414042"; // Epiphan logo wordmark gray
const GRAY = "#5a5a5a"; // ink-3
const INK_BODY = "#333333"; // ink-2 — body text
const LIGHT_GRAY = "#f1f2f0"; // surface-2
const LINE = "#e4e5ea"; // line — hairlines / borders
const WHITE = "#ffffff";

// ── Styles ───────────────────────────────────────────────────────────
const s = StyleSheet.create({
  page: {
    padding: 40,
    fontSize: 10,
    fontFamily: "Soehne",
    color: INK_BODY,
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
    fontFamily: "Soehne-Bold",
    color: NAVY,
  },
  subtitle: {
    fontSize: 10,
    color: GRAY,
    marginTop: 4,
  },
  brand: {
    fontSize: 12,
    fontFamily: "Soehne-Bold",
    color: WORDMARK,
  },
  // Section headers
  sectionHeader: {
    fontSize: 13,
    fontFamily: "Soehne-Bold",
    color: NAVY,
    marginTop: 18,
    marginBottom: 8,
    borderBottom: `1px solid ${NAVY}`,
    paddingBottom: 4,
  },
  // Table
  tableRow: {
    flexDirection: "row",
    borderBottom: `1px solid ${LINE}`,
    paddingVertical: 4,
  },
  tableRowAlt: {
    flexDirection: "row",
    borderBottom: `1px solid ${LINE}`,
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
    fontFamily: "Soehne-Bold",
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
    fontFamily: "Soehne-Bold",
    color: WHITE,
  },
  // Breakdown table
  breakdownRow: {
    flexDirection: "row",
    borderBottom: `1px solid ${LINE}`,
    paddingVertical: 5,
  },
  breakdownName: {
    width: "50%",
    paddingLeft: 6,
  },
  breakdownCost: {
    width: "25%",
    textAlign: "right",
    fontFamily: "Soehne-Bold",
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
    fontFamily: "Soehne-Bold",
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
    fontFamily: "Soehne-Bold",
  },
  roiLabel: {
    fontSize: 8,
    marginTop: 3,
    textAlign: "center",
  },
  // Advanced inputs
  advancedRow: {
    flexDirection: "row",
    borderBottom: `1px solid ${LINE}`,
    paddingVertical: 3,
  },
  advancedLabel: {
    width: "55%",
    paddingLeft: 6,
    fontSize: 9,
    color: GRAY,
  },
  advancedValue: {
    width: "45%",
    textAlign: "right",
    paddingRight: 6,
    fontSize: 9,
    color: GRAY,
  },
  // Footer
  footer: {
    position: "absolute",
    bottom: 30,
    left: 40,
    right: 40,
    borderTop: `1px solid ${LINE}`,
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
          <PdfEpiphanLogo />
        </View>

        {/* 2. Campus Profile — primary inputs */}
        <Text style={s.sectionHeader}>Campus Profile</Text>
        <View>
          {[
            ["AV-Equipped Rooms", String(inputs.rooms)],
            ["Equipment Age", getAgeLabel(inputs.equipmentAge)],
            ["Current AV Support FTEs", String(inputs.currentFTE)],
          ].map(([label, value], i) => (
            <View key={i} style={i % 2 === 0 ? s.tableRow : s.tableRowAlt}>
              <Text style={s.tableLabel}>{label}</Text>
              <Text style={s.tableValue}>{value}</Text>
            </View>
          ))}
        </View>
        {/* Advanced inputs — smaller text */}
        <View style={{ marginTop: 4 }}>
          {[
            ["Recordings per Room / Week", String(inputs.lecturesPerWeek)],
            ["Teaching Weeks / Year", String(inputs.teachWeeks)],
            ["Average Tuition", formatCurrency(inputs.tuition)],
            ["Enrolled Students", inputs.students.toLocaleString("en-US")],
            ["IT Staff Salary (avg)", formatCurrency(inputs.itSalary)],
          ].map(([label, value], i) => (
            <View key={i} style={s.advancedRow}>
              <Text style={s.advancedLabel}>{label}</Text>
              <Text style={s.advancedValue}>{value}</Text>
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

        {/* 4. Cost Breakdown — grouped by credibility tier */}
        <Text style={s.sectionHeader}>Cost Breakdown</Text>
        <View>
          {[
            { label: "Operational Costs", start: 0, end: 3 },
            { label: "Productivity Impact", start: 3, end: 5 },
            { label: "Institutional Risk", start: 5, end: 7 },
          ].map((tier) => (
            <View key={tier.label}>
              <View style={{ backgroundColor: LINE, paddingVertical: 3, paddingHorizontal: 6, marginTop: tier.start > 0 ? 6 : 0 }}>
                <Text style={{ fontSize: 8, fontFamily: "Soehne-Bold", color: NAVY, textTransform: "uppercase", letterSpacing: 0.5 }}>
                  {tier.label}
                </Text>
              </View>
              {results.categories.slice(tier.start, tier.end).map((cat, i) => (
                <View
                  key={cat.name}
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
          ))}
        </View>

        {/* 5. Key Metrics */}
        <Text style={s.sectionHeader}>Key Metrics</Text>
        <View style={s.metricsGrid}>
          <View style={s.metricCard}>
            <Text style={s.metricValue}>
              {results.hoursReclaimed.toLocaleString("en-US")}
            </Text>
            <Text style={s.metricLabel}>IT Hours Saved / Year</Text>
          </View>
          <View style={s.metricCard}>
            <Text style={s.metricValue}>
              {results.missedLectures.toLocaleString("en-US")}
            </Text>
            <Text style={s.metricLabel}>Failed Recordings Prevented</Text>
          </View>
        </View>

        {/* 6. Solution ROI */}
        <Text style={s.sectionHeader}>
          Solution ROI: Blended Room Mix ({formatCurrency(results.blendedPerRoom)}/room avg)
        </Text>
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
            <Text style={[s.roiValue, { color: NAVY }]}>
              {results.roi3Year.toLocaleString()}%
            </Text>
            <Text style={[s.roiLabel, { color: NAVY }]}>3-Year ROI</Text>
          </View>
        </View>

        {/* 6b. A more affordable path — concurrency-based starting point.
            Soft tease only: a starting point for the budget conversation, not a quote.
            Hidden for deployments too small to benefit from a central pool. */}
        {results.showPooledPath && (
        <View style={{ marginTop: 10, padding: 8, borderRadius: 4, border: `1px solid ${TEAL}` }}>
          <Text style={{ fontSize: 10, fontFamily: "Soehne-Bold", color: TEAL, marginBottom: 3 }}>
            A more affordable path: ~{formatCurrency(results.pooledInvestment)} centralized starting point
          </Text>
          <Text style={{ fontSize: 8, color: GRAY }}>
            {`If only about ${results.concurrentRooms.toLocaleString("en-US")} of ${inputs.rooms.toLocaleString("en-US")} rooms ever record at the same time, a shared pool of ${results.pooledEncoders.toLocaleString("en-US")} ${results.pooledModel} encoders can cover the campus – versus ${formatCurrency(results.totalInvestment)} room-by-room. This is a starting point for the conversation, not a quote; an Epiphan account engineer scopes the right design with you.`}
          </Text>
        </View>
        )}

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
