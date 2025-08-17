#!/usr/bin/env node
/**
 * Intelligence System Demo Server
 * Task 46: Information Classification & Espionage System
 * 
 * Comprehensive demo showcasing:
 * - Information Classification & Security Levels
 * - Corporate Espionage & Spy Networks
 * - Intelligence Market & Information Trading
 * - Counter-Intelligence Operations
 * - AI-Enhanced Intelligence Analysis
 */

import express from 'express';
import cors from 'cors';
import { initDb } from '../server/storage/db.js';
import intelligenceRouter from '../server/routes/intelligence.js';

const app = express();
const PORT = process.env.PORT || 4030;

app.use(cors());
app.use(express.json());

// Initialize database
let dbInitialized = false;
const initializeDb = async () => {
  if (!dbInitialized) {
    try {
      await initDb();
      dbInitialized = true;
      console.log('✅ Database initialized successfully');
    } catch (error) {
      console.log('⚠️ Database initialization failed, using in-memory mode:', error.message);
    }
  }
};

// Mount intelligence routes
app.use('/api/intelligence', intelligenceRouter);

// Health check
app.get('/health', (req, res) => {
  res.json({ 
    status: 'healthy', 
    timestamp: new Date().toISOString(),
    systems: {
      database: dbInitialized,
      informationClassification: true,
      espionageOperations: true,
      intelligenceMarket: true,
      counterIntelligence: true
    }
  });
});

// Comprehensive Intelligence System Demo HUD
app.get('/demo/intelligence', (req, res) => {
  res.send(`
<!DOCTYPE html>
<html>
<head>
    <title>Intelligence System Demo - Task 46</title>
    <style>
        body { 
            font-family: 'Segoe UI', system-ui, sans-serif; 
            margin: 0; 
            padding: 20px; 
            background: linear-gradient(135deg, #0d1421, #1a1a2e); 
            color: #fff; 
            min-height: 100vh;
        }
        .header { text-align: center; margin-bottom: 30px; }
        .header h1 { color: #ff6b6b; margin: 0; font-size: 2.5em; text-shadow: 0 0 10px rgba(255,107,107,0.3); }
        .header p { color: #b0bec5; margin: 10px 0; font-size: 1.1em; }
        
        .dashboard { display: grid; grid-template-columns: repeat(auto-fit, minmax(450px, 1fr)); gap: 20px; }
        .panel { 
            background: rgba(255,255,255,0.05); 
            backdrop-filter: blur(10px);
            padding: 25px; 
            border-radius: 15px; 
            border: 1px solid rgba(255,107,107,0.2);
            box-shadow: 0 8px 32px rgba(0,0,0,0.3);
        }
        .panel h2 { color: #ff6b6b; margin-top: 0; font-size: 1.4em; }
        .panel h3 { color: #ffa726; margin: 20px 0 10px 0; font-size: 1.1em; }
        
        button { 
            background: linear-gradient(45deg, #ff6b6b, #ff5722); 
            color: white; 
            border: none; 
            padding: 12px 24px; 
            margin: 8px 4px; 
            border-radius: 25px; 
            cursor: pointer; 
            font-weight: 600;
            transition: all 0.3s ease;
            box-shadow: 0 4px 15px rgba(255, 107, 107, 0.3);
        }
        button:hover { 
            transform: translateY(-2px);
            box-shadow: 0 6px 20px rgba(255, 107, 107, 0.4);
        }
        button.secondary {
            background: linear-gradient(45deg, #ffa726, #ff9800);
            box-shadow: 0 4px 15px rgba(255, 167, 38, 0.3);
        }
        button.secondary:hover {
            box-shadow: 0 6px 20px rgba(255, 167, 38, 0.4);
        }
        button.danger {
            background: linear-gradient(45deg, #f44336, #d32f2f);
            box-shadow: 0 4px 15px rgba(244, 67, 54, 0.3);
        }
        
        .output { 
            background: rgba(0,0,0,0.4); 
            padding: 15px; 
            margin: 15px 0; 
            border-radius: 8px; 
            font-family: 'Consolas', monospace; 
            white-space: pre-wrap; 
            font-size: 0.9em;
            border-left: 4px solid #ff6b6b;
            max-height: 300px;
            overflow-y: auto;
        }
        
        .metric-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: 15px; margin: 15px 0; }
        .metric-card { 
            background: rgba(255,255,255,0.05); 
            padding: 15px; 
            border-radius: 8px; 
            text-align: center;
            border: 1px solid rgba(255,107,107,0.2);
        }
        .metric-value { font-size: 1.8em; font-weight: bold; color: #ff6b6b; }
        .metric-label { font-size: 0.9em; color: #b0bec5; margin-top: 5px; }
        
        .status { color: #4caf50; font-weight: bold; }
        .warning { color: #ff9800; font-weight: bold; }
        .error { color: #f44336; font-weight: bold; }
        .classified { color: #ff6b6b; font-weight: bold; }
        
        input, select, textarea { 
            background: rgba(255,255,255,0.1); 
            border: 1px solid rgba(255,107,107,0.3); 
            color: white; 
            padding: 8px 12px; 
            border-radius: 6px; 
            margin: 5px;
            width: calc(100% - 30px);
        }
        input::placeholder, textarea::placeholder { color: rgba(255,255,255,0.6); }
        
        .security-level { 
            display: inline-block; 
            padding: 4px 12px; 
            border-radius: 12px; 
            font-size: 0.8em; 
            font-weight: bold;
            margin: 2px;
        }
        .security-public { background: #4caf50; color: white; }
        .security-proprietary { background: #ff9800; color: white; }
        .security-classified { background: #f44336; color: white; }
        .security-top-secret { background: #9c27b0; color: white; }
        
        .agent-status { 
            display: inline-block; 
            padding: 2px 8px; 
            border-radius: 8px; 
            font-size: 0.7em; 
            font-weight: bold;
            margin-left: 8px;
        }
        .agent-active { background: #4caf50; color: white; }
        .agent-deep-cover { background: #2196f3; color: white; }
        .agent-burned { background: #f44336; color: white; }
        .agent-retired { background: #9e9e9e; color: white; }
        
        .operation-status { 
            display: inline-block; 
            padding: 2px 8px; 
            border-radius: 8px; 
            font-size: 0.7em; 
            font-weight: bold;
            margin-left: 8px;
        }
        .operation-planning { background: #ff9800; color: white; }
        .operation-active { background: #2196f3; color: white; }
        .operation-completed { background: #4caf50; color: white; }
        .operation-compromised { background: #f44336; color: white; }
        
        .tabs { display: flex; margin-bottom: 20px; }
        .tab { 
            padding: 10px 20px; 
            background: rgba(255,255,255,0.1); 
            border: none; 
            color: white; 
            cursor: pointer; 
            border-radius: 8px 8px 0 0;
            margin-right: 5px;
        }
        .tab.active { background: rgba(255,107,107,0.3); }
        .tab-content { display: none; }
        .tab-content.active { display: block; }
        
        .form-row { display: flex; gap: 10px; align-items: center; margin: 10px 0; }
        .form-row label { min-width: 120px; }
        .form-row input, .form-row select { flex: 1; width: auto; }
        
        .intel-card {
            background: rgba(255,255,255,0.05);
            border: 1px solid rgba(255,107,107,0.2);
            border-radius: 8px;
            padding: 15px;
            margin: 10px 0;
        }
        .intel-card h4 { margin: 0 0 10px 0; color: #ff6b6b; }
        .intel-card .meta { font-size: 0.8em; color: #b0bec5; margin-top: 10px; }
        
        .price-tag {
            background: linear-gradient(45deg, #4caf50, #66bb6a);
            color: white;
            padding: 4px 12px;
            border-radius: 12px;
            font-weight: bold;
            font-size: 0.9em;
        }
    </style>
</head>
<body>
    <div class="header">
        <h1>🕵️ Intelligence System Dashboard</h1>
        <p>Task 46: Information Classification & Espionage Operations</p>
        <div id="systemStatus" class="status">Loading system status...</div>
    </div>

    <div class="dashboard">
        <!-- System Overview -->
        <div class="panel">
            <h2>📊 System Overview</h2>
            <button onclick="checkHealth()">Refresh Status</button>
            <button onclick="loadEnums()" class="secondary">Load System Enums</button>
            <div id="overviewOutput" class="output">Click "Refresh Status" to check system health...</div>
        </div>

        <!-- Information Classification -->
        <div class="panel">
            <h2>🔒 Information Classification</h2>
            <div class="tabs">
                <button class="tab active" onclick="switchTab('classify')">Classify Info</button>
                <button class="tab" onclick="switchTab('access')">Access Control</button>
                <button class="tab" onclick="switchTab('search')">Search Assets</button>
            </div>
            
            <div id="classify" class="tab-content active">
                <h3>Classify New Information</h3>
                <input type="text" id="infoTitle" placeholder="Information title">
                <textarea id="infoContent" placeholder="Information content" rows="3"></textarea>
                <div class="form-row">
                    <label>Type:</label>
                    <select id="infoType">
                        <option value="RESEARCH_DATA">Research Data</option>
                        <option value="TECHNOLOGY_SPECS">Technology Specs</option>
                        <option value="MARKET_INTELLIGENCE">Market Intelligence</option>
                        <option value="MILITARY_PLANS">Military Plans</option>
                        <option value="TRADE_SECRETS">Trade Secrets</option>
                    </select>
                </div>
                <input type="text" id="sourceOrg" placeholder="Source organization">
                <button onclick="classifyInformation()">Classify Information</button>
            </div>
            
            <div id="access" class="tab-content">
                <h3>Access Control</h3>
                <input type="text" id="requesterId" placeholder="Requester ID">
                <input type="text" id="requesterOrg" placeholder="Requester organization">
                <input type="text" id="assetId" placeholder="Asset ID">
                <textarea id="justification" placeholder="Access justification" rows="2"></textarea>
                <button onclick="requestAccess()">Request Access</button>
                <button onclick="viewAssets()" class="secondary">View Available Assets</button>
            </div>
            
            <div id="search" class="tab-content">
                <h3>Search Information Assets</h3>
                <input type="text" id="searchQuery" placeholder="Search query">
                <div class="form-row">
                    <label>Access Level:</label>
                    <select id="accessLevel">
                        <option value="1">Level 1 (Public)</option>
                        <option value="3">Level 3 (Proprietary)</option>
                        <option value="6">Level 6 (Classified)</option>
                        <option value="9">Level 9 (Top Secret)</option>
                    </select>
                </div>
                <button onclick="searchAssets()">Search Assets</button>
            </div>
            
            <div id="classificationOutput" class="output"></div>
        </div>

        <!-- Espionage Operations -->
        <div class="panel">
            <h2>🕵️ Espionage Operations</h2>
            <div class="tabs">
                <button class="tab active" onclick="switchTab('agents')">Spy Agents</button>
                <button class="tab" onclick="switchTab('operations')">Operations</button>
                <button class="tab" onclick="switchTab('counter-intel')">Counter-Intel</button>
            </div>
            
            <div id="agents" class="tab-content active">
                <h3>Recruit Spy Agent</h3>
                <input type="text" id="agentCodename" placeholder="Agent codename">
                <div class="form-row">
                    <label>Type:</label>
                    <select id="agentType">
                        <option value="CORPORATE_INFILTRATOR">Corporate Infiltrator</option>
                        <option value="RESEARCH_SCIENTIST">Research Scientist</option>
                        <option value="CYBER_OPERATIVE">Cyber Operative</option>
                        <option value="DIPLOMATIC_ASSET">Diplomatic Asset</option>
                        <option value="DOUBLE_AGENT">Double Agent</option>
                    </select>
                </div>
                <input type="text" id="agentOrg" placeholder="Operating organization">
                <input type="text" id="targetOrg" placeholder="Target organization">
                <input type="text" id="coverIdentity" placeholder="Cover identity">
                <input type="text" id="handler" placeholder="Handler name">
                <button onclick="recruitAgent()">Recruit Agent</button>
                <button onclick="viewAgents()" class="secondary">View All Agents</button>
            </div>
            
            <div id="operations" class="tab-content">
                <h3>Plan Operation</h3>
                <input type="text" id="opCodename" placeholder="Operation codename">
                <div class="form-row">
                    <label>Type:</label>
                    <select id="opType">
                        <option value="INTELLIGENCE_GATHERING">Intelligence Gathering</option>
                        <option value="TECHNOLOGY_THEFT">Technology Theft</option>
                        <option value="SABOTAGE">Sabotage</option>
                        <option value="SURVEILLANCE">Surveillance</option>
                        <option value="COUNTER_INTELLIGENCE">Counter Intelligence</option>
                    </select>
                </div>
                <textarea id="opDescription" placeholder="Operation description" rows="2"></textarea>
                <input type="text" id="opTargetOrg" placeholder="Target organization">
                <input type="text" id="opOperatingOrg" placeholder="Operating organization">
                <input type="text" id="opHandler" placeholder="Operation handler">
                <input type="text" id="opApprover" placeholder="Approved by">
                <button onclick="planOperation()">Plan Operation</button>
                <button onclick="viewOperations()" class="secondary">View Operations</button>
            </div>
            
            <div id="counter-intel" class="tab-content">
                <h3>Counter-Intelligence</h3>
                <button onclick="viewCounterIntelAlerts()">View CI Alerts</button>
                <button onclick="generateThreatAssessment()" class="secondary">Threat Assessment</button>
            </div>
            
            <div id="espionageOutput" class="output"></div>
        </div>

        <!-- Intelligence Market -->
        <div class="panel">
            <h2>💰 Intelligence Market</h2>
            <div class="tabs">
                <button class="tab active" onclick="switchTab('market-register')">Register</button>
                <button class="tab" onclick="switchTab('market-listings')">Listings</button>
                <button class="tab" onclick="switchTab('market-trade')">Trading</button>
                <button class="tab" onclick="switchTab('market-analytics')">Analytics</button>
            </div>
            
            <div id="market-register" class="tab-content active">
                <h3>Register Market Participant</h3>
                <input type="text" id="participantName" placeholder="Participant name">
                <input type="text" id="participantOrg" placeholder="Organization">
                <div class="form-row">
                    <label>Role:</label>
                    <select id="participantRole">
                        <option value="BUYER">Buyer</option>
                        <option value="SELLER">Seller</option>
                        <option value="BROKER">Broker</option>
                        <option value="ANALYST">Analyst</option>
                    </select>
                </div>
                <div class="form-row">
                    <label>Market Tier:</label>
                    <select id="marketTier">
                        <option value="LEGITIMATE">Legitimate</option>
                        <option value="GRAY_MARKET">Gray Market</option>
                        <option value="BLACK_MARKET">Black Market</option>
                        <option value="GOVERNMENT">Government</option>
                    </select>
                </div>
                <button onclick="registerParticipant()">Register Participant</button>
            </div>
            
            <div id="market-listings" class="tab-content">
                <h3>Create Intelligence Listing</h3>
                <input type="text" id="listingAssetId" placeholder="Asset ID">
                <input type="text" id="listingSellerId" placeholder="Seller ID">
                <input type="text" id="listingTitle" placeholder="Listing title">
                <textarea id="listingDescription" placeholder="Description" rows="2"></textarea>
                <div class="form-row">
                    <label>Category:</label>
                    <select id="listingCategory">
                        <option value="RESEARCH_DATA">Research Data</option>
                        <option value="TECHNOLOGY_SPECS">Technology Specs</option>
                        <option value="MARKET_INTELLIGENCE">Market Intelligence</option>
                        <option value="TRADE_SECRETS">Trade Secrets</option>
                    </select>
                </div>
                <div class="form-row">
                    <label>Security Level:</label>
                    <select id="listingSecurityLevel">
                        <option value="PUBLIC">Public</option>
                        <option value="PROPRIETARY">Proprietary</option>
                        <option value="CLASSIFIED">Classified</option>
                        <option value="TOP_SECRET">Top Secret</option>
                    </select>
                </div>
                <input type="number" id="listingPrice" placeholder="Base price">
                <button onclick="createListing()">Create Listing</button>
                <button onclick="searchListings()" class="secondary">Search Market</button>
            </div>
            
            <div id="market-trade" class="tab-content">
                <h3>Market Search & Trading</h3>
                <input type="text" id="marketSearchQuery" placeholder="Search intelligence market">
                <div class="form-row">
                    <label>Price Range:</label>
                    <input type="number" id="minPrice" placeholder="Min price" style="width: 100px;">
                    <input type="number" id="maxPrice" placeholder="Max price" style="width: 100px;">
                </div>
                <button onclick="searchMarketListings()">Search Market</button>
                <button onclick="calculatePricing()" class="secondary">Calculate Pricing</button>
            </div>
            
            <div id="market-analytics" class="tab-content">
                <h3>Market Analytics</h3>
                <button onclick="loadMarketAnalytics()">Load Analytics</button>
                <div id="marketMetrics" class="metric-grid" style="display: none;">
                    <div class="metric-card">
                        <div id="totalListingsValue" class="metric-value">-</div>
                        <div class="metric-label">Total Listings</div>
                    </div>
                    <div class="metric-card">
                        <div id="totalVolumeValue" class="metric-value">-</div>
                        <div class="metric-label">Total Volume ($)</div>
                    </div>
                    <div class="metric-card">
                        <div id="avgTransactionValue" class="metric-value">-</div>
                        <div class="metric-label">Avg Transaction ($)</div>
                    </div>
                    <div class="metric-card">
                        <div id="activeListingsValue" class="metric-value">-</div>
                        <div class="metric-label">Active Listings</div>
                    </div>
                </div>
            </div>
            
            <div id="marketOutput" class="output"></div>
        </div>
    </div>

    <script>
        let currentAssets = [];
        let currentAgents = [];
        let currentOperations = [];

        // Tab switching
        function switchTab(tabName) {
            // Hide all tab contents
            document.querySelectorAll('.tab-content').forEach(content => {
                content.classList.remove('active');
            });
            document.querySelectorAll('.tab').forEach(tab => {
                tab.classList.remove('active');
            });
            
            // Show selected tab
            const tabContent = document.getElementById(tabName);
            if (tabContent) {
                tabContent.classList.add('active');
                event.target.classList.add('active');
            }
        }

        async function checkHealth() {
            try {
                const response = await fetch('/health');
                const data = await response.json();
                document.getElementById('systemStatus').innerHTML = 
                    'Status: ' + data.status + ' | Database: ' + (data.systems.database ? '✅' : '❌') + ' | ' +
                    'Classification: ' + (data.systems.informationClassification ? '✅' : '❌') + ' | ' +
                    'Espionage: ' + (data.systems.espionageOperations ? '✅' : '❌') + ' | ' +
                    'Market: ' + (data.systems.intelligenceMarket ? '✅' : '❌');
            } catch (error) {
                document.getElementById('systemStatus').innerHTML = 'Error: ' + error.message;
                document.getElementById('systemStatus').className = 'error';
            }
        }

        async function loadEnums() {
            try {
                const response = await fetch('/api/intelligence/enums');
                const data = await response.json();
                document.getElementById('overviewOutput').textContent = JSON.stringify(data.data, null, 2);
            } catch (error) {
                document.getElementById('overviewOutput').textContent = 'Error: ' + error.message;
            }
        }

        // Information Classification Functions
        async function classifyInformation() {
            try {
                const title = document.getElementById('infoTitle').value;
                const content = document.getElementById('infoContent').value;
                const type = document.getElementById('infoType').value;
                const sourceOrganization = document.getElementById('sourceOrg').value;

                if (!title || !content || !sourceOrganization) {
                    alert('Please fill in all required fields');
                    return;
                }

                const response = await fetch('/api/intelligence/classify', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ title, content, type, sourceOrganization })
                });
                const data = await response.json();
                
                if (data.success) {
                    currentAssets.push(data.data);
                    document.getElementById('classificationOutput').innerHTML = 
                        '<strong>✅ Information Classified Successfully</strong>\n' +
                        'Asset ID: ' + data.data.id + '\n' +
                        'Security Level: ' + data.data.securityLevel + '\n' +
                        'Strategic Value: ' + data.data.strategicValue + '/100\n' +
                        'Access Level Required: ' + data.data.accessLevel + '\n' +
                        'Tags: ' + data.data.tags.join(', ') + '\n\n' +
                        JSON.stringify(data.data, null, 2);
                } else {
                    document.getElementById('classificationOutput').textContent = 'Error: ' + data.error;
                }
            } catch (error) {
                document.getElementById('classificationOutput').textContent = 'Error: ' + error.message;
            }
        }

        async function requestAccess() {
            try {
                const requesterId = document.getElementById('requesterId').value;
                const requesterOrganization = document.getElementById('requesterOrg').value;
                const assetId = document.getElementById('assetId').value;
                const justification = document.getElementById('justification').value;

                if (!requesterId || !requesterOrganization || !assetId || !justification) {
                    alert('Please fill in all required fields');
                    return;
                }

                const response = await fetch('/api/intelligence/access-request', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ requesterId, requesterOrganization, assetId, justification })
                });
                const data = await response.json();
                
                document.getElementById('classificationOutput').innerHTML = 
                    data.success ? 
                    `<strong>✅ Access Request Created</strong>\n` + JSON.stringify(data.data, null, 2) :
                    'Error: ' + data.error;
            } catch (error) {
                document.getElementById('classificationOutput').textContent = 'Error: ' + error.message;
            }
        }

        async function viewAssets() {
            try {
                const accessLevel = document.getElementById('accessLevel').value;
                const response = await fetch(`/api/intelligence/assets?accessLevel=${accessLevel}`);
                const data = await response.json();
                
                if (data.success) {
                    let output = `<strong>📋 Available Assets (Access Level ${accessLevel})</strong>\n\n`;
                    data.data.forEach(asset => {
                        output += `🔹 ${asset.title} (${asset.id})\n`;
                        output += `   Security: ${asset.securityLevel} | Value: ${asset.strategicValue}/100\n`;
                        output += `   Type: ${asset.type} | Source: ${asset.sourceOrganization}\n\n`;
                    });
                    document.getElementById('classificationOutput').textContent = output;
                } else {
                    document.getElementById('classificationOutput').textContent = 'Error: ' + data.error;
                }
            } catch (error) {
                document.getElementById('classificationOutput').textContent = 'Error: ' + error.message;
            }
        }

        async function searchAssets() {
            try {
                const query = document.getElementById('searchQuery').value;
                const accessLevel = document.getElementById('accessLevel').value;
                const response = await fetch(`/api/intelligence/assets?search=\${encodeURIComponent(query)}&accessLevel=\${accessLevel}`);
                const data = await response.json();
                
                if (data.success) {
                    let output = `<strong>🔍 Search Results: "\${query}"</strong>\n\n`;
                    data.data.forEach(asset => {
                        output += `🔹 \${asset.title}\n`;
                        output += `   ID: \${asset.id} | Security: \${asset.securityLevel}\n`;
                        output += `   Freshness: \${(asset.freshness * 100).toFixed(1)}% | Reliability: \${(asset.reliability * 100).toFixed(1)}%\n\n`;
                    });
                    document.getElementById('classificationOutput').textContent = output;
                } else {
                    document.getElementById('classificationOutput').textContent = 'Error: ' + data.error;
                }
            } catch (error) {
                document.getElementById('classificationOutput').textContent = 'Error: ' + error.message;
            }
        }

        // Espionage Functions
        async function recruitAgent() {
            try {
                const codename = document.getElementById('agentCodename').value;
                const type = document.getElementById('agentType').value;
                const organization = document.getElementById('agentOrg').value;
                const targetOrganization = document.getElementById('targetOrg').value;
                const coverIdentity = document.getElementById('coverIdentity').value;
                const handler = document.getElementById('handler').value;

                if (!codename || !organization || !targetOrganization || !coverIdentity || !handler) {
                    alert('Please fill in all required fields');
                    return;
                }

                const response = await fetch('/api/intelligence/agents/recruit', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ codename, type, organization, targetOrganization, coverIdentity, handler })
                });
                const data = await response.json();
                
                if (data.success) {
                    currentAgents.push(data.data);
                    document.getElementById('espionageOutput').innerHTML = 
                        `<strong>✅ Agent Recruited Successfully</strong>\n` +
                        `Codename: \${data.data.codename} (\${data.data.id})\n` +
                        `Type: \${data.data.type}\n` +
                        `Skill Level: \${data.data.skillLevel}/10\n` +
                        `Trust: \${(data.data.trustworthiness * 100).toFixed(1)}%\n` +
                        `Monthly Cost: $\${data.data.cost.toLocaleString()}\n\n` +
                        JSON.stringify(data.data, null, 2);
                } else {
                    document.getElementById('espionageOutput').textContent = 'Error: ' + data.error;
                }
            } catch (error) {
                document.getElementById('espionageOutput').textContent = 'Error: ' + error.message;
            }
        }

        async function viewAgents() {
            try {
                const response = await fetch('/api/intelligence/agents');
                const data = await response.json();
                
                if (data.success) {
                    let output = `<strong>👥 Spy Agents (\${data.total})</strong>\n\n`;
                    data.data.forEach(agent => {
                        output += `🕵️ \${agent.codename} (\${agent.type})\n`;
                        output += `   Status: \${agent.status} | Skill: \${agent.skillLevel}/10\n`;
                        output += `   Target: \${agent.targetOrganization}\n`;
                        output += `   Operations: ✅\${agent.successfulOperations} ❌\${agent.failedOperations}\n\n`;
                    });
                    document.getElementById('espionageOutput').textContent = output;
                } else {
                    document.getElementById('espionageOutput').textContent = 'Error: ' + data.error;
                }
            } catch (error) {
                document.getElementById('espionageOutput').textContent = 'Error: ' + error.message;
            }
        }

        async function planOperation() {
            try {
                const codename = document.getElementById('opCodename').value;
                const type = document.getElementById('opType').value;
                const description = document.getElementById('opDescription').value;
                const targetOrganization = document.getElementById('opTargetOrg').value;
                const operatingOrganization = document.getElementById('opOperatingOrg').value;
                const handler = document.getElementById('opHandler').value;
                const approvedBy = document.getElementById('opApprover').value;

                if (!codename || !description || !targetOrganization || !operatingOrganization || !handler || !approvedBy) {
                    alert('Please fill in all required fields');
                    return;
                }

                const objectives = ['Gather intelligence', 'Maintain operational security', 'Complete mission objectives'];

                const response = await fetch('/api/intelligence/operations/plan', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ 
                        codename, type, description, targetOrganization, 
                        operatingOrganization, objectives, handler, approvedBy 
                    })
                });
                const data = await response.json();
                
                if (data.success) {
                    currentOperations.push(data.data);
                    document.getElementById('espionageOutput').innerHTML = 
                        `<strong>✅ Operation Planned Successfully</strong>\n` +
                        `Codename: \${data.data.codename} (\${data.data.id})\n` +
                        `Type: \${data.data.type}\n` +
                        `Success Probability: \${(data.data.successProbability * 100).toFixed(1)}%\n` +
                        `Risk Level: \${(data.data.riskLevel * 100).toFixed(1)}%\n` +
                        `Budget: $\${data.data.budget.toLocaleString()}\n\n` +
                        JSON.stringify(data.data, null, 2);
                } else {
                    document.getElementById('espionageOutput').textContent = 'Error: ' + data.error;
                }
            } catch (error) {
                document.getElementById('espionageOutput').textContent = 'Error: ' + error.message;
            }
        }

        async function viewOperations() {
            try {
                const response = await fetch('/api/intelligence/operations');
                const data = await response.json();
                
                if (data.success) {
                    let output = `<strong>🎯 Operations (\${data.total})</strong>\n\n`;
                    data.data.forEach(op => {
                        output += `🎯 \${op.codename} (\${op.type})\n`;
                        output += `   Status: \${op.status} | Priority: \${op.priority}\n`;
                        output += `   Target: \${op.targetOrganization}\n`;
                        output += `   Success Rate: \${(op.successProbability * 100).toFixed(1)}%\n\n`;
                    });
                    document.getElementById('espionageOutput').textContent = output;
                } else {
                    document.getElementById('espionageOutput').textContent = 'Error: ' + data.error;
                }
            } catch (error) {
                document.getElementById('espionageOutput').textContent = 'Error: ' + error.message;
            }
        }

        async function viewCounterIntelAlerts() {
            try {
                const response = await fetch('/api/intelligence/counter-intelligence/alerts');
                const data = await response.json();
                
                if (data.success) {
                    let output = `<strong>🚨 Counter-Intelligence Alerts (\${data.total})</strong>\n\n`;
                    data.data.forEach(alert => {
                        output += `🚨 \${alert.type} - \${alert.severity.toUpperCase()}\n`;
                        output += `   \${alert.description}\n`;
                        output += `   Status: \${alert.investigationStatus}\n`;
                        output += `   Detected: \${new Date(alert.detectedAt).toLocaleString()}\n\n`;
                    });
                    document.getElementById('espionageOutput').textContent = output;
                } else {
                    document.getElementById('espionageOutput').textContent = 'Error: ' + data.error;
                }
            } catch (error) {
                document.getElementById('espionageOutput').textContent = 'Error: ' + error.message;
            }
        }

        // Market Functions
        async function registerParticipant() {
            try {
                const name = document.getElementById('participantName').value;
                const organization = document.getElementById('participantOrg').value;
                const role = document.getElementById('participantRole').value;
                const marketTier = document.getElementById('marketTier').value;
                const specializations = ['RESEARCH_DATA', 'TECHNOLOGY_SPECS'];

                if (!name || !organization) {
                    alert('Please fill in all required fields');
                    return;
                }

                const response = await fetch('/api/intelligence/market/participants/register', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ name, organization, role, marketTier, specializations })
                });
                const data = await response.json();
                
                if (data.success) {
                    document.getElementById('marketOutput').innerHTML = 
                        `<strong>✅ Market Participant Registered</strong>\n` +
                        `ID: \${data.data.id}\n` +
                        `Name: \${data.data.name}\n` +
                        `Role: \${data.data.role}\n` +
                        `Market Tier: \${data.data.marketTier}\n` +
                        `Reputation: \${data.data.reputation}/100\n` +
                        `Access Level: \${data.data.accessLevel}\n\n` +
                        JSON.stringify(data.data, null, 2);
                } else {
                    document.getElementById('marketOutput').textContent = 'Error: ' + data.error;
                }
            } catch (error) {
                document.getElementById('marketOutput').textContent = 'Error: ' + error.message;
            }
        }

        async function createListing() {
            try {
                const assetId = document.getElementById('listingAssetId').value;
                const sellerId = document.getElementById('listingSellerId').value;
                const title = document.getElementById('listingTitle').value;
                const description = document.getElementById('listingDescription').value;
                const category = document.getElementById('listingCategory').value;
                const securityLevel = document.getElementById('listingSecurityLevel').value;
                const basePrice = document.getElementById('listingPrice').value;

                if (!assetId || !sellerId || !title || !description || !basePrice) {
                    alert('Please fill in all required fields');
                    return;
                }

                const response = await fetch('/api/intelligence/market/listings', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ 
                        assetId, sellerId, title, description, category, 
                        securityLevel, listingType: 'PURCHASE', basePrice: Number(basePrice)
                    })
                });
                const data = await response.json();
                
                if (data.success) {
                    document.getElementById('marketOutput').innerHTML = 
                        `<strong>✅ Intelligence Listing Created</strong>\n` +
                        `Listing ID: \${data.data.id}\n` +
                        `Title: \${data.data.title}\n` +
                        `Price: $\${data.data.basePrice.toLocaleString()}\n` +
                        `Strategic Value: \${data.data.strategicValue}/100\n` +
                        `Market Tier: \${data.data.marketTier}\n\n` +
                        JSON.stringify(data.data, null, 2);
                } else {
                    document.getElementById('marketOutput').textContent = 'Error: ' + data.error;
                }
            } catch (error) {
                document.getElementById('marketOutput').textContent = 'Error: ' + error.message;
            }
        }

        async function searchMarketListings() {
            try {
                const query = document.getElementById('marketSearchQuery').value;
                const minPrice = document.getElementById('minPrice').value;
                const maxPrice = document.getElementById('maxPrice').value;

                let url = '/api/intelligence/market/listings/search?query=' + encodeURIComponent(query);
                if (minPrice) url += '&minPrice=' + minPrice;
                if (maxPrice) url += '&maxPrice=' + maxPrice;

                const response = await fetch(url);
                const data = await response.json();
                
                if (data.success) {
                    let output = `<strong>🛒 Market Listings (\${data.total})</strong>\n\n`;
                    data.data.forEach(listing => {
                        output += `💰 \${listing.title}\n`;
                        output += `   Price: $\${listing.currentPrice.toLocaleString()} | Value: \${listing.strategicValue}/100\n`;
                        output += `   Security: \${listing.securityLevel} | Tier: \${listing.marketTier}\n`;
                        output += `   Freshness: \${(listing.freshness * 100).toFixed(1)}% | Views: \${listing.viewCount}\n\n`;
                    });
                    document.getElementById('marketOutput').textContent = output;
                } else {
                    document.getElementById('marketOutput').textContent = 'Error: ' + data.error;
                }
            } catch (error) {
                document.getElementById('marketOutput').textContent = 'Error: ' + error.message;
            }
        }

        async function calculatePricing() {
            try {
                const response = await fetch('/api/intelligence/market/pricing/calculate', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        category: 'TECHNOLOGY_SPECS',
                        securityLevel: 'CLASSIFIED',
                        freshness: 0.9,
                        reliability: 0.8,
                        strategicValue: 75
                    })
                });
                const data = await response.json();
                
                if (data.success) {
                    document.getElementById('marketOutput').innerHTML = 
                        `<strong>💲 Dynamic Pricing Calculation</strong>\n` +
                        `Category: \${data.data.category}\n` +
                        `Security Level: \${data.data.securityLevel}\n` +
                        `Freshness: \${(data.data.freshness * 100).toFixed(1)}%\n` +
                        `Reliability: \${(data.data.reliability * 100).toFixed(1)}%\n` +
                        `Strategic Value: \${data.data.strategicValue}/100\n` +
                        `\n<strong>Suggested Price: $\${data.data.suggestedPrice.toLocaleString()}</strong>`;
                } else {
                    document.getElementById('marketOutput').textContent = 'Error: ' + data.error;
                }
            } catch (error) {
                document.getElementById('marketOutput').textContent = 'Error: ' + error.message;
            }
        }

        async function loadMarketAnalytics() {
            try {
                const response = await fetch('/api/intelligence/market/analytics');
                const data = await response.json();
                
                if (data.success) {
                    const analytics = data.data;
                    
                    document.getElementById('marketMetrics').style.display = 'grid';
                    document.getElementById('totalListingsValue').textContent = analytics.totalListings;
                    document.getElementById('totalVolumeValue').textContent = '$' + analytics.totalVolume.toLocaleString();
                    document.getElementById('avgTransactionValue').textContent = '$' + Math.round(analytics.averageTransactionValue).toLocaleString();
                    document.getElementById('activeListingsValue').textContent = analytics.activeListings;
                    
                    let output = `<strong>📈 Market Analytics</strong>\n\n`;
                    output += `Total Transactions: \${analytics.totalTransactions}\n`;
                    output += `Market Trends: \${analytics.marketTrends.priceDirection} prices, \${analytics.marketTrends.volumeDirection} volume\n`;
                    output += `Hot Categories: \${analytics.marketTrends.hotCategories.join(', ')}\n\n`;
                    
                    output += `<strong>Top Categories by Volume:</strong>\n`;
                    analytics.topCategories.forEach(cat => {
                        output += `• \${cat.type}: $\${cat.volume.toLocaleString()} (avg: $\${Math.round(cat.averagePrice).toLocaleString()})\n`;
                    });
                    
                    document.getElementById('marketOutput').textContent = output;
                } else {
                    document.getElementById('marketOutput').textContent = 'Error: ' + data.error;
                }
            } catch (error) {
                document.getElementById('marketOutput').textContent = 'Error: ' + error.message;
            }
        }

        // Auto-load status on page load
        checkHealth();
    </script>
</body>
</html>
  `);
});

// Start server
app.listen(PORT, '0.0.0.0', async () => {
  console.log(`🕵️ Intelligence System Demo Server running on http://localhost:${PORT}`);
  console.log(`🔒 Intelligence Dashboard: http://localhost:${PORT}/demo/intelligence`);
  
  await initializeDb();
  
  console.log('\n✅ TASK 46 SYSTEMS READY:');
  console.log('   🔒 Information Classification & Security Levels');
  console.log('   🕵️ Corporate Espionage & Spy Networks');
  console.log('   💰 Intelligence Market & Information Trading');
  console.log('   🚨 Counter-Intelligence Operations');
  console.log('   🤖 AI-Enhanced Intelligence Analysis');
  console.log('\n🎯 Visit the dashboard to explore the intelligence system!');
});
