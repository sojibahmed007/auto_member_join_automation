import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './BasePage';

export class AuthModal extends BasePage {
  readonly emailInput: Locator;
  readonly passwordInput: Locator;
  readonly submitButton: Locator;
  readonly modalContainer: Locator;
  readonly closeButton: Locator;

  constructor(page: Page) {
    super(page);
    this.emailInput = page.locator('input[placeholder*="example.com" i], input[type="email"], input[name="email"]').first();
    this.passwordInput = page.locator('input[placeholder*="password" i], input[type="password"]').first();
    this.modalContainer = page.locator('form:has(input[placeholder*="password" i]), [role="dialog"], .ezy-modal').first();
    this.submitButton = page.locator('button:has-text("Log in")').last();
    this.closeButton = page.locator('.ezy-modal-close, button[aria-label="Close"], button:has(svg.lucide-x)').first();
  }

  async verifyModalVisible() {
    await expect(this.emailInput).toBeVisible({ timeout: 10000 });
  }

  async fillCredentials(email: string, pass: string) {
    await this.emailInput.fill(email);
    await this.passwordInput.fill(pass);
  }

  async submit() {
    await this.submitButton.click();
  }

  async closeModal() {
    if (await this.closeButton.isVisible()) {
      await this.closeButton.click();
    } else {
      await this.page.keyboard.press('Escape');
    }
    // Give animation a moment
    await this.page.waitForTimeout(500);
  }
}
