import { describe, expect, it } from "vitest";
import { escapeHtml } from "../shared/reporting";

describe("report sanitization", () => {
  it("escapes active HTML characters", () => {
    expect(escapeHtml("<script>alert('x')</script>")).toBe("&lt;script&gt;alert(&#039;x&#039;)&lt;/script&gt;");
  });
});
