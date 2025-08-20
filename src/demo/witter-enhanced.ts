import { Router } from 'express';

const witterEnhancedDemo = Router();

// Enhanced Witter Demo Page with Business News & Sports Integration
witterEnhancedDemo.get('/demo/witter-enhanced', (_req, res) => {
  res.type('html').send(`<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Enhanced Witter Feed Demo</title>
    <style>
      body { 
        font-family: system-ui, sans-serif; 
        margin: 0; 
        padding: 20px; 
        background: linear-gradient(135deg, #0f0f23, #1a1a2e); 
        color: #e0e0e0; 
        min-height: 100vh;
      }
      .container { 
        max-width: 1200px; 
        margin: 0 auto; 
      }
      h1 { 
        color: #4ade80; 
        text-align: center; 
        margin-bottom: 30px; 
        font-size: 2.5em;
        text-shadow: 0 0 20px rgba(74, 222, 128, 0.3);
      }
      .controls { 
        background: rgba(26, 26, 46, 0.8); 
        padding: 20px; 
        border-radius: 12px; 
        margin-bottom: 20px; 
        border: 1px solid #333;
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
        gap: 15px;
        align-items: center;
      }
      .control-group {
        display: flex;
        flex-direction: column;
        gap: 5px;
      }
      label { 
        font-weight: bold; 
        color: #fbbf24; 
        font-size: 0.9em;
      }
      input, select { 
        background: #333; 
        color: #e0e0e0; 
        border: 1px solid #555; 
        padding: 8px 12px; 
        border-radius: 6px; 
        font-size: 0.9em;
      }
      button { 
        background: linear-gradient(135deg, #4ade80, #22c55e); 
        color: #000; 
        border: none; 
        padding: 12px 20px; 
        border-radius: 8px; 
        cursor: pointer; 
        font-weight: bold;
        transition: all 0.3s ease;
        box-shadow: 0 4px 15px rgba(74, 222, 128, 0.3);
      }
      button:hover { 
        transform: translateY(-2px);
        box-shadow: 0 6px 20px rgba(74, 222, 128, 0.4);
      }
      .feed-container {
        display: grid;
        grid-template-columns: 1fr 300px;
        gap: 20px;
      }
      .feed {
        background: rgba(26, 26, 46, 0.8);
        border-radius: 12px;
        border: 1px solid #333;
        max-height: 80vh;
        overflow-y: auto;
      }
      .post {
        padding: 20px;
        border-bottom: 1px solid #333;
        transition: background 0.2s ease;
      }
      .post:hover {
        background: rgba(42, 42, 42, 0.5);
      }
      .post:last-child {
        border-bottom: none;
      }
      .post-header {
        display: flex;
        align-items: center;
        gap: 12px;
        margin-bottom: 12px;
      }
      .avatar {
        font-size: 1.5em;
        width: 40px;
        height: 40px;
        display: flex;
        align-items: center;
        justify-content: center;
        background: rgba(74, 222, 128, 0.2);
        border-radius: 50%;
      }
      .author-info {
        flex: 1;
      }
      .author-name {
        font-weight: bold;
        color: #4ade80;
      }
      .author-type {
        font-size: 0.8em;
        color: #888;
        text-transform: uppercase;
      }
      .timestamp {
        font-size: 0.8em;
        color: #666;
      }
      .post-content {
        margin-bottom: 15px;
        line-height: 1.5;
      }
      .post-category {
        display: inline-block;
        padding: 4px 8px;
        border-radius: 12px;
        font-size: 0.7em;
        font-weight: bold;
        text-transform: uppercase;
        margin-bottom: 10px;
      }
      .category-business_news { background: rgba(59, 130, 246, 0.2); color: #93c5fd; }
      .category-sports_news { background: rgba(239, 68, 68, 0.2); color: #fca5a5; }
      .category-earnings { background: rgba(34, 197, 94, 0.2); color: #86efac; }
      .category-market_analysis { background: rgba(139, 92, 246, 0.2); color: #c4b5fd; }
      .category-game_results { background: rgba(251, 191, 36, 0.2); color: #fbbf24; }
      .category-olympics { background: rgba(236, 72, 153, 0.2); color: #f9a8d4; }
      .category-social { background: rgba(107, 114, 128, 0.2); color: #d1d5db; }
      .post-metrics {
        display: flex;
        gap: 20px;
        font-size: 0.9em;
        color: #888;
      }
      .metric {
        display: flex;
        align-items: center;
        gap: 5px;
      }
      .sidebar {
        display: flex;
        flex-direction: column;
        gap: 20px;
      }
      .stats-panel {
        background: rgba(26, 26, 46, 0.8);
        padding: 20px;
        border-radius: 12px;
        border: 1px solid #333;
      }
      .stats-panel h3 {
        color: #fbbf24;
        margin-top: 0;
        margin-bottom: 15px;
      }
      .stat-item {
        display: flex;
        justify-content: space-between;
        margin-bottom: 8px;
        padding: 5px 0;
        border-bottom: 1px solid #333;
      }
      .stat-item:last-child {
        border-bottom: none;
      }
      .loading {
        text-align: center;
        padding: 40px;
        color: #888;
      }
      .error {
        background: rgba(239, 68, 68, 0.2);
        border: 1px solid #ef4444;
        color: #fca5a5;
        padding: 15px;
        border-radius: 8px;
        margin: 20px 0;
      }
      .success {
        background: rgba(34, 197, 94, 0.2);
        border: 1px solid #22c55e;
        color: #86efac;
        padding: 15px;
        border-radius: 8px;
        margin: 20px 0;
      }
      .filter-tags {
        display: flex;
        flex-wrap: wrap;
        gap: 8px;
        margin-top: 10px;
      }
      .filter-tag {
        background: rgba(74, 222, 128, 0.2);
        color: #4ade80;
        padding: 4px 8px;
        border-radius: 12px;
        font-size: 0.8em;
        cursor: pointer;
        transition: all 0.2s ease;
      }
      .filter-tag:hover {
        background: rgba(74, 222, 128, 0.3);
      }
      .filter-tag.active {
        background: #4ade80;
        color: #000;
      }
    </style>
  </head>
  <body>
    <div class="container">
      <h1>📱 Enhanced Witter Feed</h1>
      
      <div class="controls">
        <div class="control-group">
          <label>Civilization:</label>
          <select id="civilization">
            <option value="1">Terran Republic</option>
            <option value="2">Alpha Centauri Alliance</option>
            <option value="3">Vega Confederation</option>
          </select>
        </div>
        
        <div class="control-group">
          <label>Content Types:</label>
          <div style="display: flex; gap: 10px; margin-top: 5px;">
            <label style="display: flex; align-items: center; gap: 5px; font-weight: normal;">
              <input type="checkbox" id="includeBusinessNews" checked>
              Business News
            </label>
            <label style="display: flex; align-items: center; gap: 5px; font-weight: normal;">
              <input type="checkbox" id="includeSportsNews" checked>
              Sports News
            </label>
          </div>
        </div>
        
        <div class="control-group">
          <label>Source Filter:</label>
          <select id="sourceType">
            <option value="all">All Sources</option>
            <option value="citizen">Citizens</option>
            <option value="media">Media</option>
            <option value="business_news">Business News</option>
            <option value="sports_news">Sports News</option>
            <option value="analyst">Analysts</option>
          </select>
        </div>
        
        <div class="control-group">
          <label>Posts Limit:</label>
          <input type="number" id="limit" value="20" min="5" max="50">
        </div>
        
        <button onclick="loadEnhancedFeed()">🔄 Load Enhanced Feed</button>
        <button onclick="loadBusinessNews()">💼 Business Only</button>
        <button onclick="loadSportsNews()">🏆 Sports Only</button>
      </div>

      <div class="feed-container">
        <div class="feed" id="feed">
          <div class="loading">
            Click "Load Enhanced Feed" to see the integrated business news and sports content!
          </div>
        </div>
        
        <div class="sidebar">
          <div class="stats-panel">
            <h3>📊 Content Breakdown</h3>
            <div class="stat-item">
              <span>Citizen Posts:</span>
              <span id="citizenCount">-</span>
            </div>
            <div class="stat-item">
              <span>Business News:</span>
              <span id="businessCount">-</span>
            </div>
            <div class="stat-item">
              <span>Sports News:</span>
              <span id="sportsCount">-</span>
            </div>
            <div class="stat-item">
              <span>Total Posts:</span>
              <span id="totalCount">-</span>
            </div>
          </div>
          
          <div class="stats-panel">
            <h3>🎯 Quick Filters</h3>
            <div class="filter-tags">
              <div class="filter-tag active" onclick="filterByCategory('all')">All</div>
              <div class="filter-tag" onclick="filterByCategory('business_news')">Business</div>
              <div class="filter-tag" onclick="filterByCategory('sports_news')">Sports</div>
              <div class="filter-tag" onclick="filterByCategory('earnings')">Earnings</div>
              <div class="filter-tag" onclick="filterByCategory('game_results')">Games</div>
              <div class="filter-tag" onclick="filterByCategory('olympics')">Olympics</div>
            </div>
          </div>
          
          <div class="stats-panel">
            <h3>ℹ️ About Enhanced Feed</h3>
            <p style="font-size: 0.9em; line-height: 1.4; color: #ccc;">
              This enhanced Witter feed integrates:
            </p>
            <ul style="font-size: 0.8em; color: #aaa; margin: 10px 0; padding-left: 20px;">
              <li>📰 Business news & market commentary</li>
              <li>🏆 Sports news & fan reactions</li>
              <li>👥 Citizen posts & social content</li>
              <li>🏛️ Official government updates</li>
              <li>📊 Real-time market data integration</li>
              <li>🎮 Futuristic sports coverage</li>
            </ul>
          </div>
        </div>
      </div>
    </div>

    <script>
      let currentPosts = [];
      let currentFilter = 'all';

      async function loadEnhancedFeed() {
        const civilization = document.getElementById('civilization').value;
        const includeBusinessNews = document.getElementById('includeBusinessNews').checked;
        const includeSportsNews = document.getElementById('includeSportsNews').checked;
        const sourceType = document.getElementById('sourceType').value;
        const limit = document.getElementById('limit').value;

        const feedElement = document.getElementById('feed');
        feedElement.innerHTML = '<div class="loading">Loading enhanced feed...</div>';

        try {
          const params = new URLSearchParams({
            civilization,
            limit,
            sourceType,
            includeBusinessNews: includeBusinessNews.toString(),
            includeSportsNews: includeSportsNews.toString()
          });

          const response = await fetch(\`/api/witter/enhanced-feed?\${params}\`);
          const data = await response.json();

          if (response.ok) {
            currentPosts = data.posts;
            displayPosts(currentPosts);
            updateStats(data.contentBreakdown);
            showSuccess(\`Loaded \${data.posts.length} posts successfully!\`);
          } else {
            showError(\`Error: \${data.error}\`);
          }
        } catch (error) {
          showError(\`Failed to load feed: \${error.message}\`);
        }
      }

      async function loadBusinessNews() {
        const civilization = document.getElementById('civilization').value;
        const limit = Math.floor(parseInt(document.getElementById('limit').value) * 0.6);

        const feedElement = document.getElementById('feed');
        feedElement.innerHTML = '<div class="loading">Loading business news...</div>';

        try {
          const response = await fetch(\`/api/witter/business-news/\${civilization}?limit=\${limit}\`);
          const data = await response.json();

          if (response.ok) {
            const posts = data.businessNews.map(news => ({
              ...news,
              timestamp: news.timestamp || new Date().toISOString(),
              likes: news.metrics?.likes || 0,
              shares: news.metrics?.shares || 0,
              comments: news.metrics?.comments || 0
            }));
            
            currentPosts = posts;
            displayPosts(currentPosts);
            updateStats({ businessNews: posts.length, citizenPosts: 0, sportsNews: 0, total: posts.length });
            showSuccess(\`Loaded \${posts.length} business news posts!\`);
          } else {
            showError(\`Error: \${data.error}\`);
          }
        } catch (error) {
          showError(\`Failed to load business news: \${error.message}\`);
        }
      }

      async function loadSportsNews() {
        const civilization = document.getElementById('civilization').value;
        const limit = Math.floor(parseInt(document.getElementById('limit').value) * 0.6);

        const feedElement = document.getElementById('feed');
        feedElement.innerHTML = '<div class="loading">Loading sports news...</div>';

        try {
          const response = await fetch(\`/api/witter/sports-news/\${civilization}?limit=\${limit}\`);
          const data = await response.json();

          if (response.ok) {
            const posts = data.sportsNews.map(news => ({
              ...news,
              timestamp: news.timestamp || new Date().toISOString(),
              likes: news.metrics?.likes || 0,
              shares: news.metrics?.shares || 0,
              comments: news.metrics?.comments || 0
            }));
            
            currentPosts = posts;
            displayPosts(currentPosts);
            updateStats({ sportsNews: posts.length, citizenPosts: 0, businessNews: 0, total: posts.length });
            showSuccess(\`Loaded \${posts.length} sports news posts!\`);
          } else {
            showError(\`Error: \${data.error}\`);
          }
        } catch (error) {
          showError(\`Failed to load sports news: \${error.message}\`);
        }
      }

      function displayPosts(posts) {
        const feedElement = document.getElementById('feed');
        
        if (posts.length === 0) {
          feedElement.innerHTML = '<div class="loading">No posts found matching the current filters.</div>';
          return;
        }

        const postsHtml = posts.map(post => {
          const category = post.metadata?.category || 'social';
          const categoryClass = \`category-\${category.toLowerCase()}\`;
          const timestamp = new Date(post.timestamp).toLocaleString();
          
          return \`
            <div class="post" data-category="\${category.toLowerCase()}">
              <div class="post-header">
                <div class="avatar">\${post.authorAvatar || '👤'}</div>
                <div class="author-info">
                  <div class="author-name">\${post.authorName}</div>
                  <div class="author-type">\${post.authorType}</div>
                </div>
                <div class="timestamp">\${timestamp}</div>
              </div>
              
              <div class="post-category \${categoryClass}">
                \${category.replace('_', ' ')}
              </div>
              
              <div class="post-content">
                \${post.content}
              </div>
              
              <div class="post-metrics">
                <div class="metric">
                  <span>❤️</span>
                  <span>\${post.likes || 0}</span>
                </div>
                <div class="metric">
                  <span>🔄</span>
                  <span>\${post.shares || 0}</span>
                </div>
                <div class="metric">
                  <span>💬</span>
                  <span>\${post.comments || 0}</span>
                </div>
              </div>
            </div>
          \`;
        }).join('');

        feedElement.innerHTML = postsHtml;
      }

      function filterByCategory(category) {
        // Update active filter tag
        document.querySelectorAll('.filter-tag').forEach(tag => {
          tag.classList.remove('active');
        });
        event.target.classList.add('active');
        
        currentFilter = category;
        
        if (category === 'all') {
          displayPosts(currentPosts);
        } else {
          const filteredPosts = currentPosts.filter(post => 
            post.metadata?.category?.toLowerCase() === category ||
            post.metadata?.sourceType === category
          );
          displayPosts(filteredPosts);
        }
      }

      function updateStats(breakdown) {
        document.getElementById('citizenCount').textContent = breakdown.citizenPosts || 0;
        document.getElementById('businessCount').textContent = breakdown.businessNews || 0;
        document.getElementById('sportsCount').textContent = breakdown.sportsNews || 0;
        document.getElementById('totalCount').textContent = breakdown.total || 0;
      }

      function showSuccess(message) {
        const existing = document.querySelector('.success, .error');
        if (existing) existing.remove();
        
        const successDiv = document.createElement('div');
        successDiv.className = 'success';
        successDiv.textContent = message;
        
        document.querySelector('.controls').after(successDiv);
        setTimeout(() => successDiv.remove(), 5000);
      }

      function showError(message) {
        const existing = document.querySelector('.success, .error');
        if (existing) existing.remove();
        
        const errorDiv = document.createElement('div');
        errorDiv.className = 'error';
        errorDiv.textContent = message;
        
        document.querySelector('.controls').after(errorDiv);
        setTimeout(() => errorDiv.remove(), 8000);
      }

      // Load initial feed
      setTimeout(() => {
        showSuccess('Enhanced Witter ready! Load the feed to see business news and sports integration.');
      }, 500);
    </script>
  </body>
  </html>`);
});

export default witterEnhancedDemo;
