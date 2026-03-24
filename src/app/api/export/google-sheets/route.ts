import { SignJWT, importPKCS8 } from "jose";
import { NextResponse } from "next/server";
import { leadsToExportRows } from "@/lib/export";
import { fetchScopedLeads } from "@/lib/server-leads";

type ServiceAccount = {
  client_email: string;
  private_key: string;
};

export async function GET(request: Request) {
  if (!process.env.GOOGLE_SERVICE_ACCOUNT_JSON_BASE64) {
    return NextResponse.json(
      { error: "Ajoutez GOOGLE_SERVICE_ACCOUNT_JSON_BASE64 pour activer l'export Google Sheets en un clic." },
      { status: 501 },
    );
  }

  const creds = JSON.parse(
    Buffer.from(process.env.GOOGLE_SERVICE_ACCOUNT_JSON_BASE64, "base64").toString("utf8"),
  ) as ServiceAccount;

  const accessToken = await getGoogleAccessToken(creds);
  const { searchParams } = new URL(request.url);
  const ids = (searchParams.get("ids") ?? "").split(",").filter(Boolean);
  const leads = await fetchScopedLeads(ids);
  const rows = leadsToExportRows(leads);
  const values = [Object.keys(rows[0] ?? {}), ...rows.map((row) => Object.values(row))];

  const spreadsheet = await fetch("https://sheets.googleapis.com/v4/spreadsheets", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      properties: { title: `LeadForge Export ${new Date().toISOString().slice(0, 10)}` },
      sheets: [{ properties: { title: "LeadForge Leads", gridProperties: { frozenRowCount: 1 } } }],
    }),
  }).then((res) => res.json() as Promise<{ spreadsheetId?: string }>);

  if (!spreadsheet.spreadsheetId) {
    return NextResponse.json({ error: "Impossible de créer la feuille Google Sheets." }, { status: 500 });
  }

  await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${spreadsheet.spreadsheetId}/values/LeadForge%20Leads!A1?valueInputOption=RAW`, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ values }),
  });

  await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${spreadsheet.spreadsheetId}:batchUpdate`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      requests: [
        {
          repeatCell: {
            range: { sheetId: 0, startRowIndex: 0, endRowIndex: 1 },
            cell: {
              userEnteredFormat: {
                backgroundColor: { red: 0.06, green: 0.06, blue: 0.06 },
                textFormat: { foregroundColor: { red: 0, green: 0.94, blue: 1 }, bold: true },
              },
            },
            fields: "userEnteredFormat(backgroundColor,textFormat)",
          },
        },
        {
          repeatCell: {
            range: { sheetId: 0, startRowIndex: 1 },
            cell: {
              userEnteredFormat: {
                backgroundColor: { red: 0.04, green: 0.04, blue: 0.04 },
                textFormat: { foregroundColor: { red: 0.96, green: 0.97, blue: 0.99 } },
              },
            },
            fields: "userEnteredFormat(backgroundColor,textFormat)",
          },
        },
        {
          autoResizeDimensions: {
            dimensions: { sheetId: 0, dimension: "COLUMNS", startIndex: 0, endIndex: 12 },
          },
        },
      ],
    }),
  });

  if (process.env.GOOGLE_DRIVE_FOLDER_ID) {
    await fetch(`https://www.googleapis.com/drive/v3/files/${spreadsheet.spreadsheetId}?addParents=${process.env.GOOGLE_DRIVE_FOLDER_ID}&removeParents=root&fields=id,parents`, {
      method: "PATCH",
      headers: { Authorization: `Bearer ${accessToken}` },
    });
  }

  return NextResponse.redirect(`https://docs.google.com/spreadsheets/d/${spreadsheet.spreadsheetId}/edit`);
}

async function getGoogleAccessToken(creds: ServiceAccount) {
  const now = Math.floor(Date.now() / 1000);
  const alg = "RS256";
  const key = await importPKCS8(creds.private_key, alg);
  const assertion = await new SignJWT({
    scope: "https://www.googleapis.com/auth/spreadsheets https://www.googleapis.com/auth/drive",
  })
    .setProtectedHeader({ alg, typ: "JWT" })
    .setIssuer(creds.client_email)
    .setSubject(creds.client_email)
    .setAudience("https://oauth2.googleapis.com/token")
    .setIssuedAt(now)
    .setExpirationTime(now + 3600)
    .sign(key);

  const tokenResponse = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer",
      assertion,
    }),
  }).then((res) => res.json() as Promise<{ access_token?: string }>);

  if (!tokenResponse.access_token) {
    throw new Error("Impossible d'obtenir un token Google OAuth.");
  }

  return tokenResponse.access_token;
}
