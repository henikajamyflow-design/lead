import { generateMockLeads } from "@/lib/demo-data";
import { getViewer } from "@/lib/queries";
import { Lead } from "@/lib/types";

export async function fetchScopedLeads(ids: string[] = []): Promise<Lead[]> {
  const { supabase, user, isDemo } = await getViewer();

  if (isDemo || !supabase) {
    const mockLeads = generateMockLeads({ targetCount: Math.max(ids.length, 12) });
    return ids.length ? mockLeads.filter((lead) => ids.includes(lead.id)) : mockLeads;
  }

  let query = supabase.from("leads").select("*").eq("user_id", user.id).order("created_at", { ascending: false });
  if (ids.length) {
    query = query.in("id", ids);
  }

  const { data } = await query;
  return (data as Lead[]) ?? [];
}
