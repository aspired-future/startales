function getWitterDemo() {
  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Witter Social Network - StarTales Demo</title>
  <link href="https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700&family=Roboto:wght@300;400;700&display=swap" rel="stylesheet">
  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }

    body {
      font-family: 'Roboto', sans-serif;
      background: linear-gradient(135deg, #0f0f23 0%, #1a1a2e 50%, #16213e 100%);
      color: #e0e0e0;
      min-height: 100vh;
      overflow-x: hidden;
    }

    .container {
      max-width: 1200px;
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
      color: #bb86fc;
      margin-bottom: 10px;
      text-shadow: 0 0 20px rgba(187, 134, 252, 0.5);
    }

    .header p {
      font-size: 1.1rem;
      color: #a0a0a0;
    }

    .controls {
      display: flex;
      gap: 15px;
      margin-bottom: 30px;
      flex-wrap: wrap;
      justify-content: center;
    }

    .btn {
      background: linear-gradient(135deg, #bb86fc 0%, #6200ea 100%);
      color: white;
      border: none;
      padding: 12px 24px;
      border-radius: 8px;
      cursor: pointer;
      font-weight: 600;
      transition: all 0.3s ease;
      font-size: 14px;
    }

    .btn:hover {
      transform: translateY(-2px);
      box-shadow: 0 8px 25px rgba(187, 134, 252, 0.4);
    }

    .btn.secondary {
      background: linear-gradient(135deg, #03dac6 0%, #018786 100%);
    }

    .btn.success {
      background: linear-gradient(135deg, #4caf50 0%, #2e7d32 100%);
    }

    .filters {
      display: flex;
      gap: 10px;
      margin-bottom: 20px;
      flex-wrap: wrap;
      align-items: center;
    }

    .filter-group {
      display: flex;
      align-items: center;
      gap: 5px;
    }

    .filter-group label {
      color: #a0a0a0;
      font-size: 0.9rem;
    }

    .filter-group select {
      background: rgba(255, 255, 255, 0.1);
      border: 1px solid rgba(255, 255, 255, 0.2);
      border-radius: 6px;
      padding: 8px 12px;
      color: #e0e0e0;
      font-size: 0.9rem;
    }

    .feed {
      display: grid;
      gap: 20px;
    }

    .post {
      background: rgba(255, 255, 255, 0.08);
      border-radius: 15px;
      padding: 20px;
      border: 1px solid rgba(255, 255, 255, 0.1);
      backdrop-filter: blur(10px);
      transition: all 0.3s ease;
    }

    .post:hover {
      border-color: rgba(187, 134, 252, 0.5);
      box-shadow: 0 8px 32px rgba(187, 134, 252, 0.2);
    }

    .post-header {
      display: flex;
      align-items: center;
      gap: 15px;
      margin-bottom: 15px;
    }

    .avatar {
      font-size: 2rem;
      width: 50px;
      height: 50px;
      display: flex;
      align-items: center;
      justify-content: center;
      background: rgba(187, 134, 252, 0.2);
      border-radius: 50%;
      border: 2px solid rgba(187, 134, 252, 0.3);
    }

    .post-author-info {
      flex: 1;
    }

    .post-author {
      font-weight: 700;
      color: #bb86fc;
      font-size: 1.1rem;
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .verified {
      color: #03dac6;
      font-size: 0.9rem;
    }

    .post-meta {
      color: #a0a0a0;
      font-size: 0.9rem;
      margin-top: 2px;
    }

    .post-content {
      font-size: 1rem;
      line-height: 1.6;
      margin-bottom: 15px;
      color: #e0e0e0;
    }

    .post-stats {
      display: flex;
      gap: 20px;
      padding: 10px 0;
      border-top: 1px solid rgba(255, 255, 255, 0.1);
      font-size: 0.9rem;
      color: #a0a0a0;
    }

    .post-actions {
      display: flex;
      gap: 15px;
      margin-top: 15px;
    }

    .action-btn {
      background: none;
      border: 1px solid rgba(255, 255, 255, 0.2);
      color: #a0a0a0;
      padding: 8px 16px;
      border-radius: 6px;
      cursor: pointer;
      transition: all 0.3s ease;
      font-size: 0.9rem;
    }

    .action-btn:hover {
      border-color: #bb86fc;
      color: #bb86fc;
    }

    .action-btn.liked {
      border-color: #f44336;
      color: #f44336;
    }

    .loading {
      text-align: center;
      padding: 40px;
      color: #a0a0a0;
    }

    .error {
      background: rgba(207, 102, 121, 0.2);
      border: 1px solid #cf6679;
      color: #cf6679;
      padding: 15px;
      border-radius: 8px;
      margin: 20px 0;
    }

    .success {
      background: rgba(76, 175, 80, 0.2);
      border: 1px solid #4caf50;
      color: #4caf50;
      padding: 15px;
      border-radius: 8px;
      margin: 20px 0;
    }

    .back-link {
      display: inline-block;
      margin-top: 30px;
      color: #03dac6;
      text-decoration: none;
      font-weight: 600;
      transition: color 0.3s ease;
    }

    .back-link:hover {
      color: #bb86fc;
    }

    .analytics-dashboard {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 20px;
      margin-bottom: 30px;
    }

    .analytics-card {
      background: rgba(255, 255, 255, 0.08);
      border-radius: 15px;
      padding: 20px;
      border: 1px solid rgba(255, 255, 255, 0.1);
      backdrop-filter: blur(10px);
    }

    .analytics-card h3 {
      color: #bb86fc;
      margin-bottom: 15px;
      font-family: 'Orbitron', monospace;
      font-size: 1.1rem;
    }

    .metric {
      display: flex;
      justify-content: space-between;
      margin-bottom: 10px;
      padding: 8px 0;
      border-bottom: 1px solid rgba(255, 255, 255, 0.1);
    }

    .metric:last-child {
      border-bottom: none;
    }

    .metric-label {
      color: #a0a0a0;
    }

    .metric-value {
      color: #03dac6;
      font-weight: 600;
    }

    .pagination {
      display: flex;
      justify-content: center;
      gap: 10px;
      margin-top: 30px;
    }

    .page-btn {
      background: rgba(255, 255, 255, 0.1);
      border: 1px solid rgba(255, 255, 255, 0.2);
      color: #e0e0e0;
      padding: 10px 15px;
      border-radius: 6px;
      cursor: pointer;
      transition: all 0.3s ease;
    }

    .page-btn:hover {
      border-color: #bb86fc;
      color: #bb86fc;
    }

    .page-btn.active {
      background: #bb86fc;
      border-color: #bb86fc;
      color: white;
    }

    .tabs {
      display: flex;
      gap: 5px;
      margin-bottom: 20px;
      border-bottom: 1px solid rgba(255, 255, 255, 0.1);
    }

    .tab {
      padding: 12px 20px;
      background: none;
      border: none;
      color: #a0a0a0;
      cursor: pointer;
      border-bottom: 2px solid transparent;
      transition: all 0.3s ease;
    }

    .tab.active {
      color: #bb86fc;
      border-bottom-color: #bb86fc;
    }

    .tab:hover {
      color: #e0e0e0;
    }

    .tab-content {
      display: none;
    }

    .tab-content.active {
      display: block;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>🐦 Witter Social Network</h1>
      <p>The galaxy's premier social media platform - connecting civilizations across the stars</p>
      <p style="color: #4ade80; font-size: 0.9em; margin-top: 10px;">✨ Now featuring integrated business news, sports coverage, and market commentary!</p>
    </div>

    <div class="tabs">
      <button class="tab active" onclick="switchTab('feed')">📱 Feed</button>
      <button class="tab" onclick="switchTab('analytics')">📊 Analytics</button>
      <button class="tab" onclick="switchTab('generate')">⚡ Generate</button>
    </div>

    <div id="feed-tab" class="tab-content active">
      <div class="controls">
        <button class="btn" onclick="loadFeed()">🔄 Refresh Feed</button>
        <button class="btn secondary" onclick="loadPersonalizedFeed()">👤 Personalized</button>
        <button class="btn secondary" onclick="clearFilters()">🗑️ Clear Filters</button>
      </div>

      <div class="filters" id="filters">
        <div class="filter-group">
          <label>Civilization:</label>
          <select id="civilizationFilter" onchange="applyFilters()">
            <option value="all">All Civilizations</option>
          </select>
        </div>
        <div class="filter-group">
          <label>Star System:</label>
          <select id="starSystemFilter" onchange="applyFilters()">
            <option value="all">All Systems</option>
          </select>
        </div>
        <div class="filter-group">
          <label>Category:</label>
          <select id="categoryFilter" onchange="applyFilters()">
            <option value="all">All Categories</option>
            <option value="citizen">👥 Citizens</option>
            <option value="media">📺 Media</option>
            <option value="official">🏛️ Official</option>
            <option value="business_news">💼 Business News</option>
            <option value="sports_news">🏆 Sports News</option>
            <option value="analyst">📊 Market Analysis</option>
            <option value="sports_media">🎙️ Sports Media</option>
            <option value="fan">🏟️ Sports Fans</option>
          </select>
        </div>
      </div>

      <div id="feed-content">
        <div class="loading">
          <p>🐦 Loading Witter feed...</p>
        </div>
      </div>

      <div id="load-more-container" style="text-align: center; margin: 20px 0;">
        <div id="loading-indicator" style="display: none; color: #bb86fc;">
          <p>🐦 Loading more posts...</p>
        </div>
        <div id="end-of-feed" style="display: none; color: #a0a0a0;">
          <p>✨ You've reached the end of the feed!</p>
        </div>
      </div>
    </div>

    <div id="analytics-tab" class="tab-content">
      <div class="controls">
        <button class="btn" onclick="loadAnalytics()">📊 Load Analytics</button>
      </div>
      <div id="analytics-content">
        <div class="loading">
          <p>📊 Loading Witter analytics...</p>
        </div>
      </div>
    </div>

    <div id="generate-tab" class="tab-content">
      <div class="controls">
        <button class="btn success" onclick="generatePosts(10)">➕ Generate 10 Posts</button>
        <button class="btn success" onclick="generatePosts(25)">➕ Generate 25 Posts</button>
        <button class="btn success" onclick="generatePosts(50)">➕ Generate 50 Posts</button>
      </div>
      <div id="generate-content">
        <div class="analytics-card">
          <h3>🎲 Content Generation</h3>
          <p style="color: #a0a0a0; margin-bottom: 20px;">
            Generate new AI-powered posts with unique characters, diverse content, and realistic engagement metrics.
          </p>
          <div class="metric">
            <span class="metric-label">Current Posts</span>
            <span class="metric-value" id="current-post-count">Loading...</span>
          </div>
          <div class="metric">
            <span class="metric-label">Characters</span>
            <span class="metric-value" id="current-character-count">Loading...</span>
          </div>
        </div>
      </div>
    </div>

    <a href="/demo/hud" class="back-link">← Back to HUD</a>
  </div>

  <script>
    let currentData = {};
    let currentOffset = 0;
    let pageSize = 20;
    let currentFilters = {};
    let isLoading = false;
    let hasMore = true;
    let allPosts = [];

    // Initialize the demo
    document.addEventListener('DOMContentLoaded', function() {
      loadFilters();
      loadFeed();
      updateGenerateStats();
      
      // Add infinite scroll listener
      window.addEventListener('scroll', handleScroll);
    });
    
    function handleScroll() {
      if (isLoading || !hasMore) return;
      
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;
      
      // Load more when user scrolls to within 200px of bottom
      if (scrollTop + windowHeight >= documentHeight - 200) {
        loadMorePosts();
      }
    }
    
    async function loadMorePosts() {
      if (isLoading || !hasMore) return;
      
      document.getElementById('loading-indicator').style.display = 'block';
      document.getElementById('end-of-feed').style.display = 'none';
      
      await loadFeed(true); // append = true
      
      document.getElementById('loading-indicator').style.display = 'none';
      
      if (!hasMore) {
        document.getElementById('end-of-feed').style.display = 'block';
      }
    }

    function switchTab(tabName) {
      // Hide all tab contents
      document.querySelectorAll('.tab-content').forEach(content => {
        content.classList.remove('active');
      });
      
      // Remove active class from all tabs
      document.querySelectorAll('.tab').forEach(tab => {
        tab.classList.remove('active');
      });
      
      // Show selected tab content
      document.getElementById(tabName + '-tab').classList.add('active');
      
      // Add active class to selected tab
      event.target.classList.add('active');
      
      // Load content for the tab
      if (tabName === 'analytics') {
        loadAnalytics();
      } else if (tabName === 'generate') {
        updateGenerateStats();
      }
    }

    async function loadFilters() {
      try {
        const response = await fetch('/api/witter/filters');
        const data = await response.json();
        
        // Populate filter dropdowns
        populateSelect('civilizationFilter', data.civilizations || []);
        populateSelect('starSystemFilter', data.starSystems || []);
        
        // Handle enhanced source types structure
        const sourceTypes = data.sourceTypes || [];
        const categoryOptions = sourceTypes.map(source => source.id || source);
        populateSelect('categoryFilter', categoryOptions);
      } catch (error) {
        console.error('Failed to load filters:', error);
        // Fallback data
        populateSelect('civilizationFilter', ['Terran Republic', 'Zephyrian Collective', 'Nexus Federation']);
        populateSelect('starSystemFilter', ['Sol', 'Alpha Centauri', 'Kepler-442']);
        populateSelect('categoryFilter', ['citizen', 'media', 'official', 'business_news', 'sports_news']);
      }
    }

    function populateSelect(selectId, options) {
      const select = document.getElementById(selectId);
      const currentValue = select.value;
      
      // Clear existing options except "All"
      while (select.children.length > 1) {
        select.removeChild(select.lastChild);
      }
      
      // Add new options
      options.forEach(option => {
        const optionElement = document.createElement('option');
        optionElement.value = option;
        optionElement.textContent = option;
        select.appendChild(optionElement);
      });
      
      // Restore previous selection if it still exists
      if (options.includes(currentValue)) {
        select.value = currentValue;
      }
    }

    async function loadFeed(append = false) {
      if (isLoading) return;
      
      try {
        isLoading = true;
        
        if (!append) {
          showLoading('Loading enhanced Witter feed...');
          currentOffset = 0;
          allPosts = [];
          hasMore = true;
        }
        
        const params = new URLSearchParams({
          limit: pageSize,
          offset: currentOffset,
          ...currentFilters
        });
        
        const response = await fetch('/api/witter/feed?' + params);
        const data = await response.json();
        
        if (data.posts && data.posts.length > 0) {
          if (append) {
            allPosts = [...allPosts, ...data.posts];
          } else {
            allPosts = data.posts;
          }
          currentOffset += data.posts.length;
          hasMore = data.pagination?.hasMore || data.posts.length === pageSize;
        } else {
          hasMore = false;
        }
        
        currentData.feed = { posts: allPosts, pagination: data.pagination };
        displayFeed();
        
        isLoading = false;
      } catch (error) {
        isLoading = false;
        showError('Failed to load enhanced Witter feed: ' + error.message);
      }
    }

    async function loadPersonalizedFeed() {
      try {
        showLoading('Loading personalized enhanced feed...');
        
        // Reset for new feed type
        currentOffset = 0;
        allPosts = [];
        hasMore = true;
        
        const params = new URLSearchParams({
          limit: pageSize,
          offset: currentOffset,
          playerId: 'Commander_Alpha'
        });
        
        const response = await fetch('/api/witter/feed?' + params);
        const data = await response.json();
        
        if (data.posts && data.posts.length > 0) {
          allPosts = data.posts;
          currentOffset += data.posts.length;
          hasMore = data.pagination?.hasMore || data.posts.length === pageSize;
        } else {
          hasMore = false;
        }
        
        currentData.feed = { posts: allPosts, pagination: data.pagination };
        displayFeed();
      } catch (error) {
        showError('Failed to load personalized enhanced feed: ' + error.message);
      }
    }

    function applyFilters() {
      currentFilters = {
        civilization: document.getElementById('civilizationFilter').value,
        starSystem: document.getElementById('starSystemFilter').value,
        category: document.getElementById('categoryFilter').value
      };
      
      // Remove 'all' values
      Object.keys(currentFilters).forEach(key => {
        if (currentFilters[key] === 'all') {
          delete currentFilters[key];
        }
      });
      
      // Reset infinite scroll
      currentOffset = 0;
      allPosts = [];
      hasMore = true;
      loadFeed();
    }

    function clearFilters() {
      document.getElementById('civilizationFilter').value = 'all';
      document.getElementById('starSystemFilter').value = 'all';
      document.getElementById('categoryFilter').value = 'all';
      currentFilters = {};
      
      // Reset infinite scroll
      currentOffset = 0;
      allPosts = [];
      hasMore = true;
      loadFeed();
    }

    function displayFeed() {
      if (!currentData.feed) return;

      const posts = currentData.feed.posts;
      const feedContent = document.getElementById('feed-content');
      
      feedContent.innerHTML = \`
        <div class="feed">
          \${posts.map(post => \`
            <div class="post">
              <div class="post-header">
                <div class="avatar">\${post.avatar}</div>
                <div class="post-author-info">
                  <div class="post-author">
                    \${post.authorName || post.author}
                    \${post.verified ? '<span class="verified">✓</span>' : ''}
                    \${post.metadata?.sourceType === 'business_news' ? '<span style="background: #4ade80; color: #000; padding: 2px 6px; border-radius: 3px; font-size: 0.7em; margin-left: 5px;">💼 BUSINESS</span>' : ''}
                    \${post.metadata?.sourceType === 'sports_news' ? '<span style="background: #f59e0b; color: #000; padding: 2px 6px; border-radius: 3px; font-size: 0.7em; margin-left: 5px;">🏆 SPORTS</span>' : ''}
                    \${post.authorType === 'analyst' ? '<span style="background: #3b82f6; color: #fff; padding: 2px 6px; border-radius: 3px; font-size: 0.7em; margin-left: 5px;">📊 ANALYST</span>' : ''}
                    \${post.authorType === 'sports_media' ? '<span style="background: #8b5cf6; color: #fff; padding: 2px 6px; border-radius: 3px; font-size: 0.7em; margin-left: 5px;">📺 SPORTS MEDIA</span>' : ''}
                  </div>
                  <div class="post-meta">
                    \${post.metadata?.civilization || post.civilization} • \${post.metadata?.location || post.planet} • \${formatTimeAgo(post.timestamp)}
                  </div>
                </div>
              </div>
              
              <div class="post-content">\${post.content}</div>
              
              <div class="post-stats">
                <span>👥 \${post.followers.toLocaleString()} followers</span>
                <span>📊 \${post.engagement}% engagement</span>
                <span>📍 \${post.location}</span>
              </div>
              
              <div class="post-actions">
                <button class="action-btn" onclick="likePost('\${post.id}')">
                  ❤️ \${post.likes}
                </button>
                <button class="action-btn" onclick="sharePost('\${post.id}')">
                  🔄 \${post.shares}
                </button>
                <button class="action-btn" onclick="viewComments('\${post.id}')">
                  💬 \${post.comments}
                </button>
              </div>
            </div>
          \`).join('')}
        </div>
      \`;
    }

    async function loadAnalytics() {
      try {
        showAnalyticsLoading();
        
        const response = await fetch('/api/witter/analytics');
        const data = await response.json();
        
        currentData.analytics = data;
        displayAnalytics();
      } catch (error) {
        showAnalyticsError('Failed to load analytics: ' + error.message);
      }
    }

    function displayAnalytics() {
      if (!currentData.analytics) return;

      const analytics = currentData.analytics.analytics;
      const analyticsContent = document.getElementById('analytics-content');
      
      analyticsContent.innerHTML = \`
        <div class="analytics-dashboard">
          <div class="analytics-card">
            <h3>📊 Platform Overview</h3>
            <div class="metric">
              <span class="metric-label">Total Posts</span>
              <span class="metric-value">\${analytics.totalPosts.toLocaleString()}</span>
            </div>
            <div class="metric">
              <span class="metric-label">Total Characters</span>
              <span class="metric-value">\${analytics.totalCharacters.toLocaleString()}</span>
            </div>
            <div class="metric">
              <span class="metric-label">Total Interactions</span>
              <span class="metric-value">\${analytics.totalInteractions.toLocaleString()}</span>
            </div>
            <div class="metric">
              <span class="metric-label">Avg Engagement</span>
              <span class="metric-value">\${analytics.averageEngagement.toFixed(2)}%</span>
            </div>
          </div>

          <div class="analytics-card">
            <h3>🌌 Top Civilizations</h3>
            \${analytics.topCivilizations.map(civ => \`
              <div class="metric">
                <span class="metric-label">\${civ.civilization}</span>
                <span class="metric-value">\${civ.posts} posts</span>
              </div>
            \`).join('')}
          </div>

          <div class="analytics-card">
            <h3>⭐ Top Characters</h3>
            \${analytics.topCharacters.map(char => \`
              <div class="metric">
                <span class="metric-label">\${char.avatar} \${char.name}</span>
                <span class="metric-value">\${char.totalEngagement} engagement</span>
              </div>
            \`).join('')}
          </div>

          <div class="analytics-card">
            <h3>📈 Content Distribution</h3>
            \${Object.entries(analytics.contentDistribution).map(([category, count]) => \`
              <div class="metric">
                <span class="metric-label">\${category.replace('_', ' ')}</span>
                <span class="metric-value">\${count} posts</span>
              </div>
            \`).join('')}
          </div>
        </div>
      \`;
    }

    async function generatePosts(count) {
      try {
        showMessage(\`Generating \${count} new posts...\`, 'info');
        
        const response = await fetch('/api/witter/generate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ count })
        });
        
        const result = await response.json();
        
        if (result.success) {
          showMessage(\`Successfully generated \${result.generated} new posts!\`, 'success');
          updateGenerateStats();
          
          // Refresh feed if we're on the feed tab
          if (document.getElementById('feed-tab').classList.contains('active')) {
            loadFeed();
          }
        } else {
          showMessage('Failed to generate posts', 'error');
        }
      } catch (error) {
        showMessage('Error generating posts: ' + error.message, 'error');
      }
    }

    async function updateGenerateStats() {
      try {
        const response = await fetch('/api/witter/analytics');
        const data = await response.json();
        
        document.getElementById('current-post-count').textContent = data.analytics.totalPosts.toLocaleString();
        document.getElementById('current-character-count').textContent = data.analytics.totalCharacters.toLocaleString();
      } catch (error) {
        console.error('Failed to update generate stats:', error);
      }
    }

    async function likePost(postId) {
      try {
        const response = await fetch(\`/api/witter/posts/\${postId}/like\`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ playerId: 'Commander_Alpha' })
        });
        
        const result = await response.json();
        if (result.success) {
          showMessage('Post liked! ❤️', 'success');
          // Refresh the current view
          if (currentData.feed) {
            loadFeed();
          }
        }
      } catch (error) {
        showMessage('Error liking post: ' + error.message, 'error');
      }
    }

    async function viewComments(postId) {
      try {
        const response = await fetch(\`/api/witter/posts/\${postId}/comments\`);
        const data = await response.json();
        
        if (data.success && data.comments.length > 0) {
          let commentsText = \`Comments for this post:\\n\\n\`;
          data.comments.forEach(comment => {
            commentsText += \`\${comment.avatar} \${comment.author}\${comment.verified ? ' ✓' : ''}:\\n\${comment.content}\\n\\n\`;
          });
          alert(commentsText);
        } else {
          alert('No comments yet for this post.');
        }
      } catch (error) {
        showMessage('Error loading comments: ' + error.message, 'error');
      }
    }

    function sharePost(postId) {
      showMessage('Post shared! 🔄', 'success');
    }

    // Pagination functions removed - using infinite scroll instead

    function formatTimeAgo(timestamp) {
      const now = new Date();
      const postTime = new Date(timestamp);
      const diffMs = now - postTime;
      const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
      const diffDays = Math.floor(diffHours / 24);
      
      if (diffDays > 0) {
        return \`\${diffDays}d ago\`;
      } else if (diffHours > 0) {
        return \`\${diffHours}h ago\`;
      } else {
        return 'Just now';
      }
    }

    function showLoading(message) {
      document.getElementById('feed-content').innerHTML = \`
        <div class="loading">
          <p>🐦 \${message}</p>
        </div>
      \`;
    }

    function showAnalyticsLoading() {
      document.getElementById('analytics-content').innerHTML = \`
        <div class="loading">
          <p>📊 Loading analytics...</p>
        </div>
      \`;
    }

    function showError(message) {
      document.getElementById('feed-content').innerHTML = \`
        <div class="error">
          <p>❌ \${message}</p>
        </div>
      \`;
    }

    function showAnalyticsError(message) {
      document.getElementById('analytics-content').innerHTML = \`
        <div class="error">
          <p>❌ \${message}</p>
        </div>
      \`;
    }

    function showMessage(message, type) {
      const messageDiv = document.createElement('div');
      messageDiv.className = type === 'success' ? 'success' : type === 'error' ? 'error' : 'info';
      messageDiv.innerHTML = \`<p>\${message}</p>\`;
      
      const container = document.querySelector('.container');
      container.insertBefore(messageDiv, container.firstChild);
      
      setTimeout(() => {
        messageDiv.remove();
      }, 3000);
    }
  </script>
</body>
</html>`;
}

module.exports = { getWitterDemo };

