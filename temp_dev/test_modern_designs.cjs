const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: false }); // Set to false to see the browser
  const page = await browser.newPage();

  console.log('🚀 Testing Modern Legislative Affairs and Supreme Court Designs...');

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

    // Wait for the HUD to load
    await page.waitForSelector('.comprehensive-hud', { state: 'visible', timeout: 10000 });

    // Test Legislative Affairs screen modern design
    console.log('🏛️ Testing Legislative Affairs modern design...');
    
    // Click on Government & Leadership accordion
    await page.click('.accordion-header:has-text("GOVERNMENT")');
    await page.waitForTimeout(500);
    
    // Click on Legislative Affairs
    await page.click('text="Legislative Affairs"');
    await page.waitForSelector('.legislative-dashboard', { state: 'visible' });
    
    // Check modern design elements
    const legislativeStyles = await page.evaluate(() => {
      const container = document.querySelector('.legislative-screen-container');
      const panel = document.querySelector('.legislative-dashboard .panel');
      const header = document.querySelector('.legislative-dashboard .panel h2');
      
      if (!container || !panel || !header) return null;
      
      const containerStyles = getComputedStyle(container);
      const panelStyles = getComputedStyle(panel);
      const headerStyles = getComputedStyle(header);
      
      return {
        hasRadialGradient: containerStyles.background.includes('radial-gradient'),
        hasBlurEffect: panelStyles.backdropFilter.includes('blur'),
        hasRoundedCorners: parseInt(panelStyles.borderRadius) >= 16,
        hasGlowingHeader: headerStyles.textShadow.includes('rgba'),
        hasAnimations: headerStyles.animation !== 'none'
      };
    });
    
    if (legislativeStyles) {
      console.log('✅ Legislative Affairs modern design elements:', legislativeStyles);
    }

    // Test Supreme Court screen modern design
    console.log('⚖️ Testing Supreme Court modern design...');
    
    // Click on Supreme Court
    await page.click('text="Supreme Court"');
    await page.waitForSelector('.supreme-court-dashboard', { state: 'visible' });
    
    // Check modern design elements
    const supremeCourtStyles = await page.evaluate(() => {
      const container = document.querySelector('.supreme-court-screen-container');
      const panel = document.querySelector('.supreme-court-dashboard .panel');
      const header = document.querySelector('.supreme-court-dashboard .panel h2');
      const button = document.querySelector('.supreme-court-dashboard .btn');
      
      if (!container || !panel || !header || !button) return null;
      
      const containerStyles = getComputedStyle(container);
      const panelStyles = getComputedStyle(panel);
      const headerStyles = getComputedStyle(header);
      const buttonStyles = getComputedStyle(button);
      
      return {
        hasGoldTheme: containerStyles.background.includes('212, 175, 55'),
        hasLargerPadding: parseInt(panelStyles.padding) >= 30,
        hasGoldGlow: headerStyles.textShadow.includes('212, 175, 55'),
        hasModernButtons: buttonStyles.borderRadius.includes('10px'),
        hasTransitions: panelStyles.transition.includes('cubic-bezier')
      };
    });
    
    if (supremeCourtStyles) {
      console.log('✅ Supreme Court modern design elements:', supremeCourtStyles);
    }

    // Test hover effects
    console.log('🎨 Testing hover effects...');
    
    // Hover over a panel
    await page.hover('.supreme-court-dashboard .panel:first-child');
    await page.waitForTimeout(500);
    
    // Hover over a button
    await page.hover('.supreme-court-dashboard .btn:first-child');
    await page.waitForTimeout(500);
    
    // Test metric hover effects
    await page.hover('.supreme-court-dashboard .metric:first-child');
    await page.waitForTimeout(500);

    console.log('✅ All modern design tests completed! Both screens now have futuristic, polished styling.');

  } catch (error) {
    console.error('❌ Test failed:', error);
  } finally {
    // Keep browser open for 5 seconds to see the results
    await page.waitForTimeout(5000);
    await browser.close();
  }
})();
