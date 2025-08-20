// Communication Hub Demo Page
function getCommunicationDemo() {
  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Communication Hub - StarTales Demo</title>
  <link href="https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700&family=Roboto:wght@300;400;700&display=swap" rel="stylesheet">
  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }

    body {
      font-family: 'Roboto', sans-serif;
      background: linear-gradient(135deg, #0a0a0a 0%, #1a1a2e 50%, #16213e 100%);
      color: #e0e0e0;
      min-height: 100vh;
      overflow-x: hidden;
    }

    .container {
      max-width: 1400px;
      margin: 0 auto;
      padding: 20px;
    }

    .header {
      text-align: center;
      margin-bottom: 30px;
      padding: 20px;
      background: rgba(255, 255, 255, 0.05);
      border-radius: 15px;
      border: 1px solid rgba(187, 134, 252, 0.3);
    }

    .header h1 {
      font-family: 'Orbitron', monospace;
      font-size: 2.5rem;
      background: linear-gradient(45deg, #bb86fc, #03dac6);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      margin-bottom: 10px;
    }

    .tabs {
      display: flex;
      justify-content: center;
      margin-bottom: 30px;
      background: rgba(255, 255, 255, 0.05);
      border-radius: 10px;
      padding: 5px;
      border: 1px solid rgba(255, 255, 255, 0.1);
    }

    .tab {
      background: none;
      border: none;
      color: #a0a0a0;
      padding: 12px 24px;
      cursor: pointer;
      border-radius: 8px;
      transition: all 0.3s ease;
      font-size: 0.9rem;
      font-weight: 500;
    }

    .tab.active {
      background: linear-gradient(45deg, #bb86fc, #03dac6);
      color: #000;
      font-weight: 700;
    }

    .tab:hover:not(.active) {
      background: rgba(255, 255, 255, 0.1);
      color: #e0e0e0;
    }

    .tab-content {
      display: none;
      animation: fadeIn 0.3s ease-in;
    }

    .tab-content.active {
      display: block;
    }

    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(10px); }
      to { opacity: 1; transform: translateY(0); }
    }

    .main-grid {
      display: grid;
      grid-template-columns: 300px 1fr 300px;
      gap: 20px;
      margin-bottom: 20px;
    }

    .panel {
      background: rgba(255, 255, 255, 0.05);
      padding: 20px;
      border-radius: 15px;
      border: 1px solid rgba(255, 255, 255, 0.1);
      backdrop-filter: blur(10px);
    }

    .panel h2 {
      color: #bb86fc;
      margin-bottom: 15px;
      font-family: 'Orbitron', monospace;
      font-size: 1.2rem;
    }

    .contact-list {
      max-height: 400px;
      overflow-y: auto;
    }

    .contact-item {
      background: rgba(255, 255, 255, 0.05);
      padding: 12px;
      margin: 8px 0;
      border-radius: 8px;
      border: 1px solid rgba(255, 255, 255, 0.1);
      cursor: pointer;
      transition: all 0.3s ease;
      display: flex;
      align-items: center;
      gap: 12px;
    }

    .contact-item:hover {
      border-color: #03dac6;
      background: rgba(3, 218, 198, 0.1);
      transform: translateY(-2px);
    }

    .contact-item.active {
      border-color: #bb86fc;
      background: rgba(187, 134, 252, 0.1);
    }

    .contact-avatar {
      width: 40px;
      height: 40px;
      border-radius: 50%;
      background: linear-gradient(45deg, #bb86fc, #03dac6);
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: bold;
      color: #000;
    }

    .contact-info h3 {
      font-size: 0.9rem;
      margin-bottom: 2px;
    }

    .contact-info p {
      font-size: 0.8rem;
      color: #a0a0a0;
    }

    .status-indicator {
      width: 8px;
      height: 8px;
      border-radius: 50%;
      margin-left: auto;
    }

    .status-online { background: #4caf50; }
    .status-busy { background: #ff9800; }
    .status-away { background: #f44336; }

    .chat-panel {
      display: flex;
      flex-direction: column;
      height: 600px;
    }

    .chat-header {
      background: rgba(255, 255, 255, 0.05);
      padding: 15px;
      border-radius: 10px 10px 0 0;
      border-bottom: 1px solid rgba(255, 255, 255, 0.1);
    }

    .chat-messages {
      flex: 1;
      overflow-y: auto;
      padding: 20px;
      background: rgba(0, 0, 0, 0.2);
    }

    .message {
      margin-bottom: 15px;
      max-width: 80%;
    }

    .message.sent {
      margin-left: auto;
      text-align: right;
    }

    .message.received {
      margin-right: auto;
    }

    .message-content {
      background: rgba(187, 134, 252, 0.2);
      padding: 10px 15px;
      border-radius: 15px;
      margin-bottom: 5px;
    }

    .message.received .message-content {
      background: rgba(3, 218, 198, 0.2);
    }

    .message-time {
      font-size: 0.7rem;
      color: #a0a0a0;
    }

    .voice-indicator {
      color: #03dac6;
      font-size: 0.8rem;
      margin-left: 5px;
    }

    .chat-input {
      display: flex;
      gap: 10px;
      padding: 15px;
      background: rgba(255, 255, 255, 0.05);
      border-radius: 0 0 10px 10px;
    }

    .chat-input input {
      flex: 1;
      background: rgba(255, 255, 255, 0.1);
      border: 1px solid rgba(255, 255, 255, 0.2);
      border-radius: 25px;
      padding: 10px 15px;
      color: #e0e0e0;
      font-size: 0.9rem;
    }

    .chat-input input:focus {
      outline: none;
      border-color: #bb86fc;
    }

    .btn {
      background: linear-gradient(45deg, #bb86fc, #03dac6);
      border: none;
      color: #000;
      padding: 10px 20px;
      border-radius: 25px;
      cursor: pointer;
      font-weight: 600;
      transition: all 0.3s ease;
      font-size: 0.9rem;
    }

    .btn:hover {
      transform: translateY(-2px);
      box-shadow: 0 5px 15px rgba(187, 134, 252, 0.4);
    }

    .btn.secondary {
      background: rgba(255, 255, 255, 0.1);
      color: #e0e0e0;
    }

    .btn.voice {
      background: linear-gradient(45deg, #03dac6, #bb86fc);
      border-radius: 50%;
      width: 45px;
      height: 45px;
      padding: 0;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .settings-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 20px;
    }

    .setting-group {
      background: rgba(255, 255, 255, 0.05);
      padding: 20px;
      border-radius: 10px;
      border: 1px solid rgba(255, 255, 255, 0.1);
    }

    .setting-group h3 {
      color: #bb86fc;
      margin-bottom: 15px;
      font-size: 1.1rem;
    }

    .setting-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 10px;
    }

    .setting-item label {
      font-size: 0.9rem;
      color: #e0e0e0;
    }

    .toggle {
      position: relative;
      width: 50px;
      height: 25px;
      background: rgba(255, 255, 255, 0.2);
      border-radius: 25px;
      cursor: pointer;
      transition: all 0.3s ease;
    }

    .toggle.active {
      background: linear-gradient(45deg, #bb86fc, #03dac6);
    }

    .toggle::after {
      content: '';
      position: absolute;
      width: 21px;
      height: 21px;
      background: white;
      border-radius: 50%;
      top: 2px;
      left: 2px;
      transition: all 0.3s ease;
    }

    .toggle.active::after {
      transform: translateX(25px);
    }

    .language-select {
      background: rgba(255, 255, 255, 0.1);
      border: 1px solid rgba(255, 255, 255, 0.2);
      border-radius: 5px;
      padding: 8px;
      color: #e0e0e0;
      font-size: 0.9rem;
    }

    .stats-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 20px;
      margin-bottom: 30px;
    }

    .stat-card {
      background: rgba(255, 255, 255, 0.05);
      padding: 20px;
      border-radius: 10px;
      border: 1px solid rgba(255, 255, 255, 0.1);
      text-align: center;
    }

    .stat-value {
      font-size: 2rem;
      font-weight: bold;
      color: #03dac6;
      margin-bottom: 5px;
    }

    .stat-label {
      font-size: 0.9rem;
      color: #a0a0a0;
    }

    .log-container {
      background: rgba(0, 0, 0, 0.3);
      border-radius: 10px;
      padding: 20px;
      max-height: 400px;
      overflow-y: auto;
    }

    .log-entry {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 8px 0;
      border-bottom: 1px solid rgba(255, 255, 255, 0.1);
    }

    .log-entry:last-child {
      border-bottom: none;
    }

    .log-event {
      font-size: 0.9rem;
    }

    .log-time {
      font-size: 0.8rem;
      color: #a0a0a0;
    }

    .log-type {
      padding: 2px 8px;
      border-radius: 12px;
      font-size: 0.7rem;
      font-weight: bold;
    }

    .log-type.system { background: rgba(187, 134, 252, 0.3); color: #bb86fc; }
    .log-type.message { background: rgba(3, 218, 198, 0.3); color: #03dac6; }
    .log-type.voice { background: rgba(255, 152, 0, 0.3); color: #ff9800; }
    .log-type.emergency { background: rgba(244, 67, 54, 0.3); color: #f44336; }

    .no-contact {
      text-align: center;
      color: #a0a0a0;
      padding: 40px 20px;
    }

    .loading {
      text-align: center;
      padding: 20px;
      color: #a0a0a0;
    }

    .message-notification {
      position: fixed;
      top: 20px;
      right: 20px;
      background: linear-gradient(45deg, #bb86fc, #03dac6);
      color: #000;
      padding: 15px 20px;
      border-radius: 10px;
      font-weight: 600;
      z-index: 1000;
      transform: translateX(400px);
      transition: all 0.3s ease;
    }

    .message-notification.show {
      transform: translateX(0);
    }

    @media (max-width: 768px) {
      .main-grid {
        grid-template-columns: 1fr;
        gap: 15px;
      }
      
      .header h1 {
        font-size: 2rem;
      }
      
      .tabs {
        flex-wrap: wrap;
      }
      
      .tab {
        padding: 8px 16px;
        font-size: 0.8rem;
      }
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>🌌 Communication Hub</h1>
      <p>Real-time voice and text communication across the galaxy with universal translation</p>
    </div>

    <div class="tabs">
      <button class="tab active" onclick="switchTab('voice')">🎙️ Voice Comm</button>
      <button class="tab" onclick="switchTab('channels')">📡 Channels</button>
      <button class="tab" onclick="switchTab('settings')">⚙️ Settings</button>
      <button class="tab" onclick="switchTab('statistics')">📊 Statistics</button>
      <button class="tab" onclick="switchTab('logs')">📋 Logs</button>
    </div>

    <!-- Voice Communication Tab -->
    <div id="voice-tab" class="tab-content active">
      <div class="main-grid">
        <!-- Contacts Panel -->
        <div class="panel">
          <h2>👥 Contacts</h2>
          <div class="contact-list" id="contactList">
            <div class="loading">Loading contacts...</div>
          </div>
        </div>

        <!-- Chat Panel -->
        <div class="panel">
          <div class="chat-panel">
            <div class="chat-header" id="chatHeader">
              <div class="no-contact">Select a contact to start communicating</div>
            </div>
            <div class="chat-messages" id="chatMessages">
              <div class="no-contact">
                <p>🌌 Welcome to the Communication Hub</p>
                <p>Select a contact from the left panel to begin a conversation.</p>
                <p>Features available:</p>
                <ul style="text-align: left; display: inline-block;">
                  <li>Real-time voice communication</li>
                  <li>Text messaging with voice-to-text</li>
                  <li>Universal language translation</li>
                  <li>Secure encrypted channels</li>
                </ul>
              </div>
            </div>
            <div class="chat-input" id="chatInput" style="display: none;">
              <input type="text" id="messageInput" placeholder="Type your message..." onkeypress="handleKeyPress(event)">
              <button class="btn voice" onclick="toggleVoiceRecording()" id="voiceBtn" title="Voice Message">🎤</button>
              <button class="btn" onclick="sendMessage()">Send</button>
            </div>
          </div>
        </div>

        <!-- Settings Panel -->
        <div class="panel">
          <h2>⚙️ Communication Settings</h2>
          
          <div class="setting-group">
            <h3>🌐 Universal Translation</h3>
            <div class="setting-item">
              <label>Your Language:</label>
              <select class="language-select" id="myLanguage">
                <option value="en">Terran Standard</option>
                <option value="zh">Sino-Terran</option>
                <option value="es">Hispanic Standard</option>
                <option value="vg">Vegan Standard</option>
                <option value="ct">Centauri</option>
              </select>
            </div>
            <div class="setting-item">
              <label>Auto-translate:</label>
              <div class="toggle active" onclick="toggleSetting(this)"></div>
            </div>
          </div>

          <div class="setting-group">
            <h3>🎙️ Voice Settings</h3>
            <div class="setting-item">
              <label>Voice Recognition:</label>
              <div class="toggle active" onclick="toggleSetting(this)"></div>
            </div>
            <div class="setting-item">
              <label>Auto-transcription:</label>
              <div class="toggle active" onclick="toggleSetting(this)"></div>
            </div>
            <div class="setting-item">
              <label>Noise Reduction:</label>
              <div class="toggle active" onclick="toggleSetting(this)"></div>
            </div>
          </div>

          <div class="setting-group">
            <h3>🔒 Security</h3>
            <div class="setting-item">
              <label>Encryption:</label>
              <span style="color: #03dac6;">Quantum</span>
            </div>
            <div class="setting-item">
              <label>Emergency Alerts:</label>
              <div class="toggle active" onclick="toggleSetting(this)"></div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Channels Tab -->
    <div id="channels-tab" class="tab-content">
      <div class="stats-grid">
        <div class="stat-card">
          <div class="stat-value" id="activeChannels">-</div>
          <div class="stat-label">Active Channels</div>
        </div>
        <div class="stat-card">
          <div class="stat-value" id="connectedUsers">-</div>
          <div class="stat-label">Connected Users</div>
        </div>
        <div class="stat-card">
          <div class="stat-value" id="voiceCallsActive">-</div>
          <div class="stat-label">Voice Calls Active</div>
        </div>
      </div>

      <div class="panel">
        <h2>📡 Communication Channels</h2>
        <div id="channelsList">
          <div class="loading">Loading channels...</div>
        </div>
      </div>
    </div>

    <!-- Settings Tab -->
    <div id="settings-tab" class="tab-content">
      <div class="settings-grid">
        <div class="setting-group">
          <h3>🌐 Language & Translation</h3>
          <div class="setting-item">
            <label>Primary Language:</label>
            <select class="language-select">
              <option value="en">Terran Standard (English)</option>
              <option value="zh">Sino-Terran (中文)</option>
              <option value="es">Hispanic Standard (Español)</option>
              <option value="ar">Arabic Federation (العربية)</option>
              <option value="hi">Indo-Terran (हिन्दी)</option>
              <option value="ru">Slavic Union (Русский)</option>
              <option value="vg">Vegan Standard (Vεγαη)</option>
              <option value="ct">Centauri (Çεηταυrι)</option>
            </select>
          </div>
          <div class="setting-item">
            <label>Universal Translation:</label>
            <div class="toggle active" onclick="toggleSetting(this)"></div>
          </div>
          <div class="setting-item">
            <label>Real-time Translation:</label>
            <div class="toggle active" onclick="toggleSetting(this)"></div>
          </div>
        </div>

        <div class="setting-group">
          <h3>🎙️ Voice Communication</h3>
          <div class="setting-item">
            <label>Voice Recognition:</label>
            <div class="toggle active" onclick="toggleSetting(this)"></div>
          </div>
          <div class="setting-item">
            <label>Text-to-Speech:</label>
            <div class="toggle active" onclick="toggleSetting(this)"></div>
          </div>
          <div class="setting-item">
            <label>Voice Profile:</label>
            <select class="language-select">
              <option value="command">Command</option>
              <option value="diplomatic">Diplomatic</option>
              <option value="casual">Casual</option>
              <option value="emergency">Emergency</option>
            </select>
          </div>
        </div>

        <div class="setting-group">
          <h3>🔒 Security & Privacy</h3>
          <div class="setting-item">
            <label>Encryption Level:</label>
            <select class="language-select">
              <option value="standard">Standard</option>
              <option value="military">Military-Grade</option>
              <option value="quantum" selected>Quantum</option>
            </select>
          </div>
          <div class="setting-item">
            <label>Message Logging:</label>
            <div class="toggle active" onclick="toggleSetting(this)"></div>
          </div>
          <div class="setting-item">
            <label>Emergency Broadcasts:</label>
            <div class="toggle active" onclick="toggleSetting(this)"></div>
          </div>
        </div>

        <div class="setting-group">
          <h3>🔔 Notifications</h3>
          <div class="setting-item">
            <label>Message Alerts:</label>
            <div class="toggle active" onclick="toggleSetting(this)"></div>
          </div>
          <div class="setting-item">
            <label>Voice Call Alerts:</label>
            <div class="toggle active" onclick="toggleSetting(this)"></div>
          </div>
          <div class="setting-item">
            <label>System Notifications:</label>
            <div class="toggle active" onclick="toggleSetting(this)"></div>
          </div>
        </div>
      </div>

      <div style="text-align: center; margin-top: 30px;">
        <button class="btn" onclick="saveSettings()">💾 Save Settings</button>
        <button class="btn secondary" onclick="resetSettings()">🔄 Reset to Defaults</button>
      </div>
    </div>

    <!-- Statistics Tab -->
    <div id="statistics-tab" class="tab-content">
      <div class="stats-grid">
        <div class="stat-card">
          <div class="stat-value" id="totalMessages">-</div>
          <div class="stat-label">Total Messages</div>
        </div>
        <div class="stat-card">
          <div class="stat-value" id="voiceMessages">-</div>
          <div class="stat-label">Voice Messages</div>
        </div>
        <div class="stat-card">
          <div class="stat-value" id="textMessages">-</div>
          <div class="stat-label">Text Messages</div>
        </div>
        <div class="stat-card">
          <div class="stat-value" id="translatedMessages">-</div>
          <div class="stat-label">Translated Messages</div>
        </div>
        <div class="stat-card">
          <div class="stat-value" id="systemUptime">-</div>
          <div class="stat-label">System Uptime</div>
        </div>
        <div class="stat-card">
          <div class="stat-value" id="bandwidthUsage">-</div>
          <div class="stat-label">Bandwidth Usage</div>
        </div>
      </div>

      <div class="panel">
        <h2>📊 Communication Analytics</h2>
        <div style="text-align: center; padding: 40px;">
          <p style="color: #a0a0a0; margin-bottom: 20px;">Real-time communication statistics and performance metrics</p>
          <button class="btn" onclick="loadStatistics()">🔄 Refresh Statistics</button>
        </div>
      </div>
    </div>

    <!-- Logs Tab -->
    <div id="logs-tab" class="tab-content">
      <div class="panel">
        <h2>📋 Communication Logs</h2>
        <div class="controls" style="margin-bottom: 20px; text-align: center;">
          <button class="btn" onclick="loadLogs()">🔄 Refresh Logs</button>
          <button class="btn secondary" onclick="clearLogs()">🗑️ Clear Logs</button>
        </div>
        <div class="log-container" id="logsContainer">
          <div class="loading">Loading communication logs...</div>
        </div>
      </div>
    </div>
  </div>

  <div class="message-notification" id="notification"></div>

  <script>
    let currentContact = null;
    let isVoiceRecording = false;
    let currentCall = null;

    // Initialize the communication system
    document.addEventListener('DOMContentLoaded', function() {
      loadContacts();
      loadChannels();
      loadStatistics();
      loadLogs();
      
      // Update system status every 30 seconds
      setInterval(updateSystemStatus, 30000);
    });

    function switchTab(tabName) {
      // Hide all tab contents
      const tabContents = document.querySelectorAll('.tab-content');
      tabContents.forEach(content => {
        content.classList.remove('active');
      });

      // Remove active class from all tabs
      const tabs = document.querySelectorAll('.tab');
      tabs.forEach(tab => {
        tab.classList.remove('active');
      });

      // Show selected tab content
      document.getElementById(tabName + '-tab').classList.add('active');
      
      // Add active class to clicked tab
      event.target.classList.add('active');

      // Load data for specific tabs
      if (tabName === 'channels') {
        loadChannels();
        updateSystemStatus();
      } else if (tabName === 'statistics') {
        loadStatistics();
      } else if (tabName === 'logs') {
        loadLogs();
      }
    }

    async function loadContacts() {
      try {
        const response = await fetch('/api/communication/contacts');
        const data = await response.json();
        
        const contactList = document.getElementById('contactList');
        contactList.innerHTML = '';
        
        data.contacts.forEach(contact => {
          const contactEl = document.createElement('div');
          contactEl.className = 'contact-item';
          contactEl.dataset.contactId = contact.id;
          contactEl.onclick = () => selectContact(contact.id);
          
          contactEl.innerHTML = 
            '<div class="contact-avatar">' + contact.avatar + '</div>' +
            '<div class="contact-info">' +
              '<h3>' + contact.name + '</h3>' +
              '<p>' + contact.title + '</p>' +
              '<p style="font-size: 0.7rem;">' + contact.location + '</p>' +
            '</div>' +
            '<div class="status-indicator status-' + contact.status + '"></div>';
          
          contactList.appendChild(contactEl);
        });
      } catch (error) {
        console.error('Failed to load contacts:', error);
        showNotification('Failed to load contacts', 'error');
      }
    }

    async function selectContact(contactId) {
      try {
        // Update UI
        document.querySelectorAll('.contact-item').forEach(item => {
          item.classList.remove('active');
        });
        document.querySelector('[data-contact-id="' + contactId + '"]').classList.add('active');
        
        currentContact = contactId;
        
        // Load messages
        const response = await fetch('/api/communication/contacts/' + contactId + '/messages');
        const data = await response.json();
        
        // Update chat header
        const chatHeader = document.getElementById('chatHeader');
        chatHeader.innerHTML = 
          '<div style="display: flex; align-items: center; gap: 15px;">' +
            '<div class="contact-avatar">' + data.contact.avatar + '</div>' +
            '<div>' +
              '<h3>' + data.contact.name + '</h3>' +
              '<p style="color: #a0a0a0; font-size: 0.8rem;">' + data.contact.title + ' • ' + data.contact.location + '</p>' +
              '<p style="color: #03dac6; font-size: 0.7rem;">🔒 ' + data.contact.clearanceLevel.toUpperCase() + ' • Status: ' + data.contact.status.toUpperCase() + '</p>' +
            '</div>' +
            '<div style="margin-left: auto;">' +
              '<button class="btn voice" onclick="startVoiceCall()" title="Start Voice Call">📞</button>' +
            '</div>' +
          '</div>';
        
        // Load messages
        const chatMessages = document.getElementById('chatMessages');
        chatMessages.innerHTML = '';
        
        // Add system status message
        const systemMsg = document.createElement('div');
        systemMsg.className = 'message received';
        systemMsg.innerHTML = 
          '<div class="message-content">🌐 Secure channel established with ' + data.contact.name + '. Encryption: Quantum. All communications are monitored and logged.</div>' +
          '<div class="message-time">' + new Date().toLocaleTimeString().slice(0, 5) + '</div>';
        chatMessages.appendChild(systemMsg);
        
        data.messages.forEach(msg => {
          const messageEl = document.createElement('div');
          messageEl.className = 'message ' + msg.type;
          
          const voiceIndicator = msg.isVoice ? '<span class="voice-indicator">🎤 Voice</span>' : '';
          const translatedIndicator = msg.translated ? '<span class="voice-indicator">🌐 Translated</span>' : '';
          
          messageEl.innerHTML = 
            '<div class="message-content">' + msg.content + voiceIndicator + translatedIndicator + '</div>' +
            '<div class="message-time">' + new Date(msg.timestamp).toLocaleTimeString().slice(0, 5) + '</div>';
          
          chatMessages.appendChild(messageEl);
        });
        
        // Show chat input
        document.getElementById('chatInput').style.display = 'flex';
        
        // Scroll to bottom
        chatMessages.scrollTop = chatMessages.scrollHeight;
        
      } catch (error) {
        console.error('Failed to load contact messages:', error);
        showNotification('Failed to load messages', 'error');
      }
    }

    async function sendMessage() {
      if (!currentContact) return;
      
      const messageInput = document.getElementById('messageInput');
      const content = messageInput.value.trim();
      
      if (!content) return;
      
      try {
        const response = await fetch('/api/communication/contacts/' + currentContact + '/messages', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ content, isVoice: false })
        });
        
        const result = await response.json();
        
        if (result.success) {
          // Add message to chat
          const chatMessages = document.getElementById('chatMessages');
          const messageEl = document.createElement('div');
          messageEl.className = 'message sent';
          messageEl.innerHTML = 
            '<div class="message-content">' + content + '</div>' +
            '<div class="message-time">' + new Date().toLocaleTimeString().slice(0, 5) + '</div>';
          
          chatMessages.appendChild(messageEl);
          chatMessages.scrollTop = chatMessages.scrollHeight;
          
          // Clear input
          messageInput.value = '';
          
          // Simulate response after a delay
          setTimeout(() => simulateResponse(), 2000 + Math.random() * 3000);
          
          showNotification('Message sent', 'success');
        }
      } catch (error) {
        console.error('Failed to send message:', error);
        showNotification('Failed to send message', 'error');
      }
    }

    async function simulateResponse() {
      if (!currentContact) return;
      
      try {
        const response = await fetch('/api/communication/contacts/' + currentContact + '/simulate', {
          method: 'POST'
        });
        
        const result = await response.json();
        
        if (result.success) {
          const chatMessages = document.getElementById('chatMessages');
          const messageEl = document.createElement('div');
          messageEl.className = 'message received';
          
          const voiceIndicator = result.message.isVoice ? '<span class="voice-indicator">🎤 Voice</span>' : '';
          
          messageEl.innerHTML = 
            '<div class="message-content">' + result.message.content + voiceIndicator + '</div>' +
            '<div class="message-time">' + new Date().toLocaleTimeString().slice(0, 5) + '</div>';
          
          chatMessages.appendChild(messageEl);
          chatMessages.scrollTop = chatMessages.scrollHeight;
          
          showNotification('New message received', 'info');
        }
      } catch (error) {
        console.error('Failed to simulate response:', error);
      }
    }

    function handleKeyPress(event) {
      if (event.key === 'Enter') {
        sendMessage();
      }
    }

    async function toggleVoiceRecording() {
      const voiceBtn = document.getElementById('voiceBtn');
      
      if (!isVoiceRecording) {
        // Start recording
        isVoiceRecording = true;
        voiceBtn.innerHTML = '⏹️';
        voiceBtn.style.background = 'linear-gradient(45deg, #f44336, #ff9800)';
        showNotification('Voice recording started', 'info');
        
        // Simulate recording for 3 seconds
        setTimeout(() => {
          if (isVoiceRecording) {
            toggleVoiceRecording();
            // Simulate voice message
            document.getElementById('messageInput').value = 'Voice message: "Understood, proceeding with the mission as directed."';
          }
        }, 3000);
      } else {
        // Stop recording
        isVoiceRecording = false;
        voiceBtn.innerHTML = '🎤';
        voiceBtn.style.background = 'linear-gradient(45deg, #03dac6, #bb86fc)';
        showNotification('Voice recording stopped', 'info');
      }
    }

    async function startVoiceCall() {
      if (!currentContact) return;
      
      try {
        const response = await fetch('/api/communication/voice/start', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ contactId: currentContact, quality: 'high' })
        });
        
        const result = await response.json();
        
        if (result.success) {
          currentCall = result.callId;
          showNotification('Voice call connecting...', 'info');
          
          // Simulate call connection
          setTimeout(() => {
            showNotification('Voice call connected', 'success');
            
            // Auto-end call after 30 seconds for demo
            setTimeout(() => endVoiceCall(), 30000);
          }, 2000);
        }
      } catch (error) {
        console.error('Failed to start voice call:', error);
        showNotification('Failed to start voice call', 'error');
      }
    }

    async function endVoiceCall() {
      if (!currentCall) return;
      
      try {
        const response = await fetch('/api/communication/voice/end', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ callId: currentCall })
        });
        
        const result = await response.json();
        
        if (result.success) {
          showNotification('Voice call ended. Duration: ' + Math.floor(result.duration / 60) + 'm ' + (result.duration % 60) + 's', 'info');
          currentCall = null;
        }
      } catch (error) {
        console.error('Failed to end voice call:', error);
      }
    }

    async function loadChannels() {
      try {
        const response = await fetch('/api/communication/channels');
        const data = await response.json();
        
        const channelsList = document.getElementById('channelsList');
        channelsList.innerHTML = '';
        
        data.channels.forEach(channel => {
          const channelEl = document.createElement('div');
          channelEl.className = 'contact-item';
          channelEl.style.cursor = 'pointer';
          channelEl.onclick = () => joinChannel(channel.id);
          
          const statusColor = channel.isActive ? '#4caf50' : '#f44336';
          const encryptionIcon = channel.encryption === 'quantum' ? '🔐' : channel.encryption === 'military-grade' ? '🛡️' : '🔒';
          
          channelEl.innerHTML = 
            '<div class="contact-avatar" style="background: linear-gradient(45deg, #03dac6, #bb86fc);">📡</div>' +
            '<div class="contact-info">' +
              '<h3>' + channel.name + ' ' + encryptionIcon + '</h3>' +
              '<p>' + channel.type.toUpperCase() + ' • ' + channel.participants + ' users</p>' +
              '<p style="font-size: 0.7rem; color: ' + statusColor + ';">' + (channel.isActive ? 'ACTIVE' : 'INACTIVE') + '</p>' +
            '</div>' +
            '<div class="status-indicator" style="background: ' + statusColor + ';"></div>';
          
          channelsList.appendChild(channelEl);
        });
      } catch (error) {
        console.error('Failed to load channels:', error);
      }
    }

    async function joinChannel(channelId) {
      try {
        const response = await fetch('/api/communication/channels/' + channelId + '/join', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ userId: 'demo-user' })
        });
        
        const result = await response.json();
        
        if (result.success) {
          showNotification('Joined channel: ' + result.channel.name, 'success');
          loadChannels(); // Refresh channel list
          updateSystemStatus(); // Update stats
        }
      } catch (error) {
        console.error('Failed to join channel:', error);
        showNotification('Failed to join channel', 'error');
      }
    }

    async function updateSystemStatus() {
      try {
        const response = await fetch('/api/communication/status');
        const data = await response.json();
        
        // Update channel stats
        const activeChannelsEl = document.getElementById('activeChannels');
        const connectedUsersEl = document.getElementById('connectedUsers');
        const voiceCallsActiveEl = document.getElementById('voiceCallsActive');
        
        if (activeChannelsEl) activeChannelsEl.textContent = data.activeChannels;
        if (connectedUsersEl) connectedUsersEl.textContent = data.connectedUsers.toLocaleString();
        if (voiceCallsActiveEl) voiceCallsActiveEl.textContent = data.voiceCallsActive;
      } catch (error) {
        console.error('Failed to update system status:', error);
      }
    }

    async function loadStatistics() {
      try {
        const response = await fetch('/api/communication/statistics');
        const data = await response.json();
        
        const stats = data.statistics;
        
        document.getElementById('totalMessages').textContent = stats.totalMessages.toLocaleString();
        document.getElementById('voiceMessages').textContent = stats.voiceMessages.toLocaleString();
        document.getElementById('textMessages').textContent = stats.textMessages.toLocaleString();
        document.getElementById('translatedMessages').textContent = stats.translatedMessages.toLocaleString();
        document.getElementById('systemUptime').textContent = stats.uptime.toFixed(1) + '%';
        document.getElementById('bandwidthUsage').textContent = stats.bandwidthUsage.toFixed(1) + '%';
      } catch (error) {
        console.error('Failed to load statistics:', error);
      }
    }

    async function loadLogs() {
      try {
        const response = await fetch('/api/communication/logs?limit=50');
        const data = await response.json();
        
        const logsContainer = document.getElementById('logsContainer');
        logsContainer.innerHTML = '';
        
        data.logs.forEach(log => {
          const logEl = document.createElement('div');
          logEl.className = 'log-entry';
          
          logEl.innerHTML = 
            '<div>' +
              '<span class="log-event">' + log.event + '</span>' +
              '<span class="log-type ' + log.type + '">' + log.type.toUpperCase() + '</span>' +
            '</div>' +
            '<div class="log-time">' + new Date(log.timestamp).toLocaleString() + '</div>';
          
          logsContainer.appendChild(logEl);
        });
      } catch (error) {
        console.error('Failed to load logs:', error);
      }
    }

    function toggleSetting(toggle) {
      toggle.classList.toggle('active');
    }

    function saveSettings() {
      showNotification('Settings saved successfully', 'success');
    }

    function resetSettings() {
      // Reset all toggles to default state
      document.querySelectorAll('.toggle').forEach(toggle => {
        toggle.classList.add('active');
      });
      showNotification('Settings reset to defaults', 'info');
    }

    function clearLogs() {
      document.getElementById('logsContainer').innerHTML = '<div class="loading">Logs cleared</div>';
      showNotification('Communication logs cleared', 'info');
    }

    function showNotification(message, type = 'info') {
      const notification = document.getElementById('notification');
      notification.textContent = message;
      notification.classList.add('show');
      
      setTimeout(() => {
        notification.classList.remove('show');
      }, 3000);
    }
  </script>
</body>
</html>`;
}

module.exports = { getCommunicationDemo };

