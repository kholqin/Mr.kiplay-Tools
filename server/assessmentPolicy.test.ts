import { describe, expect, it } from "vitest";
import { isSensitiveTarget, validateTargetForScope } from "../shared/assessmentPolicy";

describe("assessment scope policy", () => {
  it("rejects loopback, private, and metadata targets", () => {
    expect(isSensitiveTarget("127.0.0.1")).toBe(true);
    expect(isSensitiveTarget("192.168.1.10")).toBe(true);
    expect(isSensitiveTarget("169.254.169.254")).toBe(true);
  });

  it("normalizes an approved public target", () => {
    expect(validateTargetForScope(" https://Example.COM/ ")).toEqual({ ok: true, value: "example.com" });
  });
});
