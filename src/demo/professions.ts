/**
 * Profession & Industry System Demo Interface
 * Sprint 6: Interactive demonstration of profession modeling and labor market dynamics
 */

import { Request, Response, Router } from 'express';

const router = Router();

/**
 * Profession System Demo Page
 */
router.get('/demo/professions', (req: Request, res: Response) => {
  const html = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Profession & Industry System Demo</title>
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

        .profession-list {
            max-height: 300px;
            overflow-y: auto;
            border: 1px solid #ecf0f1;
            border-radius: 8px;
        }

        .profession-item {
            padding: 15px;
            border-bottom: 1px solid #ecf0f1;
            cursor: pointer;
            transition: background-color 0.3s ease;
        }

        .profession-item:hover {
            background-color: #f8f9fa;
        }

        .profession-item:last-child {
            border-bottom: none;
        }

        .profession-name {
            font-weight: 600;
            color: #2c3e50;
            margin-bottom: 5px;
        }

        .profession-details {
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

        .status-high { background-color: #28a745; }
        .status-moderate { background-color: #ffc107; }
        .status-low { background-color: #dc3545; }

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

        .full-width {
            grid-column: 1 / -1;
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
            <h1>🏢 Profession & Industry System</h1>
            <p>Sprint 6: Comprehensive profession modeling with labor market dynamics</p>
        </div>

        <div class="demo-grid">
            <!-- Labor Market Overview -->
            <div class="demo-section">
                <h2><span class="section-icon">📊</span>Labor Market Overview</h2>
                <div class="controls">
                    <button onclick="loadLaborMarket()">Refresh Market Data</button>
                </div>
                <div id="laborMarketResults" class="results" style="display: none;">
                    <div class="metric-grid">
                        <div class="metric-card">
                            <div class="metric-value" id="totalEmployed">-</div>
                            <div class="metric-label">Total Employed</div>
                        </div>
                        <div class="metric-card">
                            <div class="metric-value" id="openPositions">-</div>
                            <div class="metric-label">Open Positions</div>
                        </div>
                        <div class="metric-card">
                            <div class="metric-value" id="avgTimeToFill">-</div>
                            <div class="metric-label">Avg. Time to Fill (days)</div>
                        </div>
                        <div class="metric-card">
                            <div class="metric-value" id="marketHealth">-</div>
                            <div class="metric-label">Market Health</div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Profession Browser -->
            <div class="demo-section">
                <h2><span class="section-icon">🔍</span>Profession Browser</h2>
                <div class="controls">
                    <div class="control-group">
                        <label>Category Filter:</label>
                        <select id="categoryFilter" onchange="filterProfessions()">
                            <option value="">All Categories</option>
                            <option value="technology">Technology</option>
                            <option value="healthcare">Healthcare</option>
                            <option value="education">Education</option>
                            <option value="finance">Finance</option>
                            <option value="retail">Retail</option>
                        </select>
                    </div>
                    <button onclick="loadProfessions()">Load Professions</button>
                </div>
                <div id="professionList" class="profession-list" style="display: none;"></div>
            </div>

            <!-- Unemployment Analytics -->
            <div class="demo-section">
                <h2><span class="section-icon">📉</span>Unemployment Analytics</h2>
                <div class="controls">
                    <button onclick="loadUnemploymentStats()">Analyze Unemployment</button>
                </div>
                <div id="unemploymentResults" class="results" style="display: none;">
                    <div class="metric-grid">
                        <div class="metric-card">
                            <div class="metric-value" id="unemploymentRate">-</div>
                            <div class="metric-label">Unemployment Rate</div>
                        </div>
                        <div class="metric-card">
                            <div class="metric-value" id="avgDuration">-</div>
                            <div class="metric-label">Avg. Duration (days)</div>
                        </div>
                        <div class="metric-card">
                            <div class="metric-value" id="activelySearching">-</div>
                            <div class="metric-label">Actively Searching</div>
                        </div>
                        <div class="metric-card">
                            <div class="metric-value" id="receivingBenefits">-</div>
                            <div class="metric-label">Receiving Benefits</div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Career Simulation -->
            <div class="demo-section">
                <h2><span class="section-icon">🚀</span>Career Simulation</h2>
                <div class="controls">
                    <div class="control-group">
                        <label>Citizen ID:</label>
                        <input type="text" id="citizenId" placeholder="Enter citizen ID" value="citizen_001">
                    </div>
                    <button onclick="assignProfession()">Assign Profession</button>
                    <button onclick="advanceCareers()">Process Career Advancement</button>
                </div>
                <div id="careerResults" class="results" style="display: none;"></div>
            </div>
        </div>

        <!-- Advanced Analytics Section -->
        <div class="demo-section full-width">
            <h2><span class="section-icon">📈</span>Advanced Analytics</h2>
            
            <div class="tabs">
                <button class="tab active" onclick="switchTab('forecast')">Market Forecast</button>
                <button class="tab" onclick="switchTab('skills')">Skills Gap Analysis</button>
                <button class="tab" onclick="switchTab('wages')">Wage Analysis</button>
                <button class="tab" onclick="switchTab('mobility')">Career Mobility</button>
            </div>

            <!-- Market Forecast Tab -->
            <div id="forecastTab" class="tab-content active">
                <div class="controls">
                    <div class="control-group">
                        <label>Profession:</label>
                        <select id="forecastProfession">
                            <option value="software_engineer">Software Engineer</option>
                            <option value="registered_nurse">Registered Nurse</option>
                            <option value="teacher">Teacher</option>
                            <option value="retail_associate">Retail Associate</option>
                        </select>
                    </div>
                    <div class="control-group">
                        <label>Timeframe:</label>
                        <select id="forecastTimeframe">
                            <option value="quarterly">Quarterly</option>
                            <option value="annual">Annual</option>
                            <option value="five_year">Five Year</option>
                        </select>
                    </div>
                    <button onclick="generateForecast()">Generate Forecast</button>
                </div>
                <div id="forecastResults" class="results" style="display: none;"></div>
            </div>

            <!-- Skills Gap Tab -->
            <div id="skillsTab" class="tab-content">
                <div class="controls">
                    <div class="control-group">
                        <label>Profession:</label>
                        <select id="skillsProfession">
                            <option value="software_engineer">Software Engineer</option>
                            <option value="registered_nurse">Registered Nurse</option>
                            <option value="teacher">Teacher</option>
                            <option value="retail_associate">Retail Associate</option>
                        </select>
                    </div>
                    <button onclick="analyzeSkillsGap()">Analyze Skills Gap</button>
                </div>
                <div id="skillsResults" class="results" style="display: none;"></div>
            </div>

            <!-- Wage Analysis Tab -->
            <div id="wagesTab" class="tab-content">
                <div class="controls">
                    <div class="control-group">
                        <label>Profession:</label>
                        <select id="wagesProfession">
                            <option value="software_engineer">Software Engineer</option>
                            <option value="registered_nurse">Registered Nurse</option>
                            <option value="teacher">Teacher</option>
                            <option value="retail_associate">Retail Associate</option>
                        </select>
                    </div>
                    <button onclick="analyzeWages()">Analyze Wages</button>
                </div>
                <div id="wagesResults" class="results" style="display: none;"></div>
            </div>

            <!-- Career Mobility Tab -->
            <div id="mobilityTab" class="tab-content">
                <div class="controls">
                    <div class="control-group">
                        <label>From Profession:</label>
                        <select id="fromProfession">
                            <option value="software_engineer">Software Engineer</option>
                            <option value="registered_nurse">Registered Nurse</option>
                            <option value="teacher">Teacher</option>
                            <option value="retail_associate">Retail Associate</option>
                        </select>
                    </div>
                    <div class="control-group">
                        <label>To Profession:</label>
                        <select id="toProfession">
                            <option value="software_engineer">Software Engineer</option>
                            <option value="registered_nurse">Registered Nurse</option>
                            <option value="teacher">Teacher</option>
                            <option value="retail_associate">Retail Associate</option>
                        </select>
                    </div>
                    <button onclick="analyzeMobility()">Analyze Mobility</button>
                </div>
                <div id="mobilityResults" class="results" style="display: none;"></div>
            </div>
        </div>
    </div>

    <script>
        let professionsData = [];
        let laborMarketData = [];

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

        // Load labor market data
        async function loadLaborMarket() {
            try {
                const response = await fetch('/api/professions/labor-market');
                const result = await response.json();
                
                if (result.success) {
                    laborMarketData = result.data.markets;
                    displayLaborMarketResults(result.data);
                } else {
                    showError('laborMarketResults', result.error);
                }
            } catch (error) {
                showError('laborMarketResults', 'Failed to load labor market data: ' + error.message);
            }
        }

        function displayLaborMarketResults(data) {
            document.getElementById('totalEmployed').textContent = data.summary.totalEmployed.toLocaleString();
            document.getElementById('openPositions').textContent = data.summary.totalOpenPositions.toLocaleString();
            document.getElementById('avgTimeToFill').textContent = data.summary.averageTimeToFill;
            document.getElementById('marketHealth').textContent = data.summary.marketHealth.toUpperCase();
            
            document.getElementById('laborMarketResults').style.display = 'block';
        }

        // Load professions
        async function loadProfessions() {
            try {
                const response = await fetch('/api/professions/professions');
                const result = await response.json();
                
                if (result.success) {
                    professionsData = result.data.professions;
                    displayProfessions(professionsData);
                } else {
                    showError('professionList', result.error);
                }
            } catch (error) {
                showError('professionList', 'Failed to load professions: ' + error.message);
            }
        }

        function displayProfessions(professions) {
            const listElement = document.getElementById('professionList');
            
            listElement.innerHTML = professions.map(profession => \`
                <div class="profession-item" onclick="showProfessionDetails('\${profession.id}')">
                    <div class="profession-name">\${profession.name}</div>
                    <div class="profession-details">
                        <span>Category: \${profession.category}</span>
                        <span>Demand: <span class="status-indicator status-\${getDemandClass(profession.demandLevel)}"></span>\${profession.demandLevel}</span>
                        <span>Salary: $\${profession.baseSalary.median.toLocaleString()}</span>
                    </div>
                </div>
            \`).join('');
            
            listElement.style.display = 'block';
        }

        function getDemandClass(demandLevel) {
            switch (demandLevel) {
                case 'very_high':
                case 'high': return 'high';
                case 'moderate': return 'moderate';
                default: return 'low';
            }
        }

        function filterProfessions() {
            const category = document.getElementById('categoryFilter').value;
            const filtered = category ? 
                professionsData.filter(p => p.category === category) : 
                professionsData;
            displayProfessions(filtered);
        }

        // Load unemployment statistics
        async function loadUnemploymentStats() {
            try {
                const response = await fetch('/api/professions/unemployment');
                const result = await response.json();
                
                if (result.success) {
                    displayUnemploymentResults(result.data);
                } else {
                    showError('unemploymentResults', result.error);
                }
            } catch (error) {
                showError('unemploymentResults', 'Failed to load unemployment data: ' + error.message);
            }
        }

        function displayUnemploymentResults(data) {
            document.getElementById('unemploymentRate').textContent = 
                (data.unemploymentRate * 100).toFixed(1) + '%';
            document.getElementById('avgDuration').textContent = 
                Math.round(data.averageDuration);
            document.getElementById('activelySearching').textContent = 
                data.activelySearching.toLocaleString();
            document.getElementById('receivingBenefits').textContent = 
                data.receivingBenefits.toLocaleString();
            
            document.getElementById('unemploymentResults').style.display = 'block';
        }

        // Career simulation functions
        async function assignProfession() {
            const citizenId = document.getElementById('citizenId').value;
            if (!citizenId) {
                showError('careerResults', 'Please enter a citizen ID');
                return;
            }

            try {
                const response = await fetch('/api/professions/assign', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ citizenId })
                });
                const result = await response.json();
                
                if (result.success) {
                    displayCareerResults(result.data);
                } else {
                    showError('careerResults', result.error);
                }
            } catch (error) {
                showError('careerResults', 'Failed to assign profession: ' + error.message);
            }
        }

        async function advanceCareers() {
            try {
                const response = await fetch('/api/professions/advance-careers', {
                    method: 'POST'
                });
                const result = await response.json();
                
                if (result.success) {
                    displayAdvancementResults(result.data);
                } else {
                    showError('careerResults', result.error);
                }
            } catch (error) {
                showError('careerResults', 'Failed to advance careers: ' + error.message);
            }
        }

        function displayCareerResults(data) {
            const html = \`
                <h3>Career Assignment Result</h3>
                <p><strong>Status:</strong> \${data.status}</p>
                \${data.employment ? \`
                    <p><strong>Profession:</strong> \${data.profession?.name}</p>
                    <p><strong>Title:</strong> \${data.employment.title}</p>
                    <p><strong>Salary:</strong> $\${data.employment.salary.toLocaleString()}</p>
                    <p><strong>Performance:</strong> \${(data.employment.performanceRating * 100).toFixed(1)}%</p>
                \` : \`
                    <p>\${data.message}</p>
                \`}
            \`;
            
            document.getElementById('careerResults').innerHTML = html;
            document.getElementById('careerResults').style.display = 'block';
        }

        function displayAdvancementResults(data) {
            const html = \`
                <h3>Career Advancement Results</h3>
                <p><strong>Transitions Processed:</strong> \${data.transitionsProcessed}</p>
                <p><strong>Promotions:</strong> \${data.summary.promotions}</p>
                <p><strong>Career Changes:</strong> \${data.summary.careerChanges}</p>
                <p><strong>Average Salary Increase:</strong> \${data.summary.averageSalaryIncrease.toFixed(1)}%</p>
            \`;
            
            document.getElementById('careerResults').innerHTML = html;
            document.getElementById('careerResults').style.display = 'block';
        }

        // Advanced analytics functions
        async function generateForecast() {
            const professionId = document.getElementById('forecastProfession').value;
            const timeframe = document.getElementById('forecastTimeframe').value;
            
            try {
                const response = await fetch(\`/api/professions/forecast/\${professionId}?timeframe=\${timeframe}\`);
                const result = await response.json();
                
                if (result.success) {
                    displayForecastResults(result.data);
                } else {
                    showError('forecastResults', result.error);
                }
            } catch (error) {
                showError('forecastResults', 'Failed to generate forecast: ' + error.message);
            }
        }

        function displayForecastResults(data) {
            const html = \`
                <h3>Market Forecast - \${data.timeframe}</h3>
                <div class="metric-grid">
                    <div class="metric-card">
                        <div class="metric-value">\${data.projectedDemand}</div>
                        <div class="metric-label">Projected Demand</div>
                    </div>
                    <div class="metric-card">
                        <div class="metric-value">\${data.newPositionsExpected}</div>
                        <div class="metric-label">New Positions</div>
                    </div>
                    <div class="metric-card">
                        <div class="metric-value">\${data.supplyDemandRatio.toFixed(2)}</div>
                        <div class="metric-label">Supply/Demand Ratio</div>
                    </div>
                    <div class="metric-card">
                        <div class="metric-value">\${data.competitionForecast}</div>
                        <div class="metric-label">Competition Level</div>
                    </div>
                </div>
                <p><strong>Automation Risk:</strong> \${(data.automationThreat * 100).toFixed(1)}%</p>
                <p><strong>Economic Sensitivity:</strong> \${(data.economicSensitivity * 100).toFixed(1)}%</p>
            \`;
            
            document.getElementById('forecastResults').innerHTML = html;
            document.getElementById('forecastResults').style.display = 'block';
        }

        async function analyzeSkillsGap() {
            const professionId = document.getElementById('skillsProfession').value;
            
            try {
                const response = await fetch(\`/api/professions/skills-gap/\${professionId}\`);
                const result = await response.json();
                
                if (result.success) {
                    displaySkillsResults(result.data);
                } else {
                    showError('skillsResults', result.error);
                }
            } catch (error) {
                showError('skillsResults', 'Failed to analyze skills gap: ' + error.message);
            }
        }

        function displaySkillsResults(data) {
            const html = \`
                <h3>Skills Gap Analysis</h3>
                <div class="metric-grid">
                    <div class="metric-card">
                        <div class="metric-value">\${data.summary.totalGaps}</div>
                        <div class="metric-label">Total Gaps</div>
                    </div>
                    <div class="metric-card">
                        <div class="metric-value">\${data.summary.criticalGaps}</div>
                        <div class="metric-label">Critical Gaps</div>
                    </div>
                    <div class="metric-card">
                        <div class="metric-value">$\${data.summary.totalTrainingCost.toLocaleString()}</div>
                        <div class="metric-label">Training Cost</div>
                    </div>
                    <div class="metric-card">
                        <div class="metric-value">\${data.summary.averageTrainingTime.toFixed(1)}</div>
                        <div class="metric-label">Avg. Training (months)</div>
                    </div>
                </div>
                \${data.skillsGaps.length > 0 ? \`
                    <h4>Identified Gaps:</h4>
                    \${data.skillsGaps.map(gap => \`
                        <p><strong>\${gap.skillName}:</strong> Gap of \${gap.gapSize.toFixed(1)} points, affecting \${gap.affectedPositions} positions</p>
                    \`).join('')}
                \` : '<p>No significant skills gaps identified.</p>'}
            \`;
            
            document.getElementById('skillsResults').innerHTML = html;
            document.getElementById('skillsResults').style.display = 'block';
        }

        async function analyzeWages() {
            const professionId = document.getElementById('wagesProfession').value;
            
            try {
                const response = await fetch(\`/api/professions/wages/\${professionId}\`);
                const result = await response.json();
                
                if (result.success) {
                    displayWagesResults(result.data);
                } else {
                    showError('wagesResults', result.error);
                }
            } catch (error) {
                showError('wagesResults', 'Failed to analyze wages: ' + error.message);
            }
        }

        function displayWagesResults(data) {
            const html = \`
                <h3>Wage Analysis</h3>
                <div class="metric-grid">
                    <div class="metric-card">
                        <div class="metric-value">$\${data.currentMedian.toLocaleString()}</div>
                        <div class="metric-label">Current Median</div>
                    </div>
                    <div class="metric-card">
                        <div class="metric-value">\${(data.oneYearGrowth * 100).toFixed(1)}%</div>
                        <div class="metric-label">1-Year Growth</div>
                    </div>
                    <div class="metric-card">
                        <div class="metric-value">\${(data.projectedGrowth * 100).toFixed(1)}%</div>
                        <div class="metric-label">Projected Growth</div>
                    </div>
                    <div class="metric-card">
                        <div class="metric-value">\${(data.skillPremium * 100).toFixed(1)}%</div>
                        <div class="metric-label">Skill Premium</div>
                    </div>
                </div>
                <p><strong>Salary Range:</strong> $\${data.currentRange.min.toLocaleString()} - $\${data.currentRange.max.toLocaleString()}</p>
                <p><strong>Demand Pressure:</strong> \${(data.demandPressure * 100).toFixed(1)}%</p>
                <p><strong>Supply Constraints:</strong> \${(data.supplyConstraints * 100).toFixed(1)}%</p>
            \`;
            
            document.getElementById('wagesResults').innerHTML = html;
            document.getElementById('wagesResults').style.display = 'block';
        }

        async function analyzeMobility() {
            const fromProfession = document.getElementById('fromProfession').value;
            const toProfession = document.getElementById('toProfession').value;
            
            try {
                const response = await fetch(\`/api/professions/mobility/\${fromProfession}/\${toProfession}\`);
                const result = await response.json();
                
                if (result.success) {
                    displayMobilityResults(result.data);
                } else {
                    showError('mobilityResults', result.error);
                }
            } catch (error) {
                showError('mobilityResults', 'Failed to analyze mobility: ' + error.message);
            }
        }

        function displayMobilityResults(data) {
            const html = \`
                <h3>Career Mobility Analysis</h3>
                <div class="metric-grid">
                    <div class="metric-card">
                        <div class="metric-value">\${(data.transitionRate * 100).toFixed(2)}%</div>
                        <div class="metric-label">Transition Rate</div>
                    </div>
                    <div class="metric-card">
                        <div class="metric-value">\${(data.successRate * 100).toFixed(1)}%</div>
                        <div class="metric-label">Success Rate</div>
                    </div>
                    <div class="metric-card">
                        <div class="metric-value">\${data.averageTimeToTransition}</div>
                        <div class="metric-label">Avg. Time (months)</div>
                    </div>
                    <div class="metric-card">
                        <div class="metric-value">\${data.averageSalaryChange.toFixed(1)}%</div>
                        <div class="metric-label">Salary Change</div>
                    </div>
                </div>
                <p><strong>Retraining Required:</strong> \${data.retrainingRequired ? 'Yes' : 'No'}</p>
                <p><strong>Experience Transferability:</strong> \${(data.experienceTransferability * 100).toFixed(1)}%</p>
                <p><strong>Career Advancement Impact:</strong> \${(data.careerAdvancementImpact * 100).toFixed(1)}%</p>
            \`;
            
            document.getElementById('mobilityResults').innerHTML = html;
            document.getElementById('mobilityResults').style.display = 'block';
        }

        // Utility functions
        function showError(elementId, message) {
            const element = document.getElementById(elementId);
            element.innerHTML = \`<div class="error">Error: \${message}</div>\`;
            element.style.display = 'block';
        }

        function showProfessionDetails(professionId) {
            // This would show detailed profession information in a modal or expanded view
            alert(\`Showing details for profession: \${professionId}\`);
        }

        // Initialize demo
        document.addEventListener('DOMContentLoaded', function() {
            loadLaborMarket();
            loadProfessions();
            loadUnemploymentStats();
        });
    </script>
</body>
</html>
  `;

  res.send(html);
});

export default router;
