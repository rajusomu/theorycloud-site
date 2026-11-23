import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Reveal } from "./ui";

/* Facts here come from the AppTheory docs ("used in production by Pay Theory").
   TODO: replace the quote placeholder with an approved Pay Theory quote + metrics. */
export function CustomerFeature() {
  return (
    <section className="px-4 py-28 sm:px-6">
      <Reveal className="mx-auto max-w-6xl">
        <div className="card grid overflow-hidden lg:grid-cols-[1.1fr_1fr]">
          <div className="p-8 sm:p-12">
            <p className="eyebrow">Customer story · Payments</p>
            <h2 className="display mt-4 text-[1.7rem] sm:text-[2.3rem]">
              How <em>Pay Theory</em> runs its payments platform on Theory Cloud.
            </h2>
            <p className="mt-5 leading-relaxed text-slate">
              Pay Theory moves money for software platforms, so &ldquo;mostly right&rdquo; isn&apos;t an option. Its
              production services run on Theory Cloud&apos;s AppTheory backbone. Every team ships on the same proven
              foundation, whichever language it works in.
            </p>
            <Link href="/customers/pay-theory" className="mt-8 inline-flex items-center gap-1.5 font-medium text-iris hover:underline">
              Read the story <ArrowRight size={16} />
            </Link>
          </div>
          <div className="on-dark relative overflow-hidden bg-night p-8 text-white sm:p-12">
            <div className="aurora absolute inset-0 opacity-50" aria-hidden />
            <div className="relative grid h-full grid-cols-2 content-between gap-6">
              {[
                ["Live", "in production, moving real money"],
                ["427", "automated checks on every change"],
                ["3", "languages, one standard"],
                ["1", "foundation for every service"],
              ].map(([n, l]) => (
                <div key={l} className="border-t border-white/15 pt-4">
                  <div className="display grad text-[2rem] leading-none sm:text-[2.4rem]">{n}</div>
                  <div className="mt-2 text-sm text-white/60">{l}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Reveal>
    </section>
  );
}
