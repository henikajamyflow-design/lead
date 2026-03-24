"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { generateMockLeads } from "@/lib/demo-data";
import { isDemoMode } from "@/lib/env";
import { parseCollectionPrompt } from "@/lib/lead-parser";
import { CollectionFilters, Lead } from "@/lib/types";

export type ActionState = {
  success: boolean;
  message: string;
};

const promptSchema = z.object({
  prompt: z.string().min(8, "Décrivez une collecte plus précise."),
});

export async function launchCollectionAction(_: ActionState, formData: FormData): Promise<ActionState> {
  const parsed = promptSchema.safeParse({ prompt: formData.get("prompt") });
  if (!parsed.success) {
    return { success: false, message: parsed.error.issues[0]?.message ?? "Prompt invalide." };
  }

  const filters = parseCollectionPrompt(parsed.data.prompt);

  if (isDemoMode) {
    revalidatePath("/dashboard");
    revalidatePath("/my-leads");
    return {
      success: true,
      message:
        "Mode démo: la collecte a été simulée. Branchez Supabase + l'Edge Function collect-leads pour une recherche publique réelle.",
    };
  }

  const supabase = await createClient();
  if (!supabase) {
    return { success: false, message: "Supabase n'est pas configuré." };
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: collection, error: collectionError } = await supabase
    .from("collections")
    .insert({
      user_id: user.id,
      prompt: filters.prompt,
      region: filters.region,
      sector: filters.sector,
      target_count: filters.targetCount,
      results_count: 0,
      status: "processing",
      notes: "LeadForge lance la recherche de données professionnelles publiques…",
    })
    .select("*")
    .single();

  if (collectionError || !collection) {
    return { success: false, message: collectionError?.message ?? "Impossible de créer la collecte." };
  }

  try {
    const { data, error } = await supabase.functions.invoke("collect-leads", {
      body: {
        prompt: filters.prompt,
        filters,
        userId: user.id,
        collectionId: collection.id,
      },
    });

    if (error) throw error;

    const leads = normalizeLeads(data?.leads ?? [], user.id, collection.id, filters);
    const finalLeads = leads.length ? leads : normalizeLeads(generateMockLeads(filters), user.id, collection.id, filters);

    if (finalLeads.length) {
      await supabase.from("leads").insert(finalLeads);
    }

    await supabase
      .from("collections")
      .update({
        results_count: finalLeads.length,
        status: leads.length ? "completed" : "completed_demo",
        completed_at: new Date().toISOString(),
        notes:
          data?.note ??
          (leads.length
            ? "Collecte terminée à partir de sources publiques professionnelles."
            : "Aucune source live retournée: fallback démo appliqué. Configurez RESEARCH_WEBHOOK_URL côté Edge Function."),
      })
      .eq("id", collection.id);

    revalidatePath("/dashboard");
    revalidatePath("/my-leads");
    revalidatePath("/history");

    return {
      success: true,
      message: `${finalLeads.length} lignes préparées pour la collecte « ${filters.region} / ${filters.sector} ».`,
    };
  } catch (error) {
    await supabase
      .from("collections")
      .update({
        status: "failed",
        completed_at: new Date().toISOString(),
        notes: error instanceof Error ? error.message : "Erreur de collecte inconnue.",
      })
      .eq("id", collection.id);

    return {
      success: false,
      message: error instanceof Error ? error.message : "La collecte a échoué.",
    };
  }
}

function normalizeLeads(rows: Partial<Lead>[], userId: string, collectionId: string, filters: CollectionFilters): Lead[] {
  return rows.slice(0, filters.targetCount).map((row, index) => ({
    id: row.id ?? crypto.randomUUID(),
    user_id: userId,
    collection_id: collectionId,
    full_name: row.full_name ?? `Lead ${index + 1}`,
    job_title: row.job_title ?? "Executive",
    company_name: row.company_name ?? "Company",
    sector: row.sector ?? filters.sector,
    location: row.location ?? `${filters.region}`,
    professional_email: row.professional_email ?? "",
    professional_phone: row.professional_phone ?? "",
    linkedin_url: row.linkedin_url ?? "",
    email_status: row.email_status ?? "Non vérifié",
    phone_status: row.phone_status ?? "Non vérifié",
    primary_source: row.primary_source ?? "Source publique professionnelle non renseignée",
    collected_at: row.collected_at ?? new Date().toISOString(),
    created_at: new Date().toISOString(),
  }));
}

export async function deleteLeadAction(formData: FormData) {
  if (isDemoMode) {
    revalidatePath(String(formData.get("path") ?? "/my-leads"));
    return;
  }

  const leadId = String(formData.get("leadId") ?? "");
  const path = String(formData.get("path") ?? "/my-leads");
  if (!leadId) return;

  const supabase = await createClient();
  if (!supabase) return;

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return;

  await supabase.from("leads").delete().eq("id", leadId).eq("user_id", user.id);
  revalidatePath(path);
  revalidatePath("/dashboard");
}

export async function updateProfileAction(_: ActionState, formData: FormData): Promise<ActionState> {
  const payload = {
    full_name: String(formData.get("full_name") ?? "").trim(),
    company: String(formData.get("company") ?? "").trim(),
    plan: String(formData.get("plan") ?? "Starter").trim(),
    export_preferences: String(formData.get("export_preferences") ?? "xlsx, google-sheets").trim(),
  };

  if (isDemoMode) {
    revalidatePath("/settings");
    return { success: true, message: "Mode démo: préférences simulées." };
  }

  const supabase = await createClient();
  if (!supabase) return { success: false, message: "Supabase non configuré." };

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const { error } = await supabase.from("profiles").update(payload).eq("id", user.id);
  if (error) return { success: false, message: error.message };

  revalidatePath("/settings");
  revalidatePath("/dashboard");
  return { success: true, message: "Profil mis à jour." };
}

export async function signOutAction() {
  const supabase = await createClient();
  if (supabase) {
    await supabase.auth.signOut();
  }
  redirect("/login");
}
