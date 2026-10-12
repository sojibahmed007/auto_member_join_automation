import { test, expect } from '@playwright/test';
import { HomePage } from '../pages/HomePage';

test.describe('Community Navigation Tests', () => {
  let homePage: HomePage;

  test.beforeEach(async ({ page }) => {
    homePage = new HomePage(page);
    await homePage.open();
  });

  test('should load the home page with correct title and header', async ({ page }) => {
    await expect(page).toHaveTitle(/Backbenchers Academy|Feed/i);
    await expect(homePage.siteHeader).toBeVisible();
  });

  test('should navigate to Courses page from top navigation', async ({ page }) => {
    await homePage.nav.goToCourses();
    await expect(page).toHaveURL(/.*courses/);
  });

  test('should navigate to Guidelines from sidebar', async ({ page }) => {
    const guidelines = page.locator('a[href="/guidelines"]').first();
    if (await guidelines.isVisible()) {
      await guidelines.click();
      await expect(page).toHaveURL(/.*guidelines/);
    }
  });

  test('should navigate to Leaderboard page', async ({ page }) => {
    const leaderboardLink = page.locator('a[href="/leaderboard"]').first();
    if (await leaderboardLink.isVisible()) {
      await leaderboardLink.click();
      await expect(page).toHaveURL(/.*leaderboard/);
    }
  });
});
