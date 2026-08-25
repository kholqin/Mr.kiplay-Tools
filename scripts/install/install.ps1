param(
  [switch]$Help,
  [switch]$TestLog
)

$ErrorActionPreference = "Stop"
if ($Help) {
  Write-Output "Penggunaan: .\scripts\install\install.ps1 [-Help] [-TestLog]"
  Write-Output "  -Help     Menampilkan bantuan tanpa memasang dependency atau menjalankan pemeriksaan."
  Write-Output "  -TestLog  Menguji pembuatan dan sanitasi log tanpa memasang dependency."
  exit 0
}

$isCi = $env:CI -eq "true"
$scriptRoot = Split-Path -Parent $MyInvocation.MyCommand.Definition
$projectRoot = (Resolve-Path (Join-Path $scriptRoot "../..")).Path
$logDirectory = Join-Path $projectRoot ".mrkiplay/logs"
$script:LogPath = Join-Path $logDirectory "install.log"

function Protect-LogMessage {
  param([Parameter(Mandatory = $true)][string]$Message)

  return ($Message `
    -replace '(?i)Bearer\s+[^\s,;]+', 'Bearer [REDACTED]' `
    -replace '(?i)(password|token|secret|api[_-]?key|authorization)\s*[:=]\s*[^\s,;]+', '$1=[REDACTED]')
}

function Write-InstallLog {
  param(
    [Parameter(Mandatory = $true)][ValidateSet("INFO", "WARN", "ERROR")][string]$Level,
    [Parameter(Mandatory = $true)][string]$Message
  )

  try {
    if (-not (Test-Path $logDirectory)) {
      New-Item -ItemType Directory -Force -Path $logDirectory | Out-Null
    }
    if (Test-Path $script:LogPath) {
      $logSize = (Get-Item $script:LogPath).Length
      if ($logSize -gt 524288) {
        Move-Item -Force $script:LogPath "$script:LogPath.1"
      }
    }
    $timestamp = Get-Date -Format "o"
    Add-Content -Path $script:LogPath -Encoding utf8 -Value "[$timestamp] [$Level] $(Protect-LogMessage -Message $Message)"
  } catch {
    Write-Warning "Log lokal tidak dapat ditulis: $($_.Exception.Message)"
  }
}

function Update-InstallProgress {
  param(
    [Parameter(Mandatory = $true)][string]$Status,
    [Parameter(Mandatory = $true)][int]$Percent
  )

  Write-InstallLog -Level "INFO" -Message "[$Percent%] $Status"
  if ($isCi) {
    Write-Host "[CI] [$Percent%] $Status"
  } else {
    Write-Progress -Activity "Mr.Kiplay bootstrap installer" -Status $Status -PercentComplete $Percent
  }
}

if ($TestLog) {
  $testLogPath = Join-Path $logDirectory "install-test.log"
  $script:LogPath = $testLogPath
  if (Test-Path $testLogPath) {
    Remove-Item -Force $testLogPath
  }
  Write-InstallLog -Level "INFO" -Message "token=abc Authorization: Bearer xyz"
  Write-InstallLog -Level "ERROR" -Message "Simulasi kegagalan; secret=demo"
  $testContent = Get-Content -Raw -Path $testLogPath
  if ($testContent -match "abc|xyz|demo" -or $testContent -notmatch "\[REDACTED\]") {
    throw "Sanitasi log gagal."
  }
  Remove-Item -Force $testLogPath
  Write-Output "Log self-test lulus: pembuatan dan sanitasi terverifikasi."
  exit 0
}

function Invoke-PnpmStep {
  param(
    [Parameter(Mandatory = $true)][string]$Label,
    [Parameter(Mandatory = $true)][string[]]$Arguments
  )

  Write-InstallLog -Level "INFO" -Message "Mulai: $Label"
  & pnpm @Arguments
  if ($LASTEXITCODE -ne 0) {
    Write-InstallLog -Level "ERROR" -Message "$Label gagal dengan exit code $LASTEXITCODE"
    throw "$Label gagal dengan exit code $LASTEXITCODE. Lihat log: $script:LogPath"
  }
  Write-InstallLog -Level "INFO" -Message "Selesai: $Label"
}

try {
  Set-Location $projectRoot
  if (-not (Test-Path (Join-Path $projectRoot "package.json"))) {
    throw "package.json tidak ditemukan pada root project: $projectRoot"
  }

  Write-InstallLog -Level "INFO" -Message "Memulai installer dari $projectRoot"
  Write-Host "Mr.Kiplay bootstrap installer"
  Write-Host "Script ini hanya memasang dependency aplikasi; tidak menjalankan scanner."
  Write-Host "Log instalasi: $script:LogPath"

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
  Invoke-PnpmStep -Label "Instalasi dependency" -Arguments @("install", "--frozen-lockfile")

  Update-InstallProgress -Status "Memeriksa TypeScript" -Percent 75
  Invoke-PnpmStep -Label "Pemeriksaan TypeScript" -Arguments @("check")

  Update-InstallProgress -Status "Menjalankan test" -Percent 90
  Invoke-PnpmStep -Label "Test suite" -Arguments @("test", "--", "--run")

  if (-not $isCi) {
    Write-Progress -Activity "Mr.Kiplay bootstrap installer" -Status "Selesai" -PercentComplete 100 -Completed
  } else {
    Write-Host "[CI] [100%] Selesai"
  }
  Write-InstallLog -Level "INFO" -Message "Bootstrap selesai"
  Write-Host "Bootstrap selesai. Jalankan pnpm dev untuk membuka dashboard lokal."
} catch {
  Write-InstallLog -Level "ERROR" -Message $_.Exception.Message
  Write-Error "Bootstrap gagal. Lihat log instalasi: $script:LogPath"
  throw
}
