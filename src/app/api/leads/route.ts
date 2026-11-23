import { NextResponse } from "next/server";

/**
 * Lead capture endpoint (stub).
 * TODO: forward `lead` to the CRM of choice (HubSpot, Salesforce, Resend email, etc.).
 * Keep the request/response contract the same so the form needs no changes.
 */
export async function POST(req: Request) {
  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Send the form data as JSON." }, { status: 400 });
  }

  const str = (k: string) => (typeof body[k] === "string" ? (body[k] as string).trim() : "");
  const lead = {
    name: str("name"),
    email: str("email"),
    company: str("company"),
    role: str("role"),
    teamSize: str("teamSize"),
    plan: str("plan"),
    interest: Array.isArray(body.interest) ? (body.interest as unknown[]).filter((x) => typeof x === "string") : [],
    message: str("message"),
    receivedAt: new Date().toISOString(),
  };

  const errors: Record<string, string> = {};
  if (!lead.name) errors.name = "Enter your name.";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(lead.email)) errors.email = "Enter a valid work email.";
  if (!lead.company) errors.company = "Enter your company name.";
  if (Object.keys(errors).length) return NextResponse.json({ errors }, { status: 422 });

  console.info("[lead]", lead);
  return NextResponse.json({ ok: true });
}
