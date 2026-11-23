"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { ArrowRight, Check, CircleAlert, FileText, Loader2, Lock, RefreshCw, ShieldCheck, X } from "lucide-react";
import { products, useCases } from "@/lib/site";
import { Reveal, SectionHead } from "./ui";

/*
 * Use cases shown as working app screens that a customer could build on Theory Cloud,
 * not as chat windows. Every company name and figure in these screens is example data.
 */

function Frame({ app, url, children }: { app: string; url: string; children: React.ReactNode }) {
  return (
    <div className="overflow-hidden rounded-2xl border border-line bg-paper shadow-2xl shadow-iris/10">
      <div className="flex items-center gap-3 border-b border-line bg-porcelain px-4 py-2.5">
        <span className="flex gap-1.5" aria-hidden>
          <span className="h-2.5 w-2.5 rounded-full bg-[#ff6b6b]/70" />
          <span className="h-2.5 w-2.5 rounded-full bg-[#ffc44d]/70" />
          <span className="h-2.5 w-2.5 rounded-full bg-[#4dd68a]/70" />
        </span>
        <span className="min-w-0 flex-1 truncate rounded-md bg-paper px-3 py-1 font-mono text-[11px] text-slate">{url}</span>
        <span className="hidden text-[11px] font-medium text-slate sm:inline">{app}</span>
      </div>
      <div className="h-[430px] overflow-hidden text-[13px]">{children}</div>
    </div>
  );
}

function Tag({ children, tone = "slate" }: { children: React.ReactNode; tone?: "slate" | "iris" | "verified" | "apricot" | "danger" }) {
  const t = {
    slate: "bg-porcelain text-slate",
    iris: "bg-iris-soft text-iris",
    verified: "bg-verified/10 text-verified",
    apricot: "bg-apricot-soft text-[#c2622f] dark:text-apricot",
    danger: "bg-red-50 text-red-600 dark:bg-red-500/15 dark:text-red-400",
  }[tone];
  return <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-medium ${t}`}>{children}</span>;
}

/* 1 · Payments: merchant payout console with explained holds */
const payouts = [
  { id: "PO-20418", merchant: "Blue Fern Coffee", amount: "$12,480.00", status: "On hold", reason: "First transfer above $10,000 gets a standard 2-day review.", policy: "Payouts policy §4.2", history: "2 earlier contacts about payout timing", eta: "Releases Thu, 10:00" },
  { id: "PO-20417", merchant: "Kite & Co.", amount: "$3,215.40", status: "Paid", reason: "Paid on schedule.", policy: "Payouts policy §2.1", history: "No earlier contacts", eta: "Paid Tue" },
  { id: "PO-20416", merchant: "Northstar Gym", amount: "$8,940.10", status: "On hold", reason: "Bank account changed in the last 72 hours, so the payout waits for confirmation.", policy: "Risk policy §1.7", history: "1 earlier contact, account update", eta: "Waiting on merchant" },
  { id: "PO-20415", merchant: "Pixel Pantry", amount: "$1,092.75", status: "Paid", reason: "Paid on schedule.", policy: "Payouts policy §2.1", history: "No earlier contacts", eta: "Paid Mon" },
  { id: "PO-20414", merchant: "Lumen Dental", amount: "$5,604.00", status: "Scheduled", reason: "Scheduled for the next payout window.", policy: "Payouts policy §2.3", history: "No earlier contacts", eta: "Wed, 09:00" },
];

function PayoutsScreen() {
  const [filter, setFilter] = useState<"All" | "On hold" | "Paid">("All");
  const [sel, setSel] = useState("PO-20418");
  const list = payouts.filter((p) => filter === "All" || p.status === filter);
  const cur = payouts.find((p) => p.id === sel) ?? payouts[0];
  const tone = (s: string) => (s === "Paid" ? "verified" : s === "On hold" ? "apricot" : "iris");
  return (
    <Frame app="Acme Pay · Merchant console" url="console.acmepay.example/payouts">
      <div className="grid h-full sm:grid-cols-[1.25fr_1fr]">
        <div className="min-w-0 border-r border-line p-4">
          <div className="flex items-center justify-between">
            <span className="font-semibold">Payouts</span>
            <div className="flex gap-1 rounded-full bg-porcelain p-0.5">
              {(["All", "On hold", "Paid"] as const).map((f) => (
                <button key={f} onClick={() => setFilter(f)} className={`rounded-full px-2.5 py-1 text-[11px] font-medium transition ${filter === f ? "bg-paper text-ink shadow-sm" : "text-slate"}`}>
                  {f}
                </button>
              ))}
            </div>
          </div>
          <ul className="mt-3 space-y-1.5">
            {list.map((p) => (
              <li key={p.id}>
                <button onClick={() => setSel(p.id)} className={`flex w-full items-center justify-between gap-2 rounded-xl border px-3 py-2.5 text-left transition ${sel === p.id ? "border-iris bg-iris-soft/50" : "border-transparent hover:bg-porcelain"}`}>
                  <span className="min-w-0">
                    <span className="block truncate font-medium">{p.merchant}</span>
                    <span className="font-mono text-[10.5px] text-slate">{p.id}</span>
                  </span>
                  <span className="flex shrink-0 flex-col items-end gap-1">
                    <span className="tabular-nums">{p.amount}</span>
                    <Tag tone={tone(p.status)}>{p.status}</Tag>
                  </span>
                </button>
              </li>
            ))}
          </ul>
        </div>
        <AnimatePresence mode="wait">
          <motion.div key={cur.id} initial={{ opacity: 0, x: 12 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.25 }} className="hidden min-w-0 flex-col bg-porcelain/60 p-4 sm:flex">
            <span className="text-[11px] uppercase tracking-[0.12em] text-slate">Payout {cur.id}</span>
            <span className="display mt-1 text-[1.5rem]">{cur.amount}</span>
            <Tag tone={tone(cur.status)}>{cur.eta}</Tag>
            <div className="mt-4 rounded-xl border border-line bg-paper p-3">
              <span className="text-[11px] font-semibold text-iris">Why this status</span>
              <p className="mt-1 leading-relaxed">{cur.reason}</p>
              <span className="mt-2 inline-flex items-center gap-1 rounded-md bg-porcelain px-2 py-1 font-mono text-[10.5px] text-slate">
                <FileText size={11} /> {cur.policy}
              </span>
            </div>
            <dl className="mt-3 space-y-2 text-[12px]">
              <div className="flex items-start gap-2"><RefreshCw size={13} className="mt-0.5 text-slate" /><span><dt className="inline font-medium">History: </dt><dd className="inline text-slate">{cur.history}</dd></span></div>
              <div className="flex items-start gap-2"><Lock size={13} className="mt-0.5 text-slate" /><span><dt className="inline font-medium">Visible to: </dt><dd className="inline text-slate">this merchant only</dd></span></div>
            </dl>
          </motion.div>
        </AnimatePresence>
      </div>
    </Frame>
  );
}

/* 2 · Partner programs: launch a branded agent per partner */
const partnerSeed = [
  { slug: "northwind", name: "Northwind Bank", color: "#5546ff", on: true },
  { slug: "harbor", name: "Harbor Insurance", color: "#14b8a6", on: true },
  { slug: "contoso", name: "Contoso Credit", color: "#ff9f6b", on: false },
  { slug: "fabrikam", name: "Fabrikam Wealth", color: "#c13cff", on: false },
];
const swatches = ["#5546ff", "#c13cff", "#ff9f6b", "#14b8a6", "#0b0f1a"];
const scopeList = ["Knowledge search", "Customer memory", "Payments (read)", "Payments (refund)"];

function PartnersScreen() {
  const [partners, setPartners] = useState(partnerSeed);
  const [sel, setSel] = useState("northwind");
  const [scopes, setScopes] = useState<Record<string, string[]>>({ northwind: ["Knowledge search", "Customer memory"], harbor: ["Knowledge search"], contoso: [], fabrikam: [] });
  const p = partners.find((x) => x.slug === sel)!;
  const update = (patch: Partial<typeof p>) => setPartners((ps) => ps.map((x) => (x.slug === sel ? { ...x, ...patch } : x)));
  const toggleScope = (s: string) => setScopes((sc) => ({ ...sc, [sel]: sc[sel].includes(s) ? sc[sel].filter((x) => x !== s) : [...sc[sel], s] }));
  return (
    <Frame app="Acme Pay · Partner portal" url="partners.acmepay.example/agents">
      <div className="grid h-full sm:grid-cols-[1fr_1.2fr]">
        <div className="min-w-0 border-r border-line p-4">
          <span className="font-semibold">Partners</span>
          <ul className="mt-3 space-y-1.5">
            {partners.map((x) => (
              <li key={x.slug} className={`flex items-center gap-2 rounded-xl border px-3 py-2.5 transition ${sel === x.slug ? "border-iris bg-iris-soft/50" : "border-transparent hover:bg-porcelain"}`}>
                <button onClick={() => setSel(x.slug)} className="flex min-w-0 flex-1 items-center gap-2 text-left">
                  <span className="h-3 w-3 shrink-0 rounded-full" style={{ background: x.color }} />
                  <span className="truncate font-medium">{x.name}</span>
                </button>
                <button
                  role="switch"
                  aria-checked={x.on}
                  aria-label={`Agent live for ${x.name}`}
                  onClick={() => setPartners((ps) => ps.map((y) => (y.slug === x.slug ? { ...y, on: !y.on } : y)))}
                  className={`relative h-5 w-9 shrink-0 rounded-full transition ${x.on ? "bg-verified" : "bg-line"}`}
                >
                  <span className={`absolute top-0.5 h-4 w-4 rounded-full bg-paper shadow transition-all ${x.on ? "left-[18px]" : "left-0.5"}`} />
                </button>
              </li>
            ))}
          </ul>
          <p className="mt-4 text-[11.5px] leading-relaxed text-slate">One setup. Each partner gets its own branded agent, data and access.</p>
        </div>
        <div className="min-w-0 space-y-3 overflow-hidden p-4">
          <div className="flex items-center justify-between">
            <span className="font-semibold">{p.name}</span>
            <Tag tone={p.on ? "verified" : "slate"}>{p.on ? "Live" : "Paused"}</Tag>
          </div>
          <div>
            <span className="text-[11px] text-slate">Brand colour</span>
            <div className="mt-1 flex gap-1.5">
              {swatches.map((c) => (
                <button key={c} aria-label={`Use colour ${c}`} onClick={() => update({ color: c })} className={`h-6 w-6 rounded-full ring-offset-2 transition ${p.color === c ? "ring-2 ring-ink" : ""}`} style={{ background: c }} />
              ))}
            </div>
          </div>
          <div>
            <span className="text-[11px] text-slate">What this agent may do</span>
            <div className="mt-1 grid grid-cols-2 gap-1.5">
              {scopeList.map((s) => {
                const on = scopes[sel].includes(s);
                return (
                  <button key={s} onClick={() => toggleScope(s)} className={`flex items-center gap-1.5 rounded-lg border px-2 py-1.5 text-left text-[11.5px] transition ${on ? "border-iris bg-iris-soft/60 text-iris" : "border-line text-slate"}`}>
                    <span className={`flex h-3.5 w-3.5 shrink-0 items-center justify-center rounded ${on ? "bg-iris text-white" : "border border-line"}`}>{on && <Check size={10} />}</span>
                    {s}
                  </button>
                );
              })}
            </div>
          </div>
          {/* Live preview of the partner's branded widget */}
          <div className="overflow-hidden rounded-xl border border-line">
            <div className="flex items-center gap-2 px-3 py-2 text-white transition-colors" style={{ background: p.color }}>
              <span className="h-5 w-5 rounded-md bg-white/25" />
              <span className="text-[12px] font-semibold">{p.name} Assist</span>
            </div>
            <div className="px-3 py-2 font-mono text-[10.5px] text-slate">theorymcp.ai/acme-pay/partners/{p.slug}/agents/support/mcp</div>
          </div>
        </div>
      </div>
    </Frame>
  );
}

/* 3 · Regulated knowledge: approve a policy before agents can use it */
const unitSeed = [
  { id: "pp-ach-014", title: "ACH chargeback window", status: "In review", version: 12, agents: 3, change: ["Chargeback window for ACH debits is 60 days.", "Business accounts: 2 banking days for unauthorised claims."] },
  { id: "pp-card-201", title: "Card dispute evidence", status: "Live", version: 7, agents: 4, change: ["Merchants have 20 days to submit evidence."] },
  { id: "kyc-ub-009", title: "Beneficial owner checks", status: "Draft", version: 3, agents: 2, change: ["Verify owners holding 25% or more."] },
  { id: "pp-fx-033", title: "FX conversion disclosure", status: "Live", version: 5, agents: 1, change: ["Show the rate and fee before confirmation."] },
];

function KnowledgeScreen() {
  const [units, setUnits] = useState(unitSeed);
  const [sel, setSel] = useState("pp-ach-014");
  const [toast, setToast] = useState<string | null>(null);
  const u = units.find((x) => x.id === sel)!;
  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 2200);
    return () => clearTimeout(t);
  }, [toast]);
  const tone = (s: string) => (s === "Live" ? "verified" : s === "In review" ? "apricot" : "slate");
  const approve = () => {
    setUnits((us) => us.map((x) => (x.id === sel ? { ...x, status: "Live", version: x.version + 1 } : x)));
    setToast(`Published ${u.id} v${u.version + 1} to live`);
  };
  return (
    <Frame app="Acme Bank · Policy library" url="knowledge.acmebank.example/units">
      <div className="relative grid h-full sm:grid-cols-[1fr_1.2fr]">
        <div className="min-w-0 border-r border-line p-4">
          <span className="font-semibold">Knowledge units</span>
          <ul className="mt-3 space-y-1.5">
            {units.map((x) => (
              <li key={x.id}>
                <button onClick={() => setSel(x.id)} className={`w-full rounded-xl border px-3 py-2.5 text-left transition ${sel === x.id ? "border-iris bg-iris-soft/50" : "border-transparent hover:bg-porcelain"}`}>
                  <span className="flex items-center justify-between gap-2">
                    <span className="truncate font-medium">{x.title}</span>
                    <Tag tone={tone(x.status)}>{x.status}</Tag>
                  </span>
                  <span className="font-mono text-[10.5px] text-slate">{x.id} · v{x.version}</span>
                </button>
              </li>
            ))}
          </ul>
        </div>
        <div className="min-w-0 p-4">
          <div className="flex items-center justify-between gap-2">
            <span className="truncate font-semibold">{u.title}</span>
            <Tag tone={tone(u.status)}>{u.status}</Tag>
          </div>
          <p className="mt-1 font-mono text-[10.5px] text-slate">{u.id} · v{u.version} · used by {u.agents} agents</p>
          <div className="mt-3 space-y-1.5 rounded-xl border border-line bg-porcelain/60 p-3">
            {u.change.map((c) => (
              <p key={c} className={`rounded-md px-2 py-1 leading-relaxed ${u.status === "Live" ? "bg-paper" : "bg-verified/10 text-[#0b6b61] dark:text-verified"}`}>
                {u.status === "Live" ? "" : "+ "}
                {c}
              </p>
            ))}
          </div>
          <div className="mt-3 space-y-1.5 text-[12px] text-slate">
            <p className="flex items-center gap-2"><ShieldCheck size={13} /> Agents can only cite live units</p>
            <p className="flex items-center gap-2"><Lock size={13} /> Publishing needs a reviewer</p>
          </div>
          <button
            onClick={approve}
            disabled={u.status === "Live"}
            className="mt-4 inline-flex w-full items-center justify-center gap-1.5 rounded-full bg-ink py-2.5 text-[12.5px] font-medium text-paper transition enabled:hover:bg-iris disabled:cursor-not-allowed disabled:bg-line disabled:text-slate"
          >
            {u.status === "Live" ? <><Check size={13} /> Live for all agents</> : "Approve & publish"}
          </button>
        </div>
        <AnimatePresence>
          {toast && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="absolute bottom-4 left-1/2 flex -translate-x-1/2 items-center gap-2 whitespace-nowrap rounded-full bg-night px-4 py-2 text-[12px] text-white shadow-xl">
              <Check size={13} className="text-verified" /> {toast}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </Frame>
  );
}

/* 4 · Enterprise IT: verify every repo runs the released agent */
const repoSeed = [
  { repo: "payments-api", ok: true },
  { repo: "checkout-web", ok: true },
  { repo: "risk-engine", ok: false },
  { repo: "merchant-portal", ok: true },
  { repo: "ledger-service", ok: true },
];

function ReleasesScreen() {
  const [state, setState] = useState<Record<string, "idle" | "checking" | "ok" | "fail">>({});
  const [running, setRunning] = useState(false);
  const sync = async () => {
    setRunning(true);
    setState({});
    for (const r of repoSeed) {
      setState((s) => ({ ...s, [r.repo]: "checking" }));
      await new Promise((res) => setTimeout(res, 550));
      setState((s) => ({ ...s, [r.repo]: r.ok ? "ok" : "fail" }));
    }
    setRunning(false);
  };
  return (
    <Frame app="Acme · Agent releases" url="releases.acme.example/agents/reviewer">
      <div className="flex h-full flex-col p-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <span className="font-semibold">reviewer agent</span>
            <span className="ml-2 font-mono text-[11px] text-slate">v2.4.0 · sha256 9f3c…e21a</span>
          </div>
          <button onClick={sync} disabled={running} className="inline-flex items-center gap-1.5 rounded-full bg-ink px-4 py-2 text-[12px] font-medium text-paper transition hover:bg-iris disabled:opacity-60">
            {running ? <Loader2 size={13} className="animate-spin" /> : <RefreshCw size={13} />} Verify &amp; sync all repos
          </button>
        </div>
        <ul className="mt-4 divide-y divide-line rounded-xl border border-line">
          {repoSeed.map((r) => {
            const s = state[r.repo] ?? "idle";
            return (
              <li key={r.repo} className="flex items-center justify-between gap-3 px-3 py-3">
                <span className="min-w-0">
                  <span className="block truncate font-mono text-[12px]">{r.repo}</span>
                  {s === "fail" && <span className="text-[11px] text-red-600">Checksum mismatch, so nothing was written</span>}
                </span>
                {s === "idle" && <Tag>Not checked</Tag>}
                {s === "checking" && <Tag tone="iris"><Loader2 size={11} className="animate-spin" /> Verifying</Tag>}
                {s === "ok" && <Tag tone="verified"><Check size={11} /> v2.4.0 verified</Tag>}
                {s === "fail" && <Tag tone="danger"><X size={11} /> Blocked</Tag>}
              </li>
            );
          })}
        </ul>
        <p className="mt-auto flex items-start gap-2 pt-4 text-[11.5px] leading-relaxed text-slate">
          <CircleAlert size={13} className="mt-0.5 shrink-0" /> Each repo gets the published agent whole or not at all, so you always know which version is running.
        </p>
      </div>
    </Frame>
  );
}

const showcase = [
  { slug: "fintech-support", label: "Payments", Screen: PayoutsScreen, hint: "Filter payouts and open one to see why it's on hold." },
  { slug: "partner-agents", label: "Partner programs", Screen: PartnersScreen, hint: "Switch partners on, change a brand colour, set what each agent may do." },
  { slug: "regulated-knowledge", label: "Regulated knowledge", Screen: KnowledgeScreen, hint: "Open a policy in review and approve it." },
  { slug: "agent-distribution", label: "Enterprise IT", Screen: ReleasesScreen, hint: "Run a sync and watch each repo get verified." },
];

export function UseCaseScreens() {
  const [active, setActive] = useState(0);
  const item = showcase[active];
  const u = useCases.find((x) => x.slug === item.slug)!;
  return (
    <section className="overflow-hidden px-4 py-28 sm:px-6">
      <SectionHead
        eyebrow="Built on Theory Cloud"
        title={<>Real products, <em>not just chat windows.</em></>}
        body="Theory Cloud runs behind the screens your customers, partners and teams already use. Try these examples. They're interactive."
      />
      <Reveal className="mx-auto mt-12 max-w-6xl">
        <div role="tablist" aria-label="Use cases" className="mx-auto flex w-fit max-w-full gap-1 overflow-x-auto rounded-full border border-line bg-paper p-1">
          {showcase.map((s, i) => (
            <button
              key={s.slug}
              role="tab"
              aria-selected={i === active}
              onClick={() => setActive(i)}
              className={`relative shrink-0 whitespace-nowrap rounded-full px-4 py-2.5 text-sm font-medium transition ${i === active ? "text-paper" : "text-ink/70 hover:text-ink"}`}
            >
              {i === active && <motion.span layoutId="uc-pill" className="absolute inset-0 rounded-full bg-ink" transition={{ type: "spring", bounce: 0.15, duration: 0.5 }} />}
              <span className="relative">{s.label}</span>
            </button>
          ))}
        </div>

        <div className="mt-10 grid items-center gap-10 lg:grid-cols-[0.8fr_1.2fr] [&>*]:min-w-0">
          <AnimatePresence mode="wait">
            <motion.div key={item.slug} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.3 }}>
              <p className="eyebrow">{u.industry}</p>
              <h3 className="display mt-3 text-[1.6rem] sm:text-[2rem]">{u.title}</h3>
              <p className="mt-4 leading-relaxed text-slate">{u.problem}</p>
              <p className="mt-4 font-medium leading-relaxed">{u.outcome}</p>
              <div className="mt-6 flex flex-wrap items-center gap-2">
                <span className="text-xs text-slate">Built with</span>
                {u.products.map((name) => {
                  const p = products.find((x) => x.name === name);
                  return (
                    <Link key={name} href={`/products/${p?.slug}`} className="rounded-full bg-iris-soft px-3 py-1 text-xs font-medium text-iris hover:bg-iris hover:text-white">
                      {name}
                    </Link>
                  );
                })}
              </div>
              <p className="mt-6 flex items-center gap-2 text-[13px] text-slate">
                <span className="relative flex h-2 w-2"><span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-fuchsia opacity-60" /><span className="relative h-2 w-2 rounded-full bg-fuchsia" /></span>
                {item.hint}
              </p>
              <Link href={`/use-cases#${u.slug}`} className="mt-6 inline-flex items-center gap-1 text-sm font-medium text-iris hover:underline">
                See how it works <ArrowRight size={14} />
              </Link>
            </motion.div>
          </AnimatePresence>
          <div className="relative">
            <div className="aurora absolute -inset-8 opacity-50" aria-hidden />
            <div className="relative">
              <item.Screen key={item.slug} />
            </div>
            <p className="relative mt-3 text-center text-[11px] text-slate">Example screen. Companies and figures are illustrative.</p>
          </div>
        </div>
      </Reveal>
    </section>
  );
}
