import { Button, CtaBand, Reveal } from "@/components/ui";
import { Engagement, PlatformTabs, Problem, Roles, Shifts, Trust } from "@/components/home-sections";
import { CustomerFeature } from "@/components/customer-feature";
import { PartnerCarousel } from "@/components/partner-carousel";
import { UseCaseScreens } from "@/components/use-case-screens";
import { HeroCanvas } from "@/components/three/lazy";

export default function Home() {
  return (
    <>
      {/* Hero: copy on the left, interactive 3D trust network on the right */}
      <section className="relative -mt-[100px] overflow-hidden px-4 pb-10 pt-[150px] sm:px-6">
        <div className="aurora pointer-events-none absolute inset-x-0 -top-20 h-[760px]" aria-hidden />
        <div className="grid-dots pointer-events-none absolute inset-0 opacity-40 [mask-image:linear-gradient(to_bottom,black,transparent_70%)]" aria-hidden />
        <div className="relative mx-auto grid max-w-7xl items-center gap-6 lg:grid-cols-[1fr_1.05fr] [&>*]:min-w-0">
          <div>
            <Reveal>
              <p className="inline-flex items-center gap-2 rounded-full border border-white/80 bg-white/60 px-3 py-1 text-[13px] text-ink/80 backdrop-blur">
                <span className="h-1.5 w-1.5 rounded-full bg-verified" /> Trusted AI agents for customer-facing business
              </p>
            </Reveal>
            <Reveal delay={0.08}>
              <h1 className="display mt-7 text-[2.6rem] sm:text-[4rem] xl:text-[4.6rem]">
                AI agents your customers <em>and regulators</em> can trust.
              </h1>
            </Reveal>
            <Reveal delay={0.16}>
              <p className="mt-7 max-w-xl text-[18px] leading-relaxed text-slate">
                Theory Cloud is the platform for putting AI agents in front of customers safely. Every answer is sourced,
                every customer&apos;s data stays separate, and a person approves every change. Your pilot becomes a
                service you can stand behind.
              </p>
            </Reveal>
            <Reveal delay={0.24} className="mt-9 flex flex-wrap gap-3">
              <Button href="/contact">Book a demo</Button>
              <Button href="/use-cases" variant="ghost">See solutions</Button>
            </Reveal>
          </div>
          <Reveal delay={0.2} className="relative h-[420px] sm:h-[520px] lg:h-[600px]">
            <HeroCanvas />
          </Reveal>
        </div>
      </section>

      <PartnerCarousel />
      <Problem />
      <PlatformTabs />
      <Roles />

      <UseCaseScreens />

      <CustomerFeature />
      <Shifts />
      <Engagement />
      <Trust />
      <CtaBand />
    </>
  );
}
