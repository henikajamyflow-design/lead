"use client";

import { useState } from "react";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export function WorldFocusMap({
  countries,
}: {
  countries: Array<{ country: string; count: number }>;
}) {
  const [active, setActive] = useState(countries[0]?.country ?? "Europe");

  const points = [
    { x: 26, y: 40, label: "États-Unis" },
    { x: 54, y: 30, label: "Royaume-Uni" },
    { x: 58, y: 33, label: "France" },
    { x: 61, y: 30, label: "Allemagne" },
    { x: 65, y: 39, label: "Italie" },
    { x: 70, y: 26, label: "Suède" },
    { x: 57, y: 42, label: "Espagne" },
  ];

  const countFor = (label: string) => countries.find((item) => item.country === label)?.count ?? 0;

  return (
    <Card className="rounded-[28px] p-6">
      <CardHeader className="px-0">
        <div>
          <CardTitle>Interactive world map</CardTitle>
          <CardDescription className="mt-2">Focus visuel sur l'Europe et les États-Unis pour identifier vos zones les plus riches.</CardDescription>
        </div>
      </CardHeader>

      <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="rounded-[26px] border border-white/8 bg-[#0c0c0c] p-4">
          <svg viewBox="0 0 100 58" className="w-full">
            <defs>
              <linearGradient id="glow" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#00F0FF" stopOpacity="0.9" />
                <stop offset="100%" stopColor="#00FF9F" stopOpacity="0.7" />
              </linearGradient>
            </defs>
            <rect x="0" y="0" width="100" height="58" rx="6" fill="#090909" />
            <path d="M15 18C21 13 28 12 36 17L40 24L37 29L30 31L22 28L17 23Z" fill="#171717" stroke="#2a2a2a" />
            <path d="M49 15L56 13L60 16L63 14L66 17L70 15L76 18L79 22L75 29L68 31L63 36L56 34L52 27Z" fill="#171717" stroke="#2a2a2a" />
            {points.map((point) => (
              <g key={point.label} onMouseEnter={() => setActive(point.label)} className="cursor-pointer">
                <circle cx={point.x} cy={point.y} r="1.8" fill="url(#glow)" />
                <circle cx={point.x} cy={point.y} r="3.8" fill="#00F0FF" opacity="0.15" />
              </g>
            ))}
          </svg>
        </div>
        <div className="space-y-3">
          {countries.map((country) => (
            <button
              key={country.country}
              onMouseEnter={() => setActive(country.country)}
              className={`flex w-full items-center justify-between rounded-2xl border px-4 py-3 text-left transition ${
                active === country.country
                  ? "border-cyan-300/30 bg-cyan-400/10 text-white"
                  : "border-white/8 bg-white/[0.02] text-zinc-300 hover:bg-white/[0.04]"
              }`}
            >
              <span>{country.country}</span>
              <span className="text-sm text-zinc-400">{country.count} leads</span>
            </button>
          ))}
          <div className="rounded-2xl border border-white/8 bg-white/[0.02] p-4 text-sm text-zinc-400">
            Région active : <span className="font-medium text-white">{active}</span> · {countFor(active)} leads
          </div>
        </div>
      </div>
    </Card>
  );
}
