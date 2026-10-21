"use client";

import { useMemo, useState, type FormEvent } from "react";
import {
  Download,
  Edit3,
  List,
  Plus,
  RotateCcw,
  Search,
  Trash2,
  UploadCloud,
  X,
} from "lucide-react";
import { INITIAL_SAMPLE, KOMISI_COLORS, KOMISI_LIST } from "@/lib/constants";
import { Participant } from "@/lib/types";

export type ParticipantFormValues = Omit<Participant, "id">;

type ParticipantTableProps = {
  onImport: (file: File) => void;
  onDownloadTemplate: () => void;
  onLoadSample: () => void;
  onReset: () => void;
};

type ParticipantListProps = {
  participants: Participant[];
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onSaveParticipant: (values: ParticipantFormValues, editingId?: number) => void;
  onDeleteParticipant: (id: number) => void;
};

export default function ParticipantTable({
  onImport,
  onDownloadTemplate,
  onLoadSample,
  onReset,
}: ParticipantTableProps) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="mb-3 flex items-center justify-between">
        <h2 className="flex items-center gap-2 text-base font-bold text-slate-800">
          <UploadCloud className="h-5 w-5 text-red-600" />
          Impor Data Excel
        </h2>
        <button
          onClick={onDownloadTemplate}
          className="flex items-center gap-1 text-xs font-semibold text-red-600 hover:text-red-700 hover:underline"
        >
          <Download className="h-3.5 w-3.5" />
          Template
        </button>
      </div>
      <label className="group relative flex cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-slate-300 bg-slate-50 p-4 text-center transition hover:border-red-500 hover:bg-red-50/30">
        <input
          type="file"
          accept=".xlsx,.xls,.csv"
          className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
          onChange={(event) => {
            const file = event.target.files?.[0];
            if (file) onImport(file);
            event.target.value = "";
          }}
        />
        <span className="rounded-full bg-white p-2.5 text-red-600 shadow-sm transition group-hover:scale-110">
          <UploadCloud className="h-6 w-6" />
        </span>
        <span className="text-xs font-semibold text-slate-700">
          Klik / Seret file Excel (.xlsx, .csv)
        </span>
        <span className="text-[11px] text-slate-400">
          Kolom: Nama, Komisi, Gender, Umur
        </span>
      </label>
      <div className="mt-3 flex gap-2">
        <button
          onClick={onLoadSample}
          className="flex flex-1 items-center justify-center gap-1.5 rounded-lg bg-slate-100 px-3 py-2 text-xs font-medium text-slate-700 transition hover:bg-slate-200"
        >
          <RotateCcw className="h-3.5 w-3.5" />
          Muat Sampel ({INITIAL_SAMPLE.length})
        </button>
        <button
          onClick={onReset}
          className="flex items-center justify-center gap-1 rounded-lg bg-red-50 px-3 py-2 text-xs font-medium text-red-600 transition hover:bg-red-100"
        >
          <Trash2 className="h-3.5 w-3.5" />
          Hapus Peserta
        </button>
      </div>
    </section>
  );
}

export function ParticipantList({
  participants,
  searchQuery,
  onSearchChange,
  onSaveParticipant,
  onDeleteParticipant,
}: ParticipantListProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | undefined>();
  const [form, setForm] = useState<ParticipantFormValues>({
    nama: "",
    komisi: "Pemuda",
    gender: "L",
    umur: 20,
  });

  const filteredParticipants = useMemo(
    () =>
      participants.filter((person) =>
        person.nama.toLowerCase().includes(searchQuery.toLowerCase()),
      ),
    [participants, searchQuery],
  );

  function openAddModal() {
    setEditingId(undefined);
    setForm({ nama: "", komisi: "Pemuda", gender: "L", umur: 20 });
    setIsModalOpen(true);
  }

  function openEditModal(person: Participant) {
    setEditingId(person.id);
    setForm({
      nama: person.nama,
      komisi: person.komisi,
      gender: person.gender,
      umur: person.umur,
    });
    setIsModalOpen(true);
  }

  function submitForm(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    onSaveParticipant({ ...form, nama: form.nama.trim() }, editingId);
    setIsModalOpen(false);
  }

  return (
    <>
      <section className="flex h-full flex-col rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="mb-4 flex flex-col justify-between gap-2 border-b border-slate-100 pb-3 sm:flex-row sm:items-center">
          <h2 className="flex items-center gap-2 text-base font-bold text-slate-800">
            <List className="h-5 w-5 text-red-600" />
            Daftar Peserta ({participants.length})
          </h2>
          <div className="flex items-center gap-2">
            <div className="relative flex-1 sm:w-48">
              <input
                type="search"
                placeholder="Cari nama..."
                value={searchQuery}
                onChange={(event) => onSearchChange(event.target.value)}
                className="w-full rounded-lg border border-slate-300 py-1.5 pl-8 pr-3 text-xs focus:outline-none focus:ring-1 focus:ring-red-500"
              />
              <Search className="absolute left-2.5 top-2 h-3.5 w-3.5 text-slate-400" />
            </div>
            <button
              onClick={openAddModal}
              className="flex items-center gap-1 whitespace-nowrap rounded-lg bg-slate-900 px-3 py-1.5 text-xs font-medium text-white transition hover:bg-slate-800"
            >
              <Plus className="h-3.5 w-3.5" />
              Tambah
            </button>
          </div>
        </div>

        <div className="max-h-[620px] overflow-auto">
          <table className="w-full text-left text-xs">
            <thead className="sticky top-0 z-10 bg-slate-50 font-semibold text-slate-600 shadow-sm">
              <tr>
                <th className="p-2.5">No</th>
                <th className="p-2.5">Nama</th>
                <th className="p-2.5">Komisi</th>
                <th className="p-2.5">Gender</th>
                <th className="p-2.5">Umur</th>
                <th className="p-2.5 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredParticipants.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-slate-400">
                    Tidak ada peserta.
                  </td>
                </tr>
              ) : (
                filteredParticipants.map((person, index) => (
                  <tr key={person.id} className="transition hover:bg-slate-50">
                    <td className="p-2.5 font-semibold text-slate-400">{index + 1}</td>
                    <td className="p-2.5 font-bold text-slate-800">{person.nama}</td>
                    <td className="p-2.5">
                      <span
                        className={`rounded-md border px-2 py-0.5 text-[10px] font-semibold ${
                          KOMISI_COLORS[person.komisi] ?? KOMISI_COLORS.Lainnya
                        }`}
                      >
                        {person.komisi}
                      </span>
                    </td>
                    <td
                      className={`p-2.5 font-semibold ${
                        person.gender === "L" ? "text-blue-600" : "text-pink-600"
                      }`}
                    >
                      {person.gender === "L" ? "Laki-laki" : "Perempuan"}
                    </td>
                    <td className="p-2.5 font-medium text-slate-600">
                      {person.umur} thn
                    </td>
                    <td className="p-2.5 text-right">
                      <button
                        aria-label={`Edit ${person.nama}`}
                        onClick={() => openEditModal(person)}
                        className="p-1 text-slate-400 hover:text-slate-700"
                      >
                        <Edit3 className="h-4 w-4" />
                      </button>
                      <button
                        aria-label={`Hapus ${person.nama}`}
                        onClick={() => onDeleteParticipant(person.id)}
                        className="p-1 text-slate-400 hover:text-red-600"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-4">
          <form
            onSubmit={submitForm}
            className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl"
          >
            <div className="mb-5 flex items-center justify-between">
              <h2 className="text-lg font-bold text-slate-900">
                {editingId === undefined ? "Tambah Peserta" : "Edit Peserta"}
              </h2>
              <button
                type="button"
                aria-label="Tutup"
                onClick={() => setIsModalOpen(false)}
                className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="space-y-4">
              <label className="block text-sm font-medium text-slate-700">
                Nama
                <input
                  required
                  value={form.nama}
                  onChange={(event) =>
                    setForm((current) => ({ ...current, nama: event.target.value }))
                  }
                  className="mt-1 block w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
                />
              </label>
              <label className="block text-sm font-medium text-slate-700">
                Komisi
                <select
                  value={form.komisi}
                  onChange={(event) =>
                    setForm((current) => ({ ...current, komisi: event.target.value }))
                  }
                  className="mt-1 block w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
                >
                  {KOMISI_LIST.map((commission) => (
                    <option key={commission} value={commission}>
                      {commission}
                    </option>
                  ))}
                </select>
              </label>
              <div className="grid grid-cols-2 gap-3">
                <label className="block text-sm font-medium text-slate-700">
                  Gender
                  <select
                    value={form.gender}
                    onChange={(event) =>
                      setForm((current) => ({
                        ...current,
                        gender: event.target.value as ParticipantFormValues["gender"],
                      }))
                    }
                    className="mt-1 block w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
                  >
                    <option value="L">Laki-laki</option>
                    <option value="P">Perempuan</option>
                  </select>
                </label>
                <label className="block text-sm font-medium text-slate-700">
                  Umur
                  <input
                    required
                    type="number"
                    min={0}
                    value={form.umur}
                    onChange={(event) =>
                      setForm((current) => ({
                        ...current,
                        umur: Number(event.target.value),
                      }))
                    }
                    className="mt-1 block w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
                  />
                </label>
              </div>
            </div>
            <div className="mt-6 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="rounded-lg px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100"
              >
                Batal
              </button>
              <button
                type="submit"
                className="rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700"
              >
                Simpan
              </button>
            </div>
          </form>
        </div>
      )}
    </>
  );
}
