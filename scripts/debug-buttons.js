const { chromium } = require('@playwright/test');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.goto('https://sojibahmed.communitycdn.net/');
  await page.waitForTimeout(2000);

  console.log('Clicking header login button...');
  await page.locator('header button:has-text("Log in")').click();

  // Wait for input
  const email = page.locator('input[placeholder="you@example.com"]');
  await email.waitFor({ state: 'visible', timeout: 10000 });
  console.log('SUCCESS: Email input is visible!');

  await page.screenshot({ path: 'screenshots/modal_opened.png' });
  console.log('Screenshot saved: modal_opened.png');

  await browser.close();
})();
