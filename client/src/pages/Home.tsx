import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";
import { startLogin } from "@/const";
import { Activity, ArrowUpRight, CheckCircle2, CircleDashed, FileSearch, Globe2, LockKeyhole, Radar, ShieldAlert, ShieldCheck, Sparkles, Target, Zap } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useLocation } from "wouter";
import { toast } from "sonner";

const modules = [
  { label: "Recon & Inventaris", detail: "DNS, subdomain, HTTP, sertifikat, IP", icon: Globe2, color: "text-sky-300" },
  { label: "Pipeline Nmap → Nuclei", detail: "Discovery layanan dan template baseline", icon: Radar, color: "text-red-300" },
  { label: "Assessment Web Aman", detail: "Header, exposure, misconfig, indikasi manual", icon: ShieldAlert, color: "text-amber-300" },
  { label: "Intelligence", detail: "OSINT, dork review, fingerprint, referensi", icon: Sparkles, color: "text-violet-300" },
];

const routeTitles: Record<string, string> = {
  "/": "Ringkasan assessment",
  "/workspace": "Ruang kerja assessment",
  "/pipeline": "Pipeline pemindaian",
  "/findings": "Temuan keamanan",
  "/reports": "Laporan assessment",
  "/authorization": "Gate otorisasi",
  "/settings": "Pengaturan platform",
};

export default function Home() {
  const { user, isAuthenticated } = useAuth();
  const [location] = useLocation();
  const [selectedWorkspaceId, setSelectedWorkspaceId] = useState<number | null>(null);
  const workspaces = trpc.assessment.workspaces.useQuery(undefined, { enabled: isAuthenticated });
  const workspace = trpc.assessment.getWorkspace.useQuery(
    { workspaceId: selectedWorkspaceId ?? 0 },
    { enabled: Boolean(selectedWorkspaceId) },
  );
  const targets = trpc.assessment.targets.useQuery(
    { workspaceId: selectedWorkspaceId ?? 0 },
    { enabled: Boolean(selectedWorkspaceId) },
  );
  const profiles = trpc.assessment.profiles.useQuery(
    { workspaceId: selectedWorkspaceId ?? 0 },
    { enabled: Boolean(selectedWorkspaceId) },
  );
  const jobs = trpc.assessment.jobs.useQuery(
    { workspaceId: selectedWorkspaceId ?? 0 },
    { enabled: Boolean(selectedWorkspaceId) },
  );
  const findings = trpc.assessment.findings.useQuery(
    { workspaceId: selectedWorkspaceId ?? 0 },
    { enabled: Boolean(selectedWorkspaceId) },
  );
  const previewScan = trpc.assessment.previewScan.useMutation({
    onSuccess: () => {
      toast.success("Pratinjau pipeline dibuat. Tidak ada request scan yang dijalankan.");
      jobs.refetch();
    },
    onError: (error) => toast.error(error.message),
  });

  useEffect(() => {
    if (!selectedWorkspaceId && workspaces.data?.[0]) setSelectedWorkspaceId(workspaces.data[0].id);
  }, [selectedWorkspaceId, workspaces.data]);

  const activeProfile = profiles.data?.[0];
  const activeWorkspace = workspace.data ?? workspaces.data?.find((item) => item.id === selectedWorkspaceId);
  const statusLabel = activeWorkspace?.authorizationConfirmed ? "Siap untuk preview" : "Otorisasi diperlukan";
  const completedJobs = jobs.data?.filter((job) => job.status === "completed").length ?? 0;
  const highFindings = findings.data?.filter((finding) => finding.severity === "high" || finding.severity === "critical").length ?? 0;
  const readiness = useMemo(() => {
    let value = 25;
    if (activeWorkspace) value += 25;
    if (targets.data?.length) value += 25;
    if (activeWorkspace?.authorizationConfirmed) value += 25;
    return value;
  }, [activeWorkspace, targets.data]);

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#08090c] text-white flex items-center justify-center p-6">
        <div className="max-w-lg text-center space-y-6">
          <div className="mx-auto h-16 w-16 rounded-2xl bg-gradient-to-br from-red-500 to-red-800 flex items-center justify-center shadow-[0_0_50px_rgba(220,38,38,.25)]"><ShieldCheck className="h-8 w-8" /></div>
          <div><p className="text-xs uppercase tracking-[0.3em] text-red-300">MR.KIPLAY / SECURITY INTELLIGENCE</p><h1 className="mt-3 text-4xl font-semibold tracking-tight">Assessment yang rapi, aman, dan dapat diaudit.</h1><p className="mt-4 text-zinc-400 leading-7">Masuk untuk membuat workspace, menetapkan scope, mengunggah bukti otorisasi, dan meninjau pipeline tanpa eksploitasi otomatis.</p></div>
          <Button onClick={() => startLogin()} className="bg-red-600 hover:bg-red-500 text-white rounded-xl px-6">Masuk ke dashboard <ArrowUpRight className="ml-2 h-4 w-4" /></Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-2rem)] text-zinc-100 space-y-6">
      <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-[radial-gradient(circle_at_top_right,rgba(220,38,38,.24),transparent_38%),linear-gradient(135deg,#13151b,#0b0c10)] p-6 md:p-8 shadow-2xl">
        <img src="/manus-storage/mrkiplay-command-center_7d2580b8.png" alt="Ilustrasi command center Mr.Kiplay" className="pointer-events-none absolute right-0 top-0 h-full w-1/2 object-cover opacity-20 mix-blend-screen" /><div className="absolute -right-16 -top-20 h-52 w-52 rounded-full border border-red-400/20" /><div className="absolute -right-8 -top-12 h-36 w-36 rounded-full border border-white/10" />
        <div className="relative flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between"><div className="max-w-2xl"><div className="flex items-center gap-2 text-xs font-medium uppercase tracking-[0.25em] text-red-200"><span className="h-2 w-2 rounded-full bg-red-400 shadow-[0_0_12px_#f87171]" /> Ruang kerja keamanan Merah Putih</div><h1 className="mt-4 text-3xl md:text-5xl font-semibold tracking-tight">Selamat datang, {user?.name?.split(" ")[0] ?? "Analis"}.</h1><p className="mt-4 max-w-xl text-sm leading-6 text-zinc-400">{routeTitles[location] ?? "Ruang kerja assessment"}. Semua aktivitas dimulai dari scope yang jelas dan otorisasi yang terverifikasi.</p></div><div className="flex items-center gap-3"><Badge className="border border-emerald-400/20 bg-emerald-400/10 text-emerald-300"><Activity className="mr-2 h-3 w-3" /> Sistem siap</Badge><Badge variant="outline" className="border-white/15 bg-white/5 text-zinc-300">Mode aman</Badge></div></div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {[
          { label: "Target dalam scope", value: targets.data?.length ?? 0, meta: "allowlist aktif", icon: Target, accent: "text-sky-300" },
          { label: "Job selesai", value: completedJobs, meta: `${jobs.data?.length ?? 0} riwayat tercatat`, icon: CheckCircle2, accent: "text-emerald-300" },
          { label: "Temuan prioritas", value: highFindings, meta: "perlu review manual", icon: ShieldAlert, accent: "text-red-300" },
          { label: "Kesiapan workspace", value: `${readiness}%`, meta: statusLabel, icon: Zap, accent: "text-amber-300" },
        ].map((stat) => <Card key={stat.label} className="border-white/10 bg-white/[0.035] backdrop-blur"><CardContent className="p-5"><div className="flex items-start justify-between"><div><p className="text-sm text-zinc-400">{stat.label}</p><p className="mt-2 text-3xl font-semibold tracking-tight">{stat.value}</p><p className="mt-1 text-xs text-zinc-500">{stat.meta}</p></div><stat.icon className={`h-5 w-5 ${stat.accent}`} /></div></CardContent></Card>)}
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.35fr_.65fr]">
        <Card className="border-white/10 bg-white/[0.035]"><CardHeader className="flex flex-row items-center justify-between space-y-0"><div><CardTitle className="text-lg">Ruang kerja aktif</CardTitle><p className="mt-1 text-sm text-zinc-500">Kontrol scope dan kesiapan assessment.</p></div><Badge variant="outline" className="border-red-300/20 text-red-200"><LockKeyhole className="mr-2 h-3 w-3" /> Gate aktif</Badge></CardHeader><CardContent className="space-y-5"><div className="rounded-2xl border border-white/10 bg-black/20 p-4"><div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between"><div><p className="text-xs uppercase tracking-[0.2em] text-zinc-500">Ruang kerja</p><p className="mt-1 text-xl font-medium">{activeWorkspace?.name ?? "Belum ada workspace"}</p><p className="mt-1 text-sm text-zinc-500">{activeWorkspace?.description ?? "Buat workspace untuk memulai assessment berizin."}</p></div><Button variant="outline" className="border-white/15 bg-white/5 hover:bg-white/10" onClick={() => toast.info("Pengelolaan workspace tersedia pada modul Ruang kerja.")}>Kelola <ArrowUpRight className="ml-2 h-4 w-4" /></Button></div></div><div><div className="mb-2 flex justify-between text-xs"><span className="text-zinc-400">Kesiapan assessment</span><span className="text-zinc-300">{readiness}%</span></div><Progress value={readiness} className="h-2 bg-white/10" /></div><div className="grid gap-3 sm:grid-cols-3"><div className="rounded-xl border border-white/10 p-3"><p className="text-xs text-zinc-500">Otorisasi</p><p className="mt-2 text-sm">{activeWorkspace?.authorizationConfirmed ? "Terverifikasi" : "Belum dikonfirmasi"}</p></div><div className="rounded-xl border border-white/10 p-3"><p className="text-xs text-zinc-500">Profil</p><p className="mt-2 text-sm">{activeProfile?.name ?? "Baseline Aman"}</p></div><div className="rounded-xl border border-white/10 p-3"><p className="text-xs text-zinc-500">Retensi</p><p className="mt-2 text-sm">30 hari</p></div></div></CardContent></Card>
        <Card className="border-red-300/15 bg-gradient-to-br from-red-500/[0.13] to-white/[0.03]"><CardHeader><div className="flex items-center gap-2"><CircleDashed className="h-5 w-5 text-red-300" /><CardTitle className="text-lg">Pratinjau pipeline</CardTitle></div><p className="text-sm text-zinc-400">Nmap discovery → Nuclei baseline. Tidak ada eksploitasi otomatis.</p></CardHeader><CardContent className="space-y-4"><div className="space-y-3"><div className="flex gap-3"><span className="mt-1 h-2.5 w-2.5 rounded-full bg-red-300" /><div><p className="text-sm font-medium">01 / Discovery layanan</p><p className="text-xs text-zinc-500">Port dan service terbuka dalam scope.</p></div></div><div className="ml-1 h-5 border-l border-dashed border-white/15" /><div className="flex gap-3"><span className="mt-1 h-2.5 w-2.5 rounded-full bg-amber-300" /><div><p className="text-sm font-medium">02 / Template baseline</p><p className="text-xs text-zinc-500">Temuan diprioritaskan untuk validasi manual.</p></div></div></div><Button className="w-full bg-red-600 hover:bg-red-500" disabled={!activeWorkspace?.authorizationConfirmed || !activeProfile || previewScan.isPending} onClick={() => selectedWorkspaceId && activeProfile && previewScan.mutate({ workspaceId: selectedWorkspaceId, profileId: activeProfile.id })}>{previewScan.isPending ? "Membuat preview..." : "Buat pratinjau pipeline"}<ArrowUpRight className="ml-2 h-4 w-4" /></Button><p className="text-center text-[11px] text-zinc-500">{activeWorkspace?.authorizationConfirmed ? "Scope dan otorisasi terdeteksi." : "Konfirmasi otorisasi sebelum melanjutkan."}</p></CardContent></Card>
      </div>

      <div><div className="mb-4 flex items-end justify-between"><div><p className="text-xs uppercase tracking-[0.25em] text-red-200">Intelijen modular</p><h2 className="mt-2 text-2xl font-semibold">Satu ruang untuk seluruh alur kerja.</h2></div><Button variant="ghost" className="hidden text-zinc-400 hover:text-white sm:flex" onClick={() => toast.info("Gunakan navigasi di kiri untuk membuka modul.")}>Lihat semua <ArrowUpRight className="ml-2 h-4 w-4" /></Button></div><div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">{modules.map((item) => <Card key={item.label} className="group border-white/10 bg-white/[0.035] transition-all duration-200 hover:-translate-y-1 hover:border-red-300/30 hover:bg-white/[0.06]"><CardContent className="p-5"><item.icon className={`h-6 w-6 ${item.color} transition-transform duration-200 group-hover:scale-110`} /><h3 className="mt-5 font-medium">{item.label}</h3><p className="mt-2 text-sm leading-5 text-zinc-500">{item.detail}</p><div className="mt-5 flex items-center gap-1 text-xs text-zinc-400">Buka modul <ArrowUpRight className="h-3 w-3" /></div></CardContent></Card>)}</div></div>
      <div className="flex items-center gap-2 rounded-xl border border-amber-300/15 bg-amber-300/[0.05] px-4 py-3 text-xs text-amber-100/80"><FileSearch className="h-4 w-4 shrink-0 text-amber-300" /> Semua indikasi kerentanan bersifat sinyal awal dan wajib divalidasi manual. Mr.Kiplay tidak menjalankan eksploitasi otomatis.</div>
    </div>
  );
}
