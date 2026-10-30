import { ArrowRight } from "lucide-react";

export default function AboutSection() {
  return (
    <section
      id="about"
      className="ed-section ed-about"
      aria-labelledby="about-heading"
    >
      <div className="about-heading">
        <div className="ed-kicker">THE PERSON BEHIND THE PROJECTS</div>
        <h2 id="about-heading">
          A little
          <br />
          <em>about me.</em>
        </h2>
        <div className="ed-signature">Aayushi Sinha</div>
        <a className="ed-source" href="#contact">
          Get in touch <ArrowRight size={14} aria-hidden="true" />
        </a>
      </div>
      <div className="about-story">
        <p>
          I’m Aayushi, a computer science graduate who likes figuring out how
          things work — and then figuring out how to make them work outside a
          development environment.
        </p>
        <p>
          My interests sit at the intersection of AI engineering,
          infrastructure, and building software that can handle the messy parts
          of the real world. I’m especially drawn to the engineering that
          happens after a prototype works: deployment, integrations,
          reliability, evaluation, and understanding what happens when something
          breaks.
        </p>
        <details className="about-more">
          <summary>
            <span className="about-read-more">Read more</span>
            <span className="about-read-less">Read less</span>
            <span className="about-disclosure-mark" aria-hidden="true">
              +
            </span>
          </summary>
          <div className="about-continuation">
            <p>
              I’ve spent my time building projects that push me into those
              problems. From deploying an MCP Gateway on Kubernetes to exploring
              grounded AI support systems and LLM evaluation, I’m interested in
              more than getting something to run once. I want to understand the
              decisions, trade-offs, and failure modes behind it.
            </p>
            <p>
              What excites me about forward-deployed engineering is the
              combination of technical depth and real-world problem-solving —
              understanding what someone needs, building something useful, and
              staying involved long enough to make it work.
            </p>
            <p>
              I’m early in my career, still learning a lot, and looking for
              opportunities where I can build, ship, debug, and take ownership
              of meaningful engineering work.
            </p>
          </div>
        </details>
        <div className="education-note">
          <span>EDUCATION</span>
          <strong>B.Tech in Computer Science and Engineering</strong>
          <p>
            Graduated <time dateTime="2026-06">June 2026</time>
          </p>
        </div>
      </div>
      <aside className="about-companion" aria-label="Interests and approach">
        <div>
          <h3>CURRENTLY EXPLORING</h3>
          <p>
            AI agents · LLM evaluation · Kubernetes · Reliable AI systems ·
            Forward-deployed engineering
          </p>
        </div>
        <div>
          <h3>MY APPROACH</h3>
          <p className="about-approach">
            Build it. Break it.
            <br />
            Understand it. Improve it.
          </p>
        </div>
      </aside>
    </section>
  );
}
