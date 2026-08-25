import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { trpc } from "@/lib/trpc";
import { useAnimationPreference } from "@/hooks/useAnimationPreference";
import { isTerminalPipelineStatus, type PipelineProgressSnapshot } from "../../../shared/pipelineProgress";
import { Activity, AlertTriangle, CheckCircle2, Circle, Clock3, PauseCircle, Play, RefreshCw, RotateCcw, ShieldCheck, Sparkles, XCircle } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { toast } from "sonner";

const statusLabels: Record<PipelineProgressSnapshot["status"], string> = {
  queued: "Dalam antrean",
  running: "Berjalan",
  completed: "Selesai",
  failed: "Gagal",
  cancelled: "Dibatalkan",
};

function statusClass(status: PipelineProgressSnapshot["status"]) {
  if (status === "completed") return "border-emerald-300/30 bg-emerald-400/10 text-emerald-200";
  if (status === "failed") return "border-red-300/30 bg-red-400/10 text-red-200";
  if (status === "cancelled") return "border-amber-300/30 bg-amber-400/10 text-amber-200";
  return "border-sky-300/30 bg-sky-400/10 text-sky-200";
}

function stageIcon(status: PipelineProgressSnapshot["stages"][number]["status"]) {
  if (status === "completed" || status === "skipped") return <CheckCircle2 className="h-4 w-4 text-emerald-300" />;
  if (status === "running") return <Activity className="h-4 w-4 animate-pulse text-sky-300" />;
  if (status === "failed") return <XCircle className="h-4 w-4 text-red-300" />;
  if (status === "cancelled") return <PauseCircle className="h-4 w-4 text-amber-300" />;
  return <Circle className="h-4 w-4 text-zinc-600" />;
}

function formatTime(value?: string) {
  if (!value) return "—";
  return new Date(value).toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit", second: "2-digit" });
}

export default function Pipeline() {
  const [workspaceId, setWorkspaceId] = useState<number | null>(null);
  const [targetId, setTargetId] = useState<number | null>(null);
  const [jobId, setJobId] = useState<string | null>(null);
  const [mode, setMode] = useState<"preview" | "active">("preview");
  const { intensity } = useAnimationPreference();
  const [changedStageId, setChangedStageId] = useState<string | null>(null);
  const previousStageStatuses = useRef<Record<string, string>>({});
  const workspaces = trpc.assessment.workspaces.useQuery();
  const targets = trpc.assessment.targets.useQuery({ workspaceId: workspaceId ?? 0 }, { enabled: Boolean(workspaceId) });
  const history = trpc.assessment.pipelineHistory.useQuery({ workspaceId: workspaceId ?? 0 }, { enabled: Boolean(workspaceId), refetchInterval: 3000, retry: 1 });
  const start = trpc.assessment.startPipeline.useMutation({
    onSuccess: (snapshot) => {
      setJobId(snapshot.jobId);
      toast.success(mode === "preview" ? "Pratinjau pipeline dimulai." : "Pipeline aman masuk antrean.");
    },
    onError: (error) => toast.error(error.message),
  });
  const progress = trpc.assessment.pipelineProgress.useQuery({ workspaceId: workspaceId ?? 0, jobId: jobId ?? "00000000-0000-0000-0000-000000000000" }, {
    enabled: Boolean(workspaceId && jobId),
    refetchInterval: 1500,
    retry: 1,
  });
  const cancel = trpc.assessment.cancelPipeline.useMutation({
    onSuccess: () => {
      void progress.refetch();
      toast.success("Permintaan pembatalan diterima.");
    },
    onError: (error) => toast.error(error.message),
  });

  useEffect(() => {
    if (!workspaceId && workspaces.data?.[0]) setWorkspaceId(workspaces.data[0].id);
  }, [workspaceId, workspaces.data]);

  useEffect(() => {
    if (!targetId && targets.data?.[0]) setTargetId(targets.data[0].id);
  }, [targetId, targets.data]);

  useEffect(() => {
    if (!jobId && history.data?.[0]) setJobId(history.data[0].jobId);
  }, [history.data, jobId]);

  const snapshot = progress.data ?? history.data?.find((item) => item.jobId === jobId) ?? null;
  const connectionState = progress.error ? "error" : progress.isFetching ? "syncing" : snapshot && Date.now() - new Date(snapshot.updatedAt).getTime() < 8_000 ? "connected" : "stale";
  const connectionLabel = connectionState === "error" ? "Perlu sambung ulang" : connectionState === "syncing" ? "Menyinkronkan…" : connectionState === "stale" ? "Data lama" : "Terhubung";
  const selectedTarget = targets.data?.find((item) => item.id === targetId);
  const activeJob = snapshot && !isTerminalPipelineStatus(snapshot.status);
  const canStart = Boolean(workspaceId && targetId && !activeJob && !start.isPending);
  const progressTone = snapshot?.status === "failed" ? "bg-red-500" : snapshot?.status === "completed" ? "bg-emerald-500" : "bg-red-500";
  const recentJobs = useMemo(() => history.data?.slice(0, 6) ?? [], [history.data]);

  useEffect(() => {
    if (!snapshot?.stages?.length) return;
    const nextStatuses = Object.fromEntries(snapshot.stages.map((item) => [item.id, item.status]));
    const previous = previousStageStatuses.current;
    const changed = Object.keys(nextStatuses).find((id) => previous[id] && previous[id] !== nextStatuses[id]);
    previousStageStatuses.current = nextStatuses;
    if (!changed) return;
    setChangedStageId(changed);
    const timer = window.setTimeout(() => setChangedStageId(null), 700);
    return () => window.clearTimeout(timer);
  }, [snapshot?.updatedAt, snapshot?.stages]);

  const startPipeline = (nextMode: "preview" | "active") => {
    if (!workspaceId || !targetId) return toast.error("Pilih ruang kerja dan target allowlist terlebih dahulu.");
    if (activeJob) return toast.error("Selesaikan atau batalkan pipeline aktif terlebih dahulu.");
    setMode(nextMode);
    start.mutate({ workspaceId, targetId, mode: nextMode });
  };

  return <div className={`pipeline-animation-${intensity} space-y-6 text-zinc-100`}>
    <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
      <div>
        <p className="text-xs uppercase tracking-[0.25em] text-red-200">Pipeline terpantau</p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight">Pantau URL atau IP dari satu layar.</h1>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-zinc-500">Status tahap diperbarui otomatis setiap 1,5 detik. Kemajuan berasal dari lifecycle job server; bukan animasi dekoratif.</p>
      </div>
      <div className="flex flex-wrap items-center gap-2">
        <Badge variant="outline" className={`gap-2 ${connectionState === "connected" ? "border-emerald-300/30 text-emerald-200" : "border-amber-300/30 text-amber-200"}`}><span className={`h-1.5 w-1.5 rounded-full ${connectionState === "connected" ? "bg-emerald-300" : "bg-amber-300"}`} /> {connectionLabel}</Badge>
        <Button variant="outline" size="sm" onClick={() => { void history.refetch(); if (jobId) void progress.refetch(); }} className="border-white/10 bg-white/[0.03]"><RefreshCw className="mr-2 h-4 w-4" /> Segarkan</Button>
      </div>
    </div>

    <Card className="border-red-300/15 bg-gradient-to-br from-red-500/[0.12] via-black/20 to-white/[0.03]">
      <CardHeader><CardTitle className="flex items-center gap-2"><Sparkles className="h-5 w-5 text-red-200" /> Mulai alur terkontrol</CardTitle><p className="text-sm text-zinc-400">Prapemeriksaan, DNS, HTTP pasif, sertifikat TLS, OSINT publik terbatas, port eksplisit, lalu finalisasi.</p></CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-3 lg:grid-cols-[1fr_1fr_auto]">
          <div><p className="text-xs text-zinc-500">Ruang kerja</p><Select value={workspaceId ? String(workspaceId) : undefined} onValueChange={(value) => { setWorkspaceId(Number(value)); setTargetId(null); setJobId(null); }}><SelectTrigger className="mt-2 border-white/10 bg-black/20"><SelectValue placeholder="Pilih ruang kerja" /></SelectTrigger><SelectContent>{workspaces.data?.map((item) => <SelectItem key={item.id} value={String(item.id)}>{item.name}</SelectItem>)}</SelectContent></Select></div>
          <div><p className="text-xs text-zinc-500">Target dalam allowlist</p><Select value={targetId ? String(targetId) : undefined} onValueChange={(value) => setTargetId(Number(value))}><SelectTrigger className="mt-2 border-white/10 bg-black/20"><SelectValue placeholder="Pilih URL atau IP" /></SelectTrigger><SelectContent>{targets.data?.map((item) => <SelectItem key={item.id} value={String(item.id)}>{item.value}</SelectItem>)}</SelectContent></Select></div>
          <div className="flex items-end"><Button variant="outline" onClick={() => startPipeline("preview")} disabled={!canStart} className="w-full border-white/15 bg-white/[0.04] lg:w-auto"><ShieldCheck className="mr-2 h-4 w-4" /> Pratinjau aman</Button></div>
        </div>
        <div className="flex flex-col gap-3 rounded-xl border border-white/10 bg-black/20 p-4 sm:flex-row sm:items-center sm:justify-between">
          <div><p className="text-sm font-medium">Mode eksekusi</p><p className="mt-1 text-xs leading-5 text-zinc-500">Aktif hanya mengirim request metadata non-destruktif dan probe port terbatas ke target allowlist publik.</p></div>
          <Button onClick={() => startPipeline("active")} disabled={!canStart} className="bg-red-600 hover:bg-red-500"><Play className="mr-2 h-4 w-4" /> Jalankan terbatas</Button>
        </div>
        {!selectedTarget && <p className="text-xs text-amber-200">Tambahkan dan konfirmasi otorisasi workspace pada halaman Ruang kerja sebelum memulai.</p>}
      </CardContent>
    </Card>

    <div className="grid gap-6 xl:grid-cols-[minmax(0,1.35fr)_minmax(300px,0.65fr)]">
      <Card className="border-white/10 bg-white/[0.035]">
        <CardHeader className="gap-4"><div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between"><div><CardTitle className="flex items-center gap-2"><Activity className="h-5 w-5 text-red-200" /> Progres pipeline</CardTitle><p className="mt-1 text-sm text-zinc-500">{snapshot ? `${snapshot.target} · diperbarui ${formatTime(snapshot.updatedAt)}` : "Belum ada pipeline yang dipilih."}</p></div>{snapshot && <Badge variant="outline" className={statusClass(snapshot.status)}>{statusLabels[snapshot.status]}</Badge>}</div>{snapshot && <div className="space-y-2"><div className="flex items-end justify-between gap-3"><span className="text-sm text-zinc-400">{snapshot.message}</span><span className="text-2xl font-semibold text-white">{snapshot.percent}%</span></div><Progress value={snapshot.percent} className={`h-2 bg-white/10 ${progressTone}`} /></div>}</CardHeader>
        <CardContent className="space-y-3">{snapshot ? snapshot.stages.map((item, index) => <div key={item.id} className={`timeline-stage relative rounded-xl border p-3 transition-[background-color,border-color,box-shadow,transform] duration-300 ease-out ${changedStageId === item.id ? "timeline-stage-changed" : ""} ${item.status === "running" ? "border-sky-300/30 bg-sky-400/[0.07] shadow-[0_0_0_1px_rgba(125,211,252,0.08)]" : item.status === "failed" ? "border-red-300/30 bg-red-400/[0.06]" : "border-white/10 bg-black/10"}`}><div className="flex gap-3">{stageIcon(item.status)}<div className="min-w-0 flex-1"><div className="flex flex-wrap items-center justify-between gap-2"><p className="text-sm font-medium">{String(index + 1).padStart(2, "0")} / {item.label}</p><span className="text-[11px] text-zinc-600">{item.startedAt ? `${formatTime(item.startedAt)}${item.finishedAt ? ` → ${formatTime(item.finishedAt)}` : ""}` : "Menunggu"}</span></div><p className="mt-1 text-xs leading-5 text-zinc-500">{item.message ?? item.description}</p>{typeof item.resultCount === "number" && <p className="mt-1 text-[11px] text-emerald-300">{item.resultCount} ringkasan disimpan</p>}</div></div></div>) : <div className="rounded-xl border border-dashed border-white/10 p-8 text-center"><Clock3 className="mx-auto h-8 w-8 text-zinc-700" /><p className="mt-3 text-sm text-zinc-400">Mulai pratinjau atau pipeline terbatas untuk melihat progres di sini.</p><p className="mt-1 text-xs text-zinc-600">Pilih target yang sudah masuk allowlist.</p></div>}{snapshot?.error && <div className="flex gap-3 rounded-xl border border-red-300/20 bg-red-400/[0.06] p-3 text-sm text-red-200"><AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" /><span>{snapshot.error}</span></div>}<div className="flex flex-wrap justify-end gap-2 pt-2">{snapshot && !isTerminalPipelineStatus(snapshot.status) && <Button variant="outline" size="sm" onClick={() => workspaceId && cancel.mutate({ workspaceId, jobId: snapshot.jobId })} disabled={cancel.isPending} className="border-amber-300/20 text-amber-200 hover:bg-amber-400/10"><PauseCircle className="mr-2 h-4 w-4" /> {cancel.isPending ? "Membatalkan…" : "Batalkan"}</Button>}{progress.error && <Button variant="outline" size="sm" onClick={() => void progress.refetch()} className="border-red-300/20 text-red-200"><RotateCcw className="mr-2 h-4 w-4" /> Sambung ulang</Button>}</div></CardContent>
      </Card>

      <Card className="border-white/10 bg-white/[0.035]"><CardHeader><CardTitle className="flex items-center gap-2"><Clock3 className="h-5 w-5 text-amber-200" /> Riwayat pipeline</CardTitle><p className="text-sm text-zinc-500">Job terbaru workspace ini. Pilih untuk memantau kembali.</p></CardHeader><CardContent className="space-y-2">{recentJobs.length ? recentJobs.map((item) => <button key={item.jobId} type="button" onClick={() => setJobId(item.jobId)} className={`w-full rounded-xl border p-3 text-left transition-colors ${item.jobId === jobId ? "border-red-300/30 bg-red-400/[0.08]" : "border-white/10 bg-black/10 hover:border-white/20"}`}><div className="flex items-start justify-between gap-3"><div className="min-w-0"><p className="truncate text-sm font-medium text-zinc-200">{item.target}</p><p className="mt-1 text-[11px] text-zinc-600">{item.mode === "preview" ? "Pratinjau" : "Aktif terbatas"} · {formatTime(item.createdAt)}</p></div><span className="shrink-0 text-xs text-zinc-500">{item.percent}%</span></div><div className="mt-2 h-1 overflow-hidden rounded-full bg-white/10"><div className="h-full rounded-full bg-red-500 transition-all" style={{ width: `${item.percent}%` }} /></div></button>) : <p className="rounded-xl border border-dashed border-white/10 p-6 text-center text-xs text-zinc-600">Belum ada riwayat pipeline.</p>}</CardContent></Card>
    </div>

    <div className="flex flex-wrap items-center gap-2 text-xs text-zinc-600"><CheckCircle2 className="h-4 w-4 text-emerald-300" /> Setiap tahap dibatasi timeout dan scope. <span className="text-zinc-800">•</span> <span>Data diperbarui dari server, dengan fallback sambung ulang manual.</span></div>
  </div>;
}
