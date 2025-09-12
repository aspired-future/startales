// Simplified Voice Recording Fix
// Replace the startVoiceActivityDetection function with this

const startVoiceActivityDetection = useCallback((stream: MediaStream) => {
  console.log('🎯 startVoiceActivityDetection: Starting SIMPLE recording');
  
  // Choose audio format
  let mimeType = 'audio/webm';
  if (MediaRecorder.isTypeSupported('audio/wav')) {
    mimeType = 'audio/wav';
  } else if (MediaRecorder.isTypeSupported('audio/webm;codecs=opus')) {
    mimeType = 'audio/webm;codecs=opus';
  }
  
  const recorder = new MediaRecorder(stream, { mimeType });
  let audioChunks: Blob[] = [];
  let isRecording = false;

  recorder.ondataavailable = (event) => {
    if (event.data.size > 0) {
      audioChunks.push(event.data);
      console.log('📊 Audio chunk added, size:', event.data.size);
    }
  };

  recorder.onstop = async () => {
    console.log('🛑 Recording stopped, processing...');
    
    if (audioChunks.length > 0 && !isProcessingVoice) {
      const audioBlob = new Blob(audioChunks, { type: mimeType });
      
      if (audioBlob.size > 1000) {
        console.log('📦 Processing audio blob, size:', audioBlob.size);
        await processVoiceToTranscript(audioBlob);
      }
      
      audioChunks = []; // Clear chunks
      
      // Wait before starting next recording
      setTimeout(() => {
        if (isListening && !isProcessingVoice) {
          startNextRecording();
        }
      }, 500);
    }
  };

  const startNextRecording = () => {
    if (!isRecording && !isProcessingVoice && recorder.state === 'inactive') {
      console.log('🔴 Starting new recording session');
      isRecording = true;
      recorder.start();
      
      // Auto-stop after 4 seconds
      setTimeout(() => {
        if (recorder.state === 'recording') {
          console.log('⏹️ Auto-stopping recording');
          recorder.stop();
          isRecording = false;
        }
      }, 4000);
    }
  };

  setMediaRecorder(recorder);
  
  // Start first recording
  startNextRecording();
}, [isProcessingVoice, isListening]);
