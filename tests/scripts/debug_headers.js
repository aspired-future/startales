import { chromium } from 'playwright';

async function debugHeaders() {
  const browser = await chromium.launch({ headless: false });
  const page = await browser.newPage();
  
  try {
    // Navigate to the application
    await page.goto('http://localhost:5174');
    await page.waitForTimeout(3000);
    
    // Look for Supreme Court screen
    console.log('Looking for Supreme Court screen...');
    
    // Try to find and click Supreme Court
    const supremeCourtButton = await page.locator('text=Supreme Court').first();
    if (await supremeCourtButton.isVisible()) {
      console.log('Found Supreme Court button, clicking...');
      await supremeCourtButton.click();
      await page.waitForTimeout(2000);
      
      // Debug: Find all elements containing "Supreme Court"
      const supremeCourtElements = await page.locator('text=Supreme Court').all();
      console.log(`Found ${supremeCourtElements.length} elements with "Supreme Court" text`);
      
      for (let i = 0; i < supremeCourtElements.length; i++) {
        const element = supremeCourtElements[i];
        const tagName = await element.evaluate(el => el.tagName);
        const className = await element.evaluate(el => el.className);
        const parentTag = await element.evaluate(el => el.parentElement?.tagName);
        const parentClass = await element.evaluate(el => el.parentElement?.className);
        
        console.log(`Element ${i + 1}:`);
        console.log(`  Tag: ${tagName}, Class: ${className}`);
        console.log(`  Parent: ${parentTag}, Parent Class: ${parentClass}`);
        
        // Highlight the element
        await element.evaluate(el => {
          el.style.border = `3px solid ${i === 0 ? 'red' : 'blue'}`;
          el.style.backgroundColor = i === 0 ? 'rgba(255,0,0,0.2)' : 'rgba(0,0,255,0.2)';
        });
      }
      
      // Take screenshot showing the highlighted headers
      await page.screenshot({ path: 'temp_dev/debug_headers.png', fullPage: true });
      
      // Get the HTML structure around the headers
      const headerHTML = await page.evaluate(() => {
        const elements = Array.from(document.querySelectorAll('*')).filter(el => 
          el.textContent && el.textContent.includes('Supreme Court')
        );
        return elements.map(el => ({
          tag: el.tagName,
          class: el.className,
          text: el.textContent.trim().substring(0, 50),
          html: el.outerHTML.substring(0, 200)
        }));
      });
      
      console.log('Header HTML structures:');
      headerHTML.forEach((item, index) => {
        console.log(`\\nHeader ${index + 1}:`);
        console.log(`Tag: ${item.tag}, Class: ${item.class}`);
        console.log(`Text: ${item.text}`);
        console.log(`HTML: ${item.html}...`);
      });
      
    } else {
      console.log('Supreme Court button not found');
      
      // Take screenshot of current state
      await page.screenshot({ path: 'temp_dev/no_supreme_court.png', fullPage: true });
    }
    
    // Wait for user to inspect
    await page.waitForTimeout(10000);
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await browser.close();
  }
}

debugHeaders().catch(console.error);

