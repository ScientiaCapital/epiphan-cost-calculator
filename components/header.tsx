export function Header() {
  return (
    <header className="bg-[#1a2332] text-white px-8 py-6 flex justify-between items-center flex-wrap gap-3">
      <div>
        <h1 className="text-[22px] font-bold">
          The <span className="text-[#d32f2f]">Cost of Inaction</span> Calculator
        </h1>
        <p className="text-[13px] text-[#90a4ae]">
          See what aging AV infrastructure is really costing — plug in your numbers
        </p>
      </div>
      <div className="text-[13px] text-[#7ab800] font-semibold">epiphan video</div>
    </header>
  );
}
