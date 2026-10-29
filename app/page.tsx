"use client";
import { useState } from "react";
import { motion, MotionConfig } from "framer-motion";
import {
  ArrowUpRight,
  ArrowRight,
  Play,
  RotateCcw,
  Check,
  ShieldCheck,
  Network,
  Terminal,
  BookOpen,
  FlaskConical,
  User,
  ChevronRight,
  Layers3,
  Database,
  Box,
  Activity,
  Github,
  Linkedin,
  Copy,
} from "lucide-react";
import {
  presets,
  simulateGateway,
  gradeReply,
  normalizeOrderId,
  type Options,
  type Run,
} from "@/lib/demo";
import orders from "@/lib/order-fixtures.json";
import cases from "@/lib/eval-fixtures.json";
import { projectContext } from "@/lib/project-context";
import { Implementation } from "@/components/project-guide";
const base = "https://github.com/Sinna19/";
const repos = ["MCP-Gateway-on-Kubernetes", "aster-row-agent", "Eval-Harness"];
const nodes = [
  { id: "client", title: "Client", sub: "Streamable HTTP", icon: Terminal },
  { id: "auth", title: "Identity", sub: "Key / session", icon: ShieldCheck },
  { id: "gateway", title: "Gateway", sub: "Role · route", icon: Layers3 },
  { id: "upstream", title: "woo-mcp", sub: "Tool adapter", icon: Box },
  { id: "store", title: "Store", sub: "WooCommerce", icon: Database },
];
const json = (v: unknown) => JSON.stringify(v, null, 2);
export default function Home() {
  const [tab, setTab] = useState(0);
  const [experience, setExperience] = useState("demo");
  function showExperience(value: string) {
    setExperience(value);
    requestAnimationFrame(() =>
      document.getElementById("experience-content")?.focus(),
    );
  }
  function resetCurrent() {
    if (tab === 0) {
      choose(0);
      setHistory([]);
    } else if (tab === 1) {
      setOid("ord-1004 ");
      setLookup(null);
      setConflict(false);
    } else {
      setCaseIndex(0);
      setReply("Standard shipping takes 5–7 business days.");
      setGrade(null);
    }
  }
  const [profile, setProfile] = useState(false);
  const [tool, setTool] = useState<string>(presets[0].tool);
  const [args, setArgs] = useState(json(presets[0].args));
  const [opts, setOpts] = useState<Options>({
    role: "member",
    key: "active",
    upstream: "connected",
    channel: "mcp",
  });
  const [preset, setPreset] = useState(0);
  const [run, setRun] = useState<Run | null>(null);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [selected, setSelected] = useState("gateway");
  const [inspector, setInspector] = useState("Response");
  const [history, setHistory] = useState<{ status: string; tool: string }[]>(
    [],
  );
  const [oid, setOid] = useState("ord-1004 ");
  const [lookup, setLookup] = useState<unknown>(null);
  const [conflict, setConflict] = useState(false);
  const [caseIndex, setCaseIndex] = useState(0);
  const [reply, setReply] = useState(
    "Standard shipping takes 5–7 business days.",
  );
  const [grade, setGrade] = useState<ReturnType<typeof gradeReply> | null>(
    null,
  );
  const [copied, setCopied] = useState(false);
  function resetResult() {
    setRun(null);
    setError("");
  }
  function choose(i: number) {
    const p = presets[i];
    setPreset(i);
    setTool(p.tool);
    setArgs(json(p.args));
    setOpts({
      role: p.role,
      key: p.key,
      upstream: p.upstream,
      channel: p.channel,
    });
    resetResult();
  }
  async function execute(decision?: "approve" | "decline") {
    setError("");
    let parsed;
    try {
      parsed = JSON.parse(args);
      if (!parsed || Array.isArray(parsed) || typeof parsed !== "object")
        throw Error();
    } catch {
      setError("Arguments must be a valid JSON object. No request was run.");
      return;
    }
    setBusy(true);
    await new Promise((r) => setTimeout(r, 250));
    const result = simulateGateway(tool, parsed, opts, decision);
    setRun(result);
    setHistory((h) => [{ status: result.status, tool }, ...h].slice(0, 5));
    setBusy(false);
    setSelected(result.trace.find((t) => t.state !== "ok")?.node ?? "store");
  }
  function orderLookup() {
    const id = normalizeOrderId(oid);
    const data = orders as Record<string, unknown>;
    setLookup(
      !/^ORD-\d+$/.test(id)
        ? {
            found: false,
            order_id: oid,
            error: "malformed_order_id",
            requires_handoff: false,
          }
        : (data[id] ?? {
            found: false,
            order_id: id,
            error: "not_found",
            requires_handoff: true,
            handoff_reason:
              "Order ID was not found. The customer should double-check the ID or contact support.",
          }),
    );
  }
  return (
    <MotionConfig reducedMotion="user">
      <a href="#workspace" className="skip">
        Skip to workspace
      </a>
      <div className="app-shell">
        <aside className="sidebar">
          <a
            href="#workspace"
            className="brand"
            onClick={() => {
              setProfile(false);
              setTab(0);
            }}
          >
            <span className="brand-mark">
              a<span>s</span>
            </span>
            <div>
              Aayushi Sinha<small>ENGINEERING PLAYGROUND</small>
            </div>
          </a>
          <div className="sidebar-caption">EXPLORE THE SYSTEMS</div>
          <nav aria-label="Project navigation">
            {["MCP Gateway", "Aster & Row", "Eval Harness"].map((n, i) => {
              const Icon = [Network, BookOpen, FlaskConical][i];
              return (
                <button
                  key={n}
                  className={
                    tab === i && !profile ? "nav-item active" : "nav-item"
                  }
                  onClick={() => {
                    setTab(i);
                    setExperience("demo");
                    setProfile(false);
                  }}
                  aria-current={tab === i && !profile ? "page" : undefined}
                >
                  <Icon size={18} />
                  <span>
                    {n}
                    <small>
                      {
                        [
                          "Infrastructure & tool routing",
                          "Grounded support & privacy",
                          "Conversation evaluation",
                        ][i]
                      }
                    </small>
                  </span>
                  <ChevronRight size={14} />
                </button>
              );
            })}
          </nav>
          <div className="sidebar-note">
            <span className="live-dot" /> LOCAL INTERACTIVE LABS
            <p>
              Open the black box.
              <br />
              Follow a request.
              <br />
              Understand the tradeoffs.
            </p>
            <span className="mini-pill">No credentials needed</span>
          </div>
          <div className="sidebar-bottom">
            <button
              className={profile ? "profile-link active" : "profile-link"}
              onClick={() => setProfile(!profile)}
            >
              <User size={17} /> The engineer behind it{" "}
              <ArrowUpRight size={14} />
            </button>
            <a href={base.slice(0, -1)} target="_blank" rel="noreferrer">
              <Github size={16} /> GitHub <ArrowUpRight size={13} />
            </a>
          </div>
        </aside>
        <div className="main-shell">
          <header className="topbar">
            <div>
              <span className="muted">Playground</span>
              <ChevronRight size={13} />
              <span>
                {profile
                  ? "About Aayushi"
                  : ["MCP Gateway", "Aster & Row", "Eval Harness"][tab]}
              </span>
            </div>
            <span className="version">
              <span className="live-dot" /> INTERACTIVE / v2.0
            </span>
          </header>
          <main id="workspace" tabIndex={-1}>
            {profile ? (
              <section className="profile panel">
                <div className="kicker">THE ENGINEER BEHIND THE SYSTEMS</div>
                <h1>
                  Aayushi Sinha<span>.</span>
                </h1>
                <p className="lead">
                  Software, AI, and the infrastructure that brings them
                  together.
                </p>
                <p>
                  My projects explore how to make intelligent systems more
                  dependable: evaluating conversations, grounding support
                  agents, and connecting tools through MCP. This playground is a
                  way to explore those engineering decisions from the inside.
                </p>
                <div className="profile-grid">
                  <div>
                    <h3>Education</h3>
                    <strong>B.Tech · Computer Science and Engineering</strong>
                    <p>Graduated June 2026</p>
                  </div>
                  <div>
                    <h3>Project toolkit</h3>
                    <p>
                      Python · TypeScript · Kubernetes · Helm · Docker · MCP ·
                      scikit-learn · LLM evaluation
                    </p>
                  </div>
                </div>
                <div className="button-row">
                  <a
                    className="primary button"
                    href={base.slice(0, -1)}
                    target="_blank"
                    rel="noreferrer"
                  >
                    <Github size={16} /> GitHub <ArrowUpRight size={14} />
                  </a>
                  <a
                    className="button"
                    href="https://www.linkedin.com/in/aayushi-sinha-43b0a0281/"
                    target="_blank"
                    rel="noreferrer"
                  >
                    <Linkedin size={16} /> LinkedIn <ArrowUpRight size={14} />
                  </a>
                </div>
                <button
                  className="text-button"
                  onClick={() => setProfile(false)}
                >
                  Return to the labs <ArrowRight size={15} />
                </button>
              </section>
            ) : (
              <>
                <div className="page-heading">
                  <div>
                    <div className="kicker">
                      {
                        [
                          "01 / INFRASTRUCTURE LAB",
                          "02 / APPLIED AI LAB",
                          "03 / RELIABILITY LAB",
                        ][tab]
                      }
                    </div>
                    <h1>
                      {
                        [
                          "One gateway. Every tool.",
                          "Grounded by design.",
                          "Test the answer.",
                        ][tab]
                      }
                    </h1>
                    <p>
                      {
                        [
                          "Send a request. Follow its path. See where trust is enforced.",
                          "Inspect what the agent can know — and what never reaches the model.",
                          "Explore the gap between a passing check and a reliable conversation.",
                        ][tab]
                      }
                    </p>
                  </div>
                  <a
                    className="source-link"
                    href={base + repos[tab]}
                    target="_blank"
                    rel="noreferrer"
                  >
                    <Github size={16} /> Explore source{" "}
                    <ArrowUpRight size={14} />
                  </a>
                </div>
                <div className="project-path" aria-label="Project experiences">
                  <button
                    aria-pressed={experience === "demo"}
                    onClick={() => showExperience("demo")}
                  >
                    1. Try the Interactive Demo
                  </button>
                  <button
                    aria-pressed={experience === "implementation"}
                    onClick={() => showExperience("implementation")}
                  >
                    2. Explore the Real Implementation
                  </button>
                </div>
                <div id="experience-content" tabIndex={-1}>
                  {experience === "implementation" ? (
                    <Implementation
                      index={tab}
                      onTry={() => showExperience("demo")}
                    />
                  ) : (
                    <>
                      <div className="simulation-banner">
                        <FlaskConical size={16} />
                        <div>
                          <strong>
                            Interactive simulation — runs in your browser.
                          </strong>
                          <span>{projectContext[tab].boundary}</span>
                        </div>
                      </div>
                      <div className="onboarding">
                        <div>
                          <span className="kicker">
                            YOUR 2–3 MINUTE TOUR / LAB {tab + 1} OF 3
                          </span>
                          <ol>
                            {projectContext[tab].steps.map((step) => (
                              <li key={step}>{step}</li>
                            ))}
                          </ol>
                        </div>
                        <button
                          className="text-button"
                          disabled={busy}
                          onClick={resetCurrent}
                        >
                          <RotateCcw size={13} /> Reset this demo
                        </button>
                      </div>
                      <p className="deployment-inline">
                        Real project:{" "}
                        <strong>{projectContext[tab].status}</strong>{" "}
                        <button
                          onClick={() => showExperience("implementation")}
                        >
                          See architecture & evidence <ArrowRight size={12} />
                        </button>
                      </p>
                      {tab === 0 ? (
                        <>
                          <div className="lab-toolbar">
                            <div className="section-label">
                              <span className="live-dot" /> REQUEST LAB{" "}
                              <span className="muted">/ choose a scenario</span>
                            </div>
                            <button
                              className="text-button"
                              disabled={busy}
                              onClick={() => {
                                choose(0);
                                setHistory([]);
                              }}
                            >
                              <RotateCcw size={13} /> Reset lab
                            </button>
                          </div>
                          <div className="scenario-grid">
                            {presets.map((p, i) => (
                              <button
                                disabled={busy}
                                onClick={() => choose(i)}
                                className={
                                  "scenario " + (preset === i ? "chosen" : "")
                                }
                                key={p.name}
                              >
                                <span className="scenario-number">
                                  0{i + 1}
                                </span>
                                <strong>{p.name}</strong>
                                <small>{p.hint}</small>
                                {preset === i && <Check size={13} />}
                              </button>
                            ))}
                          </div>
                          <div className="console-grid">
                            <section className="panel composer">
                              <div className="panel-heading">
                                <span>
                                  <Terminal size={15} /> Request composer
                                </span>
                                <span className="tag">
                                  {opts.channel === "mcp"
                                    ? "JSON-RPC"
                                    : "CHAT TOOL PROPOSAL"}
                                </span>
                              </div>
                              <div className="panel-content">
                                <label className="field-label" htmlFor="tool">
                                  TOOL NAME
                                </label>
                                <select
                                  id="tool"
                                  disabled={busy}
                                  value={tool}
                                  onChange={(e) => {
                                    setTool(e.target.value);
                                    resetResult();
                                  }}
                                >
                                  <option>woo__list_products</option>
                                  <option>woo__create_product</option>
                                </select>
                                <div className="split-fields">
                                  <label>
                                    Role
                                    <select
                                      disabled={busy}
                                      value={opts.role}
                                      onChange={(e) => {
                                        setOpts({
                                          ...opts,
                                          role: e.target
                                            .value as Options["role"],
                                        });
                                        resetResult();
                                      }}
                                    >
                                      <option value="member">Member</option>
                                      <option value="admin">Admin</option>
                                    </select>
                                  </label>
                                  <label>
                                    Channel
                                    <select
                                      disabled={busy}
                                      value={opts.channel}
                                      onChange={(e) => {
                                        setOpts({
                                          ...opts,
                                          channel: e.target
                                            .value as Options["channel"],
                                        });
                                        resetResult();
                                      }}
                                    >
                                      <option value="mcp">MCP client</option>
                                      <option value="chat">
                                        Dashboard chat
                                      </option>
                                    </select>
                                  </label>
                                </div>
                                <div className="split-fields">
                                  <label>
                                    API key
                                    <select
                                      disabled={busy || opts.channel === "chat"}
                                      value={opts.key}
                                      onChange={(e) => {
                                        setOpts({
                                          ...opts,
                                          key: e.target.value as Options["key"],
                                        });
                                        resetResult();
                                      }}
                                    >
                                      <option value="active">
                                        Active (simulated)
                                      </option>
                                      <option value="revoked">Revoked</option>
                                    </select>
                                  </label>
                                  <label>
                                    Upstream
                                    <select
                                      disabled={busy}
                                      value={opts.upstream}
                                      onChange={(e) => {
                                        setOpts({
                                          ...opts,
                                          upstream: e.target
                                            .value as Options["upstream"],
                                        });
                                        resetResult();
                                      }}
                                    >
                                      <option value="connected">
                                        Connected
                                      </option>
                                      <option value="unreachable">
                                        Unreachable
                                      </option>
                                    </select>
                                  </label>
                                </div>
                                <label className="field-label" htmlFor="args">
                                  ARGUMENTS <span>editable JSON</span>
                                </label>
                                <textarea
                                  id="args"
                                  spellCheck={false}
                                  value={args}
                                  disabled={busy}
                                  onChange={(e) => {
                                    setArgs(e.target.value);
                                    resetResult();
                                  }}
                                  rows={7}
                                />
                                <p className="input-hint">
                                  {tool === "woo__list_products"
                                    ? "Try search, per_page (1–100), or page."
                                    : "Try name, regular_price (a decimal string), and status: draft or publish."}
                                </p>
                                {error && (
                                  <p className="error-text" role="alert">
                                    {error}
                                  </p>
                                )}
                                <button
                                  className="primary run-button"
                                  disabled={busy}
                                  onClick={() => execute()}
                                >
                                  <Play size={15} fill="currentColor" />
                                  {busy
                                    ? "Running simulation…"
                                    : "Run simulated request"}
                                  <span>↵</span>
                                </button>
                              </div>
                              <div className="composer-footer">
                                <ShieldCheck size={13} /> Requests stay in this
                                browser
                              </div>
                            </section>
                            <section className="panel architecture">
                              <div className="panel-heading">
                                <span>
                                  <Network size={15} /> Request architecture
                                </span>
                                <span className="tag muted">SELECT A NODE</span>
                              </div>
                              <div className="architecture-canvas">
                                <div className="cluster-label">
                                  ILLUSTRATIVE REQUEST PATH · HELM / KUBERNETES
                                  IN THE REAL SYSTEM
                                </div>
                                <div className="node-row">
                                  {nodes.map((n, i) => {
                                    const hit = run?.trace
                                      .filter((t) => t.node === n.id)
                                      .at(-1);
                                    return (
                                      <div className="node-wrap" key={n.id}>
                                        <button
                                          className={
                                            "arch-node " +
                                            (selected === n.id
                                              ? "selected "
                                              : "") +
                                            (hit?.state ?? "idle")
                                          }
                                          onClick={() => setSelected(n.id)}
                                          aria-pressed={selected === n.id}
                                        >
                                          <n.icon size={22} />
                                          <strong>{n.title}</strong>
                                          <small>{n.sub}</small>
                                          <span className="node-dot" />
                                          <span className="sr-only">
                                            {hit?.state ?? "not visited"}
                                          </span>
                                        </button>
                                        {i < 4 && (
                                          <ArrowRight
                                            className={
                                              "connector " +
                                              (hit ? "traversed" : "")
                                            }
                                            size={17}
                                          />
                                        )}
                                      </div>
                                    );
                                  })}
                                </div>
                                <button
                                  onClick={() => setSelected("audit")}
                                  className={
                                    "audit-node " +
                                    (selected === "audit" ? "selected" : "")
                                  }
                                >
                                  <Database size={15} />
                                  <span>PostgreSQL</span>
                                  <small>identity · roles · audit</small>
                                </button>
                                <div className="canvas-legend">
                                  <span>
                                    <i className="legend-dot ok" /> Visited
                                  </span>
                                  <span>
                                    <i className="legend-dot error" /> Rejected
                                  </span>
                                  <span>
                                    <i className="legend-dot held" /> Held
                                  </span>
                                  <span>
                                    <i className="legend-dot idle" /> Not
                                    visited
                                  </span>
                                </div>
                              </div>
                              <div className="node-explanation">
                                <div className="kicker">
                                  {selected.toUpperCase()} / UNDER THE HOOD
                                </div>
                                <p>
                                  {
                                    (
                                      {
                                        client:
                                          "An initialized MCP client sends tools/call to /mcp using Streamable HTTP. Dashboard chat proposes tools through a separate session-authenticated endpoint.",
                                        auth: "MCP bearer keys are checked on every request. Revocation takes effect even in an existing session. Chat authenticates with a dashboard session instead.",
                                        gateway:
                                          "Both MCP and chat share Gateway.callTool: split the prefixed tool name, re-read role restrictions, route the call, and audit the outcome.",
                                        upstream:
                                          "The upstream manager resolves the server slug and checks connection state. woo-mcp validates arguments and adapts tools to WooCommerce REST calls.",
                                        store:
                                          "WooCommerce is the real project’s commerce backend. This lab uses two fictional products and never sends a request to a real store.",
                                        audit:
                                          "The real PostgreSQL audit records tool calls, including failures and declined chat writes. Authentication failures happen before the tool audit. This lab keeps only five in-memory summaries.",
                                      } as Record<string, string>
                                    )[selected]
                                  }
                                </p>
                              </div>
                            </section>
                          </div>
                          {run?.pending && (
                            <div
                              className="confirm-panel"
                              role="region"
                              aria-label="Confirm simulated write"
                            >
                              <ShieldCheck size={22} />
                              <div>
                                <strong>
                                  This chat write is waiting for you.
                                </strong>
                                <p>
                                  Confirm the proposed arguments above, or
                                  decline without contacting the upstream.
                                  Nothing will be saved in either case.
                                </p>
                              </div>
                              <button
                                disabled={busy}
                                onClick={() => execute("decline")}
                              >
                                Decline
                              </button>
                              <button
                                className="primary"
                                disabled={busy}
                                onClick={() => execute("approve")}
                              >
                                Approve simulation
                              </button>
                            </div>
                          )}
                          <div className="results-grid">
                            <section className="panel trace-panel">
                              <div className="panel-heading">
                                <span>
                                  <Activity size={15} /> Execution trace
                                </span>
                                <span
                                  className={
                                    "status " +
                                    (run?.status === "Completed"
                                      ? "success"
                                      : "")
                                  }
                                >
                                  {run?.status ?? "Ready to run"}
                                </span>
                              </div>
                              <div className="trace-list" aria-live="polite">
                                {run ? (
                                  run.trace.map((t, i) => (
                                    <motion.div
                                      initial={{ opacity: 0, y: 5 }}
                                      animate={{ opacity: 1, y: 0 }}
                                      transition={{ delay: i * 0.045 }}
                                      className={"trace-step " + t.state}
                                      key={i}
                                    >
                                      <span className="trace-index">
                                        {String(i + 1).padStart(2, "0")}
                                      </span>
                                      <div>
                                        <strong>{t.title}</strong>
                                        <p>{t.detail}</p>
                                      </div>
                                      <span
                                        className="trace-state"
                                        aria-label={t.state}
                                      >
                                        {t.state === "ok" ? (
                                          <Check size={13} />
                                        ) : t.state === "held" ? (
                                          "Ⅱ"
                                        ) : (
                                          "×"
                                        )}
                                      </span>
                                    </motion.div>
                                  ))
                                ) : (
                                  <div className="empty-state">
                                    <Activity size={26} />
                                    <h3>Every request tells a story.</h3>
                                    <p>
                                      Run a scenario to inspect its routing,
                                      permission
                                      <br />
                                      checks, and outcome — step by step.
                                    </p>
                                  </div>
                                )}
                              </div>
                            </section>
                            <section className="panel response-panel">
                              <div className="panel-heading">
                                <div className="tabs" aria-label="Result views">
                                  {["Response", "Audit", "History"].map((t) => (
                                    <button
                                      className={
                                        inspector === t ? "active" : ""
                                      }
                                      key={t}
                                      onClick={() => setInspector(t)}
                                    >
                                      {t}
                                    </button>
                                  ))}
                                </div>
                                {run && (
                                  <span className="tag">HTTP {run.http}</span>
                                )}
                              </div>
                              <div className="inspector">
                                <div className="code-caption">
                                  <span>
                                    {inspector === "Response"
                                      ? "TOOL-LEVEL JSON PREVIEW"
                                      : inspector === "Audit"
                                        ? "LOCAL AUDIT SUMMARY"
                                        : "LAST 5 RUNS · THIS TAB ONLY"}
                                  </span>
                                  {run && (
                                    <button
                                      aria-label="Copy inspector JSON"
                                      onClick={async () => {
                                        try {
                                          await navigator.clipboard.writeText(
                                            json(
                                              inspector === "Response"
                                                ? run.response
                                                : inspector === "Audit"
                                                  ? run.audit
                                                  : history,
                                            ),
                                          );
                                          setCopied(true);
                                          setTimeout(
                                            () => setCopied(false),
                                            1500,
                                          );
                                        } catch {
                                          setError(
                                            "Clipboard unavailable. Select and copy the JSON manually.",
                                          );
                                        }
                                      }}
                                    >
                                      {copied ? (
                                        <Check size={13} />
                                      ) : (
                                        <Copy size={13} />
                                      )}
                                    </button>
                                  )}
                                </div>
                                <pre tabIndex={0}>
                                  {inspector === "History"
                                    ? json(history)
                                    : run
                                      ? json(
                                          inspector === "Response"
                                            ? run.response
                                            : run.audit,
                                        )
                                      : "// Awaiting your first request.\n// This is a simulation, not a live endpoint."}
                                </pre>
                              </div>
                            </section>
                          </div>
                          <section className="decision-grid">
                            <div>
                              <span className="kicker">
                                01 / ONE ENFORCEMENT PATH
                              </span>
                              <h3>Different clients. Same boundaries.</h3>
                              <p>
                                MCP and chat share routing, role checks, and
                                audit logic. Chat does not grant extra
                                privileges.
                              </p>
                            </div>
                            <div>
                              <span className="kicker">
                                02 / ERRORS ARE DATA
                              </span>
                              <h3>HTTP 200 isn’t the whole story.</h3>
                              <p>
                                Role denial is a JSON-RPC error; upstream
                                failure is an isError tool result. Inspect the
                                response, not just the transport.
                              </p>
                            </div>
                            <div>
                              <span className="kicker">
                                03 / A DELIBERATE TRADEOFF
                              </span>
                              <h3>State has a scaling cost.</h3>
                              <p>
                                The real MCP sessions live in memory. The
                                gateway uses one replica; this lab does not
                                reproduce cluster operations.
                              </p>
                            </div>
                          </section>
                        </>
                      ) : tab === 1 ? (
                        <>
                          <div className="two-labs">
                            <section className="panel">
                              <div className="panel-heading">
                                <span>
                                  <ShieldCheck size={16} /> Order lookup
                                  boundary
                                </span>
                                <span className="tag">FIXTURE REPLAY</span>
                              </div>
                              <div className="panel-content">
                                <h2>What reaches the model?</h2>
                                <p>
                                  Replay sanitized outputs generated by the
                                  actual Python order lookup tool. Names,
                                  addresses, email, and internal fields are
                                  never included in this bundle.
                                </p>
                                <label
                                  htmlFor="order-id"
                                  className="field-label"
                                >
                                  ORDER ID OR PHRASE
                                </label>
                                <input
                                  id="order-id"
                                  value={oid}
                                  onChange={(e) => {
                                    setOid(e.target.value);
                                    setLookup(null);
                                  }}
                                />
                                <div className="quick-picks">
                                  {[
                                    "ord-1004 ",
                                    "ORD-1010",
                                    "ORD-9999",
                                    "not-an-id",
                                  ].map((id) => (
                                    <button
                                      key={id}
                                      onClick={() => {
                                        setOid(id);
                                        setLookup(null);
                                      }}
                                    >
                                      {id.trim()}
                                    </button>
                                  ))}
                                </div>
                                <button
                                  className="primary button"
                                  onClick={orderLookup}
                                >
                                  <Play size={14} /> Inspect safe output
                                </button>
                                <p className="input-hint">
                                  Try “check ORD-1007 please”. Normalization
                                  runs locally; found orders replay precomputed
                                  Python results.
                                </p>
                              </div>
                            </section>
                            <section className="panel">
                              <div className="panel-heading">
                                <span>Customer-safe tool result</span>
                                <span className="tag">NO GENERATION</span>
                              </div>
                              <pre
                                className="fixture-code"
                                tabIndex={0}
                                aria-live="polite"
                              >
                                {lookup
                                  ? json(lookup)
                                  : "// Run a lookup to see the allow-listed result.\n// ORD-1004: cancelled, stale ETA suppressed.\n// ORD-1010: exception, human handoff required."}
                              </pre>
                            </section>
                          </div>
                          <section className="panel conflict-panel">
                            <div className="panel-heading">
                              <span>
                                <BookOpen size={16} /> Two official sources
                                disagree
                              </span>
                              <span className="tag">
                                CURATED SOURCE EXCERPTS
                              </span>
                            </div>
                            <div className="panel-content">
                              <h2>“Is my Breeze Tumbler dishwasher safe?”</h2>
                              <p>
                                The real retriever has an explicit registry for
                                this known conflict. It does not claim to detect
                                arbitrary contradictions.
                              </p>
                              <div className="two-labs">
                                <blockquote>
                                  <span>
                                    Product Care Guide · active / official
                                  </span>
                                  The stainless-steel body should be{" "}
                                  <strong>hand-washed</strong>. The lid may go
                                  on the top rack.
                                </blockquote>
                                <blockquote>
                                  <span>
                                    Product Information · active / official
                                  </span>
                                  The product card states that{" "}
                                  <strong>
                                    all components are dishwasher safe
                                  </strong>
                                  , with the top rack recommended.
                                </blockquote>
                              </div>
                              <button
                                className="button"
                                aria-expanded={conflict}
                                onClick={() => setConflict(!conflict)}
                              >
                                {conflict ? "Hide" : "Inspect"} conflict
                                handling <ChevronRight size={14} />
                              </button>
                              {conflict && (
                                <div className="reveal">
                                  <strong>
                                    Flag the disagreement. Don’t silently pick a
                                    winner.
                                  </strong>
                                  <p>
                                    Both documents meet the authority filter:
                                    active, official, customer-facing. The
                                    known-conflict registry supplies the
                                    relevant sections for the agent to
                                    acknowledge. This is a curated explanation,
                                    not a live retriever or generated agent
                                    answer.
                                  </p>
                                  <a
                                    href={
                                      base +
                                      repos[1] +
                                      "/blob/c0d6ea27fe04bf4c33d2111f6c7baed5e0b54e55/app/retriever.py"
                                    }
                                    target="_blank"
                                    rel="noreferrer"
                                  >
                                    Inspect the implementation{" "}
                                    <ArrowUpRight size={13} />
                                  </a>
                                </div>
                              )}
                            </div>
                          </section>
                          <div className="decision-grid">
                            <div>
                              <span className="kicker">RETRIEVAL</span>
                              <h3>Lexical + semantic.</h3>
                              <p>
                                TF-IDF and BGE sentence embeddings are fused
                                with reciprocal-rank fusion in the real project.
                                No embeddings are computed here.
                              </p>
                            </div>
                            <div>
                              <span className="kicker">AUTHORITY</span>
                              <h3>Relevance isn’t authority.</h3>
                              <p>
                                Only active, official, customer-facing chunks
                                can be cited as authoritative. Draft and
                                superseded material remain distinguishable.
                              </p>
                            </div>
                            <div>
                              <span className="kicker">TOOLS</span>
                              <h3>Rules before prose.</h3>
                              <p>
                                Cancelled and returned orders suppress stale ETA
                                fields in code. Exception states explicitly
                                require a human handoff.
                              </p>
                            </div>
                          </div>
                        </>
                      ) : (
                        <>
                          <div className="two-labs">
                            <section className="panel">
                              <div className="panel-heading">
                                <span>
                                  <FlaskConical size={16} /> Reply workbench
                                </span>
                                <span className="tag">DETERMINISTIC</span>
                              </div>
                              <div className="panel-content">
                                <label
                                  className="field-label"
                                  htmlFor="eval-case"
                                >
                                  SOURCE TEST CASE
                                </label>
                                <select
                                  id="eval-case"
                                  value={caseIndex}
                                  onChange={(e) => {
                                    setCaseIndex(Number(e.target.value));
                                    setGrade(null);
                                  }}
                                >
                                  {cases.map((c, i) => (
                                    <option value={i} key={c.id}>
                                      {c.id}
                                    </option>
                                  ))}
                                </select>
                                <div className="prompt-card">
                                  <span>SCRIPTED CUSTOMER</span>
                                  <p>{cases[caseIndex].input}</p>
                                </div>
                                <label className="field-label" htmlFor="reply">
                                  EDIT THE AGENT REPLY
                                </label>
                                <textarea
                                  id="reply"
                                  rows={5}
                                  value={reply}
                                  onChange={(e) => {
                                    setReply(e.target.value);
                                    setGrade(null);
                                  }}
                                />
                                <button
                                  className="primary button"
                                  onClick={() =>
                                    setGrade(
                                      gradeReply(cases[caseIndex], reply),
                                    )
                                  }
                                >
                                  <Play size={14} /> Run keyword check
                                </button>
                              </div>
                            </section>
                            <section className="panel">
                              <div className="panel-heading">
                                <span>Grader inspection</span>
                                <span
                                  className={
                                    "status " + (grade?.passed ? "success" : "")
                                  }
                                >
                                  {grade
                                    ? grade.passed
                                      ? "PASS"
                                      : "FAIL"
                                    : "Not evaluated"}
                                </span>
                              </div>
                              <div className="panel-content">
                                <h2>A passing check has limits.</h2>
                                <p>
                                  Matching is case-insensitive and normalizes
                                  curly quotes and dash variants. At least one
                                  required phrase must match; no forbidden
                                  phrase may appear.
                                </p>
                                <div className="rule-box">
                                  <span>MUST CONTAIN ANY</span>
                                  <code>
                                    {json(cases[caseIndex].must_contain)}
                                  </code>
                                  <span>MUST NOT CONTAIN</span>
                                  <code>
                                    {json(cases[caseIndex].must_not_contain)}
                                  </code>
                                </div>
                                {grade && (
                                  <div className="reveal" aria-live="polite">
                                    <strong>
                                      {grade.passed
                                        ? "Rule-based checks satisfied."
                                        : !grade.required
                                          ? "No required phrase matched."
                                          : `Forbidden phrase: ${grade.forbidden}`}
                                    </strong>
                                    <p>
                                      This is a keyword verdict, not a judgment
                                      of helpfulness or policy meaning.
                                    </p>
                                  </div>
                                )}
                              </div>
                            </section>
                          </div>
                          <section className="panel eval-note">
                            <div className="panel-content">
                              <div className="kicker">
                                TRY TO FOOL THE GRADER
                              </div>
                              <h2>
                                “Standard shipping does not take 5–7 days.”
                              </h2>
                              <p>
                                Paste this into normal_2. It passes the keyword
                                check despite denying the expected window. This
                                is why the real harness combines rules, gates,
                                calibrated LLM judges, and whole-conversation
                                evaluation.
                              </p>
                              <button
                                className="button"
                                onClick={() => {
                                  setCaseIndex(0);
                                  setReply(
                                    "Standard shipping does not take 5–7 days.",
                                  );
                                  setGrade(null);
                                }}
                              >
                                Load the counterexample <ArrowRight size={14} />
                              </button>
                              <p className="input-hint">
                                The source suite contains 24 cases. This lab
                                runs three single-turn rule-based cases only; it
                                does not simulate LLM judgments or report
                                fabricated model scores.
                              </p>
                            </div>
                          </section>
                        </>
                      )}
                    </>
                  )}
                </div>
                <div className="project-next">
                  <div>
                    <strong>{projectContext[tab].next}</strong>
                    <p>
                      Three systems. One question: where is reliability
                      enforced?
                    </p>
                  </div>
                  <button
                    className="button"
                    disabled={busy}
                    onClick={() => {
                      setTab((tab + 1) % 3);
                      showExperience("demo");
                      window.scrollTo(0, 0);
                    }}
                  >
                    Next lab: {projectContext[(tab + 1) % 3].name}{" "}
                    <ArrowRight size={14} />
                  </button>
                </div>
                <footer className="workspace-footer">
                  <span>
                    Built by{" "}
                    <button onClick={() => setProfile(true)}>
                      Aayushi Sinha
                    </button>{" "}
                    · Open the source. Question the tradeoffs.
                  </span>
                  <a
                    href="https://github.com/Sinna19/Portfolio/blob/feat/interactive-product-demos/docs/SOURCE_MAP.md"
                    target="_blank"
                    rel="noreferrer"
                  >
                    Simulation boundaries & source map{" "}
                    <ArrowUpRight size={12} />
                  </a>
                </footer>
              </>
            )}
          </main>
        </div>
      </div>
    </MotionConfig>
  );
}
