"use client";

import { useEffect, useState } from "react";
import { ArrowRight, Check, FileText, KeyRound, Lock, ShieldCheck, X } from "lucide-react";

/*
 * A small product UI for each platform tab. Each UI has three labelled parts, one per
 * business benefit (same order as productValue[slug].value). All names and data are examples.
 */

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
type Props = {};

/* One labelled part of a product UI. `i` is the benefit it illustrates (same order as productValue). */
function Region({ label, className = "", children }: { i: number; label: string; className?: string; children: React.ReactNode }) {
  return (
    <div className={`relative min-w-0 rounded-xl border border-line bg-paper p-3 text-left ${className}`}>
      <span className="mb-2 block font-mono text-[10px] uppercase tracking-[0.12em] text-iris">{label}</span>
      {children}
    </div>
  );
}

function Shell({ app, meta, children }: { app: string; meta: string; children: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-line bg-paper p-2 text-left text-[12.5px] shadow-[0_12px_40px_-18px_rgba(85,70,255,0.35)]">
      <div className="flex items-center justify-between gap-3 px-2 pb-2 pt-1">
        <span className="flex items-center gap-2 font-semibold text-ink">
          <span className="flex gap-1" aria-hidden>
            <span className="h-2 w-2 rounded-full bg-line" />
            <span className="h-2 w-2 rounded-full bg-line" />
            <span className="h-2 w-2 rounded-full bg-line" />
          </span>
          {app}
        </span>
        <span className="truncate font-mono text-[10.5px] text-slate">{meta}</span>
      </div>
      {children}
    </div>
  );
}

const Pill = ({ children, tone = "slate" }: { children: React.ReactNode; tone?: "slate" | "iris" | "ok" | "no" }) => (
  <span
    className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-medium ${
      { slate: "bg-porcelain text-slate", iris: "bg-iris-soft text-iris", ok: "bg-verified/10 text-verified", no: "bg-red-50 text-red-600 dark:bg-red-500/15 dark:text-red-400" }[tone]
    }`}
  >
    {children}
  </span>
);

/* Cycles through a list on a timer, for small "live" touches */
function useCycle(n: number, ms = 2200) {
  const [i, setI] = useState(0);
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const id = setInterval(() => setI((x) => (x + 1) % n), ms);
    return () => clearInterval(id);
  }, [n, ms]);
  return i;
}

/* TheoryMCP: an agent session, with its route, the customer's memory and the model in use */
function TheoryMcpUI(p: Props) {
  const model = useCycle(2, 2600);
  const segs = ["theorymcp.ai", "acme-pay", "partners", "northwind", "agents", "support", "mcp"];
  return (
    <Shell app="Agent session" meta="support agent · live">
      <div className="grid gap-2 sm:grid-cols-[1.3fr_1fr]">
        <Region {...p} i={1} label="Route · who's asking" className="sm:col-span-2">
          <div className="flex flex-wrap items-center gap-1 font-mono text-[11px]">
            {segs.map((s, k) => (
              <span key={k} className="flex items-center gap-1">
                {k > 0 && <span className="text-slate/50">/</span>}
                <span className={`rounded px-1.5 py-0.5 ${s === "northwind" ? "bg-iris text-white" : "bg-porcelain text-ink/70"}`}>{s}</span>
              </span>
            ))}
          </div>
          <span className="mt-2 flex items-center gap-1.5 text-[11.5px] text-slate">
            <Lock size={12} /> Sees Northwind&apos;s customers only
          </span>
        </Region>
        <Region {...p} i={0} label="Customer memory">
          <span className="block font-medium text-ink">Maria · merchant #42</span>
          <span className="mt-1.5 block text-slate">Mar 3 · asked about payout timing</span>
          <span className="block text-slate">Mar 9 · updated bank account</span>
        </Region>
        <Region {...p} i={2} label="AI model">
          <span className="flex rounded-lg bg-porcelain p-0.5 text-[11px] font-medium">
            {["Provider A", "Provider B"].map((m, k) => (
              <span key={m} className={`flex-1 rounded-md px-2 py-1 text-center transition ${model === k ? "bg-paper text-ink shadow-sm" : "text-slate"}`}>
                {m}
              </span>
            ))}
          </span>
          <span className="mt-2 flex items-center gap-1 text-[11.5px] text-verified">
            <Check size={12} /> History kept on switch
          </span>
        </Region>
      </div>
    </Shell>
  );
}

/* FaceTheory: page delivery settings for a site */
function FaceTheoryUI(p: Props) {
  const fw = useCycle(3, 2400);
  return (
    <Shell app="Site delivery" meta="checkout.acmepay.example">
      <div className="grid gap-2 sm:grid-cols-[1.3fr_1fr]">
        <Region {...p} i={0} label="Render mode per page" className="sm:row-span-2">
          {[
            ["/", "SSR", "Server-rendered"],
            ["/pricing", "SSG", "Built ahead"],
            ["/help/*", "ISR", "Refreshed on change"],
          ].map(([route, mode, note]) => (
            <span key={route} className="flex items-center justify-between gap-2 border-b border-line/70 py-1.5 last:border-0">
              <span className="font-mono text-[11.5px] text-ink">{route}</span>
              <span className="flex items-center gap-2">
                <span className="hidden text-[11px] text-slate sm:inline">{note}</span>
                <Pill tone="iris">{mode}</Pill>
              </span>
            </span>
          ))}
        </Region>
        <Region {...p} i={1} label="Deploys with">
          <span className="flex flex-wrap items-center gap-1 text-[11.5px] font-medium">
            <Pill tone="iris">FaceTheory</Pill>
            <ArrowRight size={11} className="text-slate" />
            <Pill>AppTheory</Pill>
            <ArrowRight size={11} className="text-slate" />
            <Pill>TableTheory</Pill>
          </span>
        </Region>
        <Region {...p} i={2} label="Framework">
          <span className="flex rounded-lg bg-porcelain p-0.5 text-[11px] font-medium">
            {["React", "Vue", "Svelte"].map((f, k) => (
              <span key={f} className={`flex-1 rounded-md px-2 py-1 text-center transition ${fw === k ? "bg-paper text-ink shadow-sm" : "text-slate"}`}>
                {f}
              </span>
            ))}
          </span>
        </Region>
      </div>
    </Shell>
  );
}

/* AppTheory: a new service, its runtimes and how it's billed */
function AppTheoryUI(p: Props) {
  const bars = [3, 6, 2, 8, 5, 9, 4, 7, 2, 6, 8, 3];
  return (
    <Shell app="New service" meta="payouts-api">
      <div className="grid gap-2 sm:grid-cols-3">
        <Region {...p} i={0} label="Production defaults">
          {["Routing", "Auth hooks", "CORS & guardrails", "Observability"].map((x) => (
            <span key={x} className="flex items-center gap-1.5 py-0.5 text-ink/80">
              <Check size={12} className="text-verified" /> {x}
            </span>
          ))}
        </Region>
        <Region {...p} i={1} label="Same behaviour in">
          {["Go", "TypeScript", "Python"].map((x) => (
            <span key={x} className="flex items-center justify-between py-0.5">
              <span className="text-ink/80">{x}</span>
              <Pill tone="ok">
                <Check size={10} /> contract
              </Pill>
            </span>
          ))}
        </Region>
        <Region {...p} i={2} label="Billed per request">
          <span className="flex h-12 items-end gap-[3px]">
            {bars.map((h, k) => (
              <span key={k} className="flex-1 rounded-sm bg-iris/70" style={{ height: `${h * 10}%` }} />
            ))}
          </span>
          <span className="mt-1.5 block text-[11.5px] text-slate">Idle servers: 0</span>
        </Region>
      </div>
    </Shell>
  );
}

/* KnowledgeTheory: an answer, its source and the policy's version */
function KnowledgeTheoryUI(p: Props) {
  return (
    <Shell app="Answer review" meta="kb: payments-policy">
      <div className="grid gap-2 sm:grid-cols-[1.3fr_1fr]">
        <Region {...p} i={0} label="Agent answer" className="sm:row-span-2">
          <span className="block leading-relaxed text-ink">The chargeback window for ACH debits is 60 days.</span>
          <span className="mt-2 inline-flex items-center gap-1 rounded-md bg-porcelain px-2 py-1 font-mono text-[10.5px] text-slate">
            <FileText size={11} /> cites pp-ach-014
          </span>
        </Region>
        <Region {...p} i={1} label="Source trail">
          <span className="block text-ink/80">Payments policy · ACH</span>
          <span className="block text-slate">Approved by Compliance</span>
        </Region>
        <Region {...p} i={2} label="Version">
          <span className="flex items-center gap-1.5 font-mono text-[11px]">
            <span className="text-slate line-through">v12</span>
            <ArrowRight size={11} className="text-slate" />
            <span className="text-ink">v13</span>
          </span>
          <span className="mt-1 block text-[11.5px] text-verified">Live in 3 agents</span>
        </Region>
      </div>
    </Shell>
  );
}

/* Autheory: what an agent may do, how people sign in, and who can reach it */
function AutheoryUI(p: Props) {
  return (
    <Shell app="Access policy" meta="support agent">
      <div className="grid gap-2 sm:grid-cols-3">
        <Region {...p} i={0} label="Permissions">
          {[
            ["Search knowledge", true],
            ["Remember customers", true],
            ["Issue refunds", false],
          ].map(([x, ok]) => (
            <span key={x as string} className="flex items-center justify-between gap-2 py-0.5">
              <span className="truncate text-ink/80">{x}</span>
              {ok ? <Check size={13} className="shrink-0 text-verified" /> : <X size={13} className="shrink-0 text-red-500" />}
            </span>
          ))}
        </Region>
        <Region {...p} i={1} label="Sign-in">
          <span className="flex items-center gap-1.5 text-ink/80">
            <ShieldCheck size={13} className="text-verified" /> Company SSO
          </span>
          <span className="mt-1 flex items-center gap-1.5 text-slate">
            <KeyRound size={13} /> Keys pasted in chat: 0
          </span>
        </Region>
        <Region {...p} i={2} label="Who can reach it">
          {[
            ["Support team", "12 people"],
            ["Northwind", "1 route"],
            ["Authors", "2 people"],
          ].map(([w, n]) => (
            <span key={w} className="flex items-center justify-between gap-2 py-0.5">
              <span className="truncate text-ink/80">{w}</span>
              <span className="shrink-0 text-[11px] text-slate">{n}</span>
            </span>
          ))}
        </Region>
      </div>
    </Shell>
  );
}

/* TableTheory: one data model, its scale and the services sharing it */
function TableTheoryUI(p: Props) {
  const lang = useCycle(3, 2400);
  const langs = ["Go", "TypeScript", "Python"];
  const spark = "M0 30 L10 26 L20 28 L30 18 L40 22 L50 12 L60 16 L70 8 L80 11 L90 4 L100 6";
  return (
    <Shell app="Data model" meta="Payment">
      <div className="grid gap-2 sm:grid-cols-[1.3fr_1fr]">
        <Region {...p} i={0} label={`Same model in ${langs[lang]}`} className="sm:row-span-2">
          {[
            ["id", "string", "pk"],
            ["merchant", "string", "sk"],
            ["amount", "int64", ""],
            ["status", "string", ""],
          ].map(([f, t, k]) => (
            <span key={f} className="flex items-center justify-between gap-2 border-b border-line/70 py-1 font-mono text-[11px] last:border-0">
              <span className="text-ink">{f}</span>
              <span className="flex items-center gap-2 text-slate">
                {t} {k && <Pill tone="iris">{k}</Pill>}
              </span>
            </span>
          ))}
        </Region>
        <Region {...p} i={1} label="Serverless storage">
          <svg viewBox="0 0 100 34" className="h-9 w-full" aria-hidden>
            <path d={spark} fill="none" stroke="#5546ff" strokeWidth="2" strokeLinejoin="round" />
          </svg>
          <span className="block text-[11.5px] text-slate">Scales with demand</span>
        </Region>
        <Region {...p} i={2} label="Shared by">
          <span className="flex flex-wrap gap-1">
            {["payments-api", "ledger", "payouts"].map((s) => (
              <Pill key={s}>{s}</Pill>
            ))}
          </span>
        </Region>
      </div>
    </Shell>
  );
}

const uis: Record<string, (p: Props) => React.JSX.Element> = {
  theorymcp: TheoryMcpUI,
  facetheory: FaceTheoryUI,
  apptheory: AppTheoryUI,
  knowledgetheory: KnowledgeTheoryUI,
  autheory: AutheoryUI,
  tabletheory: TableTheoryUI,
};

export function ProductUI({ slug, ...p }: Props & { slug: string }) {
  const UI = uis[slug];
  return UI ? <UI {...p} /> : null;
}
