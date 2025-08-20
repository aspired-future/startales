/**
 * Security & Defense Systems Demo Interface
 * Interactive demonstration of police, federal agencies, and personal security systems
 */

import express from 'express';

const router = express.Router();

router.get('/demo/security', (req, res) => {
  const html = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Security & Defense Systems Demo</title>
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
            padding: 2rem;
            text-align: center;
        }
        .header h1 {
            margin: 0;
            font-size: 2.5rem;
            font-weight: 300;
        }
        .header p {
            margin: 0.5rem 0 0 0;
            opacity: 0.9;
            font-size: 1.1rem;
        }
        .nav-tabs {
            display: flex;
            background: #f8f9fa;
            border-bottom: 1px solid #dee2e6;
            overflow-x: auto;
        }
        .nav-tab {
            padding: 1rem 1.5rem;
            cursor: pointer;
            border: none;
            background: none;
            font-size: 1rem;
            color: #495057;
            border-bottom: 3px solid transparent;
            transition: all 0.3s ease;
            white-space: nowrap;
        }
        .nav-tab:hover {
            background: #e9ecef;
            color: #007bff;
        }
        .nav-tab.active {
            color: #007bff;
            border-bottom-color: #007bff;
            background: white;
        }
        .content {
            padding: 2rem;
        }
        .tab-content {
            display: none;
        }
        .tab-content.active {
            display: block;
        }
        .grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
            gap: 1.5rem;
            margin-bottom: 2rem;
        }
        .card {
            background: #f8f9fa;
            border-radius: 10px;
            padding: 1.5rem;
            border: 1px solid #e9ecef;
            transition: transform 0.2s ease, box-shadow 0.2s ease;
        }
        .card:hover {
            transform: translateY(-2px);
            box-shadow: 0 4px 12px rgba(0,0,0,0.1);
        }
        .card h3 {
            margin: 0 0 1rem 0;
            color: #495057;
            font-size: 1.2rem;
        }
        .metric {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin: 0.5rem 0;
            padding: 0.5rem;
            background: white;
            border-radius: 5px;
            border-left: 4px solid #007bff;
        }
        .metric-label {
            font-weight: 500;
            color: #495057;
        }
        .metric-value {
            font-weight: bold;
            color: #007bff;
        }
        .status-indicator {
            display: inline-block;
            width: 12px;
            height: 12px;
            border-radius: 50%;
            margin-right: 8px;
        }
        .status-excellent { background: #28a745; }
        .status-good { background: #17a2b8; }
        .status-fair { background: #ffc107; }
        .status-poor { background: #fd7e14; }
        .status-critical { background: #dc3545; }
        .btn {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            border: none;
            padding: 0.75rem 1.5rem;
            border-radius: 5px;
            cursor: pointer;
            font-size: 1rem;
            transition: transform 0.2s ease;
            margin: 0.25rem;
        }
        .btn:hover {
            transform: translateY(-1px);
        }
        .btn-secondary {
            background: linear-gradient(135deg, #6c757d 0%, #495057 100%);
        }
        .btn-danger {
            background: linear-gradient(135deg, #dc3545 0%, #c82333 100%);
        }
        .btn-success {
            background: linear-gradient(135deg, #28a745 0%, #20c997 100%);
        }
        .actions {
            margin-top: 1rem;
            padding-top: 1rem;
            border-top: 1px solid #e9ecef;
        }
        .loading {
            text-align: center;
            padding: 2rem;
            color: #6c757d;
        }
        .error {
            background: #f8d7da;
            color: #721c24;
            padding: 1rem;
            border-radius: 5px;
            margin: 1rem 0;
            border: 1px solid #f5c6cb;
        }
        .success {
            background: #d4edda;
            color: #155724;
            padding: 1rem;
            border-radius: 5px;
            margin: 1rem 0;
            border: 1px solid #c3e6cb;
        }
        .data-table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 1rem;
            background: white;
            border-radius: 5px;
            overflow: hidden;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }
        .data-table th,
        .data-table td {
            padding: 0.75rem;
            text-align: left;
            border-bottom: 1px solid #e9ecef;
        }
        .data-table th {
            background: #f8f9fa;
            font-weight: 600;
            color: #495057;
        }
        .data-table tr:hover {
            background: #f8f9fa;
        }
        .classification-badge {
            display: inline-block;
            padding: 0.25rem 0.5rem;
            border-radius: 3px;
            font-size: 0.8rem;
            font-weight: bold;
            text-transform: uppercase;
        }
        .classification-unclassified { background: #e9ecef; color: #495057; }
        .classification-confidential { background: #fff3cd; color: #856404; }
        .classification-secret { background: #f8d7da; color: #721c24; }
        .classification-top-secret { background: #d1ecf1; color: #0c5460; }
        .threat-level {
            padding: 0.25rem 0.5rem;
            border-radius: 3px;
            font-size: 0.8rem;
            font-weight: bold;
            text-transform: uppercase;
        }
        .threat-minimal { background: #d4edda; color: #155724; }
        .threat-low { background: #cce5ff; color: #004085; }
        .threat-moderate { background: #fff3cd; color: #856404; }
        .threat-high { background: #f8d7da; color: #721c24; }
        .threat-critical { background: #f5c6cb; color: #721c24; }
        .threat-extreme { background: #d1ecf1; color: #0c5460; }
        @media (max-width: 768px) {
            .grid {
                grid-template-columns: 1fr;
            }
            .nav-tabs {
                flex-direction: column;
            }
            .nav-tab {
                text-align: center;
            }
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🛡️ Security & Defense Systems</h1>
            <p>Comprehensive security infrastructure management including police, federal agencies, and personal protection</p>
        </div>
        
        <div class="nav-tabs">
            <button class="nav-tab active" onclick="showTab('overview')">System Overview</button>
            <button class="nav-tab" onclick="showTab('police')">Police Forces</button>
            <button class="nav-tab" onclick="showTab('federal')">Federal Agencies</button>
            <button class="nav-tab" onclick="showTab('personal')">Personal Security</button>
            <button class="nav-tab" onclick="showTab('guard')">National Guard</button>
            <button class="nav-tab" onclick="showTab('prisons')">Prison System</button>
            <button class="nav-tab" onclick="showTab('analytics')">Analytics</button>
            <button class="nav-tab" onclick="showTab('events')">Security Events</button>
        </div>

        <div class="content">
            <!-- System Overview Tab -->
            <div id="overview" class="tab-content active">
                <div class="actions">
                    <button class="btn" onclick="generateDemoData()">Generate Demo Data</button>
                    <button class="btn btn-secondary" onclick="loadSystemOverview()">Refresh Overview</button>
                </div>
                <div id="overview-content">
                    <div class="loading">Loading system overview...</div>
                </div>
            </div>

            <!-- Police Forces Tab -->
            <div id="police" class="tab-content">
                <div class="actions">
                    <button class="btn" onclick="loadPoliceForces()">Load Police Forces</button>
                    <button class="btn btn-success" onclick="createPoliceForce()">Create Police Force</button>
                </div>
                <div id="police-content">
                    <div class="loading">Click "Load Police Forces" to view data</div>
                </div>
            </div>

            <!-- Federal Agencies Tab -->
            <div id="federal" class="tab-content">
                <div class="actions">
                    <button class="btn" onclick="loadFederalAgencies()">Load Federal Agencies</button>
                    <button class="btn btn-success" onclick="createFederalAgency()">Create Agency</button>
                </div>
                <div id="federal-content">
                    <div class="loading">Click "Load Federal Agencies" to view data</div>
                </div>
            </div>

            <!-- Personal Security Tab -->
            <div id="personal" class="tab-content">
                <div class="actions">
                    <button class="btn" onclick="loadPersonalSecurity()">Load Personal Security</button>
                    <button class="btn btn-success" onclick="createPersonalSecurity()">Create Security Detail</button>
                </div>
                <div id="personal-content">
                    <div class="loading">Click "Load Personal Security" to view data</div>
                </div>
            </div>

            <!-- National Guard Tab -->
            <div id="guard" class="tab-content">
                <div class="actions">
                    <button class="btn" onclick="loadNationalGuard()">Load National Guard</button>
                    <button class="btn btn-success" onclick="createNationalGuard()">Create Guard Unit</button>
                </div>
                <div id="guard-content">
                    <div class="loading">Click "Load National Guard" to view data</div>
                </div>
            </div>

            <!-- Prison System Tab -->
            <div id="prisons" class="tab-content">
                <div class="actions">
                    <button class="btn" onclick="loadPrisons()">Load Prisons</button>
                    <button class="btn btn-success" onclick="createPrison()">Create Prison</button>
                </div>
                <div id="prisons-content">
                    <div class="loading">Click "Load Prisons" to view data</div>
                </div>
            </div>

            <!-- Analytics Tab -->
            <div id="analytics" class="tab-content">
                <div class="actions">
                    <button class="btn" onclick="loadAnalytics()">Load Analytics</button>
                    <button class="btn btn-secondary" onclick="loadThreatAssessment()">Threat Assessment</button>
                    <button class="btn btn-secondary" onclick="loadSecurityHealth()">Security Health</button>
                </div>
                <div id="analytics-content">
                    <div class="loading">Click "Load Analytics" to view data</div>
                </div>
            </div>

            <!-- Security Events Tab -->
            <div id="events" class="tab-content">
                <div class="actions">
                    <button class="btn" onclick="loadSecurityEvents()">Load Recent Events</button>
                    <button class="btn btn-danger" onclick="recordSecurityEvent()">Record Event</button>
                </div>
                <div id="events-content">
                    <div class="loading">Click "Load Recent Events" to view data</div>
                </div>
            </div>
        </div>
    </div>

    <script>
        function showTab(tabName) {
            // Hide all tab contents
            document.querySelectorAll('.tab-content').forEach(tab => {
                tab.classList.remove('active');
            });
            
            // Remove active class from all nav tabs
            document.querySelectorAll('.nav-tab').forEach(tab => {
                tab.classList.remove('active');
            });
            
            // Show selected tab content
            document.getElementById(tabName).classList.add('active');
            
            // Add active class to clicked nav tab
            event.target.classList.add('active');
        }

        async function apiCall(endpoint, options = {}) {
            try {
                const response = await fetch(\`/api/security\${endpoint}\`, {
                    headers: {
                        'Content-Type': 'application/json',
                        ...options.headers
                    },
                    ...options
                });
                
                if (!response.ok) {
                    throw new Error(\`HTTP \${response.status}: \${response.statusText}\`);
                }
                
                return await response.json();
            } catch (error) {
                console.error('API call failed:', error);
                throw error;
            }
        }

        function showError(containerId, message) {
            document.getElementById(containerId).innerHTML = \`
                <div class="error">
                    <strong>Error:</strong> \${message}
                </div>
            \`;
        }

        function showSuccess(containerId, message) {
            const container = document.getElementById(containerId);
            const successDiv = document.createElement('div');
            successDiv.className = 'success';
            successDiv.innerHTML = \`<strong>Success:</strong> \${message}\`;
            container.insertBefore(successDiv, container.firstChild);
            
            setTimeout(() => {
                successDiv.remove();
            }, 5000);
        }

        function formatCurrency(amount) {
            return new Intl.NumberFormat('en-US', {
                style: 'currency',
                currency: 'USD'
            }).format(amount);
        }

        function formatDate(dateString) {
            return new Date(dateString).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            });
        }

        function getStatusIndicator(status) {
            const statusMap = {
                'Excellent': 'status-excellent',
                'Good': 'status-good',
                'Fair': 'status-fair',
                'Poor': 'status-poor',
                'Critical': 'status-critical'
            };
            return \`<span class="status-indicator \${statusMap[status] || 'status-fair'}"></span>\${status}\`;
        }

        function getClassificationBadge(classification) {
            const classMap = {
                'Unclassified': 'classification-unclassified',
                'Confidential': 'classification-confidential',
                'Secret': 'classification-secret',
                'Top Secret': 'classification-top-secret'
            };
            return \`<span class="classification-badge \${classMap[classification] || 'classification-unclassified'}">\${classification}</span>\`;
        }

        function getThreatLevelBadge(level) {
            const levelMap = {
                'Minimal': 'threat-minimal',
                'Low': 'threat-low',
                'Moderate': 'threat-moderate',
                'High': 'threat-high',
                'Critical': 'threat-critical',
                'Extreme': 'threat-extreme'
            };
            return \`<span class="threat-level \${levelMap[level] || 'threat-moderate'}">\${level}</span>\`;
        }

        async function generateDemoData() {
            try {
                document.getElementById('overview-content').innerHTML = '<div class="loading">Generating demo data...</div>';
                
                const result = await apiCall('/demo/generate', {
                    method: 'POST'
                });
                
                showSuccess('overview-content', result.message);
                await loadSystemOverview();
            } catch (error) {
                showError('overview-content', error.message);
            }
        }

        async function loadSystemOverview() {
            try {
                document.getElementById('overview-content').innerHTML = '<div class="loading">Loading system overview...</div>';
                
                const analytics = await apiCall('/analytics');
                
                const html = \`
                    <div class="grid">
                        <div class="card">
                            <h3>🚔 Security Forces</h3>
                            <div class="metric">
                                <span class="metric-label">Police Forces</span>
                                <span class="metric-value">\${analytics.policeForces.length}</span>
                            </div>
                            <div class="metric">
                                <span class="metric-label">Federal Agencies</span>
                                <span class="metric-value">\${analytics.federalAgencies.length}</span>
                            </div>
                            <div class="metric">
                                <span class="metric-label">National Guard Units</span>
                                <span class="metric-value">\${analytics.nationalGuard.length}</span>
                            </div>
                            <div class="metric">
                                <span class="metric-label">Personal Security Details</span>
                                <span class="metric-value">\${analytics.personalSecurity.length}</span>
                            </div>
                        </div>
                        
                        <div class="card">
                            <h3>🏢 Correctional Facilities</h3>
                            <div class="metric">
                                <span class="metric-label">Prison Facilities</span>
                                <span class="metric-value">\${analytics.prisons.length}</span>
                            </div>
                            <div class="metric">
                                <span class="metric-label">Total Capacity</span>
                                <span class="metric-value">\${analytics.prisons.reduce((sum, p) => sum + p.capacity, 0).toLocaleString()}</span>
                            </div>
                            <div class="metric">
                                <span class="metric-label">Current Population</span>
                                <span class="metric-value">\${analytics.prisons.reduce((sum, p) => sum + p.population, 0).toLocaleString()}</span>
                            </div>
                        </div>
                        
                        <div class="card">
                            <h3>💰 Budget & Personnel</h3>
                            <div class="metric">
                                <span class="metric-label">Total Budget</span>
                                <span class="metric-value">\${formatCurrency(analytics.totalBudget)}</span>
                            </div>
                            <div class="metric">
                                <span class="metric-label">Total Personnel</span>
                                <span class="metric-value">\${analytics.totalPersonnel.toLocaleString()}</span>
                            </div>
                            <div class="metric">
                                <span class="metric-label">System Efficiency</span>
                                <span class="metric-value">\${analytics.systemEfficiency.toFixed(1)}%</span>
                            </div>
                        </div>
                        
                        <div class="card">
                            <h3>📊 Security Metrics</h3>
                            <div class="metric">
                                <span class="metric-label">Overall Security</span>
                                <span class="metric-value">\${analytics.overallSecurity.toFixed(1)}%</span>
                            </div>
                            <div class="metric">
                                <span class="metric-label">Crime Rate</span>
                                <span class="metric-value">\${analytics.crimeRate.toFixed(1)}/100k</span>
                            </div>
                            <div class="metric">
                                <span class="metric-label">Public Safety</span>
                                <span class="metric-value">\${analytics.publicSafety.toFixed(1)}%</span>
                            </div>
                        </div>
                    </div>
                    
                    \${analytics.recommendations.length > 0 ? \`
                        <div class="card">
                            <h3>⚠️ Security Recommendations</h3>
                            <table class="data-table">
                                <thead>
                                    <tr>
                                        <th>Priority</th>
                                        <th>Type</th>
                                        <th>Description</th>
                                        <th>Cost</th>
                                        <th>Timeframe</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    \${analytics.recommendations.map(rec => \`
                                        <tr>
                                            <td><span class="threat-level threat-\${rec.priority.toLowerCase()}">\${rec.priority}</span></td>
                                            <td>\${rec.type}</td>
                                            <td>\${rec.description}</td>
                                            <td>\${formatCurrency(rec.cost)}</td>
                                            <td>\${rec.timeframe}</td>
                                        </tr>
                                    \`).join('')}
                                </tbody>
                            </table>
                        </div>
                    \` : ''}
                \`;
                
                document.getElementById('overview-content').innerHTML = html;
            } catch (error) {
                showError('overview-content', error.message);
            }
        }

        async function loadPoliceForces() {
            try {
                document.getElementById('police-content').innerHTML = '<div class="loading">Loading police forces...</div>';
                
                const forces = await apiCall('/police');
                
                if (forces.length === 0) {
                    document.getElementById('police-content').innerHTML = \`
                        <div class="card">
                            <h3>No Police Forces Found</h3>
                            <p>Click "Create Police Force" to add a new police force to the system.</p>
                        </div>
                    \`;
                    return;
                }
                
                const html = \`
                    <div class="grid">
                        \${forces.map(force => \`
                            <div class="card">
                                <h3>\${force.name}</h3>
                                <div class="metric">
                                    <span class="metric-label">Type</span>
                                    <span class="metric-value">\${force.type}</span>
                                </div>
                                <div class="metric">
                                    <span class="metric-label">Jurisdiction</span>
                                    <span class="metric-value">\${force.jurisdiction}</span>
                                </div>
                                <div class="metric">
                                    <span class="metric-label">Officers</span>
                                    <span class="metric-value">\${force.officers.length}</span>
                                </div>
                                <div class="metric">
                                    <span class="metric-label">Budget</span>
                                    <span class="metric-value">\${formatCurrency(force.budget)}</span>
                                </div>
                                <div class="metric">
                                    <span class="metric-label">Crime Reduction</span>
                                    <span class="metric-value">\${force.performance.crimeReduction.toFixed(1)}%</span>
                                </div>
                                <div class="metric">
                                    <span class="metric-label">Community Trust</span>
                                    <span class="metric-value">\${force.performance.communityTrust.toFixed(1)}%</span>
                                </div>
                                <div class="metric">
                                    <span class="metric-label">Corruption Level</span>
                                    <span class="metric-value">\${force.corruption.toFixed(1)}%</span>
                                </div>
                                \${force.securityClearance !== 'None' ? \`
                                    <div class="metric">
                                        <span class="metric-label">Security Clearance</span>
                                        <span class="metric-value">\${getClassificationBadge(force.securityClearance)}</span>
                                    </div>
                                \` : ''}
                                <div class="actions">
                                    <button class="btn btn-secondary" onclick="viewPoliceDetails('\${force.id}')">View Details</button>
                                </div>
                            </div>
                        \`).join('')}
                    </div>
                \`;
                
                document.getElementById('police-content').innerHTML = html;
            } catch (error) {
                showError('police-content', error.message);
            }
        }

        async function loadFederalAgencies() {
            try {
                document.getElementById('federal-content').innerHTML = '<div class="loading">Loading federal agencies...</div>';
                
                const agencies = await apiCall('/federal-agencies');
                
                if (agencies.length === 0) {
                    document.getElementById('federal-content').innerHTML = \`
                        <div class="card">
                            <h3>No Federal Agencies Found</h3>
                            <p>Click "Create Agency" to add a new federal agency to the system.</p>
                        </div>
                    \`;
                    return;
                }
                
                const html = \`
                    <div class="grid">
                        \${agencies.map(agency => \`
                            <div class="card">
                                <h3>\${agency.name}</h3>
                                <div class="metric">
                                    <span class="metric-label">Type</span>
                                    <span class="metric-value">\${agency.type}</span>
                                </div>
                                <div class="metric">
                                    <span class="metric-label">Headquarters</span>
                                    <span class="metric-value">\${agency.headquarters}</span>
                                </div>
                                <div class="metric">
                                    <span class="metric-label">Personnel</span>
                                    <span class="metric-value">\${agency.personnel.length}</span>
                                </div>
                                <div class="metric">
                                    <span class="metric-label">Active Operations</span>
                                    <span class="metric-value">\${agency.operations.filter(op => op.status === 'Active').length}</span>
                                </div>
                                <div class="metric">
                                    <span class="metric-label">Budget</span>
                                    <span class="metric-value">\${formatCurrency(agency.budget)}</span>
                                </div>
                                <div class="metric">
                                    <span class="metric-label">Security Clearance</span>
                                    <span class="metric-value">\${getClassificationBadge(agency.securityClearance)}</span>
                                </div>
                                <div class="metric">
                                    <span class="metric-label">Intelligence Gathering</span>
                                    <span class="metric-value">\${agency.performance.intelligenceGathering.toFixed(1)}%</span>
                                </div>
                                <div class="actions">
                                    <button class="btn btn-secondary" onclick="viewAgencyDetails('\${agency.id}')">View Details</button>
                                </div>
                            </div>
                        \`).join('')}
                    </div>
                \`;
                
                document.getElementById('federal-content').innerHTML = html;
            } catch (error) {
                showError('federal-content', error.message);
            }
        }

        async function loadPersonalSecurity() {
            try {
                document.getElementById('personal-content').innerHTML = '<div class="loading">Loading personal security details...</div>';
                
                const securities = await apiCall('/personal-security');
                
                if (securities.length === 0) {
                    document.getElementById('personal-content').innerHTML = \`
                        <div class="card">
                            <h3>No Personal Security Details Found</h3>
                            <p>Click "Create Security Detail" to add personal protection for VIPs.</p>
                        </div>
                    \`;
                    return;
                }
                
                const html = \`
                    <div class="grid">
                        \${securities.map(security => \`
                            <div class="card">
                                <h3>\${security.protectedPerson.name}</h3>
                                <div class="metric">
                                    <span class="metric-label">Title</span>
                                    <span class="metric-value">\${security.protectedPerson.title}</span>
                                </div>
                                <div class="metric">
                                    <span class="metric-label">Position</span>
                                    <span class="metric-value">\${security.protectedPerson.position}</span>
                                </div>
                                <div class="metric">
                                    <span class="metric-label">Threat Level</span>
                                    <span class="metric-value">\${getThreatLevelBadge(security.threatLevel)}</span>
                                </div>
                                <div class="metric">
                                    <span class="metric-label">Security Detail</span>
                                    <span class="metric-value">\${security.securityDetail.length} agents</span>
                                </div>
                                <div class="metric">
                                    <span class="metric-label">Security Protocols</span>
                                    <span class="metric-value">\${security.securityProtocols.length}</span>
                                </div>
                                <div class="metric">
                                    <span class="metric-label">Budget</span>
                                    <span class="metric-value">\${formatCurrency(security.budget)}</span>
                                </div>
                                <div class="metric">
                                    <span class="metric-label">Threat Prevention</span>
                                    <span class="metric-value">\${security.performance.threatPrevention.toFixed(1)}%</span>
                                </div>
                                <div class="actions">
                                    <button class="btn btn-secondary" onclick="viewSecurityDetails('\${security.id}')">View Details</button>
                                </div>
                            </div>
                        \`).join('')}
                    </div>
                \`;
                
                document.getElementById('personal-content').innerHTML = html;
            } catch (error) {
                showError('personal-content', error.message);
            }
        }

        async function loadNationalGuard() {
            try {
                document.getElementById('guard-content').innerHTML = '<div class="loading">Loading national guard units...</div>';
                
                const guards = await apiCall('/national-guard');
                
                if (guards.length === 0) {
                    document.getElementById('guard-content').innerHTML = \`
                        <div class="card">
                            <h3>No National Guard Units Found</h3>
                            <p>Click "Create Guard Unit" to establish a national guard unit.</p>
                        </div>
                    \`;
                    return;
                }
                
                const html = \`
                    <div class="grid">
                        \${guards.map(guard => \`
                            <div class="card">
                                <h3>\${guard.name}</h3>
                                <div class="metric">
                                    <span class="metric-label">Personnel</span>
                                    <span class="metric-value">\${guard.personnel.length}</span>
                                </div>
                                <div class="metric">
                                    <span class="metric-label">Readiness</span>
                                    <span class="metric-value">\${guard.readiness.toFixed(1)}%</span>
                                </div>
                                <div class="metric">
                                    <span class="metric-label">Active Deployments</span>
                                    <span class="metric-value">\${guard.deployments.filter(d => d.status === 'Active').length}</span>
                                </div>
                                <div class="metric">
                                    <span class="metric-label">Military Bases</span>
                                    <span class="metric-value">\${guard.bases.length}</span>
                                </div>
                                <div class="metric">
                                    <span class="metric-label">Budget</span>
                                    <span class="metric-value">\${formatCurrency(guard.budget)}</span>
                                </div>
                                <div class="metric">
                                    <span class="metric-label">Effectiveness</span>
                                    <span class="metric-value">\${guard.performance.effectiveness.toFixed(1)}%</span>
                                </div>
                                <div class="actions">
                                    <button class="btn btn-secondary" onclick="viewGuardDetails('\${guard.id}')">View Details</button>
                                </div>
                            </div>
                        \`).join('')}
                    </div>
                \`;
                
                document.getElementById('guard-content').innerHTML = html;
            } catch (error) {
                showError('guard-content', error.message);
            }
        }

        async function loadPrisons() {
            try {
                document.getElementById('prisons-content').innerHTML = '<div class="loading">Loading prison facilities...</div>';
                
                const prisons = await apiCall('/prisons');
                
                if (prisons.length === 0) {
                    document.getElementById('prisons-content').innerHTML = \`
                        <div class="card">
                            <h3>No Prison Facilities Found</h3>
                            <p>Click "Create Prison" to establish a correctional facility.</p>
                        </div>
                    \`;
                    return;
                }
                
                const html = \`
                    <div class="grid">
                        \${prisons.map(prison => \`
                            <div class="card">
                                <h3>\${prison.name}</h3>
                                <div class="metric">
                                    <span class="metric-label">Type</span>
                                    <span class="metric-value">\${prison.type}</span>
                                </div>
                                <div class="metric">
                                    <span class="metric-label">Security Level</span>
                                    <span class="metric-value">\${prison.security}</span>
                                </div>
                                <div class="metric">
                                    <span class="metric-label">Capacity</span>
                                    <span class="metric-value">\${prison.capacity.toLocaleString()}</span>
                                </div>
                                <div class="metric">
                                    <span class="metric-label">Population</span>
                                    <span class="metric-value">\${prison.population.toLocaleString()}</span>
                                </div>
                                <div class="metric">
                                    <span class="metric-label">Occupancy Rate</span>
                                    <span class="metric-value">\${((prison.population / prison.capacity) * 100).toFixed(1)}%</span>
                                </div>
                                <div class="metric">
                                    <span class="metric-label">Rehabilitation Programs</span>
                                    <span class="metric-value">\${prison.programs.length}</span>
                                </div>
                                <div class="metric">
                                    <span class="metric-label">Security Rating</span>
                                    <span class="metric-value">\${prison.performance.security.toFixed(1)}%</span>
                                </div>
                                <div class="actions">
                                    <button class="btn btn-secondary" onclick="viewPrisonDetails('\${prison.id}')">View Details</button>
                                </div>
                            </div>
                        \`).join('')}
                    </div>
                \`;
                
                document.getElementById('prisons-content').innerHTML = html;
            } catch (error) {
                showError('prisons-content', error.message);
            }
        }

        async function loadAnalytics() {
            try {
                document.getElementById('analytics-content').innerHTML = '<div class="loading">Loading security analytics...</div>';
                
                const [metrics, health, recommendations] = await Promise.all([
                    apiCall('/analytics/metrics'),
                    apiCall('/analytics/security-health'),
                    apiCall('/analytics/recommendations')
                ]);
                
                const html = \`
                    <div class="grid">
                        <div class="card">
                            <h3>📊 Security Metrics</h3>
                            <div class="metric">
                                <span class="metric-label">Police Effectiveness</span>
                                <span class="metric-value">\${metrics.policeEffectiveness.toFixed(1)}%</span>
                            </div>
                            <div class="metric">
                                <span class="metric-label">Guard Readiness</span>
                                <span class="metric-value">\${metrics.guardReadiness.toFixed(1)}%</span>
                            </div>
                            <div class="metric">
                                <span class="metric-label">Prison Security</span>
                                <span class="metric-value">\${metrics.prisonSecurity.toFixed(1)}%</span>
                            </div>
                            <div class="metric">
                                <span class="metric-label">Overall Safety</span>
                                <span class="metric-value">\${metrics.overallSafety.toFixed(1)}%</span>
                            </div>
                            <div class="metric">
                                <span class="metric-label">Budget Utilization</span>
                                <span class="metric-value">\${metrics.budgetUtilization.toFixed(1)}%</span>
                            </div>
                            <div class="metric">
                                <span class="metric-label">Public Trust</span>
                                <span class="metric-value">\${metrics.publicTrust.toFixed(1)}%</span>
                            </div>
                        </div>
                        
                        <div class="card">
                            <h3>🏥 System Health</h3>
                            <div class="metric">
                                <span class="metric-label">Overall Status</span>
                                <span class="metric-value">\${getStatusIndicator(health.status)}</span>
                            </div>
                            <div class="metric">
                                <span class="metric-label">Overall Score</span>
                                <span class="metric-value">\${health.overall.toFixed(1)}%</span>
                            </div>
                            <div class="metric">
                                <span class="metric-label">Law Enforcement</span>
                                <span class="metric-value">\${health.components.lawEnforcement.toFixed(1)}%</span>
                            </div>
                            <div class="metric">
                                <span class="metric-label">National Security</span>
                                <span class="metric-value">\${health.components.nationalSecurity.toFixed(1)}%</span>
                            </div>
                            <div class="metric">
                                <span class="metric-label">Corrections</span>
                                <span class="metric-value">\${health.components.corrections.toFixed(1)}%</span>
                            </div>
                            <div class="metric">
                                <span class="metric-label">Public Safety</span>
                                <span class="metric-value">\${health.components.publicSafety.toFixed(1)}%</span>
                            </div>
                        </div>
                    </div>
                    
                    \${health.concerns.length > 0 ? \`
                        <div class="card">
                            <h3>⚠️ Health Concerns</h3>
                            <ul>
                                \${health.concerns.map(concern => \`<li>\${concern}</li>\`).join('')}
                            </ul>
                        </div>
                    \` : ''}
                    
                    \${recommendations.length > 0 ? \`
                        <div class="card">
                            <h3>💡 Optimization Recommendations</h3>
                            <table class="data-table">
                                <thead>
                                    <tr>
                                        <th>Priority</th>
                                        <th>Type</th>
                                        <th>Description</th>
                                        <th>Impact</th>
                                        <th>Cost</th>
                                        <th>Timeframe</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    \${recommendations.slice(0, 10).map(rec => \`
                                        <tr>
                                            <td><span class="threat-level threat-\${rec.priority.toLowerCase()}">\${rec.priority}</span></td>
                                            <td>\${rec.type}</td>
                                            <td>\${rec.description}</td>
                                            <td>\${rec.impact}</td>
                                            <td>\${formatCurrency(rec.cost)}</td>
                                            <td>\${rec.timeframe}</td>
                                        </tr>
                                    \`).join('')}
                                </tbody>
                            </table>
                        </div>
                    \` : ''}
                \`;
                
                document.getElementById('analytics-content').innerHTML = html;
            } catch (error) {
                showError('analytics-content', error.message);
            }
        }

        async function loadThreatAssessment() {
            try {
                const assessment = await apiCall('/analytics/threat-assessment');
                
                const html = \`
                    <div class="card">
                        <h3>🎯 Threat Assessment</h3>
                        <div class="metric">
                            <span class="metric-label">Crime Level</span>
                            <span class="metric-value">\${getThreatLevelBadge(assessment.crimeLevel)}</span>
                        </div>
                        
                        \${assessment.securityGaps.length > 0 ? \`
                            <h4>Security Gaps</h4>
                            <ul>
                                \${assessment.securityGaps.map(gap => \`<li>\${gap}</li>\`).join('')}
                            </ul>
                        \` : ''}
                        
                        \${assessment.vulnerabilities.length > 0 ? \`
                            <h4>Vulnerabilities</h4>
                            <ul>
                                \${assessment.vulnerabilities.map(vuln => \`<li>\${vuln}</li>\`).join('')}
                            </ul>
                        \` : ''}
                        
                        \${assessment.riskFactors.length > 0 ? \`
                            <h4>Risk Factors</h4>
                            <ul>
                                \${assessment.riskFactors.map(risk => \`<li>\${risk}</li>\`).join('')}
                            </ul>
                        \` : ''}
                        
                        \${assessment.mitigation.length > 0 ? \`
                            <h4>Mitigation Strategies</h4>
                            <ul>
                                \${assessment.mitigation.map(strategy => \`<li>\${strategy}</li>\`).join('')}
                            </ul>
                        \` : ''}
                    </div>
                \`;
                
                const container = document.getElementById('analytics-content');
                container.innerHTML = html + container.innerHTML;
            } catch (error) {
                showError('analytics-content', error.message);
            }
        }

        async function loadSecurityHealth() {
            try {
                const health = await apiCall('/analytics/security-health');
                
                const html = \`
                    <div class="card">
                        <h3>🏥 Detailed Security Health</h3>
                        <div class="metric">
                            <span class="metric-label">System Status</span>
                            <span class="metric-value">\${getStatusIndicator(health.status)}</span>
                        </div>
                        <div class="metric">
                            <span class="metric-label">Overall Health Score</span>
                            <span class="metric-value">\${health.overall.toFixed(1)}%</span>
                        </div>
                        
                        <h4>Component Health</h4>
                        <div class="metric">
                            <span class="metric-label">Law Enforcement</span>
                            <span class="metric-value">\${health.components.lawEnforcement.toFixed(1)}%</span>
                        </div>
                        <div class="metric">
                            <span class="metric-label">National Security</span>
                            <span class="metric-value">\${health.components.nationalSecurity.toFixed(1)}%</span>
                        </div>
                        <div class="metric">
                            <span class="metric-label">Corrections System</span>
                            <span class="metric-value">\${health.components.corrections.toFixed(1)}%</span>
                        </div>
                        <div class="metric">
                            <span class="metric-label">Public Safety</span>
                            <span class="metric-value">\${health.components.publicSafety.toFixed(1)}%</span>
                        </div>
                        
                        \${health.concerns.length > 0 ? \`
                            <h4>Areas of Concern</h4>
                            <ul>
                                \${health.concerns.map(concern => \`<li>\${concern}</li>\`).join('')}
                            </ul>
                        \` : ''}
                    </div>
                \`;
                
                const container = document.getElementById('analytics-content');
                container.innerHTML = html + container.innerHTML;
            } catch (error) {
                showError('analytics-content', error.message);
            }
        }

        async function loadSecurityEvents() {
            try {
                document.getElementById('events-content').innerHTML = '<div class="loading">Loading security events...</div>';
                
                const events = await apiCall('/events?limit=20');
                
                if (events.length === 0) {
                    document.getElementById('events-content').innerHTML = \`
                        <div class="card">
                            <h3>No Security Events Found</h3>
                            <p>Click "Record Event" to log a new security event.</p>
                        </div>
                    \`;
                    return;
                }
                
                const html = \`
                    <div class="card">
                        <h3>🚨 Recent Security Events</h3>
                        <table class="data-table">
                            <thead>
                                <tr>
                                    <th>Timestamp</th>
                                    <th>Type</th>
                                    <th>Severity</th>
                                    <th>Location</th>
                                    <th>Description</th>
                                    <th>Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                \${events.map(event => \`
                                    <tr>
                                        <td>\${formatDate(event.timestamp)}</td>
                                        <td>\${event.type}</td>
                                        <td><span class="threat-level threat-\${event.severity.toLowerCase()}">\${event.severity}</span></td>
                                        <td>\${event.location}</td>
                                        <td>\${event.description}</td>
                                        <td>\${event.resolved ? '✅ Resolved' : '⏳ Ongoing'}</td>
                                    </tr>
                                \`).join('')}
                            </tbody>
                        </table>
                    </div>
                \`;
                
                document.getElementById('events-content').innerHTML = html;
            } catch (error) {
                showError('events-content', error.message);
            }
        }

        // Placeholder functions for detailed views and creation forms
        function viewPoliceDetails(id) {
            alert(\`Viewing details for police force: \${id}\`);
        }

        function viewAgencyDetails(id) {
            alert(\`Viewing details for federal agency: \${id}\`);
        }

        function viewSecurityDetails(id) {
            alert(\`Viewing details for personal security: \${id}\`);
        }

        function viewGuardDetails(id) {
            alert(\`Viewing details for national guard: \${id}\`);
        }

        function viewPrisonDetails(id) {
            alert(\`Viewing details for prison: \${id}\`);
        }

        function createPoliceForce() {
            const name = prompt('Enter police force name:');
            const type = prompt('Enter type (Local/State/Federal/Secret Police/Intelligence):', 'Local');
            const jurisdiction = prompt('Enter jurisdiction (City/County/State/Federal/National):', 'City');
            const budget = prompt('Enter budget:', '5000000');
            
            if (name && type && jurisdiction && budget) {
                apiCall('/police', {
                    method: 'POST',
                    body: JSON.stringify({
                        cityId: type === 'Local' ? 'city_001' : undefined,
                        name,
                        type,
                        jurisdiction,
                        budget: parseInt(budget)
                    })
                }).then(() => {
                    showSuccess('police-content', 'Police force created successfully');
                    loadPoliceForces();
                }).catch(error => {
                    showError('police-content', error.message);
                });
            }
        }

        function createFederalAgency() {
            const name = prompt('Enter agency name:');
            const type = prompt('Enter type (Federal Bureau/Intelligence Service/Secret Police/Border Agency/Financial Crimes/Counter Terrorism/Cyber Security):', 'Federal Bureau');
            const headquarters = prompt('Enter headquarters location:');
            const budget = prompt('Enter budget:', '25000000');
            
            if (name && type && headquarters && budget) {
                apiCall('/federal-agencies', {
                    method: 'POST',
                    body: JSON.stringify({
                        name,
                        type,
                        headquarters,
                        budget: parseInt(budget)
                    })
                }).then(() => {
                    showSuccess('federal-content', 'Federal agency created successfully');
                    loadFederalAgencies();
                }).catch(error => {
                    showError('federal-content', error.message);
                });
            }
        }

        function createPersonalSecurity() {
            const protectedPersonName = prompt('Enter protected person name:');
            const title = prompt('Enter title (Mr. President, Prime Minister, etc.):');
            const position = prompt('Enter position:');
            const threatLevel = prompt('Enter threat level (Minimal/Low/Moderate/High/Critical/Extreme):', 'High');
            const budget = prompt('Enter budget:', '10000000');
            
            if (protectedPersonName && title && position && threatLevel && budget) {
                apiCall('/personal-security', {
                    method: 'POST',
                    body: JSON.stringify({
                        protectedPersonName,
                        title,
                        position,
                        threatLevel,
                        budget: parseInt(budget)
                    })
                }).then(() => {
                    showSuccess('personal-content', 'Personal security detail created successfully');
                    loadPersonalSecurity();
                }).catch(error => {
                    showError('personal-content', error.message);
                });
            }
        }

        function createNationalGuard() {
            const name = prompt('Enter national guard unit name:');
            const budget = prompt('Enter budget:', '20000000');
            
            if (name && budget) {
                apiCall('/national-guard', {
                    method: 'POST',
                    body: JSON.stringify({
                        name,
                        budget: parseInt(budget)
                    })
                }).then(() => {
                    showSuccess('guard-content', 'National guard unit created successfully');
                    loadNationalGuard();
                }).catch(error => {
                    showError('guard-content', error.message);
                });
            }
        }

        function createPrison() {
            const name = prompt('Enter prison name:');
            const type = prompt('Enter type (Civilian/Military/POW/Juvenile/Maximum Security/Medium Security/Minimum Security):', 'Civilian');
            const capacity = prompt('Enter capacity:', '2000');
            const security = prompt('Enter security level (Minimum/Medium/Maximum/Supermax):', 'Maximum');
            const budget = prompt('Enter budget:', '8000000');
            
            if (name && type && capacity && security && budget) {
                apiCall('/prisons', {
                    method: 'POST',
                    body: JSON.stringify({
                        name,
                        type,
                        capacity: parseInt(capacity),
                        security,
                        budget: parseInt(budget)
                    })
                }).then(() => {
                    showSuccess('prisons-content', 'Prison facility created successfully');
                    loadPrisons();
                }).catch(error => {
                    showError('prisons-content', error.message);
                });
            }
        }

        function recordSecurityEvent() {
            const type = prompt('Enter event type (Crime/Riot/Escape/Corruption/Emergency/Investigation/Intelligence Operation/etc.):');
            const location = prompt('Enter location:');
            const severity = prompt('Enter severity (Low/Medium/High/Critical):', 'Medium');
            const description = prompt('Enter description:');
            
            if (type && location && severity && description) {
                apiCall('/events', {
                    method: 'POST',
                    body: JSON.stringify({
                        type,
                        location,
                        severity,
                        description
                    })
                }).then(() => {
                    showSuccess('events-content', 'Security event recorded successfully');
                    loadSecurityEvents();
                }).catch(error => {
                    showError('events-content', error.message);
                });
            }
        }

        // Load initial data
        document.addEventListener('DOMContentLoaded', function() {
            loadSystemOverview();
        });
    </script>
</body>
</html>
  `;

  res.send(html);
});

export default router;
