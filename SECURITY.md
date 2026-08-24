# Kebijakan Keamanan

Mr.Kiplay hanya ditujukan untuk assessment yang memiliki otorisasi. Jangan gunakan platform untuk mengakses, memindai, mengeksploitasi, atau mengumpulkan data dari target di luar scope.

## Guardrail wajib

Setiap workspace harus memiliki allowlist target, bukti atau konfirmasi izin, pengecualian jaringan sensitif, timeout, rate limit, audit trail, dan preview sebelum aktivitas berikutnya diaktifkan. Temuan SQLi, XSS, SSRF, exposure, serta misconfiguration adalah indikasi awal dan harus divalidasi manual.

## Pelaporan kerentanan

Jangan mempublikasikan kredensial, data pribadi, hasil scan nyata, atau detail kerentanan yang dapat dieksploitasi melalui issue publik. Gunakan kanal privat pemilik repository untuk laporan keamanan dan sertakan versi/commit, langkah reproduksi aman, dampak, serta rekomendasi mitigasi.

## Distribusi lintas platform

Mr.Kiplay dapat dikembangkan melalui Node.js LTS dan pnpm pada Linux, macOS, Windows, serta Termux. Skrip installer tidak memasang atau menjalankan scanner secara otomatis. Integrasi tool eksternal harus disandbox, diberi batas timeout dan rate, serta dijalankan hanya setelah otorisasi manual.

## Privasi repository

Sebelum commit, periksa diff untuk memastikan tidak ada nama/email pribadi, credentials, hasil scan nyata, target privat, atau bukti otorisasi asli. Gunakan identitas operasional generik pada UI dan contoh dokumentasi.
