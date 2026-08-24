export type ModuleDefinition = {
  id: string;
  name: string;
  group: "recon" | "assessment" | "intelligence";
  description: string;
  active: boolean;
  manualValidationRequired: boolean;
};

export const moduleCatalog: ModuleDefinition[] = [
  { id: "recon.subdomain", name: "Subdomain", group: "recon", description: "Inventaris subdomain pada scope yang diizinkan.", active: false, manualValidationRequired: true },
  { id: "recon.dns", name: "DNS lookup", group: "recon", description: "Pemetaan record DNS secara berizin.", active: false, manualValidationRequired: true },
  { id: "recon.http", name: "HTTP dan teknologi", group: "recon", description: "Fingerprint HTTP dan teknologi secara terbatas.", active: false, manualValidationRequired: true },
  { id: "recon.certificate", name: "Sertifikat", group: "recon", description: "Inventaris metadata sertifikat TLS.", active: false, manualValidationRequired: true },
  { id: "recon.service", name: "Port dan layanan", group: "recon", description: "Discovery service melalui adapter Nmap.", active: true, manualValidationRequired: true },
  { id: "assessment.headers", name: "Security headers", group: "assessment", description: "Pemeriksaan header keamanan non-destruktif.", active: false, manualValidationRequired: true },
  { id: "assessment.exposure", name: "Exposure", group: "assessment", description: "Pemeriksaan indikasi exposure yang aman.", active: false, manualValidationRequired: true },
  { id: "assessment.injection-signals", name: "Indikasi SQLi, XSS, SSRF", group: "assessment", description: "Sinyal awal tanpa payload eksploitasi.", active: false, manualValidationRequired: true },
  { id: "intelligence.osint", name: "OSINT", group: "intelligence", description: "Kumpulan referensi publik dalam scope.", active: false, manualValidationRequired: true },
  { id: "intelligence.dork-review", name: "Dork review", group: "intelligence", description: "Query dork untuk ditinjau operator.", active: false, manualValidationRequired: true },
  { id: "intelligence.searchsploit", name: "Referensi SearchSploit", group: "intelligence", description: "Pencocokan referensi tanpa menjalankan exploit.", active: false, manualValidationRequired: true },
];
