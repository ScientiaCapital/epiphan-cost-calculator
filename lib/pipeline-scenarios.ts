// ── Pipeline Scenarios — real higher-ed deals from Clari sales calls ──────
//
// Each entry is a real account that [redacted-rep] or [redacted-rep] worked between
// 2026-02-01 and 2026-06-19, sourced from substantive (connected, summarized)
// Clari Copilot calls and fed into the Cost-of-Inaction calculator.
//
// PROVENANCE & METHODOLOGY (read before trusting any number):
//   - `rooms` is call-sourced: either the unit count stated on the call /
//     deal record, or the campus footprint the customer described. See
//     `roomsBasis` per row and `callId` for the source recording.
//   - `equipmentAge` reflects refresh signals on the call (e.g. replacing
//     [redacted-cms] / [redacted-cms] / [redacted-cms] -> "7"; brand-new build -> "3"/"5").
//   - `students` is DEPLOYMENT-SCOPED, not total enrollment: ~80 students per
//     captured room (the ratio the app's own SCENARIOS use: 10->800, 25->2000,
//     150->12000), clamped to >=500. The retention bucket multiplies students
//     x tuition, so using full campus enrollment for a small deployment would
//     inflate ROI to indefensible levels. Scoping keeps it honest.
//   - `tuition`, `itSalary`, `currentFTE`, `lecturesPerWeek`, `teachWeeks` are
//     NOT usually stated on a sales call. They are public institutional figures
//     (~2025) or institution-type defaults, clamped to the calculator's valid
//     ranges. Treat them as estimates, not quotes.
//   - This is an ROI / cost-of-inaction model, not a quote. The recommended
//     product mix is generated from room count by getRoomMix(); it does not
//     mirror the exact SKUs a rep proposed on the call.
//
// Single source of truth for: the in-app "Real deals" preset group
// (components/scenario-bar.tsx) and the report generator
// (scripts/generate-account-reports.ts).

import type { ScenarioPreset } from "./constants";

export interface PipelineScenario extends ScenarioPreset {
  /** Account name as it appears in Clari / HubSpot. */
  account: string;
  /** Clari call UUID this scenario was derived from. */
  callId: string;
  /** Call date (ISO yyyy-mm-dd). */
  callDate: string;
  /** Primary Epiphan rep on the call. */
  rep: "[redacted-rep]" | "[redacted-rep]";
  /** Products discussed on the call. */
  product: string;
  /** One-line cost-of-inaction hook distilled from the call. */
  pain: string;
  /** Where the room count came from (call quote / deal record / footprint). */
  roomsBasis: string;
}

export const PIPELINE_SCENARIOS: PipelineScenario[] = [
  {
    label: "Augusta University",
    account: "Augusta University",
    callId: "91cb3710-201f-4481-88fa-50a3571dce26",
    callDate: "2026-03-30",
    rep: "[redacted-rep]",
    product: "Pearl Nexus",
    pain: "Replacing a fleet of 199 [redacted-cms] Pro appliances that integrate poorly with [redacted-av] and [redacted-av].",
    roomsBasis: "Call: manages a fleet of 199 [redacted-cms] Pro appliances.",
    rooms: 199, equipmentAge: "7", lecturesPerWeek: 15, teachWeeks: 30,
    students: 15920, tuition: 9000, itSalary: 75000, currentFTE: 4,
  },
  {
    label: "Baylor (Hankamer)",
    account: "Baylor University",
    callId: "3999922c-0a58-4dce-b986-07e2227d342f",
    callDate: "2026-03-31",
    rep: "[redacted-rep]",
    product: "Pearl Nexus",
    pain: "Hankamer School of Business summer refresh; ordering ahead of a price increase.",
    roomsBasis: "Deal record: QTY (12) Pearl Nexus.",
    rooms: 12, equipmentAge: "5", lecturesPerWeek: 12, teachWeeks: 30,
    students: 960, tuition: 55000, itSalary: 85000, currentFTE: 1,
  },
  {
    label: "Columbia (Fu Eng.)",
    account: "Columbia University",
    callId: "9e830d6d-a08d-4e90-9e69-bc67c1daeca1",
    callDate: "2026-04-14",
    rep: "[redacted-rep]",
    product: "Pearl Nexus + Epiphan Edge",
    pain: "Expanding beyond limited ad-hoc capture to record all engineering classes; phased over a year.",
    roomsBasis: "Call: aiming to equip approximately 75 classrooms.",
    rooms: 75, equipmentAge: "5", lecturesPerWeek: 15, teachWeeks: 30,
    students: 6000, tuition: 66000, itSalary: 95000, currentFTE: 3,
  },
  {
    label: "Cornell (SC Johnson)",
    account: "Cornell University",
    callId: "dc2421e0-dbb6-4479-8bf1-7dbbc28d0a98",
    callDate: "2026-06-10",
    rep: "[redacted-rep]",
    product: "Pearl Nexus, Pearl-2, Epiphan Edge",
    pain: "Standardizing the Business school on Epiphan Edge fleet management across 17 units.",
    roomsBasis: "Call: 17 units total, including two Pearl-2 units.",
    rooms: 17, equipmentAge: "5", lecturesPerWeek: 12, teachWeeks: 30,
    students: 1360, tuition: 65000, itSalary: 95000, currentFTE: 1,
  },
  {
    label: "DePaul (Jarvis)",
    account: "DePaul University",
    callId: "81714e5c-22a7-49db-92db-d8c07faa71f8",
    callDate: "2026-06-12",
    rep: "[redacted-rep]",
    product: "Pearl Nano, Pearl Nexus",
    pain: "Aging homegrown lecture-capture system plus an unreliable studio deck; summer '26 budget cycle.",
    roomsBasis: "Deal record: Summer '26, 90 rooms.",
    rooms: 90, equipmentAge: "7", lecturesPerWeek: 15, teachWeeks: 30,
    students: 7200, tuition: 43000, itSalary: 80000, currentFTE: 3,
  },
  {
    label: "Drexel University",
    account: "Drexel University",
    callId: "0b5393c6-1fe2-4946-8a01-edd4b5408595",
    callDate: "2026-03-09",
    rep: "[redacted-rep]",
    product: "Pearl Nexus + Epiphan Edge",
    pain: "Fragmented control systems across departments; needs HIPAA-aware capture and fleet management.",
    roomsBasis: "Deal record: 10 Nexus.",
    rooms: 10, equipmentAge: "5", lecturesPerWeek: 15, teachWeeks: 30,
    students: 800, tuition: 60000, itSalary: 85000, currentFTE: 1,
  },
  {
    label: "Duke (MMCi)",
    account: "Duke University",
    callId: "bacc1fa4-1775-483e-94dc-c22c0436e123",
    callDate: "2026-04-14",
    rep: "[redacted-rep]",
    product: "Pearl Nexus + Epiphan Edge",
    pain: "Standardizing engineering-school classrooms on Pearl Nexus with [redacted-cms] integration.",
    roomsBasis: "Call: six recorders installed, two more planned (8).",
    rooms: 8, equipmentAge: "3", lecturesPerWeek: 10, teachWeeks: 30,
    students: 640, tuition: 63000, itSalary: 95000, currentFTE: 1,
  },
  {
    label: "Harvard (FAS)",
    account: "Harvard University Faculty of Arts & Sciences",
    callId: "64bd9cb5-85cd-49ca-867f-ae0bc4e12536",
    callDate: "2026-03-10",
    rep: "[redacted-rep]",
    product: "EC20 PTZ Camera",
    pain: "Auto-tracking needed across an estimated 500 to 600 small classrooms.",
    roomsBasis: "Call: 500 to 600 small classrooms could need auto-tracking (midpoint 550).",
    rooms: 550, equipmentAge: "7", lecturesPerWeek: 15, teachWeeks: 30,
    students: 44000, tuition: 57000, itSalary: 95000, currentFTE: 8,
  },
  {
    label: "NC State",
    account: "NC State",
    callId: "872fd50f-923b-417f-8aa9-c193d38a2503",
    callDate: "2026-06-04",
    rep: "[redacted-rep]",
    product: "Pearl-2, Pearl Nexus",
    pain: "Standardized on Epiphan campus-wide; decommissioning older Pearl Mini units under budget pressure.",
    roomsBasis: "Campus footprint: 300-plus capture rooms (Epiphan reference account).",
    rooms: 300, equipmentAge: "7", lecturesPerWeek: 15, teachWeeks: 30,
    students: 24000, tuition: 15000, itSalary: 75000, currentFTE: 6,
  },
  {
    label: "Northwestern",
    account: "Northwestern University",
    callId: "809717f2-be2d-4fb1-b938-6afc763b0c51",
    callDate: "2026-03-18",
    rep: "[redacted-rep]",
    product: "Pearl Nexus + EC20, Epiphan Connect",
    pain: "Large video-studio build; needs 100 recorders and 136 cameras before a price increase.",
    roomsBasis: "Call: confirmed need for 100 Nexus units (and 136 cameras).",
    rooms: 100, equipmentAge: "5", lecturesPerWeek: 15, teachWeeks: 30,
    students: 8000, tuition: 65000, itSalary: 95000, currentFTE: 4,
  },
  {
    label: "NYU Stern",
    account: "NYU Stern School of Business",
    callId: "a113dfe0-57a5-448e-aaeb-8c6a519baf91",
    callDate: "2026-04-28",
    rep: "[redacted-rep]",
    product: "Pearl Nexus",
    pain: "Migrating off [redacted-cms] to a hardware-agnostic platform; contract expires in two years.",
    roomsBasis: "Deal record: QTY (52) Pearl Nexus deployment.",
    rooms: 52, equipmentAge: "7", lecturesPerWeek: 12, teachWeeks: 30,
    students: 4160, tuition: 60000, itSalary: 95000, currentFTE: 2,
  },
  {
    label: "Old Dominion",
    account: "Old Dominion University",
    callId: "93499972-2dd5-42e0-87c5-f86c9c6b7354",
    callDate: "2026-04-08",
    rep: "[redacted-rep]",
    product: "Pearl Nexus + Epiphan Edge",
    pain: "Replacing Zoom-room kludges with one-touch capture; 80 rooms this summer, 300 over three years.",
    roomsBasis: "Call: approximately 300 rooms over three years (80 in phase one).",
    rooms: 300, equipmentAge: "7", lecturesPerWeek: 15, teachWeeks: 30,
    students: 24000, tuition: 11000, itSalary: 75000, currentFTE: 8,
  },
  {
    label: "Tufts University",
    account: "Tufts University",
    callId: "0a0bc6ac-aee6-4e6e-a8a0-60af1bda3889",
    callDate: "2026-04-08",
    rep: "[redacted-rep]",
    product: "Pearl Nexus, Pearl Mini",
    pain: "Replacing [redacted-cms] first-party hardware across an extensive AV estate.",
    roomsBasis: "Estimate: large institution replacing [redacted-cms] hardware (no unit count stated).",
    rooms: 60, equipmentAge: "7", lecturesPerWeek: 15, teachWeeks: 30,
    students: 4800, tuition: 68000, itSalary: 95000, currentFTE: 3,
  },
  {
    label: "UC Berkeley (Haas)",
    account: "UC Berkeley",
    callId: "d71859bc-5301-4381-95fc-492a4d834434",
    callDate: "2026-04-15",
    rep: "[redacted-rep]",
    product: "Pearl Nexus, Pearl-2",
    pain: "Replacing failing [redacted-cms] scribe recorders; rack space favors the Nexus form factor.",
    roomsBasis: "Call: replacing 19 to 23 recorders (midpoint 21).",
    rooms: 21, equipmentAge: "7", lecturesPerWeek: 15, teachWeeks: 30,
    students: 1680, tuition: 22000, itSalary: 95000, currentFTE: 2,
  },
  {
    label: "UNC Chapel Hill",
    account: "University of North Carolina - Chapel Hill",
    callId: "6bf2b1ef-f6b0-477d-b5de-c8ab26099088",
    callDate: "2026-06-04",
    rep: "[redacted-rep]",
    product: "Pearl Nexus, EC20",
    pain: "Replacing 20 to 30 [redacted-cms] units a year; projecting roughly 40 Pearl Nexus by 2029.",
    roomsBasis: "Call: projected deployment of about 40 Pearl Nexus by 2029.",
    rooms: 40, equipmentAge: "7", lecturesPerWeek: 15, teachWeeks: 30,
    students: 3200, tuition: 15000, itSalary: 75000, currentFTE: 2,
  },
  {
    label: "U of Saskatchewan",
    account: "University of Saskatchewan",
    callId: "8a25a024-3f4f-48fc-a06a-205a04d97738",
    callDate: "2026-06-10",
    rep: "[redacted-rep]",
    product: "EC20 PTZ Camera + Pearl Nexus",
    pain: "Low-latency capture of medical simulations and exams across clinic rooms.",
    roomsBasis: "Deal record: QTY (24) EC20 for clinic rooms.",
    rooms: 24, equipmentAge: "5", lecturesPerWeek: 10, teachWeeks: 30,
    students: 1920, tuition: 8000, itSalary: 75000, currentFTE: 2,
  },
  {
    label: "Vanderbilt (SoM)",
    account: "Vanderbilt University",
    callId: "3c3efec7-41e1-4fca-bc41-835cf877d21a",
    callDate: "2026-03-27",
    rep: "[redacted-rep]",
    product: "Pearl Nexus",
    pain: "School of Medicine lecture-capture refresh in a new building; faculty adoption is the hurdle.",
    roomsBasis: "Estimate: new-building lecture-capture refresh (no unit count stated).",
    rooms: 15, equipmentAge: "5", lecturesPerWeek: 18, teachWeeks: 30,
    students: 1200, tuition: 63000, itSalary: 95000, currentFTE: 1,
  },
  {
    label: "Yale University",
    account: "Yale Emerging Climate Leaders Fellowship",
    callId: "3c6f5fab-c764-47aa-b3d4-f0e5c9ec8eb2",
    callDate: "2026-05-06",
    rep: "[redacted-rep]",
    product: "Pearl Nexus + Epiphan Edge",
    pain: "Standing up Epiphan Edge fleet management ahead of a 50-unit Nexus rollout.",
    roomsBasis: "Deal record: Yale University, 50 Nexus.",
    rooms: 50, equipmentAge: "5", lecturesPerWeek: 15, teachWeeks: 30,
    students: 4000, tuition: 64000, itSalary: 95000, currentFTE: 2,
  },
  {
    label: "Kwantlen Polytechnic",
    account: "Kwantlen Polytechnic University",
    callId: "06a9cb79-5a8d-450a-9027-8a449469fad4",
    callDate: "2026-05-19",
    rep: "[redacted-rep]",
    product: "Pearl Mini, Pearl Nexus, EC20",
    pain: "Mixed aging fleet under an enrollment-driven spending freeze; Nexus currently out of stock.",
    roomsBasis: "Estimate: Pearl Minis and Nexus across most classrooms and conference centers.",
    rooms: 25, equipmentAge: "7", lecturesPerWeek: 15, teachWeeks: 30,
    students: 2000, tuition: 5500, itSalary: 75000, currentFTE: 2,
  },
  {
    label: "McMaster University",
    account: "McMaster University",
    callId: "94e4517f-9f74-4a52-9b82-bae1ca298963",
    callDate: "2026-06-15",
    rep: "[redacted-rep]",
    product: "Pearl Nexus, EC20",
    pain: "Phase-3 lecture-capture rollout; needs configurable file-retention for privacy compliance.",
    roomsBasis: "Estimate: phase-3 lecture-capture rollout (no unit count stated).",
    rooms: 25, equipmentAge: "7", lecturesPerWeek: 15, teachWeeks: 30,
    students: 2000, tuition: 6500, itSalary: 75000, currentFTE: 2,
  },
  {
    label: "Rice University",
    account: "Rice University",
    callId: "fcb193dd-eade-4452-a5b4-98d0c881cc01",
    callDate: "2026-05-04",
    rep: "[redacted-rep]",
    product: "EC20 PTZ Camera",
    pain: "Classroom upgrade project adding auto-tracking cameras with [redacted-cms] integration.",
    roomsBasis: "Deal record: Classroom Upgrades, EC20 (5).",
    rooms: 5, equipmentAge: "5", lecturesPerWeek: 15, teachWeeks: 30,
    students: 500, tuition: 58000, itSalary: 85000, currentFTE: 1,
  },
  {
    label: "UF Levin (Law)",
    account: "University of Florida Levin College of Law",
    callId: "9152a7cf-a6ad-4cfb-8020-167998e4950f",
    callDate: "2026-03-12",
    rep: "[redacted-rep]",
    product: "EC20 PTZ Camera",
    pain: "Evaluating AI-tracking cameras to replace Aver and [redacted-av] units, with [redacted-cms] recording.",
    roomsBasis: "Estimate: law-school classroom EC20 evaluation (no unit count stated).",
    rooms: 5, equipmentAge: "5", lecturesPerWeek: 10, teachWeeks: 30,
    students: 500, tuition: 22000, itSalary: 80000, currentFTE: 1,
  },
];
