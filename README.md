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

Summaries describe repository implementations, not independent performance validation or employment. Skill labels reflect the public projects. No employer, degree, institution, location, job title, or years of experience are asserted.

## Before publication

Replace the clearly bracketed education placeholders with confirmed institution, degree, dates, and coursework. Review the About wording and project summaries. Add an email address or resume only when supplied; contact currently uses the provided social profiles.

Changes are prepared on `feat/aayushi-portfolio`. Do not merge or deploy without owner approval.

## Verification

- `npm run build`: passed (optimized static routes, Webpack).
- `npm run typecheck`: passed.
- `npm audit --omit=dev --audit-level=high`: zero vulnerabilities at review time.
- Chromium production smoke check: HTTP 200; infrastructure filter returns one project; AI filter returns two; expandable notes work; mobile menu closes after navigation; no horizontal overflow at 390px; no browser runtime errors.

Webpack is explicitly selected because Turbopack's internal worker could not bind its local port in this environment.
