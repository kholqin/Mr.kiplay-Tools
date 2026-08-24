# Mr.Kiplay Security Intelligence Toolkit

**Mr.kiplay-Tools** adalah toolkit modular untuk **reconnaissance, asset discovery, security assessment, evidence collection, dan reporting** dalam satu alur kerja yang terstruktur. Proyek ini dirancang agar analis keamanan dapat mengorkestrasi berbagai integrasi populer melalui CLI, dashboard web, REST API, dan plugin SDK.

> **Peringatan penggunaan:** toolkit ini hanya boleh digunakan pada aset yang Anda miliki atau yang secara tertulis mengizinkan pengujian. Menjalankan pemindaian, eksploitasi, atau pengumpulan data terhadap target tanpa otorisasi dapat melanggar hukum dan kebijakan layanan.

## Status proyek

Repository ini saat ini berfungsi sebagai **scaffold arsitektur**. Struktur modul dan integrasi disiapkan agar implementasi dapat dikembangkan secara bertahap. Fitur yang belum tersedia tidak boleh dianggap sudah berjalan hanya karena direktori atau nama modulnya telah dibuat.

| Area | Rencana fungsi | Status awal |
| --- | --- | --- |
| `apps/cli` | Antarmuka command-line `mrk` | Scaffold |
| `apps/web` | Dashboard pemantauan dan hasil scan | Scaffold |
| `apps/api` | REST API untuk orkestrasi job | Scaffold |
| `core/` | Engine, pipeline, scheduler, evidence, report, storage | Scaffold |
| `modules/` | Recon, vulnerability assessment, OSINT, discovery, intelligence | Scaffold |
| `integrations/` | Adapter untuk tool eksternal | Scaffold |
| `plugins/` | SDK dan contoh ekstensi | Scaffold |
| `tests/` | Unit test, integration test, dan fixtures | Scaffold |

## Prinsip desain

Mr.kiplay-Tools menggunakan pendekatan modular sehingga setiap kemampuan dapat dikembangkan, diuji, dan diganti secara terpisah. **Core engine** bertanggung jawab atas orkestrasi; **module** menyediakan kemampuan analisis; **integration** menjadi adapter untuk program eksternal; sedangkan **evidence, reporting, dan storage** memastikan hasil dapat ditelusuri dan diekspor dengan konsisten.

Setiap operasi yang menyentuh target harus memiliki scope yang jelas, jejak audit, batas rate, serta mekanisme penghentian. Modul aktif sebaiknya menyediakan mode pasif terlebih dahulu, validasi input, timeout, logging, dan output terstruktur.

## Struktur repository

```text
apps/             Aplikasi CLI, dashboard web, dan REST API
core/              Engine orkestrasi dan layanan inti
modules/           Modul recon, vulnerability, OSINT, discovery, intelligence
integrations/      Adapter Burp, Nmap, Nuclei, Amass, Subfinder, httpx, SearchSploit
frontend/          Komponen UI, halaman, dashboard, tema, animasi, aset
native/            Engine C++ dan integrasi C#/.NET
plugins/           SDK plugin dan contoh implementasi
wordlists/         Wordlist subdomain, direktori, dan parameter
reports/           Template serta contoh laporan
tests/             Unit test, integration test, dan fixtures
docs/              Dokumentasi arsitektur, modul, API, instalasi, development
scripts/           Script instalasi, build, dan release
.github/           Workflow CI, template issue, serta template pull request
```

## Instalasi pengembangan

Karena repository masih berada pada tahap scaffold, perintah berikut menyiapkan lingkungan Python dan Node.js secara umum. Detail dependency setiap aplikasi akan ditambahkan bersama implementasi masing-masing komponen.

```bash
git clone https://github.com/kholqin/Mr.kiplay-Tools.git
cd Mr.kiplay-Tools

python3 -m venv .venv
source .venv/bin/activate
python -m pip install --upgrade pip

npm install
```

Untuk memeriksa struktur proyek dan menjalankan pemeriksaan dasar:

```bash
make check
```

## Konsep penggunaan

Alur kerja yang direncanakan adalah sebagai berikut:

1. Membuat **target dan scope** yang terdokumentasi.
2. Menentukan modul dan integrasi yang diizinkan untuk job tersebut.
3. Menjalankan pipeline dengan timeout, rate limit, dan logging.
4. Mengumpulkan evidence yang relevan tanpa menyimpan rahasia atau data pribadi yang tidak diperlukan.
5. Meninjau hasil, memberi tingkat keparahan dan confidence, lalu membuat report.
6. Menyimpan artefak secara aman serta menghapus data sesuai kebijakan retensi.

Contoh bentuk perintah yang direncanakan, bukan jaminan fitur yang sudah tersedia:

```bash
mrk target add example.com --scope approved
mrk scan run --target example.com --profile passive
mrk report generate --format html --input ./results/latest
```

## Integrasi eksternal

Adapter pada `integrations/` ditujukan untuk menghubungkan toolkit dengan tool security assessment yang telah terpasang dan dikonfigurasi oleh pengguna. Integrasi tidak otomatis memberikan izin untuk mengakses target. Pengguna tetap bertanggung jawab atas instalasi tool, lisensi, kredensial, scope, dan kepatuhan terhadap aturan yang berlaku.

## Kontribusi

Kontribusi dipersilakan melalui issue dan pull request. Sebelum mengirim perubahan, baca [CONTRIBUTING.md](CONTRIBUTING.md), pastikan perubahan tidak menambahkan perilaku pemindaian yang agresif tanpa guardrail, dan sertakan pengujian atau penjelasan verifikasi yang sesuai.

## Pelaporan kerentanan

Jangan mempublikasikan detail kerentanan keamanan repository melalui issue terbuka. Ikuti prosedur pada [SECURITY.md](SECURITY.md) agar laporan dapat ditangani secara bertanggung jawab.

## Lisensi

Proyek ini dirilis di bawah [MIT License](LICENSE). Lisensi tersebut berlaku untuk kode dan artefak proyek yang memang dibuat di dalam repository, sedangkan tool pihak ketiga tetap tunduk pada lisensinya masing-masing.

## Kredit dan kontak

Pemelihara repository: **kholqin**. Untuk pertanyaan umum, gunakan GitHub Issues. Untuk isu keamanan, gunakan kanal privat yang dijelaskan dalam [SECURITY.md](SECURITY.md).
