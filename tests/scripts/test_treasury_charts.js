import { chromium } from 'playwright';

async function testTreasuryCharts() {
  const browser = await chromium.launch({ headless: false });
  const page = await browser.newPage();
  
  try {
    console.log('📊 Testing Treasury Charts Implementation...');
    await page.goto('http://localhost:5175');
    
    // Wait for the app to load
    await page.waitForTimeout(3000);
    
    // Look for Treasury screen
    console.log('🔍 Looking for Treasury screen...');
    const treasurySelectors = [
      'text=Treasury',
      '[data-testid="treasury"]',
      'button:has-text("Treasury")',
      '.treasury-button',
      '[title*="Treasury"]'
    ];
    
    let found = false;
    for (const selector of treasurySelectors) {
      try {
        const element = await page.waitForSelector(selector, { timeout: 2000 });
        if (element) {
          console.log(`✅ Found Treasury with selector: ${selector}`);
          await element.click();
          await page.waitForTimeout(2000);
          found = true;
          break;
        }
      } catch (e) {
        console.log(`❌ Selector ${selector} not found`);
      }
    }
    
    if (!found) {
      console.log('⚠️ Treasury button not found, checking current page content...');
    }
    
    // Check for charts
    console.log('🔍 Checking for charts...');
    
    // Check for LineChart components
    const lineCharts = await page.$$('svg');
    console.log(`📈 Found ${lineCharts.length} SVG elements (potential charts)`);
    
    // Check for chart containers
    const chartContainers = await page.$$('[style*="height"]');
    console.log(`📦 Found ${chartContainers.length} elements with height styling`);
    
    // Check for specific chart types
    const revenueTrends = await page.$('text=Revenue Trends');
    if (revenueTrends) {
      console.log('✅ Revenue Trends chart found');
    } else {
      console.log('❌ Revenue Trends chart not found');
    }
    
    const budgetAllocation = await page.$('text=Budget Allocation');
    if (budgetAllocation) {
      console.log('✅ Budget Allocation chart found');
    } else {
      console.log('❌ Budget Allocation chart not found');
    }
    
    const departmentUtilization = await page.$('text=Department Utilization');
    if (departmentUtilization) {
      console.log('✅ Department Utilization chart found');
    } else {
      console.log('❌ Department Utilization chart not found');
    }
    
    // Test tab navigation to see charts in different tabs
    console.log('🔍 Testing tab navigation for charts...');
    const tabs = await page.$$('.base-screen-tab');
    console.log(`📑 Found ${tabs.length} tabs`);
    
    if (tabs.length > 0) {
      for (let i = 0; i < Math.min(tabs.length, 4); i++) {
        try {
          await tabs[i].click();
          await page.waitForTimeout(1500);
          console.log(`✅ Clicked tab ${i + 1}`);
          
          // Check for charts in this tab
          const svgInTab = await page.$$('svg');
          console.log(`📈 Tab ${i + 1} has ${svgInTab.length} SVG elements`);
          
          // Take screenshot of each tab
          await page.screenshot({ 
            path: `tests/screenshots/treasury-charts-tab-${i + 1}.png`,
            fullPage: true 
          });
        } catch (e) {
          console.log(`❌ Error clicking tab ${i + 1}:`, e.message);
        }
      }
    }
    
    // Check for chart data
    console.log('🔍 Checking for chart data...');
    const chartData = await page.$$eval('svg', (svgs) => {
      return svgs.map(svg => ({
        hasPaths: svg.querySelectorAll('path').length,
        hasRects: svg.querySelectorAll('rect').length,
        hasCircles: svg.querySelectorAll('circle').length,
        hasLines: svg.querySelectorAll('line').length
      }));
    });
    
    console.log('📊 Chart elements found:');
    chartData.forEach((data, index) => {
      console.log(`  Chart ${index + 1}: ${data.hasPaths} paths, ${data.hasRects} rects, ${data.hasCircles} circles, ${data.hasLines} lines`);
    });
    
    // Final screenshot
    await page.screenshot({ 
      path: 'tests/screenshots/treasury-charts-final.png',
      fullPage: true 
    });
    console.log('📸 Final screenshot taken');
    
    console.log('✅ Treasury charts test completed!');
    console.log('📊 Chart verification summary:');
    console.log(`   - SVG elements: ${lineCharts.length}`);
    console.log(`   - Chart containers: ${chartContainers.length}`);
    console.log(`   - Revenue Trends: ${revenueTrends ? 'Present' : 'Missing'}`);
    console.log(`   - Budget Allocation: ${budgetAllocation ? 'Present' : 'Missing'}`);
    console.log(`   - Department Utilization: ${departmentUtilization ? 'Present' : 'Missing'}`);
    
  } catch (error) {
    console.error('❌ Error during treasury charts test:', error);
    await page.screenshot({ 
      path: 'tests/screenshots/treasury-charts-error.png',
      fullPage: true 
    });
  } finally {
    await browser.close();
  }
}

testTreasuryCharts();

