import { expect, test } from '@playwright/test';

test.describe('Mobile Responsive Header & Navigation', () => {
  test('header components are visible on mobile and hamburger opens the drawer', async ({
    page,
  }, testInfo) => {
    test.skip(testInfo.project.name !== 'Mobile Chrome', 'Mobile-only test');
    await page.goto('/de/');

    // 1. Check basic header logo visibility
    const logo = page.locator('header img[alt="Taxi-Alica Freiburg"]');
    await expect(logo).toBeVisible();

    const title = page.locator('header span:has-text("Taxi Alica")');
    await expect(title).toBeVisible();

    // 2. Desktop navigation links should be hidden on mobile viewports
    const desktopNav = page.locator('.desktop-nav');
    await expect(desktopNav).not.toBeVisible();

    // 3. Hamburger button should be visible on mobile
    const hamburger = page.locator('.mobile-menu-btn');
    await expect(hamburger).toBeVisible();

    // 4. Drawer should be closed/hidden initially
    const drawer = page.locator('.mobile-drawer');
    await expect(drawer).not.toBeVisible();

    // 5. Clicking the hamburger opens the drawer and shows internal links
    await hamburger.click();
    await expect(drawer).toBeVisible();

    const mobileLink = page.locator(
      '.mobile-drawer-link:has-text("Stadtfahrten")',
    );
    await expect(mobileLink).toBeVisible();
  });

  test('theme state persists across page navigations', async ({
    page,
  }, testInfo) => {
    test.skip(testInfo.project.name !== 'Mobile Chrome', 'Mobile-only test');
    await page.goto('/de/');

    // Toggle theme to light mode
    const themeBtn = page.locator('.theme-toggle-btn');
    await themeBtn.click();
    await expect(page.locator('body')).toHaveClass(/light-theme/);

    // Click a link in the mobile drawer (or go directly to the contact page)
    await page.goto('/de/kontakt/');

    // Theme should remain light-theme on reload / navigation
    await expect(page.locator('body')).toHaveClass(/light-theme/);
  });
});
