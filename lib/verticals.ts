// ── Vertical Configuration ──────────────────────────────────────────────
// One cost engine, three verticals. The calculator stays vertical-agnostic;
// everything vertical-specific (labels, whether a revenue-at-risk model applies,
// staffing density, recommended portfolio, personas) lives here as data.
//
// Two result modes:
//   • "cost" — Higher Education (R1 flagships through budget-constrained two-year
//     colleges): the academic drivers (lectures, tuition, students, retention) are
//     calibrated, so we show full $ cost-of-inaction math.
//   • "fit"  — Live Events, Broadcast: no academic drivers and the
//     per-vertical cost drivers are NOT yet calibrated, so we show product fit +
//     positioning + discovery angles instead of an invented dollar figure.
//
// Two framing lenses: "aging" (what your current setup quietly costs) and
// "greenfield" (cost of getting it wrong / per-project). Phase 1 uses framing for
// narrative only — it does not alter the math (no uncalibrated changes).
//
// Product specs in `portfolioFit` are grounded in the Epiphan Knowledge MCP
// (verified 2026-06-20). BUYER-FACING GUARDRAIL: never name the AV-matrix
// mechanism or third-party brands (CMS/Teams/Zoom/competitors). Connect pulls
// remote participants from "your meeting platform" via SRT — do not name Teams/Zoom.

export type Vertical =
  | "higher-ed"
  | "live-events"
  | "broadcast";

export type Framing = "aging" | "greenfield";

export type ResultMode = "cost" | "fit";

// How defensible a figure is. calibrated = real Epiphan deal or calibrated
// constant; estimated = external benchmark; asserted = strategic intuition.
export type Confidence = "calibrated" | "estimated" | "asserted";

// Fit verticals show no computed annual total. Where the research found ONE
// defensible per-unit figure, we surface it as an illustrative line — always
// chipped and explicitly "not a quote". Data, so it stays sourced and testable.
export interface Illustrative {
  range: string; // e.g. "$1,200 to $2,800"
  unitWord: string; // e.g. "per show"
  chip: string; // short basis shown in the chip, e.g. "redo labor only"
  unitNote: string; // must say "not a quote"
  confidence: Confidence;
  note: string; // buyer-safe caveat: anchor then qualify
  basis: string; // internal source trace (not buyer-facing)
}

export interface VerticalLabels {
  profileTitle: string;
  unitsLabel: string;
  unitsHint: string;
  audienceLabel?: string;
  revenueLabel?: string;
}

export interface PortfolioFit {
  hardware: string[];
  software: string[];
  note: string;
}

export interface VerticalConfig {
  id: Vertical;
  label: string;
  mode: ResultMode;
  defaultFraming: Framing;
  // When true the retention revenue-at-risk model (students × pct × tuition)
  // applies. Only the calibrated academic verticals set this.
  appliesRevenueModel: boolean;
  // Aspirational deployment density for the staffing category (units per person)
  // — "what best-in-class looks like," not the norm. For Higher Ed, 100 is the
  // cloud-managed ceiling (NC State, ~n=1); the published norm is ≈43, which the
  // UI surfaces as the comparison anchor. This is the redeployment-opportunity
  // target, deliberately optimistic.
  staffOptimalUnitsPerPerson: number;
  labels: VerticalLabels;
  portfolioFit: PortfolioFit;
  // Headline discovery angles — the questions that matter for this vertical
  // (especially for "fit" verticals that show no dollar total).
  discoveryFocus: string[];
  personas: { atl: string[]; btl: string[] };
  // Optional illustrative per-unit figure — only for fit verticals that have
  // ONE defensible sourced number. Absent for the cost vertical (which shows a
  // full computed model instead).
  illustrative?: Illustrative;
}

export const VERTICAL_CONFIGS: Record<Vertical, VerticalConfig> = {
  // Higher Education spans R1 flagships through budget-constrained two-year /
  // community colleges — one calibrated academic cost model, two budget realities.
  // The EC20-direct "lowest-barrier" wedge below is the community-college on-ramp.
  "higher-ed": {
    id: "higher-ed",
    label: "Higher Education",
    mode: "cost",
    defaultFraming: "aging",
    appliesRevenueModel: true,
    staffOptimalUnitsPerPerson: 100,
    labels: {
      profileTitle: "Your Campus Profile",
      unitsLabel: "AV-Equipped Rooms",
      unitsHint: "Classrooms, lecture halls, labs, distance-ed spaces",
      audienceLabel: "Enrolled Students",
      revenueLabel: "Avg Annual Tuition ($)",
    },
    portfolioFit: {
      hardware: ["Pearl Nano", "Pearl Nexus", "EC20", "Pearl-2"],
      software: ["Epiphan Edge — free remote fleet management"],
      note: "Standardize capture across every room and manage the whole fleet free in Edge — or start lowest-barrier with EC20 straight to your CMS, no encoder, and pool encoders as you grow.",
    },
    discoveryFocus: [
      "Aging-gear ticket load",
      "Failed captures → faculty trust",
      "Rooms per tech",
      "Budget ceiling & phased rollout",
    ],
    personas: {
      atl: [
        "Director of AV / Media Services or Distance Education",
        "Head of Instructional Technology",
      ],
      btl: [
        "Manager, Classroom/Media Services Technology",
        "AV/Media Systems Engineer",
        "AV Coordinator",
        "Distance-Ed Technologist",
      ],
    },
  },

  "live-events": {
    id: "live-events",
    label: "Live Events",
    mode: "fit",
    defaultFraming: "greenfield",
    appliesRevenueModel: false,
    staffOptimalUnitsPerPerson: 5,
    labels: {
      profileTitle: "Your Production Profile",
      unitsLabel: "Stages / Venues",
      unitsHint: "Concurrent stages or rooms you produce",
    },
    portfolioFit: {
      hardware: ["Pearl Nexus", "Pearl Mini", "EC20", "Pearl-2"],
      software: [
        "Epiphan Unify — cloud record/switch/mix/stream up to 4K, multisite hybrid",
        "Epiphan Connect — pull remote participants into the show via SRT",
      ],
      note: "Portable multi-cam without a big crew; bring remote contributors into the production.",
    },
    discoveryFocus: [
      "Cost of one botched or lost show",
      "Redo labor + client make-good / churn",
      "Crew size vs automation",
    ],
    personas: {
      atl: ["Owner / Director of Production", "Technical Director", "Director of Operations"],
      btl: ["Lead AV Tech", "A1 / V1", "Production Engineer"],
    },
    illustrative: {
      range: "$1,200 to $2,800",
      unitWord: "per show",
      chip: "redo labor only",
      unitNote: "not a quote",
      confidence: "estimated",
      note: "No calibrated annual model yet. The one defensible figure is per-show redo labor, built from real AV day-rate cards. Use it to anchor the conversation, then qualify.",
      basis: "AV day-rate cards (Endless Events, AV Chicago, DJC West); one real anchor (The Volume churned renewal).",
    },
  },

  broadcast: {
    id: "broadcast",
    label: "Broadcast",
    mode: "fit",
    defaultFraming: "greenfield",
    appliesRevenueModel: false,
    staffOptimalUnitsPerPerson: 8,
    labels: {
      profileTitle: "Your Broadcast Operation",
      unitsLabel: "Studios / Flypacks / Chains",
      unitsHint: "Studios, remote kits, or signal chains",
    },
    portfolioFit: {
      hardware: ["Pearl Nexus", "Pearl Mini", "Pearl-2", "AV.io SDI+"],
      software: [
        "Epiphan Unify — cloud record/switch/mix/stream up to 4K",
        "Epiphan Connect — remote contribution over SRT",
        "Epiphan Edge — free remote fleet management",
      ],
      note: "Fly-kit ready: portable encode + switch in one case, remote contribution over SRT, manage the fleet from anywhere.",
    },
    discoveryFocus: [
      "Dead air / lost spots cost",
      "Time-to-first-frame on a fly-kit",
      "Crew reduction via automation",
      "Remote contribution reliability",
    ],
    personas: {
      atl: ["Director of Engineering", "Chief Engineer"],
      btl: ["Broadcast Engineer", "Field Engineer"],
    },
    illustrative: {
      range: "$500 to $10K+",
      unitWord: "per incident",
      chip: "make-good",
      unitNote: "not a quote",
      confidence: "estimated",
      note: "No Epiphan deal data yet. The per-incident range rests on external benchmarks (local-TV spot rates and contractual make-good). Treat it as illustrative, then qualify the real exposure.",
      basis: "Local-TV spot rates and contractual make-good mechanism; no Epiphan deal data (NewsNation is a company record only).",
    },
  },
};

export const DEFAULT_VERTICAL: Vertical = "higher-ed";

export function getVerticalConfig(v: Vertical | undefined): VerticalConfig {
  return VERTICAL_CONFIGS[v ?? DEFAULT_VERTICAL];
}
