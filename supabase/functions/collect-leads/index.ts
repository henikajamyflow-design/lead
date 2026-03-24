import { corsHeaders } from "../_shared/cors.ts";

Deno.serve(async (request) => {
  if (request.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const body = await request.json();
    const response = await fetchLeadResearch(body);

    return new Response(JSON.stringify(response), {
      headers: {
        ...corsHeaders,
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    return new Response(
      JSON.stringify({
        leads: [],
        note: error instanceof Error ? error.message : "Edge Function execution failed.",
      }),
      {
        status: 500,
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
      },
    );
  }
});

async function fetchLeadResearch(payload: {
  prompt: string;
  filters: { region: string; sector: string; targetCount: number };
  userId: string;
  collectionId: string;
}) {
  const webhook = Deno.env.get("RESEARCH_WEBHOOK_URL");
  const token = Deno.env.get("RESEARCH_WEBHOOK_BEARER_TOKEN");

  if (!webhook) {
    return {
      leads: [],
      note:
        "Configurez RESEARCH_WEBHOOK_URL pour brancher votre moteur de recherche publique professionnelle (LinkedIn public, corporate sites, registries, filings, press releases).",
    };
  }

  const response = await fetch(webhook, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error(`Research webhook failed with ${response.status}`);
  }

  return await response.json();
}
