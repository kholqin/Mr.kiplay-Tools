# Matriks aktivasi nyata modul OSINT

Mr.Kiplay mengaktifkan modul nyata hanya setelah target berada dalam allowlist workspace dan otorisasi dikonfirmasi. Modul yang melakukan request publik menggunakan batas timeout, rate limit, sanitasi output, dan audit trail. Tidak ada modul yang mencoba kredensial, mengeksploitasi aplikasi, melakukan zone transfer, atau mengambil data bocor mentah.

| Modul | Jalur nyata | Provider/kemampuan | Status awal |
| --- | --- | --- | --- |
| RDAP domain | Request metadata RDAP | rdap.org / bootstrap RDAP | Dapat diaktifkan tanpa secret |
| WHOIS IP | Request metadata registri IP | RDAP regional | Dapat diaktifkan tanpa secret |
| ASN/BGP | Lookup prefix publik | API routing publik terbatas | Dapat diaktifkan tanpa secret |
| Riwayat DNS | Query provider historis | Provider API operator | Memerlukan secret/provider |
| Certificate Transparency | Query inventaris sertifikat | crt.sh | Dapat diaktifkan tanpa secret |
| Korelasi subdomain pasif | Gabungan CT dan evidence | CT + hasil workspace | Dapat diaktifkan tanpa probing |
| Security headers | HEAD/GET terbatas | Target allowlist | Dapat diaktifkan |
| Robots/sitemap | Request dua resource publik | Target allowlist | Dapat diaktifkan |
| Favicon hash | Download bytes terbatas | Target allowlist | Dapat diaktifkan |
| Technology fingerprint | Analisis header/body metadata terbatas | HTTP engine internal | Dapat diaktifkan |
| SPF/DKIM/DMARC | Query TXT DNS | Resolver Node.js | Dapat diaktifkan |
| MX infrastructure | Query MX DNS | Resolver Node.js | Dapat diaktifkan |
| Nameserver infrastructure | Query NS DNS | Resolver Node.js | Dapat diaktifkan |
| Cloud/storage metadata | Heuristik CNAME/NS publik | DNS/metadata saja | Dapat diaktifkan |
| Redirect chain HEAD | HEAD dengan hop maksimal | Target allowlist | Dapat diaktifkan |
| Arsip web | Metadata CDX terbatas | Internet Archive | Dapat diaktifkan tanpa isi massal |
| Repository publik | Metadata repository | GitHub API publik | Dapat diaktifkan tanpa token |
| Indikator breach | Status agregat tanpa raw data | Provider resmi organisasi | Memerlukan secret/provider |
| Korelasi CVE/CPE | Referensi CVE terbatas | NVD API publik | Dapat diaktifkan dengan rate limit |

Status “dapat diaktifkan” berarti jalur teknis dapat dibuat nyata, bukan izin untuk memindai target tanpa otorisasi. DNS, HTTP, TLS, dan port engine yang ada sudah memiliki jalur aktif; preview tetap dipertahankan sebagai opsi pemeriksaan sebelum eksekusi.
