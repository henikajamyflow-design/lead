import type { ComponentType } from "react";
import Link from "next/link";
import { ArrowRight, DatabaseZap, Globe2, ShieldCheck, Sparkles } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { isDemoMode, isSupabaseConfigured } from "@/lib/env";
import { redirect } from "next/navigation";
import { Button } from "@/components/ui/button";

export default async function MarketingPage() {
  if (!isDemoMode && isSupabaseConfigured) {
    const supabase = await createClient();
    const { data } = await supabase!.auth.getUser();
    if (data.user) redirect("/dashboard");
  }

  return (
    <main className="min-h-screen px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="glass-card-strong overflow-hidden rounded-[36px] px-6 py-8 sm:px-10 sm:py-10">
          <div className="mb-12 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[linear-gradient(135deg,#00F0FF_0%,#8B5CF6_50%,#00FF9F_100%)] font-display text-lg font-bold text-black">LF</div>
              <div>
                <p className="font-display text-xl font-semibold text-white">LeadForge</p>
                <p className="text-xs uppercase tracking-[0.22em] text-zinc-500">Apollo-style Executive Data OS</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Link href="/login"><Button variant="secondary">Connexion</Button></Link>
              <Link href="/signup"><Button>Créer un compte</Button></Link>
            </div>
          </div>

          <div className="grid items-center gap-10 lg:grid-cols-[1.15fr_0.85fr]">
            <div>
              <p className="mb-4 text-xs uppercase tracking-[0.35em] text-cyan-300/80">Ultra-modern B2B prospecting SaaS</p>
              <h1 className="max-w-4xl font-display text-4xl font-semibold leading-tight text-white sm:text-5xl lg:text-6xl">
                Collectez des <span className="neon-text">dirigeants B2B</span> EU / US avec dashboards, exports et conformité GDPR.
              </h1>
              <p className="mt-6 max-w-2xl text-base leading-8 text-zinc-400 sm:text-lg">
                Next.js 15, Tailwind CSS et Supabase réunis dans un cockpit dark mode premium inspiré d'Apollo.io et de Notion dark.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Link href="/dashboard"><Button size="lg">Ouvrir le dashboard <ArrowRight className="h-4 w-4" /></Button></Link>
                <Link href="/new-collection"><Button variant="outline" size="lg">Voir la collecte IA</Button></Link>
              </div>
              <div className="mt-8 grid gap-3 sm:grid-cols-3">
                {[
                  ["Sources publiques", "LinkedIn public, sites corporate, registres, filings"],
                  ["Exports instantanés", "CSV, Excel, Google Sheets + cold emails"],
                  ["Production-ready", "Auth, RLS, Edge Function et pages SaaS complètes"],
                ].map(([title, desc]) => (
                  <div key={title} className="rounded-3xl border border-white/8 bg-white/[0.03] p-4">
                    <p className="font-medium text-white">{title}</p>
                    <p className="mt-2 text-sm leading-6 text-zinc-400">{desc}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid gap-4">
              <div className="glass-card rounded-[28px] p-5">
                <div className="mb-5 flex items-center justify-between">
                  <p className="font-medium text-white">LeadForge Snapshot</p>
                  <Sparkles className="h-5 w-5 text-cyan-300" />
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <FeatureCard icon={DatabaseZap} title="Lead engine" description="Pipeline de collecte branché à Supabase Edge Functions." />
                  <FeatureCard icon={ShieldCheck} title="Compliance" description="Public professional data only - no private personal information." />
                  <FeatureCard icon={Globe2} title="EU + US focus" description="Cartes, secteurs, historique et exports prêts pour RevOps." />
                  <FeatureCard icon={Sparkles} title="Dark SaaS UI" description="Glassmorphism, néons cyan/green, responsive mobile & desktop." />
                </div>
              </div>
              <div className="rounded-[28px] border border-cyan-300/15 bg-cyan-400/10 p-5 text-sm leading-7 text-cyan-50">
                <strong className="text-white">Preview locale :</strong> si Supabase n'est pas encore connecté, l'application bascule en mode démo pour vous laisser parcourir l'UX.
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

function FeatureCard({ icon: Icon, title, description }: { icon: ComponentType<{ className?: string }>; title: string; description: string }) {
  return (
    <div className="rounded-3xl border border-white/8 bg-black/20 p-4">
      <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-2xl border border-white/10 bg-white/5">
        <Icon className="h-5 w-5 text-cyan-300" />
      </div>
      <p className="font-medium text-white">{title}</p>
      <p className="mt-2 text-sm leading-6 text-zinc-400">{description}</p>
    </div>
  );
}
