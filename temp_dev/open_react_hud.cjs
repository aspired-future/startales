// Simple script to open the React HUD in browser
const { chromium } = require('playwright');

async function openReactHUD() {
    console.log('🚀 Opening Witty Galaxy React HUD...');
    
    const browser = await chromium.launch({ 
        headless: false,
        args: ['--start-maximized']
    });
    
    const page = await browser.newPage();
    
    try {
        // Set viewport for optimal viewing
        await page.setViewportSize({ width: 1920, height: 1080 });
        
        console.log('🌐 Loading React UI at http://localhost:5174...');
        
        // Navigate to the React UI
        await page.goto('http://localhost:5174');
        
        // Wait for the page to load
        await page.waitForLoadState('domcontentloaded');
        await page.waitForTimeout(2000);
        
        console.log('✅ React UI loaded successfully!');
        console.log('');
        console.log('🎮 Witty Galaxy HUD is now open!');
        console.log('');
        console.log('📋 What you should see:');
        console.log('  🌌 StarTales Game HUD - Complete galactic management interface');
        console.log('  📱 Witter Feed - AI-generated social media (visible by default)');
        console.log('  🚀 Exploration - Galactic exploration dashboard');
        console.log('  🏛️ Civilizations - Civilization browser');
        console.log('  🗺️ Galactic Map - Interactive galaxy visualization');
        console.log('  👥 Character Interaction - NPC conversations');
        console.log('  💰 Trade & Economics - Market data and trade routes ✨ NEW!');
        console.log('');
        console.log('🔧 Navigation:');
        console.log('  • Click panel buttons in the top HUD bar to open panels');
        console.log('  • Click section tabs within panels for detailed views');
        console.log('  • All data updates in real-time');
        console.log('');
        console.log('💡 Press Ctrl+C to close when done exploring');
        
        // Keep the browser open for interaction
        await new Promise(() => {});
        
    } catch (error) {
        console.error('❌ Failed to open React HUD:', error);
        console.log('');
        console.log('🔧 Troubleshooting:');
        console.log('  1. Make sure React UI is running: npm run ui');
        console.log('  2. Check that port 5174 is available');
        console.log('  3. Verify the React app compiled successfully');
    }
}

// Handle cleanup
process.on('SIGINT', () => {
    console.log('\\n👋 Closing Witty Galaxy HUD...');
    process.exit(0);
});

// Launch the demo
openReactHUD().catch(console.error);
