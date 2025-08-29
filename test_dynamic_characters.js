import { chromium } from 'playwright';

async function testDynamicCharacters() {
  console.log('🎯 Testing Dynamic Character System...');
  
  const browser = await chromium.launch({ 
    headless: false,
    args: ['--use-fake-ui-for-media-stream', '--use-fake-device-for-media-stream']
  });
  
  const page = await browser.newPage();
  
  try {
    // Navigate to the app
    console.log('📱 Navigating to WhoseApp...');
    await page.goto('http://localhost:5173/');
    await page.waitForTimeout(3000);
    
    // Test different characters
    const testCharacters = [
      {
        name: 'Ambassador Elena Vasquez',
        role: 'Chief Diplomatic Officer',
        department: 'Diplomacy',
        title: 'Galactic Ambassador'
      },
      {
        name: 'Commander Marcus Chen',
        role: 'Military Strategist',
        department: 'Defense',
        title: 'Fleet Commander'
      },
      {
        name: 'Dr. Sarah Kim',
        role: 'Research Director',
        department: 'Science',
        title: 'Chief Scientist'
      }
    ];
    
    console.log('🤖 Testing different characters...');
    
    for (let i = 0; i < testCharacters.length; i++) {
      const character = testCharacters[i];
      console.log(`\n👤 Test ${i + 1}: ${character.name} (${character.role})`);
      
      const responseTest = await page.evaluate(async (char) => {
        try {
          const response = await fetch('http://localhost:4000/api/ai/generate', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              prompt: 'What is the state of the Galaxy?',
              character: char,
              conversationHistory: [],
              context: {
                gameContext: {
                  setting: 'galactic_civilization',
                  currentSituation: 'diplomatic_relations',
                  availableCivilizations: ['Zephyrian Empire', 'Centauri Alliance'],
                  currentSectors: ['Sector 7', 'Sector 12'],
                  diplomaticStatus: 'active_negotiations',
                  activeMissions: ['Diplomatic Outreach to Zephyrian Empire', 'Resource Negotiation in Sector 7'],
                  storyEvents: ['Rising tensions in Outer Rim', 'Discovery of ancient artifacts'],
                  characterBackground: `${char.name} has been serving for 15 years`
                }
              },
              options: { maxTokens: 50 }
            })
          });
          
          const data = await response.json();
          return {
            success: true,
            content: data.content,
            length: data.content?.length || 0
          };
        } catch (error) {
          return {
            success: false,
            error: error.message
          };
        }
      }, character);
      
      if (responseTest.success) {
        console.log(`✅ Response: ${responseTest.content}`);
        console.log(`📏 Length: ${responseTest.length} characters`);
        
        // Check if response mentions the character's name or role
        const mentionsCharacter = responseTest.content.toLowerCase().includes(character.name.toLowerCase()) ||
                                 responseTest.content.toLowerCase().includes(character.role.toLowerCase()) ||
                                 responseTest.content.toLowerCase().includes(character.department.toLowerCase());
        
        console.log(`🎭 Mentions Character: ${mentionsCharacter ? 'YES' : 'NO'}`);
        
      } else {
        console.log(`❌ Failed: ${responseTest.error}`);
      }
      
      // Wait between requests
      await page.waitForTimeout(1000);
    }
    
  } catch (error) {
    console.error('❌ Test failed:', error);
  } finally {
    await browser.close();
  }
}

testDynamicCharacters();
