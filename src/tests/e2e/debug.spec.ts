import { test, expect } from "@playwright/test";

test("dump auth page content", async ({ page }) => {
    await page.goto("/auth");
    // Wait for some time to allow React to render
    await page.waitForTimeout(5000);

    const content = await page.content();
    console.log("PAGE CONTENT START");
    console.log(content);
    console.log("PAGE CONTENT END");

    const h2Text = await page.locator("h2").allTextContents();
    console.log("H2 TAGS:", h2Text);
});
