import Link from "next/link";
import { Logo } from "./logo";
import { links, products, useCases } from "@/lib/site";

const cols = [
  { title: "Products", items: products.map((p) => ({ label: p.name, href: `/products/${p.slug}` })) },
  { title: "Solutions", items: useCases.slice(0, 5).map((u) => ({ label: u.industry, href: `/use-cases#${u.slug}` })) },
  {
    title: "Developers",
    items: [
      { label: "TheoryMCP docs", href: links.docs },
      { label: "AppTheory docs", href: links.appTheoryDocs },
      { label: "GitHub", href: links.github },
      { label: "Prompt library", href: `${links.docs}/reference/prompts/` },
    ],
  },
  {
    title: "Company",
    items: [
      { label: "About", href: "/about" },
      { label: "Customers", href: "/customers/pay-theory" },
      { label: "Pricing", href: "/pricing" },
      { label: "Contact sales", href: "/contact" },
    ],
  },
];

export function Footer() {
  return (
    <footer className="border-t border-line bg-paper">
      <div className="mx-auto grid max-w-7xl gap-12 px-4 py-16 sm:px-6 lg:grid-cols-[1.3fr_repeat(4,1fr)]">
        <div>
          <Logo />
          <p className="mt-4 max-w-xs text-sm leading-relaxed text-slate">
            Trusted AI agents for customer-facing business. Every answer sourced, every customer kept separate.
          </p>
          <p className="mt-6 text-sm"><Link href="/contact" className="font-medium text-iris hover:underline">Book a demo →</Link></p>
        </div>
        {cols.map((c) => (
          <div key={c.title}>
            <h3 className="eyebrow">{c.title}</h3>
            <ul className="mt-4 space-y-2.5">
              {c.items.map((i) => (
                <li key={i.label}>
                  <Link href={i.href} className="text-sm text-ink/80 hover:text-iris">
                    {i.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="border-t border-line">
        <div className="mx-auto flex max-w-7xl flex-col gap-3 px-4 py-6 text-xs text-slate sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <span>© {new Date().getFullYear()} Theory Cloud. All rights reserved.</span>
          <span className="flex gap-5">
            <Link href="/privacy" className="hover:text-ink">Privacy</Link>
            <Link href="/terms" className="hover:text-ink">Terms</Link>
            <Link href="/security" className="hover:text-ink">Security</Link>
          </span>
        </div>
      </div>
    </footer>
  );
}
