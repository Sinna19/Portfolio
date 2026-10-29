# Aayushi Sinha — Portfolio

A responsive developer portfolio built with Next.js App Router, TypeScript, Tailwind CSS v4, Framer Motion, and Lucide icons.

## Run locally

Requires Node.js 20.9 or later.

```sh
npm ci
npm run dev
```

Open http://localhost:3000. For production: `npm run build` then `npm start`. Run `npm run typecheck` for static checking.

## Content and interactions

- Project category filters and expandable implementation notes
- Responsive navigation, anchor navigation, accessible focus states and skip link
- Reduced-motion preference support
- Direct LinkedIn/GitHub links and clipboard action with success feedback
- Custom CSS architecture illustrations, rather than fabricated product screenshots
- No runtime API keys, tracking, or external font dependencies

Edit `lib/portfolio.ts` for project summaries, technical skills, and profile links. Edit `app/page.tsx` for About, education, and section copy. Styles and responsive layouts are in `app/globals.css`.

## Verified sources

Public GitHub profile and pinned repository READMEs reviewed on 2026-10-29:

- https://github.com/Sinna19
- https://github.com/Sinna19/Eval-Harness
- https://github.com/Sinna19/aster-row-agent
- https://github.com/Sinna19/MCP-Gateway-on-Kubernetes

Summaries describe repository implementations, not independent performance validation or employment. Skill labels reflect the public projects. Education is user-confirmed: B.Tech in Computer Science and Engineering, graduated June 2026. No university, grades, enrollment date, employer, location, job title, or years of experience are asserted.

## Before publication

The education section contains only the confirmed degree, field, and graduation month. University, grades, enrollment date, and coursework are omitted because they were not supplied. Add these, an email address, or a resume only when confirmed; contact currently uses the provided social profiles.

Changes are prepared on `feat/aayushi-portfolio`. Do not merge or deploy without owner approval.

## Verification

- `npm run build`: passed (optimized static routes, Webpack).
- `npm run typecheck`: passed.
- `npm audit --omit=dev --audit-level=high`: zero vulnerabilities at review time.
- Chromium production smoke check: HTTP 200; infrastructure filter returns one project; AI filter returns two; expandable notes work; mobile menu closes after navigation; no horizontal overflow at 390px; no browser runtime errors.

Webpack is explicitly selected because Turbopack's internal worker could not bind its local port in this environment.

## Final content review — 2026-10-29

- Replaced all visible education placeholders with the user-confirmed B.Tech in Computer Science and Engineering and June 2026 graduation. Unprovided university, grades, enrollment date, and coursework are omitted.
- Rechecked all three project READMEs. Updated Aster & Row to describe its current hybrid TF-IDF/BGE retrieval, reciprocal-rank fusion, and shared CLI/Streamlit agent logic. Other project summaries remain consistent with their READMEs.
- All five unique GitHub destinations returned HTTP 200. The supplied LinkedIn URL also appears on the GitHub profile, but LinkedIn blocks automated fetching with status 999, so its destination could not be independently loaded.
- No unfinished website placeholders or missing referenced assets found. Added a local SVG site icon; its generated route returns HTTP 200.
- Reran production build and TypeScript checks successfully. Chromium confirmed education content, internal anchor targets, expanded hybrid retrieval details, no failed local asset requests or runtime errors, and no horizontal overflow at 320px or 390px.
