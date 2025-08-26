#!/usr/bin/env node

/**
 * Create Sample Videos Script
 * 
 * This script creates placeholder video files for the VEO 3 mock system.
 * In production, these would be replaced with actual generated videos.
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const VIDEO_DIR = path.join(__dirname, '..', 'public', 'api', 'videos', 'mock');
const THUMBNAIL_DIR = VIDEO_DIR; // Same directory for thumbnails

// Sample video metadata
const sampleVideos = [
  {
    filename: 'space_discovery.mp4',
    title: 'Space Discovery',
    description: 'A cinematic video showing the discovery of alien civilization in deep space',
    duration: 8,
    style: 'Epic sci-fi with cyan/blue tech colors'
  },
  {
    filename: 'political_crisis.mp4',
    title: 'Political Crisis',
    description: 'Urgent political crisis with red alert colors and dramatic tension',
    duration: 6,
    style: 'Dramatic with red alert palette'
  },
  {
    filename: 'economic_success.mp4',
    title: 'Economic Success',
    description: 'Celebration of economic milestone with green prosperity colors',
    duration: 10,
    style: 'Celebratory with green matrix colors'
  },
  {
    filename: 'military_alert.mp4',
    title: 'Military Alert',
    description: 'Military conflict with orange/amber energy colors and tactical angles',
    duration: 7,
    style: 'Dynamic military with orange/amber palette'
  },
  {
    filename: 'disaster_alert.mp4',
    title: 'Disaster Alert',
    description: 'Emergency disaster response with yellow warning colors',
    duration: 9,
    style: 'Urgent emergency with yellow alert colors'
  },
  {
    filename: 'tech_breakthrough.mp4',
    title: 'Technology Breakthrough',
    description: 'Innovation celebration with cyan/blue tech colors',
    duration: 8,
    style: 'Inspiring tech with cyan/blue palette'
  },
  {
    filename: 'general_announcement.mp4',
    title: 'General Announcement',
    description: 'Default Game Master announcement video',
    duration: 6,
    style: 'Professional with balanced color palette'
  },
  {
    filename: 'processing_placeholder.mp4',
    title: 'Processing Placeholder',
    description: 'Placeholder video shown while real video is being generated',
    duration: 3,
    style: 'Simple loading animation'
  }
];

function createPlaceholderVideo(videoPath, metadata) {
  // Create a simple text file as placeholder (in real implementation, this would be an actual video)
  const placeholderContent = `# ${metadata.title}

## Video Metadata
- **Filename**: ${metadata.filename}
- **Description**: ${metadata.description}
- **Duration**: ${metadata.duration} seconds
- **Visual Style**: ${metadata.style}

## VEO 3 Generation Prompt
This video would be generated using VEO 3 with the following characteristics:

### Visual Style Requirements
- **Color Palette**: Game-consistent colors based on event type
- **Cinematography**: ${metadata.style}
- **Quality**: High production values (1080p, 30fps)
- **Aspect Ratio**: 16:9 cinematic

### Technical Specifications
- **Format**: MP4 (H.264)
- **Resolution**: 1920x1080
- **Frame Rate**: 30 fps
- **Duration**: ${metadata.duration} seconds

## Mock Video Notice
🎬 This is a placeholder file. In production with a valid GOOGLE_API_KEY, 
this would be replaced with an actual VEO 3 generated video.

To enable real video generation:
1. Get Google API key from https://aistudio.google.com/
2. Set GOOGLE_API_KEY environment variable
3. Restart the server

Generated at: ${new Date().toISOString()}
`;

  fs.writeFileSync(videoPath, placeholderContent, 'utf8');
  console.log(`✅ Created placeholder: ${path.basename(videoPath)}`);
}

function createThumbnail(thumbnailPath, metadata) {
  const thumbnailContent = `# ${metadata.title} - Thumbnail

This would be a thumbnail image (JPG format) for the video.

Video: ${metadata.filename}
Style: ${metadata.style}
Duration: ${metadata.duration}s

Generated at: ${new Date().toISOString()}
`;

  fs.writeFileSync(thumbnailPath, thumbnailContent, 'utf8');
  console.log(`✅ Created thumbnail: ${path.basename(thumbnailPath)}`);
}

function createVideoManifest() {
  const manifestPath = path.join(VIDEO_DIR, 'video-manifest.json');
  const manifest = {
    version: '1.0.0',
    description: 'VEO 3 Mock Video Manifest',
    generatedAt: new Date().toISOString(),
    videos: sampleVideos.map(video => ({
      ...video,
      url: `/api/videos/mock/${video.filename}`,
      thumbnailUrl: `/api/videos/mock/${video.filename.replace('.mp4', '_thumb.jpg')}`,
      type: 'mock',
      status: 'available'
    })),
    totalVideos: sampleVideos.length,
    totalDuration: sampleVideos.reduce((sum, video) => sum + video.duration, 0),
    note: 'These are placeholder files. Enable real VEO 3 generation by setting GOOGLE_API_KEY.'
  };

  fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2), 'utf8');
  console.log(`✅ Created manifest: video-manifest.json`);
}

function main() {
  console.log('🎬 Creating VEO 3 Sample Videos');
  console.log('==============================\n');

  // Ensure directories exist
  if (!fs.existsSync(VIDEO_DIR)) {
    fs.mkdirSync(VIDEO_DIR, { recursive: true });
    console.log(`📁 Created directory: ${VIDEO_DIR}`);
  }

  console.log(`📍 Video directory: ${VIDEO_DIR}\n`);

  // Create placeholder videos and thumbnails
  sampleVideos.forEach(video => {
    const videoPath = path.join(VIDEO_DIR, video.filename);
    const thumbnailPath = path.join(THUMBNAIL_DIR, video.filename.replace('.mp4', '_thumb.jpg'));

    createPlaceholderVideo(videoPath, video);
    createThumbnail(thumbnailPath, video);
  });

  // Create manifest file
  createVideoManifest();

  console.log('\n🎬 Sample Video Creation Complete!');
  console.log('==================================');
  console.log(`📊 Created ${sampleVideos.length} placeholder videos`);
  console.log(`📁 Location: ${VIDEO_DIR}`);
  console.log(`🌐 URL Base: /api/videos/mock/`);
  console.log('\n💡 To test the videos:');
  console.log('   curl http://localhost:4000/api/videos/mock/space_discovery.mp4');
  console.log('   curl http://localhost:4000/api/videos/mock/video-manifest.json');
  console.log('\n🔑 To enable real VEO 3 videos:');
  console.log('   1. Get Google API key from https://aistudio.google.com/');
  console.log('   2. Set GOOGLE_API_KEY environment variable');
  console.log('   3. Restart the server');
}

if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}

export { sampleVideos, createPlaceholderVideo, createThumbnail };

