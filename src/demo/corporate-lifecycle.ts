/**
 * Corporate Lifecycle System Demo
 * 
 * Interactive demo for the corporate lifecycle management system
 */

import express from 'express';

const router = express.Router();

router.get('/demo/corporate-lifecycle', (req, res) => {
  const html = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Corporate Lifecycle System</title>
        <link rel="stylesheet" href="/styles.css">
        <style>
            .lifecycle-dashboard {
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
                gap: 20px;
                margin-top: 20px;
            }
            .lifecycle-panel {
                background-color: #1a1a1a;
                border-radius: 8px;
                padding: 20px;
                box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
            }
            .lifecycle-panel h3 {
                color: #4CAF50;
                margin-top: 0;
                display: flex;
                align-items: center;
                gap: 10px;
            }
            .health-meter {
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding: 15px;
                background-color: #2a2a2a;
                border-radius: 8px;
                margin: 15px 0;
            }
            .health-bar {
                flex: 1;
                height: 20px;
                background-color: #333;
                border-radius: 10px;
                margin: 0 15px;
                overflow: hidden;
            }
            .health-fill {
                height: 100%;
                background: linear-gradient(90deg, #F44336 0%, #FFC107 50%, #4CAF50 100%);
                transition: width 0.5s ease;
                border-radius: 10px;
            }
            .event-timeline {
                max-height: 400px;
                overflow-y: auto;
                border: 1px solid #333;
                border-radius: 8px;
                padding: 10px;
            }
            .event-item {
                display: flex;
                justify-content: space-between;
                align-items: flex-start;
                padding: 12px;
                border-left: 4px solid #4CAF50;
                background-color: #2a2a2a;
                border-radius: 8px;
                margin-bottom: 10px;
            }
            .event-item.merger { border-left-color: #2196F3; }
            .event-item.bankruptcy { border-left-color: #F44336; }
            .event-item.product_launch { border-left-color: #FF9800; }
            .event-item.market_entry { border-left-color: #9C27B0; }
            .event-content {
                flex: 1;
            }
            .event-type {
                font-weight: bold;
                color: #66BB6A;
                text-transform: uppercase;
                font-size: 0.8em;
            }
            .event-description {
                color: #ddd;
                margin: 5px 0;
            }
            .event-impact {
                color: #FFC107;
                font-size: 0.9em;
            }
            .event-date {
                color: #888;
                font-size: 0.8em;
                text-align: right;
                min-width: 100px;
            }
            .metrics-grid {
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
                gap: 15px;
                margin-top: 15px;
            }
            .metric-card {
                background-color: #2a2a2a;
                border-radius: 8px;
                padding: 15px;
                text-align: center;
                border: 2px solid transparent;
                transition: border-color 0.3s ease;
            }
            .metric-card.positive { border-color: #4CAF50; }
            .metric-card.negative { border-color: #F44336; }
            .metric-card.neutral { border-color: #FFC107; }
            .metric-value {
                font-size: 1.8em;
                font-weight: bold;
                color: #66BB6A;
                display: block;
            }
            .metric-label {
                color: #bbb;
                font-size: 0.9em;
                margin-top: 5px;
            }
            .metric-change {
                font-size: 0.8em;
                margin-top: 3px;
            }
            .metric-change.positive { color: #4CAF50; }
            .metric-change.negative { color: #F44336; }
            .action-buttons {
                display: flex;
                gap: 10px;
                margin-top: 20px;
                flex-wrap: wrap;
            }
            .action-btn {
                flex: 1;
                min-width: 150px;
                padding: 12px;
                background-color: #4CAF50;
                color: white;
                border: none;
                border-radius: 6px;
                cursor: pointer;
                font-size: 14px;
                transition: background-color 0.3s ease;
            }
            .action-btn:hover {
                background-color: #45a049;
            }
            .action-btn.secondary {
                background-color: #2196F3;
            }
            .action-btn.secondary:hover {
                background-color: #1976D2;
            }
            .action-btn.danger {
                background-color: #F44336;
            }
            .action-btn.danger:hover {
                background-color: #D32F2F;
            }
            .action-btn:disabled {
                background-color: #666;
                cursor: not-allowed;
            }
            .company-list {
                max-height: 300px;
                overflow-y: auto;
                border: 1px solid #333;
                border-radius: 8px;
                padding: 10px;
            }
            .company-item {
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding: 10px;
                background-color: #2a2a2a;
                border-radius: 6px;
                margin-bottom: 8px;
                cursor: pointer;
                transition: background-color 0.3s ease;
            }
            .company-item:hover {
                background-color: #333;
            }
            .company-name {
                font-weight: bold;
                color: #66BB6A;
            }
            .company-sector {
                color: #FFC107;
                font-size: 0.9em;
            }
            .company-health {
                text-align: right;
            }
            .health-score {
                font-weight: bold;
            }
            .health-score.excellent { color: #4CAF50; }
            .health-score.good { color: #8BC34A; }
            .health-score.fair { color: #FFC107; }
            .health-score.poor { color: #F44336; }
            .transaction-form {
                background-color: #2a2a2a;
                border-radius: 8px;
                padding: 20px;
                margin-top: 20px;
            }
            .form-group {
                margin-bottom: 15px;
            }
            .form-group label {
                display: block;
                color: #ddd;
                margin-bottom: 5px;
                font-weight: bold;
            }
            .form-group select,
            .form-group input {
                width: 100%;
                padding: 10px;
                background-color: #333;
                border: 1px solid #555;
                border-radius: 4px;
                color: #ddd;
                font-size: 14px;
            }
            .form-group select:focus,
            .form-group input:focus {
                outline: none;
                border-color: #4CAF50;
            }
            .insights-panel {
                background-color: #2a2a2a;
                border-radius: 8px;
                padding: 20px;
                margin-top: 20px;
            }
            .insight-item {
                padding: 10px;
                background-color: #333;
                border-radius: 6px;
                margin-bottom: 10px;
                border-left: 4px solid #4CAF50;
            }
            .recommendation-item {
                padding: 10px;
                background-color: #333;
                border-radius: 6px;
                margin-bottom: 10px;
                border-left: 4px solid #FFC107;
            }
        </style>
    </head>
    <body>
        <div class="container">
            <h1>🔄 Corporate Lifecycle System</h1>
            <div class="tab-buttons">
                <button class="tab-button active" onclick="showTab('overview')">Overview</button>
                <button class="tab-button" onclick="showTab('health')">Health Monitor</button>
                <button class="tab-button" onclick="showTab('transactions')">M&A Activity</button>
                <button class="tab-button" onclick="showTab('events')">Lifecycle Events</button>
                <button class="tab-button" onclick="showTab('products')">Product Evolution</button>
                <button class="tab-button" onclick="showTab('analytics')">Analytics</button>
            </div>

            <div id="overview-tab" class="tab-content active">
                <div class="lifecycle-dashboard">
                    <div class="lifecycle-panel">
                        <h3>🏢 Ecosystem Overview</h3>
                        <div class="metrics-grid" id="ecosystemMetrics"></div>
                        
                        <div class="health-meter">
                            <span>Ecosystem Health:</span>
                            <div class="health-bar">
                                <div class="health-fill" id="ecosystemHealthFill" style="width: 0%"></div>
                            </div>
                            <span id="ecosystemHealthValue">0%</span>
                        </div>
                        
                        <div class="action-buttons">
                            <button class="action-btn" onclick="generateMarketEntrants()">
                                🚀 Generate New Entrants
                            </button>
                            <button class="action-btn secondary" onclick="refreshOverview()">
                                🔄 Refresh Data
                            </button>
                        </div>
                    </div>

                    <div class="lifecycle-panel">
                        <h3>📊 Key Metrics</h3>
                        <div id="keyMetrics">
                            <p>Loading ecosystem metrics...</p>
                        </div>
                    </div>
                </div>
            </div>

            <div id="health-tab" class="tab-content">
                <div class="lifecycle-dashboard">
                    <div class="lifecycle-panel">
                        <h3>🏥 Corporate Health Monitor</h3>
                        <div class="company-list" id="companyHealthList"></div>
                    </div>
                    
                    <div class="lifecycle-panel">
                        <h3>⚠️ Risk Assessment</h3>
                        <div id="riskAssessment"></div>
                    </div>
                </div>
            </div>

            <div id="transactions-tab" class="tab-content">
                <div class="lifecycle-dashboard">
                    <div class="lifecycle-panel">
                        <h3>🤝 M&A Activity</h3>
                        <div id="mergersList"></div>
                        
                        <div class="transaction-form" id="transactionForm">
                            <h4>Initiate Transaction</h4>
                            <div class="form-group">
                                <label>Transaction Type:</label>
                                <select id="transactionType">
                                    <option value="acquisition">Acquisition</option>
                                    <option value="merger">Merger</option>
                                    <option value="hostile_takeover">Hostile Takeover</option>
                                </select>
                            </div>
                            <div class="form-group">
                                <label>Acquirer ID:</label>
                                <input type="number" id="acquirerId" placeholder="Enter acquirer corporation ID">
                            </div>
                            <div class="form-group">
                                <label>Target ID:</label>
                                <input type="number" id="targetId" placeholder="Enter target corporation ID">
                            </div>
                            <div class="form-group">
                                <label>Offer Price ($):</label>
                                <input type="number" id="offerPrice" placeholder="Enter offer price in dollars">
                            </div>
                            <button class="action-btn" onclick="executeTransaction()">
                                💼 Execute Transaction
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <div id="events-tab" class="tab-content">
                <div class="lifecycle-panel">
                    <h3>📅 Lifecycle Events Timeline</h3>
                    <div class="event-timeline" id="eventsTimeline"></div>
                </div>
            </div>

            <div id="products-tab" class="tab-content">
                <div class="lifecycle-dashboard">
                    <div class="lifecycle-panel">
                        <h3>🚀 Product Evolution</h3>
                        <div id="productEvolutions"></div>
                        
                        <div class="transaction-form">
                            <h4>Launch Product Evolution</h4>
                            <div class="form-group">
                                <label>Corporation ID:</label>
                                <input type="number" id="productCorpId" placeholder="Enter corporation ID">
                            </div>
                            <div class="form-group">
                                <label>Product ID:</label>
                                <input type="number" id="productId" placeholder="Enter product ID">
                            </div>
                            <div class="form-group">
                                <label>Evolution Type:</label>
                                <select id="evolutionType">
                                    <option value="upgrade">Upgrade</option>
                                    <option value="new_version">New Version</option>
                                    <option value="pivot">Pivot</option>
                                    <option value="expansion">Expansion</option>
                                    <option value="discontinuation">Discontinuation</option>
                                </select>
                            </div>
                            <div class="form-group">
                                <label>Development Cost ($):</label>
                                <input type="number" id="developmentCost" placeholder="Enter development cost">
                            </div>
                            <button class="action-btn" onclick="launchProductEvolution()">
                                🔬 Launch Evolution
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <div id="analytics-tab" class="tab-content">
                <div class="lifecycle-dashboard">
                    <div class="lifecycle-panel">
                        <h3>📈 Lifecycle Analytics</h3>
                        <div id="analyticsData"></div>
                    </div>
                    
                    <div class="insights-panel">
                        <h3>💡 Insights & Recommendations</h3>
                        <div id="insightsContent"></div>
                    </div>
                </div>
            </div>
        </div>

        <script>
            const API_BASE_URL = '/api/corporate-lifecycle';
            let currentCivilizationId = 1; // Default civilization ID
            let currentData = {};

            async function fetchData(url) {
                try {
                    const response = await fetch(url);
                    if (!response.ok) throw new Error(\`HTTP \${response.status}\`);
                    return await response.json();
                } catch (error) {
                    console.error('Fetch error:', error);
                    throw error;
                }
            }

            async function postData(url, data) {
                try {
                    const response = await fetch(url, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(data)
                    });
                    if (!response.ok) throw new Error(\`HTTP \${response.status}\`);
                    return await response.json();
                } catch (error) {
                    console.error('Post error:', error);
                    throw error;
                }
            }

            async function loadOverview() {
                try {
                    const data = await fetchData(\`\${API_BASE_URL}/ecosystem/\${currentCivilizationId}\`);
                    currentData.ecosystem = data;
                    
                    displayEcosystemMetrics(data);
                    displayKeyMetrics(data);
                    updateHealthMeter(data.healthSummary.averageHealth);
                    
                } catch (error) {
                    document.getElementById('ecosystemMetrics').innerHTML = 
                        '<p style="color: #f44336;">Error loading ecosystem data</p>';
                }
            }

            function displayEcosystemMetrics(data) {
                const ecosystem = data.ecosystem;
                const health = data.healthSummary;
                
                const metricsHtml = \`
                    <div class="metric-card positive">
                        <span class="metric-value">\${health.totalCorporations}</span>
                        <div class="metric-label">Total Companies</div>
                    </div>
                    <div class="metric-card \${ecosystem.healthyCompanies > ecosystem.strugglingCompanies ? 'positive' : 'negative'}">
                        <span class="metric-value">\${ecosystem.healthyCompanies}</span>
                        <div class="metric-label">Healthy Companies</div>
                    </div>
                    <div class="metric-card \${ecosystem.strugglingCompanies > 0 ? 'negative' : 'positive'}">
                        <span class="metric-value">\${ecosystem.strugglingCompanies}</span>
                        <div class="metric-label">Struggling</div>
                    </div>
                    <div class="metric-card \${ecosystem.bankruptcyRisk.length > 0 ? 'negative' : 'positive'}">
                        <span class="metric-value">\${ecosystem.bankruptcyRisk.length}</span>
                        <div class="metric-label">At Risk</div>
                    </div>
                \`;
                document.getElementById('ecosystemMetrics').innerHTML = metricsHtml;
            }

            function displayKeyMetrics(data) {
                const health = data.healthSummary;
                const ecosystem = data.ecosystem;
                
                const metricsHtml = \`
                    <div class="metric">
                        <span class="metric-label">Ecosystem Health:</span>
                        <span class="metric-value" style="color: \${getHealthColor(health.averageHealth)}">\${data.ecosystemHealth.toUpperCase()}</span>
                    </div>
                    <div class="metric">
                        <span class="metric-label">Risk Level:</span>
                        <span class="metric-value" style="color: \${getRiskColor(data.riskLevel)}">\${data.riskLevel.toUpperCase()}</span>
                    </div>
                    <div class="metric">
                        <span class="metric-label">M&A Opportunities:</span>
                        <span class="metric-value">\${ecosystem.mergerOpportunities}</span>
                    </div>
                    <div class="metric">
                        <span class="metric-label">Acquisition Targets:</span>
                        <span class="metric-value">\${ecosystem.acquisitionTargets.length}</span>
                    </div>
                    <div class="metric">
                        <span class="metric-label">Innovation Leaders:</span>
                        <span class="metric-value">\${health.innovationLeaders}</span>
                    </div>
                \`;
                document.getElementById('keyMetrics').innerHTML = metricsHtml;
            }

            function updateHealthMeter(health) {
                const fill = document.getElementById('ecosystemHealthFill');
                const value = document.getElementById('ecosystemHealthValue');
                
                fill.style.width = health + '%';
                value.textContent = Math.round(health) + '%';
            }

            async function loadHealth() {
                try {
                    // Mock company health data for demo
                    const companies = [
                        { id: 1, name: 'TechCorp Industries', sector: 'Technology', health: 85 },
                        { id: 2, name: 'BioMed Solutions', sector: 'Healthcare', health: 72 },
                        { id: 3, name: 'Energy Dynamics', sector: 'Energy', health: 68 },
                        { id: 4, name: 'Manufacturing Plus', sector: 'Manufacturing', health: 45 },
                        { id: 5, name: 'Financial Group', sector: 'Financial', health: 38 }
                    ];
                    
                    const healthHtml = companies.map(company => \`
                        <div class="company-item" onclick="viewCompanyDetails(\${company.id})">
                            <div>
                                <div class="company-name">\${company.name}</div>
                                <div class="company-sector">\${company.sector}</div>
                            </div>
                            <div class="company-health">
                                <div class="health-score \${getHealthGrade(company.health)}">\${company.health}%</div>
                                <div style="font-size: 0.8em; color: #888;">\${getHealthGrade(company.health).toUpperCase()}</div>
                            </div>
                        </div>
                    \`).join('');
                    
                    document.getElementById('companyHealthList').innerHTML = healthHtml;
                    
                    // Risk assessment
                    const riskHtml = \`
                        <div class="metric-card negative">
                            <span class="metric-value">2</span>
                            <div class="metric-label">High Risk Companies</div>
                        </div>
                        <div class="metric-card neutral">
                            <span class="metric-value">3</span>
                            <div class="metric-label">Medium Risk</div>
                        </div>
                        <div class="metric-card positive">
                            <span class="metric-value">5</span>
                            <div class="metric-label">Low Risk</div>
                        </div>
                    \`;
                    document.getElementById('riskAssessment').innerHTML = riskHtml;
                    
                } catch (error) {
                    document.getElementById('companyHealthList').innerHTML = 
                        '<p style="color: #f44336;">Error loading health data</p>';
                }
            }

            async function loadTransactions() {
                try {
                    const data = await fetchData(\`\${API_BASE_URL}/mergers-acquisitions\`);
                    currentData.mergers = data;
                    
                    const mergersHtml = data.mergers.map(merger => \`
                        <div class="event-item merger">
                            <div class="event-content">
                                <div class="event-type">\${merger.transaction_type}</div>
                                <div class="event-description">
                                    \${merger.acquirer_name || 'Company ' + merger.acquirer_id} acquiring 
                                    \${merger.target_name || 'Company ' + merger.target_id}
                                </div>
                                <div class="event-impact">
                                    Value: $\${(merger.offer_price / 1000000000).toFixed(1)}B | 
                                    Premium: \${merger.offer_premium.toFixed(1)}%
                                </div>
                            </div>
                            <div class="event-date">
                                <div>\${new Date(merger.announcement_date).toLocaleDateString()}</div>
                                <div style="color: \${getStatusColor(merger.status)};">\${merger.status.toUpperCase()}</div>
                            </div>
                        </div>
                    \`).join('');
                    
                    document.getElementById('mergersList').innerHTML = 
                        mergersHtml || '<p style="color: #888;">No recent M&A activity</p>';
                        
                } catch (error) {
                    document.getElementById('mergersList').innerHTML = 
                        '<p style="color: #f44336;">Error loading M&A data</p>';
                }
            }

            async function loadEvents() {
                try {
                    const data = await fetchData(\`\${API_BASE_URL}/events?limit=20\`);
                    currentData.events = data;
                    
                    const eventsHtml = data.events.map(event => \`
                        <div class="event-item \${event.type}">
                            <div class="event-content">
                                <div class="event-type">\${event.type.replace('_', ' ')}</div>
                                <div class="event-description">\${event.description}</div>
                                <div class="event-impact">
                                    Financial: $\${(event.financial_impact / 1000000).toFixed(1)}M | 
                                    Success: \${event.success_probability.toFixed(0)}%
                                </div>
                            </div>
                            <div class="event-date">
                                <div>\${new Date(event.event_date).toLocaleDateString()}</div>
                                <div style="color: \${getStatusColor(event.status)};">\${event.status.toUpperCase()}</div>
                            </div>
                        </div>
                    \`).join('');
                    
                    document.getElementById('eventsTimeline').innerHTML = 
                        eventsHtml || '<p style="color: #888;">No recent lifecycle events</p>';
                        
                } catch (error) {
                    document.getElementById('eventsTimeline').innerHTML = 
                        '<p style="color: #f44336;">Error loading events</p>';
                }
            }

            async function loadProducts() {
                try {
                    const data = await fetchData(\`\${API_BASE_URL}/product-evolutions\`);
                    currentData.products = data;
                    
                    const productsHtml = data.evolutions.map(evolution => \`
                        <div class="event-item product_launch">
                            <div class="event-content">
                                <div class="event-type">\${evolution.evolution_type}</div>
                                <div class="event-description">
                                    \${evolution.company_name || 'Company ' + evolution.corporation_id} - Product \${evolution.product_id}
                                </div>
                                <div class="event-impact">
                                    Investment: $\${(evolution.development_cost / 1000000).toFixed(1)}M | 
                                    Stage: \${evolution.lifecycle_stage}
                                </div>
                            </div>
                            <div class="event-date">
                                <div>\${new Date(evolution.launch_date).toLocaleDateString()}</div>
                                <div>Advantage: \${evolution.competitive_advantage.toFixed(0)}%</div>
                            </div>
                        </div>
                    \`).join('');
                    
                    document.getElementById('productEvolutions').innerHTML = 
                        productsHtml || '<p style="color: #888;">No recent product evolutions</p>';
                        
                } catch (error) {
                    document.getElementById('productEvolutions').innerHTML = 
                        '<p style="color: #f44336;">Error loading product data</p>';
                }
            }

            async function loadAnalytics() {
                try {
                    const data = await fetchData(\`\${API_BASE_URL}/analytics/\${currentCivilizationId}\`);
                    currentData.analytics = data;
                    
                    const analyticsHtml = \`
                        <div class="metrics-grid">
                            <div class="metric-card">
                                <span class="metric-value">\${data.currentState.totalCorporations}</span>
                                <div class="metric-label">Total Companies</div>
                            </div>
                            <div class="metric-card">
                                <span class="metric-value">\${data.currentState.averageHealth.toFixed(0)}%</span>
                                <div class="metric-label">Avg Health</div>
                            </div>
                            <div class="metric-card">
                                <span class="metric-value">\${data.currentState.innovationLeaders}</span>
                                <div class="metric-label">Innovation Leaders</div>
                            </div>
                            <div class="metric-card">
                                <span class="metric-value">\${data.currentState.highRiskCount}</span>
                                <div class="metric-label">High Risk</div>
                            </div>
                        </div>
                        
                        <h4 style="color: #4CAF50; margin-top: 30px;">Historical Trends</h4>
                        <div style="margin-top: 15px;">
                            \${data.historicalMetrics.slice(0, 5).map(metric => \`
                                <div class="metric" style="padding: 8px; background-color: #333; border-radius: 4px; margin-bottom: 8px;">
                                    <strong>\${new Date(metric.reporting_period).toLocaleDateString()}</strong>: 
                                    \${metric.total_corporations} companies, 
                                    \${metric.new_entrants} new entrants, 
                                    \${metric.bankruptcies} bankruptcies
                                </div>
                            \`).join('')}
                        </div>
                    \`;
                    
                    document.getElementById('analyticsData').innerHTML = analyticsHtml;
                    
                    // Insights and recommendations
                    const insightsHtml = \`
                        <h4 style="color: #4CAF50;">Key Insights</h4>
                        \${data.insights.map(insight => \`
                            <div class="insight-item">\${insight}</div>
                        \`).join('')}
                        
                        <h4 style="color: #FFC107; margin-top: 20px;">Recommendations</h4>
                        \${data.recommendations.map(rec => \`
                            <div class="recommendation-item">\${rec}</div>
                        \`).join('')}
                    \`;
                    
                    document.getElementById('insightsContent').innerHTML = insightsHtml;
                    
                } catch (error) {
                    document.getElementById('analyticsData').innerHTML = 
                        '<p style="color: #f44336;">Error loading analytics</p>';
                }
            }

            async function generateMarketEntrants() {
                try {
                    const button = event.target;
                    button.disabled = true;
                    button.textContent = '🔄 Generating...';
                    
                    const data = await postData(\`\${API_BASE_URL}/market-entrants/\${currentCivilizationId}\`, { count: 2 });
                    
                    alert(\`🎉 \${data.message}\\n\\nNew companies: \${data.newCompanies.join(', ')}\`);
                    await loadOverview();
                    
                } catch (error) {
                    alert('❌ Error generating market entrants: ' + error.message);
                } finally {
                    const button = document.querySelector('button[onclick="generateMarketEntrants()"]');
                    button.disabled = false;
                    button.textContent = '🚀 Generate New Entrants';
                }
            }

            async function executeTransaction() {
                try {
                    const transactionType = document.getElementById('transactionType').value;
                    const acquirerId = parseInt(document.getElementById('acquirerId').value);
                    const targetId = parseInt(document.getElementById('targetId').value);
                    const offerPrice = parseFloat(document.getElementById('offerPrice').value);
                    
                    if (!acquirerId || !targetId || !offerPrice) {
                        alert('Please fill in all required fields');
                        return;
                    }
                    
                    const data = await postData(\`\${API_BASE_URL}/merger-acquisition\`, {
                        acquirerId,
                        targetId,
                        transactionType,
                        offerPrice
                    });
                    
                    alert(\`✅ \${data.message}\\n\\nSuccess Probability: \${data.successProbability}\`);
                    await loadTransactions();
                    
                    // Clear form
                    document.getElementById('acquirerId').value = '';
                    document.getElementById('targetId').value = '';
                    document.getElementById('offerPrice').value = '';
                    
                } catch (error) {
                    alert('❌ Error executing transaction: ' + error.message);
                }
            }

            async function launchProductEvolution() {
                try {
                    const corporationId = parseInt(document.getElementById('productCorpId').value);
                    const productId = parseInt(document.getElementById('productId').value);
                    const evolutionType = document.getElementById('evolutionType').value;
                    const developmentCost = parseFloat(document.getElementById('developmentCost').value);
                    
                    if (!corporationId || !productId || !developmentCost) {
                        alert('Please fill in all required fields');
                        return;
                    }
                    
                    const data = await postData(\`\${API_BASE_URL}/product-evolution\`, {
                        corporationId,
                        productId,
                        evolutionType,
                        developmentCost
                    });
                    
                    alert(\`🚀 \${data.message}\\n\\nExpected Launch: \${new Date(data.expectedLaunch).toLocaleDateString()}\`);
                    await loadProducts();
                    
                    // Clear form
                    document.getElementById('productCorpId').value = '';
                    document.getElementById('productId').value = '';
                    document.getElementById('developmentCost').value = '';
                    
                } catch (error) {
                    alert('❌ Error launching product evolution: ' + error.message);
                }
            }

            async function refreshOverview() {
                await loadOverview();
            }

            function viewCompanyDetails(companyId) {
                alert(\`Company \${companyId} details would open here.\\n\\nThis would show detailed health metrics, financial data, and lifecycle history.\`);
            }

            // Helper functions
            function getHealthColor(health) {
                if (health >= 70) return '#4CAF50';
                if (health >= 50) return '#FFC107';
                return '#F44336';
            }

            function getRiskColor(risk) {
                if (risk === 'low') return '#4CAF50';
                if (risk === 'medium') return '#FFC107';
                return '#F44336';
            }

            function getHealthGrade(health) {
                if (health >= 80) return 'excellent';
                if (health >= 60) return 'good';
                if (health >= 40) return 'fair';
                return 'poor';
            }

            function getStatusColor(status) {
                if (status === 'completed' || status === 'active') return '#4CAF50';
                if (status === 'in_progress' || status === 'pending') return '#FFC107';
                return '#F44336';
            }

            function showTab(tabId) {
                // Hide all tab contents
                document.querySelectorAll('.tab-content').forEach(content => {
                    content.classList.remove('active');
                });
                
                // Remove active class from all tabs
                document.querySelectorAll('.tab-button').forEach(tab => {
                    tab.classList.remove('active');
                });
                
                // Show selected tab content
                document.getElementById(tabId + '-tab').classList.add('active');
                
                // Add active class to clicked tab
                event.target.classList.add('active');
                
                // Load content for the tab
                switch(tabId) {
                    case 'overview':
                        loadOverview();
                        break;
                    case 'health':
                        loadHealth();
                        break;
                    case 'transactions':
                        loadTransactions();
                        break;
                    case 'events':
                        loadEvents();
                        break;
                    case 'products':
                        loadProducts();
                        break;
                    case 'analytics':
                        loadAnalytics();
                        break;
                }
            }

            // Initialize
            document.addEventListener('DOMContentLoaded', () => {
                showTab('overview');
            });
        </script>
    </body>
    </html>
  `;
  
  res.send(html);
});

export default router;
