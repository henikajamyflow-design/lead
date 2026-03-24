import { NextResponse } from "next/server";
import { generateMockLeads } from "@/lib/demo-data";
import { getViewer } from "@/lib/queries";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const ids = (searchParams.get("ids") ?? "").split(",").filter(Boolean);
  const { supabase, user, isDemo } = await getViewer();

  const leads = isDemo || !supabase
    ? generateMockLeads({ targetCount: 5 })
    : ((await (ids.length
        ? supabase.from("leads").select("*").eq("user_id", user.id).in("id", ids)
        : supabase.from("leads").select("*").eq("user_id", user.id).limit(5))).data ?? []) as never[];

  const content = (leads as Array<{ full_name: string; company_name: string; job_title: string; sector: string }>).map((lead, index) => {
    return `Template ${index + 1}\nObjet : Idée rapide pour ${lead.company_name}\n\nBonjour ${lead.full_name},\n\nJe me permets de vous contacter car j'ai remarqué que ${lead.company_name} accélère sur le segment ${lead.sector}. Nous aidons des équipes comparables à structurer leur pipeline outbound avec des données dirigeants plus fraîches et mieux vérifiées.\n\nSi utile, je peux vous partager 3 opportunités concrètes pour votre équipe ${lead.job_title}.\n\nBien à vous,\nVotre équipe Growth\n\n---\n`;
  }).join("\n");

  return new NextResponse(content, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Content-Disposition": 'attachment; filename="leadforge-cold-emails.txt"',
    },
  });
}
