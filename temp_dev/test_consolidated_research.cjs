const { chromium } = require('playwright');

async function testConsolidatedResearch() {
  console.log('🔬 Testing Consolidated Research Systems...');
  
  const browser = await chromium.launch({ headless: false });
  const page = await browser.newPage();
  
  try {
    // Navigate to the HUD
    console.log('📱 Navigating to HUD...');
    await page.goto('http://localhost:5173');
    await page.waitForTimeout(3000);
    
    // Test Science & Tech accordion
    console.log('\n🧪 Testing Science & Tech Consolidated Menu...');
    const scienceAccordion = await page.$('text=SCIENCE & TECH');
    if (scienceAccordion) {
      console.log('✅ Found "SCIENCE & TECH" accordion');
      await scienceAccordion.click();
      await page.waitForTimeout(1000);
      
      // Expected research systems
      const researchSystems = [
        { name: 'Government R&D', description: 'National research priorities' },
        { name: 'Corporate R&D', description: 'Commercial innovation' },
        { name: 'Academic Research', description: 'University research' },
        { name: 'Classified Projects', description: 'Restricted access research' },
        { name: 'Tech Systems', description: 'Technology infrastructure' },
        { name: 'Visual Systems', description: 'AI-generated content' }
      ];
      
      console.log('\n📋 Testing Research System Links:');
      let foundSystems = 0;
      
      for (const system of researchSystems) {
        const link = await page.$(`text=${system.name}`);
        if (link) {
          foundSystems++;
          console.log(`✅ Found "${system.name}" - ${system.description}`);
          
          // Test clicking the link
          await link.click();
          await page.waitForTimeout(2000);
          
          // Check if screen loaded
          const screenTitle = await page.$('h1');
          if (screenTitle) {
            const titleText = await screenTitle.textContent();
            console.log(`  📺 Screen loaded: "${titleText}"`);
            
            // Check for specific screen features
            if (system.name === 'Government R&D') {
              const tabs = await page.$$('.tab-btn');
              console.log(`    📊 Found ${tabs.length} tabs`);
            } else if (system.name === 'Corporate R&D') {
              const projectCards = await page.$$('.project-card');
              console.log(`    🏢 Found ${projectCards.length} project cards`);
            } else if (system.name === 'Academic Research') {
              const educationTabs = await page.$$('.tab-btn');
              console.log(`    🎓 Found ${educationTabs.length} education tabs`);
            } else if (system.name === 'Classified Projects') {
              const classificationBadges = await page.$$('.classification-badge');
              console.log(`    🔒 Found ${classificationBadges.length} classification badges`);
              
              // Check security warning
              const securityWarning = await page.$('.security-warning');
              if (securityWarning) {
                console.log('    ⚠️ Security warning displayed');
              }
            }
          } else {
            console.log(`  ❌ No screen title found for ${system.name}`);
          }
          
          // Go back to Science & Tech menu
          await scienceAccordion.click();
          await page.waitForTimeout(500);
        } else {
          console.log(`❌ Missing "${system.name}" link`);
        }
      }
      
      console.log(`\n📊 Research Systems Summary: ${foundSystems}/${researchSystems.length} systems found`);
      
      // Test classification levels
      console.log('\n🔐 Testing Classification System...');
      const classifiedLink = await page.$('text=Classified Projects');
      if (classifiedLink) {
        await classifiedLink.click();
        await page.waitForTimeout(2000);
        
        // Check classification tabs
        const classificationTabs = [
          'Restricted', 'Classified', 'Secret', 'Top Secret'
        ];
        
        let classificationTabsFound = 0;
        for (const tabName of classificationTabs) {
          const tab = await page.$(`button:has-text("${tabName}")`);
          if (tab) {
            classificationTabsFound++;
            console.log(`  🔒 Found ${tabName} classification level`);
          }
        }
        
        console.log(`📊 Classification levels: ${classificationTabsFound}/${classificationTabs.length} found`);
        
        // Test clearance system
        const clearanceBadge = await page.$('.classification-badge');
        if (clearanceBadge) {
          const clearanceText = await clearanceBadge.textContent();
          console.log(`  👤 User clearance level: ${clearanceText}`);
        }
      }
      
    } else {
      console.log('❌ SCIENCE & TECH accordion not found');
    }
    
    // Verify Education is no longer in Population
    console.log('\n👥 Verifying Education moved from Population...');
    const populationAccordion = await page.$('text=POPULATION');
    if (populationAccordion) {
      await populationAccordion.click();
      await page.waitForTimeout(1000);
      
      const educationInPopulation = await page.$('text=Education');
      if (educationInPopulation) {
        console.log('❌ Education still found in Population (should be moved to Science & Tech)');
      } else {
        console.log('✅ Education successfully moved from Population to Science & Tech');
      }
    }
    
    // Verify Corporate R&D is no longer in Economy
    console.log('\n💰 Verifying Corporate R&D moved from Economy...');
    const economyAccordion = await page.$('text=ECONOMY');
    if (economyAccordion) {
      await economyAccordion.click();
      await page.waitForTimeout(1000);
      
      const corpRnDInEconomy = await page.$('text=Corporate R&D');
      if (corpRnDInEconomy) {
        console.log('❌ Corporate R&D still found in Economy (should be moved to Science & Tech)');
      } else {
        console.log('✅ Corporate R&D successfully moved from Economy to Science & Tech');
      }
    }
    
    console.log('\n🎯 Consolidated Research Architecture:');
    console.log('🏛️ Government R&D: National priorities, defense, public health');
    console.log('🏢 Corporate R&D: Commercial innovation, private sector ROI');
    console.log('🎓 Academic Research: Universities, education, basic science');
    console.log('🔒 Classified Projects: Restricted access, security clearances');
    console.log('⚙️ Tech Systems: Infrastructure and operational technology');
    console.log('🎨 Visual Systems: AI-generated content and media');
    
    // Take a screenshot
    console.log('\n📸 Taking screenshot...');
    await page.screenshot({ path: 'temp_dev/consolidated_research_test.png', fullPage: true });
    console.log('📸 Screenshot saved to temp_dev/consolidated_research_test.png');
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
  } finally {
    await browser.close();
  }
}

testConsolidatedResearch();
