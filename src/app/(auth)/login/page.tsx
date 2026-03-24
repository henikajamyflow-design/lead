import Link from "next/link";
import { AuthForm } from "@/components/auth-form";

export default function LoginPage() {
  return (
    <main className="flex min-h-screen items-center justify-center px-4 py-8">
      <div className="grid w-full max-w-6xl gap-6 lg:grid-cols-[0.95fr_1.05fr]">
        <div className="hidden rounded-[32px] border border-white/8 bg-[radial-gradient(circle_at_top_left,rgba(0,240,255,0.16),transparent_38%),radial-gradient(circle_at_bottom_right,rgba(0,255,159,0.12),transparent_30%),rgba(255,255,255,0.03)] p-8 lg:block">
          <p className="text-xs uppercase tracking-[0.3em] text-cyan-300/80">LeadForge login</p>
          <h1 className="mt-4 font-display text-4xl font-semibold text-white">Connectez votre équipe growth à une machine de prospection premium.</h1>
          <p className="mt-6 max-w-xl text-base leading-8 text-zinc-400">Dashboard, collecte IA, tableau avancé, export Google Sheets et conformité GDPR dans une seule app.</p>
        </div>
        <div className="mx-auto flex w-full max-w-xl items-center justify-center">
          <div className="w-full">
            <AuthForm mode="login" />
            <p className="mt-5 text-center text-sm text-zinc-500">
              Pas encore de compte ? <Link href="/signup" className="text-cyan-300">Créer un compte</Link>
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
