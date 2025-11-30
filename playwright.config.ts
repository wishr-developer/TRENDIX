import { defineConfig, devices } from '@playwright/test';

/**
 * Playwright設定ファイル
 * E2Eテストの実行環境を定義
 */
export default defineConfig({
  // テストファイルの場所
  testDir: './tests',
  
  // テストのタイムアウト（30秒）
  timeout: 30 * 1000,
  
  // テストの期待値（アサーション）のタイムアウト（5秒）
  expect: {
    timeout: 5000,
  },
  
  // テストの実行方法
  fullyParallel: true,
  
  // CI環境での失敗時に再試行しない
  forbidOnly: !!process.env.CI,
  
  // CI環境でのみ失敗時に再試行
  retries: process.env.CI ? 2 : 0,
  
  // 並列実行するワーカー数
  workers: process.env.CI ? 1 : undefined,
  
  // レポーター設定
  reporter: 'html',
  
  // 共有設定
  use: {
    // ベースURL（開発サーバーのURL）
    baseURL: process.env.PLAYWRIGHT_TEST_BASE_URL || 'http://localhost:3000',
    
    // アクションのタイムアウト（10秒）
    actionTimeout: 10 * 1000,
    
    // スクリーンショットの設定
    screenshot: 'only-on-failure',
    
    // 動画の設定
    video: 'retain-on-failure',
    
    // トレースの設定（失敗時のみ）
    trace: 'on-first-retry',
  },

  // プロジェクト設定（複数のブラウザでテストを実行）
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },
    // モバイルテスト（オプション）
    {
      name: 'Mobile Chrome',
      use: { ...devices['Pixel 5'] },
    },
    {
      name: 'Mobile Safari',
      use: { ...devices['iPhone 12'] },
    },
  ],

  // 開発サーバーの設定（Next.js）
  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
    timeout: 120 * 1000,
  },
});

