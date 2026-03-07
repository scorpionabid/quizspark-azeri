import { test, expect } from "@playwright/test";

test.describe("Authentication Flow", () => {
    test.beforeEach(async ({ page }) => {
        await page.goto("/auth");
        // Ensure the page is hydrated by waiting for the heading
        await page.waitForSelector("h2", { state: "visible", timeout: 15000 });
    });

    test("should show role selection cards", async ({ page }) => {
        // Selection cards heading - use locator and content check
        const heading = page.locator("h2").first();
        await expect(heading).toContainText("Kimi daxil olmaq istəyirsiniz?");

        // Check for student button specifically
        const studentBtn = page.getByRole("button", { name: /Google ilə Şagird Girişi/i });
        await expect(studentBtn).toBeVisible();

        // Check for teacher button specifically
        const teacherBtn = page.getByRole("button", { name: /Müəllim Girişi/i });
        await expect(teacherBtn).toBeVisible();
    });

    test("should show error on invalid login", async ({ page }) => {
        // Toggle to email auth
        await page.getByText("Və ya email/şifrə ilə daxil olun").click();

        // Wait for the login button to be visible
        const loginBtn = page.getByRole("button", { name: "Daxil ol" });
        await expect(loginBtn).toBeVisible();

        await page.fill("input[placeholder='email@misal.com']", "wrong@example.com");
        await page.fill("input[id='password']", "wrongpassword");
        await loginBtn.click();

        // Verify error toast
        await expect(page.getByText(/wrong|yanlışdır/i)).toBeVisible({ timeout: 10000 });
    });

    test("student oauth flow intent", async ({ page }) => {
        // Use getByRole for better accessibility-based selection
        const studentBtn = page.getByRole("button", { name: /Google ilə Şagird Girişi/i });
        await studentBtn.click();

        // Check localStorage with retry logic using toPass
        await expect(async () => {
            const pendingRole = await page.evaluate(() => localStorage.getItem("pending_role"));
            if (pendingRole !== "student") {
                throw new Error(`Expected student but got ${pendingRole}`);
            }
        }).toPass({ timeout: 5000 });
    });

    test("teacher oauth flow intent", async ({ page }) => {
        const teacherBtn = page.getByRole("button", { name: /Müəllim Girişi/i });
        await teacherBtn.click();

        await expect(async () => {
            const pendingRole = await page.evaluate(() => localStorage.getItem("pending_role"));
            if (pendingRole !== "teacher") {
                throw new Error(`Expected teacher but got ${pendingRole}`);
            }
        }).toPass({ timeout: 5000 });
    });
});
