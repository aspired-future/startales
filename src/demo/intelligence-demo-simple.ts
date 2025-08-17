#!/usr/bin/env node
/**
 * Simple Intelligence System Demo Server
 * Task 46: Information Classification & Espionage System
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

// Simple demo page
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
        
        .dashboard { display: grid; grid-template-columns: repeat(auto-fit, minmax(400px, 1fr)); gap: 20px; }
        .panel { 
            background: rgba(255,255,255,0.05); 
            backdrop-filter: blur(10px);
            padding: 25px; 
            border-radius: 15px; 
            border: 1px solid rgba(255,107,107,0.2);
            box-shadow: 0 8px 32px rgba(0,0,0,0.3);
        }
        .panel h2 { color: #ff6b6b; margin-top: 0; font-size: 1.4em; }
        
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
        
        .status { color: #4caf50; font-weight: bold; }
        .error { color: #f44336; font-weight: bold; }
        
        input, textarea { 
            background: rgba(255,255,255,0.1); 
            border: 1px solid rgba(255,107,107,0.3); 
            color: white; 
            padding: 8px 12px; 
            border-radius: 6px; 
            margin: 5px;
            width: calc(100% - 30px);
        }
        input::placeholder, textarea::placeholder { color: rgba(255,255,255,0.6); }
    </style>
</head>
<body>
    <div class="header">
        <h1>🕵️ Intelligence System Dashboard</h1>
        <p>Task 46: Information Classification & Espionage Operations</p>
        <div id="systemStatus" class="status">Loading system status...</div>
    </div>

    <div class="dashboard">
        <!-- System Health -->
        <div class="panel">
            <h2>📊 System Health</h2>
            <button onclick="checkHealth()">Check Health</button>
            <button onclick="loadEnums()">Load Enums</button>
            <div id="healthOutput" class="output">Click "Check Health" to verify system status...</div>
        </div>

        <!-- Information Classification -->
        <div class="panel">
            <h2>🔒 Information Classification</h2>
            <input type="text" id="infoTitle" placeholder="Information title">
            <textarea id="infoContent" placeholder="Information content" rows="3"></textarea>
            <input type="text" id="sourceOrg" placeholder="Source organization">
            <button onclick="classifyInfo()">Classify Information</button>
            <button onclick="viewAssets()">View Assets</button>
            <div id="classifyOutput" class="output"></div>
        </div>

        <!-- Espionage Operations -->
        <div class="panel">
            <h2>🕵️ Espionage Operations</h2>
            <input type="text" id="agentCodename" placeholder="Agent codename">
            <input type="text" id="agentOrg" placeholder="Operating organization">
            <input type="text" id="targetOrg" placeholder="Target organization">
            <input type="text" id="coverIdentity" placeholder="Cover identity">
            <input type="text" id="handler" placeholder="Handler name">
            <button onclick="recruitAgent()">Recruit Agent</button>
            <button onclick="viewAgents()">View Agents</button>
            <div id="espionageOutput" class="output"></div>
        </div>

        <!-- Intelligence Market -->
        <div class="panel">
            <h2>💰 Intelligence Market</h2>
            <input type="text" id="participantName" placeholder="Participant name">
            <input type="text" id="participantOrg" placeholder="Organization">
            <button onclick="registerParticipant()">Register Participant</button>
            <button onclick="searchMarket()">Search Market</button>
            <button onclick="getAnalytics()">Market Analytics</button>
            <div id="marketOutput" class="output"></div>
        </div>
    </div>

    <script>
        async function checkHealth() {
            try {
                const response = await fetch('/health');
                const data = await response.json();
                document.getElementById('systemStatus').innerHTML = 
                    'Status: ' + data.status + ' | Database: ' + (data.systems.database ? '✅' : '❌');
                document.getElementById('healthOutput').textContent = JSON.stringify(data, null, 2);
            } catch (error) {
                document.getElementById('systemStatus').innerHTML = 'Error: ' + error.message;
                document.getElementById('systemStatus').className = 'error';
            }
        }

        async function loadEnums() {
            try {
                const response = await fetch('/api/intelligence/enums');
                const data = await response.json();
                document.getElementById('healthOutput').textContent = JSON.stringify(data.data, null, 2);
            } catch (error) {
                document.getElementById('healthOutput').textContent = 'Error: ' + error.message;
            }
        }

        async function classifyInfo() {
            try {
                const title = document.getElementById('infoTitle').value;
                const content = document.getElementById('infoContent').value;
                const sourceOrganization = document.getElementById('sourceOrg').value;

                if (!title || !content || !sourceOrganization) {
                    alert('Please fill in all required fields');
                    return;
                }

                const response = await fetch('/api/intelligence/classify', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ 
                        title, 
                        content, 
                        type: 'RESEARCH_DATA', 
                        sourceOrganization 
                    })
                });
                const data = await response.json();
                
                if (data.success) {
                    let output = '✅ Information Classified Successfully\\n';
                    output += 'Asset ID: ' + data.data.id + '\\n';
                    output += 'Security Level: ' + data.data.securityLevel + '\\n';
                    output += 'Strategic Value: ' + data.data.strategicValue + '/100\\n';
                    output += 'Access Level: ' + data.data.accessLevel + '\\n\\n';
                    output += JSON.stringify(data.data, null, 2);
                    document.getElementById('classifyOutput').textContent = output;
                } else {
                    document.getElementById('classifyOutput').textContent = 'Error: ' + data.error;
                }
            } catch (error) {
                document.getElementById('classifyOutput').textContent = 'Error: ' + error.message;
            }
        }

        async function viewAssets() {
            try {
                const response = await fetch('/api/intelligence/assets?accessLevel=10');
                const data = await response.json();
                
                if (data.success) {
                    let output = '📋 Available Assets (' + data.total + ')\\n\\n';
                    data.data.forEach(asset => {
                        output += '🔹 ' + asset.title + ' (' + asset.id + ')\\n';
                        output += '   Security: ' + asset.securityLevel + ' | Value: ' + asset.strategicValue + '/100\\n';
                        output += '   Type: ' + asset.type + ' | Source: ' + asset.sourceOrganization + '\\n\\n';
                    });
                    document.getElementById('classifyOutput').textContent = output;
                } else {
                    document.getElementById('classifyOutput').textContent = 'Error: ' + data.error;
                }
            } catch (error) {
                document.getElementById('classifyOutput').textContent = 'Error: ' + error.message;
            }
        }

        async function recruitAgent() {
            try {
                const codename = document.getElementById('agentCodename').value;
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
                    body: JSON.stringify({ 
                        codename, 
                        type: 'CORPORATE_INFILTRATOR',
                        organization, 
                        targetOrganization, 
                        coverIdentity, 
                        handler 
                    })
                });
                const data = await response.json();
                
                if (data.success) {
                    let output = '✅ Agent Recruited Successfully\\n';
                    output += 'Codename: ' + data.data.codename + ' (' + data.data.id + ')\\n';
                    output += 'Type: ' + data.data.type + '\\n';
                    output += 'Skill Level: ' + data.data.skillLevel + '/10\\n';
                    output += 'Trust: ' + (data.data.trustworthiness * 100).toFixed(1) + '%\\n';
                    output += 'Monthly Cost: $' + data.data.cost.toLocaleString() + '\\n\\n';
                    output += JSON.stringify(data.data, null, 2);
                    document.getElementById('espionageOutput').textContent = output;
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
                    let output = '👥 Spy Agents (' + data.total + ')\\n\\n';
                    data.data.forEach(agent => {
                        output += '🕵️ ' + agent.codename + ' (' + agent.type + ')\\n';
                        output += '   Status: ' + agent.status + ' | Skill: ' + agent.skillLevel + '/10\\n';
                        output += '   Target: ' + agent.targetOrganization + '\\n';
                        output += '   Operations: ✅' + agent.successfulOperations + ' ❌' + agent.failedOperations + '\\n\\n';
                    });
                    document.getElementById('espionageOutput').textContent = output;
                } else {
                    document.getElementById('espionageOutput').textContent = 'Error: ' + data.error;
                }
            } catch (error) {
                document.getElementById('espionageOutput').textContent = 'Error: ' + error.message;
            }
        }

        async function registerParticipant() {
            try {
                const name = document.getElementById('participantName').value;
                const organization = document.getElementById('participantOrg').value;

                if (!name || !organization) {
                    alert('Please fill in all required fields');
                    return;
                }

                const response = await fetch('/api/intelligence/market/participants/register', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ 
                        name, 
                        organization, 
                        role: 'BUYER',
                        marketTier: 'LEGITIMATE',
                        specializations: ['RESEARCH_DATA', 'TECHNOLOGY_SPECS']
                    })
                });
                const data = await response.json();
                
                if (data.success) {
                    let output = '✅ Market Participant Registered\\n';
                    output += 'ID: ' + data.data.id + '\\n';
                    output += 'Name: ' + data.data.name + '\\n';
                    output += 'Role: ' + data.data.role + '\\n';
                    output += 'Market Tier: ' + data.data.marketTier + '\\n';
                    output += 'Reputation: ' + data.data.reputation + '/100\\n';
                    output += 'Access Level: ' + data.data.accessLevel + '\\n\\n';
                    output += JSON.stringify(data.data, null, 2);
                    document.getElementById('marketOutput').textContent = output;
                } else {
                    document.getElementById('marketOutput').textContent = 'Error: ' + data.error;
                }
            } catch (error) {
                document.getElementById('marketOutput').textContent = 'Error: ' + error.message;
            }
        }

        async function searchMarket() {
            try {
                const response = await fetch('/api/intelligence/market/listings/search?query=research');
                const data = await response.json();
                
                if (data.success) {
                    let output = '🛒 Market Listings (' + data.total + ')\\n\\n';
                    data.data.forEach(listing => {
                        output += '💰 ' + listing.title + '\\n';
                        output += '   Price: $' + listing.currentPrice.toLocaleString() + ' | Value: ' + listing.strategicValue + '/100\\n';
                        output += '   Security: ' + listing.securityLevel + ' | Tier: ' + listing.marketTier + '\\n';
                        output += '   Freshness: ' + (listing.freshness * 100).toFixed(1) + '% | Views: ' + listing.viewCount + '\\n\\n';
                    });
                    document.getElementById('marketOutput').textContent = output;
                } else {
                    document.getElementById('marketOutput').textContent = 'Error: ' + data.error;
                }
            } catch (error) {
                document.getElementById('marketOutput').textContent = 'Error: ' + error.message;
            }
        }

        async function getAnalytics() {
            try {
                const response = await fetch('/api/intelligence/market/analytics');
                const data = await response.json();
                
                if (data.success) {
                    let output = '📈 Market Analytics\\n\\n';
                    output += 'Total Listings: ' + data.data.totalListings + '\\n';
                    output += 'Active Listings: ' + data.data.activeListings + '\\n';
                    output += 'Total Transactions: ' + data.data.totalTransactions + '\\n';
                    output += 'Total Volume: $' + data.data.totalVolume.toLocaleString() + '\\n';
                    output += 'Average Transaction: $' + Math.round(data.data.averageTransactionValue).toLocaleString() + '\\n\\n';
                    output += 'Market Trends: ' + data.data.marketTrends.priceDirection + ' prices, ' + data.data.marketTrends.volumeDirection + ' volume\\n';
                    output += 'Hot Categories: ' + data.data.marketTrends.hotCategories.join(', ') + '\\n\\n';
                    output += JSON.stringify(data.data, null, 2);
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
