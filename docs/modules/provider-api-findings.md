# Temuan provider API

## SecurityTrails

Dokumentasi resmi mendefinisikan endpoint REST `GET https://api.securitytrails.com/v1/history/{hostname}/dns/{type}` untuk riwayat DNS berdasarkan tipe `a`, `aaaa`, `mx`, `ns`, `soa`, atau `txt`, dengan parameter `page` dan autentikasi API key. Integrasi akan menyimpan record, waktu, tipe, provenance, dan metadata terbatas; tidak menyimpan credential provider atau data personal.

Sumber: [SecurityTrails DNS history by record type](https://docs.securitytrails.com/reference/dns-history-by-record-type-old-1).

## Have I Been Pwned

Dokumentasi resmi mendefinisikan API REST v3 di `https://haveibeenpwned.com/api/v3`. Pencarian domain memerlukan header `hibp-api-key`; domain harus diverifikasi pada akun HIBP. Integrasi Mr.Kiplay hanya akan menyimpan indikator teragregasi/status dan provenance, bukan daftar email, password, token, cookie, atau detail breach mentah.

Sumber: [Have I Been Pwned API v3](https://haveibeenpwned.com/API/V3).

## Keputusan implementasi

Kedua provider dibuat opsional dan tidak diaktifkan tanpa secret operator. Health-check dilakukan melalui endpoint resmi yang ringan setelah secret tersedia. Error 401/403, rate limit, timeout, dan domain belum terverifikasi harus ditampilkan sebagai status operasional, bukan temuan keamanan.
