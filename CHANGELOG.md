# Changelog

Semua perubahan penting pada Mr.kiplay-Tools akan dicatat di dokumen ini.

Format versi mengikuti pola `MAJOR.MINOR.PATCH` secara sederhana, dengan kategori **Added**, **Changed**, **Fixed**, **Security**, dan **Removed** bila relevan.

## [Unreleased]

### Added

- Menetapkan struktur awal repository untuk aplikasi CLI, dashboard web, REST API, core engine, modul analisis, integrasi, plugin, wordlist, laporan, dokumentasi, dan pengujian.
- Menambahkan konfigurasi pipeline awal `core/pipeline/default.yaml` dengan urutan Nmap service discovery lalu Nuclei baseline checks.
- Menambahkan contoh manifest otorisasi di `config/authorization.example.json` dan validator konfigurasi di `scripts/validate_pipeline.py`.
- Menambahkan README dengan penjelasan arsitektur, alur kerja, batas penggunaan, dan roadmap implementasi.
- Menambahkan MIT License.
- Menambahkan panduan kontribusi, kebijakan pelaporan keamanan, dan kode etik komunitas.

### Security

- Menetapkan prinsip penggunaan hanya pada target yang dimiliki atau telah mendapat otorisasi tertulis.
- Menetapkan kebutuhan scope, rate limit, timeout, audit trail, dan perlindungan data pada pipeline.

## [0.1.0] - 2026-08-24

### Added

- Rilis scaffold pertama Mr.kiplay-Tools.

[Unreleased]: https://github.com/kholqin/Mr.kiplay-Tools/compare/v0.1.0...HEAD
[0.1.0]: https://github.com/kholqin/Mr.kiplay-Tools/releases/tag/v0.1.0
