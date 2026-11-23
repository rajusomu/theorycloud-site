"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { links } from "@/lib/site";

/*
 * Partners & customers, as one continuous carousel. Pay Theory is real. The others are
 * PLACEHOLDERS using well-known sample company names, so nobody mistakes them for real
 * partners. Replace them with approved partner logos (SVG) before launch.
 */

type Partner = { name: string; mark: React.ReactNode; placeholder?: boolean; href?: string };

const S = (children: React.ReactNode) => (
  <svg viewBox="0 0 28 28" className="h-7 w-7 shrink-0" aria-hidden>
    {children}
  </svg>
);

const partners: Partner[] = [
  {
    name: "Pay Theory",
    href: links.payTheory,
    // Pay Theory's logo mark (public/partners/pay-theory.png). On dark cards it sits on a
    // light tile, because the deep purple would otherwise disappear.
    mark: (
      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg dark:bg-white">
        <Image src="/partners/pay-theory.png" alt="" width={28} height={26} className="h-[26px] w-auto" />
      </span>
    ),
  },
  { name: "Acme", placeholder: true, mark: S(<path d="M14 4 25 24H3z" fill="currentColor" />) },
  { name: "Globex", placeholder: true, mark: S(<><circle cx="14" cy="14" r="10" fill="none" stroke="currentColor" strokeWidth="2.4" /><path d="M4 14h20M14 4c4 4 4 16 0 20M14 4c-4 4-4 16 0 20" fill="none" stroke="currentColor" strokeWidth="1.6" /></>) },
  { name: "Northwind", placeholder: true, mark: S(<path d="M5 22 14 5l9 17-9-5z" fill="currentColor" />) },
  { name: "Contoso", placeholder: true, mark: S(<><rect x="4" y="4" width="9" height="9" rx="2" fill="currentColor" /><rect x="15" y="15" width="9" height="9" rx="2" fill="currentColor" /><rect x="15" y="4" width="9" height="9" rx="2" fill="currentColor" opacity="0.4" /><rect x="4" y="15" width="9" height="9" rx="2" fill="currentColor" opacity="0.4" /></>) },
  { name: "Fabrikam", placeholder: true, mark: S(<path d="M6 6h16M6 14h11M6 22h6" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />) },
  { name: "Tailspin", placeholder: true, mark: S(<path d="M14 3a11 11 0 1 0 11 11h-11z" fill="currentColor" />) },
  { name: "Wingtip", placeholder: true, mark: S(<path d="M3 20c6-1 10-6 12-14 2 6 5 10 10 12-6 1-13 2-22 2z" fill="currentColor" />) },
  { name: "Litware", placeholder: true, mark: S(<><circle cx="9" cy="14" r="5" fill="currentColor" /><circle cx="19" cy="14" r="5" fill="none" stroke="currentColor" strokeWidth="2.4" /></>) },
];

const CARD_W = 230;
const GAP = 12;
/* One full set of cards, including gaps: the distance after which the loop repeats */
const PERIOD = partners.length * (CARD_W + GAP);

function Card({ p, copy }: { p: Partner; copy: boolean }) {
  const body = (
    <div
      className="flex h-[84px] shrink-0 items-center gap-3 rounded-2xl border border-iris/30 bg-paper px-5 text-iris shadow-lg shadow-iris/10 transition hover:-translate-y-0.5 hover:border-iris/60"
      style={{ width: CARD_W }}
      title={p.placeholder ? `${p.name} (placeholder logo)` : p.name}
    >
      {p.mark}
      <span className="truncate text-[17px] font-semibold tracking-[-0.02em] text-ink">{p.name}</span>
    </div>
  );
  // The duplicated set exists only to make the loop seamless; hide it from assistive tech
  if (copy) {
    return (
      <div aria-hidden className="shrink-0">
        {body}
      </div>
    );
  }
  return p.href ? (
    <Link href={p.href} target="_blank" rel="noreferrer" aria-label={`${p.name} (opens in a new tab)`} className="shrink-0">
      {body}
    </Link>
  ) : (
    <div className="shrink-0">{body}</div>
  );
}

export function PartnerCarousel() {
  const track = useRef<HTMLDivElement>(null);
  const [paused, setPaused] = useState(false);

  // Continuous drift; the list is rendered twice so the loop never shows a gap
  useEffect(() => {
    const el = track.current;
    if (!el || paused || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let raf = 0;
    let last = performance.now();
    let pos = el.scrollLeft;
    let written = el.scrollLeft;
    const step = (now: number) => {
      const dt = Math.min(now - last, 50);
      last = now;
      // If something else scrolled the track (arrow buttons, trackpad), continue from there
      if (Math.abs(el.scrollLeft - written) > 2) pos = el.scrollLeft;
      pos += dt * 0.06;
      if (pos >= PERIOD) pos -= PERIOD;
      el.scrollLeft = pos;
      written = el.scrollLeft;
      raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [paused]);

  const nudge = (dir: 1 | -1) => {
    const el = track.current;
    if (!el) return;
    if (dir === -1 && el.scrollLeft < CARD_W) el.scrollLeft += PERIOD;
    if (dir === 1 && el.scrollLeft >= PERIOD - CARD_W) el.scrollLeft -= PERIOD;
    el.scrollBy({ left: dir * (CARD_W + GAP), behavior: "smooth" });
  };

  return (
    <section aria-label="Partners and customers" className="px-4 py-10 sm:px-6">
      <div className="mx-auto max-w-7xl">
        <div className="flex items-end justify-between gap-4">
          <div>
            <p className="eyebrow">Partners &amp; customers</p>
            <p className="mt-2 text-[17px] font-medium">Teams building on Theory Cloud</p>
          </div>
          <div className="flex gap-2">
            <button onClick={() => nudge(-1)} aria-label="Scroll partners left" className="flex h-10 w-10 items-center justify-center rounded-full border border-line bg-paper transition hover:border-ink">
              <ChevronLeft size={18} />
            </button>
            <button onClick={() => nudge(1)} aria-label="Scroll partners right" className="flex h-10 w-10 items-center justify-center rounded-full border border-line bg-paper transition hover:border-ink">
              <ChevronRight size={18} />
            </button>
          </div>
        </div>
        <div
          ref={track}
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
          onFocus={() => setPaused(true)}
          onBlur={() => setPaused(false)}
          onTouchStart={() => setPaused(true)}
          onTouchEnd={() => setTimeout(() => setPaused(false), 2500)}
          className="mask-fade-x mt-6 flex overflow-x-auto py-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          style={{ gap: GAP }}
        >
          {[...partners, ...partners].map((p, i) => (
            <Card key={`${p.name}-${i}`} p={p} copy={i >= partners.length} />
          ))}
        </div>
      </div>
    </section>
  );
}
