import { test, expect } from '@playwright/test';

test.describe('STT/TTS Debug', () => {
  test('Debug STT and TTS functionality step by step', async ({ page }) => {
    // Grant microphone permissions
    const context = page.context();
    await context.grantPermissions(['microphone']);

    // Capture all console messages and network requests
    page.on('console', msg => {
      console.log(`BROWSER: ${msg.type()}: ${msg.text()}`);
    });

    page.on('request', request => {
      if (request.url().includes('/api/')) {
        console.log(`REQUEST: ${request.method()} ${request.url()}`);
      }
    });

    page.on('response', response => {
      if (response.url().includes('/api/')) {
        console.log(`RESPONSE: ${response.status()} ${response.url()}`);
        if (response.status() >= 400) {
          console.log(`ERROR RESPONSE: ${response.statusText()}`);
        }
      }
    });

    await page.goto('http://localhost:5176');
    await page.waitForLoadState('networkidle');
    
    console.log('=== STEP 1: Test API Services Directly ===');
    
    // Test STT service
    const sttResult = await page.evaluate(async () => {
      try {
        const response = await fetch('http://localhost:4000/api/stt/health');
        const data = await response.json();
        return { success: true, data };
      } catch (error) {
        return { success: false, error: error.message };
      }
    });
    console.log('STT Service Test:', sttResult);
    
    // Test AI service
    const aiResult = await page.evaluate(async () => {
      try {
        const response = await fetch('http://localhost:4000/api/ai/generate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ prompt: 'Hello test' })
        });
        const data = await response.json();
        return { success: true, data };
      } catch (error) {
        return { success: false, error: error.message };
      }
    });
    console.log('AI Service Test:', aiResult);
    
    console.log('=== STEP 2: Open WhoseApp Voice Interface ===');
    
    // Click WhoseApp
    const whoseAppButton = page.locator('.quick-access-btn').filter({ hasText: 'WhoseApp' });
    await whoseAppButton.click();
    await page.waitForTimeout(3000);
    
    // Go to CHARACTERS tab
    const charactersTab = page.locator('text=CHARACTERS');
    if (await charactersTab.count() > 0) {
      await charactersTab.click();
      await page.waitForTimeout(2000);
    }
    
    // Click Call button
    const callButton = page.locator('button:has-text("📞 Call")').first();
    if (await callButton.count() > 0) {
      console.log('Clicking Call button...');
      await callButton.click();
      await page.waitForTimeout(3000);
      
      console.log('=== STEP 3: Test Voice Interface Elements ===');
      
      // Look for Switch to Voice button
      const switchToVoiceBtn = page.locator('button:has-text("Switch to Voice")');
      if (await switchToVoiceBtn.count() > 0) {
        console.log('Clicking Switch to Voice...');
        await switchToVoiceBtn.click();
        await page.waitForTimeout(2000);
        
        console.log('=== STEP 4: Test Browser Speech APIs ===');
        
        // Test browser speech recognition and synthesis
        const speechTest = await page.evaluate(async () => {
          const results = {
            speechRecognition: false,
            speechSynthesis: false,
            mediaRecorder: false,
            getUserMedia: false
          };
          
          // Test SpeechRecognition
          if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
            results.speechRecognition = true;
            console.log('✅ SpeechRecognition API available');
          } else {
            console.log('❌ SpeechRecognition API not available');
          }
          
          // Test SpeechSynthesis
          if ('speechSynthesis' in window) {
            results.speechSynthesis = true;
            console.log('✅ SpeechSynthesis API available');
            
            // Test TTS
            try {
              const utterance = new SpeechSynthesisUtterance('Test voice');
              utterance.volume = 0.1; // Low volume for testing
              speechSynthesis.speak(utterance);
              console.log('✅ TTS test initiated');
            } catch (error) {
              console.log('❌ TTS test failed:', error);
            }
          } else {
            console.log('❌ SpeechSynthesis API not available');
          }
          
          // Test MediaRecorder
          if ('MediaRecorder' in window) {
            results.mediaRecorder = true;
            console.log('✅ MediaRecorder API available');
          } else {
            console.log('❌ MediaRecorder API not available');
          }
          
          // Test getUserMedia
          if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
            results.getUserMedia = true;
            console.log('✅ getUserMedia API available');
            
            try {
              const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
              console.log('✅ Microphone access granted');
              stream.getTracks().forEach(track => track.stop());
            } catch (error) {
              console.log('❌ Microphone access denied:', error);
            }
          } else {
            console.log('❌ getUserMedia API not available');
          }
          
          return results;
        });
        
        console.log('Browser Speech APIs Test:', speechTest);
        
        console.log('=== STEP 5: Test Voice Recording ===');
        
        // Look for voice recording elements
        const voiceElements = await page.locator('text=Listening, text=Recording, text=Voice mode, text=End Call').all();
        console.log(`Found ${voiceElements.length} voice interface elements`);
        
        // Check for error messages
        const errorElements = await page.locator('text=Failed, text=Error, text=Permission').all();
        console.log(`Found ${errorElements.length} error messages`);
        
        // Take screenshot
        await page.screenshot({ path: 'temp_dev/stt-tts-debug.png', fullPage: true });
        
      } else {
        console.log('❌ Switch to Voice button not found');
      }
      
    } else {
      console.log('❌ Call button not found');
    }
    
    console.log('=== STEP 6: Test STT Service with Audio ===');
    
    // Test STT service with a dummy audio file
    const sttTranscribeTest = await page.evaluate(async () => {
      try {
        // Create a minimal audio blob for testing
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const buffer = audioContext.createBuffer(1, 44100, 44100); // 1 second of silence
        
        // Convert to blob (this is a simplified test)
        const formData = new FormData();
        const blob = new Blob(['test'], { type: 'audio/wav' });
        formData.append('audio', blob, 'test.wav');
        
        const response = await fetch('http://localhost:4000/api/stt/transcribe', {
          method: 'POST',
          body: formData
        });
        
        const data = await response.json();
        return { success: response.ok, status: response.status, data };
      } catch (error) {
        return { success: false, error: error.message };
      }
    });
    
    console.log('STT Transcribe Test:', sttTranscribeTest);
    
    await page.waitForTimeout(2000);
  });
});
