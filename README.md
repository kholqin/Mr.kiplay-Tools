# Mr.Kiplay Security Intelligence Platform

Mr.Kiplay adalah dashboard full-stack berbahasa Indonesia untuk **assessment keamanan berizin**. Platform ini menggabungkan workspace, scope allowlist, gate otorisasi, preview pipeline Nmap → Nuclei, temuan yang dapat ditinjau, dan reporting dalam satu command center dark bernuansa Merah Putih.

> Mr.Kiplay bukan izin untuk menguji sistem pihak lain. Hanya gunakan pada aset milik sendiri atau target yang memiliki otorisasi tertulis.

## Status saat ini

Versi awal menyediakan fondasi autentikasi Manus, schema database workspace, API tRPC terproteksi, dashboard responsif, halaman workspace, scope policy, preview pipeline, serta test dasar. Adapter executable untuk Nmap/Nuclei dan integrasi vendor lain masih dikembangkan bertahap; mode preview tidak menjalankan tool scanner.

## Fitur fondasi

| Area | Implementasi awal |
| --- | --- |
| Workspace | Nama, deskripsi, target, profil scan, dan riwayat job |
| Authorization gate | Konfirmasi izin, target allowlist, penolakan alamat sensitif, audit log |
| Pipeline | Preview sequential Nmap discovery → Nuclei baseline |
| Dashboard | Ringkasan target, job, temuan prioritas, kesiapan, dan modul |
| UI | Dark graphite, aksen merah, off-white, copy Bahasa Indonesia, responsif |
| Security posture | Dry-run/preview, rate limit, timeout, manual validation, tanpa eksploitasi otomatis |

## Menjalankan lokal

```bash
pnpm install
pnpm dev
```

Pemeriksaan kualitas:

```bash
pnpm check
pnpm test -- --run
```

## Arsitektur

Frontend React/Tailwind menggunakan `DashboardLayout` dan tRPC. Backend Express/tRPC menggunakan prosedur terproteksi dan helper database Drizzle. Schema inti berada di `drizzle/schema.ts`; migration dikelola melalui Drizzle dan diterapkan melalui workflow database proyek. Policy scope berada di `shared/assessmentPolicy.ts` agar validasi target dapat dipakai bersama oleh adapter.

## Batas keamanan

Target kosong, loopback, jaringan private, dan endpoint metadata cloud ditolak secara default. Semua job dimulai sebagai preview dan hanya target yang lolos allowlist serta authorization gate yang dapat diproses pada tahap berikutnya. Indikasi SQL injection, XSS, SSRF, exposure, atau misconfiguration harus tetap menjadi sinyal awal yang divalidasi manual; platform tidak menjalankan eksploitasi otomatis.

## Pengembangan berikutnya

Roadmap mencakup adapter terisolasi untuk Nmap, Nuclei, Burp Suite, Amass, Subfinder, httpx, dan SearchSploit; modul recon serta intelligence; evidence tersanitasi; ekspor HTML/JSON; SDK plugin multi-bahasa; installer lintas platform; dan halaman laporan yang lebih lengkap.

## Lisensi dan keamanan

Lihat [LICENSE](LICENSE), [SECURITY.md](SECURITY.md), serta [CONTRIBUTING.md](CONTRIBUTING.md). Jangan commit credentials, hasil scan nyata, data pribadi, atau target yang tidak boleh dipublikasikan.
