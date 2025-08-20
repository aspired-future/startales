/**
 * Legal & Justice Systems Demo Interface
 * 
 * Interactive demonstration of the comprehensive legal system including
 * courts, law enforcement, crime tracking, corruption cases, and justice analytics.
 */

import express from 'express';

const router = express.Router();

/**
 * Legal System Demo Page
 */
router.get('/demo/legal', (req, res) => {
  const html = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Legal & Justice Systems Demo</title>
    <style>
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            margin: 0;
            padding: 20px;
            background: linear-gradient(135deg, #1e3c72 0%, #2a5298 100%);
            color: #333;
            min-height: 100vh;
        }
        .container {
            max-width: 1400px;
            margin: 0 auto;
            background: white;
            border-radius: 15px;
            box-shadow: 0 20px 40px rgba(0,0,0,0.1);
            overflow: hidden;
        }
        .header {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
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
        .nav-tabs {
            display: flex;
            background: #f8f9fa;
            border-bottom: 1px solid #dee2e6;
            overflow-x: auto;
        }
        .nav-tab {
            padding: 15px 25px;
            cursor: pointer;
            border: none;
            background: none;
            font-size: 16px;
            color: #495057;
            transition: all 0.3s ease;
            white-space: nowrap;
            border-bottom: 3px solid transparent;
        }
        .nav-tab:hover {
            background: #e9ecef;
            color: #007bff;
        }
        .nav-tab.active {
            background: white;
            color: #007bff;
            border-bottom-color: #007bff;
        }
        .tab-content {
            padding: 30px;
            min-height: 600px;
        }
        .tab-pane {
            display: none;
        }
        .tab-pane.active {
            display: block;
        }
        .metrics-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
            gap: 20px;
            margin-bottom: 30px;
        }
        .metric-card {
            background: #f8f9fa;
            padding: 20px;
            border-radius: 10px;
            border-left: 4px solid #007bff;
            transition: transform 0.2s ease;
        }
        .metric-card:hover {
            transform: translateY(-2px);
            box-shadow: 0 4px 12px rgba(0,0,0,0.1);
        }
        .metric-value {
            font-size: 2em;
            font-weight: bold;
            color: #007bff;
            margin-bottom: 5px;
        }
        .metric-label {
            color: #6c757d;
            font-size: 0.9em;
            text-transform: uppercase;
            letter-spacing: 0.5px;
        }
        .controls {
            background: #f8f9fa;
            padding: 20px;
            border-radius: 10px;
            margin-bottom: 20px;
        }
        .control-group {
            display: flex;
            gap: 15px;
            align-items: center;
            margin-bottom: 15px;
            flex-wrap: wrap;
        }
        .control-group:last-child {
            margin-bottom: 0;
        }
        .control-group label {
            font-weight: 500;
            min-width: 120px;
        }
        .control-group select,
        .control-group input {
            padding: 8px 12px;
            border: 1px solid #ced4da;
            border-radius: 5px;
            font-size: 14px;
        }
        .btn {
            padding: 10px 20px;
            border: none;
            border-radius: 5px;
            cursor: pointer;
            font-size: 14px;
            transition: all 0.3s ease;
            text-decoration: none;
            display: inline-block;
        }
        .btn-primary {
            background: #007bff;
            color: white;
        }
        .btn-primary:hover {
            background: #0056b3;
        }
        .btn-success {
            background: #28a745;
            color: white;
        }
        .btn-success:hover {
            background: #1e7e34;
        }
        .btn-warning {
            background: #ffc107;
            color: #212529;
        }
        .btn-warning:hover {
            background: #e0a800;
        }
        .btn-danger {
            background: #dc3545;
            color: white;
        }
        .btn-danger:hover {
            background: #c82333;
        }
        .data-table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 20px;
            background: white;
            border-radius: 8px;
            overflow: hidden;
            box-shadow: 0 2px 8px rgba(0,0,0,0.1);
        }
        .data-table th {
            background: #007bff;
            color: white;
            padding: 12px;
            text-align: left;
            font-weight: 500;
        }
        .data-table td {
            padding: 12px;
            border-bottom: 1px solid #dee2e6;
        }
        .data-table tr:hover {
            background: #f8f9fa;
        }
        .status-badge {
            padding: 4px 8px;
            border-radius: 12px;
            font-size: 0.8em;
            font-weight: 500;
            text-transform: uppercase;
        }
        .status-filed { background: #e3f2fd; color: #1976d2; }
        .status-trial { background: #fff3e0; color: #f57c00; }
        .status-closed { background: #e8f5e8; color: #388e3c; }
        .status-reported { background: #fce4ec; color: #c2185b; }
        .status-investigating { background: #fff8e1; color: #f9a825; }
        .status-solved { background: #e8f5e8; color: #388e3c; }
        .severity-misdemeanor { background: #e8f5e8; color: #388e3c; }
        .severity-felony { background: #fff3e0; color: #f57c00; }
        .severity-capital { background: #ffebee; color: #d32f2f; }
        .loading {
            text-align: center;
            padding: 40px;
            color: #6c757d;
        }
        .error {
            background: #f8d7da;
            color: #721c24;
            padding: 15px;
            border-radius: 5px;
            margin: 20px 0;
        }
        .success {
            background: #d4edda;
            color: #155724;
            padding: 15px;
            border-radius: 5px;
            margin: 20px 0;
        }
        .analytics-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
            gap: 20px;
            margin-top: 20px;
        }
        .analytics-card {
            background: white;
            border: 1px solid #dee2e6;
            border-radius: 10px;
            padding: 20px;
        }
        .analytics-card h4 {
            margin-top: 0;
            color: #495057;
            border-bottom: 2px solid #007bff;
            padding-bottom: 10px;
        }
        .progress-bar {
            background: #e9ecef;
            border-radius: 10px;
            height: 20px;
            overflow: hidden;
            margin: 10px 0;
        }
        .progress-fill {
            height: 100%;
            background: linear-gradient(90deg, #007bff, #0056b3);
            transition: width 0.3s ease;
        }
        .insight-list {
            list-style: none;
            padding: 0;
        }
        .insight-list li {
            background: #f8f9fa;
            margin: 10px 0;
            padding: 15px;
            border-radius: 8px;
            border-left: 4px solid #007bff;
        }
        .recommendation-list {
            list-style: none;
            padding: 0;
        }
        .recommendation-list li {
            background: #e8f5e8;
            margin: 10px 0;
            padding: 15px;
            border-radius: 8px;
            border-left: 4px solid #28a745;
        }
        @media (max-width: 768px) {
            .container {
                margin: 10px;
                border-radius: 10px;
            }
            .header {
                padding: 20px;
            }
            .header h1 {
                font-size: 2em;
            }
            .tab-content {
                padding: 20px;
            }
            .metrics-grid {
                grid-template-columns: 1fr;
            }
            .control-group {
                flex-direction: column;
                align-items: stretch;
            }
            .control-group label {
                min-width: auto;
            }
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>⚖️ Legal & Justice Systems</h1>
            <p>Comprehensive legal framework with courts, law enforcement, crime tracking, and justice analytics</p>
        </div>

        <div class="nav-tabs">
            <button class="nav-tab active" onclick="showTab('overview')">System Overview</button>
            <button class="nav-tab" onclick="showTab('courts')">Courts</button>
            <button class="nav-tab" onclick="showTab('agencies')">Law Enforcement</button>
            <button class="nav-tab" onclick="showTab('cases')">Legal Cases</button>
            <button class="nav-tab" onclick="showTab('crimes')">Crime Tracking</button>
            <button class="nav-tab" onclick="showTab('corruption')">Corruption Cases</button>
            <button class="nav-tab" onclick="showTab('analytics')">Justice Analytics</button>
            <button class="nav-tab" onclick="showTab('simulation')">System Simulation</button>
        </div>

        <div class="tab-content">
            <!-- System Overview Tab -->
            <div id="overview" class="tab-pane active">
                <h3>Legal & Justice Systems Overview</h3>
                <div class="metrics-grid" id="overviewMetrics">
                    <div class="loading">Loading system overview...</div>
                </div>
                
                <div class="analytics-grid">
                    <div class="analytics-card">
                        <h4>Justice Health Score</h4>
                        <div id="justiceHealthScore" class="metric-value">--</div>
                        <div class="progress-bar">
                            <div id="justiceHealthProgress" class="progress-fill" style="width: 0%"></div>
                        </div>
                        <p>Overall health of the justice system based on access, fairness, efficiency, transparency, and accountability.</p>
                    </div>
                    
                    <div class="analytics-card">
                        <h4>Crime Clearance Rate</h4>
                        <div id="clearanceRate" class="metric-value">--</div>
                        <div class="progress-bar">
                            <div id="clearanceProgress" class="progress-fill" style="width: 0%"></div>
                        </div>
                        <p>Percentage of reported crimes that have been solved by law enforcement.</p>
                    </div>
                    
                    <div class="analytics-card">
                        <h4>Court Efficiency</h4>
                        <div id="courtEfficiency" class="metric-value">--</div>
                        <div class="progress-bar">
                            <div id="courtEfficiencyProgress" class="progress-fill" style="width: 0%"></div>
                        </div>
                        <p>Average case processing efficiency across all court levels.</p>
                    </div>
                    
                    <div class="analytics-card">
                        <h4>Public Trust Level</h4>
                        <div id="publicTrust" class="metric-value">--</div>
                        <div class="progress-bar">
                            <div id="publicTrustProgress" class="progress-fill" style="width: 0%"></div>
                        </div>
                        <p>Community trust in law enforcement and the justice system.</p>
                    </div>
                </div>
            </div>

            <!-- Courts Tab -->
            <div id="courts" class="tab-pane">
                <h3>Court System Management</h3>
                
                <div class="controls">
                    <div class="control-group">
                        <label>Court Level:</label>
                        <select id="courtLevel">
                            <option value="">All Levels</option>
                            <option value="local">Local Courts</option>
                            <option value="district">District Courts</option>
                            <option value="appellate">Appellate Courts</option>
                            <option value="supreme">Supreme Court</option>
                        </select>
                        <button class="btn btn-primary" onclick="loadCourts()">Load Courts</button>
                        <button class="btn btn-success" onclick="showCreateCourtForm()">Create New Court</button>
                    </div>
                </div>

                <div id="createCourtForm" style="display: none;" class="controls">
                    <h4>Create New Court</h4>
                    <div class="control-group">
                        <label>Court Name:</label>
                        <input type="text" id="newCourtName" placeholder="Enter court name">
                        <label>Level:</label>
                        <select id="newCourtLevel">
                            <option value="local">Local</option>
                            <option value="district">District</option>
                            <option value="appellate">Appellate</option>
                            <option value="supreme">Supreme</option>
                        </select>
                    </div>
                    <div class="control-group">
                        <label>Budget:</label>
                        <input type="number" id="newCourtBudget" placeholder="Annual budget">
                        <button class="btn btn-success" onclick="createCourt()">Create Court</button>
                        <button class="btn btn-warning" onclick="hideCreateCourtForm()">Cancel</button>
                    </div>
                </div>

                <div id="courtsData">
                    <div class="loading">Loading courts data...</div>
                </div>
            </div>

            <!-- Law Enforcement Agencies Tab -->
            <div id="agencies" class="tab-pane">
                <h3>Law Enforcement Agencies</h3>
                
                <div class="controls">
                    <div class="control-group">
                        <label>Agency Type:</label>
                        <select id="agencyType">
                            <option value="">All Types</option>
                            <option value="police">Police</option>
                            <option value="state_police">State Police</option>
                            <option value="federal">Federal</option>
                            <option value="sheriff">Sheriff</option>
                        </select>
                        <button class="btn btn-primary" onclick="loadAgencies()">Load Agencies</button>
                        <button class="btn btn-success" onclick="showCreateAgencyForm()">Create New Agency</button>
                    </div>
                </div>

                <div id="createAgencyForm" style="display: none;" class="controls">
                    <h4>Create New Law Enforcement Agency</h4>
                    <div class="control-group">
                        <label>Agency Name:</label>
                        <input type="text" id="newAgencyName" placeholder="Enter agency name">
                        <label>Type:</label>
                        <select id="newAgencyType">
                            <option value="police">Police</option>
                            <option value="state_police">State Police</option>
                            <option value="federal">Federal</option>
                            <option value="sheriff">Sheriff</option>
                        </select>
                    </div>
                    <div class="control-group">
                        <label>Jurisdiction:</label>
                        <input type="text" id="newAgencyJurisdiction" placeholder="Area of jurisdiction">
                        <label>Budget:</label>
                        <input type="number" id="newAgencyBudget" placeholder="Annual budget">
                    </div>
                    <div class="control-group">
                        <label>Officers:</label>
                        <input type="number" id="newAgencyOfficers" placeholder="Number of officers">
                        <button class="btn btn-success" onclick="createAgency()">Create Agency</button>
                        <button class="btn btn-warning" onclick="hideCreateAgencyForm()">Cancel</button>
                    </div>
                </div>

                <div id="agenciesData">
                    <div class="loading">Loading agencies data...</div>
                </div>
            </div>

            <!-- Legal Cases Tab -->
            <div id="cases" class="tab-pane">
                <h3>Legal Cases Management</h3>
                
                <div class="controls">
                    <div class="control-group">
                        <label>Case Status:</label>
                        <select id="caseStatus">
                            <option value="">All Statuses</option>
                            <option value="filed">Filed</option>
                            <option value="discovery">Discovery</option>
                            <option value="trial">Trial</option>
                            <option value="verdict">Verdict</option>
                            <option value="closed">Closed</option>
                        </select>
                        <label>Case Type:</label>
                        <select id="caseType">
                            <option value="">All Types</option>
                            <option value="criminal">Criminal</option>
                            <option value="civil">Civil</option>
                            <option value="constitutional">Constitutional</option>
                            <option value="administrative">Administrative</option>
                        </select>
                        <button class="btn btn-primary" onclick="loadCases()">Load Cases</button>
                        <button class="btn btn-success" onclick="showCreateCaseForm()">File New Case</button>
                    </div>
                </div>

                <div id="createCaseForm" style="display: none;" class="controls">
                    <h4>File New Legal Case</h4>
                    <div class="control-group">
                        <label>Case Title:</label>
                        <input type="text" id="newCaseTitle" placeholder="Enter case title">
                        <label>Type:</label>
                        <select id="newCaseType">
                            <option value="criminal">Criminal</option>
                            <option value="civil">Civil</option>
                            <option value="constitutional">Constitutional</option>
                            <option value="administrative">Administrative</option>
                        </select>
                    </div>
                    <div class="control-group">
                        <label>Category:</label>
                        <input type="text" id="newCaseCategory" placeholder="Case category">
                        <label>Severity:</label>
                        <select id="newCaseSeverity">
                            <option value="misdemeanor">Misdemeanor</option>
                            <option value="felony">Felony</option>
                            <option value="capital">Capital</option>
                        </select>
                    </div>
                    <div class="control-group">
                        <button class="btn btn-success" onclick="createCase()">File Case</button>
                        <button class="btn btn-warning" onclick="hideCreateCaseForm()">Cancel</button>
                    </div>
                </div>

                <div id="casesData">
                    <div class="loading">Loading cases data...</div>
                </div>
            </div>

            <!-- Crime Tracking Tab -->
            <div id="crimes" class="tab-pane">
                <h3>Crime Tracking & Investigation</h3>
                
                <div class="controls">
                    <div class="control-group">
                        <label>Crime Type:</label>
                        <select id="crimeType">
                            <option value="">All Types</option>
                            <option value="violent">Violent</option>
                            <option value="property">Property</option>
                            <option value="white_collar">White Collar</option>
                            <option value="drug">Drug</option>
                            <option value="cyber">Cyber</option>
                            <option value="public_order">Public Order</option>
                        </select>
                        <label>Investigation Status:</label>
                        <select id="crimeStatus">
                            <option value="">All Statuses</option>
                            <option value="reported">Reported</option>
                            <option value="investigating">Investigating</option>
                            <option value="solved">Solved</option>
                            <option value="cold_case">Cold Case</option>
                        </select>
                        <button class="btn btn-primary" onclick="loadCrimes()">Load Crimes</button>
                        <button class="btn btn-danger" onclick="showReportCrimeForm()">Report Crime</button>
                    </div>
                </div>

                <div id="reportCrimeForm" style="display: none;" class="controls">
                    <h4>Report New Crime</h4>
                    <div class="control-group">
                        <label>Crime Type:</label>
                        <select id="newCrimeType">
                            <option value="violent">Violent</option>
                            <option value="property">Property</option>
                            <option value="white_collar">White Collar</option>
                            <option value="drug">Drug</option>
                            <option value="cyber">Cyber</option>
                            <option value="public_order">Public Order</option>
                        </select>
                        <label>Category:</label>
                        <input type="text" id="newCrimeCategory" placeholder="Specific crime category">
                    </div>
                    <div class="control-group">
                        <label>Location:</label>
                        <input type="text" id="newCrimeLocation" placeholder="Crime location">
                        <label>Description:</label>
                        <input type="text" id="newCrimeDescription" placeholder="Crime description">
                    </div>
                    <div class="control-group">
                        <button class="btn btn-danger" onclick="reportCrime()">Report Crime</button>
                        <button class="btn btn-warning" onclick="hideReportCrimeForm()">Cancel</button>
                    </div>
                </div>

                <div id="crimesData">
                    <div class="loading">Loading crimes data...</div>
                </div>
            </div>

            <!-- Corruption Cases Tab -->
            <div id="corruption" class="tab-pane">
                <h3>Corruption Cases & Oversight</h3>
                
                <div class="controls">
                    <div class="control-group">
                        <label>Corruption Type:</label>
                        <select id="corruptionType">
                            <option value="">All Types</option>
                            <option value="bribery">Bribery</option>
                            <option value="embezzlement">Embezzlement</option>
                            <option value="fraud">Fraud</option>
                            <option value="nepotism">Nepotism</option>
                            <option value="abuse_of_power">Abuse of Power</option>
                        </select>
                        <label>Government Level:</label>
                        <select id="corruptionLevel">
                            <option value="">All Levels</option>
                            <option value="local">Local</option>
                            <option value="state">State</option>
                            <option value="federal">Federal</option>
                        </select>
                        <button class="btn btn-primary" onclick="loadCorruption()">Load Cases</button>
                        <button class="btn btn-warning" onclick="showReportCorruptionForm()">Report Corruption</button>
                    </div>
                </div>

                <div id="reportCorruptionForm" style="display: none;" class="controls">
                    <h4>Report Corruption Case</h4>
                    <div class="control-group">
                        <label>Type:</label>
                        <select id="newCorruptionType">
                            <option value="bribery">Bribery</option>
                            <option value="embezzlement">Embezzlement</option>
                            <option value="fraud">Fraud</option>
                            <option value="nepotism">Nepotism</option>
                            <option value="abuse_of_power">Abuse of Power</option>
                        </select>
                        <label>Level:</label>
                        <select id="newCorruptionLevel">
                            <option value="local">Local</option>
                            <option value="state">State</option>
                            <option value="federal">Federal</option>
                        </select>
                    </div>
                    <div class="control-group">
                        <label>Official ID:</label>
                        <input type="text" id="newCorruptionOfficialId" placeholder="Official identifier">
                        <label>Office:</label>
                        <input type="text" id="newCorruptionOffice" placeholder="Government office">
                    </div>
                    <div class="control-group">
                        <label>Description:</label>
                        <input type="text" id="newCorruptionDescription" placeholder="Corruption description">
                        <label>Monetary Value:</label>
                        <input type="number" id="newCorruptionValue" placeholder="Estimated value">
                    </div>
                    <div class="control-group">
                        <button class="btn btn-warning" onclick="reportCorruption()">Report Corruption</button>
                        <button class="btn btn-warning" onclick="hideReportCorruptionForm()">Cancel</button>
                    </div>
                </div>

                <div id="corruptionData">
                    <div class="loading">Loading corruption cases...</div>
                </div>
            </div>

            <!-- Analytics Tab -->
            <div id="analytics" class="tab-pane">
                <h3>Justice System Analytics & Insights</h3>
                
                <div class="controls">
                    <div class="control-group">
                        <label>Jurisdiction:</label>
                        <input type="text" id="analyticsJurisdiction" value="default" placeholder="Jurisdiction name">
                        <button class="btn btn-primary" onclick="loadAnalytics()">Generate Analytics</button>
                        <button class="btn btn-success" onclick="loadInsights()">Get Insights</button>
                    </div>
                </div>

                <div id="analyticsData">
                    <div class="loading">Loading analytics...</div>
                </div>

                <div id="insightsData" style="display: none;">
                    <div class="analytics-grid">
                        <div class="analytics-card">
                            <h4>System Insights</h4>
                            <ul id="insightsList" class="insight-list">
                                <!-- Insights will be populated here -->
                            </ul>
                        </div>
                        
                        <div class="analytics-card">
                            <h4>Recommendations</h4>
                            <ul id="recommendationsList" class="recommendation-list">
                                <!-- Recommendations will be populated here -->
                            </ul>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Simulation Tab -->
            <div id="simulation" class="tab-pane">
                <h3>Legal System Simulation</h3>
                
                <div class="controls">
                    <div class="control-group">
                        <button class="btn btn-primary" onclick="simulateTimeStep()">Simulate Time Step</button>
                        <button class="btn btn-success" onclick="loadSystemEvents()">View System Events</button>
                        <button class="btn btn-warning" onclick="resetSimulation()">Reset System</button>
                    </div>
                </div>

                <div class="analytics-grid">
                    <div class="analytics-card">
                        <h4>Simulation Status</h4>
                        <div id="simulationStatus">
                            <p>Ready to simulate legal system operations</p>
                        </div>
                    </div>
                    
                    <div class="analytics-card">
                        <h4>System Activity</h4>
                        <div id="systemActivity">
                            <p>No recent activity</p>
                        </div>
                    </div>
                </div>

                <div id="eventsData">
                    <div class="loading">No events loaded</div>
                </div>
            </div>
        </div>
    </div>

    <script>
        // Global state
        let currentData = {};

        // Tab management
        function showTab(tabName) {
            // Hide all tab panes
            document.querySelectorAll('.tab-pane').forEach(pane => {
                pane.classList.remove('active');
            });
            
            // Remove active class from all tabs
            document.querySelectorAll('.nav-tab').forEach(tab => {
                tab.classList.remove('active');
            });
            
            // Show selected tab pane
            document.getElementById(tabName).classList.add('active');
            
            // Add active class to clicked tab
            event.target.classList.add('active');
            
            // Load data for the selected tab
            loadTabData(tabName);
        }

        // Load data based on active tab
        function loadTabData(tabName) {
            switch(tabName) {
                case 'overview':
                    loadOverview();
                    break;
                case 'courts':
                    loadCourts();
                    break;
                case 'agencies':
                    loadAgencies();
                    break;
                case 'cases':
                    loadCases();
                    break;
                case 'crimes':
                    loadCrimes();
                    break;
                case 'corruption':
                    loadCorruption();
                    break;
                case 'analytics':
                    loadAnalytics();
                    break;
                case 'simulation':
                    loadSystemEvents();
                    break;
            }
        }

        // Load system overview
        async function loadOverview() {
            try {
                const response = await fetch('/api/legal/health');
                const data = await response.json();
                
                if (data.success !== false) {
                    displayOverviewMetrics(data);
                    
                    // Load analytics for overview scores
                    const analyticsResponse = await fetch('/api/legal/analytics');
                    const analyticsData = await analyticsResponse.json();
                    
                    if (analyticsData.success) {
                        updateOverviewScores(analyticsData.data);
                    }
                }
            } catch (error) {
                document.getElementById('overviewMetrics').innerHTML = 
                    '<div class="error">Error loading overview: ' + error.message + '</div>';
            }
        }

        function displayOverviewMetrics(data) {
            const metrics = [
                { label: 'Active Courts', value: data.components.courts, color: '#007bff' },
                { label: 'Law Enforcement Agencies', value: data.components.lawEnforcementAgencies, color: '#28a745' },
                { label: 'Active Legal Cases', value: data.components.activeCases, color: '#ffc107' },
                { label: 'Reported Crimes', value: data.components.crimes, color: '#dc3545' },
                { label: 'Corruption Cases', value: data.components.corruptionCases, color: '#6f42c1' }
            ];

            const html = metrics.map(metric => \`
                <div class="metric-card" style="border-left-color: \${metric.color}">
                    <div class="metric-value" style="color: \${metric.color}">\${metric.value}</div>
                    <div class="metric-label">\${metric.label}</div>
                </div>
            \`).join('');

            document.getElementById('overviewMetrics').innerHTML = html;
        }

        function updateOverviewScores(analytics) {
            // Justice Health Score
            const justiceScore = Math.round(analytics.justiceHealth.overallScore);
            document.getElementById('justiceHealthScore').textContent = justiceScore + '/100';
            document.getElementById('justiceHealthProgress').style.width = justiceScore + '%';
            
            // Crime Clearance Rate
            const clearanceRate = Math.round(analytics.crimeStatistics.clearanceRate);
            document.getElementById('clearanceRate').textContent = clearanceRate + '%';
            document.getElementById('clearanceProgress').style.width = clearanceRate + '%';
            
            // Court Efficiency
            const courtEfficiency = Math.round(analytics.courtPerformance.clearanceRate);
            document.getElementById('courtEfficiency').textContent = courtEfficiency + '%';
            document.getElementById('courtEfficiencyProgress').style.width = courtEfficiency + '%';
            
            // Public Trust
            const publicTrust = Math.round(analytics.lawEnforcement.performance.communityTrust);
            document.getElementById('publicTrust').textContent = publicTrust + '%';
            document.getElementById('publicTrustProgress').style.width = publicTrust + '%';
        }

        // Courts management
        async function loadCourts() {
            try {
                const level = document.getElementById('courtLevel')?.value || '';
                const url = '/api/legal/courts' + (level ? \`?level=\${level}\` : '');
                
                const response = await fetch(url);
                const data = await response.json();
                
                if (data.success) {
                    displayCourtsTable(data.data);
                } else {
                    throw new Error(data.error || 'Failed to load courts');
                }
            } catch (error) {
                document.getElementById('courtsData').innerHTML = 
                    '<div class="error">Error loading courts: ' + error.message + '</div>';
            }
        }

        function displayCourtsTable(courts) {
            if (courts.length === 0) {
                document.getElementById('courtsData').innerHTML = '<p>No courts found.</p>';
                return;
            }

            const html = \`
                <table class="data-table">
                    <thead>
                        <tr>
                            <th>Court Name</th>
                            <th>Level</th>
                            <th>Judges</th>
                            <th>Caseload</th>
                            <th>Efficiency</th>
                            <th>Budget</th>
                            <th>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        \${courts.map(court => \`
                            <tr>
                                <td>\${court.name}</td>
                                <td>\${court.level}</td>
                                <td>\${court.judges.length}</td>
                                <td>\${court.caseload.pending + court.caseload.inProgress}</td>
                                <td>\${Math.round(court.performance.efficiency)}%</td>
                                <td>$\${court.budget.toLocaleString()}</td>
                                <td><span class="status-badge status-\${court.status}">\${court.status}</span></td>
                            </tr>
                        \`).join('')}
                    </tbody>
                </table>
            \`;

            document.getElementById('courtsData').innerHTML = html;
        }

        function showCreateCourtForm() {
            document.getElementById('createCourtForm').style.display = 'block';
        }

        function hideCreateCourtForm() {
            document.getElementById('createCourtForm').style.display = 'none';
        }

        async function createCourt() {
            try {
                const courtData = {
                    name: document.getElementById('newCourtName').value,
                    level: document.getElementById('newCourtLevel').value,
                    jurisdiction: ['General jurisdiction'],
                    judges: [{
                        id: 'judge_' + Date.now(),
                        name: 'Judge Smith',
                        title: 'Judge',
                        appointmentDate: new Date().toISOString(),
                        experience: 10,
                        specialization: ['General law'],
                        philosophy: 'Balanced',
                        approval: 75
                    }],
                    budget: parseInt(document.getElementById('newCourtBudget').value)
                };

                const response = await fetch('/api/legal/courts', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(courtData)
                });

                const result = await response.json();
                
                if (result.success) {
                    hideCreateCourtForm();
                    loadCourts();
                    showMessage('Court created successfully!', 'success');
                } else {
                    throw new Error(result.error || 'Failed to create court');
                }
            } catch (error) {
                showMessage('Error creating court: ' + error.message, 'error');
            }
        }

        // Law enforcement agencies management
        async function loadAgencies() {
            try {
                const type = document.getElementById('agencyType')?.value || '';
                const url = '/api/legal/agencies' + (type ? \`?type=\${type}\` : '');
                
                const response = await fetch(url);
                const data = await response.json();
                
                if (data.success) {
                    displayAgenciesTable(data.data);
                } else {
                    throw new Error(data.error || 'Failed to load agencies');
                }
            } catch (error) {
                document.getElementById('agenciesData').innerHTML = 
                    '<div class="error">Error loading agencies: ' + error.message + '</div>';
            }
        }

        function displayAgenciesTable(agencies) {
            if (agencies.length === 0) {
                document.getElementById('agenciesData').innerHTML = '<p>No agencies found.</p>';
                return;
            }

            const html = \`
                <table class="data-table">
                    <thead>
                        <tr>
                            <th>Agency Name</th>
                            <th>Type</th>
                            <th>Officers</th>
                            <th>Community Trust</th>
                            <th>Response Time</th>
                            <th>Budget</th>
                            <th>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        \${agencies.map(agency => \`
                            <tr>
                                <td>\${agency.name}</td>
                                <td>\${agency.type}</td>
                                <td>\${agency.personnel.officers}</td>
                                <td>\${Math.round(agency.performance.communityTrust)}%</td>
                                <td>\${agency.operations.patrol.responseTime} min</td>
                                <td>$\${agency.budget.toLocaleString()}</td>
                                <td><span class="status-badge status-\${agency.status}">\${agency.status}</span></td>
                            </tr>
                        \`).join('')}
                    </tbody>
                </table>
            \`;

            document.getElementById('agenciesData').innerHTML = html;
        }

        function showCreateAgencyForm() {
            document.getElementById('createAgencyForm').style.display = 'block';
        }

        function hideCreateAgencyForm() {
            document.getElementById('createAgencyForm').style.display = 'none';
        }

        async function createAgency() {
            try {
                const officers = parseInt(document.getElementById('newAgencyOfficers').value);
                const agencyData = {
                    name: document.getElementById('newAgencyName').value,
                    type: document.getElementById('newAgencyType').value,
                    jurisdiction: document.getElementById('newAgencyJurisdiction').value,
                    personnel: {
                        officers: officers,
                        detectives: Math.floor(officers * 0.15),
                        specialists: Math.floor(officers * 0.05),
                        civilians: Math.floor(officers * 0.2),
                        total: officers + Math.floor(officers * 0.4)
                    },
                    budget: parseInt(document.getElementById('newAgencyBudget').value)
                };

                const response = await fetch('/api/legal/agencies', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(agencyData)
                });

                const result = await response.json();
                
                if (result.success) {
                    hideCreateAgencyForm();
                    loadAgencies();
                    showMessage('Law enforcement agency created successfully!', 'success');
                } else {
                    throw new Error(result.error || 'Failed to create agency');
                }
            } catch (error) {
                showMessage('Error creating agency: ' + error.message, 'error');
            }
        }

        // Legal cases management
        async function loadCases() {
            try {
                const status = document.getElementById('caseStatus')?.value || '';
                const type = document.getElementById('caseType')?.value || '';
                
                let url = '/api/legal/cases?';
                if (status) url += \`status=\${status}&\`;
                if (type) url += \`type=\${type}&\`;
                url += 'limit=50';
                
                const response = await fetch(url);
                const data = await response.json();
                
                if (data.success) {
                    displayCasesTable(data.data);
                } else {
                    throw new Error(data.error || 'Failed to load cases');
                }
            } catch (error) {
                document.getElementById('casesData').innerHTML = 
                    '<div class="error">Error loading cases: ' + error.message + '</div>';
            }
        }

        function displayCasesTable(cases) {
            if (cases.length === 0) {
                document.getElementById('casesData').innerHTML = '<p>No cases found.</p>';
                return;
            }

            const html = \`
                <table class="data-table">
                    <thead>
                        <tr>
                            <th>Case Number</th>
                            <th>Title</th>
                            <th>Type</th>
                            <th>Severity</th>
                            <th>Status</th>
                            <th>Filing Date</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        \${cases.map(case_ => \`
                            <tr>
                                <td>\${case_.caseNumber}</td>
                                <td>\${case_.title}</td>
                                <td>\${case_.type}</td>
                                <td><span class="status-badge severity-\${case_.severity}">\${case_.severity}</span></td>
                                <td><span class="status-badge status-\${case_.status}">\${case_.status}</span></td>
                                <td>\${new Date(case_.filingDate).toLocaleDateString()}</td>
                                <td>
                                    \${case_.status !== 'closed' ? \`<button class="btn btn-primary" onclick="processCase('\${case_.id}')">Process</button>\` : ''}
                                </td>
                            </tr>
                        \`).join('')}
                    </tbody>
                </table>
            \`;

            document.getElementById('casesData').innerHTML = html;
        }

        function showCreateCaseForm() {
            document.getElementById('createCaseForm').style.display = 'block';
        }

        function hideCreateCaseForm() {
            document.getElementById('createCaseForm').style.display = 'none';
        }

        async function createCase() {
            try {
                const caseData = {
                    title: document.getElementById('newCaseTitle').value,
                    type: document.getElementById('newCaseType').value,
                    category: document.getElementById('newCaseCategory').value,
                    severity: document.getElementById('newCaseSeverity').value,
                    plaintiff: {
                        type: 'individual',
                        name: 'Plaintiff Name',
                        representation: 'Public Defender'
                    },
                    defendant: {
                        type: 'individual',
                        name: 'Defendant Name',
                        representation: 'Private Attorney'
                    }
                };

                const response = await fetch('/api/legal/cases', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(caseData)
                });

                const result = await response.json();
                
                if (result.success) {
                    hideCreateCaseForm();
                    loadCases();
                    showMessage('Legal case filed successfully!', 'success');
                } else {
                    throw new Error(result.error || 'Failed to file case');
                }
            } catch (error) {
                showMessage('Error filing case: ' + error.message, 'error');
            }
        }

        async function processCase(caseId) {
            try {
                const response = await fetch(\`/api/legal/cases/\${caseId}/process\`, {
                    method: 'POST'
                });

                const result = await response.json();
                
                if (result.success) {
                    loadCases();
                    showMessage(\`Case processed to \${result.data.status} status\`, 'success');
                } else {
                    throw new Error(result.error || 'Failed to process case');
                }
            } catch (error) {
                showMessage('Error processing case: ' + error.message, 'error');
            }
        }

        // Crime tracking
        async function loadCrimes() {
            try {
                const type = document.getElementById('crimeType')?.value || '';
                const status = document.getElementById('crimeStatus')?.value || '';
                
                let url = '/api/legal/crimes?';
                if (type) url += \`type=\${type}&\`;
                if (status) url += \`status=\${status}&\`;
                url += 'limit=50';
                
                const response = await fetch(url);
                const data = await response.json();
                
                if (data.success) {
                    displayCrimesTable(data.data);
                } else {
                    throw new Error(data.error || 'Failed to load crimes');
                }
            } catch (error) {
                document.getElementById('crimesData').innerHTML = 
                    '<div class="error">Error loading crimes: ' + error.message + '</div>';
            }
        }

        function displayCrimesTable(crimes) {
            if (crimes.length === 0) {
                document.getElementById('crimesData').innerHTML = '<p>No crimes found.</p>';
                return;
            }

            const html = \`
                <table class="data-table">
                    <thead>
                        <tr>
                            <th>Crime Type</th>
                            <th>Category</th>
                            <th>Severity</th>
                            <th>Location</th>
                            <th>Investigation Status</th>
                            <th>Solvability</th>
                            <th>Date</th>
                        </tr>
                    </thead>
                    <tbody>
                        \${crimes.map(crime => \`
                            <tr>
                                <td>\${crime.type}</td>
                                <td>\${crime.category}</td>
                                <td><span class="status-badge severity-\${crime.severity}">\${crime.severity}</span></td>
                                <td>\${crime.location}</td>
                                <td><span class="status-badge status-\${crime.investigation.status}">\${crime.investigation.status}</span></td>
                                <td>\${Math.round(crime.investigation.solvability)}%</td>
                                <td>\${new Date(crime.dateTime).toLocaleDateString()}</td>
                            </tr>
                        \`).join('')}
                    </tbody>
                </table>
            \`;

            document.getElementById('crimesData').innerHTML = html;
        }

        function showReportCrimeForm() {
            document.getElementById('reportCrimeForm').style.display = 'block';
        }

        function hideReportCrimeForm() {
            document.getElementById('reportCrimeForm').style.display = 'none';
        }

        async function reportCrime() {
            try {
                const crimeData = {
                    type: document.getElementById('newCrimeType').value,
                    category: document.getElementById('newCrimeCategory').value,
                    location: document.getElementById('newCrimeLocation').value,
                    description: document.getElementById('newCrimeDescription').value,
                    perpetrator: {
                        motives: ['Unknown'],
                        mentalState: 'Unknown'
                    },
                    victims: [{
                        type: 'individual',
                        impact: { physical: 0, financial: 0, psychological: 0, social: 0 }
                    }],
                    reportedBy: 'Citizen'
                };

                const response = await fetch('/api/legal/crimes', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(crimeData)
                });

                const result = await response.json();
                
                if (result.success) {
                    hideReportCrimeForm();
                    loadCrimes();
                    showMessage('Crime reported successfully!', 'success');
                } else {
                    throw new Error(result.error || 'Failed to report crime');
                }
            } catch (error) {
                showMessage('Error reporting crime: ' + error.message, 'error');
            }
        }

        // Corruption cases
        async function loadCorruption() {
            try {
                const type = document.getElementById('corruptionType')?.value || '';
                const level = document.getElementById('corruptionLevel')?.value || '';
                
                let url = '/api/legal/corruption?';
                if (type) url += \`type=\${type}&\`;
                if (level) url += \`level=\${level}&\`;
                url += 'limit=50';
                
                const response = await fetch(url);
                const data = await response.json();
                
                if (data.success) {
                    displayCorruptionTable(data.data);
                } else {
                    throw new Error(data.error || 'Failed to load corruption cases');
                }
            } catch (error) {
                document.getElementById('corruptionData').innerHTML = 
                    '<div class="error">Error loading corruption cases: ' + error.message + '</div>';
            }
        }

        function displayCorruptionTable(cases) {
            if (cases.length === 0) {
                document.getElementById('corruptionData').innerHTML = '<p>No corruption cases found.</p>';
                return;
            }

            const html = \`
                <table class="data-table">
                    <thead>
                        <tr>
                            <th>Type</th>
                            <th>Level</th>
                            <th>Official</th>
                            <th>Office</th>
                            <th>Monetary Value</th>
                            <th>Status</th>
                            <th>Discovery Date</th>
                        </tr>
                    </thead>
                    <tbody>
                        \${cases.map(case_ => \`
                            <tr>
                                <td>\${case_.type}</td>
                                <td>\${case_.level}</td>
                                <td>\${case_.officialId}</td>
                                <td>\${case_.office}</td>
                                <td>$\${case_.monetaryValue.toLocaleString()}</td>
                                <td><span class="status-badge status-\${case_.investigationStatus}">\${case_.investigationStatus}</span></td>
                                <td>\${new Date(case_.discoveryDate).toLocaleDateString()}</td>
                            </tr>
                        \`).join('')}
                    </tbody>
                </table>
            \`;

            document.getElementById('corruptionData').innerHTML = html;
        }

        function showReportCorruptionForm() {
            document.getElementById('reportCorruptionForm').style.display = 'block';
        }

        function hideReportCorruptionForm() {
            document.getElementById('reportCorruptionForm').style.display = 'none';
        }

        async function reportCorruption() {
            try {
                const corruptionData = {
                    type: document.getElementById('newCorruptionType').value,
                    officialId: document.getElementById('newCorruptionOfficialId').value,
                    office: document.getElementById('newCorruptionOffice').value,
                    level: document.getElementById('newCorruptionLevel').value,
                    description: document.getElementById('newCorruptionDescription').value,
                    monetaryValue: parseInt(document.getElementById('newCorruptionValue').value) || 0,
                    detectionMethod: 'complaint',
                    evidenceStrength: 50 + Math.random() * 40
                };

                const response = await fetch('/api/legal/corruption', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(corruptionData)
                });

                const result = await response.json();
                
                if (result.success) {
                    hideReportCorruptionForm();
                    loadCorruption();
                    showMessage('Corruption case reported successfully!', 'success');
                } else {
                    throw new Error(result.error || 'Failed to report corruption');
                }
            } catch (error) {
                showMessage('Error reporting corruption: ' + error.message, 'error');
            }
        }

        // Analytics
        async function loadAnalytics() {
            try {
                const jurisdiction = document.getElementById('analyticsJurisdiction').value;
                const response = await fetch(\`/api/legal/analytics?jurisdiction=\${jurisdiction}\`);
                const data = await response.json();
                
                if (data.success) {
                    displayAnalytics(data.data);
                } else {
                    throw new Error(data.error || 'Failed to load analytics');
                }
            } catch (error) {
                document.getElementById('analyticsData').innerHTML = 
                    '<div class="error">Error loading analytics: ' + error.message + '</div>';
            }
        }

        function displayAnalytics(analytics) {
            const html = \`
                <div class="analytics-grid">
                    <div class="analytics-card">
                        <h4>Justice Health</h4>
                        <div class="metric-value">\${Math.round(analytics.justiceHealth.overallScore)}/100</div>
                        <div class="progress-bar">
                            <div class="progress-fill" style="width: \${analytics.justiceHealth.overallScore}%"></div>
                        </div>
                        <p><strong>Access:</strong> \${Math.round(analytics.justiceHealth.components.accessToJustice)}/100</p>
                        <p><strong>Fairness:</strong> \${Math.round(analytics.justiceHealth.components.fairness)}/100</p>
                        <p><strong>Efficiency:</strong> \${Math.round(analytics.justiceHealth.components.efficiency)}/100</p>
                    </div>
                    
                    <div class="analytics-card">
                        <h4>Crime Statistics</h4>
                        <p><strong>Total Crimes:</strong> \${analytics.crimeStatistics.totalCrimes}</p>
                        <p><strong>Crime Rate:</strong> \${Math.round(analytics.crimeStatistics.crimeRate)} per 100k</p>
                        <p><strong>Clearance Rate:</strong> \${Math.round(analytics.crimeStatistics.clearanceRate)}%</p>
                        <div class="progress-bar">
                            <div class="progress-fill" style="width: \${analytics.crimeStatistics.clearanceRate}%"></div>
                        </div>
                    </div>
                    
                    <div class="analytics-card">
                        <h4>Court Performance</h4>
                        <p><strong>Case Backlog:</strong> \${analytics.courtPerformance.caseBacklog}</p>
                        <p><strong>Avg Processing:</strong> \${Math.round(analytics.courtPerformance.averageProcessingTime)} days</p>
                        <p><strong>Clearance Rate:</strong> \${Math.round(analytics.courtPerformance.clearanceRate)}%</p>
                        <div class="progress-bar">
                            <div class="progress-fill" style="width: \${analytics.courtPerformance.clearanceRate}%"></div>
                        </div>
                    </div>
                    
                    <div class="analytics-card">
                        <h4>Corruption Metrics</h4>
                        <p><strong>Reported Cases:</strong> \${analytics.corruptionMetrics.reportedCases}</p>
                        <p><strong>Substantiated:</strong> \${analytics.corruptionMetrics.substantiatedCases}</p>
                        <p><strong>Conviction Rate:</strong> \${Math.round(analytics.corruptionMetrics.convictionRate)}%</p>
                        <p><strong>Avg Value:</strong> $\${Math.round(analytics.corruptionMetrics.averageMonetaryValue).toLocaleString()}</p>
                    </div>
                    
                    <div class="analytics-card">
                        <h4>Law Enforcement</h4>
                        <p><strong>Total Agencies:</strong> \${analytics.lawEnforcement.totalAgencies}</p>
                        <p><strong>Total Officers:</strong> \${analytics.lawEnforcement.totalOfficers}</p>
                        <p><strong>Community Trust:</strong> \${Math.round(analytics.lawEnforcement.performance.communityTrust)}%</p>
                        <div class="progress-bar">
                            <div class="progress-fill" style="width: \${analytics.lawEnforcement.performance.communityTrust}%"></div>
                        </div>
                    </div>
                    
                    <div class="analytics-card">
                        <h4>System Trends</h4>
                        <p><strong>Crime Rates:</strong> \${analytics.trends.crimeRates.trend}</p>
                        <p><strong>Court Efficiency:</strong> \${analytics.trends.courtEfficiency.trend}</p>
                        <p><strong>Public Trust:</strong> \${analytics.trends.publicTrust.trend}</p>
                        <p><strong>Corruption:</strong> \${analytics.trends.corruption.trend}</p>
                    </div>
                </div>
            \`;

            document.getElementById('analyticsData').innerHTML = html;
        }

        async function loadInsights() {
            try {
                const jurisdiction = document.getElementById('analyticsJurisdiction').value;
                const response = await fetch(\`/api/legal/insights?jurisdiction=\${jurisdiction}\`);
                const data = await response.json();
                
                if (data.success) {
                    displayInsights(data.data);
                } else {
                    throw new Error(data.error || 'Failed to load insights');
                }
            } catch (error) {
                showMessage('Error loading insights: ' + error.message, 'error');
            }
        }

        function displayInsights(data) {
            const insightsHtml = data.insights.map(insight => \`<li>\${insight}</li>\`).join('');
            const recommendationsHtml = data.recommendations.map(rec => \`<li>\${rec}</li>\`).join('');
            
            document.getElementById('insightsList').innerHTML = insightsHtml;
            document.getElementById('recommendationsList').innerHTML = recommendationsHtml;
            document.getElementById('insightsData').style.display = 'block';
        }

        // Simulation
        async function simulateTimeStep() {
            try {
                const response = await fetch('/api/legal/simulate', { method: 'POST' });
                const data = await response.json();
                
                if (data.success) {
                    document.getElementById('simulationStatus').innerHTML = \`
                        <p><strong>Simulation completed successfully</strong></p>
                        <p>Courts: \${data.data.courts}</p>
                        <p>Active Cases: \${data.data.activeCases}</p>
                        <p>Crimes: \${data.data.crimes}</p>
                        <p>Corruption Cases: \${data.data.corruptionCases}</p>
                        <p>Law Enforcement: \${data.data.lawEnforcementAgencies}</p>
                    \`;
                    
                    loadSystemEvents();
                    showMessage('Time step simulated successfully!', 'success');
                } else {
                    throw new Error(data.error || 'Failed to simulate time step');
                }
            } catch (error) {
                showMessage('Error simulating time step: ' + error.message, 'error');
            }
        }

        async function loadSystemEvents() {
            try {
                const response = await fetch('/api/legal/events?limit=20');
                const data = await response.json();
                
                if (data.success) {
                    displayEventsTable(data.data);
                } else {
                    throw new Error(data.error || 'Failed to load events');
                }
            } catch (error) {
                document.getElementById('eventsData').innerHTML = 
                    '<div class="error">Error loading events: ' + error.message + '</div>';
            }
        }

        function displayEventsTable(events) {
            if (events.length === 0) {
                document.getElementById('eventsData').innerHTML = '<p>No recent events.</p>';
                return;
            }

            const html = \`
                <table class="data-table">
                    <thead>
                        <tr>
                            <th>Event Type</th>
                            <th>Details</th>
                            <th>Timestamp</th>
                        </tr>
                    </thead>
                    <tbody>
                        \${events.map(event => \`
                            <tr>
                                <td>\${event.type}</td>
                                <td>\${JSON.stringify(event).substring(0, 100)}...</td>
                                <td>\${new Date(event.timestamp).toLocaleString()}</td>
                            </tr>
                        \`).join('')}
                    </tbody>
                </table>
            \`;

            document.getElementById('eventsData').innerHTML = html;
        }

        function resetSimulation() {
            if (confirm('Are you sure you want to reset the legal system simulation?')) {
                showMessage('Simulation reset functionality would be implemented here.', 'success');
            }
        }

        // Utility functions
        function showMessage(message, type) {
            const messageDiv = document.createElement('div');
            messageDiv.className = type;
            messageDiv.textContent = message;
            
            // Insert at the top of the active tab
            const activeTab = document.querySelector('.tab-pane.active');
            activeTab.insertBefore(messageDiv, activeTab.firstChild);
            
            // Remove after 5 seconds
            setTimeout(() => {
                messageDiv.remove();
            }, 5000);
        }

        // Initialize the demo
        document.addEventListener('DOMContentLoaded', function() {
            loadOverview();
        });
    </script>
</body>
</html>`;

  res.send(html);
});

export default router;
