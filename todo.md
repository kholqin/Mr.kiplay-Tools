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

## Recon aktif DNS dan subdomain

- [x] Menambahkan engine DNS berizin dengan timeout, rate limit, validasi scope, dan audit trail.
- [x] Menambahkan engine pencarian subdomain berbasis kandidat terbatas dengan deduplikasi dan tanpa brute force agresif.
- [x] Menambahkan schema/penyimpanan hasil recon dan endpoint API terproteksi.
- [x] Menambahkan halaman Recon berbahasa Indonesia untuk menjalankan pratinjau dan recon aktif terotorisasi.
- [x] Menulis test untuk scope gate, DNS normalization, subdomain deduplikasi, timeout, dan pembatasan rate.
- [x] Memverifikasi build, test, dan responsif tanpa menggunakan target nyata.

## Koreksi verifikasi recon

- [x] Menerapkan rate limit eksplisit pada setiap query DNS dan menyediakan helper yang dapat diuji.
- [x] Menambahkan test timeout dan rate limit DNS tanpa mengirim query ke target nyata.

## Resolver DNS kustom dan cache

- [x] Menambahkan validasi resolver DNS kustom dan kebijakan daftar resolver yang aman.
- [x] Menambahkan cache hasil DNS/subdomain berbasis TTL dan batas ukuran memori.
- [x] Menghubungkan pilihan resolver serta opsi lewati cache ke API dan halaman Recon.
- [x] Menulis test untuk validasi resolver, hit/miss/expiry cache, dan isolasi cache antar target.
- [x] Memverifikasi build, test, responsif, dan membuat checkpoint.

## Verifikasi akhir resolver/cache

- [x] Verifikasi ulang halaman Recon pada viewport mobile dan desktop setelah kontrol resolver, TTL, dan lewati cache ditambahkan.
- [x] Simpan checkpoint baru setelah validasi akhir resolver DNS kustom dan cache TTL selesai.

- [x] Perbaiki panel kontrol resolver pada desktop agar input resolver memiliki lebar layak dan label tidak terpotong.

## Integrasi subdomain ke port scanning

- [x] Menambahkan planner port scan aman dari hasil subdomain dengan daftar port eksplisit dan batas target.
- [x] Menambahkan schema/penyimpanan hasil port scan serta audit trail.
- [x] Menambahkan endpoint API terproteksi untuk pratinjau dan eksekusi port scan berizin.
- [x] Menambahkan kontrol UI Recon untuk port scan otomatis dari subdomain tersimpan.
- [x] Menulis test untuk normalisasi port, batas port/target, scope gate, dan pipeline subdomain→port.
- [x] Memverifikasi build, test, responsif, dan checkpoint tanpa memindai target nyata.

## Verifikasi integrasi port scan

- [x] Menambahkan test integrasi pipeline subdomain tersimpan ke planner port scan dan guard otorisasi.
- [x] Memverifikasi halaman Recon pada viewport desktop setelah kartu port scan ditambahkan.
- [x] Menyimpan checkpoint baru setelah verifikasi integrasi port scan selesai.

## Tabel port dan ekspor CSV

- [x] Menambahkan helper CSV dengan escaping dan perlindungan formula injection.
- [x] Menambahkan tabel observasi port dengan filter host dan status.
- [x] Menambahkan opsi ekspor CSV dari hasil terfilter.
- [x] Menulis test helper CSV dan filter tabel.
- [x] Memverifikasi build, test, responsif, dan checkpoint.

## Verifikasi akhir tabel CSV

- [x] Mengekstrak dan menguji helper filter host/status secara deterministik.
- [x] Memverifikasi halaman Recon pada viewport mobile setelah tabel port dan ekspor CSV ditambahkan.
- [x] Menyimpan checkpoint baru setelah validasi akhir tabel dan ekspor CSV.

- [x] Simpan checkpoint baru setelah validasi akhir fitur tabel port, filter host/status, dan ekspor CSV. selesai.

## Pagination dan pengurutan tabel port

- [x] Menambahkan helper pengurutan port yang deterministik berdasarkan host, port, status, dan waktu.
- [x] Menambahkan pagination dengan pilihan ukuran halaman dan navigasi sebelumnya/berikutnya.
- [x] Menjaga ekspor CSV tetap mencakup seluruh hasil yang sedang terfilter, bukan hanya halaman aktif.
- [x] Menulis test helper sorting dan pagination.
- [x] Memverifikasi build, test, responsif, dan checkpoint.

- [x] Simpan checkpoint baru setelah validasi akhir fitur pagination dan pengurutan tabel port selesai.

## Server-side pagination hasil port

- [x] Menambahkan kontrak query halaman port dengan filter host/status dan sort yang tervalidasi.
- [x] Menambahkan query database dengan LIMIT/OFFSET serta total count terbatas pada workspace.
- [x] Menghubungkan endpoint tRPC dan UI agar hanya memuat halaman aktif.
- [x] Menjaga ekspor CSV tetap mengambil seluruh hasil terfilter melalui endpoint khusus dengan batas aman 10.000 baris.
- [x] Menulis test kontrak pagination server-side dan validasi sort/filter melalui test pagination/filter yang sudah ada.
- [x] Memverifikasi build, test, responsif, serta checkpoint.

## Koreksi verifikasi server-side pagination

- [x] Tambahkan test Vitest yang memverifikasi LIMIT/OFFSET, totalRows/totalPages, sort, filter, dan ekspor CSV server-side.
- [x] Simpan checkpoint baru setelah validasi akhir server-side pagination selesai.

## Penguatan test server-side pagination

- [x] Assert eksplisit pemanggilan LIMIT/OFFSET, filter host/status, dan kolom sort pada query mock.
- [x] Assert ekspor CSV server-side mengambil seluruh hasil terfilter, bukan hanya halaman aktif.
- [x] Simpan checkpoint baru setelah test dan verifikasi final selesai.

## Peningkatan identitas, kesiapan, dan distribusi lintas platform

- [x] Menghapus nama/email pribadi dari greeting dan profil sidebar; gunakan identitas generik Mr.Kiplay.
- [x] Menambahkan checklist kesiapan assessment yang menghitung workspace, target, profil, dan otorisasi dari data aktif.
- [x] Menambahkan quick actions yang mengarahkan analis ke langkah yang belum selesai tanpa menjalankan scan otomatis.
- [x] Memperbarui README dengan gambaran fitur aktual, batasan aman, arsitektur, penggunaan, dan dukungan Linux/macOS/Windows/Termux.
- [x] Memperbarui CHANGELOG, LICENSE, CONTRIBUTING, SECURITY, dan skrip installer lintas platform.
- [x] Menambahkan test untuk identitas generik dan helper checklist kesiapan.
- [x] Memvalidasi project, membuat checkpoint, commit, dan push ke repository GitHub Mr.kiplay-Tools.

## Riwayat perubahan sesi lanjutan

- [x] Sinkronisasi hasil implementasi ke repository GitHub publik kholqin/Mr.kiplay-Tools dan verifikasi commit terbaru.

## Koreksi verifikasi identitas dan kebijakan

- [x] Perbarui LICENSE, CONTRIBUTING.md, dan SECURITY.md agar selaras dengan distribusi lintas platform serta guardrail terbaru.
- [x] Tambahkan test UI/unit yang memverifikasi greeting dan sidebar memakai identitas generik tanpa merender nama/email pribadi.

## Verifikasi akhir sesi

- [x] Buat checkpoint baru setelah perubahan identitas, dokumentasi, dan installer selesai divalidasi.
- [x] Lakukan git add, commit, dan push ke kholqin/Mr.kiplay-Tools lalu verifikasi commit terbaru pada remote.
- [x] Tambahkan test kontrak komponen Home dan DashboardLayout yang memastikan identitas generik dirender tanpa nama/email pengguna.

## Worker, HTTP fingerprinting, sertifikat, dan CI

- [x] Audit kontrak job, recon, router, dan workflow CI yang tersedia.
- [x] Tambahkan worker terisolasi bounded untuk tugas berat non-destruktif dengan timeout, batas antrean, dan status job.
- [x] Tambahkan HTTP fingerprinting pasif dengan validasi scope, timeout, rate limit, dan sanitasi header.
- [x] Tambahkan inventaris sertifikat TLS dengan validasi scope, timeout, dan keluaran metadata terbatas.
- [x] Hubungkan modul baru ke API/UI melalui alur preview dan authorization gate.
- [x] Tambahkan test untuk worker, HTTP fingerprinting, inventaris sertifikat, dan guardrail.
- [x] Tambahkan GitHub Actions untuk Node.js 20, 22, dan 24 dengan check, test, build, serta validasi installer.
- [x] Jalankan validasi akhir (check, test, build, diff, installer, dan visual UI).

## Koreksi rate limit HTTP

- [x] Terapkan rate limit konservatif pada request HTTP aktif, bukan hanya mendeklarasikan opsi.
- [x] Tambahkan test yang membuktikan jeda rate limit HTTP dipakai pada jalur aktif.
- [x] Jalankan ulang check dan test setelah koreksi rate limit HTTP.

- [x] Simpan checkpoint baru untuk worker, HTTP fingerprinting, sertifikat, dan CI.
- [x] Commit dan push semua perubahan ke kholqin/Mr.kiplay-Tools lalu verifikasi SHA remote.

## CI Windows untuk installer PowerShell

- [x] Audit workflow CI dan installer PowerShell saat ini.
- [x] Tetapkan skenario test Windows yang aman tanpa menjalankan scanner atau target jaringan.
- [x] Tambahkan workflow GitHub Actions Windows untuk validasi sintaks, mode bantuan, dan bootstrap installer PowerShell.
- [x] Perbarui dokumentasi CI dan installer bila diperlukan.
- [x] Jalankan validasi lokal (check, 46 test, diff check, sintaks installer Unix, parser PowerShell, dan help mode).

## Koreksi help mode installer Windows

- [x] Tambahkan parameter `-Help` pada installer PowerShell tanpa menjalankan instalasi.
- [x] Uji help mode pada job Windows dan verifikasi output usage yang eksplisit.
- [x] Jalankan ulang check dan test setelah koreksi installer.

- [x] Commit dan push workflow CI Windows serta help mode installer ke GitHub; SHA remote terverifikasi.

## Progress feedback installer PowerShell

- [x] Audit installer dan kontrak CI PowerShell saat ini.
- [x] Rancang progress bar interaktif yang dilewati atau diringkas pada mode CI.
- [x] Tambahkan progress feedback per tahap tanpa mengubah urutan bootstrap atau menjalankan scanner.
- [x] Tambahkan test untuk help mode, progress marker, dan mode CI installer.
- [x] Perbarui dokumentasi installer dan CHANGELOG.
- [x] Jalankan validasi (check, 47 test, diff check, parser/help PowerShell, dan marker progress).

## Koreksi dokumentasi progress installer

- [x] Perbarui README atau panduan instalasi Windows tentang progress bar interaktif dan output ringkas CI.
- [x] Tambahkan entri CHANGELOG untuk progress feedback dan marker `[CI]`.
- [x] Jalankan ulang check dan test setelah dokumentasi diperbarui.
