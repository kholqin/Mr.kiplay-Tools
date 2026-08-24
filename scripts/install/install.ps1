$ErrorActionPreference = "Stop"
Write-Host "Mr.Kiplay bootstrap installer"
Write-Host "Script ini hanya memasang dependency aplikasi; tidak menjalankan scanner."

if (-not (Get-Command node -ErrorAction SilentlyContinue)) {
  throw "Node.js tidak ditemukan. Pasang Node.js LTS terlebih dahulu."
}
if (-not (Get-Command pnpm -ErrorAction SilentlyContinue)) {
  throw "pnpm tidak ditemukan. Aktifkan Corepack atau pasang pnpm terlebih dahulu."
}

pnpm install
pnpm check
pnpm test -- --run
Write-Host "Bootstrap selesai. Jalankan pnpm dev untuk membuka dashboard lokal."
