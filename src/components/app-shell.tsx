import type { ReactNode } from "react";
import { Sidebar } from "@/components/sidebar";
import { Topbar } from "@/components/topbar";
import { Profile } from "@/lib/types";

export function AppShell({
  children,
  profile,
  email,
  isDemo,
}: {
  children: ReactNode;
  profile: Profile;
  email: string;
  isDemo: boolean;
}) {
  return (
    <div className="dashboard-grid min-h-screen px-4 py-4 lg:px-6">
      <div className="mx-auto grid max-w-[1600px] gap-4 lg:grid-cols-[290px_minmax(0,1fr)]">
        <Sidebar email={email} plan={profile.plan} company={profile.company} isDemo={isDemo} />
        <main className="glass-card-strong min-h-[calc(100vh-2rem)] rounded-[32px] p-5 sm:p-6 lg:p-8">
          <Topbar />
          {children}
        </main>
      </div>
    </div>
  );
}
