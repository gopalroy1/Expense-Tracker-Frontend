import { expect, test } from '@playwright/test';

const routes = [
  '/',
  '/login',
  '/signup',
  '/dashboard',
  '/networth',
];

for (const route of routes) {
  test(`route ${route} should load without crash`, async ({ page }) => {
    await page.goto(`http://localhost:5173${route}`);
    
    // Wait for React to render
    await page.waitForTimeout(1000);

    // Check page is not blank
    const body = await page.locator('body').innerText();
    expect(body.length).toBeGreaterThan(20);
  });
}
