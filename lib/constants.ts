// Research-backed constants for the Cost of Inaction Calculator
// Sources cited inline — do not modify without updating methodology section

export type EquipmentAge = "3" | "5" | "7" | "10";

export type AgeMultiplierTable = Record<EquipmentAge, number>;

// ── Ticket / Support Costs ────────────────────────────────────────────
// Epiphan AV Professional Survey 2025 (500+ respondents)
export const TICKET_BASE_RATE = 4.6; // tickets/room/year baseline

// Age-based multiplier on ticket rate
export const TICKET_AGE_MULTIPLIER: AgeMultiplierTable = {
  "3": 0.5,
  "5": 1.0,
  "7": 1.8,
  "10": 3.0,
};

// MetricNet Service Desk Benchmarks — blended Tier 1–3
export const COST_PER_TICKET = 35; // $22 T1 / $65 T2 / $104 T3 blended
export const MINUTES_PER_TICKET = 45; // avg hands-on support time

// ── Capture Failure Rates ─────────────────────────────────────────────
// NC State achieved 99%+ reliability with Pearl fleet
export const FAIL_RATES: AgeMultiplierTable = {
  "3": 0.03,
  "5": 0.06,
  "7": 0.10,
  "10": 0.18,
};

// Not all rooms record every scheduled session — ~70% have active recording schedules
export const RECORDING_UTILIZATION = 0.70;

// IT investigation ($28) + instructor coordination ($50) + complaint handling ($25) + QA ($25) ≈ $128
// Rounded to $150 to include minor incidentals — conservative, defensible at line-item level
export const COST_PER_MISSED_CAPTURE = 150;
export const STUDENTS_PER_LECTURE = 75; // avg students affected per missed capture

// ── Classroom Downtime ────────────────────────────────────────────────
// eCampus News / Cenero downtime cost methodology
export const DOWNTIME_EVENTS_PER_ROOM: AgeMultiplierTable = {
  "3": 1.0,
  "5": 2.5,
  "7": 4.0,
  "10": 6.0,
};

// Blended average: minor incidents (reboot/swap, ~$100) and major failures (projector death, ~$2K+)
// IT dispatch 1.5hr × $55 ($82) + instructor time ($80) + rescheduling ($15) + parts ($50) = ~$227 base
// With occasional major failures blended in, $500 is conservative and auditable
export const COST_PER_DOWNTIME_EVENT = 500;

// ── Configuration & Maintenance ───────────────────────────────────────
// REMI Group equipment lifecycle analysis, Epiphan TCO model
export const CONFIG_HOURS_PER_ROOM: AgeMultiplierTable = {
  "3": 1.0,
  "5": 2.5,
  "7": 3.5,
  "10": 4.0,
};

export const PARTS_COST_PER_ROOM: AgeMultiplierTable = {
  "3": 50,
  "5": 150,
  "7": 350,
  "10": 700,
};

export const IT_HOURLY_RATE = 55; // fully loaded IT cost

// ── ADA / Accessibility Compliance ────────────────────────────────────
// 3Play Media / AudioEye: 97% gap, $27K avg settlement
export const ADA_COST_PER_ROOM: AgeMultiplierTable = {
  "3": 80,
  "5": 200,
  "7": 400,
  "10": 750,
};

export const ADA_MINIMUM_COST = 25000;

// ── Student Retention ─────────────────────────────────────────────────
// Springer Higher Education: lecture capture availability reduces attrition 12.3% → 5%
// Halved from original estimates — conservative: "students whose experience was degraded
// enough to contribute to their decision to leave" vs. direct causal attribution
export const RETENTION_PCT_BY_AGE: AgeMultiplierTable = {
  "3": 0.001,
  "5": 0.0025,
  "7": 0.004,
  "10": 0.005,
};

// ── Staff Efficiency ──────────────────────────────────────────────────
// NC State: 300+ rooms with team of 3 — benchmark for cloud-managed
// Collegis Education / OculusIT benchmarks
export const OPTIMAL_ROOMS_PER_PERSON = 100;

// ── Product Pricing ──────────────────────────────────────────────────
// Validated against the live Epiphan AI product catalog on 2026-06-19
// (search_product_catalog). SKUs: Pearl Nano ESP1610, Pearl Nexus 256-SD
// ESP1948 (standard), EC20 ESP1899, Pearl-2 ESP1150.
export const PRODUCT_PRICES = {
  nano: 1999,       // Pearl Nano (ESP1610) — single-input encoder, PoE+ — catalog ✓
  nexus: 3999,      // Pearl Nexus 256-SD (ESP1948) — NDI encoder — catalog ✓ (was $3,299; corrected 2026-06-19)
  ec20: 1899,       // EC20 PTZ Camera (ESP1899) — AI auto-tracking — catalog ✓
  pearl2: 8999,     // Pearl-2 (ESP1150) — flagship, 4K add-on included — catalog ✓ (was $7,999; corrected 2026-06-19)
} as const;

// Conservative: list price of the two SKUs bought together. The real
// "Lect Cap Essential" bundle SKU (ESP1904, Nexus + 1 EC20) lists at $5,329 —
// cheaper than this sum, so modeling the sum slightly overstates investment
// (i.e. understates ROI), which keeps the analysis defensible.
export const NEXUS_EC20_BUNDLE = PRODUCT_PRICES.nexus + PRODUCT_PRICES.ec20; // $5,898

// ── Room Mix by Deployment Size ─────────────────────────────────────
// Reflects realistic campus composition: not every room needs a camera,
// some only need basic capture, a few need multi-cam production
export interface RoomMix {
  nano: number;
  nexus: number;
  nexusEc20: number;
  pearl2: number;
}

export function getRoomMix(rooms: number): RoomMix {
  if (rooms <= 25) {
    // Small: purpose-built rooms, most have existing cameras
    const nexus = Math.round(rooms * 0.70);
    const nexusEc20 = rooms - nexus;
    return { nano: 0, nexus, nexusEc20, pearl2: 0 };
  }
  if (rooms <= 200) {
    // Mid-size: full campus mix
    const nano = Math.round(rooms * 0.20);
    const nexus = Math.round(rooms * 0.25);
    const pearl2 = Math.round(rooms * 0.05);
    const nexusEc20 = rooms - nano - nexus - pearl2;
    return { nano, nexus, nexusEc20, pearl2 };
  }
  // Large: more flagship spaces at scale
  const nano = Math.round(rooms * 0.25);
  const nexus = Math.round(rooms * 0.15);
  const pearl2 = Math.round(rooms * 0.10);
  const nexusEc20 = rooms - nano - nexus - pearl2;
  return { nano, nexus, nexusEc20, pearl2 };
}

export function getInvestmentFromMix(mix: RoomMix): number {
  return (
    mix.nano * PRODUCT_PRICES.nano +
    mix.nexus * PRODUCT_PRICES.nexus +
    mix.nexusEc20 * NEXUS_EC20_BUNDLE +
    mix.pearl2 * PRODUCT_PRICES.pearl2
  );
}

// ── EC20 Direct-to-CMS Ramp ─────────────────────────────────────────────
// The lowest-barrier "start simple" path: one EC20 PTZ camera per room,
// publishing straight to the CMS with NO encoder in the path. Not the lowest
// TOTAL cost (a concurrency pool is cheaper at scale), but the simplest
// "a capture device in every room" / phase-1 / new-logo entry — and a genuine
// saving versus the encoder-in-every-room blended mix. $1,899/room (catalog ✓).
export function getEc20DirectInvestment(rooms: number): number {
  return rooms * PRODUCT_PRICES.ec20;
}

// ── Centralized Encoder Pool (concurrency-based "more affordable path") ─
// Encoders are sized by how many rooms record at the SAME moment, not by
// total room count: most rooms aren't live simultaneously, so a small shared
// pool of central rack encoders can cover a whole campus.
//
// `feeds` = separate, simultaneous, isolated 1080p30 recordings one unit
// handles, taken from each product user guide's conservative "best
// performance" channel count:
//   • Pearl-2:     "For best performance, we recommend using a maximum of six
//                   ... in up to six full HD channels" → 6
//   • Pearl Nexus: "two video sources in up to two full HD channels"; also
//                   "up to two 1080p30 SRT, RTSP, or NDI HX inputs are
//                   recommended" — doubly grounded for networked room ingest → 2
// Pearl Nano is single-channel with no switching, so a "pool" of Nanos is just
// one box per room (defeats the central-pool premise) — intentionally excluded.
// This is a directional starting point for budget conversations — not a quote.
// An Epiphan account engineer scopes the actual design (cameras, routing, POC).
export interface PoolEncoder {
  id: string;
  label: string;
  feeds: number;
  price: number;
}

export const POOL_ENCODERS: PoolEncoder[] = [
  { id: "nexus", label: "Pearl Nexus", feeds: 2, price: PRODUCT_PRICES.nexus },
  { id: "pearl2", label: "Pearl-2", feeds: 6, price: PRODUCT_PRICES.pearl2 },
];

export interface PooledPlan {
  model: string;
  encoders: number;
  investment: number;
}

// Smallest deployment where a centrally managed pool is worth teasing. Below
// this, per-room and pooled costs converge and the "fewer shared boxes" story
// doesn't hold, so the buyer-facing tease is hidden.
export const MIN_ROOMS_FOR_POOLED_PATH = 12;

// Conservative default peak: ~1 in 4 rooms live at the busiest moment.
export function defaultConcurrentRooms(rooms: number): number {
  return Math.min(rooms, Math.max(2, Math.round(rooms * 0.25)));
}

// Pick the lowest-investment central-encoder pool for a given peak concurrency.
// Ties break toward fewer rack units (a denser, simpler-to-manage pool).
export function getPooledPlan(concurrentRooms: number): PooledPlan {
  const feedsNeeded = Math.max(1, concurrentRooms);
  let best: PooledPlan | null = null;
  for (const enc of POOL_ENCODERS) {
    const encoders = Math.max(1, Math.ceil(feedsNeeded / enc.feeds));
    const investment = encoders * enc.price;
    if (
      best === null ||
      investment < best.investment ||
      (investment === best.investment && encoders < best.encoders)
    ) {
      best = { model: enc.label, encoders, investment };
    }
  }
  // POOL_ENCODERS is non-empty, so best is always assigned.
  return best as PooledPlan;
}

// 3-year escalation factor (maintenance costs grow over time)
export const THREE_YEAR_MULTIPLIER = 3.15;

// Booking link for the "Talk to an Epiphan AE" CTA. Single source of truth so a
// routing change is a one-line edit, not a hunt through component JSX.
export const AE_BOOKING_URL = "https://meetings.hubspot.com/timkipper/discovery-call";

// ── Scenario Presets ──────────────────────────────────────────────────
export interface ScenarioPreset {
  label: string;
  rooms: number;
  students: number;
  tuition: number;
  currentFTE: number;
  equipmentAge: EquipmentAge;
  lecturesPerWeek: number;
  teachWeeks: number;
  itSalary: number;
  concurrentRooms?: number;
}

export const SCENARIOS: ScenarioPreset[] = [
  { label: "Community College", rooms: 40,  students: 6000,   tuition: 5000,  currentFTE: 1,  equipmentAge: "7",  lecturesPerWeek: 12, teachWeeks: 30, itSalary: 68000, concurrentRooms: 8 },
  { label: "Department",      rooms: 10,    students: 800,    tuition: 30000, currentFTE: 1,  equipmentAge: "7",  lecturesPerWeek: 10, teachWeeks: 28, itSalary: 70000 },
  { label: "Small Campus",    rooms: 25,    students: 2000,   tuition: 28000, currentFTE: 1,  equipmentAge: "5",  lecturesPerWeek: 12, teachWeeks: 30, itSalary: 75000 },
  { label: "Mid-Size",        rooms: 150,   students: 12000,  tuition: 22000, currentFTE: 4,  equipmentAge: "5",  lecturesPerWeek: 15, teachWeeks: 30, itSalary: 85000 },
  { label: "Large University", rooms: 500,  students: 35000,  tuition: 18000, currentFTE: 10, equipmentAge: "7",  lecturesPerWeek: 15, teachWeeks: 30, itSalary: 90000 },
  { label: "Major System",    rooms: 1000,  students: 55000,  tuition: 15000, currentFTE: 18, equipmentAge: "7",  lecturesPerWeek: 18, teachWeeks: 32, itSalary: 95000 },
];

// ── Input Defaults ────────────────────────────────────────────────────
export const DEFAULT_INPUTS = {
  rooms: 150,
  equipmentAge: "5" as EquipmentAge,
  lecturesPerWeek: 15,
  teachWeeks: 30,
  students: 12000,
  tuition: 22000,
  itSalary: 85000,
  currentFTE: 4,
  concurrentRooms: 38, // defaultConcurrentRooms(150) — peak rooms recording at once
};

// ── Equipment Age Options (for select dropdown) ───────────────────────
export const EQUIPMENT_AGE_OPTIONS = [
  { value: "3" as EquipmentAge, label: "3 years (approaching refresh)" },
  { value: "5" as EquipmentAge, label: "5 years (standard cycle end)" },
  { value: "7" as EquipmentAge, label: "7 years (overdue)" },
  { value: "10" as EquipmentAge, label: "10+ years (critical)" },
];
