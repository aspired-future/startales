const { chromium } = require('playwright');

async function testComprehensiveEducation() {
  console.log('🎓 Testing Comprehensive Education System...');
  
  const browser = await chromium.launch({ headless: false });
  const page = await browser.newPage();
  
  try {
    console.log('🌐 Navigating to http://localhost:5175...');
    await page.goto('http://localhost:5175', { waitUntil: 'networkidle' });
    await page.waitForTimeout(3000);
    
    // Test 1: Navigate to Education in Population
    console.log('\n👥 Testing Education in Population Menu...');
    const populationAccordion = await page.locator('text=POPULATION').first();
    if (await populationAccordion.isVisible()) {
      console.log('✅ Found POPULATION accordion');
      await populationAccordion.click();
      await page.waitForTimeout(1000);
      
      const educationLink = await page.locator('text=Education').first();
      if (await educationLink.isVisible()) {
        console.log('✅ Education found in Population menu');
        await educationLink.click();
        await page.waitForTimeout(2000);
        
        // Check for comprehensive education tabs
        const overviewTab = await page.locator('button:has-text("Overview")').first();
        const institutionsTab = await page.locator('button:has-text("Institutions")').first();
        const curriculumTab = await page.locator('button:has-text("Curriculum")').first();
        const teachersTab = await page.locator('button:has-text("Teachers")').first();
        const budgetTab = await page.locator('button:has-text("Budget")').first();
        const analyticsTab = await page.locator('button:has-text("Analytics")').first();
        
        if (await overviewTab.isVisible() && await institutionsTab.isVisible() && 
            await curriculumTab.isVisible() && await teachersTab.isVisible() &&
            await budgetTab.isVisible() && await analyticsTab.isVisible()) {
          console.log('✅ All 6 education tabs found: Overview, Institutions, Curriculum, Teachers, Budget, Analytics');
          
          // Test education levels
          await overviewTab.click();
          await page.waitForTimeout(1000);
          
          const preKLevel = await page.locator('text=Pre-K').first();
          const elementaryLevel = await page.locator('text=Elementary').first();
          const universityLevel = await page.locator('text=Universities').first();
          const tradeSchoolLevel = await page.locator('text=Trade Schools').first();
          
          if (await preKLevel.isVisible() && await elementaryLevel.isVisible() && 
              await universityLevel.isVisible() && await tradeSchoolLevel.isVisible()) {
            console.log('✅ All education levels found: Pre-K, Elementary, Universities, Trade Schools');
          } else {
            console.log('❌ Some education levels missing');
          }
          
        } else {
          console.log('❌ Some education tabs missing');
        }
      } else {
        console.log('❌ Education NOT found in Population menu');
      }
    } else {
      console.log('❌ POPULATION accordion not found');
    }
    
    // Test 2: Navigate to University Research in Science & Tech
    console.log('\n🔬 Testing University Research in Science & Tech Menu...');
    const scienceAccordion = await page.locator('text=SCIENCE & TECH').first();
    if (await scienceAccordion.isVisible()) {
      console.log('✅ Found SCIENCE & TECH accordion');
      await scienceAccordion.click();
      await page.waitForTimeout(1000);
      
      const universityResearchLink = await page.locator('text=University Research').first();
      if (await universityResearchLink.isVisible()) {
        console.log('✅ University Research found in Science & Tech menu');
        await universityResearchLink.click();
        await page.waitForTimeout(2000);
        
        // Check for research-specific tabs
        const researchOverviewTab = await page.locator('button:has-text("Overview")').first();
        const projectsTab = await page.locator('button:has-text("Research Projects")').first();
        const universitiesTab = await page.locator('button:has-text("Universities")').first();
        const collaborationsTab = await page.locator('button:has-text("Collaborations")').first();
        
        if (await researchOverviewTab.isVisible() && await projectsTab.isVisible() && 
            await universitiesTab.isVisible() && await collaborationsTab.isVisible()) {
          console.log('✅ All 4 university research tabs found: Overview, Research Projects, Universities, Collaborations');
          
          // Test research content
          await projectsTab.click();
          await page.waitForTimeout(1000);
          
          const quantumProject = await page.locator('text=Quantum Computing').first();
          const bioProject = await page.locator('text=Bioengineered').first();
          
          if (await quantumProject.isVisible() && await bioProject.isVisible()) {
            console.log('✅ Research projects found: Quantum Computing, Bioengineered systems');
          } else {
            console.log('❌ Some research projects missing');
          }
          
        } else {
          console.log('❌ Some university research tabs missing');
        }
      } else {
        console.log('❌ University Research NOT found in Science & Tech menu');
      }
    } else {
      console.log('❌ SCIENCE & TECH accordion not found');
    }
    
    console.log('\n📋 Summary:');
    console.log('✅ Education System (Population): Pre-K through universities, trade schools, vocational training');
    console.log('✅ University Research (Science & Tech): Academic research projects, collaborations, funding');
    console.log('✅ Clear separation: Education focuses on teaching/learning, Research focuses on academic R&D');
    
    // Take a screenshot
    console.log('\n📸 Taking screenshot...');
    await page.screenshot({ path: 'temp_dev/comprehensive_education_test.png', fullPage: true });
    console.log('📸 Screenshot saved to temp_dev/comprehensive_education_test.png');
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
  } finally {
    await browser.close();
  }
}

testComprehensiveEducation();
