import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './e2e',
  timeout: 120_000,
  expect: { timeout: 10_000 },
  fullyParallel: false,
  retries: process.env['CI'] ? 2 : 0,
  reporter: [['list']],
  use: {
    baseURL: 'http://localhost:4200',
    trace: 'retain-on-failure',
    headless: true,
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
  webServer: [
    {
      command: 'npm start',
      cwd: './frontend',
      port: 4200,
      reuseExistingServer: true,
      timeout: 180_000,
    },
    {
      command: 'npm start',
      cwd: './backend',
      port: 4000,
      reuseExistingServer: true,
      timeout: 120_000,
    },
  ],
});
