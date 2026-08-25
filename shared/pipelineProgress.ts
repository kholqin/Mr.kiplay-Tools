export const PIPELINE_STAGE_IDS = ["preflight", "dns", "http", "certificate", "osint", "ports", "finalize"] as const;
export type PipelineStageId = (typeof PIPELINE_STAGE_IDS)[number];
export type PipelineStatus = "queued" | "running" | "completed" | "failed" | "cancelled";
export type PipelineStageStatus = "pending" | "running" | "completed" | "skipped" | "failed" | "cancelled";

export type PipelineStage = {
  id: PipelineStageId;
  label: string;
  description: string;
  status: PipelineStageStatus;
  startedAt?: string;
  finishedAt?: string;
  message?: string;
  resultCount?: number;
};

export type PipelineProgressSnapshot = {
  jobId: string;
  workspaceId: number;
  targetId: number;
  target: string;
  mode: "preview" | "active";
  status: PipelineStatus;
  percent: number;
  currentStage: PipelineStageId;
  createdAt: string;
  updatedAt: string;
  startedAt?: string;
  finishedAt?: string;
  message: string;
  error?: string;
  stages: PipelineStage[];
};

export const PIPELINE_STAGE_META: Record<PipelineStageId, Pick<PipelineStage, "label" | "description">> = {
  preflight: { label: "Prapemeriksaan", description: "Memeriksa otorisasi, allowlist, dan resolusi publik." },
  dns: { label: "DNS", description: "Mengumpulkan metadata DNS terbatas dan terukur." },
  http: { label: "HTTP pasif", description: "Membaca header dan sinyal teknologi tanpa payload." },
  certificate: { label: "Sertifikat TLS", description: "Mencatat metadata sertifikat peer tanpa material kunci." },
  osint: { label: "OSINT publik", description: "Mengambil satu sumber metadata publik yang dibatasi." },
  ports: { label: "Port terbatas", description: "Mengobservasi port eksplisit dalam scope, tanpa eksploitasi." },
  finalize: { label: "Finalisasi", description: "Menyimpan ringkasan hasil dan audit lifecycle job." },
};

export function createPipelineStages(): PipelineStage[] {
  return PIPELINE_STAGE_IDS.map((id) => ({ ...PIPELINE_STAGE_META[id], id, status: "pending" }));
}

export function progressForStages(stages: PipelineStage[], status: PipelineStatus) {
  if (status === "completed") return 100;
  if (status === "cancelled") {
    const completed = stages.filter((stage) => stage.status === "completed" || stage.status === "skipped").length;
    return Math.round((completed / stages.length) * 100);
  }
  const completed = stages.filter((stage) => stage.status === "completed" || stage.status === "skipped").length;
  const running = stages.some((stage) => stage.status === "running") ? 0.45 : 0;
  return Math.min(99, Math.round(((completed + running) / stages.length) * 100));
}

export function sanitizePipelineMessage(value: unknown, max = 180) {
  return String(value ?? "").replace(/[\u0000-\u001f\u007f]/g, " ").replace(/\s+/g, " ").trim().slice(0, max);
}

export function isTerminalPipelineStatus(status: PipelineStatus) {
  return status === "completed" || status === "failed" || status === "cancelled";
}
