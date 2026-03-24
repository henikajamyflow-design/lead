import { LeadTable } from "@/components/lead-table";
import { getLeadsPayload } from "@/lib/queries";

export default async function MyLeadsPage() {
  const { leads } = await getLeadsPayload();
  return <LeadTable leads={leads} />;
}
