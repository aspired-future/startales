const { chromium } = require('playwright');

async function testEducationFix() {
  console.log('🎓 Testing Corrected Education Organization...');
  
  const browser = await chromium.launch({ headless: false });
  const page = await browser.newPage();
  
  try {
    // Wait for server to start
    console.log('⏳ Waiting for server to start...');
    await new Promise(resolve => setTimeout(resolve, 5000));
    
    // Try both ports to see which one works
    let serverUrl = null;
    for (const port of [5174, 5173]) {
      try {
        console.log(`🔍 Checking port ${port}...`);
        await page.goto(`http://localhost:${port}`, { timeout: 3000 });
        serverUrl = `http://localhost:${port}`;
        console.log(`✅ Server found on port ${port}`);
        break;
      } catch (err) {
        console.log(`❌ Port ${port} not responding`);
      }
    }
    
    if (!serverUrl) {
      console.log('❌ No server found on either port');
      return;
    }
    
    await page.waitForTimeout(3000);
    
    // Test 1: Verify Education is back in Population
    console.log('\n👥 Testing Education in Population Menu...');
    const populationAccordion = await page.$('text=POPULATION');
    if (populationAccordion) {
      console.log('✅ Found POPULATION accordion');
      await populationAccordion.click();
      await page.waitForTimeout(1000);
      
      const educationInPopulation = await page.$('text=Education');
      if (educationInPopulation) {
        console.log('✅ Education correctly found in Population menu');
        await educationInPopulation.click();
        await page.waitForTimeout(2000);
        
        const educationScreenTitle = await page.$('h1');
        if (educationScreenTitle) {
          const titleText = await educationScreenTitle.textContent();
          console.log(`📺 Education screen loaded: "${titleText}"`);
          
          // Check for education tabs
          const tabs = await page.$$('.tab-btn');
          console.log(`📊 Found ${tabs.length} education tabs`);
          
          // Check if it's the full education system (not just research)
          const overviewTab = await page.$('button:has-text("Overview")');
          if (overviewTab) {
            await overviewTab.click();
            await page.waitForTimeout(1000);
            console.log('✅ Education system includes full overview (not just research)');
          }
        }
      } else {
        console.log('❌ Education NOT found in Population menu');
      }
    } else {
      console.log('❌ POPULATION accordion not found');
    }
    
    // Test 2: Verify University Research is in Science & Tech
    console.log('\n🔬 Testing University Research in Science & Tech Menu...');
    const scienceAccordion = await page.$('text=SCIENCE & TECH');
    if (scienceAccordion) {
      console.log('✅ Found SCIENCE & TECH accordion');
      await scienceAccordion.click();
      await page.waitForTimeout(1000);
      
      const universityResearch = await page.$('text=University Research');
      if (universityResearch) {
        console.log('✅ University Research correctly found in Science & Tech menu');
        await universityResearch.click();
        await page.waitForTimeout(2000);
        
        const researchScreenTitle = await page.$('h1');
        if (researchScreenTitle) {
          const titleText = await researchScreenTitle.textContent();
          console.log(`📺 University Research screen loaded: "${titleText}"`);
        }
      } else {
        console.log('❌ University Research NOT found in Science & Tech menu');
      }
    } else {
      console.log('❌ SCIENCE & TECH accordion not found');
    }
    
    console.log('\n📋 Corrected Organization:');
    console.log('👥 Population → Education: K-12 schools, curriculum, student management');
    console.log('🔬 Science & Tech → University Research: Academic R&D, scholarly research');
    console.log('🔬 Science & Tech → Government R&D: National research priorities');
    console.log('🔬 Science & Tech → Corporate R&D: Commercial innovation');
    console.log('🔬 Science & Tech → Classified Projects: Security clearance research');
    
    // Take a screenshot
    console.log('\n📸 Taking screenshot...');
    await page.screenshot({ path: 'temp_dev/education_fix_test.png', fullPage: true });
    console.log('📸 Screenshot saved to temp_dev/education_fix_test.png');
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
  } finally {
    await browser.close();
  }
}

testEducationFix();
