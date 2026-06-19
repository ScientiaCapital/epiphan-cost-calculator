import { describe, it, expect } from "vitest";
import { calculate, type CalculatorInputs } from "@/lib/calculator";
import { PIPELINE_SCENARIOS } from "@/lib/pipeline-scenarios";
import { buildShareUrl } from "@/components/share-button";

// Each pipeline scenario is a real higher-ed deal derived from a Clari call.
// These tests guard the contract: the derived inputs are valid, the calculator
// produces sane output, and the inputs survive a share-URL round-trip.

function toInputs(s: (typeof PIPELINE_SCENARIOS)[number]): CalculatorInputs {
  return {
    rooms: s.rooms,
    equipmentAge: s.equipmentAge,
    lecturesPerWeek: s.lecturesPerWeek,
    teachWeeks: s.teachWeeks,
    students: s.students,
    tuition: s.tuition,
    itSalary: s.itSalary,
    currentFTE: s.currentFTE,
  };
}

describe("PIPELINE_SCENARIOS", () => {
  it("has at least one scenario", () => {
    expect(PIPELINE_SCENARIOS.length).toBeGreaterThan(0);
  });

  it("has unique account names", () => {
    const accounts = PIPELINE_SCENARIOS.map((s) => s.account);
    expect(new Set(accounts).size).toBe(accounts.length);
  });

  it("carries full provenance on every entry", () => {
    for (const s of PIPELINE_SCENARIOS) {
      expect(s.label).toBeTruthy();
      expect(s.account).toBeTruthy();
      // Clari call UUID
      expect(s.callId).toMatch(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/);
      expect(s.callDate).toMatch(/^\d{4}-\d{2}-\d{2}$/);
      expect(s.pain).toBeTruthy();
      expect(s.roomsBasis).toBeTruthy();
    }
  });

  it("keeps every field inside the calculator's valid ranges", () => {
    for (const s of PIPELINE_SCENARIOS) {
      expect(s.rooms, s.account).toBeGreaterThanOrEqual(1);
      expect(s.rooms, s.account).toBeLessThanOrEqual(5000);
      expect(["3", "5", "7", "10"], s.account).toContain(s.equipmentAge);
      expect(s.lecturesPerWeek, s.account).toBeGreaterThanOrEqual(1);
      expect(s.lecturesPerWeek, s.account).toBeLessThanOrEqual(50);
      expect(s.teachWeeks, s.account).toBeGreaterThanOrEqual(20);
      expect(s.teachWeeks, s.account).toBeLessThanOrEqual(52);
      expect(s.students, s.account).toBeGreaterThanOrEqual(500);
      expect(s.students, s.account).toBeLessThanOrEqual(100000);
      expect(s.tuition, s.account).toBeGreaterThanOrEqual(1000);
      expect(s.tuition, s.account).toBeLessThanOrEqual(80000);
      expect(s.itSalary, s.account).toBeGreaterThanOrEqual(40000);
      expect(s.itSalary, s.account).toBeLessThanOrEqual(200000);
      expect(s.currentFTE, s.account).toBeGreaterThanOrEqual(1);
      expect(s.currentFTE, s.account).toBeLessThanOrEqual(50);
    }
  });

  it("produces finite, positive results through calculate()", () => {
    for (const s of PIPELINE_SCENARIOS) {
      const r = calculate(toInputs(s));
      expect(r.annualCost, s.account).toBeGreaterThan(0);
      expect(Number.isFinite(r.annualCost), s.account).toBe(true);
      expect(r.threeYearCost, s.account).toBeGreaterThan(r.annualCost);
      expect(r.totalInvestment, s.account).toBeGreaterThan(0);
      expect(r.paybackMonths, s.account).toBeGreaterThanOrEqual(1);
      expect(r.paybackMonths, s.account).toBeLessThanOrEqual(36);
    }
  });

  it("round-trips inputs through buildShareUrl -> parseInputsFromParams", async () => {
    const { parseInputsFromParams } = await import("@/lib/parse-params");
    for (const s of PIPELINE_SCENARIOS) {
      const inputs = toInputs(s);
      const url = buildShareUrl(inputs);
      const search = url.includes("?") ? url.slice(url.indexOf("?")) : "";
      expect(parseInputsFromParams(search), s.account).toEqual(inputs);
    }
  });
});
