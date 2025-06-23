import { test, expect, Page } from '@playwright/test';

test.describe('AfriPay User Journey', () => {
  let page: Page;

  test.beforeEach(async ({ browser }) => {
    page = await browser.newPage();
    await page.goto('http://localhost:5000');
  });

  test('complete user registration and wallet setup', async () => {
    // Navigate to landing page
    await expect(page.locator('h1')).toContainText('AfriPay');
    
    // Check if login is required
    const loginButton = page.locator('button:has-text("Login")');
    if (await loginButton.isVisible()) {
      await loginButton.click();
      // Handle Replit Auth flow
      await page.waitForURL(/.*replit\.com.*/, { timeout: 10000 });
      // This would require actual auth credentials in real testing
    }

    // After successful login, check dashboard
    await expect(page.locator('[data-testid="wallet-balance"]')).toBeVisible();
    await expect(page.locator('[data-testid="recent-transactions"]')).toBeVisible();
  });

  test('wallet balance display and transactions', async () => {
    // Assuming user is authenticated
    await page.goto('http://localhost:5000/');
    
    // Check wallet balance is displayed
    const balanceElement = page.locator('[data-testid="wallet-balance"]');
    await expect(balanceElement).toBeVisible();
    
    // Navigate to transactions
    await page.click('[data-testid="nav-transactions"]');
    await expect(page.locator('[data-testid="transactions-list"]')).toBeVisible();
  });

  test('QR code payment flow', async () => {
    await page.goto('http://localhost:5000/qr');
    
    // Check QR scanner is available
    await expect(page.locator('[data-testid="qr-scanner"]')).toBeVisible();
    
    // Test QR generation
    const generateButton = page.locator('button:has-text("Generate QR")');
    if (await generateButton.isVisible()) {
      await generateButton.click();
      await expect(page.locator('[data-testid="generated-qr"]')).toBeVisible();
    }
  });

  test('role switching functionality', async () => {
    await page.goto('http://localhost:5000/');
    
    // Look for role switcher
    const roleSwitcher = page.locator('[data-testid="role-switcher"]');
    if (await roleSwitcher.isVisible()) {
      await roleSwitcher.click();
      
      // Switch to merchant role
      await page.click('text=Merchant');
      await expect(page.locator('text=Merchant Dashboard')).toBeVisible();
      
      // Switch to agent role
      await roleSwitcher.click();
      await page.click('text=Agent');
      await expect(page.locator('text=Agent Dashboard')).toBeVisible();
    }
  });

  test('services integration', async () => {
    await page.goto('http://localhost:5000/services');
    
    // Check service categories
    await expect(page.locator('text=Bill Payments')).toBeVisible();
    await expect(page.locator('text=Shopping')).toBeVisible();
    await expect(page.locator('text=Ride Hailing')).toBeVisible();
    
    // Test shopping marketplace
    await page.click('text=Shopping');
    await expect(page.locator('[data-testid="product-grid"]')).toBeVisible();
  });

  test('e-commerce delivery flow', async () => {
    await page.goto('http://localhost:5000/services');
    
    // Navigate to AfriMart
    await page.click('text=AfriMart');
    await expect(page.locator('text=Multi-Category Shopping')).toBeVisible();
    
    // Select food delivery
    await page.click('[data-testid="category-food"]');
    await expect(page.locator('[data-testid="restaurant-list"]')).toBeVisible();
    
    // Select a restaurant and add items
    const firstRestaurant = page.locator('[data-testid="restaurant-card"]').first();
    await firstRestaurant.click();
    
    // Add item to cart
    const addToCartButton = page.locator('button:has-text("Add to Cart")').first();
    if (await addToCartButton.isVisible()) {
      await addToCartButton.click();
      await expect(page.locator('[data-testid="cart-count"]')).toContainText('1');
    }
  });
});