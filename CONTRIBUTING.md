# Panduan Kontribusi

Kontribusi ke Mr.Kiplay harus menjaga prinsip **scope jelas, otorisasi terverifikasi, output dapat diaudit, dan default non-destruktif**. Sebelum membuat perubahan besar, jelaskan tujuan, risiko, dan cara verifikasinya.

Jalankan `pnpm check` dan `pnpm test -- --run` sebelum pull request. Jangan menambahkan credentials, data pribadi, hasil scan nyata, target privat, atau contoh eksploitasi yang dapat langsung disalahgunakan. Perubahan adapter wajib mendokumentasikan timeout, rate limit, validasi input, format output, dan perilaku ketika scope tidak valid.

## Verifikasi lintas platform

Perubahan installer atau dokumentasi harus ditulis agar dapat dijalankan pada Ubuntu, Debian, Kali, Arch, BlackArch, macOS, Windows, dan Termux. Gunakan `scripts/install/install.sh` untuk Unix dan `scripts/install/install.ps1` untuk Windows. Installer hanya melakukan bootstrap dependency serta pemeriksaan kualitas.

## Privasi dan identitas

Jangan menambahkan nama, email, token, hasil scan nyata, target privat, atau bukti otorisasi asli ke fixture, screenshot, dokumentasi, atau commit. Gunakan identitas generik dan data sintetis yang tidak menyerupai target nyata.
