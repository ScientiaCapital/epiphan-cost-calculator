import { describe, it, expect } from "vitest";
import { calculate, formatCurrency, formatCompact, type CalculatorInputs } from "@/lib/calculator";
import { DEFAULT_INPUTS, SCENARIOS } from "@/lib/constants";

// Helper: run calculator with default Large scenario (300 rooms, age 5)
function defaultResult() {
  return calculate(DEFAULT_INPUTS);
}

// Helper: run with specific overrides
function calcWith(overrides: Partial<CalculatorInputs>) {
  return calculate({ ...DEFAULT_INPUTS, ...overrides });
}

describe("calculate()", () => {
  describe("Large scenario (300 rooms, 5-year equipment)", () => {
    const r = defaultResult();

    it("computes total lectures correctly", () => {
      // 300 rooms × 15 lectures/week × 30 weeks = 135,000
      expect(r.totalLectures).toBe(135000);
    });

    it("computes ticket costs (category 1)", () => {
      // ticketRate = 4.6 × 1.0 = 4.6/room/yr
      expect(r.ticketsPerRoomYear).toBeCloseTo(4.6, 1);
      // totalTickets = round(300 × 4.6) = 1380
      expect(r.totalTickets).toBe(1380);
      // ticketHours = round(1380 × 45 / 60) = 1035
      expect(r.ticketHours).toBe(1035);
      // ticketCost = 1380 × $35 = $48,300
      expect(r.ticketCost).toBe(48300);
    });

    it("computes failed capture costs (category 2)", () => {
      // failRate = 0.06 for age 5
      expect(r.failRate).toBe(0.06);
      // missed = round(135000 × 0.06) = 8100
      expect(r.missedLectures).toBe(8100);
      // studentsAffected = 8100 × 75 = 607,500
      expect(r.studentsAffected).toBe(607500);
      // missedCaptureCost = 8100 × $250 = $2,025,000
      expect(r.missedCaptureCost).toBe(2025000);
    });

    it("computes classroom downtime costs (category 3)", () => {
      // downtimePerRoom = 2.5 for age 5
      expect(r.downtimeEventsPerRoom).toBe(2.5);
      // totalEvents = round(300 × 2.5) = 750
      expect(r.totalDowntimeEvents).toBe(750);
      // cost = 750 × $2000 = $1,500,000
      expect(r.downtimeCost).toBe(1500000);
    });

    it("computes staff redeployment costs (category 4)", () => {
      // curRoomsPerPerson = round(300 / 6) = 50
      expect(r.currentRoomsPerPerson).toBe(50);
      // optimalFTE = ceil(300 / 100) = 3
      expect(r.optimalFTE).toBe(3);
      // excessFTE = 6 - 3 = 3
      expect(r.excessFTE).toBe(3);
      // staffCost = 3 × $90,000 = $270,000
      expect(r.staffCost).toBe(270000);
    });

    it("computes maintenance costs (category 5)", () => {
      // configHrs = 2.5 for age 5
      expect(r.configHoursPerRoom).toBe(2.5);
      // configLabor = 300 × 2.5 × $55 = $41,250
      // parts = 300 × $150 = $45,000
      // total = $86,250
      expect(r.maintenanceCost).toBe(86250);
    });

    it("computes ADA compliance costs (category 6)", () => {
      // adaCost = max(25000, 300 × 200) = max(25000, 60000) = $60,000
      expect(r.adaCost).toBe(60000);
    });

    it("computes retention costs (category 7)", () => {
      // retPct = 0.005 for age 5
      expect(r.retentionPercent).toBe(0.005);
      // retentionCost = 25000 × 0.005 × $18,000 = $2,250,000
      expect(r.retentionCost).toBe(2250000);
    });

    it("computes annual and 3-year totals", () => {
      const expectedAnnual = 48300 + 2025000 + 1500000 + 270000 + 86250 + 60000 + 2250000;
      expect(r.annualCost).toBe(expectedAnnual);
      expect(r.threeYearCost).toBe(expectedAnnual * 3.15);
    });

    it("computes hours reclaimed", () => {
      // ticketHours (1035) + round(300 × 2.5) = 1035 + 750 = 1785
      expect(r.hoursReclaimed).toBe(1785);
    });

    it("computes investment and ROI", () => {
      // totalInvestment = 300 × $5,198 = $1,559,400
      expect(r.totalInvestment).toBe(1559400);
      // paybackMonths = round(($1,559,400 / annual) × 12) clamped 1–36
      const expectedPayback = Math.min(36, Math.max(1, Math.round((1559400 / r.annualCost) * 12)));
      expect(r.paybackMonths).toBe(expectedPayback);
    });

    it("returns 7 cost categories", () => {
      expect(r.categories).toHaveLength(7);
    });
  });

  describe("Small scenario (50 rooms)", () => {
    const s = SCENARIOS[0]; // Small: 50 rooms, 5yr
    const r = calculate({
      rooms: s.rooms,
      equipmentAge: s.equipmentAge,
      lecturesPerWeek: 15,
      teachWeeks: 30,
      students: s.students,
      tuition: s.tuition,
      currentFTE: s.currentFTE,
      itSalary: 90000,
    });

    it("computes ticket costs for 50 rooms at age 5", () => {
      expect(r.totalTickets).toBe(Math.round(50 * 4.6));
      expect(r.ticketCost).toBe(Math.round(50 * 4.6) * 35);
    });

    it("ADA minimum floor applies for small campus", () => {
      // 50 × 200 = 10,000 < 25,000 minimum
      expect(r.adaCost).toBe(25000);
    });
  });

  describe("Major scenario (600 rooms, 7-year equipment)", () => {
    const s = SCENARIOS[3]; // Major: 600 rooms, 7yr
    const r = calculate({
      rooms: s.rooms,
      equipmentAge: s.equipmentAge,
      lecturesPerWeek: 15,
      teachWeeks: 30,
      students: s.students,
      tuition: s.tuition,
      currentFTE: s.currentFTE,
      itSalary: 90000,
    });

    it("uses age-7 multipliers", () => {
      expect(r.ticketsPerRoomYear).toBeCloseTo(4.6 * 1.8, 1);
      expect(r.failRate).toBe(0.10);
      expect(r.downtimeEventsPerRoom).toBe(4.0);
    });

    it("computes higher costs for aging equipment", () => {
      const defaultR = defaultResult();
      // 600 rooms at age 7 should cost more per room than 300 at age 5
      expect(r.annualCost / r.categories.length).toBeGreaterThan(
        defaultR.annualCost / defaultR.categories.length
      );
    });
  });

  describe("edge cases", () => {
    it("handles minimum 1 room", () => {
      const r = calcWith({ rooms: 1, currentFTE: 1 });
      expect(r.annualCost).toBeGreaterThan(0);
      expect(r.optimalFTE).toBe(1);
      expect(r.excessFTE).toBe(0);
    });

    it("handles age 10 (critical)", () => {
      const r = calcWith({ equipmentAge: "10" });
      expect(r.ticketsPerRoomYear).toBeCloseTo(4.6 * 3.0, 1);
      expect(r.failRate).toBe(0.18);
    });

    it("clamps payback to max 36 months", () => {
      // Very small annual cost relative to investment
      const r = calcWith({ rooms: 1, currentFTE: 1, students: 500, tuition: 1000 });
      expect(r.paybackMonths).toBeLessThanOrEqual(36);
    });

    it("clamps payback to min 1 month", () => {
      // Very large annual cost relative to investment
      const r = calcWith({ rooms: 1000, currentFTE: 50, students: 100000, tuition: 80000 });
      expect(r.paybackMonths).toBeGreaterThanOrEqual(1);
    });
  });
});

describe("formatCurrency()", () => {
  it("formats with dollar sign and commas", () => {
    expect(formatCurrency(1234567)).toBe("$1,234,567");
  });

  it("rounds to nearest dollar", () => {
    expect(formatCurrency(1234.56)).toBe("$1,235");
  });

  it("handles zero", () => {
    expect(formatCurrency(0)).toBe("$0");
  });
});

describe("formatCompact()", () => {
  it("formats thousands with K suffix", () => {
    expect(formatCompact(1500)).toBe("1.5K");
  });

  it("drops trailing .0 on even thousands", () => {
    expect(formatCompact(2000)).toBe("2K");
  });

  it("leaves sub-1000 numbers as-is", () => {
    expect(formatCompact(750)).toBe("750");
  });
});
