"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Bell, Sparkles } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const titleMap: Record<string, { title: string; description: string }> = {
  "/dashboard": {
    title: "Command center",
    description: "Pilotez vos collectes EU / US, vos exports et vos dashboards en un seul endroit.",
  },
  "/my-leads": {
    title: "My Leads",
    description: "Tableau complet, filtres avancés, bulk export et actions ligne par ligne.",
  },
  "/new-collection": {
    title: "New Collection",
    description: "Décrivez la recherche en langage naturel et lancez la collecte.",
  },
  "/history": {
    title: "Collection History",
    description: "Retrouvez vos recherches, volumes et statuts d'exécution.",
  },
  "/settings": {
    title: "Settings",
    description: "Profil, plan, préférences d'export et notice GDPR.",
  },
};

export function Topbar() {
  const pathname = usePathname();
  const content = titleMap[pathname] ?? titleMap["/dashboard"];

  return (
    <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
      <div>
        <p className="text-xs uppercase tracking-[0.28em] text-zinc-500">LeadForge OS</p>
        <h1 className="mt-2 font-display text-3xl font-semibold text-white">{content.title}</h1>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-zinc-400">{content.description}</p>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative min-w-[280px]">
          <Input
            placeholder="Recherche rapide : Allemagne SaaS 30 CEOs"
            className="pr-11"
            aria-label="Recherche rapide"
          />
          <Sparkles className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-cyan-300" />
        </div>
        <Button variant="secondary" size="icon" aria-label="Notifications">
          <Bell className="h-4 w-4" />
        </Button>
        <Link href="/new-collection">
          <Button>Nouvelle collecte</Button>
        </Link>
      </div>
    </div>
  );
}
