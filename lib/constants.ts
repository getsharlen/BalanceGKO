import { Participant } from "@/lib/types";

export const KOMISI_LIST = [
  "Sekolah Minggu",
  "Remaja Taruna",
  "Pemuda",
  "Pelayanan Wanita",
  "Pelayanan Pria",
];

export const KOMISI_COLORS: Record<string, string> = {
  "Sekolah Minggu": "border-amber-300 bg-amber-100 text-amber-800",
  "Remaja Taruna": "border-sky-300 bg-sky-100 text-sky-800",
  Pemuda: "border-red-300 bg-red-100 text-red-800",
  "Pelayanan Wanita": "border-pink-300 bg-pink-100 text-pink-800",
  "Pelayanan Pria": "border-indigo-300 bg-indigo-100 text-indigo-800",
  Lainnya: "border-slate-300 bg-slate-100 text-slate-800",
};

export const INITIAL_SAMPLE: Participant[] = [
  { id: 1, nama: "Budi Santoso", komisi: "Pelayanan Pria", gender: "L", umur: 48 },
  { id: 2, nama: "Siti Rahma", komisi: "Pelayanan Wanita", gender: "P", umur: 45 },
  { id: 3, nama: "Daniel Wijaya", komisi: "Pemuda", gender: "L", umur: 23 },
  { id: 4, nama: "Ruth Grace", komisi: "Pemuda", gender: "P", umur: 21 },
  { id: 5, nama: "Kevin Pratama", komisi: "Remaja Taruna", gender: "L", umur: 16 },
  { id: 6, nama: "Anatasia Putri", komisi: "Remaja Taruna", gender: "P", umur: 15 },
  { id: 7, nama: "Joshua Junior", komisi: "Sekolah Minggu", gender: "L", umur: 11 },
  { id: 8, nama: "Chitrasia Love", komisi: "Sekolah Minggu", gender: "P", umur: 10 },
  { id: 9, nama: "Hendra Gunawan", komisi: "Pelayanan Pria", gender: "L", umur: 52 },
  { id: 10, nama: "Maria Verotika", komisi: "Pelayanan Wanita", gender: "P", umur: 50 },
  { id: 11, nama: "Jonathan Lee", komisi: "Pemuda", gender: "L", umur: 25 },
  { id: 12, nama: "Stefani Chen", komisi: "Pemuda", gender: "P", umur: 22 },
  { id: 13, nama: "Michael Bayu", komisi: "Remaja Taruna", gender: "L", umur: 17 },
  { id: 14, nama: "Angelina Rose", komisi: "Remaja Taruna", gender: "P", umur: 14 },
  { id: 15, nama: "Samuel Kid", komisi: "Sekolah Minggu", gender: "L", umur: 12 },
  { id: 16, nama: "Clarissa Belle", komisi: "Sekolah Minggu", gender: "P", umur: 11 },
  { id: 17, nama: "Agus Martono", komisi: "Pelayanan Pria", gender: "L", umur: 46 },
  { id: 18, nama: "Elisabeth Tan", komisi: "Pelayanan Wanita", gender: "P", umur: 44 },
  { id: 19, nama: "David Kristo", komisi: "Pemuda", gender: "L", umur: 24 },
  { id: 20, nama: "Jessica Alba", komisi: "Pemuda", gender: "P", umur: 20 },
  { id: 21, nama: "Timothy Ronald", komisi: "Remaja Taruna", gender: "L", umur: 16 },
  { id: 22, nama: "Fiona Fiona", komisi: "Remaja Taruna", gender: "P", umur: 15 },
  { id: 23, nama: "Nathanael N", komisi: "Sekolah Minggu", gender: "L", umur: 10 },
  { id: 24, nama: "Grace Kelly", komisi: "Sekolah Minggu", gender: "P", umur: 12 },
  { id: 25, nama: "Bambang Tri", komisi: "Pelayanan Pria", gender: "L", umur: 55 },
  { id: 26, nama: "Dewi Lestari", komisi: "Pelayanan Wanita", gender: "P", umur: 49 },
  { id: 27, nama: "Christian S", komisi: "Pemuda", gender: "L", umur: 22 },
  { id: 28, nama: "Rachel Amanda", komisi: "Pemuda", gender: "P", umur: 23 },
  { id: 29, nama: "Gabriel Alex", komisi: "Remaja Taruna", gender: "L", umur: 17 },
  { id: 30, nama: "Hanna Monita", komisi: "Pelayanan Wanita", gender: "P", umur: 42 },
];
