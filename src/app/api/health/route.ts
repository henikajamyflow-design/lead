import { NextResponse } from "next/server";
import { isDemoMode, isSupabaseConfigured } from "@/lib/env";

export async function GET() {
  return NextResponse.json({
    ok: true,
    app: "LeadForge",
    mode: isDemoMode ? "demo" : "supabase",
    supabaseConfigured: isSupabaseConfigured,
    timestamp: new Date().toISOString(),
  });
}
