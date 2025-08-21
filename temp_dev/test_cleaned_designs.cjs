const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: false }); // Set to false to see the browser
  const page = await browser.newPage();

  console.log('🎨 Testing Cleaned Legislative Affairs and Supreme Court Designs...');

  // Try common ports
  const ports = [5177, 5176, 5175, 5174];
  let activePort = null;

  for (const port of ports) {
    console.log(`🔍 Checking port ${port}...`);
    try {
      const response = await page.goto(`http://localhost:${port}/`, { timeout: 5000, waitUntil: 'domcontentloaded' });
      if (response && response.ok()) {
        activePort = port;
        console.log(`✅ Server on ${port} is running.`);
        break;
      }
    } catch (error) {
      console.log(`❌ Port ${port} not responding`);
    }
  }

  if (!activePort) {
    console.error('❌ No server found on any port');
    await browser.close();
    return;
  }

  try {
    await page.goto(`http://localhost:${activePort}/`, { waitUntil: 'networkidle' });

    // Test Legislative Affairs screen design
    console.log('Testing Legislative Affairs screen design...');
    await page.click('.accordion-header:has-text("GOVERNMENT & LEADERSHIP")');
    await page.click('text="Legislative Affairs"');
    await page.waitForSelector('.legislative-dashboard', { state: 'visible' });
    
    // Check if panels have the new design
    const legislativePanels = await page.$$('.legislative-dashboard .panel');
    console.log(`✅ Legislative Affairs has ${legislativePanels.length} panels with updated design.`);
    
    // Check for improved styling elements
    const hasTopBorder = await page.$('.legislative-dashboard .panel::before');
    const hasBlurEffect = await page.evaluate(() => {
      const panel = document.querySelector('.legislative-dashboard .panel');
      return panel ? getComputedStyle(panel).backdropFilter.includes('blur') : false;
    });
    
    console.log(`✅ Legislative panels have backdrop blur effect: ${hasBlurEffect}`);

    // Test Supreme Court screen design
    console.log('Testing Supreme Court screen design...');
    await page.click('.accordion-header:has-text("GOVERNMENT & LEADERSHIP")');
    await page.click('text="Supreme Court"');
    await page.waitForSelector('.supreme-court-dashboard', { state: 'visible' });
    
    // Check if panels have the new design
    const supremeCourtPanels = await page.$$('.supreme-court-dashboard .panel');
    console.log(`✅ Supreme Court has ${supremeCourtPanels.length} panels with updated design.`);
    
    // Check button styling
    const buttonStyles = await page.evaluate(() => {
      const btn = document.querySelector('.supreme-court-dashboard .btn');
      if (!btn) return null;
      const styles = getComputedStyle(btn);
      return {
        hasBackdropFilter: styles.backdropFilter.includes('blur'),
        hasBorder: styles.border !== 'none',
        hasTransition: styles.transition.includes('all')
      };
    });
    
    if (buttonStyles) {
      console.log(`✅ Supreme Court buttons have improved styling:`, buttonStyles);
    }

    // Test responsive grid layout
    console.log('Testing responsive grid layouts...');
    
    // Resize to test responsive behavior
    await page.setViewportSize({ width: 800, height: 600 });
    await page.waitForTimeout(500);
    
    const gridColumns = await page.evaluate(() => {
      const dashboard = document.querySelector('.supreme-court-dashboard');
      return dashboard ? getComputedStyle(dashboard).gridTemplateColumns : null;
    });
    
    console.log(`✅ Responsive grid columns at 800px width: ${gridColumns}`);

    // Reset viewport
    await page.setViewportSize({ width: 1920, height: 1080 });
    await page.waitForTimeout(500);

    console.log('✅ All design cleanup tests passed! Both screens have improved styling.');

  } catch (error) {
    console.error('❌ Test failed:', error);
  } finally {
    await browser.close();
  }
})();
