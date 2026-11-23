import type { Metadata } from "next";
import { CtaBand, Reveal } from "@/components/ui";

export const metadata: Metadata = { title: "About", description: "Why Theory Cloud builds deterministic infrastructure for AI agents." };

const beliefs = [
  ["Trust is designed in", "Accuracy, privacy and approvals are part of the platform from the start, not added later."],
  ["Every answer has an owner", "Your business approves the content agents answer from, and every reply shows its source."],
  ["Your customers, your data", "Customer history belongs to you, not to whichever AI model you use this year."],
  ["Partners, not vendors", "Our engineers work with your team from the first pilot to launch."],
];

export default function AboutPage() {
  return (
    <>
      <section className="relative -mt-[100px] overflow-hidden px-4 pb-16 pt-[150px] sm:px-6">
        <div className="aurora pointer-events-none absolute inset-x-0 -top-20 h-[480px] opacity-70" aria-hidden />
        <Reveal className="relative mx-auto max-w-4xl">
          <p className="eyebrow">About Theory Cloud</p>
          <h1 className="display mt-5 text-[1.8rem] sm:text-[3.6rem]">
            We help businesses trust <em>their AI.</em>
          </h1>
          <p className="mt-6 max-w-2xl text-[17px] leading-relaxed text-slate">
            Our technology already runs payments infrastructure in production, where &ldquo;usually right&rdquo;
            isn&apos;t good enough. We bring the same discipline to AI agents, so businesses can put them in front of
            customers with confidence.
          </p>
        </Reveal>
      </section>
      <section className="px-4 py-16 sm:px-6">
        <div className="mx-auto grid max-w-6xl gap-px overflow-hidden rounded-[24px] border border-line bg-line sm:grid-cols-2">
          {beliefs.map(([t, b], i) => (
            <Reveal key={t} delay={(i % 2) * 0.08} className="h-full">
              <div className="h-full bg-paper p-8">
                <h2 className="display text-[1.25rem]">{t}</h2>
                <p className="mt-3 leading-relaxed text-slate">{b}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>
      <CtaBand />
    </>
  );
}
