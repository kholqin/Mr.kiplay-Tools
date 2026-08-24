# Modul Mr.Kiplay

Modul dikelompokkan menjadi **recon**, **assessment web non-destruktif**, **OSINT/intelligence**, dan **integrasi hasil**. Semua modul menerima scope tervalidasi dan mengembalikan evidence tersanitasi beserta severity serta confidence.

| Kelompok | Modul awal | Batasan |
| --- | --- | --- |
| Recon | Subdomain, DNS, HTTP/technology, certificate, port/service, inventaris IP | Hanya target dalam allowlist |
| Web aman | Header, exposure, misconfiguration, indikasi SQLi/XSS/SSRF | Sinyal awal; validasi manual; tanpa payload destruktif |
| Intelligence | OSINT, dork review, fingerprint, referensi SearchSploit | Query ditinjau operator; tanpa exploit execution |
| Adapter | Nmap, Nuclei, Burp Suite, Amass, Subfinder, httpx | Kontrak planner dan normalizer; runner harus mematuhi policy |

Modul yang melakukan network I/O wajib memiliki timeout, rate limit, error boundary, audit event, dan mode preview. Temuan dengan fingerprint sama pada target dan template yang sama harus digabung sebelum ditampilkan.
