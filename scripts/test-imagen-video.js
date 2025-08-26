#!/usr/bin/env node

/**
 * Test Imagen Models for Video Generation
 * 
 * Test if Imagen 3.0 or Imagen 4.0 can generate videos or image sequences
 * that we could convert to videos.
 */

import { GoogleAuth } from 'google-auth-library';

async function testImagenVideo() {
  console.log('🎨 Testing Imagen Models for Video Generation');
  console.log('============================================\n');

  try {
    // Initialize authentication
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
    console.log();

    // Test Imagen models
    const imagenModels = [
      {
        name: 'Imagen 3.0',
        id: 'models/imagen-3.0-generate-002',
        method: 'predict'
      },
      {
        name: 'Imagen 4.0 Preview',
        id: 'models/imagen-4.0-generate-preview-06-06',
        method: 'predict'
      }
    ];

    const testPrompts = [
      {
        type: 'video_request',
        prompt: 'Generate a video of a rotating blue sphere in space',
        description: 'Direct video request'
      },
      {
        type: 'image_sequence',
        prompt: 'Generate 8 sequential frames of a blue sphere rotating 360 degrees in space, frame by frame animation',
        description: 'Image sequence for video'
      },
      {
        type: 'single_frame',
        prompt: 'A futuristic space station with glowing cyan lights, cinematic sci-fi style',
        description: 'Single high-quality frame'
      }
    ];

    let workingConfigs = [];

    for (const model of imagenModels) {
      console.log(`🎨 Testing ${model.name} (${model.id})`);
      console.log('=' .repeat(50));
      
      for (const testPrompt of testPrompts) {
        console.log(`\n🧪 Test: ${testPrompt.description}`);
        console.log(`📝 Prompt: ${testPrompt.prompt.substring(0, 80)}...`);
        
        // Try different API formats for Imagen
        const apiFormats = [
          {
            name: 'Predict Format',
            url: `https://generativelanguage.googleapis.com/v1beta/${model.id}:predict`,
            body: {
              instances: [{
                prompt: testPrompt.prompt
              }],
              parameters: {
                sampleCount: 1,
                aspectRatio: "16:9",
                seed: 12345
              }
            }
          },
          {
            name: 'Generate Content Format',
            url: `https://generativelanguage.googleapis.com/v1beta/${model.id}:generateContent`,
            body: {
              contents: [{
                parts: [{
                  text: testPrompt.prompt
                }]
              }],
              generationConfig: {
                maxOutputTokens: 1000
              }
            }
          },
          {
            name: 'Generate Image Format',
            url: `https://generativelanguage.googleapis.com/v1beta/${model.id}:generateImage`,
            body: {
              prompt: testPrompt.prompt,
              aspectRatio: "16:9",
              numberOfImages: testPrompt.type === 'image_sequence' ? 8 : 1
            }
          }
        ];

        for (const format of apiFormats) {
          console.log(`   🔍 Trying ${format.name}...`);
          
          try {
            const response = await fetch(format.url, {
              method: 'POST',
              headers: {
                'Authorization': `Bearer ${accessToken}`,
                'Content-Type': 'application/json'
              },
              body: JSON.stringify(format.body)
            });

            console.log(`   📡 Status: ${response.status} ${response.statusText}`);
            
            if (response.ok) {
              const data = await response.json();
              console.log('   ✅ SUCCESS! Imagen is responding!');
              console.log(`   📊 Response keys: ${Object.keys(data).join(', ')}`);
              
              // Check for image data
              if (data.predictions && data.predictions.length > 0) {
                console.log(`   🖼️ Predictions: ${data.predictions.length}`);
                const prediction = data.predictions[0];
                
                if (prediction.bytesBase64Encoded) {
                  console.log('   📸 Base64 image data found!');
                } else if (prediction.mimeType) {
                  console.log(`   📄 MIME type: ${prediction.mimeType}`);
                }
              }
              
              // Check for candidates (generateContent format)
              if (data.candidates && data.candidates.length > 0) {
                console.log(`   📝 Candidates: ${data.candidates.length}`);
                const candidate = data.candidates[0];
                
                if (candidate.content && candidate.content.parts) {
                  console.log(`   🧩 Content parts: ${candidate.content.parts.length}`);
                  
                  candidate.content.parts.forEach((part, index) => {
                    if (part.text) {
                      console.log(`   📝 Part ${index + 1}: Text (${part.text.length} chars)`);
                    } else if (part.inlineData) {
                      console.log(`   📸 Part ${index + 1}: Image data (${part.inlineData.mimeType})`);
                    }
                  });
                }
              }
              
              // Save working configuration
              const workingConfig = {
                model: model.name,
                modelId: model.id,
                format: format.name,
                url: format.url,
                testType: testPrompt.type,
                prompt: testPrompt.prompt,
                response: data,
                timestamp: new Date().toISOString()
              };
              
              workingConfigs.push(workingConfig);
              
              // If this looks like it could generate video frames, note it
              if (testPrompt.type === 'image_sequence' && (data.predictions?.length > 1 || data.candidates?.length > 1)) {
                console.log('   🎬 POTENTIAL VIDEO CAPABILITY! Multiple frames detected!');
              }
              
            } else {
              const errorText = await response.text();
              console.log(`   ❌ Error: ${response.status}`);
              
              if (response.status === 404) {
                console.log(`   💡 Endpoint not found`);
              } else if (response.status === 403) {
                console.log(`   💡 Access denied`);
              } else if (response.status === 400) {
                console.log(`   💡 Bad request - format might be wrong`);
                console.log(`   📝 Details: ${errorText.substring(0, 100)}...`);
              }
            }
          } catch (error) {
            console.log(`   ❌ Request failed: ${error.message}`);
          }
        }
      }
      console.log();
    }

    // Summary
    console.log('📊 Imagen Video Test Results');
    console.log('===========================');
    
    if (workingConfigs.length > 0) {
      console.log(`✅ Found ${workingConfigs.length} working configurations!`);
      
      // Save all working configurations
      const fs = await import('fs');
      if (!fs.existsSync('temp_dev')) {
        fs.mkdirSync('temp_dev', { recursive: true });
      }
      
      fs.writeFileSync('temp_dev/imagen_working_configs.json', JSON.stringify(workingConfigs, null, 2));
      
      console.log('📄 Configurations saved to temp_dev/imagen_working_configs.json');
      console.log();
      
      // Analyze what we found
      const imageGenerators = workingConfigs.filter(config => 
        config.response.predictions || config.response.candidates
      );
      
      const sequenceGenerators = workingConfigs.filter(config => 
        config.testType === 'image_sequence' && 
        (config.response.predictions?.length > 1 || config.response.candidates?.length > 1)
      );
      
      console.log('🎯 Capabilities Found:');
      console.log(`   📸 Image Generation: ${imageGenerators.length} working configs`);
      console.log(`   🎬 Sequence Generation: ${sequenceGenerators.length} working configs`);
      
      if (sequenceGenerators.length > 0) {
        console.log('\n🎬 VIDEO GENERATION POSSIBLE!');
        console.log('We can generate image sequences and convert them to videos!');
      } else if (imageGenerators.length > 0) {
        console.log('\n📸 IMAGE GENERATION CONFIRMED!');
        console.log('We can generate single frames for Game Master announcements!');
      }
      
    } else {
      console.log('❌ No working Imagen configurations found');
      console.log('💡 Imagen models may require different authentication or endpoints');
    }
    
    return workingConfigs;

  } catch (error) {
    console.error('❌ Imagen Test Failed:', error.message);
    return [];
  }
}

async function main() {
  const workingConfigs = await testImagenVideo();
  
  if (workingConfigs.length > 0) {
    console.log('\n🚀 Next Steps:');
    console.log('   1. Create ImagenVideoProvider using working configurations');
    console.log('   2. Generate image sequences for video conversion');
    console.log('   3. Use FFmpeg to convert image sequences to MP4 videos');
    console.log('   4. Integrate with Game Master system');
  } else {
    console.log('\n🔄 Continue with current approach:');
    console.log('   1. FFmpeg sample videos are working well');
    console.log('   2. Infrastructure is ready for any video provider');
    console.log('   3. Monitor for VEO access availability');
  }
}

if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch(console.error);
}

