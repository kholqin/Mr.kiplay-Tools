import { useState } from "react";
import { Database, FileUp, ShieldCheck } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

type LocalRecord = Record<string, unknown>;

export function parseLocalFile(text: string, name: string): LocalRecord[] {
  if (name.toLowerCase().endsWith(".json")) {
    const value = JSON.parse(text) as unknown;
    const rows = Array.isArray(value) ? value : [value];
    return rows.filter((row): row is LocalRecord => Boolean(row && typeof row === "object")).slice(0, 1000);
  }
  return text.split(/\r?\n/).filter(Boolean).slice(0, 1000).map((line) => {
    const [kind, value, observedAt] = line.split(",").map((part) => part.trim());
    return { kind, value, observedAt };
  });
}

export function OfflineOsintPanel() {
  const [dnsRows, setDnsRows] = useState<LocalRecord[]>([]);
  const [breachRows, setBreachRows] = useState<LocalRecord[]>([]);
  const [error, setError] = useState<string | null>(null);
  const load = (kind: "dns" | "breach") => (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    setError(null);
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const rows = parseLocalFile(String(reader.result ?? ""), file.name);
        if (kind === "dns") setDnsRows(rows); else setBreachRows(rows.map(({ email, password, token, cookie, ...safe }) => safe));
      } catch { setError("File tidak valid. Gunakan JSON array atau CSV sederhana, lalu coba lagi."); }
    };
    reader.onerror = () => setError("File tidak dapat dibaca dari perangkat ini.");
    reader.readAsText(file);
    event.target.value = "";
  };
  return <Card className="border-sky-300/15 bg-sky-300/[0.04]">
    <CardHeader><div className="flex items-center justify-between gap-3"><div><CardTitle className="text-lg">Mode offline tanpa provider</CardTitle><p className="mt-1 text-sm text-zinc-500">Impor snapshot milik operator; file tetap diproses lokal di browser.</p></div><Badge variant="outline" className="border-sky-300/20 text-sky-200"><ShieldCheck className="mr-2 h-3 w-3" /> Tidak dikirim</Badge></div></CardHeader>
    <CardContent className="grid gap-3 md:grid-cols-2">
      {[{ kind: "dns" as const, label: "Snapshot DNS", count: dnsRows.length }, { kind: "breach" as const, label: "Indikator breach lokal", count: breachRows.length }].map((item) => <label key={item.kind} className="cursor-pointer rounded-xl border border-white/10 bg-black/20 p-4 hover:border-sky-300/30"><div className="flex items-center gap-3"><Database className="h-5 w-5 text-sky-300" /><div><p className="text-sm font-medium">{item.label}</p><p className="mt-1 text-xs text-zinc-500">{item.count ? `${item.count} baris dimuat` : "JSON atau CSV, maksimal 1.000 baris"}</p></div></div><Button type="button" variant="outline" className="mt-4 w-full border-white/15 bg-white/5"><FileUp className="mr-2 h-4 w-4" /> Pilih file lokal</Button><input type="file" accept=".json,.csv,application/json,text/csv" className="sr-only" onChange={load(item.kind)} /></label>)}
      {error && <p role="alert" className="md:col-span-2 rounded-lg border border-red-300/20 bg-red-300/[0.06] p-3 text-sm text-red-200">{error}</p>}
      <p className="md:col-span-2 text-xs text-zinc-500">Data breach harus berupa indikator yang memang kamu miliki. Mr.Kiplay tidak membuat, mengirim, atau menyimpan password, token, cookie, maupun daftar email mentah.</p>
    </CardContent>
  </Card>;
}
