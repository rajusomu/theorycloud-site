"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight, CircleCheck } from "lucide-react";
import { links } from "@/lib/site";

/*
 * Partners & customers. Pay Theory is real. The others are PLACEHOLDERS using
 * well-known sample company names, so nobody mistakes them for real partners.
 * Replace them with approved partner logos (SVG) before launch.
 */

type Partner = {
  name: string;
  mark: React.ReactNode;
  placeholder?: boolean;
  href?: string;
  note?: string;
};

const S = (children: React.ReactNode) => (
  <svg viewBox="0 0 28 28" className="h-7 w-7 shrink-0" aria-hidden>
    {children}
  </svg>
);

const partners: Partner[] = [
  {
    name: "Pay Theory",
    href: links.payTheory,
    note: "In production",
    // Neutral mark until Pay Theory supplies its approved logo file
    mark: <CircleCheck size={26} strokeWidth={1.8} className="shrink-0" />,
  },
  {
    name: "Acme",
    placeholder: true,
    mark: S(<path d="M14 4 25 24H3z" fill="currentColor" />),
  },
  {
    name: "Globex",
    placeholder: true,
    mark: S(
      <>
        <circle
          cx="14"
          cy="14"
          r="10"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.4"
        />
        <path
          d="M4 14h20M14 4c4 4 4 16 0 20M14 4c-4 4-4 16 0 20"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.6"
        />
      </>,
    ),
  },
  {
    name: "Northwind",
    placeholder: true,
    mark: S(<path d="M5 22 14 5l9 17-9-5z" fill="currentColor" />),
  },
  {
    name: "Contoso",
    placeholder: true,
    mark: S(
      <>
        <rect x="4" y="4" width="9" height="9" rx="2" fill="currentColor" />
        <rect x="15" y="15" width="9" height="9" rx="2" fill="currentColor" />
        <rect
          x="15"
          y="4"
          width="9"
          height="9"
          rx="2"
          fill="currentColor"
          opacity="0.4"
        />
        <rect
          x="4"
          y="15"
          width="9"
          height="9"
          rx="2"
          fill="currentColor"
          opacity="0.4"
        />
      </>,
    ),
  },
  {
    name: "Fabrikam",
    placeholder: true,
    mark: S(
      <path
        d="M6 6h16M6 14h11M6 22h6"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
      />,
    ),
  },
  {
    name: "Tailspin",
    placeholder: true,
    mark: S(<path d="M14 3a11 11 0 1 0 11 11h-11z" fill="currentColor" />),
  },
  {
    name: "Wingtip",
    placeholder: true,
    mark: S(
      <path
        d="M3 20c6-1 10-6 12-14 2 6 5 10 10 12-6 1-13 2-22 2z"
        fill="currentColor"
      />,
    ),
  },
  {
    name: "Litware",
    placeholder: true,
    mark: S(
      <>
        <circle cx="9" cy="14" r="5" fill="currentColor" />
        <circle
          cx="19"
          cy="14"
          r="5"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.4"
        />
      </>,
    ),
  },
];

function Card({ p }: { p: Partner }) {
  const body = (
    <div
      className={`flex h-[84px] w-[230px] shrink-0 snap-start items-center gap-3 rounded-2xl border px-5 transition ${
        p.placeholder
          ? "border-line bg-white/70 text-ink/40 grayscale hover:text-ink/70"
          : "border-iris/30 bg-white text-iris shadow-lg shadow-iris/10"
      }`}
      title={p.placeholder ? "Placeholder logo" : p.name}
    >
      {p.mark}
      <div className="min-w-0">
        <div
          className={`truncate text-[17px] font-semibold tracking-[-0.02em] ${p.placeholder ? "" : "text-ink"}`}
        >
          {p.name}
        </div>
        {p.note && (
          <div className="mt-0.5 flex items-center gap-1 text-[11px] font-medium text-verified">
            <CircleCheck size={12} /> {p.note}
          </div>
        )}
      </div>
    </div>
  );
  return p.href ? (
    <Link
      href={p.href}
      target="_blank"
      rel="noreferrer"
      aria-label={`${p.name} (opens in a new tab)`}
    >
      {body}
    </Link>
  ) : (
    body
  );
}

export function PartnerCarousel() {
  const track = useRef<HTMLDivElement>(null);
  const [paused, setPaused] = useState(false);
  const nudge = (dir: 1 | -1) => {
    const el = track.current;
    if (!el) return;
    const atEnd = el.scrollLeft + el.clientWidth >= el.scrollWidth - 4;
    if (dir === 1 && atEnd) el.scrollTo({ left: 0, behavior: "smooth" });
    else el.scrollBy({ left: dir * 242, behavior: "smooth" });
  };

  // Advance one card every few seconds; stop on hover, focus or reduced motion
  useEffect(() => {
    if (paused || window.matchMedia("(prefers-reduced-motion: reduce)").matches)
      return;
    const id = setInterval(() => nudge(1), 3200);
    return () => clearInterval(id);
  }, [paused]);
  return (
    <section aria-label="Partners and customers" className="px-4 py-10 sm:px-6">
      <div className="mx-auto max-w-7xl">
        <div className="flex items-end justify-between gap-4">
          <div>
            <p className="eyebrow">Partners &amp; customers</p>
            <p className="mt-2 text-[17px] font-medium">
              Teams building on Theory Cloud
            </p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => nudge(-1)}
              aria-label="Scroll partners left"
              className="flex h-10 w-10 items-center justify-center rounded-full border border-line bg-white transition hover:border-ink"
            >
              <ChevronLeft size={18} />
            </button>
            <button
              onClick={() => nudge(1)}
              aria-label="Scroll partners right"
              className="flex h-10 w-10 items-center justify-center rounded-full border border-line bg-white transition hover:border-ink"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </div>
        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-stretch">
          {/* The real customer stays pinned; placeholders scroll beside it */}
          <div className="shrink-0">
            <Card p={partners[0]} />
          </div>
          <div
            ref={track}
            onMouseEnter={() => setPaused(true)}
            onMouseLeave={() => setPaused(false)}
            onFocus={() => setPaused(true)}
            onBlur={() => setPaused(false)}
            onTouchStart={() => setPaused(true)}
            className="mask-fade-x flex min-w-0 flex-1 snap-x snap-mandatory gap-3 overflow-x-auto pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          >
            {partners.slice(1).map((p) => (
              <Card key={p.name} p={p} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
