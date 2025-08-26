/**
 * Voice Service for WhoseApp
 * Handles Speech-to-Text (STT) and Text-to-Speech (TTS) functionality
 */

import { dynamicVoiceGenerator, CharacterTraits } from './DynamicVoiceGenerator';

export interface VoiceRecording {
  id: string;
  audioBlob: Blob;
  duration: number;
  transcript?: string;
  timestamp: Date;
}

export interface TTSOptions {
  voice?: string;
  rate?: number;
  pitch?: number;
  volume?: number;
  characterId?: string;
}

export interface CharacterVoice {
  characterId: string;
  voiceName: string;
  rate: number;
  pitch: number;
  volume: number;
  language: string;
}

class VoiceService {
  private mediaRecorder: MediaRecorder | null = null;
  private audioChunks: Blob[] = [];
  private isRecording = false;
  private recognition: any = null;
  private synthesis: SpeechSynthesis;
  private availableVoices: SpeechSynthesisVoice[] = [];
  private characterVoices: Map<string, CharacterVoice> = new Map();

  constructor() {
    this.synthesis = window.speechSynthesis;
    this.initializeSpeechRecognition();
    this.initializeVoices();
    this.setupCharacterVoices();
  }

  // Initialize Speech Recognition (STT)
  private initializeSpeechRecognition() {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    
    if (SpeechRecognition) {
      this.recognition = new SpeechRecognition();
      this.recognition.continuous = false;
      this.recognition.interimResults = true;
      this.recognition.lang = 'en-US';
    }
  }

  // Initialize available voices
  private initializeVoices() {
    const loadVoices = () => {
      this.availableVoices = this.synthesis.getVoices();
    };

    loadVoices();
    if (this.synthesis.onvoiceschanged !== undefined) {
      this.synthesis.onvoiceschanged = loadVoices;
    }
  }

  // Setup character-specific voices
  private setupCharacterVoices() {
    // Diplomat - Elegant female voice
    this.characterVoices.set('char_diplomat_001', {
      characterId: 'char_diplomat_001',
      voiceName: 'Microsoft Zira - English (United States)',
      rate: 0.9,
      pitch: 1.1,
      volume: 0.8,
      language: 'en-US'
    });

    // Economist - Analytical male voice
    this.characterVoices.set('char_economist_001', {
      characterId: 'char_economist_001',
      voiceName: 'Microsoft David - English (United States)',
      rate: 1.0,
      pitch: 0.9,
      volume: 0.8,
      language: 'en-US'
    });

    // Military Commander - Authoritative voice
    this.characterVoices.set('char_commander_001', {
      characterId: 'char_commander_001',
      voiceName: 'Microsoft Mark - English (United States)',
      rate: 1.1,
      pitch: 0.8,
      volume: 0.9,
      language: 'en-US'
    });

    // Scientist - Precise female voice
    this.characterVoices.set('char_scientist_001', {
      characterId: 'char_scientist_001',
      voiceName: 'Microsoft Hazel - English (Great Britain)',
      rate: 0.95,
      pitch: 1.0,
      volume: 0.8,
      language: 'en-GB'
    });

    // Engineer - Technical male voice
    this.characterVoices.set('char_engineer_001', {
      characterId: 'char_engineer_001',
      voiceName: 'Microsoft George - English (Great Britain)',
      rate: 1.05,
      pitch: 0.95,
      volume: 0.8,
      language: 'en-GB'
    });

    // Default player voice
    this.characterVoices.set('player_default', {
      characterId: 'player_default',
      voiceName: 'Microsoft Aria - English (United States)',
      rate: 1.0,
      pitch: 1.0,
      volume: 0.8,
      language: 'en-US'
    });
  }

  // Check if STT is supported
  public isSTTSupported(): boolean {
    return this.recognition !== null;
  }

  // Check if TTS is supported
  public isTTSSupported(): boolean {
    return 'speechSynthesis' in window;
  }

  // Check if audio recording is supported
  public isRecordingSupported(): boolean {
    return 'MediaRecorder' in window && navigator.mediaDevices && navigator.mediaDevices.getUserMedia;
  }

  // Request microphone permission
  public async requestMicrophonePermission(): Promise<boolean> {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      stream.getTracks().forEach(track => track.stop()); // Stop the stream immediately
      return true;
    } catch (error) {
      console.error('Microphone permission denied:', error);
      return false;
    }
  }

  // Start voice recording
  public async startRecording(): Promise<boolean> {
    if (!this.isRecordingSupported()) {
      throw new Error('Audio recording not supported');
    }

    if (this.isRecording) {
      return false;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true
        }
      });

      this.mediaRecorder = new MediaRecorder(stream, {
        mimeType: 'audio/webm;codecs=opus'
      });

      this.audioChunks = [];

      this.mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          this.audioChunks.push(event.data);
        }
      };

      this.mediaRecorder.start(100); // Collect data every 100ms
      this.isRecording = true;
      return true;
    } catch (error) {
      console.error('Failed to start recording:', error);
      throw error;
    }
  }

  // Stop voice recording
  public async stopRecording(): Promise<VoiceRecording | null> {
    if (!this.mediaRecorder || !this.isRecording) {
      return null;
    }

    return new Promise((resolve) => {
      this.mediaRecorder!.onstop = () => {
        const audioBlob = new Blob(this.audioChunks, { type: 'audio/webm' });
        const recording: VoiceRecording = {
          id: `voice_${Date.now()}`,
          audioBlob,
          duration: 0, // Will be calculated if needed
          timestamp: new Date()
        };

        // Stop all tracks
        this.mediaRecorder!.stream.getTracks().forEach(track => track.stop());
        this.isRecording = false;
        resolve(recording);
      };

      this.mediaRecorder!.stop();
    });
  }

  // Convert speech to text
  public async speechToText(onResult: (transcript: string, isFinal: boolean) => void, onError?: (error: any) => void): Promise<void> {
    if (!this.isSTTSupported()) {
      throw new Error('Speech recognition not supported');
    }

    return new Promise((resolve, reject) => {
      this.recognition.onresult = (event: any) => {
        let transcript = '';
        let isFinal = false;

        for (let i = event.resultIndex; i < event.results.length; i++) {
          transcript += event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            isFinal = true;
          }
        }

        onResult(transcript, isFinal);
      };

      this.recognition.onerror = (event: any) => {
        console.error('Speech recognition error:', event.error);
        if (onError) {
          onError(event.error);
        }
        reject(event.error);
      };

      this.recognition.onend = () => {
        resolve();
      };

      this.recognition.start();
    });
  }

  // Convert text to speech
  public async textToSpeech(text: string, options: TTSOptions = {}): Promise<void> {
    if (!this.isTTSSupported()) {
      throw new Error('Text-to-speech not supported');
    }

    // Check if voices are available
    if (this.availableVoices.length === 0) {
      console.warn('⚠️ No voices available for TTS, using fallback behavior');
      // Try to reload voices one more time
      this.availableVoices = this.synthesis.getVoices();
      
      if (this.availableVoices.length === 0) {
        // Fallback: Log the text that would be spoken
        console.log(`🔊 TTS Fallback: "${text}" (Character: ${options.characterId || 'default'})`);
        
        // Simulate speech duration for testing
        const estimatedDuration = Math.max(1000, text.length * 50); // ~50ms per character
        await new Promise(resolve => setTimeout(resolve, estimatedDuration));
        return;
      }
    }

    // Cancel any ongoing speech
    this.synthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);

    // Apply character-specific voice if available
    if (options.characterId && this.characterVoices.has(options.characterId)) {
      const characterVoice = this.characterVoices.get(options.characterId)!;
      const voice = this.availableVoices.find(v => 
        v.name.includes(characterVoice.voiceName.split(' - ')[0]) || 
        v.name === characterVoice.voiceName
      );
      
      if (voice) {
        utterance.voice = voice;
      }
      
      utterance.rate = options.rate || characterVoice.rate;
      utterance.pitch = options.pitch || characterVoice.pitch;
      utterance.volume = options.volume || characterVoice.volume;
    } else {
      // Apply general options
      utterance.rate = options.rate || 1.0;
      utterance.pitch = options.pitch || 1.0;
      utterance.volume = options.volume || 1.0;

      if (options.voice) {
        const voice = this.availableVoices.find(v => v.name === options.voice);
        if (voice) {
          utterance.voice = voice;
        }
      }
    }

    return new Promise((resolve, reject) => {
      // Add timeout to prevent hanging
      const timeout = setTimeout(() => {
        this.synthesis.cancel();
        reject(new Error('synthesis-timeout'));
      }, 10000); // 10 second timeout
      
      utterance.onend = () => {
        clearTimeout(timeout);
        console.log(`✅ TTS completed for: "${text.substring(0, 50)}..."`);
        resolve();
      };
      
      utterance.onerror = (event) => {
        clearTimeout(timeout);
        console.error(`❌ TTS error: ${event.error} for text: "${text.substring(0, 50)}..."`);
        reject(new Error(`synthesis-failed: ${event.error}`));
      };
      
      try {
        this.synthesis.speak(utterance);
        console.log(`🔊 TTS started for: "${text.substring(0, 50)}..." (Character: ${options.characterId || 'default'})`);
      } catch (error) {
        clearTimeout(timeout);
        console.error(`❌ TTS synthesis error:`, error);
        reject(error);
      }
    });
  }

  // Stop current TTS
  public stopSpeech(): void {
    if (this.synthesis.speaking) {
      this.synthesis.cancel();
    }
  }

  // Get available voices
  public getAvailableVoices(): SpeechSynthesisVoice[] {
    return this.availableVoices;
  }

  // Get character voice settings
  public getCharacterVoice(characterId: string): CharacterVoice | null {
    return this.characterVoices.get(characterId) || null;
  }

  // Set character voice settings
  public setCharacterVoice(characterId: string, voice: CharacterVoice): void {
    this.characterVoices.set(characterId, voice);
  }

  // Check if currently recording
  public getIsRecording(): boolean {
    return this.isRecording;
  }

  // Check if currently speaking
  public getIsSpeaking(): boolean {
    return this.synthesis.speaking;
  }

  // Create audio URL from blob for playback
  public createAudioURL(audioBlob: Blob): string {
    return URL.createObjectURL(audioBlob);
  }

  // Cleanup audio URL
  public revokeAudioURL(url: string): void {
    URL.revokeObjectURL(url);
  }

  // Channel-specific voice management
  public async speakInChannel(text: string, characterId: string, onSpeakingStart?: () => void, onSpeakingEnd?: () => void): Promise<void> {
    if (!this.isTTSSupported()) {
      throw new Error('Text-to-speech not supported');
    }

    // Cancel any ongoing speech
    this.synthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);

    // Apply character-specific voice
    const characterVoice = this.characterVoices.get(characterId);
    if (characterVoice) {
      const voice = this.availableVoices.find(v => 
        v.name.includes(characterVoice.voiceName.split(' - ')[0]) || 
        v.name === characterVoice.voiceName
      );
      
      if (voice) {
        utterance.voice = voice;
      }
      
      utterance.rate = characterVoice.rate;
      utterance.pitch = characterVoice.pitch;
      utterance.volume = characterVoice.volume;
    }

    return new Promise((resolve, reject) => {
      utterance.onstart = () => {
        onSpeakingStart?.();
      };

      utterance.onend = () => {
        onSpeakingEnd?.();
        resolve();
      };

      utterance.onerror = (event) => {
        onSpeakingEnd?.();
        reject(event.error);
      };
      
      this.synthesis.speak(utterance);
    });
  }

  // Get all character voices for a channel
  public getChannelVoices(characterIds: string[]): Map<string, CharacterVoice> {
    const channelVoices = new Map<string, CharacterVoice>();
    
    characterIds.forEach(id => {
      const voice = this.characterVoices.get(id);
      if (voice) {
        channelVoices.set(id, voice);
      } else {
        // Create default voice for unknown characters
        channelVoices.set(id, {
          characterId: id,
          voiceName: 'Default',
          rate: 1.0,
          pitch: 1.0,
          volume: 0.8,
          language: 'en-US'
        });
      }
    });

    return channelVoices;
  }

  // Auto-assign voices to characters based on available voices
  public autoAssignVoices(characterIds: string[]): void {
    const availableVoiceNames = this.availableVoices.map(v => v.name);
    const voiceVariations = [
      { rate: 0.9, pitch: 1.1 },  // Higher pitch, slower
      { rate: 1.0, pitch: 0.9 },  // Lower pitch, normal speed
      { rate: 1.1, pitch: 0.8 },  // Lower pitch, faster
      { rate: 0.95, pitch: 1.0 }, // Normal pitch, slightly slower
      { rate: 1.05, pitch: 0.95 } // Slightly lower pitch, faster
    ];

    characterIds.forEach((id, index) => {
      if (!this.characterVoices.has(id)) {
        const voiceIndex = index % availableVoiceNames.length;
        const variationIndex = index % voiceVariations.length;
        const variation = voiceVariations[variationIndex];

        this.characterVoices.set(id, {
          characterId: id,
          voiceName: availableVoiceNames[voiceIndex],
          rate: variation.rate,
          pitch: variation.pitch,
          volume: 0.8,
          language: 'en-US'
        });
      }
    });
  }

  // Check if character has custom voice
  public hasCharacterVoice(characterId: string): boolean {
    return this.characterVoices.has(characterId);
  }

  // Get voice preview text for character
  public getVoicePreviewText(characterId: string): string {
    const characterVoice = this.characterVoices.get(characterId);
    if (!characterVoice) return "Hello, this is a voice preview.";

    // Character-specific preview texts
    const previews: { [key: string]: string } = {
      'char_diplomat_001': "Greetings. I am Ambassador Elena Vasquez, representing the diplomatic corps.",
      'char_economist_001': "Hello. Dr. Marcus Chen here. Let me share some economic insights with you.",
      'char_commander_001': "Commander Alpha reporting. Ready to discuss strategic operations.",
      'char_scientist_001': "Dr. Sarah Mitchell speaking. I'm here to discuss our latest research findings.",
      'char_engineer_001': "Chief Engineer Thompson at your service. Let's talk about our technical capabilities.",
      'player_default': "This is your voice preview. You can customize this in the settings."
    };

    return previews[characterId] || `Hello, this is ${characterId} speaking.`;
  }

  // Generate voice profile for character based on traits
  public generateCharacterVoice(traits: CharacterTraits): CharacterVoice {
    const voiceProfile = dynamicVoiceGenerator.generateVoiceProfile(traits);
    
    // Store the generated voice
    this.characterVoices.set(traits.id, voiceProfile);
    
    return voiceProfile;
  }

  // Generate voices for multiple characters
  public generateCharacterVoices(characterTraits: CharacterTraits[]): Map<string, CharacterVoice> {
    const generatedVoices = new Map<string, CharacterVoice>();
    
    characterTraits.forEach(traits => {
      const voice = this.generateCharacterVoice(traits);
      generatedVoices.set(traits.id, voice);
    });
    
    return generatedVoices;
  }

  // Get dynamic preview text for character
  public getDynamicPreviewText(traits: CharacterTraits): string {
    return dynamicVoiceGenerator.generatePreviewText(traits);
  }

  // Update character voice based on new traits
  public updateCharacterVoice(characterId: string, traits: CharacterTraits): CharacterVoice {
    const updatedVoice = dynamicVoiceGenerator.generateVoiceProfile(traits);
    this.characterVoices.set(characterId, updatedVoice);
    return updatedVoice;
  }

  // Get voice generation statistics
  public getVoiceGenerationStats(): {
    totalVoices: number;
    generatedVoices: number;
    availableSystemVoices: number;
    voiceCategories: string[];
  } {
    const categories = Array.from(dynamicVoiceGenerator.getVoiceCategories().keys());
    
    return {
      totalVoices: this.characterVoices.size,
      generatedVoices: Array.from(this.characterVoices.values()).filter(v => v.voiceName !== 'Default').length,
      availableSystemVoices: dynamicVoiceGenerator.getAvailableVoices().length,
      voiceCategories: categories
    };
  }

  // Continuous listening properties
  private continuousRecognition: any = null;
  private silenceTimer: NodeJS.Timeout | null = null;
  private isListeningContinuously = false;
  private currentTranscript = '';
  private onTranscriptCallback: ((transcript: string) => void) | null = null;
  private silenceThreshold = 2000; // 2 seconds of silence before processing

  // Start continuous listening for natural conversation
  public startContinuousListening(onTranscript: (transcript: string) => void): boolean {
    if (!this.isSTTSupported() || this.isListeningContinuously) {
      return false;
    }

    try {
      this.continuousRecognition = new (window.webkitSpeechRecognition || window.SpeechRecognition)();
      this.onTranscriptCallback = onTranscript;
      
      this.continuousRecognition.continuous = true;
      this.continuousRecognition.interimResults = true;
      this.continuousRecognition.lang = 'en-US';
      this.continuousRecognition.maxAlternatives = 1;

      this.continuousRecognition.onstart = () => {
        console.log('🎤 Continuous listening started');
        this.isListeningContinuously = true;
      };

      this.continuousRecognition.onresult = (event: any) => {
        let interimTranscript = '';
        let finalTranscript = '';

        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcript = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            finalTranscript += transcript;
          } else {
            interimTranscript += transcript;
          }
        }

        // Update current transcript
        if (finalTranscript) {
          this.currentTranscript += finalTranscript;
          console.log('🎤 Final transcript:', finalTranscript);
        }

        // Reset silence timer on any speech
        if (interimTranscript || finalTranscript) {
          this.resetSilenceTimer();
        }
      };

      this.continuousRecognition.onend = () => {
        console.log('🎤 Recognition ended, restarting...');
        if (this.isListeningContinuously) {
          // Restart recognition to keep listening
          setTimeout(() => {
            if (this.isListeningContinuously && this.continuousRecognition) {
              this.continuousRecognition.start();
            }
          }, 100);
        }
      };

      this.continuousRecognition.onerror = (event: any) => {
        console.error('🎤 Recognition error:', event.error);
        if (event.error === 'no-speech' || event.error === 'audio-capture') {
          // These are expected, just restart
          if (this.isListeningContinuously) {
            setTimeout(() => {
              if (this.continuousRecognition) {
                this.continuousRecognition.start();
              }
            }, 500);
          }
        }
      };

      this.continuousRecognition.start();
      return true;
    } catch (error) {
      console.error('Failed to start continuous listening:', error);
      return false;
    }
  }

  // Stop continuous listening
  public stopContinuousListening(): void {
    if (this.continuousRecognition) {
      this.isListeningContinuously = false;
      this.continuousRecognition.stop();
      this.continuousRecognition = null;
    }
    
    if (this.silenceTimer) {
      clearTimeout(this.silenceTimer);
      this.silenceTimer = null;
    }
    
    this.onTranscriptCallback = null;
    console.log('🎤 Continuous listening stopped');
  }

  // Reset silence detection timer
  private resetSilenceTimer(): void {
    if (this.silenceTimer) {
      clearTimeout(this.silenceTimer);
    }
    
    this.silenceTimer = setTimeout(() => {
      if (this.currentTranscript.trim() && this.onTranscriptCallback) {
        console.log('🔇 Silence detected, processing transcript:', this.currentTranscript);
        this.onTranscriptCallback(this.currentTranscript.trim());
        this.currentTranscript = '';
      }
    }, this.silenceThreshold);
  }

  // Check if currently listening
  public isContinuouslyListening(): boolean {
    return this.isListeningContinuously;
  }

  // Set silence threshold
  public setSilenceThreshold(ms: number): void {
    this.silenceThreshold = ms;
  }
}

export const voiceService = new VoiceService();
