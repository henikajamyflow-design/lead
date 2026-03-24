import { SettingsPanel } from "@/components/settings-panel";
import { getDashboardPayload } from "@/lib/queries";

export default async function SettingsPage() {
  const { profile, isDemo } = await getDashboardPayload();
  return <SettingsPanel profile={profile} isDemo={isDemo} />;
}
