# Contributing to Mr.kiplay-Tools

Terima kasih telah mempertimbangkan kontribusi ke Mr.kiplay-Tools. Proyek ini berfokus pada tooling security yang dapat diaudit, modular, dan aman digunakan pada scope yang telah disetujui.

## Sebelum mulai

Baca README dan SECURITY.md terlebih dahulu. Untuk perubahan besar, buka issue yang menjelaskan masalah, tujuan, batasan, dan rancangan solusi. Perubahan yang memperluas kemampuan scanning harus menjelaskan scope enforcement, rate limiting, timeout, logging, dan cara mencegah penggunaan di luar otorisasi.

## Alur pull request

Gunakan branch dengan nama yang deskriptif, misalnya `feat/recon-module` atau `fix/report-export`. Buat perubahan sekecil dan sefokus mungkin. Sertakan pengujian, dokumentasi, contoh output yang telah disanitasi, dan catatan kompatibilitas bila diperlukan.

Sebelum membuat pull request, jalankan pemeriksaan lokal:

```bash
make check
```

Judul pull request sebaiknya singkat dan menjelaskan hasil perubahan. Deskripsi pull request perlu mencakup konteks, pendekatan, cara verifikasi, dampak keamanan, serta pekerjaan lanjutan yang belum selesai.

## Standar keamanan

Jangan memasukkan token, password, API key, data pribadi, target privat, atau hasil scan nyata ke repository. Gunakan fixtures sintetis dan domain contoh. Modul baru harus menolak input yang ambigu, menggunakan timeout, menangani error secara eksplisit, dan tidak menjalankan aksi destruktif secara default.

## Lisensi kontribusi

Dengan mengirimkan kontribusi, Anda menyatakan bahwa Anda memiliki hak untuk mengirimkannya dan menyetujui kontribusi tersebut dirilis di bawah MIT License yang berlaku untuk proyek ini.
