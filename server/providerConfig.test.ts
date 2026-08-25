import { describe, expect, it } from "vitest";

describe("konfigurasi provider publik", () => {
  it("memakai fallback HTTPS saat env tidak tersedia atau tidak aman", async () => {
    const { publicProviderConfig } = await import("./providerConfig");
    expect(publicProviderConfig.rdapBaseUrl).toMatch(/^https:\/\//);
    expect(publicProviderConfig.certificateTransparencyUrl).toMatch(/^https:\/\//);
    expect(publicProviderConfig.archiveUrl).toMatch(/^https:\/\//);
    expect(publicProviderConfig.githubApiUrl).toMatch(/^https:\/\//);
  });
});
