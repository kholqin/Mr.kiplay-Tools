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

### Diagnostik Kali Linux dan Termux

Setelah clone dan sebelum instalasi, jalankan `pnpm diagnose` dari root repository. Command ini memeriksa Node.js, pnpm, `package.json`, lockfile, serta installer lintas platform tanpa mengirim request jaringan atau menjalankan scanner. Installer Unix menentukan root berdasarkan lokasinya, menggunakan `pnpm install --frozen-lockfile`, lalu menjalankan diagnose, check, dan test.

Jika muncul `ERR_PNPM_NO_PKG_MANIFEST`, pastikan `pwd` menunjuk ke folder clone yang benar dan `ls package.json` menampilkan manifest. Gunakan clone baru dari `https://github.com/kholqin/Mr.kiplay-Tools.git` jika folder sebelumnya dibuat dari versi lama.

### Log instalasi dan diagnostik

Installer PowerShell mencatat tahap bootstrap dan error tersanitasi ke `.mrkiplay/logs/install.log`; log lama berukuran besar dipindahkan ke `install.log.1`. Direktori `.mrkiplay/` diabaikan Git dan sebaiknya diperiksa sebelum dibagikan. Gunakan `pnpm diagnose` untuk memeriksa runtime, manifest, lockfile, dan installer tanpa melakukan request jaringan atau scanning target.

### Status audit dependency

Setelah upgrade AWS SDK, tRPC, Express, streamdown, recharts, Drizzle ORM, nanoid, dan dependency pendukung, `pnpm audit --prod --audit-level=low` tidak menemukan vulnerability produksi. `pnpm install` masih dapat menampilkan peer warning development dari `@builder.io/vite-plugin-jsx-loc` terhadap Vite 7; warning ini tidak memengaruhi runtime production dan tetap dipantau oleh CI. Upgrade major lain tidak dilakukan tanpa migrasi API serta pengujian terpisah.

## Katalog 19 modul OSINT aman

Halaman **Recon** kini memuat katalog 19 modul OSINT dalam mode `preview-only`. Modulnya mencakup RDAP domain, WHOIS IP, ASN/BGP, riwayat DNS, Certificate Transparency, korelasi subdomain pasif, snapshot security headers, robots/sitemap, favicon hash, fingerprint teknologi, SPF/DKIM/DMARC, infrastruktur MX, nameserver, metadata cloud/storage berbasis DNS, rantai redirect HEAD, metadata arsip web, metadata repository publik, indikator breach melalui API resmi tanpa data mentah, serta korelasi CVE/CPE.

Katalog menyediakan pencarian dan filter kategori. Setiap modul memiliki kontrak input/output, catatan keamanan, status aktif, serta kewajiban validasi manual. Implementasi provider eksternal belum diaktifkan otomatis; modul baru hanya mendeskripsikan rencana observasi aman sampai endpoint, kredensial, scope, rate limit, dan persetujuan operator tersedia.

Helper pendukung pada `shared/osintSupport.ts` menyediakan normalisasi IOC, relasi domain-IP untuk graph aset, timeline evidence terbaru, risk scoring bounded yang transparan, serta ekspor ringkasan CSV. Helper menolak indikator secret-like dan alamat IPv4 privat. Mr.Kiplay tidak mengumpulkan password, token, cookie, data breach mentah, isi repository privat, atau profil personal di luar kebutuhan engagement.

## Feedback loading dan error OSINT

Halaman Recon menampilkan shimmer progress dan status operasi ketika katalog atau mutation OSINT sedang diproses. Error dipetakan menjadi pesan Bahasa Indonesia yang aman, tanpa stack trace, token, alamat privat, atau detail provider yang sensitif. Operator memperoleh tombol **Coba lagi** untuk mengulang preview; aktivitas tetap melalui scope dan authorization gate.

Animasi non-esensial mengikuti `prefers-reduced-motion`, sedangkan status memakai `role=status`/`role=alert` dan `aria-live` agar dapat dibaca assistive technology. Jika instalasi terkelola melaporkan mismatch Corepack, project kini mem-pin pnpm 10.4.1 menggunakan integrity hash resmi registry; pemeriksaan lokal tetap dapat dijalankan dengan `pnpm check` dan `pnpm test -- --run`.

## Verifikasi release

Sebelum membuat release atau push perubahan, jalankan pemeriksaan pasif berikut dari root project:

```bash
pnpm diagnose
pnpm release:verify
pnpm check
pnpm test -- --run
pnpm build
```

`release:verify` memeriksa file wajib, integrity pin pnpm, command manifest, jumlah 19 modul OSINT, status preview-only, installer lintas platform, serta pola secret umum pada source. Pemeriksaan ini tidak melakukan request jaringan dan tidak menjalankan scanner terhadap target.

Release Mr.Kiplay tetap berorientasi pada assessment berizin. Modul baru dan adapter eksternal harus diaktifkan terpisah melalui scope allowlist, otorisasi tertulis, rate limit, timeout, audit trail, dan validasi manual. README, CHANGELOG, LICENSE, serta SECURITY harus ditinjau bersama setiap perubahan besar.
