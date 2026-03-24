import type { ReactNode } from "react";
import { AppShell } from "@/components/app-shell";
import { getViewer } from "@/lib/queries";

export default async function ProtectedLayout({ children }: { children: ReactNode }) {
  const { user, profile, isDemo } = await getViewer();

  return <AppShell profile={profile} email={user.email ?? 'demo@leadforge.ai'} isDemo={isDemo}>{children}</AppShell>;
}
