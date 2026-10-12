import { test, expect } from '@playwright/test';
import { HomePage } from '../pages/HomePage';

test.describe('Authentication Flows', () => {
  let homePage: HomePage;

  test.beforeEach(async ({ page }) => {
    homePage = new HomePage(page);
    await homePage.open();
  });

  test('should display Sign up button linking to registration', async ({ page }) => {
    await expect(homePage.nav.signUpButton).toBeVisible();
    const href = await homePage.nav.signUpButton.getAttribute('href');
    expect(href).toContain('/register');
  });

  test('should open login modal when Log in button is clicked', async ({ page }) => {
    await homePage.nav.openLoginModal();
    await homePage.authModal.verifyModalVisible();
  });

  test('should allow entering credentials in login modal and close it', async ({ page }) => {
    await homePage.nav.openLoginModal();
    await homePage.authModal.verifyModalVisible();

    // Verify email and password fields exist
    await homePage.authModal.fillCredentials('testuser@example.com', 'not-a-real-password');
    
    // Test closing modal
    await homePage.authModal.closeModal();
    await expect(homePage.authModal.modalContainer).not.toBeVisible({ timeout: 5000 });
  });
});
