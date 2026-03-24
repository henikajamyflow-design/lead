"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BarChart3, Database, History, LogOut, Search, Settings2 } from "lucide-react";
import { signOutAction } from "@/lib/actions/collections";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const items = [
  { href: "/dashboard", label: "Dashboard", icon: BarChart3 },
  { href: "/my-leads", label: "My Leads", icon: Database },
  { href: "/new-collection", label: "New Collection", icon: Search },
  { href: "/history", label: "History", icon: History },
  { href: "/settings", label: "Settings", icon: Settings2 },
];

export function Sidebar({
  email,
  plan,
  company,
  isDemo,
}: {
  email: string;
  plan: string;
  company: string;
  isDemo: boolean;
}) {
  const pathname = usePathname();

  return (
    <aside className="glass-card-strong sticky top-4 flex h-[calc(100vh-2rem)] w-full max-w-[290px] flex-col rounded-[28px] p-5">
      <div className="mb-8 flex items-center gap-3 px-2">
        <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[linear-gradient(135deg,#00F0FF_0%,#8B5CF6_50%,#00FF9F_100%)] font-display text-lg font-bold text-black">
          LF
        </div>
        <div>
          <p className="font-display text-lg font-semibold text-white">LeadForge</p>
          <p className="text-xs uppercase tracking-[0.22em] text-zinc-500">Executive Data OS</p>
        </div>
      </div>

      <div className="mb-5 flex items-center gap-2 px-2">
        <Badge tone="info">{plan}</Badge>
        {isDemo && <Badge tone="warning">Demo mode</Badge>}
      </div>

      <nav className="space-y-2">
        {items.map((item) => {
          const Icon = item.icon;
          const active = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-2xl px-4 py-3 text-sm transition",
                active
                  ? "bg-white/8 text-white shadow-[0_0_0_1px_rgba(0,240,255,0.16)]"
                  : "text-zinc-400 hover:bg-white/5 hover:text-white",
              )}
            >
              <Icon className={cn("h-4 w-4", active && "text-cyan-300")} />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="mt-auto rounded-3xl border border-white/8 bg-white/[0.03] p-4">
        <div className="mb-4 space-y-1">
          <p className="text-sm font-medium text-white">{company || "LeadForge Workspace"}</p>
          <p className="text-xs text-zinc-500">{email}</p>
        </div>
        <form action={signOutAction}>
          <button className="flex w-full items-center justify-center gap-2 rounded-2xl border border-white/10 px-4 py-3 text-sm font-medium text-zinc-200 transition hover:border-rose-400/20 hover:bg-rose-500/10 hover:text-rose-200">
            <LogOut className="h-4 w-4" />
            Déconnexion
          </button>
        </form>
      </div>
    </aside>
  );
}
