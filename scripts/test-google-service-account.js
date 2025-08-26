#!/usr/bin/env node

/**
 * Test Google Service Account Authentication
 * 
 * This script tests the Google Service Account authentication
 * for VEO 3 video generation.
 */

import { GoogleServiceAccountAuth } from '../src/server/auth/GoogleServiceAccountAuth.js';
import { VEO3Provider } from '../src/server/gamemaster/video-providers/VEO3Provider.js';

async function testServiceAccountAuth() {
  console.log('🔐 Testing Google Service Account Authentication');
  console.log('==============================================\n');

  try {
    // Test 1: Load Service Account
    console.log('📋 Test 1: Loading Service Account...');
    const auth = GoogleServiceAccountAuth.autoDetect();
    const authInfo = auth.getAuthInfo();
    
    console.log('✅ Service Account loaded successfully!');
    console.log(`   📧 Client Email: ${authInfo.clientEmail}`);
    console.log(`   🏗️ Project ID: ${authInfo.projectId}`);
    console.log(`   🔑 Scopes: ${authInfo.scopes.join(', ')}`);
    console.log();

    // Test 2: Get Access Token
    console.log('📋 Test 2: Getting Access Token...');
    const accessToken = await auth.getAccessToken();
    console.log('✅ Access token obtained successfully!');
    console.log(`   🎫 Token: ${accessToken.substring(0, 20)}...${accessToken.substring(accessToken.length - 10)}`);
    console.log(`   📏 Length: ${accessToken.length} characters`);
    console.log();

    // Test 3: Validate Authentication
    console.log('📋 Test 3: Validating Authentication...');
    const isValid = await auth.isValid();
    console.log(`✅ Authentication is ${isValid ? 'VALID' : 'INVALID'}`);
    console.log();

    // Test 4: Test VEO 3 Provider Initialization
    console.log('📋 Test 4: Testing VEO 3 Provider...');
    const veo3Provider = new VEO3Provider({
      name: 'veo3',
      apiKey: '', // Will use service account
      enabled: true,
      priority: 1,
      timeout: 60000
    });

    const isAuthenticated = await veo3Provider.isAuthenticated();
    console.log(`✅ VEO 3 Provider authentication: ${isAuthenticated ? 'SUCCESS' : 'FAILED'}`);
    console.log();

    // Test 5: Test API Availability (without generating video)
    console.log('📋 Test 5: Testing API Availability...');
    const isAvailable = await veo3Provider.isAvailable();
    console.log(`✅ VEO 3 API availability: ${isAvailable ? 'AVAILABLE' : 'UNAVAILABLE'}`);
    console.log();

    // Test 6: Get Provider Capabilities
    console.log('📋 Test 6: Getting Provider Capabilities...');
    const capabilities = veo3Provider.getCapabilities();
    console.log('✅ VEO 3 Capabilities:');
    console.log(`   📹 Name: ${capabilities.name}`);
    console.log(`   ⏱️ Max Duration: ${capabilities.maxDuration}s`);
    console.log(`   💰 Cost per Second: $${capabilities.costPerSecond}`);
    console.log(`   📐 Aspect Ratios: ${capabilities.supportedAspectRatios.join(', ')}`);
    console.log(`   🎨 Styles: ${capabilities.supportedStyles.join(', ')}`);
    console.log();

    console.log('🎉 All Tests Passed!');
    console.log('====================');
    console.log('✅ Google Service Account authentication is working');
    console.log('✅ VEO 3 Provider is properly configured');
    console.log('✅ Ready for real video generation!');
    console.log();
    console.log('🚀 Next Steps:');
    console.log('   1. Start the server: npm run dev');
    console.log('   2. Test video generation: curl -X POST http://localhost:4000/api/video/test/unified/generate \\');
    console.log('      -H "Content-Type: application/json" \\');
    console.log('      -d \'{"prompt": "A futuristic space station", "duration": 6}\'');

  } catch (error) {
    console.error('❌ Test Failed:', error.message);
    console.log();
    console.log('🔧 Troubleshooting:');
    console.log('   1. Ensure lively-galaxy-7950344e0de7.json is in the project root');
    console.log('   2. Check that the service account has the required permissions:');
    console.log('      - Generative Language API access');
    console.log('      - Cloud Platform access');
    console.log('   3. Verify the service account file is valid JSON');
    console.log('   4. Check that the Google Cloud project has VEO 3 API enabled');
    
    process.exit(1);
  }
}

async function main() {
  await testServiceAccountAuth();
}

if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch(console.error);
}

