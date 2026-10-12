import { chromium, BrowserContext, Page } from '@playwright/test';
import * as fs from 'fs';
import * as path from 'path';

// ==========================================
// CONFIGURATION
// ==========================================
const adminEmail = process.env.ADMIN_EMAIL;
const adminPassword = process.env.ADMIN_PASSWORD;
const defaultMemberPassword = process.env.MEMBER_PASSWORD;

if (!adminEmail || !adminPassword || !defaultMemberPassword) {
  throw new Error('Set ADMIN_EMAIL, ADMIN_PASSWORD, and MEMBER_PASSWORD before running this script.');
}

const CONFIG = {
  baseUrl: 'https://sojibahmed.communitycdn.net',
  admin: {
    email: adminEmail,
    password: adminPassword,
  },
  headed: process.env.HEADLESS === 'true' ? false : true,
  defaultMemberPassword,
};

// ==========================================
// MEMBERS TO ADD
// ==========================================
interface MemberInput {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

const timestamp = Date.now();
const predefinedMembers: MemberInput[] = [
  {
    firstName: 'Auto',
    lastName: 'Member1',
    email: `member.${timestamp}.1@imti.online`,
    password: CONFIG.defaultMemberPassword,
  },
  {
    firstName: 'Auto',
    lastName: 'Member2',
    email: `member.${timestamp}.2@imti.online`,
    password: CONFIG.defaultMemberPassword,
  },
];

async function runAutoMemberJoin() {
  console.log('====================================================');
  console.log('🤖 PLAYWRIGHT AUTO MEMBER ADD SCRIPT');
  console.log(`🌐 Community: ${CONFIG.baseUrl}`);
  console.log(`👤 Admin: ${CONFIG.admin.email}`);
  console.log(`🖥️ Mode: ${CONFIG.headed ? 'Headed (Visible Browser)' : 'Headless'}`);
  console.log('====================================================\n');

  const screenshotsDir = path.resolve(__dirname, '..', 'screenshots');
  if (!fs.existsSync(screenshotsDir)) {
    fs.mkdirSync(screenshotsDir, { recursive: true });
  }

  const browser = await chromium.launch({
    headless: !CONFIG.headed,
    slowMo: 300,
  });

  const context: BrowserContext = await browser.newContext({
    viewport: { width: 1280, height: 800 },
  });

  const page: Page = await context.newPage();

  try {
    // ----------------------------------------------------
    // STEP 1: Log in as Admin
    // ----------------------------------------------------
    console.log('⏳ [1/4] Navigating to Home Feeds...');
    await page.goto(`${CONFIG.baseUrl}/feeds`, { waitUntil: 'networkidle', timeout: 45000 });
    await page.waitForTimeout(1500); // Wait for React hydration

    console.log('⏳ [2/4] Opening login modal...');
    const emailInput = page.locator('input#email, input[placeholder*="example.com" i], input[type="email"]').first();
    const passInput = page.locator('input#password, input[placeholder*="password" i], input[type="password"]').first();

    // Retry clicking login button in case hydration was pending
    for (let i = 0; i < 3; i++) {
      if (await emailInput.isVisible().catch(() => false)) break;
      console.log(`   Clicking header login button (attempt ${i + 1})...`);
      await page.locator('header button:has-text("Log in"), button:has-text("Log in")').first().click();
      await page.waitForTimeout(1500);
    }

    await emailInput.waitFor({ state: 'visible', timeout: 10000 });
    console.log('   Filling admin credentials...');
    await emailInput.fill(CONFIG.admin.email);
    await passInput.fill(CONFIG.admin.password);

    console.log('   Submitting login...');
    const submitLoginBtn = page.locator('[role="dialog"] button:has-text("Log in"), button[type="submit"]:has-text("Log in")').first();
    await submitLoginBtn.click();

    // Wait for login to settle
    await page.waitForTimeout(3000);
    console.log('✅ Admin logged in successfully!\n');

    // ----------------------------------------------------
    // STEP 2: Navigate to Dashboard Members
    // ----------------------------------------------------
    console.log('⏳ [3/4] Navigating to Admin Dashboard Members (/dashboard/members)...');
    await page.goto(`${CONFIG.baseUrl}/dashboard/members`, { waitUntil: 'networkidle', timeout: 30000 });
    await page.waitForTimeout(2000);

    // Verify Invite button is visible
    const inviteBtn = page.locator('button:has-text("Invite")').first();
    await inviteBtn.waitFor({ state: 'visible', timeout: 15000 });
    console.log('✅ Dashboard Members loaded successfully!\n');

    // ----------------------------------------------------
    // STEP 3: Add Members Automatically
    // ----------------------------------------------------
    console.log(`⏳ [4/4] Starting automatic member addition (${predefinedMembers.length} members)...\n`);

    for (let i = 0; i < predefinedMembers.length; i++) {
      const member = predefinedMembers[i];
      console.log(`--- [Member ${i + 1}/${predefinedMembers.length}] Adding: ${member.firstName} ${member.lastName} (${member.email}) ---`);

      try {
        // Open Invite Dropdown
        await inviteBtn.waitFor({ state: 'visible', timeout: 8000 });
        await inviteBtn.click();
        await page.waitForTimeout(600);

        // Click "Add Member Manually"
        const addManuallyOption = page.locator('text="Add Member Manually"').first();
        await addManuallyOption.waitFor({ state: 'visible', timeout: 6000 });
        await addManuallyOption.click();
        await page.waitForTimeout(1000);

        // Fill Add Member Form inside the dialog
        const modal = page.locator('[role="dialog"]').first();
        await modal.waitFor({ state: 'visible', timeout: 8000 });

        const firstNameInput = modal.locator('input#firstName, input[placeholder*="First name" i]').first();
        const lastNameInput = modal.locator('input#lastName, input[placeholder*="Last name" i]').first();
        const memberEmailInput = modal.locator('input#email, input[placeholder*="member@example.com" i]').first();
        const memberPassInput = modal.locator('input#password, input[type="password"]').first();

        await firstNameInput.waitFor({ state: 'visible', timeout: 5000 });
        await firstNameInput.fill(member.firstName);
        await lastNameInput.fill(member.lastName);
        await memberEmailInput.fill(member.email);
        await memberPassInput.fill(member.password || CONFIG.defaultMemberPassword);

        // Click "Add Member" button
        const addMemberSubmitBtn = modal.locator('button:has-text("Add Member")').first();
        await addMemberSubmitBtn.click();

        // Wait for member to be created and modal to close
        await page.waitForTimeout(2500);
        console.log(`   ✨ Successfully added: ${member.email}`);

        // Save confirmation screenshot
        await page.screenshot({ path: path.join(screenshotsDir, `added_member_${i + 1}.png`) });

      } catch (err: any) {
        console.error(`   ⚠️ Failed to add ${member.email}: ${err.message}`);
        await page.screenshot({ path: path.join(screenshotsDir, `error_member_${i + 1}.png`) });
      }

      await page.waitForTimeout(1000);
    }

    console.log('\n🎉 ALL MEMBERS PROCESSED SUCCESSFULLY!');
  } catch (globalErr: any) {
    console.error('\n❌ Fatal automation error:', globalErr);
    await page.screenshot({ path: path.join(screenshotsDir, 'fatal_error.png') });
  } finally {
    console.log('\nClosing browser in 3 seconds...');
    await page.waitForTimeout(3000);
    await browser.close();
    console.log('👋 Done.');
  }
}

runAutoMemberJoin();
