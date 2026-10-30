# Aayushi Sinha — editorial showcase + engineering labs

A warm editorial portfolio introduces Aayushi and three engineering projects, with short guided browser interactions and complete dark technical workspaces a level deeper. Built with Next.js, TypeScript, Tailwind CSS, Framer Motion and Lucide. No new dependencies were added for the editorial redesign.

## Run and verify

Requires Node.js 24+ for the built-in TypeScript behavior test runner (Next.js supports 20.9+).

```sh
npm ci
npm run dev
npm test
npm run typecheck
npm run build
```

Open http://localhost:3000. `npm start` serves the production build. No lint script is configured. Webpack is explicitly selected because Turbopack worker port binding failed in this environment.

## Visitor journey

- `/`: editorial introduction, three product modules, guided experiments, About, engineering notes, and GitHub/LinkedIn contact links.
- `/labs/mcp-gateway`, `/labs/aster-row`, `/labs/eval-harness`: complete existing technical simulations, accessible directly and through the showcase.
- Add `?view=implementation` to a lab URL to open its architecture, stack, tradeoffs and pinned source evidence. Navigation supports reload and browser back/forward.
- `/labs`: redirects to the MCP Gateway lab. Unknown project slugs return 404.

The guided experiences reuse the existing simulation engine, sanitized Python-generated order fixtures, and keyword grader. The full labs preserve all five gateway scenarios, editable JSON, roles, credential/upstream controls, architecture inspection, trace, response/audit/history, write approval/decline, order fixtures and source conflict, evaluator cases/counterexample, and reset paths.

## Execution boundaries

**No project backend is connected.** Gateway data is fictional local demo data, order results replay safe fixtures, and evaluation executes deterministic JavaScript rather than model calls. The Next.js server renders routes and serves application assets only. It does not connect to project infrastructure.

- Gateway: actual deployment is k3s on an Azure VM. Owner-provided public links open the storefront and a separate login-required application. They do not connect the simulation to the gateway; no credentials or internal-service links are included.
- Aster & Row: Launch Live App opens the owner-provided public Streamlit deployment, separate from the browser simulation.
- Eval Harness: not deployed; source code available, with a browser simulation in the portfolio.

[Source snapshots, evidence, and exact simulation boundaries](docs/SOURCE_MAP.md). No invented metrics, employment, rankings, grades, institution, or extra dates. Education is user-confirmed: B.Tech in Computer Science and Engineering, graduated June 2026.

Recruiter contact update (October 30, 2026): About provides view/download actions for `/AayushiSinha_Resume.pdf` and links directly to the keyboard-focusable Contact section. The owner-uploaded PDF was moved unchanged from the repository root into `public/`. Contact includes the approved public email `sinhaaayushi19@gmail.com` and location Mumbai, India, alongside the existing GitHub and LinkedIn links. The relative PDF URL will resolve at `https://aayushisinha.vercel.app/AayushiSinha_Resume.pdf` after publication. Direct LinkedIn access was blocked by this environment's proxy in the previous verification, so live availability remains unverified.

## Structure

- `app/page.tsx`, `app/showcase.css`: editorial server-rendered homepage and scoped light theme.
- `components/guided-demo.tsx`: approachable guided interactions reusing the source-grounded model.
- `components/engineering-lab.tsx`: preserved full client workspace, with URL-based project/view navigation.
- `components/deployment-actions.tsx`: shared external deployment actions with visible login requirements and new-tab announcements.
- `lib/demo.ts`, `lib/*-fixtures.json`: simulation engine and sanitized fixture data.
- `lib/lab-routes.ts`: project URL mapping, covered by behavior tests.
- `tests/demo.test.mjs`: original behavior tests plus route mapping coverage.
- `docs/screenshots/`: actual local desktop/mobile captures for review.

Deployment-link and audit fixes are on `feat/deployment-links-audit-fixes`, based on the latest merged `main`. Review through the focused PR and existing Vercel preview integration; do not merge or change production without owner approval.

## Browser navigation regression

`tests/navigation.browser.cjs` covers guided success/failure/reset, project-to-lab links, direct entry/reload, back/forward, return to showcase, narrow layouts, and keyboard skip-link focus. Run with a local production server on port 3000 and an existing Playwright/Chromium installation:

```sh
# PLAYWRIGHT_MODULE may be a module name or absolute path to your installed package.
PLAYWRIGHT_MODULE=playwright CHROMIUM_PATH=/path/to/chromium node tests/navigation.browser.cjs
```

Browser tooling is optional and is not added to production dependencies. The script captures screenshots in `docs/screenshots/`.

`tests/deployment-audit.browser.cjs` additionally covers the deployment links in
both views, keyboard new-tab navigation, optional argument validation, offline
chat writes, approval/decline, selected-state semantics, and both complete reset
paths. It checks all project views at 320, 390, 768, 1366, and 1440px widths.
Run it with the same environment variables as the navigation suite. External
navigation is stubbed, so these checks do not assert live deployment availability.
All three supplied deployment URLs were blocked by this environment's outbound
network policy during independent checks; availability remains unverified.
