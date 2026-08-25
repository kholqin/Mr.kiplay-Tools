import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { trpc } from "@/lib/trpc";
import { BookOpenCheck, Search, ShieldCheck } from "lucide-react";
import { useMemo, useState } from "react";

const groupLabels = { all: "Semua", recon: "Recon", assessment: "Assessment", intelligence: "Intelligence" } as const;
type GroupFilter = keyof typeof groupLabels;

export default function OsintCatalogPanel() {
  const [query, setQuery] = useState("");
  const [group, setGroup] = useState<GroupFilter>("all");
  const modules = trpc.modules.useQuery();
  const osintModules = useMemo(() => (modules.data ?? []).filter((item) => item.id.startsWith("osint.")), [modules.data]);
  const visible = useMemo(() => osintModules.filter((item) => {
    const matchesGroup = group === "all" || item.group === group;
    const haystack = `${item.name} ${item.description} ${item.output ?? ""}`.toLowerCase();
    return matchesGroup && haystack.includes(query.trim().toLowerCase());
  }), [group, osintModules, query]);

  return <Card className="border-red-300/15 bg-gradient-to-br from-red-500/[0.08] to-white/[0.025]">
    <CardHeader className="gap-4">
      <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
        <div><CardTitle className="flex items-center gap-2"><BookOpenCheck className="h-5 w-5 text-red-200" /> Katalog 19 modul OSINT</CardTitle><p className="mt-2 max-w-2xl text-sm leading-6 text-zinc-500">Pilih modul sesuai tujuan assessment. Semua modul baru berada pada mode pratinjau sampai engine provider dan otorisasi dikonfigurasi.</p></div>
        <Badge variant="outline" className="w-fit border-amber-300/30 text-amber-200">Preview-only</Badge>
      </div>
      <div className="grid gap-3 md:grid-cols-[minmax(0,1fr)_auto]">
        <div className="relative"><Search className="pointer-events-none absolute left-3 top-3 h-4 w-4 text-zinc-600" /><Input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Cari modul, misalnya RDAP atau CVE" className="border-white/10 bg-black/20 pl-9" /></div>
        <div className="flex flex-wrap gap-2">{(Object.keys(groupLabels) as GroupFilter[]).map((key) => <button type="button" key={key} onClick={() => setGroup(key)} className={`rounded-lg border px-3 py-2 text-xs transition ${group === key ? "border-red-300/40 bg-red-500/15 text-red-100" : "border-white/10 bg-white/[0.03] text-zinc-500 hover:text-zinc-200"}`}>{groupLabels[key]}</button>)}</div>
      </div>
    </CardHeader>
    <CardContent><div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">{visible.map((item) => <article key={item.id} className="rounded-xl border border-white/10 bg-black/20 p-4 transition hover:border-red-300/25"><div className="flex items-start justify-between gap-3"><h3 className="text-sm font-medium text-zinc-100">{item.name}</h3><Badge variant="outline" className="border-white/10 text-[10px] text-zinc-500">OSINT</Badge></div><p className="mt-2 text-xs leading-5 text-zinc-500">{item.description}</p><div className="mt-3 flex items-center gap-2 text-[11px] text-emerald-300"><ShieldCheck className="h-3.5 w-3.5" /> Scope + audit wajib</div><p className="mt-2 text-[11px] leading-4 text-zinc-600">Keluaran: {item.output ?? "evidence tersanitasi"}</p></article>)}</div>{!visible.length && <p className="py-8 text-center text-sm text-zinc-600">Modul tidak ditemukan pada filter ini.</p>}<p className="mt-4 text-xs text-zinc-600">Menampilkan {visible.length} dari {osintModules.length} modul. Tidak ada credential, password, token, atau data privat yang dikumpulkan.</p></CardContent>
  </Card>;
}
