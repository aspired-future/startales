#!/usr/bin/env node

import { chromium } from 'playwright';

async function testMouseAfterRotation() {
  console.log('🔍 TESTING MOUSE BEHAVIOR AFTER ROTATION...\n');
  
  const browser = await chromium.launch({ headless: false });
  const page = await browser.newPage();
  
  try {
    // Navigate to the game
    await page.goto('http://localhost:5175');
    await page.waitForTimeout(2000);
    
    // Open galaxy map
    console.log('📍 Opening Galaxy Map...');
    await page.click('[data-screen="galaxy-map"]');
    await page.waitForTimeout(2000);
    
    // Get canvas element
    const canvas = await page.locator('.enhanced-galaxy-canvas');
    await canvas.waitFor();
    
    // Get initial camera state
    const initialState = await page.evaluate(() => {
      const canvas = document.querySelector('.enhanced-galaxy-canvas');
      return canvas ? canvas.getBoundingClientRect() : null;
    });
    
    console.log('📏 Canvas dimensions:', initialState);
    
    // Listen for console logs
    const logs = [];
    page.on('console', msg => {
      if (msg.text().includes('ROTATION') || msg.text().includes('PANNING') || msg.text().includes('🚀') || msg.text().includes('🔄')) {
        logs.push(msg.text());
        console.log('🔍 Console:', msg.text());
      }
    });
    
    // Test 1: Normal left drag before rotation
    console.log('\n🎯 TEST 1: Left drag BEFORE rotation');
    const canvasBox = await canvas.boundingBox();
    const centerX = canvasBox.x + canvasBox.width / 2;
    const centerY = canvasBox.y + canvasBox.height / 2;
    
    await page.mouse.move(centerX, centerY);
    await page.mouse.down({ button: 'left' });
    await page.mouse.move(centerX + 100, centerY, { steps: 10 });
    await page.mouse.up({ button: 'left' });
    await page.waitForTimeout(500);
    
    // Test 2: Right drag to rotate
    console.log('\n🔄 TEST 2: Right drag to ROTATE camera');
    await page.mouse.move(centerX, centerY);
    await page.mouse.down({ button: 'right' });
    await page.mouse.move(centerX + 100, centerY, { steps: 10 });
    await page.mouse.up({ button: 'right' });
    await page.waitForTimeout(500);
    
    // Test 3: Left drag after rotation
    console.log('\n🎯 TEST 3: Left drag AFTER rotation');
    await page.mouse.move(centerX, centerY);
    await page.mouse.down({ button: 'left' });
    await page.mouse.move(centerX + 100, centerY, { steps: 10 });
    await page.mouse.up({ button: 'left' });
    await page.waitForTimeout(500);
    
    // Get final camera state
    const finalState = await page.evaluate(() => {
      // Try to access camera state if available
      return {
        timestamp: Date.now(),
        message: 'Camera state would be here if exposed'
      };
    });
    
    console.log('\n📊 ANALYSIS:');
    console.log('- Check console logs above for rotation and panning details');
    console.log('- Look for "ROTATION AWARE" messages in left drag after rotation');
    console.log('- Verify that rotatedDeltaX and rotatedDeltaY values make sense');
    console.log('- Compare behavior before and after rotation');
    
    console.log('\n🔍 Browser kept open for manual testing...');
    console.log('Try rotating and then dragging to see the issue yourself.');
    console.log('Press Ctrl+C to close when done.');
    
    // Wait indefinitely for manual testing
    await new Promise(() => {});
    
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await browser.close();
  }
}

testMouseAfterRotation().catch(console.error);
