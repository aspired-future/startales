#!/usr/bin/env node

/**
 * Test script for STT service
 * Tests the real Whisper STT service running in Docker
 */

import axios from 'axios';
import fs from 'fs';
import FormData from 'form-data';

const STT_URL = 'http://localhost:8001';

async function testSTTService() {
  console.log('🧪 Testing STT Service...\n');

  try {
    // 1. Test health endpoint
    console.log('1. Testing health endpoint...');
    const healthResponse = await axios.get(`${STT_URL}/health`);
    console.log('✅ Health check passed:', healthResponse.data);
    console.log();

    // 2. Test models endpoint
    console.log('2. Testing models endpoint...');
    const modelsResponse = await axios.get(`${STT_URL}/models`);
    console.log('✅ Models endpoint:', modelsResponse.data);
    console.log();

    // 3. Test transcription with a simple text request
    console.log('3. Testing text-based transcription...');
    
    // Create a simple base64 encoded "audio" (this is just for testing the endpoint)
    const testText = "Hello world, this is a test";
    const testAudioBase64 = Buffer.from(testText).toString('base64');
    
    try {
      const transcribeResponse = await axios.post(`${STT_URL}/transcribe/text`, {
        audio_data: testAudioBase64,
        language: 'en',
        task: 'transcribe'
      });
      console.log('✅ Text transcription response:', transcribeResponse.data);
    } catch (error) {
      console.log('⚠️ Text transcription failed (expected - not real audio):', error.response?.data || error.message);
    }
    console.log();

    console.log('🎉 STT Service is working and accessible!');
    console.log();
    console.log('📝 Next steps:');
    console.log('   • Upload a real audio file to test transcription');
    console.log('   • Test WebSocket streaming');
    console.log('   • Build the TTS service');
    console.log('   • Test the complete voice pipeline');

  } catch (error) {
    console.error('❌ STT Service test failed:');
    console.error(error.message);
    if (error.response) {
      console.error('Response data:', error.response.data);
    }
    process.exit(1);
  }
}

testSTTService();
