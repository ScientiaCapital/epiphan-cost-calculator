import type { CalculatorInputs, CalculatorResults } from "@/lib/calculator";
import { formatCurrency } from "@/lib/calculator";
import { PRODUCT_PRICES, NEXUS_EC20_BUNDLE, AE_BOOKING_URL } from "@/lib/constants";

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
    <div className="bg-white rounded-lg border-2 border-line p-4 flex flex-col">
      <div className="flex items-baseline justify-between mb-2">
        <h4 className="text-[15px] font-bold text-ink">{name}</h4>
        <span className="text-[13px] font-bold text-teal">{price}</span>
      </div>
      <p className="text-[13px] text-ink-2 italic mb-3">{tagline}</p>
      <ul className="text-[12px] text-ink-3 space-y-1 mb-3 flex-1">
        {capabilities.map((cap) => (
          <li key={cap}>&#8226; {cap}</li>
        ))}
      </ul>
      <p className="text-[12px] font-semibold text-ink bg-green-tint rounded px-2.5 py-1.5">
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
      "PoE+ powered, single cable install",
      "Auto-publish to LMS",
      "Ideal for simple classrooms",
    ],
    callout: "Drop-in capture for rooms that just need recording, no rack, no camera.",
  },
  {
    key: "nexus" as const,
    name: "Pearl Nexus",
    price: formatCurrency(PRODUCT_PRICES.nexus),
    tagline: "One-button lecture capture",
    capabilities: [
      "2x HDMI + SDI + USB inputs",
      "1TB local storage",
      "Auto-publish to your CMS / LMS",
      "Works with your existing meeting platforms",
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
      "AI presenter tracking, no operator",
      "Complete room solution out of the box",
    ],
    callout: "No camera operator required, AI follows the presenter automatically.",
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
    callout: "Flagship production for high-profile spaces, no crew needed.",
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
    <div className="bg-aqua-tint rounded-[10px] p-5 mt-5">
      {/* Section A: Header */}
      <h3 className="text-[16px] font-bold text-ink mb-4">
        &#9989; The Epiphan Path Forward
      </h3>

      {/* Section B: Room Mix Breakdown */}
      <div className="bg-white rounded-lg p-4 mb-4">
        <h4 className="text-[14px] font-bold text-ink mb-3">
          Your {inputs.rooms.toLocaleString()}-Room Campus Mix
        </h4>
        <div className="space-y-1.5">
          {mixLines.map((line) => (
            <div
              key={line.label}
              className="flex items-center justify-between text-[13px] px-2 py-1"
            >
              <span className="text-ink-2">
                <span className="font-semibold text-ink">{line.count}</span>
                {" \u00D7 "}
                {line.label}
                <span className="text-ink-3 ml-1">
                  ({formatCurrency(line.unitPrice)})
                </span>
              </span>
              <span className="font-bold text-ink">
                {formatCurrency(line.count * line.unitPrice)}
              </span>
            </div>
          ))}
          <div className="border-t border-line mt-2 pt-2 flex items-center justify-between px-2">
            <span className="text-[13px] font-bold text-ink">
              Total Investment
            </span>
            <div className="text-right">
              <span className="text-[15px] font-extrabold text-ink">
                {formatCurrency(r.totalInvestment)}
              </span>
              <span className="text-[12px] text-ink-3 ml-2">
                ({formatCurrency(r.blendedPerRoom)}/room avg)
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Section B1.5: EC20 direct-to-CMS — the lowest-barrier "start simple"
          ramp. A camera in every room, no encoder, publishes straight to the
          CMS. Framed as a phase-1 / new-logo entry, not the cheapest total. */}
      {r.showEc20DirectPath && (
      <div className="bg-white rounded-lg border-2 border-green p-4 mb-4">
        <h4 className="text-[14px] font-bold text-ink mb-1.5">
          Start simple: a camera in every room.
        </h4>
        <p className="text-[13px] text-ink-2 mb-3">
          Skip the encoder entirely. An EC20 PTZ camera in each room publishes straight to your
          CMS &ndash; no rack, no operator, the lowest-barrier way to cover every room.
        </p>
        <div className="flex items-baseline gap-2 flex-wrap">
          <span className="text-[22px] font-extrabold text-ink">
            {formatCurrency(r.ec20DirectInvestment)}
          </span>
          <span className="text-[12px] text-ink-3">
            {r.ec20DirectUnits.toLocaleString()} EC20 cameras &middot; vs{" "}
            {formatCurrency(r.totalInvestment)} room-by-room
          </span>
        </div>
        <p className="text-[11px] text-ink-3 italic mt-2">
          A great phase-1 or first-deployment start &mdash; add encoders and switching as you grow.
        </p>
      </div>
      )}

      {/* Section B2: A more affordable path (concurrency-based starting point).
          Soft tease only — no architecture, no quote. The AE owns fit & pricing.
          Hidden for deployments too small to benefit from a central pool. */}
      {r.showPooledPath && (
      <div className="bg-white rounded-lg border-2 border-teal p-4 mb-4">
        <h4 className="text-[14px] font-bold text-teal mb-1.5">
          Tighter budget? There may be a more affordable path.
        </h4>
        <p className="text-[13px] text-ink-2 mb-3">
          Not every room records at the same time. If only about{" "}
          <span className="font-bold text-ink">{r.concurrentRooms.toLocaleString()}</span> of
          your {inputs.rooms.toLocaleString()} rooms are ever live at once, you may not need an
          encoder in every room &ndash; a smaller, centrally managed pool can cover the whole
          campus.
        </p>
        <div className="flex items-baseline gap-2 flex-wrap">
          <span className="text-[22px] font-extrabold text-teal">
            ~{formatCurrency(r.pooledInvestment)}
          </span>
          <span className="text-[12px] text-ink-3">
            starting point &middot; {r.pooledEncoders.toLocaleString()} {r.pooledModel} encoders &middot; vs{" "}
            {formatCurrency(r.totalInvestment)} room-by-room
          </span>
        </div>
        <p className="text-[11px] text-ink-3 italic mt-2">
          A starting point for the conversation, not a quote. An Epiphan account engineer scopes the
          right design with you.
        </p>
        <a
          href={AE_BOOKING_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 mt-3 py-2 px-4 bg-teal text-white font-semibold text-[13px] rounded-lg hover:bg-teal-deep transition-colors"
        >
          Talk to an Epiphan AE &rarr;
        </a>
      </div>
      )}

      {/* Section C: Product Cards, only show products in the mix */}
      <div className={`grid grid-cols-1 ${visibleCards.length >= 3 ? "sm:grid-cols-2 lg:grid-cols-4" : "sm:grid-cols-2"} gap-3 mb-4`}>
        {visibleCards.map(({ key, ...cardProps }) => (
          <ProductCard key={key} {...cardProps} />
        ))}
      </div>

      {/* Section D: Fleet Management */}
      <div className="bg-white rounded-lg border-2 border-green p-4 mb-4">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-[14px] font-bold text-ink">
            Epiphan Edge: free cloud fleet management
          </span>
        </div>
        <p className="text-[13px] text-ink-3 mb-2">
          Monitor and control every device from one dashboard. No per-device
          fees. Included with every Pearl.
        </p>
        <p className="text-[12px] text-ink-3 italic">
          Edge Premium ($20/device/mo) available for scheduling &amp; remote
          production. Proven at scale: NC State (300+ rooms, 3 staff) &bull;
          NTNU (700 rooms, a highly automated deployment)
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
            <div className="text-[22px] font-extrabold text-ink">
              {card.value}
            </div>
            <div className="text-[10px] text-ink-3 uppercase tracking-wide mt-0.5">
              {card.label}
            </div>
          </div>
        ))}
      </div>

      {/* Section F: Proof points */}
      <div className="text-[11px] text-ink-3 italic">
        Reference deployments: NC State (300+ rooms, team of 3) &bull; UNLV
        (215 units, remote fleet mgmt) &bull; MTSU (428 rooms) &bull; NTNU (700
        rooms, 42K students, a highly automated deployment)
      </div>
    </div>
  );
}
