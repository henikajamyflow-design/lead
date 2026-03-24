import { HistoryTable } from "@/components/history-table";
import { getDashboardPayload } from "@/lib/queries";

export default async function HistoryPage() {
  const { collections } = await getDashboardPayload();
  return <HistoryTable collections={collections} />;
}
