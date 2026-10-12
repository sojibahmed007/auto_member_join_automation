import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

export class NavigationComponent extends BasePage {
  readonly homeLink: Locator;
  readonly coursesLink: Locator;
  readonly membersLink: Locator;
  readonly leaderboardLink: Locator;
  readonly blogLink: Locator;
  readonly eventsLink: Locator;
  readonly signUpButton: Locator;
  readonly loginButton: Locator;

  // Sidebar links
  readonly guidelinesSidebarLink: Locator;
  readonly librarySidebarLink: Locator;
  readonly generalChannelLink: Locator;

  constructor(page: Page) {
    super(page);
    this.homeLink = page.locator('nav a[href="/feeds"], a:has-text("Home")').first();
    this.coursesLink = page.locator('nav a[href="/courses"], a:has-text("Courses")').first();
    this.membersLink = page.locator('nav a[href="/members"], a:has-text("Members")').first();
    this.leaderboardLink = page.locator('nav a[href="/leaderboard"], a:has-text("Leaderboard")').first();
    this.blogLink = page.locator('nav a[href="/blog"], a:has-text("Blog")').first();
    this.eventsLink = page.locator('nav a[href="/events"], a:has-text("Events")').first();
    this.signUpButton = page.locator('a[href*="/register"]').first();
    this.loginButton = page.locator('button:has-text("Log in")').first();

    this.guidelinesSidebarLink = page.locator('a[href="/guidelines"]').first();
    this.librarySidebarLink = page.locator('a[href="/library"]').first();
    this.generalChannelLink = page.locator('a[href="/channels/general"]').first();
  }

  async goToHome() {
    await this.homeLink.click();
    await this.waitForPageLoaded();
  }

  async goToCourses() {
    await this.coursesLink.click();
    await this.waitForPageLoaded();
  }

  async goToMembers() {
    await this.membersLink.click();
    await this.waitForPageLoaded();
  }

  async goToLeaderboard() {
    await this.leaderboardLink.click();
    await this.waitForPageLoaded();
  }

  async goToBlog() {
    await this.blogLink.click();
    await this.waitForPageLoaded();
  }

  async goToEvents() {
    await this.eventsLink.click();
    await this.waitForPageLoaded();
  }

  async openLoginModal() {
    await this.loginButton.click();
  }
}
