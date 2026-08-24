import { connect } from "node:tls";
import { assertPublicResolution, clampReconTimeout, parsePublicReconUrl, sanitizeReconText } from "./target";

export type CertificateInventoryOptions = {
  preview?: boolean;
  timeoutMs?: number;
};

export type CertificateInventoryResult = {
  target: string;
  mode: "preview" | "passive";
  protocol: "https:";
  port: number;
  subject: string | null;
  issuer: string | null;
  validFrom: string | null;
  validTo: string | null;
  fingerprint256: string | null;
  subjectAltNames: string[];
  observedAt: string;
  warnings: string[];
};

function normalizeNames(value: unknown) {
  return String(value ?? "")
    .split(",")
    .map((item) => sanitizeReconText(item.replace(/^DNS:/i, ""), 253))
    .filter(Boolean)
    .slice(0, 100);
}

function certificateField(value: unknown) {
  if (!value || typeof value !== "object") return null;
  const commonName = (value as { CN?: unknown }).CN;
  return commonName ? sanitizeReconText(commonName, 253) : null;
}

export async function inventoryCertificate(target: string, options: CertificateInventoryOptions = {}): Promise<CertificateInventoryResult> {
  const url = parsePublicReconUrl(target, ["https:"]);
  const port = Number(url.port || 443);
  const normalizedTarget = url.toString();
  const observedAt = new Date().toISOString();
  if (options.preview) {
    return {
      target: normalizedTarget,
      mode: "preview",
      protocol: "https:",
      port,
      subject: null,
      issuer: null,
      validFrom: null,
      validTo: null,
      fingerprint256: null,
      subjectAltNames: [],
      observedAt,
      warnings: ["Pratinjau: tidak ada koneksi TLS dikirim."],
    };
  }

  const timeoutMs = clampReconTimeout(options.timeoutMs);
  await assertPublicResolution(url.hostname, timeoutMs);
  return new Promise((resolve, reject) => {
    const socket = connect({ host: url.hostname, port, servername: url.hostname, rejectUnauthorized: false });
    const timer = setTimeout(() => {
      socket.destroy();
      reject(new Error("TLS timeout"));
    }, timeoutMs);
    socket.once("secureConnect", () => {
      clearTimeout(timer);
      const certificate = socket.getPeerCertificate();
      const result: CertificateInventoryResult = {
        target: normalizedTarget,
        mode: "passive",
        protocol: "https:",
        port,
        subject: certificateField(certificate.subject),
        issuer: certificateField(certificate.issuer),
        validFrom: sanitizeReconText(certificate.valid_from, 80) || null,
        validTo: sanitizeReconText(certificate.valid_to, 80) || null,
        fingerprint256: sanitizeReconText(certificate.fingerprint256, 128) || null,
        subjectAltNames: normalizeNames(certificate.subjectaltname),
        observedAt,
        warnings: ["Inventaris hanya mengambil metadata sertifikat peer; validasi trust dan risiko tetap manual."],
      };
      socket.end();
      resolve(result);
    });
    socket.once("error", () => {
      clearTimeout(timer);
      reject(new Error("TLS handshake gagal"));
    });
  });
}
