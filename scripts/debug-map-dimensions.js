#!/usr/bin/env node

import { chromium } from 'playwright';

async function debugMapDimensions() {
  console.log('🔍 DEBUGGING MAP DIMENSIONS...\n');
  
  const browser = await chromium.launch({ headless: false });
  const page = await browser.newPage();
  
  try {
    // Navigate to the game
    await page.goto('http://localhost:5175');
    await page.waitForTimeout(2000);
    
    // Open galaxy map
    console.log('📍 Opening Galaxy Map...');
    await page.click('[data-screen="galaxy-map"]');
    await page.waitForTimeout(1000);
    
    // Check popup dimensions
    const popupDimensions = await page.evaluate(() => {
      const popup = document.querySelector('.popup-overlay');
      const popupContent = document.querySelector('.popup-content');
      const mapContent = document.querySelector('.map-popup-content');
      const galaxyMap = document.querySelector('.enhanced-galaxy-map');
      const canvas = document.querySelector('.enhanced-galaxy-canvas');
      
      return {
        popup: popup ? popup.getBoundingClientRect() : null,
        popupContent: popupContent ? popupContent.getBoundingClientRect() : null,
        mapContent: mapContent ? mapContent.getBoundingClientRect() : null,
        galaxyMap: galaxyMap ? galaxyMap.getBoundingClientRect() : null,
        canvas: canvas ? canvas.getBoundingClientRect() : null,
        canvasStyle: canvas ? {
          width: canvas.style.width,
          height: canvas.style.height,
          position: canvas.style.position
        } : null,
        viewport: {
          width: window.innerWidth,
          height: window.innerHeight
        }
      };
    });
    
    console.log('📏 DIMENSION ANALYSIS:');
    console.log('Viewport:', popupDimensions.viewport);
    console.log('Popup Overlay:', popupDimensions.popup);
    console.log('Popup Content:', popupDimensions.popupContent);
    console.log('Map Content:', popupDimensions.mapContent);
    console.log('Galaxy Map Container:', popupDimensions.galaxyMap);
    console.log('Canvas Element:', popupDimensions.canvas);
    console.log('Canvas Style:', popupDimensions.canvasStyle);
    
    // Check console logs
    const logs = [];
    page.on('console', msg => {
      if (msg.text().includes('Canvas') || msg.text().includes('dimensions') || msg.text().includes('🚨') || msg.text().includes('✅')) {
        logs.push(msg.text());
      }
    });
    
    await page.waitForTimeout(2000);
    
    console.log('\n🔍 CONSOLE LOGS:');
    logs.forEach(log => console.log(log));
    
    // Close and reopen to test shrinking
    console.log('\n🔄 TESTING REOPEN...');
    await page.click('.popup-close');
    await page.waitForTimeout(500);
    
    await page.click('[data-screen="galaxy-map"]');
    await page.waitForTimeout(1000);
    
    const reopenDimensions = await page.evaluate(() => {
      const canvas = document.querySelector('.enhanced-galaxy-canvas');
      return canvas ? canvas.getBoundingClientRect() : null;
    });
    
    console.log('Canvas after reopen:', reopenDimensions);
    
    // Keep browser open for manual inspection
    console.log('\n🔍 Browser kept open for manual inspection...');
    console.log('Press Ctrl+C to close when done.');
    
    // Wait indefinitely
    await new Promise(() => {});
    
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await browser.close();
  }
}

debugMapDimensions().catch(console.error);
