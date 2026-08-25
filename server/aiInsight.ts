import { invokeLLM, listLLMModels } from "./_core/llm";

const SENSITIVE_KEY = /(password|passwd|token|secret|cookie|authorization|credential|api[_-]?key|private[_-]?key|email|phone|telepon)/i;
const SENSITIVE_VALUE = /(bearer\s+[a-z0-9._-]+|sk-[a-z0-9_-]{12,}|gh[pousr]_[a-z0-9]{12,})/i;

export type ReportStyle = "ringkas" | "eksekutif" | "teknis";

export type AiInsight = {
  summary: string;
  priorities: Array<{ title: string; severity: "critical" | "high" | "medium" | "low" | "info"; rationale: string; confidence: "high" | "medium" | "low"; remediation: string }>;
  caveat: string;
};

export function sanitizeForAi(value: unknown, depth = 0): unknown {
  if (depth > 4 || value === null || value === undefined) return undefined;
  if (typeof value === "string") {
    if (SENSITIVE_VALUE.test(value)) return "[DIREDAKSI]";
    return value.replace(/[\u0000-\u001f\u007f]/g, " ").replace(/\s+/g, " ").slice(0, 500);
  }
  if (typeof value === "number" || typeof value === "boolean") return value;
  if (Array.isArray(value)) return value.slice(0, 50).map((item) => sanitizeForAi(item, depth + 1));
  if (typeof value === "object") {
    return Object.fromEntries(Object.entries(value as Record<string, unknown>).slice(0, 80).flatMap(([key, item]) => SENSITIVE_KEY.test(key) ? [] : [[key.slice(0, 80), sanitizeForAi(item, depth + 1)]]));
  }
  return undefined;
}

function contentText(content: unknown) {
  if (typeof content === "string") return content;
  if (Array.isArray(content)) return content.map((item) => typeof item === "object" && item && "text" in item ? String((item as { text?: unknown }).text ?? "") : "").join("\n");
  return "";
}

function parseInsight(content: unknown): AiInsight {
  let parsed: unknown;
  try { parsed = JSON.parse(contentText(content)); } catch { throw new Error("AI mengembalikan format yang tidak dapat dibaca"); }
  if (!parsed || typeof parsed !== "object") throw new Error("AI mengembalikan data kosong");
  const candidate = parsed as Record<string, unknown>;
  const priorities = Array.isArray(candidate.priorities) ? candidate.priorities.slice(0, 8).flatMap((item) => {
    if (!item || typeof item !== "object") return [];
    const row = item as Record<string, unknown>;
    const severity = ["critical", "high", "medium", "low", "info"].includes(String(row.severity)) ? String(row.severity) as AiInsight["priorities"][number]["severity"] : "info";
    const confidence = ["high", "medium", "low"].includes(String(row.confidence)) ? String(row.confidence) as AiInsight["priorities"][number]["confidence"] : "low";
    return [{ title: String(row.title ?? "Prioritas observasi").slice(0, 180), severity, rationale: String(row.rationale ?? "Tinjau evidence secara manual.").slice(0, 500), confidence, remediation: String(row.remediation ?? "Validasi konfigurasi dan dokumentasikan hasil review.").slice(0, 500) }];
  }) : [];
  return { summary: String(candidate.summary ?? "Tidak ada ringkasan AI.").slice(0, 800), priorities, caveat: String(candidate.caveat ?? "Insight AI adalah bantuan triase dan bukan bukti kerentanan.").slice(0, 500) };
}

export async function createAiInsight(input: { findings: unknown[]; reconResults: unknown[]; focus?: string; style?: ReportStyle }) {
  const style = input.style ?? "ringkas";
  const styleInstruction: Record<ReportStyle, string> = {
    ringkas: "Gunakan format ringkas: inti observasi, risiko utama, dan tindakan berikutnya dalam kalimat pendek.",
    eksekutif: "Gunakan format eksekutif: dampak bisnis defensif, prioritas keputusan, dan ringkasan tanpa jargon berlebihan.",
    teknis: "Gunakan format teknis: detail evidence, asumsi, batasan observasi, dan langkah hardening yang dapat diverifikasi.",
  };
  const sanitized = sanitizeForAi({ findings: input.findings, reconResults: input.reconResults, focus: input.focus ?? "prioritas review", style });
  const payload = JSON.stringify(sanitized).slice(0, 16_000);
  const models = await listLLMModels();
  const model = models.data.find((item) => item.id === "gpt-5-mini")?.id ?? models.data.find((item) => item.id.startsWith("gpt-"))?.id;
  const response = await invokeLLM({
    ...(model ? { model } : {}),
    maxTokens: 1400,
    messages: [
      { role: "system", content: "Anda adalah analis triase keamanan defensif. Analisis hanya observasi yang sudah disanitasi. Jangan menyimpulkan eksploitasi, jangan memberi payload, jangan meminta credential, dan selalu tekankan validasi manual. Jawab dalam Bahasa Indonesia." },
      { role: "user", content: `Buat ringkasan singkat dan maksimal 8 prioritas review dari data JSON berikut. Gunakan severity dan confidence yang konservatif. ${styleInstruction[style]}\n${payload}` },
    ],
    response_format: { type: "json_schema", json_schema: { name: "mrkiplay_ai_insight", strict: true, schema: { type: "object", properties: { summary: { type: "string" }, priorities: { type: "array", items: { type: "object", properties: { title: { type: "string" }, severity: { type: "string", enum: ["critical", "high", "medium", "low", "info"] }, rationale: { type: "string" }, confidence: { type: "string", enum: ["high", "medium", "low"] }, remediation: { type: "string" } }, required: ["title", "severity", "rationale", "confidence", "remediation"], additionalProperties: false } }, caveat: { type: "string" } }, required: ["summary", "priorities", "caveat"], additionalProperties: false } } },
  });
  const message = response.choices[0]?.message;
  if (!message) throw new Error("Respons AI kosong");
  return parseInsight(message.content);
}
