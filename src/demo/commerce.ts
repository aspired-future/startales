import express from 'express';

const router = express.Router();

/**
 * Commerce Secretary Demo Page
 */
router.get('/demo/commerce', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Commerce Secretary Command Center</title>
        <style>
            * {
                margin: 0;
                padding: 0;
                box-sizing: border-box;
            }
            
            body {
                font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                background: linear-gradient(135deg, #1e3c72 0%, #2a5298 100%);
                color: #ffffff;
                min-height: 100vh;
                padding: 20px;
            }
            
            .header {
                text-align: center;
                margin-bottom: 30px;
                padding: 20px;
                background: rgba(255, 255, 255, 0.1);
                border-radius: 15px;
                backdrop-filter: blur(10px);
            }
            
            .header h1 {
                font-size: 2.5em;
                margin-bottom: 10px;
                color: #ffd700;
                text-shadow: 2px 2px 4px rgba(0,0,0,0.5);
            }
            
            .header p {
                font-size: 1.2em;
                opacity: 0.9;
            }
            
            .dashboard {
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
                gap: 20px;
                margin-bottom: 30px;
            }
            
            .card {
                background: rgba(255, 255, 255, 0.15);
                border-radius: 15px;
                padding: 25px;
                backdrop-filter: blur(10px);
                border: 1px solid rgba(255, 255, 255, 0.2);
                transition: transform 0.3s ease, box-shadow 0.3s ease;
            }
            
            .card:hover {
                transform: translateY(-5px);
                box-shadow: 0 10px 25px rgba(0,0,0,0.2);
            }
            
            .card h3 {
                color: #ffd700;
                margin-bottom: 15px;
                font-size: 1.4em;
                display: flex;
                align-items: center;
                gap: 10px;
            }
            
            .metric {
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin: 10px 0;
                padding: 8px 0;
                border-bottom: 1px solid rgba(255,255,255,0.1);
            }
            
            .metric:last-child {
                border-bottom: none;
            }
            
            .metric-value {
                font-weight: bold;
                color: #4CAF50;
            }
            
            .controls {
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
                gap: 20px;
                margin-bottom: 30px;
            }
            
            .control-panel {
                background: rgba(255, 255, 255, 0.15);
                border-radius: 15px;
                padding: 25px;
                backdrop-filter: blur(10px);
                border: 1px solid rgba(255, 255, 255, 0.2);
            }
            
            .control-panel h4 {
                color: #ffd700;
                margin-bottom: 15px;
                font-size: 1.2em;
            }
            
            .form-group {
                margin-bottom: 15px;
            }
            
            .form-group label {
                display: block;
                margin-bottom: 5px;
                font-weight: 500;
            }
            
            .form-group input,
            .form-group select,
            .form-group textarea {
                width: 100%;
                padding: 10px;
                border: 1px solid rgba(255,255,255,0.3);
                border-radius: 8px;
                background: rgba(255,255,255,0.1);
                color: #ffffff;
                font-size: 14px;
            }
            
            .form-group input::placeholder,
            .form-group textarea::placeholder {
                color: rgba(255,255,255,0.6);
            }
            
            .btn {
                background: linear-gradient(45deg, #4CAF50, #45a049);
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
                box-shadow: 0 5px 15px rgba(76, 175, 80, 0.4);
            }
            
            .btn-secondary {
                background: linear-gradient(45deg, #2196F3, #1976D2);
            }
            
            .btn-secondary:hover {
                box-shadow: 0 5px 15px rgba(33, 150, 243, 0.4);
            }
            
            .btn-warning {
                background: linear-gradient(45deg, #FF9800, #F57C00);
            }
            
            .btn-warning:hover {
                box-shadow: 0 5px 15px rgba(255, 152, 0, 0.4);
            }
            
            .activity-log {
                background: rgba(255, 255, 255, 0.15);
                border-radius: 15px;
                padding: 25px;
                backdrop-filter: blur(10px);
                border: 1px solid rgba(255, 255, 255, 0.2);
                max-height: 400px;
                overflow-y: auto;
            }
            
            .activity-log h4 {
                color: #ffd700;
                margin-bottom: 15px;
                font-size: 1.2em;
            }
            
            .log-entry {
                padding: 10px;
                margin: 8px 0;
                background: rgba(255,255,255,0.1);
                border-radius: 8px;
                border-left: 4px solid #4CAF50;
            }
            
            .log-entry.warning {
                border-left-color: #FF9800;
            }
            
            .log-entry.error {
                border-left-color: #f44336;
            }
            
            .log-timestamp {
                font-size: 0.9em;
                opacity: 0.7;
                float: right;
            }
            
            .status-indicator {
                display: inline-block;
                width: 12px;
                height: 12px;
                border-radius: 50%;
                margin-right: 8px;
            }
            
            .status-active { background-color: #4CAF50; }
            .status-pending { background-color: #FF9800; }
            .status-suspended { background-color: #f44336; }
            
            .icon {
                font-size: 1.2em;
            }
            
            @media (max-width: 768px) {
                .dashboard {
                    grid-template-columns: 1fr;
                }
                
                .controls {
                    grid-template-columns: 1fr;
                }
                
                .header h1 {
                    font-size: 2em;
                }
            }
        </style>
    </head>
    <body>
        <div class="header">
            <h1>🏛️ Commerce Secretary Command Center</h1>
            <p>Economic Policy • Business Regulation • Market Oversight • Trade Management</p>
        </div>

        <div class="dashboard">
            <div class="card">
                <h3><span class="icon">📊</span>Department Analytics</h3>
                <div class="metric">
                    <span>Total Operations</span>
                    <span class="metric-value" id="totalOperations">Loading...</span>
                </div>
                <div class="metric">
                    <span>Active Operations</span>
                    <span class="metric-value" id="activeOperations">Loading...</span>
                </div>
                <div class="metric">
                    <span>Registered Businesses</span>
                    <span class="metric-value" id="totalBusinesses">Loading...</span>
                </div>
                <div class="metric">
                    <span>Active Trade Policies</span>
                    <span class="metric-value" id="activePolicies">Loading...</span>
                </div>
                <div class="metric">
                    <span>Intelligence Reports</span>
                    <span class="metric-value" id="intelligenceReports">Loading...</span>
                </div>
                <div class="metric">
                    <span>Budget Utilization</span>
                    <span class="metric-value" id="budgetUtilization">Loading...</span>
                </div>
            </div>

            <div class="card">
                <h3><span class="icon">💹</span>Trade Resources</h3>
                <div id="tradeResources">Loading trade resources...</div>
            </div>

            <div class="card">
                <h3><span class="icon">🏢</span>Recent Business Registrations</h3>
                <div id="recentBusinesses">Loading recent registrations...</div>
            </div>

            <div class="card">
                <h3><span class="icon">📈</span>Market Intelligence</h3>
                <div id="marketIntelligence">Loading market data...</div>
            </div>
        </div>

        <div class="controls">
            <div class="control-panel">
                <h4>🏛️ Trade Policy Management</h4>
                <div class="form-group">
                    <label for="tariffResource">Target Resource:</label>
                    <select id="tariffResource">
                        <option value="">All Resources</option>
                    </select>
                </div>
                <div class="form-group">
                    <label for="tariffRate">Tariff Rate (%):</label>
                    <input type="number" id="tariffRate" placeholder="e.g., 15" min="0" max="100" step="0.1">
                </div>
                <div class="form-group">
                    <label for="tariffJustification">Justification:</label>
                    <textarea id="tariffJustification" rows="3" placeholder="Economic justification for this tariff..."></textarea>
                </div>
                <button class="btn" onclick="createTariffPolicy()">Set Tariff Policy</button>
                <button class="btn btn-secondary" onclick="loadTradePolicies()">View All Policies</button>
            </div>

            <div class="control-panel">
                <h4>🏢 Business Registration</h4>
                <div class="form-group">
                    <label for="businessName">Business Name:</label>
                    <input type="text" id="businessName" placeholder="e.g., Stellar Manufacturing Corp">
                </div>
                <div class="form-group">
                    <label for="businessType">Business Type:</label>
                    <select id="businessType">
                        <option value="corporation">Corporation</option>
                        <option value="partnership">Partnership</option>
                        <option value="sole_proprietorship">Sole Proprietorship</option>
                        <option value="cooperative">Cooperative</option>
                        <option value="state_enterprise">State Enterprise</option>
                    </select>
                </div>
                <div class="form-group">
                    <label for="industrySector">Industry Sector:</label>
                    <input type="text" id="industrySector" placeholder="e.g., Manufacturing, Technology, Mining">
                </div>
                <div class="form-group">
                    <label for="annualRevenue">Annual Revenue:</label>
                    <input type="number" id="annualRevenue" placeholder="e.g., 1000000" min="0">
                </div>
                <button class="btn" onclick="registerBusiness()">Register Business</button>
                <button class="btn btn-secondary" onclick="loadBusinesses()">View All Businesses</button>
            </div>

            <div class="control-panel">
                <h4>📊 Market Intelligence</h4>
                <div class="form-group">
                    <label for="intelligenceType">Analysis Type:</label>
                    <select id="intelligenceType">
                        <option value="price_analysis">Price Analysis</option>
                        <option value="demand_forecast">Demand Forecast</option>
                        <option value="competitor_analysis">Competitor Analysis</option>
                        <option value="trade_flow_analysis">Trade Flow Analysis</option>
                        <option value="market_opportunity">Market Opportunity</option>
                    </select>
                </div>
                <div class="form-group">
                    <label for="targetMarket">Target Market:</label>
                    <input type="text" id="targetMarket" placeholder="e.g., domestic, galactic_sector_1">
                </div>
                <div class="form-group">
                    <label for="analystNotes">Analyst Notes:</label>
                    <textarea id="analystNotes" rows="3" placeholder="Additional context or observations..."></textarea>
                </div>
                <button class="btn" onclick="collectIntelligence()">Collect Intelligence</button>
                <button class="btn btn-secondary" onclick="performMarketAnalysis()">Auto-Analyze Trade Data</button>
            </div>

            <div class="control-panel">
                <h4>🚀 Economic Development</h4>
                <div class="form-group">
                    <label for="projectName">Project Name:</label>
                    <input type="text" id="projectName" placeholder="e.g., Tech Hub Development Initiative">
                </div>
                <div class="form-group">
                    <label for="projectType">Project Type:</label>
                    <select id="projectType">
                        <option value="investment_promotion">Investment Promotion</option>
                        <option value="export_development">Export Development</option>
                        <option value="industrial_development">Industrial Development</option>
                        <option value="infrastructure">Infrastructure</option>
                        <option value="innovation_hub">Innovation Hub</option>
                    </select>
                </div>
                <div class="form-group">
                    <label for="projectBudget">Budget Allocation:</label>
                    <input type="number" id="projectBudget" placeholder="e.g., 5000000" min="0">
                </div>
                <div class="form-group">
                    <label for="targetCompletion">Target Completion:</label>
                    <input type="date" id="targetCompletion">
                </div>
                <button class="btn" onclick="createDevelopmentProject()">Create Project</button>
                <button class="btn btn-secondary" onclick="loadDevelopmentProjects()">View All Projects</button>
            </div>
        </div>

        <div class="activity-log">
            <h4>📋 Recent Commerce Activities</h4>
            <div id="activityLog">
                <div class="log-entry">
                    <span class="log-timestamp">Just now</span>
                    <strong>Commerce Secretary Command Center Initialized</strong><br>
                    All systems operational. Ready for economic policy management.
                </div>
            </div>
        </div>

        <script>
            const CAMPAIGN_ID = 1;
            
            // Load initial data
            document.addEventListener('DOMContentLoaded', function() {
                loadDashboardData();
                loadTradeResources();
                setDefaultDates();
            });
            
            function setDefaultDates() {
                const tomorrow = new Date();
                tomorrow.setDate(tomorrow.getDate() + 30);
                document.getElementById('targetCompletion').value = tomorrow.toISOString().split('T')[0];
            }
            
            async function loadDashboardData() {
                try {
                    const response = await fetch(\`/api/commerce/analytics/dashboard?campaignId=\${CAMPAIGN_ID}\`);
                    const data = await response.json();
                    
                    if (data.success) {
                        const analytics = data.analytics;
                        document.getElementById('totalOperations').textContent = analytics.totalOperations;
                        document.getElementById('activeOperations').textContent = analytics.activeOperations;
                        document.getElementById('totalBusinesses').textContent = analytics.totalBusinesses;
                        document.getElementById('activePolicies').textContent = analytics.activeTradePolicies;
                        document.getElementById('intelligenceReports').textContent = analytics.totalIntelligenceReports;
                        document.getElementById('budgetUtilization').textContent = (analytics.budgetUtilization * 100).toFixed(1) + '%';
                    }
                } catch (error) {
                    console.error('Error loading dashboard data:', error);
                    addLogEntry('Failed to load dashboard analytics', 'error');
                }
            }
            
            async function loadTradeResources() {
                try {
                    const response = await fetch('/api/commerce/resources');
                    const data = await response.json();
                    
                    if (data.success) {
                        const resourcesDiv = document.getElementById('tradeResources');
                        const resourceSelect = document.getElementById('tariffResource');
                        
                        resourcesDiv.innerHTML = '';
                        
                        data.resources.forEach(resource => {
                            const resourceDiv = document.createElement('div');
                            resourceDiv.className = 'metric';
                            resourceDiv.innerHTML = \`
                                <span>\${resource.name}</span>
                                <span class="metric-value">\${resource.basePrice} credits</span>
                            \`;
                            resourcesDiv.appendChild(resourceDiv);
                            
                            const option = document.createElement('option');
                            option.value = resource.id;
                            option.textContent = resource.name;
                            resourceSelect.appendChild(option);
                        });
                    }
                } catch (error) {
                    console.error('Error loading trade resources:', error);
                    document.getElementById('tradeResources').innerHTML = '<div class="metric"><span>Error loading resources</span></div>';
                }
            }
            
            async function createTariffPolicy() {
                const resource = document.getElementById('tariffResource').value;
                const rate = document.getElementById('tariffRate').value;
                const justification = document.getElementById('tariffJustification').value;
                
                if (!rate || !justification) {
                    alert('Please fill in tariff rate and justification');
                    return;
                }
                
                try {
                    const response = await fetch('/api/commerce/policies/tariffs', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            campaignId: CAMPAIGN_ID,
                            targetResource: resource || null,
                            tariffRate: parseFloat(rate) / 100,
                            effectiveDate: new Date().toISOString(),
                            justification: justification,
                            createdBy: 'Commerce Secretary'
                        })
                    });
                    
                    const data = await response.json();
                    
                    if (data.success) {
                        addLogEntry(\`Tariff policy created: \${rate}% on \${resource || 'all resources'}\`, 'success');
                        document.getElementById('tariffRate').value = '';
                        document.getElementById('tariffJustification').value = '';
                        loadDashboardData();
                    } else {
                        addLogEntry(\`Failed to create tariff policy: \${data.message}\`, 'error');
                    }
                } catch (error) {
                    console.error('Error creating tariff policy:', error);
                    addLogEntry('Error creating tariff policy', 'error');
                }
            }
            
            async function registerBusiness() {
                const name = document.getElementById('businessName').value;
                const type = document.getElementById('businessType').value;
                const sector = document.getElementById('industrySector').value;
                const revenue = document.getElementById('annualRevenue').value;
                
                if (!name || !type || !sector) {
                    alert('Please fill in business name, type, and sector');
                    return;
                }
                
                try {
                    const response = await fetch('/api/commerce/businesses/register', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            campaignId: CAMPAIGN_ID,
                            businessName: name,
                            businessType: type,
                            industrySector: sector,
                            annualRevenue: revenue ? parseFloat(revenue) : 0,
                            employeeCount: Math.floor(Math.random() * 500) + 10,
                            contactInfo: {
                                email: \`contact@\${name.toLowerCase().replace(/\\s+/g, '')}.com\`,
                                phone: \`+1-\${Math.floor(Math.random() * 900) + 100}-\${Math.floor(Math.random() * 900) + 100}-\${Math.floor(Math.random() * 9000) + 1000}\`
                            }
                        })
                    });
                    
                    const data = await response.json();
                    
                    if (data.success) {
                        addLogEntry(\`Business registered: \${name} (\${type})\`, 'success');
                        document.getElementById('businessName').value = '';
                        document.getElementById('industrySector').value = '';
                        document.getElementById('annualRevenue').value = '';
                        loadDashboardData();
                    } else {
                        addLogEntry(\`Failed to register business: \${data.message}\`, 'error');
                    }
                } catch (error) {
                    console.error('Error registering business:', error);
                    addLogEntry('Error registering business', 'error');
                }
            }
            
            async function collectIntelligence() {
                const type = document.getElementById('intelligenceType').value;
                const market = document.getElementById('targetMarket').value;
                const notes = document.getElementById('analystNotes').value;
                
                if (!type || !market) {
                    alert('Please select intelligence type and target market');
                    return;
                }
                
                try {
                    const response = await fetch('/api/commerce/intelligence/collect-data', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            campaignId: CAMPAIGN_ID,
                            intelligenceType: type,
                            targetMarket: market,
                            dataPoints: {
                                collectionMethod: 'manual',
                                sources: ['trade_data', 'market_reports', 'economic_indicators']
                            },
                            analystNotes: notes,
                            classification: 'internal'
                        })
                    });
                    
                    const data = await response.json();
                    
                    if (data.success) {
                        addLogEntry(\`Intelligence collected: \${type} for \${market}\`, 'success');
                        document.getElementById('targetMarket').value = '';
                        document.getElementById('analystNotes').value = '';
                        loadDashboardData();
                    } else {
                        addLogEntry(\`Failed to collect intelligence: \${data.message}\`, 'error');
                    }
                } catch (error) {
                    console.error('Error collecting intelligence:', error);
                    addLogEntry('Error collecting intelligence', 'error');
                }
            }
            
            async function performMarketAnalysis() {
                try {
                    addLogEntry('Performing automated market analysis...', 'info');
                    
                    const response = await fetch(\`/api/commerce/intelligence/market-analysis?campaignId=\${CAMPAIGN_ID}\`);
                    const data = await response.json();
                    
                    if (data.success) {
                        addLogEntry('Market analysis completed successfully', 'success');
                        
                        // Display key insights
                        const insights = data.analysis.actionableInsights;
                        if (insights && insights.length > 0) {
                            insights.forEach(insight => {
                                addLogEntry(\`Market Insight: \${insight.recommendation}\`, 'info');
                            });
                        }
                        
                        loadDashboardData();
                    } else {
                        addLogEntry(\`Market analysis failed: \${data.message}\`, 'error');
                    }
                } catch (error) {
                    console.error('Error performing market analysis:', error);
                    addLogEntry('Error performing market analysis', 'error');
                }
            }
            
            async function createDevelopmentProject() {
                const name = document.getElementById('projectName').value;
                const type = document.getElementById('projectType').value;
                const budget = document.getElementById('projectBudget').value;
                const completion = document.getElementById('targetCompletion').value;
                
                if (!name || !type || !completion) {
                    alert('Please fill in project name, type, and target completion date');
                    return;
                }
                
                try {
                    const response = await fetch('/api/commerce/development/projects', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            campaignId: CAMPAIGN_ID,
                            projectName: name,
                            projectType: type,
                            budgetAllocated: budget ? parseFloat(budget) : 0,
                            expectedOutcomes: {
                                jobsCreated: Math.floor(Math.random() * 500) + 50,
                                economicImpact: budget ? parseFloat(budget) * 1.5 : 0,
                                timeframe: '12-18 months'
                            },
                            startDate: new Date().toISOString(),
                            targetCompletion: completion,
                            projectManager: 'Commerce Department'
                        })
                    });
                    
                    const data = await response.json();
                    
                    if (data.success) {
                        addLogEntry(\`Development project created: \${name}\`, 'success');
                        document.getElementById('projectName').value = '';
                        document.getElementById('projectBudget').value = '';
                        loadDashboardData();
                    } else {
                        addLogEntry(\`Failed to create project: \${data.message}\`, 'error');
                    }
                } catch (error) {
                    console.error('Error creating development project:', error);
                    addLogEntry('Error creating development project', 'error');
                }
            }
            
            function addLogEntry(message, type = 'info') {
                const logDiv = document.getElementById('activityLog');
                const entry = document.createElement('div');
                entry.className = \`log-entry \${type}\`;
                
                const now = new Date();
                const timestamp = now.toLocaleTimeString();
                
                entry.innerHTML = \`
                    <span class="log-timestamp">\${timestamp}</span>
                    <strong>\${message}</strong>
                \`;
                
                logDiv.insertBefore(entry, logDiv.firstChild);
                
                // Keep only the last 10 entries
                while (logDiv.children.length > 10) {
                    logDiv.removeChild(logDiv.lastChild);
                }
            }
            
            // Placeholder functions for additional features
            function loadTradePolicies() {
                addLogEntry('Loading trade policies...', 'info');
                // Implementation would show a modal or navigate to policies page
            }
            
            function loadBusinesses() {
                addLogEntry('Loading business registry...', 'info');
                // Implementation would show a modal or navigate to businesses page
            }
            
            function loadDevelopmentProjects() {
                addLogEntry('Loading development projects...', 'info');
                // Implementation would show a modal or navigate to projects page
            }
        </script>
    </body>
    </html>
  `);
});

export default router;
