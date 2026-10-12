import { test, expect } from '@playwright/test';
import { CoursesPage } from '../pages/CoursesPage';

test.describe('Courses Page Automation', () => {
  let coursesPage: CoursesPage;

  test.beforeEach(async ({ page }) => {
    coursesPage = new CoursesPage(page);
    await coursesPage.open();
  });

  test('should load the courses page successfully', async ({ page }) => {
    await expect(page).toHaveURL(/.*courses/);
    await expect(page).toHaveTitle(/Courses|Backbenchers/i);
  });

  test('should display course listings or search area', async ({ page }) => {
    // Check main container
    const mainContent = page.locator('main, section, [data-slot="sidebar-wrapper"]').first();
    await expect(mainContent).toBeVisible();
  });
});
