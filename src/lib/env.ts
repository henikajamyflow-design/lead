export const env = {
  supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL ?? "",
  supabaseAnonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "",
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
  demoMode:
    process.env.NEXT_PUBLIC_LEADFORGE_DEMO_MODE === "true" || process.env.LEADFORGE_DEMO_MODE === "true",
};

export const isSupabaseConfigured =
  Boolean(env.supabaseUrl) && Boolean(env.supabaseAnonKey);

export const isDemoMode = env.demoMode || !isSupabaseConfigured;
