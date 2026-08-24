#!/usr/bin/env bash
set -euo pipefail

printf '%s\n' 'Mr.Kiplay bootstrap installer'
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

pnpm install
pnpm check
pnpm test -- --run
printf '%s\n' 'Bootstrap selesai. Jalankan pnpm dev untuk membuka dashboard lokal.'
