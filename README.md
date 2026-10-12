# Playwright TypeScript Automation Suite

End-to-End (E2E) Test and Automation Suite built with **Playwright** and **TypeScript** for [Backbenchers Academy Community](https://sojibahmed.communitycdn.net/).

## 📁 Project Structure

```
playwright-community-automation/
├── pages/                   # Page Object Model (POM) classes
│   ├── BasePage.ts          # Core page methods & helpers
│   ├── HomePage.ts          # Feed / Home page interactions
│   ├── Navigation.ts        # Top bar & sidebar navigation
│   ├── AuthModal.ts         # Login / authentication dialog
│   └── CoursesPage.ts       # Courses listing & catalog
├── tests/                   # Test specs executed via Playwright Test Runner
│   ├── navigation.spec.ts   # Navigation across views
│   ├── auth.spec.ts         # Login dialog & registration triggers
│   ├── courses.spec.ts      # Courses page verification
│   └── channels.spec.ts     # Sidebar channels & General feed
├── scripts/
│   └── run-smoke-automation.ts # Standalone automation runner with screenshot capture
├── screenshots/             # Captured execution screenshots
├── playwright.config.ts     # Playwright configuration
├── tsconfig.json            # TypeScript configuration
└── package.json             # Scripts & dependencies
```

## 🚀 How to Run

### Member automation credentials
The member automation uses environment variables instead of storing credentials in the project. Set these in PowerShell before running `npm run add-members` or the member-automation test:
```powershell
$env:ADMIN_EMAIL="your-admin-email"
$env:ADMIN_PASSWORD="your-admin-password"
$env:MEMBER_PASSWORD="password-for-new-members"
```

### 1. Run the Standalone Automation Script
Executes full automation flow and captures screenshots in the `screenshots/` directory:
```bash
npm run automate
```
Or in **headed mode** (see the browser in action):
```bash
$env:HEADED="1"; npm run automate
```

### 2. Run Playwright E2E Tests
Run all test suites:
```bash
npm test
```

Run tests in headed mode:
```bash
npm run test:headed
```

Run tests with interactive Playwright UI:
```bash
npm run test:ui
```

View the HTML test report:
```bash
npm run test:report
```
