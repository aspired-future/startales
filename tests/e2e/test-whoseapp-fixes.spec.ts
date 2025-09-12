import { test, expect } from '@playwright/test';

test.describe('WhoseApp Fixes Verification', () => {
  test('Should have CONVERSATIONS as default tab and no duplicate screens', async ({ page }) => {
    // Capture console messages
    page.on('console', msg => {
      console.log(`BROWSER: ${msg.type()}: ${msg.text()}`);
    });

    await page.goto('http://localhost:5174');
    await page.waitForLoadState('networkidle');
    
    console.log('=== STEP 1: Click WhoseApp button ===');
    
    // Click WhoseApp button
    const whoseAppButton = page.locator('.quick-access-btn').filter({ hasText: 'WhoseApp' });
    await whoseAppButton.click();
    await page.waitForTimeout(3000);
    
    console.log('=== STEP 2: Check for duplicate screens ===');
    
    // Count WhoseApp headers/titles
    const whoseAppHeaders = await page.locator('text=WhoseApp').all();
    console.log(`Found ${whoseAppHeaders.length} WhoseApp headers`);
    
    // Count tab bars (should be only 1)
    const tabBars = await page.locator('.tab-bar, .tabs-container').all();
    console.log(`Found ${tabBars.length} tab bars`);
    
    // Count CONVERSATIONS tabs
    const conversationTabs = await page.locator('text=CONVERSATIONS').all();
    console.log(`Found ${conversationTabs.length} CONVERSATIONS tabs`);
    
    // Count CHARACTERS tabs  
    const characterTabs = await page.locator('text=CHARACTERS').all();
    console.log(`Found ${characterTabs.length} CHARACTERS tabs`);
    
    console.log('=== STEP 3: Verify CONVERSATIONS is active/default ===');
    
    // Check if CONVERSATIONS tab is active
    const activeConversationsTab = page.locator('.tab-item.active').filter({ hasText: 'CONVERSATIONS' });
    const conversationsIsActive = await activeConversationsTab.count() > 0;
    console.log(`CONVERSATIONS tab is active: ${conversationsIsActive}`);
    
    // Check if CHARACTERS tab is active (should be false)
    const activeCharactersTab = page.locator('.tab-item.active').filter({ hasText: 'CHARACTERS' });
    const charactersIsActive = await activeCharactersTab.count() > 0;
    console.log(`CHARACTERS tab is active: ${charactersIsActive}`);
    
    // Take screenshot for verification
    await page.screenshot({ path: 'temp_dev/whoseapp-fixes-verification.png', fullPage: true });
    
    console.log('=== STEP 4: Verify conversation content is shown ===');
    
    // Look for conversation-related content
    const conversationContent = await page.locator('text=Dr. Marcus Chen, text=Message content, text=Ambassador').all();
    console.log(`Found ${conversationContent.length} conversation content elements`);
    
    // Check that we're not showing character directory by default
    const characterDirectory = await page.locator('text=Character Directory').all();
    console.log(`Found ${characterDirectory.length} Character Directory headers (should be 0 if conversations is default)`);
    
    console.log('=== VERIFICATION RESULTS ===');
    console.log(`✅ Single WhoseApp instance: ${whoseAppHeaders.length === 1 ? 'PASS' : 'FAIL'}`);
    console.log(`✅ Single tab bar: ${tabBars.length === 1 ? 'PASS' : 'FAIL'}`);
    console.log(`✅ CONVERSATIONS is default: ${conversationsIsActive ? 'PASS' : 'FAIL'}`);
    console.log(`✅ CHARACTERS not default: ${!charactersIsActive ? 'PASS' : 'FAIL'}`);
    console.log(`✅ No duplicate tabs: ${conversationTabs.length === 1 && characterTabs.length === 1 ? 'PASS' : 'FAIL'}`);
    
    // Assertions for the test
    expect(whoseAppHeaders.length).toBe(1);
    expect(conversationsIsActive).toBe(true);
    expect(charactersIsActive).toBe(false);
  });
});
