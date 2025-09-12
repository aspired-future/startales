import { test, expect } from '@playwright/test';

test.describe('WhoseApp Message Buttons Test', () => {
  test('Check if Message and Call buttons exist', async ({ page }) => {
    // Capture console messages
    page.on('console', msg => {
      console.log(`BROWSER: ${msg.type()}: ${msg.text()}`);
    });

    await page.goto('http://localhost:5174');
    await page.waitForLoadState('networkidle');
    
    // Click the correct WhoseApp button
    const whoseAppButton = page.locator('.quick-access-btn').filter({ hasText: 'WhoseApp' });
    await whoseAppButton.click();
    await page.waitForTimeout(3000);
    
    console.log('=== Checking for Message/Call buttons ===');
    
    // Look for Message buttons
    const messageButtons = await page.locator('text=💬 Message').all();
    console.log(`Found ${messageButtons.length} Message buttons`);
    
    // Look for Call buttons  
    const callButtons = await page.locator('text=📞 Call').all();
    console.log(`Found ${callButtons.length} Call buttons`);
    
    // Check if buttons exist but are hidden
    const hiddenMessageButtons = await page.locator('button:has-text("💬 Message")').all();
    console.log(`Found ${hiddenMessageButtons.length} Message buttons (including hidden)`);
    
    const hiddenCallButtons = await page.locator('button:has-text("📞 Call")').all();
    console.log(`Found ${hiddenCallButtons.length} Call buttons (including hidden)`);
    
    // Check table structure
    const tableRows = await page.locator('table.standard-data-table tbody tr').all();
    console.log(`Found ${tableRows.length} table rows`);
    
    if (tableRows.length > 0) {
      const firstRow = tableRows[0];
      const cells = await firstRow.locator('td').all();
      console.log(`First row has ${cells.length} cells`);
      
      // Check if last cell (Actions) has buttons
      if (cells.length >= 6) {
        const actionsCell = cells[5]; // Actions column should be 6th (index 5)
        const buttonsInCell = await actionsCell.locator('button').all();
        console.log(`Actions cell has ${buttonsInCell.length} buttons`);
        
        for (let i = 0; i < buttonsInCell.length; i++) {
          const buttonText = await buttonsInCell[i].textContent();
          const isVisible = await buttonsInCell[i].isVisible();
          console.log(`Button ${i}: "${buttonText}" - Visible: ${isVisible}`);
        }
      }
    }
    
    // Take screenshot for debugging
    await page.screenshot({ path: 'temp_dev/message-buttons-debug.png', fullPage: true });
    console.log('Debug screenshot saved');
    
    // Try to scroll the table horizontally if needed
    const table = page.locator('table.standard-data-table');
    if (await table.count() > 0) {
      await table.scrollIntoView();
      await page.keyboard.press('End'); // Try to scroll to the right
      await page.waitForTimeout(1000);
      
      await page.screenshot({ path: 'temp_dev/message-buttons-after-scroll.png', fullPage: true });
      console.log('After scroll screenshot saved');
      
      // Check again after scroll
      const messageButtonsAfterScroll = await page.locator('text=💬 Message').all();
      console.log(`After scroll: Found ${messageButtonsAfterScroll.length} visible Message buttons`);
    }
  });
});
