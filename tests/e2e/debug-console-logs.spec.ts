import { test, expect } from '@playwright/test';

test.describe('WhoseApp Console Debug', () => {
  test('Check console logs for WhoseApp forcing', async ({ page }) => {
    // Capture all console messages
    const consoleMessages: string[] = [];
    page.on('console', msg => {
      const message = `${msg.type()}: ${msg.text()}`;
      consoleMessages.push(message);
      console.log(`BROWSER: ${message}`);
    });

    await page.goto('http://localhost:5174');
    await page.waitForLoadState('networkidle');
    
    console.log('=== Looking for WhoseApp button ===');
    const whoseAppButton = page.locator('text=📞 WhoseApp').first();
    await whoseAppButton.click();
    
    // Wait for any console logs from our forcing logic
    await page.waitForTimeout(3000);
    
    console.log('=== Console Messages Analysis ===');
    const forcingLogs = consoleMessages.filter(msg => msg.includes('WhoseApp: Forcing'));
    console.log(`Found ${forcingLogs.length} forcing logs:`);
    forcingLogs.forEach(log => console.log(`  ${log}`));
    
    const victoriaLogs = consoleMessages.filter(msg => msg.includes('Victoria Chang'));
    console.log(`Found ${victoriaLogs.length} Victoria Chang logs:`);
    victoriaLogs.forEach(log => console.log(`  ${log}`));
    
    // Check what's actually visible
    const characterElements = await page.locator('text=Elena, text=Marcus, text=Sarah, text=Ambassador, text=General, text=Dr.').all();
    console.log(`Character elements visible: ${characterElements.length}`);
    
    const messageButtons = await page.locator('text=💬 Message').all();
    console.log(`Message buttons visible: ${messageButtons.length}`);
    
    // Take final screenshot
    await page.screenshot({ path: 'temp_dev/debug-console-final.png', fullPage: true });
    console.log('Final screenshot saved');
  });
});
