import { describe, expect, it } from "vitest";
import { getAssessmentReadiness } from "../shared/assessmentReadiness";

describe("assessment readiness", () => {
  it("menghasilkan nol persen ketika seluruh prasyarat belum tersedia", () => {
    const result = getAssessmentReadiness({
      hasWorkspace: false,
      hasTarget: false,
      hasProfile: false,
      isAuthorized: false,
    });

    expect(result.percentage).toBe(0);
    expect(result.completed).toBe(0);
    expect(result.steps.every((step) => !step.complete)).toBe(true);
  });

  it("menghitung empat prasyarat dan mempertahankan rute otorisasi", () => {
    const result = getAssessmentReadiness({
      hasWorkspace: true,
      hasTarget: true,
      hasProfile: true,
      isAuthorized: false,
    });

    expect(result.percentage).toBe(75);
    expect(result.completed).toBe(3);
    expect(result.steps.find((step) => step.key === "isAuthorized")).toMatchObject({
      complete: false,
      path: "/authorization",
    });
  });

  it("menghasilkan seratus persen hanya setelah otorisasi dikonfirmasi", () => {
    const result = getAssessmentReadiness({
      hasWorkspace: true,
      hasTarget: true,
      hasProfile: true,
      isAuthorized: true,
    });

    expect(result.percentage).toBe(100);
    expect(result.completed).toBe(4);
  });
});
