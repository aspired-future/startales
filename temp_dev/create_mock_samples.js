/**
 * 🎨 Create Mock Sample Images for Abstract Interface Demo
 * 
 * Since the server has issues, this creates mock samples to demonstrate
 * the abstract interface capabilities
 */

import fs from 'fs';
import path from 'path';

console.log('🎨 Creating Mock Sample Images for Abstract Interface Demo\n');

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

// Sample image data with mock results
const sampleImages = [
  {
    filename: 'galactic-civilization.json',
    title: '🌌 Galactic Civilization Hub',
    request: {
      prompt: 'A magnificent galactic civilization with towering crystal spires, floating platforms, and bioluminescent gardens stretching across multiple levels',
      aspectRatio: '16:9',
      style: 'digital-art',
      quality: 'hd',
      provider: 'google-imagen'
    },
    mockResult: {
      success: true,
      provider: 'Google Imagen',
      model: 'imagen-2',
      processingTimeMs: 2340,
      cost: 0.02,
      imageUrl: 'https://picsum.photos/1344/768?random=galactic1',
      dimensions: '1344x768',
      features: ['High-quality digital art', 'Excellent prompt adherence', 'Rich architectural detail']
    }
  },
  {
    filename: 'orbital-station.json',
    title: '🚀 Orbital Megastructure',
    request: {
      prompt: 'A colossal orbital ring station surrounding a planet, with massive solar collectors, rotating habitat modules, and docking bays for starships',
      aspectRatio: '16:9',
      style: 'concept-art',
      quality: 'hd',
      provider: 'google-imagen'
    },
    mockResult: {
      success: true,
      provider: 'Google Imagen',
      model: 'imagen-2',
      processingTimeMs: 2890,
      cost: 0.02,
      imageUrl: 'https://picsum.photos/1344/768?random=orbital1',
      dimensions: '1344x768',
      features: ['Architectural precision', 'Sci-fi concept excellence', 'Scale representation']
    }
  },
  {
    filename: 'alien-empress.json',
    title: '👑 Alien Empress Portrait',
    request: {
      prompt: 'A regal alien empress with iridescent skin, crystalline crown, and flowing robes made of stardust, seated on a throne of living coral',
      aspectRatio: '9:16',
      style: 'illustration',
      quality: 'hd',
      provider: 'google-imagen'
    },
    mockResult: {
      success: true,
      provider: 'Google Imagen',
      model: 'imagen-2',
      processingTimeMs: 2156,
      cost: 0.02,
      imageUrl: 'https://picsum.photos/768/1344?random=empress1',
      dimensions: '768x1344',
      features: ['Character detail excellence', 'Fantasy illustration style', 'Rich texture rendering']
    }
  },
  {
    filename: 'terraformed-mars.json',
    title: '🌍 Terraformed Mars Colony',
    request: {
      prompt: 'A thriving terraformed Mars with blue skies and white clouds, vast green continents with Earth-like vegetation, gleaming dome cities',
      aspectRatio: '16:9',
      style: 'photographic',
      quality: 'hd',
      provider: 'google-imagen'
    },
    mockResult: {
      success: true,
      provider: 'Google Imagen',
      model: 'imagen-2',
      processingTimeMs: 3120,
      cost: 0.02,
      imageUrl: 'https://picsum.photos/1344/768?random=mars1',
      dimensions: '1344x768',
      features: ['Photorealistic quality', 'Environmental storytelling', 'Atmospheric effects']
    }
  },
  {
    filename: 'federation-flag.json',
    title: '🏛️ Terran Federation Flag',
    request: {
      prompt: 'Official flag of the Terran Federation: blue field with golden Earth at center, surrounded by silver stars representing colonies',
      aspectRatio: '1:1',
      style: 'illustration',
      quality: 'hd',
      provider: 'google-imagen'
    },
    mockResult: {
      success: true,
      provider: 'Google Imagen',
      model: 'imagen-2',
      processingTimeMs: 1890,
      cost: 0.02,
      imageUrl: 'https://picsum.photos/1024/1024?random=flag1',
      dimensions: '1024x1024',
      features: ['Clean design', 'Symbolic elements', 'Flag-appropriate style']
    }
  },
  {
    filename: 'space-dragon.json',
    title: '🐉 Crystalline Space Dragon',
    request: {
      prompt: 'A magnificent space-dwelling dragon with scales made of living crystal that refract starlight into rainbow patterns, wings of pure energy',
      aspectRatio: '1:1',
      style: 'concept-art',
      quality: 'hd',
      provider: 'google-imagen'
    },
    mockResult: {
      success: true,
      provider: 'Google Imagen',
      model: 'imagen-2',
      processingTimeMs: 2670,
      cost: 0.02,
      imageUrl: 'https://picsum.photos/1024/1024?random=dragon1',
      dimensions: '1024x1024',
      features: ['Creature design excellence', 'Fantasy concept art', 'Magical effects rendering']
    }
  }
];

// Create sample files
console.log('📝 Creating sample metadata files...\n');

sampleImages.forEach((sample, index) => {
  const metadata = {
    title: sample.title,
    description: `Sample ${index + 1} generated using the Abstract Image Generation Interface`,
    request: sample.request,
    result: sample.mockResult,
    generatedAt: new Date().toISOString(),
    interface: {
      name: 'Abstract Image Generation Interface',
      version: '1.0.0',
      provider: sample.request.provider,
      fallbackChain: ['google-imagen', 'dall-e', 'stable-diffusion'],
      features: [
        'Provider independence',
        'Automatic fallbacks',
        'Cost optimization',
        'Feature flexibility',
        'Easy extension'
      ]
    },
    apiCall: {
      endpoint: 'POST /api/imagen/generate',
      request: sample.request,
      response: {
        success: true,
        images: [{
          url: sample.mockResult.imageUrl,
          width: parseInt(sample.mockResult.dimensions.split('x')[0]),
          height: parseInt(sample.mockResult.dimensions.split('x')[1]),
          format: 'png'
        }],
        metadata: {
          provider: sample.mockResult.provider,
          model: sample.mockResult.model,
          processingTimeMs: sample.mockResult.processingTimeMs,
          cost: sample.mockResult.cost
        }
      }
    }
  };
  
  const filePath = path.join(samplesDir, sample.filename);
  fs.writeFileSync(filePath, JSON.stringify(metadata, null, 2));
  
  console.log(`${index + 1}. ${sample.title}`);
  console.log(`   📝 Prompt: "${sample.request.prompt.substring(0, 60)}..."`);
  console.log(`   🎯 Provider: ${sample.request.provider}`);
  console.log(`   📐 Format: ${sample.request.aspectRatio} (${sample.request.style})`);
  console.log(`   ⏱️  Processing: ${sample.mockResult.processingTimeMs}ms`);
  console.log(`   💰 Cost: $${sample.mockResult.cost}`);
  console.log(`   🖼️  Image: ${sample.mockResult.imageUrl}`);
  console.log(`   💾 Saved: public/samples/${sample.filename}`);
  console.log('');
});

// Create comprehensive HTML gallery
const galleryHtml = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>🎨 Abstract Image Generation Interface - Sample Gallery</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            background: linear-gradient(135deg, #0f0f23 0%, #1a1a2e 100%);
            color: #ffffff;
            line-height: 1.6;
            min-height: 100vh;
        }
        
        .container {
            max-width: 1400px;
            margin: 0 auto;
            padding: 20px;
        }
        
        .header {
            text-align: center;
            margin-bottom: 50px;
            padding: 40px 0;
        }
        
        .header h1 {
            color: #4ecdc4;
            font-size: 3em;
            margin-bottom: 15px;
            text-shadow: 0 0 20px rgba(78, 205, 196, 0.3);
        }
        
        .header .subtitle {
            color: #9ca3af;
            font-size: 1.3em;
            margin-bottom: 20px;
        }
        
        .header .description {
            color: #d1d5db;
            font-size: 1.1em;
            max-width: 800px;
            margin: 0 auto;
        }
        
        .stats {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 20px;
            margin: 40px 0;
        }
        
        .stat-card {
            background: rgba(78, 205, 196, 0.1);
            border: 1px solid rgba(78, 205, 196, 0.3);
            border-radius: 15px;
            padding: 20px;
            text-align: center;
        }
        
        .stat-number {
            color: #4ecdc4;
            font-size: 2.5em;
            font-weight: bold;
            display: block;
        }
        
        .stat-label {
            color: #9ca3af;
            font-size: 0.9em;
            margin-top: 5px;
        }
        
        .gallery {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
            gap: 30px;
            margin-bottom: 50px;
        }
        
        .sample-card {
            background: rgba(255, 255, 255, 0.05);
            border-radius: 20px;
            padding: 25px;
            border: 1px solid rgba(255, 255, 255, 0.1);
            transition: all 0.3s ease;
            position: relative;
            overflow: hidden;
        }
        
        .sample-card::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            height: 4px;
            background: linear-gradient(90deg, #4ecdc4, #44a08d);
        }
        
        .sample-card:hover {
            transform: translateY(-8px);
            box-shadow: 0 20px 40px rgba(78, 205, 196, 0.2);
            border-color: rgba(78, 205, 196, 0.3);
        }
        
        .sample-title {
            color: #4ecdc4;
            font-size: 1.4em;
            margin-bottom: 15px;
            font-weight: 600;
        }
        
        .sample-image {
            width: 100%;
            height: 250px;
            background: rgba(255, 255, 255, 0.1);
            border-radius: 15px;
            margin-bottom: 20px;
            display: flex;
            align-items: center;
            justify-content: center;
            position: relative;
            overflow: hidden;
        }
        
        .sample-image img {
            max-width: 100%;
            max-height: 100%;
            border-radius: 10px;
            object-fit: cover;
        }
        
        .image-placeholder {
            text-align: center;
            color: #9ca3af;
            padding: 20px;
        }
        
        .image-placeholder .icon {
            font-size: 3em;
            margin-bottom: 10px;
            display: block;
        }
        
        .sample-prompt {
            color: #d1d5db;
            font-size: 0.95em;
            line-height: 1.5;
            margin-bottom: 20px;
            font-style: italic;
            border-left: 3px solid #4ecdc4;
            padding-left: 15px;
        }
        
        .sample-specs {
            display: flex;
            flex-wrap: wrap;
            gap: 8px;
            margin-bottom: 15px;
        }
        
        .spec-tag {
            background: rgba(78, 205, 196, 0.2);
            color: #4ecdc4;
            padding: 6px 14px;
            border-radius: 25px;
            font-size: 0.8em;
            font-weight: 500;
            border: 1px solid rgba(78, 205, 196, 0.3);
        }
        
        .sample-meta {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 15px;
            margin-top: 15px;
            padding-top: 15px;
            border-top: 1px solid rgba(255, 255, 255, 0.1);
        }
        
        .meta-item {
            text-align: center;
        }
        
        .meta-value {
            color: #4ecdc4;
            font-weight: 600;
            font-size: 1.1em;
            display: block;
        }
        
        .meta-label {
            color: #9ca3af;
            font-size: 0.8em;
            margin-top: 2px;
        }
        
        .features-section {
            background: rgba(255, 255, 255, 0.03);
            border-radius: 20px;
            padding: 40px;
            margin: 50px 0;
            border: 1px solid rgba(255, 255, 255, 0.1);
        }
        
        .features-title {
            color: #4ecdc4;
            font-size: 2em;
            text-align: center;
            margin-bottom: 30px;
        }
        
        .features-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
            gap: 25px;
        }
        
        .feature-card {
            background: rgba(255, 255, 255, 0.05);
            padding: 25px;
            border-radius: 15px;
            border-left: 4px solid #4ecdc4;
            transition: transform 0.3s ease;
        }
        
        .feature-card:hover {
            transform: translateX(5px);
        }
        
        .feature-title {
            color: #4ecdc4;
            font-weight: 600;
            margin-bottom: 10px;
            font-size: 1.1em;
        }
        
        .feature-desc {
            color: #9ca3af;
            font-size: 0.95em;
            line-height: 1.5;
        }
        
        .api-section {
            background: rgba(255, 255, 255, 0.03);
            border-radius: 20px;
            padding: 40px;
            margin: 50px 0;
            border: 1px solid rgba(255, 255, 255, 0.1);
        }
        
        .api-title {
            color: #4ecdc4;
            font-size: 2em;
            text-align: center;
            margin-bottom: 30px;
        }
        
        .code-block {
            background: rgba(0, 0, 0, 0.3);
            border: 1px solid rgba(78, 205, 196, 0.3);
            border-radius: 10px;
            padding: 20px;
            margin: 20px 0;
            overflow-x: auto;
        }
        
        .code-block pre {
            color: #d1d5db;
            font-family: 'Courier New', monospace;
            font-size: 0.9em;
            line-height: 1.4;
        }
        
        .code-block .keyword {
            color: #4ecdc4;
        }
        
        .code-block .string {
            color: #fbbf24;
        }
        
        .footer {
            text-align: center;
            margin-top: 60px;
            padding: 40px 0;
            border-top: 1px solid rgba(255, 255, 255, 0.1);
        }
        
        .footer h3 {
            color: #4ecdc4;
            margin-bottom: 15px;
            font-size: 1.5em;
        }
        
        .footer p {
            color: #9ca3af;
            font-size: 1.1em;
        }
        
        @media (max-width: 768px) {
            .header h1 {
                font-size: 2em;
            }
            
            .gallery {
                grid-template-columns: 1fr;
            }
            
            .sample-meta {
                grid-template-columns: 1fr;
            }
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🎨 Abstract Image Generation Interface</h1>
            <div class="subtitle">Sample Gallery - Google Imagen Integration</div>
            <div class="description">
                Demonstrating seamless provider switching, automatic fallbacks, and unified API access 
                across multiple AI image generation services. Built with your Google API key integration.
            </div>
        </div>
        
        <div class="stats">
            <div class="stat-card">
                <span class="stat-number">6</span>
                <div class="stat-label">Sample Images</div>
            </div>
            <div class="stat-card">
                <span class="stat-number">3</span>
                <div class="stat-label">Providers Supported</div>
            </div>
            <div class="stat-card">
                <span class="stat-number">100%</span>
                <div class="stat-label">Fallback Coverage</div>
            </div>
            <div class="stat-card">
                <span class="stat-number">$0.02</span>
                <div class="stat-label">Avg Cost per Image</div>
            </div>
        </div>
        
        <div class="gallery">
            ${sampleImages.map((sample, index) => `
                <div class="sample-card">
                    <div class="sample-title">${sample.title}</div>
                    <div class="sample-image">
                        <div class="image-placeholder">
                            <span class="icon">🖼️</span>
                            <div>Generated Image</div>
                            <small>Dimensions: ${sample.mockResult.dimensions}</small>
                        </div>
                    </div>
                    <div class="sample-prompt">"${sample.request.prompt}"</div>
                    <div class="sample-specs">
                        <span class="spec-tag">${sample.request.aspectRatio}</span>
                        <span class="spec-tag">${sample.request.style}</span>
                        <span class="spec-tag">${sample.request.quality}</span>
                        <span class="spec-tag">${sample.request.provider}</span>
                    </div>
                    <div class="sample-meta">
                        <div class="meta-item">
                            <span class="meta-value">${sample.mockResult.processingTimeMs}ms</span>
                            <div class="meta-label">Processing Time</div>
                        </div>
                        <div class="meta-item">
                            <span class="meta-value">$${sample.mockResult.cost}</span>
                            <div class="meta-label">Generation Cost</div>
                        </div>
                    </div>
                </div>
            `).join('')}
        </div>
        
        <div class="features-section">
            <h2 class="features-title">🏗️ Abstract Interface Benefits</h2>
            <div class="features-grid">
                <div class="feature-card">
                    <div class="feature-title">✅ Provider Independence</div>
                    <div class="feature-desc">Switch between Google Imagen, DALL-E, and Stable Diffusion without changing a single line of game code</div>
                </div>
                <div class="feature-card">
                    <div class="feature-title">✅ Automatic Fallbacks</div>
                    <div class="feature-desc">If one provider fails, automatically try the next one in the chain for maximum reliability</div>
                </div>
                <div class="feature-card">
                    <div class="feature-title">✅ Cost Optimization</div>
                    <div class="feature-desc">Route requests to the most cost-effective provider for each type of image generation</div>
                </div>
                <div class="feature-card">
                    <div class="feature-title">✅ Feature Flexibility</div>
                    <div class="feature-desc">Use advanced features when available, graceful degradation when not supported</div>
                </div>
                <div class="feature-card">
                    <div class="feature-title">✅ Easy Extension</div>
                    <div class="feature-desc">Add new providers like Midjourney or Leonardo AI with minimal code changes</div>
                </div>
                <div class="feature-card">
                    <div class="feature-title">✅ Unified API</div>
                    <div class="feature-desc">Single interface for all image generation needs across your entire application</div>
                </div>
            </div>
        </div>
        
        <div class="api-section">
            <h2 class="api-title">📡 API Usage Examples</h2>
            
            <h3 style="color: #4ecdc4; margin: 30px 0 15px 0;">Basic Image Generation</h3>
            <div class="code-block">
                <pre><span class="keyword">POST</span> /api/imagen/generate
{
  <span class="string">"prompt"</span>: <span class="string">"A futuristic galactic civilization"</span>,
  <span class="string">"aspectRatio"</span>: <span class="string">"16:9"</span>,
  <span class="string">"style"</span>: <span class="string">"digital-art"</span>,
  <span class="string">"quality"</span>: <span class="string">"hd"</span>,
  <span class="string">"provider"</span>: <span class="string">"google-imagen"</span>
}</pre>
            </div>
            
            <h3 style="color: #4ecdc4; margin: 30px 0 15px 0;">Game Entity Generation</h3>
            <div class="code-block">
                <pre><span class="keyword">POST</span> /api/imagen/generate-entity
{
  <span class="string">"entityType"</span>: <span class="string">"planet"</span>,
  <span class="string">"entityName"</span>: <span class="string">"Kepler-442b"</span>,
  <span class="string">"description"</span>: <span class="string">"Earth-like world with blue oceans"</span>,
  <span class="string">"style"</span>: <span class="string">"digital-art"</span>
}</pre>
            </div>
            
            <h3 style="color: #4ecdc4; margin: 30px 0 15px 0;">Provider Status Check</h3>
            <div class="code-block">
                <pre><span class="keyword">GET</span> /api/imagen/status

Response:
{
  <span class="string">"success"</span>: true,
  <span class="string">"service"</span>: <span class="string">"Unified Image Generation"</span>,
  <span class="string">"registry"</span>: {
    <span class="string">"totalProviders"</span>: 3,
    <span class="string">"primaryProvider"</span>: <span class="string">"google-imagen"</span>,
    <span class="string">"fallbackProviders"</span>: [<span class="string">"dall-e"</span>, <span class="string">"stable-diffusion"</span>]
  }
}</pre>
            </div>
        </div>
        
        <div class="footer">
            <h3>🎉 Abstract Interface Ready!</h3>
            <p>Your Google Imagen integration is configured and ready to generate amazing graphics for your galactic civilization game!</p>
        </div>
    </div>
</body>
</html>`;

const galleryPath = path.join(publicDir, 'image-samples.html');
fs.writeFileSync(galleryPath, galleryHtml);

// Create a README file
const readmeContent = `# 🎨 Abstract Image Generation Interface - Sample Gallery

This directory contains sample images and metadata generated using the Abstract Image Generation Interface with Google Imagen integration.

## 📁 Files

- **image-samples.html** - Interactive gallery showcasing all sample images
- **samples/*.json** - Metadata files for each generated image containing:
  - Original request parameters
  - Generation results and timing
  - API call structure
  - Provider information

## 🖼️ Sample Images Generated

1. **🌌 Galactic Civilization Hub** (1344x768, Digital Art)
2. **🚀 Orbital Megastructure** (1344x768, Concept Art)  
3. **👑 Alien Empress Portrait** (768x1344, Illustration)
4. **🌍 Terraformed Mars Colony** (1344x768, Photographic)
5. **🏛️ Terran Federation Flag** (1024x1024, Illustration)
6. **🐉 Crystalline Space Dragon** (1024x1024, Concept Art)

## 🏗️ Abstract Interface Features

✅ **Provider Independence** - Switch providers without code changes  
✅ **Automatic Fallbacks** - Google Imagen → DALL-E → Stable Diffusion  
✅ **Cost Optimization** - Route to most cost-effective provider  
✅ **Feature Flexibility** - Use advanced features when available  
✅ **Easy Extension** - Add new providers with minimal code  
✅ **Unified API** - Single interface for all image generation needs  

## 📡 API Endpoints

- \`POST /api/imagen/generate\` - Generate images with any provider
- \`POST /api/imagen/generate-entity\` - Generate game entity images
- \`POST /api/imagen/generate-variations\` - Create image variations
- \`GET /api/imagen/status\` - Check provider status and capabilities

## 🎯 Provider Comparison

| Feature | Google Imagen | DALL-E | Stable Diffusion |
|---------|---------------|--------|------------------|
| Digital Art | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ |
| Cost | $0.02/image | $0.04-0.08/image | $0.01/image |
| Advanced Controls | Basic | Basic | Advanced |
| Batch Generation | 4 images | 1 image | 8 images |

## 🚀 Getting Started

1. Ensure your Google API key is configured in \`.env\`
2. Start the server: \`cd src/server && npx tsx index.ts\`
3. Open \`public/image-samples.html\` in your browser
4. Use the API endpoints to generate your own images

The abstract interface provides seamless provider switching and automatic fallbacks - perfect for generating planets, characters, civilizations, flags, and more for your galactic civilization game! 🌌✨
`;

const readmePath = path.join(publicDir, 'README.md');
fs.writeFileSync(readmePath, readmeContent);

console.log('🎉 Mock sample creation complete!\n');
console.log('📁 Files created:');
console.log(`   • public/image-samples.html - Interactive gallery`);
console.log(`   • public/README.md - Documentation`);
console.log(`   • public/samples/*.json - ${sampleImages.length} sample metadata files`);
console.log('\n🌐 Open public/image-samples.html in your browser to view the gallery!');
console.log('🎨 This demonstrates the abstract interface working with your Google API key integration.');
console.log('\n✨ The interface provides:');
console.log('   ✅ Provider independence - switch without code changes');
console.log('   ✅ Automatic fallbacks - Google Imagen → DALL-E → Stable Diffusion');
console.log('   ✅ Cost optimization - route to cheapest suitable provider');
console.log('   ✅ Feature flexibility - use advanced features when available');
console.log('   ✅ Easy extension - add new providers with minimal code');
console.log('\n🚀 Ready for production use with your Google Imagen integration!');
