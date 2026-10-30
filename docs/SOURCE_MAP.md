# Source-grounded interactive labs

## October 30, 2026 — deployment links and audit corrections

This update supersedes the earlier deployment-link observations below. The owner
supplied three public destinations, now declared only in
`lib/project-context.ts` and rendered as external anchors by
`components/deployment-actions.tsx`:

- Gateway: **Visit Live Store** opens the public storefront; **Open Deployed App ·
  Login required** opens the separate application's login page. Anonymous access
  to authenticated features is not promised.
- Aster & Row: **Launch Live App** opens the real public Streamlit application.
- Eval Harness remains source-only, with no live-app action.

These pages are distinct from the portfolio simulations. No iframe, API call,
credentials, login bypass, or backend integration was added. Only owner-supplied
public pages are linked; no internal-service addresses are added. Independent
HEAD checks of all three URLs were blocked by the environment proxy with CONNECT
403, before reaching the destinations. Live availability and login behavior
remain unverified. Browser link tests stub external navigation and verify the
destination, new tab, visible login requirement, and keyboard activation only.

The gateway source HEAD was rechecked and still matches the pinned `53e43cdd`
snapshot documented below:

- `services/woo-mcp/src/tools.ts:64–84`: `sku` and `description` are optional
  strings; `status` is a string enum with a publish default. The local model now
  rejects incorrect optional-field types, including an array coerced to a valid
  status. Accepted product responses still omit description, like `trimProduct`.
- `services/gateway/src/upstreams.ts:151–166` and
  `services/gateway/src/chat/agent.ts:147–186`: already-offline upstreams are
  excluded from discovery. A manually supplied proposal for an undiscovered name
  follows the error/audit path instead of entering confirmation. No model call is
  simulated. A previously held write can still fail if approved after an outage;
  declining a held write only records a decline.
- Both gateway reset controls now restore the initial scenario, arguments,
  options, empty results/history, Response inspector, Gateway architecture
  selection, and copy indicator. Scenario, inspector, and database-node buttons
  expose their selected state with `aria-pressed`, preserving native keyboard
  behavior and the existing visual classes.

Regression coverage lives in `tests/demo.test.mjs` and
`tests/deployment-audit.browser.cjs`. The existing navigation suite is retained.
Validation: 18 behavior tests, standalone TypeScript, and the production build
passed. Chromium passed the existing navigation suite and the new desktop/mobile
regressions, including all seven page/view combinations at 320, 390, 768, 1366,
and 1440px with no horizontal overflow. Link navigation was stubbed; no live
backend requests or changes to external applications were made.
No fixture data, other-project simulation logic, font, color token, or Vercel
configuration was changed. One scoped flex-wrap rule accommodates the additional
deployment actions without overflowing the implementation view.

---

Reviewed October 29, 2026. These are educational browser-local demonstrations, not a live connection to any project backend. No credentials are requested, and no request reaches a cluster, WooCommerce, PostgreSQL, Groq, or a model. No API routes or backend services were added. The Next.js server serves the application and its static resources only.

## MCP Gateway (primary lab)

Source snapshot: [53e43cdd](https://github.com/Sinna19/MCP-Gateway-on-Kubernetes/tree/53e43cdd9006eb9e634873a4e537da4c19deb85f).

| Console behavior                                                            | Source                                                                                      |
| --------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------- |
| Bearer authentication on every /mcp request, immediate revoked-key failure  | `services/gateway/src/mcp-endpoint.ts`                                                      |
| Split `<slug>__<tool>`, re-read role restrictions, route and audit          | `services/gateway/src/gateway.ts`, `tool-names.ts`                                          |
| Member write restrictions used by presets                                   | `scripts/register-upstreams.sh` marks `create_product` and `update_order_status` admin-only |
| Unreachable upstream becomes isError, role denial is JSON-RPC InvalidParams | `services/gateway/src/gateway.ts`, `upstreams.ts`                                           |
| Tool schemas and trimmed product response shape                             | `services/woo-mcp/src/tools.ts`                                                             |
| Chat confirmation, approve/decline, shared call path                        | `services/gateway/src/chat/agent.ts`, `pending.ts`                                          |
| Session state in memory, single replica                                     | `services/gateway/src/mcp-endpoint.ts`, ADR 006                                             |

The simulation implements a **subset**, not the actual gateway code: `woo__list_products` and `woo__create_product`, role selection, key validity, upstream availability, and held chat writes. JSON arguments are editable. The fictional two-product catalog supports search/pagination. Create returns fictional data and never persists a product; its permalink uses `example.invalid` intentionally and is only shown inside JSON, never linked.

MCP assumes an initialized session. Chat starts at an assumed LLM tool proposal with a valid dashboard session; the key setting is disabled because chat does not use MCP bearer-key authentication. Response inspector shows a simplified tool-level preview, not the full chat API wire response. Transport, SDK schema-validation wording, and pending call IDs are simplified. The same HTTP 200 label can contain success, a JSON-RPC permission error, or an MCP tool error; HTTP 401 is modeled before routing.

The visual path is illustrative, not a literal Kubernetes network topology. Trace steps appear after local computation, with a small presentation delay; no measured latency is claimed. PostgreSQL is an explanation node, not a live database. Audit is a reduced summary; it does not implement the real redaction algorithm, durations, retention, role database queries, or actual storage. History lasts only in React memory (five summaries), and resets on reload. This lab excludes key creation, session handshake, rate limits, upstream discovery, timeouts, SSRF defenses, real chat generation, and real deployment operations.

## Aster & Row

Source snapshot: [c0d6ea27](https://github.com/Sinna19/aster-row-agent/tree/c0d6ea27fe04bf4c33d2111f6c7baed5e0b54e55).

`lib/order-fixtures.json` was generated by executing `OrderLookupTool.lookup(...).to_safe_dict()` from `app/tools/order_lookup.py` for the source `data/orders.json`. Only customer-safe outputs are shipped. Customer records/internal fields were not copied to the application. `normalizeOrderId` is a TypeScript port of the original normalization/recovery behavior; malformed/not-found paths are locally reconstructed. This is fixture replay, not a Python runtime or database connection.

The source tool suppresses stale shipped/delivered/estimated dates for cancelled/returned orders, and marks exception states for handoff. The conflict explorer uses curated excerpts from `knowledge-base/11-product-care.md` and `12-breeze-tumbler-product-card.md`. Authority filtering and the explicit known-conflict registry are documented in `app/retriever.py`. No retrieval ranking, semantic embeddings, policy generation, or model calls execute here. Hybrid retrieval is described, not simulated with fabricated scores.

## Eval Harness

Source snapshot: [461d80d1](https://github.com/Sinna19/Eval-Harness/tree/461d80d164efb26939d96e712d7386b69956642c).

Three source cases (`normal_2`, `normal_3`, `edge_final_sale`) were extracted from `test_cases.py`. `gradeReply` ports `scoring.py`'s `rule_based_check` and dash/quote normalization: any required substring is enough, and every forbidden substring must be absent. The browser actually executes this deterministic logic locally. The verdict is not a model score. The counterexample illustrates the original check's inability to reason about negation. Real whole-conversation judges, regex gates, calibration, regression and stability runs are explained but not executed. No fabricated model metrics are displayed.

## Verification and screenshots

- `npm test`: behavioral tests for routing boundaries, chat confirmation, validation, filtering, fixture privacy, normalization, and keyword-grader limitations.
- `npm run build` and `npm run typecheck`.
- Browser checks cover presets, editable arguments, error handling, approval/decline, fixture replay, conflict explanation, evaluator counterexample, profile, responsive overflow, and local assets.
- Screenshots in `docs/screenshots/` show the actual local application. No production deployment.

### Results for this revision

- 12/12 behavior tests passed.
- Production build and standalone TypeScript check passed.
- Chromium passed all five gateway presets, approve and decline paths, malformed JSON handling, argument-driven filtering, node inspection, order privacy/ETA/handoff outputs, conflict reveal, evaluator pass/fail and counterexample, and the engineer view.
- No document overflow at 320, 390, or 768 pixels across all three labs. Keyboard focus is reachable; native inputs and buttons have labels and visible focus styles. Motion respects reduced-motion preferences. No browser runtime errors or failed local asset requests were observed.
- Desktop, denied-request, agent, evaluator, and mobile screenshots are committed for review.

## Project context refinement

All three repositories were refreshed and remain at the pinned revisions above. Each lab now has a connected demo/implementation switch, a three-step introduction, explicit browser simulation label, deployment context, pinned code evidence, actual component architecture, stack, engineering decision, implementation challenge, and tradeoff. The mobile request path is a vertical sequence with directional arrows; state has screen-reader labels as well as color.

- **Gateway:** user-confirmed deployment on single-node k3s on an Azure VM, consistent with source `docs/DESIGN.md` and README. No VM address, cluster endpoint, credential, or private service URL was copied to the portfolio. The simulated path is a logical tool-call subset; the implementation view separately explains Traefik, dashboard, gateway, upstreams, PostgreSQL, WooCommerce/MariaDB, and chat model integration. No infrastructure was contacted.
- **Aster & Row:** verified Streamlit imports, `st.cache_resource`, session handling and UI in `app.py`; README §7/§8 describes Streamlit hosting. No public application URL appears in the checked README, tracked source, or repository homepage metadata (`homepage: null`). No deployment URL is guessed or linked. A stale Gradio docstring does not override the actual Streamlit implementation.
- **Eval Harness:** user-confirmed not deployed. Source-code access only; browser simulation is clearly separate. No Live Demo or hosted-application link.

No new backend, API route, dependency, production deployment, or infrastructure connection was added. External links in the implementation views point only to GitHub source. LinkedIn remains the user-supplied profile link; automated access is blocked by LinkedIn, so it is not claimed as independently loaded.

Refinement validation: 13/13 behavior tests passed, including deployment-context and infrastructure-address checks. Production build, standalone TypeScript, and diff whitespace checks passed. Chromium passed the original workflows plus both experience views for all three projects, demo reset paths, next-lab navigation, skip-link focus and keyboard activation, focus transfer on experience changes, and 320/390/768px overflow checks. All runtime browser requests stayed on the local application origin. All 15 repository/pinned-code destinations returned HTTP 200. Updated screenshots cover the demos and each implementation view, including mobile.

## Editorial showcase integration

The redesign starts from main after PR #2 was merged. The source snapshots above were refreshed and remain unchanged. `lib/demo.ts`, `lib/order-fixtures.json`, and `lib/eval-fixtures.json` are unchanged by this integration; all original simulation capabilities remain in the extracted `components/engineering-lab.tsx` workspace.

The homepage's three guided experiences call the same gateway simulation/keyword grader or replay the same safe order fixtures. They expose a small understandable example, with direct access to the full corresponding lab and its implementation view. They are not replacement backends or claims about production performance.

Routes `/labs/mcp-gateway`, `/labs/aster-row`, and `/labs/eval-harness` identify each workspace. `?view=implementation` identifies its source/architecture view. URL state drives the workspace, including browser back/forward and reload. The homepage is the default route; no query string is needed to reach it.

Visual reference `https://sinna-workshop-showcase.lovable.app/` could not be fetched (HTTP 403). The original editorial design uses the user's specified cream/parchment, burgundy/espresso/rose palette, serif headings, monospace metadata, subtle grid, and restrained interactions. No reference statistics, rankings, testimonials or imagery were copied. System font stacks avoid external font requests. Illustrations are conceptual CSS/DOM diagrams, not product screenshots.

Editorial validation: 14/14 behavior tests pass, with new route mapping coverage. The committed browser navigation regression checks guided outcomes/reset, showcase-to-lab navigation, direct URLs, reload, implementation-view URLs, back/forward, return to showcase, 320/390/768px layouts and keyboard skip-link focus. The original full-lab browser regression also passed all five gateway scenarios, approval/decline, JSON validation, argument filtering, architecture selection, order fixtures, source-conflict exploration, grader pass/fail and counterexample, engineer view, and narrow layouts. No simulation engine or fixture semantics changed. No lint script is configured. Source repositories remain at the reviewed revisions. Résumé and email are omitted because none was verified.

Final browser verification also passed after the integration: implementation/demo switching, all reset paths, per-project deployment labels, keyboard focus transfer and skip links, no remote runtime requests in labs, and responsive layouts in both views. Source profile and all three repository destinations returned HTTP 200; unknown lab slugs return 404 and `/labs` redirects to the gateway. Fourteen updated screenshots cover the homepage, project showcase, mobile presentation, all three labs, and implementation views. The original simulation engine and fixture files have no diff from the merged main branch.
