# Kontrak Integrasi Mr.Kiplay

Semua adapter scanner harus menerima scope tervalidasi, menjalankan mode pratinjau secara default, menerapkan timeout/rate limit, dan mengembalikan output tersanitasi. Adapter tidak boleh menjalankan eksploitasi otomatis atau mengirim callback OOB.

## Tool yang ditargetkan

| Adapter | Fungsi aman awal |
| --- | --- |
| Nmap | Inventaris port dan service terbuka dalam scope |
| Nuclei | Template baseline yang disetujui dan wajib validasi manual |
| Burp Suite | Impor hasil/proyek yang telah diekspor secara sadar oleh operator |
| Amass/Subfinder | Discovery subdomain berizin |
| httpx | Validasi HTTP dan fingerprint teknologi |
| SearchSploit | Pencocokan referensi versi tanpa menjalankan exploit |

Kontrak minimal adapter: `validate(scope, policy)`, `plan(input)`, `run(plan)`, dan `normalize(result)`. Implementasi `run` harus dinonaktifkan ketika mode `preview`, ketika bukti otorisasi tidak ada, atau ketika target tidak berada di allowlist.
