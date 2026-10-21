"use client";

import { FormEvent, useEffect, useState } from "react";
import { Database, X } from "lucide-react";
import { SupabaseSettings } from "@/lib/supabase";

type DatabaseModalProps = {
  open: boolean;
  settings: SupabaseSettings;
  onClose: () => void;
  onSave: (settings: SupabaseSettings) => void;
};

export default function DatabaseModal({
  open,
  settings,
  onClose,
  onSave,
}: DatabaseModalProps) {
  const [url, setUrl] = useState(settings.url);
  const [key, setKey] = useState(settings.key);

  useEffect(() => {
    if (open) {
      setUrl(settings.url);
      setKey(settings.key);
    }
  }, [open, settings]);

  if (!open) return null;

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    onSave({ url: url.trim().replace(/\/+$/, ""), key: key.trim() });
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-4">
      <form
        onSubmit={submit}
        className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl"
      >
        <div className="mb-5 flex items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="rounded-xl bg-red-50 p-2.5 text-red-600">
              <Database className="h-5 w-5" />
            </span>
            <div>
              <h2 className="text-lg font-bold text-slate-900">
                Koneksi Supabase
              </h2>
              <p className="text-xs text-slate-500">
                Konfigurasi project untuk menyimpan dan memuat data tim.
              </p>
            </div>
          </div>
          <button
            type="button"
            aria-label="Tutup"
            onClick={onClose}
            className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="space-y-4">
          <label className="block text-sm font-medium text-slate-700">
            Project URL
            <input
              required
              type="url"
              placeholder="https://your-project.supabase.co"
              value={url}
              onChange={(event) => setUrl(event.target.value)}
              className="mt-1 block w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500"
            />
          </label>
          <label className="block text-sm font-medium text-slate-700">
            Publishable / anon key
            <input
              required
              type="password"
              autoComplete="off"
              placeholder="eyJ..."
              value={key}
              onChange={(event) => setKey(event.target.value)}
              className="mt-1 block w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500"
            />
          </label>
          <p className="rounded-lg bg-amber-50 p-3 text-xs leading-relaxed text-amber-900">
            Gunakan hanya publishable/anon key dengan kebijakan RLS yang sesuai.
            Jangan masukkan service-role key. Konfigurasi disimpan di browser ini.
          </p>
        </div>

        <div className="mt-6 flex justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100"
          >
            Batal
          </button>
          <button
            type="submit"
            className="rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700"
          >
            Simpan Pengaturan
          </button>
        </div>
      </form>
    </div>
  );
}
