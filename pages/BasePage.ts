import { Page } from '@playwright/test';

export class BasePage {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async navigateTo(path: string = '/') {
    await this.page.goto(path, { waitUntil: 'networkidle' });
  }

  async waitForPageLoaded() {
    await this.page.waitForLoadState('networkidle');
  }

  async getPageTitle(): Promise<string> {
    return await this.page.title();
  }

  async takeScreenshot(fileName: string) {
    await this.page.screenshot({ path: `screenshots/${fileName}.png`, fullPage: true });
  }
}
