import { ShieldAlert, Shuffle, Sliders } from "lucide-react";

export type SplitMode = "by-teams" | "by-members";

type TeamConfigProps = {
  splitMode: SplitMode;
  targetValue: number;
  onSplitModeChange: (mode: SplitMode) => void;
  onTargetValueChange: (value: number) => void;
  onGenerate: () => void;
};

export default function TeamConfig({
  splitMode,
  targetValue,
  onSplitModeChange,
  onTargetValueChange,
  onGenerate,
}: TeamConfigProps) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <h2 className="mb-4 flex items-center gap-2 text-base font-bold text-slate-800">
        <Sliders className="h-5 w-5 text-red-600" />
        Aturan Pengacak Tim
      </h2>

      <div className="mb-4 space-y-3">
        <label className="block text-xs font-semibold text-slate-600">
          Pilih Mode Pembagian:
        </label>
        <div className="grid grid-cols-2 gap-3">
          {(
            [
              ["by-teams", "Jumlah Tim", "Tentukan N tim"],
              ["by-members", "Pemain / Tim", "Tentukan K orang"],
            ] as const
          ).map(([mode, title, description]) => (
            <label
              key={mode}
              className={`flex cursor-pointer items-center gap-2 rounded-xl border p-3 transition ${
                splitMode === mode
                  ? "border-red-500 bg-red-50/20"
                  : "border-slate-200 hover:bg-slate-50"
              }`}
            >
              <input
                type="radio"
                name="split-mode"
                checked={splitMode === mode}
                onChange={() => onSplitModeChange(mode)}
                className="text-red-600 focus:ring-red-500"
              />
              <span>
                <span className="block text-xs font-bold text-slate-800">{title}</span>
                <span className="block text-[10px] text-slate-400">{description}</span>
              </span>
            </label>
          ))}
        </div>
      </div>

      <div className="mb-4 rounded-xl border border-slate-200 bg-slate-50 p-3.5">
        <label
          htmlFor="team-target"
          className="mb-1 block text-xs font-semibold text-slate-700"
        >
          {splitMode === "by-teams"
            ? "Jumlah Tim yang Ingin Dibuat:"
            : "Jumlah Pemain per Tim:"}
        </label>
        <div className="flex items-center gap-2">
          <input
            id="team-target"
            type="number"
            min={1}
            max={50}
            value={targetValue}
            onChange={(event) => onTargetValueChange(Number(event.target.value))}
            className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-red-500"
          />
          <span className="whitespace-nowrap text-xs font-medium text-slate-500">
            {splitMode === "by-teams" ? "Tim" : "Pemain/Tim"}
          </span>
        </div>
      </div>

      <div className="mb-4 rounded-xl border border-red-100 bg-red-50/50 p-3">
        <div className="mb-1 flex items-center gap-1 text-[11px] font-bold text-red-800">
          <ShieldAlert className="h-3.5 w-3.5 text-red-600" />
          Prioritas Seimbang:
        </div>
        <ol className="list-inside list-decimal space-y-0.5 text-[11px] text-slate-600">
          <li>
            <strong>Komisi:</strong> Merata di tiap tim.
          </li>
          <li>
            <strong>Gender:</strong> Rasio L/P setara.
          </li>
          <li>
            <strong>Umur:</strong> Rata-rata umur seimbang.
          </li>
        </ol>
      </div>

      <button
        onClick={onGenerate}
        className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-red-600 to-red-700 px-4 py-3 text-sm font-bold text-white shadow-md transition hover:from-red-700 hover:to-red-800 hover:shadow-lg"
      >
        <Shuffle className="h-5 w-5" />
        ACAK &amp; SEIMBANGKAN TIM SEKARANG
      </button>
    </section>
  );
}
