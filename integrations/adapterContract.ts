export type AdapterId = "nmap" | "nuclei" | "burp" | "amass" | "subfinder" | "httpx" | "searchsploit";

export type ValidatedScope = {
  workspaceId: number;
  targets: string[];
  authorizationConfirmed: true;
  mode: "preview" | "safe";
  rateLimit: number;
  timeoutSeconds: number;
};

export type AdapterPlan = {
  adapter: AdapterId;
  stage: string;
  actions: string[];
  manualValidationRequired: true;
  execute: false | "requires-explicit-runner";
};

export interface MrkAdapter {
  readonly id: AdapterId;
  validate(scope: ValidatedScope): void;
  plan(scope: ValidatedScope): AdapterPlan;
  normalize(raw: unknown): { findings: unknown[]; evidence: string[] };
}

export const supportedAdapters: AdapterId[] = ["nmap", "nuclei", "burp", "amass", "subfinder", "httpx", "searchsploit"];
