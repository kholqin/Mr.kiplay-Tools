# Instalasi Mr.Kiplay

Mr.Kiplay berjalan sebagai aplikasi web full-stack Node.js dengan database proyek. Jalur paling mudah untuk pengembangan adalah memasang Node.js LTS, mengkloning repository, memasang dependency, lalu menjalankan server lokal.

## Ubuntu, Debian, Kali, Arch, BlackArch, dan macOS

```bash
git clone https://github.com/kholqin/Mr.kiplay-Tools.git
cd Mr.kiplay-Tools
pnpm install
pnpm check
pnpm test -- --run
pnpm dev
```

Script bootstrap tersedia di `scripts/install/install.sh`. Script tersebut hanya menyiapkan dependency aplikasi dan tidak menjalankan Nmap, Nuclei, atau tool eksternal terhadap target.

## Termux

Gunakan Termux versi terbaru, pasang Node.js dan Git dari package manager Termux, kemudian jalankan perintah yang sama dari direktori repository. Untuk lingkungan produksi, gunakan server Linux yang memiliki database dan storage terproteksi.

## Windows

Gunakan PowerShell dan Node.js LTS. Jalankan `scripts/install/install.ps1`, lalu `pnpm check`, `pnpm test -- --run`, dan `pnpm dev`. Integrasi CLI eksternal bersifat opsional dan harus dipasang terpisah sesuai dokumentasi vendor masing-masing.

## Integrasi scanner

Nmap, Nuclei, Burp Suite, Amass, Subfinder, httpx, dan SearchSploit tidak dianggap terpasang otomatis oleh platform. Adapter harus memeriksa binary, versi, konfigurasi, scope, timeout, rate limit, dan mode preview sebelum mengeksekusi tool. Gunakan hanya pada target yang diizinkan.
