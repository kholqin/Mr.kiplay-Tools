# Panduan Kontribusi

Kontribusi ke Mr.Kiplay harus menjaga prinsip **scope jelas, otorisasi terverifikasi, output dapat diaudit, dan default non-destruktif**. Sebelum membuat perubahan besar, jelaskan tujuan, risiko, dan cara verifikasinya.

Jalankan `pnpm check` dan `pnpm test -- --run` sebelum pull request. Jangan menambahkan credentials, data pribadi, hasil scan nyata, target privat, atau contoh eksploitasi yang dapat langsung disalahgunakan. Perubahan adapter wajib mendokumentasikan timeout, rate limit, validasi input, format output, dan perilaku ketika scope tidak valid.
