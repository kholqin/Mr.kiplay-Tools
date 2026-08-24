# Project TODO

- [x] Menambahkan identitas visual dark Merah Putih dan copy antarmuka 100% Bahasa Indonesia.
- [x] Membuat dashboard responsif dengan navigasi modular dan animasi ringan.
- [x] Menambahkan autentikasi pengguna melalui fondasi Manus OAuth.
- [x] Menambahkan workspace assessment untuk target, scope, bukti otorisasi, profil scan, dan riwayat pekerjaan.
- [x] Menambahkan authorization gate wajib dengan konfirmasi izin, allowlist target, pengecualian jaringan sensitif, rate limit, timeout, audit trail, dan mode pratinjau aman.
- [x] Menambahkan schema database assessment, target, scan job, temuan, evidence, dan audit log.
- [x] Menambahkan API tRPC untuk workspace, target, profil scan, job, temuan, dan laporan.
- [x] Menambahkan pipeline modular Nmap lalu Nuclei dengan mode dry-run dan guardrail non-destruktif.
- [x] Menambahkan adapter contract untuk Nmap, Nuclei, Burp Suite, Amass, Subfinder, httpx, dan SearchSploit; runner aktif tetap memerlukan pengembangan terisolasi lanjutan.
- [x] Menambahkan katalog modul recon berizin untuk subdomain, DNS, HTTP/technology, certificate, port/service, dan inventaris IP.
- [x] Menambahkan katalog assessment non-destruktif untuk misconfiguration, security headers, exposure, dan indikasi SQLi/XSS/SSRF dengan validasi manual.
- [x] Menambahkan katalog modul intelligence untuk OSINT, dork review, fingerprint, dan pencocokan referensi SearchSploit tanpa eksploitasi otomatis.
- [x] Menambahkan tampilan temuan terdeduplikasi dengan severity, confidence, evidence tersanitasi, filter, dan remediasi.
- [x] Menambahkan ekspor laporan HTML dan JSON.
- [x] Menambahkan SDK plugin dan kontrak JSON lintas Python, TypeScript, C++, serta C#.
- [x] Menambahkan installer dan dokumentasi Ubuntu/Debian, Arch/BlackArch, Kali, Termux, macOS, Windows, dan platform lain yang relevan.
- [x] Menambahkan README, CHANGELOG, LICENSE, CONTRIBUTING, SECURITY, dan panduan penggunaan aman.
- [x] Menambahkan aset visual produk di luar direktori project sesuai aturan penyimpanan aset.
- [x] Menulis dan menjalankan unit test Vitest untuk policy authorization, pipeline preview, adapter contract, sanitizer laporan, dan autentikasi.
- [x] Memverifikasi TypeScript, test suite, diff whitespace, responsivitas desktop/mobile, serta alur pratinjau tanpa menjalankan scan terhadap target nyata.

## Perbaikan hasil verifikasi

- [x] Lokalkan seluruh label, heading, badge, dan navigasi yang masih berbahasa Inggris menjadi Bahasa Indonesia penuh.
- [x] Tambahkan storage/upload bukti otorisasi yang aman serta tampilkan riwayat pekerjaan workspace sebagai daftar job yang jelas.
- [x] Terapkan validasi rate limit dan timeout pada preview/runner assessment; eksekusi proses aktif sengaja dipisahkan dari MVP.
- [x] Tambahkan tabel evidence dan relasinya ke findings/scan jobs.
- [x] Tambahkan prosedur tRPC untuk laporan dan ekspor HTML/JSON.
- [x] Implementasikan pipeline Nmap→Nuclei config-driven di project ini, lengkap dengan stage, dry-run, dan guardrail.
- [x] Buat halaman Temuan dengan deduplikasi, filter, severity/confidence, evidence tersanitasi, dan remediasi.
- [x] Lengkapi installer/platform notes untuk Unix, Windows, Termux, macOS, dan distro Linux yang ditargetkan.
- [x] Tambahkan test Vitest untuk policy workspace, authorization gate, pipeline preview/validation, deduplikasi findings, sanitizer, dan ekspor laporan inti.
