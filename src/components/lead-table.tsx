"use client";

import { useMemo, useState } from "react";
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { Download, Eye, FileSpreadsheet, MailPlus, Search, Trash2 } from "lucide-react";
import { Lead } from "@/lib/types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { deleteLeadAction } from "@/lib/actions/collections";

const helper = createColumnHelper<Lead>();

export function LeadTable({ leads }: { leads: Lead[] }) {
  const [globalFilter, setGlobalFilter] = useState("");
  const [sectorFilter, setSectorFilter] = useState("all");
  const [emailFilter, setEmailFilter] = useState("all");
  const [selectedLead, setSelectedLead] = useState<Lead | null>(leads[0] ?? null);

  const filteredData = useMemo(() => {
    return leads.filter((lead) => {
      const haystack = `${lead.full_name} ${lead.company_name} ${lead.sector} ${lead.location}`.toLowerCase();
      const matchesSearch = haystack.includes(globalFilter.toLowerCase());
      const matchesSector = sectorFilter === "all" || lead.sector === sectorFilter;
      const matchesEmail = emailFilter === "all" || lead.email_status === emailFilter;
      return matchesSearch && matchesSector && matchesEmail;
    });
  }, [emailFilter, globalFilter, leads, sectorFilter]);

  const columns = useMemo(
    () => [
      helper.display({
        id: "select",
        header: ({ table }) => (
          <input
            type="checkbox"
            className="h-4 w-4 rounded border-white/20 bg-transparent"
            checked={table.getIsAllPageRowsSelected()}
            onChange={table.getToggleAllPageRowsSelectedHandler()}
          />
        ),
        cell: ({ row }) => (
          <input
            type="checkbox"
            className="h-4 w-4 rounded border-white/20 bg-transparent"
            checked={row.getIsSelected()}
            disabled={!row.getCanSelect()}
            onChange={row.getToggleSelectedHandler()}
          />
        ),
      }),
      helper.accessor("full_name", { header: "Dirigeant Nom Complet" }),
      helper.accessor("job_title", { header: "Poste" }),
      helper.accessor("company_name", { header: "Nom Entreprise" }),
      helper.accessor("sector", { header: "Secteur d'Activité" }),
      helper.accessor("location", { header: "Localisation (Ville, Pays)" }),
      helper.accessor("professional_email", { header: "Email Professionnel" }),
      helper.accessor("professional_phone", { header: "Numéro Téléphone Professionnel" }),
      helper.accessor("linkedin_url", {
        header: "LinkedIn URL",
        cell: ({ getValue }) => {
          const value = getValue();
          return value ? (
            <a href={value} target="_blank" rel="noreferrer" className="text-cyan-300 underline decoration-white/10 underline-offset-4">
              Profil public
            </a>
          ) : (
            <span className="text-zinc-500">—</span>
          );
        },
      }),
      helper.accessor("email_status", {
        header: "Statut Email",
        cell: ({ getValue }) => <StatusBadge value={getValue()} />,
      }),
      helper.accessor("phone_status", {
        header: "Statut Téléphone",
        cell: ({ getValue }) => <StatusBadge value={getValue()} />,
      }),
      helper.accessor("primary_source", { header: "Source Principale" }),
      helper.accessor("collected_at", {
        header: "Date Collecte",
        cell: ({ getValue }) => new Date(getValue()).toLocaleDateString("fr-FR"),
      }),
      helper.display({
        id: "actions",
        header: "Actions",
        cell: ({ row }) => {
          const lead = row.original;
          return (
            <div className="flex items-center gap-2">
              <Button variant="secondary" size="sm" onClick={() => setSelectedLead(lead)}>
                <Eye className="h-3.5 w-3.5" />
                View
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => window.open(`/api/export/xlsx?ids=${lead.id}`, "_blank")}
              >
                <Download className="h-3.5 w-3.5" />
                Export single
              </Button>
              <form action={deleteLeadAction}>
                <input type="hidden" name="leadId" value={lead.id} />
                <input type="hidden" name="path" value="/my-leads" />
                <Button variant="destructive" size="sm">
                  <Trash2 className="h-3.5 w-3.5" />
                  Delete
                </Button>
              </form>
            </div>
          );
        },
      }),
    ],
    [],
  );

  const table = useReactTable({
    data: filteredData,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    enableRowSelection: true,
    initialState: {
      pagination: { pageIndex: 0, pageSize: 8 },
    },
  });

  const selectedIds = table.getSelectedRowModel().rows.map((row) => row.original.id).join(",");
  const sectors = [...new Set(leads.map((lead) => lead.sector))];

  return (
    <div className="grid gap-4 xl:grid-cols-[1.45fr_0.55fr]">
      <Card className="overflow-hidden rounded-[28px] p-0">
        <div className="border-b border-white/8 p-5">
          <div className="flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
            <div className="flex flex-1 flex-col gap-3 sm:flex-row">
              <div className="relative flex-1">
                <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500" />
                <Input value={globalFilter} onChange={(e) => setGlobalFilter(e.target.value)} placeholder="Search leads, company, sector, location" className="pl-11" />
              </div>
              <select value={sectorFilter} onChange={(e) => setSectorFilter(e.target.value)} className="h-11 rounded-2xl border border-white/10 bg-white/[0.03] px-4 text-sm text-white outline-none">
                <option value="all" className="bg-black">Tous les secteurs</option>
                {sectors.map((sector) => (
                  <option key={sector} value={sector} className="bg-black">{sector}</option>
                ))}
              </select>
              <select value={emailFilter} onChange={(e) => setEmailFilter(e.target.value)} className="h-11 rounded-2xl border border-white/10 bg-white/[0.03] px-4 text-sm text-white outline-none">
                <option value="all" className="bg-black">Tous les statuts email</option>
                <option value="Vérifié" className="bg-black">Vérifié</option>
                <option value="Probable" className="bg-black">Probable</option>
                <option value="Non vérifié" className="bg-black">Non vérifié</option>
              </select>
            </div>

            <div className="flex flex-wrap gap-2">
              <Button variant="secondary" size="sm" onClick={() => window.open(`/api/cold-email?ids=${selectedIds}`, "_blank")} disabled={!selectedIds}>
                <MailPlus className="h-4 w-4" />
                Cold emails
              </Button>
              <Button variant="outline" size="sm" onClick={() => window.open(`/api/export/csv?ids=${selectedIds}`, "_blank")} disabled={!selectedIds}>
                <Download className="h-4 w-4" />
                CSV
              </Button>
              <Button variant="outline" size="sm" onClick={() => window.open(`/api/export/xlsx?ids=${selectedIds}`, "_blank")} disabled={!selectedIds}>
                <FileSpreadsheet className="h-4 w-4" />
                Excel
              </Button>
              <Button size="sm" onClick={() => window.open(`/api/export/google-sheets?ids=${selectedIds}`, "_blank")} disabled={!selectedIds}>
                Google Sheets
              </Button>
            </div>
          </div>
        </div>

        <div className="scrollbar-thin overflow-auto">
          <table className="min-w-[1400px] text-sm">
            <thead className="bg-white/[0.03] text-left text-zinc-400">
              {table.getHeaderGroups().map((headerGroup) => (
                <tr key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <th key={header.id} className="px-4 py-3 font-medium">
                      {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody>
              {table.getRowModel().rows.map((row) => (
                <tr key={row.id} className="border-t border-white/6 text-zinc-200 hover:bg-white/[0.02]">
                  {row.getVisibleCells().map((cell) => (
                    <td key={cell.id} className="px-4 py-4 align-top">
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="flex items-center justify-between border-t border-white/8 px-5 py-4 text-sm text-zinc-400">
          <div>{table.getFilteredSelectedRowModel().rows.length} lignes sélectionnées</div>
          <div className="flex items-center gap-2">
            <Button variant="secondary" size="sm" onClick={() => table.previousPage()} disabled={!table.getCanPreviousPage()}>
              Précédent
            </Button>
            <span>
              Page {table.getState().pagination.pageIndex + 1} / {table.getPageCount() || 1}
            </span>
            <Button variant="secondary" size="sm" onClick={() => table.nextPage()} disabled={!table.getCanNextPage()}>
              Suivant
            </Button>
          </div>
        </div>
      </Card>

      <Card className="rounded-[28px] p-6">
        <h3 className="font-display text-lg font-semibold text-white">View lead</h3>
        {selectedLead ? (
          <div className="mt-5 space-y-4 text-sm">
            <div>
              <p className="text-zinc-500">Nom</p>
              <p className="mt-1 text-base font-medium text-white">{selectedLead.full_name}</p>
            </div>
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-1">
              <InfoBlock label="Poste" value={selectedLead.job_title} />
              <InfoBlock label="Entreprise" value={selectedLead.company_name} />
              <InfoBlock label="Secteur" value={selectedLead.sector} />
              <InfoBlock label="Localisation" value={selectedLead.location} />
              <InfoBlock label="Email pro" value={selectedLead.professional_email || '—'} />
              <InfoBlock label="Téléphone pro" value={selectedLead.professional_phone || '—'} />
            </div>
            <div className="rounded-2xl border border-white/8 bg-white/[0.02] p-4">
              <p className="text-zinc-500">Statuts</p>
              <div className="mt-3 flex flex-wrap gap-2">
                <StatusBadge value={selectedLead.email_status} />
                <StatusBadge value={selectedLead.phone_status} />
              </div>
            </div>
            <div className="rounded-2xl border border-white/8 bg-white/[0.02] p-4">
              <p className="text-zinc-500">Source principale</p>
              <p className="mt-2 leading-6 text-zinc-300">{selectedLead.primary_source}</p>
            </div>
          </div>
        ) : (
          <p className="mt-4 text-sm text-zinc-500">Sélectionnez une ligne pour voir le détail.</p>
        )}
      </Card>
    </div>
  );
}

function StatusBadge({ value }: { value: Lead['email_status'] | Lead['phone_status'] }) {
  return <Badge tone={value === 'Vérifié' ? 'success' : value === 'Probable' ? 'warning' : 'default'}>{value}</Badge>;
}

function InfoBlock({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-white/8 bg-white/[0.02] p-4">
      <p className="text-zinc-500">{label}</p>
      <p className="mt-2 leading-6 text-white">{value}</p>
    </div>
  );
}
