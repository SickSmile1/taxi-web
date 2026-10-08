import { expect, test } from '@playwright/test';

test.describe('theme surfaces', () => {
  test.beforeEach(async ({ page }) => {
    test.setTimeout(90000);
    await page.goto('/de/');
    await page.waitForSelector('#kontakt');
  });

  const isLight = (c: string) => {
    const m = c.match(/rgba?\((\d+),/);
    const r = Number(m?.[1]);
    return r >= 220;
  };

  const bgOf = (page: import('playwright').Page, sel: string) =>
    page.evaluate(
      (s) =>
        getComputedStyle(document.querySelector(s) as HTMLElement)
          .backgroundColor,
      sel,
    );

  test('dark mode keeps dark surfaces', async ({ page }) => {
    const aboutBg = await bgOf(page, '#about');
    const m = aboutBg.match(/rgba?\((\d+),/);
    expect(Number(m?.[1])).toBeLessThan(40);
  });

  test('light mode themes every section (was dark below the fold)', async ({
    page,
  }) => {
    await page.evaluate(() => {
      localStorage.setItem('theme', 'light');
    });
    await page.reload();
    await page.waitForSelector('#kontakt');
    await page.waitForFunction(() =>
      document.body.classList.contains('light-theme'),
    );
    // the form card sits on --bg-surface (light today #ffffff) in light mode
    expect(isLight(await bgOf(page, '.page-wrapper'))).toBeTruthy();
    expect(isLight(await bgOf(page, 'footer'))).toBeTruthy();
    expect(
      isLight(await bgOf(page, '#kontakt input[name="name"]')),
    ).toBeTruthy();
  });
});
