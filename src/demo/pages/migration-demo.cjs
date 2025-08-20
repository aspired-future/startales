function getMigrationDemo() {
  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Enhanced Migration System</title>
    <style>
      body { font-family: system-ui, sans-serif; padding: 20px; background: #0a0a0a; color: #e0e0e0; margin: 0; }
      .container { max-width: 1400px; margin: 0 auto; }
      .header { text-align: center; margin-bottom: 30px; }
      .demo-card { background: #1a1a1a; padding: 20px; border-radius: 8px; border: 1px solid #333; margin-bottom: 20px; }
      .btn { background: #4ecdc4; color: #0a0a0a; padding: 10px 20px; border: none; border-radius: 4px; cursor: pointer; margin: 5px; }
      .btn:hover { background: #44a08d; }
      .btn.secondary { background: #fbbf24; }
      .btn.secondary:hover { background: #f59e0b; }
      .btn.danger { background: #ef4444; }
      .btn.danger:hover { background: #dc2626; }
      .chart-container { background: #2a2a2a; padding: 20px; border-radius: 6px; margin: 15px 0; }
      .migration-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 15px; }
      .migration-stat { background: #2a2a2a; padding: 15px; border-radius: 6px; text-align: center; }
      .stat-value { font-size: 1.5em; color: #4ecdc4; font-weight: bold; }
      .stat-label { color: #ccc; font-size: 0.9em; }
      .city-selector { margin: 20px 0; }
      .city-selector select { background: #2a2a2a; color: #e0e0e0; border: 1px solid #444; padding: 10px; border-radius: 4px; }
      .tabs { display: flex; margin-bottom: 20px; border-bottom: 1px solid #333; }
      .tab { padding: 10px 20px; cursor: pointer; border-bottom: 2px solid transparent; }
      .tab.active { border-bottom-color: #4ecdc4; color: #4ecdc4; }
      .tab-content { display: none; }
      .tab-content.active { display: block; }
      .progress-bar { background: #444; height: 20px; border-radius: 10px; margin: 10px 0; overflow: hidden; }
      .progress-fill { background: linear-gradient(90deg, #4ecdc4, #44a08d); height: 100%; transition: width 0.3s; }
      .flow-card { background: #2a2a2a; padding: 15px; border-radius: 6px; margin: 10px 0; border-left: 4px solid #4ecdc4; }
      .policy-card { background: #2a2a2a; padding: 15px; border-radius: 6px; margin: 10px 0; border-left: 4px solid #fbbf24; }
      .event-card { background: #2a2a2a; padding: 15px; border-radius: 6px; margin: 10px 0; border-left: 4px solid #ef4444; }
      .integration-stage { padding: 8px 12px; border-radius: 4px; font-size: 0.8em; margin: 2px; display: inline-block; }
      .stage-arrival { background: #ef4444; color: white; }
      .stage-initial_settlement { background: #f59e0b; color: white; }
      .stage-adaptation { background: #fbbf24; color: black; }
      .stage-integration { background: #22c55e; color: white; }
      .stage-full_integration { background: #16a34a; color: white; }
      .loading { text-align: center; color: #fbbf24; padding: 20px; }
      .form-group { margin: 15px 0; }
      .form-group label { display: block; margin-bottom: 5px; color: #ccc; }
      .form-group input, .form-group select, .form-group textarea { 
        width: 100%; padding: 10px; background: #2a2a2a; color: #e0e0e0; border: 1px solid #444; border-radius: 4px; 
      }
      .modal { display: none; position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.8); z-index: 1000; }
      .modal-content { background: #1a1a1a; padding: 30px; border-radius: 8px; max-width: 600px; margin: 50px auto; max-height: 80vh; overflow-y: auto; }
      .close { float: right; font-size: 28px; cursor: pointer; color: #ccc; }
      .close:hover { color: #fff; }
      h1 { color: #4ecdc4; }
      h2 { color: #fbbf24; }
      h3 { color: #e0e0e0; }
    </style>
  </head>
  <body>
    <div class="container">
      <div class="header">
        <h1>🚀 Enhanced Migration System</h1>
        <p>Inter-civilization migration, economic drivers, cultural assimilation mechanics, and policy controls</p>
      </div>

      <div class="city-selector">
        <label for="citySelect">Select City: </label>
        <select id="citySelect" onchange="loadCityData()">
          <option value="">Loading cities...</option>
        </select>
        <button class="btn secondary" onclick="openCreateFlowModal()">➕ Create Migration Flow</button>
        <button class="btn secondary" onclick="openCreatePolicyModal()">📋 Create Policy</button>
        <button class="btn secondary" onclick="simulateMigration()">⚡ Simulate Events</button>
      </div>

      <div class="tabs">
        <div class="tab active" onclick="showTab('flows')">🌊 Migration Flows</div>
        <div class="tab" onclick="showTab('policies')">📋 Policies</div>
        <div class="tab" onclick="showTab('integration')">🤝 Integration</div>
        <div class="tab" onclick="showTab('analytics')">📊 Analytics</div>
        <div class="tab" onclick="showTab('events')">⚡ Events</div>
      </div>

      <!-- Migration Flows Tab -->
      <div id="flows" class="tab-content active">
        <div class="demo-card">
          <h2>Migration Flow Overview</h2>
          <div class="migration-grid" id="flowStats">
            <div class="loading">Loading flow data...</div>
          </div>
        </div>

        <div class="demo-card">
          <h2>Active Migration Flows</h2>
          <div id="flowsList">
            <div class="loading">Loading flows...</div>
          </div>
        </div>
      </div>

      <!-- Policies Tab -->
      <div id="policies" class="tab-content">
        <div class="demo-card">
          <h2>Migration Policies</h2>
          <div id="policiesList">
            <div class="loading">Loading policies...</div>
          </div>
        </div>
      </div>

      <!-- Integration Tab -->
      <div id="integration" class="tab-content">
        <div class="demo-card">
          <h2>Integration Outcomes</h2>
          <div class="migration-grid" id="integrationStats">
            <div class="loading">Loading integration data...</div>
          </div>
        </div>

        <div class="demo-card">
          <h2>Integration Stage Distribution</h2>
          <div class="chart-container" id="integrationChart">
            <div class="loading">Loading integration stages...</div>
          </div>
        </div>
      </div>

      <!-- Analytics Tab -->
      <div id="analytics" class="tab-content">
        <div class="demo-card">
          <h2>Migration Analytics</h2>
          <div class="migration-grid" id="analyticsStats">
            <div class="loading">Loading analytics...</div>
          </div>
        </div>

        <div class="demo-card">
          <h2>Economic & Social Impact</h2>
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px;">
            <div class="chart-container" id="economicImpact">
              <div class="loading">Loading economic impact...</div>
            </div>
            <div class="chart-container" id="socialImpact">
              <div class="loading">Loading social impact...</div>
            </div>
          </div>
        </div>
      </div>

      <!-- Events Tab -->
      <div id="events" class="tab-content">
        <div class="demo-card">
          <h2>Recent Migration Events</h2>
          <div id="eventsList">
            <div class="loading">Loading events...</div>
          </div>
        </div>
      </div>

      <!-- Create Flow Modal -->
      <div id="createFlowModal" class="modal">
        <div class="modal-content">
          <span class="close" onclick="closeModal('createFlowModal')">&times;</span>
          <h2>Create Migration Flow</h2>
          <form id="createFlowForm">
            <div class="form-group">
              <label>Migration Type:</label>
              <select name="type" required>
                <option value="immigration">Immigration</option>
                <option value="internal">Internal</option>
                <option value="emigration">Emigration</option>
              </select>
            </div>
            <div class="form-group">
              <label>Subtype:</label>
              <select name="subtype" required>
                <option value="economic">Economic</option>
                <option value="refugee">Refugee</option>
                <option value="skilled_worker">Skilled Worker</option>
                <option value="family_reunification">Family Reunification</option>
                <option value="student">Student</option>
              </select>
            </div>
            <div class="form-group">
              <label>Origin City:</label>
              <select name="originCityId" id="originCitySelect" required>
                <option value="">Select origin city...</option>
              </select>
            </div>
            <div class="form-group">
              <label>Destination City:</label>
              <select name="destinationCityId" id="destinationCitySelect" required>
                <option value="">Select destination city...</option>
              </select>
            </div>
            <div class="form-group">
              <label>Population Size:</label>
              <input type="number" name="populationSize" min="1" max="100000" value="1000" required>
            </div>
            <div class="form-group">
              <label>Legal Status:</label>
              <select name="legalStatus" required>
                <option value="documented">Documented</option>
                <option value="undocumented">Undocumented</option>
                <option value="refugee">Refugee</option>
                <option value="asylum_seeker">Asylum Seeker</option>
                <option value="temporary_worker">Temporary Worker</option>
                <option value="permanent_resident">Permanent Resident</option>
              </select>
            </div>
            <div class="form-group">
              <label>Expected Duration (days):</label>
              <input type="number" name="expectedDuration" min="1" max="3650" value="365" required>
            </div>
            <button type="submit" class="btn">Create Flow</button>
          </form>
        </div>
      </div>

      <!-- Create Policy Modal -->
      <div id="createPolicyModal" class="modal">
        <div class="modal-content">
          <span class="close" onclick="closeModal('createPolicyModal')">&times;</span>
          <h2>Create Migration Policy</h2>
          <form id="createPolicyForm">
            <div class="form-group">
              <label>Policy Name:</label>
              <input type="text" name="name" required>
            </div>
            <div class="form-group">
              <label>Description:</label>
              <textarea name="description" rows="3" required></textarea>
            </div>
            <div class="form-group">
              <label>Policy Type:</label>
              <select name="type" required>
                <option value="quota">Quota System</option>
                <option value="points_system">Points System</option>
                <option value="integration_support">Integration Support</option>
                <option value="refugee">Refugee Protection</option>
                <option value="border_control">Border Control</option>
              </select>
            </div>
            <div class="form-group">
              <label>Enforcement Level (%):</label>
              <input type="number" name="enforcementLevel" min="0" max="100" value="75" required>
            </div>
            <div class="form-group">
              <label>Implementation Cost:</label>
              <input type="number" name="implementationCost" min="0" value="1000000" required>
            </div>
            <div class="form-group">
              <label>Annual Operating Cost:</label>
              <input type="number" name="annualOperatingCost" min="0" value="500000" required>
            </div>
            <button type="submit" class="btn">Create Policy</button>
          </form>
        </div>
      </div>

      <div style="margin-top: 40px; text-align: center;">
        <a href="/demo/hud" class="btn">← Back to Demo Hub</a>
      </div>
    </div>

    <script>
      let currentCityId = null;
      let cities = [];
      let currentFlows = [];
      let currentPolicies = [];

      // Tab management
      function showTab(tabName) {
        document.querySelectorAll('.tab').forEach(tab => tab.classList.remove('active'));
        document.querySelectorAll('.tab-content').forEach(content => content.classList.remove('active'));
        
        document.querySelector(\`[onclick="showTab('\${tabName}')"]\`).classList.add('active');
        document.getElementById(tabName).classList.add('active');
        
        // Load data for the active tab
        switch(tabName) {
          case 'flows':
            loadFlowsData();
            break;
          case 'policies':
            loadPoliciesData();
            break;
          case 'integration':
            loadIntegrationData();
            break;
          case 'analytics':
            loadAnalyticsData();
            break;
          case 'events':
            loadEventsData();
            break;
        }
      }

      // Load cities list
      async function loadCities() {
        try {
          const response = await fetch('/api/demographics/population');
          const data = await response.json();
          cities = data.cities;
          
          const select = document.getElementById('citySelect');
          const originSelect = document.getElementById('originCitySelect');
          const destSelect = document.getElementById('destinationCitySelect');
          
          const options = cities.map(city => 
            \`<option value="\${city.cityId}">\${city.cityName} (\${(city.totalPopulation/1000000).toFixed(1)}M)</option>\`
          ).join('');
          
          select.innerHTML = options;
          originSelect.innerHTML = '<option value="">Select origin city...</option>' + options;
          destSelect.innerHTML = '<option value="">Select destination city...</option>' + options;
          
          if (cities.length > 0) {
            currentCityId = cities[0].cityId;
            loadCityData();
          }
        } catch (error) {
          console.error('Error loading cities:', error);
        }
      }

      // Load city-specific data
      async function loadCityData() {
        const select = document.getElementById('citySelect');
        currentCityId = select.value;
        
        if (!currentCityId) return;
        
        // Load data for current tab
        const activeTab = document.querySelector('.tab.active').textContent.toLowerCase().includes('flows') ? 'flows' :
                         document.querySelector('.tab.active').textContent.toLowerCase().includes('policies') ? 'policies' :
                         document.querySelector('.tab.active').textContent.toLowerCase().includes('integration') ? 'integration' :
                         document.querySelector('.tab.active').textContent.toLowerCase().includes('analytics') ? 'analytics' : 'events';
        
        showTab(activeTab);
      }

      // Load flows data
      async function loadFlowsData() {
        try {
          const response = await fetch('/api/migration/flows');
          const data = await response.json();
          currentFlows = data.flows;
          
          // Flow statistics
          const totalFlows = currentFlows.length;
          const activeFlows = currentFlows.filter(f => f.status === 'active').length;
          const totalPopulation = currentFlows.reduce((sum, f) => sum + f.populationSize, 0);
          const avgDuration = currentFlows.reduce((sum, f) => sum + f.expectedDuration, 0) / totalFlows || 0;
          
          const flowStats = [
            { label: 'Total Flows', value: totalFlows.toLocaleString() },
            { label: 'Active Flows', value: activeFlows.toLocaleString() },
            { label: 'Total Population', value: (totalPopulation/1000).toFixed(1) + 'K' },
            { label: 'Avg Duration', value: Math.round(avgDuration) + ' days' }
          ];
          
          document.getElementById('flowStats').innerHTML = flowStats.map(stat => \`
            <div class="migration-stat">
              <div class="stat-value">\${stat.value}</div>
              <div class="stat-label">\${stat.label}</div>
            </div>
          \`).join('');
          
          // Flow list
          document.getElementById('flowsList').innerHTML = currentFlows.map(flow => \`
            <div class="flow-card">
              <div style="display: flex; justify-content: space-between; align-items: center;">
                <div>
                  <strong>\${flow.type.toUpperCase()}: \${flow.subtype.replace('_', ' ')}</strong>
                  <div style="color: #ccc; font-size: 0.9em;">
                    \${flow.originCityId || flow.originCountry || 'Unknown'} → \${flow.destinationCityId}
                  </div>
                </div>
                <div style="text-align: right;">
                  <div class="stat-value" style="font-size: 1.2em;">\${flow.populationSize.toLocaleString()}</div>
                  <div class="stat-label">migrants</div>
                </div>
              </div>
              <div style="margin-top: 10px;">
                <span class="integration-stage stage-\${flow.legalStatus}">\${flow.legalStatus.replace('_', ' ')}</span>
                <span style="color: #ccc; margin-left: 10px;">Duration: \${flow.expectedDuration} days</span>
                <span style="color: #ccc; margin-left: 10px;">Documentation: \${flow.documentationLevel}%</span>
              </div>
            </div>
          \`).join('');
          
        } catch (error) {
          console.error('Error loading flows data:', error);
        }
      }

      // Load policies data
      async function loadPoliciesData() {
        try {
          const response = await fetch('/api/migration/policies');
          const data = await response.json();
          currentPolicies = data.policies;
          
          document.getElementById('policiesList').innerHTML = currentPolicies.map(policy => \`
            <div class="policy-card">
              <div style="display: flex; justify-content: space-between; align-items: center;">
                <div>
                  <strong>\${policy.name}</strong>
                  <div style="color: #ccc; font-size: 0.9em; margin-top: 5px;">
                    \${policy.description}
                  </div>
                </div>
                <div style="text-align: right;">
                  <div class="stat-value" style="font-size: 1.2em;">\${policy.enforcementLevel}%</div>
                  <div class="stat-label">enforcement</div>
                </div>
              </div>
              <div style="margin-top: 10px;">
                <span class="integration-stage stage-\${policy.type}">\${policy.type.replace('_', ' ')}</span>
                <span style="color: #ccc; margin-left: 10px;">Public Support: \${policy.publicSupport}%</span>
                <span style="color: #ccc; margin-left: 10px;">Cost: $\${(policy.annualOperatingCost/1000000).toFixed(1)}M/year</span>
              </div>
              <div style="margin-top: 10px; font-size: 0.9em; color: #ccc;">
                Target Groups: \${policy.targetGroups.join(', ')}
              </div>
            </div>
          \`).join('');
          
        } catch (error) {
          console.error('Error loading policies data:', error);
        }
      }

      // Load integration data
      async function loadIntegrationData() {
        if (!currentCityId) return;
        
        try {
          const response = await fetch(\`/api/migration/integration/\${currentCityId}\`);
          const data = await response.json();
          
          const integrationStats = [
            { label: 'Total Migrants', value: data.summary.totalMigrants.toLocaleString() },
            { label: 'Avg Integration Score', value: data.summary.averageIntegrationScore.toFixed(1) + '/100' },
            { label: 'Success Rate', value: data.summary.successRate.toFixed(1) + '%' },
            { label: 'City', value: currentCityId.replace('_', ' ') }
          ];
          
          document.getElementById('integrationStats').innerHTML = integrationStats.map(stat => \`
            <div class="migration-stat">
              <div class="stat-value">\${stat.value}</div>
              <div class="stat-label">\${stat.label}</div>
            </div>
          \`).join('');
          
          // Integration stages chart
          const stages = data.summary.stageDistribution;
          const maxStage = Math.max(...Object.values(stages));
          
          document.getElementById('integrationChart').innerHTML = \`
            <h3>Integration Stage Distribution</h3>
            \${Object.entries(stages).map(([stage, count]) => \`
              <div style="margin: 10px 0;">
                <div style="display: flex; justify-content: space-between; margin-bottom: 5px;">
                  <span class="integration-stage stage-\${stage}">\${stage.replace('_', ' ')}</span>
                  <span>\${count} migrants</span>
                </div>
                <div class="progress-bar">
                  <div class="progress-fill" style="width: \${maxStage > 0 ? (count / maxStage) * 100 : 0}%;"></div>
                </div>
              </div>
            \`).join('')}
          \`;
          
        } catch (error) {
          console.error('Error loading integration data:', error);
        }
      }

      // Load analytics data
      async function loadAnalyticsData() {
        if (!currentCityId) return;
        
        try {
          const response = await fetch(\`/api/migration/analytics/\${currentCityId}\`);
          const data = await response.json();
          
          const analyticsStats = [
            { label: 'Net Migration', value: data.flowAnalytics.netMigration.toLocaleString() },
            { label: 'Total Inflows', value: data.flowAnalytics.totalInflows.toLocaleString() },
            { label: 'Total Outflows', value: data.flowAnalytics.totalOutflows.toLocaleString() },
            { label: 'Integration Success', value: data.integrationAnalytics.integrationSuccessRate.toFixed(1) + '%' }
          ];
          
          document.getElementById('analyticsStats').innerHTML = analyticsStats.map(stat => \`
            <div class="migration-stat">
              <div class="stat-value">\${stat.value}</div>
              <div class="stat-label">\${stat.label}</div>
            </div>
          \`).join('');
          
          // Economic impact
          const economic = data.economicImpact;
          document.getElementById('economicImpact').innerHTML = \`
            <h3>Economic Impact</h3>
            <div style="margin: 10px 0;">
              <strong>Labor Force Contribution:</strong> \${economic.laborForceContribution} workers
            </div>
            <div style="margin: 10px 0;">
              <strong>Tax Contribution:</strong> $\${(economic.taxContribution/1000000).toFixed(1)}M
            </div>
            <div style="margin: 10px 0;">
              <strong>Entrepreneurship Rate:</strong> \${economic.entrepreneurshipImpact.toFixed(1)}%
            </div>
            <div style="margin: 10px 0;">
              <strong>Services Cost:</strong> $\${(economic.servicesCost/1000000).toFixed(1)}M
            </div>
          \`;
          
          // Social impact
          const social = data.socialImpact;
          document.getElementById('socialImpact').innerHTML = \`
            <h3>Social Impact</h3>
            <div style="margin: 10px 0;">
              <strong>Cultural Diversity:</strong> \${social.culturalDiversity.toFixed(1)}/100
            </div>
            <div style="margin: 10px 0;">
              <strong>Social Cohesion:</strong> \${social.socialCohesion.toFixed(1)}/100
            </div>
            <div style="margin: 10px 0;">
              <strong>Community Vitality:</strong> \${social.communityVitality.toFixed(1)}/100
            </div>
            <div style="margin: 10px 0;">
              <strong>Discrimination Reports:</strong> \${social.discriminationReports}
            </div>
          \`;
          
        } catch (error) {
          console.error('Error loading analytics data:', error);
        }
      }

      // Load events data
      async function loadEventsData() {
        try {
          const response = await fetch('/api/migration/events?limit=20');
          const data = await response.json();
          
          document.getElementById('eventsList').innerHTML = data.events.map(event => \`
            <div class="event-card">
              <div style="display: flex; justify-content: space-between; align-items: center;">
                <div>
                  <strong>\${event.type.replace('_', ' ').toUpperCase()}</strong>
                  <div style="color: #ccc; font-size: 0.9em; margin-top: 5px;">
                    \${event.description}
                  </div>
                </div>
                <div style="text-align: right;">
                  <div class="stat-value" style="font-size: 1.2em;">\${event.severity.toFixed(1)}</div>
                  <div class="stat-label">severity</div>
                </div>
              </div>
              <div style="margin-top: 10px; font-size: 0.9em; color: #ccc;">
                Affected Cities: \${event.affectedCities.length} | 
                Flow Multiplier: \${event.migrationImpact.flowMultiplier.toFixed(2)}x |
                \${new Date(event.timestamp).toLocaleString()}
              </div>
            </div>
          \`).join('');
          
        } catch (error) {
          console.error('Error loading events data:', error);
        }
      }

      // Modal functions
      function openCreateFlowModal() {
        document.getElementById('createFlowModal').style.display = 'block';
      }

      function openCreatePolicyModal() {
        document.getElementById('createPolicyModal').style.display = 'block';
      }

      function closeModal(modalId) {
        document.getElementById(modalId).style.display = 'none';
      }

      // Form submissions
      document.getElementById('createFlowForm').addEventListener('submit', async (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const flowData = Object.fromEntries(formData.entries());
        flowData.populationSize = parseInt(flowData.populationSize);
        flowData.expectedDuration = parseInt(flowData.expectedDuration);
        
        try {
          const response = await fetch('/api/migration/flows', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(flowData)
          });
          
          if (response.ok) {
            alert('Migration flow created successfully!');
            closeModal('createFlowModal');
            e.target.reset();
            loadFlowsData();
          }
        } catch (error) {
          console.error('Error creating flow:', error);
          alert('Error creating migration flow');
        }
      });

      document.getElementById('createPolicyForm').addEventListener('submit', async (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const policyData = Object.fromEntries(formData.entries());
        policyData.enforcementLevel = parseInt(policyData.enforcementLevel);
        policyData.implementationCost = parseInt(policyData.implementationCost);
        policyData.annualOperatingCost = parseInt(policyData.annualOperatingCost);
        policyData.targetGroups = [policyData.type]; // Simplified
        
        try {
          const response = await fetch('/api/migration/policies', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(policyData)
          });
          
          if (response.ok) {
            alert('Migration policy created successfully!');
            closeModal('createPolicyModal');
            e.target.reset();
            loadPoliciesData();
          }
        } catch (error) {
          console.error('Error creating policy:', error);
          alert('Error creating migration policy');
        }
      });

      // Simulate migration
      async function simulateMigration() {
        try {
          const response = await fetch('/api/migration/simulate', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({})
          });
          
          const result = await response.json();
          
          if (result.success) {
            alert(\`🎯 Migration Simulation Complete!\\n\\nNew Event: \${result.newEvent.type.replace('_', ' ')}\\nUpdated Flows: \${result.updatedFlows}\\nUpdated Outcomes: \${result.updatedOutcomes}\\nActive Flows: \${result.activeFlows}\`);
            
            // Reload current tab data
            const activeTab = document.querySelector('.tab.active').textContent.toLowerCase();
            if (activeTab.includes('flows')) loadFlowsData();
            else if (activeTab.includes('events')) loadEventsData();
            else if (activeTab.includes('integration')) loadIntegrationData();
            else if (activeTab.includes('analytics')) loadAnalyticsData();
          }
        } catch (error) {
          console.error('Error simulating migration:', error);
          alert('Error running migration simulation');
        }
      }

      // Close modals when clicking outside
      window.onclick = function(event) {
        const modals = document.querySelectorAll('.modal');
        modals.forEach(modal => {
          if (event.target === modal) {
            modal.style.display = 'none';
          }
        });
      }

      // Initialize
      loadCities();
    </script>
  </body>
</html>`;
}

module.exports = { getMigrationDemo };

