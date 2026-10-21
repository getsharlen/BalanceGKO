# My Team Balancer

Aplikasi Next.js untuk mengelola peserta, membagi tim secara seimbang, dan menyimpan hasil ke Supabase.

## Menjalankan aplikasi

```bash
npm install
npm run dev
```

Buka `http://localhost:3000`. Data peserta dan tim disimpan otomatis di browser. Impor menerima berkas `.xlsx`, `.xls`, atau `.csv`.

## Menyiapkan Supabase Cloud

1. Buat tabel `team_balancer_data` di Supabase:

   ```sql
   create table public.team_balancer_data (
     id text primary key,
     participants jsonb not null default '[]'::jsonb,
     teams jsonb not null default '[]'::jsonb,
     updated_at timestamptz not null default now()
   );
   ```

2. Aktifkan Row Level Security dan buat kebijakan untuk peran `anon` hanya jika aplikasi memang ditujukan untuk akses publik. Batasi akses tabel sesuai kebutuhan deployment; siapa pun yang memiliki anon key dapat menjalankan kebijakan yang Anda izinkan.
3. Di aplikasi, buka **Koneksi Cloud DB**, lalu masukkan project URL dan publishable/anon key (jangan gunakan service-role key).
4. Gunakan **Simpan Cloud** dan **Muat Cloud** untuk sinkronisasi data.

API `/api/teams` meneruskan operasi baca/tulis ke Supabase REST API dan hanya menerima URL HTTPS project di domain `*.supabase.co`. Untuk konfigurasi server, set `SUPABASE_URL` dan `SUPABASE_ANON_KEY`; variabel server tersebut menggantikan nilai dari browser.
# BalanceGKO
