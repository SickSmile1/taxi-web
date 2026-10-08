import { expect, test } from '@playwright/test';

test.describe('Contact Form', () => {
  test('shows validation errors for empty required fields', async ({
    page,
  }) => {
    await page.goto('/de/kontakt/');
    await page.click('button[type="submit"]');

    await expect(page.locator('text=Name ist erforderlich')).toBeVisible();
    await expect(page.locator('text=Telefon ist erforderlich')).toBeVisible();
    await expect(page.locator('text=E-Mail ist erforderlich')).toBeVisible();
    await expect(
      page.locator('text=Datenschutz ist erforderlich'),
    ).toBeVisible();
  });

  test('submits form and shows success message', async ({ page }) => {
    await page.goto('/de/kontakt/');

    await page.fill('input[name="name"]', 'Max Mustermann');
    await page.fill('input[name="phone"]', '+49 123 456789');
    await page.fill('input[name="email"]', 'max@example.com');
    await page.check('input[name="privacy"]');

    await page.click('button[type="submit"]');

    await expect(page.locator('text=Vielen Dank')).toBeVisible();
  });

  test('form labels update when language changes', async ({ page }) => {
    await page.goto('/de/kontakt/');
    await expect(page.locator('span:text("Name")').first()).toContainText(
      'Name',
    );

    await page.goto('/en/kontakt/');
    await expect(page.locator('span:text("Name")').first()).toContainText(
      'Name',
    );
  });

  test('validation errors are translated', async ({ page }) => {
    await page.goto('/de/kontakt/');
    await page.click('button[type="submit"]');
    await expect(page.locator('text=Name ist erforderlich')).toBeVisible();

    await page.goto('/en/kontakt/');
    await page.click('button[type="submit"]');
    await expect(page.locator('text=Name is required')).toBeVisible();
  });

  test('honeypot field silently rejects bots', async ({ page }) => {
    await page.goto('/de/kontakt/');

    await page.fill('input[name="website"]', 'http://spam-bot.com');

    await page.fill('input[name="name"]', 'Bot User');
    await page.fill('input[name="phone"]', '+49 123 456789');
    await page.fill('input[name="email"]', 'bot@spam.com');
    await page.check('input[name="privacy"]');

    await page.click('button[type="submit"]');

    await expect(page.locator('text=Vielen Dank')).not.toBeVisible();
  });
});
