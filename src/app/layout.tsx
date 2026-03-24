import type { Metadata } from "next";
import type { ReactNode } from "react";
import "./globals.css";
import { Providers } from "@/components/providers";

export const metadata: Metadata = {
  metadataBase: new URL("https://leadforge.local"),
  title: "LeadForge — SaaS de prospection B2B executive",
  description:
    "Collecte, vérifie, enrichit et exporte des dirigeants B2B EU/US depuis une interface dark-mode ultra moderne.",
  applicationName: "LeadForge",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
