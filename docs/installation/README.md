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

## Diagnostik instalasi

Dari root repository, jalankan `pnpm diagnose` untuk memeriksa versi Node.js, ketersediaan pnpm, manifest project, lockfile, serta keberadaan installer Unix dan PowerShell. Perintah ini tidak mengirim request jaringan dan tidak menjalankan scanner.

Installer Unix sekarang menemukan root project berdasarkan lokasi `install.sh`, sehingga dapat dipanggil dari direktori lain. Pada Termux, gunakan `pkg install -y git nodejs-lts`, aktifkan Corepack, lalu jalankan `bash scripts/install/install.sh`. Pada Kali Linux, pasang `git`, `nodejs`, dan `npm` melalui apt atau gunakan Node.js LTS resmi, aktifkan Corepack, lalu jalankan script yang sama.

Jika muncul `ERR_PNPM_NO_PKG_MANIFEST`, periksa `pwd` dan pastikan `ls package.json` berhasil. Jika gagal, Anda berada di folder clone yang salah atau clone lama; buat clone baru dari `https://github.com/kholqin/Mr.kiplay-Tools.git`, masuk ke folder tersebut, lalu jalankan `pnpm diagnose`.

## Log installer Windows

Installer PowerShell menyimpan log teks lokal di `.mrkiplay/logs/install.log` pada root project. Log berisi timestamp, tahap progress, status command, dan pesan error yang sudah disanitasi; nilai dengan nama `password`, `token`, `secret`, `api-key`, atau `authorization` diganti menjadi `[REDACTED]`. Ukuran log dibatasi sekitar 512 KiB dan file lama dipindahkan ke `install.log.1`. Direktori `.mrkiplay/` diabaikan Git dan tidak boleh dibagikan tanpa ditinjau.

Jika instalasi gagal, jalankan ulang `pnpm diagnose`, buka log tersebut, dan sertakan hanya bagian error yang sudah menghapus path pribadi, token, cookie, serta credential. Installer Unix juga menemukan root project berdasarkan lokasi script dan menggunakan lockfile terkunci.
