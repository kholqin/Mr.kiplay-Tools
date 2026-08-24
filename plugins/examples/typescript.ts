import type { MrkPlugin, ValidatedScope } from "../sdk/contract";

export const headersReviewPlugin: MrkPlugin = {
  id: "example.headers-review",
  version: "0.1.0",
  capabilities: ["security-headers"],
  plan(scope: ValidatedScope) {
    if (scope.mode !== "preview") throw new Error("Contoh plugin hanya tersedia dalam mode pratinjau");
    return { actions: scope.targets.map((target) => `Tinjau header secara aman: ${target}`), manualValidationRequired: true };
  },
};
