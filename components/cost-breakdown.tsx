import type { CalculatorInputs, CalculatorResults } from "@/lib/calculator";
import { formatCurrency } from "@/lib/calculator";
import { CostCategory } from "./cost-category";

interface CostBreakdownProps {
  inputs: CalculatorInputs;
  results: CalculatorResults;
}

export function CostBreakdown({ inputs, results: r }: CostBreakdownProps) {
  const maxCost = Math.max(...r.categories.map((c) => c.cost));

  return (
    <div className="bg-white rounded-[10px] shadow-[0_1px_4px_rgba(0,0,0,0.08)] overflow-hidden mb-5">
      <div className="px-5 py-4 font-bold text-[14px] uppercase tracking-wide border-b border-[#eeeeee] flex items-center gap-2">
        &#128200; Cost Breakdown
      </div>
      <div>
        {/* ── Tier 1: Operational Costs ─────────────────────────────── */}
        <div className="px-5 pt-4 pb-2 bg-[#f8f9fa] border-b border-[#eeeeee]">
          <div className="text-[11px] font-bold uppercase tracking-wider text-[#1a2332]">
            Your Operational Costs
          </div>
          <div className="text-[11px] text-[#757575] mt-0.5">
            What you&apos;re spending today — visible in helpdesk reports, payroll, and parts invoices
          </div>
        </div>

        {/* 1. IT Staff Time Wasted */}
        <CostCategory name="IT Staff Time Wasted" cost={r.ticketCost} barColor="red" maxCost={maxCost}>
          Aging equipment generates <strong className="text-[#424242]">{r.ticketsPerRoomYear.toFixed(1)}</strong> tickets/room/year
          at a blended cost of <strong className="text-[#424242]">$35/ticket</strong> (Tier 1–3).
          That&apos;s <strong className="text-[#424242]">{r.totalTickets.toLocaleString()}</strong> tickets
          consuming <strong className="text-[#424242]">{r.ticketHours.toLocaleString()}</strong> hours/year
          of technician time — each ticket averaging 45 minutes of hands-on support.
          <br />
          <em>Baseline: 4.6 tickets/room/year (Epiphan AV Professional Survey, 500+ respondents). Cost per tier: MetricNet ($22 T1, $65 T2, $104 T3).</em>
        </CostCategory>

        {/* 4. Manual Operation Burden */}
        <CostCategory name="Manual Operation Burden" cost={r.staffCost} barColor="amber" maxCost={maxCost}>
          Your team currently manages <strong className="text-[#424242]">{r.currentRoomsPerPerson}</strong> rooms/person — industry average is 47.
          With automated cloud-managed systems, best-practice institutions achieve <strong className="text-[#424242]">100+ rooms/person</strong>.
          Your current <strong className="text-[#424242]">{inputs.currentFTE}</strong> AV staff could operate at the efficiency
          of <strong className="text-[#424242]">{r.optimalFTE}</strong> — freeing <strong className="text-[#424242]">{r.excessFTE}</strong> FTEs
          (<strong className="text-[#424242]">{formatCurrency(r.staffCost)}</strong>/yr) for strategic projects instead of manual room-by-room operation.
          <br />
          <em>NC State: 300+ rooms, team of 3. UNLV: 215 units, remote fleet management. Source: Epiphan AV Professional Survey (500+ respondents), Collegis Education.</em>
        </CostCategory>

        {/* 5. Configuration & Maintenance Labor */}
        <CostCategory name="Configuration & Maintenance Labor" cost={r.maintenanceCost} barColor="blue" maxCost={maxCost}>
          Multi-vendor RTSP configuration averages <strong className="text-[#424242]">{r.configHoursPerRoom.toFixed(1)}</strong> hours/room
          at <strong className="text-[#424242]">$55/hr</strong> fully loaded IT cost.
          Legacy firmware updates require manual, room-by-room intervention across your fleet.
          Parts for discontinued capture hardware become scarce and expensive, with lead times stretching to weeks as manufacturers reach end-of-life.
          <br />
          <em>Source: REMI Group equipment lifecycle analysis, Epiphan TCO model. Reference: Dartmouth OpenAV saved $1.6M vs. commercial integrators across 140 classrooms.</em>
        </CostCategory>

        {/* ── Tier 2: Productivity Impact ───────────────────────────── */}
        <div className="px-5 pt-4 pb-2 bg-[#f8f9fa] border-b border-[#eeeeee]">
          <div className="text-[11px] font-bold uppercase tracking-wider text-[#1a2332]">
            Campus Productivity Impact
          </div>
          <div className="text-[11px] text-[#757575] mt-0.5">
            Measured losses from unreliable systems — real events, estimated dollar values
          </div>
        </div>

        {/* 2. Failed & Missed Captures */}
        <CostCategory name="Failed & Missed Captures" cost={r.missedCaptureCost} barColor="red" maxCost={maxCost}>
          Your capture fleet has an estimated <strong className="text-[#424242]">{(r.failRate * 100).toFixed(0)}%</strong> failure rate
          across the <strong className="text-[#424242]">70%</strong> of rooms with active recording schedules.
          Of <strong className="text-[#424242]">{r.totalLectures.toLocaleString()}</strong> scheduled captures/year,
          roughly <strong className="text-[#424242]">{r.missedLectures.toLocaleString()}</strong> fail or produce unusable recordings
          — affecting an estimated <strong className="text-[#424242]">{r.studentsAffected.toLocaleString()}</strong> student-views.
          Each incident costs approximately <strong className="text-[#424242]">$150</strong> in IT investigation, instructor coordination, and complaint handling.
          <br />
          <em>Reference: NC State achieved 99%+ capture reliability with Pearl fleet. NTNU runs 700 rooms with zero dedicated operators and near-zero failure rate.</em>
        </CostCategory>

        {/* 3. Classroom Downtime */}
        <CostCategory name="Classroom Downtime" cost={r.downtimeCost} barColor="amber" maxCost={maxCost}>
          Each AV failure that disrupts a class session costs an estimated <strong className="text-[#424242]">$500</strong> — a blended average
          of minor incidents (reboot/cable swap, ~$100) and major hardware failures (~$2,000+).
          IT dispatch (1.5hr × $55), instructor time, rescheduling, and parts/consumables drive the base cost.
          Aging rooms average <strong className="text-[#424242]">{r.downtimeEventsPerRoom.toFixed(1)}</strong> disruptive failures/room/year
          vs. &lt;0.5 for cloud-managed systems.
          That&apos;s <strong className="text-[#424242]">{r.totalDowntimeEvents.toLocaleString()}</strong> disrupted class sessions across your campus annually.
          <br />
          <em>Blended cost methodology: IT dispatch + instructor time + rescheduling + parts/consumables.</em>
        </CostCategory>

        {/* ── Tier 3: Institutional Risk ────────────────────────────── */}
        <div className="px-5 pt-4 pb-2 bg-[#f8f9fa] border-b border-[#eeeeee]">
          <div className="text-[11px] font-bold uppercase tracking-wider text-[#1a2332]">
            Institutional Risk Exposure
          </div>
          <div className="text-[11px] text-[#757575] mt-0.5">
            Compliance liability and at-risk revenue — not yet realized, but quantifiable
          </div>
        </div>

        {/* 6. ADA Compliance Exposure */}
        <CostCategory name="ADA / Accessibility Compliance Exposure" cost={r.adaCost} barColor="red" maxCost={maxCost}>
          <strong className="text-[#424242]">April 24, 2026 deadline</strong>: Public entities must meet WCAG 2.1 Level AA for all digital content — including lecture recordings.{" "}
          <strong className="text-[#424242]">97% of U.S. colleges</strong> currently have accessibility gaps.
          Average settlement: <strong className="text-[#424242]">$27K per case</strong>. Legal defense: <strong className="text-[#424242]">$15K–$50K per complaint</strong>.
          Unreliable capture means missing recordings — and every gap is a compliance liability waiting to surface.
          <br />
          <em>Source: AGB Policy Alert, 3Play Media, AudioEye compliance database</em>
        </CostCategory>

        {/* 7. Student Retention — At-Risk Revenue */}
        <CostCategory name="Student Retention — At-Risk Revenue" cost={r.retentionCost} barColor="blue" maxCost={maxCost}>
          <strong className="text-[#424242]">70% of in-person</strong> and <strong className="text-[#424242]">79% of online</strong> students say classroom technology impacts their learning decisions.
          Research shows lecture capture access reduces attrition from <strong className="text-[#424242]">12.3% to 5%</strong>.
          Students retain <strong className="text-[#424242]">25–30% more content</strong> with instructor + slides video vs. audio-only or no recording.
          A conservative <strong className="text-[#424242]">{(r.retentionPercent * 100).toFixed(2)}%</strong> of students
          whose experience was degraded enough to contribute to their decision to leave
          represents <strong className="text-[#424242]">{formatCurrency(r.retentionCost)}</strong> in at-risk tuition revenue.
          <br />
          <em>Source: Springer Higher Education research, Collegis Education</em>
        </CostCategory>
      </div>
    </div>
  );
}
