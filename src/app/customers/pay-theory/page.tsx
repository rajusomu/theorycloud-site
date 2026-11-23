import type { Metadata } from "next";
import Link from "next/link";
import { CtaBand, Reveal } from "@/components/ui";
import { links } from "@/lib/site";

export const metadata: Metadata = {
  title: "Pay Theory",
  description: "How Pay Theory runs payments infrastructure on Theory Cloud's AppTheory runtime.",
};

/* Facts in this story are limited to what's published (AppTheory "used in production by Pay Theory").
   TODO: replace bracketed placeholders with approved quotes and metrics from Pay Theory. */
export default function PayTheoryStory() {
  return (
    <>
      <section className="relative -mt-[100px] overflow-hidden px-4 pb-16 pt-[150px] sm:px-6">
        <div className="aurora pointer-events-none absolute inset-x-0 -top-20 h-[480px] opacity-70" aria-hidden />
        <Reveal className="relative mx-auto max-w-4xl">
          <Link href="/customers/pay-theory" className="eyebrow">Customers / Pay Theory</Link>
          <h1 className="display mt-5 text-[2.1rem] sm:text-[3.3rem]">
            Payments infrastructure where <em>every runtime</em> behaves the same way.
          </h1>
        </Reveal>
        <Reveal delay={0.1} className="relative mx-auto mt-12 grid max-w-4xl grid-cols-2 gap-4 sm:grid-cols-4">
          {[
            ["Industry", "Payments"],
            ["Products", "AppTheory"],
            ["Runtimes", "Go · TS · Python"],
            ["Status", "In production"],
          ].map(([k, v]) => (
            <div key={k} className="border-t border-ink/20 pt-3">
              <div className="text-xs text-slate">{k}</div>
              <div className="mt-1 font-medium">{v}</div>
            </div>
          ))}
        </Reveal>
      </section>

      <article className="mx-auto max-w-3xl px-4 pb-10 text-[17px] leading-[1.8] text-ink/85 sm:px-6 [&_h2]:display [&_h2]:mb-4 [&_h2]:mt-14 [&_h2]:text-[1.6rem] [&_h2]:text-ink">
        <h2>The challenge</h2>
        <p>
          Pay Theory helps software platforms offer payments to their customers. In payments, a small inconsistency
          between two systems isn&apos;t a cosmetic bug. It can mean money in the wrong place. Pay Theory&apos;s teams
          work in three programming languages, and keeping every service behaving the same way took ongoing manual effort.
        </p>

        <h2>The approach</h2>
        <p>
          Pay Theory standardised its services on <Link href="/products/apptheory" className="text-iris underline">AppTheory</Link>,
          Theory Cloud&apos;s cloud backbone. Every service, whether it handles customer requests or background
          payment events, is built on the same foundation. Hundreds of automated checks confirm it behaves correctly
          on every change.
        </p>
        <ul className="my-6 space-y-2">
          {[
            "One standard for every team, whichever language it works in",
            "Security defaults built in, not left to each team",
            "New services start production-ready on day one",
            "Every release is versioned and repeatable, which makes audits simpler",
          ].map((x) => (
            <li key={x} className="flex gap-3">
              <span className="mt-3 h-1.5 w-1.5 shrink-0 rounded-full bg-apricot" />
              {x}
            </li>
          ))}
        </ul>

        <figure className="on-dark my-12 rounded-[24px] bg-ink p-8 text-white sm:p-10">
          <blockquote className="display text-[1.3rem] leading-snug sm:text-[1.6rem]">
            “[Customer quote to be supplied by Pay Theory and approved before launch.]”
          </blockquote>
          <figcaption className="mt-6 text-sm text-white/60">[Name], [Title], Pay Theory</figcaption>
        </figure>

        <h2>The result</h2>
        <p>
          AppTheory runs Pay Theory&apos;s payment services in production. Teams ship on a shared, proven
          foundation, and inconsistencies are caught automatically before they reach customers, not after.
        </p>
        <p className="mt-6 text-sm text-slate">
          Learn more about <a href={links.payTheory} target="_blank" rel="noreferrer" className="underline">Pay Theory</a>{" "}
          or read the <a href={links.appTheoryDocs} target="_blank" rel="noreferrer" className="underline">AppTheory docs</a>.
        </p>
      </article>

      <CtaBand title={<>Build on the runtime <em>payments</em> trusts.</>} />
    </>
  );
}
