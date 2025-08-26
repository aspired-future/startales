#!/usr/bin/env node

/**
 * Test script to verify Ollama + Google Service Account configuration
 * Run this to test the provider setup
 */

const fs = require('fs');
const path = require('path');

console.log('🔧 Testing Provider Configuration');
console.log('================================');

// Check if Ollama is running
async function testOllama() {
  console.log('\n🦙 Testing Ollama Connection...');
  
  try {
    const response = await fetch('http://localhost:11434/api/tags');
    if (response.ok) {
      const data = await response.json();
      console.log('✅ Ollama is running');
      console.log('📋 Available models:', data.models?.map(m => m.name).join(', ') || 'None');
      return true;
    } else {
      console.log('❌ Ollama is not responding properly');
      return false;
    }
  } catch (error) {
    console.log('❌ Ollama is not running or not accessible');
    console.log('💡 Start Ollama with: ollama serve');
    console.log('💡 Pull a model with: ollama pull llama3.2');
    return false;
  }
}

// Test Ollama LLM generation
async function testOllamaGeneration() {
  console.log('\n🧠 Testing Ollama Text Generation...');
  
  try {
    const response = await fetch('http://localhost:11434/api/generate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'llama3.2',
        prompt: 'Write a short greeting for a space game.',
        stream: false
      })
    });

    if (response.ok) {
      const data = await response.json();
      console.log('✅ Ollama generation successful');
      console.log('📝 Sample response:', data.response?.substring(0, 100) + '...');
      return true;
    } else {
      console.log('❌ Ollama generation failed');
      return false;
    }
  } catch (error) {
    console.log('❌ Error testing Ollama generation:', error.message);
    return false;
  }
}

// Check Google service account
function testGoogleServiceAccount() {
  console.log('\n🔑 Testing Google Service Account...');
  
  const serviceAccountPath = path.join(process.cwd(), 'lively-galaxy-7950344e0de7.json');
  
  if (!fs.existsSync(serviceAccountPath)) {
    console.log('❌ Google service account file not found');
    console.log('💡 Expected location:', serviceAccountPath);
    console.log('💡 Make sure the service account JSON file is in the project root');
    return false;
  }

  try {
    const serviceAccount = JSON.parse(fs.readFileSync(serviceAccountPath, 'utf8'));
    
    if (serviceAccount.type === 'service_account' && serviceAccount.private_key && serviceAccount.client_email) {
      console.log('✅ Google service account file is valid');
      console.log('📧 Service account email:', serviceAccount.client_email);
      console.log('🏗️ Project ID:', serviceAccount.project_id);
      return true;
    } else {
      console.log('❌ Google service account file is invalid');
      return false;
    }
  } catch (error) {
    console.log('❌ Error reading service account file:', error.message);
    return false;
  }
}

// Check environment variables
function testEnvironmentConfig() {
  console.log('\n🌍 Testing Environment Configuration...');
  
  const requiredVars = [
    'GOOGLE_APPLICATION_CREDENTIALS'
  ];
  
  const optionalVars = [
    'AI_PROVIDER',
    'OLLAMA_BASE_URL',
    'GOOGLE_API_KEY'
  ];
  
  let allGood = true;
  
  // Check if GOOGLE_APPLICATION_CREDENTIALS is set or if the file exists in root
  const googleCreds = process.env.GOOGLE_APPLICATION_CREDENTIALS;
  const serviceAccountExists = fs.existsSync(path.join(process.cwd(), 'lively-galaxy-7950344e0de7.json'));
  
  if (googleCreds) {
    console.log('✅ GOOGLE_APPLICATION_CREDENTIALS is set:', googleCreds);
  } else if (serviceAccountExists) {
    console.log('✅ Service account file found in project root (auto-detected)');
  } else {
    console.log('⚠️ GOOGLE_APPLICATION_CREDENTIALS not set and no service account file found');
    console.log('💡 Set GOOGLE_APPLICATION_CREDENTIALS=./lively-galaxy-7950344e0de7.json');
    allGood = false;
  }
  
  // Check optional vars
  optionalVars.forEach(varName => {
    const value = process.env[varName];
    if (value) {
      console.log(`✅ ${varName}:`, value);
    } else {
      console.log(`ℹ️ ${varName}: not set (using defaults)`);
    }
  });
  
  return allGood;
}

// Main test function
async function runTests() {
  console.log('🚀 Starting provider configuration tests...\n');
  
  const results = {
    ollama: await testOllama(),
    ollamaGeneration: false,
    googleServiceAccount: testGoogleServiceAccount(),
    environment: testEnvironmentConfig()
  };
  
  // Only test generation if Ollama is running
  if (results.ollama) {
    results.ollamaGeneration = await testOllamaGeneration();
  }
  
  console.log('\n📊 Test Results Summary');
  console.log('=======================');
  console.log('🦙 Ollama Connection:', results.ollama ? '✅ PASS' : '❌ FAIL');
  console.log('🧠 Ollama Generation:', results.ollamaGeneration ? '✅ PASS' : '❌ FAIL');
  console.log('🔑 Google Service Account:', results.googleServiceAccount ? '✅ PASS' : '❌ FAIL');
  console.log('🌍 Environment Config:', results.environment ? '✅ PASS' : '⚠️ PARTIAL');
  
  const allPassed = results.ollama && results.ollamaGeneration && results.googleServiceAccount;
  
  if (allPassed) {
    console.log('\n🎉 All tests passed! Your configuration is ready.');
    console.log('💡 You can now use Ollama for LLM and Google service account for images.');
  } else {
    console.log('\n⚠️ Some tests failed. Please check the issues above.');
    
    if (!results.ollama) {
      console.log('\n🦙 To fix Ollama issues:');
      console.log('   1. Install Ollama: https://ollama.ai/');
      console.log('   2. Start Ollama: ollama serve');
      console.log('   3. Pull a model: ollama pull llama3.2');
    }
    
    if (!results.googleServiceAccount) {
      console.log('\n🔑 To fix Google service account issues:');
      console.log('   1. Place your service account JSON file in the project root');
      console.log('   2. Name it: lively-galaxy-7950344e0de7.json');
      console.log('   3. Or set GOOGLE_APPLICATION_CREDENTIALS environment variable');
    }
  }
  
  console.log('\n🔧 Configuration file created at: src/server/config/providers.json');
  console.log('📖 This file shows how to configure the provider system.');
}

// Run the tests
runTests().catch(console.error);
