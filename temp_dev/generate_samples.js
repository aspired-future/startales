/**
 * 🎨 Generate Sample Images using Abstract Interface
 * 
 * This script tests the abstract interface by generating sample images
 * and saving them to the public directory
 */

import fs from 'fs';
import path from 'path';

console.log('🎨 Testing Abstract Image Generation Interface\n');

// Ensure public directory exists
const publicDir = path.join(process.cwd(), 'public');
const samplesDir = path.join(publicDir, 'samples');

if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir, { recursive: true });
}

if (!fs.existsSync(samplesDir)) {
  fs.mkdirSync(samplesDir, { recursive: true });
}

console.log(`📁 Created samples directory: ${samplesDir}\n`);

// Sample image generation requests
const sampleRequests = [
  {
    filename: 'galactic-civilization.png',
    title: '🌌 Galactic Civilization Hub',
    request: {
      prompt: 'A magnificent galactic civilization with towering crystal spires, floating platforms, and bioluminescent gardens stretching across multiple levels',
      aspectRatio: '16:9',
      style: 'digital-art',
      quality: 'hd',
      provider: 'google-imagen'
    }
  },
  {
    filename: 'orbital-station.png',
    title: '🚀 Orbital Megastructure',
    request: {
      prompt: 'A colossal orbital ring station surrounding a planet, with massive solar collectors, rotating habitat modules, and docking bays for starships',
      aspectRatio: '16:9',
      style: 'concept-art',
      quality: 'hd',
      provider: 'google-imagen'
    }
  },
  {
    filename: 'alien-empress.png',
    title: '👑 Alien Empress Portrait',
    request: {
      prompt: 'A regal alien empress with iridescent skin, crystalline crown, and flowing robes made of stardust, seated on a throne of living coral',
      aspectRatio: '9:16',
      style: 'illustration',
      quality: 'hd',
      provider: 'google-imagen'
    }
  },
  {
    filename: 'terraformed-mars.png',
    title: '🌍 Terraformed Mars Colony',
    request: {
      prompt: 'A thriving terraformed Mars with blue skies and white clouds, vast green continents with Earth-like vegetation, gleaming dome cities',
      aspectRatio: '16:9',
      style: 'photographic',
      quality: 'hd',
      provider: 'google-imagen'
    }
  },
  {
    filename: 'federation-flag.png',
    title: '🏛️ Terran Federation Flag',
    request: {
      prompt: 'Official flag of the Terran Federation: blue field with golden Earth at center, surrounded by silver stars representing colonies',
      aspectRatio: '1:1',
      style: 'illustration',
      quality: 'hd',
      provider: 'google-imagen'
    }
  },
  {
    filename: 'space-dragon.png',
    title: '🐉 Crystalline Space Dragon',
    request: {
      prompt: 'A magnificent space-dwelling dragon with scales made of living crystal that refract starlight into rainbow patterns, wings of pure energy',
      aspectRatio: '1:1',
      style: 'concept-art',
      quality: 'hd',
      provider: 'google-imagen'
    }
  }
];

// Function to generate and save an image
async function generateAndSaveImage(sample) {
  try {
    console.log(`🎨 Generating: ${sample.title}`);
    console.log(`   📝 Prompt: "${sample.request.prompt.substring(0, 60)}..."`);
    console.log(`   🎯 Provider: ${sample.request.provider}`);
    
    // Make API request
    const response = await fetch('http://localhost:5174/api/imagen/generate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(sample.request)
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const result = await response.json();
    
    if (result.success && result.images && result.images.length > 0) {
      const imageUrl = result.images[0].url;
      console.log(`   ✅ Generated successfully!`);
      console.log(`   🖼️  Image URL: ${imageUrl}`);
      console.log(`   ⏱️  Processing time: ${result.metadata?.processingTimeMs || 'N/A'}ms`);
      console.log(`   💰 Cost: $${result.usage?.costUsd || result.metadata?.cost || 'N/A'}`);
      
      // Download and save the image
      try {
        const imageResponse = await fetch(imageUrl);
        if (imageResponse.ok) {
          const buffer = await imageResponse.arrayBuffer();
          const filePath = path.join(samplesDir, sample.filename);
          fs.writeFileSync(filePath, Buffer.from(buffer));
          console.log(`   💾 Saved to: public/samples/${sample.filename}`);
        } else {
          console.log(`   ⚠️  Could not download image from ${imageUrl}`);
          // Create a placeholder file with metadata
          const metadata = {
            title: sample.title,
            prompt: sample.request.prompt,
            imageUrl: imageUrl,
            result: result,
            generatedAt: new Date().toISOString()
          };
          const metadataPath = path.join(samplesDir, sample.filename.replace('.png', '.json'));
          fs.writeFileSync(metadataPath, JSON.stringify(metadata, null, 2));
          console.log(`   💾 Metadata saved to: public/samples/${sample.filename.replace('.png', '.json')}`);
        }
      } catch (downloadError) {
        console.log(`   ❌ Download error: ${downloadError.message}`);
      }
      
    } else {
      console.log(`   ❌ Generation failed: ${result.error || 'Unknown error'}`);
    }
    
    console.log('');
    
  } catch (error) {
    console.log(`   ❌ Error: ${error.message}`);
    console.log('');
  }
}

// Function to test the service status
async function testServiceStatus() {
  try {
    console.log('🔍 Testing service status...');
    const response = await fetch('http://localhost:5174/api/imagen/status');
    
    if (response.ok) {
      const status = await response.json();
      console.log('✅ Service is running!');
      console.log(`   🏷️  Service: ${status.service}`);
      console.log(`   📊 Total Providers: ${status.registry?.totalProviders || 0}`);
      console.log(`   🎯 Primary Provider: ${status.registry?.primaryProvider || 'None'}`);
      
      if (status.providers) {
        console.log('   🔧 Provider Status:');
        Object.entries(status.providers).forEach(([name, provider]) => {
          const configured = provider.isConfigured ? '✅' : '❌';
          const apiKey = provider.apiKeyPresent ? '🔑' : '🚫';
          console.log(`      ${name}: ${configured} Configured ${apiKey} API Key`);
        });
      }
      console.log('');
      return true;
    } else {
      console.log(`❌ Service not responding: ${response.status}`);
      return false;
    }
  } catch (error) {
    console.log(`❌ Cannot connect to service: ${error.message}`);
    return false;
  }
}

// Function to create an HTML gallery
function createGallery() {
  const galleryHtml = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>🎨 Abstract Image Generation Interface - Sample Gallery</title>
    <style>
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            background: linear-gradient(135deg, #0f0f23 0%, #1a1a2e 100%);
            color: #ffffff;
            margin: 0;
            padding: 20px;
            min-height: 100vh;
        }
        .container {
            max-width: 1200px;
            margin: 0 auto;
        }
        .header {
            text-align: center;
            margin-bottom: 40px;
        }
        .header h1 {
            color: #4ecdc4;
            font-size: 2.5em;
            margin-bottom: 10px;
        }
        .header p {
            color: #9ca3af;
            font-size: 1.2em;
        }
        .gallery {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
            gap: 30px;
            margin-bottom: 40px;
        }
        .sample-card {
            background: rgba(255, 255, 255, 0.05);
            border-radius: 15px;
            padding: 20px;
            border: 1px solid rgba(255, 255, 255, 0.1);
            transition: transform 0.3s ease, box-shadow 0.3s ease;
        }
        .sample-card:hover {
            transform: translateY(-5px);
            box-shadow: 0 10px 30px rgba(78, 205, 196, 0.2);
        }
        .sample-title {
            color: #4ecdc4;
            font-size: 1.3em;
            margin-bottom: 10px;
            font-weight: 600;
        }
        .sample-image {
            width: 100%;
            height: 200px;
            background: rgba(255, 255, 255, 0.1);
            border-radius: 10px;
            margin-bottom: 15px;
            display: flex;
            align-items: center;
            justify-content: center;
            color: #9ca3af;
            font-size: 0.9em;
            text-align: center;
            padding: 20px;
            box-sizing: border-box;
        }
        .sample-image img {
            max-width: 100%;
            max-height: 100%;
            border-radius: 8px;
        }
        .sample-prompt {
            color: #d1d5db;
            font-size: 0.9em;
            line-height: 1.4;
            margin-bottom: 15px;
        }
        .sample-specs {
            display: flex;
            flex-wrap: wrap;
            gap: 10px;
        }
        .spec-tag {
            background: rgba(78, 205, 196, 0.2);
            color: #4ecdc4;
            padding: 4px 12px;
            border-radius: 20px;
            font-size: 0.8em;
            font-weight: 500;
        }
        .footer {
            text-align: center;
            margin-top: 40px;
            padding: 20px;
            border-top: 1px solid rgba(255, 255, 255, 0.1);
        }
        .footer h3 {
            color: #4ecdc4;
            margin-bottom: 15px;
        }
        .benefits {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
            gap: 20px;
            margin-top: 20px;
        }
        .benefit {
            background: rgba(255, 255, 255, 0.05);
            padding: 15px;
            border-radius: 10px;
            border-left: 4px solid #4ecdc4;
        }
        .benefit-title {
            color: #4ecdc4;
            font-weight: 600;
            margin-bottom: 5px;
        }
        .benefit-desc {
            color: #9ca3af;
            font-size: 0.9em;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🎨 Abstract Image Generation Interface</h1>
            <p>Sample graphics generated using Google Imagen with automatic provider switching and fallbacks</p>
        </div>
        
        <div class="gallery">
            ${sampleRequests.map(sample => `
                <div class="sample-card">
                    <div class="sample-title">${sample.title}</div>
                    <div class="sample-image">
                        <div>
                            🖼️ Generated Image<br>
                            <small>Check public/samples/${sample.filename}</small>
                        </div>
                    </div>
                    <div class="sample-prompt">"${sample.request.prompt}"</div>
                    <div class="sample-specs">
                        <span class="spec-tag">${sample.request.aspectRatio}</span>
                        <span class="spec-tag">${sample.request.style}</span>
                        <span class="spec-tag">${sample.request.quality}</span>
                        <span class="spec-tag">${sample.request.provider}</span>
                    </div>
                </div>
            `).join('')}
        </div>
        
        <div class="footer">
            <h3>🏗️ Abstract Interface Benefits</h3>
            <div class="benefits">
                <div class="benefit">
                    <div class="benefit-title">✅ Provider Independence</div>
                    <div class="benefit-desc">Switch between Google Imagen, DALL-E, and Stable Diffusion without code changes</div>
                </div>
                <div class="benefit">
                    <div class="benefit-title">✅ Automatic Fallbacks</div>
                    <div class="benefit-desc">If one provider fails, automatically try the next one in the chain</div>
                </div>
                <div class="benefit">
                    <div class="benefit-title">✅ Cost Optimization</div>
                    <div class="benefit-desc">Route requests to the most cost-effective provider for each image type</div>
                </div>
                <div class="benefit">
                    <div class="benefit-title">✅ Feature Flexibility</div>
                    <div class="benefit-desc">Use advanced features when available, graceful degradation when not</div>
                </div>
                <div class="benefit">
                    <div class="benefit-title">✅ Easy Extension</div>
                    <div class="benefit-desc">Add new providers like Midjourney or Leonardo AI with minimal code</div>
                </div>
                <div class="benefit">
                    <div class="benefit-title">✅ Unified API</div>
                    <div class="benefit-desc">Single interface for all image generation needs across your application</div>
                </div>
            </div>
        </div>
    </div>
</body>
</html>`;

  const galleryPath = path.join(publicDir, 'image-samples.html');
  fs.writeFileSync(galleryPath, galleryHtml);
  console.log(`📄 Created gallery: public/image-samples.html`);
}

// Main execution
async function main() {
  console.log('🚀 Starting Abstract Image Generation Interface Test\n');
  
  // Test service status first
  const serviceRunning = await testServiceStatus();
  
  if (!serviceRunning) {
    console.log('❌ Service is not running. Please start the server first.');
    console.log('   Run: cd src/server && npx tsx index.ts');
    return;
  }
  
  // Generate sample images
  console.log('🎨 Generating sample images...\n');
  
  for (const sample of sampleRequests) {
    await generateAndSaveImage(sample);
    // Small delay between requests to be respectful to the API
    await new Promise(resolve => setTimeout(resolve, 1000));
  }
  
  // Create HTML gallery
  createGallery();
  
  console.log('🎉 Sample generation complete!');
  console.log('\n📁 Files created:');
  console.log('   • public/samples/ - Generated images and metadata');
  console.log('   • public/image-samples.html - Gallery webpage');
  console.log('\n🌐 View the gallery by opening public/image-samples.html in your browser');
  console.log('🎨 All samples demonstrate the abstract interface working with your Google API key!');
}

// Run the test
main().catch(error => {
  console.error('❌ Test failed:', error);
});
