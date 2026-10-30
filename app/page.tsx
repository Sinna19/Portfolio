import Link from "next/link";
import {
  ArrowUpRight,
  ArrowRight,
  Github,
  Linkedin,
  Network,
  ShieldCheck,
  BookOpen,
  FlaskConical,
  Terminal,
  Check,
  GitBranch,
} from "lucide-react";
import GuidedDemo from "@/components/guided-demo";
import AboutSection from "@/components/about-section";
import { projectContext } from "@/lib/project-context";
import { labHref } from "@/lib/lab-routes";
import "./showcase.css";
const products = [
  {
    name: "MCP Gateway",
    label: "01 / AGENT INFRASTRUCTURE",
    line: "One front door. Clear boundaries.",
    problem:
      "When agents use tools across services, identity, permissions, and failure handling need a consistent home.",
    built:
      "A team MCP gateway that routes tool calls, enforces role rules, and records outcomes through one shared path.",
    capabilities: [
      "Namespaced tool routing",
      "Role-aware access & audit",
      "Chat write confirmation",
    ],
    note: "A revoked key must stop working even inside an open session. Authentication is checked on every request.",
    status: "Deployed on k3s · Azure VM",
    demo: "The lab is a simulation; it never connects to the VM.",
    tech: ["TypeScript", "MCP", "Kubernetes", "Helm"],
  },
  {
    name: "Aster & Row",
    label: "02 / GROUNDED SUPPORT",
    line: "Useful answers need reliable foundations.",
    problem:
      "Support agents can invent order details, trust outdated policy, or lose important context between turns.",
    built:
      "A Python support agent with hybrid retrieval, explicit source authority, safe order tools, and a Streamlit interface.",
    capabilities: [
      "Hybrid lexical + semantic retrieval",
      "Customer-safe order lookup",
      "Known source-conflict handling",
    ],
    note: "Two official documents can disagree. An explicit conflict registry flags the relevant sections rather than silently picking a winner.",
    status: "Streamlit app · public URL unverified",
    demo: "Explore safe fixtures here; no live model is called.",
    tech: ["Python", "Streamlit", "RAG", "scikit-learn"],
  },
  {
    name: "Eval Harness",
    label: "03 / AI RELIABILITY",
    line: "A green check is the start of a question.",
    problem:
      "A plausible final answer can hide policy violations or contradictions earlier in a conversation.",
    built:
      "A policy-bound support-agent evaluation suite combining deterministic checks, model judges, and whole-conversation evaluation.",
    capabilities: [
      "Single- and multi-turn cases",
      "Rules, gates & model judges",
      "Baseline regression & stability checks",
    ],
    note: "A keyword grader can pass a sentence that denies the expected policy. The real harness needs several forms of evidence.",
    status: "Not deployed · source code available",
    demo: "The local simulator runs the keyword-check algorithm.",
    tech: ["Python", "LLM evaluation", "Groq", "Testing"],
  },
];
function ProductVisual({ index }: { index: number }) {
  return (
    <div
      className={"product-visual visual-" + index}
      aria-label={
        [
          "Illustration of a role-aware tool route",
          "Illustration of source authority and a safe order tool",
          "Illustration of keyword grading limitations",
        ][index]
      }
    >
      {index === 0 ? (
        <>
          <div className="visual-meta">
            <span>REQUEST / PERMISSION BOUNDARY</span>
            <ShieldCheck size={16} />
          </div>
          <div className="route-illustration">
            <span>
              <Terminal size={20} />
              MCP client
            </span>
            <i>→</i>
            <span className="route-center">
              <Network size={28} />
              Gateway<small>identity · role · route</small>
            </span>
            <i>→</i>
            <span>
              <BookOpen size={20} />
              Store tools
            </span>
          </div>
          <div className="visual-note">
            <span className="rose-dot" /> MEMBER → CREATE PRODUCT <b>Denied</b>
          </div>
        </>
      ) : index === 1 ? (
        <>
          <div className="visual-meta">
            <span>CONTEXT / AUTHORITY / ACTION</span>
            <BookOpen size={16} />
          </div>
          <div className="source-sheet">
            <span>01 / OFFICIAL POLICY</span>
            <p>
              Relevance is a signal.
              <br />
              <em>Authority is a separate check.</em>
            </p>
            <div>
              <Check size={13} /> Active · official · customer-facing
            </div>
          </div>
          <div className="safe-output">
            <ShieldCheck size={15} />
            <span>
              order_lookup <small>safe fields only</small>
            </span>
          </div>
        </>
      ) : (
        <>
          <div className="visual-meta">
            <span>EVALUATION / LOOK PAST THE SCORE</span>
            <FlaskConical size={16} />
          </div>
          <div className="eval-illustration">
            <span>RULE-BASED CHECK</span>
            <blockquote>
              “Standard shipping does <em>not</em>
              <br /> take 5–7 days.”
            </blockquote>
            <div>
              <b>PASS</b>
              <span>
                Keyword matched.
                <br />
                Meaning missed.
              </span>
            </div>
          </div>
        </>
      )}
      <div className="illustration-caption">
        CONCEPTUAL VIEW · EXPLORE THE WORKING SIMULATION BELOW
      </div>
    </div>
  );
}
export default function Home() {
  return (
    <div className="editorial">
      <a className="ed-skip" href="#content">
        Skip to content
      </a>
      <header className="ed-header">
        <Link href="/" className="ed-brand">
          <span>
            as<span>✷</span>
          </span>
          <div>
            Aayushi Sinha<small>ENGINEER & BUILDER</small>
          </div>
        </Link>
        <nav aria-label="Portfolio navigation">
          <a href="#projects">Projects</a>
          <Link href="/labs/mcp-gateway">
            Engineering Labs <ArrowUpRight size={12} />
          </Link>
          <a href="#about">About</a>
          <a href="#contact">Contact</a>
        </nav>
        <a
          href="https://github.com/Sinna19"
          className="header-github"
          target="_blank"
          rel="noreferrer"
          aria-label="Aayushi on GitHub"
        >
          <Github size={18} />
        </a>
      </header>
      <main id="content" className="showcase-main" tabIndex={-1}>
        <section className="ed-hero">
          <div className="hero-intro">
            <div className="ed-kicker">
              <span className="rose-dot" /> AAYUSHI SINHA / EARLY-CAREER
              ENGINEER
            </div>
            <h1>
              Building AI systems
              <br />
              that work{" "}
              <em>
                beyond
                <br />
                the demo.
              </em>
            </h1>
            <p>
              I build at the intersection of AI, agent infrastructure, and
              reliable software. I’m interested in what happens after a system’s
              first good answer — when tools fail, policies conflict, and real
              engineering begins.
            </p>
            <div className="ed-actions">
              <a className="ed-button filled" href="#projects">
                Explore My Work <ArrowDownIcon />
              </a>
              <Link className="ed-button" href="/labs/mcp-gateway">
                Enter the Engineering Lab <ArrowUpRight size={15} />
              </Link>
            </div>
            <div className="hero-socials">
              <a
                href="https://github.com/Sinna19"
                target="_blank"
                rel="noreferrer"
              >
                <Github size={14} /> GitHub <ArrowUpRight size={11} />
              </a>
              <a
                href="https://www.linkedin.com/in/aayushi-sinha-43b0a0281/"
                target="_blank"
                rel="noreferrer"
              >
                <Linkedin size={14} /> LinkedIn <ArrowUpRight size={11} />
              </a>
              <span>B.Tech · Computer Science & Engineering</span>
            </div>
          </div>
          <div className="hero-art">
            <div className="field-label-ed">FIELD NOTES / HOW I BUILD</div>
            <div className="hero-orbit">
              <div className="orbit-center">
                <span>as</span>
                <small>BUILD · QUESTION · REFINE</small>
              </div>
              <div className="orbit-tag tag-build">
                <Network size={16} /> Infrastructure
              </div>
              <div className="orbit-tag tag-test">
                <FlaskConical size={16} /> Evaluation
              </div>
              <div className="orbit-tag tag-ground">
                <BookOpen size={16} /> Applied AI
              </div>
            </div>
            <div className="field-note">
              <span>THE INTERESTING PART</span>
              <p>
                Not just what a system can do.
                <br />
                <em>What happens when it can’t.</em>
              </p>
            </div>
            <div className="field-footer">
              <span>PROTOTYPE → DEBUG → DEPLOY</span>
              <GitBranch size={14} />
            </div>
          </div>
        </section>
        <div className="ed-index">
          <span>SELECTED WORK / THREE SYSTEMS, OPEN TO EXPLORATION</span>
          <a href="#projects">SCROLL TO EXPLORE ↓</a>
        </div>
        <section id="projects" className="ed-section">
          <div className="ed-section-title">
            <div>
              <div className="ed-kicker">
                THE WORK / UNDERSTAND · EXPERIENCE · INVESTIGATE
              </div>
              <h2>Built to be explored.</h2>
            </div>
            <p>
              A short introduction, a small experiment,
              <br />
              and the engineering underneath.
            </p>
          </div>
          {products.map((p, i) => (
            <article
              className="product-module"
              key={p.name}
              id={["mcp-gateway", "aster-row", "eval-harness"][i]}
            >
              <div className="product-overview">
                <div className="ed-kicker">{p.label}</div>
                <h3>{p.name}</h3>
                <h4>{p.line}</h4>
                <p>{p.problem}</p>
                <p>{p.built}</p>
                <ul>
                  {p.capabilities.map((c) => (
                    <li key={c}>
                      <Check size={13} />
                      {c}
                    </li>
                  ))}
                </ul>
                <div className="product-tech">
                  {p.tech.map((t) => (
                    <span key={t}>{t}</span>
                  ))}
                </div>
                <div className="product-status">
                  <span className="rose-dot" />
                  <strong>{p.status}</strong>
                  <p>{p.demo}</p>
                </div>
                <div className="ed-actions">
                  <Link className="ed-button filled" href={labHref(i)}>
                    Try Interactive Demo <ArrowUpRight size={14} />
                  </Link>
                  <Link
                    className="ed-button"
                    href={labHref(i, "implementation")}
                  >
                    Explore Real Implementation <ArrowRight size={14} />
                  </Link>
                </div>
                <a
                  className="ed-source"
                  href={"https://github.com/Sinna19/" + projectContext[i].repo}
                  target="_blank"
                  rel="noreferrer"
                >
                  <Github size={13} /> Source on GitHub{" "}
                  <ArrowUpRight size={12} />
                </a>
              </div>
              <div className="product-experience">
                <ProductVisual index={i} />
                <div className="engineering-detail">
                  <span>01 / UNDERSTAND · THE ENGINEERING CHALLENGE</span>
                  <p>{p.note}</p>
                </div>
                <GuidedDemo index={i} />
              </div>
            </article>
          ))}
        </section>
        <section className="lab-invitation">
          <div>
            <div className="ed-kicker">GO A LEVEL DEEPER</div>
            <h2>
              Welcome to the
              <br />
              <em>other side of the interface.</em>
            </h2>
            <p>
              Requests you can edit. Traces you can follow. Failure modes you
              can inspect. The dark workspace keeps the technical details within
              reach.
            </p>
          </div>
          <div className="lab-door">
            <div>
              <Terminal size={18} />
              <span>ENGINEERING LABS</span>
              <span className="lime-dot" />
            </div>
            {products.map((p, i) => (
              <Link key={p.name} href={labHref(i)}>
                <span>0{i + 1}</span>
                {p.name}
                <ArrowUpRight size={16} />
              </Link>
            ))}
            <p>Browser-only simulations · no credentials required</p>
          </div>
        </section>
        <AboutSection />
        <section className="ed-notes ed-section">
          <div className="ed-section-title">
            <div>
              <div className="ed-kicker">
                ENGINEERING NOTES / LESSONS FROM THE SOURCE
              </div>
              <h2>The useful things I learned.</h2>
            </div>
          </div>
          <div className="notes-grid">
            <div>
              <span>01 / INFRASTRUCTURE</span>
              <h3>
                Put the boundary
                <br />
                in one place.
              </h3>
              <p>
                Chat and MCP share the gateway’s routing, role checks, and audit
                path. Different interfaces should not quietly grant different
                privileges.
              </p>
              <Link href={labHref(0, "implementation")}>
                Trace the decision <ArrowUpRight size={14} />
              </Link>
            </div>
            <div>
              <span>02 / GROUNDING</span>
              <h3>
                Relevant doesn’t
                <br />
                mean authoritative.
              </h3>
              <p>
                A retrieved document may be outdated or conflict with another
                official source. The agent needs context about the source, not
                just a similarity score.
              </p>
              <Link href={labHref(1, "implementation")}>
                Inspect the sources <ArrowUpRight size={14} />
              </Link>
            </div>
            <div>
              <span>03 / EVALUATION</span>
              <h3>
                Test the grader,
                <br />
                too.
              </h3>
              <p>
                Keyword matches and model judgments can both miss violations.
                Calibration, regression, and reading the failures matter more
                than a green score alone.
              </p>
              <Link href={labHref(2, "implementation")}>
                Explore the limitation <ArrowUpRight size={14} />
              </Link>
            </div>
          </div>
        </section>
        <section id="contact" className="ed-contact">
          <div className="ed-kicker">LET’S BUILD SOMETHING USEFUL</div>
          <h2>
            Good engineering starts
            <br />
            with a <em>conversation.</em>
          </h2>
          <p>
            Interested in AI systems, agent infrastructure, or a problem that
            needs a thoughtful builder? You can find me here.
          </p>
          <div className="ed-actions">
            <a
              className="ed-button filled"
              href="https://www.linkedin.com/in/aayushi-sinha-43b0a0281/"
              target="_blank"
              rel="noreferrer"
            >
              <Linkedin size={16} /> Connect on LinkedIn{" "}
              <ArrowUpRight size={14} />
            </a>
            <a
              className="ed-button"
              href="https://github.com/Sinna19"
              target="_blank"
              rel="noreferrer"
            >
              <Github size={16} /> Explore GitHub <ArrowUpRight size={14} />
            </a>
          </div>
          <span className="contact-flower" aria-hidden="true">
            ✷
          </span>
        </section>
      </main>
      <footer className="ed-footer">
        <span>
          Aayushi Sinha <small>ENGINEERING, WITH INTENT.</small>
        </span>
        <a href="#content">Back to top ↑</a>
        <Link href="/labs/mcp-gateway">
          Enter the lab <ArrowUpRight size={12} />
        </Link>
      </footer>
    </div>
  );
}
function ArrowDownIcon() {
  return <span aria-hidden="true">↓</span>;
}
