import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { Trust } from "@/components/home-sections";
import { CtaBand } from "@/components/ui";

const pages: Record<string, { title: string; body: string }> = {
  privacy: { title: "Privacy policy", body: "Theory Cloud's privacy policy will be published here before launch." },
  terms: { title: "Terms of service", body: "Theory Cloud's terms of service will be published here before launch." },
  security: { title: "Security", body: "How Theory Cloud protects agent identity, memory and knowledge. For security reviews or disclosures, contact security@theorycloud.ai." },
};

export function generateStaticParams() {
  return Object.keys(pages).map((legal) => ({ legal }));
}
export const dynamicParams = false;

export async function generateMetadata({ params }: { params: Promise<{ legal: string }> }): Promise<Metadata> {
  const { legal } = await params;
  return { title: pages[legal]?.title };
}

export default async function LegalPage({ params }: { params: Promise<{ legal: string }> }) {
  const { legal } = await params;
  const page = pages[legal];
  if (!page) notFound();
  return (
    <>
      <section className="px-4 pb-8 pt-20 sm:px-6">
        <div className="mx-auto max-w-3xl">
          <h1 className="display text-[2.2rem] sm:text-[3rem]">{page.title}</h1>
          <p className="mt-6 text-[17px] leading-relaxed text-slate">{page.body}</p>
        </div>
      </section>
      {legal === "security" && (
        <>
          <Trust />
          <CtaBand title={<>Need a <em>security review?</em></>} body="Enterprise plans include an architecture walkthrough and security questionnaire support." />
        </>
      )}
    </>
  );
}
