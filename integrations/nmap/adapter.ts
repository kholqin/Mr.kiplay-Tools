import { createPipelinePlan, PipelineTarget } from "../../core/pipeline/runner";

export function planNmapDiscovery(targets: PipelineTarget[]) {
  const plan = createPipelinePlan(targets);
  return {
    stage: plan.stages[0],
    command: ["nmap", "-Pn", "-sV", "--version-light", "--top-ports", "100", "--open"],
    execute: false,
    reason: "Adapter awal hanya membuat preview; eksekusi membutuhkan authorization gate dan runner terisolasi.",
  };
}
