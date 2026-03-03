import type { CalculatorInputs, CalculatorResults } from "@/lib/calculator";
import { formatCurrency } from "@/lib/calculator";
import { PRODUCT_PRICES, NEXUS_EC20_BUNDLE } from "@/lib/constants";

interface SolutionRowProps {
  inputs: CalculatorInputs;
  results: CalculatorResults;
}

function ProductCard({
  name,
  price,
  tagline,
  capabilities,
  callout,
}: {
  name: string;
  price: string;
  tagline: string;
  capabilities: string[];
  callout: string;
}) {
  return (
    <div className="bg-white rounded-lg border-2 border-[#e0e0e0] p-4 flex flex-col">
      <div className="flex items-baseline justify-between mb-2">
        <h4 className="text-[15px] font-bold text-[#1a2332]">{name}</h4>
        <span className="text-[13px] font-bold text-[#7ab800]">{price}</span>
      </div>
      <p className="text-[13px] text-[#424242] italic mb-3">{tagline}</p>
      <ul className="text-[12px] text-[#616161] space-y-1 mb-3 flex-1">
        {capabilities.map((cap) => (
          <li key={cap}>&#8226; {cap}</li>
        ))}
      </ul>
      <p className="text-[12px] font-semibold text-[#5a8a00] bg-[#f1f8e9] rounded px-2.5 py-1.5">
        {callout}
      </p>
    </div>
  );
}

const PRODUCT_CARDS = [
  {
    key: "nano" as const,
    name: "Pearl Nano",
    price: formatCurrency(PRODUCT_PRICES.nano),
    tagline: "Single-source capture, PoE+ powered",
    capabilities: [
      "1x HDMI input, compact form factor",
      "PoE+ powered — single cable install",
      "Auto-publish to LMS",
      "Ideal for simple classrooms",
    ],
    callout: "Drop-in capture for rooms that just need recording — no rack, no camera.",
  },
  {
    key: "nexus" as const,
    name: "Pearl Nexus",
    price: formatCurrency(PRODUCT_PRICES.nexus),
    tagline: "One-button lecture capture",
    capabilities: [
      "2x HDMI + SDI + USB inputs",
      "1TB local storage",
      "Auto-publish to Panopto, YuJa, Kaltura",
      "Native Zoom & Teams integration",
    ],
    callout: "Pairs with your existing cameras. Faculty press one button.",
  },
  {
    key: "nexusEc20" as const,
    name: "Pearl Nexus + EC20 PTZ",
    price: formatCurrency(NEXUS_EC20_BUNDLE),
    tagline: "Full turnkey, AI tracking",
    capabilities: [
      "Pearl Nexus encoder + EC20 camera bundle",
      "4K60 video, 20x optical zoom",
      "AI presenter tracking — no operator",
      "Complete room solution out of the box",
    ],
    callout: "No camera operator required — AI follows the presenter automatically.",
  },
  {
    key: "pearl2" as const,
    name: "Pearl-2",
    price: formatCurrency(PRODUCT_PRICES.pearl2),
    tagline: "Multi-cam flagship production",
    capabilities: [
      "6 video inputs, 4 audio channels",
      "Live switching, custom layouts",
      "Simultaneous record + stream",
      "Auditoriums, studios, event spaces",
    ],
    callout: "Flagship production for high-profile spaces — no crew needed.",
  },
];

export function SolutionRow({ inputs, results: r }: SolutionRowProps) {
  const mix = r.roomMix;

  const mixLines = [
    { count: mix.nano, label: "Pearl Nano", unitPrice: PRODUCT_PRICES.nano },
    { count: mix.nexus, label: "Pearl Nexus", unitPrice: PRODUCT_PRICES.nexus },
    { count: mix.nexusEc20, label: "Pearl Nexus + EC20", unitPrice: NEXUS_EC20_BUNDLE },
    { count: mix.pearl2, label: "Pearl-2", unitPrice: PRODUCT_PRICES.pearl2 },
  ].filter((l) => l.count > 0);

  const visibleCards = PRODUCT_CARDS.filter((c) => mix[c.key] > 0);

  return (
    <div className="bg-[#e8f5e9] rounded-[10px] p-5 mt-5">
      {/* Section A: Header */}
      <h3 className="text-[16px] font-bold text-[#5a8a00] mb-4">
        &#9989; The Epiphan Path Forward
      </h3>

      {/* Section B: Room Mix Breakdown */}
      <div className="bg-white rounded-lg p-4 mb-4">
        <h4 className="text-[14px] font-bold text-[#1a2332] mb-3">
          Your {inputs.rooms.toLocaleString()}-Room Campus Mix
        </h4>
        <div className="space-y-1.5">
          {mixLines.map((line) => (
            <div
              key={line.label}
              className="flex items-center justify-between text-[13px] px-2 py-1"
            >
              <span className="text-[#424242]">
                <span className="font-semibold text-[#1a2332]">{line.count}</span>
                {" \u00D7 "}
                {line.label}
                <span className="text-[#757575] ml-1">
                  ({formatCurrency(line.unitPrice)})
                </span>
              </span>
              <span className="font-bold text-[#1a2332]">
                {formatCurrency(line.count * line.unitPrice)}
              </span>
            </div>
          ))}
          <div className="border-t border-[#e0e0e0] mt-2 pt-2 flex items-center justify-between px-2">
            <span className="text-[13px] font-bold text-[#1a2332]">
              Total Investment
            </span>
            <div className="text-right">
              <span className="text-[15px] font-extrabold text-[#5a8a00]">
                {formatCurrency(r.totalInvestment)}
              </span>
              <span className="text-[12px] text-[#757575] ml-2">
                ({formatCurrency(r.blendedPerRoom)}/room avg)
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Section C: Product Cards — only show products in the mix */}
      <div className={`grid grid-cols-1 ${visibleCards.length >= 3 ? "sm:grid-cols-2 lg:grid-cols-4" : "sm:grid-cols-2"} gap-3 mb-4`}>
        {visibleCards.map(({ key, ...cardProps }) => (
          <ProductCard key={key} {...cardProps} />
        ))}
      </div>

      {/* Section D: Fleet Management */}
      <div className="bg-white rounded-lg border-2 border-[#7ab800] p-4 mb-4">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-[14px] font-bold text-[#1a2332]">
            Epiphan Edge — FREE cloud fleet management
          </span>
        </div>
        <p className="text-[13px] text-[#616161] mb-2">
          Monitor and control every device from one dashboard. No per-device
          fees. Included with every Pearl.
        </p>
        <p className="text-[12px] text-[#757575] italic">
          Edge Premium ($20/device/mo) available for scheduling &amp; remote
          production. Proven at scale: NC State (300+ rooms, 3 staff) &bull;
          NTNU (700 rooms, zero dedicated operators)
        </p>
      </div>

      {/* Section E: ROI Summary */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-3">
        {[
          {
            value: formatCurrency(r.totalInvestment),
            label: "Total Investment",
          },
          {
            value: `${r.paybackMonths} mo`,
            label: "Payback Period",
          },
          {
            value: `${r.roi3Year.toLocaleString()}%`,
            label: "3-Year ROI",
          },
          {
            value: r.hoursReclaimed.toLocaleString(),
            label: "IT Hours Saved / Year",
          },
        ].map((card) => (
          <div
            key={card.label}
            className="bg-white rounded-lg p-3.5 text-center"
          >
            <div className="text-[22px] font-extrabold text-[#5a8a00]">
              {card.value}
            </div>
            <div className="text-[10px] text-[#757575] uppercase tracking-wide mt-0.5">
              {card.label}
            </div>
          </div>
        ))}
      </div>

      {/* Section F: Proof points */}
      <div className="text-[11px] text-[#757575] italic">
        Reference deployments: NC State (300+ rooms, team of 3) &bull; UNLV
        (215 units, remote fleet mgmt) &bull; MTSU (428 rooms) &bull; NTNU (700
        rooms, 42K students, zero dedicated operators)
      </div>
    </div>
  );
}
