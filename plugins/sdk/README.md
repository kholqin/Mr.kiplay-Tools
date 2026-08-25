# Mr.Kiplay Plugin SDK

Plugin Mr.Kiplay adalah modul yang memperkaya normalisasi atau reporting, bukan jalur untuk melewati authorization gate. Plugin wajib deklaratif, memiliki nama/versi, menjelaskan kemampuan, dan menerima `ValidatedScope` dari core.

```ts
export type ValidatedScope = {
  workspaceId: number;
  targets: string[];
  mode: "preview" | "safe";
  rateLimit: number;
  timeoutSeconds: number;
};

export type MrkPlugin = {
  id: string;
  version: string;
  capabilities: string[];
  plan(scope: ValidatedScope): { actions: string[]; manualValidationRequired: true };
};
```

Implementasi Python, JavaScript/TypeScript, C++, dan C# dapat memakai kontrak yang sama melalui JSON envelope. Plugin tidak boleh menerima credentials mentah, mengubah scope, menonaktifkan logging, atau memicu eksploitasi.

## Adapter polyglot

Kontrak plugin menggunakan JSON envelope sederhana. Contoh tersedia untuk JavaScript/TypeScript, Python, C++, C#, Java, Go, PHP, dan Laravel. Adapter tidak boleh memulai request jaringan sendiri; host Mr.Kiplay yang memeriksa otorisasi, allowlist, resolusi publik, timeout, rate limit, cancellation, dan audit trail.

Runtime web utama tetap TypeScript/Node.js agar deployment tidak memaksa pemasangan Java, Go, PHP, Laravel, C++, atau .NET. Runtime tambahan hanya dipasang saat operator memilih adapter terkait pada lingkungan terisolasi.
