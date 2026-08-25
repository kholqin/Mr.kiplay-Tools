# Storyboard Video Presentasi Mr.Kiplay

Durasi target: sekitar 90 detik. Format utama: 16:9, 1080p, subtitle Bahasa Indonesia. Gaya: dark Merah Putih, ritme cepat namun mudah diikuti, transisi clean, tanpa menampilkan data target nyata.

| Waktu | Visual | Voice-over dan teks layar |
| --- | --- | --- |
| 00–08 dtk | Hook: dashboard muncul dari gelap, aksen merah menyapu layar, badge “Mode aman” dan “Scope aktif”. | “Pernah merasa tools keamanan itu ribet sebelum mulai? Kenalan dengan Mr.Kiplay—ruang kerja security intelligence yang mulai dari izin, bukan dari drama.” |
| 08–20 dtk | Dashboard Ringkasan: checklist kesiapan, workspace, target dalam scope, pipeline. | “Di sini, semua dimulai dari workspace, target allowlist, dan konfirmasi otorisasi. Jadi tombol jalan tidak asal jalan—dia tahu batasnya.” |
| 20–35 dtk | Halaman Recon: katalog 19 modul OSINT, filter kategori, kartu DNS, subdomain, CT, headers, MX, CVE/CPE. | “Ada 19 modul OSINT preview-only: RDAP, ASN, Certificate Transparency, DNS, header, arsip web, sampai korelasi CVE. Banyak pilihan, tetap tertib.” |
| 35–48 dtk | Simulasi preview: pilih target contoh internal, klik pratinjau DNS/subdomain, tampilkan loading shimmer dan status aman. | “Simulasi ini berjalan dalam mode pratinjau. Tidak ada eksploitasi otomatis, tidak ada target sungguhan—hanya alur yang bisa ditinjau.” |
| 48–60 dtk | Hasil tersimpan, tabel port, pagination, tombol ekspor CSV dan PDF. | “Hasil recon tersimpan rapi, bisa difilter, dipaginasi, lalu diunduh sebagai CSV atau PDF langsung dari server. Laporan rapi, kepala juga lebih tenang.” |
| 60–72 dtk | Pipeline Nmap → Nuclei preview, worker terisolasi, status job. | “Untuk pekerjaan lebih berat, worker terisolasi membantu antrean tetap terkendali. Pipeline Nmap ke Nuclei tetap preview-first dan wajib otorisasi.” |
| 72–82 dtk | GitHub repository: README, installer, workflow CI, struktur project generik. | “Source dan dokumentasinya tersedia di GitHub Mr.kiplay-Tools, lengkap dengan README, changelog, lisensi, installer, dan CI.” |
| 82–90 dtk | Terminal Kali Linux animasi: command install, diagnose, dev; kembali ke dashboard dan CTA. | “Di Kali Linux, clone repository, jalankan pnpm install, pnpm diagnose, lalu pnpm dev. Mulai dari scope yang sah. Mr.Kiplay—aman dulu, keren kemudian.” |

## Arahan voice-over

Gunakan suara perempuan muda generik yang ceria, hangat, dan bersahabat; jangan meniru orang atau karakter tertentu. Kecepatan conversational energik, artikulasi jelas, dengan tawa kecil hanya pada candaan “kepala juga lebih tenang”. Voice-over Bahasa Indonesia, aksen Indonesia netral. Subtitle mengikuti naskah dan tidak menutupi kontrol penting.

## Batasan simulasi

Gunakan hanya screenshot dashboard aktual, data kosong, workspace contoh non-jaringan, dan command installer sebagai teks. Jangan menjalankan scan ke target nyata, menampilkan kredensial, alamat pribadi, token, atau output sensitif. Repository yang ditampilkan: https://github.com/kholqin/Mr.kiplay-Tools.
