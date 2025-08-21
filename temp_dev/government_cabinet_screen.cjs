// Government & Cabinet Screen - Leadership and governance tools
function getGovernmentCabinetScreen() {
    return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Government & Cabinet - Witty Galaxy</title>
    <style>
        :root {
            --primary-bg: #0a0a0a;
            --secondary-bg: #1a1a1a;
            --accent-bg: #2a2a2a;
            --primary-text: #ffffff;
            --secondary-text: #cccccc;
            --accent-text: #00ccff;
            --success-color: #00ff88;
            --warning-color: #ffaa00;
            --danger-color: #ff4444;
            --border-color: #333333;
            --glow-color: #00ccff;
            --success-glow: #00ff88;
            --warning-glow: #ffaa00;
            --danger-glow: #ff4444;
            --leadership-color: #9966ff;
            --diplomatic-color: #66ffcc;
        }

        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            background: linear-gradient(135deg, var(--primary-bg) 0%, #1a1a2e 50%, #16213e 100%);
            color: var(--primary-text);
            min-height: 100vh;
            overflow-x: hidden;
        }

        .screen-container {
            display: flex;
            height: 100vh;
        }

        .sidebar {
            width: 280px;
            background: var(--secondary-bg);
            border-right: 1px solid var(--border-color);
            padding: 20px;
            overflow-y: auto;
        }

        .sidebar h2 {
            color: var(--leadership-color);
            margin-bottom: 20px;
            font-size: 1.2em;
            text-align: center;
            text-shadow: 0 0 10px var(--leadership-color);
        }

        .nav-item {
            display: block;
            padding: 12px 16px;
            margin: 8px 0;
            background: var(--accent-bg);
            color: var(--primary-text);
            text-decoration: none;
            border-radius: 8px;
            border: 1px solid var(--border-color);
            transition: all 0.3s ease;
            cursor: pointer;
        }

        .nav-item:hover {
            background: var(--leadership-color);
            color: var(--primary-text);
            box-shadow: 0 0 15px var(--leadership-color);
            transform: translateX(5px);
        }

        .nav-item.active {
            background: var(--leadership-color);
            color: var(--primary-text);
            box-shadow: 0 0 10px var(--leadership-color);
        }

        .main-content {
            flex: 1;
            padding: 20px;
            overflow-y: auto;
        }

        .header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 30px;
            padding-bottom: 20px;
            border-bottom: 2px solid var(--border-color);
        }

        .header h1 {
            color: var(--leadership-color);
            font-size: 2.5em;
            text-shadow: 0 0 10px var(--leadership-color);
        }

        .back-button {
            padding: 10px 20px;
            background: var(--accent-bg);
            color: var(--primary-text);
            border: 1px solid var(--border-color);
            border-radius: 8px;
            text-decoration: none;
            transition: all 0.3s ease;
        }

        .back-button:hover {
            background: var(--leadership-color);
            color: var(--primary-text);
            box-shadow: 0 0 10px var(--leadership-color);
        }

        .dashboard-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
            gap: 20px;
            margin-bottom: 30px;
        }

        .dashboard-card {
            background: var(--secondary-bg);
            border: 1px solid var(--border-color);
            border-radius: 12px;
            padding: 20px;
            box-shadow: 0 4px 15px rgba(0, 0, 0, 0.3);
            transition: all 0.3s ease;
        }

        .dashboard-card:hover {
            transform: translateY(-5px);
            box-shadow: 0 8px 25px rgba(153, 102, 255, 0.2);
            border-color: var(--leadership-color);
        }

        .card-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 15px;
        }

        .card-title {
            color: var(--leadership-color);
            font-size: 1.3em;
            font-weight: bold;
        }

        .cabinet-member {
            display: flex;
            align-items: center;
            padding: 15px;
            margin: 10px 0;
            background: var(--accent-bg);
            border-radius: 10px;
            border-left: 4px solid var(--leadership-color);
            transition: all 0.3s ease;
        }

        .cabinet-member:hover {
            background: var(--secondary-bg);
            border-left-color: var(--diplomatic-color);
            transform: translateX(5px);
        }

        .member-avatar {
            width: 60px;
            height: 60px;
            border-radius: 50%;
            background: var(--leadership-color);
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 1.5em;
            margin-right: 15px;
            box-shadow: 0 0 10px var(--leadership-color);
        }

        .member-info {
            flex: 1;
        }

        .member-name {
            font-size: 1.2em;
            font-weight: bold;
            color: var(--primary-text);
            margin-bottom: 5px;
        }

        .member-title {
            color: var(--leadership-color);
            font-weight: bold;
            margin-bottom: 3px;
        }

        .member-status {
            color: var(--secondary-text);
            font-size: 0.9em;
        }

        .approval-meter {
            width: 100%;
            height: 20px;
            background: var(--accent-bg);
            border-radius: 10px;
            overflow: hidden;
            margin: 10px 0;
            position: relative;
        }

        .approval-fill {
            height: 100%;
            background: linear-gradient(90deg, var(--danger-color) 0%, var(--warning-color) 50%, var(--success-color) 100%);
            transition: width 0.5s ease;
        }

        .approval-text {
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            font-size: 0.8em;
            font-weight: bold;
            color: var(--primary-text);
            text-shadow: 1px 1px 2px rgba(0,0,0,0.8);
        }

        .policy-item {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 12px;
            margin: 8px 0;
            background: var(--accent-bg);
            border-radius: 8px;
            border-left: 4px solid var(--diplomatic-color);
        }

        .policy-info {
            flex: 1;
        }

        .policy-status {
            padding: 4px 12px;
            border-radius: 15px;
            font-size: 0.8em;
            font-weight: bold;
        }

        .status-active { background: var(--success-color); color: var(--primary-bg); }
        .status-pending { background: var(--warning-color); color: var(--primary-bg); }
        .status-draft { background: var(--secondary-text); color: var(--primary-bg); }
        .status-review { background: var(--diplomatic-color); color: var(--primary-bg); }

        .action-buttons {
            display: flex;
            gap: 10px;
            margin-top: 20px;
            flex-wrap: wrap;
        }

        .action-btn {
            padding: 10px 20px;
            background: var(--accent-bg);
            color: var(--primary-text);
            border: 1px solid var(--border-color);
            border-radius: 8px;
            cursor: pointer;
            transition: all 0.3s ease;
            text-decoration: none;
            display: inline-block;
        }

        .action-btn:hover {
            background: var(--leadership-color);
            color: var(--primary-text);
            box-shadow: 0 0 10px var(--leadership-color);
        }

        .action-btn.primary {
            background: var(--leadership-color);
            color: var(--primary-text);
        }

        .action-btn.diplomatic {
            background: var(--diplomatic-color);
            color: var(--primary-bg);
        }

        .action-btn.success {
            background: var(--success-color);
            color: var(--primary-bg);
        }

        .action-btn.warning {
            background: var(--warning-color);
            color: var(--primary-bg);
        }

        .action-btn.danger {
            background: var(--danger-color);
            color: var(--primary-text);
        }

        .meeting-schedule {
            background: var(--accent-bg);
            border-radius: 8px;
            padding: 15px;
            margin: 10px 0;
        }

        .meeting-time {
            color: var(--diplomatic-color);
            font-weight: bold;
            margin-bottom: 5px;
        }

        .meeting-title {
            color: var(--primary-text);
            font-size: 1.1em;
            margin-bottom: 5px;
        }

        .meeting-attendees {
            color: var(--secondary-text);
            font-size: 0.9em;
        }

        @media (max-width: 768px) {
            .screen-container {
                flex-direction: column;
            }
            
            .sidebar {
                width: 100%;
                height: auto;
                order: 2;
            }
            
            .main-content {
                order: 1;
            }
            
            .dashboard-grid {
                grid-template-columns: 1fr;
            }
            
            .header h1 {
                font-size: 2em;
            }
        }

        .pulse {
            animation: pulse 2s infinite;
        }

        @keyframes pulse {
            0% { opacity: 1; }
            50% { opacity: 0.7; }
            100% { opacity: 1; }
        }

        .slide-in {
            animation: slideIn 0.5s ease-out;
        }

        @keyframes slideIn {
            from {
                opacity: 0;
                transform: translateY(20px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }
    </style>
</head>
<body>
    <div class="screen-container">
        <nav class="sidebar">
            <h2>🏛️ Government & Cabinet</h2>
            <a href="#" class="nav-item active" onclick="showSection('overview')">👑 Leadership Overview</a>
            <a href="#" class="nav-item" onclick="showSection('cabinet')">🏛️ Cabinet Members</a>
            <a href="#" class="nav-item" onclick="showSection('policies')">📋 Active Policies</a>
            <a href="#" class="nav-item" onclick="showSection('approval')">📊 Approval Ratings</a>
            <a href="#" class="nav-item" onclick="showSection('meetings')">🤝 Scheduled Meetings</a>
            <a href="#" class="nav-item" onclick="showSection('legislation')">⚖️ Pending Legislation</a>
            <a href="#" class="nav-item" onclick="showSection('diplomacy')">🌍 Diplomatic Relations</a>
            <a href="#" class="nav-item" onclick="showSection('communications')">📢 Public Communications</a>
            
            <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid var(--border-color);">
                <h3 style="color: var(--leadership-color); margin-bottom: 15px;">Quick Actions</h3>
                <a href="#" class="nav-item" onclick="executeGovernmentAction('emergency-meeting')">🚨 Emergency Meeting</a>
                <a href="#" class="nav-item" onclick="executeGovernmentAction('public-address')">📢 Public Address</a>
                <a href="#" class="nav-item" onclick="executeGovernmentAction('policy-review')">📋 Policy Review</a>
            </div>
        </nav>

        <main class="main-content">
            <div class="header">
                <h1>👑 Government Command Center</h1>
                <a href="#" class="back-button" onclick="navigateToScreen('dashboard')">← Back to Dashboard</a>
            </div>

            <div id="overview-section" class="content-section">
                <div class="dashboard-grid">
                    <div class="dashboard-card slide-in">
                        <div class="card-header">
                            <span class="card-title">📊 Overall Approval Rating</span>
                            <span class="pulse">👑</span>
                        </div>
                        <div class="approval-meter">
                            <div class="approval-fill" style="width: 73%"></div>
                            <div class="approval-text">73% Approval</div>
                        </div>
                        <div style="color: var(--success-color); margin-top: 10px;">↗ +5% from last month</div>
                        <div style="color: var(--secondary-text); font-size: 0.9em; margin-top: 5px;">
                            Based on 2.4M citizen responses across 847 systems
                        </div>
                        <div class="action-buttons">
                            <a href="#" class="action-btn primary" onclick="showSection('approval')">Detailed Analysis</a>
                            <a href="#" class="action-btn diplomatic" onclick="executeGovernmentAction('public-address')">Address Citizens</a>
                        </div>
                    </div>

                    <div class="dashboard-card slide-in">
                        <div class="card-header">
                            <span class="card-title">⚖️ Active Legislation</span>
                            <span class="pulse">📋</span>
                        </div>
                        <div class="policy-item">
                            <div class="policy-info">
                                <strong>Galactic Trade Enhancement Act</strong><br>
                                <small>Reduces trade barriers by 15%</small>
                            </div>
                            <div class="policy-status status-review">REVIEW</div>
                        </div>
                        <div class="policy-item">
                            <div class="policy-info">
                                <strong>Universal Healthcare Expansion</strong><br>
                                <small>Extends coverage to outer rim systems</small>
                            </div>
                            <div class="policy-status status-pending">PENDING</div>
                        </div>
                        <div class="policy-item">
                            <div class="policy-info">
                                <strong>Defense Modernization Bill</strong><br>
                                <small>Upgrades fleet technology standards</small>
                            </div>
                            <div class="policy-status status-active">ACTIVE</div>
                        </div>
                        <div class="action-buttons">
                            <a href="#" class="action-btn primary" onclick="showSection('legislation')">View All</a>
                            <a href="#" class="action-btn success" onclick="executeGovernmentAction('new-policy')">New Policy</a>
                        </div>
                    </div>

                    <div class="dashboard-card slide-in">
                        <div class="card-header">
                            <span class="card-title">🏛️ Cabinet Status</span>
                            <span class="pulse">👥</span>
                        </div>
                        <div class="cabinet-member">
                            <div class="member-avatar">🛡️</div>
                            <div class="member-info">
                                <div class="member-name">Admiral Sarah Chen</div>
                                <div class="member-title">Secretary of Defense</div>
                                <div class="member-status">Available • High Priority Meeting at 14:00</div>
                            </div>
                        </div>
                        <div class="cabinet-member">
                            <div class="member-avatar">💰</div>
                            <div class="member-info">
                                <div class="member-name">Dr. Marcus Webb</div>
                                <div class="member-title">Secretary of Treasury</div>
                                <div class="member-status">In Meeting • Budget Review Session</div>
                            </div>
                        </div>
                        <div class="cabinet-member">
                            <div class="member-avatar">🌍</div>
                            <div class="member-info">
                                <div class="member-name">Ambassador Zara Al-Rashid</div>
                                <div class="member-title">Secretary of State</div>
                                <div class="member-status">Available • Diplomatic Brief Ready</div>
                            </div>
                        </div>
                        <div class="action-buttons">
                            <a href="#" class="action-btn primary" onclick="showSection('cabinet')">Full Cabinet</a>
                            <a href="#" class="action-btn warning" onclick="executeGovernmentAction('emergency-meeting')">Emergency Meeting</a>
                        </div>
                    </div>

                    <div class="dashboard-card slide-in">
                        <div class="card-header">
                            <span class="card-title">🤝 Today's Schedule</span>
                            <span class="pulse">⏰</span>
                        </div>
                        <div class="meeting-schedule">
                            <div class="meeting-time">14:00 - 15:30</div>
                            <div class="meeting-title">Defense Strategy Review</div>
                            <div class="meeting-attendees">Admiral Chen, General Torres, Intelligence Director</div>
                        </div>
                        <div class="meeting-schedule">
                            <div class="meeting-time">16:00 - 17:00</div>
                            <div class="meeting-title">Economic Policy Discussion</div>
                            <div class="meeting-attendees">Treasury Secretary, Trade Minister, Economic Advisors</div>
                        </div>
                        <div class="meeting-schedule">
                            <div class="meeting-time">19:00 - 20:00</div>
                            <div class="meeting-title">Diplomatic Briefing</div>
                            <div class="meeting-attendees">Secretary of State, Ambassador Corps</div>
                        </div>
                        <div class="action-buttons">
                            <a href="#" class="action-btn primary" onclick="showSection('meetings')">Full Schedule</a>
                            <a href="#" class="action-btn diplomatic" onclick="executeGovernmentAction('schedule-meeting')">Schedule Meeting</a>
                        </div>
                    </div>
                </div>

                <div class="dashboard-grid">
                    <div class="dashboard-card slide-in">
                        <div class="card-header">
                            <span class="card-title">🌍 Diplomatic Relations</span>
                            <span class="pulse">🤝</span>
                        </div>
                        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 15px;">
                            <div style="text-align: center; padding: 15px; background: var(--accent-bg); border-radius: 8px;">
                                <div style="font-size: 2em; margin-bottom: 10px;">🟢</div>
                                <div style="color: var(--success-color); font-weight: bold;">Allied</div>
                                <div style="color: var(--secondary-text);">12 Civilizations</div>
                            </div>
                            <div style="text-align: center; padding: 15px; background: var(--accent-bg); border-radius: 8px;">
                                <div style="font-size: 2em; margin-bottom: 10px;">🟡</div>
                                <div style="color: var(--warning-color); font-weight: bold;">Neutral</div>
                                <div style="color: var(--secondary-text);">8 Civilizations</div>
                            </div>
                            <div style="text-align: center; padding: 15px; background: var(--accent-bg); border-radius: 8px;">
                                <div style="font-size: 2em; margin-bottom: 10px;">🔴</div>
                                <div style="color: var(--danger-color); font-weight: bold;">Hostile</div>
                                <div style="color: var(--secondary-text);">3 Civilizations</div>
                            </div>
                        </div>
                        <div class="action-buttons">
                            <a href="#" class="action-btn primary" onclick="showSection('diplomacy')">Diplomatic Overview</a>
                            <a href="#" class="action-btn diplomatic" onclick="executeGovernmentAction('diplomatic-mission')">New Mission</a>
                        </div>
                    </div>

                    <div class="dashboard-card slide-in">
                        <div class="card-header">
                            <span class="card-title">📢 Recent Communications</span>
                            <span class="pulse">📡</span>
                        </div>
                        <div style="max-height: 200px; overflow-y: auto;">
                            <div style="padding: 10px; margin: 5px 0; background: var(--accent-bg); border-radius: 6px; border-left: 3px solid var(--success-color);">
                                <strong>Public Address</strong> - 2 hours ago<br>
                                <small>Economic Recovery Plan announcement</small>
                            </div>
                            <div style="padding: 10px; margin: 5px 0; background: var(--accent-bg); border-radius: 6px; border-left: 3px solid var(--diplomatic-color);">
                                <strong>Diplomatic Statement</strong> - 6 hours ago<br>
                                <small>Trade agreement with Centauri Alliance</small>
                            </div>
                            <div style="padding: 10px; margin: 5px 0; background: var(--accent-bg); border-radius: 6px; border-left: 3px solid var(--warning-color);">
                                <strong>Emergency Broadcast</strong> - 1 day ago<br>
                                <small>Solar storm warning for outer systems</small>
                            </div>
                        </div>
                        <div class="action-buttons">
                            <a href="#" class="action-btn primary" onclick="showSection('communications')">All Communications</a>
                            <a href="#" class="action-btn success" onclick="executeGovernmentAction('public-address')">New Address</a>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Additional sections would be loaded dynamically -->
            <div id="cabinet-section" class="content-section" style="display: none;">
                <h2>🏛️ Cabinet Members</h2>
                <p>Detailed cabinet member profiles and management interface will be loaded here...</p>
            </div>

            <div id="policies-section" class="content-section" style="display: none;">
                <h2>📋 Policy Management</h2>
                <p>Policy creation and management interface will be loaded here...</p>
            </div>
        </main>
    </div>

    <script>
        // Government & Cabinet Screen JavaScript
        class GovernmentCabinetScreen {
            constructor() {
                this.currentSection = 'overview';
                this.initializeScreen();
                this.startRealTimeUpdates();
            }

            initializeScreen() {
                console.log('🏛️ Government & Cabinet Screen initialized');
                this.loadGovernmentData();
                this.setupEventListeners();
            }

            loadGovernmentData() {
                console.log('👑 Loading government data...');
                
                // Simulate loading approval ratings
                setTimeout(() => {
                    this.updateApprovalRatings();
                }, 2000);
            }

            updateApprovalRatings() {
                const approvalMeter = document.querySelector('.approval-fill');
                if (approvalMeter) {
                    const baseApproval = 73;
                    const fluctuation = (Math.random() - 0.5) * 4; // ±2% fluctuation
                    const newApproval = Math.max(0, Math.min(100, baseApproval + fluctuation));
                    
                    approvalMeter.style.width = newApproval + '%';
                    const approvalText = document.querySelector('.approval-text');
                    if (approvalText) {
                        approvalText.textContent = Math.round(newApproval) + '% Approval';
                    }
                    
                    console.log('📊 Approval rating updated: ' + Math.round(newApproval) + '%');
                }
            }

            startRealTimeUpdates() {
                // Simulate real-time government updates
                setInterval(() => {
                    this.updateApprovalRatings();
                    this.updateCabinetStatus();
                }, 45000); // Update every 45 seconds

                // Simulate policy status updates
                setInterval(() => {
                    this.updatePolicyStatus();
                }, 60000); // Update every minute
            }

            updateCabinetStatus() {
                const members = document.querySelectorAll('.member-status');
                members.forEach(status => {
                    if (Math.random() < 0.2) { // 20% chance to update status
                        const statuses = [
                            'Available • Ready for briefing',
                            'In Meeting • Policy discussion',
                            'Available • Reviewing reports',
                            'Traveling • Diplomatic mission',
                            'Available • High priority meeting scheduled'
                        ];
                        const randomStatus = statuses[Math.floor(Math.random() * statuses.length)];
                        status.textContent = randomStatus;
                    }
                });
            }

            updatePolicyStatus() {
                const policies = document.querySelectorAll('.policy-status');
                policies.forEach(policy => {
                    if (Math.random() < 0.1) { // 10% chance to change status
                        const statuses = ['ACTIVE', 'PENDING', 'REVIEW', 'DRAFT'];
                        const statusClasses = ['status-active', 'status-pending', 'status-review', 'status-draft'];
                        const randomIndex = Math.floor(Math.random() * statuses.length);
                        
                        policy.textContent = statuses[randomIndex];
                        policy.className = 'policy-status ' + statusClasses[randomIndex];
                    }
                });
            }

            setupEventListeners() {
                // Add keyboard shortcuts
                document.addEventListener('keydown', (e) => {
                    if (e.ctrlKey) {
                        switch(e.key) {
                            case '1':
                                e.preventDefault();
                                this.showSection('overview');
                                break;
                            case '2':
                                e.preventDefault();
                                this.showSection('cabinet');
                                break;
                            case '3':
                                e.preventDefault();
                                this.showSection('policies');
                                break;
                        }
                    }
                });
            }

            showSection(sectionName) {
                // Hide all sections
                const sections = document.querySelectorAll('.content-section');
                sections.forEach(section => section.style.display = 'none');

                // Show selected section
                const targetSection = document.getElementById(sectionName + '-section');
                if (targetSection) {
                    targetSection.style.display = 'block';
                }

                // Update navigation
                const navItems = document.querySelectorAll('.nav-item');
                navItems.forEach(item => item.classList.remove('active'));
                
                const activeNav = document.querySelector('[onclick*="' + sectionName + '"]');
                if (activeNav) {
                    activeNav.classList.add('active');
                }

                this.currentSection = sectionName;
                console.log('👑 Switched to section: ' + sectionName);
            }

            executeGovernmentAction(action) {
                console.log('🏛️ Executing government action: ' + action);
                
                switch(action) {
                    case 'emergency-meeting':
                        this.callEmergencyMeeting();
                        break;
                    case 'public-address':
                        this.schedulePublicAddress();
                        break;
                    case 'policy-review':
                        this.initiatePolicy Review();
                        break;
                    case 'new-policy':
                        this.createNewPolicy();
                        break;
                    case 'diplomatic-mission':
                        this.launchDiplomaticMission();
                        break;
                    case 'schedule-meeting':
                        this.scheduleMeeting();
                        break;
                    default:
                        console.log('⚠️ Unknown action: ' + action);
                }
            }

            callEmergencyMeeting() {
                console.log('🚨 Calling emergency cabinet meeting...');
                alert('Emergency Meeting\\n\\nAll cabinet members have been notified and are being summoned for an immediate emergency session.');
            }

            schedulePublicAddress() {
                console.log('📢 Scheduling public address...');
                alert('Public Address\\n\\nPublic address scheduling interface would open here, allowing you to craft and schedule communications to citizens.');
            }

            initiatePolicyReview() {
                console.log('📋 Initiating policy review...');
                alert('Policy Review\\n\\nComprehensive policy analysis and review interface would be displayed here.');
            }

            createNewPolicy() {
                console.log('📝 Creating new policy...');
                alert('New Policy\\n\\nPolicy creation wizard would open here, guiding you through the legislative process.');
            }

            launchDiplomaticMission() {
                console.log('🌍 Launching diplomatic mission...');
                alert('Diplomatic Mission\\n\\nDiplomatic mission planning interface would open here.');
            }

            scheduleMeeting() {
                console.log('📅 Scheduling meeting...');
                alert('Schedule Meeting\\n\\nMeeting scheduling interface with calendar integration would be displayed here.');
            }

            navigateToScreen(screenName) {
                console.log('🔄 Navigating to: ' + screenName);
                // This would integrate with the main screen navigation system
                if (window.parent && window.parent.screenSystem) {
                    window.parent.screenSystem.showScreen(screenName);
                } else {
                    // Fallback for standalone testing
                    alert('Navigation: Would return to ' + screenName + ' screen');
                }
            }
        }

        // Global functions for onclick handlers
        function showSection(sectionName) {
            if (window.governmentScreen) {
                window.governmentScreen.showSection(sectionName);
            }
        }

        function executeGovernmentAction(action) {
            if (window.governmentScreen) {
                window.governmentScreen.executeGovernmentAction(action);
            }
        }

        function navigateToScreen(screenName) {
            if (window.governmentScreen) {
                window.governmentScreen.navigateToScreen(screenName);
            }
        }

        // Initialize screen when page loads
        document.addEventListener('DOMContentLoaded', () => {
            window.governmentScreen = new GovernmentCabinetScreen();
            console.log('👑 Government & Cabinet Screen ready!');
        });
    </script>
</body>
</html>
    `;
}

module.exports = { getGovernmentCabinetScreen };
