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

      {/* CMS end-of-life trigger — the #1 buying signal for AV/Media and Instructional Tech teams */}
      <div className="px-5 py-3 bg-[#170F30] text-white">
        <div className="text-[13px] font-semibold">
          Running an aging or end-of-life lecture-capture system? Here is what waiting costs you each year.
        </div>
        <div className="text-[12px] text-[#b8b4d9] mt-0.5">
          For the AV / Media Services and Instructional Technology team that owns lecture capture and
          the CMS workflow &mdash; and the dean, CFO, or provost who approves the budget to fix it.
        </div>
      </div>

      <div>
        {/* ── Tier 1: Operational Costs ─────────────────────────────── */}
        <div className="px-5 pt-4 pb-2 bg-[#f8f9fa] border-b border-[#eeeeee]">
          <div className="text-[11px] font-bold uppercase tracking-wider text-[#170F30]">
            What it costs your team to keep the lights on
          </div>
          <div className="text-[12px] text-[#5a5a5a] mt-0.5">
            Budget you are already spending today, visible in helpdesk reports, payroll, and parts invoices.
          </div>
        </div>

        {/* 1. IT Staff Time Wasted */}
        <CostCategory name="AV Support Tickets" cost={r.ticketCost} barColor="red" maxCost={maxCost}>
          Aging encoders and one-off room builds generate <strong className="text-[#111111]">{r.ticketsPerRoomYear.toFixed(1)}</strong> tickets/room/year
          at a blended <strong className="text-[#111111]">$35/ticket</strong>. That is <strong className="text-[#111111]">{r.totalTickets.toLocaleString()}</strong> tickets
          consuming <strong className="text-[#111111]">{r.ticketHours.toLocaleString()}</strong> hours/year of your AV and media-services techs, at roughly 45 minutes of hands-on support each.
          <br />
          <em>Baseline: 4.6 tickets/room/year (Epiphan AV Professional Survey, 500+ respondents). Per-ticket cost blended from MetricNet service-desk tiers (Tier 1 ~$22, Tier 2 ~$70, Tier 3 ~$104).</em>
        </CostCategory>

        {/* 4. Manual Operation Burden */}
        <CostCategory name="Rooms per Tech: Manual Operation" cost={r.staffCost} barColor="amber" maxCost={maxCost}>
          Your team currently covers <strong className="text-[#111111]">{r.currentRoomsPerPerson}</strong> rooms/person (the published higher-ed AV benchmark is about 43).
          Cloud-managed fleets move that ratio far higher: NC State runs 300-plus rooms with a core team of three, and UNLV manages 200-plus Pearl Nexus units remotely from one dashboard.
          At that efficiency your <strong className="text-[#111111]">{inputs.currentFTE}</strong> AV staff could cover the same campus as <strong className="text-[#111111]">{r.optimalFTE}</strong>, freeing <strong className="text-[#111111]">{r.excessFTE}</strong> FTEs
          (<strong className="text-[#111111]">{formatCurrency(r.staffCost)}</strong>/yr) for projects instead of room-by-room firefighting.
          <br />
          <em>Source: Campus Technology higher-ed AV staffing benchmark; Epiphan NC State and UNLV case studies.</em>
        </CostCategory>

        {/* 5. Configuration & Maintenance Labor */}
        <CostCategory name="Configuration & Maintenance Labor" cost={r.maintenanceCost} barColor="blue" maxCost={maxCost}>
          Multi-vendor capture and RTSP setup averages <strong className="text-[#111111]">{r.configHoursPerRoom.toFixed(1)}</strong> hours/room
          at <strong className="text-[#111111]">$55/hr</strong> fully loaded. Legacy appliances force manual, room-by-room firmware updates instead of one fleet action,
          and parts for discontinued capture hardware get scarce and slow as vendors hit end-of-life. Centralized firmware and config (Epiphan Edge) collapses that labor to a few clicks.
          <br />
          <em>Source: REMI Group equipment-lifecycle analysis; Epiphan TCO model.</em>
        </CostCategory>

        {/* ── Tier 2: Productivity Impact ───────────────────────────── */}
        <div className="px-5 pt-4 pb-2 bg-[#f8f9fa] border-b border-[#eeeeee]">
          <div className="text-[11px] font-bold uppercase tracking-wider text-[#170F30]">
            What unreliable capture costs the classroom
          </div>
          <div className="text-[12px] text-[#5a5a5a] mt-0.5">
            Faculty trust and student learning, measured as real events with estimated dollar values.
          </div>
        </div>

        {/* 2. Failed & Missed Captures */}
        <CostCategory name="Failed & Missed Captures" cost={r.missedCaptureCost} barColor="red" maxCost={maxCost}>
          Every recording that fails to reach your CMS is a faculty complaint and a lost lecture.
          At an estimated <strong className="text-[#111111]">{(r.failRate * 100).toFixed(0)}%</strong> failure rate across the <strong className="text-[#111111]">70%</strong> of rooms with active recording schedules,
          roughly <strong className="text-[#111111]">{r.missedLectures.toLocaleString()}</strong> of <strong className="text-[#111111]">{r.totalLectures.toLocaleString()}</strong> scheduled captures/year fail or come back unusable,
          affecting about <strong className="text-[#111111]">{r.studentsAffected.toLocaleString()}</strong> student-views. Each incident runs about <strong className="text-[#111111]">$150</strong> in IT investigation, instructor coordination, and complaint handling.
          <br />
          <em>Reference: NC State reports near-perfect capture reliability on its Pearl fleet; NTNU runs 700-plus rooms on a highly automated Pearl Mini deployment.</em>
        </CostCategory>

        {/* 3. Classroom Downtime */}
        <CostCategory name="Classroom Downtime" cost={r.downtimeCost} barColor="amber" maxCost={maxCost}>
          Each AV failure that disrupts a class session costs an estimated <strong className="text-[#111111]">$500</strong>, a blended average
          of minor incidents (reboot or cable swap, about $100) and major hardware failures (about $2,000-plus).
          IT dispatch (1.5hr at $55), instructor time, rescheduling, and parts drive the base cost.
          Aging rooms average <strong className="text-[#111111]">{r.downtimeEventsPerRoom.toFixed(1)}</strong> disruptive failures/room/year versus under 0.5 for cloud-managed systems,
          which is <strong className="text-[#111111]">{r.totalDowntimeEvents.toLocaleString()}</strong> disrupted sessions across your campus a year.
          <br />
          <em>Blended cost methodology: IT dispatch + instructor time + rescheduling + parts.</em>
        </CostCategory>

        {/* ── Tier 3: Institutional Risk ────────────────────────────── */}
        <div className="px-5 pt-4 pb-2 bg-[#f8f9fa] border-b border-[#eeeeee]">
          <div className="text-[11px] font-bold uppercase tracking-wider text-[#170F30]">
            What the institution is exposed to
          </div>
          <div className="text-[12px] text-[#5a5a5a] mt-0.5">
            Compliance liability and at-risk tuition. Not yet realized, but quantifiable for the budget owner.
          </div>
        </div>

        {/* 6. ADA Compliance Exposure */}
        <CostCategory name="ADA / Accessibility Compliance Exposure" cost={r.adaCost} barColor="red" maxCost={maxCost}>
          <strong className="text-[#111111]">DOJ ADA Title II</strong> requires WCAG 2.1 Level AA for digital content, including lecture recordings:{" "}
          <strong className="text-[#111111]">April 24, 2026</strong> for large public institutions (50,000-plus population), April 2027 for smaller ones. Private institutions fall under Title III.{" "}
          An estimated <strong className="text-[#111111]">97% of U.S. colleges</strong> still have accessibility gaps, and typical web-accessibility settlements run <strong className="text-[#111111]">$5K to $20K</strong> per case (with rare outliers far higher).
          Unreliable capture means missing or uncaptioned recordings, and every gap is a liability waiting to surface.
          <br />
          <em>Source: DOJ ADA Title II final rule; AudioEye / WebAIM accessibility statistics; Accessible.org settlement data.</em>
        </CostCategory>

        {/* 7. Student Retention — At-Risk Revenue */}
        <CostCategory name="Student Retention: At-Risk Revenue" cost={r.retentionCost} barColor="blue" maxCost={maxCost}>
          Reliable access to recorded lectures supports retention, and students retain more from video of the instructor plus slides than from audio-only or no recording.
          One university study saw first-year attrition fall from <strong className="text-[#111111]">12.3% to 5%</strong> after it introduced recorded-video instruction.
          A deliberately conservative <strong className="text-[#111111]">{(r.retentionPercent * 100).toFixed(2)}%</strong> of students
          whose experience was degraded enough to contribute to leaving represents <strong className="text-[#111111]">{formatCurrency(r.retentionCost)}</strong> in at-risk tuition revenue.
          <br />
          <em>Source: ben Hassen et al. 2025 (SAGE Open), single first-year cohort; figure scaled down for conservatism.</em>
        </CostCategory>
      </div>
    </div>
  );
}
