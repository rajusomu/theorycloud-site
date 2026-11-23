import type { Metadata } from "next";
import { Suspense } from "react";
import { DemoForm } from "@/components/demo-form";
import { Reveal } from "@/components/ui";

export const metadata: Metadata = {
  title: "Book a demo",
  description: "See Theory Cloud running on one of your own agent workflows.",
};

const agenda = [
  ["Map one workflow", "We'll pick one workflow and agree what the agent should know, do and never do."],
  ["See it live", "We'll show the agent answering with sourced replies, private memory and the right access."],
  ["Plan the launch", "We'll agree a pilot scope, a timeline and pricing for your team."],
];

export default function ContactPage() {
  return (
    <section className="relative -mt-[100px] overflow-hidden px-4 pb-24 pt-[150px] sm:px-6">
      <div className="aurora pointer-events-none absolute inset-x-0 -top-20 h-[560px] opacity-70" aria-hidden />
      <div className="relative mx-auto grid max-w-6xl gap-14 lg:grid-cols-[1fr_1.15fr]">
        <Reveal>
          <p className="eyebrow">Book a demo</p>
          <h1 className="display mt-5 text-[2.1rem] sm:text-[3.1rem]">
            30 minutes. <em>One real workflow.</em>
          </h1>
          <p className="mt-6 text-[17px] leading-relaxed text-slate">
            No slideware. Bring one customer or team workflow, and leave with a working example and a launch plan.
          </p>
          <ol className="mt-10 space-y-6">
            {agenda.map(([t, b], i) => (
              <li key={t} className="flex gap-4">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-ink font-mono text-xs text-white">{i + 1}</span>
                <div>
                  <h2 className="font-semibold">{t}</h2>
                  <p className="mt-1 text-[15px] text-slate">{b}</p>
                </div>
              </li>
            ))}
          </ol>
          <p className="mt-10 text-sm text-slate">
            Prefer email? <a href="mailto:sales@theorycloud.ai" className="text-iris underline">sales@theorycloud.ai</a>
          </p>
        </Reveal>
        <Reveal delay={0.1}>
          <Suspense fallback={<div className="card h-[640px]" />}>
            <DemoForm />
          </Suspense>
        </Reveal>
      </div>
    </section>
  );
}
