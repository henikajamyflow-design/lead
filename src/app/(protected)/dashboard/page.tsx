import { CollectionLauncher } from "@/components/collection-launcher";
import { DashboardCharts } from "@/components/charts";
import { SummaryCards } from "@/components/summary-cards";
import { WorldFocusMap } from "@/components/world-focus-map";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getDashboardPayload } from "@/lib/queries";
import { formatDate } from "@/lib/utils";

export default async function DashboardPage() {
  const { stats, leads, collections, isDemo } = await getDashboardPayload();
  const countries = Array.from(
    leads.reduce<Map<string, number>>((acc, lead) => {
      const country = lead.location.split(",").at(-1)?.trim() ?? "N/A";
      acc.set(country, (acc.get(country) ?? 0) + 1);
      return acc;
    }, new Map()),
  )
    .map(([country, count]) => ({ country, count }))
    .sort((a, b) => b.count - a.count);

  return (
    <div className="space-y-4">
      <SummaryCards stats={stats} />
      <CollectionLauncher />
      <DashboardCharts leads={leads} collections={collections} />
      <div className="grid gap-4 xl:grid-cols-[1.15fr_0.85fr]">
        <WorldFocusMap countries={countries} />
        <Card className="rounded-[28px] p-6">
          <CardHeader className="px-0">
            <div>
              <CardTitle>Summary Stats</CardTitle>
              <CardDescription className="mt-2">Vue exécutive des dernières collectes et du statut du moteur.</CardDescription>
            </div>
          </CardHeader>
          <div className="space-y-3 text-sm">
            <Info label="Total dirigeants" value={String(stats.totalLeads)} />
            <Info label="% emails vérifiés" value={`${Math.round((stats.verifiedEmails / Math.max(stats.totalLeads, 1)) * 100)}%`} />
            <Info label="Top secteur" value={stats.topSector} />
            <Info label="Top pays" value={stats.topCountry} />
            <Info label="Dernière collecte" value={collections[0] ? formatDate(collections[0].created_at) : '—'} />
            <div className="rounded-2xl border border-white/8 bg-white/[0.02] p-4 leading-6 text-zinc-400">
              {isDemo
                ? "Mode démonstration actif. Connectez Supabase + Edge Function pour exécuter des collectes réelles via vos sources publiques professionnelles."
                : "Supabase connecté. Les leads, profils et historiques sont protégés par RLS côté Postgres."}
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-white/8 bg-white/[0.02] p-4">
      <p className="text-zinc-500">{label}</p>
      <p className="mt-2 text-base font-medium text-white">{value}</p>
    </div>
  );
}
