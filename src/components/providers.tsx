"use client";

import type { ReactNode } from "react";
import { Toaster } from "sonner";

export function Providers({ children }: { children: ReactNode }) {
  return (
    <>
      {children}
      <Toaster
        richColors
        position="top-right"
        toastOptions={{
          style: {
            background: "rgba(10,10,10,0.92)",
            color: "#F5F7FB",
            border: "1px solid rgba(255,255,255,0.08)",
          },
        }}
      />
    </>
  );
}
