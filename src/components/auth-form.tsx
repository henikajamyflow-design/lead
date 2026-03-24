"use client";

import type { FormEvent } from "react";
import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowRight, Chrome } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { createClient } from "@/lib/supabase/browser";
import { isDemoMode } from "@/lib/env";
import { toast } from "sonner";

export function AuthForm({ mode }: { mode: "login" | "signup" }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(false);

  const handleEmail = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const email = String(form.get("email") ?? "");
    const password = String(form.get("password") ?? "");
    const fullName = String(form.get("full_name") ?? "");
    const company = String(form.get("company") ?? "");

    if (isDemoMode) {
      toast.success("Mode démo activé — accès direct au dashboard.");
      router.push("/dashboard");
      return;
    }

    const supabase = createClient();
    if (!supabase) {
      toast.error("Supabase n'est pas configuré.");
      return;
    }

    setLoading(true);

    try {
      if (mode === "login") {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        router.push(searchParams.get("redirectedFrom") || "/dashboard");
        router.refresh();
      } else {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: `${window.location.origin}/auth/callback`,
            data: { full_name: fullName, company, plan: "Starter" },
          },
        });
        if (error) throw error;
        toast.success("Compte créé. Vérifiez votre email si la confirmation est activée.");
        router.push("/dashboard");
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Authentification impossible.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogle = async () => {
    if (isDemoMode) {
      toast.success("Mode démo activé — accès direct au dashboard.");
      router.push("/dashboard");
      return;
    }

    const supabase = createClient();
    if (!supabase) {
      toast.error("Supabase n'est pas configuré.");
      return;
    }

    setLoading(true);
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });
    if (error) {
      toast.error(error.message);
      setLoading(false);
    }
  };

  return (
    <div className="glass-card-strong neon-border rounded-[28px] p-6 sm:p-8">
      <div className="mb-6 space-y-2">
        <p className="text-xs uppercase tracking-[0.35em] text-cyan-300/80">LeadForge Auth</p>
        <h1 className="font-display text-3xl font-semibold text-white">
          {mode === "login" ? "Connexion sécurisée" : "Créer votre workspace"}
        </h1>
        <p className="text-sm leading-6 text-zinc-400">
          Email + mot de passe, Google OAuth et routes protégées prêtes pour Supabase Auth.
        </p>
      </div>

      <form onSubmit={handleEmail} className="space-y-4">
        {mode === "signup" && (
          <div className="grid gap-4 sm:grid-cols-2">
            <Input name="full_name" placeholder="Nom complet" required />
            <Input name="company" placeholder="Entreprise" />
          </div>
        )}
        <Input type="email" name="email" placeholder="email@entreprise.com" required />
        <Input type="password" name="password" placeholder="Mot de passe" required minLength={6} />
        <Button type="submit" className="w-full" size="lg" disabled={loading}>
          {loading ? "Chargement…" : mode === "login" ? "Se connecter" : "Créer mon compte"}
          <ArrowRight className="h-4 w-4" />
        </Button>
      </form>

      <div className="my-5 flex items-center gap-3 text-xs uppercase tracking-[0.24em] text-zinc-500">
        <div className="h-px flex-1 bg-white/8" />
        ou
        <div className="h-px flex-1 bg-white/8" />
      </div>

      <Button variant="secondary" className="w-full" size="lg" onClick={handleGoogle} disabled={loading}>
        <Chrome className="h-4 w-4" />
        Continuer avec Google
      </Button>

      {isDemoMode && (
        <p className="mt-4 rounded-2xl border border-cyan-400/20 bg-cyan-400/10 px-4 py-3 text-sm text-cyan-100">
          Mode démo actif : l'auth peut être bypassée pour preview local. Connectez Supabase pour le flux réel.
        </p>
      )}
    </div>
  );
}
