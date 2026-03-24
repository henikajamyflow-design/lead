import { NextResponse } from "next/server";
import { leadsToExportRows, rowsToCsv } from "@/lib/export";
import { fetchScopedLeads } from "@/lib/server-leads";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const ids = (searchParams.get("ids") ?? "").split(",").filter(Boolean);
  const leads = await fetchScopedLeads(ids);
  const csv = rowsToCsv(leadsToExportRows(leads));

  return new NextResponse(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": 'attachment; filename="leadforge-leads.csv"',
    },
  });
}
