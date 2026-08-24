export type AssessmentReadinessInput = {
  hasWorkspace: boolean;
  hasTarget: boolean;
  hasProfile: boolean;
  isAuthorized: boolean;
};

export type AssessmentReadinessStep = {
  key: keyof AssessmentReadinessInput;
  label: string;
  detail: string;
  path: string;
  complete: boolean;
};

export function getAssessmentReadiness(input: AssessmentReadinessInput) {
  const steps: AssessmentReadinessStep[] = [
    {
      key: "hasWorkspace",
      label: "Ruang kerja dibuat",
      detail: "Tempat scope dan riwayat assessment disimpan.",
      path: "/workspace",
      complete: input.hasWorkspace,
    },
    {
      key: "hasTarget",
      label: "Target masuk allowlist",
      detail: "Hanya aset yang disetujui yang boleh diproses.",
      path: "/workspace",
      complete: input.hasTarget,
    },
    {
      key: "hasProfile",
      label: "Profil pemindaian dipilih",
      detail: "Konfigurasi bounded untuk preview yang aman.",
      path: "/workspace",
      complete: input.hasProfile,
    },
    {
      key: "isAuthorized",
      label: "Otorisasi dikonfirmasi",
      detail: "Bukti dan konfirmasi manual wajib sebelum eksekusi.",
      path: "/authorization",
      complete: input.isAuthorized,
    },
  ];

  const completed = steps.filter((step) => step.complete).length;
  return {
    percentage: Math.round((completed / steps.length) * 100),
    completed,
    total: steps.length,
    steps,
  };
}
