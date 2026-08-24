export type NucleiPlanInput = { endpoints: string[]; rateLimit: number; timeoutSeconds: number; preview?: boolean };

export function planNucleiBaseline(input: NucleiPlanInput) {
  if (!input.endpoints.length) throw new Error("Nuclei membutuhkan endpoint hasil discovery dalam scope");
  if (input.rateLimit < 1 || input.rateLimit > 100) throw new Error("Rate limit Nuclei di luar rentang aman");
  return {
    stage: "nuclei-baseline",
    command: ["nuclei", "-l", "<input-tervalidasi>", "-severity", "info,low,medium,high,critical", "-rate-limit", String(input.rateLimit), "-timeout", String(Math.min(input.timeoutSeconds, 30)), "-no-interactsh", "-no-color"],
    execute: input.preview !== false ? false : "requires-explicit-runner",
    manualValidationRequired: true,
    excludedTags: ["dos", "fuzz", "brute-force", "intrusive"],
  } as const;
}
