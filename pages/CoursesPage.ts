import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';
import { NavigationComponent } from './Navigation';

export class CoursesPage extends BasePage {
  readonly nav: NavigationComponent;
  readonly courseCards: Locator;
  readonly searchInput: Locator;

  constructor(page: Page) {
    super(page);
    this.nav = new NavigationComponent(page);
    this.courseCards = page.locator('article, div[class*="course-card"], a[href*="/course"]');
    this.searchInput = page.locator('input[placeholder*="search" i], input[type="search"]').first();
  }

  async open() {
    await this.navigateTo('/courses');
    await this.waitForPageLoaded();
  }

  async getCoursesCount(): Promise<number> {
    return await this.courseCards.count();
  }
}
