"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ArrowRight, ChevronDown, Menu, X } from "lucide-react";
import { Logo } from "./logo";
import { ThemeToggle } from "./theme";
import { links, nav, products } from "@/lib/site";

export function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [menu, setMenu] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header className="sticky top-0 z-50">
      <div className="bg-night text-[13px] text-white/80">
        <div className="mx-auto flex max-w-7xl items-center justify-center gap-3 px-4 py-2">
          <span className="rounded-full bg-white/10 px-2 py-0.5 font-mono text-[10px] uppercase tracking-widest text-apricot">New</span>
          <span className="truncate">New: launch branded AI agents for every partner from one setup.</span>
          <Link href="/use-cases#partner-agents" className="hidden shrink-0 items-center gap-1 text-white hover:underline sm:inline-flex">
            See how <ArrowRight size={13} />
          </Link>
        </div>
      </div>

      <div className={`transition-all duration-300 ${scrolled ? "border-b border-line bg-porcelain/85 backdrop-blur-xl" : "bg-transparent"}`}>
        <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6" aria-label="Main">
          <Link href="/" aria-label="Theory Cloud home" className="text-ink">
            <Logo />
          </Link>

          <ul className="hidden items-center gap-1 lg:flex">
            {nav.map((item) =>
              item.menu ? (
                <li key={item.label} className="relative" onMouseEnter={() => setMenu(true)} onMouseLeave={() => setMenu(false)}>
                  <button
                    className="inline-flex items-center gap-1 rounded-full px-3 py-2 text-sm text-ink/80 hover:text-ink"
                    aria-expanded={menu}
                    onClick={() => setMenu((m) => !m)}
                  >
                    {item.label} <ChevronDown size={14} className={`transition ${menu ? "rotate-180" : ""}`} />
                  </button>
                  {menu && (
                    <div className="absolute left-1/2 top-full w-[560px] -translate-x-1/2 pt-2">
                      <div className="card grid grid-cols-2 gap-1 p-2 shadow-2xl shadow-ink/10">
                        {products.map((p) => (
                          <Link
                            key={p.slug}
                            href={`/products/${p.slug}`}
                            onClick={() => setMenu(false)}
                            className="rounded-xl p-3 hover:bg-porcelain"
                          >
                            <div className="text-sm font-semibold">{p.name}</div>
                            <div className="mt-0.5 text-xs text-slate">{p.kicker}</div>
                          </Link>
                        ))}
                        <Link href="/#platform" onClick={() => setMenu(false)} className="flex items-center justify-between rounded-xl bg-iris-soft p-3 text-sm font-medium text-iris">
                          How the platform fits together <ArrowRight size={14} />
                        </Link>
                      </div>
                    </div>
                  )}
                </li>
              ) : (
                <li key={item.label}>
                  <Link
                    href={item.href}
                    {...(item.external ? { target: "_blank", rel: "noreferrer" } : {})}
                    className="rounded-full px-3 py-2 text-sm text-ink/80 hover:text-ink"
                  >
                    {item.label}
                  </Link>
                </li>
              ),
            )}
          </ul>

          <div className="hidden items-center gap-2 lg:flex">
            <ThemeToggle />
            <Link href={links.demo} className="group inline-flex items-center gap-1.5 rounded-full bg-ink px-4 py-2 text-sm font-medium text-paper hover:bg-iris">
              Book a demo <ArrowRight size={14} className="transition group-hover:translate-x-0.5" />
            </Link>
          </div>

          <div className="flex items-center gap-1 lg:hidden">
          <ThemeToggle />
          <button className="rounded-full p-2 lg:hidden" onClick={() => setOpen((o) => !o)} aria-label={open ? "Close menu" : "Open menu"} aria-expanded={open}>
            {open ? <X size={22} /> : <Menu size={22} />}
          </button>
          </div>
        </nav>

        {open && (
          <div className="border-t border-line bg-porcelain px-4 pb-6 lg:hidden">
            <ul className="flex flex-col py-2">
              {products.map((p) => (
                <li key={p.slug}>
                  <Link href={`/products/${p.slug}`} onClick={() => setOpen(false)} className="flex justify-between py-2.5 text-[15px]">
                    {p.name} <span className="text-xs text-slate">{p.kicker}</span>
                  </Link>
                </li>
              ))}
              <li className="my-2 border-t border-line" />
              {nav.filter((n) => !n.menu).map((item) => (
                <li key={item.label}>
                  <Link href={item.href} onClick={() => setOpen(false)} className="block py-2.5 text-[15px]">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
            <Link href={links.demo} onClick={() => setOpen(false)} className="flex w-full items-center justify-center gap-2 rounded-full bg-ink py-3 text-sm font-medium text-paper">
              Book a demo <ArrowRight size={14} />
            </Link>
          </div>
        )}
      </div>
    </header>
  );
}
