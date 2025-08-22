import { chromium } from 'playwright';

async function debugPanelsFilter() {
  console.log('🔍 Debugging Panels Filter...');
  
  const browser = await chromium.launch({ 
    headless: false,
    slowMo: 1000
  });
  const page = await browser.newPage();
  
  try {
    await page.goto('http://localhost:5174', { waitUntil: 'domcontentloaded' });
    await page.waitForSelector('.comprehensive-hud', { timeout: 10000 });
    console.log('✅ App loaded');
    
    // Inject a script to check the panels array and filtering
    const panelsInfo = await page.evaluate(() => {
      // Try to access the panels from the component
      const panels = [
        // Government & Leadership
        { id: 'government', name: 'Government', icon: '🏛️', category: 'government' },
        { id: 'cabinet', name: 'Cabinet', icon: '👥', category: 'government' },
        { id: 'policies', name: 'Policies', icon: '⚖️', category: 'government' },
        { id: 'legislature', name: 'Legislature', icon: '🏛️', category: 'government' },
        { id: 'supreme-court', name: 'Supreme Court', icon: '⚖️', category: 'government' },
        { id: 'institutional-override', name: 'Override System', icon: '⚖️', category: 'government' },
        { id: 'political-parties', name: 'Politics', icon: '🎭', category: 'government' },
        
        // Economy & Finance
        { id: 'economy', name: 'Economy', icon: '💰', category: 'economy' },
        { id: 'budget', name: 'Budget', icon: '💰', category: 'economy' },
        { id: 'taxation', name: 'Taxation', icon: '💰', category: 'economy' },
        { id: 'trade', name: 'Trade', icon: '🚢', category: 'economy' },
        { id: 'financial-markets', name: 'Financial Markets', icon: '📈', category: 'economy' },
        { id: 'economic-ecosystem', name: 'Economic Ecosystem', icon: '🌐', category: 'economy' },
        
        // Security & Defense
        { id: 'security', name: 'Security', icon: '🛡️', category: 'security' },
        { id: 'military', name: 'Military', icon: '⚔️', category: 'security' },
        { id: 'intelligence', name: 'Intelligence', icon: '🕵️', category: 'security' },
        { id: 'homeland-security', name: 'Homeland Security', icon: '🏠', category: 'security' },
        { id: 'joint-chiefs', name: 'Joint Chiefs', icon: '⭐', category: 'security' },
        
        // Population & Society
        { id: 'population', name: 'Population', icon: '👥', category: 'population' },
        { id: 'demographics', name: 'Demographics', icon: '📊', category: 'population' },
        { id: 'health', name: 'Health', icon: '🏥', category: 'population' },
        { id: 'education', name: 'Education', icon: '🎓', category: 'population' },
        { id: 'social-services', name: 'Social Services', icon: '🤝', category: 'population' },
        
        // Science & Technology
        { id: 'science', name: 'Science', icon: '🔬', category: 'science' },
        { id: 'research', name: 'Research', icon: '🧪', category: 'science' },
        { id: 'technology', name: 'Technology', icon: '💻', category: 'science' },
        { id: 'innovation', name: 'Innovation', icon: '💡', category: 'science' },
        
        // Communications & Media
        { id: 'communications', name: 'Communications', icon: '📡', category: 'communications' },
        { id: 'media', name: 'Media', icon: '📺', category: 'communications' },
        { id: 'news', name: 'News', icon: '📰', category: 'communications' },
        { id: 'speeches', name: 'Speeches', icon: '🎤', category: 'communications' },
        { id: 'witter', name: 'Witter', icon: '🐦', category: 'communications' },
        
        // Galaxy & Space
        { id: 'galaxy-map', name: 'Galaxy Map', icon: '🗺️', category: 'galaxy' },
        { id: 'galaxy-data', name: 'Galaxy Data', icon: '🌌', category: 'galaxy' },
        { id: 'conquest', name: 'Conquest', icon: '⚔️', category: 'galaxy' },
        { id: 'exploration', name: 'Exploration', icon: '🚀', category: 'galaxy' }
      ];
      
      const galaxyPanels = panels.filter(p => p.category === 'galaxy');
      
      return {
        totalPanels: panels.length,
        galaxyPanels: galaxyPanels,
        galaxyPanelCount: galaxyPanels.length
      };
    });
    
    console.log('\\n📊 Panels Analysis:');
    console.log('Total panels:', panelsInfo.totalPanels);
    console.log('Galaxy panels count:', panelsInfo.galaxyPanelCount);
    console.log('Galaxy panels:', panelsInfo.galaxyPanels.map(p => `${p.icon} ${p.name}`).join(', '));
    
    // Now click the galaxy accordion and see what actually gets rendered
    console.log('\\n🌌 Clicking GALAXY accordion...');
    await page.click('text=GALAXY');
    await page.waitForTimeout(2000);
    
    // Get the actual DOM content of the expanded accordion
    const accordionContent = await page.evaluate(() => {
      const accordionSections = document.querySelectorAll('.accordion-section');
      let galaxySection = null;
      
      // Find the galaxy section
      for (let section of accordionSections) {
        const title = section.querySelector('.accordion-title');
        if (title && title.textContent === 'GALAXY') {
          galaxySection = section;
          break;
        }
      }
      
      if (!galaxySection) return { error: 'Galaxy section not found' };
      
      const content = galaxySection.querySelector('.accordion-content');
      if (!content) return { error: 'Accordion content not found' };
      
      const navItems = content.querySelectorAll('.nav-item');
      const items = Array.from(navItems).map(item => ({
        text: item.textContent,
        visible: item.offsetParent !== null
      }));
      
      return {
        contentVisible: content.offsetParent !== null,
        itemCount: navItems.length,
        items: items
      };
    });
    
    console.log('\\n📋 Actual DOM Content:');
    console.log('Content visible:', accordionContent.contentVisible);
    console.log('Item count:', accordionContent.itemCount);
    console.log('Items:', accordionContent.items);
    
    if (accordionContent.error) {
      console.log('❌ Error:', accordionContent.error);
    }
    
    // Take screenshot
    await page.screenshot({ path: 'temp_dev/panels_filter_debug.png', fullPage: true });
    console.log('📸 Screenshot saved');
    
  } catch (error) {
    console.error('❌ Debug failed:', error.message);
  } finally {
    await browser.close();
  }
}

debugPanelsFilter().catch(console.error);
