import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';
import { NavigationComponent } from './Navigation';
import { AuthModal } from './AuthModal';

export class HomePage extends BasePage {
  readonly nav: NavigationComponent;
  readonly authModal: AuthModal;
  readonly siteHeader: Locator;
  readonly sidebar: Locator;
  readonly feedContainer: Locator;
  readonly channelLinks: Locator;

  constructor(page: Page) {
    super(page);
    this.nav = new NavigationComponent(page);
    this.authModal = new AuthModal(page);
    this.siteHeader = page.locator('header').first();
    this.sidebar = page.locator('[data-slot="sidebar-container"], aside').first();
    this.feedContainer = page.locator('main, [data-slot="feed"], section').first();
    this.channelLinks = page.locator('a[href^="/channels/"]');
  }

  async open() {
    await this.navigateTo('/');
    await this.waitForPageLoaded();
  }

  async getChannelCount(): Promise<number> {
    return await this.channelLinks.count();
  }
}
