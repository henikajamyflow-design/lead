"use client";

import { useActionState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Radar, ShieldCheck, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { launchCollectionAction, type ActionState } from "@/lib/actions/collections";
import { Button } from "@/components/ui/button";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";

const initialState: ActionState = {
  success: false,
  message: "",
};

export function CollectionLauncher({ defaultPrompt }: { defaultPrompt?: string }) {
  const router = useRouter();
  const [state, formAction, pending] = useActionState(launchCollectionAction, initialState);

  useEffect(() => {
    if (!state.message) return;
    if (state.success) {
      toast.success(state.message);
      router.refresh();
    } else {
      toast.error(state.message);
    }
  }, [router, state]);

  return (
    <Card className="rounded-[30px] p-0 overflow-hidden">
      <div className="grid gap-0 lg:grid-cols-[1.45fr_0.95fr]">
        <div className="p-6 sm:p-8">
          <CardHeader className="mb-6 px-0">
            <div>
              <Badge tone="info" className="mb-3">IA de collecte intégrée</Badge>
              <CardTitle className="text-2xl">Décrivez la recherche en langage naturel</CardTitle>
              <CardDescription className="mt-3 max-w-2xl">
                Exemples : « Collecte pour : Allemagne, secteur SaaS, cible 30 dirigeants » ou « France Tech 25 CEOs ».
              </CardDescription>
            </div>
          </CardHeader>

          <form action={formAction} className="space-y-4">
            <Textarea
              name="prompt"
              required
              defaultValue={defaultPrompt ?? "Collecte pour : Allemagne, secteur SaaS, cible 30 dirigeants"}
            />
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-sm text-zinc-400">
                Public professional data only — no private personal information.
              </p>
              <Button type="submit" size="lg" disabled={pending}>
                {pending ? "Collecte en cours…" : "Lancer la collecte"}
                <Sparkles className="h-4 w-4" />
              </Button>
            </div>
          </form>
        </div>

        <div className="border-l border-white/8 bg-black/20 p-6 sm:p-8">
          <div className="space-y-4">
            <div className="rounded-3xl border border-white/8 bg-white/[0.03] p-5">
              <div className="mb-3 flex items-center gap-3">
                <Radar className="h-5 w-5 text-cyan-300" />
                <h4 className="font-medium text-white">Zones cibles</h4>
              </div>
              <p className="text-sm leading-6 text-zinc-400">Union européenne + États-Unis, données publiques professionnelles uniquement.</p>
            </div>
            <div className="rounded-3xl border border-white/8 bg-white/[0.03] p-5">
              <div className="mb-3 flex items-center gap-3">
                <ShieldCheck className="h-5 w-5 text-emerald-300" />
                <h4 className="font-medium text-white">Compliance</h4>
              </div>
              <p className="text-sm leading-6 text-zinc-400">
                Email et téléphone sont marqués Vérifié / Probable / Non vérifié avec focus GDPR-friendly.
              </p>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}
