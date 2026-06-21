"use client";

import { useState, useMemo, useEffect } from "react";
import { calculate, type CalculatorInputs } from "@/lib/calculator";
import { DEFAULT_INPUTS } from "@/lib/constants";
import { parseInputsFromParams } from "@/lib/parse-params";
import { EpiphanLogo } from "@/components/epiphan-logo";
import { GuidanceRail } from "@/components/guidance-rail";
import { OperatePanel } from "@/components/operate-panel";
import { NumberZone } from "@/components/number-zone";
import { SaySendZone } from "@/components/say-send-zone";
import { DetailsDrawer } from "@/components/details-drawer";
import { CostBreakdown } from "@/components/cost-breakdown";
import { SolutionRow } from "@/components/solution-row";
import { FitPanel } from "@/components/fit-panel";
import { Methodology } from "@/components/methodology";
import { ShareButton } from "@/components/share-button";
import { PdfDownloadButton } from "@/components/pdf-download-button";

export default function Home() {
  const [inputs, setInputs] = useState<CalculatorInputs>(DEFAULT_INPUTS);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [drawerTarget, setDrawerTarget] = useState<string | null>(null);
  const [sent, setSent] = useState(false);

  function openDrawer(anchor?: string) {
    setDrawerTarget(anchor ?? null);
    setDrawerOpen(true);
  }

  // Load inputs from URL params on first render (shared links). Done post-mount
  // so SSR (DEFAULT_INPUTS) and client hydration agree.
  useEffect(() => {
    if (typeof window !== "undefined" && window.location.search) {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- post-mount sync from a browser API
      setInputs(parseInputsFromParams(window.location.search));
    }
  }, []);

  const results = useMemo(() => calculate(inputs), [inputs]);

  function patch(partial: Partial<CalculatorInputs>) {
    setInputs((prev) => ({ ...prev, ...partial }));
  }

  return (
    <div className="h-[100dvh] flex flex-col overflow-hidden bg-surface-2 text-ink-2 font-sans">
      {/* Header + guidance rail */}
      <header className="flex-none flex items-center gap-6 px-5 h-14 bg-ink text-white">
        <div className="flex items-center gap-3">
          <EpiphanLogo variant="white" height={20} />
          <span className="text-[12px] text-indigo-soft hidden sm:inline">Cost of Inaction &middot; SDR Cockpit</span>
        </div>
        <div className="ml-auto">
          <GuidanceRail reached={sent ? 4 : 3} />
        </div>
      </header>

      {/* Cockpit grid */}
      <main className="flex-1 min-h-0 grid gap-3.5 p-3.5 overflow-auto lg:overflow-hidden grid-cols-1 lg:grid-cols-[264px_1fr_340px]">
        <section className="flex flex-col gap-2 min-h-0">
          <div className="text-[10px] font-semibold uppercase tracking-[0.08em] text-ink-4 px-0.5">Operate</div>
          <OperatePanel inputs={inputs} onChange={setInputs} onPatch={patch} onOpenDetails={() => openDrawer()} />
        </section>

        <section className="flex flex-col gap-2 min-h-0">
          <div className="text-[10px] font-semibold uppercase tracking-[0.08em] text-ink-4 px-0.5">
            {results.resultMode === "cost" ? "The number" : "The fit"}
          </div>
          <NumberZone results={results} rooms={inputs.rooms} onOpenDetails={openDrawer} />
        </section>

        <section className="flex flex-col gap-2 min-h-0">
          <div className="text-[10px] font-semibold uppercase tracking-[0.08em] text-ink-4 px-0.5">Say &amp; send</div>
          <SaySendZone inputs={inputs} results={results} onSent={() => setSent(true)} />
        </section>
      </main>

      {/* Details / proof drawer */}
      <DetailsDrawer open={drawerOpen} title="Details & proof" scrollToId={drawerTarget} onClose={() => setDrawerOpen(false)}>
        {results.resultMode === "cost" ? (
          <>
            <CostBreakdown inputs={inputs} results={results} />
            <SolutionRow inputs={inputs} results={results} />
            <PdfDownloadButton inputs={inputs} results={results} />
            <Methodology />
            <ShareButton inputs={inputs} />
          </>
        ) : (
          <>
            <FitPanel inputs={inputs} results={results} />
            <ShareButton inputs={inputs} />
          </>
        )}
      </DetailsDrawer>
    </div>
  );
}
