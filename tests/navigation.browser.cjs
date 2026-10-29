const { chromium } = require(process.env.PLAYWRIGHT_MODULE || "playwright");
const assert = require("node:assert/strict");
(async () => {
  const b = await chromium.launch({
    executablePath: process.env.CHROMIUM_PATH || undefined,
    args: ["--no-sandbox"],
  });
  try {
    const p = await b.newPage({
      viewport: { width: 1512, height: 1050 },
      reducedMotion: "reduce",
    });
    const errors = [];
    p.on("pageerror", (e) => errors.push(e.message));
    p.on("response", (r) => {
      if (
        r.url().startsWith("http://localhost:3000") &&
        r.status() >= 400 &&
        !r.url().includes("/labs/unknown")
      )
        errors.push(r.status() + " " + r.url());
    });
    await p.goto("http://localhost:3000", { waitUntil: "networkidle" });
    await p
      .getByRole("heading", { name: "Building AI systems", exact: false })
      .waitFor();
    assert.equal(await p.locator(".product-module").count(), 3);
    await p.screenshot({ path: "docs/screenshots/homepage-hero.png" });
    await p.screenshot({
      path: "docs/screenshots/homepage-desktop.png",
      fullPage: true,
    });
    await p
      .locator("#projects")
      .screenshot({ path: "docs/screenshots/project-showcase.png" });
    const guides = p.locator(".guided-demo");
    await guides
      .nth(0)
      .getByRole("button", { name: "Try the permission check" })
      .click();
    await guides.nth(0).getByText("Denied before the store.").waitFor();
    await guides
      .nth(0)
      .getByLabel("Choose who is making the request")
      .selectOption("second");
    await guides
      .nth(0)
      .getByRole("button", { name: "Try the permission check" })
      .click();
    await guides.nth(0).getByText("Allowed by the role check.").waitFor();
    await guides
      .nth(0)
      .getByRole("button", { name: "Reset guided demo" })
      .click();
    assert.match(
      await guides.nth(0).locator(".guided-result").innerText(),
      /Choose an option/,
    );
    await guides
      .nth(1)
      .getByRole("button", { name: "Inspect the safe output" })
      .click();
    await guides
      .nth(1)
      .getByText("A cancelled order needs no delivery estimate.")
      .waitFor();
    await guides
      .nth(1)
      .getByLabel("Choose a source fixture")
      .selectOption("second");
    await guides
      .nth(1)
      .getByRole("button", { name: "Inspect the safe output" })
      .click();
    await guides.nth(1).getByText("This needs a human handoff.").waitFor();
    await guides
      .nth(2)
      .getByLabel("Choose an agent reply")
      .selectOption("second");
    await guides
      .nth(2)
      .getByRole("button", { name: "Check the reply" })
      .click();
    assert.match(
      await guides.nth(2).locator(".guided-result").innerText(),
      /denies the policy/,
    );
    await p
      .locator("#aster-row")
      .getByRole("link", { name: "Explore Real Implementation", exact: true })
      .click();
    await p.waitForURL("**/labs/aster-row?view=implementation");
    await p.getByRole("heading", { name: /Streamlit application/ }).waitFor();
    await p
      .getByRole("button", { name: "1. Try the Interactive Demo" })
      .click();
    await p.waitForURL("**/labs/aster-row");
    await p.getByRole("button", { name: "Inspect safe output" }).waitFor();
    await p.goBack();
    await p.waitForURL("**/labs/aster-row?view=implementation");
    await p.getByRole("heading", { name: /Streamlit application/ }).waitFor();
    await p.goForward();
    await p.waitForURL("**/labs/aster-row");
    await p.getByRole("button", { name: "Inspect safe output" }).waitFor();
    await p.reload();
    await p.getByRole("button", { name: "Inspect safe output" }).waitFor();
    await p
      .getByRole("link", { name: "Back to the showcase", exact: false })
      .click();
    await p.waitForURL("http://localhost:3000/");
    await p
      .getByRole("link", { name: "Enter the Engineering Lab", exact: true })
      .click();
    await p.waitForURL("**/labs/mcp-gateway");
    await p.getByRole("button", { name: /Permission boundary/ }).click();
    await p.getByRole("button", { name: "Run simulated request" }).click();
    await p.waitForFunction(
      () =>
        document.querySelector(".trace-panel .status")?.textContent ===
        "Role denied",
    );
    for (const width of [320, 390, 768]) {
      await p.setViewportSize({ width, height: 844 });
      await p.goto("http://localhost:3000");
      assert.equal(
        await p.evaluate(
          () => document.documentElement.scrollWidth > innerWidth,
        ),
        false,
        "home overflow " + width,
      );
      for (const slug of ["mcp-gateway", "aster-row", "eval-harness"]) {
        await p.goto("http://localhost:3000/labs/" + slug);
        assert.equal(
          await p.evaluate(
            () => document.documentElement.scrollWidth > innerWidth,
          ),
          false,
          slug + " overflow " + width,
        );
      }
    }
    await p.setViewportSize({ width: 390, height: 844 });
    await p.goto("http://localhost:3000");
    await p.screenshot({
      path: "docs/screenshots/homepage-mobile.png",
      fullPage: true,
    });
    await p
      .locator("#mcp-gateway")
      .screenshot({ path: "docs/screenshots/project-mobile.png" });
    await p.goto("http://localhost:3000");
    await p.keyboard.press("Tab");
    assert.equal(
      await p.evaluate(() => document.activeElement.className),
      "ed-skip",
    );
    await p.keyboard.press("Enter");
    assert.equal(await p.evaluate(() => document.activeElement.id), "content");
    assert.deepEqual(errors, []);
    console.log(
      "PASS: editorial homepage, all guided outcomes/reset, project-to-lab links, direct route/reload, implementation URL, back/forward, return to showcase, retained permission scenario, 320/390/768px home/lab overflow, keyboard skip link, no runtime/local asset errors.",
    );
  } finally {
    await b.close();
  }
})().catch((e) => {
  console.error(e);
  process.exitCode = 1;
});
