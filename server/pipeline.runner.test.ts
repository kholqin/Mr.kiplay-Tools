import { describe, expect, it } from "vitest";
import { createPipelinePlan } from "../core/pipeline/runner";

describe("pipeline runner", () => {
  it("creates a preview plan with Nmap before Nuclei", () => {
    const plan = createPipelinePlan([{ value: "https://Example.com/", type: "url" }]);
    expect(plan.mode).toBe("preview");
    expect(plan.stages.map((stage) => stage.id)).toEqual(["nmap-discovery", "nuclei-baseline"]);
    expect(plan.safety.noExploit).toBe(true);
  });

  it("rejects sensitive targets before planning", () => {
    expect(() => createPipelinePlan([{ value: "169.254.169.254", type: "ip" }])).toThrow("Target sensitif ditolak");
  });
});
