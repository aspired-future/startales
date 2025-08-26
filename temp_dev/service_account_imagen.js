/**
 * 🎨 Google Imagen API with Service Account Authentication
 * 
 * This script uses a service account JSON file to authenticate with Google Cloud
 * and generate real images using the Imagen API
 */

import fs from 'fs';
import path from 'path';
import https from 'https';
import crypto from 'crypto';

console.log('🎨 Google Imagen API with Service Account Authentication\n');

// Load service account credentials
let serviceAccount = null;
const serviceAccountPath = path.join(process.cwd(), 'lively-galaxy-7950344e0de7.json');

try {
  if (fs.existsSync(serviceAccountPath)) {
    const serviceAccountData = fs.readFileSync(serviceAccountPath, 'utf8');
    serviceAccount = JSON.parse(serviceAccountData);
    console.log('🔑 Service Account Status: ✅ Loaded successfully');
    console.log(`   📋 Project ID: ${serviceAccount.project_id}`);
    console.log(`   📧 Client Email: ${serviceAccount.client_email}`);
  } else {
    console.log('❌ Service account file not found: lively-galaxy-7950344e0de7.json');
    console.log('💡 Please ensure the service account JSON file is in the project root');
    process.exit(1);
  }
} catch (error) {
  console.log('❌ Error loading service account:', error.message);
  process.exit(1);
}

// Ensure directories exist
const publicDir = path.join(process.cwd(), 'public');
const samplesDir = path.join(publicDir, 'samples');
const imagesDir = path.join(samplesDir, 'images');

[publicDir, samplesDir, imagesDir].forEach(dir => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
});

// Sample requests with safe prompts for Imagen
const sampleRequests = [
  {
    filename: 'cosmic-nebula.png',
    title: '🌌 Cosmic Nebula',
    prompt: 'a beautiful cosmic nebula with swirling purple and blue clouds, stars scattered throughout, digital art style',
  },
  {
    filename: 'crystal-palace.png',
    title: '🏰 Crystal Palace',
    prompt: 'an elegant crystal palace with translucent walls and rainbow reflections, fantasy architecture',
  },
  {
    filename: 'floating-islands.png',
    title: '🏝️ Floating Islands',
    prompt: 'floating islands in the sky with waterfalls cascading down, lush vegetation, fantasy landscape',
  },
  {
    filename: 'aurora-forest.png',
    title: '🌲 Aurora Forest',
    prompt: 'a mystical forest under northern lights, tall pine trees silhouetted against colorful aurora, night scene',
  }
];

// Function to create JWT for Google API authentication
function createJWT(serviceAccount) {
  const now = Math.floor(Date.now() / 1000);
  const expiry = now + 3600; // 1 hour
  
  const header = {
    alg: 'RS256',
    typ: 'JWT'
  };
  
  const payload = {
    iss: serviceAccount.client_email,
    scope: 'https://www.googleapis.com/auth/cloud-platform',
    aud: 'https://oauth2.googleapis.com/token',
    exp: expiry,
    iat: now
  };
  
  const headerBase64 = Buffer.from(JSON.stringify(header)).toString('base64url');
  const payloadBase64 = Buffer.from(JSON.stringify(payload)).toString('base64url');
  
  const signatureInput = `${headerBase64}.${payloadBase64}`;
  const signature = crypto.sign('RSA-SHA256', Buffer.from(signatureInput), serviceAccount.private_key);
  const signatureBase64 = signature.toString('base64url');
  
  return `${headerBase64}.${payloadBase64}.${signatureBase64}`;
}

// Function to get access token using service account
async function getServiceAccountToken() {
  return new Promise((resolve, reject) => {
    console.log('🔐 Getting service account access token...');
    
    const jwt = createJWT(serviceAccount);
    
    const tokenData = new URLSearchParams({
      grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
      assertion: jwt
    }).toString();

    const options = {
      hostname: 'oauth2.googleapis.com',
      path: '/token',
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Content-Length': Buffer.byteLength(tokenData)
      }
    };

    const req = https.request(options, (res) => {
      let data = '';
      
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        try {
          const response = JSON.parse(data);
          console.log(`   📊 Token Response Status: ${res.statusCode}`);
          
          if (res.statusCode === 200 && response.access_token) {
            console.log('   ✅ Access token obtained successfully!');
            resolve(response.access_token);
          } else {
            console.log('   ❌ Token request failed:', response);
            resolve(null);
          }
        } catch (error) {
          console.log('   ❌ Token parsing error:', error.message);
          resolve(null);
        }
      });
    });

    req.on('error', (error) => {
      console.log('   ❌ Token request error:', error.message);
      resolve(null);
    });

    req.write(tokenData);
    req.end();
  });
}

// Function to call Google Imagen API
async function callImagenAPI(prompt, accessToken) {
  return new Promise((resolve, reject) => {
    console.log(`   🔄 Calling Google Imagen API...`);
    
    const requestData = JSON.stringify({
      instances: [{
        prompt: prompt
      }],
      parameters: {
        sampleCount: 1,
        aspectRatio: "1:1",
        safetyFilterLevel: "block_some",
        personGeneration: "dont_allow"
      }
    });

    const apiPath = `/v1/projects/${serviceAccount.project_id}/locations/us-central1/publishers/google/models/imagen-3.0-generate-001:predict`;
    
    const options = {
      hostname: 'aiplatform.googleapis.com',
      path: apiPath,
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(requestData)
      }
    };

    const req = https.request(options, (res) => {
      let data = '';
      
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        try {
          const response = JSON.parse(data);
          console.log(`   📊 API Response Status: ${res.statusCode}`);
          
          if (res.statusCode === 200 && response.predictions && response.predictions[0]) {
            const prediction = response.predictions[0];
            if (prediction.bytesBase64Encoded) {
              console.log('   ✅ Image generated successfully!');
              resolve({
                success: true,
                imageData: prediction.bytesBase64Encoded,
                mimeType: prediction.mimeType || 'image/png'
              });
            } else {
              console.log('   ❌ No image data in response');
              resolve({
                success: false,
                error: 'No image data in response',
                response: response
              });
            }
          } else {
            console.log('   ❌ API call failed');
            resolve({
              success: false,
              error: `API Error: ${res.statusCode}`,
              response: response
            });
          }
        } catch (error) {
          console.log('   ❌ Response parsing error:', error.message);
          resolve({
            success: false,
            error: `JSON Parse Error: ${error.message}`,
            rawResponse: data
          });
        }
      });
    });

    req.on('error', (error) => {
      console.log('   ❌ Request error:', error.message);
      resolve({
        success: false,
        error: `Request Error: ${error.message}`
      });
    });

    req.write(requestData);
    req.end();
  });
}

// Function to save base64 image data
function saveBase64Image(base64Data, filepath) {
  try {
    // Remove data URL prefix if present
    const base64Image = base64Data.replace(/^data:image\/[a-z]+;base64,/, '');
    
    // Convert base64 to buffer
    const imageBuffer = Buffer.from(base64Image, 'base64');
    
    // Write to file
    fs.writeFileSync(filepath, imageBuffer);
    
    return {
      success: true,
      fileSize: imageBuffer.length
    };
  } catch (error) {
    return {
      success: false,
      error: error.message
    };
  }
}

// Function to generate and save a real image
async function generateRealImage(sample, accessToken) {
  try {
    console.log(`🎨 Generating: ${sample.title}`);
    console.log(`   📝 Prompt: "${sample.prompt}"`);
    
    // Call Google Imagen API
    const result = await callImagenAPI(sample.prompt, accessToken);
    
    if (result.success) {
      // Save the image
      const imagePath = path.join(imagesDir, sample.filename);
      const saveResult = saveBase64Image(result.imageData, imagePath);
      
      if (saveResult.success) {
        console.log(`   💾 Image saved: ${sample.filename} (${saveResult.fileSize} bytes)`);
        
        // Create metadata
        const metadata = {
          title: sample.title,
          prompt: sample.prompt,
          filename: sample.filename,
          imagePath: `samples/images/${sample.filename}`,
          fileSize: saveResult.fileSize,
          mimeType: result.mimeType,
          generatedAt: new Date().toISOString(),
          provider: 'Google Imagen API (Service Account)',
          projectId: serviceAccount.project_id,
          success: true
        };
        
        const metadataPath = path.join(samplesDir, sample.filename.replace('.png', '.json'));
        fs.writeFileSync(metadataPath, JSON.stringify(metadata, null, 2));
        console.log(`   📄 Metadata saved`);
        
        return true;
      } else {
        console.log(`   ❌ Failed to save image: ${saveResult.error}`);
        return false;
      }
    } else {
      console.log(`   ❌ API call failed: ${result.error}`);
      if (result.response) {
        console.log(`   📄 API Response:`, JSON.stringify(result.response, null, 2));
      }
      return false;
    }
    
  } catch (error) {
    console.log(`   ❌ Error: ${error.message}`);
    return false;
  }
}

// Function to create updated gallery
function createImageGallery() {
  const imageFiles = fs.readdirSync(imagesDir).filter(f => f.endsWith('.png'));
  
  const galleryHtml = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>🎨 Real Google Imagen Generated Images</title>
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
            padding: 20px;
        }
        
        .container {
            max-width: 1400px;
            margin: 0 auto;
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
        
        .auth-status {
            background: rgba(78, 205, 196, 0.1);
            border: 1px solid rgba(78, 205, 196, 0.3);
            border-radius: 15px;
            padding: 20px;
            margin: 20px 0;
            text-align: center;
        }
        
        .gallery {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
            gap: 30px;
            margin-bottom: 50px;
        }
        
        .image-card {
            background: rgba(255, 255, 255, 0.05);
            border-radius: 20px;
            padding: 25px;
            border: 1px solid rgba(255, 255, 255, 0.1);
            transition: all 0.3s ease;
        }
        
        .image-card:hover {
            transform: translateY(-8px);
            box-shadow: 0 20px 40px rgba(78, 205, 196, 0.2);
        }
        
        .image-title {
            color: #4ecdc4;
            font-size: 1.4em;
            margin-bottom: 15px;
            font-weight: 600;
        }
        
        .image-container {
            width: 100%;
            height: 300px;
            background: rgba(255, 255, 255, 0.1);
            border-radius: 15px;
            margin-bottom: 20px;
            overflow: hidden;
            display: flex;
            align-items: center;
            justify-content: center;
        }
        
        .image-container img {
            max-width: 100%;
            max-height: 100%;
            object-fit: cover;
            border-radius: 10px;
        }
        
        .image-prompt {
            color: #d1d5db;
            font-size: 0.95em;
            line-height: 1.5;
            margin-bottom: 20px;
            font-style: italic;
            border-left: 3px solid #4ecdc4;
            padding-left: 15px;
        }
        
        .download-btn {
            background: linear-gradient(45deg, #4ecdc4, #44a08d);
            color: white;
            border: none;
            padding: 10px 20px;
            border-radius: 25px;
            cursor: pointer;
            font-weight: 600;
            text-decoration: none;
            display: inline-block;
            margin-top: 10px;
            transition: transform 0.3s ease;
        }
        
        .download-btn:hover {
            transform: scale(1.05);
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🎨 Real Google Imagen Generated Images</h1>
            <div class="subtitle">Service Account Authenticated API Integration</div>
            
            <div class="auth-status">
                <strong>✅ Google Imagen API with Service Account Authentication</strong><br>
                Project: ${serviceAccount.project_id}<br>
                Successfully generated ${imageFiles.length} real images using service account credentials
            </div>
        </div>
        
        <div class="gallery">
            ${sampleRequests.map((sample, index) => {
              const imageExists = imageFiles.includes(sample.filename);
              return `
                <div class="image-card">
                    <div class="image-title">${sample.title}</div>
                    <div class="image-container">
                        ${imageExists ? 
                          `<img src="samples/images/${sample.filename}" alt="${sample.title}" />` :
                          `<div style="color: #9ca3af; text-align: center;">Image will appear here after generation</div>`
                        }
                    </div>
                    <div class="image-prompt">"${sample.prompt}"</div>
                    ${imageExists ? 
                      `<a href="samples/images/${sample.filename}" download class="download-btn">💾 Download Image</a>` :
                      ''
                    }
                </div>
              `;
            }).join('')}
        </div>
        
        <div class="footer" style="text-align: center; margin-top: 60px; padding: 40px 0; border-top: 1px solid rgba(255, 255, 255, 0.1);">
            <h3>🎉 Service Account Integration Success!</h3>
            <p>Real images generated using Google Imagen API with service account authentication!</p>
            <p>Project: ${serviceAccount.project_id}</p>
        </div>
    </div>
</body>
</html>`;

  const galleryPath = path.join(publicDir, 'service-account-images.html');
  fs.writeFileSync(galleryPath, galleryHtml);
  console.log(`📄 Created service account image gallery: public/service-account-images.html`);
}

// Main execution
async function main() {
  console.log('🚀 Starting Service Account Google Imagen Integration\n');
  
  // Get access token
  const accessToken = await getServiceAccountToken();
  
  if (!accessToken) {
    console.log('❌ Failed to get service account access token');
    console.log('💡 Please check your service account JSON file and permissions');
    return;
  }
  
  // Generate images
  let successCount = 0;
  
  for (const sample of sampleRequests) {
    const success = await generateRealImage(sample, accessToken);
    if (success) successCount++;
    
    console.log('');
    
    // Small delay between requests
    await new Promise(resolve => setTimeout(resolve, 2000));
  }
  
  // Create gallery
  createImageGallery();
  
  console.log('🎉 Service account image generation complete!');
  console.log(`📊 Results: ${successCount}/${sampleRequests.length} images generated successfully`);
  console.log('\n📁 Files created:');
  console.log('   • public/samples/images/ - Real generated images');
  console.log('   • public/samples/*.json - Image metadata files');
  console.log('   • public/service-account-images.html - Gallery with service account generated images');
  console.log('\n🌐 Open public/service-account-images.html to view your real generated images!');
  console.log(`🔑 Using project: ${serviceAccount.project_id}`);
}

// Run the script
main().catch(error => {
  console.error('❌ Service account image generation failed:', error);
});
