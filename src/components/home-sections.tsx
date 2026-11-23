"use client";

import Link from "next/link";
import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import {
  ArrowRight,
  ArrowUpRight,
  Check,
  Copy,
  ShieldCheck,
  Lock,
  FileCheck2,
  GitBranch,
  UserCheck,
  ScrollText,
  Headset,
  Scale,
  Cpu,
  Handshake,
  CreditCard,
  Code2,
  Cloud,
  Users,
  Landmark,
  Boxes,
  CircleCheck,
} from "lucide-react";
import { productValue, products, useCases } from "@/lib/site";
import { Reveal, SectionHead } from "./ui";

/* ── Proof bar: real customer + the tools buyers already use ── */
const hosts = ["Claude Code", "Codex", "Antigravity", "Amazon Web Services", "AWS Lambda", "Amazon EventBridge", "Amazon SQS", "Go", "TypeScript", "Python"];

export function ProofBar() {
  return (
    <div className="mx-auto max-w-6xl px-4">
      <div className="flex flex-col items-center gap-6 md:flex-row md:gap-10">
        <div className="flex shrink-0 items-center gap-3 rounded-full border border-line bg-white px-4 py-2 text-sm">
          <CircleCheck size={16} className="text-verified" />
          <span>
            In production at <span className="font-semibold">Pay Theory</span>
          </span>
        </div>
        <div className="mask-fade-x w-full overflow-hidden">
          <div className="flex w-max animate-marquee gap-3 hover:[animation-play-state:paused]">
            {[...hosts, ...hosts].map((h, i) => (
              <span key={i} className="rounded-full px-4 py-2 text-sm text-ink/55">
                {h}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── The business problem ── */
const problems = [
  { before: "Agents make up answers", after: "Every answer has a source", body: "Agents answer only from content you've approved, and every reply cites the policy or page it came from." },
  { before: "Customer data gets mixed", after: "Every customer kept separate", body: "Each customer, partner and team is isolated by design, so one person's data can't reach another's conversation." },
  { before: "Agents forget customers", after: "Agents remember every customer", body: "Agents keep each customer's history across conversations, so nobody has to start again from the beginning." },
  { before: "Locked into one AI vendor", after: "Switch AI models freely", body: "Customer history and knowledge stay with you, so you can change AI models without starting over." },
];

export function Problem() {
  return (
    <section className="px-4 py-28 sm:px-6">
      <SectionHead
        eyebrow="Why Theory Cloud"
        title={<>Most AI agents never get <em>past the pilot.</em></>}
        body="The demo works. Then legal, security and customer experience teams ask questions nobody can answer. Theory Cloud answers them from day one."
      />
      <div className="mx-auto mt-16 grid max-w-6xl gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {problems.map((p, i) => (
          <Reveal key={p.after} delay={i * 0.08} className="card group h-full p-7 transition hover:-translate-y-1 hover:shadow-2xl hover:shadow-fuchsia/10">
            <p className="text-sm text-slate line-through decoration-apricot decoration-2">{p.before}</p>
            <h3 className="display mt-6 text-[1.3rem]">{p.after}</h3>
            <p className="mt-3 text-[15px] leading-relaxed text-slate">{p.body}</p>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

/* ── Platform: tabbed product explorer, business framing ── */
export function PlatformTabs() {
  const [active, setActive] = useState(0);
  const p = products[active];
  const v = productValue[p.slug];
  return (
    <section id="platform" className="scroll-mt-28 px-4 py-28 sm:px-6">
      <SectionHead
        eyebrow="The platform"
        title={<>Everything you need to launch AI agents <em>with confidence.</em></>}
        body="Start with one product or use the whole platform. Each product removes a reason AI projects stall."
      />
      <Reveal className="mx-auto mt-14 max-w-6xl">
        <div role="tablist" aria-label="Products" className="flex gap-1 overflow-x-auto rounded-full border border-line bg-white p-1">
          {products.map((x, i) => (
            <button
              key={x.slug}
              role="tab"
              aria-selected={i === active}
              onClick={() => setActive(i)}
              className={`relative shrink-0 flex-1 whitespace-nowrap rounded-full px-4 py-2.5 text-sm font-medium transition ${i === active ? "text-white" : "text-ink/70 hover:text-ink"}`}
            >
              {i === active && <motion.span layoutId="tab-pill" className="absolute inset-0 rounded-full bg-ink" transition={{ type: "spring", bounce: 0.15, duration: 0.5 }} />}
              <span className="relative">{x.kicker}</span>
            </button>
          ))}
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={p.slug}
            role="tabpanel"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.35 }}
            className="card mt-4 grid gap-10 overflow-hidden p-6 sm:p-10 lg:grid-cols-[1fr_1fr] [&>*]:min-w-0"
          >
            <div>
              <p className="eyebrow">{p.name}</p>
              <h3 className="display mt-3 text-[1.6rem] sm:text-[2rem]">{p.tagline}</h3>
              <p className="mt-4 leading-relaxed text-slate">{v.pitch}</p>
              <div className="mt-6 flex flex-wrap items-center gap-2">
                <span className="text-xs text-slate">Best for</span>
                {v.bestFor.map((b) => (
                  <span key={b} className="rounded-full bg-iris-soft px-3 py-1 text-xs font-medium text-iris">{b}</span>
                ))}
              </div>
              <div className="mt-8 flex flex-wrap gap-4 text-sm font-medium">
                <Link href={`/products/${p.slug}`} className="inline-flex items-center gap-1 text-iris hover:underline">
                  Explore {p.name} <ArrowRight size={14} />
                </Link>
                <Link href="/contact" className="inline-flex items-center gap-1 text-ink/70 hover:text-ink">
                  Talk to sales <ArrowUpRight size={14} />
                </Link>
              </div>
            </div>
            <div className="relative">
              <div className="aurora absolute -inset-6 opacity-60" aria-hidden />
              <div className="on-dark terminal relative rounded-2xl p-6 sm:p-7">
                <p className="text-[12px] uppercase tracking-[0.14em] text-white/45">What your business gets</p>
                <ul className="mt-5 space-y-5">
                  {v.value.map((x, n) => (
                    <motion.li key={x.title} initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 + n * 0.1 }} className="flex gap-3">
                      <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-iris to-fuchsia">
                        <Check size={13} className="text-white" />
                      </span>
                      <div>
                        <div className="font-semibold text-white">{x.title}</div>
                        <div className="mt-0.5 text-[14px] leading-relaxed text-white/60">{x.body}</div>
                      </div>
                    </motion.li>
                  ))}
                </ul>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </Reveal>
    </section>
  );
}

/* Technical visual, used on product pages for evaluators */
export function ProductVisual({ slug }: { slug: string }) {
  const p = products.find((x) => x.slug === slug)!;
  return (
    <div className="relative">
      <div className="aurora absolute -inset-6 opacity-50" aria-hidden />
      <div className="terminal relative rounded-2xl p-5 font-mono text-[12.5px] leading-[1.8]">
        <div className="mb-3 flex items-center justify-between text-[11px] text-white/40">
          <span>{p.snippet.label}</span>
          <span className="rounded bg-white/10 px-2 py-0.5 text-white/60">{p.name}</span>
        </div>
        <pre className="overflow-x-auto whitespace-pre">
          {p.snippet.lines.map((l, i) => (
            <div key={i}>
              <span className="mr-4 inline-block w-4 select-none text-right text-white/20">{i + 1}</span>
              <span className={l.startsWith("  ✓") ? "text-verified" : l.startsWith("→") ? "text-apricot" : ""}>{l}</span>
            </div>
          ))}
        </pre>
      </div>
      <dl className="relative mt-3 grid grid-cols-2 gap-2">
        {p.specs.map((s) => (
          <div key={s.label} className="rounded-xl border border-line bg-white/90 px-4 py-3">
            <dt className="text-[11px] text-slate">{s.label}</dt>
            <dd className="mt-0.5 text-sm font-medium">{s.value}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}

/* ── Who it's for: the people who sign off ── */
const roles = [
  { icon: Headset, role: "Customer experience leaders", pitch: "Resolve more questions on the first contact, with agents that know each customer and their history." },
  { icon: Scale, role: "Compliance & risk", pitch: "Approve AI with confidence. Every answer is sourced, every change is reviewed, and there's an audit trail." },
  { icon: Cpu, role: "CTOs & engineering", pitch: "Ship faster on a proven backbone, with no lock-in to one AI vendor or framework." },
  { icon: Handshake, role: "Partnerships & product", pitch: "Give every partner their own branded agent without a separate build for each one." },
];

export function Roles() {
  return (
    <section className="px-4 py-28 sm:px-6">
      <SectionHead eyebrow="Who it's for" title={<>Built for the people who <em>sign off.</em></>} />
      <div className="mx-auto mt-14 grid max-w-6xl gap-px overflow-hidden rounded-[24px] border border-line bg-line sm:grid-cols-2 lg:grid-cols-4">
        {roles.map((r, i) => (
          <Reveal key={r.role} delay={i * 0.08} className="h-full">
            <div className="group flex h-full flex-col bg-white p-7 transition hover:bg-porcelain">
              <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-iris to-fuchsia text-white shadow-lg shadow-fuchsia/20">
                <r.icon size={20} />
              </span>
              <h3 className="display mt-6 text-[1.1rem]">{r.role}</h3>
              <p className="mt-3 flex-1 text-[15px] leading-relaxed text-slate">{r.pitch}</p>
              <Link href="/contact" className="mt-6 inline-flex items-center gap-1 text-sm font-medium text-iris">
                Book a demo <ArrowRight size={14} className="transition group-hover:translate-x-0.5" />
              </Link>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

/* ── Use cases (business framing) ── */
const ucIcon: Record<string, typeof CreditCard> = {
  "fintech-support": CreditCard,
  "engineering-knowledge": Code2,
  "serverless-mcp": Cloud,
  "partner-agents": Users,
  "regulated-knowledge": Landmark,
  "agent-distribution": Boxes,
};

export function UseCaseGrid({ limit }: { limit?: number }) {
  const list = limit ? useCases.slice(0, limit) : useCases;
  return (
    <div className="mx-auto grid max-w-6xl gap-4 md:grid-cols-2 lg:grid-cols-3">
      {list.map((u, i) => {
        const Icon = ucIcon[u.slug] ?? Boxes;
        return (
          <Reveal key={u.slug} delay={(i % 3) * 0.08} className="h-full">
            <Link href={`/use-cases#${u.slug}`} className="card group flex h-full flex-col overflow-hidden transition hover:-translate-y-1 hover:shadow-2xl hover:shadow-iris/10">
              <div className="relative flex h-36 items-end justify-between overflow-hidden bg-ink p-6">
                <div className="aurora absolute inset-0 opacity-50 transition duration-500 group-hover:scale-110 group-hover:opacity-80" aria-hidden />
                <span className="relative font-mono text-[11px] uppercase tracking-[0.14em] text-white/70">{u.industry}</span>
                <Icon size={44} strokeWidth={1.2} className="relative text-white/90 transition group-hover:-translate-y-1" />
              </div>
              <div className="flex flex-1 flex-col p-6">
                <h3 className="text-lg font-semibold leading-snug">{u.title}</h3>
                <p className="mt-2 flex-1 text-sm leading-relaxed text-slate">{u.outcome}</p>
                <span className="mt-5 inline-flex items-center gap-1 text-sm font-medium text-iris">
                  See how it works <ArrowRight size={14} className="transition group-hover:translate-x-0.5" />
                </span>
              </div>
            </Link>
          </Reveal>
        );
      })}
    </div>
  );
}

/* ── Before → after, in business outcomes ── */
const shifts = [
  { label: "AI pilots", from: "Stuck in review", to: "Live with customers" },
  { label: "Answers compliance can audit", from: "Some", to: "Every one" },
  { label: "Customer history after switching AI vendor", from: "Lost", to: "Kept" },
  { label: "Launching a new partner", from: "A new build", to: "A new link" },
];

export function Shifts() {
  return (
    <section className="px-4 py-28 sm:px-6">
      <SectionHead eyebrow="The difference" title={<>From promising demo to <em>dependable service.</em></>} />
      <div className="mx-auto mt-14 grid max-w-6xl gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {shifts.map((s, i) => (
          <Reveal key={s.label} delay={i * 0.08} className="card h-full p-6">
            <p className="text-sm text-slate">{s.label}</p>
            <p className="mt-6 text-lg text-slate/70 line-through decoration-apricot decoration-2">{s.from}</p>
            <p className="display grad mt-1 text-[1.6rem]">{s.to}</p>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

/* ── How we work with you: a real sequence, so numbering is earned ── */
const engagement = [
  { step: "Discovery call", body: "In 30 minutes we map one of your customer or team workflows and the risks you need to control." },
  { step: "Focused pilot", body: "We run that workflow with your real content and your real access rules, with your compliance team watching." },
  { step: "Launch", body: "Go live with customers. Every answer is sourced and every change goes through an approval." },
  { step: "Scale", body: "Roll out to more teams, partners and regions on the same foundation." },
];

export function Engagement() {
  return (
    <section className="relative overflow-hidden px-4 py-28 sm:px-6">
      <div className="grid-dots absolute inset-0 opacity-50 [mask-image:radial-gradient(ellipse_at_center,black,transparent_70%)]" aria-hidden />
      <div className="relative">
        <SectionHead eyebrow="How we work with you" title={<>From first call to <em>first customer.</em></>} body="Our engineers work alongside your team through the pilot and launch. It's a partnership, not a handoff." />
        <ol className="relative mx-auto mt-16 grid max-w-6xl gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {engagement.map((s, i) => (
            <Reveal key={s.step} delay={i * 0.08} className="h-full">
              <li className="card relative flex h-full flex-col p-7">
                <span className="display grad text-[2.6rem] leading-none">{i + 1}</span>
                <h3 className="mt-5 text-lg font-semibold">{s.step}</h3>
                <p className="mt-2 text-[15px] leading-relaxed text-slate">{s.body}</p>
              </li>
            </Reveal>
          ))}
        </ol>
        <div className="mt-10 text-center">
          <Link href="/contact" className="group inline-flex items-center gap-2 rounded-full bg-ink px-6 py-3 text-[15px] font-medium text-white hover:bg-iris">
            Book your discovery call <ArrowRight size={16} className="transition group-hover:translate-x-0.5" />
          </Link>
        </div>
      </div>
    </section>
  );
}

/* ── Technical: how it works (TheoryMCP product page) ── */
const steps = [
  { verb: "Connect", body: "Point your host at a namespace route. Codex, Claude Code and Antigravity all use the same server ID.", code: "codex mcp login theorymcp" },
  { verb: "Ground", body: "Agents call describe_interface first, so they work from the tools the route actually exposes and never assume.", code: "describe_interface()" },
  { verb: "Query", body: "Search wide, then read narrow. Every answer cites an authoritative unit ID.", code: "search_docs → get_unit" },
  { verb: "Remember", body: "Agent routes add memory that's append-only and scoped to each user, and it stays when you switch models.", code: "memory_append(entry)" },
  { verb: "Materialize", body: "Pull a published agent into a repo as a checksummed pack. It's written whole or not at all.", code: "verify sha256 ✓" },
  { verb: "Publish", body: "When you have the right scope, author an agent in the lab. A person approves the publish before it goes live.", code: "lab → live" },
];

export function HowItWorks() {
  return (
    <section className="px-4 py-24 sm:px-6">
      <SectionHead eyebrow="Under the hood" title={<>How it works, <em>for your engineers.</em></>} />
      <ol className="mx-auto mt-14 grid max-w-6xl gap-px overflow-hidden rounded-[24px] border border-line bg-line sm:grid-cols-2 lg:grid-cols-3">
        {steps.map((s, i) => (
          <Reveal key={s.verb} delay={(i % 3) * 0.08} className="h-full">
            <li className="flex h-full flex-col bg-white p-7">
              <span className="font-mono text-xs text-iris">step {i + 1}</span>
              <h3 className="display mt-3 text-[1.3rem]">{s.verb}</h3>
              <p className="mt-2 flex-1 text-[15px] leading-relaxed text-slate">{s.body}</p>
              <code className="mt-6 inline-block self-start rounded-lg bg-ink px-3 py-1.5 font-mono text-[12px] text-white/85">{s.code}</code>
            </li>
          </Reveal>
        ))}
      </ol>
    </section>
  );
}

/* ── Technical: connect in one minute (TheoryMCP product page) ── */
const hostsCode = {
  "Claude Code": { file: ".mcp.json", code: `{\n  "mcpServers": {\n    "theorymcp": {\n      "type": "http",\n      "url": "https://theorymcp.ai/theorycloud/mcp"\n    }\n  }\n}\n\n# then run /mcp → authenticate` },
  Codex: { file: ".codex/config.toml", code: `[mcp_servers.theorymcp]\nurl = "https://theorymcp.ai/theorycloud/mcp"\noauth_resource = "https://theorymcp.ai/theorycloud/mcp"\nscopes = ["mcp:tools", "ai.kb.query"]\n\n# then: codex mcp login theorymcp` },
  Antigravity: { file: ".agents/mcp_config.json", code: `{\n  "mcpServers": {\n    "theorymcp": {\n      "command": "npx",\n      "args": ["-y", "mcp-remote",\n        "https://theorymcp.ai/theorycloud/mcp"]\n    }\n  }\n}` },
} as const;

export function ConnectSection() {
  const [host, setHost] = useState<keyof typeof hostsCode>("Claude Code");
  const [copied, setCopied] = useState(false);
  const c = hostsCode[host];
  return (
    <section className="px-4 py-24 sm:px-6">
      <div className="mx-auto grid max-w-6xl items-center gap-14 lg:grid-cols-[1fr_1.15fr] [&>*]:min-w-0">
        <SectionHead
          align="left"
          eyebrow="For developers"
          title={<>Connected in <em>one minute.</em></>}
          body="Use one server ID and one route in every host. Sign-in happens inside the host, so nobody pastes an API key into a prompt."
        />
        <Reveal delay={0.1}>
          <div className="terminal overflow-hidden rounded-2xl">
            <div className="flex items-center justify-between border-b border-white/10 px-2">
              <div className="flex">
                {(Object.keys(hostsCode) as (keyof typeof hostsCode)[]).map((h) => (
                  <button
                    key={h}
                    onClick={() => setHost(h)}
                    className={`border-b-2 px-4 py-3 text-[13px] transition ${h === host ? "border-apricot text-white" : "border-transparent text-white/50 hover:text-white/80"}`}
                  >
                    {h}
                  </button>
                ))}
              </div>
              <button
                onClick={() => {
                  navigator.clipboard?.writeText(c.code);
                  setCopied(true);
                  setTimeout(() => setCopied(false), 1500);
                }}
                className="mr-2 inline-flex items-center gap-1.5 rounded-md px-2 py-1 text-[12px] text-white/60 hover:bg-white/10 hover:text-white"
              >
                {copied ? <Check size={13} /> : <Copy size={13} />} {copied ? "Copied" : "Copy"}
              </button>
            </div>
            <div className="px-5 pt-3 font-mono text-[11px] text-white/40">{c.file}</div>
            <pre className="overflow-x-auto px-5 pb-6 pt-2 font-mono text-[13px] leading-[1.75] text-white/85">{c.code}</pre>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* ── Trust / security, in business language ── */
const trust = [
  { icon: Lock, title: "Access per customer and partner", body: "Every customer, partner and team gets its own access, so data never crosses between them." },
  { icon: UserCheck, title: "Private memory", body: "Two people talking to the same agent never see each other's history." },
  { icon: FileCheck2, title: "Verified updates", body: "Agent updates are checked before they install, and a failed check stops the update." },
  { icon: GitBranch, title: "A person approves every change", body: "New or changed agents are tested first, and a person approves them before customers see them." },
  { icon: ScrollText, title: "Full traceability", body: "Every answer links to its source and every release is versioned, so audits are straightforward." },
  { icon: ShieldCheck, title: "Open, inspectable core", body: "The core frameworks are open source, so your security team can review exactly what runs." },
];

export function Trust() {
  return (
    <section className="px-4 py-28 sm:px-6">
      <SectionHead
        eyebrow="Security & governance"
        title={<>Your risk team <em>will say yes.</em></>}
        body="Controls are part of the design from the start, not added after the first audit finding."
      />
      <div className="mx-auto mt-14 grid max-w-6xl gap-x-10 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
        {trust.map((t, i) => (
          <Reveal key={t.title} delay={(i % 3) * 0.08} className="flex gap-4">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-iris-soft text-iris">
              <t.icon size={18} />
            </span>
            <div>
              <h3 className="font-semibold">{t.title}</h3>
              <p className="mt-1 text-[15px] leading-relaxed text-slate">{t.body}</p>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
