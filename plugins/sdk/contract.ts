export type ValidatedScope = {
  workspaceId: number;
  targets: string[];
  mode: "preview" | "safe";
  rateLimit: number;
  timeoutSeconds: number;
};

export type MrkPlugin = {
  id: string;
  version: string;
  capabilities: string[];
  plan(scope: ValidatedScope): { actions: string[]; manualValidationRequired: true };
};
