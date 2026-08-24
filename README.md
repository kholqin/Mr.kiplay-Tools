# Mr.Kiplay Security Intelligence Platform

Mr.Kiplay adalah command center full-stack berbahasa Indonesia untuk **assessment keamanan yang berizin, non-destruktif, dan dapat diaudit**. Platform ini membantu analis mengelola workspace, menetapkan scope allowlist, mengumpulkan sinyal recon terbatas, meninjau hasil, serta menjaga setiap aktivitas tetap melalui validasi manual.

> Gunakan Mr.Kiplay hanya pada aset milik sendiri atau target yang memiliki otorisasi tertulis. Platform ini tidak memberikan izin untuk menguji sistem pihak lain.

## Fitur utama

| Area | Kemampuan |
| --- | --- |
| Workspace | Workspace, target allowlist, profil scan, bukti otorisasi, audit trail, dan riwayat job |
| Kesiapan | Checklist empat langkah: workspace, target, profil, dan konfirmasi otorisasi, dengan quick action ke langkah yang belum selesai |
| Recon | DNS lookup, resolver kustom tervalidasi, cache TTL, pencarian subdomain kandidat terbatas, dan integrasi subdomain ke port scan |
| Port scan | Daftar port eksplisit, maksimal 100 host dan 32 port, timeout, rate limit, tabel server-side pagination, filter, sorting, dan ekspor CSV maksimal 10.000 baris |
| Pipeline | Preview Nmap discovery → Nuclei baseline tanpa menjalankan scanner atau eksploitasi otomatis |
| Findings | Deduplikasi, severity, confidence, evidence tersanitasi, dan kewajiban validasi manual |
| Reporting | Ekspor laporan HTML/JSON dan keluaran CSV yang aman dari formula injection |
| Integrasi | Kontrak adapter untuk Nmap, Nuclei, Burp Suite, Amass, Subfinder, httpx, dan SearchSploit |
| UI | Dark graphite dengan aksen Merah Putih, responsif, keyboard-friendly, dan identitas pengguna generik tanpa menampilkan email pada sidebar |

## Status implementasi

MVP saat ini menyediakan dashboard React/Tailwind, backend Express/tRPC, autentikasi Manus, Drizzle ORM, database assessment, guardrail scope, recon DNS/subdomain aktif yang dibatasi, port observation server-side, preview pipeline, reporting, dan test Vitest. Adapter executable untuk tool eksternal tetap memerlukan deployment terisolasi, konfigurasi operator, serta validasi tambahan sebelum diaktifkan.

## Menjalankan secara lokal

Prasyaratnya adalah Node.js LTS, pnpm, dan database MySQL/TiDB yang kompatibel dengan konfigurasi project. Jangan commit file `.env` atau kredensial.

```bash
pnpm install
pnpm check
pnpm test -- --run
pnpm dev
```

Dashboard dapat dibuka melalui URL lokal yang ditampilkan oleh server. Untuk build produksi:

```bash
pnpm build
pnpm start
```

## Dukungan sistem operasi

| Sistem | Jalur yang disarankan |
| --- | --- |
| Ubuntu/Debian/Kali/BlackArch/Arch | Gunakan `scripts/install/install.sh` setelah Node.js LTS dan pnpm tersedia |
| macOS | Gunakan Homebrew atau installer Node.js LTS, lalu jalankan `bash scripts/install/install.sh` |
| Windows | Jalankan `scripts/install/install.ps1` melalui PowerShell setelah Node.js LTS dan pnpm tersedia |
| Termux | Pasang `nodejs`, aktifkan corepack, lalu jalankan `bash scripts/install/install.sh` dari clone repository |
| Sistem Unix lain | Pastikan Bash, Node.js LTS, pnpm, dan database tersedia; gunakan installer shell sebagai bootstrap |

Installer hanya memasang dependency dan menjalankan pemeriksaan kualitas. Installer **tidak menjalankan pemindaian jaringan**.

## Alur assessment aman

Buat workspace, masukkan hanya target yang diizinkan ke allowlist, pilih profil bounded, unggah atau konfirmasi bukti otorisasi, lalu gunakan mode preview untuk memeriksa rencana pipeline. Hasil recon dan port observation ditampilkan sebagai sinyal operasional, bukan bukti kerentanan final. Setiap indikasi SQLi, XSS, SSRF, exposure, atau misconfiguration wajib ditinjau dan divalidasi manual.

Alamat loopback, jaringan private, endpoint metadata cloud, target kosong, serta input di luar scope ditolak secara default. Timeout, rate limit, batas jumlah kandidat, batas host/port, sanitasi keluaran, dan audit trail merupakan bagian dari desain dasar.

## Arsitektur singkat

Frontend berada di `client/` dan menggunakan React, Tailwind, komponen shadcn/ui, serta tRPC client. Backend berada di `server/` dengan Express, tRPC, helper Drizzle, dan prosedur terproteksi. Policy bersama berada di `shared/`, engine recon di `core/recon/`, adapter integrasi di `integrations/`, dan schema database di `drizzle/`.

```text
client React/Tailwind
        │ tRPC
server Express/tRPC ── shared policy ── core recon
        │
   Drizzle/MySQL
```

## Struktur dokumentasi

`docs/installation/` berisi catatan instalasi, `docs/modules/` menjelaskan katalog modul, `docs/development/` berisi panduan kontribusi teknis, dan `integrations/` berisi kontrak adapter. Lihat juga [SECURITY.md](SECURITY.md), [CONTRIBUTING.md](CONTRIBUTING.md), [CHANGELOG.md](CHANGELOG.md), dan [LICENSE](LICENSE).

## Roadmap aman

Pengembangan berikutnya dapat mencakup worker terisolasi untuk pekerjaan berat, HTTP fingerprinting pasif, inventaris sertifikat, observability job, ekspor besar berbasis streaming, dan adapter eksternal dengan sandbox serta approval manual. Fitur yang bersifat eksploitasi otomatis, credential theft, persistence, destructive testing, atau target discovery tanpa otorisasi tidak menjadi bagian dari roadmap Mr.Kiplay.

## Lisensi

Project ini dirilis di bawah [MIT License](LICENSE). Lisensi tidak menghapus kewajiban operator untuk mematuhi hukum, kebijakan penyedia layanan, dan batas otorisasi engagement.

## Worker dan observasi web

Ringkasan hasil port dan recon dapat dijalankan melalui worker thread terisolasi. Antrean dibatasi maksimal delapan job, concurrency satu, payload dibatasi, dan timeout maksimum 15 detik. Worker hanya mengolah data yang sudah berada di workspace; worker tidak mengeksekusi scanner eksternal atau kode dari pengguna. Status job diisolasi berdasarkan workspace dan tersedia melalui API tRPC.

HTTP fingerprinting pasif menggunakan request `HEAD` tanpa mengikuti redirect dan hanya menyimpan header terpilih serta sinyal teknologi terbatas. Inventaris sertifikat TLS hanya membaca metadata peer certificate, seperti subject, issuer, masa berlaku, fingerprint, dan SAN; material kunci tidak disimpan. Kedua modul tetap memerlukan workspace terotorisasi, target allowlist, DNS preflight publik, timeout, dan validasi manual.

## Continuous integration

Workflow `.github/workflows/ci.yml` menguji Node.js 20, 22, dan 24. Setiap matrix menjalankan instalasi frozen lockfile, pemeriksaan TypeScript, seluruh test, build produksi, dan validasi sintaks installer Unix.

### Verifikasi installer Windows

Workflow CI juga menjalankan job `windows-installer` pada `windows-latest`. Job tersebut mem-parse `scripts/install/install.ps1` dengan parser PowerShell, mengaktifkan Corepack/pnpm, lalu menjalankan bootstrap installer dalam lingkungan CI. Installer hanya memasang dependency, menjalankan check dan test, serta tidak menjalankan scanner atau request terhadap target.

### Progress installer PowerShell

Saat dijalankan di terminal interaktif, `scripts/install/install.ps1` menampilkan progress bar untuk tahap pemeriksaan Node.js, Corepack/pnpm, instalasi dependency, pemeriksaan TypeScript, dan test. Ketika `CI=true`, tampilan beralih ke marker teks `[CI] [persentase%]` agar log runner stabil. Jalankan `.\scripts\install\install.ps1 -Help` untuk membaca penggunaan tanpa menjalankan bootstrap.
