const express = require('express');
const path = require('path');
const app = express();
const PORT = 3001;

// Serve static files
app.use(express.static('public'));

// Serve the standalone WhoseApp
app.get('/', (req, res) => {
  res.send(`
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>🚀 WhoseApp Standalone Demo</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            background: linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%);
            color: white;
            min-height: 100vh;
            padding: 20px;
        }
        .container {
            max-width: 900px;
            margin: 0 auto;
            background: rgba(22, 33, 62, 0.9);
            border-radius: 15px;
            padding: 30px;
            box-shadow: 0 10px 30px rgba(0,0,0,0.3);
        }
        .header {
            text-align: center;
            margin-bottom: 30px;
            padding-bottom: 20px;
            border-bottom: 2px solid #533483;
        }
        .header h1 {
            font-size: 2.5em;
            margin-bottom: 10px;
            background: linear-gradient(45deg, #e94560, #533483);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
        }
        .status {
            background: #0f4c75;
            padding: 15px;
            border-radius: 10px;
            margin-bottom: 20px;
            border-left: 4px solid #e94560;
        }
        .character-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
            gap: 20px;
            margin-bottom: 20px;
        }
        .character-card {
            background: linear-gradient(135deg, #0f3460 0%, #533483 100%);
            border-radius: 12px;
            padding: 20px;
            border: 1px solid rgba(83, 52, 131, 0.3);
            transition: all 0.3s ease;
        }
        .character-card:hover {
            transform: translateY(-5px);
            box-shadow: 0 15px 35px rgba(233, 69, 96, 0.2);
        }
        .character-info h3 {
            color: #e94560;
            font-size: 1.3em;
            margin-bottom: 8px;
        }
        .character-info p {
            color: #ccc;
            margin-bottom: 15px;
        }
        .button-group {
            display: flex;
            gap: 12px;
        }
        button {
            padding: 12px 20px;
            border: none;
            border-radius: 8px;
            cursor: pointer;
            font-weight: bold;
            font-size: 0.9em;
            transition: all 0.3s ease;
            flex: 1;
        }
        .message-btn {
            background: linear-gradient(135deg, #0f4c75, #1e6091);
            color: white;
        }
        .message-btn:hover {
            background: linear-gradient(135deg, #1e6091, #2980b9);
            transform: translateY(-2px);
        }
        .call-btn {
            background: linear-gradient(135deg, #e94560, #c73650);
            color: white;
        }
        .call-btn:hover {
            background: linear-gradient(135deg, #c73650, #a02c40);
            transform: translateY(-2px);
        }
        .conversation {
            display: none;
            background: rgba(15, 52, 96, 0.9);
            border-radius: 12px;
            padding: 25px;
            margin-top: 20px;
            border: 1px solid #533483;
        }
        .conversation.active { display: block; }
        .conversation-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 20px;
            padding-bottom: 15px;
            border-bottom: 1px solid #533483;
        }
        .mode-toggle {
            display: flex;
            gap: 10px;
            margin-bottom: 15px;
        }
        .messages {
            height: 350px;
            overflow-y: auto;
            border: 1px solid #533483;
            padding: 15px;
            margin: 15px 0;
            background: rgba(26, 26, 46, 0.8);
            border-radius: 8px;
        }
        .message {
            margin-bottom: 12px;
            padding: 10px;
            border-radius: 8px;
            animation: fadeIn 0.3s ease;
        }
        .message.user {
            background: rgba(15, 76, 117, 0.6);
            text-align: right;
            margin-left: 20%;
        }
        .message.character {
            background: rgba(83, 52, 131, 0.6);
            margin-right: 20%;
        }
        @keyframes fadeIn {
            from { opacity: 0; transform: translateY(10px); }
            to { opacity: 1; transform: translateY(0); }
        }
        .input-area {
            display: flex;
            gap: 12px;
            align-items: center;
        }
        input[type="text"] {
            flex: 1;
            padding: 12px;
            border: 1px solid #533483;
            border-radius: 8px;
            background: rgba(26, 26, 46, 0.8);
            color: white;
            font-size: 1em;
        }
        input[type="text"]:focus {
            outline: none;
            border-color: #e94560;
            box-shadow: 0 0 10px rgba(233, 69, 96, 0.3);
        }
        .voice-controls {
            display: flex;
            gap: 12px;
            align-items: center;
            justify-content: center;
        }
        .recording {
            background: linear-gradient(135deg, #e94560, #ff6b7a) !important;
            animation: pulse 1.5s infinite;
        }
        @keyframes pulse {
            0%, 100% { transform: scale(1); opacity: 1; }
            50% { transform: scale(1.05); opacity: 0.8; }
        }
        .back-btn {
            background: linear-gradient(135deg, #533483, #6a4c93);
            color: white;
            padding: 8px 16px;
            font-size: 0.9em;
        }
        .loading {
            text-align: center;
            padding: 40px;
            color: #ccc;
        }
        .error {
            background: rgba(233, 69, 96, 0.2);
            border: 1px solid #e94560;
            padding: 15px;
            border-radius: 8px;
            margin: 10px 0;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🚀 WhoseApp Standalone Demo</h1>
            <p>Complete character communication system with voice & text</p>
        </div>
        
        <div class="status" id="status">
            <strong>🔄 Loading...</strong> Connecting to character database...
        </div>
        
        <div id="character-list">
            <h2>📋 Character Directory</h2>
            <div id="characters-container" class="loading">
                <p>🔄 Loading characters from API...</p>
            </div>
        </div>
        
        <div id="conversation" class="conversation">
            <div class="conversation-header">
                <h2 id="conversation-title">Conversation</h2>
                <button onclick="backToList()" class="back-btn">← Back to Directory</button>
            </div>
            
            <div class="mode-toggle">
                <button id="text-mode-btn" onclick="setMode('text')" class="message-btn">💬 Text Mode</button>
                <button id="voice-mode-btn" onclick="setMode('voice')" class="call-btn">🎤 Voice Mode</button>
            </div>
            
            <div id="messages" class="messages"></div>
            
            <div id="text-input-area" class="input-area">
                <input type="text" id="message-input" placeholder="Type your message..." onkeypress="handleKeyPress(event)">
                <button onclick="sendMessage()" class="message-btn">📤 Send</button>
            </div>
            
            <div id="voice-input-area" class="voice-controls" style="display: none;">
                <button id="record-btn" onclick="toggleRecording()" class="call-btn">🎤 Start Recording</button>
                <span id="voice-status">Ready to record - Click to start</span>
            </div>
        </div>
    </div>

    <script>
        let currentCharacter = null;
        let currentMode = 'text';
        let isRecording = false;
        let mediaRecorder = null;
        let audioChunks = [];
        let conversationHistory = [];

        // Update status
        function updateStatus(message, type = 'info') {
            const status = document.getElementById('status');
            const icons = { info: '🔄', success: '✅', error: '❌', warning: '⚠️' };
            status.innerHTML = \`<strong>\${icons[type]} \${message}</strong>\`;
            status.className = 'status ' + type;
        }

        // Load characters
        async function loadCharacters() {
            try {
                updateStatus('Connecting to character database...', 'info');
                console.log('🔄 Loading characters from API...');
                
                const response = await fetch('http://localhost:4000/api/characters/profiles');
                
                if (!response.ok) {
                    throw new Error(\`HTTP \${response.status}: \${response.statusText}\`);
                }
                
                const data = await response.json();
                
                if (data.success && data.characters && data.characters.length > 0) {
                    console.log(\`✅ Characters loaded: \${data.characters.length}\`);
                    updateStatus(\`Successfully loaded \${data.characters.length} characters\`, 'success');
                    displayCharacters(data.characters);
                } else {
                    throw new Error('No characters found in API response');
                }
            } catch (error) {
                console.error('❌ Error loading characters:', error);
                updateStatus(\`Failed to load characters: \${error.message}\`, 'error');
                displayError('Error connecting to character API: ' + error.message);
            }
        }

        function displayCharacters(characters) {
            const container = document.getElementById('characters-container');
            container.innerHTML = '';
            container.className = 'character-grid';
            
            characters.forEach(char => {
                const card = document.createElement('div');
                card.className = 'character-card';
                card.innerHTML = \`
                    <div class="character-info">
                        <h3>\${char.name}</h3>
                        <p><strong>\${char.title || char.department || 'Officer'}</strong></p>
                        <p>Status: \${char.whoseAppProfile?.status || 'Available'}</p>
                        <p>\${char.whoseAppProfile?.statusMessage || 'Ready for communication'}</p>
                    </div>
                    <div class="button-group">
                        <button class="message-btn" onclick="startConversation('\${char.id}', '\${char.name}', '\${char.title || char.department}', 'text')">💬 Message</button>
                        <button class="call-btn" onclick="startConversation('\${char.id}', '\${char.name}', '\${char.title || char.department}', 'voice')">📞 Call</button>
                    </div>
                \`;
                container.appendChild(card);
            });
        }

        function displayError(message) {
            const container = document.getElementById('characters-container');
            container.innerHTML = \`<div class="error">❌ \${message}</div>\`;
        }

        function startConversation(charId, charName, charTitle, mode) {
            console.log(\`🚀 Starting \${mode} conversation with \${charName}\`);
            currentCharacter = { id: charId, name: charName, title: charTitle };
            currentMode = mode;
            conversationHistory = [];
            
            document.getElementById('character-list').style.display = 'none';
            document.getElementById('conversation').classList.add('active');
            document.getElementById('conversation-title').textContent = \`\${mode === 'voice' ? '📞' : '💬'} \${charName}\`;
            
            setMode(mode);
            clearMessages();
            
            // Add welcome message
            addMessage('character', \`Hello! I'm \${charName}, \${charTitle}. How can I assist you today?\`);
        }

        function backToList() {
            document.getElementById('character-list').style.display = 'block';
            document.getElementById('conversation').classList.remove('active');
            currentCharacter = null;
            
            // Stop any ongoing recording
            if (isRecording) {
                stopRecording();
            }
        }

        function setMode(mode) {
            currentMode = mode;
            
            const textBtn = document.getElementById('text-mode-btn');
            const voiceBtn = document.getElementById('voice-mode-btn');
            const textArea = document.getElementById('text-input-area');
            const voiceArea = document.getElementById('voice-input-area');
            
            if (mode === 'text') {
                textBtn.style.background = 'linear-gradient(135deg, #0f4c75, #1e6091)';
                voiceBtn.style.background = 'linear-gradient(135deg, #533483, #6a4c93)';
                textArea.style.display = 'flex';
                voiceArea.style.display = 'none';
            } else {
                textBtn.style.background = 'linear-gradient(135deg, #533483, #6a4c93)';
                voiceBtn.style.background = 'linear-gradient(135deg, #e94560, #c73650)';
                textArea.style.display = 'none';
                voiceArea.style.display = 'flex';
            }
        }

        function handleKeyPress(event) {
            if (event.key === 'Enter') {
                sendMessage();
            }
        }

        async function sendMessage() {
            const input = document.getElementById('message-input');
            const message = input.value.trim();
            if (!message) return;
            
            addMessage('user', message);
            input.value = '';
            
            await generateResponse(message);
        }

        async function toggleRecording() {
            if (!isRecording) {
                await startRecording();
            } else {
                stopRecording();
            }
        }

        async function startRecording() {
            try {
                const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
                mediaRecorder = new MediaRecorder(stream);
                audioChunks = [];
                
                mediaRecorder.ondataavailable = (event) => {
                    audioChunks.push(event.data);
                };
                
                mediaRecorder.onstop = async () => {
                    const audioBlob = new Blob(audioChunks, { type: 'audio/wav' });
                    await processVoiceInput(audioBlob);
                };
                
                mediaRecorder.start();
                isRecording = true;
                
                document.getElementById('record-btn').textContent = '⏹️ Stop Recording';
                document.getElementById('record-btn').classList.add('recording');
                document.getElementById('voice-status').textContent = '🎤 Recording... Click to stop';
                
                console.log('🎤 Recording started');
            } catch (error) {
                console.error('❌ Failed to start recording:', error);
                document.getElementById('voice-status').textContent = '❌ Microphone access denied';
            }
        }

        function stopRecording() {
            if (mediaRecorder && isRecording) {
                mediaRecorder.stop();
                mediaRecorder.stream.getTracks().forEach(track => track.stop());
                isRecording = false;
                
                document.getElementById('record-btn').textContent = '🎤 Start Recording';
                document.getElementById('record-btn').classList.remove('recording');
                document.getElementById('voice-status').textContent = '🔄 Processing speech...';
                
                console.log('⏹️ Recording stopped');
            }
        }

        async function processVoiceInput(audioBlob) {
            try {
                console.log('🔄 Processing voice input...');
                
                const formData = new FormData();
                formData.append('audio', audioBlob, 'recording.wav');
                
                const sttResponse = await fetch('http://localhost:4000/api/stt/transcribe', {
                    method: 'POST',
                    body: formData
                });
                
                const sttData = await sttResponse.json();
                
                if (sttData.success && sttData.transcript) {
                    const transcript = sttData.transcript;
                    console.log('✅ Transcript:', transcript);
                    
                    addMessage('user', transcript);
                    document.getElementById('voice-status').textContent = '✅ Speech processed successfully';
                    
                    await generateResponse(transcript, true);
                } else {
                    console.error('❌ STT failed:', sttData);
                    document.getElementById('voice-status').textContent = '❌ Speech recognition failed';
                }
            } catch (error) {
                console.error('❌ Voice processing error:', error);
                document.getElementById('voice-status').textContent = '❌ Error processing voice';
            }
        }

        async function generateResponse(userMessage, useTTS = false) {
            try {
                console.log('🤖 Generating AI response...');
                
                const response = await fetch('http://localhost:4000/api/ai/generate', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        prompt: userMessage,
                        context: {
                            character: currentCharacter,
                            conversationHistory: conversationHistory.slice(-6),
                            gameContext: { civilization: 'terran_federation' }
                        }
                    })
                });
                
                let aiResponse = '';
                if (response.ok) {
                    const data = await response.json();
                    aiResponse = data.content;
                } else {
                    // Fallback response
                    const responses = [
                        \`I'm \${currentCharacter.name}. I understand your message about "\${userMessage}". How can I assist you further?\`,
                        \`As \${currentCharacter.title}, I'm here to help with your inquiry regarding "\${userMessage}". What would you like to know?\`,
                        \`Thank you for reaching out. I'm \${currentCharacter.name}, and I'm ready to address your concerns about "\${userMessage}".\`
                    ];
                    aiResponse = responses[Math.floor(Math.random() * responses.length)];
                }
                
                addMessage('character', aiResponse);
                
                if (useTTS && currentMode === 'voice') {
                    await speakText(aiResponse);
                    document.getElementById('voice-status').textContent = '🎤 Ready to record - Click to start';
                }
                
            } catch (error) {
                console.error('❌ AI generation error:', error);
                const fallback = \`I'm \${currentCharacter.name}. I'm having trouble processing right now, but I'm here to help. Please try again.\`;
                addMessage('character', fallback);
                
                if (useTTS && currentMode === 'voice') {
                    await speakText(fallback);
                    document.getElementById('voice-status').textContent = '🎤 Ready to record - Click to start';
                }
            }
        }

        async function speakText(text) {
            return new Promise((resolve) => {
                const utterance = new SpeechSynthesisUtterance(text);
                utterance.rate = 0.9;
                utterance.pitch = 1.0;
                utterance.volume = 0.8;
                
                utterance.onend = () => {
                    console.log('🔊 TTS finished');
                    resolve();
                };
                
                utterance.onerror = (error) => {
                    console.error('❌ TTS error:', error);
                    resolve();
                };
                
                console.log('🔊 Speaking:', text.substring(0, 50) + '...');
                speechSynthesis.speak(utterance);
            });
        }

        function addMessage(sender, text) {
            const messages = document.getElementById('messages');
            const messageDiv = document.createElement('div');
            messageDiv.className = \`message \${sender}\`;
            
            const timestamp = new Date().toLocaleTimeString();
            
            if (sender === 'user') {
                messageDiv.innerHTML = \`<strong>You</strong> <small>(\${timestamp})</small><br>\${text}\`;
            } else {
                messageDiv.innerHTML = \`<strong>\${currentCharacter.name}</strong> <small>(\${timestamp})</small><br>\${text}\`;
            }
            
            messages.appendChild(messageDiv);
            messages.scrollTop = messages.scrollHeight;
            
            // Add to conversation history
            conversationHistory.push({ sender, text, timestamp });
        }

        function clearMessages() {
            document.getElementById('messages').innerHTML = '';
            conversationHistory = [];
        }

        // Initialize
        console.log('🚀 WhoseApp Standalone Demo starting...');
        loadCharacters();
    </script>
</body>
</html>
  `);
});

console.log(\`🚀 WhoseApp Standalone Demo Server starting on port \${PORT}...\`);
app.listen(PORT, () => {
  console.log(\`✅ Server running at http://localhost:\${PORT}\`);
  console.log(\`🎯 Open your browser and go to: http://localhost:\${PORT}\`);
  console.log(\`📱 This bypasses all game system interceptions!\`);
});
