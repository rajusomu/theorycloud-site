"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { BadgeCheck, BookOpenCheck, Brain, ShieldCheck, UserRound } from "lucide-react";

/* Hero demo in business language: a real customer question, the agent's sourced answer,
   and the four trust checks Theory Cloud runs before the answer goes out. */

type Scenario = {
  tab: string;
  company: string;
  person: string;
  question: string;
  answer: string;
  source: string;
  who: string;
  allowed: string;
  remembers: string;
  route: string;
};

const SCENARIOS: Scenario[] = [
  {
    tab: "Payments support",
    company: "Acme Pay",
    person: "Maria · merchant",
    question: "Why is my payout on hold this week?",
    answer:
      "Your payout has a standard 2-day hold because it's your first transfer over $10,000. It will be released on Thursday. You asked for email confirmations last month, so I've turned those on.",
    source: "Payout Policy §4.2",
    who: "Maria, merchant #42",
    allowed: "View own payouts · no refunds",
    remembers: "Prefers email updates",
    route: "acme-pay/partners/merchant-42/agents/support",
  },
  {
    tab: "Retail banking",
    company: "Northwind Bank",
    person: "James · premier customer",
    question: "Can I raise my credit card limit?",
    answer:
      "You're eligible to request up to $15,000. I can't approve credit myself, so I've started the request. A specialist will confirm within one business day.",
    source: "Credit Limit Policy v3",
    who: "James, premier tier",
    allowed: "Start requests · can't approve",
    remembers: "Asked about travel cover",
    route: "northwind-bank/agents/concierge",
  },
  {
    tab: "Insurance claims",
    company: "Harbor Insurance",
    person: "Priya · home policyholder",
    question: "Is water damage from a burst pipe covered?",
    answer:
      "Yes. Sudden burst pipes are covered under section 2.1 of your Home Plus policy, less your $500 excess. Damage from slow leaks isn't covered. Would you like me to start a claim?",
    source: "Home Plus Policy §2.1",
    who: "Priya, Home Plus policy",
    allowed: "Explain cover · open claims",
    remembers: "Previous claim (closed)",
    route: "harbor/agents/claims",
  },
  {
    tab: "Internal teams",
    company: "Acme Pay",
    person: "Dev · platform team",
    question: "What do I need to launch a new service?",
    answer:
      "Start from the approved service template, complete the security review, then release through the standard pipeline. I've attached the launch checklist.",
    source: "Engineering Handbook · Launch",
    who: "Employee, platform team",
    allowed: "Read handbook · can't deploy",
    remembers: "Working on payments-api",
    route: "acme-eng/agents/helpdesk",
  },
];

export function TrustDemo() {
  const reduce = useReducedMotion();
  const [i, setI] = useState(0);
  const [touched, setTouched] = useState(false);
  const [stage, setStage] = useState(0); // 0 question, 1 typing, 2 answer + checks
  const s = SCENARIOS[i];

  useEffect(() => {
    if (reduce) return setStage(2);
    setStage(0);
    const a = setTimeout(() => setStage(1), 500);
    const b = setTimeout(() => setStage(2), 1500);
    return () => {
      clearTimeout(a);
      clearTimeout(b);
    };
  }, [i, reduce]);

  useEffect(() => {
    if (touched || reduce) return;
    const id = setTimeout(() => setI((x) => (x + 1) % SCENARIOS.length), 7500);
    return () => clearTimeout(id);
  }, [i, touched, reduce]);

  const checks = [
    { icon: UserRound, label: "Who's asking", value: s.who },
    { icon: ShieldCheck, label: "What it's allowed to do", value: s.allowed },
    { icon: Brain, label: "What it remembers", value: s.remembers },
    { icon: BookOpenCheck, label: "Where the answer comes from", value: s.source },
  ];

  return (
    <div className="relative mx-auto w-full max-w-5xl">
      <div className="rounded-[28px] border border-white/70 bg-white/70 p-2 shadow-[0_40px_120px_-40px_rgba(193,60,255,0.35)] backdrop-blur-xl">
        {/* Scenario switcher */}
        <div role="tablist" aria-label="Example scenarios" className="flex gap-1 overflow-x-auto rounded-[20px] border border-line bg-white p-1">
          {SCENARIOS.map((x, n) => (
            <button
              key={x.tab}
              role="tab"
              aria-selected={n === i}
              onClick={() => {
                setTouched(true);
                setI(n);
              }}
              className={`relative shrink-0 flex-1 whitespace-nowrap rounded-2xl px-4 py-2.5 text-sm font-medium transition ${n === i ? "text-white" : "text-ink/65 hover:text-ink"}`}
            >
              {n === i && <motion.span layoutId="scenario-pill" className="absolute inset-0 rounded-2xl bg-ink" transition={{ type: "spring", bounce: 0.15, duration: 0.5 }} />}
              <span className="relative">{x.tab}</span>
            </button>
          ))}
        </div>

        <div className="mt-2 grid gap-2 md:grid-cols-[1.2fr_1fr] [&>*]:min-w-0">
          {/* Conversation */}
          <div className="terminal relative flex min-h-[330px] flex-col overflow-hidden rounded-[22px] p-5 sm:p-6">
            <div className="flex items-center justify-between text-[12px] text-white/45">
              <span className="inline-flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-verified shadow-[0_0_0_4px_rgba(20,184,166,0.2)]" />
                {s.company} assistant
              </span>
              <span>Example conversation</span>
            </div>

            <AnimatePresence mode="wait">
              <motion.div key={i} className="mt-5 flex flex-1 flex-col gap-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.25 }}>
                <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="ml-auto max-w-[85%]">
                  <p className="mb-1 text-right text-[11px] text-white/40">{s.person}</p>
                  <p className="rounded-2xl rounded-br-md bg-white/10 px-4 py-3 text-[15px] text-white">{s.question}</p>
                </motion.div>

                {stage === 1 && (
                  <div className="flex gap-1.5 px-2" aria-label="Assistant is typing">
                    {[0, 1, 2].map((d) => (
                      <motion.span key={d} className="h-2 w-2 rounded-full bg-white/50" animate={{ opacity: [0.3, 1, 0.3] }} transition={{ duration: 0.9, repeat: Infinity, delay: d * 0.15 }} />
                    ))}
                  </div>
                )}

                {stage === 2 && (
                  <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="max-w-[92%]">
                    <p className="rounded-2xl rounded-bl-md bg-gradient-to-br from-iris/90 to-fuchsia/80 px-4 py-3 text-[15px] leading-relaxed text-white">{s.answer}</p>
                    <span className="mt-2 inline-flex items-center gap-1.5 rounded-full bg-verified/15 px-3 py-1 text-[12px] text-verified">
                      <BadgeCheck size={13} /> Source: {s.source}
                    </span>
                  </motion.div>
                )}
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Trust checks */}
          <div className="grid grid-cols-2 gap-2">
            {checks.map((c, n) => (
              <div key={c.label} className="relative overflow-hidden rounded-[18px] border border-line bg-white p-4">
                <div className="flex items-center justify-between">
                  <c.icon size={16} className="text-iris" />
                  <motion.span
                    initial={false}
                    animate={{ scale: stage === 2 ? 1 : 0.6, opacity: stage === 2 ? 1 : 0.15 }}
                    transition={{ delay: reduce ? 0 : 0.15 + n * 0.15, type: "spring", bounce: 0.5 }}
                  >
                    <BadgeCheck size={16} className="text-verified" />
                  </motion.span>
                </div>
                <div className="mt-3 text-[12px] text-slate">{c.label}</div>
                <AnimatePresence mode="wait">
                  <motion.div
                    key={i + c.value}
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -6 }}
                    transition={{ duration: 0.25, delay: reduce ? 0 : 0.1 + n * 0.1 }}
                    className="mt-1 text-[14px] font-semibold leading-snug"
                  >
                    {c.value}
                  </motion.div>
                </AnimatePresence>
              </div>
            ))}
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-2 px-4 py-3 text-[12px] text-slate">
          <span className="inline-flex items-center gap-1.5">
            <BadgeCheck size={14} className="text-verified" /> 4 trust checks passed before the answer was sent
          </span>
          <span className="hidden truncate font-mono text-[11px] sm:inline">theorymcp.ai/{s.route}/mcp</span>
        </div>
      </div>
    </div>
  );
}
