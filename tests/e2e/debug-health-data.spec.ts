import { test, expect } from '@playwright/test';

test('Debug Health Screen Data Loading', async ({ page }) => {
  console.log('🔍 Debugging Health screen data loading...');
  
  // Listen for console messages
  page.on('console', msg => {
    console.log('📱 Console:', msg.text());
  });
  
  // Listen for page errors
  page.on('pageerror', error => {
    console.log('❌ Page Error:', error.message);
  });
  
  await page.goto('http://localhost:5173/');
  await page.waitForTimeout(5000); // Wait longer for data to load
  
  // Check if there are any React errors or data loading issues
  const bodyText = await page.textContent('body');
  console.log('📄 Body text length:', bodyText?.length || 0);
  
  // Look for specific data that should be present
  if (bodyText) {
    if (bodyText.includes('Dr. Sarah Johnson')) {
      console.log('✅ Found Health Secretary data');
    } else {
      console.log('❌ Health Secretary data not found');
    }
    
    if (bodyText.includes('Dr. Michael Chen')) {
      console.log('✅ Found Surgeon General data');
    } else {
      console.log('❌ Surgeon General data not found');
    }
    
    if (bodyText.includes('Cardiovascular Disease')) {
      console.log('✅ Found diseases data');
    } else {
      console.log('❌ Diseases data not found');
    }
    
    if (bodyText.includes('Central Hospital')) {
      console.log('✅ Found infrastructure data');
    } else {
      console.log('❌ Infrastructure data not found');
    }
    
    if (bodyText.includes('Universal Healthcare Coverage')) {
      console.log('✅ Found policies data');
    } else {
      console.log('❌ Policies data not found');
    }
    
    if (bodyText.includes('78.5 years')) {
      console.log('✅ Found population metrics data');
    } else {
      console.log('❌ Population metrics data not found');
    }
  }
  
  // Take a screenshot
  await page.screenshot({ path: 'tests/screenshots/debug-health-data.png' });
  console.log('🔍 Health data debug complete - check screenshot at tests/screenshots/debug-health-data.png');
});

