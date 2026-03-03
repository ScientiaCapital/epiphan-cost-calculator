import { describe, it, expect } from "vitest";
import { calculate, formatCurrency, formatCompact, type CalculatorInputs } from "@/lib/calculator";
import { DEFAULT_INPUTS, SCENARIOS } from "@/lib/constants";

// Helper: run calculator with default Mid-Size scenario (150 rooms, age 5)
function defaultResult() {
  return calculate(DEFAULT_INPUTS);
}

// Helper: run with specific overrides
function calcWith(overrides: Partial<CalculatorInputs>) {
  return calculate({ ...DEFAULT_INPUTS, ...overrides });
}

describe("calculate()", () => {
  describe("Mid-Size scenario (150 rooms, 5-year equipment)", () => {
    const r = defaultResult();

    it("computes total lectures correctly", () => {
      // 150 rooms × 15 lectures/week × 30 weeks = 67,500
      expect(r.totalLectures).toBe(67500);
    });

    it("computes ticket costs (category 1)", () => {
      // ticketRate = 4.6 × 1.0 = 4.6/room/yr
      expect(r.ticketsPerRoomYear).toBeCloseTo(4.6, 1);
      // totalTickets = round(150 × 4.6) = 690
      expect(r.totalTickets).toBe(690);
      // ticketHours = round(690 × 45 / 60) = 518
      expect(r.ticketHours).toBe(518);
      // ticketCost = 690 × $35 = $24,150
      expect(r.ticketCost).toBe(24150);
    });

    it("computes failed capture costs (category 2)", () => {
      // failRate = 0.06 for age 5
      expect(r.failRate).toBe(0.06);
      // missed = round(67500 × 0.70 × 0.06) = 2835
      expect(r.missedLectures).toBe(2835);
      // studentsAffected = 2835 × 75 = 212,625
      expect(r.studentsAffected).toBe(212625);
      // missedCaptureCost = 2835 × $150 = $425,250
      expect(r.missedCaptureCost).toBe(425250);
    });

    it("computes classroom downtime costs (category 3)", () => {
      // downtimePerRoom = 2.5 for age 5
      expect(r.downtimeEventsPerRoom).toBe(2.5);
      // totalEvents = round(150 × 2.5) = 375
      expect(r.totalDowntimeEvents).toBe(375);
      // cost = 375 × $500 = $187,500
      expect(r.downtimeCost).toBe(187500);
    });

    it("computes staff redeployment costs (category 4)", () => {
      // curRoomsPerPerson = round(150 / 4) = 38
      expect(r.currentRoomsPerPerson).toBe(38);
      // optimalFTE = ceil(150 / 100) = 2
      expect(r.optimalFTE).toBe(2);
      // excessFTE = 4 - 2 = 2
      expect(r.excessFTE).toBe(2);
      // staffCost = 2 × $85,000 = $170,000
      expect(r.staffCost).toBe(170000);
    });

    it("computes maintenance costs (category 5)", () => {
      // configHrs = 2.5 for age 5
      expect(r.configHoursPerRoom).toBe(2.5);
      // configLabor = 150 × 2.5 × $55 = $20,625
      // parts = 150 × $150 = $22,500
      // total = $43,125
      expect(r.maintenanceCost).toBe(43125);
    });

    it("computes ADA compliance costs (category 6)", () => {
      // adaCost = max(25000, 150 × 200) = max(25000, 30000) = $30,000
      expect(r.adaCost).toBe(30000);
    });

    it("computes retention costs (category 7)", () => {
      // retPct = 0.0025 for age 5
      expect(r.retentionPercent).toBe(0.0025);
      // retentionCost = 12000 × 0.0025 × $22,000 = $660,000
      expect(r.retentionCost).toBe(660000);
    });

    it("computes annual and 3-year totals", () => {
      const expectedAnnual = 24150 + 425250 + 187500 + 170000 + 43125 + 30000 + 660000;
      expect(r.annualCost).toBe(expectedAnnual); // $1,540,025
      expect(r.threeYearCost).toBe(expectedAnnual * 3.15);
    });

    it("computes hours reclaimed", () => {
      // ticketHours (518) + round(150 × 2.5) = 518 + 375 = 893
      expect(r.hoursReclaimed).toBe(893);
    });

    it("computes blended room mix for 150 rooms", () => {
      // Mid-size mix: nano=30, nexus=38, pearl2=8, nexusEc20=74
      expect(r.roomMix).toEqual({ nano: 30, nexus: 38, nexusEc20: 74, pearl2: 8 });
      // Investment: 30×1999 + 38×3299 + 74×5198 + 8×7999 = $633,976
      expect(r.totalInvestment).toBe(633976);
      expect(r.blendedPerRoom).toBe(Math.round(633976 / 150));
    });

    it("computes payback and ROI with blended investment", () => {
      // paybackMonths = round(($633,976 / $1,540,025) × 12) = 5
      const expectedPayback = Math.min(36, Math.max(1, Math.round((633976 / r.annualCost) * 12)));
      expect(r.paybackMonths).toBe(expectedPayback);
      expect(r.paybackMonths).toBe(5);
    });

    it("returns 7 cost categories", () => {
      expect(r.categories).toHaveLength(7);
    });
  });

  describe("Department scenario (10 rooms, 7-year equipment)", () => {
    const s = SCENARIOS[0]; // Department: 10 rooms, 7yr
    const r = calculate({
      rooms: s.rooms,
      equipmentAge: s.equipmentAge,
      lecturesPerWeek: s.lecturesPerWeek,
      teachWeeks: s.teachWeeks,
      students: s.students,
      tuition: s.tuition,
      currentFTE: s.currentFTE,
      itSalary: s.itSalary,
    });

    it("computes ticket costs for 10 rooms at age 7", () => {
      expect(r.totalTickets).toBe(Math.round(10 * 4.6 * 1.8));
      expect(r.ticketCost).toBe(Math.round(10 * 4.6 * 1.8) * 35);
    });

    it("ADA minimum floor applies for small deployment", () => {
      // 10 × 400 = 4,000 < 25,000 minimum
      expect(r.adaCost).toBe(25000);
    });

    it("uses small-deployment room mix (≤25 rooms)", () => {
      // 10 rooms: nexus=round(10×0.70)=7, nexusEc20=3
      expect(r.roomMix).toEqual({ nano: 0, nexus: 7, nexusEc20: 3, pearl2: 0 });
      // Investment: 7×3299 + 3×5198 = 23,093 + 15,594 = $38,687
      expect(r.totalInvestment).toBe(38687);
    });
  });

  describe("Large University scenario (500 rooms, 7-year equipment)", () => {
    const s = SCENARIOS[3]; // Large University: 500 rooms, 7yr
    const r = calculate({
      rooms: s.rooms,
      equipmentAge: s.equipmentAge,
      lecturesPerWeek: s.lecturesPerWeek,
      teachWeeks: s.teachWeeks,
      students: s.students,
      tuition: s.tuition,
      currentFTE: s.currentFTE,
      itSalary: s.itSalary,
    });

    it("uses age-7 multipliers", () => {
      expect(r.ticketsPerRoomYear).toBeCloseTo(4.6 * 1.8, 1);
      expect(r.failRate).toBe(0.10);
      expect(r.downtimeEventsPerRoom).toBe(4.0);
    });

    it("computes higher costs for aging equipment", () => {
      const defaultR = defaultResult();
      // 500 rooms at age 7 should cost more per category than 150 at age 5
      expect(r.annualCost / r.categories.length).toBeGreaterThan(
        defaultR.annualCost / defaultR.categories.length
      );
    });

    it("uses large-deployment room mix (>200 rooms)", () => {
      // 500 rooms: nano=125, nexus=75, pearl2=50, nexusEc20=250
      expect(r.roomMix).toEqual({ nano: 125, nexus: 75, nexusEc20: 250, pearl2: 50 });
      // Investment: 125×1999 + 75×3299 + 250×5198 + 50×7999
      const expected = 125*1999 + 75*3299 + 250*5198 + 50*7999;
      expect(r.totalInvestment).toBe(expected);
    });
  });

  describe("edge cases", () => {
    it("handles minimum 1 room", () => {
      const r = calcWith({ rooms: 1, currentFTE: 1 });
      expect(r.annualCost).toBeGreaterThan(0);
      expect(r.optimalFTE).toBe(1);
      expect(r.excessFTE).toBe(0);
      // 1 room: nexus=round(0.70)=1, nexusEc20=0
      expect(r.roomMix).toEqual({ nano: 0, nexus: 1, nexusEc20: 0, pearl2: 0 });
    });

    it("handles boundary at 25 rooms (small tier)", () => {
      const r = calcWith({ rooms: 25, currentFTE: 1 });
      // nexus=round(25×0.70)=18, nexusEc20=7
      expect(r.roomMix).toEqual({ nano: 0, nexus: 18, nexusEc20: 7, pearl2: 0 });
      expect(r.totalInvestment).toBe(18*3299 + 7*5198);
    });

    it("handles boundary at 200 rooms (mid tier)", () => {
      const r = calcWith({ rooms: 200, currentFTE: 4 });
      // nano=40, nexus=50, pearl2=10, nexusEc20=100
      expect(r.roomMix).toEqual({ nano: 40, nexus: 50, nexusEc20: 100, pearl2: 10 });
    });

    it("handles 201 rooms (large tier)", () => {
      const r = calcWith({ rooms: 201, currentFTE: 4 });
      // nano=round(201×0.25)=50, nexus=round(201×0.15)=30, pearl2=round(201×0.10)=20, nexusEc20=101
      expect(r.roomMix).toEqual({ nano: 50, nexus: 30, nexusEc20: 101, pearl2: 20 });
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
