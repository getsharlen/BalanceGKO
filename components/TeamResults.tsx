import {
  Calendar,
  FileOutput,
  Flag,
  HelpCircle,
  Layers,
  Printer,
  ShieldCheck,
  Sparkles,
  Users,
} from "lucide-react";
import { KOMISI_COLORS } from "@/lib/constants";
import { Participant, Team } from "@/lib/types";

export type TeamStatsData = {
  total: number;
  komisiCount: number;
  male: number;
  female: number;
  avgAge: string;
};

type TeamStatsProps = {
  stats: TeamStatsData;
  teamsCount: number;
};

type TeamResultsProps = {
  teams: Team[];
  remainder: Participant[];
  onMoveMember: (memberId: number, fromTeamId: number, toTeamId: number) => void;
  onDistributeRemainder: () => void;
  onExport: () => void;
};

const statCards = [
  { key: "total", label: "Total Peserta", icon: Users, color: "blue" },
  { key: "commissions", label: "Komisi", icon: Layers, color: "emerald" },
  { key: "gender", label: "Rasio Gender", icon: Users, color: "purple" },
  { key: "age", label: "Rata-rata Umur", icon: Calendar, color: "amber" },
  { key: "teams", label: "Status Tim", icon: ShieldCheck, color: "red" },
] as const;

const statColors: Record<
  (typeof statCards)[number]["color"],
  { background: string; foreground: string }
> = {
  blue: { background: "bg-blue-50", foreground: "text-blue-600" },
  emerald: { background: "bg-emerald-50", foreground: "text-emerald-600" },
  purple: { background: "bg-purple-50", foreground: "text-purple-600" },
  amber: { background: "bg-amber-50", foreground: "text-amber-600" },
  red: { background: "bg-red-50", foreground: "text-red-600" },
};

export function TeamStats({ stats, teamsCount }: TeamStatsProps) {
  const values: Record<(typeof statCards)[number]["key"], string> = {
    total: String(stats.total),
    commissions: `${stats.komisiCount} / 5`,
    gender: `${stats.male}L / ${stats.female}P`,
    age: `${stats.avgAge} thn`,
    teams: teamsCount ? `${teamsCount} Tim Formasi` : "Belum Diacak",
  };

  return (
    <section className="grid grid-cols-2 gap-3 lg:grid-cols-5">
      {statCards.map(({ key, label, icon: Icon, color }) => (
        <div
          key={key}
          className={`flex items-center gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm ${
            key === "teams" ? "col-span-2 sm:col-span-1" : ""
          }`}
        >
          <div
            className={`rounded-xl p-3 ${statColors[color].background} ${statColors[color].foreground}`}
          >
            <Icon className="h-6 w-6" />
          </div>
          <div>
            <div className="text-xs font-medium text-slate-500">{label}</div>
            <div className="text-lg font-bold text-slate-800 sm:text-2xl">
              {values[key]}
            </div>
          </div>
        </div>
      ))}
    </section>
  );
}

export default function TeamResults({
  teams,
  remainder,
  onMoveMember,
  onDistributeRemainder,
  onExport,
}: TeamResultsProps) {
  return (
    <>
      {teams.length > 0 && (
        <section className="mt-1">
          <div className="mb-4 flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
            <div>
              <h2 className="flex items-center gap-2 text-xl font-extrabold text-slate-800">
                <Users className="h-6 w-6 text-red-600" />
                Hasil Pembagian Tim
              </h2>
              <p className="text-xs text-slate-500">
                Pindahkan peserta secara manual antar-tim jika diperlukan
              </p>
            </div>
            <div className="no-print flex items-center gap-2">
              <button
                onClick={onExport}
                className="flex items-center gap-1.5 rounded-xl bg-emerald-600 px-3.5 py-2 text-xs font-semibold text-white shadow-sm transition hover:bg-emerald-700"
              >
                <FileOutput className="h-4 w-4" />
                Export Excel
              </button>
              <button
                onClick={() => window.print()}
                className="flex items-center gap-1.5 rounded-xl bg-slate-800 px-3.5 py-2 text-xs font-semibold text-white shadow-sm transition hover:bg-slate-900"
              >
                <Printer className="h-4 w-4" />
                Print / PDF
              </button>
            </div>
          </div>

          {remainder.length > 0 && (
            <div className="mb-6 rounded-2xl border-2 border-dashed border-amber-300 bg-amber-50 p-4 shadow-sm">
              <div className="mb-3 flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
                <div className="flex items-center gap-2">
                  <span className="rounded-xl bg-amber-200 p-2 text-amber-800">
                    <HelpCircle className="h-5 w-5" />
                  </span>
                  <div>
                    <h3 className="text-sm font-bold text-amber-900">
                      Tim Spesial / Sisa Peserta ({remainder.length})
                    </h3>
                    <p className="text-xs text-amber-700">
                      Peserta sisa yang belum masuk kelompok reguler.
                    </p>
                  </div>
                </div>
                <button
                  onClick={onDistributeRemainder}
                  className="flex items-center gap-1 rounded-lg bg-amber-600 px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-amber-700"
                >
                  <Sparkles className="h-3.5 w-3.5" />
                  Bagikan Otomatis
                </button>
              </div>
              <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 md:grid-cols-4">
                {remainder.map((person) => (
                  <div
                    key={person.id}
                    className="flex items-center justify-between rounded-xl border border-amber-200 bg-white p-2.5 shadow-sm"
                  >
                    <div>
                      <div className="text-xs font-bold text-slate-800">{person.nama}</div>
                      <div className="text-[10px] text-slate-500">
                        {person.komisi} · {person.gender} · {person.umur} thn
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {teams.map((team) => {
              const count = team.members.length;
              const maleCount = team.members.filter((person) => person.gender === "L").length;
              const femaleCount = count - maleCount;
              const averageAge = count
                ? (
                    team.members.reduce((sum, person) => sum + Number(person.umur || 0), 0) /
                    count
                  ).toFixed(1)
                : "0";
              const commissionCounts = team.members.reduce<Record<string, number>>(
                (counts, person) => {
                  counts[person.komisi] = (counts[person.komisi] ?? 0) + 1;
                  return counts;
                },
                {},
              );

              return (
                <article
                  key={team.id}
                  className="print-break-inside flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:shadow-md"
                >
                  <div className="flex items-center justify-between bg-gradient-to-r from-slate-900 to-slate-800 p-4 text-white">
                    <div>
                      <h3 className="flex items-center gap-2 text-base font-extrabold text-yellow-400">
                        <Flag className="h-4 w-4 text-red-500" />
                        {team.name}
                      </h3>
                      <p className="mt-0.5 text-[11px] text-slate-300">
                        {count} Anggota · Avg Umur: {averageAge} thn
                      </p>
                    </div>
                    <span className="rounded-lg border border-white/10 bg-white/10 px-2.5 py-1 text-xs font-semibold text-slate-200">
                      {maleCount}L / {femaleCount}P
                    </span>
                  </div>

                  <div className="flex flex-wrap gap-1 border-b border-slate-100 bg-slate-50 px-4 py-2">
                    {Object.entries(commissionCounts).map(([commission, amount]) => (
                      <span
                        key={commission}
                        className={`rounded-full border px-2 py-0.5 text-[10px] font-semibold ${
                          KOMISI_COLORS[commission] ?? KOMISI_COLORS.Lainnya
                        }`}
                      >
                        {commission}: {amount}
                      </span>
                    ))}
                  </div>

                  <div className="max-h-80 flex-1 divide-y divide-slate-100 overflow-y-auto p-3">
                    {team.members.map((person, index) => (
                      <div
                        key={person.id}
                        className="group flex items-center justify-between rounded-lg px-1 py-2 transition hover:bg-slate-50"
                      >
                        <div className="flex items-center gap-2.5">
                          <span className="w-4 text-[11px] font-bold text-slate-400">
                            {index + 1}.
                          </span>
                          <div>
                            <div className="text-xs font-bold text-slate-800">
                              {person.nama}
                            </div>
                            <div className="text-[10px] text-slate-500">
                              {person.komisi} · {person.gender} · {person.umur} thn
                            </div>
                          </div>
                        </div>
                        <select
                          aria-label={`Pindahkan ${person.nama}`}
                          value=""
                          onChange={(event) =>
                            onMoveMember(
                              person.id,
                              team.id,
                              Number(event.target.value),
                            )
                          }
                          className="no-print max-w-28 rounded border border-slate-200 bg-white px-1 py-1 text-[10px] text-slate-500 opacity-0 transition group-hover:opacity-100 focus:opacity-100"
                        >
                          <option value="">Pindah ke...</option>
                          {teams
                            .filter((target) => target.id !== team.id)
                            .map((target) => (
                              <option key={target.id} value={target.id}>
                                {target.name}
                              </option>
                            ))}
                        </select>
                      </div>
                    ))}
                  </div>
                </article>
              );
            })}
          </div>
        </section>
      )}
    </>
  );
}
