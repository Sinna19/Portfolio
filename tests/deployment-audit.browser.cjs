// Run against `npm start`, with an existing Playwright + Chromium installation.
// External navigation is stubbed: this tests link behavior, not deployment uptime.
const { chromium } = require(process.env.PLAYWRIGHT_MODULE || "playwright");
const assert = require("node:assert/strict");
const base = process.env.PORTFOLIO_BASE_URL || "http://localhost:3000";
const deployments = [
  ["mcp-gateway", [
    ["Visit Live Store", "https://shop.20.197.63.44.sslip.io/"],
    ["Open Deployed App · Login required", "https://app.20.197.63.44.sslip.io/login"],
  ]],
  ["aster-row", [["Launch Live App", "https://retail-support-ai.streamlit.app/"]]],
  ["eval-harness", []],
];

(async () => {
  const browser = await chromium.launch({
    executablePath: process.env.CHROMIUM_PATH || undefined,
    args: ["--no-sandbox"],
  });
  try {
    for (const viewport of [{ width: 1440, height: 900 }, { width: 390, height: 844 }]) {
      const context = await browser.newContext({ viewport, reducedMotion: "reduce" });
      for (const [, links] of deployments) {
        for (const [, url] of links) {
          await context.route(url, (route) => route.fulfill({
            contentType: "text/html",
            body: "<title>External navigation test stub</title>",
          }));
        }
      }
      context.setDefaultTimeout(10000);
      const page = await context.newPage();
      const errors = [], requests = [];
      page.on("pageerror", (error) => errors.push(error.message));
      page.on("request", (request) => requests.push(request.url()));

      async function verifyLinks(scope, links) {
        for (const [label, url] of links) {
          const link = scope.getByRole("link", { name: `${label} (opens in a new tab)`, exact: true });
          assert.equal(await link.getAttribute("href"), url);
          assert.equal(await link.getAttribute("target"), "_blank");
          assert.match(await link.getAttribute("rel"), /noopener/);
          assert.ok((await link.innerText()).includes(label));
          const originalUrl = page.url();
          await link.focus();
          const opened = context.waitForEvent("page");
          await page.keyboard.press("Enter");
          const popup = await opened;
          await popup.waitForLoadState();
          assert.equal(popup.url(), url);
          assert.equal(page.url(), originalUrl);
          await popup.close();
        }
      }

      await page.goto(base, { waitUntil: "networkidle" });
      assert.equal(await page.locator('.product-module a[target="_blank"]').count(), 6);
      for (const [slug, links] of deployments) {
        const card = page.locator(`#${slug}`);
        await verifyLinks(card, links);
        assert.equal(await card.getByRole("link", { name: /Try Interactive Demo/ }).count(), 1);
        assert.equal(await card.getByRole("link", { name: /Explore Real Implementation/ }).count(), 1);
      }
      assert.match(await page.locator("#mcp-gateway .product-status").innerText(), /separate from the browser simulation/);
      assert.match(await page.locator("#aster-row .product-status").innerText(), /separate Streamlit deployment/);
      for (const [slug, links] of deployments) {
        await page.goto(`${base}/labs/${slug}?view=implementation`, { waitUntil: "networkidle" });
        const implementation = page.getByRole("region", { name: "Real implementation" });
        await verifyLinks(implementation, links);
        assert.equal(await implementation.locator('.button-row a[target="_blank"]').count(), links.length + 1);
        await implementation.getByRole("button", { name: "Try the Interactive Demo", exact: true }).click();
        await page.waitForURL(`${base}/labs/${slug}`);
        await page.getByText("Interactive simulation — runs in your browser.", { exact: true }).waitFor();
      }

      await page.goto(`${base}/labs/mcp-gateway`, { waitUntil: "networkidle" });
      const scenarios = page.getByRole("group", { name: "Request scenarios" });
      const inspectors = page.getByRole("group", { name: "Result views" });
      const status = page.locator(".trace-panel .status");
      async function run(expected) {
        await page.getByRole("button", { name: /^Run simulated request/ }).click();
        await page.getByRole("button", { name: /^Run simulated request/ }).waitFor();
        assert.equal(await status.innerText(), expected);
      }
      for (const field of ["sku", "description", "status"]) {
        await scenarios.getByRole("button", { name: /Permission boundary/ }).click();
        await page.getByRole("combobox", { name: /^Role/ }).selectOption("admin");
        await page.getByLabel("ARGUMENTS", { exact: false }).fill(JSON.stringify({ name: "Test", regular_price: "1.00", [field]: field === "status" ? ["draft"] : 123 }));
        await run("Demo validation error");
        assert.equal(await page.locator(".trace-list").getByText("Fixture response", { exact: true }).count(), 0);
      }
      const chat = scenarios.getByRole("button", { name: /Confirm a chat write/ });
      await chat.focus();
      await page.keyboard.press("Enter");
      assert.equal(await chat.getAttribute("aria-pressed"), "true");
      assert.equal(await scenarios.locator('[aria-pressed="true"]').count(), 1);
      await page.getByRole("combobox", { name: /^Upstream/ }).selectOption("unreachable");
      await run("Tool error");
      assert.equal(await page.getByRole("region", { name: "Confirm simulated write" }).count(), 0);
      assert.match(await page.locator(".trace-list").innerText(), /absent from discovery/);
      assert.match(await page.locator(".inspector pre").innerText(), /server 'woo' is unreachable/);
      for (const [action, expected] of [["Approve simulation", "Completed"], ["Decline", "Declined"]]) {
        await chat.click();
        await run("Awaiting confirmation");
        await page.getByRole("button", { name: action, exact: true }).click();
        await page.getByRole("button", { name: /^Run simulated request/ }).waitFor();
        assert.equal(await status.innerText(), expected);
      }

      for (const reset of ["Reset lab", "Reset this demo"]) {
        const history = inspectors.getByRole("button", { name: "History", exact: true });
        await history.focus();
        await page.keyboard.press("Space");
        assert.equal(await history.getAttribute("aria-pressed"), "true");
        assert.equal(await inspectors.locator('[aria-pressed="true"]').count(), 1);
        const database = page.getByRole("button", { name: /PostgreSQL identity/ });
        await database.focus();
        await page.keyboard.press("Enter");
        assert.equal(await database.getAttribute("aria-pressed"), "true");
        await page.getByRole("button", { name: reset, exact: true }).click();
        assert.equal(await status.innerText(), "Ready to run");
        assert.equal(await inspectors.getByRole("button", { name: "Response", exact: true }).getAttribute("aria-pressed"), "true");
        assert.equal(await database.getAttribute("aria-pressed"), "false");
        assert.equal(await page.locator('.arch-node[aria-pressed="true"] strong').innerText(), "Gateway");
        assert.equal(await scenarios.getByRole("button", { name: /Read the catalog/ }).getAttribute("aria-pressed"), "true");
        assert.equal(await page.getByRole("combobox", { name: /^Role/ }).inputValue(), "member");
        assert.equal(await page.getByRole("combobox", { name: /^Channel/ }).inputValue(), "mcp");
        assert.equal(await page.getByRole("combobox", { name: /^Upstream/ }).inputValue(), "connected");
        assert.equal(await page.getByRole("combobox", { name: /^API key/ }).inputValue(), "active");
        assert.equal(await page.locator("#tool").inputValue(), "woo__list_products");
        assert.deepEqual(JSON.parse(await page.locator("#args").inputValue()), { per_page: 2 });
        await history.click();
        assert.deepEqual(JSON.parse(await page.locator(".inspector pre").innerText()), []);
        await run("Completed");
      }
      assert.deepEqual(errors, []);
      // Popups have separate Page objects. Main-page requests must remain local.
      assert.ok(requests.every((url) => url.startsWith(base + "/")));
      console.log(`PASS ${viewport.width}px: deployment links (stubbed), labels, browser-only execution, schema errors, offline chat, approval/decline, keyboard selections, full resets.`);
      for (const width of viewport.width === 1440 ? [1440, 1366, 768] : [390, 320]) {
        await page.setViewportSize({ width, height: 844 });
        for (const path of ["/", ...deployments.flatMap(([slug]) => [`/labs/${slug}`, `/labs/${slug}?view=implementation`])]) {
          await page.goto(base + path, { waitUntil: "networkidle" });
          assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth), false, `overflow ${width}: ${path}`);
        }
      }
      console.log(`PASS layout widths: ${viewport.width === 1440 ? "1440, 1366, 768" : "390, 320"}; homepage and all demo/implementation views.`);
      await context.close();
    }
  } finally {
    await browser.close();
  }
})().catch((error) => { console.error(error); process.exitCode = 1; });
