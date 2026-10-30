# Honey & Burgundy visual polish

Scope: styles and font loading only. Page content, sections, About biography, project data, routing, links, components, simulation logic and fixtures are unchanged. PR #4 was already merged, so this work starts from latest main on `feat/honey-burgundy-polish`.

## Palette and typography

- Main background: `#F8E5B2`; panels: `#FFF7E4`; primary burgundy: `#920C50`; main ink: `#432717`; secondary ink: `#765541`.
- Restrained golden borders/highlights and subtle existing grid retain the editorial composition. Dark navy/lime lab surfaces retain their existing colors.
- Fraunces normal/italic for editorial serif text, DM Sans for body/UI, JetBrains Mono for code/technical metadata.
- Four Latin WOFF2 variable files from Fontsource package version 5.3.0, about 156 KiB total actual bytes; OFL licenses retained alongside assets in `app/fonts/`.
- `next/font/local`, `display: swap`, standard CSS fallbacks. Only DM Sans is preloaded; editorial and code fonts load when used. No Google Fonts runtime/build dependency, package dependencies, or external font requests.
- Editorial body 17–18px; feature lists 16px; navigation/buttons 15px; metadata generally 12px. Hero and section titles use responsive clamp sizes. Essential lab controls, labels, scenario descriptions, traces and code are larger.
- No CSS zoom or transform scaling was added. Typography uses actual font sizes and line heights. Existing grid/card structure remains; controls wrap where needed to retain mobile usability.

## Verification

- `npm test`: 14/14 passed. `npm run build`, `npm run typecheck`, `git diff --check`: passed. No lint script is configured.
- Existing browser navigation, guided-demo, About disclosure (including keyboard and no-JavaScript), full lab scenarios, approve/decline, trace/audit/history, source/conflict and evaluation checks passed.
- Exact review sizes at unchanged browser zoom/device scale: 1440×900, 1366×768, 390×844. Screenshot browser scale reported 1.
- No horizontal document overflow across homepage and all three demo and implementation views at these sizes. Existing regressions also cover 320/768px narrow layouts.
- Four custom font faces reported loaded, all four font requests were local, and no unavailable synthetic fallback faces remain.
- Rendered text audit uses sRGB contrast against composited ancestor backgrounds: AA threshold 4.5:1 for normal text, 3:1 for large text. No findings remained on the homepage or six lab/demo implementation views. Gradient surfaces were visually reviewed as well; this is a focused visual audit, not a claim of full-site accessibility certification.
- Input borders and outlined editorial control boundaries were strengthened; visible focus styles, native controls and reduced-motion support remain.

## Before/after captures

All 24 captures are in [screenshots/honey-polish](screenshots/honey-polish). Each set includes hero, project modules, About and gateway lab at the exact requested sizes.

| Viewport | Before | After |
| --- | --- | --- |
| Desktop 1440×900 | [Hero](screenshots/honey-polish/before-desktop-hero.png) | [Hero](screenshots/honey-polish/after-desktop-hero.png) |
| Laptop 1366×768 | [Hero](screenshots/honey-polish/before-laptop-hero.png) | [Hero](screenshots/honey-polish/after-laptop-hero.png) |
| Mobile 390×844 | [Projects](screenshots/honey-polish/before-mobile-projects.png) | [Projects](screenshots/honey-polish/after-mobile-projects.png) |

The provided Lovable reference could not be opened through the available web tool. Comparison therefore uses the user's supplied visual direction and the captured existing portfolio; no claim is made to have visually inspected the inaccessible reference.

No merge, manual deployment, production change or Vercel configuration change is included. The existing GitHub/Vercel integration may create preview builds after the branch push.
