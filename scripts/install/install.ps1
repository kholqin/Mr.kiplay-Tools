param(
  [switch]$Help
)

$ErrorActionPreference = "Stop"
if ($Help) {
  Write-Output "Penggunaan: .\scripts\install\install.ps1 [-Help]"
  Write-Output "  -Help  Menampilkan bantuan tanpa memasang dependency atau menjalankan pemeriksaan."
  exit 0
}

$isCi = $env:CI -eq "true"
function Update-InstallProgress {
  param(
    [Parameter(Mandatory = $true)][string]$Status,
    [Parameter(Mandatory = $true)][int]$Percent
  )

  if ($isCi) {
    Write-Host "[CI] [$Percent%] $Status"
  } else {
    Write-Progress -Activity "Mr.Kiplay bootstrap installer" -Status $Status -PercentComplete $Percent
  }
}

Write-Host "Mr.Kiplay bootstrap installer"
Write-Host "Script ini hanya memasang dependency aplikasi; tidak menjalankan scanner."

Update-InstallProgress -Status "Memeriksa Node.js LTS" -Percent 10
if (-not (Get-Command node -ErrorAction SilentlyContinue)) {
  throw "Node.js tidak ditemukan. Pasang Node.js LTS terlebih dahulu."
}
$nodeMajor = [int](node -p "process.versions.node.split('.')[0]")
if ($nodeMajor -lt 20) {
  throw "Node.js LTS diperlukan (versi utama terdeteksi: $nodeMajor)."
}

Update-InstallProgress -Status "Memeriksa pnpm dan Corepack" -Percent 25
if (-not (Get-Command pnpm -ErrorAction SilentlyContinue)) {
  if (Get-Command corepack -ErrorAction SilentlyContinue) {
    corepack enable
    corepack prepare pnpm@10.4.1 --activate
  } else {
    throw "pnpm tidak ditemukan. Aktifkan Corepack atau pasang pnpm terlebih dahulu."
  }
}

Update-InstallProgress -Status "Memasang dependency project" -Percent 55
pnpm install

Update-InstallProgress -Status "Memeriksa TypeScript" -Percent 75
pnpm check

Update-InstallProgress -Status "Menjalankan test" -Percent 90
pnpm test -- --run

if (-not $isCi) {
  Write-Progress -Activity "Mr.Kiplay bootstrap installer" -Status "Selesai" -PercentComplete 100 -Completed
} else {
  Write-Host "[CI] [100%] Selesai"
}
Write-Host "Bootstrap selesai. Jalankan pnpm dev untuk membuka dashboard lokal."
