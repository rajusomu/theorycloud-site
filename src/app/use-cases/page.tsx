import type { Metadata } from "next";
import Link from "next/link";
import { products, useCases } from "@/lib/site";
import { CtaBand, Reveal } from "@/components/ui";

export const metadata: Metadata = {
  title: "Use cases",
  description: "How teams run deterministic AI agents in production with Theory Cloud.",
};

export default function UseCasesPage() {
  return (
    <>
      <section className="relative -mt-[100px] overflow-hidden px-4 pb-16 pt-[150px] sm:px-6">
        <div className="aurora pointer-events-none absolute inset-x-0 -top-20 h-[480px] opacity-70" aria-hidden />
        <Reveal className="relative mx-auto max-w-4xl text-center">
          <p className="eyebrow">Solutions</p>
          <h1 className="display mt-5 text-[1.8rem] sm:text-[3.6rem]">
            AI agents that are <em>ready for customers.</em>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-[17px] leading-relaxed text-slate">
            Six ways businesses turn AI pilots into dependable services, from payments and banking to partner programs and internal teams.
          </p>
        </Reveal>
        <nav aria-label="Solutions" className="relative mx-auto mt-10 flex max-w-5xl flex-wrap justify-center gap-2">
          {useCases.map((u) => (
            <a key={u.slug} href={`#${u.slug}`} className="rounded-full border border-line bg-paper/80 px-4 py-2 text-sm hover:border-ink">
              {u.industry}
            </a>
          ))}
        </nav>
      </section>

      <div className="px-4 sm:px-6">
        {useCases.map((u) => (
          <section key={u.slug} id={u.slug} className="mx-auto max-w-6xl scroll-mt-28 border-t border-line py-20">
            <Reveal className="grid gap-12 lg:grid-cols-[1fr_1.1fr] [&>*]:min-w-0">
              <div>
                <p className="font-mono text-xs text-iris">{u.industry}</p>
                <h2 className="display mt-4 text-[1.7rem] sm:text-[2.2rem]">{u.title}</h2>
                <div className="mt-6 flex flex-wrap gap-2">
                  {u.products.map((name) => {
                    const p = products.find((x) => x.name === name);
                    return (
                      <Link key={name} href={`/products/${p?.slug}`} className="rounded-full bg-iris-soft px-3 py-1 text-xs font-medium text-iris hover:bg-iris hover:text-white">
                        {name}
                      </Link>
                    );
                  })}
                </div>
              </div>
              <div className="space-y-6">
                <div>
                  <h3 className="eyebrow">The challenge</h3>
                  <p className="mt-2 text-[17px] leading-relaxed">{u.problem}</p>
                </div>
                <div>
                  <h3 className="eyebrow">How Theory Cloud solves it</h3>
                  <ul className="mt-3 space-y-2.5">
                    {u.approach.map((a) => (
                      <li key={a} className="flex gap-3 text-[15px] leading-relaxed text-slate">
                        <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-apricot" />
                        {a}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="on-dark terminal rounded-2xl p-6">
                  <p className="text-[12px] uppercase tracking-[0.14em] text-white/45">The result</p>
                  <p className="display grad mt-3 text-[1.15rem] leading-snug sm:text-[1.3rem]">{u.outcome}</p>
                  <p className="mt-4 break-all border-t border-white/10 pt-3 font-mono text-[11px] text-white/35">{u.route}</p>
                </div>
              </div>
            </Reveal>
          </section>
        ))}
      </div>

      <CtaBand title={<>Have a workflow that <em>can&apos;t</em> improvise?</>} body="Tell us about it. We'll sketch the routes, scopes and knowledge packs it needs, and show you a working version." />
    </>
  );
}
