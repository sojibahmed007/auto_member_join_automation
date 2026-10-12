import { test, expect } from '@playwright/test';
import { HomePage } from '../pages/HomePage';

test.describe('Channels and Sidebar Tests', () => {
  let homePage: HomePage;

  test.beforeEach(async ({ page }) => {
    homePage = new HomePage(page);
    await homePage.open();
  });

  test('should display channels section in the sidebar', async ({ page }) => {
    const channelSection = page.locator('h6[title="Channels"], h6:has-text("Channels")').first();
    await expect(channelSection).toBeVisible();
  });

  test('should have accessible General channel link', async ({ page }) => {
    const generalChannel = page.locator('a[href="/channels/general"]').first();
    await expect(generalChannel).toBeVisible();
    await generalChannel.click();
    await expect(page).toHaveURL(/.*channels\/general/);
  });
});
