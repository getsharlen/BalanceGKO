import {
  CloudDownload,
  CloudUpload,
  RefreshCw,
  Server,
  Trophy,
} from "lucide-react";

type HeaderProps = {
  connected: boolean;
  isSyncing: boolean;
  onOpenDatabase: () => void;
  onSaveCloud: () => void;
  onLoadCloud: () => void;
  onRefresh: () => void;
};

export default function Header({
  connected,
  isSyncing,
  onOpenDatabase,
  onSaveCloud,
  onLoadCloud,
  onRefresh,
}: HeaderProps) {
  return (
    <header className="relative overflow-hidden bg-gradient-to-r from-red-700 via-red-600 to-red-800 text-white shadow-lg">
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-3">
            <div className="rounded-2xl border border-white/20 bg-white/10 p-3 shadow-inner">
              <Trophy className="h-8 w-8 text-yellow-300" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="rounded-full border border-yellow-300/30 bg-yellow-400/20 px-2.5 py-0.5 text-xs font-semibold text-yellow-200">
                  GKO DEPOK 1
                </span>
                <span className="text-xs text-red-100">31 Oktober 2026</span>
              </div>
              <h1 className="mt-0.5 text-2xl font-extrabold tracking-tight sm:text-3xl">
                Team Balancer <span className="text-yellow-300">#Pemoeda</span>
              </h1>
              <p className="mt-1 text-xs text-red-100 sm:text-sm">
                Pengacak Tim Adil &amp; Seimbang Lomba Hari Sumpah Pemuda
              </p>
            </div>
          </div>

          <div className="no-print flex flex-wrap items-center gap-2">
            <button
              onClick={onOpenDatabase}
              className={`flex items-center gap-1.5 rounded-xl border px-3 py-2 text-xs font-semibold transition ${
                connected
                  ? "border-emerald-400/40 bg-emerald-600/30 text-emerald-100 hover:bg-emerald-600/40"
                  : "border-white/20 bg-white/10 text-white hover:bg-white/20"
              }`}
            >
              <Server className="h-4 w-4" />
              {connected ? "Supabase Terhubung" : "Koneksi Cloud DB"}
            </button>
            <button
              onClick={onLoadCloud}
              disabled={isSyncing}
              className="flex items-center gap-1.5 rounded-xl bg-white/15 px-3 py-2 text-xs font-semibold transition hover:bg-white/25 disabled:opacity-60"
            >
              <CloudDownload className="h-4 w-4" />
              Muat Cloud
            </button>
            <button
              onClick={onSaveCloud}
              disabled={isSyncing}
              className="flex items-center gap-1.5 rounded-xl bg-yellow-400 px-3.5 py-2 text-xs font-bold text-red-950 shadow-md transition hover:bg-yellow-500 disabled:opacity-60"
            >
              <CloudUpload className="h-4 w-4" />
              {isSyncing ? "Memproses..." : "Simpan Cloud"}
            </button>
            <button
              onClick={onRefresh}
              title="Muat ulang halaman; data lokal di browser tetap tersimpan"
              className="flex items-center gap-1.5 rounded-xl border border-white/20 bg-white/10 px-3 py-2 text-xs font-semibold text-white transition hover:bg-white/20"
            >
              <RefreshCw className="h-4 w-4" />
              Refresh
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
