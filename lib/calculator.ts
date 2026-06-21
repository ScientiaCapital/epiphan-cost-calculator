import {
  type EquipmentAge,
  type RoomMix,
  TICKET_BASE_RATE,
  TICKET_AGE_MULTIPLIER,
  COST_PER_TICKET,
  MINUTES_PER_TICKET,
  FAIL_RATES,
  RECORDING_UTILIZATION,
  COST_PER_MISSED_CAPTURE,
  STUDENTS_PER_LECTURE,
  DOWNTIME_EVENTS_PER_ROOM,
  COST_PER_DOWNTIME_EVENT,
  CONFIG_HOURS_PER_ROOM,
  PARTS_COST_PER_ROOM,
  IT_HOURLY_RATE,
  ADA_COST_PER_ROOM,
  ADA_MINIMUM_COST,
  RETENTION_PCT_BY_AGE,
  THREE_YEAR_MULTIPLIER,
  THREE_YEAR_FLAT_MULTIPLIER,
  getRoomMix,
  getInvestmentFromMix,
  getEc20DirectInvestment,
  defaultConcurrentRooms,
  getPooledPlan,
  MIN_ROOMS_FOR_POOLED_PATH,
} from "./constants";
import {
  type Vertical,
  type Framing,
  type ResultMode,
  getVerticalConfig,
} from "./verticals";

// ── Input / Output Types ──────────────────────────────────────────────

export interface CalculatorInputs {
  rooms: number;
  equipmentAge: EquipmentAge;
  lecturesPerWeek: number;
  teachWeeks: number;
  students: number;
  tuition: number;
  itSalary: number;
  currentFTE: number;
  // Peak rooms recording at the same moment. Optional: when omitted,
  // calculate() derives a conservative default from room count.
  concurrentRooms?: number;
  // Vertical + framing. Optional; default vertical is "higher-ed" so existing
  // callers (and the 71 baseline tests) behave exactly as before.
  vertical?: Vertical;
  framing?: Framing;
}

export interface CategoryCost {
  name: string;
  cost: number;
  barColor: "red" | "amber" | "blue";
}

export interface CalculatorResults {
  // Totals
  annualCost: number;
  threeYearCost: number;
  // Conservative totals with the single-study retention layer (#7) removed.
  annualCostExRetention: number;
  threeYearCostExRetention: number;
  retentionShareOfAnnual: number;

  // Per-category costs
  ticketCost: number;
  missedCaptureCost: number;
  downtimeCost: number;
  staffCost: number;
  maintenanceCost: number;
  adaCost: number;
  retentionCost: number;

  // Category breakdown for rendering
  categories: CategoryCost[];

  // Detail fields for category 1 (IT Staff Time)
  ticketsPerRoomYear: number;
  totalTickets: number;
  ticketHours: number;

  // Detail fields for category 2 (Failed Captures)
  failRate: number;
  totalLectures: number;
  missedLectures: number;
  studentsAffected: number;

  // Detail fields for category 3 (Classroom Downtime)
  downtimeEventsPerRoom: number;
  totalDowntimeEvents: number;

  // Detail fields for category 4 (Manual Operation)
  currentRoomsPerPerson: number;
  optimalFTE: number;
  excessFTE: number;

  // Detail fields for category 5 (Config & Maintenance)
  configHoursPerRoom: number;

  // Detail fields for category 7 (Student Retention)
  retentionPercent: number;

  // Solution / metrics
  hoursReclaimed: number;
  roomMix: RoomMix;
  blendedPerRoom: number;
  totalInvestment: number;
  paybackMonths: number;
  roi3Year: number;

  // Centralized encoder pool (concurrency-based "more affordable path")
  concurrentRooms: number;
  pooledModel: string;
  pooledEncoders: number;
  pooledInvestment: number;
  showPooledPath: boolean;

  // EC20 direct-to-CMS ramp (one camera/room, no encoder — phase-1 / new-logo wedge)
  ec20DirectUnits: number;
  ec20DirectInvestment: number;
  showEc20DirectPath: boolean;

  // Vertical context. resultMode "cost" → show full $ (Higher Ed / Community
  // College); "fit" → show portfolio fit + discovery (Live Events / Corporate /
  // Broadcast), where dollar drivers are not yet calibrated.
  vertical: Vertical;
  framing: Framing;
  resultMode: ResultMode;
}

// ── Calculator ────────────────────────────────────────────────────────

export function calculate(inputs: CalculatorInputs): CalculatorResults {
  const { rooms, equipmentAge, lecturesPerWeek, teachWeeks, students, tuition, itSalary, currentFTE } = inputs;
  const concurrentRooms = Math.min(rooms, inputs.concurrentRooms ?? defaultConcurrentRooms(rooms));

  // Vertical config drives the few vertical-specific knobs (staffing density,
  // whether the revenue-at-risk model applies). Default = "higher-ed".
  const vertical = inputs.vertical ?? "higher-ed";
  const verticalConfig = getVerticalConfig(vertical);
  const framing = inputs.framing ?? verticalConfig.defaultFraming;

  const totalLectures = rooms * lecturesPerWeek * teachWeeks;

  // 1. IT Staff Time Wasted
  const ticketsPerRoomYear = TICKET_BASE_RATE * TICKET_AGE_MULTIPLIER[equipmentAge];
  const totalTickets = Math.round(rooms * ticketsPerRoomYear);
  const ticketHours = Math.round(totalTickets * MINUTES_PER_TICKET / 60);
  const ticketCost = totalTickets * COST_PER_TICKET;

  // 2. Failed & Missed Captures (only rooms with active recording schedules)
  const failRate = FAIL_RATES[equipmentAge];
  const missedLectures = Math.round(totalLectures * RECORDING_UTILIZATION * failRate);
  const studentsAffected = missedLectures * STUDENTS_PER_LECTURE;
  const missedCaptureCost = missedLectures * COST_PER_MISSED_CAPTURE;

  // 3. Classroom Downtime
  const downtimeEventsPerRoom = DOWNTIME_EVENTS_PER_ROOM[equipmentAge];
  const totalDowntimeEvents = Math.round(rooms * downtimeEventsPerRoom);
  const downtimeCost = totalDowntimeEvents * COST_PER_DOWNTIME_EVENT;

  // 4. Manual Operation Burden (FTE redeployment)
  const currentRoomsPerPerson = Math.round(rooms / currentFTE);
  const optimalFTE = Math.max(1, Math.ceil(rooms / verticalConfig.staffOptimalUnitsPerPerson));
  const excessFTE = Math.max(0, currentFTE - optimalFTE);
  const staffCost = excessFTE * itSalary;

  // 5. Configuration & Maintenance Labor
  const configHoursPerRoom = CONFIG_HOURS_PER_ROOM[equipmentAge];
  const configLabor = rooms * configHoursPerRoom * IT_HOURLY_RATE;
  const partsCost = rooms * PARTS_COST_PER_ROOM[equipmentAge];
  const maintenanceCost = configLabor + partsCost;

  // 6. ADA Compliance Exposure
  const adaCost = Math.max(ADA_MINIMUM_COST, rooms * ADA_COST_PER_ROOM[equipmentAge]);

  // 7. Student Retention — At-Risk Revenue (only when the vertical's revenue
  // model is calibrated; "fit" verticals don't show a dollar total).
  const retentionPercent = RETENTION_PCT_BY_AGE[equipmentAge];
  const retentionCost = verticalConfig.appliesRevenueModel
    ? students * retentionPercent * tuition
    : 0;

  // Totals
  const annualCost = ticketCost + missedCaptureCost + downtimeCost + staffCost + maintenanceCost + adaCost + retentionCost;

  // 3-year horizon: age-driven operational costs escalate (×3.15); ADA exposure
  // and retention revenue-at-risk are flat annual figures (×3, no escalation).
  const escalatingAnnual = ticketCost + missedCaptureCost + downtimeCost + staffCost + maintenanceCost;
  const flatAnnual = adaCost + retentionCost;
  const threeYearCost = escalatingAnnual * THREE_YEAR_MULTIPLIER + flatAnnual * THREE_YEAR_FLAT_MULTIPLIER;

  // Conservative view: the cost of inaction with the single-study retention
  // layer (#7) removed. Retention can be ~40%+ of the HE headline on a single
  // study, so expose the ex-retention totals for a "lead with the floor" toggle.
  const annualCostExRetention = annualCost - retentionCost;
  const threeYearCostExRetention = threeYearCost - retentionCost * THREE_YEAR_FLAT_MULTIPLIER;
  const retentionShareOfAnnual = annualCost > 0 ? retentionCost / annualCost : 0;

  // Hours reclaimed = ticket handling hours + config labor hours
  const hoursReclaimed = ticketHours + Math.round(rooms * configHoursPerRoom);

  // Investment & ROI — use blended room mix
  const roomMix = getRoomMix(rooms);
  const totalInvestment = getInvestmentFromMix(roomMix);
  const blendedPerRoom = Math.round(totalInvestment / rooms);
  const paybackMonths = Math.min(36, Math.max(1, Math.round((totalInvestment / annualCost) * 12)));
  const roi3Year = Math.round(((threeYearCost - totalInvestment) / totalInvestment) * 100);

  // Centralized encoder pool — sized by concurrency, not room count.
  // Show the tease only for deployments large enough for pooling to make sense
  // and where it genuinely beats the room-by-room investment.
  const pooled = getPooledPlan(concurrentRooms);
  const showPooledPath = rooms >= MIN_ROOMS_FOR_POOLED_PATH && pooled.investment < totalInvestment;

  // EC20 direct-to-CMS ramp — one camera per room, no encoder, publishes straight
  // to the CMS. The simplest "start here" / phase-1 path. A genuine saving vs the
  // encoder-in-every-room mix; the pool is cheaper still at scale, so this sits
  // between the two and is framed by purpose (low-barrier entry), not lowest price.
  const ec20DirectUnits = rooms;
  const ec20DirectInvestment = getEc20DirectInvestment(rooms);
  const showEc20DirectPath = ec20DirectInvestment < totalInvestment;

  // Category breakdown for rendering — ordered by credibility tier
  // Tier 1: Operational (hard budget costs)
  // Tier 2: Productivity (measured losses)
  // Tier 3: Institutional Risk (compliance & retention)
  const categories: CategoryCost[] = [
    { name: "IT Staff Time Wasted", cost: ticketCost, barColor: "red" },
    { name: "Manual Operation Burden", cost: staffCost, barColor: "amber" },
    { name: "Configuration & Maintenance Labor", cost: maintenanceCost, barColor: "blue" },
    { name: "Failed & Missed Captures", cost: missedCaptureCost, barColor: "red" },
    { name: "Classroom Downtime", cost: downtimeCost, barColor: "amber" },
    { name: "ADA / Accessibility Compliance Exposure", cost: adaCost, barColor: "red" },
    { name: "Student Retention — At-Risk Revenue", cost: retentionCost, barColor: "blue" },
  ];

  return {
    annualCost,
    threeYearCost,
    annualCostExRetention,
    threeYearCostExRetention,
    retentionShareOfAnnual,
    ticketCost,
    missedCaptureCost,
    downtimeCost,
    staffCost,
    maintenanceCost,
    adaCost,
    retentionCost,
    categories,
    ticketsPerRoomYear,
    totalTickets,
    ticketHours,
    failRate,
    totalLectures,
    missedLectures,
    studentsAffected,
    downtimeEventsPerRoom,
    totalDowntimeEvents,
    currentRoomsPerPerson,
    optimalFTE,
    excessFTE,
    configHoursPerRoom,
    retentionPercent,
    hoursReclaimed,
    roomMix,
    blendedPerRoom,
    totalInvestment,
    paybackMonths,
    roi3Year,
    concurrentRooms,
    pooledModel: pooled.model,
    pooledEncoders: pooled.encoders,
    pooledInvestment: pooled.investment,
    showPooledPath,
    ec20DirectUnits,
    ec20DirectInvestment,
    showEc20DirectPath,
    vertical,
    framing,
    resultMode: verticalConfig.mode,
  };
}

// ── Formatting Utilities ──────────────────────────────────────────────

export function formatCurrency(n: number): string {
  return "$" + Math.round(n).toLocaleString("en-US");
}

export function formatCompact(n: number): string {
  if (n >= 1000) {
    const k = n / 1000;
    return k % 1 === 0 ? k.toFixed(0) + "K" : k.toFixed(1).replace(/\.0$/, "") + "K";
  }
  return Math.round(n).toLocaleString("en-US");
}
