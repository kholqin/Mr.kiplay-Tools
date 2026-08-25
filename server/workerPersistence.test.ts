import { describe, expect, it, vi } from "vitest";
import { IsolatedWorkerQueue } from "../core/worker/isolatedWorker";

describe("worker persistence hook", () => {
  it("meneruskan lifecycle job yang aman ke adapter persistence", async () => {
    const persist = vi.fn();
    const queue = new IsolatedWorkerQueue();
    queue.setPersistenceHook(persist);
    const job = queue.enqueue(7, "summarizeReconResults", { results: [{ kind: "osint" }] }, 3000);
    await new Promise((resolve) => setTimeout(resolve, 100));
    expect(persist).toHaveBeenCalled();
    expect(persist.mock.calls.some(([value]) => value.id === job.id && value.status === "completed")).toBe(true);
  });
});
