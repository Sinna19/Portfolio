import { ArrowUpRight, Github, Layers3 } from "lucide-react";
import { projectContext } from "@/lib/project-context";
import { DeploymentActions } from "@/components/deployment-actions";
export function Implementation({
  index,
  onTry,
}: {
  index: number;
  onTry: () => void;
}) {
  const p = projectContext[index];
  const root = `https://github.com/Sinna19/${p.repo}`;
  return (
    <section className="implementation panel" aria-label="Real implementation">
      <div className="panel-heading">
        <span>
          <Layers3 size={16} /> {p.name} / real system
        </span>
        <span className="tag">SOURCE-VERIFIED</span>
      </div>
      <div className="panel-content">
        <div className="deployment-context">
          <span className="kicker">DEPLOYMENT STATUS</span>
          <h2>{p.status}</h2>
          <p>{p.deployment}</p>
        </div>
        <div className="implementation-grid">
          <div>
            <h3>Actual architecture</h3>
            <p className="input-hint">
              Logical components and paths from the source. Deployment links
              open public pages; no internal services or credentials are exposed.
            </p>
            <ol className="architecture-list">
              {p.architecture.map((s) => (
                <li key={s}>{s}</li>
              ))}
            </ol>
            <div className="stack-list">
              {p.stack.map((s) => (
                <span key={s}>{s}</span>
              ))}
            </div>
          </div>
          <div className="engineering-notes">
            <h3>Why it is built this way</h3>
            <p>{p.decision}</p>
            <h3>The hard part</h3>
            <p>{p.challenge}</p>
            <h3>The tradeoff</h3>
            <p>{p.tradeoff}</p>
          </div>
        </div>
        <div className="source-evidence">
          <div>
            <h3>Follow the implementation</h3>
            <p className="input-hint">
              Evidence pinned to reviewed commit {p.revision.slice(0, 8)}.
            </p>
          </div>
          {p.evidence.map(([path, label]) => (
            <a
              key={path}
              href={`${root}/blob/${p.revision}/${path}`}
              target="_blank"
              rel="noreferrer"
            >
              {label}
              <ArrowUpRight size={13} />
            </a>
          ))}
        </div>
        <div className="boundary-note">
          <strong>How the demo relates to this system</strong>
          <p>{p.boundary}</p>
        </div>
        <div className="button-row">
          <button className="button primary" onClick={onTry}>
            Try the Interactive Demo
          </button>
          <DeploymentActions index={index} className="button" />
          <a className="button" href={root} target="_blank" rel="noreferrer">
            <Github size={15} /> Open GitHub repository{" "}
            <ArrowUpRight size={13} />
          </a>
        </div>
      </div>
    </section>
  );
}
