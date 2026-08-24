param(
  [switch]$Help
)

$ErrorActionPreference = "Stop"
if ($Help) {
  Write-Output "Penggunaan: .\scripts\install\install.ps1 [-Help]"
  Write-Output "  -Help  Menampilkan bantuan tanpa memasang dependency atau menjalankan pemeriksaan."
  exit 0
}

Write-Host "Mr.Kiplay bootstrap installer"
Write-Host "Script ini hanya memasang dependency aplikasi; tidak menjalankan scanner."

if (-not (Get-Command node -ErrorAction SilentlyContinue)) {
  throw "Node.js tidak ditemukan. Pasang Node.js LTS terlebih dahulu."
}
$nodeMajor = [int](node -p "process.versions.node.split('.')[0]")
if ($nodeMajor -lt 20) {
  throw "Node.js LTS diperlukan (versi utama terdeteksi: $nodeMajor)."
}
if (-not (Get-Command pnpm -ErrorAction SilentlyContinue)) {
  if (Get-Command corepack -ErrorAction SilentlyContinue) {
    corepack enable
    corepack prepare pnpm@10.4.1 --activate
  } else {
    throw "pnpm tidak ditemukan. Aktifkan Corepack atau pasang pnpm terlebih dahulu."
  }
}

pnpm install
pnpm check
pnpm test -- --run
Write-Host "Bootstrap selesai. Jalankan pnpm dev untuk membuka dashboard lokal."
