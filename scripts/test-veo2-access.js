#!/usr/bin/env node

/**
 * Test VEO 2 Video Generation Access
 * 
 * This script tests VEO 2 (Google's earlier video generation model)
 * which might be more widely available than VEO 3.
 */

import { GoogleAuth } from 'google-auth-library';

async function testVEO2Access() {
  console.log('🎬 Testing VEO 2 Video Generation Access');
  console.log('=====================================\n');

  try {
    // Initialize authentication
    console.log('🔐 Initializing Google Service Account...');
    const auth = new GoogleAuth({
      keyFile: './lively-galaxy-7950344e0de7.json',
      scopes: [
        'https://www.googleapis.com/auth/generative-language',
        'https://www.googleapis.com/auth/cloud-platform',
        'https://www.googleapis.com/auth/aiplatform'
      ]
    });
    
    const client = await auth.getClient();
    const accessTokenResponse = await client.getAccessToken();
    const accessToken = accessTokenResponse.token;
    
    console.log('✅ Authentication successful!');
    console.log(`   🎫 Token: ${accessToken.substring(0, 20)}...`);
    console.log();

    // Test 1: List all available models to find VEO variants
    console.log('📋 Test 1: Searching for VEO Models...');
    const modelsResponse = await fetch('https://generativelanguage.googleapis.com/v1beta/models', {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      }
    });

    if (!modelsResponse.ok) {
      throw new Error(`Models API failed: ${modelsResponse.status}`);
    }

    const modelsData = await modelsResponse.json();
    console.log(`✅ Found ${modelsData.models.length} total models`);
    
    // Look for any VEO models
    const veoModels = modelsData.models.filter(model => 
      model.name.toLowerCase().includes('veo') ||
      model.displayName?.toLowerCase().includes('veo') ||
      model.description?.toLowerCase().includes('video')
    );
    
    console.log(`🎬 VEO/Video models found: ${veoModels.length}`);
    veoModels.forEach(model => {
      console.log(`   - ${model.name}`);
      if (model.displayName) console.log(`     Display: ${model.displayName}`);
      if (model.description) console.log(`     Description: ${model.description.substring(0, 100)}...`);
      if (model.supportedGenerationMethods) {
        console.log(`     Methods: ${model.supportedGenerationMethods.join(', ')}`);
      }
    });
    console.log();

    // Test 2: Try different VEO 2 endpoint variations
    console.log('📋 Test 2: Testing VEO 2 Endpoint Variations...');
    
    const veo2Endpoints = [
      'https://generativelanguage.googleapis.com/v1beta/models/veo-2:generateVideo',
      'https://generativelanguage.googleapis.com/v1beta/models/veo2:generateVideo',
      'https://generativelanguage.googleapis.com/v1beta/models/video-generation:generate',
      'https://generativelanguage.googleapis.com/v1/models/veo-2:generateVideo',
      'https://aiplatform.googleapis.com/v1/projects/lively-galaxy/locations/us-central1/publishers/google/models/veo-2:predict'
    ];

    const testPrompt = {
      prompt: "A simple test video of a blue sphere rotating",
      duration: 3,
      aspectRatio: "16:9"
    };

    for (const endpoint of veo2Endpoints) {
      console.log(`🔍 Testing: ${endpoint.split('/').pop()}`);
      
      try {
        const response = await fetch(endpoint, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(testPrompt)
        });

        console.log(`   📡 Status: ${response.status} ${response.statusText}`);
        
        if (response.ok) {
          const data = await response.json();
          console.log('   ✅ SUCCESS! VEO 2 endpoint is working!');
          console.log(`   📊 Response: ${JSON.stringify(data).substring(0, 200)}...`);
          
          // Save successful endpoint for later use
          const successInfo = {
            endpoint,
            status: 'working',
            testResponse: data,
            timestamp: new Date().toISOString()
          };
          
          const fs = await import('fs');
          if (!fs.existsSync('temp_dev')) {
            fs.mkdirSync('temp_dev', { recursive: true });
          }
          fs.writeFileSync('temp_dev/veo2_working_endpoint.json', JSON.stringify(successInfo, null, 2));
          
          return { success: true, endpoint, data };
        } else {
          const errorText = await response.text();
          console.log(`   ❌ Error: ${errorText.substring(0, 100)}...`);
        }
      } catch (error) {
        console.log(`   ❌ Request failed: ${error.message}`);
      }
      console.log();
    }

    // Test 3: Try AI Platform API (Vertex AI)
    console.log('📋 Test 3: Testing Vertex AI Platform...');
    
    try {
      const vertexEndpoint = 'https://aiplatform.googleapis.com/v1/projects/lively-galaxy/locations/us-central1/publishers/google/models/imagegeneration:predict';
      
      const vertexResponse = await fetch(vertexEndpoint, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          instances: [{
            prompt: "A simple test image of a blue sphere"
          }],
          parameters: {
            sampleCount: 1
          }
        })
      });

      console.log(`   📡 Vertex AI Status: ${vertexResponse.status} ${vertexResponse.statusText}`);
      
      if (vertexResponse.ok) {
        console.log('   ✅ Vertex AI access confirmed!');
        console.log('   💡 This suggests video models might be available through Vertex AI');
      } else {
        const errorText = await vertexResponse.text();
        console.log(`   ❌ Vertex AI Error: ${errorText.substring(0, 100)}...`);
      }
    } catch (error) {
      console.log(`   ❌ Vertex AI test failed: ${error.message}`);
    }
    console.log();

    // Test 4: Check model capabilities for video generation
    console.log('📋 Test 4: Checking Model Capabilities...');
    
    const potentialVideoModels = modelsData.models.filter(model => 
      model.supportedGenerationMethods?.includes('generateContent') &&
      (model.inputTokenLimit > 1000 || !model.inputTokenLimit)
    );
    
    console.log(`🔍 Models with generateContent capability: ${potentialVideoModels.length}`);
    
    for (const model of potentialVideoModels.slice(0, 3)) {
      console.log(`\n🧪 Testing ${model.name} for video generation...`);
      
      try {
        const testResponse = await fetch(`https://generativelanguage.googleapis.com/v1beta/${model.name}:generateContent`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            contents: [{
              parts: [{
                text: "Generate a video of a rotating blue sphere"
              }]
            }]
          })
        });

        console.log(`   📡 Status: ${testResponse.status}`);
        
        if (testResponse.ok) {
          const data = await testResponse.json();
          console.log(`   📊 Response type: ${typeof data}`);
          
          if (data.candidates && data.candidates[0] && data.candidates[0].content) {
            const content = data.candidates[0].content;
            console.log(`   📝 Content parts: ${content.parts?.length || 0}`);
            
            // Check if response contains video-related content
            const responseText = JSON.stringify(content);
            if (responseText.includes('video') || responseText.includes('mp4') || responseText.includes('generation')) {
              console.log('   🎬 Possible video generation capability detected!');
            }
          }
        }
      } catch (error) {
        console.log(`   ❌ Test failed: ${error.message}`);
      }
    }

    console.log('\n❌ No Working VEO 2 Endpoints Found');
    console.log('===================================');
    console.log('📊 Summary:');
    console.log(`   - Total models checked: ${modelsData.models.length}`);
    console.log(`   - VEO models found: ${veoModels.length}`);
    console.log(`   - Endpoints tested: ${veo2Endpoints.length}`);
    console.log(`   - All returned 404 or similar errors`);
    console.log();
    console.log('💡 Recommendations:');
    console.log('   1. VEO 2 may also require special access/approval');
    console.log('   2. Video generation might be limited to specific Google Cloud projects');
    console.log('   3. Consider using alternative providers (Runway, Pika Labs)');
    console.log('   4. Current FFmpeg videos demonstrate working infrastructure');

    return { success: false, modelsFound: modelsData.models.length, veoModels: veoModels.length };

  } catch (error) {
    console.error('❌ VEO 2 Test Failed:', error.message);
    console.log();
    console.log('🔧 This might indicate:');
    console.log('   1. Authentication issues (but previous tests worked)');
    console.log('   2. API access limitations');
    console.log('   3. Project-specific restrictions');
    
    return { success: false, error: error.message };
  }
}

async function main() {
  const result = await testVEO2Access();
  
  if (result.success) {
    console.log('\n🎉 VEO 2 Access Found!');
    console.log('Ready to generate real videos!');
  } else {
    console.log('\n📋 VEO 2 Test Complete');
    console.log('Infrastructure ready for when video APIs become available');
  }
}

if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch(console.error);
}

