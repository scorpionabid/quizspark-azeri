import { test, expect } from '@playwright/test';

test.describe('Mobile Responsiveness Checks', () => {
    test('Homepage should be responsive on mobile', async ({ page, isMobile }) => {
        if (!isMobile) return;

        await page.goto('/');

        // Wait for hero section
        await expect(page.locator('h1').first()).toBeVisible();

        // Check if there's any horizontal overflow
        const hasHorizontalScroll = await page.evaluate(() => {
            return document.documentElement.scrollWidth > document.documentElement.clientWidth;
        });
        expect(hasHorizontalScroll, 'Homepage should not have horizontal scroll on mobile').toBe(false);

        // Check if stats are visible and stacked (should be 1 or 2 columns, but specifically check visibility)
        await expect(page.locator('section').first()).toBeVisible();
    });

    test('Quiz page should have sticky navigation on mobile', async ({ page, isMobile }) => {
        if (!isMobile) return;

        // Note: This requires a real quiz ID or a mock
        // Since we are checking responsiveness, we can go to a sample quiz if available
        // Let's try to find a quiz link from the homepage or navigate to a known one if sample data exists
        await page.goto('/');

        // Find first quiz card and click "Başla" or navigate directly to /quiz/1 (if sample exists)
        // From sampleQuizzes.ts, id "1" usually exists for math
        await page.goto('/quiz/1');

        // Check for sticky bottom navigation
        const stickyNav = page.locator('div.fixed.bottom-0');
        await expect(stickyNav).toBeVisible();

        // Check if there's any horizontal overflow
        const hasHorizontalScroll = await page.evaluate(() => {
            return document.documentElement.scrollWidth > document.documentElement.clientWidth;
        });
        expect(hasHorizontalScroll, 'QuizPage should not have horizontal scroll on mobile').toBe(false);
    });
});
