import { describe, it, expect } from "vitest";
import { calculate, formatCurrency, type CalculatorInputs } from "@/lib/calculator";
import { DEFAULT_INPUTS } from "@/lib/constants";

// Test the data pipeline that feeds the PDF report:
// inputs -> calculate() -> formatCurrency() -> values shown in PDF

describe("PDF report data pipeline", () => {
  const inputs: CalculatorInputs = DEFAULT_INPUTS;
  const results = calculate(inputs);

  it("produces all 7 cost categories for PDF breakdown", () => {
    expect(results.categories).toHaveLength(7);
    results.categories.forEach((cat) => {
      expect(cat.name).toBeTruthy();
      expect(typeof cat.cost).toBe("number");
      expect(cat.cost).toBeGreaterThanOrEqual(0);
    });
  });

  it("formats annual cost for PDF display", () => {
    const formatted = formatCurrency(results.annualCost);
    expect(formatted).toMatch(/^\$[\d,]+$/);
    expect(results.annualCost).toBeGreaterThan(0);
  });

  it("formats three-year exposure for PDF display", () => {
    const formatted = formatCurrency(results.threeYearCost);
    expect(formatted).toMatch(/^\$[\d,]+$/);
    expect(results.threeYearCost).toBeGreaterThan(results.annualCost);
  });

  it("computes category percentages summing to ~100%", () => {
    const totalPct = results.categories.reduce(
      (sum, cat) => sum + (cat.cost / results.annualCost) * 100,
      0
    );
    expect(totalPct).toBeCloseTo(100, 0);
  });

  it("provides ROI fields for PDF solution section", () => {
    expect(results.totalInvestment).toBeGreaterThan(0);
    expect(results.paybackMonths).toBeGreaterThanOrEqual(1);
    expect(results.paybackMonths).toBeLessThanOrEqual(36);
    expect(typeof results.roi3Year).toBe("number");
  });

  it("provides metric fields for PDF key metrics section", () => {
    expect(results.hoursReclaimed).toBeGreaterThan(0);
    expect(results.missedLectures).toBeGreaterThanOrEqual(0);
    expect(results.currentRoomsPerPerson).toBeGreaterThan(0);
  });

  it("handles zero excessFTE without negative costs", () => {
    const minFteResult = calculate({ ...DEFAULT_INPUTS, rooms: 50, currentFTE: 1 });
    expect(minFteResult.excessFTE).toBe(0);
    expect(minFteResult.staffCost).toBe(0);
  });

  it("all inputs are available for PDF campus profile section", () => {
    expect(inputs.rooms).toBeDefined();
    expect(inputs.equipmentAge).toBeDefined();
    expect(inputs.lecturesPerWeek).toBeDefined();
    expect(inputs.teachWeeks).toBeDefined();
    expect(inputs.students).toBeDefined();
    expect(inputs.tuition).toBeDefined();
    expect(inputs.itSalary).toBeDefined();
    expect(inputs.currentFTE).toBeDefined();
  });
});

describe("PDF component imports", () => {
  it("pdf-report module exports PdfReport", async () => {
    const mod = await import("@/components/pdf-report");
    expect(typeof mod.PdfReport).toBe("function");
  });

  it("pdf-download-button module exports PdfDownloadButton", async () => {
    const mod = await import("@/components/pdf-download-button");
    expect(typeof mod.PdfDownloadButton).toBe("function");
  });
});
