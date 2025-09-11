/**
 * Unified Conversation Interface for WhoseApp
 * 
 * Combines text messaging and conversational voice in a single interface
 * with seamless switching between modes and full game context integration
 */

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { conversationalCallService, ConversationState } from '../../services/ConversationalCallService';
import { CharacterProfile, WhoseAppMessage } from '../../types/WhoseAppTypes';
import '../GameHUD/screens/shared/StandardDesign.css';

interface UnifiedConversationInterfaceProps {
  character: CharacterProfile;
  conversationId: string;
  currentUserId: string;
  civilizationId: string;
  onBack: () => void;
  initialInputMode?: 'text' | 'voice';
  gameContext?: {
    currentCampaign?: any;
    playerResources?: any;
    recentEvents?: any[];
  };
}

interface ConversationMessage {
  id: string;
  conversationId: string;
  senderId: string;
  senderName: string;
  senderType: 'player' | 'character' | 'system';
  content: string;
  messageType: 'text' | 'voice' | 'system';
  timestamp: Date;
  metadata?: {
    characterMood?: string;
    confidentialityLevel?: string;
    urgency?: string;
  };
}

export const UnifiedConversationInterface: React.FC<UnifiedConversationInterfaceProps> = ({
  character,
  conversationId,
  currentUserId,
  civilizationId,
  onBack,
  initialInputMode = 'text',
  gameContext
}) => {
  try {
    console.log('🎯 UnifiedConversationInterface: Mounting with props:', {
      character: character?.name,
      conversationId,
      currentUserId,
      civilizationId,
      initialInputMode
    });

    // Message state
  const [messages, setMessages] = useState<ConversationMessage[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Mode state
  const [inputMode, setInputMode] = useState<'text' | 'voice'>(initialInputMode);
  
  // Voice call state
  const [conversationState, setConversationState] = useState<ConversationState | null>(null);
  const [isCallActive, setIsCallActive] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [callDuration, setCallDuration] = useState(0);
  const [currentSpeaker, setCurrentSpeaker] = useState<'user' | 'character' | null>(null);
  
  // Push-to-talk voice conversation state
  const [isListening, setIsListening] = useState(false);
  const [isProcessingVoice, setIsProcessingVoice] = useState(false);
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null);
  const [audioStream, setAudioStream] = useState<MediaStream | null>(null);
  const [isRecording, setIsRecording] = useState(false); // Push-to-talk state
  
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Spacebar controls will be added after function definitions

  // Auto-scroll to bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Load messages on mount
  const loadMessages = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await fetch(`http://localhost:4000/api/whoseapp/conversations/${conversationId}/messages?limit=50`);
      
      if (!response.ok) {
        throw new Error(`Failed to load messages: ${response.statusText}`);
      }

      const data = await response.json();
      
      if (data.success && data.data) {
        const formattedMessages: ConversationMessage[] = data.data.map((msg: any) => ({
          id: msg.id,
          conversationId: msg.conversationId,
          senderId: msg.senderId,
          senderName: msg.senderName || (msg.senderId === currentUserId ? 'You' : character.name),
          senderType: msg.senderId === currentUserId ? 'player' : 'character',
          content: msg.content,
          messageType: msg.type || 'text',
          timestamp: new Date(msg.timestamp),
          metadata: msg.metadata || {}
        }));
        
        setMessages(formattedMessages);
      }
    } catch (err) {
      console.error('Error loading messages:', err);
      setError(err instanceof Error ? err.message : 'Failed to load messages');
    } finally {
      setIsLoading(false);
    }
  }, [conversationId, currentUserId, character.name]);

  useEffect(() => {
    loadMessages();
  }, [loadMessages]);

  // Auto-start voice mode if requested
  // Voice call auto-start will be added after function definitions

  // Define stopContinuousListening function before using it
  const stopContinuousListening = useCallback(() => {
    if (audioStream) {
      audioStream.getTracks().forEach(track => track.stop());
      setAudioStream(null);
    }
    if (mediaRecorder && mediaRecorder.state === 'recording') {
      mediaRecorder.stop();
    }
    // Silence timer removed - using push-to-talk now
    setIsListening(false);
    setMediaRecorder(null);
    setCurrentSpeaker(null);
  }, [audioStream, mediaRecorder]);

  // Cleanup effect - stop listening when component unmounts
  useEffect(() => {
    return () => {
      if (isListening) {
        stopContinuousListening();
      }
    };
  }, [isListening, stopContinuousListening]);

  // Setup conversational service callbacks
  useEffect(() => {
    conversationalCallService.setOnMessageCallback((message: WhoseAppMessage) => {
      // Convert WhoseAppMessage to ConversationMessage
      const conversationMessage: ConversationMessage = {
        id: message.id,
        conversationId: message.conversationId,
        senderId: message.senderId,
        senderName: message.senderName,
        senderType: message.senderId === currentUserId ? 'player' : 'character',
        content: message.content,
        messageType: message.messageType as 'text' | 'voice' | 'system',
        timestamp: message.timestamp,
        metadata: message.metadata
      };
      
      setMessages(prev => [...prev, conversationMessage]);
    });
    
    conversationalCallService.setOnStateChangeCallback(setConversationState);
    
    return () => {
      conversationalCallService.setOnMessageCallback(() => {});
      conversationalCallService.setOnStateChangeCallback(() => {});
    };
  }, [currentUserId]);

  // Update current speaker based on conversation state
  useEffect(() => {
    if (conversationState) {
      setCurrentSpeaker(conversationState.currentSpeaker);
    }
  }, [conversationState]);

  // Call duration timer
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    
    if (isCallActive) {
      interval = setInterval(() => {
        setCallDuration(prev => prev + 1);
      }, 1000);
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isCallActive]);

  // Send text message
  const handleSendTextMessage = useCallback(async () => {
    if (!newMessage.trim() || isLoading) return;

    try {
      setIsLoading(true);
      
      // Add user message to local state immediately
      const userMessage: ConversationMessage = {
        id: `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        conversationId,
        senderId: currentUserId,
        senderName: 'You',
        senderType: 'player',
        content: newMessage,
        messageType: 'text',
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, userMessage]);
      
      // Send to backend
      const response = await fetch('http://localhost:4000/api/whoseapp/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          conversationId,
          senderId: currentUserId,
          content: newMessage,
          messageType: 'text',
          civilizationId
        })
      });

      if (response.ok) {
        // Generate AI response with full game context
        await generateContextualResponse(newMessage);
      }
      
      setNewMessage('');
      
    } catch (err) {
      console.error('Failed to send message:', err);
      setError('Failed to send message');
    } finally {
      setIsLoading(false);
    }
  }, [newMessage, isLoading, conversationId, currentUserId, civilizationId]);

  // Generate contextual AI response
  const generateContextualResponse = useCallback(async (userMessage: string) => {
    try {
      const response = await fetch('http://localhost:4000/api/ai/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: userMessage,
          character: {
            id: character.id,
            name: character.name,
            role: character.role,
            department: character.department,
            personality: character.personality
          },
          conversationHistory: messages.slice(-5).map(msg => ({
            speaker: msg.senderType === 'player' ? 'user' : 'character',
            message: msg.content,
            timestamp: msg.timestamp
          })),
          context: {
            civilizationId,
            conversationId,
            gameContext,
            currentTime: new Date().toISOString()
          },
          options: {
            maxTokens: 4000,
            temperature: 0.7,
            model: 'llama3.2:1b'
          }
        })
      });

      if (response.ok) {
        const data = await response.json();
        const aiResponse = data.content;
        
        // Add AI response to messages
        const characterMessage: ConversationMessage = {
          id: `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          conversationId,
          senderId: character.id,
          senderName: character.name,
          senderType: 'character',
          content: aiResponse,
          messageType: 'text',
          timestamp: new Date(),
          metadata: {
            characterMood: character.personality?.currentMood || 'neutral'
          }
        };
        
        setMessages(prev => [...prev, characterMessage]);
      }
    } catch (error) {
      console.error('Failed to generate AI response:', error);
    }
  }, [character, messages, civilizationId, conversationId, gameContext]);

  // Push-to-talk voice functions
  const initializePushToTalk = useCallback(async () => {
    try {
      console.log('🎙️ initializePushToTalk: Requesting microphone access...');
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      console.log('✅ initializePushToTalk: Microphone access granted');
      
      setAudioStream(stream);
      setIsListening(true);
      
      // Create recorder but don't start it yet
      const recorder = new MediaRecorder(stream);
      let audioChunks: Blob[] = [];
      
      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunks.push(event.data);
          console.log('📊 Audio chunk added, size:', event.data.size);
        }
      };
      
      recorder.onstop = async () => {
        console.log('🛑 Recording stopped, processing...');
        if (audioChunks.length > 0) {
          const audioBlob = new Blob(audioChunks, { type: 'audio/webm' });
          await processVoiceToTranscript(audioBlob);
          audioChunks = [];
        }
      };
      
      setMediaRecorder(recorder);
      
    } catch (error) {
      console.error('❌ initializePushToTalk: Failed to initialize:', error);
      setError('Failed to access microphone. Please check permissions.');
    }
  }, []);

  const startRecording = useCallback(() => {
    if (mediaRecorder && mediaRecorder.state === 'inactive' && !isProcessingVoice) {
      console.log('🔴 Starting push-to-talk recording');
      mediaRecorder.start();
      setIsRecording(true);
      setCurrentSpeaker('user');
    }
  }, [mediaRecorder, isProcessingVoice]);

  const stopRecording = useCallback(() => {
    if (mediaRecorder && mediaRecorder.state === 'recording') {
      console.log('⏹️ Stopping push-to-talk recording');
      mediaRecorder.stop();
      setIsRecording(false);
      setCurrentSpeaker(null);
    }
  }, [mediaRecorder]);

  // Push-to-talk spacebar controls (after function definitions)
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.code === 'Space' && inputMode === 'voice' && !isRecording && !isProcessingVoice) {
        event.preventDefault();
        console.log('🎤 Spacebar pressed - Starting recording');
        startRecording();
      }
    };

    const handleKeyUp = (event: KeyboardEvent) => {
      if (event.code === 'Space' && inputMode === 'voice' && isRecording) {
        event.preventDefault();
        console.log('🛑 Spacebar released - Stopping recording');
        stopRecording();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [inputMode, isRecording, isProcessingVoice, startRecording, stopRecording]);

  // Old voice activity detection function removed - using push-to-talk now

  const processVoiceToTranscript = useCallback(async (audioBlob: Blob) => {
    // Prevent duplicate processing
    if (isProcessingVoice) {
      console.log('⚠️ processVoiceToTranscript: Already processing, skipping...');
      return;
    }
    
    try {
      console.log('🎙️ processVoiceToTranscript: Starting with blob size:', audioBlob.size, 'type:', audioBlob.type);
      setIsProcessingVoice(true);
      setIsLoading(true);
      
      // Send audio to STT service to get transcript
      const formData = new FormData();
      formData.append('audio', audioBlob, 'voice-message.wav');
      
      console.log('🚀 processVoiceToTranscript: Sending to STT service...');
      const response = await fetch('http://localhost:4000/api/stt/transcribe', {
        method: 'POST',
        body: formData
      });
      
      console.log('📡 processVoiceToTranscript: STT response status:', response.status);
      
      if (response.ok) {
        const data = await response.json();
        const transcript = data.transcript || data.text || 'Voice message received';
        
        console.log('✅ processVoiceToTranscript: Got transcript:', transcript);
        
        // Add voice message with transcript to chat (audio is discarded)
        const voiceMessage: ConversationMessage = {
          id: `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          conversationId,
          senderId: currentUserId,
          senderName: 'You',
          senderType: 'player',
          content: transcript, // Only save the transcript
          messageType: 'voice',
          timestamp: new Date()
        };
        
        console.log('💬 processVoiceToTranscript: Adding message to chat');
        setMessages(prev => [...prev, voiceMessage]);
        
        // Send transcript to backend (not audio)
        console.log('💾 processVoiceToTranscript: Saving to backend...');
        await fetch('http://localhost:4000/api/whoseapp/messages', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            conversationId,
            senderId: currentUserId,
            content: transcript, // Only transcript saved
            messageType: 'voice',
            civilizationId
          })
        });
        
        // Check if user is ending conversation - ENHANCED DETECTION
        const lowerTranscript = transcript.toLowerCase().trim();
        console.log('🔍 processVoiceToTranscript: Checking transcript for end phrases:', lowerTranscript);
        
        const endPhrases = ['thank you', 'thanks', 'goodbye', 'bye', 'that\'s all', 'stop', 'end conversation'];
        const isEnding = endPhrases.some(phrase => lowerTranscript.includes(phrase));
        
        if (isEnding) {
          console.log('👋 processVoiceToTranscript: User ending conversation, stopping voice mode...');
          setInputMode('text');
          setIsListening(false);
          setIsProcessingVoice(false); // Release lock
          
          // Stop any active recording
          if (mediaRecorder && mediaRecorder.state === 'recording') {
            mediaRecorder.stop();
          }
          
          // Close audio stream
          if (audioStream) {
            audioStream.getTracks().forEach(track => track.stop());
            setAudioStream(null);
          }
          
          return;
        }

        // Generate AI response and speak it with TTS
        console.log('🤖 processVoiceToTranscript: Generating AI response...');
        await generateContextualResponseWithTTS(transcript);
      } else {
        throw new Error('Failed to transcribe voice message');
      }
    } catch (error) {
      console.error('Failed to process voice message:', error);
      setError('Failed to process voice message. Please try again.');
    } finally {
      setIsLoading(false);
      setIsProcessingVoice(false); // Release processing lock
    }
  }, [conversationId, currentUserId, civilizationId, isProcessingVoice]);

  // Generate AI response and speak it with TTS
  const generateContextualResponseWithTTS = useCallback(async (userMessage: string) => {
    try {
      console.log('🤖 generateContextualResponseWithTTS: Starting with message:', userMessage);
      setCurrentSpeaker('character');
      
      console.log('🚀 generateContextualResponseWithTTS: Calling AI service...');
      console.log('📊 generateContextualResponseWithTTS: Conversation history length:', messages.length);
      
      // Filter out any messages from the AI responding to itself - STRICT FILTERING
      const filteredMessages = messages.filter(msg => {
        // ONLY include user messages - NO character messages to prevent feedback
        return msg.senderType === 'player';
      });
      
      console.log('📊 generateContextualResponseWithTTS: Filtered history length:', filteredMessages.length);
      
      // Enhanced game context for better AI responses
      const enhancedGameContext = {
        ...gameContext,
        currentCivilization: civilizationId,
        availableCivilizations: gameContext?.availableCivilizations || ['Terran Federation', 'Andorian Empire', 'Vulcan Republic'],
        currentSector: gameContext?.currentSector || 'Alpha Quadrant',
        gameState: {
          turn: gameContext?.turn || 1,
          resources: gameContext?.playerResources || {},
          recentEvents: gameContext?.recentEvents || []
        }
      };
      
      console.log('🎮 generateContextualResponseWithTTS: Enhanced game context:', enhancedGameContext);
      
      const response = await fetch('http://localhost:4000/api/ai/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: `${userMessage}\n\n[VOICE MODE: Provide a concise, informative response. Use 1-2 sentences to give key information. Be conversational and direct while remaining clear and engaging.]`,
          character: {
            id: character.id,
            name: character.name,
            role: character.role,
            department: character.department,
            personality: character.personality
          },
          conversationHistory: filteredMessages.slice(-5).map(msg => ({
            role: msg.senderType === 'player' ? 'user' : 'assistant',
            content: msg.content,
            timestamp: msg.timestamp,
            senderId: msg.senderId,
            senderName: msg.senderName
          })),
          context: {
            civilizationId,
            conversationId,
            gameContext: enhancedGameContext,
            currentTime: new Date().toISOString()
          },
          options: {
            maxTokens: 4000,
            temperature: 0.7,
            model: 'llama3.2:1b'
          }
        })
      });

      let aiResponse = '';
      
      console.log('📡 generateContextualResponseWithTTS: AI response status:', response.status);
      
      if (response.ok) {
        const data = await response.json();
        aiResponse = data.content;
        console.log('✅ generateContextualResponseWithTTS: Got AI response:', aiResponse.substring(0, 100) + '...');
      } else {
        // AI service failed - throw error to be handled by caller
        const errorText = await response.text();
        console.error('❌ generateContextualResponseWithTTS: AI service failed:', response.status, errorText);
        throw new Error(`AI service failed with status ${response.status}: ${errorText}`);
      }
      
      // Add AI response to messages
      const characterMessage: ConversationMessage = {
        id: `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        conversationId,
        senderId: character.id,
        senderName: character.name,
        senderType: 'character',
        content: aiResponse,
        messageType: 'voice',
        timestamp: new Date(),
        metadata: {
          characterMood: character.personality?.currentMood || 'neutral'
        }
      };
      
      setMessages(prev => [...prev, characterMessage]);
      
      // Save to backend
      try {
        await fetch('http://localhost:4000/api/whoseapp/messages', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            conversationId,
            senderId: character.id,
            senderName: character.name,
            senderType: 'character',
            content: aiResponse,
            messageType: 'voice',
            civilizationId
          })
        });
      } catch (saveError) {
        console.error('Failed to save message:', saveError);
      }
      
      // Ready message removed to prevent crashes
      
      // Speak the AI response with TTS
      console.log('🔊 generateContextualResponseWithTTS: Speaking response with TTS...');
      await speakText(aiResponse);
    } catch (error) {
      console.error('❌ Failed to generate AI response:', error);
      
      // Add error message to conversation instead of speaking fallback
      const errorMessage: ConversationMessage = {
        id: `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        conversationId,
        senderId: 'system',
        senderName: 'System',
        senderType: 'system',
        content: `AI service is currently unavailable. Please check that the AI service is running and try again.`,
        timestamp: new Date().toISOString(),
        metadata: {
          error: true,
          errorType: 'ai_service_unavailable'
        }
      };
      
      setMessages(prev => [...prev, errorMessage]);
      scrollToBottom();
    } finally {
      setCurrentSpeaker(null);
      // Clear processing lock immediately
      console.log('🔓 generateContextualResponseWithTTS: Clearing processing lock');
      setIsProcessingVoice(false);
    }
  }, [character, messages, civilizationId, conversationId, gameContext]);

  // Text-to-Speech function
  const speakText = useCallback(async (text: string) => {
    try {
      console.log('🔊 speakText: Starting TTS with text:', text.substring(0, 50) + '...');
      
      // CRITICAL: Stop voice recording completely to prevent feedback loop
      if (mediaRecorder && mediaRecorder.state === 'recording') {
        console.log('🛑 speakText: STOPPING voice recording during TTS to prevent feedback...');
        mediaRecorder.stop();
      }
      
      if ('speechSynthesis' in window) {
        try {
          const utterance = new SpeechSynthesisUtterance(text);
        
        // Configure voice for character
        const voices = speechSynthesis.getVoices();
        const preferredVoice = voices.find(voice => 
          voice.name.includes('Female') || voice.name.includes('Google')
        ) || voices[0];
        
        if (preferredVoice) {
          utterance.voice = preferredVoice;
        }
        
        utterance.rate = 1.2; // Faster speech rate
        utterance.pitch = 1.0;
        utterance.volume = 0.8;
        
        // Add event handlers for TTS completion
        utterance.onstart = () => {
          console.log('🎤 speakText: TTS started speaking');
        };
        
        utterance.onend = () => {
          console.log('✅ speakText: TTS completed');
          // No automatic restart needed with push-to-talk
        };
        
        utterance.onerror = (error) => {
          console.error('❌ speakText: TTS error:', error);
          // Resume recording even on error
          if (mediaRecorder && mediaRecorder.state === 'paused') {
            mediaRecorder.resume();
          }
        };
        
          console.log('🎤 speakText: Calling speechSynthesis.speak()');
          speechSynthesis.speak(utterance);
          console.log('✅ speakText: TTS initiated successfully');
          
          // No backup restart needed with push-to-talk
        } catch (ttsError) {
          console.error('❌ speakText: TTS error:', ttsError);
          // Continue without TTS if it fails
        }
      } else {
        console.log('⚠️ speakText: speechSynthesis not available');
      }
    } catch (error) {
      console.error('TTS error:', error);
    }
  }, [mediaRecorder]);

  // Start voice conversation with real STT/TTS
  const handleStartVoiceCall = useCallback(async () => {
    if (isCallActive || isConnecting) return;
    
    setIsConnecting(true);
    setError(null);
    setCallDuration(0);
    
    try {
      // Check microphone permissions for real voice recording
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error('Microphone access not supported in this browser');
      }

      // Test microphone access
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        stream.getTracks().forEach(track => track.stop()); // Stop test stream
      } catch (permError) {
        throw new Error('Microphone permission denied. Please allow microphone access and try again.');
      }

      // Activate voice mode with continuous listening
      setIsCallActive(true);
      setIsConnecting(false);
      setInputMode('voice');
      
      // Add system message
      const systemMessage: ConversationMessage = {
        id: `msg_${Date.now()}_system`,
        conversationId,
        senderId: 'system',
        senderName: 'System',
        senderType: 'character',
        content: `🎤 Voice conversation started with ${character.name}. Just speak naturally - I'm listening!`,
        messageType: 'system',
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, systemMessage]);
      
      // Initialize push-to-talk system
      await initializePushToTalk();
      
    } catch (err) {
      console.error('Failed to start voice call:', err);
      const errorMessage = err instanceof Error ? err.message : 'Failed to start voice call. Please check your microphone permissions.';
      setError(errorMessage);
      setIsConnecting(false);
      
      // If voice fails, switch back to text mode
      if (inputMode === 'voice') {
        setInputMode('text');
      }
    }
  }, [character, conversationId, isCallActive, isConnecting, inputMode, initializePushToTalk]);

  // End voice conversation
  const handleEndVoiceCall = useCallback(async () => {
    if (!isCallActive) return;
    
    try {
      // Stop continuous listening
      stopContinuousListening();
      
      setIsCallActive(false);
      setCallDuration(0);
      setCurrentSpeaker(null);
      setConversationState(null);
      setInputMode('text');
      
      // Add system message
      const systemMessage: ConversationMessage = {
        id: `msg_${Date.now()}_system`,
        conversationId,
        senderId: 'system',
        senderName: 'System',
        senderType: 'character',
        content: `📞 Voice conversation ended`,
        messageType: 'system',
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, systemMessage]);
    } catch (err) {
      console.error('Failed to end voice call:', err);
      setError('Failed to end voice call properly');
    }
  }, [isCallActive, conversationId, stopContinuousListening]);

  // Toggle between text and voice modes
  const handleModeToggle = useCallback(() => {
    if (inputMode === 'voice') {
      // Switch to text mode
      if (isCallActive) {
        handleEndVoiceCall();
      } else {
        setInputMode('text');
      }
    } else {
      // Switch to voice mode
      handleStartVoiceCall();
    }
  }, [inputMode, isCallActive, handleStartVoiceCall, handleEndVoiceCall]);

  // Auto-start voice call if initialInputMode is 'voice'
  useEffect(() => {
    if (initialInputMode === 'voice' && !isCallActive && !isConnecting) {
      // Small delay to ensure component is fully mounted
      const timer = setTimeout(() => {
        handleStartVoiceCall();
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [initialInputMode, handleStartVoiceCall, isCallActive, isConnecting]);

  // Handle key press for text input
  const handleKeyPress = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendTextMessage();
    }
  }, [handleSendTextMessage]);

  // Format call duration
  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      height: '100%',
      background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
      color: '#ffffff'
    }}>
      {/* Header */}
      <div style={{
        padding: '16px',
        borderBottom: '1px solid rgba(78, 205, 196, 0.3)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <button
            onClick={onBack}
            style={{
              background: 'none',
              border: 'none',
              color: '#4ecdc4',
              fontSize: '18px',
              cursor: 'pointer'
            }}
          >
            ← Back
          </button>
          <div>
            <h3 style={{ margin: 0, color: '#4ecdc4' }}>
              {character.name}
            </h3>
            <div style={{ fontSize: '12px', color: '#888' }}>
              {character.role} • {character.department}
            </div>
          </div>
        </div>
        
        {/* Call status */}
        {isCallActive && (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '8px 12px',
            background: 'rgba(78, 205, 196, 0.2)',
            borderRadius: '20px',
            fontSize: '12px'
          }}>
            <div style={{
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              background: currentSpeaker === 'user' ? '#ff6b6b' : 
                         currentSpeaker === 'character' ? '#4ecdc4' : '#888',
              animation: currentSpeaker ? 'pulse 1s infinite' : 'none'
            }} />
            🔊 {formatDuration(callDuration)}
            {currentSpeaker === 'user' && ' • You\'re speaking'}
            {currentSpeaker === 'character' && ` • ${character.name} is speaking`}
          </div>
        )}
      </div>

      {/* Messages */}
      <div style={{
        flex: 1,
        overflowY: 'auto',
        padding: '16px'
      }}>
        {error && (
          <div style={{
            background: 'rgba(255, 107, 107, 0.2)',
            border: '1px solid rgba(255, 107, 107, 0.5)',
            borderRadius: '8px',
            padding: '12px',
            marginBottom: '16px',
            color: '#ff6b6b'
          }}>
            <div style={{ fontWeight: 'bold', marginBottom: '8px' }}>
              ⚠️ Voice Call Error
            </div>
            <div style={{ marginBottom: '8px' }}>
              {error}
            </div>
            {error.includes('microphone') && (
              <div style={{ fontSize: '12px', color: '#ffaa6b' }}>
                💡 <strong>How to fix:</strong>
                <br />• Click the microphone icon in your browser's address bar
                <br />• Select "Allow" for microphone access
                <br />• Refresh the page and try again
                <br />• Or continue using text mode below
              </div>
            )}
            <button
              onClick={() => setError(null)}
              style={{
                marginTop: '8px',
                padding: '4px 8px',
                background: 'rgba(255, 255, 255, 0.1)',
                border: '1px solid rgba(255, 255, 255, 0.3)',
                borderRadius: '4px',
                color: '#fff',
                cursor: 'pointer',
                fontSize: '12px'
              }}
            >
              Dismiss
            </button>
          </div>
        )}

        {isLoading && messages.length === 0 ? (
          <div style={{ textAlign: 'center', color: '#888' }}>
            Loading conversation...
          </div>
        ) : (
          messages.map((message) => (
            <div
              key={message.id}
              style={{
                marginBottom: '12px',
                display: 'flex',
                justifyContent: message.senderType === 'player' ? 'flex-end' : 
                                message.senderType === 'system' ? 'center' : 'flex-start'
              }}
            >
              <div style={{
                maxWidth: '70%',
                padding: '12px 16px',
                borderRadius: '12px',
                background: message.messageType === 'system' 
                  ? 'rgba(136, 136, 136, 0.2)'
                  : message.senderType === 'player' 
                    ? 'linear-gradient(135deg, #4ecdc4, #44a08d)'
                    : 'rgba(255, 255, 255, 0.1)',
                color: message.senderType === 'player' ? '#000' : 
                       message.senderType === 'system' ? '#4ecdc4' : '#fff',
                textAlign: message.messageType === 'system' ? 'center' : 'left'
              }}>
                {message.messageType !== 'system' && (
                  <div style={{ 
                    fontSize: '11px', 
                    opacity: 0.7, 
                    marginBottom: '4px',
                    fontWeight: 'bold'
                  }}>
                    {message.senderName}
                  </div>
                )}
                <div style={{ fontSize: '14px' }}>
                  {message.content}
                </div>
                <div style={{ 
                  fontSize: '11px', 
                  opacity: 0.7, 
                  marginTop: '4px',
                  textAlign: 'right'
                }}>
                  {message.timestamp.toLocaleTimeString()}
                  {message.messageType === 'voice' && ' 🎤'}
                </div>
              </div>
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div style={{
        padding: '16px',
        borderTop: '1px solid rgba(78, 205, 196, 0.3)',
        background: 'rgba(0, 0, 0, 0.2)'
      }}>
        {/* Mode indicator */}
        <div style={{
          marginBottom: '12px',
          textAlign: 'center',
          fontSize: '12px',
          color: '#888'
        }}>
          {inputMode === 'voice' 
            ? (isCallActive 
                ? `🎙️ Voice conversation active • ${currentSpeaker === 'user' ? 'Speak now' : 'Listening to ' + character.name}`
                : '🎙️ Voice mode • Click toggle to start conversation'
              )
            : '💬 Text mode • Type your message or switch to voice'
          }
        </div>

        <div style={{
          display: 'flex',
          gap: '12px',
          alignItems: 'flex-end'
        }}>
          {/* Text Input (only show in text mode) */}
          {inputMode === 'text' && (
            <div style={{ flex: 1 }}>
              <textarea
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder={`Message ${character.name}...`}
                disabled={isLoading}
                style={{
                  width: '100%',
                  minHeight: '40px',
                  maxHeight: '120px',
                  padding: '12px',
                  borderRadius: '8px',
                  border: '1px solid rgba(78, 205, 196, 0.3)',
                  background: 'rgba(255, 255, 255, 0.1)',
                  color: '#ffffff',
                  fontSize: '14px',
                  resize: 'vertical',
                  fontFamily: 'inherit'
                }}
              />
            </div>
          )}

          {/* Voice status (only show in voice mode) */}
          {inputMode === 'voice' && (
            <div style={{ 
              flex: 1, 
              textAlign: 'center',
              padding: '20px',
              border: error ? '2px dashed rgba(255, 107, 107, 0.5)' : '2px dashed rgba(78, 205, 196, 0.3)',
              borderRadius: '8px',
              background: error ? 'rgba(255, 107, 107, 0.1)' : 
                         isCallActive ? 'rgba(78, 205, 196, 0.1)' : 'rgba(255, 255, 255, 0.05)'
            }}>
              {error ? (
                <div style={{ color: '#ff6b6b' }}>
                  <div style={{ fontSize: '24px', marginBottom: '8px' }}>❌</div>
                  <div>Voice call failed</div>
                  <div style={{ fontSize: '12px', marginTop: '8px', color: '#888' }}>
                    Use text mode below or fix microphone permissions
                  </div>
                </div>
              ) : isConnecting ? (
                <div style={{ color: '#4ecdc4' }}>🔄 Connecting...</div>
              ) : isCallActive ? (
                <div>
                  <div style={{ fontSize: '24px', marginBottom: '8px' }}>
                    {currentSpeaker === 'character' ? '🔊' : 
                     isListening ? '🎙️' : 
                     isLoading ? '🔄' : '👂'}
                  </div>
                  <div style={{ 
                    color: currentSpeaker === 'character' ? '#4ecdc4' : 
                           isListening ? '#4ecdc4' : 
                           isLoading ? '#ffa500' : '#4ecdc4', 
                    marginBottom: '12px',
                    textAlign: 'center'
                  }}>
                    {currentSpeaker === 'character' ? `${character.name} is speaking...` :
                     isLoading ? 'Processing your voice...' :
                     isListening ? 'Listening... Just speak naturally' :
                     'Voice conversation active'}
                  </div>
                  <div style={{
                    fontSize: '12px',
                    color: '#888',
                    textAlign: 'center',
                    fontStyle: 'italic'
                  }}>
                    {isListening ? 'No need to click anything - just talk!' :
                     currentSpeaker === 'character' ? 'AI is responding...' :
                     'Continuous voice conversation'}
                  </div>
                </div>
              ) : (
                <div style={{ color: '#888' }}>
                  <div style={{ fontSize: '24px', marginBottom: '8px' }}>🎙️</div>
                  <div>Click "Start Voice" to begin conversation</div>
                </div>
              )}
            </div>
          )}

          {/* Mode Toggle Button */}
          <button
            onClick={handleModeToggle}
            disabled={isConnecting}
            style={{
              padding: '12px 16px',
              borderRadius: '8px',
              border: '1px solid rgba(78, 205, 196, 0.5)',
              background: inputMode === 'voice' 
                ? (error ? 'rgba(255, 107, 107, 0.3)' : isCallActive ? 'rgba(255, 107, 107, 0.3)' : 'rgba(78, 205, 196, 0.3)')
                : 'rgba(255, 255, 255, 0.1)',
              color: inputMode === 'voice' 
                ? (error ? '#ff6b6b' : isCallActive ? '#ff6b6b' : '#4ecdc4') 
                : '#4ecdc4',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: 'bold',
              minWidth: '120px',
              height: '48px'
            }}
          >
            {isConnecting ? '🔄 Connecting' :
             inputMode === 'voice' 
               ? (error ? 'Switch to Text' : isCallActive ? 'End Voice' : 'Retry Voice')
               : 'Switch to Voice'
            }
          </button>

          {/* Voice Status Indicator */}
          {inputMode === 'voice' && (
            <div style={{
              padding: '8px 12px',
              borderRadius: '6px',
              background: 'rgba(78, 205, 196, 0.1)',
              border: '1px solid rgba(78, 205, 196, 0.3)',
              fontSize: '12px',
              color: '#4ecdc4',
              marginLeft: '10px'
            }}>
              {isRecording && (
                <span>🔴 Recording... (Release spacebar to send)</span>
              )}
              {isProcessingVoice && (
                <span>⏳ Processing...</span>
              )}
              {currentSpeaker === 'character' && (
                <span>🔊 Speaking...</span>
              )}
              {isListening && !isRecording && !isProcessingVoice && !currentSpeaker && (
                <span>🎤 Hold SPACEBAR to talk</span>
              )}
              {!isListening && (
                <span>⏸️ Initializing...</span>
              )}
            </div>
          )}

          {/* Send Button (only show in text mode) */}
          {inputMode === 'text' && (
            <button
              onClick={handleSendTextMessage}
              disabled={!newMessage.trim() || isLoading}
              style={{
                padding: '12px 20px',
                borderRadius: '8px',
                border: '1px solid rgba(78, 205, 196, 0.5)',
                background: newMessage.trim() && !isLoading
                  ? 'linear-gradient(135deg, #4ecdc4, #44a08d)'
                  : 'rgba(255, 255, 255, 0.1)',
                color: newMessage.trim() && !isLoading ? '#000' : '#888',
                cursor: newMessage.trim() && !isLoading ? 'pointer' : 'not-allowed',
                fontSize: '14px',
                fontWeight: 'bold',
                minWidth: '60px',
                height: '48px'
              }}
            >
              {isLoading ? '...' : 'Send'}
            </button>
          )}
        </div>
      </div>

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
      `}</style>
    </div>
  );
  
  } catch (error) {
    console.error('❌ UnifiedConversationInterface: Component error:', error);
    return (
      <div style={{ padding: '20px', textAlign: 'center', color: '#e94560' }}>
        <h3>🚨 Conversation Error</h3>
        <p>Something went wrong loading the conversation interface.</p>
        <button onClick={onBack} style={{ marginTop: '10px', padding: '8px 16px', background: '#4ecdc4', color: '#000', border: 'none', borderRadius: '4px' }}>
          ← Back to Characters
        </button>
      </div>
    );
  }
};
