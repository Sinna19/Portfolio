// Browser-only educational model. See docs/SOURCE_MAP.md for implementation boundaries.
export type Options = {
  role: "member" | "admin";
  key: "active" | "revoked";
  upstream: "connected" | "unreachable";
  channel: "mcp" | "chat";
};
export type Trace = {
  node: string;
  title: string;
  detail: string;
  state: "ok" | "error" | "held";
};
export type Run = {
  status: string;
  http: number;
  response: unknown;
  trace: Trace[];
  audit: null | {
    source: string;
    tool: string;
    outcome: string;
    error: string | null;
  };
  pending?: boolean;
};
export const presets = [
  {
    name: "Read the catalog",
    hint: "A successful tool call",
    tool: "woo__list_products",
    args: { per_page: 2 },
    role: "member",
    key: "active",
    upstream: "connected",
    channel: "mcp",
  },
  {
    name: "Permission boundary",
    hint: "Member attempts an admin tool",
    tool: "woo__create_product",
    args: { name: "Demo notebook", regular_price: "12.50", status: "draft" },
    role: "member",
    key: "active",
    upstream: "connected",
    channel: "mcp",
  },
  {
    name: "Upstream offline",
    hint: "A tool error, not a transport failure",
    tool: "woo__list_products",
    args: { per_page: 2 },
    role: "member",
    key: "active",
    upstream: "unreachable",
    channel: "mcp",
  },
  {
    name: "Revoked credential",
    hint: "Rejected before the gateway",
    tool: "woo__list_products",
    args: { per_page: 2 },
    role: "member",
    key: "revoked",
    upstream: "connected",
    channel: "mcp",
  },
  {
    name: "Confirm a chat write",
    hint: "Approve or decline a held write",
    tool: "woo__create_product",
    args: { name: "Demo notebook", regular_price: "12.50", status: "draft" },
    role: "admin",
    key: "active",
    upstream: "connected",
    channel: "chat",
  },
] as const;
const catalog = [
  {
    id: 101,
    name: "Demo notebook",
    sku: "DEMO-NOTE",
    price: "12.50",
    status: "publish",
    stock_status: "instock",
  },
  {
    id: 102,
    name: "Demo pencil",
    sku: "DEMO-PEN",
    price: "2.00",
    status: "publish",
    stock_status: "instock",
  },
];
export function simulateGateway(
  tool: string,
  args: Record<string, unknown>,
  o: Options,
  decision?: "approve" | "decline",
): Run {
  const trace: Trace[] = [];
  const step = (
    node: string,
    title: string,
    detail: string,
    state: Trace["state"] = "ok",
  ) => trace.push({ node, title, detail, state });
  // Chat uses a dashboard session; the key setting represents /mcp only.
  step(
    "client",
    o.channel === "mcp"
      ? "MCP client → POST /mcp"
      : "Dashboard chat → proposed tool call",
    o.channel === "mcp"
      ? "Assume an initialized Streamable HTTP session. No real key is sent."
      : "Assume a signed-in dashboard session and an LLM-proposed tool. No LLM is called.",
  );
  if (o.channel === "mcp" && o.key === "revoked") {
    step(
      "auth",
      "Credential rejected",
      "Authentication runs on every request, even for an existing MCP session. No tool audit is written.",
      "error",
    );
    return {
      status: "Unauthorized",
      http: 401,
      response: { error: "invalid or missing API key" },
      trace,
      audit: null,
    };
  }
  step(
    "auth",
    o.channel === "mcp" ? "Bearer key accepted" : "Dashboard session accepted",
    "Authentication is assumed valid in this simulation. The real system reads identity from its database.",
  );
  const audit = (outcome: string, error: string | null) => ({
    source: o.channel,
    tool,
    outcome,
    error,
  });
  if (o.channel === "chat" && !decision) {
    step(
      "gateway",
      "Discover available chat tools",
      o.upstream === "unreachable"
        ? "The upstream is already offline, so its tools are absent from discovery. This manually proposed name follows the unknown-tool execution path, not write confirmation. No model is called."
        : "Chat discovers connected, role-permitted tools before a model proposal. This simulation supplies the proposal locally.",
    );
  }
  if (
    o.channel === "chat" &&
    o.role === "admin" &&
    o.upstream === "connected" &&
    ["woo__create_product", "woo__update_order_status"].includes(tool) &&
    !decision
  ) {
    step(
      "gateway",
      "Write held for confirmation",
      "Chat holds non-read-only tools before execution. Direct MCP calls do not use this confirmation flow.",
      "held",
    );
    return {
      status: "Awaiting confirmation",
      http: 200,
      response: { pendingToolCall: { tool, args } },
      trace,
      audit: null,
      pending: true,
    };
  }
  if (decision === "decline") {
    step(
      "gateway",
      "Write declined",
      "Nothing is sent upstream. The gateway records an outcome of declined.",
      "held",
    );
    step(
      "audit",
      "Decline recorded",
      "Simulated audit entry; no database write.",
    );
    return {
      status: "Declined",
      http: 200,
      response: { demo: "Write declined; no tool executed" },
      trace,
      audit: audit("declined", null),
    };
  }
  step(
    "gateway",
    "Resolve tool & role",
    `${tool} is split at the first __. Role rules are re-read for every tool call; write restrictions shown here match the registration script.`,
  );
  const parts = tool.split("__");
  const restricted =
    ["woo__create_product", "woo__update_order_status"].includes(tool) &&
    o.role === "member";
  if (restricted) {
    step(
      "gateway",
      "Role denied",
      "Restricted tools are hidden from tools/list and rejected if called directly.",
      "error",
    );
    step(
      "audit",
      "Error recorded",
      "Role-denied calls reach Gateway.callTool and are audited.",
    );
    return {
      status: "Role denied",
      http: 200,
      response: {
        jsonrpc: "2.0",
        id: 1,
        error: { code: -32602, message: "tool not permitted for your role" },
      },
      trace,
      audit: audit("error", "tool not permitted for your role"),
    };
  }
  const error =
    !tool.includes("__") || !parts[0] || !parts.slice(1).join("__")
      ? `unknown tool '${tool.slice(0, 100)}'`
      : parts[0] !== "woo"
        ? `server '${parts[0]}' not found`
        : o.upstream === "unreachable"
          ? "server 'woo' is unreachable"
          : null;
  if (error) {
    step("upstream", "Upstream call unavailable", error, "error");
    step(
      "audit",
      "Error recorded",
      "Gateway returns an MCP isError tool result. HTTP success does not imply tool success.",
    );
    return {
      status: "Tool error",
      http: 200,
      response: { content: [{ type: "text", text: error }], isError: true },
      trace,
      audit: audit("error", error),
    };
  }
  step(
    "upstream",
    "woo-mcp adapter",
    "The real adapter validates arguments, calls the WooCommerce REST API, and trims the result. Here the response is generated from fictional local demo data.",
  );
  let payload: unknown;
  if (tool === "woo__list_products") {
    if (
      args.per_page !== undefined &&
      (!Number.isInteger(args.per_page) ||
        Number(args.per_page) < 1 ||
        Number(args.per_page) > 100)
    )
      return validation("per_page must be an integer from 1 to 100");
    if (args.search !== undefined && typeof args.search !== "string")
      return validation("search must be a string");
    if (
      args.page !== undefined &&
      (!Number.isInteger(args.page) || Number(args.page) < 1)
    )
      return validation("page must be a positive integer");
    const items = catalog.filter(
      (p) =>
        !args.search ||
        (p.name + " " + p.sku)
          .toLowerCase()
          .includes(String(args.search).toLowerCase()),
    );
    const size = Number(args.per_page ?? 20);
    const page = Number(args.page ?? 1);
    payload = {
      items: items.slice((page - 1) * size, page * size),
      total: items.length,
      total_pages: Math.ceil(items.length / size),
    };
  } else if (tool === "woo__create_product") {
    if (
      typeof args.name !== "string" ||
      !args.name.length ||
      typeof args.regular_price !== "string" ||
      !/^\d+(\.\d{1,2})?$/.test(args.regular_price) ||
      (args.status !== undefined &&
        (typeof args.status !== "string" ||
          !["draft", "publish"].includes(args.status)))
    )
      return validation(
        "Expected name, decimal-string regular_price, and optional draft/publish status",
      );
    if (args.sku !== undefined && typeof args.sku !== "string")
      return validation("sku must be a string when provided");
    if (args.description !== undefined && typeof args.description !== "string")
      return validation("description must be a string when provided");
    payload = {
      id: 103,
      name: args.name,
      sku: args.sku ?? "",
      price: args.regular_price,
      status: args.status ?? "publish",
      stock_status: "instock",
      permalink: "https://example.invalid/demo-product",
    };
  } else {
    return validation(
      "This console implements only list_products and create_product. Other real tools are outside this demo subset.",
    );
  }
  step(
    "store",
    "Fixture response",
    "Illustrative WooCommerce-shaped data. No store is contacted and no product is persisted.",
  );
  step(
    "audit",
    "Tool outcome recorded",
    "The actual gateway writes user, tool, source, duration, outcome, and redacted arguments to PostgreSQL. This view shows only a local audit summary.",
  );
  return {
    status: "Completed",
    http: 200,
    response: { content: [{ type: "text", text: JSON.stringify(payload) }] },
    trace,
    audit: audit("ok", null),
  };
  function validation(message: string): Run {
    step("upstream", "Demo input rejected", message, "error");
    step(
      "audit",
      "Tool error recorded",
      "Validation wording is simplified; this is not the SDK’s exact validation response.",
    );
    return {
      status: "Demo validation error",
      http: 200,
      response: { isError: true, content: [{ type: "text", text: message }] },
      trace,
      audit: audit("error", "tool returned an error"),
    };
  }
}
export function normalizeOrderId(raw: string) {
  let id = raw
    .trim()
    .toUpperCase()
    .replace(/[^A-Z0-9-]/g, "");
  if (!/^ORD-\d+$/.test(id)) {
    const m = raw.toUpperCase().match(/ORD-?\d+/);
    if (m) id = m[0].replace(/^ORD-?/, "ORD-");
  }
  return id;
}
export function gradeReply(
  c: { must_contain: string[]; must_not_contain: string[] },
  reply: string,
) {
  const normalized = reply
    .toLowerCase()
    .replace(/[–—‑−]/g, "-")
    .replace(/[‘’]/g, "'")
    .replace(/[“”]/g, '"');
  const required =
    c.must_contain.length === 0 ||
    c.must_contain.some((s) => normalized.includes(s.toLowerCase()));
  const forbidden = c.must_not_contain.find((s) =>
    normalized.includes(s.toLowerCase()),
  );
  return {
    passed: required && !forbidden,
    required,
    forbidden: forbidden ?? null,
    normalized,
  };
}
