import { test, expect } from '@playwright/test';
import { MembersPage } from '../pages/MembersPage';

test.describe('Community Member Automation', () => {
  test('should log in as admin and automatically add a new member manually', async ({ page }) => {
    test.setTimeout(60000);

    const adminEmail = process.env.ADMIN_EMAIL;
    const adminPassword = process.env.ADMIN_PASSWORD;
    const memberPassword = process.env.MEMBER_PASSWORD;

    if (!adminEmail || !adminPassword || !memberPassword) {
      test.skip(true, 'Set ADMIN_EMAIL, ADMIN_PASSWORD, and MEMBER_PASSWORD to run member automation.');
      return;
    }

    const testMember = {
      firstName: 'Test',
      lastName: 'Member',
      email: `auto.${Date.now()}@imti.online`,
      password: memberPassword,
    };

    // Step 1: Navigate to feeds & open Login
    await page.goto('/feeds', { waitUntil: 'networkidle' });
    await page.waitForTimeout(1500);

    const emailInput = page.locator('input#email, input[placeholder*="example.com" i], input[type="email"]').first();
    const passInput = page.locator('input#password, input[placeholder*="password" i], input[type="password"]').first();

    for (let i = 0; i < 3; i++) {
      if (await emailInput.isVisible().catch(() => false)) break;
      await page.locator('header button:has-text("Log in"), button:has-text("Log in")').first().click();
      await page.waitForTimeout(1500);
    }

    await emailInput.waitFor({ state: 'visible', timeout: 10000 });
    await emailInput.fill(adminEmail);
    await passInput.fill(adminPassword);

    const dialogLoginBtn = page.locator('[role="dialog"] button:has-text("Log in"), button[type="submit"]:has-text("Log in")').first();
    await dialogLoginBtn.click();
    await page.waitForTimeout(3000);

    // Step 2: Use Members Page Object to navigate and add member
    const membersPage = new MembersPage(page);
    await membersPage.navigateToDashboardMembers();
    await membersPage.addSingleMember(testMember);

    // Verify modal is closed and we are on dashboard members
    await page.waitForTimeout(2000);
    expect(page.url()).toContain('/dashboard/members');
  });
});
