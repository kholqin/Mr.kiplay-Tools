# Changelog

## [Unreleased]

### Added

- Dashboard dark responsif dengan identitas visual Merah Putih dan navigasi modular berbahasa Indonesia.
- Workspace assessment untuk menyimpan konteks, target, profil scan, dan riwayat job.
- Authorization gate dengan konfirmasi izin, allowlist target, penolakan jaringan sensitif, timeout, rate limit, serta audit trail.
- Preview pipeline berurutan Nmap discovery → Nuclei baseline tanpa eksekusi scanner.
- Scope policy dan unit test untuk normalisasi target serta penolakan loopback, jaringan private, dan endpoint metadata.
- README produk dan dokumentasi penggunaan aman.

### Security

- Semua indikasi kerentanan diposisikan sebagai sinyal awal yang memerlukan validasi manual.
- Eksploitasi otomatis, OOB callback, dan aktivitas destruktif tidak diaktifkan pada fondasi awal.

## [0.1.0] - 2026-08-24

- Inisialisasi platform full-stack Mr.Kiplay.

## [Unreleased] — Integrasi Port Scan Subdomain

- Menambahkan planner port scan dari subdomain hasil recon tersimpan.
- Menambahkan pemeriksaan port terbatas dengan batas maksimal 32 port, 100 host, timeout, rate limit, mode pratinjau, penyimpanan hasil, dan audit trail.
- Menambahkan tabel `port_scan_results`, endpoint tRPC terproteksi, kartu kontrol pada halaman Recon, serta test normalisasi dan guardrail.
- Eksekusi hanya dapat dilakukan setelah otorisasi workspace dikonfirmasi; penggunaan pada target tanpa izin tetap dilarang.

## [Unreleased] — Identitas Generik dan Kesiapan Assessment

### Ditambahkan

- Checklist kesiapan assessment yang menghitung status workspace, target allowlist, profil pemindaian, dan otorisasi secara deterministik.
- Quick action pada checklist yang mengarahkan analis ke modul yang belum selesai tanpa memulai scan otomatis.
- Identitas operasional generik “Analis Mr.Kiplay” pada sidebar dan greeting dashboard yang tidak menampilkan nama atau email pribadi.
- Panduan menjalankan project pada Ubuntu, Debian, Kali, BlackArch, Arch, macOS, Windows, Termux, dan sistem Unix lain.

### Diperbaiki

- Perhitungan kesiapan dashboard dipusatkan pada helper bersama agar konsisten dan dapat diuji.
- Test query port memperiksa filter, sort, LIMIT/OFFSET, dan ekspor tanpa offset secara eksplisit.
- README diselaraskan dengan status aktual MVP dan batas keamanan platform.

### Keamanan

- Semua aktivitas tetap dibatasi pada target berizin, allowlist, timeout, rate limit, dan audit trail.
- Preview pipeline dan indikasi kerentanan tidak menjalankan eksploitasi otomatis.
- Dokumentasi melarang penyimpanan credentials, data pribadi, hasil scan nyata, dan target privat di repository.

## [Unreleased] — Worker dan Web Recon Pasif

### Ditambahkan

- Worker thread terisolasi dengan antrean maksimal delapan job, concurrency satu, timeout maksimum 15 detik, pembatasan payload, isolasi workspace, status, dan pembatalan job antrean.
- HTTP fingerprinting pasif melalui metadata HEAD terpilih, tanpa mengikuti redirect atau mengirim payload eksploitasi.
- Inventaris sertifikat TLS peer yang hanya menyimpan metadata subject, issuer, masa berlaku, fingerprint, dan SAN.
- DNS preflight untuk menolak hostname yang mengarah ke jaringan sensitif atau alamat non-publik sebelum observasi HTTP/TLS.
- Endpoint tRPC dan kontrol Recon untuk preview, eksekusi terotorisasi, serta ringkasan worker.
- Migration `recon_results.kind` untuk jenis hasil `http` dan `certificate`.
- GitHub Actions matrix Node.js 20, 22, dan 24 untuk check, test, build, dan validasi installer.

### Keamanan

- Seluruh endpoint baru memeriksa workspace, authorization gate, dan target allowlist sebelum aktivitas aktif.
- Worker tidak menerima kode executable dari client dan tidak menjalankan Nmap, Nuclei, atau scanner eksternal.
- Hasil web recon diposisikan sebagai sinyal observasi yang wajib divalidasi manual.

### CI Windows

- Menambahkan job `windows-installer` pada GitHub Actions dengan runner `windows-latest`.
- Job mem-parse installer PowerShell, menyiapkan Node.js 22 dan pnpm, lalu menjalankan bootstrap installer dalam mode CI tanpa scanner atau target jaringan.

### Progress feedback installer PowerShell

- Installer Windows kini menampilkan progress bar per tahap pada terminal interaktif.
- Mode `CI=true` memakai marker teks `[CI] [persentase%]` yang stabil untuk log otomatis.
- Mode `-Help` tetap berhenti sebelum instalasi dan tidak menjalankan pemeriksaan.

### Audit dan troubleshooting lintas platform

- Memindahkan `patchedDependencies` dan `overrides` ke `pnpm-workspace.yaml` agar pnpm 10 tidak mengabaikan konfigurasi.
- Menambahkan `pnpm diagnose` untuk memeriksa runtime, manifest, lockfile, serta installer tanpa network scan.
- Installer Unix kini menemukan root project secara otomatis dan memakai `--frozen-lockfile`.
- Installer PowerShell mencatat tahap serta error tersanitasi ke `.mrkiplay/logs/install.log` dengan rotasi sederhana.

### Audit kode dan hardening runtime

- Upgrade aman AWS SDK S3, tRPC v11, Express 5, streamdown, recharts, nanoid, Drizzle ORM, dan tailwind-merge dalam rentang yang telah divalidasi.
- Memperbaiki route wildcard storage proxy dan Vite bridge agar kompatibel dengan Express 5 tanpa `PathError`.
- Menyesuaikan tipe wrapper chart untuk Recharts v3 dan menambahkan regression test.
- Mem-pin `mdast-util-to-hast` ke 13.2.1 untuk menutup vulnerability moderate pada rantai markdown.
- Menambahkan `pnpm diagnose`, root detection installer Kali/Termux, log PowerShell tersanitasi, dan artifact log CI Windows.

## [Unreleased] — Paket 19 Modul OSINT Aman

### Ditambahkan

- Katalog 19 modul OSINT dengan status live, preview-only, atau provider-gated: RDAP domain, WHOIS IP, ASN/BGP, riwayat DNS, Certificate Transparency, korelasi subdomain pasif, snapshot security headers, robots/sitemap, favicon hash, fingerprint teknologi, SPF/DKIM/DMARC, infrastruktur MX, nameserver, metadata cloud/storage berbasis DNS, rantai redirect HEAD, metadata arsip web, metadata repository publik, indikator breach melalui API resmi tanpa data mentah, dan korelasi CVE/CPE.
- Panel Recon berbahasa Indonesia dengan pencarian, filter kategori, jumlah modul, keluaran yang diharapkan, dan catatan guardrail.
- Helper normalisasi IOC, relasi domain-IP untuk graph aset, timeline evidence, risk scoring bounded transparan, dan ekspor ringkasan CSV.
- Test katalog dan helper: 65 test lulus, 1 test dilewati karena PowerShell tidak berada di PATH Linux.

### Keamanan

- Modul yang belum memiliki engine atau provider tetap nonaktif/preview-only; sepuluh modul live memerlukan scope, otorisasi, timeout, rate limit, sanitasi, dan audit trail.
- Sistem menolak nilai yang menyerupai secret serta alamat IPv4 privat pada helper IOC.
- Modul breach hanya boleh menyimpan status/provenance dari API resmi; password, token, cookie, data bocor mentah, isi privat, dan data personal berlebihan dilarang.
- Tidak ada modul yang menjalankan eksploitasi, brute force agresif, zone transfer, crawling massal, credential testing, atau akses bucket/objek cloud.

## [Unreleased] — UX Feedback OSINT

### Ditambahkan

- Loading shimmer dan progress bar untuk katalog serta operasi OSINT dengan status yang informatif.
- Pesan error Bahasa Indonesia yang memetakan authorization, timeout, rate limit, jaringan, dan error umum ke tindakan pemulihan yang aman.
- Tombol retry untuk query katalog dan status operasi mutation inline pada DNS, subdomain, port, HTTP, sertifikat, serta worker.
- Dukungan `aria-live`, `role=status`, `role=alert`, dan `prefers-reduced-motion` untuk aksesibilitas.
- Test feedback UX: 66 test lulus, 1 test dilewati karena PowerShell tidak tersedia di PATH Linux.

### Diperbaiki

- Pin package manager menggunakan integrity hash resmi pnpm 10.4.1 untuk menghindari mismatch hash pada instalasi terkelola.

## [Unreleased] — Release Hardening dan Script Upgrade

### Ditambahkan

- Script `pnpm release:verify` untuk pemeriksaan pasif file release, integrity pnpm, command manifest, katalog 19 modul OSINT, installer, dan pola secret umum.
- Peningkatan kontrak modul OSINT dengan input/output, status preview-only, serta catatan safety per modul.
- Helper defensif untuk normalisasi IOC, timeline evidence, relasi aset, risk scoring bounded, dan ekspor ringkasan.
- Prosedur verifikasi release yang terdokumentasi: diagnose, release verify, TypeScript check, test, dan build.

### Keamanan dan legal

- Modul baru tetap nonaktif otomatis dan tidak menjalankan eksploitasi, credential testing, crawling agresif, atau pemindaian target di luar scope.
- LICENSE MIT diselaraskan menggunakan identitas proyek generik `Mr.Kiplay contributors`.
- Pemeriksaan secret-release menolak pola private key, token GitHub/API, dan password literal pada source yang dipindai.

### Validasi

- Verifikasi lokal mencakup check TypeScript, 66 test lulus dengan 1 skip PowerShell di Linux, build produksi, pemeriksaan release pasif, serta verifikasi visual desktop/mobile.

## [Unreleased] — Ekspor Recon OSINT

### Ditambahkan

- Tombol **Unduh CSV** pada hasil recon tersimpan.
- Tombol **Unduh PDF** yang menghasilkan dan mengunduh PDF langsung dari server tanpa dialog print browser.
- Endpoint tRPC `assessment.reconExport` dengan format `csv` dan `pdf`, authorization workspace, batas 1.000 baris, redaksi field rahasia, sanitasi teks, dan perlindungan formula injection.
- Generator PDF 1.4 server-side tanpa binary runtime tambahan, dengan pagination dan font standar.
- Test helper ekspor untuk sanitasi target/payload, signature PDF, batas baris, dan ketiadaan secret.

## [Unreleased] — Aktivasi OSINT live terkontrol

- Menambahkan engine metadata publik nyata untuk RDAP, Certificate Transparency, robots/sitemap, favicon hash, SPF/DKIM/DMARC, MX, nameserver, redirect HEAD, metadata arsip web, dan repository publik.
- Menambahkan prosedur tRPC `assessment.liveOsint` dengan target allowlist, otorisasi workspace, public-resolution preflight, timeout, batas hop/bytes, dan sanitasi output.
- Menambahkan persistence `recon_results.kind=osint` serta audit action `recon.osint.completed` agar hasil live dapat ditinjau dan diekspor.
- Memisahkan riwayat DNS, indikator breach, WHOIS/ASN provider, dan korelasi lanjutan sebagai fitur provider-gated sampai konfigurasi resmi tersedia.

## [Unreleased] — Aktivasi runtime nyata terkontrol

- Sepuluh modul metadata publik memiliki engine live terkontrol melalui tRPC: RDAP, CT, robots/sitemap, favicon, email DNS, MX, nameserver, redirect, arsip, dan repository publik.
- Hasil live disimpan sebagai `recon_results.kind=osint` dengan provenance dan audit trail workspace.
- Worker thread memiliki persistence lifecycle pada tabel `worker_jobs`, sehingga status dan hasil ringkasan tetap tersedia setelah restart server.
- Verifikasi tetap memakai allowlist, authorization gate, public-resolution preflight, timeout, rate limit, sanitasi, batas bytes/hop/rows, dan validasi manual.
