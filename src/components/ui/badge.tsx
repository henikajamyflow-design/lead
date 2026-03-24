import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export function Badge({
  className,
  tone = "default",
  children,
}: {
  className?: string;
  tone?: "default" | "success" | "warning" | "danger" | "info";
  children: ReactNode;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-medium",
        tone === "success" && "border-emerald-400/20 bg-emerald-400/10 text-emerald-200",
        tone === "warning" && "border-amber-400/20 bg-amber-400/10 text-amber-200",
        tone === "danger" && "border-rose-400/20 bg-rose-400/10 text-rose-200",
        tone === "info" && "border-cyan-400/20 bg-cyan-400/10 text-cyan-200",
        tone === "default" && "border-white/10 bg-white/5 text-zinc-200",
        className,
      )}
    >
      {children}
    </span>
  );
}
