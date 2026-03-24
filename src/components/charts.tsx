"use client";

import { useMemo } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Collection, Lead } from "@/lib/types";

const COLORS = ["#00F0FF", "#00FF9F", "#8B5CF6", "#38BDF8", "#A855F7", "#22C55E"];

export function DashboardCharts({ leads, collections }: { leads: Lead[]; collections: Collection[] }) {
  const { sectorData, countryData, trendData, topCompanies } = useMemo(() => {
    const sectorMap = new Map<string, number>();
    const countryMap = new Map<string, number>();
    const companyMap = new Map<string, number>();
    const trendMap = new Map<string, number>();

    leads.forEach((lead) => {
      sectorMap.set(lead.sector, (sectorMap.get(lead.sector) ?? 0) + 1);
      const country = lead.location.split(",").at(-1)?.trim() ?? "N/A";
      countryMap.set(country, (countryMap.get(country) ?? 0) + 1);
      companyMap.set(lead.company_name, (companyMap.get(lead.company_name) ?? 0) + 1);
    });

    collections.forEach((collection) => {
      const day = new Date(collection.created_at).toLocaleDateString("fr-FR", { day: "2-digit", month: "2-digit" });
      trendMap.set(day, (trendMap.get(day) ?? 0) + collection.results_count);
    });

    return {
      sectorData: [...sectorMap.entries()].map(([name, value]) => ({ name, value })),
      countryData: [...countryMap.entries()].map(([country, value]) => ({ country, value })).sort((a, b) => b.value - a.value),
      topCompanies: [...companyMap.entries()]
        .map(([company, value]) => ({ company, value }))
        .sort((a, b) => b.value - a.value)
        .slice(0, 10),
      trendData: [...trendMap.entries()].map(([date, value]) => ({ date, value })),
    };
  }, [collections, leads]);

  return (
    <div className="grid gap-4 xl:grid-cols-2">
      <Card className="rounded-[28px] p-6">
        <CardHeader className="px-0">
          <div>
            <CardTitle>% par secteur</CardTitle>
            <CardDescription className="mt-2">Répartition instantanée des dirigeants par vertical métier.</CardDescription>
          </div>
        </CardHeader>
        <div className="h-[320px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie data={sectorData} dataKey="value" nameKey="name" innerRadius={72} outerRadius={108} paddingAngle={4}>
                {sectorData.map((entry, index) => (
                  <Cell key={entry.name} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip contentStyle={tooltipStyle} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </Card>

      <Card className="rounded-[28px] p-6">
        <CardHeader className="px-0">
          <div>
            <CardTitle>Bar chart par pays</CardTitle>
            <CardDescription className="mt-2">Volume de leads détectés par marché prioritaire.</CardDescription>
          </div>
        </CardHeader>
        <div className="h-[320px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={countryData}>
              <CartesianGrid stroke="rgba(255,255,255,0.06)" vertical={false} />
              <XAxis dataKey="country" stroke="#71717A" tickLine={false} axisLine={false} />
              <YAxis stroke="#71717A" tickLine={false} axisLine={false} />
              <Tooltip contentStyle={tooltipStyle} />
              <Bar dataKey="value" radius={[8, 8, 0, 0]} fill="#00F0FF" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Card>

      <Card className="rounded-[28px] p-6">
        <CardHeader className="px-0">
          <div>
            <CardTitle>Trend over time</CardTitle>
            <CardDescription className="mt-2">Résultats produits par jour de collecte.</CardDescription>
          </div>
        </CardHeader>
        <div className="h-[320px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={trendData}>
              <CartesianGrid stroke="rgba(255,255,255,0.06)" vertical={false} />
              <XAxis dataKey="date" stroke="#71717A" tickLine={false} axisLine={false} />
              <YAxis stroke="#71717A" tickLine={false} axisLine={false} />
              <Tooltip contentStyle={tooltipStyle} />
              <Line type="monotone" dataKey="value" stroke="#00FF9F" strokeWidth={3} dot={{ fill: "#00FF9F" }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </Card>

      <Card className="rounded-[28px] p-6">
        <CardHeader className="px-0">
          <div>
            <CardTitle>Top 10 entreprises</CardTitle>
            <CardDescription className="mt-2">Les sociétés les plus représentées dans vos collectes.</CardDescription>
          </div>
        </CardHeader>
        <div className="space-y-3">
          {topCompanies.map((item, index) => (
            <div key={item.company} className="grid grid-cols-[32px_minmax(0,1fr)_60px] items-center gap-3 rounded-2xl border border-white/8 bg-white/[0.02] px-4 py-3">
              <span className="text-sm text-zinc-500">#{index + 1}</span>
              <span className="truncate text-sm font-medium text-white">{item.company}</span>
              <span className="text-right text-sm text-cyan-200">{item.value}</span>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}

const tooltipStyle = {
  background: "rgba(10,10,10,0.94)",
  border: "1px solid rgba(255,255,255,0.08)",
  borderRadius: "16px",
  color: "white",
};
