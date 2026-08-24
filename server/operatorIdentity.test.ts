import { describe, expect, it } from "vitest";
import { OPERATOR_IDENTITY } from "../shared/operatorIdentity";

describe("operator identity presentation", () => {
  it("menggunakan identitas generik Mr.Kiplay", () => {
    expect(OPERATOR_IDENTITY.avatar).toBe("M");
    expect(OPERATOR_IDENTITY.label).toBe("Analis Mr.Kiplay");
    expect(OPERATOR_IDENTITY.session).toBe("Sesi terautentikasi");
    expect(OPERATOR_IDENTITY.greeting).toBe("Selamat datang di Mr.Kiplay.");
  });

  it("tidak merender data identitas pribadi", () => {
    const rendered = Object.values(OPERATOR_IDENTITY).join(" ").toLowerCase();
    expect(rendered).not.toMatch(/@|gmail|yahoo|hotmail/);
  });
});
