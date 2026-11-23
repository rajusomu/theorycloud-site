import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Check } from "lucide-react";
import { productValue, products, useCases } from "@/lib/site";
import { Button, CtaBand, Reveal, SectionHead } from "@/components/ui";
import { ConnectSection, HowItWorks, ProductVisual } from "@/components/home-sections";

export function generateStaticParams() {
  return products.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const p = products.find((x) => x.slug === slug);
  return p ? { title: p.name, description: p.tagline } : {};
}

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const p = products.find((x) => x.slug === slug);
  if (!p) notFound();
  const v = productValue[p.slug];
  const related = useCases.filter((u) => u.products.includes(p.name));
  const others = products.filter((x) => x.slug !== p.slug);

  return (
    <>
      <section className="relative -mt-16 overflow-hidden px-4 pb-24 pt-[114px] sm:px-6">
        <div className="aurora pointer-events-none absolute inset-x-0 -top-20 h-[560px] opacity-80" aria-hidden />
        <div className="relative mx-auto grid max-w-6xl items-center gap-14 lg:grid-cols-[1.1fr_1fr] [&>*]:min-w-0">
          <Reveal>
            <p className="eyebrow">{p.name} · {p.kicker}</p>
            <h1 className="display mt-5 text-[2rem] sm:text-[3rem]">{p.tagline}</h1>
            <p className="mt-6 text-[17px] leading-relaxed text-slate">{v.pitch}</p>
            <div className="mt-6 flex flex-wrap items-center gap-2">
              <span className="text-xs text-slate">Best for</span>
              {v.bestFor.map((b) => (
                <span key={b} className="rounded-full bg-paper px-3 py-1 text-xs font-medium text-iris">{b}</span>
              ))}
            </div>
            <div className="mt-9 flex flex-wrap gap-3">
              <Button href="/contact">Book a demo</Button>
              <Button href="/pricing" variant="ghost">See plans</Button>
            </div>
          </Reveal>
          <Reveal delay={0.15} className="relative">
            <div className="aurora absolute -inset-6 opacity-60" aria-hidden />
            <div className="on-dark terminal relative rounded-[24px] p-7 sm:p-8">
              <p className="text-[12px] uppercase tracking-[0.14em] text-white/45">What your business gets</p>
              <ul className="mt-6 space-y-6">
                {v.value.map((x) => (
                  <li key={x.title} className="flex gap-3">
                    <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-iris to-fuchsia">
                      <Check size={13} className="text-white" />
                    </span>
                    <div>
                      <div className="font-semibold text-white">{x.title}</div>
                      <div className="mt-0.5 text-[14px] leading-relaxed text-white/60">{x.body}</div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>
        </div>
      </section>

      {related.length > 0 && (
        <section className="px-4 py-24 sm:px-6">
          <SectionHead eyebrow="Solutions" title={<>Where businesses use <em>{p.name}.</em></>} />
          <div className="mx-auto mt-12 grid max-w-6xl gap-4 md:grid-cols-2">
            {related.map((u) => (
              <Link key={u.slug} href={`/use-cases#${u.slug}`} className="card group p-7 transition hover:-translate-y-0.5 hover:shadow-xl hover:shadow-iris/10">
                <p className="eyebrow">{u.industry}</p>
                <h3 className="mt-2 text-lg font-semibold">{u.title}</h3>
                <p className="mt-2 text-sm text-slate">{u.outcome}</p>
                <span className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-iris">
                  See how it works <ArrowRight size={14} />
                </span>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* For technical evaluators */}
      <section className="overflow-hidden border-y border-line bg-paper px-4 py-24 sm:px-6">
        <div className="mx-auto grid max-w-6xl items-start gap-14 lg:grid-cols-[1fr_1fr] [&>*]:min-w-0">
          <div>
            <SectionHead align="left" eyebrow="For your engineers" title={<>What&apos;s <em>under the hood.</em></>} body={p.summary} />
            <ul className="mt-8 grid gap-5 sm:grid-cols-2">
              {p.points.map((pt) => (
                <li key={pt.title}>
                  <h3 className="text-[15px] font-semibold">{pt.title}</h3>
                  <p className="mt-1 text-sm leading-relaxed text-slate">{pt.body}</p>
                </li>
              ))}
            </ul>
            <Link href={p.docs} target="_blank" rel="noreferrer" className="mt-8 inline-flex items-center gap-1 text-sm font-medium text-iris hover:underline">
              Read the technical docs <ArrowRight size={14} />
            </Link>
          </div>
          <Reveal delay={0.1}>
            <ProductVisual slug={p.slug} />
          </Reveal>
        </div>
      </section>

      {p.slug === "theorymcp" && (
        <>
          <HowItWorks />
          <ConnectSection />
        </>
      )}

      <section className="px-4 py-16 sm:px-6">
        <div className="mx-auto max-w-6xl">
          <p className="eyebrow">Works with the rest of the platform</p>
          <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {others.map((o) => (
              <Link key={o.slug} href={`/products/${o.slug}`} className="card p-5 transition hover:border-ink">
                <div className="font-semibold">{o.name}</div>
                <div className="mt-1 text-sm text-slate">{o.kicker}</div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <CtaBand title={<>See <em>{p.name}</em> working on your business.</>} />
    </>
  );
}
