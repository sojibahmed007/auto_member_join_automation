import { chromium } from '@playwright/test';
import * as fs from 'fs';
import * as path from 'path';

async function runAutomation() {
  console.log('🚀 Starting Playwright TypeScript Automation on https://sojibahmed.communitycdn.net/ ...\n');

  const screenshotsDir = path.resolve(__dirname, '..', 'screenshots');
  if (!fs.existsSync(screenshotsDir)) {
    fs.mkdirSync(screenshotsDir, { recursive: true });
  }

  const browser = await chromium.launch({
    headless: process.env.HEADED ? false : true,
  });

  const context = await browser.newContext({
    viewport: { width: 1280, height: 800 },
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
  });

  const page = await context.newPage();

  try {
    // Step 1: Open Home / Feed
    console.log('📌 [Step 1] Navigating to Home Feed...');
    const startTime = Date.now();
    await page.goto('https://sojibahmed.communitycdn.net/', { waitUntil: 'networkidle', timeout: 30000 });
    const pageTitle = await page.title();
    console.log(`   Page loaded in ${Date.now() - startTime}ms`);
    console.log(`   Title: "${pageTitle}"`);
    await page.screenshot({ path: path.join(screenshotsDir, '01_home_feed.png') });
    console.log('   📸 Screenshot saved: 01_home_feed.png');

    // Step 2: Open Login Modal & Interact
    console.log('\n📌 [Step 2] Triggering Login Form Modal...');
    const loginBtn = page.locator('header button:has-text("Log in"), button:has-text("Log in")').first();
    await loginBtn.waitFor({ state: 'visible', timeout: 8000 });
    await loginBtn.click();
    
    const emailInput = page.locator('input[placeholder*="example.com" i], input[type="email"], input[name="email"]').first();
    const passInput = page.locator('input[placeholder*="password" i], input[type="password"]').first();
    
    await emailInput.waitFor({ state: 'visible', timeout: 8000 });
    console.log('   Login dialog successfully opened');
    
    await emailInput.fill('testuser@example.com');
    console.log('   Entered demo email: testuser@example.com');
    
    await passInput.fill('not-a-real-password');
    console.log('   Entered demo password');
    
    await page.screenshot({ path: path.join(screenshotsDir, '02_login_modal.png') });
    console.log('   📸 Screenshot saved: 02_login_modal.png');

    // Close modal
    const closeBtn = page.locator('.ezy-modal-close, button[aria-label="Close"], button:has(svg.lucide-x)').first();
    if (await closeBtn.isVisible()) {
      await closeBtn.click();
    } else {
      await page.keyboard.press('Escape');
    }
    await page.waitForTimeout(600);
    console.log('   Modal closed');

    // Step 3: Navigate to Courses Page
    console.log('\n📌 [Step 3] Navigating to Courses Catalog...');
    await page.goto('https://sojibahmed.communitycdn.net/courses', { waitUntil: 'networkidle', timeout: 30000 });
    console.log(`   Current URL: ${page.url()}`);
    console.log(`   Courses Title: "${await page.title()}"`);
    await page.screenshot({ path: path.join(screenshotsDir, '03_courses_page.png') });
    console.log('   📸 Screenshot saved: 03_courses_page.png');

    // Step 4: Navigate to Channels (General)
    console.log('\n📌 [Step 4] Checking Community Channels (General)...');
    await page.goto('https://sojibahmed.communitycdn.net/channels/general', { waitUntil: 'networkidle', timeout: 30000 });
    console.log(`   Current URL: ${page.url()}`);
    await page.screenshot({ path: path.join(screenshotsDir, '04_general_channel.png') });
    console.log('   📸 Screenshot saved: 04_general_channel.png');

    console.log('\n🎉 Automation run completed successfully! All steps executed with screenshots saved in screenshots/.');
  } catch (err) {
    console.error('❌ Automation encountered an error:', err);
    await page.screenshot({ path: path.join(screenshotsDir, 'error_state.png') });
  } finally {
    await browser.close();
  }
}

runAutomation();
