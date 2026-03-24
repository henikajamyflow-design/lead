import { subDays } from "date-fns";
import { Collection, CollectionFilters, Lead, Profile } from "@/lib/types";

const demoProfile: Profile = {
  id: "demo-user",
  full_name: "Alex Martin",
  company: "LeadForge Demo Labs",
  plan: "Growth",
  export_preferences: "xlsx, google-sheets",
};

const companyPool = [
  ["NeonStack", "SaaS", "Berlin, Allemagne", "https://www.linkedin.com/company/neonstack", "https://neonstack.example"],
  ["SignalLoop", "Fintech", "Paris, France", "https://www.linkedin.com/company/signalloop", "https://signalloop.example"],
  ["AtlasOps", "Cybersecurity", "Amsterdam, Pays-Bas", "https://www.linkedin.com/company/atlasops", "https://atlasops.example"],
  ["VoltScale", "Climate Tech", "Stockholm, Suède", "https://www.linkedin.com/company/voltscale", "https://voltscale.example"],
  ["BrightPath AI", "AI", "Lisbonne, Portugal", "https://www.linkedin.com/company/brightpathai", "https://brightpath.example"],
  ["CloudMint", "SaaS", "Munich, Allemagne", "https://www.linkedin.com/company/cloudmint", "https://cloudmint.example"],
  ["Northgrid", "Industrial Tech", "Lyon, France", "https://www.linkedin.com/company/northgrid", "https://northgrid.example"],
  ["OrbitFlow", "MarTech", "Austin, États-Unis", "https://www.linkedin.com/company/orbitflow", "https://orbitflow.example"],
  ["QuantBridge", "Fintech", "New York, États-Unis", "https://www.linkedin.com/company/quantbridge", "https://quantbridge.example"],
  ["PulseForge", "HealthTech", "Boston, États-Unis", "https://www.linkedin.com/company/pulseforge", "https://pulseforge.example"],
  ["Cobalt CRM", "SaaS", "Madrid, Espagne", "https://www.linkedin.com/company/cobaltcrm", "https://cobaltcrm.example"],
  ["HelioOps", "Energy Tech", "Milan, Italie", "https://www.linkedin.com/company/helioops", "https://helioops.example"],
] as const;

const firstNames = ["Lina", "Hugo", "Emma", "Noah", "Jules", "Maya", "Nolan", "Iris", "Yanis", "Clara", "Milo", "Sarah"];
const lastNames = ["Durand", "Meyer", "Rossi", "Lopez", "Muller", "Lefevre", "Dubois", "Moreau", "Nguyen", "Bernard", "Lambert", "Garcia"];
const titles = ["CEO", "Founder", "Co-Founder & CTO", "CMO", "Chief Revenue Officer", "VP Growth"] as const;

export function getDemoProfile() {
  return demoProfile;
}

export function getDemoCollections(): Collection[] {
  return [
    {
      id: "demo-col-1",
      prompt: "Collecte pour : Allemagne, secteur SaaS, cible 30 dirigeants",
      region: "Allemagne",
      sector: "SaaS",
      target_count: 30,
      results_count: 24,
      status: "completed_demo",
      created_at: subDays(new Date(), 1).toISOString(),
      completed_at: subDays(new Date(), 1).toISOString(),
      notes: "Mode démonstration avec données fictives professionnelles.",
    },
    {
      id: "demo-col-2",
      prompt: "France Tech 25 CEOs",
      region: "France",
      sector: "Tech",
      target_count: 25,
      results_count: 18,
      status: "completed_demo",
      created_at: subDays(new Date(), 4).toISOString(),
      completed_at: subDays(new Date(), 4).toISOString(),
      notes: "Connectez Supabase + Edge Function pour une collecte réelle.",
    },
  ];
}

export function generateMockLeads(filters?: Partial<CollectionFilters>): Lead[] {
  const region = filters?.region?.toLowerCase() ?? "";
  const sectorFilter = filters?.sector?.toLowerCase() ?? "";
  const target = Math.min(filters?.targetCount ?? 18, 36);

  const scopedCompanies = companyPool.filter(([_, sector, location]) => {
    const matchRegion = !region || location.toLowerCase().includes(region) || region === "europe";
    const matchSector = !sectorFilter || sector.toLowerCase().includes(sectorFilter) || sectorFilter.includes("tech");
    return matchRegion && matchSector;
  });

  const source = scopedCompanies.length ? scopedCompanies : companyPool;

  return Array.from({ length: target }).map((_, index) => {
    const company = source[index % source.length];
    const [companyName, sector, location, linkedinUrl, website] = company;
    const firstName = firstNames[index % firstNames.length];
    const lastName = lastNames[(index * 3) % lastNames.length];
    const full_name = `${firstName} ${lastName}`;
    const title = titles[index % titles.length];
    const email_status = index % 3 === 0 ? "Vérifié" : index % 2 === 0 ? "Probable" : "Non vérifié";
    const phone_status = index % 4 === 0 ? "Vérifié" : index % 3 === 0 ? "Probable" : "Non vérifié";
    const domain = website.replace("https://", "");

    return {
      id: `demo-lead-${index + 1}`,
      collection_id: index < 12 ? "demo-col-1" : "demo-col-2",
      full_name,
      job_title: title,
      company_name: companyName,
      sector,
      location,
      professional_email:
        email_status === "Non vérifié" ? "" : `${firstName.toLowerCase()}.${lastName.toLowerCase()}@${domain}`,
      professional_phone:
        phone_status === "Non vérifié" ? "" : `+33 1 80 ${String(40 + index).padStart(2, "0")} ${String(10 + index).padStart(2, "0")} ${String(20 + index).padStart(2, "0")}`,
      linkedin_url: `${linkedinUrl}/${firstName.toLowerCase()}-${lastName.toLowerCase()}`,
      email_status,
      phone_status,
      primary_source: "Jeu de démonstration LeadForge — configurez l'Edge Function pour les sources publiques réelles",
      collected_at: subDays(new Date(), index % 5).toISOString(),
      created_at: subDays(new Date(), index % 5).toISOString(),
    };
  });
}
