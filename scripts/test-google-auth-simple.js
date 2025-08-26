#!/usr/bin/env node

/**
 * Simple Google Service Account Test
 * 
 * This script directly tests Google Service Account authentication
 * without depending on the full TypeScript build.
 */

import { GoogleAuth } from 'google-auth-library';
import fs from 'fs';
import path from 'path';

async function testGoogleAuth() {
  console.log('🔐 Testing Google Service Account Authentication');
  console.log('==============================================\n');

  try {
    // Test 1: Check if service account file exists
    console.log('📋 Test 1: Checking Service Account File...');
    const serviceAccountPath = './lively-galaxy-7950344e0de7.json';
    
    if (!fs.existsSync(serviceAccountPath)) {
      throw new Error(`Service account file not found: ${serviceAccountPath}`);
    }
    
    console.log('✅ Service account file found!');
    console.log(`   📁 Path: ${path.resolve(serviceAccountPath)}`);
    
    // Load and validate the service account config
    const configData = fs.readFileSync(serviceAccountPath, 'utf8');
    const config = JSON.parse(configData);
    
    console.log(`   📧 Client Email: ${config.client_email}`);
    console.log(`   🏗️ Project ID: ${config.project_id}`);
    console.log(`   🔑 Type: ${config.type}`);
    console.log();

    // Test 2: Initialize Google Auth
    console.log('📋 Test 2: Initializing Google Auth...');
    const auth = new GoogleAuth({
      keyFile: serviceAccountPath,
      scopes: [
        'https://www.googleapis.com/auth/generative-language',
        'https://www.googleapis.com/auth/cloud-platform'
      ]
    });
    
    console.log('✅ Google Auth initialized successfully!');
    console.log();

    // Test 3: Get Access Token
    console.log('📋 Test 3: Getting Access Token...');
    const client = await auth.getClient();
    const accessTokenResponse = await client.getAccessToken();
    
    if (!accessTokenResponse.token) {
      throw new Error('Failed to obtain access token');
    }
    
    const accessToken = accessTokenResponse.token;
    console.log('✅ Access token obtained successfully!');
    console.log(`   🎫 Token: ${accessToken.substring(0, 20)}...${accessToken.substring(accessToken.length - 10)}`);
    console.log(`   📏 Length: ${accessToken.length} characters`);
    console.log();

    // Test 4: Test API Call to Google Generative Language API
    console.log('📋 Test 4: Testing API Access...');
    const testUrl = 'https://generativelanguage.googleapis.com/v1beta/models';
    
    const response = await fetch(testUrl, {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      }
    });

    console.log(`   📡 API Response Status: ${response.status} ${response.statusText}`);
    
    if (response.ok) {
      console.log('✅ API access successful!');
      
      try {
        const data = await response.json();
        console.log(`   📊 Available Models: ${data.models ? data.models.length : 'Unknown'}`);
        
        if (data.models && data.models.length > 0) {
          const veoModels = data.models.filter(model => 
            model.name && model.name.toLowerCase().includes('veo')
          );
          console.log(`   🎬 VEO Models Found: ${veoModels.length}`);
          
          if (veoModels.length > 0) {
            veoModels.forEach(model => {
              console.log(`      - ${model.name}`);
            });
          }
        }
      } catch (parseError) {
        console.log('   ⚠️ Could not parse API response, but authentication worked');
      }
    } else {
      const errorText = await response.text();
      console.log(`   ❌ API Error: ${errorText}`);
      
      if (response.status === 403) {
        console.log('   💡 This might mean:');
        console.log('      - The service account lacks required permissions');
        console.log('      - The Generative Language API is not enabled for this project');
        console.log('      - VEO 3 access requires special approval');
      }
    }
    
    console.log();

    console.log('🎉 Authentication Test Complete!');
    console.log('================================');
    console.log('✅ Google Service Account file is valid');
    console.log('✅ Authentication credentials work');
    console.log('✅ Can obtain access tokens');
    
    if (response.ok) {
      console.log('✅ API access is working');
      console.log();
      console.log('🚀 Ready for VEO 3 video generation!');
    } else {
      console.log('⚠️ API access needs configuration');
      console.log();
      console.log('🔧 Next Steps:');
      console.log('   1. Enable the Generative Language API in Google Cloud Console');
      console.log('   2. Ensure the service account has the required permissions');
      console.log('   3. Request access to VEO 3 if needed');
    }

  } catch (error) {
    console.error('❌ Test Failed:', error.message);
    console.log();
    console.log('🔧 Troubleshooting:');
    console.log('   1. Ensure lively-galaxy-7950344e0de7.json is in the project root');
    console.log('   2. Check that the service account file is valid JSON');
    console.log('   3. Verify the service account has the required permissions');
    console.log('   4. Enable the Generative Language API in Google Cloud Console');
    
    process.exit(1);
  }
}

async function main() {
  await testGoogleAuth();
}

if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch(console.error);
}

