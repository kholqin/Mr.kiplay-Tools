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
