/**
 * AI Analysis Engine - Demo Interface
 * 
 * Interactive demonstration of AI-powered analysis capabilities with natural
 * language interpretation of economic, social, technological, and social media dynamics.
 */

import { Router } from 'express';

const router = Router();

router.get('/demo/ai-analysis', (_req, res) => {
  const html = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>AI Analysis Engine - Demo</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh;
            padding: 20px;
        }

        .container {
            max-width: 1400px;
            margin: 0 auto;
            background: white;
            border-radius: 20px;
            box-shadow: 0 20px 40px rgba(0,0,0,0.1);
            overflow: hidden;
        }

        .header {
            background: linear-gradient(135deg, #667eea, #764ba2);
            color: white;
            padding: 30px;
            text-align: center;
        }

        .header h1 {
            font-size: 2.5em;
            margin-bottom: 10px;
            font-weight: 300;
        }

        .header p {
            font-size: 1.2em;
            opacity: 0.9;
        }

        .capabilities {
            background: linear-gradient(135deg, #667eea, #764ba2);
            color: white;
            border-radius: 15px;
            padding: 25px;
            margin: 30px;
        }

        .capabilities h3 {
            color: white;
            margin-bottom: 20px;
            text-align: center;
        }

        .capability-badges {
            display: flex;
            flex-wrap: wrap;
            gap: 10px;
            justify-content: center;
        }

        .capability-badge {
            background: rgba(255, 255, 255, 0.2);
            color: white;
            padding: 8px 16px;
            border-radius: 20px;
            font-size: 0.9em;
            font-weight: 500;
            backdrop-filter: blur(10px);
        }

        .demo-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
            gap: 30px;
            padding: 30px;
        }

        .demo-section {
            background: #f8f9fa;
            border-radius: 15px;
            padding: 25px;
            border: 1px solid #e9ecef;
            transition: transform 0.3s ease, box-shadow 0.3s ease;
        }

        .demo-section:hover {
            transform: translateY(-5px);
            box-shadow: 0 10px 25px rgba(0,0,0,0.1);
        }

        .demo-section h3 {
            color: #495057;
            margin-bottom: 15px;
            display: flex;
            align-items: center;
            gap: 10px;
        }

        .icon {
            font-size: 1.5em;
        }

        .demo-controls {
            margin: 20px 0;
        }

        .control-group {
            margin-bottom: 15px;
        }

        .control-group label {
            display: block;
            margin-bottom: 5px;
            font-weight: 500;
            color: #495057;
        }

        .control-group select,
        .control-group input {
            width: 100%;
            padding: 10px;
            border: 1px solid #ced4da;
            border-radius: 8px;
            font-size: 14px;
        }

        .checkbox-group {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
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
        }

        .btn {
            background: linear-gradient(135deg, #667eea, #764ba2);
            color: white;
            border: none;
            padding: 12px 24px;
            border-radius: 8px;
            cursor: pointer;
            font-size: 14px;
            font-weight: 500;
            transition: all 0.3s ease;
            margin: 5px;
        }

        .btn:hover {
            transform: translateY(-2px);
            box-shadow: 0 5px 15px rgba(102, 126, 234, 0.4);
        }

        .btn-secondary {
            background: linear-gradient(135deg, #6c757d, #495057);
        }

        .btn-danger {
            background: linear-gradient(135deg, #dc3545, #c82333);
        }

        .results-area {
            margin-top: 20px;
            padding: 20px;
            background: white;
            border-radius: 10px;
            border: 1px solid #e9ecef;
            min-height: 100px;
            max-height: 500px;
            overflow-y: auto;
        }

        .loading {
            text-align: center;
            color: #7f8c8d;
            font-style: italic;
        }

        .success {
            background: #d4edda;
            color: #155724;
            padding: 15px;
            border-radius: 8px;
            border-left: 4px solid #28a745;
        }

        .error {
            background: #f8d7da;
            color: #721c24;
            padding: 15px;
            border-radius: 8px;
            border-left: 4px solid #dc3545;
        }

        .analysis-result {
            margin: 20px 0;
        }

        .analysis-section {
            margin: 20px 0;
            padding: 15px;
            background: rgba(255, 255, 255, 0.1);
            border-radius: 8px;
        }

        .analysis-section h4 {
            margin: 0 0 15px 0;
            color: #333;
            font-size: 1.1em;
        }

        .insight-item {
            margin: 10px 0;
            padding: 12px;
            background: #f8f9fa;
            border-radius: 6px;
            border-left: 4px solid #007bff;
        }

        .insight-priority-critical {
            border-left-color: #dc3545;
        }

        .insight-priority-high {
            border-left-color: #fd7e14;
        }

        .insight-priority-medium {
            border-left-color: #ffc107;
        }

        .insight-priority-low {
            border-left-color: #28a745;
        }

        .insight-title {
            font-weight: bold;
            margin-bottom: 5px;
        }

        .insight-description {
            color: #666;
            font-size: 0.9em;
        }

        .insight-confidence {
            float: right;
            background: #007bff;
            color: white;
            padding: 2px 8px;
            border-radius: 12px;
            font-size: 0.8em;
        }

        .recommendation-item {
            margin: 10px 0;
            padding: 15px;
            background: #e7f3ff;
            border-radius: 8px;
            border-left: 4px solid #007bff;
        }

        .recommendation-title {
            font-weight: bold;
            margin-bottom: 8px;
            color: #0056b3;
        }

        .recommendation-description {
            color: #333;
            margin-bottom: 8px;
        }

        .recommendation-type {
            display: inline-block;
            background: #007bff;
            color: white;
            padding: 2px 8px;
            border-radius: 12px;
            font-size: 0.8em;
            margin-right: 8px;
        }

        .trend-item {
            margin: 10px 0;
            padding: 12px;
            background: #f0f8f0;
            border-radius: 6px;
            border-left: 4px solid #28a745;
        }

        .trend-direction-increasing {
            border-left-color: #28a745;
        }

        .trend-direction-decreasing {
            border-left-color: #dc3545;
        }

        .trend-direction-stable {
            border-left-color: #6c757d;
        }

        .trend-name {
            font-weight: bold;
            margin-bottom: 5px;
        }

        .trend-strength {
            float: right;
            background: #28a745;
            color: white;
            padding: 2px 8px;
            border-radius: 12px;
            font-size: 0.8em;
        }

        .prediction-item {
            margin: 10px 0;
            padding: 15px;
            background: #fff3cd;
            border-radius: 8px;
            border-left: 4px solid #ffc107;
        }

        .prediction-description {
            font-weight: bold;
            margin-bottom: 8px;
        }

        .prediction-confidence {
            float: right;
            background: #ffc107;
            color: #212529;
            padding: 2px 8px;
            border-radius: 12px;
            font-size: 0.8em;
        }

        .metadata {
            margin-top: 20px;
            padding: 15px;
            background: rgba(0, 0, 0, 0.05);
            border-radius: 8px;
            font-size: 0.9em;
        }

        .metadata h5 {
            margin-bottom: 10px;
            color: #495057;
        }

        .metadata-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 10px;
        }

        .metadata-item {
            display: flex;
            justify-content: space-between;
            padding: 5px 0;
            border-bottom: 1px solid #dee2e6;
        }

        .status-section {
            background: #e3f2fd;
            border-radius: 15px;
            padding: 25px;
            margin: 30px;
        }

        .status-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 20px;
            margin-top: 20px;
        }

        .status-card {
            background: white;
            padding: 20px;
            border-radius: 10px;
            text-align: center;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        }

        .status-value {
            font-size: 2em;
            font-weight: bold;
            color: #1976d2;
            margin-bottom: 5px;
        }

        .status-label {
            color: #666;
            font-size: 0.9em;
        }

        .api-section {
            background: #f8f9fa;
            border-radius: 15px;
            padding: 25px;
            margin: 30px;
        }

        .api-endpoint {
            background: white;
            border-radius: 8px;
            padding: 15px;
            margin: 10px 0;
            border-left: 4px solid #007bff;
        }

        .endpoint-method {
            display: inline-block;
            background: #007bff;
            color: white;
            padding: 2px 8px;
            border-radius: 4px;
            font-size: 0.8em;
            font-weight: bold;
            margin-right: 10px;
        }

        .endpoint-path {
            font-family: monospace;
            font-weight: bold;
        }

        .endpoint-description {
            color: #666;
            margin-top: 5px;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🤖 AI Analysis Engine</h1>
            <p>Natural Language Interpretation of Economic, Social, Technological & Social Media Dynamics</p>
        </div>

        <!-- Capabilities Overview -->
        <div class="capabilities">
            <h3>🎯 AI Analysis Capabilities</h3>
            <div class="capability-badges">
                <span class="capability-badge">Comprehensive Analysis</span>
                <span class="capability-badge">Economic Insights</span>
                <span class="capability-badge">Social Dynamics</span>
                <span class="capability-badge">Technology Trends</span>
                <span class="capability-badge">Political Analysis</span>
                <span class="capability-badge">Psychological Modeling</span>
                <span class="capability-badge">Social Media Sentiment</span>
                <span class="capability-badge">Crisis Assessment</span>
                <span class="capability-badge">Opportunity Analysis</span>
                <span class="capability-badge">Predictive Analytics</span>
                <span class="capability-badge">Strategic Recommendations</span>
                <span class="capability-badge">Cross-System Correlations</span>
            </div>
        </div>

        <div class="demo-grid">
            <!-- Comprehensive Analysis -->
            <div class="demo-section">
                <h3><span class="icon">🔍</span>Comprehensive Analysis</h3>
                <p>Perform AI-powered comprehensive analysis across all systems with natural language insights and strategic recommendations.</p>
                
                <div class="demo-controls">
                    <div class="control-group">
                        <label>Analysis Scope:</label>
                        <select id="comprehensiveScope">
                            <option value="civilization">Civilization</option>
                            <option value="global">Global</option>
                            <option value="multi_system">Multi-System</option>
                        </select>
                    </div>
                    
                    <div class="control-group">
                        <label>Systems to Analyze:</label>
                        <div class="checkbox-group">
                            <div class="checkbox-item">
                                <input type="checkbox" id="sys_economic" checked>
                                <label for="sys_economic">Economic</label>
                            </div>
                            <div class="checkbox-item">
                                <input type="checkbox" id="sys_social" checked>
                                <label for="sys_social">Social</label>
                            </div>
                            <div class="checkbox-item">
                                <input type="checkbox" id="sys_technological" checked>
                                <label for="sys_technological">Technological</label>
                            </div>
                            <div class="checkbox-item">
                                <input type="checkbox" id="sys_political" checked>
                                <label for="sys_political">Political</label>
                            </div>
                            <div class="checkbox-item">
                                <input type="checkbox" id="sys_psychological" checked>
                                <label for="sys_psychological">Psychological</label>
                            </div>
                            <div class="checkbox-item">
                                <input type="checkbox" id="sys_social_media" checked>
                                <label for="sys_social_media">Social Media</label>
                            </div>
                        </div>
                    </div>
                    
                    <button onclick="runComprehensiveAnalysis()" class="btn">🔍 Run Comprehensive Analysis</button>
                </div>
                
                <div id="comprehensiveResults" class="results-area"></div>
            </div>

            <!-- Quick Analysis -->
            <div class="demo-section">
                <h3><span class="icon">⚡</span>Quick Analysis</h3>
                <p>Perform rapid AI analysis with simplified input for immediate insights and recommendations.</p>
                
                <div class="demo-controls">
                    <div class="control-group">
                        <label>Analysis Type:</label>
                        <select id="quickAnalysisType">
                            <option value="comprehensive">Comprehensive</option>
                            <option value="economic">Economic Focus</option>
                            <option value="social">Social Focus</option>
                            <option value="technological">Technology Focus</option>
                            <option value="social_media">Social Media Focus</option>
                        </select>
                    </div>
                    
                    <div class="control-group">
                        <label>Civilization ID (optional):</label>
                        <input type="text" id="quickCivilizationId" placeholder="e.g., civilization_alpha">
                    </div>
                    
                    <button onclick="runQuickAnalysis()" class="btn">⚡ Run Quick Analysis</button>
                </div>
                
                <div id="quickResults" class="results-area"></div>
            </div>

            <!-- Crisis Assessment -->
            <div class="demo-section">
                <h3><span class="icon">🚨</span>Crisis Assessment</h3>
                <p>AI-powered crisis detection and assessment with urgency analysis and response recommendations.</p>
                
                <div class="demo-controls">
                    <div class="control-group">
                        <label>Crisis Indicators:</label>
                        <div class="checkbox-group">
                            <div class="checkbox-item">
                                <input type="checkbox" id="crisis_economic">
                                <label for="crisis_economic">Economic Instability</label>
                            </div>
                            <div class="checkbox-item">
                                <input type="checkbox" id="crisis_social">
                                <label for="crisis_social">Social Unrest</label>
                            </div>
                            <div class="checkbox-item">
                                <input type="checkbox" id="crisis_political">
                                <label for="crisis_political">Political Crisis</label>
                            </div>
                            <div class="checkbox-item">
                                <input type="checkbox" id="crisis_security">
                                <label for="crisis_security">Security Threat</label>
                            </div>
                        </div>
                    </div>
                    
                    <div class="control-group">
                        <label>Severity Level:</label>
                        <select id="crisisSeverity">
                            <option value="minor">Minor</option>
                            <option value="moderate">Moderate</option>
                            <option value="major">Major</option>
                            <option value="critical">Critical</option>
                        </select>
                    </div>
                    
                    <button onclick="runCrisisAssessment()" class="btn btn-danger">🚨 Assess Crisis</button>
                </div>
                
                <div id="crisisResults" class="results-area"></div>
            </div>

            <!-- Opportunity Analysis -->
            <div class="demo-section">
                <h3><span class="icon">🎯</span>Opportunity Analysis</h3>
                <p>AI-powered opportunity identification and feasibility analysis with strategic recommendations.</p>
                
                <div class="demo-controls">
                    <div class="control-group">
                        <label>Focus Areas:</label>
                        <div class="checkbox-group">
                            <div class="checkbox-item">
                                <input type="checkbox" id="opp_economic" checked>
                                <label for="opp_economic">Economic</label>
                            </div>
                            <div class="checkbox-item">
                                <input type="checkbox" id="opp_technological" checked>
                                <label for="opp_technological">Technological</label>
                            </div>
                            <div class="checkbox-item">
                                <input type="checkbox" id="opp_social" checked>
                                <label for="opp_social">Social</label>
                            </div>
                            <div class="checkbox-item">
                                <input type="checkbox" id="opp_diplomatic">
                                <label for="opp_diplomatic">Diplomatic</label>
                            </div>
                        </div>
                    </div>
                    
                    <div class="control-group">
                        <label>Time Horizon (months):</label>
                        <select id="opportunityTimeHorizon">
                            <option value="3">3 months</option>
                            <option value="6">6 months</option>
                            <option value="12" selected>12 months</option>
                            <option value="24">24 months</option>
                        </select>
                    </div>
                    
                    <button onclick="runOpportunityAnalysis()" class="btn">🎯 Analyze Opportunities</button>
                </div>
                
                <div id="opportunityResults" class="results-area"></div>
            </div>

            <!-- Analysis History -->
            <div class="demo-section">
                <h3><span class="icon">📊</span>Analysis History</h3>
                <p>View previous AI analysis results and track analysis performance over time.</p>
                
                <div class="demo-controls">
                    <div class="control-group">
                        <label>Filter by Type:</label>
                        <select id="historyType">
                            <option value="">All Types</option>
                            <option value="comprehensive">Comprehensive</option>
                            <option value="crisis_assessment">Crisis Assessment</option>
                            <option value="opportunity_analysis">Opportunity Analysis</option>
                            <option value="economic">Economic</option>
                            <option value="social">Social</option>
                        </select>
                    </div>
                    
                    <div class="control-group">
                        <label>Limit:</label>
                        <select id="historyLimit">
                            <option value="10">10 results</option>
                            <option value="20" selected>20 results</option>
                            <option value="50">50 results</option>
                        </select>
                    </div>
                    
                    <button onclick="loadAnalysisHistory()" class="btn btn-secondary">📊 Load History</button>
                </div>
                
                <div id="historyResults" class="results-area"></div>
            </div>

            <!-- System Status -->
            <div class="demo-section">
                <h3><span class="icon">⚙️</span>System Status</h3>
                <p>Monitor AI Analysis Engine performance, metrics, and system health.</p>
                
                <div class="demo-controls">
                    <button onclick="loadSystemStatus()" class="btn btn-secondary">⚙️ Check System Status</button>
                    <button onclick="loadEngineMetrics()" class="btn btn-secondary">📈 View Metrics</button>
                    <button onclick="loadActiveJobs()" class="btn btn-secondary">🔄 Active Jobs</button>
                </div>
                
                <div id="statusResults" class="results-area"></div>
            </div>
        </div>

        <!-- System Status Overview -->
        <div class="status-section">
            <h3>📈 AI Analysis Engine Status</h3>
            <div class="status-grid" id="statusOverview">
                <div class="status-card">
                    <div class="status-value" id="totalAnalyses">-</div>
                    <div class="status-label">Total Analyses</div>
                </div>
                <div class="status-card">
                    <div class="status-value" id="successRate">-</div>
                    <div class="status-label">Success Rate</div>
                </div>
                <div class="status-card">
                    <div class="status-value" id="avgExecutionTime">-</div>
                    <div class="status-label">Avg Execution Time</div>
                </div>
                <div class="status-card">
                    <div class="status-value" id="activeJobs">-</div>
                    <div class="status-label">Active Jobs</div>
                </div>
            </div>
        </div>

        <!-- API Documentation -->
        <div class="api-section">
            <h3>🔗 API Endpoints</h3>
            <div class="api-endpoint">
                <span class="endpoint-method">POST</span>
                <span class="endpoint-path">/api/ai-analysis/analyze</span>
                <div class="endpoint-description">Perform comprehensive AI analysis with custom parameters</div>
            </div>
            <div class="api-endpoint">
                <span class="endpoint-method">POST</span>
                <span class="endpoint-path">/api/ai-analysis/quick-analysis</span>
                <div class="endpoint-description">Perform quick analysis with simplified input</div>
            </div>
            <div class="api-endpoint">
                <span class="endpoint-method">POST</span>
                <span class="endpoint-path">/api/ai-analysis/crisis-assessment</span>
                <div class="endpoint-description">Perform crisis assessment with urgency analysis</div>
            </div>
            <div class="api-endpoint">
                <span class="endpoint-method">POST</span>
                <span class="endpoint-path">/api/ai-analysis/opportunity-analysis</span>
                <div class="endpoint-description">Analyze opportunities with feasibility assessment</div>
            </div>
            <div class="api-endpoint">
                <span class="endpoint-method">GET</span>
                <span class="endpoint-path">/api/ai-analysis/history</span>
                <div class="endpoint-description">Get analysis history with filtering and pagination</div>
            </div>
            <div class="api-endpoint">
                <span class="endpoint-method">GET</span>
                <span class="endpoint-path">/api/ai-analysis/metrics</span>
                <div class="endpoint-description">Get analysis engine performance metrics</div>
            </div>
            <div class="api-endpoint">
                <span class="endpoint-method">GET</span>
                <span class="endpoint-path">/api/ai-analysis/capabilities</span>
                <div class="endpoint-description">Get analysis engine capabilities and features</div>
            </div>
            <div class="api-endpoint">
                <span class="endpoint-method">GET</span>
                <span class="endpoint-path">/api/ai-analysis/health</span>
                <div class="endpoint-description">Health check and system status</div>
            </div>
        </div>
    </div>

    <script>
        // Load initial status on page load
        document.addEventListener('DOMContentLoaded', function() {
            loadSystemStatusOverview();
        });

        // ===== COMPREHENSIVE ANALYSIS =====

        async function runComprehensiveAnalysis() {
            const resultsArea = document.getElementById('comprehensiveResults');
            resultsArea.innerHTML = '<div class="loading">🤖 Running comprehensive AI analysis...</div>';

            try {
                const scope = document.getElementById('comprehensiveScope').value;
                const systems = [];
                
                // Collect selected systems
                if (document.getElementById('sys_economic').checked) systems.push('economic');
                if (document.getElementById('sys_social').checked) systems.push('social');
                if (document.getElementById('sys_technological').checked) systems.push('technological');
                if (document.getElementById('sys_political').checked) systems.push('political');
                if (document.getElementById('sys_psychological').checked) systems.push('psychological');
                if (document.getElementById('sys_social_media').checked) systems.push('social_media');

                if (systems.length === 0) {
                    resultsArea.innerHTML = '<div class="error">Please select at least one system to analyze.</div>';
                    return;
                }

                const response = await fetch('/api/ai-analysis/quick-analysis', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        systems: systems,
                        analysisType: 'comprehensive',
                        civilizationId: 'demo_civilization'
                    })
                });

                const data = await response.json();

                if (data.success) {
                    displayAnalysisResult(data.analysis, resultsArea);
                } else {
                    resultsArea.innerHTML = \`<div class="error">Analysis failed: \${data.error}</div>\`;
                }

            } catch (error) {
                console.error('Comprehensive analysis error:', error);
                resultsArea.innerHTML = '<div class="error">Analysis failed due to network error</div>';
            }
        }

        // ===== QUICK ANALYSIS =====

        async function runQuickAnalysis() {
            const resultsArea = document.getElementById('quickResults');
            resultsArea.innerHTML = '<div class="loading">⚡ Running quick AI analysis...</div>';

            try {
                const analysisType = document.getElementById('quickAnalysisType').value;
                const civilizationId = document.getElementById('quickCivilizationId').value || 'demo_civilization';

                // Determine systems based on analysis type
                let systems = [];
                switch (analysisType) {
                    case 'economic':
                        systems = ['economic'];
                        break;
                    case 'social':
                        systems = ['social', 'psychological'];
                        break;
                    case 'technological':
                        systems = ['technological'];
                        break;
                    case 'social_media':
                        systems = ['social_media', 'psychological'];
                        break;
                    default:
                        systems = ['economic', 'social', 'technological', 'political'];
                }

                const response = await fetch('/api/ai-analysis/quick-analysis', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        systems: systems,
                        analysisType: analysisType,
                        civilizationId: civilizationId
                    })
                });

                const data = await response.json();

                if (data.success) {
                    displayAnalysisResult(data.analysis, resultsArea);
                } else {
                    resultsArea.innerHTML = \`<div class="error">Quick analysis failed: \${data.error}</div>\`;
                }

            } catch (error) {
                console.error('Quick analysis error:', error);
                resultsArea.innerHTML = '<div class="error">Quick analysis failed due to network error</div>';
            }
        }

        // ===== CRISIS ASSESSMENT =====

        async function runCrisisAssessment() {
            const resultsArea = document.getElementById('crisisResults');
            resultsArea.innerHTML = '<div class="loading">🚨 Assessing crisis situation...</div>';

            try {
                const indicators = [];
                if (document.getElementById('crisis_economic').checked) indicators.push('economic_instability');
                if (document.getElementById('crisis_social').checked) indicators.push('social_unrest');
                if (document.getElementById('crisis_political').checked) indicators.push('political_crisis');
                if (document.getElementById('crisis_security').checked) indicators.push('security_threat');

                const severity = document.getElementById('crisisSeverity').value;

                const response = await fetch('/api/ai-analysis/crisis-assessment', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        civilizationId: 'demo_civilization',
                        indicators: indicators,
                        severity: severity
                    })
                });

                const data = await response.json();

                if (data.success) {
                    displayCrisisAssessment(data.crisisAssessment, resultsArea);
                } else {
                    resultsArea.innerHTML = \`<div class="error">Crisis assessment failed: \${data.error}</div>\`;
                }

            } catch (error) {
                console.error('Crisis assessment error:', error);
                resultsArea.innerHTML = '<div class="error">Crisis assessment failed due to network error</div>';
            }
        }

        // ===== OPPORTUNITY ANALYSIS =====

        async function runOpportunityAnalysis() {
            const resultsArea = document.getElementById('opportunityResults');
            resultsArea.innerHTML = '<div class="loading">🎯 Analyzing opportunities...</div>';

            try {
                const focusAreas = [];
                if (document.getElementById('opp_economic').checked) focusAreas.push('economic');
                if (document.getElementById('opp_technological').checked) focusAreas.push('technological');
                if (document.getElementById('opp_social').checked) focusAreas.push('social');
                if (document.getElementById('opp_diplomatic').checked) focusAreas.push('diplomatic');

                const timeHorizon = parseInt(document.getElementById('opportunityTimeHorizon').value);

                const response = await fetch('/api/ai-analysis/opportunity-analysis', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        civilizationId: 'demo_civilization',
                        focusAreas: focusAreas,
                        timeHorizon: timeHorizon
                    })
                });

                const data = await response.json();

                if (data.success) {
                    displayOpportunityAnalysis(data.opportunityAnalysis, resultsArea);
                } else {
                    resultsArea.innerHTML = \`<div class="error">Opportunity analysis failed: \${data.error}</div>\`;
                }

            } catch (error) {
                console.error('Opportunity analysis error:', error);
                resultsArea.innerHTML = '<div class="error">Opportunity analysis failed due to network error</div>';
            }
        }

        // ===== ANALYSIS HISTORY =====

        async function loadAnalysisHistory() {
            const resultsArea = document.getElementById('historyResults');
            resultsArea.innerHTML = '<div class="loading">📊 Loading analysis history...</div>';

            try {
                const type = document.getElementById('historyType').value;
                const limit = document.getElementById('historyLimit').value;

                let url = \`/api/ai-analysis/history?limit=\${limit}\`;
                if (type) url += \`&type=\${type}\`;

                const response = await fetch(url);
                const data = await response.json();

                if (data.success) {
                    displayAnalysisHistory(data.history, data.pagination, resultsArea);
                } else {
                    resultsArea.innerHTML = \`<div class="error">Failed to load history: \${data.error}</div>\`;
                }

            } catch (error) {
                console.error('History loading error:', error);
                resultsArea.innerHTML = '<div class="error">Failed to load history due to network error</div>';
            }
        }

        // ===== SYSTEM STATUS =====

        async function loadSystemStatus() {
            const resultsArea = document.getElementById('statusResults');
            resultsArea.innerHTML = '<div class="loading">⚙️ Checking system status...</div>';

            try {
                const response = await fetch('/api/ai-analysis/health');
                const data = await response.json();

                if (data.success) {
                    displaySystemHealth(data.health, resultsArea);
                } else {
                    resultsArea.innerHTML = \`<div class="error">Failed to get system status: \${data.error}</div>\`;
                }

            } catch (error) {
                console.error('System status error:', error);
                resultsArea.innerHTML = '<div class="error">Failed to get system status due to network error</div>';
            }
        }

        async function loadEngineMetrics() {
            const resultsArea = document.getElementById('statusResults');
            resultsArea.innerHTML = '<div class="loading">📈 Loading engine metrics...</div>';

            try {
                const response = await fetch('/api/ai-analysis/metrics');
                const data = await response.json();

                if (data.success) {
                    displayEngineMetrics(data.metrics, resultsArea);
                } else {
                    resultsArea.innerHTML = \`<div class="error">Failed to load metrics: \${data.error}</div>\`;
                }

            } catch (error) {
                console.error('Metrics loading error:', error);
                resultsArea.innerHTML = '<div class="error">Failed to load metrics due to network error</div>';
            }
        }

        async function loadActiveJobs() {
            const resultsArea = document.getElementById('statusResults');
            resultsArea.innerHTML = '<div class="loading">🔄 Loading active jobs...</div>';

            try {
                const response = await fetch('/api/ai-analysis/jobs');
                const data = await response.json();

                if (data.success) {
                    displayActiveJobs(data.jobs, resultsArea);
                } else {
                    resultsArea.innerHTML = \`<div class="error">Failed to load active jobs: \${data.error}</div>\`;
                }

            } catch (error) {
                console.error('Active jobs loading error:', error);
                resultsArea.innerHTML = '<div class="error">Failed to load active jobs due to network error</div>';
            }
        }

        async function loadSystemStatusOverview() {
            try {
                const response = await fetch('/api/ai-analysis/metrics');
                const data = await response.json();

                if (data.success) {
                    const metrics = data.metrics;
                    document.getElementById('totalAnalyses').textContent = metrics.totalAnalyses || 0;
                    document.getElementById('successRate').textContent = \`\${(metrics.successRate || 0).toFixed(1)}%\`;
                    document.getElementById('avgExecutionTime').textContent = \`\${(metrics.averageExecutionTime || 0).toFixed(0)}ms\`;
                    document.getElementById('activeJobs').textContent = metrics.queueLength || 0;
                }
            } catch (error) {
                console.error('Status overview loading error:', error);
            }
        }

        // ===== DISPLAY FUNCTIONS =====

        function displayAnalysisResult(analysis, container) {
            let html = \`
                <div class="success">
                    <h4>🤖 AI Analysis Complete</h4>
                    <div class="analysis-result">
                        <div class="analysis-section">
                            <h4>📋 Executive Summary</h4>
                            <p>\${analysis.summary}</p>
                            <div class="metadata-item">
                                <span>Confidence:</span>
                                <span>\${(analysis.confidence * 100).toFixed(1)}%</span>
                            </div>
                        </div>
            \`;

            // Display insights
            if (analysis.insights && analysis.insights.length > 0) {
                html += \`
                    <div class="analysis-section">
                        <h4>💡 Key Insights</h4>
                \`;
                analysis.insights.slice(0, 5).forEach(insight => {
                    html += \`
                        <div class="insight-item insight-priority-\${insight.priority}">
                            <div class="insight-title">\${insight.title}</div>
                            <div class="insight-description">\${insight.description}</div>
                            <div class="insight-confidence">\${(insight.confidence * 100).toFixed(0)}%</div>
                        </div>
                    \`;
                });
                html += '</div>';
            }

            // Display recommendations
            if (analysis.recommendations && analysis.recommendations.length > 0) {
                html += \`
                    <div class="analysis-section">
                        <h4>🎯 Strategic Recommendations</h4>
                \`;
                analysis.recommendations.slice(0, 3).forEach(rec => {
                    html += \`
                        <div class="recommendation-item">
                            <div class="recommendation-title">\${rec.title}</div>
                            <div class="recommendation-description">\${rec.description}</div>
                            <span class="recommendation-type">\${rec.type}</span>
                            <span class="insight-confidence">\${(rec.confidence * 100).toFixed(0)}%</span>
                        </div>
                    \`;
                });
                html += '</div>';
            }

            // Display trends
            if (analysis.trends && analysis.trends.length > 0) {
                html += \`
                    <div class="analysis-section">
                        <h4>📈 Identified Trends</h4>
                \`;
                analysis.trends.slice(0, 3).forEach(trend => {
                    html += \`
                        <div class="trend-item trend-direction-\${trend.direction}">
                            <div class="trend-name">\${trend.name}</div>
                            <div class="insight-description">\${trend.description}</div>
                            <div class="trend-strength">\${(trend.strength * 100).toFixed(0)}%</div>
                        </div>
                    \`;
                });
                html += '</div>';
            }

            // Display predictions
            if (analysis.predictions && analysis.predictions.length > 0) {
                html += \`
                    <div class="analysis-section">
                        <h4>🔮 Predictions</h4>
                \`;
                analysis.predictions.slice(0, 3).forEach(pred => {
                    html += \`
                        <div class="prediction-item">
                            <div class="prediction-description">\${pred.description}</div>
                            <div class="insight-description">Timeframe: \${pred.timeframe}</div>
                            <div class="prediction-confidence">\${(pred.confidence * 100).toFixed(0)}%</div>
                        </div>
                    \`;
                });
                html += '</div>';
            }

            // Display metadata
            if (analysis.metadata) {
                html += \`
                    <div class="metadata">
                        <h5>📊 Analysis Metadata</h5>
                        <div class="metadata-grid">
                            <div class="metadata-item">
                                <span>Systems Analyzed:</span>
                                <span>\${analysis.metadata.systemsAnalyzed?.join(', ') || 'N/A'}</span>
                            </div>
                            <div class="metadata-item">
                                <span>Data Points:</span>
                                <span>\${analysis.metadata.processingStats?.totalDataPoints || 0}</span>
                            </div>
                            <div class="metadata-item">
                                <span>Execution Time:</span>
                                <span>\${analysis.executionTime || 0}ms</span>
                            </div>
                            <div class="metadata-item">
                                <span>Analysis Type:</span>
                                <span>\${analysis.type}</span>
                            </div>
                        </div>
                    </div>
                \`;
            }

            html += '</div></div>';
            container.innerHTML = html;
        }

        function displayCrisisAssessment(assessment, container) {
            let html = \`
                <div class="success">
                    <h4>🚨 Crisis Assessment Complete</h4>
                    <div class="analysis-result">
                        <div class="analysis-section">
                            <h4>⚠️ Crisis Overview</h4>
                            <div class="metadata-grid">
                                <div class="metadata-item">
                                    <span>Crisis Type:</span>
                                    <span>\${assessment.crisisType || 'Unknown'}</span>
                                </div>
                                <div class="metadata-item">
                                    <span>Severity:</span>
                                    <span>\${assessment.severity || 'Unknown'}</span>
                                </div>
                                <div class="metadata-item">
                                    <span>Urgency:</span>
                                    <span>\${assessment.urgency || 0}/100</span>
                                </div>
                                <div class="metadata-item">
                                    <span>Escalation Potential:</span>
                                    <span>\${assessment.escalationPotential || 0}%</span>
                                </div>
                            </div>
                        </div>
                        
                        <div class="analysis-section">
                            <h4>📋 Assessment Summary</h4>
                            <p>\${assessment.summary}</p>
                        </div>
                        
                        <div class="analysis-section">
                            <h4>🎯 Affected Systems</h4>
                            <p>\${assessment.affectedSystems?.join(', ') || 'None identified'}</p>
                        </div>
                    </div>
                </div>
            \`;
            
            container.innerHTML = html;
        }

        function displayOpportunityAnalysis(analysis, container) {
            let html = \`
                <div class="success">
                    <h4>🎯 Opportunity Analysis Complete</h4>
                    <div class="analysis-result">
                        <div class="analysis-section">
                            <h4>💎 Opportunity Overview</h4>
                            <div class="metadata-grid">
                                <div class="metadata-item">
                                    <span>Opportunity Type:</span>
                                    <span>\${analysis.opportunityType || 'Unknown'}</span>
                                </div>
                                <div class="metadata-item">
                                    <span>Potential:</span>
                                    <span>\${analysis.potential || 0}%</span>
                                </div>
                                <div class="metadata-item">
                                    <span>Feasibility:</span>
                                    <span>\${analysis.feasibility || 0}%</span>
                                </div>
                                <div class="metadata-item">
                                    <span>Time Window:</span>
                                    <span>\${analysis.timeWindow || 'Unknown'}</span>
                                </div>
                            </div>
                        </div>
                        
                        <div class="analysis-section">
                            <h4>📋 Analysis Summary</h4>
                            <p>\${analysis.summary}</p>
                        </div>
                        
                        <div class="analysis-section">
                            <h4>📋 Requirements</h4>
                            <p>\${analysis.requirements?.join(', ') || 'None specified'}</p>
                        </div>
                        
                        <div class="analysis-section">
                            <h4>⚠️ Risk Factors</h4>
                            <p>\${analysis.riskFactors?.join(', ') || 'None identified'}</p>
                        </div>
                    </div>
                </div>
            \`;
            
            container.innerHTML = html;
        }

        function displayAnalysisHistory(history, pagination, container) {
            let html = \`
                <div class="success">
                    <h4>📊 Analysis History (\${pagination.total} total)</h4>
            \`;

            if (history.length === 0) {
                html += '<p>No analysis history found.</p>';
            } else {
                history.forEach(analysis => {
                    html += \`
                        <div class="analysis-section">
                            <h5>\${analysis.type} - \${new Date(analysis.timestamp).toLocaleString()}</h5>
                            <div class="metadata-grid">
                                <div class="metadata-item">
                                    <span>Scope:</span>
                                    <span>\${analysis.scope}</span>
                                </div>
                                <div class="metadata-item">
                                    <span>Confidence:</span>
                                    <span>\${(analysis.confidence * 100).toFixed(1)}%</span>
                                </div>
                                <div class="metadata-item">
                                    <span>Insights:</span>
                                    <span>\${analysis.insights?.length || 0}</span>
                                </div>
                                <div class="metadata-item">
                                    <span>Recommendations:</span>
                                    <span>\${analysis.recommendations?.length || 0}</span>
                                </div>
                            </div>
                            <p><strong>Summary:</strong> \${analysis.summary.substring(0, 200)}...</p>
                        </div>
                    \`;
                });
            }

            html += '</div>';
            container.innerHTML = html;
        }

        function displaySystemHealth(health, container) {
            const statusColor = health.status === 'healthy' ? '#28a745' : 
                               health.status === 'degraded' ? '#ffc107' : '#dc3545';

            let html = \`
                <div class="success">
                    <h4>⚙️ System Health Status</h4>
                    <div class="analysis-section">
                        <div class="metadata-item">
                            <span>Overall Status:</span>
                            <span style="color: \${statusColor}; font-weight: bold;">\${health.status.toUpperCase()}</span>
                        </div>
                        <div class="metadata-item">
                            <span>Last Check:</span>
                            <span>\${new Date(health.timestamp).toLocaleString()}</span>
                        </div>
                    </div>
                    
                    <div class="analysis-section">
                        <h5>📊 Performance Metrics</h5>
                        <div class="metadata-grid">
                            <div class="metadata-item">
                                <span>Total Analyses:</span>
                                <span>\${health.metrics.totalAnalyses}</span>
                            </div>
                            <div class="metadata-item">
                                <span>Success Rate:</span>
                                <span>\${health.metrics.successRate}%</span>
                            </div>
                            <div class="metadata-item">
                                <span>Avg Execution Time:</span>
                                <span>\${health.metrics.averageExecutionTime}ms</span>
                            </div>
                            <div class="metadata-item">
                                <span>Active Jobs:</span>
                                <span>\${health.metrics.activeJobs}</span>
                            </div>
                        </div>
                    </div>
                    
                    <div class="analysis-section">
                        <h5>🔧 System Checks</h5>
                        <div class="metadata-grid">
            \`;

            Object.entries(health.checks).forEach(([check, status]) => {
                const checkColor = status === 'operational' ? '#28a745' : 
                                 status === 'degraded' ? '#ffc107' : '#dc3545';
                html += \`
                    <div class="metadata-item">
                        <span>\${check}:</span>
                        <span style="color: \${checkColor}; font-weight: bold;">\${status}</span>
                    </div>
                \`;
            });

            html += \`
                        </div>
                    </div>
                </div>
            \`;

            container.innerHTML = html;
        }

        function displayEngineMetrics(metrics, container) {
            let html = \`
                <div class="success">
                    <h4>📈 Engine Performance Metrics</h4>
                    <div class="analysis-section">
                        <div class="metadata-grid">
                            <div class="metadata-item">
                                <span>Total Analyses:</span>
                                <span>\${metrics.totalAnalyses}</span>
                            </div>
                            <div class="metadata-item">
                                <span>Success Rate:</span>
                                <span>\${metrics.successRate.toFixed(1)}%</span>
                            </div>
                            <div class="metadata-item">
                                <span>Average Execution Time:</span>
                                <span>\${metrics.averageExecutionTime.toFixed(0)}ms</span>
                            </div>
                            <div class="metadata-item">
                                <span>Cache Hit Rate:</span>
                                <span>\${metrics.cacheHitRate.toFixed(1)}%</span>
                            </div>
                            <div class="metadata-item">
                                <span>System Load:</span>
                                <span>\${metrics.systemLoad.toFixed(1)}%</span>
                            </div>
                            <div class="metadata-item">
                                <span>Queue Length:</span>
                                <span>\${metrics.queueLength}</span>
                            </div>
                        </div>
                    </div>
                </div>
            \`;

            container.innerHTML = html;
        }

        function displayActiveJobs(jobs, container) {
            let html = \`
                <div class="success">
                    <h4>🔄 Active Analysis Jobs (\${jobs.length})</h4>
            \`;

            if (jobs.length === 0) {
                html += '<p>No active jobs currently running.</p>';
            } else {
                jobs.forEach(job => {
                    html += \`
                        <div class="analysis-section">
                            <h5>Job: \${job.id}</h5>
                            <div class="metadata-grid">
                                <div class="metadata-item">
                                    <span>Status:</span>
                                    <span>\${job.status}</span>
                                </div>
                                <div class="metadata-item">
                                    <span>Progress:</span>
                                    <span>\${job.progress}%</span>
                                </div>
                                <div class="metadata-item">
                                    <span>Type:</span>
                                    <span>\${job.request.type}</span>
                                </div>
                                <div class="metadata-item">
                                    <span>Started:</span>
                                    <span>\${new Date(job.startTime).toLocaleString()}</span>
                                </div>
                            </div>
                        </div>
                    \`;
                });
            }

            html += '</div>';
            container.innerHTML = html;
        }
    </script>
</body>
</html>
  `;

  res.send(html);
});

export default router;
