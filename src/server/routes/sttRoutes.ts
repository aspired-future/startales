import express from 'express';
import multer from 'multer';
import FormData from 'form-data';
import fetch from 'node-fetch';

const router = express.Router();

// Configure multer for file uploads
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
});

/**
 * POST /api/stt/transcribe - Transcribe audio to text
 */
router.post('/transcribe', upload.single('audio'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        error: 'No audio file provided'
      });
    }

    console.log('🎙️ Transcribing audio file:', {
      originalName: req.file.originalname,
      mimeType: req.file.mimetype,
      size: req.file.size
    });

    // Create form data for STT service
    const formData = new FormData();
    
    // Handle different audio formats properly
    let filename = req.file.originalname || 'audio.wav';
    let contentType = req.file.mimetype || 'audio/wav';
    
    // If it's webm, keep the webm extension so STT service knows the format
    if (req.file.mimetype === 'audio/webm') {
      filename = 'audio.webm';
      console.log('🔄 Processing webm audio format');
    }
    
    formData.append('audio', req.file.buffer, {
      filename: filename,
      contentType: contentType
    });

    // Forward to STT service
    const sttServiceUrl = process.env.STT_SERVICE_URL || 'http://stt:8000';
    const response = await fetch(`${sttServiceUrl}/transcribe`, {
      method: 'POST',
      body: formData,
      headers: formData.getHeaders()
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('STT service error:', response.status, errorText);
      throw new Error(`STT service error: ${response.status}`);
    }

    const result = await response.json();
    console.log('✅ Transcription result:', result);

    res.json({
      success: true,
      text: result.text || result.transcript || '',
      confidence: result.confidence || 0.9,
      language: result.language || 'en',
      duration: result.duration || 0
    });

  } catch (error) {
    console.error('❌ Transcription error:', error);
    res.status(500).json({
      error: 'Failed to transcribe audio',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

/**
 * GET /api/stt/health - Check STT service health
 */
router.get('/health', async (req, res) => {
  try {
    const sttServiceUrl = process.env.STT_SERVICE_URL || 'http://stt:8000';
    const response = await fetch(`${sttServiceUrl}/health`);
    
    if (response.ok) {
      const healthData = await response.json();
      res.json({
        success: true,
        sttService: healthData
      });
    } else {
      throw new Error(`STT service unhealthy: ${response.status}`);
    }
  } catch (error) {
    console.error('STT health check failed:', error);
    res.status(503).json({
      error: 'STT service unavailable',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

export default router;
