#!/usr/bin/env node

/**
 * Simple VEO 2 Test
 * 
 * Test VEO 2 access using the same authentication that worked before.
 */

import { GoogleAuth } from 'google-auth-library';

async function testVEO2Simple() {
  console.log('🎬 Testing VEO 2 Access (Simple)');
  console.log('===============================\n');

  try {
    // Use the same auth setup that worked before
    console.log('🔐 Initializing Authentication...');
    const auth = new GoogleAuth({
      keyFile: './lively-galaxy-7950344e0de7.json',
      scopes: [
        'https://www.googleapis.com/auth/generative-language',
        'https://www.googleapis.com/auth/cloud-platform'
      ]
    });
    
    const client = await auth.getClient();
    const accessTokenResponse = await client.getAccessToken();
    const accessToken = accessTokenResponse.token;
    
    console.log('✅ Authentication successful!');
    console.log(`   🎫 Token: ${accessToken.substring(0, 20)}...`);
    console.log();

    // Test VEO 2 endpoints
    console.log('📋 Testing VEO 2 Endpoints...');
    
    const veo2Tests = [
      {
        name: 'VEO 2 Direct',
        url: 'https://generativelanguage.googleapis.com/v1beta/models/veo-2:generateVideo'
      },
      {
        name: 'VEO 2 Alternative',
        url: 'https://generativelanguage.googleapis.com/v1beta/models/veo2:generateVideo'
      },
      {
        name: 'Video Generation Generic',
        url: 'https://generativelanguage.googleapis.com/v1beta/models/video:generate'
      }
    ];

    const testPayload = {
      prompt: "A simple rotating blue sphere on a white background",
      duration: 3,
      aspectRatio: "16:9",
      quality: "standard"
    };

    let foundWorking = false;

    for (const test of veo2Tests) {
      console.log(`🔍 Testing: ${test.name}`);
      
      try {
        const response = await fetch(test.url, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(testPayload)
        });

        console.log(`   📡 Status: ${response.status} ${response.statusText}`);
        
        if (response.ok) {
          const data = await response.json();
          console.log('   ✅ SUCCESS! VEO 2 is working!');
          console.log(`   📊 Response keys: ${Object.keys(data).join(', ')}`);
          
          if (data.videoId || data.id) {
            console.log(`   🎬 Video ID: ${data.videoId || data.id}`);
          }
          
          foundWorking = true;
          
          // Save the working configuration
          const fs = await import('fs');
          if (!fs.existsSync('temp_dev')) {
            fs.mkdirSync('temp_dev', { recursive: true });
          }
          
          const workingConfig = {
            endpoint: test.url,
            name: test.name,
            status: 'working',
            response: data,
            timestamp: new Date().toISOString()
          };
          
          fs.writeFileSync('temp_dev/veo2_working_config.json', JSON.stringify(workingConfig, null, 2));
          
          break;
        } else {
          const errorText = await response.text();
          console.log(`   ❌ Error: ${response.status}`);
          
          if (response.status === 404) {
            console.log(`   💡 Endpoint not found - VEO 2 may not be available`);
          } else if (response.status === 403) {
            console.log(`   💡 Access denied - may need special permissions`);
          } else {
            console.log(`   📝 Details: ${errorText.substring(0, 100)}...`);
          }
        }
      } catch (error) {
        console.log(`   ❌ Request failed: ${error.message}`);
      }
      console.log();
    }

    if (!foundWorking) {
      // Let's also check what models are actually available
      console.log('📋 Checking Available Models for Video Capabilities...');
      
      const modelsResponse = await fetch('https://generativelanguage.googleapis.com/v1beta/models', {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        }
      });

      if (modelsResponse.ok) {
        const modelsData = await modelsResponse.json();
        
        // Look for any models that might support video
        const videoRelatedModels = modelsData.models.filter(model => {
          const name = model.name.toLowerCase();
          const displayName = (model.displayName || '').toLowerCase();
          const description = (model.description || '').toLowerCase();
          
          return name.includes('video') || 
                 name.includes('veo') || 
                 name.includes('imagen') ||
                 displayName.includes('video') ||
                 description.includes('video');
        });
        
        console.log(`🔍 Found ${videoRelatedModels.length} video-related models:`);
        videoRelatedModels.forEach(model => {
          console.log(`   - ${model.name}`);
          if (model.displayName) {
            console.log(`     Display: ${model.displayName}`);
          }
          if (model.supportedGenerationMethods) {
            console.log(`     Methods: ${model.supportedGenerationMethods.join(', ')}`);
          }
        });
        
        if (videoRelatedModels.length === 0) {
          console.log('   ❌ No video-related models found in available models list');
        }
      }
    }

    console.log('\n📊 VEO 2 Test Results');
    console.log('====================');
    
    if (foundWorking) {
      console.log('✅ VEO 2 access confirmed!');
      console.log('🎬 Ready to generate real videos!');
      console.log('📄 Configuration saved to temp_dev/veo2_working_config.json');
    } else {
      console.log('❌ VEO 2 not accessible through tested endpoints');
      console.log('💡 Possible reasons:');
      console.log('   - VEO 2 requires special access/approval');
      console.log('   - Different API endpoints needed');
      console.log('   - Not available in this Google Cloud project');
      console.log('   - Still in limited preview');
    }
    
    return foundWorking;

  } catch (error) {
    console.error('❌ VEO 2 Test Failed:', error.message);
    return false;
  }
}

async function main() {
  const success = await testVEO2Simple();
  
  if (success) {
    console.log('\n🚀 Next Steps:');
    console.log('   1. Update VEO3Provider to use VEO 2 endpoints');
    console.log('   2. Test video generation with game prompts');
    console.log('   3. Integrate with Game Master system');
  } else {
    console.log('\n🔄 Alternatives:');
    console.log('   1. Try Runway ML API (runway.ml)');
    console.log('   2. Try Pika Labs API (pika.art)');
    console.log('   3. Continue with FFmpeg sample videos');
    console.log('   4. Wait for broader VEO access');
  }
}

if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch(console.error);
}

