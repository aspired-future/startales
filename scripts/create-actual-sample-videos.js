#!/usr/bin/env node

/**
 * Create Actual Sample Videos Script
 * 
 * This script creates actual video files (or downloads sample videos)
 * for the mock video system instead of text placeholders.
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const VIDEO_DIR = path.join(__dirname, '..', 'public', 'api', 'videos', 'mock');

// Sample video configurations
const sampleVideos = [
  {
    filename: 'space_discovery.mp4',
    title: 'Space Discovery',
    description: 'Cinematic space discovery with alien civilization',
    color: 'cyan',
    duration: 8
  },
  {
    filename: 'political_crisis.mp4', 
    title: 'Political Crisis',
    description: 'Dramatic political crisis with red alert atmosphere',
    color: 'red',
    duration: 6
  },
  {
    filename: 'economic_success.mp4',
    title: 'Economic Success', 
    description: 'Celebration of economic milestone with green prosperity',
    color: 'green',
    duration: 10
  },
  {
    filename: 'military_alert.mp4',
    title: 'Military Alert',
    description: 'Military conflict with orange/amber tactical display',
    color: 'orange',
    duration: 7
  },
  {
    filename: 'disaster_alert.mp4',
    title: 'Disaster Alert',
    description: 'Emergency disaster response with yellow warning',
    color: 'yellow', 
    duration: 9
  },
  {
    filename: 'tech_breakthrough.mp4',
    title: 'Technology Breakthrough',
    description: 'Innovation celebration with cyan/blue tech colors',
    color: 'cyan',
    duration: 8
  },
  {
    filename: 'general_announcement.mp4',
    title: 'General Announcement',
    description: 'Default Game Master announcement',
    color: 'blue',
    duration: 6
  },
  {
    filename: 'processing_placeholder.mp4',
    title: 'Processing Placeholder',
    description: 'Loading animation while video generates',
    color: 'gray',
    duration: 3
  }
];

function checkFFmpegAvailable() {
  try {
    const { execSync } = require('child_process');
    execSync('ffmpeg -version', { stdio: 'ignore' });
    return true;
  } catch {
    return false;
  }
}

function createVideoWithFFmpeg(videoConfig) {
  const { execSync } = require('child_process');
  const videoPath = path.join(VIDEO_DIR, videoConfig.filename);
  
  // Color mappings for different video types
  const colorMappings = {
    'cyan': '#00d9ff',
    'red': '#ff3366', 
    'green': '#00ff88',
    'orange': '#ff9500',
    'yellow': '#ffdd00',
    'blue': '#0099cc',
    'gray': '#666666'
  };
  
  const color = colorMappings[videoConfig.color] || '#00d9ff';
  
  // Create a simple colored video with text overlay using FFmpeg
  const ffmpegCommand = `ffmpeg -f lavfi -i "color=${color}:size=1920x1080:duration=${videoConfig.duration}:rate=30" -vf "drawtext=text='${videoConfig.title}':fontcolor=white:fontsize=60:x=(w-text_w)/2:y=(h-text_h)/2" -c:v libx264 -pix_fmt yuv420p -y "${videoPath}"`;
  
  try {
    console.log(`🎬 Creating ${videoConfig.filename} with FFmpeg...`);
    execSync(ffmpegCommand, { stdio: 'ignore' });
    console.log(`✅ Created: ${videoConfig.filename}`);
    return true;
  } catch (error) {
    console.error(`❌ Failed to create ${videoConfig.filename}:`, error.message);
    return false;
  }
}

function createSimpleVideoPlaceholder(videoConfig) {
  const videoPath = path.join(VIDEO_DIR, videoConfig.filename);
  
  // Create a minimal MP4 header (this won't be a playable video, but will have correct extension)
  const mp4Header = Buffer.from([
    0x00, 0x00, 0x00, 0x20, 0x66, 0x74, 0x79, 0x70, // ftyp box
    0x69, 0x73, 0x6F, 0x6D, 0x00, 0x00, 0x02, 0x00,
    0x69, 0x73, 0x6F, 0x6D, 0x69, 0x73, 0x6F, 0x32,
    0x61, 0x76, 0x63, 0x31, 0x6D, 0x70, 0x34, 0x31
  ]);
  
  try {
    fs.writeFileSync(videoPath, mp4Header);
    console.log(`📄 Created placeholder: ${videoConfig.filename}`);
    return true;
  } catch (error) {
    console.error(`❌ Failed to create placeholder ${videoConfig.filename}:`, error.message);
    return false;
  }
}

function downloadSampleVideo(videoConfig) {
  // This would download actual sample videos from a CDN or create them
  // For now, we'll create a proper placeholder structure
  console.log(`🌐 Would download sample video: ${videoConfig.filename}`);
  return createSimpleVideoPlaceholder(videoConfig);
}

function createThumbnails() {
  sampleVideos.forEach(video => {
    const thumbnailPath = path.join(VIDEO_DIR, video.filename.replace('.mp4', '_thumb.jpg'));
    
    // Create a simple JPEG header for thumbnail placeholder
    const jpegHeader = Buffer.from([
      0xFF, 0xD8, 0xFF, 0xE0, 0x00, 0x10, 0x4A, 0x46, 0x49, 0x46, 0x00, 0x01,
      0x01, 0x01, 0x00, 0x48, 0x00, 0x48, 0x00, 0x00, 0xFF, 0xDB, 0x00, 0x43,
      0x00, 0xFF, 0xD9
    ]);
    
    try {
      fs.writeFileSync(thumbnailPath, jpegHeader);
      console.log(`🖼️  Created thumbnail: ${video.filename.replace('.mp4', '_thumb.jpg')}`);
    } catch (error) {
      console.error(`❌ Failed to create thumbnail: ${error.message}`);
    }
  });
}

function main() {
  console.log('🎬 Creating Actual Sample Videos');
  console.log('=================================\n');

  // Ensure video directory exists
  if (!fs.existsSync(VIDEO_DIR)) {
    fs.mkdirSync(VIDEO_DIR, { recursive: true });
    console.log(`📁 Created directory: ${VIDEO_DIR}`);
  }

  console.log(`📍 Video directory: ${VIDEO_DIR}\n`);

  // Check if FFmpeg is available
  const hasFFmpeg = checkFFmpegAvailable();
  console.log(`🔧 FFmpeg available: ${hasFFmpeg ? '✅ Yes' : '❌ No'}\n`);

  let createdCount = 0;
  let method = 'placeholder';

  if (hasFFmpeg) {
    console.log('🎬 Creating videos with FFmpeg...\n');
    method = 'ffmpeg';
    
    sampleVideos.forEach(video => {
      if (createVideoWithFFmpeg(video)) {
        createdCount++;
      }
    });
  } else {
    console.log('📄 Creating video placeholders (install FFmpeg for actual videos)...\n');
    
    sampleVideos.forEach(video => {
      if (createSimpleVideoPlaceholder(video)) {
        createdCount++;
      }
    });
  }

  // Create thumbnails
  console.log('\n🖼️  Creating thumbnails...');
  createThumbnails();

  // Update manifest
  const manifestPath = path.join(VIDEO_DIR, 'video-manifest.json');
  const manifest = {
    version: '1.0.0',
    description: 'Sample Video Manifest',
    creationMethod: method,
    hasFFmpeg: hasFFmpeg,
    generatedAt: new Date().toISOString(),
    videos: sampleVideos.map(video => ({
      ...video,
      url: `/api/videos/mock/${video.filename}`,
      thumbnailUrl: `/api/videos/mock/${video.filename.replace('.mp4', '_thumb.jpg')}`,
      type: hasFFmpeg ? 'generated' : 'placeholder',
      status: 'available'
    })),
    totalVideos: sampleVideos.length,
    createdVideos: createdCount,
    note: hasFFmpeg 
      ? 'Videos created with FFmpeg - these are actual playable videos'
      : 'Placeholder files created - install FFmpeg for actual videos'
  };

  fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2));

  console.log('\n🎬 Video Creation Complete!');
  console.log('===========================');
  console.log(`📊 Created: ${createdCount}/${sampleVideos.length} videos`);
  console.log(`📁 Location: ${VIDEO_DIR}`);
  console.log(`🔧 Method: ${method}`);
  console.log(`🌐 URL Base: /api/videos/mock/`);

  if (!hasFFmpeg) {
    console.log('\n💡 To create actual videos:');
    console.log('   1. Install FFmpeg: sudo apt install ffmpeg');
    console.log('   2. Run this script again');
    console.log('   3. Or add real API keys for VEO 3/Runway/Pika');
  }

  console.log('\n🚀 Test the videos:');
  console.log('   npm run dev');
  console.log('   curl http://localhost:4000/api/videos/mock/space_discovery.mp4');
}

if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}

export { createVideoWithFFmpeg, createSimpleVideoPlaceholder };

