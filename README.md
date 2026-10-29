# Aayushi Sinha — Engineering Playground

A product-style console for exploring three actual engineering projects. Built with Next.js, TypeScript, Tailwind CSS, Framer Motion and Lucide. The MCP Gateway lab is the primary workspace, with Aster & Row and Eval Harness labs alongside it. Personal background and links live in the “The engineer behind it” view.

## Run

Requires Node.js 24+ for the built-in TypeScript test runner (Next.js itself supports Node 20.9+).

```sh
npm ci
npm run dev
npm test
npm run typecheck
npm run build
```

Open http://localhost:3000. `npm start` serves the production build. Webpack is explicitly selected because Turbopack worker port binding failed in this environment.

## What is interactive?

- **MCP Gateway:** five scenario presets; editable JSON, tool, role, channel, key state and upstream status; run and inspect routing, role denial, upstream errors, revoked credentials, chat write approval/decline; clickable architecture nodes; response/audit/history inspector and copying.
- **Aster & Row:** order ID normalization, replay of sanitized actual Python outputs, stale ETA and handoff inspection, source conflict explorer.
- **Eval Harness:** editable responses, three actual source cases, browser execution of the ported keyword grader, and a counterexample that demonstrates its limitations.

**No project backend is connected.** Gateway results use fictional local data. Order responses replay sanitized fixtures. Evaluation runs deterministic JavaScript; it does not call a model. No credentials, external fonts, analytics, accounts, remote writes, or project infrastructure are required. [Read exact simulation boundaries and pinned implementation sources](docs/SOURCE_MAP.md).

Education is user-confirmed: B.Tech in Computer Science and Engineering, graduated June 2026. University, grades, and additional dates are omitted.

## Review

Branch: `feat/interactive-product-demos`. No merge or production deployment without owner approval.

Screenshots are in [docs/screenshots](docs/screenshots). Tests are in `tests/demo.test.mjs`; fixture data and pure model logic are in `lib/`. UI is in `app/page.tsx` and styles in `app/globals.css`.

## Project context and guided exploration

Each project offers **Try the Interactive Demo** and **Explore the Real Implementation** in the same workspace. Three-step onboarding and next-project navigation provide a short guided tour. Implementation views include pinned source links, real architecture and stack, engineering decisions, challenges, tradeoffs, and deployment status.

- Gateway: real deployment is k3s on an Azure VM; the portfolio is an isolated simulation with no infrastructure links.
- Aster & Row: actual application uses Streamlit; no public URL could be verified, so no hosted-app link is shown.
- Eval Harness: not deployed; real implementation available as source, with its simulation running locally in the portfolio.
