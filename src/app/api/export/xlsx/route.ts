import { NextResponse } from "next/server";
import * as XLSX from "xlsx";
import { rowsToWorkbook, leadsToExportRows } from "@/lib/export";
import { fetchScopedLeads } from "@/lib/server-leads";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const ids = (searchParams.get("ids") ?? "").split(",").filter(Boolean);
  const leads = await fetchScopedLeads(ids);
  const workbook = rowsToWorkbook(leadsToExportRows(leads));
  const buffer = XLSX.write(workbook, { bookType: "xlsx", type: "buffer" });

  return new NextResponse(buffer, {
    headers: {
      "Content-Type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "Content-Disposition": 'attachment; filename="leadforge-leads.xlsx"',
    },
  });
}
