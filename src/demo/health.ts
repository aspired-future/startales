import { Router } from 'express';

const healthDemo = Router();

// Health & Human Services Department Demo Page
healthDemo.get('/demo/health', (_req, res) => {
  res.type('html').send(`<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Health & Human Services Department Demo</title>
    <style>
      body { 
        font-family: system-ui, sans-serif; 
        margin: 0; 
        padding: 20px; 
        background: linear-gradient(135deg, #1a1a2e, #16213e); 
        color: #e0e0e0; 
        min-height: 100vh;
      }
      .container { 
        max-width: 1600px; 
        margin: 0 auto; 
      }
      h1 { 
        color: #4ade80; 
        text-align: center; 
        margin-bottom: 30px; 
        font-size: 2.5em;
        text-shadow: 0 0 20px rgba(74, 222, 128, 0.3);
      }
      .dashboard-grid { 
        display: grid; 
        grid-template-columns: repeat(auto-fit, minmax(350px, 1fr)); 
        gap: 20px; 
        margin-bottom: 30px; 
      }
      .panel { 
        background: rgba(26, 26, 46, 0.8); 
        padding: 20px; 
        border-radius: 12px; 
        border: 1px solid #333; 
        backdrop-filter: blur(10px);
        box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
      }
      .panel h3 { 
        color: #fbbf24; 
        margin-top: 0; 
        display: flex; 
        align-items: center; 
        gap: 10px;
      }
      .metric { 
        display: flex; 
        justify-content: space-between; 
        margin: 10px 0; 
        padding: 8px 0; 
        border-bottom: 1px solid #333;
      }
      .metric-value { 
        color: #4ade80; 
        font-weight: bold; 
      }
      .health-bar { 
        background: #333; 
        height: 8px; 
        border-radius: 4px; 
        margin: 5px 0; 
        overflow: hidden;
      }
      .health-fill { 
        height: 100%; 
        background: linear-gradient(90deg, #4ade80, #22c55e); 
        transition: width 0.3s ease; 
      }
      button { 
        background: linear-gradient(135deg, #4ade80, #22c55e); 
        color: #000; 
        border: none; 
        padding: 12px 20px; 
        border-radius: 8px; 
        cursor: pointer; 
        font-weight: bold;
        margin: 5px;
        transition: all 0.3s ease;
        box-shadow: 0 4px 15px rgba(74, 222, 128, 0.3);
      }
      button:hover { 
        transform: translateY(-2px);
        box-shadow: 0 6px 20px rgba(74, 222, 128, 0.4);
      }
      .controls { 
        background: rgba(26, 26, 46, 0.8); 
        padding: 20px; 
        border-radius: 12px; 
        margin-bottom: 20px; 
        border: 1px solid #333;
      }
      input, select { 
        background: #333; 
        color: #e0e0e0; 
        border: 1px solid #555; 
        padding: 8px 12px; 
        border-radius: 6px; 
        margin: 5px;
      }
      .tab-container {
        background: rgba(26, 26, 46, 0.8);
        border-radius: 12px;
        overflow: hidden;
        border: 1px solid #333;
      }
      .tab-nav {
        display: flex;
        background: rgba(42, 42, 42, 0.8);
        border-bottom: 1px solid #333;
        flex-wrap: wrap;
      }
      .tab-button {
        background: none;
        border: none;
        padding: 15px 20px;
        color: #ccc;
        cursor: pointer;
        transition: all 0.3s ease;
        border-bottom: 3px solid transparent;
        font-size: 0.9em;
      }
      .tab-button.active {
        color: #4ade80;
        border-bottom-color: #4ade80;
        background: rgba(74, 222, 128, 0.1);
      }
      .tab-content {
        display: none;
        padding: 20px;
      }
      .tab-content.active {
        display: block;
      }
      .character-card {
        background: rgba(42, 42, 42, 0.8);
        padding: 20px;
        border-radius: 12px;
        border-left: 4px solid #4ade80;
        margin: 15px 0;
      }
      .character-name {
        font-size: 1.2em;
        font-weight: bold;
        color: #4ade80;
        margin-bottom: 10px;
      }
      .character-details {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 15px;
        margin-top: 15px;
      }
      .health-status {
        display: inline-block;
        padding: 4px 12px;
        border-radius: 20px;
        font-size: 0.8em;
        font-weight: bold;
      }
      .status-excellent { background: rgba(34, 197, 94, 0.2); color: #86efac; }
      .status-good { background: rgba(74, 222, 128, 0.2); color: #4ade80; }
      .status-fair { background: rgba(251, 191, 36, 0.2); color: #fbbf24; }
      .status-poor { background: rgba(239, 68, 68, 0.2); color: #fca5a5; }
      .disease-card {
        background: rgba(60, 60, 60, 0.6);
        padding: 15px;
        border-radius: 8px;
        margin: 10px 0;
        border-left: 3px solid #ef4444;
      }
      .facility-card {
        background: rgba(60, 60, 60, 0.6);
        padding: 15px;
        border-radius: 8px;
        margin: 10px 0;
        border-left: 3px solid #3b82f6;
      }
      .emergency-card {
        background: rgba(239, 68, 68, 0.1);
        padding: 15px;
        border-radius: 8px;
        margin: 10px 0;
        border: 1px solid #ef4444;
      }
      .policy-card {
        background: rgba(139, 92, 246, 0.1);
        padding: 15px;
        border-radius: 8px;
        margin: 10px 0;
        border: 1px solid #8b5cf6;
      }
      pre { 
        background: #1a1a1a; 
        padding: 15px; 
        border-radius: 8px; 
        overflow-x: auto; 
        border: 1px solid #333;
        font-size: 0.9em;
      }
      .success { 
        background: rgba(34, 197, 94, 0.2); 
        border: 1px solid #22c55e; 
        color: #86efac; 
        padding: 10px; 
        border-radius: 6px; 
        margin: 10px 0;
      }
      .alert { 
        background: rgba(239, 68, 68, 0.2); 
        border: 1px solid #ef4444; 
        color: #fca5a5; 
        padding: 10px; 
        border-radius: 6px; 
        margin: 10px 0;
      }
    </style>
  </head>
  <body>
    <div class="container">
      <h1>🏥 Health & Human Services Department</h1>
      
      <div class="controls">
        <label>Campaign ID: <input type="number" id="campaignId" value="1" min="1"></label>
        <label>Civilization ID: <input type="number" id="civilizationId" value="1" min="1"></label>
        <button onclick="generateHealthSecretary()">Generate Health Secretary</button>
        <button onclick="generateSurgeonGeneral()">Generate Surgeon General</button>
        <button onclick="loadHealthDashboard()">Load Health Dashboard</button>
        <button onclick="initializeHealthData()">Initialize Health Data</button>
      </div>

      <div class="tab-container">
        <div class="tab-nav">
          <button class="tab-button active" onclick="showTab('leadership')">👥 Leadership</button>
          <button class="tab-button" onclick="showTab('population')">📊 Population Health</button>
          <button class="tab-button" onclick="showTab('diseases')">🦠 Chronic Diseases</button>
          <button class="tab-button" onclick="showTab('infrastructure')">🏥 Infrastructure</button>
          <button class="tab-button" onclick="showTab('policies')">📋 Health Policies</button>
          <button class="tab-button" onclick="showTab('emergencies')">🚨 Emergencies</button>
          <button class="tab-button" onclick="showTab('budget')">💰 Budget</button>
          <button class="tab-button" onclick="showTab('workflows')">⚙️ Workflows</button>
        </div>

        <!-- Leadership Tab -->
        <div id="leadership-tab" class="tab-content active">
          <div class="dashboard-grid">
            <div class="panel">
              <h3>🎖️ Health Secretary</h3>
              <div id="healthSecretaryCard">
                <p>No Health Secretary appointed. Generate one to begin.</p>
              </div>
              <div class="controls">
                <button onclick="hireHealthSecretary()">Hire Secretary</button>
                <button onclick="fireHealthSecretary()">Fire Secretary</button>
                <button onclick="getHealthSecretary()">View Current Secretary</button>
              </div>
            </div>

            <div class="panel">
              <h3>👨‍⚕️ Surgeon General</h3>
              <div id="surgeonGeneralCard">
                <p>No Surgeon General appointed. Generate one to begin.</p>
              </div>
              <div class="controls">
                <button onclick="hireSurgeonGeneral()">Hire Surgeon General</button>
                <button onclick="fireSurgeonGeneral()">Fire Surgeon General</button>
                <button onclick="getSurgeonGeneral()">View Current Surgeon General</button>
              </div>
            </div>

            <div class="panel">
              <h3>📞 Leader Communications</h3>
              <div class="metric">
                <span>Health Secretary Availability:</span>
                <span class="metric-value" id="secretaryAvailability">Available</span>
              </div>
              <div class="metric">
                <span>Surgeon General Availability:</span>
                <span class="metric-value" id="surgeonAvailability">Available</span>
              </div>
              <div class="controls">
                <button onclick="contactHealthSecretary()">Contact Health Secretary</button>
                <button onclick="contactSurgeonGeneral()">Contact Surgeon General</button>
              </div>
            </div>

            <div class="panel">
              <h3>📈 Leadership Performance</h3>
              <div class="metric">
                <span>Secretary Approval Rating:</span>
                <span class="metric-value" id="secretaryApproval">--</span>
              </div>
              <div class="metric">
                <span>Surgeon General Approval:</span>
                <span class="metric-value" id="surgeonApproval">--</span>
              </div>
              <div class="metric">
                <span>Department Effectiveness:</span>
                <span class="metric-value" id="departmentEffectiveness">--</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Population Health Tab -->
        <div id="population-tab" class="tab-content">
          <div class="dashboard-grid">
            <div class="panel">
              <h3>🌍 Overall Health Metrics</h3>
              <div class="metric">
                <span>Life Expectancy:</span>
                <span class="metric-value" id="lifeExpectancy">-- years</span>
              </div>
              <div class="metric">
                <span>Healthcare Access Score:</span>
                <span class="metric-value" id="healthcareAccess">--%</span>
              </div>
              <div class="metric">
                <span>Vaccination Rate:</span>
                <span class="metric-value" id="vaccinationRate">--%</span>
              </div>
              <div class="metric">
                <span>Mental Health Index:</span>
                <span class="metric-value" id="mentalHealthIndex">--/100</span>
              </div>
              <div class="health-bar">
                <div class="health-fill" id="overallHealthBar" style="width: 0%"></div>
              </div>
            </div>

            <div class="panel">
              <h3>👶 Maternal & Child Health</h3>
              <div class="metric">
                <span>Infant Mortality Rate:</span>
                <span class="metric-value" id="infantMortality">-- per 1000</span>
              </div>
              <div class="metric">
                <span>Child Vaccination Coverage:</span>
                <span class="metric-value" id="childVaccination">--%</span>
              </div>
              <div class="metric">
                <span>Maternal Health Score:</span>
                <span class="metric-value" id="maternalHealth">--/100</span>
              </div>
            </div>

            <div class="panel">
              <h3>🏃 Lifestyle & Environment</h3>
              <div class="metric">
                <span>Nutrition Index:</span>
                <span class="metric-value" id="nutritionIndex">--/100</span>
              </div>
              <div class="metric">
                <span>Fitness Level:</span>
                <span class="metric-value" id="fitnessLevel">--/100</span>
              </div>
              <div class="metric">
                <span>Air Quality Index:</span>
                <span class="metric-value" id="airQuality">--/100</span>
              </div>
              <div class="metric">
                <span>Water Quality Index:</span>
                <span class="metric-value" id="waterQuality">--/100</span>
              </div>
            </div>

            <div class="panel">
              <h3>👴 Elder Care & Chronic Disease</h3>
              <div class="metric">
                <span>Elder Care Coverage:</span>
                <span class="metric-value" id="elderCare">--%</span>
              </div>
              <div class="metric">
                <span>Chronic Disease Prevalence:</span>
                <span class="metric-value" id="chronicDisease">--%</span>
              </div>
              <div class="metric">
                <span>Disease Outbreak Risk:</span>
                <span class="metric-value" id="outbreakRisk">--/100</span>
              </div>
              <div class="controls">
                <button onclick="updatePopulationHealth()">Update Health Data</button>
              </div>
            </div>
          </div>
        </div>

        <!-- Chronic Diseases Tab -->
        <div id="diseases-tab" class="tab-content">
          <div class="panel">
            <h3>🦠 Chronic Disease Management</h3>
            <div id="chronicDiseasesList">
              <p>Loading chronic disease data...</p>
            </div>
            <div class="controls">
              <button onclick="loadChronicDiseases()">Refresh Disease Data</button>
              <button onclick="addDiseaseTracking()">Add Disease Tracking</button>
            </div>
          </div>
        </div>

        <!-- Infrastructure Tab -->
        <div id="infrastructure-tab" class="tab-content">
          <div class="panel">
            <h3>🏥 Healthcare Infrastructure</h3>
            <div id="infrastructureList">
              <p>Loading healthcare infrastructure data...</p>
            </div>
            <div class="controls">
              <button onclick="loadInfrastructure()">Refresh Infrastructure</button>
              <button onclick="addHealthcareFacility()">Add New Facility</button>
            </div>
          </div>
        </div>

        <!-- Health Policies Tab -->
        <div id="policies-tab" class="tab-content">
          <div class="panel">
            <h3>📋 Health Policy Management</h3>
            <div id="policiesList">
              <p>Loading health policies...</p>
            </div>
            <div class="controls">
              <button onclick="loadHealthPolicies()">Refresh Policies</button>
              <button onclick="createHealthPolicy()">Create New Policy</button>
            </div>
          </div>
        </div>

        <!-- Health Emergencies Tab -->
        <div id="emergencies-tab" class="tab-content">
          <div class="panel">
            <h3>🚨 Health Emergency Management</h3>
            <div id="emergenciesList">
              <p>Loading health emergencies...</p>
            </div>
            <div class="controls">
              <button onclick="loadHealthEmergencies()">Refresh Emergencies</button>
              <button onclick="declareHealthEmergency()">Declare Emergency</button>
            </div>
          </div>
        </div>

        <!-- Health Budget Tab -->
        <div id="budget-tab" class="tab-content">
          <div class="dashboard-grid">
            <div class="panel">
              <h3>💰 Health Budget Overview</h3>
              <div class="metric">
                <span>Total Allocated:</span>
                <span class="metric-value" id="totalHealthBudget">$0</span>
              </div>
              <div class="metric">
                <span>Total Spent:</span>
                <span class="metric-value" id="totalHealthSpent">$0</span>
              </div>
              <div class="metric">
                <span>Remaining Balance:</span>
                <span class="metric-value" id="remainingHealthBudget">$0</span>
              </div>
              <div class="metric">
                <span>Utilization Rate:</span>
                <span class="metric-value" id="healthUtilization">0%</span>
              </div>
              <div class="health-bar">
                <div class="health-fill" id="budgetUtilizationBar" style="width: 0%"></div>
              </div>
            </div>

            <div class="panel">
              <h3>📊 Budget Categories</h3>
              <div id="budgetCategories">
                <p>Loading budget categories...</p>
              </div>
              <div class="controls">
                <button onclick="loadHealthBudget()">Refresh Budget</button>
                <button onclick="allocateBudget()">Allocate Budget</button>
              </div>
            </div>
          </div>
        </div>

        <!-- Health Workflows Tab -->
        <div id="workflows-tab" class="tab-content">
          <div class="panel">
            <h3>⚙️ Health Department Workflows</h3>
            <div id="workflowsList">
              <p>Loading health workflows...</p>
            </div>
            <div class="controls">
              <button onclick="loadHealthWorkflows()">Refresh Workflows</button>
              <button onclick="createHealthWorkflow()">Create New Workflow</button>
            </div>
          </div>
        </div>
      </div>

      <div class="panel" style="margin-top: 20px;">
        <h3>🔧 API Response</h3>
        <pre id="apiResponse">Health & Human Services Department ready. Use the controls above to interact with the Health APIs.</pre>
      </div>
    </div>

    <script>
      let currentCampaignId = 1;
      let currentCivilizationId = 1;
      let currentHealthSecretary = null;
      let currentSurgeonGeneral = null;

      function showTab(tabName) {
        // Hide all tab contents
        document.querySelectorAll('.tab-content').forEach(content => {
          content.classList.remove('active');
        });
        
        // Remove active class from all tab buttons
        document.querySelectorAll('.tab-button').forEach(button => {
          button.classList.remove('active');
        });
        
        // Show selected tab content
        document.getElementById(tabName + '-tab').classList.add('active');
        
        // Add active class to clicked button
        event.target.classList.add('active');
      }

      function updateApiResponse(data) {
        document.getElementById('apiResponse').textContent = JSON.stringify(data, null, 2);
      }

      function showAlert(message, type = 'success') {
        const alertClass = type === 'error' ? 'alert' : 'success';
        const alertDiv = document.createElement('div');
        alertDiv.className = alertClass;
        alertDiv.textContent = message;
        
        // Insert after controls
        const controls = document.querySelector('.controls');
        controls.parentNode.insertBefore(alertDiv, controls.nextSibling);
        
        setTimeout(() => alertDiv.remove(), 5000);
      }

      // Leadership Management Functions
      async function generateHealthSecretary() {
        try {
          const response = await fetch('/api/health/generate/secretary', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
              civilizationName: 'Terran Republic',
              leadershipStyle: 'collaborative'
            })
          });
          
          const data = await response.json();
          updateApiResponse(data);
          
          if (response.ok) {
            currentHealthSecretary = data.secretaryProfile;
            displayHealthSecretary(data.secretaryProfile);
            showAlert('Health Secretary profile generated successfully');
          } else {
            showAlert(\`Error: \${data.error}\`, 'error');
          }
        } catch (error) {
          showAlert(\`Request failed: \${error.message}\`, 'error');
        }
      }

      async function generateSurgeonGeneral() {
        try {
          const response = await fetch('/api/health/generate/surgeon-general', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
              civilizationName: 'Terran Republic',
              healthPriorities: ['pandemic preparedness', 'chronic disease']
            })
          });
          
          const data = await response.json();
          updateApiResponse(data);
          
          if (response.ok) {
            currentSurgeonGeneral = data.surgeonProfile;
            displaySurgeonGeneral(data.surgeonProfile);
            showAlert('Surgeon General profile generated successfully');
          } else {
            showAlert(\`Error: \${data.error}\`, 'error');
          }
        } catch (error) {
          showAlert(\`Request failed: \${error.message}\`, 'error');
        }
      }

      function displayHealthSecretary(secretary) {
        const card = \`
          <div class="character-card">
            <div class="character-name">\${secretary.full_name}</div>
            <div><strong>Leadership Style:</strong> \${secretary.leadership_style}</div>
            <div><strong>Philosophy:</strong> \${secretary.public_health_philosophy}</div>
            <div class="character-details">
              <div>
                <strong>Background:</strong><br>
                \${secretary.background}
              </div>
              <div>
                <strong>Policy Priorities:</strong><br>
                \${secretary.policy_priorities.join(', ')}
              </div>
            </div>
            <div style="margin-top: 15px;">
              <strong>Education:</strong> \${secretary.education}
            </div>
          </div>
        \`;
        document.getElementById('healthSecretaryCard').innerHTML = card;
      }

      function displaySurgeonGeneral(surgeon) {
        const card = \`
          <div class="character-card">
            <div class="character-name">\${surgeon.full_name}, \${surgeon.medical_degree}</div>
            <div><strong>Specialization:</strong> \${surgeon.specialization}</div>
            <div><strong>Witter Handle:</strong> \${surgeon.witter_handle}</div>
            <div class="character-details">
              <div>
                <strong>Background:</strong><br>
                \${surgeon.background}
              </div>
              <div>
                <strong>Medical Expertise:</strong><br>
                \${surgeon.medical_expertise.join(', ')}
              </div>
            </div>
            <div style="margin-top: 15px;">
              <strong>Communication Style:</strong> \${surgeon.communication_style}
            </div>
          </div>
        \`;
        document.getElementById('surgeonGeneralCard').innerHTML = card;
      }

      async function hireHealthSecretary() {
        if (!currentHealthSecretary) {
          showAlert('Please generate a Health Secretary profile first', 'error');
          return;
        }

        try {
          const response = await fetch('/api/health/secretary/hire', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              campaignId: currentCampaignId,
              secretaryData: currentHealthSecretary
            })
          });
          
          const data = await response.json();
          updateApiResponse(data);
          
          if (response.ok) {
            showAlert(data.message);
            document.getElementById('secretaryApproval').textContent = \`\${data.secretary.approval_rating}%\`;
          } else {
            showAlert(\`Error: \${data.error}\`, 'error');
          }
        } catch (error) {
          showAlert(\`Request failed: \${error.message}\`, 'error');
        }
      }

      async function hireSurgeonGeneral() {
        if (!currentSurgeonGeneral) {
          showAlert('Please generate a Surgeon General profile first', 'error');
          return;
        }

        try {
          const response = await fetch('/api/health/surgeon-general/hire', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              campaignId: currentCampaignId,
              surgeonData: {
                ...currentSurgeonGeneral,
                health_secretary_id: 1 // Will be updated with actual secretary ID
              }
            })
          });
          
          const data = await response.json();
          updateApiResponse(data);
          
          if (response.ok) {
            showAlert(data.message);
            document.getElementById('surgeonApproval').textContent = \`\${data.surgeonGeneral.approval_rating}%\`;
          } else {
            showAlert(\`Error: \${data.error}\`, 'error');
          }
        } catch (error) {
          showAlert(\`Request failed: \${error.message}\`, 'error');
        }
      }

      async function loadHealthDashboard() {
        try {
          const response = await fetch(\`/api/health/dashboard/\${currentCampaignId}/\${currentCivilizationId}\`);
          const data = await response.json();
          updateApiResponse(data);
          
          if (response.ok) {
            const dashboard = data.dashboard;
            
            // Update population health metrics
            if (dashboard.populationHealth) {
              document.getElementById('lifeExpectancy').textContent = \`\${dashboard.populationHealth.life_expectancy || 75} years\`;
              document.getElementById('healthcareAccess').textContent = \`\${Math.round(dashboard.populationHealth.healthcare_access_score || 75)}%\`;
              document.getElementById('vaccinationRate').textContent = \`\${Math.round(dashboard.populationHealth.vaccination_rate || 85)}%\`;
              document.getElementById('mentalHealthIndex').textContent = \`\${Math.round(dashboard.populationHealth.mental_health_index || 70)}/100\`;
              document.getElementById('infantMortality').textContent = \`\${dashboard.populationHealth.infant_mortality_rate || 5} per 1000\`;
              document.getElementById('nutritionIndex').textContent = \`\${Math.round(dashboard.populationHealth.nutrition_index || 70)}/100\`;
              document.getElementById('fitnessLevel').textContent = \`\${Math.round(dashboard.populationHealth.fitness_level || 65)}/100\`;
              document.getElementById('airQuality').textContent = \`\${Math.round(dashboard.populationHealth.air_quality_index || 80)}/100\`;
              document.getElementById('waterQuality').textContent = \`\${Math.round(dashboard.populationHealth.water_quality_index || 90)}/100\`;
              document.getElementById('elderCare').textContent = \`\${Math.round(dashboard.populationHealth.elder_care_coverage || 60)}%\`;
              document.getElementById('chronicDisease').textContent = \`\${Math.round(dashboard.populationHealth.chronic_disease_prevalence || 25)}%\`;
              document.getElementById('outbreakRisk').textContent = \`\${Math.round(dashboard.populationHealth.disease_outbreak_risk || 10)}/100\`;
              
              // Update health bar
              const overallHealth = (dashboard.populationHealth.healthcare_access_score || 75);
              document.getElementById('overallHealthBar').style.width = \`\${overallHealth}%\`;
            }
            
            // Update budget metrics
            if (dashboard.budget) {
              document.getElementById('totalHealthBudget').textContent = \`$\${dashboard.budget.totalAllocated.toLocaleString()}\`;
              document.getElementById('totalHealthSpent').textContent = \`$\${dashboard.budget.totalSpent.toLocaleString()}\`;
              document.getElementById('remainingHealthBudget').textContent = \`$\${(dashboard.budget.totalAllocated - dashboard.budget.totalSpent).toLocaleString()}\`;
              document.getElementById('healthUtilization').textContent = \`\${Math.round(dashboard.budget.utilizationRate)}%\`;
              document.getElementById('budgetUtilizationBar').style.width = \`\${Math.min(100, dashboard.budget.utilizationRate)}%\`;
            }
            
            // Update department effectiveness
            const effectiveness = Math.round((dashboard.infrastructure?.averageSatisfaction || 70));
            document.getElementById('departmentEffectiveness').textContent = \`\${effectiveness}%\`;
            
            showAlert('Health dashboard loaded successfully');
          } else {
            showAlert(\`Error: \${data.error}\`, 'error');
          }
        } catch (error) {
          showAlert(\`Request failed: \${error.message}\`, 'error');
        }
      }

      async function initializeHealthData() {
        try {
          // Initialize population health data
          const healthData = {
            total_population: 50000000,
            life_expectancy: 78.5,
            infant_mortality_rate: 4.2,
            chronic_disease_prevalence: 28.5,
            mental_health_index: 72.0,
            vaccination_rate: 87.5,
            healthcare_access_score: 78.0,
            nutrition_index: 71.5,
            fitness_level: 66.0,
            air_quality_index: 82.0,
            water_quality_index: 91.5,
            disease_outbreak_risk: 12.0,
            elder_care_coverage: 65.0,
            healthcare_satisfaction: 74.0
          };

          const response = await fetch(\`/api/health/population/\${currentCampaignId}/\${currentCivilizationId}/update\`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ healthData })
          });
          
          const data = await response.json();
          updateApiResponse(data);
          
          if (response.ok) {
            showAlert('Health data initialized successfully');
            loadHealthDashboard();
          } else {
            showAlert(\`Error: \${data.error}\`, 'error');
          }
        } catch (error) {
          showAlert(\`Request failed: \${error.message}\`, 'error');
        }
      }

      // Initialize event listeners
      document.getElementById('campaignId').addEventListener('change', (e) => {
        currentCampaignId = parseInt(e.target.value);
      });
      
      document.getElementById('civilizationId').addEventListener('change', (e) => {
        currentCivilizationId = parseInt(e.target.value);
      });

      // Placeholder functions for other features
      function fireHealthSecretary() { showAlert('Fire Health Secretary functionality - Coming soon'); }
      function getHealthSecretary() { showAlert('Get Health Secretary functionality - Coming soon'); }
      function fireSurgeonGeneral() { showAlert('Fire Surgeon General functionality - Coming soon'); }
      function getSurgeonGeneral() { showAlert('Get Surgeon General functionality - Coming soon'); }
      function contactHealthSecretary() { showAlert('Contact Health Secretary functionality - Coming soon'); }
      function contactSurgeonGeneral() { showAlert('Contact Surgeon General functionality - Coming soon'); }
      function updatePopulationHealth() { showAlert('Update Population Health functionality - Coming soon'); }
      function loadChronicDiseases() { showAlert('Load Chronic Diseases functionality - Coming soon'); }
      function addDiseaseTracking() { showAlert('Add Disease Tracking functionality - Coming soon'); }
      function loadInfrastructure() { showAlert('Load Infrastructure functionality - Coming soon'); }
      function addHealthcareFacility() { showAlert('Add Healthcare Facility functionality - Coming soon'); }
      function loadHealthPolicies() { showAlert('Load Health Policies functionality - Coming soon'); }
      function createHealthPolicy() { showAlert('Create Health Policy functionality - Coming soon'); }
      function loadHealthEmergencies() { showAlert('Load Health Emergencies functionality - Coming soon'); }
      function declareHealthEmergency() { showAlert('Declare Health Emergency functionality - Coming soon'); }
      function loadHealthBudget() { showAlert('Load Health Budget functionality - Coming soon'); }
      function allocateBudget() { showAlert('Allocate Budget functionality - Coming soon'); }
      function loadHealthWorkflows() { showAlert('Load Health Workflows functionality - Coming soon'); }
      function createHealthWorkflow() { showAlert('Create Health Workflow functionality - Coming soon'); }
      
      // Load initial data
      setTimeout(() => {
        showAlert('Health & Human Services Department ready. Generate leadership to begin.');
      }, 500);
    </script>
  </body>
  </html>`);
});

export default healthDemo;
