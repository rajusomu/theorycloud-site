import type { Metadata } from "next";
import Link from "next/link";
import { Check, Minus, ArrowRight } from "lucide-react";
import { comparison, tiers } from "@/lib/site";
import { CtaBand, Reveal } from "@/components/ui";

export const metadata: Metadata = {
  title: "Pricing",
  description: "Theory Cloud plans for developers, teams, businesses and regulated enterprises.",
};

const faqs = [
  { q: "How is Theory Cloud priced?", a: "Plans depend on the number of namespaces and agent endpoints, and on support level. Talk to sales and we'll size a plan around your workloads." },
  { q: "Are AppTheory and TableTheory free?", a: "Yes. Both are open source under Apache-2.0. Paid plans cover the hosted TheoryMCP service, plus support and SLAs for the runtimes." },
  { q: "Can we start small and upgrade?", a: "Yes. Your agents, knowledge and customer history carry over when you change plans." },
  { q: "Do you offer a proof of concept?", a: "Business and Enterprise evaluations include a guided proof of concept on one of your real workflows." },
  { q: "Where is data stored?", a: "Enterprise plans can use dedicated namespaces and a choice of region. Talk to sales about data-residency requirements." },
];

export default function PricingPage() {
  return (
    <>
      <section className="relative -mt-16 overflow-hidden px-4 pb-12 pt-[114px] sm:px-6">
        <div className="aurora pointer-events-none absolute inset-x-0 -top-20 h-[480px] opacity-70" aria-hidden />
        <Reveal className="relative mx-auto max-w-3xl text-center">
          <p className="eyebrow">Pricing</p>
          <h1 className="display mt-5 text-[1.8rem] sm:text-[3.6rem]">
            Plans that grow with <em>your business.</em>
          </h1>
          <p className="mx-auto mt-6 max-w-xl text-[17px] leading-relaxed text-slate">
            Every plan includes sourced answers, private customer memory and per-customer access control. Tell us
            what you&apos;re launching and we&apos;ll recommend the right plan.
          </p>
        </Reveal>
      </section>

      <section className="px-4 pb-24 sm:px-6">
        <div className="mx-auto grid max-w-7xl gap-4 md:grid-cols-2 lg:grid-cols-4">
          {tiers.map((t, i) => (
            <Reveal key={t.name} delay={i * 0.08} className="h-full">
              <div className={`flex h-full flex-col rounded-[24px] p-7 ${t.highlight ? "bg-night text-white shadow-2xl shadow-iris/20" : "card"}`}>
                <div className="flex items-center justify-between">
                  <h2 className="display text-[1.4rem]">{t.name}</h2>
                  {t.highlight && <span className="rounded-full bg-apricot px-2.5 py-1 text-[11px] font-medium text-ink">Most chosen</span>}
                </div>
                <p className={`mt-2 min-h-[3rem] text-sm ${t.highlight ? "text-white/65" : "text-slate"}`}>{t.for}</p>
                <Link
                  href={`/contact?plan=${t.name.toLowerCase()}`}
                  className={`group mt-6 inline-flex items-center justify-center gap-2 rounded-full py-3 text-sm font-medium transition ${
                    t.highlight ? "bg-white text-night hover:bg-[#ffe9dc]" : "bg-ink text-paper hover:bg-iris"
                  }`}
                >
                  Talk to sales <ArrowRight size={14} className="transition group-hover:translate-x-0.5" />
                </Link>
                <ul className="mt-7 space-y-3 text-sm">
                  {t.features.map((f) => (
                    <li key={f} className="flex gap-2.5">
                      <Check size={16} className={`mt-0.5 shrink-0 ${t.highlight ? "text-apricot" : "text-verified"}`} />
                      {f}
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="px-4 pb-24 sm:px-6">
        <div className="mx-auto max-w-6xl">
          <h2 className="display text-center text-[1.9rem] sm:text-[2.4rem]">Compare plans</h2>
          <div className="card mt-10 overflow-x-auto">
            <table className="w-full min-w-[640px] text-sm">
              <thead>
                <tr className="border-b border-line text-left">
                  <th className="p-5 font-medium text-slate">Feature</th>
                  {tiers.map((t) => (
                    <th key={t.name} className={`p-5 font-semibold ${t.highlight ? "text-iris" : ""}`}>{t.name}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {comparison.map((row) => (
                  <tr key={row.feature} className="border-b border-line last:border-0">
                    <td className="p-5">{row.feature}</td>
                    {row.values.map((v, i) => (
                      <td key={i} className="p-5">
                        {v === true ? <Check size={16} className="text-verified" aria-label="Included" /> : v === false ? <Minus size={16} className="text-line" aria-label="Not included" /> : v}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <section className="px-4 pb-10 sm:px-6">
        <div className="mx-auto max-w-3xl">
          <h2 className="display text-center text-[1.9rem] sm:text-[2.4rem]">Questions</h2>
          <div className="mt-10 divide-y divide-line border-y border-line">
            {faqs.map((f) => (
              <details key={f.q} className="group py-5">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-[17px] font-medium">
                  {f.q}
                  <span className="text-xl text-slate transition group-open:rotate-45">+</span>
                </summary>
                <p className="mt-3 leading-relaxed text-slate">{f.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <CtaBand title={<>Not sure which plan <em>fits?</em></>} body="Tell us how many agents and teams you're planning for and we'll recommend a plan, with no commitment." />
    </>
  );
}
