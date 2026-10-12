import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

export interface MemberData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

export class MembersPage extends BasePage {
  readonly inviteMenuButton: Locator;
  readonly addMemberManuallyOption: Locator;
  readonly modalDialog: Locator;

  constructor(page: Page) {
    super(page);
    this.inviteMenuButton = page.locator('button:has-text("Invite")').first();
    this.addMemberManuallyOption = page.locator('text="Add Member Manually"').first();
    this.modalDialog = page.locator('[role="dialog"]').first();
  }

  async navigateToDashboardMembers() {
    await this.page.goto('https://sojibahmed.communitycdn.net/dashboard/members', { waitUntil: 'networkidle' });
    await this.page.waitForTimeout(2000);
  }

  async openAddMemberModal() {
    await this.inviteMenuButton.waitFor({ state: 'visible', timeout: 10000 });
    await this.inviteMenuButton.click();
    await this.page.waitForTimeout(600);

    await this.addMemberManuallyOption.waitFor({ state: 'visible', timeout: 6000 });
    await this.addMemberManuallyOption.click();
    await this.page.waitForTimeout(1000);
  }

  async fillMemberForm(member: MemberData) {
    const modal = this.modalDialog;

    const firstNameInput = modal.locator('input#firstName, input[placeholder*="First name" i]').first();
    const lastNameInput = modal.locator('input#lastName, input[placeholder*="Last name" i]').first();
    const emailInput = modal.locator('input#email, input[placeholder*="member@example.com" i]').first();
    const passwordInput = modal.locator('input#password, input[type="password"]').first();

    await firstNameInput.waitFor({ state: 'visible', timeout: 8000 });
    await firstNameInput.fill(member.firstName);
    await lastNameInput.fill(member.lastName);
    await emailInput.fill(member.email);
    await passwordInput.fill(member.password);
  }

  async submitMemberForm() {
    const modal = this.modalDialog;
    const submitBtn = modal.locator('button:has-text("Add Member")').first();
    await submitBtn.click();
    await this.page.waitForTimeout(2500);
  }

  async addSingleMember(member: MemberData) {
    await this.openAddMemberModal();
    await this.fillMemberForm(member);
    await this.submitMemberForm();
  }
}
