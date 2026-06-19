import { EpiphanLogo } from "./epiphan-logo";

export function Header() {
  return (
    <header className="bg-[#170F30] text-white px-8 py-6 flex justify-between items-center flex-wrap gap-4">
      <div>
        <h1 className="text-[22px] font-bold">
          The <span className="text-[#83CE41]">Cost of Inaction</span> Calculator
        </h1>
        <p className="text-[13px] text-[#b8b4d9]">
          See what aging AV infrastructure is really costing your campus &mdash; and walk away with
          the number to take to whoever owns the budget. Built for AV &amp; media services and the
          dean, CFO, or provost who signs off.
        </p>
      </div>
      <EpiphanLogo variant="white" height={30} />
    </header>
  );
}
