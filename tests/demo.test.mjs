import test from "node:test";
import assert from "node:assert/strict";
import { simulateGateway, gradeReply, normalizeOrderId } from "../lib/demo.ts";
import fixtures from "../lib/order-fixtures.json" with { type: "json" };
import cases from "../lib/eval-fixtures.json" with { type: "json" };
const opts = {
  role: "member",
  key: "active",
  upstream: "connected",
  channel: "mcp",
};
test("MCP revocation stops before role routing and produces no tool audit", () => {
  const r = simulateGateway(
    "woo__create_product",
    {},
    { ...opts, key: "revoked" },
  );
  assert.equal(r.http, 401);
  assert.equal(r.audit, null);
  assert.deepEqual(
    r.trace.map((s) => s.node),
    ["client", "auth"],
  );
});
test("member role denial remains a JSON-RPC error and is audited", () => {
  const r = simulateGateway("woo__create_product", {}, opts);
  assert.equal(r.response.error.code, -32602);
  assert.equal(r.audit.outcome, "error");
  assert.ok(!r.trace.some((t) => t.node === "store"));
});
test("unreachable upstream is a tool error with HTTP 200", () => {
  const r = simulateGateway(
    "woo__list_products",
    {},
    { ...opts, upstream: "unreachable" },
  );
  assert.equal(r.http, 200);
  assert.equal(r.response.isError, true);
  assert.equal(r.response.content[0].text, "server 'woo' is unreachable");
  assert.equal(r.audit.error, "server 'woo' is unreachable");
});
test("chat admin write holds, approves, or declines without executing", () => {
  const o = { ...opts, role: "admin", channel: "chat", key: "revoked" };
  const args = { name: "Test", regular_price: "12.50" };
  const pending = simulateGateway("woo__create_product", args, o);
  assert.equal(pending.pending, true);
  assert.equal(pending.audit, null);
  const declined = simulateGateway("woo__create_product", args, o, "decline");
  assert.equal(declined.audit.outcome, "declined");
  assert.ok(!declined.trace.some((s) => s.node === "upstream"));
  const approved = simulateGateway("woo__create_product", args, o, "approve");
  assert.equal(approved.audit.outcome, "ok");
});
test("chat member cannot bypass role boundaries via confirmation", () => {
  const r = simulateGateway(
    "woo__create_product",
    {},
    { ...opts, channel: "chat" },
  );
  assert.equal(r.pending, undefined);
  assert.equal(r.status, "Role denied");
});
test("direct admin MCP writes do not require chat confirmation", () => {
  assert.equal(
    simulateGateway(
      "woo__create_product",
      { name: "Test", regular_price: "1.00" },
      { ...opts, role: "admin" },
    ).status,
    "Completed",
  );
});
test("catalog filters and pagination use arguments and never persist writes", () => {
  const r = simulateGateway(
    "woo__list_products",
    { search: "pencil", per_page: 1 },
    opts,
  );
  assert.equal(JSON.parse(r.response.content[0].text).items[0].id, 102);
  const empty = simulateGateway(
    "woo__list_products",
    { page: 4, per_page: 1 },
    opts,
  );
  assert.equal(JSON.parse(empty.response.content[0].text).items.length, 0);
  simulateGateway(
    "woo__create_product",
    { name: "Added", regular_price: "1.00" },
    { ...opts, role: "admin" },
  );
  assert.equal(
    JSON.parse(
      simulateGateway("woo__list_products", {}, opts).response.content[0].text,
    ).total,
    2,
  );
});
test("invalid schema fails and is audited, without a store visit", () => {
  for (const args of [
    { per_page: 0 },
    { per_page: 101 },
    { per_page: 1.5 },
    { search: 5 },
    { page: 0 },
  ]) {
    const r = simulateGateway("woo__list_products", args, opts);
    assert.equal(r.response.isError, true);
    assert.equal(r.audit.outcome, "error");
    assert.ok(!r.trace.some((s) => s.node === "store"));
  }
});
test("name routing distinguishes an unknown server from malformed tool", () => {
  assert.equal(
    simulateGateway("fx__convert", {}, opts).audit.error,
    "server 'fx' not found",
  );
  assert.equal(
    simulateGateway("bad-name", {}, opts).audit.error,
    "unknown tool 'bad-name'",
  );
});
test("order normalization follows the Python recovery rules", () => {
  assert.equal(normalizeOrderId("check ORD-1007 please"), "ORD-1007");
  assert.equal(normalizeOrderId(" ord1007 "), "ORD-1007");
  assert.equal(normalizeOrderId("ord-1007!"), "ORD-1007");
});
test("shipped fixture bundle contains no private/internal keys; stale ETA absent", () => {
  const visit = (o) => {
    if (!o || typeof o !== "object") return;
    for (const [k, v] of Object.entries(o)) {
      assert.ok(
        ![
          "customer",
          "email",
          "shipping_address",
          "internal",
          "risk_score",
          "warehouse_note",
          "sku",
        ].includes(k),
        k,
      );
      visit(v);
    }
  };
  visit(fixtures);
  assert.equal(fixtures["ORD-1004"].status, "cancelled");
  assert.equal(fixtures["ORD-1004"].estimated_delivery, undefined);
  assert.equal(fixtures["ORD-1010"].requires_handoff, true);
});
test("grader matches original any-required/no-forbidden semantics and normalization", () => {
  assert.equal(gradeReply(cases[0], "5–7 business days").passed, true);
  assert.equal(
    gradeReply(cases[0], "Standard shipping does not take 5–7 days.").passed,
    true,
  );
  assert.equal(gradeReply(cases[0], "Tomorrow").passed, false);
  assert.equal(
    gradeReply(cases[2], "Final sale; refund has been processed").passed,
    false,
  );
  assert.equal(gradeReply(cases[2], "We can’t refund it.").passed, true);
});

test("every project connects browser simulation guidance to deployment status and pinned source evidence", async () => {
  const { projectContext } = await import("../lib/project-context.ts");
  assert.equal(projectContext.length, 3);
  for (const p of projectContext) {
    assert.equal(p.revision.length, 40);
    assert.ok(p.steps.length === 3 && p.evidence.length >= 3);
    assert.ok(p.architecture.length >= 4 && p.stack.length >= 5);
    assert.ok(p.boundary.length > 60 && p.tradeoff.length > 60);
    assert.doesNotMatch(
      JSON.stringify(p),
      /https?:\/\/(?!github\.com)|\b\d{1,3}(?:\.\d{1,3}){3}\b|sslip\.io|umk_|gsk_/,
    );
  }
  assert.match(projectContext[0].status, /k3s on an Azure VM/);
  assert.match(projectContext[1].status, /Streamlit.*unverified/);
  assert.match(projectContext[2].status, /Not deployed/);
});
