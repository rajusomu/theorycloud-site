/**
 * Single source of truth for marketing copy, links and structured content.
 * Docs live on separate domains — update the URLs below when they move.
 */

export const links = {
  docs: "https://docs.theorycloud.ai", // TODO: confirm final docs domain for TheoryMCP
  appTheoryDocs: "https://apptheory.theorycloud.ai",
  github: "https://github.com/theory-cloud",
  demo: "/contact",
  payTheory: "https://paytheory.com",
};

export const nav = [
  { label: "Platform", href: "/#platform" },
  { label: "Products", href: "/products/theorymcp", menu: true },
  { label: "Solutions", href: "/use-cases" },
  { label: "Customers", href: "/customers/pay-theory" },
  { label: "Pricing", href: "/pricing" },
  { label: "Docs", href: links.docs, external: true },
];

export type Product = {
  slug: string;
  name: string;
  kicker: string;
  tagline: string;
  summary: string;
  docs: string;
  points: { title: string; body: string }[];
  snippet: { label: string; lines: string[] };
  specs: { label: string; value: string }[];
};

export const products: Product[] = [
  {
    slug: "theorymcp",
    name: "TheoryMCP",
    kicker: "Trusted AI agents",
    tagline: "AI agents that know who they're serving and remember them.",
    summary:
      "TheoryMCP is the hosted MCP service behind theorymcp.ai. You point Claude Code, Codex or Antigravity at a namespace. The route then decides who the caller is, what they're allowed to do, and what they remember, on the server. Your agents stop guessing.",
    docs: links.docs,
    points: [
      { title: "Routes decide identity", body: "Tenant, scope and entitlement come from the URL and the OAuth grant. Nothing comes from the prompt." },
      { title: "Memory that's scoped to each user", body: "Memory is append-only and kept per agent and per user. It stays when you switch models. Two users of one agent never see each other's entries." },
      { title: "Published knowledge with citations", body: "Agents search, then read the authoritative unit and cite its ID. Answers trace back to a source." },
      { title: "Materialize and verify", body: "Pull a published agent into any repo as a checksummed pack. If a file or checksum doesn't match, nothing is written." },
      { title: "Gated authoring", body: "Authoring is off by default. Drafts go through the lab and need a person to approve each publish before they go live." },
      { title: "Every major coding host", body: "Every host uses the same server ID, theorymcp. That covers Claude Code, Codex and Antigravity (through mcp-remote)." },
    ],
    snippet: {
      label: ".mcp.json",
      lines: [
        "{",
        '  "mcpServers": {',
        '    "theorymcp": {',
        '      "type": "http",',
        '      "url": "https://theorymcp.ai/acme/agents/support/mcp"',
        "    }",
        "  }",
        "}",
      ],
    },
    specs: [
      { label: "Hosts", value: "Claude Code · Codex · Antigravity" },
      { label: "Auth", value: "OAuth, route-scoped" },
      { label: "Memory", value: "Append-only, subject-scoped" },
      { label: "Environments", value: "lab → live" },
    ],
  },
  {
    slug: "apptheory",
    name: "AppTheory",
    kicker: "Reliable cloud backbone",
    tagline: "Ship services faster on a backbone proven in payments.",
    summary:
      "AppTheory is the contract-first runtime for AWS Lambda. Go, TypeScript and Python are tested against the same contract fixtures on every commit. One entrypoint serves HTTP APIs, MCP servers and event workloads.",
    docs: links.appTheoryDocs,
    points: [
      { title: "One entrypoint for everything", body: "Lambda Function URLs, API Gateway v2, ALB, SQS, EventBridge, DynamoDB Streams, Kinesis and WebSockets all go through one handler." },
      { title: "MCP servers in one Lambda", body: "Streamable HTTP, sessions, resumable SSE and OAuth-protected remote MCP are built in." },
      { title: "Production defaults in tiers", body: "P0 handles routing. P1 adds auth hooks, CORS and guardrails. P2 adds observability and load shedding." },
      { title: "Tests define the contract", body: "427 machine-readable contract fixtures define the behaviour. The three runtimes are just harnesses that run them." },
      { title: "Source provenance", body: "Client IP comes from verified provenance, never from X-Forwarded-For." },
      { title: "CDK constructs included", body: "Queues, event rules, streams and job tables come ready to deploy." },
    ],
    snippet: {
      label: "app.ts",
      lines: [
        'import { createApp, text } from "@theory-cloud/apptheory";',
        "",
        "const app = createApp();",
        'app.get("/ping", () => text(200, "pong"));',
        "",
        "export const handler = app.handleLambda;",
      ],
    },
    specs: [
      { label: "Runtimes", value: "Go · TypeScript · Python" },
      { label: "Contract fixtures", value: "427" },
      { label: "License", value: "Apache-2.0" },
      { label: "Releases", value: "Immutable, pinned" },
    ],
  },
  {
    slug: "knowledgetheory",
    name: "KnowledgeTheory",
    kicker: "Approved answers",
    tagline: "Every answer comes from content you approved.",
    summary:
      "KnowledgeTheory turns your policies, specs and product docs into curated, ranked knowledge bases that agents can search. It also serves contract packs, which carry stricter access rules, for regulated content.",
    docs: links.docs,
    points: [
      { title: "Search wide, read narrow", body: "search_docs returns previews. get_unit returns the authoritative text." },
      { title: "Cite every answer", body: "Each unit has a stable ID, so reviewers can trace any answer to its source." },
      { title: "Contract packs", body: "Financial products, legal frameworks and API specs, each with its own access rules." },
      { title: "Recall without ranking", body: "recall_units returns metadata and related units so agents can explore deterministically." },
    ],
    snippet: {
      label: "agent transcript",
      lines: [
        "→ search_docs(\"chargeback window for ACH\")",
        "  3 previews · kb: payments-policy",
        "→ get_unit(\"pp-ach-014\")",
        "  ✓ authoritative · cite: pp-ach-014",
      ],
    },
    specs: [
      { label: "Tools", value: "search_docs · get_unit · recall_units" },
      { label: "Access", value: "Per namespace, per pack" },
      { label: "Output", value: "Cited unit IDs" },
      { label: "Packs", value: "Finance · Legal · API specs" },
    ],
  },
  {
    slug: "autheory",
    name: "Autheory",
    kicker: "Access control",
    tagline: "Each agent gets exactly the access it needs, and nothing more.",
    summary:
      "Autheory handles authentication and authorization for remote MCP servers. Every route is a separate grant, and every tool call is checked against scopes. Agents get exactly the access they need and nothing more.",
    docs: links.docs,
    points: [
      { title: "Route-scoped grants", body: "Access to a namespace and access to an agent route are separate authorizations." },
      { title: "Fine-grained scopes", body: "Scopes such as mcp:tools, ai.kb.query and memory.append limit what each call can do." },
      { title: "Works in the host", body: "Users sign in from /mcp or codex mcp login. There are no keys to paste into prompts." },
      { title: "Ready for remote MCP", body: "Works out of the box with AppTheory remote MCP servers on AWS." },
    ],
    snippet: {
      label: "config.toml",
      lines: [
        "[mcp_servers.theorymcp]",
        'url = "https://theorymcp.ai/acme/mcp"',
        'oauth_resource = "https://theorymcp.ai/acme/mcp"',
        'scopes = ["mcp:tools", "ai.kb.query"]',
      ],
    },
    specs: [
      { label: "Protocol", value: "OAuth 2.1" },
      { label: "Grant unit", value: "One per route" },
      { label: "Scopes", value: "Per tool family" },
      { label: "Sign-in", value: "In the host" },
    ],
  },
  {
    slug: "tabletheory",
    name: "TableTheory",
    kicker: "Data foundation",
    tagline: "Consistent, dependable data for every team and every language.",
    summary:
      "TableTheory is the data layer underneath AppTheory. It gives Go, TypeScript and Python one consistent way to model, query and change serverless tables. The same contract-first discipline applies to your data.",
    docs: links.appTheoryDocs,
    points: [
      { title: "One model, three languages", body: "Table definitions behave the same way in every AppTheory runtime." },
      { title: "Deterministic naming", body: "Resource names follow a published conformance spec." },
      { title: "Built for events", body: "Pairs with stream and job-table constructs for event-driven workloads." },
      { title: "Tested like the runtime", body: "Shared fixtures keep behaviour from drifting between languages." },
    ],
    snippet: {
      label: "model.go",
      lines: [
        "type Payment struct {",
        '  ID       string `theory:"pk"`',
        '  Merchant string `theory:"sk"`',
        "  Amount   int64",
        "}",
      ],
    },
    specs: [
      { label: "Runtimes", value: "Go · TypeScript · Python" },
      { label: "Pairs with", value: "AppTheory" },
      { label: "Naming", value: "Conformance spec" },
      { label: "License", value: "Open source" },
    ],
  },
];

/**
 * FaceTheory: the client-delivery framework (github.com/theory-cloud/FaceTheory).
 * Shown in the homepage platform section only for now. It has no product page yet,
 * so its "Explore" link goes to the repo.
 */
export const faceTheory: Product = {
  slug: "facetheory",
  name: "FaceTheory",
  kicker: "Web experiences",
  tagline: "Fast, consistent web experiences from the same stack as your backend.",
  summary:
    "FaceTheory is the AWS-first TypeScript client-delivery framework for the Theory Cloud stack. It renders pages server-side, at build time, incrementally or as a hydrated single-page shell, across React, Vue and Svelte.",
  docs: "https://github.com/theory-cloud/FaceTheory",
  points: [
    { title: "Three render modes", body: "SSR, SSG and blocking ISR, plus an SPA client runtime." },
    { title: "React, Vue or Svelte", body: "Adapters for the frameworks your teams already use." },
    { title: "Deterministic hydration", body: "Server-rendered HTML matches the hydrated page exactly." },
    { title: "Deploys through AppTheory", body: "A paved AWS path through AppTheory's SSR site construct." },
  ],
  snippet: { label: "app.ts", lines: ['import { createFaceApp } from "@theory-cloud/facetheory";'] },
  specs: [
    { label: "Render modes", value: "SSR · SSG · ISR" },
    { label: "Adapters", value: "React · Vue · Svelte" },
    { label: "Runtime", value: "Node 20+, TypeScript" },
    { label: "License", value: "Apache-2.0" },
  ],
};

/** Products shown in the homepage platform section, in tab order. */
export const platformProducts: Product[] = [products[0], faceTheory, ...products.slice(1)];

/** Business-facing layer for each product: what a buyer gets, in their language. */
export const productValue: Record<string, { pitch: string; bestFor: string[]; value: { title: string; body: string }[] }> = {
  facetheory: {
    pitch:
      "Give customers fast, reliable web experiences delivered from the same AWS stack your backend runs on. Pay Theory is putting FaceTheory into production on its checkout page.",
    bestFor: ["Product teams", "Frontend engineers", "Ecommerce & checkout"],
    value: [
      { title: "Pages that load fast", body: "Choose server rendering, static builds or incremental updates for each page." },
      { title: "One stack, front to back", body: "Your web experience deploys alongside the services it calls." },
      { title: "Keep your framework", body: "Teams keep building in React, Vue or Svelte." },
    ],
  },
  theorymcp: {
    pitch:
      "Give every customer, partner and employee an AI agent that knows who they are, respects what they're allowed to see, and remembers their history. Even when you switch AI providers.",
    bestFor: ["Customer experience", "Partner programs", "Internal copilots"],
    value: [
      { title: "Personal service at scale", body: "Agents remember each customer's history, so nobody has to repeat themselves." },
      { title: "No data crossing between customers", body: "Every customer's and partner's information stays separate by design." },
      { title: "Freedom to switch AI models", body: "Customer history stays with you, not with the model vendor." },
    ],
  },
  apptheory: {
    pitch:
      "The engineering backbone Pay Theory runs its payments on. Your teams ship new services faster, with fewer incidents, in the languages they already use.",
    bestFor: ["Engineering leaders", "Platform teams", "Fintech"],
    value: [
      { title: "Faster delivery", body: "Teams start from production-ready defaults instead of rebuilding the basics." },
      { title: "Fewer production surprises", body: "Every service behaves the same way, whichever language it's written in." },
      { title: "Lower cloud overhead", body: "Runs on AWS serverless, so you pay for usage, not for idle servers." },
    ],
  },
  knowledgetheory: {
    pitch:
      "Turn your policies, product terms and playbooks into the only source your AI agents answer from. Every answer cites the page it came from.",
    bestFor: ["Compliance & risk", "Support operations", "Legal"],
    value: [
      { title: "No made-up answers", body: "Agents answer from approved content and show the source." },
      { title: "Audit-ready", body: "Reviewers can trace any answer back to a specific policy." },
      { title: "Update once, everywhere", body: "Change a policy and every agent uses the new version." },
    ],
  },
  autheory: {
    pitch:
      "Control exactly what each AI agent can see and do, for each customer and partner, with sign-in your security team already understands.",
    bestFor: ["Security teams", "IT", "Partner programs"],
    value: [
      { title: "Least-privilege by default", body: "Agents get only the permissions their job requires." },
      { title: "No keys in chat", body: "People sign in properly. Nobody pastes secrets into AI tools." },
      { title: "Clear access reviews", body: "See who and what can reach each agent." },
    ],
  },
  tabletheory: {
    pitch:
      "A dependable data layer under every service, so customer data is handled the same way everywhere.",
    bestFor: ["Engineering leaders", "Data teams"],
    value: [
      { title: "Consistent records", body: "The same rules for customer data in every service." },
      { title: "Ready for growth", body: "Built on serverless storage that scales with demand." },
      { title: "Less rework", body: "Teams share one proven pattern instead of building their own." },
    ],
  },
};

export type UseCase = {
  slug: string;
  industry: string;
  title: string;
  problem: string;
  approach: string[];
  outcome: string;
  products: string[];
  route: string;
};

export const useCases: UseCase[] = [
  {
    slug: "fintech-support",
    industry: "Payments & fintech",
    title: "Support agents that remember each merchant and quote the policy",
    problem:
      "Support copilots lose context between sessions and paraphrase policy from memory. A paraphrase is something your compliance team can't sign off on.",
    approach: [
      "Each merchant conversation has its own memory, kept per merchant and per support agent.",
      "Answers come from a payments contract pack and cite the unit ID.",
      "Partner routes keep each merchant's data in its own place.",
    ],
    outcome: "Answers your reviewers can trace to a source, with memory that stays when you change models.",
    products: ["TheoryMCP", "KnowledgeTheory", "Autheory"],
    route: "theorymcp.ai/acme-pay/partners/merchant-42/agents/support/mcp",
  },
  {
    slug: "engineering-knowledge",
    industry: "Platform engineering",
    title: "One source of truth for every coding agent",
    problem:
      "Claude Code, Codex and Antigravity each read whatever happens to be in the repo. Conventions drift from team to team and from tool to tool.",
    approach: [
      "Publish architecture decisions, runbooks and conventions to one namespace.",
      "Every host connects with the same server ID and answers from the same knowledge.",
      "Agents check the interface before acting, so they never assume what tools exist.",
    ],
    outcome: "Every assistant follows the same playbook, whichever tool the engineer prefers.",
    products: ["TheoryMCP", "KnowledgeTheory"],
    route: "theorymcp.ai/acme-eng/mcp",
  },
  {
    slug: "serverless-mcp",
    industry: "SaaS & APIs",
    title: "Ship your own MCP server on AWS Lambda in a day",
    problem:
      "Building a remote MCP server means dealing with sessions, streaming, OAuth and protocol versions before you write a single tool.",
    approach: [
      "AppTheory serves MCP over streamable HTTP from one Lambda handler.",
      "Autheory protects it with OAuth that's scoped to each route.",
      "Contract fixtures cover MCP and OAuth behaviour on every commit.",
    ],
    outcome: "Your product becomes a tool any Claude or agent host can call, running on infrastructure you already have.",
    products: ["AppTheory", "Autheory"],
    route: "api.yourco.com/mcp",
  },
  {
    slug: "partner-agents",
    industry: "Platforms & marketplaces",
    title: "White-label agents for every partner",
    problem:
      "Each partner needs the same agent with their own data, limits and memory. Copying the agent for every partner doesn't scale.",
    approach: [
      "One agent definition is served on many partner routes.",
      "The server resolves tenant and entitlement from the route.",
      "Memory and knowledge never cross from one partner's route to another's.",
    ],
    outcome: "Onboard a new partner by issuing a route, not by redeploying.",
    products: ["TheoryMCP", "Autheory"],
    route: "theorymcp.ai/market/partners/{partner}/agents/concierge/mcp",
  },
  {
    slug: "regulated-knowledge",
    industry: "Legal, insurance & banking",
    title: "Regulated knowledge with stricter access",
    problem:
      "Legal frameworks, product terms and API specs need tighter access controls than general documentation, plus an audit trail.",
    approach: [
      "Contract packs hold regulated content behind their own access rules.",
      "Agents search, read the authoritative unit and cite it, every time.",
      "Gated authoring means a person approves every publish.",
    ],
    outcome: "AI assistants your risk team can approve, because every answer has a source and an owner.",
    products: ["KnowledgeTheory", "Autheory"],
    route: "theorymcp.ai/acme-bank/mcp",
  },
  {
    slug: "agent-distribution",
    industry: "Enterprise IT",
    title: "Distribute verified agents across hundreds of repos",
    problem:
      "Copy-pasted prompts and agent configs fall out of date quietly, and nobody knows which version a team is running.",
    approach: [
      "Teams materialize a published agent into their repo as a checksummed pack.",
      "If anything is missing or mismatched, nothing is written.",
      "Verify and sync keep every copy aligned with the version that's live.",
    ],
    outcome: "Each repo runs a version you can name, and you can verify that it's that version.",
    products: ["TheoryMCP"],
    route: "theorymcp.ai/acme/agents/reviewer/mcp",
  },
];

export const tiers = [
  {
    name: "Developer",
    for: "Individual engineers trying TheoryMCP and AppTheory",
    features: [
      "1 namespace",
      "Claude Code, Codex & Antigravity",
      "Published knowledge search",
      "Agent memory for 1 agent",
      "Community support",
    ],
  },
  {
    name: "Team",
    for: "Product and platform teams running agents day to day",
    features: [
      "Everything in Developer",
      "Multiple agents per namespace",
      "Mailbox & email for agents",
      "Materialize, verify & sync",
      "Email support",
    ],
  },
  {
    name: "Business",
    highlight: true,
    for: "Companies running customer-facing or partner agents",
    features: [
      "Everything in Team",
      "Partner routes",
      "Gated authoring (lab → live)",
      "Contract packs",
      "SSO & audit export",
      "Priority support",
    ],
  },
  {
    name: "Enterprise",
    for: "Regulated organisations and very large deployments",
    features: [
      "Everything in Business",
      "Dedicated namespaces & regions",
      "Custom contract packs",
      "Forward-deployed engineer",
      "Uptime SLA & security review",
    ],
  },
];

export const comparison: { feature: string; values: (boolean | string)[] }[] = [
  { feature: "Namespaces", values: ["1", "Up to 3", "Up to 10", "Custom"] },
  { feature: "Agent MCP endpoints", values: ["1", "Up to 10", "Up to 50", "Custom"] },
  { feature: "Knowledge search & citations", values: [true, true, true, true] },
  { feature: "Subject-scoped agent memory", values: [true, true, true, true] },
  { feature: "Mailbox & email", values: [false, true, true, true] },
  { feature: "Materialize, verify & sync", values: [false, true, true, true] },
  { feature: "Partner routes", values: [false, false, true, true] },
  { feature: "Gated authoring (lab → live)", values: [false, false, true, true] },
  { feature: "Contract packs", values: [false, false, true, true] },
  { feature: "SSO & audit export", values: [false, false, true, true] },
  { feature: "Dedicated region", values: [false, false, false, true] },
  { feature: "Forward-deployed engineer", values: [false, false, false, true] },
  { feature: "Support", values: ["Community", "Email", "Priority", "Dedicated + SLA"] },
];
