import { AlertTriangle, CheckCircle2, Loader2, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";

export function safeOsintErrorMessage(error: unknown): string {
  const raw = error instanceof Error ? error.message : String(error ?? "");
  const normalized = raw.toLowerCase();
  if (normalized.includes("authorization") || normalized.includes("forbidden") || normalized.includes("scope")) return "Aktivitas ditolak karena otorisasi atau target belum sesuai scope.";
  if (normalized.includes("timeout") || normalized.includes("timed out")) return "Permintaan melewati batas waktu. Coba lagi dengan target atau provider yang lebih responsif.";
  if (normalized.includes("rate") || normalized.includes("too many")) return "Permintaan sedang dibatasi agar aman. Tunggu sebentar lalu coba lagi.";
  if (normalized.includes("network") || normalized.includes("fetch") || normalized.includes("dns")) return "Sumber metadata tidak dapat dijangkau. Periksa koneksi, resolver, dan konfigurasi provider.";
  return "Modul belum dapat menyelesaikan permintaan. Periksa konfigurasi lalu coba lagi.";
}

export function OsintLoading({ label = "Memuat modul OSINT…", detail = "Menyiapkan metadata tersanitasi." }: { label?: string; detail?: string }) {
  return <div role="status" aria-live="polite" className="rounded-xl border border-red-300/15 bg-red-500/[0.06] p-4"><div className="flex items-center gap-3"><div className="relative flex h-8 w-8 items-center justify-center"><span className="absolute inset-0 rounded-full border border-red-300/25 motion-safe:animate-ping" /><Loader2 className="relative h-4 w-4 animate-spin text-red-200 motion-reduce:animate-none" /></div><div><p className="text-sm font-medium text-zinc-200">{label}</p><p className="mt-1 text-xs text-zinc-500">{detail}</p></div></div><div className="mt-3 h-1.5 overflow-hidden rounded-full bg-white/10"><div className="h-full w-2/5 rounded-full bg-gradient-to-r from-red-500 via-rose-300 to-red-500 motion-safe:animate-[osint-progress_1.4s_ease-in-out_infinite] motion-reduce:w-1/2" /></div></div>;
}

export function OsintError({ error, onRetry, title = "Modul belum siap" }: { error: unknown; onRetry?: () => void; title?: string }) {
  return <div role="alert" aria-live="assertive" className="rounded-xl border border-amber-300/25 bg-amber-500/[0.08] p-4"><div className="flex items-start gap-3"><AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-amber-200" /><div className="min-w-0"><p className="text-sm font-medium text-amber-100">{title}</p><p className="mt-1 text-xs leading-5 text-amber-100/70">{safeOsintErrorMessage(error)}</p>{onRetry && <Button type="button" variant="outline" size="sm" onClick={onRetry} className="mt-3 border-amber-200/25 bg-transparent text-amber-100 hover:bg-amber-300/10"><RefreshCw className="mr-2 h-3.5 w-3.5" /> Coba lagi</Button>}</div></div></div>;
}

export function OsintReady({ text = "Siap dipreview dengan scope dan audit trail." }: { text?: string }) {
  return <div className="flex items-center gap-2 text-xs text-emerald-300"><CheckCircle2 className="h-4 w-4" /> {text}</div>;
}

export function OsintOperationStatus({ pendingLabel, error, onRetry }: { pendingLabel?: string; error?: unknown; onRetry?: () => void }) {
  if (error) return <OsintError error={error} onRetry={onRetry} title="Operasi OSINT belum selesai" />;
  if (pendingLabel) return <OsintLoading label={`${pendingLabel}…`} detail="Memeriksa scope, mengambil metadata terbatas, dan mencatat audit." />;
  return null;
}
