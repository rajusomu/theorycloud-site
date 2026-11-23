"use client";

import Link from "next/link";
import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { AppWindow, ArrowRight, Check, ArrowUpRight, BookOpen, Database, KeyRound, Network, Server, type LucideIcon } from "lucide-react";
import { faceTheory, platformProducts, productValue } from "@/lib/site";
import { Reveal, SectionHead } from "./ui";
import { PlatformCanvas } from "./three/lazy";
import { ProductUI } from "./product-ui";
import { useTheme } from "./theme";

/*
 * Platform section, laid out as one large product window: browser-style product tabs
 * sit on the window's top edge, and each tab opens a small live experience: the product's
 * 3D model, tags for what the business gets, and a small UI from the product itself.
 */

const icons: Record<string, LucideIcon> = {
  theorymcp: Network,
  facetheory: AppWindow,
  apptheory: Server,
  knowledgetheory: BookOpen,
  autheory: KeyRound,
  tabletheory: Database,
};

function Experience({ slug }: { slug: string }) {
  const p = platformProducts.find((x) => x.slug === slug)!;
  const v = productValue[slug];
  const [theme] = useTheme();
  const external = slug === faceTheory.slug;

  return (
    <div className="relative">
      {/* Soft wash at the top of the window, behind the model */}
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-[360px] bg-[radial-gradient(60%_70%_at_50%_0%,rgba(85,70,255,0.14),transparent_70%)]"
        aria-hidden
      />
      <div className="relative h-[260px] [mask-image:linear-gradient(to_bottom,black_78%,transparent)] sm:h-[320px]">
        <PlatformCanvas slug={slug} theme={theme} />
        <span className="pointer-events-none absolute right-4 top-4 rounded-full border border-line bg-paper/80 px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.14em] text-slate backdrop-blur">
          Drag to rotate
        </span>
      </div>

      <div className="relative mx-auto max-w-2xl px-5 pb-10 text-center sm:px-8 sm:pb-12">
        <h3 className="display text-[1.5rem] sm:text-[2rem]">{p.tagline}</h3>
        <p className="mx-auto mt-3 max-w-xl text-[15px] leading-relaxed text-slate">{v.pitch}</p>

        {/* What the business gets, as plain tags */}
        <ul aria-label={`What ${p.name} gives your business`} className="mt-7 flex flex-wrap justify-center gap-2">
          {v.value.map((x) => (
            <li key={x.title} className="inline-flex items-center gap-1.5 rounded-full border border-line bg-paper px-3.5 py-1.5 text-[13px] font-medium text-ink/75">
              <Check size={13} className="text-iris" />
              {x.title}
            </li>
          ))}
        </ul>

        {/* A small UI from the product itself */}
        <div className="mx-auto mt-6 max-w-xl">
          <ProductUI slug={slug} />
        </div>

        <div className="mt-7 flex flex-wrap items-center justify-center gap-3">
          <Link
            href={external ? p.docs : `/products/${p.slug}`}
            {...(external ? { target: "_blank", rel: "noreferrer" } : {})}
            className="group inline-flex items-center gap-2 rounded-full border border-line bg-paper px-5 py-2.5 text-[14px] font-medium shadow-sm transition hover:border-ink"
          >
            Explore {p.name}
            {external ? <ArrowUpRight size={15} /> : <ArrowRight size={15} className="transition group-hover:translate-x-0.5" />}
          </Link>
          <Link href="/contact" className="inline-flex items-center gap-1 px-2 text-[14px] font-medium text-ink/65 hover:text-ink">
            Talk to sales <ArrowUpRight size={14} />
          </Link>
        </div>
      </div>
    </div>
  );
}

export function PlatformTabs() {
  const [active, setActive] = useState(0);
  const p = platformProducts[active];
  return (
    <section id="platform" className="relative scroll-mt-28 overflow-hidden px-4 py-28 sm:px-6">
      <SectionHead
        eyebrow="The platform"
        title={<>Everything you need to launch AI agents <em>with confidence.</em></>}
        body="Start with one product or use the whole platform. Each product removes a reason AI projects stall."
      />

      <Reveal className="relative mx-auto mt-14 max-w-6xl">
        {/* Glow around the window's edges */}
        <div
          className="pointer-events-none absolute -inset-x-16 -inset-y-10 -z-10 bg-[radial-gradient(45%_60%_at_0%_50%,rgba(85,70,255,0.28),transparent_70%),radial-gradient(45%_60%_at_100%_50%,rgba(193,60,255,0.22),transparent_70%)] blur-2xl"
          aria-hidden
        />
        <div className="rounded-[30px] bg-gradient-to-b from-paper via-iris/25 to-paper p-[6px] shadow-[0_40px_120px_-40px_rgba(85,70,255,0.45)]">
          <div className="overflow-hidden rounded-[24px] border border-line bg-paper">
            {/* Product tabs on the window's top edge */}
            <div role="tablist" aria-label="Products" className="flex overflow-x-auto border-b border-line bg-porcelain [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
              {platformProducts.map((x, i) => {
                const Icon = icons[x.slug] ?? Network;
                const on = i === active;
                return (
                  <button
                    key={x.slug}
                    role="tab"
                    aria-selected={on}
                    onClick={() => setActive(i)}
                    className={`relative flex shrink-0 flex-1 items-center justify-center gap-2 whitespace-nowrap border-r border-line px-5 py-3.5 text-[14px] font-medium transition last:border-r-0 ${
                      on ? "bg-paper text-iris" : "text-ink/60 hover:bg-paper/60 hover:text-ink"
                    }`}
                  >
                    <Icon size={16} strokeWidth={1.8} />
                    {x.name}
                    {on && <motion.span layoutId="platform-tab-line" className="absolute inset-x-4 -bottom-px h-[2px] rounded-full bg-iris" />}
                  </button>
                );
              })}
            </div>

            <AnimatePresence mode="wait">
              <motion.div
                key={p.slug}
                role="tabpanel"
                aria-label={p.name}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
              >
                <Experience slug={p.slug} />
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </Reveal>
    </section>
  );
}
