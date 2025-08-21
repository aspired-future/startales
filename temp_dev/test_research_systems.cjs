const { chromium } = require('playwright');

async function testResearchSystems() {
  console.log('🔬 Testing Research Systems Organization...');
  
  const browser = await chromium.launch({ headless: false });
  const page = await browser.newPage();
  
  try {
    // Navigate to the HUD
    console.log('📱 Navigating to HUD...');
    await page.goto('http://localhost:5173');
    await page.waitForTimeout(3000);
    
    // Test 1: Check Science & Tech menu
    console.log('\n🧪 Testing Science & Tech Menu...');
    const scienceAccordion = await page.$('text=SCIENCE & TECH');
    if (scienceAccordion) {
      console.log('✅ Found "SCIENCE & TECH" accordion (renamed successfully)');
      await scienceAccordion.click();
      await page.waitForTimeout(1000);
      
      // Check for Government R&D
      const govRnD = await page.$('text=Government R&D');
      if (govRnD) {
        console.log('✅ Found "Government R&D" link');
        await govRnD.click();
        await page.waitForTimeout(2000);
        
        const screenTitle = await page.$('h1:has-text("Science & Technology Research")');
        if (screenTitle) {
          console.log('✅ Government R&D screen loads properly');
        } else {
          console.log('❌ Government R&D screen did not load');
        }
      } else {
        console.log('❌ Government R&D link not found');
      }
    } else {
      console.log('❌ SCIENCE & TECH accordion not found');
    }
    
    // Test 2: Check Corporate R&D in Economy menu
    console.log('\n🏢 Testing Corporate R&D in Economy Menu...');
    const economyAccordion = await page.$('text=ECONOMY');
    if (economyAccordion) {
      console.log('✅ Found ECONOMY accordion');
      await economyAccordion.click();
      await page.waitForTimeout(1000);
      
      const corpRnD = await page.$('text=Corporate R&D');
      if (corpRnD) {
        console.log('✅ Found "Corporate R&D" link in Economy section');
        await corpRnD.click();
        await page.waitForTimeout(2000);
        
        const corpScreenTitle = await page.$('h1:has-text("Corporate Research & Development")');
        if (corpScreenTitle) {
          console.log('✅ Corporate R&D screen loads properly');
          
          // Test the tabs
          const tabs = ['Overview', 'R&D Projects', 'Corporations', 'Partnerships', 'Patents & IP', 'Market Analysis'];
          let tabsFound = 0;
          
          for (const tabName of tabs) {
            const tab = await page.$(`button:has-text("${tabName}")`);
            if (tab) {
              tabsFound++;
              console.log(`  ✅ Found ${tabName} tab`);
            }
          }
          console.log(`📊 Corporate R&D has ${tabsFound}/${tabs.length} tabs`);
          
        } else {
          console.log('❌ Corporate R&D screen did not load');
        }
      } else {
        console.log('❌ Corporate R&D link not found in Economy section');
      }
    } else {
      console.log('❌ ECONOMY accordion not found');
    }
    
    // Test 3: Check Education in Population menu (for comparison)
    console.log('\n🎓 Testing Education in Population Menu...');
    const populationAccordion = await page.$('text=POPULATION');
    if (populationAccordion) {
      console.log('✅ Found POPULATION accordion');
      await populationAccordion.click();
      await page.waitForTimeout(1000);
      
      const education = await page.$('text=Education');
      if (education) {
        console.log('✅ Found "Education" link in Population section');
        await education.click();
        await page.waitForTimeout(2000);
        
        const eduScreenTitle = await page.$('h1:has-text("Education")');
        if (eduScreenTitle) {
          console.log('✅ Education screen loads properly (academic research)');
        } else {
          console.log('❌ Education screen did not load');
        }
      } else {
        console.log('❌ Education link not found in Population section');
      }
    } else {
      console.log('❌ POPULATION accordion not found');
    }
    
    console.log('\n📋 Research Systems Summary:');
    console.log('🏛️ Government R&D: National research priorities, military tech, public health');
    console.log('🏢 Corporate R&D: Commercial innovation, private sector projects, ROI-focused');
    console.log('🎓 Education: Academic research, universities, knowledge dissemination');
    
    // Take a screenshot
    console.log('\n📸 Taking screenshot...');
    await page.screenshot({ path: 'temp_dev/research_systems_test.png', fullPage: true });
    console.log('📸 Screenshot saved to temp_dev/research_systems_test.png');
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
  } finally {
    await browser.close();
  }
}

testResearchSystems();
