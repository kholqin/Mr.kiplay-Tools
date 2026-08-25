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

## Log lokal installer PowerShell

- [x] Audit alur installer dan kebutuhan logging lokal.
- [x] Rancang format log, lokasi file, rotasi sederhana, dan sanitasi data sensitif.
- [x] Tambahkan pencatatan tahap, command status, dan error ke file teks lokal.
- [x] Tambahkan test untuk pembuatan log, error logging, dan ketiadaan rahasia.
- [x] Perbarui dokumentasi Windows dan CHANGELOG tentang lokasi serta batasan log.
- [x] Jalankan validasi (check, 58 test, build, diff, parser/self-test PowerShell, installer Unix, audit produksi) dan dokumentasikan hasil.

## Perbaikan instalasi Termux

- [x] Audit branch main GitHub dan isi clone untuk memastikan package.json terpublikasi.
- [x] Verifikasi apakah source project dan dokumentasi ter-copy lengkap ke repository publik.
- [x] Perbaiki sinkronisasi repository atau instruksi instalasi Termux sesuai akar masalah.
- [x] Validasi clone baru dengan package.json, pnpm install, check, dan test yang relevan.
- [x] Simpan checkpoint dan laporkan command Termux yang benar.

## Audit menyeluruh dan kemudahan instalasi Kali/Termux

- [x] Audit package manifest, dependency, TypeScript, server, client, shared, core, installer, dan workflow CI.
- [x] Catat bug atau risiko yang terverifikasi dan pilih perbaikan yang aman serta terukur.
- [x] Tambahkan fitur platform yang relevan tanpa melemahkan authorization gate atau menjalankan scan nyata.
- [x] Perkuat installer Kali Linux dan Termux dengan deteksi environment, pesan error, dan bootstrap yang idempoten.
- [x] Tambahkan test regresi, dokumentasi troubleshooting, dan CI untuk jalur instalasi.
- [x] Jalankan check, test, build, diff check, validasi installer, dan verifikasi visual; checkpoint/sinkronisasi dicatat pada item khusus.

## Perbaikan warning konfigurasi pnpm

- [x] Pindahkan konfigurasi patchedDependencies dan overrides dari field package.json ke konfigurasi pnpm yang didukung.
- [x] Tambahkan test atau pemeriksaan agar konfigurasi patch wouter dan override nanoid tetap aktif.
- [x] Jalankan ulang check, test, build, dan audit dependency setelah perbaikan.

## Diagnostik dan upgrade lintas platform

- [x] Tambahkan command `pnpm diagnose` untuk memeriksa runtime, package manifest, pnpm, dan environment Termux/Kali tanpa network scan.
- [x] Tambahkan test kontrak diagnostik dan konfigurasi pnpm workspace.
- [x] Evaluasi warning dependency serta peer dependency tanpa upgrade major yang berisiko.
- [x] Perbarui README dan panduan instalasi dengan troubleshooting diagnostik.
- [x] Jalankan validasi penuh, checkpoint, dan sinkronisasi repository.

## Temuan audit lanjutan

- [x] Jadikan installer Unix dan PowerShell bekerja dari direktori pemanggil mana pun dengan root project terdeteksi otomatis.
- [x] Tambahkan logging lokal PowerShell dengan sanitasi pesan dan rotasi sederhana.
- [x] Sertakan log installer Windows sebagai artifact CI saat job gagal atau selesai.
- [x] Dokumentasikan `pnpm diagnose` dan lokasi log untuk troubleshooting Termux/Kali/Windows.

## Koreksi regresi test logging

- [x] Perbaiki assertion test rotasi log agar memeriksa suffix `.1` dan bukan nama path literal.
- [x] Ulangi check, test, build, dan audit dependency setelah koreksi test.

## Temuan audit dependency kritis

- [x] Upgrade AWS SDK S3 ke rilis kompatibel yang membawa fast-xml-parser patched.
- [x] Jalankan audit produksi ulang dan pastikan temuan kritis fast-xml-parser hilang.

## Hardening dependency high

- [x] Upgrade tRPC v11 ke rilis patched >=11.8.0.
- [x] Evaluasi patch path-to-regexp; digantikan dengan migrasi Express 5 karena override nested tidak diterapkan.
- [x] Dokumentasikan dependency high yang berasal dari rantai dev/visualisasi dan tidak di-upgrade major tanpa migrasi terpisah.
- [x] Jalankan audit produksi, check, test, dan build setelah hardening.

## Strategi hardening Express

- [x] Ganti override nested path-to-regexp yang tidak diterapkan dengan upgrade Express 5 dan types yang kompatibel.
- [x] Jalankan check, test, build, dan audit ulang setelah migrasi Express.

## Regresi setelah upgrade Express/AWS

- [x] Perbaiki error TypeScript pada `server/_core/storageProxy.ts` yang muncul setelah upgrade dependency.
- [x] Tambahkan test atau pemeriksaan tipe untuk konfigurasi header storage proxy.
- [x] Ulangi check, test, build, dan audit setelah perbaikan regresi.

## Regresi Express 5 pada Vite bridge

- [x] Ganti wildcard `app.use("*")` pada Vite bridge dengan pola route yang kompatibel Express 5.
- [x] Tambahkan regression test untuk mencegah PathError saat server start.
- [x] Restart server dan validasi log runtime setelah perbaikan.

## Evaluasi upgrade visual/runtime

- [x] Upgrade streamdown dan recharts ke major terbaru setelah menyesuaikan tipe wrapper dan memastikan API kompatibel.
- [x] Jalankan check, test, build, dan audit produksi setelah upgrade visual/runtime.

## Temuan moderate terakhir

- [x] Pin mdast-util-to-hast >=13.2.1 pada rantai streamdown tanpa mengubah API aplikasi.
- [x] Jalankan audit produksi dan test ulang untuk memastikan moderate vulnerability tertangani.

## Gap verifikasi sebelum checkpoint berikutnya

- [x] Tambahkan test PowerShell runtime yang memverifikasi log benar-benar dibuat, error dicatat, dan token/Authorization disanitasi menjadi `[REDACTED]`.
- [x] Verifikasi eksplisit README dan dokumen instalasi utama tersedia pada clone repository publik.
- [x] Uji clone bersih dari GitHub dengan `package.json`, `pnpm install`, `pnpm check`, dan `pnpm test -- --run`.
- [x] Simpan checkpoint baru setelah perbaikan instalasi Termux tervalidasi end-to-end.

## Koreksi sanitasi Bearer pada log

- [x] Jalankan redaction Bearer token sebelum redaction key/value agar token tidak tersisa.
- [x] Ulangi self-test PowerShell dan seluruh validasi setelah koreksi sanitasi.

## Gap validasi pasca-upgrade

- [x] Lakukan verifikasi visual ulang setelah upgrade Express/Recharts dan catat hasil desktop/mobile.
- [x] Simpan checkpoint baru setelah audit dan hardening terbaru tervalidasi.
- [x] Commit dan push perubahan audit/hardening terbaru lalu verifikasi SHA remote.

## Sequencing checkpoint instalasi

- [x] Simpan checkpoint baru setelah verifikasi clone publik bersih selesai agar validasi Termux/repository tercakup oleh checkpoint terbaru.

## Paket 19 modul OSINT aman

- [x] Tetapkan 19 modul OSINT preview-only: RDAP domain, WHOIS IP, ASN/BGP, DNS history, Certificate Transparency, korelasi subdomain pasif, header HTTP, robots/sitemap, favicon hash, technology fingerprint, SPF/DKIM/DMARC, MX/mail infrastructure, nameserver infrastructure, metadata cloud/storage berbasis DNS, redirect chain HEAD, Wayback metadata, repository publik metadata, indikator breach via API berizin tanpa data mentah, dan korelasi CVE/CPE.
- [x] Tambahkan kontrak modul dengan kategori, input, output tersanitasi, batas akses, dan status implementasi.
- [x] Tambahkan fitur pendukung: timeline evidence, normalisasi IOC, graph relasi aset, risk scoring transparan, filter status modul, dan ekspor ringkasan.
- [x] Integrasikan katalog dan filter OSINT ke UI berbahasa Indonesia tanpa menjalankan pengumpulan data pribadi atau akses privat.
- [x] Tambahkan test guardrail untuk preview-only, target scope, sanitasi, dan batas rate/timeout.
- [x] Perbarui README, panduan modul, CHANGELOG, dan batasan legal/operasional.
- [x] Jalankan check, test, build, verifikasi visual, checkpoint, dan sinkronisasi GitHub.

## Peningkatan UX loading dan error modul OSINT

- [x] Tambahkan komponen loading OSINT dengan shimmer/spinner, label status, dan dukungan reduced-motion.
- [x] Tambahkan komponen error OSINT dengan pesan aman, penyebab umum, tindakan pemulihan, dan tombol coba lagi.
- [x] Integrasikan loading/error ke query katalog serta seluruh mutation Recon/OSINT.
- [x] Tambahkan test kontrak untuk label loading, error sanitization, retry, dan aksesibilitas dasar.
- [x] Perbarui dokumentasi UX dan CHANGELOG.
- [x] Jalankan check, test, build, verifikasi visual desktop/mobile, checkpoint, dan sinkronisasi.

- [x] Perbaiki mismatch hash Corepack pada deklarasi `packageManager` agar build terkelola dapat memasang pnpm secara konsisten.

## Audit dan upgrade release lanjutan

- [x] Tambahkan verifikasi kontrak modul dan command diagnostik untuk seluruh script installer/diagnose.
- [x] Tambahkan modul defensif baru yang bounded: asset inventory summary, evidence timeline, policy report, dan health checks tanpa network scan tambahan.
- [x] Perkuat validasi input, error boundary, dan observability server/client tanpa melemahkan authorization gate.
- [x] Perbarui README, CHANGELOG, LICENSE, dan panduan release sesuai fitur aktual.
- [x] Jalankan check, seluruh test, build, audit dependency, diff whitespace, dan pemeriksaan rahasia.
- [x] Commit dan push perubahan ke repository GitHub publik lalu verifikasi SHA, tree, dan file dokumentasi remote.

## Perbaikan ERR_INVALID_PACKAGE_CONFIG

- [x] Perbaiki sumber error runtime package config dan pastikan format manifest kompatibel dengan Node.js 20/22/24.
- [x] Restart server dan verifikasi log startup tanpa ERR_INVALID_PACKAGE_CONFIG.
- [x] Jalankan check, test, build, dan screenshot halaman utama serta Recon desktop/mobile.
- [x] Simpan checkpoint hasil perbaikan runtime.

## Ekspor hasil recon OSINT

- [x] Tambahkan helper ekspor recon tersanitasi dengan batas maksimal baris dan perlindungan formula injection.
- [x] Tambahkan endpoint tRPC terproteksi untuk mengambil CSV dan laporan PDF/HTML hasil recon workspace.
- [x] Tambahkan kontrol UI ekspor CSV dan PDF pada kartu hasil recon dengan state loading/error yang jelas.
- [x] Tambahkan test helper dan endpoint untuk authorization, sanitasi, batas ukuran, dan format output.
- [x] Perbarui README, panduan modul, dan CHANGELOG tentang ekspor recon.
- [x] Jalankan check, test, build, screenshot desktop/mobile, dan checkpoint.

## PDF server-side untuk recon OSINT

- [x] Tambahkan generator PDF langsung dari server tanpa binary runtime tambahan.
- [x] Ubah endpoint ekspor HTML menjadi respons PDF binary dengan MIME dan nama file yang benar.
- [x] Ubah tombol UI menjadi Unduh PDF langsung dengan state loading/error yang jelas.
- [x] Tambahkan test PDF untuk signature, sanitasi, batas 1000 baris, dan ketiadaan secret.
- [x] Perbarui README, panduan modul, dan CHANGELOG.
- [x] Jalankan check, test, build, screenshot desktop/mobile, dan checkpoint.

## Video presentasi Mr.Kiplay

- [x] Susun storyboard 90 detik dengan hook 3–10 detik, dashboard, OSINT, simulasi preview, GitHub, dan Kali Linux.
- [x] Kumpulkan screenshot dashboard/Recon/GitHub dan aset simulasi aman tanpa target nyata.
- [x] Buat voice-over Bahasa Indonesia dengan suara perempuan muda generik yang ceria, friendly, dan candaan ringan.
- [x] Produksi video presentasi sekitar 90 detik dengan subtitle/teks layar yang terbaca.
- [x] Tambahkan pemutar video yang jelas pada dashboard dengan poster, caption, dan kontrol aksesibel.
- [x] Validasi durasi, audio, visual, responsif, dan ukuran media sebelum checkpoint.

## Aktivasi fitur nyata terkontrol

- [x] Aktifkan engine metadata publik nyata untuk RDAP, CT, robots/sitemap, favicon, email DNS, MX, NS, redirect, arsip, dan repository publik.
- [x] Hubungkan endpoint tRPC live OSINT ke target allowlist dan otorisasi workspace tanpa preview default.
- [x] Tambahkan persistensi hasil live OSINT serta provenance/evidence ke database workspace.
- [x] Perkuat worker agar status job dan hasil bertahan setelah restart server.
- [ ] Tambahkan konfigurasi provider opsional dan secret hanya untuk modul yang membutuhkannya.
- [x] Tambahkan test unit/integrasi tanpa menjalankan target eksternal dan dokumentasikan cara mengaktifkan eksekusi nyata.
