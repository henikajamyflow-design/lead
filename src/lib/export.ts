import * as XLSX from "xlsx";
import { Lead, LeadExportRow } from "@/lib/types";
import { formatDate } from "@/lib/utils";

export function leadsToExportRows(leads: Lead[]): LeadExportRow[] {
  return leads.map((lead) => ({
    "Dirigeant Nom Complet": lead.full_name,
    Poste: lead.job_title,
    "Nom Entreprise": lead.company_name,
    "Secteur d'Activité": lead.sector,
    "Localisation (Ville, Pays)": lead.location,
    "Email Professionnel": lead.professional_email,
    "Numéro Téléphone Professionnel": lead.professional_phone,
    "LinkedIn URL": lead.linkedin_url,
    "Statut Email": lead.email_status,
    "Statut Téléphone": lead.phone_status,
    "Source Principale": lead.primary_source,
    "Date Collecte": formatDate(lead.collected_at),
  }));
}

export function rowsToCsv(rows: LeadExportRow[]) {
  const headers = Object.keys(rows[0] ?? {
    "Dirigeant Nom Complet": "",
    Poste: "",
    "Nom Entreprise": "",
    "Secteur d'Activité": "",
    "Localisation (Ville, Pays)": "",
    "Email Professionnel": "",
    "Numéro Téléphone Professionnel": "",
    "LinkedIn URL": "",
    "Statut Email": "",
    "Statut Téléphone": "",
    "Source Principale": "",
    "Date Collecte": "",
  });

  const escape = (value: string) => `"${String(value ?? "").replace(/"/g, '""')}"`;
  const body = rows.map((row) => headers.map((header) => escape((row as Record<string, string>)[header])).join(","));
  return [headers.join(","), ...body].join("\n");
}

export function rowsToWorkbook(rows: LeadExportRow[]) {
  const workbook = XLSX.utils.book_new();
  const worksheet = XLSX.utils.json_to_sheet(rows);
  worksheet["!cols"] = [
    { wch: 28 },
    { wch: 18 },
    { wch: 22 },
    { wch: 18 },
    { wch: 24 },
    { wch: 28 },
    { wch: 22 },
    { wch: 34 },
    { wch: 20 },
    { wch: 22 },
    { wch: 32 },
    { wch: 18 },
  ];
  XLSX.utils.book_append_sheet(workbook, worksheet, "LeadForge Leads");
  return workbook;
}
