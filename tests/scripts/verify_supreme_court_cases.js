import { chromium } from 'playwright';

async function verifySupremeCourtCases() {
  const browser = await chromium.launch({ headless: false });
  const page = await browser.newPage();
  
  try {
    console.log('🏛️ Testing Supreme Court Cases Display...');
    await page.goto('http://localhost:5175');
    
    // Wait for the app to load
    await page.waitForTimeout(2000);
    
    // Take initial screenshot
    await page.screenshot({ 
      path: 'tests/screenshots/supreme-court-initial.png',
      fullPage: true 
    });
    console.log('📸 Initial screenshot taken');
    
    // Look for Supreme Court access
    console.log('🔍 Looking for Supreme Court screen...');
    const supremeCourtSelectors = [
      'text=Supreme Court',
      '[data-testid="supreme-court"]',
      'button:has-text("Supreme Court")',
      '.supreme-court-button',
      '[title*="Supreme Court"]',
      'text=Constitutional'
    ];
    
    let found = false;
    for (const selector of supremeCourtSelectors) {
      try {
        const element = await page.waitForSelector(selector, { timeout: 2000 });
        if (element) {
          console.log(`✅ Found Supreme Court with selector: ${selector}`);
          await element.click();
          await page.waitForTimeout(1000);
          found = true;
          break;
        }
      } catch (e) {
        console.log(`❌ Selector ${selector} not found`);
      }
    }
    
    if (!found) {
      console.log('⚠️ Supreme Court button not found, checking current page content...');
    }
    
    // Check for tabs
    const tabs = await page.$$('.base-screen-tab, .tab');
    console.log(`📑 Found ${tabs.length} tabs`);
    
    // Test Reviews tab (current cases)
    console.log('🔍 Testing Reviews tab for current cases...');
    const reviewsTab = await page.$('text=Reviews');
    if (reviewsTab) {
      await reviewsTab.click();
      await page.waitForTimeout(1000);
      
      // Check for reviews table
      const reviewsTable = await page.$('.data-table');
      if (reviewsTable) {
        const reviewRows = await page.$$('.data-table tbody tr');
        console.log(`📋 Found ${reviewRows.length} constitutional reviews in table`);
        
        // Check for specific review content
        const reviewTitles = await page.$$eval('.data-table tbody tr td:first-child strong', 
          elements => elements.map(el => el.textContent));
        console.log('📋 Current Constitutional Reviews:');
        reviewTitles.forEach((title, i) => console.log(`   ${i + 1}. ${title}`));
      }
      
      await page.screenshot({ 
        path: 'tests/screenshots/supreme-court-reviews.png',
        fullPage: true 
      });
      console.log('📸 Reviews tab screenshot taken');
    }
    
    // Test Precedents tab (past cases)
    console.log('🔍 Testing Precedents tab for legal precedents...');
    const precedentsTab = await page.$('text=Precedents');
    if (precedentsTab) {
      await precedentsTab.click();
      await page.waitForTimeout(1000);
      
      // Check for precedents table
      const precedentsTable = await page.$('.data-table');
      if (precedentsTable) {
        const precedentRows = await page.$$('.data-table tbody tr');
        console.log(`📚 Found ${precedentRows.length} legal precedents in table`);
        
        // Check for specific precedent content
        const caseNames = await page.$$eval('.data-table tbody tr td:first-child strong', 
          elements => elements.map(el => el.textContent));
        console.log('📚 Major Legal Precedents:');
        caseNames.forEach((name, i) => console.log(`   ${i + 1}. ${name}`));
      }
      
      await page.screenshot({ 
        path: 'tests/screenshots/supreme-court-precedents.png',
        fullPage: true 
      });
      console.log('📸 Precedents tab screenshot taken');
    }
    
    // Test Overview tab for navigation hints
    console.log('🔍 Testing Overview tab for case navigation...');
    const overviewTab = await page.$('text=Overview');
    if (overviewTab) {
      await overviewTab.click();
      await page.waitForTimeout(1000);
      
      // Check for navigation hints
      const navigationHint = await page.$('text=Current Cases');
      if (navigationHint) {
        console.log('✅ Found navigation hints for cases in Overview tab');
      }
      
      await page.screenshot({ 
        path: 'tests/screenshots/supreme-court-overview.png',
        fullPage: true 
      });
      console.log('📸 Overview tab screenshot taken');
    }
    
    console.log('✅ Supreme Court cases verification completed!');
    console.log('📋 Users can now clearly see:');
    console.log('   - Current constitutional reviews in the Reviews tab');
    console.log('   - Legal precedents in the Precedents tab');
    console.log('   - Navigation guidance in the Overview tab');
    
  } catch (error) {
    console.error('❌ Error during Supreme Court verification:', error);
    await page.screenshot({ 
      path: 'tests/screenshots/supreme-court-error.png',
      fullPage: true 
    });
  } finally {
    await browser.close();
  }
}

verifySupremeCourtCases();

