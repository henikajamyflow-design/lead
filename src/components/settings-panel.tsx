"use client";

import { useActionState, useEffect } from "react";
import { ShieldCheck } from "lucide-react";
import { toast } from "sonner";
import { updateProfileAction, type ActionState } from "@/lib/actions/collections";
import { Profile } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

const initialState: ActionState = { success: false, message: "" };

export function SettingsPanel({ profile, isDemo }: { profile: Profile; isDemo: boolean }) {
  const [state, formAction, pending] = useActionState(updateProfileAction, initialState);

  useEffect(() => {
    if (!state.message) return;
    if (state.success) toast.success(state.message);
    else toast.error(state.message);
  }, [state]);

  return (
    <div className="grid gap-4 xl:grid-cols-[1fr_0.7fr]">
      <Card className="rounded-[28px] p-6">
        <CardHeader className="px-0">
          <div>
            <CardTitle>Profil utilisateur</CardTitle>
            <CardDescription className="mt-2">Nom, société, plan et préférences d'export.</CardDescription>
          </div>
        </CardHeader>
        <form action={formAction} className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Input name="full_name" defaultValue={profile.full_name} placeholder="Nom complet" />
            <Input name="company" defaultValue={profile.company} placeholder="Entreprise" />
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <select
              name="plan"
              defaultValue={profile.plan}
              className="h-11 rounded-2xl border border-white/10 bg-white/[0.03] px-4 text-sm text-white outline-none"
            >
              <option className="bg-black">Starter</option>
              <option className="bg-black">Growth</option>
              <option className="bg-black">Scale</option>
              <option className="bg-black">Enterprise</option>
            </select>
            <Input name="export_preferences" defaultValue={profile.export_preferences ?? "xlsx, google-sheets"} placeholder="xlsx, csv, google-sheets" />
          </div>
          <Textarea
            value="Public professional data only - no private personal information. Email/phone statuses must always be shown with explicit verification labels."
            readOnly
          />
          <Button type="submit" disabled={pending}>{pending ? 'Enregistrement…' : 'Enregistrer les paramètres'}</Button>
        </form>
      </Card>

      <Card className="rounded-[28px] p-6">
        <CardHeader className="px-0">
          <div>
            <CardTitle>GDPR & conformité</CardTitle>
            <CardDescription className="mt-2">Notice produit visible pour les équipes commerciales et RevOps.</CardDescription>
          </div>
        </CardHeader>
        <div className="space-y-4 rounded-[24px] border border-emerald-400/15 bg-emerald-400/10 p-5 text-sm leading-6 text-emerald-100">
          <div className="flex items-center gap-3 font-medium text-white">
            <ShieldCheck className="h-5 w-5 text-emerald-300" />
            Public professional data only - no private personal information.
          </div>
          <ul className="list-disc space-y-2 pl-5 text-emerald-50/90">
            <li>Sources autorisées : profils LinkedIn publics, sites corporate, registres officiels, communiqués, filings.</li>
            <li>Jamais d'adresse personnelle, téléphone privé ou donnée sensible.</li>
            <li>Les statuts Vérifié / Probable / Non vérifié doivent rester visibles dans l'UI et les exports.</li>
            <li>{isDemo ? 'Mode démo actif : branchez Supabase et l’Edge Function pour les flux réels.' : 'Supabase connecté : stockage et RLS disponibles.'}</li>
          </ul>
        </div>
      </Card>
    </div>
  );
}
