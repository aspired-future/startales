// Witter Social Network Screen - Galactic Social Media Platform
// Integrates with /api/witter/* endpoints and runs on port 5173

function getWitterSocialScreen() {
    return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Witter - Galactic Social Network</title>
    <style>
        /* Import Futuristic Fonts */
        @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700;900&family=Rajdhani:wght@300;400;500;600;700&family=Share+Tech+Mono&display=swap');
        
        :root {
            /* Witter Brand Colors */
            --witter-primary: #1da1f2;
            --witter-primary-dark: #1a91da;
            --witter-primary-light: #4ab3f4;
            --witter-secondary: #14171a;
            --witter-accent: #00d9ff;
            
            /* Base Colors */
            --primary-glow: #00d9ff;
            --primary-bright: #0099cc;
            --primary-dark: #004d66;
            --secondary-glow: #ff6b35;
            --accent-success: #00ff88;
            --accent-warning: #ffaa00;
            --accent-danger: #ff3366;
            --accent-info: #3366ff;
            
            /* Background Colors */
            --bg-primary: #0a0a0f;
            --bg-secondary: #1a1a2e;
            --bg-panel: #16213e;
            --bg-card: #1e2749;
            --bg-hover: #2a3f5f;
            --bg-input: #252d3a;
            
            /* Text Colors */
            --text-primary: #e0e6ed;
            --text-secondary: #b8c5d1;
            --text-muted: #8a9ba8;
            --text-accent: var(--witter-accent);
            
            /* Border Colors */
            --border-primary: #2d4a6b;
            --border-accent: var(--witter-primary);
            --border-subtle: #1a2332;
            
            /* Shadow Effects */
            --shadow-glow: 0 0 20px rgba(29, 161, 242, 0.3);
            --shadow-panel: 0 4px 20px rgba(0, 0, 0, 0.3);
            --shadow-card: 0 2px 10px rgba(0, 0, 0, 0.2);
        }
        
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: 'Rajdhani', sans-serif;
            background: linear-gradient(135deg, var(--bg-primary) 0%, var(--bg-secondary) 100%);
            color: var(--text-primary);
            overflow-x: hidden;
            min-height: 100vh;
        }
        
        .witter-container {
            display: grid;
            grid-template-areas: 
                "header header header"
                "sidebar main-feed right-panel"
                "footer footer footer";
            grid-template-columns: 280px 1fr 320px;
            grid-template-rows: 80px 1fr 60px;
            height: 100vh;
            gap: 1px;
            background: var(--border-subtle);
        }
        
        /* Header */
        .witter-header {
            grid-area: header;
            background: var(--bg-panel);
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 0 24px;
            border-bottom: 2px solid var(--border-accent);
            box-shadow: var(--shadow-panel);
        }
        
        .witter-logo {
            display: flex;
            align-items: center;
            gap: 12px;
        }
        
        .witter-logo h1 {
            font-family: 'Orbitron', monospace;
            font-size: 28px;
            font-weight: 900;
            color: var(--witter-primary);
            text-shadow: 0 0 10px rgba(29, 161, 242, 0.5);
        }
        
        .witter-icon {
            width: 40px;
            height: 40px;
            background: linear-gradient(135deg, var(--witter-primary) 0%, var(--witter-primary-dark) 100%);
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 20px;
            color: white;
            animation: pulse 3s infinite;
        }
        
        @keyframes pulse {
            0%, 100% { transform: scale(1); }
            50% { transform: scale(1.05); }
        }
        
        .header-search {
            flex: 1;
            max-width: 400px;
            margin: 0 40px;
            position: relative;
        }
        
        .search-input {
            width: 100%;
            padding: 12px 20px 12px 50px;
            background: var(--bg-input);
            border: 1px solid var(--border-primary);
            border-radius: 25px;
            color: var(--text-primary);
            font-size: 16px;
            outline: none;
            transition: all 0.3s ease;
        }
        
        .search-input:focus {
            border-color: var(--witter-primary);
            box-shadow: 0 0 0 2px rgba(29, 161, 242, 0.2);
        }
        
        .search-icon {
            position: absolute;
            left: 18px;
            top: 50%;
            transform: translateY(-50%);
            color: var(--text-muted);
            font-size: 18px;
        }
        
        .header-actions {
            display: flex;
            gap: 12px;
            align-items: center;
        }
        
        .header-btn {
            padding: 10px 20px;
            background: var(--witter-primary);
            border: none;
            border-radius: 25px;
            color: white;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.3s ease;
            font-size: 14px;
        }
        
        .header-btn:hover {
            background: var(--witter-primary-dark);
            transform: translateY(-1px);
            box-shadow: var(--shadow-glow);
        }
        
        .header-btn.secondary {
            background: transparent;
            border: 1px solid var(--border-primary);
            color: var(--text-primary);
        }
        
        .header-btn.secondary:hover {
            background: var(--bg-hover);
            border-color: var(--witter-primary);
        }
        
        /* Sidebar */
        .witter-sidebar {
            grid-area: sidebar;
            background: var(--bg-panel);
            padding: 20px;
            overflow-y: auto;
        }
        
        .nav-section {
            margin-bottom: 24px;
        }
        
        .nav-title {
            font-family: 'Orbitron', monospace;
            font-size: 16px;
            font-weight: 600;
            color: var(--text-accent);
            margin-bottom: 12px;
            display: flex;
            align-items: center;
            gap: 8px;
        }
        
        .nav-item {
            display: flex;
            align-items: center;
            gap: 16px;
            padding: 12px 16px;
            margin-bottom: 4px;
            background: transparent;
            border: 1px solid transparent;
            border-radius: 25px;
            color: var(--text-secondary);
            text-decoration: none;
            font-weight: 500;
            font-size: 16px;
            transition: all 0.3s ease;
            cursor: pointer;
        }
        
        .nav-item:hover {
            background: var(--bg-hover);
            border-color: var(--witter-primary);
            color: var(--text-primary);
            transform: translateX(4px);
        }
        
        .nav-item.active {
            background: var(--witter-primary);
            color: white;
            box-shadow: var(--shadow-glow);
        }
        
        .nav-icon {
            width: 24px;
            height: 24px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 18px;
        }
        
        .user-profile {
            background: var(--bg-card);
            border: 1px solid var(--border-primary);
            border-radius: 16px;
            padding: 16px;
            margin-top: 20px;
        }
        
        .profile-header {
            display: flex;
            align-items: center;
            gap: 12px;
            margin-bottom: 12px;
        }
        
        .profile-avatar {
            width: 48px;
            height: 48px;
            background: linear-gradient(135deg, var(--witter-primary) 0%, var(--primary-glow) 100%);
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 20px;
            color: white;
        }
        
        .profile-info h3 {
            font-size: 16px;
            font-weight: 600;
            color: var(--text-primary);
            margin-bottom: 2px;
        }
        
        .profile-info p {
            font-size: 14px;
            color: var(--text-muted);
        }
        
        .profile-stats {
            display: flex;
            justify-content: space-between;
            text-align: center;
        }
        
        .stat-item {
            flex: 1;
        }
        
        .stat-number {
            font-size: 18px;
            font-weight: 700;
            color: var(--text-primary);
        }
        
        .stat-label {
            font-size: 12px;
            color: var(--text-muted);
            text-transform: uppercase;
        }
        
        /* Main Feed */
        .witter-main {
            grid-area: main-feed;
            background: var(--bg-secondary);
            display: flex;
            flex-direction: column;
            overflow: hidden;
        }
        
        .compose-section {
            background: var(--bg-panel);
            padding: 20px;
            border-bottom: 1px solid var(--border-subtle);
        }
        
        .compose-header {
            display: flex;
            align-items: center;
            gap: 12px;
            margin-bottom: 16px;
        }
        
        .compose-avatar {
            width: 40px;
            height: 40px;
            background: linear-gradient(135deg, var(--witter-primary) 0%, var(--primary-glow) 100%);
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 16px;
            color: white;
        }
        
        .compose-title {
            font-size: 18px;
            font-weight: 600;
            color: var(--text-primary);
        }
        
        .compose-textarea {
            width: 100%;
            min-height: 120px;
            padding: 16px;
            background: var(--bg-input);
            border: 1px solid var(--border-primary);
            border-radius: 12px;
            color: var(--text-primary);
            font-size: 16px;
            font-family: inherit;
            resize: vertical;
            outline: none;
            margin-bottom: 16px;
        }
        
        .compose-textarea:focus {
            border-color: var(--witter-primary);
            box-shadow: 0 0 0 2px rgba(29, 161, 242, 0.2);
        }
        
        .compose-actions {
            display: flex;
            justify-content: space-between;
            align-items: center;
        }
        
        .compose-tools {
            display: flex;
            gap: 12px;
        }
        
        .tool-btn {
            width: 36px;
            height: 36px;
            background: transparent;
            border: 1px solid var(--border-primary);
            border-radius: 8px;
            color: var(--text-secondary);
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: all 0.3s ease;
        }
        
        .tool-btn:hover {
            background: var(--bg-hover);
            border-color: var(--witter-primary);
            color: var(--witter-primary);
        }
        
        .post-btn {
            padding: 10px 24px;
            background: var(--witter-primary);
            border: none;
            border-radius: 25px;
            color: white;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.3s ease;
        }
        
        .post-btn:hover {
            background: var(--witter-primary-dark);
            transform: translateY(-1px);
        }
        
        .post-btn:disabled {
            opacity: 0.5;
            cursor: not-allowed;
            transform: none;
        }
        
        .feed-container {
            flex: 1;
            overflow-y: auto;
            padding: 0;
        }
        
        .feed-tabs {
            display: flex;
            background: var(--bg-panel);
            border-bottom: 1px solid var(--border-subtle);
            position: sticky;
            top: 0;
            z-index: 10;
        }
        
        .feed-tab {
            flex: 1;
            padding: 16px;
            text-align: center;
            background: transparent;
            border: none;
            color: var(--text-secondary);
            font-weight: 500;
            cursor: pointer;
            transition: all 0.3s ease;
            border-bottom: 3px solid transparent;
        }
        
        .feed-tab:hover {
            background: var(--bg-hover);
            color: var(--text-primary);
        }
        
        .feed-tab.active {
            color: var(--witter-primary);
            border-bottom-color: var(--witter-primary);
            background: var(--bg-hover);
        }
        
        .feed-content {
            padding: 0;
        }
        
        .witter-post {
            background: var(--bg-panel);
            border-bottom: 1px solid var(--border-subtle);
            padding: 20px;
            transition: all 0.3s ease;
            cursor: pointer;
        }
        
        .witter-post:hover {
            background: var(--bg-hover);
        }
        
        .post-header {
            display: flex;
            align-items: flex-start;
            gap: 12px;
            margin-bottom: 12px;
        }
        
        .post-avatar {
            width: 48px;
            height: 48px;
            border-radius: 50%;
            background: linear-gradient(135deg, var(--witter-primary) 0%, var(--primary-glow) 100%);
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 18px;
            color: white;
            flex-shrink: 0;
        }
        
        .post-info {
            flex: 1;
        }
        
        .post-author {
            display: flex;
            align-items: center;
            gap: 8px;
            margin-bottom: 4px;
        }
        
        .author-name {
            font-size: 16px;
            font-weight: 600;
            color: var(--text-primary);
        }
        
        .author-handle {
            font-size: 14px;
            color: var(--text-muted);
        }
        
        .author-badge {
            width: 16px;
            height: 16px;
            background: var(--witter-primary);
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 10px;
            color: white;
        }
        
        .post-time {
            font-size: 14px;
            color: var(--text-muted);
        }
        
        .post-content {
            font-size: 16px;
            line-height: 1.5;
            color: var(--text-primary);
            margin-bottom: 12px;
        }
        
        .post-media {
            margin-bottom: 12px;
            border-radius: 12px;
            overflow: hidden;
        }
        
        .post-media img,
        .post-media video {
            width: 100%;
            height: auto;
            display: block;
        }
        
        .post-actions {
            display: flex;
            justify-content: space-between;
            max-width: 400px;
        }
        
        .action-btn {
            display: flex;
            align-items: center;
            gap: 8px;
            padding: 8px 12px;
            background: transparent;
            border: none;
            border-radius: 20px;
            color: var(--text-muted);
            cursor: pointer;
            transition: all 0.3s ease;
            font-size: 14px;
        }
        
        .action-btn:hover {
            background: var(--bg-card);
            color: var(--text-primary);
        }
        
        .action-btn.liked {
            color: var(--accent-danger);
        }
        
        .action-btn.retweeted {
            color: var(--accent-success);
        }
        
        /* Right Panel */
        .witter-right-panel {
            grid-area: right-panel;
            background: var(--bg-panel);
            padding: 20px;
            overflow-y: auto;
        }
        
        .panel-section {
            background: var(--bg-card);
            border: 1px solid var(--border-primary);
            border-radius: 16px;
            padding: 20px;
            margin-bottom: 20px;
        }
        
        .panel-title {
            font-family: 'Orbitron', monospace;
            font-size: 18px;
            font-weight: 600;
            color: var(--text-primary);
            margin-bottom: 16px;
        }
        
        .trending-item {
            padding: 12px 0;
            border-bottom: 1px solid var(--border-subtle);
            cursor: pointer;
            transition: all 0.3s ease;
        }
        
        .trending-item:last-child {
            border-bottom: none;
        }
        
        .trending-item:hover {
            background: var(--bg-hover);
            margin: 0 -20px;
            padding: 12px 20px;
            border-radius: 8px;
        }
        
        .trending-category {
            font-size: 12px;
            color: var(--text-muted);
            text-transform: uppercase;
        }
        
        .trending-topic {
            font-size: 16px;
            font-weight: 600;
            color: var(--text-primary);
            margin: 4px 0;
        }
        
        .trending-posts {
            font-size: 12px;
            color: var(--text-muted);
        }
        
        .suggestion-item {
            display: flex;
            align-items: center;
            gap: 12px;
            padding: 12px 0;
            border-bottom: 1px solid var(--border-subtle);
        }
        
        .suggestion-item:last-child {
            border-bottom: none;
        }
        
        .suggestion-avatar {
            width: 40px;
            height: 40px;
            border-radius: 50%;
            background: linear-gradient(135deg, var(--secondary-glow) 0%, var(--accent-warning) 100%);
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 16px;
            color: white;
        }
        
        .suggestion-info {
            flex: 1;
        }
        
        .suggestion-name {
            font-size: 14px;
            font-weight: 600;
            color: var(--text-primary);
        }
        
        .suggestion-handle {
            font-size: 12px;
            color: var(--text-muted);
        }
        
        .follow-btn {
            padding: 6px 16px;
            background: transparent;
            border: 1px solid var(--witter-primary);
            border-radius: 20px;
            color: var(--witter-primary);
            font-size: 12px;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.3s ease;
        }
        
        .follow-btn:hover {
            background: var(--witter-primary);
            color: white;
        }
        
        /* Footer */
        .witter-footer {
            grid-area: footer;
            background: var(--bg-panel);
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 0 24px;
            border-top: 1px solid var(--border-subtle);
            font-size: 12px;
            color: var(--text-muted);
        }
        
        .footer-links {
            display: flex;
            gap: 20px;
        }
        
        .footer-link {
            color: var(--text-muted);
            text-decoration: none;
            transition: color 0.3s ease;
        }
        
        .footer-link:hover {
            color: var(--witter-primary);
        }
        
        /* Responsive */
        @media (max-width: 1200px) {
            .witter-container {
                grid-template-columns: 240px 1fr 280px;
            }
        }
        
        @media (max-width: 768px) {
            .witter-container {
                grid-template-areas: 
                    "header"
                    "main-feed"
                    "footer";
                grid-template-columns: 1fr;
                grid-template-rows: 80px 1fr 60px;
            }
            
            .witter-sidebar,
            .witter-right-panel {
                display: none;
            }
            
            .header-search {
                display: none;
            }
        }
        
        /* Animations */
        .slide-in {
            animation: slideIn 0.3s ease-out;
        }
        
        @keyframes slideIn {
            from {
                opacity: 0;
                transform: translateY(-10px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }
        
        .fade-in {
            animation: fadeIn 0.5s ease-out;
        }
        
        @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
        }
        
        /* Loading States */
        .loading {
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 40px;
            color: var(--text-muted);
        }
        
        .loading::before {
            content: '';
            width: 20px;
            height: 20px;
            border: 2px solid var(--border-primary);
            border-top-color: var(--witter-primary);
            border-radius: 50%;
            animation: spin 1s linear infinite;
            margin-right: 12px;
        }
        
        @keyframes spin {
            to { transform: rotate(360deg); }
        }
    </style>
</head>
<body>
    <div class="witter-container">
        <!-- Header -->
        <header class="witter-header">
            <div class="witter-logo">
                <div class="witter-icon">🐦</div>
                <h1>WITTER</h1>
            </div>
            <div class="header-search">
                <div class="search-icon">🔍</div>
                <input type="text" class="search-input" placeholder="Search Witter..." id="search-input">
            </div>
            <div class="header-actions">
                <button class="header-btn secondary" onclick="window.history.back()">← Back to HUD</button>
                <button class="header-btn">Post</button>
            </div>
        </header>
        
        <!-- Sidebar -->
        <nav class="witter-sidebar">
            <div class="nav-section">
                <div class="nav-item active" data-feed="home">
                    <div class="nav-icon">🏠</div>
                    <span>Home</span>
                </div>
                <div class="nav-item" data-feed="explore">
                    <div class="nav-icon">🔍</div>
                    <span>Explore</span>
                </div>
                <div class="nav-item" data-feed="notifications">
                    <div class="nav-icon">🔔</div>
                    <span>Notifications</span>
                </div>
                <div class="nav-item" data-feed="messages">
                    <div class="nav-icon">✉️</div>
                    <span>Messages</span>
                </div>
                <div class="nav-item" data-feed="bookmarks">
                    <div class="nav-icon">🔖</div>
                    <span>Bookmarks</span>
                </div>
                <div class="nav-item" data-feed="profile">
                    <div class="nav-icon">👤</div>
                    <span>Profile</span>
                </div>
            </div>
            
            <div class="user-profile">
                <div class="profile-header">
                    <div class="profile-avatar">👑</div>
                    <div class="profile-info">
                        <h3>Galactic Leader</h3>
                        <p>@supreme_commander</p>
                    </div>
                </div>
                <div class="profile-stats">
                    <div class="stat-item">
                        <div class="stat-number">2.4M</div>
                        <div class="stat-label">Following</div>
                    </div>
                    <div class="stat-item">
                        <div class="stat-number">847M</div>
                        <div class="stat-label">Followers</div>
                    </div>
                </div>
            </div>
        </nav>
        
        <!-- Main Feed -->
        <main class="witter-main">
            <!-- Compose Section -->
            <div class="compose-section">
                <div class="compose-header">
                    <div class="compose-avatar">👑</div>
                    <div class="compose-title">What's happening in the galaxy?</div>
                </div>
                <textarea class="compose-textarea" placeholder="Share your thoughts with the galaxy..." id="compose-text"></textarea>
                <div class="compose-actions">
                    <div class="compose-tools">
                        <button class="tool-btn" title="Add Image">📷</button>
                        <button class="tool-btn" title="Add Video">🎥</button>
                        <button class="tool-btn" title="Add Poll">📊</button>
                        <button class="tool-btn" title="Add Location">📍</button>
                        <button class="tool-btn" title="Schedule">⏰</button>
                    </div>
                    <button class="post-btn" id="post-btn">Post to Galaxy</button>
                </div>
            </div>
            
            <!-- Feed Tabs -->
            <div class="feed-tabs">
                <button class="feed-tab active" data-tab="for-you">For You</button>
                <button class="feed-tab" data-tab="following">Following</button>
                <button class="feed-tab" data-tab="galactic">Galactic News</button>
                <button class="feed-tab" data-tab="local">Local Sector</button>
            </div>
            
            <!-- Feed Content -->
            <div class="feed-container">
                <div class="feed-content" id="feed-content">
                    <!-- Sample Posts -->
                    <div class="witter-post slide-in">
                        <div class="post-header">
                            <div class="post-avatar">⚔️</div>
                            <div class="post-info">
                                <div class="post-author">
                                    <span class="author-name">Admiral Chen</span>
                                    <span class="author-handle">@fleet_commander</span>
                                    <div class="author-badge">✓</div>
                                </div>
                                <div class="post-time">2 minutes ago</div>
                            </div>
                        </div>
                        <div class="post-content">
                            Fleet exercises completed successfully in the Kepler sector. All systems nominal and crew performance exceptional. Ready for any challenges the galaxy might throw at us! 🚀 #FleetReady #GalacticDefense
                        </div>
                        <div class="post-actions">
                            <button class="action-btn">
                                <span>💬</span>
                                <span>23</span>
                            </button>
                            <button class="action-btn">
                                <span>🔄</span>
                                <span>156</span>
                            </button>
                            <button class="action-btn">
                                <span>❤️</span>
                                <span>892</span>
                            </button>
                            <button class="action-btn">
                                <span>📤</span>
                            </button>
                        </div>
                    </div>
                    
                    <div class="witter-post slide-in">
                        <div class="post-header">
                            <div class="post-avatar">🔬</div>
                            <div class="post-info">
                                <div class="post-author">
                                    <span class="author-name">Dr. Keth Vorthak</span>
                                    <span class="author-handle">@xenobiologist</span>
                                    <div class="author-badge">✓</div>
                                </div>
                                <div class="post-time">8 minutes ago</div>
                            </div>
                        </div>
                        <div class="post-content">
                            BREAKTHROUGH! Our quantum computing research has achieved a 340% efficiency increase! This will revolutionize everything from faster-than-light communications to predictive modeling. The future is bright! ⚡🧬 #QuantumLeap #ScienceWins
                        </div>
                        <div class="post-actions">
                            <button class="action-btn">
                                <span>💬</span>
                                <span>67</span>
                            </button>
                            <button class="action-btn retweeted">
                                <span>🔄</span>
                                <span>234</span>
                            </button>
                            <button class="action-btn liked">
                                <span>❤️</span>
                                <span>1.2K</span>
                            </button>
                            <button class="action-btn">
                                <span>📤</span>
                            </button>
                        </div>
                    </div>
                    
                    <div class="witter-post slide-in">
                        <div class="post-header">
                            <div class="post-avatar">💰</div>
                            <div class="post-info">
                                <div class="post-author">
                                    <span class="author-name">Minister Rodriguez</span>
                                    <span class="author-handle">@trade_minister</span>
                                    <div class="author-badge">✓</div>
                                </div>
                                <div class="post-time">15 minutes ago</div>
                            </div>
                        </div>
                        <div class="post-content">
                            Exciting news! Trade negotiations with the Centauri Alliance have been finalized. New agreements will boost our economy by an estimated 23% over the next cycle. Prosperity for all! 🌟💎 #TradeWins #EconomicGrowth
                        </div>
                        <div class="post-actions">
                            <button class="action-btn">
                                <span>💬</span>
                                <span>45</span>
                            </button>
                            <button class="action-btn">
                                <span>🔄</span>
                                <span>89</span>
                            </button>
                            <button class="action-btn">
                                <span>❤️</span>
                                <span>567</span>
                            </button>
                            <button class="action-btn">
                                <span>📤</span>
                            </button>
                        </div>
                    </div>
                    
                    <div class="witter-post slide-in">
                        <div class="post-header">
                            <div class="post-avatar">🌍</div>
                            <div class="post-info">
                                <div class="post-author">
                                    <span class="author-name">Captain Morrison</span>
                                    <span class="author-handle">@exploration_lead</span>
                                    <div class="author-badge">✓</div>
                                </div>
                                <div class="post-time">32 minutes ago</div>
                            </div>
                        </div>
                        <div class="post-content">
                            Just discovered a new habitable planet in the Vega system! Initial scans show rich mineral deposits and a breathable atmosphere. Could be our next colony site! 🪐✨ #NewWorlds #Exploration
                        </div>
                        <div class="post-media">
                            <div style="width: 100%; height: 200px; background: linear-gradient(135deg, #4caf50 0%, #2e7d32 100%); border-radius: 12px; display: flex; align-items: center; justify-content: center; font-size: 48px;">🪐</div>
                        </div>
                        <div class="post-actions">
                            <button class="action-btn">
                                <span>💬</span>
                                <span>128</span>
                            </button>
                            <button class="action-btn">
                                <span>🔄</span>
                                <span>456</span>
                            </button>
                            <button class="action-btn">
                                <span>❤️</span>
                                <span>2.1K</span>
                            </button>
                            <button class="action-btn">
                                <span>📤</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </main>
        
        <!-- Right Panel -->
        <aside class="witter-right-panel">
            <div class="panel-section">
                <h3 class="panel-title">Trending in Galaxy</h3>
                <div class="trending-item">
                    <div class="trending-category">Galactic Politics</div>
                    <div class="trending-topic">#GalacticUnity</div>
                    <div class="trending-posts">847K posts</div>
                </div>
                <div class="trending-item">
                    <div class="trending-category">Science & Tech</div>
                    <div class="trending-topic">#QuantumLeap</div>
                    <div class="trending-posts">234K posts</div>
                </div>
                <div class="trending-item">
                    <div class="trending-category">Exploration</div>
                    <div class="trending-topic">#NewWorlds</div>
                    <div class="trending-posts">156K posts</div>
                </div>
                <div class="trending-item">
                    <div class="trending-category">Military</div>
                    <div class="trending-topic">#FleetReady</div>
                    <div class="trending-posts">89K posts</div>
                </div>
                <div class="trending-item">
                    <div class="trending-category">Economy</div>
                    <div class="trending-topic">#TradeWins</div>
                    <div class="trending-posts">67K posts</div>
                </div>
            </div>
            
            <div class="panel-section">
                <h3 class="panel-title">Who to Follow</h3>
                <div class="suggestion-item">
                    <div class="suggestion-avatar">🚀</div>
                    <div class="suggestion-info">
                        <div class="suggestion-name">Space Force Command</div>
                        <div class="suggestion-handle">@spaceforce_hq</div>
                    </div>
                    <button class="follow-btn">Follow</button>
                </div>
                <div class="suggestion-item">
                    <div class="suggestion-avatar">🌌</div>
                    <div class="suggestion-info">
                        <div class="suggestion-name">Galactic News Network</div>
                        <div class="suggestion-handle">@gnn_official</div>
                    </div>
                    <button class="follow-btn">Follow</button>
                </div>
                <div class="suggestion-item">
                    <div class="suggestion-avatar">🔬</div>
                    <div class="suggestion-info">
                        <div class="suggestion-name">Research Institute</div>
                        <div class="suggestion-handle">@galactic_research</div>
                    </div>
                    <button class="follow-btn">Follow</button>
                </div>
            </div>
        </aside>
        
        <!-- Footer -->
        <footer class="witter-footer">
            <div class="footer-links">
                <a href="#" class="footer-link">Terms</a>
                <a href="#" class="footer-link">Privacy</a>
                <a href="#" class="footer-link">Cookies</a>
                <a href="#" class="footer-link">Ads info</a>
                <a href="#" class="footer-link">More</a>
            </div>
            <div>
                <span>© 2387 Witter, Galactic Inc.</span>
            </div>
        </footer>
    </div>
    
    <script>
        class WitterSocialSystem {
            constructor() {
                this.currentFeed = 'for-you';
                this.posts = [];
                this.websocket = null;
                this.init();
            }
            
            init() {
                console.log('🐦 Initializing Witter Social Network...');
                this.setupEventListeners();
                this.connectWebSocket();
                this.loadFeedData();
                this.startRealTimeUpdates();
                console.log('✅ Witter initialized successfully');
            }
            
            setupEventListeners() {
                // Navigation
                document.querySelectorAll('[data-feed]').forEach(item => {
                    item.addEventListener('click', (e) => {
                        const feed = e.currentTarget.dataset.feed;
                        this.switchFeed(feed);
                    });
                });
                
                // Feed tabs
                document.querySelectorAll('[data-tab]').forEach(tab => {
                    tab.addEventListener('click', (e) => {
                        const tabName = e.target.dataset.tab;
                        this.switchTab(tabName);
                    });
                });
                
                // Compose
                const composeText = document.getElementById('compose-text');
                const postBtn = document.getElementById('post-btn');
                
                composeText.addEventListener('input', () => {
                    postBtn.disabled = composeText.value.trim().length === 0;
                });
                
                postBtn.addEventListener('click', () => {
                    this.createPost(composeText.value.trim());
                });
                
                // Search
                const searchInput = document.getElementById('search-input');
                searchInput.addEventListener('input', (e) => {
                    this.performSearch(e.target.value);
                });
                
                // Post actions
                document.addEventListener('click', (e) => {
                    if (e.target.closest('.action-btn')) {
                        const btn = e.target.closest('.action-btn');
                        const action = btn.querySelector('span').textContent;
                        this.handlePostAction(action, btn);
                    }
                });
                
                // Follow buttons
                document.querySelectorAll('.follow-btn').forEach(btn => {
                    btn.addEventListener('click', (e) => {
                        this.toggleFollow(e.target);
                    });
                });
            }
            
            switchFeed(feedName) {
                console.log(\`🔄 Switching to \${feedName} feed\`);
                
                // Update navigation
                document.querySelectorAll('[data-feed]').forEach(item => {
                    item.classList.remove('active');
                });
                document.querySelector(\`[data-feed="\${feedName}"]\`).classList.add('active');
                
                this.currentFeed = feedName;
                this.loadFeedContent(feedName);
            }
            
            switchTab(tabName) {
                console.log(\`📑 Switching to \${tabName} tab\`);
                
                // Update tab appearance
                document.querySelectorAll('.feed-tab').forEach(tab => {
                    tab.classList.remove('active');
                });
                document.querySelector(\`[data-tab="\${tabName}"]\`).classList.add('active');
                
                this.loadTabContent(tabName);
            }
            
            loadFeedContent(feedName) {
                const feedContent = document.getElementById('feed-content');
                feedContent.innerHTML = '<div class="loading">Loading posts...</div>';
                
                // Simulate API call
                setTimeout(() => {
                    this.renderPosts(this.getPostsForFeed(feedName));
                }, 500);
            }
            
            loadTabContent(tabName) {
                const feedContent = document.getElementById('feed-content');
                feedContent.innerHTML = '<div class="loading">Loading posts...</div>';
                
                // Simulate API call
                setTimeout(() => {
                    this.renderPosts(this.getPostsForTab(tabName));
                }, 300);
            }
            
            getPostsForFeed(feedName) {
                // Mock data - replace with API calls to /api/witter/*
                const mockPosts = [
                    {
                        id: 1,
                        author: { name: 'Admiral Chen', handle: 'fleet_commander', avatar: '⚔️', verified: true },
                        content: 'Fleet exercises completed successfully in the Kepler sector. All systems nominal and crew performance exceptional. Ready for any challenges the galaxy might throw at us! 🚀 #FleetReady #GalacticDefense',
                        timestamp: new Date(Date.now() - 2 * 60 * 1000),
                        likes: 892,
                        retweets: 156,
                        comments: 23
                    },
                    {
                        id: 2,
                        author: { name: 'Dr. Keth Vorthak', handle: 'xenobiologist', avatar: '🔬', verified: true },
                        content: 'BREAKTHROUGH! Our quantum computing research has achieved a 340% efficiency increase! This will revolutionize everything from faster-than-light communications to predictive modeling. The future is bright! ⚡🧬 #QuantumLeap #ScienceWins',
                        timestamp: new Date(Date.now() - 8 * 60 * 1000),
                        likes: 1200,
                        retweets: 234,
                        comments: 67
                    }
                ];
                
                return mockPosts;
            }
            
            getPostsForTab(tabName) {
                // Filter posts based on tab
                return this.getPostsForFeed('home').filter(post => {
                    switch(tabName) {
                        case 'for-you': return true;
                        case 'following': return post.author.verified;
                        case 'galactic': return post.content.includes('#Galactic');
                        case 'local': return post.content.includes('sector');
                        default: return true;
                    }
                });
            }
            
            renderPosts(posts) {
                const feedContent = document.getElementById('feed-content');
                
                if (posts.length === 0) {
                    feedContent.innerHTML = '<div class="loading">No posts to show</div>';
                    return;
                }
                
                feedContent.innerHTML = posts.map(post => this.renderPost(post)).join('');
            }
            
            renderPost(post) {
                const timeAgo = this.getTimeAgo(post.timestamp);
                
                return \`
                    <div class="witter-post slide-in" data-post-id="\${post.id}">
                        <div class="post-header">
                            <div class="post-avatar">\${post.author.avatar}</div>
                            <div class="post-info">
                                <div class="post-author">
                                    <span class="author-name">\${post.author.name}</span>
                                    <span class="author-handle">@\${post.author.handle}</span>
                                    \${post.author.verified ? '<div class="author-badge">✓</div>' : ''}
                                </div>
                                <div class="post-time">\${timeAgo}</div>
                            </div>
                        </div>
                        <div class="post-content">\${post.content}</div>
                        <div class="post-actions">
                            <button class="action-btn">
                                <span>💬</span>
                                <span>\${post.comments}</span>
                            </button>
                            <button class="action-btn">
                                <span>🔄</span>
                                <span>\${post.retweets}</span>
                            </button>
                            <button class="action-btn">
                                <span>❤️</span>
                                <span>\${this.formatNumber(post.likes)}</span>
                            </button>
                            <button class="action-btn">
                                <span>📤</span>
                            </button>
                        </div>
                    </div>
                \`;
            }
            
            createPost(content) {
                if (!content) return;
                
                console.log('📝 Creating new post:', content);
                
                const newPost = {
                    id: Date.now(),
                    author: { name: 'Galactic Leader', handle: 'supreme_commander', avatar: '👑', verified: true },
                    content: content,
                    timestamp: new Date(),
                    likes: 0,
                    retweets: 0,
                    comments: 0
                };
                
                // Add to feed
                const feedContent = document.getElementById('feed-content');
                feedContent.insertAdjacentHTML('afterbegin', this.renderPost(newPost));
                
                // Clear compose area
                document.getElementById('compose-text').value = '';
                document.getElementById('post-btn').disabled = true;
                
                // Simulate API call to /api/witter/posts
                this.sendPostToAPI(newPost);
                
                this.showNotification('Post shared with the galaxy!', 'success');
            }
            
            sendPostToAPI(post) {
                // Simulate API call
                console.log('📡 Sending post to API:', post);
                // In real implementation: fetch('/api/witter/posts', { method: 'POST', body: JSON.stringify(post) })
            }
            
            handlePostAction(action, button) {
                const post = button.closest('.witter-post');
                const postId = post.dataset.postId;
                
                switch(action) {
                    case '💬':
                        this.openComments(postId);
                        break;
                    case '🔄':
                        this.toggleRetweet(postId, button);
                        break;
                    case '❤️':
                        this.toggleLike(postId, button);
                        break;
                    case '📤':
                        this.sharePost(postId);
                        break;
                }
            }
            
            toggleLike(postId, button) {
                const isLiked = button.classList.contains('liked');
                const countSpan = button.querySelector('span:last-child');
                let count = parseInt(countSpan.textContent.replace(/[^0-9]/g, ''));
                
                if (isLiked) {
                    button.classList.remove('liked');
                    count--;
                } else {
                    button.classList.add('liked');
                    count++;
                }
                
                countSpan.textContent = this.formatNumber(count);
                
                // Animate
                button.style.transform = 'scale(1.2)';
                setTimeout(() => {
                    button.style.transform = 'scale(1)';
                }, 150);
            }
            
            toggleRetweet(postId, button) {
                const isRetweeted = button.classList.contains('retweeted');
                const countSpan = button.querySelector('span:last-child');
                let count = parseInt(countSpan.textContent);
                
                if (isRetweeted) {
                    button.classList.remove('retweeted');
                    count--;
                } else {
                    button.classList.add('retweeted');
                    count++;
                }
                
                countSpan.textContent = count;
                
                // Animate
                button.style.transform = 'scale(1.2)';
                setTimeout(() => {
                    button.style.transform = 'scale(1)';
                }, 150);
            }
            
            toggleFollow(button) {
                const isFollowing = button.textContent === 'Following';
                
                if (isFollowing) {
                    button.textContent = 'Follow';
                    button.style.background = 'transparent';
                    button.style.color = 'var(--witter-primary)';
                } else {
                    button.textContent = 'Following';
                    button.style.background = 'var(--witter-primary)';
                    button.style.color = 'white';
                }
            }
            
            performSearch(query) {
                if (query.length < 2) return;
                
                console.log('🔍 Searching for:', query);
                // In real implementation: search via /api/witter/search
            }
            
            connectWebSocket() {
                try {
                    // Connect to real-time Witter updates
                    this.websocket = new WebSocket('ws://localhost:5173/ws');
                    
                    this.websocket.onopen = () => {
                        console.log('🔗 Witter WebSocket connected');
                    };
                    
                    this.websocket.onmessage = (event) => {
                        const data = JSON.parse(event.data);
                        this.handleRealTimeUpdate(data);
                    };
                    
                    this.websocket.onclose = () => {
                        console.log('🔗 Witter WebSocket disconnected');
                        // Attempt to reconnect
                        setTimeout(() => this.connectWebSocket(), 5000);
                    };
                } catch (error) {
                    console.log('⚠️ WebSocket connection failed, using polling fallback');
                }
            }
            
            handleRealTimeUpdate(data) {
                switch(data.type) {
                    case 'new_post':
                        this.addNewPost(data.post);
                        break;
                    case 'post_update':
                        this.updatePost(data.postId, data.updates);
                        break;
                    case 'trending_update':
                        this.updateTrending(data.trends);
                        break;
                }
            }
            
            addNewPost(post) {
                const feedContent = document.getElementById('feed-content');
                feedContent.insertAdjacentHTML('afterbegin', this.renderPost(post));
                
                // Show notification for important posts
                if (post.author.verified) {
                    this.showNotification(\`New post from \${post.author.name}\`, 'info');
                }
            }
            
            loadFeedData() {
                console.log('📡 Loading Witter feed data...');
                // In real implementation: fetch from /api/witter/posts
            }
            
            startRealTimeUpdates() {
                // Fallback polling if WebSocket fails
                if (!this.websocket || this.websocket.readyState !== WebSocket.OPEN) {
                    setInterval(() => {
                        this.loadFeedData();
                    }, 30000);
                }
            }
            
            getTimeAgo(timestamp) {
                const now = new Date();
                const diff = now - timestamp;
                const minutes = Math.floor(diff / 60000);
                const hours = Math.floor(diff / 3600000);
                const days = Math.floor(diff / 86400000);
                
                if (minutes < 1) return 'Just now';
                if (minutes < 60) return \`\${minutes}m ago\`;
                if (hours < 24) return \`\${hours}h ago\`;
                return \`\${days}d ago\`;
            }
            
            formatNumber(num) {
                if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
                if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
                return num.toString();
            }
            
            showNotification(message, type = 'info') {
                const notification = document.createElement('div');
                notification.className = \`notification \${type}\`;
                notification.textContent = message;
                notification.style.cssText = \`
                    position: fixed;
                    top: 20px;
                    right: 20px;
                    background: var(--bg-panel);
                    color: var(--text-primary);
                    padding: 12px 16px;
                    border-radius: 8px;
                    border-left: 4px solid var(--witter-primary);
                    box-shadow: var(--shadow-panel);
                    z-index: 10000;
                    font-size: 14px;
                    max-width: 300px;
                    opacity: 0;
                    transform: translateX(100%);
                    transition: all 0.3s ease;
                \`;
                
                document.body.appendChild(notification);
                
                setTimeout(() => {
                    notification.style.opacity = '1';
                    notification.style.transform = 'translateX(0)';
                }, 100);
                
                setTimeout(() => {
                    notification.style.opacity = '0';
                    notification.style.transform = 'translateX(100%)';
                    setTimeout(() => notification.remove(), 300);
                }, 4000);
            }
        }
        
        // Initialize Witter when page loads
        document.addEventListener('DOMContentLoaded', () => {
            window.witter = new WitterSocialSystem();
        });
    </script>
</body>
</html>
    `;
}

module.exports = { getWitterSocialScreen };
