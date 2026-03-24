import { Globe2, MailCheck, PhoneCall, Sparkles } from "lucide-react";
import { Card } from "@/components/ui/card";
import { DashboardStats } from "@/lib/types";
import { formatPercent } from "@/lib/utils";

export function SummaryCards({ stats }: { stats: DashboardStats }) {
  const emailRate = stats.totalLeads ? (stats.verifiedEmails / stats.totalLeads) * 100 : 0;
  const phoneRate = stats.totalLeads ? (stats.verifiedPhones / stats.totalLeads) * 100 : 0;

  const cards = [
    {
      label: "Total leads",
      value: stats.totalLeads,
      meta: `${stats.collectionCount} collectes`,
      icon: Sparkles,
      glow: "from-cyan-400/20 to-cyan-400/0",
    },
    {
      label: "% emails vérifiés",
      value: formatPercent(emailRate),
      meta: `${stats.verifiedEmails} vérifiés`,
      icon: MailCheck,
      glow: "from-emerald-400/20 to-emerald-400/0",
    },
    {
      label: "% téléphones vérifiés",
      value: formatPercent(phoneRate),
      meta: `${stats.verifiedPhones} vérifiés`,
      icon: PhoneCall,
      glow: "from-violet-400/20 to-violet-400/0",
    },
    {
      label: "Top marché",
      value: stats.topCountry,
      meta: stats.topSector,
      icon: Globe2,
      glow: "from-sky-400/20 to-sky-400/0",
    },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      {cards.map((card) => {
        const Icon = card.icon;
        return (
          <Card key={card.label} className="relative overflow-hidden rounded-[28px] p-5">
            <div className={`absolute inset-0 bg-gradient-to-br ${card.glow}`} />
            <div className="relative flex items-start justify-between gap-4">
              <div>
                <p className="text-sm text-zinc-400">{card.label}</p>
                <p className="mt-3 font-display text-3xl font-semibold text-white">{card.value}</p>
                <p className="mt-2 text-sm text-zinc-500">{card.meta}</p>
              </div>
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-white/10 bg-white/5">
                <Icon className="h-5 w-5 text-cyan-300" />
              </div>
            </div>
          </Card>
        );
      })}
    </div>
  );
}
