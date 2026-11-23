"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "motion/react";
import { ArrowRight } from "lucide-react";
import type { ReactNode } from "react";

export function Reveal({ children, delay = 0, className = "" }: { children: ReactNode; delay?: number; className?: string }) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      className={className}
      initial={reduce ? false : { opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}

export function SectionHead({
  eyebrow,
  title,
  body,
  align = "center",
}: {
  eyebrow: string;
  title: ReactNode;
  body?: ReactNode;
  align?: "center" | "left";
}) {
  return (
    <Reveal className={align === "center" ? "mx-auto max-w-3xl text-center" : "max-w-2xl"}>
      <p className="eyebrow">{eyebrow}</p>
      <h2 className="display mt-4 text-[1.9rem] sm:text-[2.7rem]">{title}</h2>
      {body && <p className="mt-5 text-[17px] leading-relaxed text-slate">{body}</p>}
    </Reveal>
  );
}

export function Button({
  href,
  children,
  variant = "primary",
  external,
}: {
  href: string;
  children: ReactNode;
  variant?: "primary" | "ghost" | "light";
  external?: boolean;
}) {
  const styles = {
    primary: "bg-ink text-white hover:bg-iris",
    ghost: "border border-line bg-white/70 text-ink hover:border-ink",
    light: "bg-white text-ink hover:bg-apricot-soft",
  }[variant];
  return (
    <Link
      href={href}
      {...(external ? { target: "_blank", rel: "noreferrer" } : {})}
      className={`group inline-flex items-center gap-2 rounded-full px-5 py-3 text-[15px] font-medium transition ${styles}`}
    >
      {children}
      <ArrowRight size={16} className="transition group-hover:translate-x-0.5" />
    </Link>
  );
}

export function CtaBand({
  title = (
    <>
      Put your first AI agent in front of customers <em>this quarter.</em>
    </>
  ),
  body = "Book a 30-minute call. We'll map one of your workflows, show it working with your own content, and give you a plan to launch.",
}: {
  title?: ReactNode;
  body?: string;
}) {
  return (
    <section className="px-4 py-24 sm:px-6">
      <div className="relative mx-auto max-w-7xl overflow-hidden rounded-[32px] bg-ink px-6 py-20 text-center text-white sm:px-16">
        <div className="aurora pointer-events-none absolute inset-0 opacity-60" aria-hidden />
        <div className="grid-dots pointer-events-none absolute inset-0 opacity-20 invert" aria-hidden />
        <Reveal className="relative">
          <h2 className="on-dark display mx-auto max-w-3xl text-[1.9rem] sm:text-[3rem]">{title}</h2>
          <p className="mx-auto mt-5 max-w-xl text-[17px] leading-relaxed text-white/70">{body}</p>
          <div className="mt-9 flex flex-wrap justify-center gap-3">
            <Button href="/contact" variant="light">Book a demo</Button>
            <Link href="/pricing" className="inline-flex items-center rounded-full border border-white/25 px-5 py-3 text-[15px] font-medium text-white hover:border-white">
              Compare plans
            </Link>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
