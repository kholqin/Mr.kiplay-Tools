# Modul Mr.Kiplay

Modul dikelompokkan menjadi **recon**, **assessment web non-destruktif**, **OSINT/intelligence**, dan **integrasi hasil**. Semua modul menerima scope tervalidasi dan mengembalikan evidence tersanitasi beserta severity serta confidence.

| Kelompok | Modul awal | Batasan |
| --- | --- | --- |
| Recon | Subdomain, DNS, HTTP/technology, certificate, port/service, inventaris IP | Hanya target dalam allowlist |
| Web aman | Header, exposure, misconfiguration, indikasi SQLi/XSS/SSRF | Sinyal awal; validasi manual; tanpa payload destruktif |
| Intelligence | OSINT, dork review, fingerprint, referensi SearchSploit | Query ditinjau operator; tanpa exploit execution |
| Adapter | Nmap, Nuclei, Burp Suite, Amass, Subfinder, httpx | Kontrak planner dan normalizer; runner harus mematuhi policy |

Modul yang melakukan network I/O wajib memiliki timeout, rate limit, error boundary, audit event, dan mode preview. Temuan dengan fingerprint sama pada target dan template yang sama harus digabung sebelum ditampilkan.

## Katalog OSINT preview-only

| Modul | Keluaran utama | Batasan operasional |
| --- | --- | --- |
| RDAP domain | Registrar, status, tanggal, nameserver | Domain harus berada di allowlist |
| WHOIS IP | Organisasi, netblock, abuse generik | Tidak menghubungi kontak personal |
| ASN/BGP | ASN, prefix, organisasi, negara | Tidak melakukan pemindaian jaringan |
| Riwayat DNS | Timeline record dan provenance | Provider API wajib disetujui |
| Certificate Transparency | SAN/hostname dan waktu terlihat | Kandidat wajib diverifikasi ulang |
| Korelasi subdomain pasif | Host kandidat dan provenance | Tanpa brute force atau probing otomatis |
| Snapshot security headers | Kontrol header dan evidence | HEAD terbatas, tanpa payload |
| Robots dan sitemap | Path publik dan aturan crawler | Tidak crawling path otomatis |
| Favicon hash | Hash dan relasi aset | Bytes tidak disimpan permanen |
| Fingerprint teknologi | Produk, versi indikatif, confidence | Versi bukan temuan terkonfirmasi |
| SPF/DKIM/DMARC | Record dan rekomendasi email | Tidak mengirim email atau menguji akun |
| Infrastruktur MX | Host MX, prioritas, provider | DNS lookup rate-limited |
| Infrastruktur nameserver | NS, IP, provider indikatif | Tidak melakukan zone transfer |
| Metadata cloud/storage | Provider indikatif dari DNS | Tidak mencoba bucket atau objek |
| Rantai redirect HEAD | Status dan host per hop | Hop dan timeout dibatasi |
| Metadata arsip web | URL, timestamp, tipe konten | Tidak mengambil arsip massal |
| Metadata repository publik | URL, bahasa, branch, aktivitas | Tidak memakai token atau membaca privat |
| Indikator breach via API | Status, waktu, provenance | Tidak menyimpan password/token/data mentah |
| Korelasi CVE/CPE | Referensi dan confidence | Wajib validasi manual, tanpa exploit |

Seluruh entri baru memiliki `previewOnly: true`, `active: false`, dan `manualValidationRequired: true`. Koneksi provider eksternal harus melewati authorization gate, allowlist target, timeout, rate limit, sanitasi, serta audit trail. Data yang berpotensi menjadi credential, token, cookie, password, atau identitas personal berlebihan harus ditolak atau direduksi sebelum disimpan.

## Fitur pendukung

`shared/osintSupport.ts` menyediakan normalisasi IOC, pembentukan relasi domain-IP untuk graph aset, timeline evidence terbatas 500 item, risk scoring 0–100 dengan formula yang dapat diaudit, serta ekspor CSV maksimal 1.000 baris. Helper menolak alamat IPv4 privat dan nilai yang menyerupai secret.

## Ekspor recon OSINT

Ekspor recon tersedia melalui prosedur tRPC terproteksi `assessment.reconExport`. Format `csv` menghasilkan kolom modul, target, status, waktu, dan ringkasan. Format `html` menghasilkan laporan print-ready yang dapat disimpan melalui dialog browser sebagai PDF. Keduanya memakai data workspace yang sudah melewati authorization gate, maksimal 1.000 baris, escaping HTML, escaping CSV, dan redaksi field sensitif.
