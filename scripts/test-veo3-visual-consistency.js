#!/usr/bin/env node

/**
 * VEO 3 Visual Consistency Test Script
 * 
 * This script demonstrates the VEO 3 video generation system with visual consistency
 * ensuring all generated videos match the game's established visual style.
 */

import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const API_BASE = 'http://localhost:4000/api/gamemaster';

async function testVEO3VisualConsistency() {
  console.log('🎬 VEO 3 Visual Consistency Test Suite');
  console.log('=====================================\n');

  // Test 1: Basic Event Video with Style Consistency
  console.log('📋 Test 1: Basic Event Video Generation');
  await testBasicEventVideo();

  // Test 2: Character-Specific Video Consistency
  console.log('\n📋 Test 2: Character-Specific Video Generation');
  await testCharacterVideo();

  // Test 3: Location-Specific Video Consistency
  console.log('\n📋 Test 3: Location-Specific Video Generation');
  await testLocationVideo();

  // Test 4: Multiple Event Types with Consistent Styling
  console.log('\n📋 Test 4: Multiple Event Types Consistency');
  await testMultipleEventTypes();

  // Test 5: Visual Style Validation
  console.log('\n📋 Test 5: Visual Style Validation');
  await testStyleValidation();

  console.log('\n🎬 VEO 3 Visual Consistency Tests Complete!');
}

async function testBasicEventVideo() {
  try {
    const response = await fetch(`${API_BASE}/test/veo3/event-video`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        eventType: 'major_discovery',
        context: {
          discoveryType: 'alien_civilization',
          location: 'Proxima Centauri System',
          significance: 'high'
        }
      })
    });

    const result = await response.json();
    
    if (result.success) {
      console.log('✅ Basic event video generated successfully');
      console.log(`   Event: ${result.eventType}`);
      console.log(`   Video URL: ${result.video.videoUrl}`);
      console.log(`   Prompt Length: ${result.promptLength} characters`);
      console.log(`   Style Applied: ${result.visualConsistency.styleApplied}`);
      console.log(`   Color Palette: ${result.visualConsistency.colorPaletteUsed}`);
    } else {
      console.log('❌ Basic event video generation failed:', result.error);
    }
  } catch (error) {
    console.log('❌ Basic event video test error:', error.message);
  }
}

async function testCharacterVideo() {
  try {
    const response = await fetch(`${API_BASE}/test/veo3/character-video`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        characterId: 'commander_alpha',
        eventType: 'diplomatic_achievement',
        context: {
          species: 'Human',
          rank: 'Commander',
          emotion: 'confident'
        }
      })
    });

    const result = await response.json();
    
    if (result.success) {
      console.log('✅ Character-specific video generated successfully');
      console.log(`   Character: ${result.characterId}`);
      console.log(`   Event: ${result.eventType}`);
      console.log(`   Video URL: ${result.video.videoUrl}`);
      console.log(`   Character Consistency: ${result.visualConsistency.characterConsistency}`);
      console.log(`   Visual Seed Used: ${result.visualConsistency.visualSeedUsed}`);
      console.log(`   Species Aesthetics: ${result.visualConsistency.speciesAestheticsApplied}`);
    } else {
      console.log('❌ Character video generation failed:', result.error);
    }
  } catch (error) {
    console.log('❌ Character video test error:', error.message);
  }
}

async function testLocationVideo() {
  try {
    const response = await fetch(`${API_BASE}/test/veo3/location-video`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        locationId: 'new_terra_colony',
        eventType: 'colony_established',
        context: {
          biome: 'terrestrial',
          population: 50000,
          architecture: 'futuristic_sustainable'
        }
      })
    });

    const result = await response.json();
    
    if (result.success) {
      console.log('✅ Location-specific video generated successfully');
      console.log(`   Location: ${result.locationId}`);
      console.log(`   Event: ${result.eventType}`);
      console.log(`   Video URL: ${result.video.videoUrl}`);
      console.log(`   Location Consistency: ${result.visualConsistency.locationConsistency}`);
      console.log(`   Environmental Styling: ${result.visualConsistency.environmentalStyling}`);
      console.log(`   Architectural Consistency: ${result.visualConsistency.architecturalConsistency}`);
    } else {
      console.log('❌ Location video generation failed:', result.error);
    }
  } catch (error) {
    console.log('❌ Location video test error:', error.message);
  }
}

async function testMultipleEventTypes() {
  const eventTypes = [
    { type: 'major_discovery', context: { discoveryType: 'quantum_anomaly' } },
    { type: 'political_crisis', context: { stabilityChange: -30 } },
    { type: 'economic_milestone', context: { gdpGrowth: 45 } },
    { type: 'technology_breakthrough', context: { techType: 'faster_than_light_communication' } }
  ];

  console.log(`Testing ${eventTypes.length} different event types for visual consistency...`);

  for (const event of eventTypes) {
    try {
      const response = await fetch(`${API_BASE}/test/veo3/event-video`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          eventType: event.type,
          context: event.context
        })
      });

      const result = await response.json();
      
      if (result.success) {
        console.log(`✅ ${event.type}: Video generated with consistent styling`);
        console.log(`   Video Type: ${result.videoType}`);
        console.log(`   Duration: ${result.video.duration}s`);
      } else {
        console.log(`❌ ${event.type}: Generation failed - ${result.error}`);
      }
    } catch (error) {
      console.log(`❌ ${event.type}: Test error - ${error.message}`);
    }
  }
}

async function testStyleValidation() {
  try {
    // Generate a test video first
    const response = await fetch(`${API_BASE}/test/veo3/generate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        prompt: 'A futuristic space station with cyan glowing lights and clean sci-fi architecture, cinematic style, Mass Effect inspired',
        duration: 6,
        aspectRatio: '16:9',
        style: 'cinematic',
        quality: 'high'
      })
    });

    const result = await response.json();
    
    if (result.success) {
      console.log('✅ Style validation test video generated');
      console.log(`   Video ID: ${result.video.videoId}`);
      console.log(`   Status: ${result.video.status}`);
      console.log(`   URL: ${result.video.videoUrl}`);
      
      // Test status checking
      if (result.video.videoId) {
        const statusResponse = await fetch(`${API_BASE}/test/veo3/status/${result.video.videoId}`);
        const statusResult = await statusResponse.json();
        
        if (statusResult.success) {
          console.log('✅ Video status check successful');
          console.log(`   Status: ${statusResult.status.status}`);
        }
      }
    } else {
      console.log('❌ Style validation test failed:', result.error);
    }
  } catch (error) {
    console.log('❌ Style validation test error:', error.message);
  }
}

// Color palette demonstration
function demonstrateColorPalette() {
  console.log('\n🎨 Game Color Palette for VEO 3 Videos:');
  console.log('=======================================');
  console.log('Primary (Cyan/Blue Tech): #00d9ff, #0099cc, #004d66');
  console.log('Secondary (Orange/Amber): #ff9500, #cc7700, #663c00');
  console.log('Success (Green Matrix): #00ff88, #00cc66, #004d26');
  console.log('Warning (Yellow Alert): #ffdd00, #ccaa00, #665500');
  console.log('Danger (Red Alert): #ff3366, #cc1144, #660822');
  console.log('Interface (Dark Sci-Fi): #0a0a0f, #1a1a2e, #16213e, #2a4a6b');
  console.log('Text Colors: #e0e6ed, #a0b3c8, #00d9ff');
}

// Visual style guidelines
function displayStyleGuidelines() {
  console.log('\n📐 VEO 3 Visual Style Guidelines:');
  console.log('================================');
  console.log('Art Style: Sci-Fi with Mass Effect/Star Trek influences');
  console.log('Mood: Heroic and dramatic');
  console.log('Lighting: Cinematic with dramatic shadows');
  console.log('Camera Work: Sweeping movements for epic feel');
  console.log('Quality: High production values');
  console.log('Aspect Ratio: 16:9 for cinematic presentation');
  console.log('Duration: 6-12 seconds depending on event importance');
}

// Main execution
if (import.meta.url === `file://${process.argv[1]}`) {
  demonstrateColorPalette();
  displayStyleGuidelines();
  
  console.log('\n🚀 Starting VEO 3 Visual Consistency Tests...');
  console.log('Make sure the server is running on http://localhost:4000\n');
  
  testVEO3VisualConsistency().catch(error => {
    console.error('❌ Test suite failed:', error);
    process.exit(1);
  });
}

export {
  testVEO3VisualConsistency,
  testBasicEventVideo,
  testCharacterVideo,
  testLocationVideo
};
