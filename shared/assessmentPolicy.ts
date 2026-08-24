const blockedHostnames = new Set(["localhost", "metadata.google.internal", "metadata.azure.internal"]);

export function normalizeTarget(value: string) {
  return value.trim().toLowerCase().replace(/^https?:\/\//, "").replace(/\/$/, "");
}

export function isSensitiveTarget(value: string) {
  const target = normalizeTarget(value).split("/")[0].split(":")[0];
  if (blockedHostnames.has(target)) return true;
  if (target === "127.0.0.1" || target === "0.0.0.0" || target === "::1" || target.startsWith("169.254.")) return true;
  if (/^10\./.test(target) || /^192\.168\./.test(target) || /^172\.(1[6-9]|2\d|3[0-1])\./.test(target)) return true;
  return false;
}

export function validateTargetForScope(value: string) {
  const normalized = normalizeTarget(value);
  if (!normalized) return { ok: false as const, reason: "Target kosong" };
  if (isSensitiveTarget(normalized)) return { ok: false as const, reason: "Target termasuk jaringan sensitif atau endpoint metadata" };
  return { ok: true as const, value: normalized };
}
