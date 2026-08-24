# Instalasi Mr.Kiplay

Mr.Kiplay berjalan sebagai aplikasi web full-stack Node.js dengan database proyek. Jalur paling mudah untuk pengembangan adalah memasang Node.js LTS, mengkloning repository, memasang dependency, lalu menjalankan server lokal.

## Ubuntu dan Debian

```bash
sudo apt update
sudo apt install -y git curl ca-certificates
curl -fsSL https://get.pnpm.io/install.sh | sh -
git clone https://github.com/kholqin/Mr.kiplay-Tools.git
cd Mr.kiplay-Tools
pnpm install && pnpm check && pnpm test -- --run && pnpm dev
```

## Kali Linux

Gunakan Node.js LTS dan `pnpm` dari environment resmi. Jalankan `scripts/install/install.sh`, lalu verifikasi dengan `pnpm check` dan `pnpm test -- --run`. Jangan memasang atau menjalankan scanner eksternal otomatis tanpa scope dan otorisasi.

## Arch Linux dan BlackArch

```bash
sudo pacman -S --needed git nodejs npm
corepack enable
corepack prepare pnpm@10.4.1 --activate
git clone https://github.com/kholqin/Mr.kiplay-Tools.git
cd Mr.kiplay-Tools
pnpm install && pnpm check && pnpm test -- --run
```

## macOS

Pasang Homebrew, Node.js LTS, dan Git. Setelah itu jalankan `git clone`, `pnpm install`, `pnpm check`, `pnpm test -- --run`, lalu `pnpm dev`. Untuk Apple Silicon, gunakan terminal native atau pastikan seluruh binary eksternal memiliki arsitektur yang sesuai.

Script bootstrap `scripts/install/install.sh` hanya menyiapkan dependency aplikasi dan tidak menjalankan Nmap, Nuclei, atau tool eksternal terhadap target.

## Termux

Gunakan Termux versi terbaru, lalu jalankan `pkg update && pkg install git nodejs-lts`. Kloning repository, jalankan `corepack enable`, `pnpm install`, `pnpm check`, dan `pnpm test -- --run`. Gunakan Termux untuk dashboard atau preview ringan; runner scanner produksi sebaiknya ditempatkan pada host terisolasi. Untuk lingkungan produksi, gunakan server Linux yang memiliki database dan storage terproteksi.

## Windows

Gunakan PowerShell 7 dan Node.js LTS. Jalankan `Set-ExecutionPolicy -Scope Process Bypass`, kemudian `scripts/install/install.ps1`, `pnpm check`, `pnpm test -- --run`, dan `pnpm dev`. Integrasi CLI eksternal bersifat opsional dan harus dipasang terpisah sesuai dokumentasi vendor masing-masing.

## Integrasi scanner

Nmap, Nuclei, Burp Suite, Amass, Subfinder, httpx, dan SearchSploit tidak dianggap terpasang otomatis oleh platform. Adapter harus memeriksa binary, versi, konfigurasi, scope, timeout, rate limit, dan mode preview sebelum mengeksekusi tool. Gunakan hanya pada target yang diizinkan.

## Catatan bootstrap lintas platform

Installer resmi project tersedia pada `scripts/install/install.sh` untuk lingkungan Unix dan `scripts/install/install.ps1` untuk Windows. Keduanya hanya memasang dependency aplikasi, menjalankan pemeriksaan TypeScript dan test, serta tidak memasang atau menjalankan scanner terhadap target.

Untuk setup baru, aktifkan pnpm melalui Corepack sebelum menjalankan installer:

```bash
corepack enable
corepack prepare pnpm@10.4.1 --activate
bash scripts/install/install.sh
```

Di Windows gunakan PowerShell:

```powershell
corepack enable
corepack prepare pnpm@10.4.1 --activate
.\scripts\install\install.ps1
```

Setelah bootstrap, verifikasi dengan `pnpm check`, `pnpm test -- --run`, dan `git diff --check`. Integrasi Nmap, Nuclei, Burp Suite, Amass, Subfinder, httpx, dan SearchSploit bersifat opsional serta harus dikonfigurasi secara terpisah oleh operator berwenang.

### Umpan balik visual installer Windows

Installer PowerShell menampilkan progress bar per tahap ketika dijalankan di terminal interaktif, mencakup pemeriksaan Node.js, Corepack/pnpm, instalasi dependency, pemeriksaan TypeScript, dan test. Pada lingkungan CI, progress bar diganti marker teks seperti `[CI] [55%]` agar log tetap mudah dibaca dan tidak bergantung pada terminal interaktif. Gunakan `-Help` untuk melihat penggunaan tanpa memasang dependency atau menjalankan pemeriksaan.
