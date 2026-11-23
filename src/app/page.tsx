import { TrustDemo } from "@/components/trust-demo";
import { Button, CtaBand, Reveal, SectionHead } from "@/components/ui";
import { Engagement, PlatformTabs, Problem, ProofBar, Roles, Shifts, Trust, UseCaseGrid } from "@/components/home-sections";
import { CustomerFeature } from "@/components/customer-feature";

export default function Home() {
  return (
    <>
      {/* Hero */}
      <section className="relative -mt-[100px] overflow-hidden px-4 pb-20 pt-[160px] sm:px-6">
        <div className="aurora pointer-events-none absolute inset-x-0 -top-20 h-[760px]" aria-hidden />
        <div className="grid-dots pointer-events-none absolute inset-0 opacity-40 [mask-image:linear-gradient(to_bottom,black,transparent_70%)]" aria-hidden />
        <div className="relative mx-auto max-w-5xl text-center">
          <Reveal>
            <p className="inline-flex items-center gap-2 rounded-full border border-white/80 bg-white/60 px-3 py-1 text-[13px] text-ink/80 backdrop-blur">
              <span className="h-1.5 w-1.5 rounded-full bg-verified" /> Trusted AI agents for customer-facing business
            </p>
          </Reveal>
          <Reveal delay={0.08}>
            <h1 className="display mt-7 text-[2.3rem] sm:text-[3.8rem] lg:text-[4.6rem]">
              AI agents your customers <em>and regulators</em> can trust.
            </h1>
          </Reveal>
          <Reveal delay={0.16}>
            <p className="mx-auto mt-7 max-w-2xl text-[18px] leading-relaxed text-slate">
              Theory Cloud is the platform for putting AI agents in front of customers safely. Every answer is sourced,
              every customer&apos;s data stays separate, and a person approves every change. Your pilot becomes a
              service you can stand behind.
            </p>
          </Reveal>
          <Reveal delay={0.24} className="mt-9 flex flex-wrap justify-center gap-3">
            <Button href="/contact">Book a demo</Button>
            <Button href="/use-cases" variant="ghost">See solutions</Button>
          </Reveal>
        </div>
        <Reveal delay={0.35} className="relative mt-16">
          <TrustDemo />
        </Reveal>
      </section>

      <ProofBar />
      <Problem />
      <PlatformTabs />
      <Roles />

      <section className="px-4 py-28 sm:px-6">
        <SectionHead
          eyebrow="Solutions"
          title={<>What businesses launch with <em>Theory Cloud.</em></>}
          body="From payment support desks to partner programs, these are six ways teams turn AI pilots into services customers use."
        />
        <div className="mt-14">
          <UseCaseGrid />
        </div>
      </section>

      <CustomerFeature />
      <Shifts />
      <Engagement />
      <Trust />
      <CtaBand />
    </>
  );
}
