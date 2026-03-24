import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { Collection, DashboardStats, Lead, Profile } from "@/lib/types";
import { generateMockLeads, getDemoCollections, getDemoProfile } from "@/lib/demo-data";
import { isDemoMode } from "@/lib/env";

export async function getViewer() {
  if (isDemoMode) {
    return {
      user: { id: "demo-user", email: "demo@leadforge.ai" },
      profile: getDemoProfile(),
      isDemo: true,
      supabase: null,
    };
  }

  const supabase = await createClient();
  if (!supabase) redirect("/login");

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const profileSeed = {
    id: user.id,
    full_name: user.user_metadata?.full_name ?? user.email?.split("@")[0] ?? "Utilisateur LeadForge",
    company: user.user_metadata?.company ?? "",
    plan: user.user_metadata?.plan ?? "Starter",
  };

  await supabase.from("profiles").upsert(profileSeed, { onConflict: "id" });

  const { data: profile } = await supabase.from("profiles").select("*").eq("id", user.id).single();

  return {
    user,
    profile: (profile as Profile | null) ?? (profileSeed as Profile),
    isDemo: false,
    supabase,
  };
}

export async function getDashboardPayload() {
  const { user, profile, isDemo, supabase } = await getViewer();

  if (isDemo || !supabase) {
    const leads = generateMockLeads({ targetCount: 24 });
    const collections = getDemoCollections();
    return buildPayload({ user, profile, leads, collections, isDemo });
  }

  const [{ data: leads }, { data: collections }] = await Promise.all([
    supabase.from("leads").select("*").eq("user_id", user.id).order("created_at", { ascending: false }),
    supabase.from("collections").select("*").eq("user_id", user.id).order("created_at", { ascending: false }),
  ]);

  return buildPayload({
    user,
    profile,
    leads: (leads as Lead[]) ?? [],
    collections: (collections as Collection[]) ?? [],
    isDemo,
  });
}

export async function getLeadsPayload() {
  const payload = await getDashboardPayload();
  return payload;
}

function buildPayload({
  user,
  profile,
  leads,
  collections,
  isDemo,
}: {
  user: { id: string; email?: string | null };
  profile: Profile;
  leads: Lead[];
  collections: Collection[];
  isDemo: boolean;
}) {
  const verifiedEmails = leads.filter((lead) => lead.email_status === "Vérifié").length;
  const verifiedPhones = leads.filter((lead) => lead.phone_status === "Vérifié").length;
  const sectorCounts = countBy(leads.map((lead) => lead.sector));
  const countryCounts = countBy(leads.map((lead) => lead.location.split(",").at(-1)?.trim() ?? "N/A"));

  const stats: DashboardStats = {
    totalLeads: leads.length,
    verifiedEmails,
    verifiedPhones,
    topSector: topKey(sectorCounts),
    topCountry: topKey(countryCounts),
    collectionCount: collections.length,
  };

  return {
    user,
    profile,
    leads,
    collections,
    stats,
    isDemo,
  };
}

function countBy(values: string[]) {
  return values.reduce<Record<string, number>>((acc, value) => {
    acc[value] = (acc[value] ?? 0) + 1;
    return acc;
  }, {});
}

function topKey(record: Record<string, number>) {
  const first = Object.entries(record).sort((a, b) => b[1] - a[1])[0];
  return first?.[0] ?? "—";
}
