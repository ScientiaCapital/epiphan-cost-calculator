// ── Vertical Configuration ──────────────────────────────────────────────
// One cost engine, five verticals. The calculator stays vertical-agnostic;
// everything vertical-specific (labels, whether a revenue-at-risk model applies,
// staffing density, recommended portfolio, personas) lives here as data.
//
// Two result modes:
//   • "cost" — Higher Ed & Community College: the academic drivers (lectures,
//     tuition, students, retention) are calibrated, so we show full $ cost-of-
//     inaction math.
//   • "fit"  — Live Events, Corporate, Broadcast: no academic drivers and the
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
  | "community-college"
  | "live-events"
  | "corporate"
  | "broadcast";

export type Framing = "aging" | "greenfield";

export type ResultMode = "cost" | "fit";

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
  // Benchmark deployment density for the staffing category (units per person).
  staffOptimalUnitsPerPerson: number;
  labels: VerticalLabels;
  portfolioFit: PortfolioFit;
  // Headline discovery angles — the questions that matter for this vertical
  // (especially for "fit" verticals that show no dollar total).
  discoveryFocus: string[];
  personas: { atl: string[]; btl: string[] };
}

export const VERTICAL_CONFIGS: Record<Vertical, VerticalConfig> = {
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
      unitsHint: "Classrooms, lecture halls, labs, studios",
      audienceLabel: "Enrolled Students",
      revenueLabel: "Avg Annual Tuition ($)",
    },
    portfolioFit: {
      hardware: ["Pearl Nano", "Pearl Nexus", "EC20", "Pearl-2"],
      software: ["Epiphan Edge — free remote fleet management"],
      note: "Standardize capture across rooms; manage the whole fleet free in Edge.",
    },
    discoveryFocus: [
      "Aging-gear ticket load",
      "Failed captures → faculty trust",
      "Rooms per tech",
    ],
    personas: {
      atl: ["Director of AV / Media Services", "Head of Instructional Technology"],
      btl: ["Manager, Classroom/Media Services Technology", "AV/Media Systems Engineer"],
    },
  },

  "community-college": {
    id: "community-college",
    label: "Community College",
    mode: "cost",
    defaultFraming: "aging",
    appliesRevenueModel: true,
    staffOptimalUnitsPerPerson: 100,
    labels: {
      profileTitle: "Your Campus Profile",
      unitsLabel: "AV-Equipped Rooms",
      unitsHint: "Classrooms, labs, distance-ed spaces",
      audienceLabel: "Enrolled Students",
      revenueLabel: "Avg Annual Tuition ($)",
    },
    portfolioFit: {
      hardware: ["EC20", "Pearl Nexus"],
      software: ["Epiphan Edge — free remote fleet management"],
      note: "Lowest-barrier start: EC20 publishes straight to your CMS with no encoder; pool encoders as you grow.",
    },
    discoveryFocus: [
      "Budget ceiling & who signs",
      "A camera in every room without encoder cost",
      "Phased rollout (ph1 / ph2 / ph3)",
    ],
    personas: {
      atl: ["Director/Manager of Media Services or Distance Education"],
      btl: ["AV Coordinator", "Media Services Tech", "Distance-Ed Technologist"],
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
  },

  corporate: {
    id: "corporate",
    label: "Corporate",
    mode: "fit",
    defaultFraming: "aging",
    appliesRevenueModel: false,
    staffOptimalUnitsPerPerson: 50,
    labels: {
      profileTitle: "Your Workplace Profile",
      unitsLabel: "Meeting / Event Spaces",
      unitsHint: "Town-hall, training, and all-hands spaces",
    },
    portfolioFit: {
      hardware: ["Pearl Nano", "Pearl Nexus"],
      software: [
        "Epiphan Connect — bring hybrid/remote participants in via SRT",
        "Epiphan Edge — free remote fleet management",
      ],
      note: "Reliable all-hands and training capture; bring in hybrid participants from your meeting platform.",
    },
    discoveryFocus: [
      "Employee-hours lost to a failed all-hands",
      "Training / compliance completion risk",
      "Hybrid reach across offices",
    ],
    personas: {
      atl: ["Director of Workplace Technology / Corporate AV", "VP Communications", "Head of L&D"],
      btl: ["AV / Collaboration Engineer", "Event Producer", "IT-AV Specialist"],
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
  },
};

export const DEFAULT_VERTICAL: Vertical = "higher-ed";

export function getVerticalConfig(v: Vertical | undefined): VerticalConfig {
  return VERTICAL_CONFIGS[v ?? DEFAULT_VERTICAL];
}
