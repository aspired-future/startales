import { test, expect } from '@playwright/test';

test('Professions Screen Test', async ({ page }) => {
  await page.goto('http://localhost:5173/');
  await page.waitForSelector('body', { timeout: 10000 });
  
  // Navigate to Professions screen
  await page.locator('text=👥POPULATION▶').click();
  await page.waitForTimeout(1000);
  await page.locator('.nav-item:has-text("💼 Professions")').click();
  await page.waitForTimeout(3000);
  
  // Check if screen loads
  await page.waitForSelector('text=Professions & Careers', { timeout: 10000 });
  console.log('✅ Professions screen loaded');
  
  // Check for tabs
  const overviewTab = await page.locator('.base-screen-tab:has-text("Overview")').count();
  console.log(`📊 Overview tab found: ${overviewTab}`);
  expect(overviewTab).toBeGreaterThan(0);
  
  const professionsTab = await page.locator('.base-screen-tab:has-text("Professions")').count();
  console.log(`💼 Professions tab found: ${professionsTab}`);
  expect(professionsTab).toBeGreaterThan(0);
  
  // Check for data in overview
  const totalEmployed = await page.locator('text=158,000,000').count();
  console.log(`👥 Total employed elements: ${totalEmployed}`);
  expect(totalEmployed).toBeGreaterThan(0);
  
  // Test tab switching
  await page.locator('.base-screen-tab:has-text("Professions")').click();
  await page.waitForTimeout(2000);
  
  const softwareEngineer = await page.locator('text=Software Engineer').count();
  console.log(`💻 Software Engineer elements: ${softwareEngineer}`);
  expect(softwareEngineer).toBeGreaterThan(0);
  
  // Test unemployment tab
  await page.locator('.base-screen-tab:has-text("Unemployment")').click();
  await page.waitForTimeout(2000);
  
  const unemploymentRate = await page.locator('text=3.8%').count();
  console.log(`📉 Unemployment rate elements: ${unemploymentRate}`);
  expect(unemploymentRate).toBeGreaterThan(0);
  
  // Test careers tab
  await page.locator('.base-screen-tab:has-text("Careers")').click();
  await page.waitForTimeout(2000);
  
  const dataScientist = await page.locator('text=Data Scientist').count();
  console.log(`🔬 Data Scientist elements: ${dataScientist}`);
  expect(dataScientist).toBeGreaterThan(0);
  
  // Test analytics tab
  await page.locator('.base-screen-tab:has-text("Analytics")').click();
  await page.waitForTimeout(2000);
  
  const pythonSkill = await page.locator('text=Python').count();
  console.log(`🐍 Python skill elements: ${pythonSkill}`);
  expect(pythonSkill).toBeGreaterThan(0);
  
  await page.screenshot({ path: 'tests/screenshots/professions-test.png', fullPage: true });
  console.log('✅ All Professions screen tests passed!');
});

