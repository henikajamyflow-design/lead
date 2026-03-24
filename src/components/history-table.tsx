import { History, Sparkles } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Collection } from "@/lib/types";
import { formatDate } from "@/lib/utils";

export function HistoryTable({ collections }: { collections: Collection[] }) {
  return (
    <Card className="rounded-[28px] p-6">
      <CardHeader className="px-0">
        <div>
          <CardTitle>Historique des collectes</CardTitle>
          <CardDescription className="mt-2">Past searches, volumétrie, statut et note d'exécution.</CardDescription>
        </div>
      </CardHeader>

      <div className="overflow-hidden rounded-[24px] border border-white/8">
        <table className="min-w-full text-sm">
          <thead className="bg-white/[0.03] text-zinc-400">
            <tr>
              {['Prompt', 'Marché', 'Secteur', 'Cible', 'Résultats', 'Statut', 'Date', 'Notes'].map((label) => (
                <th key={label} className="px-4 py-3 text-left font-medium">{label}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {collections.map((collection) => (
              <tr key={collection.id} className="border-t border-white/6 text-zinc-200">
                <td className="px-4 py-4 max-w-[360px] align-top">{collection.prompt}</td>
                <td className="px-4 py-4 align-top">{collection.region}</td>
                <td className="px-4 py-4 align-top">{collection.sector}</td>
                <td className="px-4 py-4 align-top">{collection.target_count}</td>
                <td className="px-4 py-4 align-top">{collection.results_count}</td>
                <td className="px-4 py-4 align-top">
                  <Badge tone={collection.status.includes('failed') ? 'danger' : collection.status.includes('demo') ? 'warning' : 'success'}>
                    {collection.status}
                  </Badge>
                </td>
                <td className="px-4 py-4 align-top text-zinc-400">{formatDate(collection.created_at)}</td>
                <td className="px-4 py-4 align-top text-zinc-400">{collection.notes ?? '—'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {!collections.length && (
        <div className="flex flex-col items-center justify-center gap-3 rounded-[24px] border border-dashed border-white/10 py-14 text-center">
          <History className="h-8 w-8 text-zinc-600" />
          <p className="font-medium text-white">Aucune collecte enregistrée</p>
          <p className="max-w-md text-sm text-zinc-500">Lancez une première recherche depuis “New Collection”.</p>
          <Badge tone="info"><Sparkles className="mr-1 inline h-3.5 w-3.5" />Prêt pour la collecte</Badge>
        </div>
      )}
    </Card>
  );
}
