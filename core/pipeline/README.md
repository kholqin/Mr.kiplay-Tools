# Pipeline Scanning

Direktori ini berisi konfigurasi dan kontrak orkestrasi pipeline scanning. Konfigurasi awal pada [`default.yaml`](default.yaml) mendefinisikan alur **Nmap service discovery** yang dilanjutkan dengan **Nuclei baseline checks**.

## Urutan pipeline

| Tahap | Input | Output | Tujuan |
| --- | --- | --- | --- |
| `nmap-discovery` | `scope.allowed_targets` | XML, teks, dan daftar service web | Menemukan service terbuka dan metadata versi secara terbatas |
| `nuclei-baseline` | `nmap-discovery.web_services` | `findings.jsonl` | Memeriksa template baseline yang telah disetujui pada endpoint web |

Nuclei hanya boleh menerima daftar endpoint yang dihasilkan oleh adapter Nmap atau input yang telah melewati validasi scope. Pipeline bersifat sequential dan berhenti apabila stage sebelumnya gagal, sehingga hasil tahap berikutnya tidak dibuat dari input yang tidak tervalidasi.

## Guardrail default

Konfigurasi mengharuskan bukti otorisasi, menolak scope kosong, menerapkan daftar target yang diizinkan, dan menggunakan mode `dry_run: true` pada scaffold awal. Private network, cloud metadata endpoint, dan alamat loopback dikecualikan secara default. Sebelum aktivasi, pengguna wajib mengganti `allowed_targets` dengan aset yang benar-benar berada dalam scope dan menyediakan `config/authorization.json` sesuai adapter yang akan dibuat.

Nmap menggunakan service discovery terbatas dengan top 100 TCP ports, `--version-light`, timeout host, retry rendah, dan tanpa UDP scan, OS detection, atau NSE intrusive scripts. Nuclei dibatasi pada rate limit dan concurrency rendah, menonaktifkan OOB callback melalui `-no-interactsh`, serta mengecualikan template bertag `dos`, `fuzz`, `brute-force`, dan `intrusive`.

## Kontrak adapter

Adapter pada `integrations/nmap/` dan `integrations/nuclei/` nantinya perlu memenuhi kontrak berikut:

```text
validate(config, scope) -> validated_config
run(validated_config, input) -> stage_result
normalize(stage_result) -> normalized_artifacts
```

`validate` harus menolak target di luar scope dan command argument yang tidak diizinkan. `run` harus menerapkan timeout, menangkap exit code, dan menyimpan stdout/stderr secara terpisah. `normalize` harus menghasilkan format internal yang stabil serta tidak menyimpan secrets secara mentah.

## Aktivasi bertahap

Sebelum menjalankan scan aktif, lakukan validasi dengan `dry_run: true`, periksa command yang akan dieksekusi, dan uji hanya pada lab atau aset yang secara eksplisit diizinkan. Setelah adapter dan audit logging tersedia, `dry_run` dapat diubah oleh operator yang berwenang melalui proses review konfigurasi.

> File ini adalah kontrak konfigurasi awal, bukan runner. Implementasi executable harus ditambahkan setelah validasi scope, evidence otorisasi, logging, dan test fixture tersedia.
