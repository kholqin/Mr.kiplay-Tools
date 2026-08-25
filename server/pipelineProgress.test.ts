import { describe, expect, it } from "vitest";
import { cancelPipeline, getPipeline, startPipeline } from "./pipelineProgress";
import { createPipelineStages, progressForStages, sanitizePipelineMessage } from "../shared/pipelineProgress";

describe("pipeline progress dashboard", () => {
  it("menghitung progres hanya dari tahap terminal dan membatasi pesan", () => {
    const stages = createPipelineStages().map((stage, index) => index < 2 ? { ...stage, status: "completed" as const } : stage);
    expect(progressForStages(stages, "running")).toBe(29);
    expect(sanitizePipelineMessage("  pesan\nrahasia\u0000  ", 20)).toBe("pesan rahasia");
  });

  it("menjalankan mode pratinjau tanpa request jaringan dan mencapai 100%", async () => {
    const started = startPipeline({ ownerId: 1, workspaceId: 41, targetId: 7, target: "https://example.com", targetType: "url", mode: "preview" });
    await new Promise((resolve) => setTimeout(resolve, 100));
    const snapshot = getPipeline(started.jobId, 41);
    expect(snapshot?.status).toBe("completed");
    expect(snapshot?.percent).toBe(100);
    expect(snapshot?.stages.find((stage) => stage.id === "dns")?.status).toBe("skipped");
  });

  it("membatalkan job secara idempotent dan tidak mengizinkan workspace lain membaca", () => {
    const started = startPipeline({ ownerId: 1, workspaceId: 42, targetId: 8, target: "https://example.com", targetType: "url", mode: "active" });
    expect(getPipeline(started.jobId, 999)).toBeNull();
    expect(cancelPipeline(started.jobId, 42).cancelled).toBe(true);
    expect(getPipeline(started.jobId, 42)?.status).toBe("cancelled");
    expect(cancelPipeline(started.jobId, 42).cancelled).toBe(false);
  });
});
