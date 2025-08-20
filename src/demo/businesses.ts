/**
 * Small Business & Entrepreneurship System Demo Interface
 * Sprint 7: Interactive demonstration of business creation and market dynamics
 */

import { Request, Response, Router } from 'express';

const router = Router();

/**
 * Business System Demo Page
 */
router.get('/demo/businesses', (req: Request, res: Response) => {
  const html = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Small Business & Entrepreneurship Demo</title>
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
            max-width: 1600px;
            margin: 0 auto;
            background: rgba(255, 255, 255, 0.95);
            border-radius: 20px;
            padding: 30px;
            box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
        }

        .header {
            text-align: center;
            margin-bottom: 40px;
            padding-bottom: 20px;
            border-bottom: 3px solid #667eea;
        }

        .header h1 {
            color: #2c3e50;
            font-size: 2.5em;
            margin-bottom: 10px;
        }

        .header p {
            color: #7f8c8d;
            font-size: 1.2em;
        }

        .demo-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 30px;
            margin-bottom: 30px;
        }

        .demo-section {
            background: white;
            border-radius: 15px;
            padding: 25px;
            box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
            border-left: 5px solid #667eea;
        }

        .demo-section h2 {
            color: #2c3e50;
            margin-bottom: 20px;
            font-size: 1.5em;
            display: flex;
            align-items: center;
            gap: 10px;
        }

        .section-icon {
            font-size: 1.2em;
        }

        .controls {
            display: flex;
            flex-wrap: wrap;
            gap: 15px;
            margin-bottom: 20px;
        }

        .control-group {
            display: flex;
            flex-direction: column;
            gap: 5px;
        }

        .control-group label {
            font-weight: 600;
            color: #34495e;
            font-size: 0.9em;
        }

        select, input, button {
            padding: 10px;
            border: 2px solid #ecf0f1;
            border-radius: 8px;
            font-size: 0.9em;
            transition: all 0.3s ease;
        }

        select:focus, input:focus {
            outline: none;
            border-color: #667eea;
            box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
        }

        button {
            background: linear-gradient(135deg, #667eea, #764ba2);
            color: white;
            border: none;
            cursor: pointer;
            font-weight: 600;
            transition: all 0.3s ease;
        }

        button:hover {
            transform: translateY(-2px);
            box-shadow: 0 5px 15px rgba(102, 126, 234, 0.3);
        }

        button:disabled {
            opacity: 0.6;
            cursor: not-allowed;
            transform: none;
        }

        .results {
            background: #f8f9fa;
            border-radius: 10px;
            padding: 20px;
            margin-top: 15px;
            border-left: 4px solid #28a745;
        }

        .metric-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 15px;
            margin-bottom: 20px;
        }

        .metric-card {
            background: white;
            padding: 20px;
            border-radius: 10px;
            text-align: center;
            box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
            transition: transform 0.3s ease;
        }

        .metric-card:hover {
            transform: translateY(-3px);
        }

        .metric-value {
            font-size: 2em;
            font-weight: bold;
            color: #667eea;
            margin-bottom: 5px;
        }

        .metric-label {
            color: #7f8c8d;
            font-size: 0.9em;
            font-weight: 600;
        }

        .business-list {
            max-height: 400px;
            overflow-y: auto;
            border: 1px solid #ecf0f1;
            border-radius: 8px;
        }

        .business-item {
            padding: 15px;
            border-bottom: 1px solid #ecf0f1;
            cursor: pointer;
            transition: background-color 0.3s ease;
        }

        .business-item:hover {
            background-color: #f8f9fa;
        }

        .business-item:last-child {
            border-bottom: none;
        }

        .business-name {
            font-weight: 600;
            color: #2c3e50;
            margin-bottom: 5px;
        }

        .business-details {
            font-size: 0.9em;
            color: #7f8c8d;
            display: flex;
            justify-content: space-between;
            flex-wrap: wrap;
            gap: 10px;
        }

        .status-indicator {
            display: inline-block;
            width: 12px;
            height: 12px;
            border-radius: 50%;
            margin-right: 8px;
        }

        .status-operating { background-color: #28a745; }
        .status-growing { background-color: #17a2b8; }
        .status-startup { background-color: #ffc107; }
        .status-declining { background-color: #dc3545; }
        .status-closed { background-color: #6c757d; }

        .opportunity-card {
            background: white;
            border-radius: 10px;
            padding: 20px;
            margin-bottom: 15px;
            box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
            border-left: 4px solid #667eea;
        }

        .opportunity-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 10px;
        }

        .opportunity-title {
            font-weight: 600;
            color: #2c3e50;
            font-size: 1.1em;
        }

        .success-rate {
            background: #28a745;
            color: white;
            padding: 4px 8px;
            border-radius: 12px;
            font-size: 0.8em;
            font-weight: 600;
        }

        .opportunity-details {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
            gap: 10px;
            margin-bottom: 10px;
        }

        .detail-item {
            font-size: 0.9em;
            color: #7f8c8d;
        }

        .detail-label {
            font-weight: 600;
            color: #34495e;
        }

        .tabs {
            display: flex;
            border-bottom: 2px solid #ecf0f1;
            margin-bottom: 20px;
        }

        .tab {
            padding: 12px 24px;
            cursor: pointer;
            border: none;
            background: none;
            font-weight: 600;
            color: #7f8c8d;
            border-bottom: 3px solid transparent;
            transition: all 0.3s ease;
        }

        .tab.active {
            color: #667eea;
            border-bottom-color: #667eea;
        }

        .tab-content {
            display: none;
        }

        .tab-content.active {
            display: block;
        }

        .full-width {
            grid-column: 1 / -1;
        }

        .loading {
            display: inline-block;
            width: 20px;
            height: 20px;
            border: 3px solid #f3f3f3;
            border-top: 3px solid #667eea;
            border-radius: 50%;
            animation: spin 1s linear infinite;
        }

        @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }

        .error {
            background: #f8d7da;
            color: #721c24;
            padding: 15px;
            border-radius: 8px;
            border-left: 4px solid #dc3545;
            margin-top: 15px;
        }

        .success {
            background: #d4edda;
            color: #155724;
            padding: 15px;
            border-radius: 8px;
            border-left: 4px solid #28a745;
            margin-top: 15px;
        }

        .chart-container {
            background: white;
            border-radius: 10px;
            padding: 20px;
            margin-top: 15px;
            height: 300px;
            display: flex;
            align-items: center;
            justify-content: center;
            border: 2px dashed #ecf0f1;
        }

        .chart-placeholder {
            color: #7f8c8d;
            text-align: center;
        }

        @media (max-width: 768px) {
            .demo-grid {
                grid-template-columns: 1fr;
            }
            
            .controls {
                flex-direction: column;
            }
            
            .metric-grid {
                grid-template-columns: 1fr;
            }
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🏢 Small Business & Entrepreneurship System</h1>
            <p>Sprint 7: Comprehensive business ecosystem with financial tracking and market dynamics</p>
        </div>

        <div class="demo-grid">
            <!-- Business Overview -->
            <div class="demo-section">
                <h2><span class="section-icon">📊</span>Business Overview</h2>
                <div class="controls">
                    <button onclick="loadBusinesses()">Refresh Business Data</button>
                </div>
                <div id="businessOverview" class="results" style="display: none;">
                    <div class="metric-grid">
                        <div class="metric-card">
                            <div class="metric-value" id="totalBusinesses">-</div>
                            <div class="metric-label">Total Businesses</div>
                        </div>
                        <div class="metric-card">
                            <div class="metric-value" id="activeBusinesses">-</div>
                            <div class="metric-label">Active Businesses</div>
                        </div>
                        <div class="metric-card">
                            <div class="metric-value" id="totalEmployees">-</div>
                            <div class="metric-label">Total Employees</div>
                        </div>
                        <div class="metric-card">
                            <div class="metric-value" id="totalRevenue">-</div>
                            <div class="metric-label">Annual Revenue</div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Business Browser -->
            <div class="demo-section">
                <h2><span class="section-icon">🔍</span>Business Browser</h2>
                <div class="controls">
                    <div class="control-group">
                        <label>Industry Filter:</label>
                        <select id="industryFilter" onchange="filterBusinesses()">
                            <option value="">All Industries</option>
                            <option value="technology">Technology</option>
                            <option value="food_service">Food Service</option>
                            <option value="professional_services">Professional Services</option>
                            <option value="healthcare">Healthcare</option>
                            <option value="retail">Retail</option>
                        </select>
                    </div>
                    <button onclick="loadBusinesses()">Load Businesses</button>
                </div>
                <div id="businessList" class="business-list" style="display: none;"></div>
            </div>

            <!-- Business Opportunities -->
            <div class="demo-section">
                <h2><span class="section-icon">💡</span>Business Opportunities</h2>
                <div class="controls">
                    <div class="control-group">
                        <label>Citizen ID (optional):</label>
                        <input type="text" id="citizenIdFilter" placeholder="Enter citizen ID for personalized opportunities">
                    </div>
                    <button onclick="loadOpportunities()">Load Opportunities</button>
                </div>
                <div id="opportunitiesList" class="results" style="display: none;"></div>
            </div>

            <!-- Business Creation -->
            <div class="demo-section">
                <h2><span class="section-icon">🚀</span>Business Creation</h2>
                <div class="controls">
                    <div class="control-group">
                        <label>Owner Citizen ID:</label>
                        <input type="text" id="ownerId" placeholder="Enter citizen ID" value="citizen_001">
                    </div>
                    <div class="control-group">
                        <label>Opportunity:</label>
                        <select id="opportunitySelect">
                            <option value="software_consulting">Software Consulting</option>
                            <option value="local_coffee_shop">Local Coffee Shop</option>
                            <option value="accounting_practice">Accounting Practice</option>
                            <option value="physical_therapy_clinic">Physical Therapy Clinic</option>
                            <option value="custom_furniture">Custom Furniture</option>
                        </select>
                    </div>
                    <div class="control-group">
                        <label>Business Name:</label>
                        <input type="text" id="businessName" placeholder="Enter business name" value="My New Business">
                    </div>
                    <div class="control-group">
                        <label>Initial Capital:</label>
                        <input type="number" id="initialCapital" placeholder="Enter amount" value="50000" min="1000">
                    </div>
                    <button onclick="createBusiness()">Create Business</button>
                </div>
                <div id="creationResults" class="results" style="display: none;"></div>
            </div>
        </div>

        <!-- Advanced Analytics Section -->
        <div class="demo-section full-width">
            <h2><span class="section-icon">📈</span>Advanced Business Analytics</h2>
            
            <div class="tabs">
                <button class="tab active" onclick="switchTab('market')">Market Analysis</button>
                <button class="tab" onclick="switchTab('competition')">Competition Analysis</button>
                <button class="tab" onclick="switchTab('operations')">Business Operations</button>
                <button class="tab" onclick="switchTab('statistics')">Industry Statistics</button>
            </div>

            <!-- Market Analysis Tab -->
            <div id="marketTab" class="tab-content active">
                <div class="controls">
                    <div class="control-group">
                        <label>Industry:</label>
                        <select id="marketIndustry">
                            <option value="technology">Technology</option>
                            <option value="food_service">Food Service</option>
                            <option value="professional_services">Professional Services</option>
                            <option value="healthcare">Healthcare</option>
                            <option value="retail">Retail</option>
                        </select>
                    </div>
                    <div class="control-group">
                        <label>City:</label>
                        <select id="marketCity">
                            <option value="alpha">Alpha City</option>
                            <option value="beta">Beta City</option>
                            <option value="gamma">Gamma City</option>
                        </select>
                    </div>
                    <button onclick="analyzeMarket()">Analyze Market</button>
                </div>
                <div id="marketResults" class="results" style="display: none;"></div>
            </div>

            <!-- Competition Analysis Tab -->
            <div id="competitionTab" class="tab-content">
                <div class="controls">
                    <div class="control-group">
                        <label>Business ID:</label>
                        <input type="text" id="competitionBusinessId" placeholder="Enter business ID">
                    </div>
                    <button onclick="analyzeCompetition()">Analyze Competition</button>
                </div>
                <div id="competitionResults" class="results" style="display: none;"></div>
            </div>

            <!-- Business Operations Tab -->
            <div id="operationsTab" class="tab-content">
                <div class="controls">
                    <button onclick="processMonthlyOperations()">Process Monthly Operations</button>
                </div>
                <div id="operationsResults" class="results" style="display: none;"></div>
            </div>

            <!-- Industry Statistics Tab -->
            <div id="statisticsTab" class="tab-content">
                <div class="controls">
                    <button onclick="loadStatistics()">Load Industry Statistics</button>
                </div>
                <div id="statisticsResults" class="results" style="display: none;"></div>
            </div>
        </div>
    </div>

    <script>
        let businessesData = [];
        let opportunitiesData = [];

        // Tab switching
        function switchTab(tabName) {
            // Hide all tab contents
            document.querySelectorAll('.tab-content').forEach(tab => {
                tab.classList.remove('active');
            });
            
            // Remove active class from all tabs
            document.querySelectorAll('.tab').forEach(tab => {
                tab.classList.remove('active');
            });
            
            // Show selected tab content
            document.getElementById(tabName + 'Tab').classList.add('active');
            
            // Add active class to clicked tab
            event.target.classList.add('active');
        }

        // Load businesses data
        async function loadBusinesses() {
            try {
                const response = await fetch('/api/businesses/businesses');
                const result = await response.json();
                
                if (result.success) {
                    businessesData = result.data.businesses;
                    displayBusinessOverview(result.data);
                    displayBusinesses(businessesData);
                } else {
                    showError('businessOverview', result.error);
                }
            } catch (error) {
                showError('businessOverview', 'Failed to load businesses: ' + error.message);
            }
        }

        function displayBusinessOverview(data) {
            document.getElementById('totalBusinesses').textContent = data.totalCount.toLocaleString();
            document.getElementById('activeBusinesses').textContent = data.summary.activeBusinesses.toLocaleString();
            document.getElementById('totalEmployees').textContent = data.summary.totalEmployees.toLocaleString();
            document.getElementById('totalRevenue').textContent = '$' + data.summary.totalRevenue.toLocaleString();
            
            document.getElementById('businessOverview').style.display = 'block';
        }

        function displayBusinesses(businesses) {
            const listElement = document.getElementById('businessList');
            
            listElement.innerHTML = businesses.map(business => \`
                <div class="business-item" onclick="showBusinessDetails('\${business.id}')">
                    <div class="business-name">\${business.name}</div>
                    <div class="business-details">
                        <span>Industry: \${business.industry}</span>
                        <span>Status: <span class="status-indicator status-\${business.status}"></span>\${business.status}</span>
                        <span>Revenue: $\${business.monthlyRevenue.toLocaleString()}/mo</span>
                        <span>Employees: \${business.employeeCount}</span>
                    </div>
                </div>
            \`).join('');
            
            listElement.style.display = 'block';
        }

        function filterBusinesses() {
            const industry = document.getElementById('industryFilter').value;
            const filtered = industry ? 
                businessesData.filter(b => b.industry === industry) : 
                businessesData;
            displayBusinesses(filtered);
        }

        // Load business opportunities
        async function loadOpportunities() {
            try {
                const citizenId = document.getElementById('citizenIdFilter').value;
                const url = citizenId ? 
                    \`/api/businesses/opportunities?citizenId=\${citizenId}\` : 
                    '/api/businesses/opportunities';
                
                const response = await fetch(url);
                const result = await response.json();
                
                if (result.success) {
                    opportunitiesData = result.data.opportunities;
                    displayOpportunities(result.data);
                } else {
                    showError('opportunitiesList', result.error);
                }
            } catch (error) {
                showError('opportunitiesList', 'Failed to load opportunities: ' + error.message);
            }
        }

        function displayOpportunities(data) {
            const html = \`
                <h3>Available Business Opportunities</h3>
                <div class="metric-grid">
                    <div class="metric-card">
                        <div class="metric-value">\${data.totalCount}</div>
                        <div class="metric-label">Total Opportunities</div>
                    </div>
                    <div class="metric-card">
                        <div class="metric-value">$\${Math.round(data.averageCapital).toLocaleString()}</div>
                        <div class="metric-label">Avg. Capital Required</div>
                    </div>
                    <div class="metric-card">
                        <div class="metric-value">\${Math.round(data.averageSuccessRate * 100)}%</div>
                        <div class="metric-label">Avg. Success Rate</div>
                    </div>
                </div>
                \${data.opportunities.map(opp => \`
                    <div class="opportunity-card">
                        <div class="opportunity-header">
                            <div class="opportunity-title">\${opp.id.replace(/_/g, ' ').replace(/\\b\\w/g, l => l.toUpperCase())}</div>
                            <div class="success-rate">\${Math.round(opp.successProbability * 100)}% Success</div>
                        </div>
                        <div class="opportunity-details">
                            <div class="detail-item">
                                <span class="detail-label">Industry:</span> \${opp.industry}
                            </div>
                            <div class="detail-item">
                                <span class="detail-label">Capital:</span> $\${opp.minimumCapital.toLocaleString()}
                            </div>
                            <div class="detail-item">
                                <span class="detail-label">Breakeven:</span> \${opp.timeToBreakeven} months
                            </div>
                            <div class="detail-item">
                                <span class="detail-label">Competition:</span> \${opp.competition}
                            </div>
                        </div>
                        <div class="detail-item">
                            <span class="detail-label">Required Skills:</span> \${opp.requiredSkills.join(', ')}
                        </div>
                    </div>
                \`).join('')}
            \`;
            
            document.getElementById('opportunitiesList').innerHTML = html;
            document.getElementById('opportunitiesList').style.display = 'block';
        }

        // Create new business
        async function createBusiness() {
            const ownerId = document.getElementById('ownerId').value;
            const opportunityId = document.getElementById('opportunitySelect').value;
            const businessName = document.getElementById('businessName').value;
            const initialCapital = parseInt(document.getElementById('initialCapital').value);

            if (!ownerId || !businessName || !initialCapital) {
                showError('creationResults', 'Please fill in all required fields');
                return;
            }

            try {
                const response = await fetch('/api/businesses/businesses', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        ownerId,
                        opportunityId,
                        businessName,
                        initialCapital
                    })
                });
                const result = await response.json();
                
                if (result.success) {
                    displayCreationResults(result.data);
                } else {
                    showError('creationResults', result.error);
                }
            } catch (error) {
                showError('creationResults', 'Failed to create business: ' + error.message);
            }
        }

        function displayCreationResults(data) {
            const html = \`
                <div class="success">
                    <h3>Business Created Successfully!</h3>
                    <p><strong>Business:</strong> \${data.business.name}</p>
                    <p><strong>Industry:</strong> \${data.business.industry}</p>
                    <p><strong>Initial Capital:</strong> $\${data.business.initialCapital.toLocaleString()}</p>
                    <p><strong>Status:</strong> \${data.business.status}</p>
                    <p><strong>Risk Level:</strong> \${data.business.riskLevel}</p>
                </div>
            \`;
            
            document.getElementById('creationResults').innerHTML = html;
            document.getElementById('creationResults').style.display = 'block';
        }

        // Advanced analytics functions
        async function analyzeMarket() {
            const industry = document.getElementById('marketIndustry').value;
            const city = document.getElementById('marketCity').value;
            
            try {
                const response = await fetch(\`/api/businesses/market-analysis/\${industry}/\${city}\`);
                const result = await response.json();
                
                if (result.success) {
                    displayMarketResults(result.data);
                } else {
                    showError('marketResults', result.error);
                }
            } catch (error) {
                showError('marketResults', 'Failed to analyze market: ' + error.message);
            }
        }

        function displayMarketResults(data) {
            const html = \`
                <h3>Market Analysis - \${data.marketAnalysis.industry} in \${data.marketAnalysis.cityId}</h3>
                <div class="metric-grid">
                    <div class="metric-card">
                        <div class="metric-value">$\${Math.round(data.marketAnalysis.totalMarketSize).toLocaleString()}</div>
                        <div class="metric-label">Market Size</div>
                    </div>
                    <div class="metric-card">
                        <div class="metric-value">\${data.marketAnalysis.numberOfCompetitors}</div>
                        <div class="metric-label">Competitors</div>
                    </div>
                    <div class="metric-card">
                        <div class="metric-value">\${(data.marketAnalysis.marketGrowthRate * 100).toFixed(1)}%</div>
                        <div class="metric-label">Growth Rate</div>
                    </div>
                    <div class="metric-card">
                        <div class="metric-value">\${(data.marketAnalysis.customerLoyalty * 100).toFixed(0)}%</div>
                        <div class="metric-label">Customer Loyalty</div>
                    </div>
                </div>
                <h4>Industry Trends</h4>
                \${data.trends.map(trend => \`
                    <p><strong>\${trend.name}:</strong> \${trend.description} (Impact: \${trend.impact})</p>
                \`).join('')}
                <h4>Barriers to Entry</h4>
                <p>\${data.marketAnalysis.barrierToEntry.join(', ')}</p>
            \`;
            
            document.getElementById('marketResults').innerHTML = html;
            document.getElementById('marketResults').style.display = 'block';
        }

        async function analyzeCompetition() {
            const businessId = document.getElementById('competitionBusinessId').value;
            
            if (!businessId) {
                showError('competitionResults', 'Please enter a business ID');
                return;
            }

            try {
                const response = await fetch(\`/api/businesses/businesses/\${businessId}/competitors\`);
                const result = await response.json();
                
                if (result.success) {
                    displayCompetitionResults(result.data);
                } else {
                    showError('competitionResults', result.error);
                }
            } catch (error) {
                showError('competitionResults', 'Failed to analyze competition: ' + error.message);
            }
        }

        function displayCompetitionResults(data) {
            const html = \`
                <h3>Competition Analysis - \${data.business.name}</h3>
                <div class="metric-grid">
                    <div class="metric-card">
                        <div class="metric-value">\${data.marketSummary.totalCompetitors}</div>
                        <div class="metric-label">Total Competitors</div>
                    </div>
                    <div class="metric-card">
                        <div class="metric-value">\${(data.business.marketShare * 100).toFixed(1)}%</div>
                        <div class="metric-label">Market Share</div>
                    </div>
                    <div class="metric-card">
                        <div class="metric-value">\${(data.business.reputation * 100).toFixed(0)}%</div>
                        <div class="metric-label">Reputation</div>
                    </div>
                    <div class="metric-card">
                        <div class="metric-value">\${data.marketSummary.marketLeader.name}</div>
                        <div class="metric-label">Market Leader</div>
                    </div>
                </div>
                <h4>Competitor Analysis</h4>
                \${data.competitors.map(comp => \`
                    <div class="opportunity-card">
                        <div class="opportunity-header">
                            <div class="opportunity-title">Competitor Analysis</div>
                            <div class="success-rate">\${comp.threatLevel}</div>
                        </div>
                        <p><strong>Competition Intensity:</strong> \${(comp.competitionIntensity * 100).toFixed(0)}%</p>
                        <p><strong>Market Overlap:</strong> \${(comp.marketOverlap * 100).toFixed(0)}%</p>
                        <p><strong>Advantages:</strong> \${comp.competitiveAdvantages.join(', ') || 'None identified'}</p>
                        <p><strong>Disadvantages:</strong> \${comp.competitiveDisadvantages.join(', ') || 'None identified'}</p>
                    </div>
                \`).join('')}
            \`;
            
            document.getElementById('competitionResults').innerHTML = html;
            document.getElementById('competitionResults').style.display = 'block';
        }

        async function processMonthlyOperations() {
            try {
                const response = await fetch('/api/businesses/operations/monthly', {
                    method: 'POST'
                });
                const result = await response.json();
                
                if (result.success) {
                    displayOperationsResults(result.data);
                } else {
                    showError('operationsResults', result.error);
                }
            } catch (error) {
                showError('operationsResults', 'Failed to process operations: ' + error.message);
            }
        }

        function displayOperationsResults(data) {
            const html = \`
                <h3>Monthly Operations Results</h3>
                <div class="metric-grid">
                    <div class="metric-card">
                        <div class="metric-value">\${data.summary.businessesProcessed}</div>
                        <div class="metric-label">Businesses Processed</div>
                    </div>
                    <div class="metric-card">
                        <div class="metric-value">\${data.summary.eventsGenerated}</div>
                        <div class="metric-label">Business Events</div>
                    </div>
                    <div class="metric-card">
                        <div class="metric-value">\${data.summary.marketEventsGenerated}</div>
                        <div class="metric-label">Market Events</div>
                    </div>
                    <div class="metric-card">
                        <div class="metric-value">\${data.totalEvents}</div>
                        <div class="metric-label">Total Events</div>
                    </div>
                </div>
                <h4>Recent Business Events</h4>
                \${data.businessEvents.slice(0, 5).map(event => \`
                    <p><strong>\${event.eventType}:</strong> \${event.description}</p>
                \`).join('')}
                <h4>Recent Market Events</h4>
                \${data.marketEvents.slice(0, 5).map(event => \`
                    <p><strong>\${event.eventType}:</strong> \${event.description}</p>
                \`).join('')}
            \`;
            
            document.getElementById('operationsResults').innerHTML = html;
            document.getElementById('operationsResults').style.display = 'block';
        }

        async function loadStatistics() {
            try {
                const response = await fetch('/api/businesses/statistics');
                const result = await response.json();
                
                if (result.success) {
                    displayStatisticsResults(result.data);
                } else {
                    showError('statisticsResults', result.error);
                }
            } catch (error) {
                showError('statisticsResults', 'Failed to load statistics: ' + error.message);
            }
        }

        function displayStatisticsResults(data) {
            const html = \`
                <h3>Industry Statistics</h3>
                <div class="metric-grid">
                    <div class="metric-card">
                        <div class="metric-value">\${data.totalBusinesses}</div>
                        <div class="metric-label">Total Businesses</div>
                    </div>
                    <div class="metric-card">
                        <div class="metric-value">\${data.totalEmployees}</div>
                        <div class="metric-label">Total Employees</div>
                    </div>
                    <div class="metric-card">
                        <div class="metric-value">$\${Math.round(data.totalRevenue).toLocaleString()}</div>
                        <div class="metric-label">Total Revenue</div>
                    </div>
                    <div class="metric-card">
                        <div class="metric-value">\${data.averageEmployeesPerBusiness.toFixed(1)}</div>
                        <div class="metric-label">Avg. Employees/Business</div>
                    </div>
                </div>
                <h4>Industry Breakdown</h4>
                \${Object.entries(data.industryStatistics).map(([industry, stats]) => \`
                    <div class="opportunity-card">
                        <div class="opportunity-header">
                            <div class="opportunity-title">\${industry.replace(/_/g, ' ').replace(/\\b\\w/g, l => l.toUpperCase())}</div>
                            <div class="success-rate">\${stats.count} businesses</div>
                        </div>
                        <div class="opportunity-details">
                            <div class="detail-item">
                                <span class="detail-label">Total Revenue:</span> $\${Math.round(stats.totalRevenue).toLocaleString()}
                            </div>
                            <div class="detail-item">
                                <span class="detail-label">Total Employees:</span> \${stats.totalEmployees}
                            </div>
                            <div class="detail-item">
                                <span class="detail-label">Avg. Revenue:</span> $\${Math.round(stats.averageRevenue).toLocaleString()}
                            </div>
                            <div class="detail-item">
                                <span class="detail-label">Avg. Market Share:</span> \${(stats.averageMarketShare * 100).toFixed(1)}%
                            </div>
                        </div>
                    </div>
                \`).join('')}
                <h4>Top Performing Businesses</h4>
                \${data.topBusinesses.slice(0, 5).map(business => \`
                    <p><strong>\${business.name}</strong> (\${business.industry}) - $\${business.monthlyRevenue.toLocaleString()}/mo, \${business.employeeCount} employees</p>
                \`).join('')}
            \`;
            
            document.getElementById('statisticsResults').innerHTML = html;
            document.getElementById('statisticsResults').style.display = 'block';
        }

        // Utility functions
        function showError(elementId, message) {
            const element = document.getElementById(elementId);
            element.innerHTML = \`<div class="error">Error: \${message}</div>\`;
            element.style.display = 'block';
        }

        function showBusinessDetails(businessId) {
            // This would show detailed business information in a modal or expanded view
            alert(\`Showing details for business: \${businessId}\`);
        }

        // Initialize demo
        document.addEventListener('DOMContentLoaded', function() {
            loadBusinesses();
            loadOpportunities();
        });
    </script>
</body>
</html>
  `;

  res.send(html);
});

export default router;
