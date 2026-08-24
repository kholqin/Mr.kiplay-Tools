import { describe, expect, it } from "vitest";
import { supportedAdapters } from "../integrations/adapterContract";

describe("adapter contract", () => {
  it("exposes the approved integration set", () => {
    expect(supportedAdapters).toEqual(["nmap", "nuclei", "burp", "amass", "subfinder", "httpx", "searchsploit"]);
  });
});
