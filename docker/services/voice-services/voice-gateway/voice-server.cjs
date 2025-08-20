#!/usr/bin/env node

/**
 * Voice Gateway Server
 * Integrates STT and TTS services with the Startales game
 */

const express = require('express');
const WebSocket = require('ws');
const http = require('http');
const cors = require('cors');
const multer = require('multer');
const axios = require('axios');
const Redis = require('redis');

// Configuration
const PORT = process.env.PORT || 8000;
const WHISPER_STT_URL = process.env.WHISPER_STT_URL || 'http://localhost:8001';
const COQUI_TTS_URL = process.env.COQUI_TTS_URL || 'http://localhost:8002';
const REDIS_URL = process.env.REDIS_URL || 'redis://localhost:6379';

// Initialize Express app
const app = express();
const server = http.createServer(app);

// Middleware
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// File upload configuration
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 50 * 1024 * 1024 // 50MB limit
  }
});

// Redis client
let redisClient;

// Initialize services
async function initializeServices() {
  try {
    // Initialize Redis
    redisClient = Redis.createClient({ url: REDIS_URL });
    await redisClient.connect();
    console.log('✅ Redis connected');
  } catch (error) {
    console.warn('⚠️ Redis connection failed:', error.message);
  }

  // Test STT service
  try {
    const sttResponse = await axios.get(`${WHISPER_STT_URL}/health`);
    console.log('✅ STT service connected:', sttResponse.data);
  } catch (error) {
    console.warn('⚠️ STT service not available:', error.message);
  }

  // Test TTS service
  try {
    const ttsResponse = await axios.get(`${COQUI_TTS_URL}/health`);
    console.log('✅ TTS service connected:', ttsResponse.data);
  } catch (error) {
    console.warn('⚠️ TTS service not available:', error.message);
  }
}

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    services: {
      stt_url: WHISPER_STT_URL,
      tts_url: COQUI_TTS_URL,
      redis_connected: redisClient?.isReady || false
    }
  });
});

// Get available models
app.get('/api/voice/models', async (req, res) => {
  try {
    const [sttModels, ttsModels] = await Promise.all([
      axios.get(`${WHISPER_STT_URL}/models`).catch(() => ({ data: { error: 'STT service unavailable' } })),
      axios.get(`${COQUI_TTS_URL}/models`).catch(() => ({ data: { error: 'TTS service unavailable' } }))
    ]);

    res.json({
      stt: sttModels.data,
      tts: ttsModels.data
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get available voices
app.get('/api/voice/voices', async (req, res) => {
  try {
    const response = await axios.get(`${COQUI_TTS_URL}/voices`);
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Speech-to-Text endpoint
app.post('/api/voice/transcribe', upload.single('audio'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No audio file provided' });
    }

    // Forward to Whisper STT service
    const formData = new FormData();
    const blob = new Blob([req.file.buffer], { type: req.file.mimetype });
    formData.append('file', blob, req.file.originalname);

    const response = await axios.post(`${WHISPER_STT_URL}/transcribe`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      timeout: 30000 // 30 second timeout
    });

    // Cache result if Redis is available
    if (redisClient && redisClient.isReady) {
      const cacheKey = `transcription:${Date.now()}`;
      await redisClient.setEx(cacheKey, 3600, JSON.stringify(response.data)); // 1 hour cache
    }

    res.json(response.data);
  } catch (error) {
    console.error('Transcription error:', error.message);
    res.status(500).json({ 
      error: 'Transcription failed',
      details: error.response?.data || error.message 
    });
  }
});

// Text-to-Speech endpoint
app.post('/api/voice/synthesize', async (req, res) => {
  try {
    const { text, speaker_id, language = 'en', speed = 1.0 } = req.body;

    if (!text) {
      return res.status(400).json({ error: 'No text provided' });
    }

    // Check cache first
    let cacheKey;
    if (redisClient && redisClient.isReady) {
      cacheKey = `tts:${Buffer.from(text + (speaker_id || 'default')).toString('base64')}`;
      const cached = await redisClient.get(cacheKey);
      if (cached) {
        return res.json(JSON.parse(cached));
      }
    }

    // Forward to Coqui TTS service
    const response = await axios.post(`${COQUI_TTS_URL}/synthesize`, {
      text,
      speaker_id,
      language,
      speed
    }, {
      timeout: 60000 // 60 second timeout for TTS
    });

    // Cache result
    if (redisClient && redisClient.isReady && cacheKey) {
      await redisClient.setEx(cacheKey, 7200, JSON.stringify(response.data)); // 2 hour cache
    }

    res.json(response.data);
  } catch (error) {
    console.error('TTS error:', error.message);
    res.status(500).json({ 
      error: 'Speech synthesis failed',
      details: error.response?.data || error.message 
    });
  }
});

// WebSocket server for real-time voice processing
const wss = new WebSocket.Server({ server });

wss.on('connection', (ws, req) => {
  console.log('🎙️ New voice WebSocket connection');
  
  ws.on('message', async (data) => {
    try {
      const message = JSON.parse(data);
      
      switch (message.type) {
        case 'audio_chunk':
          // Handle real-time audio streaming to STT
          await handleAudioChunk(ws, message);
          break;
          
        case 'tts_request':
          // Handle real-time TTS request
          await handleTTSRequest(ws, message);
          break;
          
        case 'ping':
          ws.send(JSON.stringify({ type: 'pong', timestamp: Date.now() }));
          break;
          
        default:
          ws.send(JSON.stringify({ type: 'error', message: 'Unknown message type' }));
      }
    } catch (error) {
      console.error('WebSocket message error:', error);
      ws.send(JSON.stringify({ type: 'error', message: error.message }));
    }
  });

  ws.on('close', () => {
    console.log('🎙️ Voice WebSocket connection closed');
  });

  ws.on('error', (error) => {
    console.error('WebSocket error:', error);
  });

  // Send welcome message
  ws.send(JSON.stringify({
    type: 'connected',
    timestamp: Date.now(),
    services: {
      stt: WHISPER_STT_URL,
      tts: COQUI_TTS_URL
    }
  }));
});

// Handle real-time audio chunks for STT
async function handleAudioChunk(ws, message) {
  try {
    // Forward audio chunk to Whisper STT WebSocket
    // This would require establishing a connection to the STT service
    // For now, we'll use the HTTP endpoint with buffering
    
    ws.send(JSON.stringify({
      type: 'stt_partial',
      text: 'Processing audio...',
      confidence: 0.5,
      timestamp: Date.now()
    }));
  } catch (error) {
    ws.send(JSON.stringify({
      type: 'error',
      message: `STT processing error: ${error.message}`
    }));
  }
}

// Handle real-time TTS requests
async function handleTTSRequest(ws, message) {
  try {
    const { text, speaker_id } = message;
    
    // Forward to TTS service
    const response = await axios.post(`${COQUI_TTS_URL}/synthesize`, {
      text,
      speaker_id
    });

    ws.send(JSON.stringify({
      type: 'tts_result',
      audio_data: response.data.audio_data,
      sample_rate: response.data.sample_rate,
      duration: response.data.duration,
      speaker_id
    }));
  } catch (error) {
    ws.send(JSON.stringify({
      type: 'error',
      message: `TTS processing error: ${error.message}`
    }));
  }
}

// Demo endpoints for testing
app.get('/demo', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html>
    <head>
        <title>Voice Gateway Demo</title>
        <style>
            body { font-family: Arial, sans-serif; max-width: 800px; margin: 0 auto; padding: 20px; }
            .section { margin: 20px 0; padding: 20px; border: 1px solid #ddd; border-radius: 5px; }
            button { padding: 10px 20px; margin: 5px; cursor: pointer; }
            textarea { width: 100%; height: 100px; }
            audio { width: 100%; margin: 10px 0; }
            #status { padding: 10px; background: #f0f0f0; border-radius: 5px; }
        </style>
    </head>
    <body>
        <h1>🎙️ Voice Gateway Demo</h1>
        
        <div id="status">Connecting...</div>
        
        <div class="section">
            <h2>Speech-to-Text</h2>
            <input type="file" id="audioFile" accept="audio/*">
            <button onclick="transcribeAudio()">Transcribe</button>
            <div id="transcriptionResult"></div>
        </div>
        
        <div class="section">
            <h2>Text-to-Speech</h2>
            <textarea id="textInput" placeholder="Enter text to synthesize...">Hello! This is a test of the text-to-speech system.</textarea>
            <br>
            <button onclick="synthesizeSpeech()">Synthesize</button>
            <audio id="audioPlayer" controls></audio>
        </div>
        
        <div class="section">
            <h2>Real-time Voice</h2>
            <button onclick="startRecording()">Start Recording</button>
            <button onclick="stopRecording()">Stop Recording</button>
            <div id="realtimeResult"></div>
        </div>

        <script>
            let ws;
            let mediaRecorder;
            let audioChunks = [];

            // Initialize WebSocket connection
            function initWebSocket() {
                ws = new WebSocket('ws://localhost:8003');
                
                ws.onopen = () => {
                    document.getElementById('status').innerHTML = '✅ Connected to Voice Gateway';
                };
                
                ws.onmessage = (event) => {
                    const data = JSON.parse(event.data);
                    console.log('WebSocket message:', data);
                    
                    if (data.type === 'stt_partial' || data.type === 'stt_final') {
                        document.getElementById('realtimeResult').innerHTML = 
                            '<strong>Transcription:</strong> ' + data.text;
                    }
                };
                
                ws.onclose = () => {
                    document.getElementById('status').innerHTML = '❌ Disconnected from Voice Gateway';
                };
            }

            // Transcribe uploaded audio file
            async function transcribeAudio() {
                const fileInput = document.getElementById('audioFile');
                if (!fileInput.files[0]) {
                    alert('Please select an audio file');
                    return;
                }

                const formData = new FormData();
                formData.append('audio', fileInput.files[0]);

                try {
                    const response = await fetch('/api/voice/transcribe', {
                        method: 'POST',
                        body: formData
                    });
                    
                    const result = await response.json();
                    document.getElementById('transcriptionResult').innerHTML = 
                        '<strong>Result:</strong> ' + result.text + 
                        '<br><strong>Confidence:</strong> ' + (result.confidence * 100).toFixed(1) + '%' +
                        '<br><strong>Processing Time:</strong> ' + result.processing_time.toFixed(2) + 's';
                } catch (error) {
                    document.getElementById('transcriptionResult').innerHTML = 
                        '<strong>Error:</strong> ' + error.message;
                }
            }

            // Synthesize speech from text
            async function synthesizeSpeech() {
                const text = document.getElementById('textInput').value;
                if (!text) {
                    alert('Please enter text to synthesize');
                    return;
                }

                try {
                    const response = await fetch('/api/voice/synthesize', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ text })
                    });
                    
                    const result = await response.json();
                    
                    // Convert base64 to audio blob
                    const audioData = atob(result.audio_data);
                    const audioArray = new Uint8Array(audioData.length);
                    for (let i = 0; i < audioData.length; i++) {
                        audioArray[i] = audioData.charCodeAt(i);
                    }
                    
                    const audioBlob = new Blob([audioArray], { type: 'audio/wav' });
                    const audioUrl = URL.createObjectURL(audioBlob);
                    
                    const audioPlayer = document.getElementById('audioPlayer');
                    audioPlayer.src = audioUrl;
                    audioPlayer.play();
                } catch (error) {
                    alert('TTS Error: ' + error.message);
                }
            }

            // Start real-time recording
            async function startRecording() {
                try {
                    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
                    mediaRecorder = new MediaRecorder(stream);
                    audioChunks = [];

                    mediaRecorder.ondataavailable = (event) => {
                        audioChunks.push(event.data);
                    };

                    mediaRecorder.onstop = () => {
                        const audioBlob = new Blob(audioChunks, { type: 'audio/wav' });
                        // Send to WebSocket for processing
                        const reader = new FileReader();
                        reader.onload = () => {
                            if (ws && ws.readyState === WebSocket.OPEN) {
                                ws.send(JSON.stringify({
                                    type: 'audio_chunk',
                                    data: reader.result.split(',')[1] // Remove data URL prefix
                                }));
                            }
                        };
                        reader.readAsDataURL(audioBlob);
                    };

                    mediaRecorder.start();
                    document.getElementById('realtimeResult').innerHTML = '🎙️ Recording...';
                } catch (error) {
                    alert('Microphone access error: ' + error.message);
                }
            }

            // Stop real-time recording
            function stopRecording() {
                if (mediaRecorder && mediaRecorder.state === 'recording') {
                    mediaRecorder.stop();
                    document.getElementById('realtimeResult').innerHTML = '⏹️ Processing...';
                }
            }

            // Initialize on page load
            window.onload = initWebSocket;
        </script>
    </body>
    </html>
  `);
});

// Start server
async function startServer() {
  await initializeServices();
  
  server.listen(PORT, '0.0.0.0', () => {
    console.log(`🎙️ Voice Gateway Server running on port ${PORT}`);
    console.log(`📊 Demo available at http://localhost:${PORT}/demo`);
    console.log(`🔗 WebSocket endpoint: ws://localhost:${PORT}`);
  });
}

// Graceful shutdown
process.on('SIGTERM', async () => {
  console.log('Shutting down Voice Gateway...');
  if (redisClient) {
    await redisClient.disconnect();
  }
  server.close(() => {
    console.log('Voice Gateway shut down complete');
    process.exit(0);
  });
});

startServer().catch(console.error);
