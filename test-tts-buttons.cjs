const { chromium } = require('playwright');

async function testTTSButtons() {
  console.log('🎭 Testing TTS Buttons...');
  
  const browser = await chromium.launch({ 
    headless: false,
    slowMo: 1000,
    args: [
      '--use-fake-ui-for-media-stream',
      '--use-fake-device-for-media-stream',
      '--allow-running-insecure-content',
      '--disable-web-security',
      '--autoplay-policy=no-user-gesture-required'
    ]
  });
  
  const context = await browser.newContext({
    permissions: ['microphone', 'camera']
  });
  
  const page = await context.newPage();
  
  // Listen for TTS-related console logs
  page.on('console', msg => {
    const text = msg.text();
    if (text.includes('TTS') || text.includes('🔊') || text.includes('Speak') || 
        text.includes('character:') || text.includes('textToSpeech')) {
      console.log(`🌐 Browser:`, text);
    }
  });
  
  try {
    console.log('🌐 Loading game...');
    await page.goto('http://localhost:5174/', { waitUntil: 'networkidle' });
    
    console.log('📱 Navigating to WhoseApp...');
    await page.click('button:has-text("WhoseApp")');
    await page.waitForTimeout(2000);
    
    console.log('👥 Going to Characters tab...');
    await page.click('button:has-text("Characters")');
    await page.waitForTimeout(2000);
    
    // Find and test TTS buttons
    console.log('🔍 Finding TTS buttons...');
    const ttsButtons = await page.$$('button:has-text("🔊 Speak")');
    
    console.log(`📊 Found ${ttsButtons.length} TTS buttons`);
    
    if (ttsButtons.length > 0) {
      console.log('🖱️ Testing first TTS button...');
      
      // Click the first TTS button
      await ttsButtons[0].click();
      await page.waitForTimeout(3000);
      
      // Check if speech synthesis was triggered
      const speechStatus = await page.evaluate(() => {
        return {
          speaking: window.speechSynthesis ? window.speechSynthesis.speaking : false,
          pending: window.speechSynthesis ? window.speechSynthesis.pending : false,
          paused: window.speechSynthesis ? window.speechSynthesis.paused : false
        };
      });
      
      console.log('📊 Speech Status:', speechStatus);
      
      // Test multiple TTS buttons if available
      if (ttsButtons.length > 1) {
        console.log('🖱️ Testing second TTS button...');
        await page.waitForTimeout(1000);
        await ttsButtons[1].click();
        await page.waitForTimeout(2000);
      }
      
      if (ttsButtons.length > 2) {
        console.log('🖱️ Testing third TTS button...');
        await page.waitForTimeout(1000);
        await ttsButtons[2].click();
        await page.waitForTimeout(2000);
      }
    }
    
    // Test voice service functionality
    console.log('🔍 Testing voice service methods...');
    
    const voiceServiceTest = await page.evaluate(async () => {
      if (window.voiceService) {
        try {
          // Test basic TTS
          const result1 = await window.voiceService.textToSpeech('Hello, this is a test', {
            characterId: 'test_char',
            rate: 1.0,
            pitch: 1.0,
            volume: 0.5
          });
          
          // Test character voice generation
          const mockCharacter = {
            id: 'test_char_001',
            name: 'Test Character',
            age: 30,
            gender: 'female',
            personality: ['confident', 'friendly'],
            background: 'diplomat',
            species: 'human'
          };
          
          const generatedVoice = window.voiceService.generateCharacterVoice(mockCharacter);
          
          return {
            success: true,
            ttsResult: result1,
            voiceGenerated: !!generatedVoice,
            voiceDetails: generatedVoice
          };
        } catch (error) {
          return {
            success: false,
            error: error.message
          };
        }
      }
      return { success: false, error: 'Voice service not available' };
    });
    
    console.log('📊 Voice Service Test Results:');
    console.log(`   Success: ${voiceServiceTest.success ? '✅' : '❌'}`);
    if (voiceServiceTest.success) {
      console.log(`   Voice Generated: ${voiceServiceTest.voiceGenerated ? '✅' : '❌'}`);
      if (voiceServiceTest.voiceDetails) {
        console.log(`   Voice Name: ${voiceServiceTest.voiceDetails.voiceName}`);
        console.log(`   Voice Rate: ${voiceServiceTest.voiceDetails.rate}`);
        console.log(`   Voice Pitch: ${voiceServiceTest.voiceDetails.pitch}`);
      }
    } else {
      console.log(`   Error: ${voiceServiceTest.error}`);
    }
    
    // Take screenshot
    await page.screenshot({ path: 'debug-tts-buttons.png', fullPage: true });
    
    console.log('✅ TTS Button test completed');
    
  } catch (error) {
    console.error('❌ Error during TTS button testing:', error);
    await page.screenshot({ path: 'debug-tts-buttons-error.png', fullPage: true });
  } finally {
    await browser.close();
  }
}

testTTSButtons().catch(console.error);

