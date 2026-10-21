"use client";

import { useEffect, useMemo, useState } from "react";
import DatabaseModal from "@/components/DatabaseModal";
import Header from "@/components/Header";
import ParticipantTable, {
  ParticipantFormValues,
  ParticipantList,
} from "@/components/ParticipantTable";
import TeamConfig, { SplitMode } from "@/components/TeamConfig";
import TeamResults, { TeamStats } from "@/components/TeamResults";
import { INITIAL_SAMPLE, KOMISI_LIST } from "@/lib/constants";
import {
  getCloudState,
  saveCloudState,
  SupabaseSettings,
} from "@/lib/supabase";
import { Participant, Team } from "@/lib/types";

type Toast = {
  message: string;
  type: "success" | "error" | "info";
};

const SETTINGS_URL_KEY = "gko_sb_url";
const SETTINGS_ANON_KEY = "gko_sb_key";

function normalizeKomisi(value: unknown): string {
  const text = String(value ?? "").toLowerCase().trim();
  if (!text) return "Pemuda";
  if (/sekolah minggu|\bsm\b|madya|anak/.test(text)) return "Sekolah Minggu";
  if (/remaja|remtar|taruna/.test(text)) return "Remaja Taruna";
  if (/pemuda|youth/.test(text)) return "Pemuda";
  if (/wanita|\bpw\b|ibu/.test(text)) return "Pelayanan Wanita";
  if (/pria|pelpri|bapak/.test(text)) return "Pelayanan Pria";
  return "Pemuda";
}

function normalizeGender(value: unknown): "L" | "P" {
  const gender = String(value ?? "").toUpperCase().trim();
  return ["P", "FEMALE", "WANITA", "PEREMPUAN"].includes(gender) ? "P" : "L";
}

export default function HomePage() {
  const [participants, setParticipants] = useState<Participant[]>(INITIAL_SAMPLE);
  const [teams, setTeams] = useState<Team[]>([]);
  const [remainder, setRemainder] = useState<Participant[]>([]);
  const [splitMode, setSplitMode] = useState<SplitMode>("by-teams");
  const [targetValue, setTargetValue] = useState(4);
  const [searchQuery, setSearchQuery] = useState("");
  const [settings, setSettings] = useState<SupabaseSettings>({ url: "", key: "" });
  const [isDbModalOpen, setIsDbModalOpen] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [isReady, setIsReady] = useState(false);
  const [toast, setToast] = useState<Toast | null>(null);

  useEffect(() => {
    try {
      const savedParticipants = localStorage.getItem("gko_participants");
      const savedTeams = localStorage.getItem("gko_teams");
      const savedUrl = localStorage.getItem(SETTINGS_URL_KEY) ?? "";
      const savedKey = localStorage.getItem(SETTINGS_ANON_KEY) ?? "";

      if (savedParticipants) {
        const parsed = JSON.parse(savedParticipants) as Participant[];
        if (Array.isArray(parsed)) setParticipants(parsed);
      }
      if (savedTeams) {
        const parsed = JSON.parse(savedTeams) as Team[];
        if (Array.isArray(parsed)) setTeams(parsed);
      }
      setSettings({ url: savedUrl, key: savedKey });
    } catch (error) {
      console.error("Gagal memuat data lokal.", error);
      notify("Data lokal tidak dapat dibaca. Data sampel digunakan.", "error");
    } finally {
      setIsReady(true);
    }
  }, []);

  useEffect(() => {
    if (!isReady) return;
    localStorage.setItem("gko_participants", JSON.stringify(participants));
  }, [participants, isReady]);

  useEffect(() => {
    if (!isReady) return;
    localStorage.setItem("gko_teams", JSON.stringify(teams));
  }, [teams, isReady]);

  function notify(message: string, type: Toast["type"] = "info") {
    setToast({ message, type });
    window.setTimeout(() => setToast(null), 3500);
  }

  const stats = useMemo(() => {
    const total = participants.length;
    const totalAge = participants.reduce((sum, person) => sum + (Number(person.umur) || 0), 0);
    return {
      total,
      komisiCount: new Set(participants.map((person) => person.komisi)).size,
      male: participants.filter((person) => person.gender === "L").length,
      female: participants.filter((person) => person.gender === "P").length,
      avgAge: total ? (totalAge / total).toFixed(1) : "0",
    };
  }, [participants]);

  async function importParticipants(file: File) {
    try {
      const XLSX = await import("xlsx");
      const bytes = await file.arrayBuffer();
      const workbook = XLSX.read(bytes, { type: "array" });
      const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
      const rows = XLSX.utils.sheet_to_json<Record<string, unknown>>(firstSheet, {
        defval: "",
      });

      if (rows.length === 0) {
        notify("File Excel kosong!", "error");
        return;
      }

      const imported = rows
        .map((row, index) => {
          const keys = Object.keys(row);
          const nameKey = keys.find((key) => /nama|name/i.test(key)) ?? keys[0];
          const commissionKey =
            keys.find((key) => /komisi|kategori|group/i.test(key)) ?? keys[1];
          const genderKey =
            keys.find((key) => /gender|jenis kelamin|jk|sex/i.test(key)) ?? keys[2];
          const ageKey = keys.find((key) => /umur|usia|age/i.test(key)) ?? keys[3];
          const name = String(row[nameKey] ?? "").trim();
          if (!name) return null;

          return {
            id: Date.now() + index,
            nama: name,
            komisi: normalizeKomisi(row[commissionKey]),
            gender: normalizeGender(row[genderKey]),
            umur: Number.parseInt(String(row[ageKey]), 10) || 20,
          } satisfies Participant;
        })
        .filter((person): person is Participant => person !== null);

      if (imported.length === 0) {
        notify("Format data tidak terdeteksi secara valid.", "error");
        return;
      }
      setParticipants(imported);
      setTeams([]);
      setRemainder([]);
      notify(`Berhasil impor ${imported.length} peserta dari Excel!`, "success");
    } catch (error) {
      console.error("Gagal membaca file Excel.", error);
      notify("Gagal membaca file Excel.", "error");
    }
  }

  async function downloadTemplate() {
    const XLSX = await import("xlsx");
    const templateData = [
      { Nama: "Budi Santoso", Komisi: "Pelayanan Pria", Gender: "L", Umur: 48 },
      { Nama: "Siti Rahma", Komisi: "Pelayanan Wanita", Gender: "P", Umur: 45 },
      { Nama: "Daniel Wijaya", Komisi: "Pemuda", Gender: "L", Umur: 23 },
      { Nama: "Ruth Grace", Komisi: "Pemuda", Gender: "P", Umur: 21 },
      { Nama: "Kevin Pratama", Komisi: "Remaja Taruna", Gender: "L", Umur: 16 },
      { Nama: "Joshua Junior", Komisi: "Sekolah Minggu", Gender: "L", Umur: 11 },
    ];
    const worksheet = XLSX.utils.json_to_sheet(templateData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Template Peserta");
    XLSX.writeFile(workbook, "Template_Peserta_Sumpah_Pemuda_GKO.xlsx");
  }

  async function exportTeams() {
    if (teams.length === 0) {
      notify("Belum ada tim untuk diekspor!", "error");
      return;
    }
    const XLSX = await import("xlsx");
    const rows = teams.flatMap((team) =>
      team.members.map((person, index) => ({
        "Nama Tim": team.name,
        No: index + 1,
        "Nama Peserta": person.nama,
        Komisi: person.komisi,
        Gender: person.gender === "L" ? "Laki-laki" : "Perempuan",
        Umur: person.umur,
      })),
    );
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(
      workbook,
      XLSX.utils.json_to_sheet(rows),
      "Hasil Tim",
    );
    XLSX.writeFile(workbook, "Tim_Lomba_Sumpah_Pemuda_GKO.xlsx");
    notify("Hasil tim berhasil diekspor!", "success");
  }

  function generateTeams() {
    if (participants.length === 0) {
      notify("Tambahkan peserta terlebih dahulu!", "error");
      return;
    }

    const value = Math.max(1, Number.parseInt(String(targetValue), 10) || 1);
    const numberOfTeams =
      splitMode === "by-teams" ? value : Math.floor(participants.length / value);
    const teamCapacity =
      splitMode === "by-teams" ? Math.floor(participants.length / value) : value;

    if (splitMode === "by-teams" && numberOfTeams > participants.length) {
      notify("Jumlah tim melebihi total peserta!", "error");
      return;
    }
    if (numberOfTeams === 0) {
      notify("Kapasitas per tim lebih besar dari jumlah peserta!", "error");
      return;
    }

    const totalCapacity = numberOfTeams * teamCapacity;
    const pool = [...participants].sort(() => Math.random() - 0.5);
    const regularPool =
      splitMode === "by-members" ? pool.slice(0, totalCapacity) : pool;
    const leftovers = splitMode === "by-members" ? pool.slice(totalCapacity) : [];
    const nextTeams: Team[] = Array.from({ length: numberOfTeams }, (_, index) => ({
      id: index + 1,
      name: `Tim ${index + 1}`,
      members: [],
    }));

    const categories = [...KOMISI_LIST, "Lainnya"];
    const groups = new Map<string, Participant[]>(
      categories.map((category) => [category, []]),
    );
    regularPool.forEach((person) => {
      const category = categories.includes(person.komisi) ? person.komisi : "Lainnya";
      groups.get(category)?.push(person);
    });
    groups.forEach((members) =>
      members.sort((a, b) =>
        a.gender !== b.gender
          ? a.gender.localeCompare(b.gender)
          : b.umur - a.umur,
      ),
    );

    categories.forEach((category) => {
      groups.get(category)?.forEach((person) => {
        const available = nextTeams.filter(
          (team) => splitMode === "by-teams" || team.members.length < teamCapacity,
        );
        const targetTeams = available.length ? available : nextTeams;
        targetTeams.sort((a, b) => {
          const commissionDifference =
            a.members.filter((member) => member.komisi === person.komisi).length -
            b.members.filter((member) => member.komisi === person.komisi).length;
          if (commissionDifference) return commissionDifference;
          const genderDifference =
            a.members.filter((member) => member.gender === person.gender).length -
            b.members.filter((member) => member.gender === person.gender).length;
          if (genderDifference) return genderDifference;
          return a.members.length - b.members.length;
        });
        targetTeams[0].members.push(person);
      });
    });

    setTeams(nextTeams);
    setRemainder(leftovers);
    notify(`Berhasil mengacak ${numberOfTeams} tim secara seimbang!`, "success");
  }

  function moveMember(memberId: number, fromTeamId: number, toTeamId: number) {
    if (!toTeamId || fromTeamId === toTeamId) return;
    const member = teams
      .find((team) => team.id === fromTeamId)
      ?.members.find((person) => person.id === memberId);
    if (!member) return;
    setTeams((current) =>
      current.map((team) => {
        if (team.id === fromTeamId) {
          return { ...team, members: team.members.filter((person) => person.id !== memberId) };
        }
        if (team.id === toTeamId) {
          return { ...team, members: [...team.members, member] };
        }
        return team;
      }),
    );
    notify("Peserta berhasil dipindahkan!", "info");
  }

  function distributeRemainder() {
    if (!remainder.length || !teams.length) return;
    const nextTeams = teams.map((team) => ({ ...team, members: [...team.members] }));
    remainder.forEach((person) => {
      nextTeams.sort((a, b) => a.members.length - b.members.length);
      nextTeams[0].members.push(person);
    });
    setTeams(nextTeams);
    setRemainder([]);
    notify("Sisa anggota berhasil dibagikan!", "success");
  }

  function saveParticipant(values: ParticipantFormValues, editingId?: number) {
    if (editingId !== undefined) {
      setParticipants((current) =>
        current.map((person) =>
          person.id === editingId ? { ...values, id: editingId } : person,
        ),
      );
      notify("Data peserta diperbarui!", "success");
    } else {
      setParticipants((current) => [...current, { ...values, id: Date.now() }]);
      notify("Peserta baru berhasil ditambahkan!", "success");
    }
  }

  function deleteParticipant(id: number) {
    setParticipants((current) => current.filter((person) => person.id !== id));
    notify("Peserta dihapus.", "info");
  }

  function saveDbSettings(nextSettings: SupabaseSettings) {
    setSettings(nextSettings);
    localStorage.setItem(SETTINGS_URL_KEY, nextSettings.url);
    localStorage.setItem(SETTINGS_ANON_KEY, nextSettings.key);
    setIsDbModalOpen(false);
    notify("Pengaturan Database Supabase disimpan!", "success");
  }

  async function syncCloud(operation: "save" | "load") {
    if (!settings.url || !settings.key) {
      setIsDbModalOpen(true);
      return;
    }
    setIsSyncing(true);
    try {
      if (operation === "save") {
        await saveCloudState(settings, participants, teams);
        notify("Data berhasil disinkronkan ke Supabase Cloud!", "success");
      } else {
        const cloudState = await getCloudState(settings);
        if (!cloudState) {
          notify("Data tim belum tersedia di database cloud.", "info");
          return;
        }
        setParticipants(cloudState.participants);
        setTeams(cloudState.teams);
        setRemainder([]);
        notify("Data berhasil dimuat dari Supabase Cloud!", "success");
      }
    } catch (error) {
      console.error("Sinkronisasi Supabase gagal.", error);
      notify(
        error instanceof Error ? error.message : "Gagal menghubungkan ke Supabase.",
        "error",
      );
    } finally {
      setIsSyncing(false);
    }
  }

  return (
    <div className="flex min-h-screen flex-col bg-slate-50 text-slate-800">
      <Header
        connected={Boolean(settings.url && settings.key)}
        isSyncing={isSyncing}
        onOpenDatabase={() => setIsDbModalOpen(true)}
        onSaveCloud={() => void syncCloud("save")}
        onLoadCloud={() => void syncCloud("load")}
        onRefresh={() => window.location.reload()}
      />

      {toast && (
        <div
          role="status"
          className={`fixed bottom-5 right-5 z-50 max-w-sm rounded-xl border px-4 py-3 text-sm font-medium text-white shadow-2xl ${
            toast.type === "error"
              ? "border-red-800 bg-red-700"
              : toast.type === "success"
                ? "border-emerald-800 bg-emerald-700"
                : "border-slate-700 bg-slate-900"
          }`}
        >
          {toast.message}
        </div>
      )}

      <main className="mx-auto flex w-full max-w-7xl flex-1 flex-col gap-6 px-4 py-6 sm:px-6 lg:px-8">
        <TeamStats stats={stats} teamsCount={teams.length} />

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
          <section className="flex flex-col gap-6 lg:col-span-5">
            <ParticipantTable
              onImport={(file) => void importParticipants(file)}
              onDownloadTemplate={() => void downloadTemplate()}
              onLoadSample={() => {
                setParticipants(INITIAL_SAMPLE);
                setTeams([]);
                setRemainder([]);
                notify("Data sampel berhasil dimuat.", "success");
              }}
              onReset={() => {
                if (!window.confirm("Hapus semua peserta dari data lokal?")) return;
                setParticipants([]);
                setTeams([]);
                setRemainder([]);
                notify("Semua peserta lokal berhasil dihapus.", "success");
              }}
              />
            <TeamConfig
              splitMode={splitMode}
              targetValue={targetValue}
              onSplitModeChange={setSplitMode}
              onTargetValueChange={setTargetValue}
              onGenerate={generateTeams}
              hasTeams={teams.length > 0}
              onReset={() => {
                if (!teams.length) return;
                setTeams([]);
                setRemainder([]);
                notify(
                  "Hasil pengacakan direset. Data peserta tetap tersimpan.",
                  "success",
                );
              }}
            />
          </section>

          <section className="lg:col-span-7">
            <ParticipantList
              participants={participants}
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              onSaveParticipant={saveParticipant}
              onDeleteParticipant={deleteParticipant}
            />
          </section>
        </div>

        <TeamResults
          teams={teams}
          remainder={remainder}
          onMoveMember={moveMember}
          onDistributeRemainder={distributeRemainder}
          onExport={() => void exportTeams()}
        />
      </main>

      <DatabaseModal
        open={isDbModalOpen}
        settings={settings}
        onClose={() => setIsDbModalOpen(false)}
        onSave={saveDbSettings}
      />
    </div>
  );
}
