export type ModuleDefinition = {
  id: string;
  name: string;
  group: "recon" | "assessment" | "intelligence";
  description: string;
  active: boolean;
  manualValidationRequired: boolean;
  input?: string;
  output?: string;
  previewOnly?: boolean;
  safetyNote?: string;
};

export const moduleCatalog: ModuleDefinition[] = [
  { id: "recon.subdomain", name: "Subdomain", group: "recon", description: "Inventaris subdomain pada scope yang diizinkan.", active: false, manualValidationRequired: true },
  { id: "recon.dns", name: "DNS lookup", group: "recon", description: "Pemetaan record DNS secara berizin.", active: false, manualValidationRequired: true },
  { id: "recon.http", name: "HTTP pasif dan teknologi", group: "recon", description: "Membaca metadata HEAD dan sinyal teknologi secara terbatas.", active: true, manualValidationRequired: true },
  { id: "recon.certificate", name: "Inventaris sertifikat", group: "recon", description: "Membaca metadata sertifikat TLS peer tanpa menyimpan material kunci.", active: true, manualValidationRequired: true },
  { id: "recon.service", name: "Port dan layanan", group: "recon", description: "Discovery service melalui adapter Nmap.", active: true, manualValidationRequired: true },
  { id: "assessment.headers", name: "Security headers", group: "assessment", description: "Pemeriksaan header keamanan non-destruktif.", active: false, manualValidationRequired: true },
  { id: "assessment.exposure", name: "Exposure", group: "assessment", description: "Pemeriksaan indikasi exposure yang aman.", active: false, manualValidationRequired: true },
  { id: "assessment.injection-signals", name: "Indikasi SQLi, XSS, SSRF", group: "assessment", description: "Sinyal awal tanpa payload eksploitasi.", active: false, manualValidationRequired: true },
  { id: "intelligence.osint", name: "OSINT", group: "intelligence", description: "Kumpulan referensi publik dalam scope.", active: false, manualValidationRequired: true },
  { id: "intelligence.dork-review", name: "Dork review", group: "intelligence", description: "Query dork untuk ditinjau operator.", active: false, manualValidationRequired: true },
  { id: "intelligence.searchsploit", name: "Referensi SearchSploit", group: "intelligence", description: "Pencocokan referensi tanpa menjalankan exploit.", active: false, manualValidationRequired: true },
  { id: "osint.rdap-domain", name: "RDAP domain", group: "intelligence", description: "Metadata registrasi domain dari layanan RDAP publik.", input: "Domain dalam allowlist", output: "Registrar, status, tanggal, nameserver", active: true, manualValidationRequired: true, safetyNote: "Metadata publik saja; tanpa data pribadi berlebihan." },
  { id: "osint.whois-ip", name: "WHOIS IP", group: "intelligence", description: "Ringkasan kepemilikan jaringan IP secara publik.", input: "IP hasil resolusi scope", output: "Organisasi, netblock, kontak abuse generik", active: false, previewOnly: true, manualValidationRequired: true, safetyNote: "Tidak menghubungi kontak personal." },
  { id: "osint.asn-bgp", name: "ASN/BGP", group: "intelligence", description: "Korelasi IP dengan ASN dan prefix publik.", input: "IP atau ASN dalam scope", output: "ASN, prefix, organisasi, negara", active: false, previewOnly: true, manualValidationRequired: true, safetyNote: "Sumber routing publik, tanpa pemindaian jaringan." },
  { id: "osint.dns-history", name: "Riwayat DNS", group: "intelligence", description: "Timeline perubahan record DNS dari sumber berizin.", input: "Domain dan provider data", output: "Record, waktu, provenance", active: false, previewOnly: true, manualValidationRequired: true, safetyNote: "Provider API harus dikonfigurasi operator." },
  { id: "osint.ct-inventory", name: "Certificate Transparency", group: "intelligence", description: "Inventaris nama host dari log sertifikat publik.", input: "Domain dalam allowlist", output: "SAN/hostname unik dan waktu terlihat", active: true, manualValidationRequired: true, safetyNote: "Kandidat wajib diverifikasi dan tetap tunduk scope." },
  { id: "osint.passive-subdomain-correlation", name: "Korelasi subdomain pasif", group: "intelligence", description: "Menggabungkan kandidat dari sumber publik tanpa probing aktif.", input: "Domain dan evidence publik", output: "Host kandidat dengan provenance", active: false, previewOnly: true, manualValidationRequired: true, safetyNote: "Tidak melakukan brute force atau resolve otomatis." },
  { id: "osint.security-headers", name: "Snapshot security headers", group: "intelligence", description: "Ringkasan header keamanan dari respons yang disetujui.", input: "URL hasil allowlist", output: "Kontrol header dan evidence", active: false, previewOnly: true, manualValidationRequired: true, safetyNote: "HEAD terbatas; tanpa payload." },
  { id: "osint.robots-sitemap", name: "Robots dan sitemap", group: "intelligence", description: "Membaca metadata robots.txt dan sitemap secara terbatas.", input: "URL dalam allowlist", output: "Path publik dan aturan crawler", active: true, manualValidationRequired: true, safetyNote: "Tidak crawling path secara otomatis." },
  { id: "osint.favicon-hash", name: "Favicon hash", group: "intelligence", description: "Hash favicon untuk korelasi aset publik.", input: "URL favicon publik", output: "Hash dan relasi aset", active: true, manualValidationRequired: true, safetyNote: "Ukuran respons dibatasi dan bytes tidak disimpan." },
  { id: "osint.technology-fingerprint", name: "Fingerprint teknologi", group: "intelligence", description: "Sinyal pasif server/client tanpa eksploitasi.", input: "Metadata HTTP tersanitasi", output: "Produk, versi indikatif, confidence", active: false, previewOnly: true, manualValidationRequired: true, safetyNote: "Versi adalah indikasi dan harus ditinjau manual." },
  { id: "osint.email-security", name: "SPF/DKIM/DMARC", group: "intelligence", description: "Penilaian konfigurasi keamanan email melalui DNS publik.", input: "Domain dalam allowlist", output: "Record dan rekomendasi", active: true, manualValidationRequired: true, safetyNote: "Tidak mengirim email atau menguji akun." },
  { id: "osint.mx-infrastructure", name: "Infrastruktur MX", group: "intelligence", description: "Metadata provider MX dan redundansi email.", input: "Domain dalam allowlist", output: "Host MX, prioritas, provider indikatif", active: true, manualValidationRequired: true, safetyNote: "DNS lookup terbatas dan rate-limited." },
  { id: "osint.nameserver-infrastructure", name: "Infrastruktur nameserver", group: "intelligence", description: "Analisis nameserver, provider, dan konsistensi record.", input: "Domain dalam allowlist", output: "NS, IP, provider indikatif", active: true, manualValidationRequired: true, safetyNote: "Tidak melakukan zone transfer." },
  { id: "osint.cloud-dns-metadata", name: "Metadata cloud/storage", group: "intelligence", description: "Sinyal cloud dari DNS publik tanpa mengakses bucket/objek.", input: "Host dalam allowlist", output: "Provider indikatif dan evidence DNS", active: false, previewOnly: true, manualValidationRequired: true, safetyNote: "Tidak mencoba nama bucket atau kredensial." },
  { id: "osint.redirect-chain", name: "Rantai redirect HEAD", group: "intelligence", description: "Ringkasan redirect terbatas dengan metode HEAD.", input: "URL dalam allowlist", output: "Status dan host per hop", active: true, manualValidationRequired: true, safetyNote: "Hop, timeout, dan host dibatasi." },
  { id: "osint.archive-metadata", name: "Metadata arsip web", group: "intelligence", description: "Indeks URL publik dari layanan arsip yang disetujui.", input: "Domain dalam allowlist", output: "URL, timestamp, tipe konten", active: true, manualValidationRequired: true, safetyNote: "Tidak mengambil isi arsip secara massal." },
  { id: "osint.public-repository-metadata", name: "Metadata repository publik", group: "intelligence", description: "Referensi repository publik tanpa token atau isi privat.", input: "Organisasi/repository yang disetujui", output: "URL, bahasa, branch, aktivitas", active: true, manualValidationRequired: true, safetyNote: "Secret scanning dan pengambilan isi berada di luar scope MVP." },
  { id: "osint.breach-indicator", name: "Indikator breach via API", group: "intelligence", description: "Status indikator domain melalui provider resmi tanpa menyimpan data bocor mentah.", input: "Domain organisasi dan API berizin", output: "Status, waktu, provenance", active: false, previewOnly: true, manualValidationRequired: true, safetyNote: "Tidak mencari, menampilkan, atau menyimpan password, token, maupun data personal." },
  { id: "osint.cve-cpe-correlation", name: "Korelasi CVE/CPE", group: "intelligence", description: "Pencocokan fingerprint teknologi dengan referensi kerentanan.", input: "Produk/versi dengan confidence", output: "CVE/CPE dan confidence", active: false, previewOnly: true, manualValidationRequired: true, safetyNote: "Referensi tidak berarti temuan terkonfirmasi; validasi manual wajib." },
];

export const osintModuleCatalog = moduleCatalog.filter((module) => module.id.startsWith("osint."));
