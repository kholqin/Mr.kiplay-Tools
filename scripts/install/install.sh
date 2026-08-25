#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd -- "$SCRIPT_DIR/../.." && pwd)"
cd "$PROJECT_ROOT"

if [[ ! -f package.json ]]; then
  printf '%s\n' "package.json tidak ditemukan pada root project: $PROJECT_ROOT" >&2
  exit 1
fi

if [[ -n "${TERMUX_VERSION:-}" || "${PREFIX:-}" == *"com.termux"* ]]; then
  ENVIRONMENT='Termux'
elif [[ -r /etc/os-release ]] && grep -qiE '^ID=(kali|blackarch)' /etc/os-release; then
  ENVIRONMENT='Kali/BlackArch'
else
  ENVIRONMENT="${OSTYPE:-Unix}"
fi

printf '%s\n' 'Mr.Kiplay bootstrap installer'
printf '%s\n' "Environment: $ENVIRONMENT"
printf '%s\n' 'Script ini hanya memasang dependency aplikasi; tidak menjalankan scanner.'

if ! command -v node >/dev/null 2>&1; then
  printf '%s\n' 'Node.js tidak ditemukan. Pasang Node.js LTS melalui package manager distro atau nodejs.org.' >&2
  exit 1
fi

node_major="$(node -p 'process.versions.node.split(".")[0]')"
if [ "$node_major" -lt 20 ]; then
  printf '%s\n' "Node.js LTS diperlukan (terdeteksi v$(node -v))." >&2
  exit 1
fi

if ! command -v pnpm >/dev/null 2>&1; then
  if command -v corepack >/dev/null 2>&1; then
    corepack enable
    corepack prepare pnpm@10.4.1 --activate
  else
    printf '%s\n' 'pnpm tidak ditemukan. Jalankan: corepack enable && corepack prepare pnpm@10.4.1 --activate' >&2
    exit 1
  fi
fi

pnpm install --frozen-lockfile
pnpm diagnose
pnpm check
pnpm test -- --run
printf '%s\n' 'Bootstrap selesai. Jalankan pnpm dev untuk membuka dashboard lokal.'
