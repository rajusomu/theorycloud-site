"use client";

import Link from "next/link";
import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { ArrowRight, CheckCircle2, Loader2 } from "lucide-react";
import { products, tiers } from "@/lib/site";

type Errors = Partial<Record<"name" | "email" | "company" | "form", string>>;

const field =
  "mt-1.5 w-full rounded-xl border border-line bg-paper px-4 py-3 text-[15px] outline-none transition placeholder:text-slate/60 focus:border-iris focus:ring-4 focus:ring-iris/10";

/* The GitHub Pages build is static and has no /api/leads endpoint, so requests go by email */
const STATIC_EXPORT = process.env.NEXT_PUBLIC_STATIC_EXPORT === "true";
const SALES_EMAIL = "sales@theorycloud.ai";

function emailRequest(data: Record<string, FormDataEntryValue | FormDataEntryValue[]>): Errors | null {
  const text = (k: string) => String(data[k] ?? "").trim();
  const errors: Errors = {};
  if (!text("name")) errors.name = "Enter your name.";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(text("email"))) errors.email = "Enter a valid work email.";
  if (!text("company")) errors.company = "Enter your company.";
  if (Object.keys(errors).length) return errors;
  const interest = ([] as FormDataEntryValue[]).concat(data.interest ?? []).join(", ");
  const body = [
    `Name: ${text("name")}`,
    `Email: ${text("email")}`,
    `Company: ${text("company")}`,
    text("role") && `Role: ${text("role")}`,
    text("teamSize") && `Team size: ${text("teamSize")}`,
    text("plan") && `Plan: ${text("plan")}`,
    interest && `Interested in: ${interest}`,
    text("message") && `\n${text("message")}`,
  ]
    .filter(Boolean)
    .join("\n");
  const subject = `Demo request: ${text("company")}`;
  window.location.href = `mailto:${SALES_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  return null;
}

export function DemoForm() {
  const params = useSearchParams();
  const initialPlan = params.get("plan") ?? "";
  const [status, setStatus] = useState<"idle" | "sending" | "sent">("idle");
  const [errors, setErrors] = useState<Errors>({});

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const data = { ...Object.fromEntries(fd.entries()), interest: fd.getAll("interest") };
    setStatus("sending");
    setErrors({});
    if (STATIC_EXPORT) {
      const problems = emailRequest(data);
      if (problems) {
        setErrors(problems);
        setStatus("idle");
      } else setStatus("sent");
      return;
    }
    try {
      const res = await fetch("/api/leads", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data) });
      if (res.ok) return setStatus("sent");
      const json = await res.json().catch(() => ({}));
      setErrors(json.errors ?? { form: "We couldn't send your request. Try again, or email sales@theorycloud.ai." });
    } catch {
      setErrors({ form: "You appear to be offline. Check your connection and try again." });
    }
    setStatus("idle");
  }

  if (status === "sent") {
    return (
      <div className="card flex flex-col items-start p-8 sm:p-10" role="status">
        <CheckCircle2 className="text-verified" size={32} />
        <h2 className="display mt-5 text-[1.8rem]">{STATIC_EXPORT ? "Almost there." : "Request received."}</h2>
        {STATIC_EXPORT ? (
          <p className="mt-3 leading-relaxed text-slate">
            Your email app should have opened with your request filled in. Send it and a solutions engineer will reply
            within one business day. If nothing opened, email{" "}
            <a href={`mailto:${SALES_EMAIL}`} className="text-iris underline">{SALES_EMAIL}</a>.
          </p>
        ) : (
          <p className="mt-3 leading-relaxed text-slate">
            A solutions engineer will email you within one business day to schedule your demo. While you wait, you can
            connect a host to the public <span className="font-mono text-[13px] text-ink">theorycloud</span> namespace and try it yourself.
          </p>
        )}
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} noValidate className="card space-y-5 p-6 sm:p-10">
      <div className="grid gap-5 sm:grid-cols-2">
        <label className="block text-sm font-medium">
          Full name
          <input name="name" autoComplete="name" className={field} aria-invalid={!!errors.name} placeholder="Ada Lovelace" />
          {errors.name && <span className="mt-1 block text-xs text-red-600">{errors.name}</span>}
        </label>
        <label className="block text-sm font-medium">
          Work email
          <input name="email" type="email" autoComplete="email" className={field} aria-invalid={!!errors.email} placeholder="ada@company.com" />
          {errors.email && <span className="mt-1 block text-xs text-red-600">{errors.email}</span>}
        </label>
        <label className="block text-sm font-medium">
          Company
          <input name="company" autoComplete="organization" className={field} aria-invalid={!!errors.company} />
          {errors.company && <span className="mt-1 block text-xs text-red-600">{errors.company}</span>}
        </label>
        <label className="block text-sm font-medium">
          Role
          <input name="role" autoComplete="organization-title" className={field} placeholder="Head of Platform" />
        </label>
        <label className="block text-sm font-medium">
          Engineering team size
          <select name="teamSize" className={field} defaultValue="">
            <option value="" disabled>Select</option>
            {["1–10", "11–50", "51–200", "201–1,000", "1,000+"].map((s) => <option key={s}>{s}</option>)}
          </select>
        </label>
        <label className="block text-sm font-medium">
          Plan you&apos;re considering
          <select name="plan" className={field} defaultValue={initialPlan}>
            <option value="">Not sure yet</option>
            {tiers.map((t) => <option key={t.name} value={t.name.toLowerCase()}>{t.name}</option>)}
          </select>
        </label>
      </div>

      <fieldset>
        <legend className="text-sm font-medium">What are you interested in?</legend>
        <div className="mt-2 flex flex-wrap gap-2">
          {products.map((p) => (
            <label key={p.slug} className="cursor-pointer">
              <input type="checkbox" name="interest" value={p.name} className="peer sr-only" />
              <span className="inline-block rounded-full border border-line px-3.5 py-1.5 text-sm transition peer-checked:border-iris peer-checked:bg-iris-soft peer-checked:text-iris peer-focus-visible:ring-2 peer-focus-visible:ring-iris">
                {p.name}
              </span>
            </label>
          ))}
        </div>
      </fieldset>

      <label className="block text-sm font-medium">
        What would you like your agents to do?
        <textarea name="message" rows={4} className={field} placeholder="For example: a support agent that remembers each merchant and cites our dispute policy." />
      </label>

      {errors.form && <p className="text-sm text-red-600" role="alert">{errors.form}</p>}

      <button
        type="submit"
        disabled={status === "sending"}
        className="group inline-flex w-full items-center justify-center gap-2 rounded-full bg-ink py-3.5 text-[15px] font-medium text-paper transition hover:bg-iris disabled:opacity-60 sm:w-auto sm:px-8"
      >
        {status === "sending" ? <Loader2 size={16} className="animate-spin" /> : null}
        {status === "sending" ? "Sending request" : "Book a demo"}
        {status !== "sending" && <ArrowRight size={16} className="transition group-hover:translate-x-0.5" />}
      </button>
      <p className="text-xs text-slate">
        We&apos;ll only use your details to arrange this demo. See our <Link href="/privacy" className="underline">privacy policy</Link>.
      </p>
    </form>
  );
}
