import Link from "next/link";
import { AuthForm } from "@/components/auth-form";

export default function SignupPage() {
  return (
    <main className="flex min-h-screen items-center justify-center px-4 py-8">
      <div className="grid w-full max-w-6xl gap-6 lg:grid-cols-[0.95fr_1.05fr]">
        <div className="hidden rounded-[32px] border border-white/8 bg-[radial-gradient(circle_at_top_left,rgba(139,92,246,0.16),transparent_38%),radial-gradient(circle_at_bottom_right,rgba(0,255,159,0.12),transparent_30%),rgba(255,255,255,0.03)] p-8 lg:block">
          <p className="text-xs uppercase tracking-[0.3em] text-violet-300/80">LeadForge onboarding</p>
          <h1 className="mt-4 font-display text-4xl font-semibold text-white">Créez votre SaaS de lead generation prêt pour les équipes sales et RevOps.</h1>
          <p className="mt-6 max-w-xl text-base leading-8 text-zinc-400">Supabase Auth, profils, routes protégées, exports et moteur de collecte orchestré côté serveur.</p>
        </div>
        <div className="mx-auto flex w-full max-w-xl items-center justify-center">
          <div className="w-full">
            <AuthForm mode="signup" />
            <p className="mt-5 text-center text-sm text-zinc-500">
              Déjà inscrit ? <Link href="/login" className="text-cyan-300">Se connecter</Link>
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
