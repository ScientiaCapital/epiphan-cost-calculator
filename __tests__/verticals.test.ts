import { describe, it, expect } from "vitest";
import { calculate, type CalculatorInputs } from "@/lib/calculator";
import { generateSdrNote, generateFollowupEmail } from "@/lib/sdr-note";
import { VERTICAL_CONFIGS, getVerticalConfig } from "@/lib/verticals";
import { DEFAULT_INPUTS, PRODUCT_PRICES, getEc20DirectInvestment } from "@/lib/constants";

function calcWith(overrides: Partial<CalculatorInputs>) {
  return calculate({ ...DEFAULT_INPUTS, ...overrides });
}

// Buyer-facing copy must never leak the matrix mechanism or third-party brands.
// Brand/platform tokens are assembled from fragments so the brand words never
// appear as literals in this public repo; the regex still matches them at
// runtime to guarantee they never reach buyer copy.
const BRANDS = ["pan" + "opto", "kal" + "tura", "media" + "site", "sen" + "eca", "echo" + "360", "cres" + "tron", "ex" + "tron"];
const BOUNDED = ["zo" + "om", "te" + "ams"].map((b) => `\\b${b}\\b`); // word-bounded (avoid "optical zoom")
const FORBIDDEN = new RegExp(
  ["matrix", "switchboard", "routing switch", "multiplex", ...BRANDS, ...BOUNDED].join("|"),
  "i",
);

describe("VERTICAL_CONFIGS", () => {
  it("defines exactly the four verticals", () => {
    expect(Object.keys(VERTICAL_CONFIGS).sort()).toEqual(
      ["broadcast", "corporate", "higher-ed", "live-events"],
    );
  });

  it("cost verticals apply the revenue model; fit verticals do not", () => {
    expect(VERTICAL_CONFIGS["higher-ed"].mode).toBe("cost");
    expect(VERTICAL_CONFIGS["higher-ed"].appliesRevenueModel).toBe(true);
    for (const v of ["live-events", "corporate", "broadcast"] as const) {
      expect(VERTICAL_CONFIGS[v].mode).toBe("fit");
      expect(VERTICAL_CONFIGS[v].appliesRevenueModel).toBe(false);
    }
  });

  it("no portfolioFit/labels copy leaks the matrix or third-party brands", () => {
    for (const cfg of Object.values(VERTICAL_CONFIGS)) {
      const blob = JSON.stringify({ ...cfg.portfolioFit, ...cfg.labels, focus: cfg.discoveryFocus });
      expect(blob).not.toMatch(FORBIDDEN);
    }
  });
});

describe("calculate() vertical behavior", () => {
  it("defaults to higher-ed and stays backward compatible", () => {
    const r = calcWith({});
    expect(r.vertical).toBe("higher-ed");
    expect(r.resultMode).toBe("cost");
    expect(r.retentionCost).toBeGreaterThan(0);
  });

  it("fit verticals zero out the revenue-at-risk model", () => {
    const r = calcWith({ vertical: "live-events" });
    expect(r.resultMode).toBe("fit");
    expect(r.retentionCost).toBe(0);
  });

  it("ex-retention totals equal the full totals when no revenue model applies", () => {
    const r = calcWith({ vertical: "live-events" });
    expect(r.annualCostExRetention).toBe(r.annualCost);
    expect(r.threeYearCostExRetention).toBe(r.threeYearCost);
    expect(r.retentionShareOfAnnual).toBe(0);
  });

  it("staff scaling comes from the vertical config", () => {
    // live-events density = 5 units/person → optimalFTE = ceil(150/5) = 30
    expect(calcWith({ vertical: "live-events" }).optimalFTE).toBe(30);
    // higher-ed density = 100 → ceil(150/100) = 2
    expect(calcWith({ vertical: "higher-ed" }).optimalFTE).toBe(2);
  });

  it("framing defaults from the vertical and passes through", () => {
    expect(calcWith({ vertical: "broadcast" }).framing).toBe("greenfield");
    expect(calcWith({ vertical: "higher-ed" }).framing).toBe("aging");
    expect(calcWith({ vertical: "higher-ed", framing: "greenfield" }).framing).toBe("greenfield");
  });
});

describe("EC20-direct ramp", () => {
  it("getEc20DirectInvestment = rooms × EC20 price", () => {
    expect(getEc20DirectInvestment(40)).toBe(40 * PRODUCT_PRICES.ec20);
  });

  it("is exposed on results and cheaper than the blended room-by-room mix", () => {
    const r = calcWith({ rooms: 40 });
    expect(r.ec20DirectUnits).toBe(40);
    expect(r.ec20DirectInvestment).toBe(40 * PRODUCT_PRICES.ec20);
    expect(r.ec20DirectInvestment).toBeLessThan(r.totalInvestment);
    expect(r.showEc20DirectPath).toBe(true);
  });
});

describe("SDR note + email generation", () => {
  it("cost-mode note shows the dollar story and ROI", () => {
    const inputs = { ...DEFAULT_INPUTS };
    const note = generateSdrNote(inputs, calculate(inputs));
    expect(note).toContain("COST OF INACTION");
    expect(note).toContain("ROI:");
    expect(note).not.toMatch(FORBIDDEN);
  });

  it("fit-mode note shows portfolio fit, not an invented dollar total", () => {
    const inputs = { ...DEFAULT_INPUTS, vertical: "broadcast" as const };
    const note = generateSdrNote(inputs, calculate(inputs));
    expect(note).toContain("RECOMMENDED FIT");
    expect(note).toContain("WHAT TO QUANTIFY NEXT");
    expect(note).not.toContain("COST OF INACTION");
    expect(note).not.toMatch(FORBIDDEN);
  });

  it("email has subject, body, and a prefilled mailto with no recipient", () => {
    const inputs = { ...DEFAULT_INPUTS };
    const email = generateFollowupEmail(inputs, calculate(inputs));
    expect(email.subject.length).toBeGreaterThan(0);
    expect(email.mailto.startsWith("mailto:?")).toBe(true);
    expect(email.body).not.toMatch(FORBIDDEN);
    expect(getVerticalConfig("higher-ed").label).toBe("Higher Education");
  });
});

describe("edge cases (carried gaps)", () => {
  it("pooled tease hidden just below the threshold, shown at/above it", () => {
    expect(calcWith({ rooms: 11 }).showPooledPath).toBe(false);
    expect(calcWith({ rooms: 12 }).showPooledPath).toBe(true);
  });

  it("clamps concurrentRooms to rooms", () => {
    expect(calcWith({ rooms: 10, concurrentRooms: 999 }).concurrentRooms).toBe(10);
  });

  it("handles a very large campus without overflow", () => {
    const r = calcWith({ rooms: 5000 });
    expect(Number.isFinite(r.annualCost)).toBe(true);
    expect(r.totalInvestment).toBeGreaterThan(0);
  });
});
