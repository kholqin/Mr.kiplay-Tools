# Panduan Pengembangan Adapter

Adapter lintas bahasa berkomunikasi dengan core melalui JSON envelope. Core mengirim `workspaceId`, target yang telah divalidasi, mode `preview|safe`, rate limit, timeout, dan daftar kemampuan. Adapter mengembalikan `stage`, `status`, `findings`, `evidence`, serta `manualValidationRequired`.

## Kontrak minimum

```json
{
  "stage": "nmap-discovery",
  "status": "planned",
  "manualValidationRequired": true,
  "findings": [],
  "evidence": []
}
```

Python dan TypeScript dapat memakai schema JSON secara langsung. C++ dan C# sebaiknya menyediakan executable adapter yang menerima JSON melalui stdin dan menulis JSONL ke stdout. Tidak ada adapter yang boleh mengubah scope, mematikan audit log, menyimpan credential, atau menjalankan eksploitasi otomatis.

Pengujian adapter wajib mencakup scope kosong, target sensitif, timeout, rate limit, mode preview, malformed output, dan sanitasi evidence. Gunakan fixture sintetis dan domain dokumentasi; jangan gunakan target nyata.
