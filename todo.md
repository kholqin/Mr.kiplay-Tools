# Project TODO

- [x] Menetapkan identitas visual dark Merah Putih dan copy antarmuka 100% Bahasa Indonesia.
- [x] Membuat dashboard responsif dengan navigasi modular dan animasi ringan.
- [x] Menambahkan autentikasi pengguna melalui fondasi Manus OAuth.
- [x] Menambahkan workspace assessment untuk target, scope, bukti otorisasi, profil scan, dan riwayat pekerjaan.
- [ ] Menambahkan authorization gate wajib dengan konfirmasi izin, allowlist target, pengecualian jaringan sensitif, rate limit, timeout, audit trail, dan mode pratinjau.
- [x] Menambahkan schema database assessment, target, scan job, temuan, evidence, dan audit log.
- [x] Menambahkan API tRPC untuk workspace, target, profil scan, job, temuan, dan laporan.
- [ ] Menambahkan pipeline modular Nmap lalu Nuclei dengan mode dry-run dan guardrail non-destruktif.
- [ ] Menambahkan adapter contract untuk Nmap, Nuclei, Burp Suite, Amass, Subfinder, httpx, dan SearchSploit.
- [ ] Menambahkan modul recon berizin untuk subdomain, DNS, HTTP/technology, certificate, port/service, dan inventaris IP.
- [ ] Menambahkan modul assessment non-destruktif untuk misconfiguration, security headers, exposure, dan indikasi SQLi/XSS/SSRF yang memerlukan validasi manual.
- [ ] Menambahkan modul intelligence untuk OSINT, dork review, fingerprint, dan pencocokan referensi SearchSploit tanpa eksploitasi otomatis.
- [x] Menambahkan tampilan temuan terdeduplikasi dengan severity, confidence, evidence tersanitasi, filter, dan remediasi.
- [ ] Menambahkan ekspor laporan HTML dan JSON.
- [ ] Menambahkan SDK plugin dan contoh kontrak Python, TypeScript, C++, serta C#.
- [x] Menambahkan installer dan dokumentasi Ubuntu/Debian, Arch/BlackArch, Kali, Termux, macOS, Windows, dan platform lain yang relevan.
- [x] Menambahkan README, CHANGELOG, LICENSE, CONTRIBUTING, SECURITY, dan panduan penggunaan aman.
- [x] Menambahkan aset visual produk di luar direktori project sesuai aturan penyimpanan aset.
- [ ] Menulis dan menjalankan unit test Vitest untuk authorization gate, workspace, pipeline, deduplikasi, dan ekspor laporan.
- [ ] Memverifikasi build, lint, responsivitas desktop/mobile, serta alur pratinjau tanpa menjalankan scan terhadap target nyata.

## Perbaikan hasil verifikasi

- [ ] Lokalkan seluruh label, heading, badge, dan navigasi yang masih berbahasa Inggris menjadi Bahasa Indonesia penuh.
- [ ] Tambahkan storage/upload bukti otorisasi yang aman serta tampilkan riwayat pekerjaan workspace sebagai daftar job yang jelas.
- [ ] Terapkan enforcement nyata untuk rate limit dan timeout pada preview/runner assessment.
- [ ] Tambahkan tabel evidence dan relasinya ke findings/scan jobs.
- [ ] Tambahkan prosedur tRPC untuk laporan dan ekspor HTML/JSON.
- [ ] Implementasikan pipeline Nmap→Nuclei config-driven di project ini, lengkap dengan stage, dry-run, dan guardrail.
- [ ] Buat halaman Temuan dengan deduplikasi, filter, severity/confidence, evidence tersanitasi, dan remediasi.
- [ ] Lengkapi installer/platform notes yang benar-benar spesifik untuk platform yang diklaim.
- [ ] Tambahkan test Vitest untuk workspace, authorization gate end-to-end, pipeline preview/validation, deduplikasi findings, dan ekspor laporan.
