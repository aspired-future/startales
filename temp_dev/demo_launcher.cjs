// Demo Launcher - Quick way to view the Witty Galaxy HUD system
const { chromium } = require('playwright');
const fs = require('fs');

async function launchDemo() {
    console.log('🚀 Launching Witty Galaxy Command Center Demo...');
    
    const browser = await chromium.launch({ 
        headless: false,
        args: ['--start-maximized']
    });
    
    const page = await browser.newPage();
    
    try {
        // Set viewport for optimal viewing
        await page.setViewportSize({ width: 1920, height: 1080 });
        
        // Load the main HUD screen
        const { getMainHUDScreen } = require('./main_hud_screen.cjs');
        const hudContent = getMainHUDScreen();
        
        // Create temporary HTML file
        const tempFile = 'temp_dev/demo_hud.html';
        fs.writeFileSync(tempFile, hudContent);
        
        console.log('📄 Created HUD demo file');
        
        // Navigate to the HUD
        await page.goto('file://' + process.cwd() + '/' + tempFile);
        console.log('🌐 Loaded Witty Galaxy Command Center');
        
        // Wait for the page to fully load
        await page.waitForLoadState('domcontentloaded');
        await page.waitForTimeout(2000);
        
        console.log('✅ Command Center is ready!');
        console.log('🎮 You can now interact with the Witty Galaxy HUD');
        console.log('📱 Try clicking on different navigation items to explore');
        console.log('🔄 The system includes real-time updates and interactive elements');
        console.log('');
        console.log('Available screens:');
        console.log('  🏠 Dashboard - Main command interface');
        console.log('  🗺️ Galaxy Map - Interactive galactic visualization');
        console.log('  💬 Witter Network - Galactic social media');
        console.log('  👥 Demographics - Population analytics');
        console.log('  🏙️ Cities - Urban planning and management');
        console.log('  💰 Trade & Economy - Market data and commerce');
        console.log('  🏛️ Government - Leadership and cabinet tools');
        console.log('  ⚔️ Military - Fleet and defense management');
        console.log('  🕵️ Intelligence - Security and threat analysis');
        console.log('  🔬 Technology - Research and development');
        console.log('');
        console.log('💡 Press Ctrl+C to close when done exploring');
        
        // Keep the browser open for interaction
        await new Promise(() => {});
        
    } catch (error) {
        console.error('❌ Demo launch failed:', error);
    }
}

// Handle cleanup
process.on('SIGINT', () => {
    console.log('\\n🧹 Cleaning up demo files...');
    try {
        if (fs.existsSync('temp_dev/demo_hud.html')) {
            fs.unlinkSync('temp_dev/demo_hud.html');
        }
    } catch (error) {
        // Ignore cleanup errors
    }
    console.log('👋 Thanks for exploring Witty Galaxy!');
    process.exit(0);
});

// Launch the demo
launchDemo().catch(console.error);
