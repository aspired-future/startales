/**
 * Dynamic News Generation System Demo
 * 
 * Interactive demo interface for testing and demonstrating the AI-powered
 * news generation system with multi-perspective outlets and realistic bias.
 */

import { Router, Request, Response } from 'express';

const router = Router();

/**
 * News Generation Demo Page
 * GET /demo/news
 */
router.get('/demo/news', (req: Request, res: Response) => {
  const html = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Dynamic News Generation System Demo</title>
    <style>
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            margin: 0;
            padding: 20px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh;
            color: #333;
        }
        
        .container {
            max-width: 1200px;
            margin: 0 auto;
            background: white;
            border-radius: 12px;
            box-shadow: 0 10px 30px rgba(0,0,0,0.2);
            overflow: hidden;
        }
        
        .header {
            background: linear-gradient(135deg, #2c3e50 0%, #34495e 100%);
            color: white;
            padding: 30px;
            text-align: center;
        }
        
        .header h1 {
            margin: 0;
            font-size: 2.5em;
            font-weight: 300;
        }
        
        .header p {
            margin: 10px 0 0 0;
            opacity: 0.9;
            font-size: 1.1em;
        }
        
        .content {
            padding: 30px;
        }
        
        .section {
            margin-bottom: 40px;
            padding: 25px;
            border: 1px solid #e1e8ed;
            border-radius: 8px;
            background: #f8f9fa;
        }
        
        .section h2 {
            margin: 0 0 20px 0;
            color: #2c3e50;
            font-size: 1.5em;
            display: flex;
            align-items: center;
            gap: 10px;
        }
        
        .form-group {
            margin-bottom: 20px;
        }
        
        label {
            display: block;
            margin-bottom: 8px;
            font-weight: 600;
            color: #555;
        }
        
        input, select, textarea {
            width: 100%;
            padding: 12px;
            border: 2px solid #ddd;
            border-radius: 6px;
            font-size: 14px;
            transition: border-color 0.3s;
            box-sizing: border-box;
        }
        
        input:focus, select:focus, textarea:focus {
            outline: none;
            border-color: #667eea;
        }
        
        textarea {
            height: 120px;
            resize: vertical;
        }
        
        .checkbox-group {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 10px;
            margin-top: 10px;
        }
        
        .checkbox-item {
            display: flex;
            align-items: center;
            gap: 8px;
        }
        
        .checkbox-item input[type="checkbox"] {
            width: auto;
            margin: 0;
        }
        
        .btn {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            border: none;
            padding: 12px 24px;
            border-radius: 6px;
            cursor: pointer;
            font-size: 16px;
            font-weight: 600;
            transition: transform 0.2s, box-shadow 0.2s;
            margin-right: 10px;
        }
        
        .btn:hover {
            transform: translateY(-2px);
            box-shadow: 0 5px 15px rgba(102, 126, 234, 0.4);
        }
        
        .btn:disabled {
            opacity: 0.6;
            cursor: not-allowed;
            transform: none;
        }
        
        .btn-secondary {
            background: linear-gradient(135deg, #95a5a6 0%, #7f8c8d 100%);
        }
        
        .results {
            margin-top: 30px;
            padding: 20px;
            background: white;
            border-radius: 8px;
            border: 1px solid #e1e8ed;
        }
        
        .loading {
            text-align: center;
            padding: 40px;
            color: #666;
        }
        
        .spinner {
            display: inline-block;
            width: 40px;
            height: 40px;
            border: 4px solid #f3f3f3;
            border-top: 4px solid #667eea;
            border-radius: 50%;
            animation: spin 1s linear infinite;
            margin-bottom: 20px;
        }
        
        @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }
        
        .article {
            margin-bottom: 30px;
            padding: 20px;
            border: 1px solid #e1e8ed;
            border-radius: 8px;
            background: white;
        }
        
        .article-header {
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
            margin-bottom: 15px;
            flex-wrap: wrap;
            gap: 10px;
        }
        
        .article-meta {
            display: flex;
            flex-wrap: wrap;
            gap: 10px;
            font-size: 12px;
            color: #666;
        }
        
        .badge {
            padding: 4px 8px;
            border-radius: 4px;
            font-size: 11px;
            font-weight: 600;
            text-transform: uppercase;
        }
        
        .badge-breaking { background: #e74c3c; color: white; }
        .badge-urgent { background: #f39c12; color: white; }
        .badge-high { background: #e67e22; color: white; }
        .badge-medium { background: #3498db; color: white; }
        .badge-low { background: #95a5a6; color: white; }
        
        .badge-civilization { background: #9b59b6; color: white; }
        .badge-galactic { background: #2c3e50; color: white; }
        .badge-national { background: #27ae60; color: white; }
        .badge-local { background: #16a085; color: white; }
        
        .article h3 {
            margin: 0 0 10px 0;
            color: #2c3e50;
            font-size: 1.3em;
            line-height: 1.3;
        }
        
        .article h4 {
            margin: 0 0 15px 0;
            color: #7f8c8d;
            font-size: 1em;
            font-weight: 400;
            font-style: italic;
        }
        
        .article-content {
            line-height: 1.6;
            color: #444;
            margin-bottom: 15px;
        }
        
        .article-summary {
            background: #f8f9fa;
            padding: 15px;
            border-left: 4px solid #667eea;
            font-style: italic;
            color: #666;
        }
        
        .outlet-info {
            display: flex;
            align-items: center;
            gap: 10px;
            margin-bottom: 10px;
            font-size: 14px;
        }
        
        .outlet-name {
            font-weight: 600;
            color: #2c3e50;
        }
        
        .outlet-type {
            padding: 2px 6px;
            background: #ecf0f1;
            border-radius: 3px;
            font-size: 11px;
            color: #7f8c8d;
        }
        
        .metrics {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
            gap: 15px;
            margin-top: 20px;
            padding: 20px;
            background: #f8f9fa;
            border-radius: 8px;
        }
        
        .metric {
            text-align: center;
        }
        
        .metric-value {
            font-size: 1.5em;
            font-weight: 600;
            color: #2c3e50;
            display: block;
        }
        
        .metric-label {
            font-size: 12px;
            color: #7f8c8d;
            text-transform: uppercase;
            letter-spacing: 0.5px;
        }
        
        .error {
            background: #fee;
            border: 1px solid #fcc;
            color: #c33;
            padding: 15px;
            border-radius: 6px;
            margin: 20px 0;
        }
        
        .success {
            background: #efe;
            border: 1px solid #cfc;
            color: #363;
            padding: 15px;
            border-radius: 6px;
            margin: 20px 0;
        }
        
        .tabs {
            display: flex;
            border-bottom: 2px solid #e1e8ed;
            margin-bottom: 20px;
        }
        
        .tab {
            padding: 12px 20px;
            cursor: pointer;
            border-bottom: 2px solid transparent;
            transition: all 0.3s;
            font-weight: 600;
        }
        
        .tab:hover {
            background: #f8f9fa;
        }
        
        .tab.active {
            border-bottom-color: #667eea;
            color: #667eea;
        }
        
        .tab-content {
            display: none;
        }
        
        .tab-content.active {
            display: block;
        }
        
        @media (max-width: 768px) {
            .container {
                margin: 10px;
                border-radius: 8px;
            }
            
            .content {
                padding: 20px;
            }
            
            .header {
                padding: 20px;
            }
            
            .header h1 {
                font-size: 2em;
            }
            
            .checkbox-group {
                grid-template-columns: 1fr;
            }
            
            .article-header {
                flex-direction: column;
                align-items: flex-start;
            }
            
            .metrics {
                grid-template-columns: repeat(2, 1fr);
            }
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🗞️ Dynamic News Generation System</h1>
            <p>AI-powered news generation with multi-perspective outlets and realistic bias</p>
        </div>
        
        <div class="content">
            <div class="tabs">
                <div class="tab active" onclick="switchTab('generate')">Generate News</div>
                <div class="tab" onclick="switchTab('outlets')">News Outlets</div>
                <div class="tab" onclick="switchTab('analytics')">Analytics</div>
                <div class="tab" onclick="switchTab('trends')">Trends</div>
            </div>
            
            <!-- Generate News Tab -->
            <div id="generate-tab" class="tab-content active">
                <div class="section">
                    <h2>📰 Generate News Articles</h2>
                    
                    <div class="form-group">
                        <label for="campaignId">Campaign ID:</label>
                        <input type="number" id="campaignId" value="1" min="1">
                    </div>
                    
                    <div class="form-group">
                        <label for="tickId">Tick ID:</label>
                        <input type="number" id="tickId" value="1" min="1">
                    </div>
                    
                    <div class="form-group">
                        <label for="maxArticles">Maximum Articles:</label>
                        <input type="number" id="maxArticles" value="5" min="1" max="20">
                    </div>
                    
                    <div class="form-group">
                        <label>News Scopes:</label>
                        <div class="checkbox-group">
                            <div class="checkbox-item">
                                <input type="checkbox" id="scope-local" value="local">
                                <label for="scope-local">Local</label>
                            </div>
                            <div class="checkbox-item">
                                <input type="checkbox" id="scope-national" value="national" checked>
                                <label for="scope-national">National</label>
                            </div>
                            <div class="checkbox-item">
                                <input type="checkbox" id="scope-civilization" value="civilization" checked>
                                <label for="scope-civilization">Civilization</label>
                            </div>
                            <div class="checkbox-item">
                                <input type="checkbox" id="scope-galactic" value="galactic" checked>
                                <label for="scope-galactic">Galactic</label>
                            </div>
                        </div>
                    </div>
                    
                    <div class="form-group">
                        <label>News Categories:</label>
                        <div class="checkbox-group">
                            <div class="checkbox-item">
                                <input type="checkbox" id="cat-politics" value="politics" checked>
                                <label for="cat-politics">Politics</label>
                            </div>
                            <div class="checkbox-item">
                                <input type="checkbox" id="cat-economy" value="economy" checked>
                                <label for="cat-economy">Economy</label>
                            </div>
                            <div class="checkbox-item">
                                <input type="checkbox" id="cat-military" value="military" checked>
                                <label for="cat-military">Military</label>
                            </div>
                            <div class="checkbox-item">
                                <input type="checkbox" id="cat-technology" value="technology" checked>
                                <label for="cat-technology">Technology</label>
                            </div>
                            <div class="checkbox-item">
                                <input type="checkbox" id="cat-social" value="social" checked>
                                <label for="cat-social">Social</label>
                            </div>
                            <div class="checkbox-item">
                                <input type="checkbox" id="cat-diplomacy" value="diplomacy">
                                <label for="cat-diplomacy">Diplomacy</label>
                            </div>
                            <div class="checkbox-item">
                                <input type="checkbox" id="cat-space" value="space">
                                <label for="cat-space">Space</label>
                            </div>
                            <div class="checkbox-item">
                                <input type="checkbox" id="cat-trade" value="trade">
                                <label for="cat-trade">Trade</label>
                            </div>
                        </div>
                    </div>
                    
                    <div class="form-group">
                        <label for="simulationData">Simulation Results (JSON):</label>
                        <textarea id="simulationData" placeholder="Enter simulation results JSON or leave empty for demo data...">{
  "economy": {
    "gdpChange": 0.03,
    "unemploymentChange": -0.01,
    "tradeBalance": 1500000
  },
  "politics": {
    "approvalChange": 0.05,
    "newPolicies": ["Economic Stimulus Package"]
  },
  "military": {
    "budgetChange": 0.02
  },
  "technology": {
    "discoveries": ["Quantum Computing Breakthrough"],
    "researchProgress": 0.25
  },
  "social": {
    "moodChange": 0.1,
    "culturalEvents": ["Science Festival"]
  }
}</textarea>
                    </div>
                    
                    <div class="form-group">
                        <div class="checkbox-item">
                            <input type="checkbox" id="perspectiveDiversity" checked>
                            <label for="perspectiveDiversity">Ensure Perspective Diversity</label>
                        </div>
                    </div>
                    
                    <div class="form-group">
                        <div class="checkbox-item">
                            <input type="checkbox" id="includeBreaking" checked>
                            <label for="includeBreaking">Include Breaking News</label>
                        </div>
                    </div>
                    
                    <button class="btn" onclick="generateNews()">🚀 Generate News</button>
                    <button class="btn btn-secondary" onclick="generateBreakingNews()">⚡ Generate Breaking News</button>
                </div>
                
                <div id="news-results" class="results" style="display: none;"></div>
            </div>
            
            <!-- News Outlets Tab -->
            <div id="outlets-tab" class="tab-content">
                <div class="section">
                    <h2>📺 News Outlets</h2>
                    <button class="btn" onclick="loadOutlets()">🔄 Load Outlets</button>
                </div>
                
                <div id="outlets-results" class="results" style="display: none;"></div>
            </div>
            
            <!-- Analytics Tab -->
            <div id="analytics-tab" class="tab-content">
                <div class="section">
                    <h2>📊 News Analytics</h2>
                    
                    <div class="form-group">
                        <label for="analyticsCampaignId">Campaign ID:</label>
                        <input type="number" id="analyticsCampaignId" value="1" min="1">
                    </div>
                    
                    <div class="form-group">
                        <label for="analyticsTickId">Tick ID (optional):</label>
                        <input type="number" id="analyticsTickId" placeholder="Leave empty for all ticks">
                    </div>
                    
                    <button class="btn" onclick="loadAnalytics()">📈 Load Analytics</button>
                </div>
                
                <div id="analytics-results" class="results" style="display: none;"></div>
            </div>
            
            <!-- Trends Tab -->
            <div id="trends-tab" class="tab-content">
                <div class="section">
                    <h2>📈 Trending Topics</h2>
                    
                    <div class="form-group">
                        <label for="trendsCampaignId">Campaign ID:</label>
                        <input type="number" id="trendsCampaignId" value="1" min="1">
                    </div>
                    
                    <div class="form-group">
                        <label for="trendsTimeframe">Timeframe:</label>
                        <select id="trendsTimeframe">
                            <option value="24h">Last 24 Hours</option>
                            <option value="7d">Last 7 Days</option>
                        </select>
                    </div>
                    
                    <button class="btn" onclick="loadTrends()">🔥 Load Trends</button>
                </div>
                
                <div id="trends-results" class="results" style="display: none;"></div>
            </div>
        </div>
    </div>

    <script>
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
        }
        
        function getCheckedValues(name) {
            return Array.from(document.querySelectorAll('input[id^="' + name + '"]:checked'))
                .map(cb => cb.value);
        }
        
        async function generateNews() {
            const resultsDiv = document.getElementById('news-results');
            resultsDiv.style.display = 'block';
            resultsDiv.innerHTML = '<div class="loading"><div class="spinner"></div><p>Generating news articles...</p></div>';
            
            try {
                const requestData = {
                    campaignId: parseInt(document.getElementById('campaignId').value),
                    tickId: parseInt(document.getElementById('tickId').value),
                    maxArticles: parseInt(document.getElementById('maxArticles').value),
                    scope: getCheckedValues('scope-'),
                    categories: getCheckedValues('cat-'),
                    perspectiveDiversity: document.getElementById('perspectiveDiversity').checked,
                    includeBreaking: document.getElementById('includeBreaking').checked
                };
                
                const simulationData = document.getElementById('simulationData').value.trim();
                if (simulationData) {
                    try {
                        requestData.simulationResults = JSON.parse(simulationData);
                    } catch (e) {
                        throw new Error('Invalid JSON in simulation data: ' + e.message);
                    }
                }
                
                const response = await fetch('/api/news/generate', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(requestData)
                });
                
                const result = await response.json();
                
                if (result.success) {
                    displayNewsResults(result.data);
                } else {
                    resultsDiv.innerHTML = '<div class="error">Error: ' + (result.error || result.message || 'Unknown error') + '</div>';
                }
            } catch (error) {
                resultsDiv.innerHTML = '<div class="error">Error: ' + error.message + '</div>';
            }
        }
        
        async function generateBreakingNews() {
            const resultsDiv = document.getElementById('news-results');
            resultsDiv.style.display = 'block';
            resultsDiv.innerHTML = '<div class="loading"><div class="spinner"></div><p>Generating breaking news...</p></div>';
            
            try {
                const requestData = {
                    campaignId: parseInt(document.getElementById('campaignId').value),
                    tickId: parseInt(document.getElementById('tickId').value),
                    maxArticles: 3,
                    scope: ['civilization', 'galactic'],
                    categories: ['politics', 'military', 'economy'],
                    includeBreaking: true,
                    minPriority: 'urgent',
                    simulationResults: {
                        politics: {
                            leadershipChange: true,
                            approvalChange: -0.2
                        },
                        military: {
                            actions: ['Emergency Defense Mobilization'],
                            budgetChange: 0.15
                        },
                        economy: {
                            gdpChange: -0.08,
                            unemploymentChange: 0.05
                        }
                    }
                };
                
                const response = await fetch('/api/news/breaking', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(requestData)
                });
                
                const result = await response.json();
                
                if (result.success) {
                    displayNewsResults(result.data);
                } else {
                    resultsDiv.innerHTML = '<div class="error">Error: ' + (result.error || result.message || 'Unknown error') + '</div>';
                }
            } catch (error) {
                resultsDiv.innerHTML = '<div class="error">Error: ' + error.message + '</div>';
            }
        }
        
        function displayNewsResults(data) {
            const resultsDiv = document.getElementById('news-results');
            
            let html = '<h3>📊 Generation Results</h3>';
            
            // Generation metrics
            html += '<div class="metrics">';
            html += '<div class="metric"><span class="metric-value">' + data.articlesGenerated + '</span><span class="metric-label">Articles Generated</span></div>';
            html += '<div class="metric"><span class="metric-value">' + Math.round(data.generationStats.averageConfidence * 100) + '%</span><span class="metric-label">Avg Confidence</span></div>';
            html += '<div class="metric"><span class="metric-value">' + data.generationStats.perspectivesCovered + '</span><span class="metric-label">Perspectives</span></div>';
            html += '<div class="metric"><span class="metric-value">' + (data.generationStats.totalTime / 1000).toFixed(1) + 's</span><span class="metric-label">Generation Time</span></div>';
            html += '<div class="metric"><span class="metric-value">' + Math.round(data.qualityMetrics.perspectiveDiversity * 100) + '%</span><span class="metric-label">Diversity Score</span></div>';
            html += '<div class="metric"><span class="metric-value">' + Math.round(data.qualityMetrics.engagementPotential * 100) + '%</span><span class="metric-label">Engagement Potential</span></div>';
            html += '</div>';
            
            // Articles
            if (data.articles && data.articles.length > 0) {
                html += '<h3>📰 Generated Articles</h3>';
                
                data.articles.forEach(article => {
                    html += '<div class="article">';
                    
                    // Article header with metadata
                    html += '<div class="article-header">';
                    html += '<div>';
                    html += '<div class="outlet-info">';
                    html += '<span class="outlet-name">' + article.outletName + '</span>';
                    html += '<span class="outlet-type">' + article.outletId + '</span>';
                    html += '</div>';
                    html += '<div class="article-meta">';
                    html += '<span class="badge badge-' + article.priority + '">' + article.priority + '</span>';
                    html += '<span class="badge badge-' + article.scope + '">' + article.scope + '</span>';
                    html += '<span>' + article.category + '</span>';
                    html += '<span>Reach: ' + Math.round(article.estimatedReach * 100) + '%</span>';
                    html += '<span>Accuracy: ' + Math.round(article.factualAccuracy * 100) + '%</span>';
                    html += '</div>';
                    html += '</div>';
                    html += '</div>';
                    
                    // Article content
                    html += '<h3>' + article.headline + '</h3>';
                    if (article.subheadline) {
                        html += '<h4>' + article.subheadline + '</h4>';
                    }
                    
                    html += '<div class="article-summary">';
                    html += '<strong>Summary:</strong> ' + article.summary;
                    html += '</div>';
                    
                    html += '<div class="article-content">';
                    html += article.content.replace(/\\n/g, '<br>');
                    html += '</div>';
                    
                    // Public reaction
                    if (article.publicReaction) {
                        html += '<div style="font-size: 12px; color: #666; margin-top: 10px;">';
                        html += '<strong>Public Reaction:</strong> ';
                        html += article.publicReaction.sentiment + ' sentiment, ';
                        html += Math.round(article.publicReaction.engagement * 100) + '% engagement, ';
                        html += Math.round(article.publicReaction.controversyLevel * 100) + '% controversy';
                        html += '</div>';
                    }
                    
                    html += '</div>';
                });
            }
            
            // Errors and warnings
            if (data.errors && data.errors.length > 0) {
                html += '<div class="error"><strong>Errors:</strong><ul>';
                data.errors.forEach(error => {
                    html += '<li>' + error + '</li>';
                });
                html += '</ul></div>';
            }
            
            if (data.warnings && data.warnings.length > 0) {
                html += '<div style="background: #fff3cd; border: 1px solid #ffeaa7; color: #856404; padding: 15px; border-radius: 6px; margin: 20px 0;"><strong>Warnings:</strong><ul>';
                data.warnings.forEach(warning => {
                    html += '<li>' + warning + '</li>';
                });
                html += '</ul></div>';
            }
            
            resultsDiv.innerHTML = html;
        }
        
        async function loadOutlets() {
            const resultsDiv = document.getElementById('outlets-results');
            resultsDiv.style.display = 'block';
            resultsDiv.innerHTML = '<div class="loading"><div class="spinner"></div><p>Loading news outlets...</p></div>';
            
            try {
                const response = await fetch('/api/news/outlets');
                const result = await response.json();
                
                if (result.success) {
                    displayOutlets(result.data);
                } else {
                    resultsDiv.innerHTML = '<div class="error">Error: ' + (result.error || result.message || 'Unknown error') + '</div>';
                }
            } catch (error) {
                resultsDiv.innerHTML = '<div class="error">Error: ' + error.message + '</div>';
            }
        }
        
        function displayOutlets(outlets) {
            const resultsDiv = document.getElementById('outlets-results');
            
            let html = '<h3>📺 News Outlets (' + outlets.length + ')</h3>';
            
            outlets.forEach(outlet => {
                html += '<div class="article">';
                html += '<div class="outlet-info">';
                html += '<span class="outlet-name">' + outlet.name + '</span>';
                html += '<span class="outlet-type">' + outlet.type + '</span>';
                html += '</div>';
                
                html += '<div style="margin: 10px 0;">';
                html += '<strong>Political Lean:</strong> ' + outlet.perspective.politicalLean + '<br>';
                html += '<strong>Government Stance:</strong> ' + outlet.perspective.governmentStance + '<br>';
                html += '<strong>Economic View:</strong> ' + outlet.perspective.economicView + '<br>';
                html += '<strong>Reliability:</strong> ' + Math.round(outlet.perspective.reliability * 100) + '%<br>';
                html += '<strong>Sensationalism:</strong> ' + Math.round(outlet.perspective.sensationalism * 100) + '%<br>';
                html += '<strong>Credibility:</strong> ' + Math.round(outlet.credibility * 100) + '%<br>';
                html += '<strong>Reach:</strong> ' + Math.round(outlet.reach * 100) + '% of population<br>';
                html += '</div>';
                
                if (outlet.specializations && outlet.specializations.length > 0) {
                    html += '<div><strong>Specializations:</strong> ' + outlet.specializations.join(', ') + '</div>';
                }
                
                if (outlet.targetAudience && outlet.targetAudience.length > 0) {
                    html += '<div><strong>Target Audience:</strong> ' + outlet.targetAudience.join(', ') + '</div>';
                }
                
                html += '</div>';
            });
            
            resultsDiv.innerHTML = html;
        }
        
        async function loadAnalytics() {
            const resultsDiv = document.getElementById('analytics-results');
            resultsDiv.style.display = 'block';
            resultsDiv.innerHTML = '<div class="loading"><div class="spinner"></div><p>Loading analytics...</p></div>';
            
            try {
                const campaignId = document.getElementById('analyticsCampaignId').value;
                const tickId = document.getElementById('analyticsTickId').value;
                
                let url = '/api/news/analytics?campaignId=' + campaignId;
                if (tickId) {
                    url += '&tickId=' + tickId;
                }
                
                const response = await fetch(url);
                const result = await response.json();
                
                if (result.success) {
                    displayAnalytics(result.data);
                } else {
                    resultsDiv.innerHTML = '<div class="error">Error: ' + (result.error || result.message || 'Unknown error') + '</div>';
                }
            } catch (error) {
                resultsDiv.innerHTML = '<div class="error">Error: ' + error.message + '</div>';
            }
        }
        
        function displayAnalytics(data) {
            const resultsDiv = document.getElementById('analytics-results');
            
            let html = '<h3>📊 News Analytics</h3>';
            
            html += '<div class="metrics">';
            html += '<div class="metric"><span class="metric-value">' + (data.totalArticles || 0) + '</span><span class="metric-label">Total Articles</span></div>';
            html += '<div class="metric"><span class="metric-value">' + Math.round((data.averageAccuracy || 0) * 100) + '%</span><span class="metric-label">Avg Accuracy</span></div>';
            html += '<div class="metric"><span class="metric-value">' + Math.round((data.averageReach || 0) * 100) + '%</span><span class="metric-label">Avg Reach</span></div>';
            html += '</div>';
            
            if (data.breakdown && data.breakdown.length > 0) {
                html += '<h4>Breakdown by Category</h4>';
                html += '<div style="overflow-x: auto;">';
                html += '<table style="width: 100%; border-collapse: collapse; margin-top: 10px;">';
                html += '<tr style="background: #f8f9fa;"><th style="padding: 10px; border: 1px solid #ddd;">Category</th><th style="padding: 10px; border: 1px solid #ddd;">Scope</th><th style="padding: 10px; border: 1px solid #ddd;">Priority</th><th style="padding: 10px; border: 1px solid #ddd;">Articles</th><th style="padding: 10px; border: 1px solid #ddd;">Accuracy</th><th style="padding: 10px; border: 1px solid #ddd;">Reach</th></tr>';
                
                data.breakdown.forEach(item => {
                    html += '<tr>';
                    html += '<td style="padding: 8px; border: 1px solid #ddd;">' + (item.category || 'N/A') + '</td>';
                    html += '<td style="padding: 8px; border: 1px solid #ddd;">' + (item.scope || 'N/A') + '</td>';
                    html += '<td style="padding: 8px; border: 1px solid #ddd;">' + (item.priority || 'N/A') + '</td>';
                    html += '<td style="padding: 8px; border: 1px solid #ddd;">' + (item.total_articles || 0) + '</td>';
                    html += '<td style="padding: 8px; border: 1px solid #ddd;">' + Math.round((item.avg_accuracy || 0) * 100) + '%</td>';
                    html += '<td style="padding: 8px; border: 1px solid #ddd;">' + Math.round((item.avg_reach || 0) * 100) + '%</td>';
                    html += '</tr>';
                });
                
                html += '</table>';
                html += '</div>';
            }
            
            resultsDiv.innerHTML = html;
        }
        
        async function loadTrends() {
            const resultsDiv = document.getElementById('trends-results');
            resultsDiv.style.display = 'block';
            resultsDiv.innerHTML = '<div class="loading"><div class="spinner"></div><p>Loading trends...</p></div>';
            
            try {
                const campaignId = document.getElementById('trendsCampaignId').value;
                const timeframe = document.getElementById('trendsTimeframe').value;
                
                const response = await fetch('/api/news/trends?campaignId=' + campaignId + '&timeframe=' + timeframe);
                const result = await response.json();
                
                if (result.success) {
                    displayTrends(result.data);
                } else {
                    resultsDiv.innerHTML = '<div class="error">Error: ' + (result.error || result.message || 'Unknown error') + '</div>';
                }
            } catch (error) {
                resultsDiv.innerHTML = '<div class="error">Error: ' + error.message + '</div>';
            }
        }
        
        function displayTrends(data) {
            const resultsDiv = document.getElementById('trends-results');
            
            let html = '<h3>📈 Trending Topics (' + data.timeframe + ')</h3>';
            
            if (data.trendingTopics && data.trendingTopics.length > 0) {
                html += '<div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 15px; margin-top: 20px;">';
                
                data.trendingTopics.forEach((topic, index) => {
                    html += '<div style="padding: 15px; border: 1px solid #e1e8ed; border-radius: 8px; background: white;">';
                    html += '<div style="font-size: 1.2em; font-weight: 600; color: #2c3e50; margin-bottom: 5px;">#' + (index + 1) + ' ' + topic.topic + '</div>';
                    html += '<div style="font-size: 12px; color: #666;">Frequency: ' + topic.frequency + '</div>';
                    html += '<div style="font-size: 12px; color: #666;">Avg Reach: ' + Math.round(topic.averageReach * 100) + '%</div>';
                    html += '</div>';
                });
                
                html += '</div>';
            } else {
                html += '<p>No trending topics found for the selected timeframe.</p>';
            }
            
            resultsDiv.innerHTML = html;
        }
        
        // Auto-load outlets on page load
        document.addEventListener('DOMContentLoaded', function() {
            // You can add any initialization code here
        });
    </script>
</body>
</html>
  `;

  res.send(html);
});

export default router;
