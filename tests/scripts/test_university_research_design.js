import { chromium } from 'playwright';

async function testUniversityResearchDesign() {
  const browser = await chromium.launch({ headless: false });
  const page = await browser.newPage();
  
  try {
    console.log('🔬 Testing University Research Screen Design...');
    await page.goto('http://localhost:5173');
    
    // Wait for the app to load
    await page.waitForTimeout(3000);
    
    // Look for Science & Tech button first
    console.log('🔍 Looking for Science & Tech button...');
    const scienceTechButton = await page.$('text=🔬SCIENCE & TECH');
    if (scienceTechButton) {
      console.log('✅ Found Science & Tech button');
      await scienceTechButton.click();
      await page.waitForTimeout(2000);
      
      // Now look for University Research screen
      console.log('🔍 Looking for University Research screen...');
      const researchSelectors = [
        'text=University Research',
        '[data-testid="university-research"]',
        'button:has-text("University Research")',
        '.university-research-button',
        '[title*="University Research"]'
      ];
      
      let found = false;
      for (const selector of researchSelectors) {
        try {
          const element = await page.waitForSelector(selector, { timeout: 2000 });
          if (element) {
            console.log(`✅ Found University Research with selector: ${selector}`);
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
        console.log('⚠️ University Research button not found, checking current page content...');
      }
    } else {
      console.log('❌ Science & Tech button not found');
    }

    // Check for standardized design elements
    console.log('🔍 Checking for standardized design elements...');
    
    // Check for standard screen container
    const screenContainer = await page.$('.standard-screen-container');
    if (screenContainer) {
      console.log('✅ Standard screen container found');
    } else {
      console.log('❌ Standard screen container not found');
    }
    
    // Check for academic theme
    const academicTheme = await page.$('.academic-theme');
    if (academicTheme) {
      console.log('✅ Academic theme applied');
    } else {
      console.log('❌ Academic theme not found');
    }
    
    // Check for standard dashboard
    const dashboard = await page.$('.standard-dashboard');
    if (dashboard) {
      console.log('✅ Standard dashboard found');
    } else {
      console.log('❌ Standard dashboard not found');
    }
    
    // Check for research-specific content
    console.log('🔍 Checking for research-specific content...');
    
    // Check for research overview
    const researchOverview = await page.$('text=Research Overview');
    if (researchOverview) {
      console.log('✅ Research Overview found');
    } else {
      console.log('❌ Research Overview not found');
    }
    
    // Check for research fields
    const researchFields = await page.$('text=Research Fields');
    if (researchFields) {
      console.log('✅ Research Fields found');
    } else {
      console.log('❌ Research Fields not found');
    }
    
    // Check for research metrics
    const metrics = await page.$$('.standard-metric');
    console.log(`📊 Found ${metrics.length} standard metrics`);
    
    // Check for tab navigation
    console.log('🔍 Checking tab navigation...');
    const tabs = await page.$$('.base-screen-tab');
    console.log(`📑 Found ${tabs.length} tabs`);
    
    if (tabs.length > 0) {
      console.log('🔍 Testing tab navigation...');
      const tabLabels = ['Overview', 'Research Projects', 'Universities', 'Collaborations'];
      
      for (let i = 0; i < Math.min(tabs.length, tabLabels.length); i++) {
        try {
          await tabs[i].click();
          await page.waitForTimeout(1000);
          console.log(`✅ Clicked tab: ${tabLabels[i]}`);
          
          // Check for content in this tab
          const tablesInTab = await page.$$('.standard-data-table');
          console.log(`📊 Tab ${tabLabels[i]} has ${tablesInTab.length} data tables`);
          
          // Take screenshot of each tab
          await page.screenshot({ 
            path: `tests/screenshots/university-research-${tabLabels[i].toLowerCase().replace(' ', '-')}.png`,
            fullPage: true 
          });
        } catch (e) {
          console.log(`❌ Error clicking tab ${tabLabels[i]}:`, e.message);
        }
      }
    }
    
    // Test specific tab content
    console.log('🔍 Testing Research Projects tab...');
    try {
      const projectsTab = await page.$('text=Research Projects');
      if (projectsTab) {
        await projectsTab.click();
        await page.waitForTimeout(1000);
        
        // Check for project information
        const projectTitle = await page.$('text=Quantum Computing Applications in Cryptography');
        if (projectTitle) {
          console.log('✅ Project title found');
        } else {
          console.log('❌ Project title not found');
        }
        
        // Check for field information
        const field = await page.$('text=Computer Science');
        if (field) {
          console.log('✅ Field information found');
        } else {
          console.log('❌ Field information not found');
        }
      }
    } catch (e) {
      console.log('❌ Error testing Research Projects tab:', e.message);
    }
    
    // Test Universities tab
    console.log('🔍 Testing Universities tab...');
    try {
      const universitiesTab = await page.$('text=Universities');
      if (universitiesTab) {
        await universitiesTab.click();
        await page.waitForTimeout(1000);
        
        // Check for university information
        const universityName = await page.$('text=Zephyrian Institute of Technology');
        if (universityName) {
          console.log('✅ University name found');
        } else {
          console.log('❌ University name not found');
        }
        
        // Check for research rating
        const rating = await page.$('text=9.2');
        if (rating) {
          console.log('✅ Research rating found');
        } else {
          console.log('❌ Research rating not found');
        }
      }
    } catch (e) {
      console.log('❌ Error testing Universities tab:', e.message);
    }



    // Test Collaborations tab
    console.log('🔍 Testing Collaborations tab...');
    try {
      const collaborationsTab = await page.$('text=Collaborations');
      if (collaborationsTab) {
        await collaborationsTab.click();
        await page.waitForTimeout(1000);
        
        // Check for collaboration information
        const collaboration = await page.$('text=Imperial Defense Labs');
        if (collaboration) {
          console.log('✅ Collaboration information found');
        } else {
          console.log('❌ Collaboration information not found');
        }
        
        // Check for partnership types
        const partnershipType = await page.$('text=Government');
        if (partnershipType) {
          console.log('✅ Partnership type found');
        } else {
          console.log('❌ Partnership type not found');
        }
      }
    } catch (e) {
      console.log('❌ Error testing Collaborations tab:', e.message);
    }
    
    // Check for WhoseApp button and popup toggle
    console.log('🔍 Checking for UI controls...');
    
    const whoseAppBtn = await page.$('.whoseapp-btn');
    if (whoseAppBtn) {
      console.log('✅ WhoseApp button found');
    } else {
      console.log('❌ WhoseApp button not found');
    }
    
    const popupToggle = await page.$('.popup-toggle-container');
    if (popupToggle) {
      console.log('✅ Popup toggle found');
    } else {
      console.log('❌ Popup toggle not found');
    }
    
    // Check for table structure and styling
    console.log('🔍 Checking table structure...');
    
    const tableContainers = await page.$$('.standard-table-container');
    console.log(`📊 Found ${tableContainers.length} table containers`);
    
    const progressBars = await page.$$('[style*="width: 67%"]');
    console.log(`📈 Found ${progressBars.length} progress bars`);
    
    const specializationTags = await page.$$('[style*="background-color: #673ab7"]');
    console.log(`🏷️ Found ${specializationTags.length} specialization tags`);
    
    // Take final screenshot
    await page.screenshot({ 
      path: 'tests/screenshots/university-research-final.png',
      fullPage: true 
    });
    
    console.log('✅ University Research Screen Design Test completed!');
    
  } catch (error) {
    console.error('❌ Test failed:', error);
    await page.screenshot({ 
      path: 'tests/screenshots/university-research-error.png',
      fullPage: true 
    });
  } finally {
    await browser.close();
  }
}

// Run the test
testUniversityResearchDesign().catch(console.error);
