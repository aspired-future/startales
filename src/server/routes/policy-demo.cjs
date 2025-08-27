function getPolicyDemo() {
  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Policy Management System - StarTales Demo</title>
  <link href="https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700&family=Roboto:wght@300;400;700&display=swap" rel="stylesheet">
  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }

    body {
      font-family: 'Roboto', sans-serif;
      background: linear-gradient(135deg, #0f0f23 0%, #1a1a2e 50%, #16213e 100%);
      color: #e0e0e0;
      min-height: 100vh;
      overflow-x: hidden;
    }

    .container {
      max-width: 1400px;
      margin: 0 auto;
      padding: 20px;
    }

    .header {
      text-align: center;
      margin-bottom: 30px;
      padding: 20px;
      background: rgba(255, 255, 255, 0.05);
      border-radius: 15px;
      border: 1px solid rgba(187, 134, 252, 0.3);
    }

    .header h1 {
      font-family: 'Orbitron', monospace;
      font-size: 2.5rem;
      color: #bb86fc;
      margin-bottom: 10px;
      text-shadow: 0 0 20px rgba(187, 134, 252, 0.5);
    }

    .header p {
      font-size: 1.1rem;
      color: #a0a0a0;
    }

    .controls {
      display: flex;
      gap: 15px;
      margin-bottom: 30px;
      flex-wrap: wrap;
      justify-content: center;
    }

    .btn {
      background: linear-gradient(135deg, #bb86fc 0%, #6200ea 100%);
      color: white;
      border: none;
      padding: 12px 24px;
      border-radius: 8px;
      cursor: pointer;
      font-weight: 600;
      transition: all 0.3s ease;
      font-size: 14px;
    }

    .btn:hover {
      transform: translateY(-2px);
      box-shadow: 0 8px 25px rgba(187, 134, 252, 0.4);
    }

    .btn.secondary {
      background: linear-gradient(135deg, #03dac6 0%, #018786 100%);
    }

    .btn.danger {
      background: linear-gradient(135deg, #cf6679 0%, #b00020 100%);
    }

    .btn.success {
      background: linear-gradient(135deg, #4caf50 0%, #2e7d32 100%);
    }

    .dashboard {
      display: grid;
      grid-template-columns: 1fr 1fr 1fr;
      gap: 20px;
      margin-bottom: 30px;
    }

    @media (max-width: 1024px) {
      .dashboard {
        grid-template-columns: 1fr 1fr;
      }
    }

    @media (max-width: 768px) {
      .dashboard {
        grid-template-columns: 1fr;
      }
    }

    .card {
      background: rgba(255, 255, 255, 0.08);
      border-radius: 15px;
      padding: 20px;
      border: 1px solid rgba(255, 255, 255, 0.1);
      backdrop-filter: blur(10px);
      transition: all 0.3s ease;
    }

    .card:hover {
      border-color: rgba(187, 134, 252, 0.5);
      box-shadow: 0 8px 32px rgba(187, 134, 252, 0.2);
    }

    .card h3 {
      color: #bb86fc;
      margin-bottom: 15px;
      font-family: 'Orbitron', monospace;
      font-size: 1.2rem;
    }

    .metric {
      display: flex;
      justify-content: space-between;
      margin-bottom: 10px;
      padding: 8px 0;
      border-bottom: 1px solid rgba(255, 255, 255, 0.1);
    }

    .metric:last-child {
      border-bottom: none;
    }

    .metric-label {
      color: #a0a0a0;
    }

    .metric-value {
      color: #03dac6;
      font-weight: 600;
    }

    .policies-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(400px, 1fr));
      gap: 20px;
      margin-top: 20px;
    }

    .policy-card {
      background: rgba(255, 255, 255, 0.08);
      border-radius: 15px;
      padding: 20px;
      border: 1px solid rgba(255, 255, 255, 0.1);
      backdrop-filter: blur(10px);
      transition: all 0.3s ease;
      position: relative;
    }

    .policy-card:hover {
      border-color: rgba(187, 134, 252, 0.5);
      transform: translateY(-5px);
      box-shadow: 0 12px 40px rgba(187, 134, 252, 0.2);
    }

    .policy-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: 15px;
    }

    .policy-title {
      font-family: 'Orbitron', monospace;
      font-size: 1.2rem;
      color: #bb86fc;
      flex: 1;
      margin-right: 10px;
    }

    .policy-status {
      display: flex;
      gap: 5px;
      flex-direction: column;
      align-items: flex-end;
    }

    .status-badge {
      padding: 4px 8px;
      border-radius: 12px;
      font-size: 0.8rem;
      font-weight: 600;
    }

    .status-active {
      background: rgba(76, 175, 80, 0.2);
      color: #4caf50;
      border: 1px solid #4caf50;
    }

    .status-proposed {
      background: rgba(255, 193, 7, 0.2);
      color: #ffc107;
      border: 1px solid #ffc107;
    }

    .status-inactive {
      background: rgba(158, 158, 158, 0.2);
      color: #9e9e9e;
      border: 1px solid #9e9e9e;
    }

    .category-badge {
      background: rgba(3, 218, 198, 0.2);
      color: #03dac6;
      border: 1px solid #03dac6;
      padding: 2px 8px;
      border-radius: 10px;
      font-size: 0.7rem;
      font-weight: 600;
    }

    .policy-body {
      color: #e0e0e0;
      margin-bottom: 15px;
      line-height: 1.5;
      font-size: 0.9rem;
    }

    .policy-meta {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 10px;
      margin-bottom: 15px;
      font-size: 0.8rem;
    }

    .policy-actions {
      display: flex;
      gap: 8px;
      flex-wrap: wrap;
    }

    .btn-small {
      padding: 6px 12px;
      font-size: 0.8rem;
      border-radius: 6px;
    }

    .modifiers-list {
      background: rgba(255, 255, 255, 0.05);
      border-radius: 8px;
      padding: 10px;
      margin-top: 10px;
    }

    .modifier-item {
      display: flex;
      justify-content: space-between;
      padding: 4px 0;
      font-size: 0.8rem;
    }

    .modifier-key {
      color: #a0a0a0;
    }

    .modifier-value {
      color: #03dac6;
      font-weight: 600;
    }

    .votes-display {
      display: flex;
      gap: 10px;
      margin-top: 10px;
      font-size: 0.8rem;
    }

    .vote-item {
      display: flex;
      align-items: center;
      gap: 4px;
    }

    .vote-for { color: #4caf50; }
    .vote-against { color: #f44336; }
    .vote-abstain { color: #ff9800; }

    .loading {
      text-align: center;
      padding: 40px;
      color: #a0a0a0;
    }

    .error {
      background: rgba(207, 102, 121, 0.2);
      border: 1px solid #cf6679;
      color: #cf6679;
      padding: 15px;
      border-radius: 8px;
      margin: 20px 0;
    }

    .success {
      background: rgba(76, 175, 80, 0.2);
      border: 1px solid #4caf50;
      color: #4caf50;
      padding: 15px;
      border-radius: 8px;
      margin: 20px 0;
    }

    .back-link {
      display: inline-block;
      margin-top: 30px;
      color: #03dac6;
      text-decoration: none;
      font-weight: 600;
      transition: color 0.3s ease;
    }

    .back-link:hover {
      color: #bb86fc;
    }

    .modal {
      display: none;
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0, 0, 0, 0.8);
      z-index: 1000;
    }

    .modal-content {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      background: rgba(26, 26, 46, 0.95);
      border-radius: 15px;
      padding: 30px;
      max-width: 600px;
      width: 90%;
      border: 1px solid rgba(187, 134, 252, 0.3);
    }

    .modal h3 {
      color: #bb86fc;
      margin-bottom: 20px;
      font-family: 'Orbitron', monospace;
    }

    .form-group {
      margin-bottom: 20px;
    }

    .form-group label {
      display: block;
      color: #a0a0a0;
      margin-bottom: 5px;
      font-weight: 600;
    }

    .form-group input,
    .form-group textarea,
    .form-group select {
      width: 100%;
      background: rgba(255, 255, 255, 0.1);
      border: 1px solid rgba(255, 255, 255, 0.2);
      border-radius: 8px;
      padding: 12px;
      color: #e0e0e0;
      font-size: 14px;
    }

    .form-group textarea {
      resize: vertical;
      min-height: 100px;
    }

    .modal-actions {
      display: flex;
      gap: 10px;
      justify-content: flex-end;
      margin-top: 20px;
    }

    .close-modal {
      position: absolute;
      top: 15px;
      right: 20px;
      background: none;
      border: none;
      color: #a0a0a0;
      font-size: 24px;
      cursor: pointer;
    }

    .close-modal:hover {
      color: #cf6679;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>🏛️ Policy Management System</h1>
      <p>Create, analyze, and manage galactic policies with AI-powered insights</p>
    </div>

    <div class="controls">
      <button class="btn" onclick="loadPolicies()">📋 Load Policies</button>
      <button class="btn secondary" onclick="loadAnalytics()">📊 Analytics</button>
      <button class="btn secondary" onclick="loadRecommendations()">🤖 AI Recommendations</button>
      <button class="btn secondary" onclick="loadActiveModifiers()">⚙️ Active Modifiers</button>
      <button class="btn success" onclick="showCreatePolicyModal()">➕ Create Policy</button>
    </div>

    <div id="content">
      <div class="loading">
        <p>🏛️ Initializing Policy Management System...</p>
      </div>
    </div>

    <a href="/demo/command-center" class="back-link">← Back to Command Center</a>
  </div>

  <!-- Create Policy Modal -->
  <div id="createPolicyModal" class="modal">
    <div class="modal-content">
      <button class="close-modal" onclick="closeModal('createPolicyModal')">&times;</button>
      <h3>Create New Policy</h3>
      <form id="createPolicyForm">
        <div class="form-group">
          <label for="policyTitle">Policy Title</label>
          <input type="text" id="policyTitle" required>
        </div>
        <div class="form-group">
          <label for="policyCategory">Category</label>
          <select id="policyCategory" required>
            <option value="">Select Category</option>
            <option value="economic">Economic</option>
            <option value="social">Social</option>
            <option value="military">Military</option>
            <option value="research">Research</option>
            <option value="environmental">Environmental</option>
            <option value="diplomatic">Diplomatic</option>
            <option value="infrastructure">Infrastructure</option>
            <option value="education">Education</option>
            <option value="healthcare">Healthcare</option>
            <option value="security">Security</option>
          </select>
        </div>
        <div class="form-group">
          <label for="policyBody">Policy Description</label>
          <textarea id="policyBody" placeholder="Describe the policy objectives, implementation details, and expected outcomes..." required></textarea>
        </div>
        <div class="form-group">
          <label for="policyScope">Scope</label>
          <select id="policyScope">
            <option value="galactic">Galactic</option>
            <option value="system">Star System</option>
            <option value="planet">Planetary</option>
            <option value="city">City</option>
          </select>
        </div>
        <div class="form-group">
          <label for="policyAuthor">Author</label>
          <input type="text" id="policyAuthor" value="Policy Department">
        </div>
        <div class="modal-actions">
          <button type="button" class="btn" onclick="closeModal('createPolicyModal')">Cancel</button>
          <button type="submit" class="btn success">Create Policy</button>
        </div>
      </form>
    </div>
  </div>

  <script>
    let policiesData = [];
    let analyticsData = null;
    let recommendationsData = [];
    let activeModifiersData = [];

    // Initialize the demo
    document.addEventListener('DOMContentLoaded', function() {
      loadAnalytics();
    });

    async function loadPolicies(status = null, category = null) {
      try {
        showLoading('Loading policies...');
        
        let url = '/api/policies';
        const params = new URLSearchParams();
        if (status) params.append('status', status);
        if (category) params.append('category', category);
        if (params.toString()) url += '?' + params.toString();
        
        const response = await fetch(url);
        const data = await response.json();
        policiesData = data.policies;
        displayPolicies();
      } catch (error) {
        showError('Failed to load policies: ' + error.message);
      }
    }

    async function loadAnalytics() {
      try {
        showLoading('Loading policy analytics...');
        const response = await fetch('/api/policies/analytics');
        analyticsData = await response.json();
        displayAnalytics();
      } catch (error) {
        showError('Failed to load analytics: ' + error.message);
      }
    }

    async function loadRecommendations() {
      try {
        showLoading('Generating AI recommendations...');
        const response = await fetch('/api/policies/recommendations', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            gameState: {
              economicOutput: 750000,
              approvalRating: 65,
              researchOutput: 8500,
              militaryStrength: 1200
            }
          })
        });
        const data = await response.json();
        recommendationsData = data.recommendations;
        displayRecommendations();
      } catch (error) {
        showError('Failed to load recommendations: ' + error.message);
      }
    }

    async function loadActiveModifiers() {
      try {
        showLoading('Loading active modifiers...');
        const response = await fetch('/api/policies/active');
        activeModifiersData = await response.json();
        displayActiveModifiers();
      } catch (error) {
        showError('Failed to load active modifiers: ' + error.message);
      }
    }

    function displayAnalytics() {
      if (!analyticsData) return;

      const analytics = analyticsData.analytics;
      const content = document.getElementById('content');
      content.innerHTML = \`
        <div class="dashboard">
          <div class="card">
            <h3>📊 Policy Overview</h3>
            <div class="metric">
              <span class="metric-label">Total Policies</span>
              <span class="metric-value">\${analytics.totalPolicies}</span>
            </div>
            <div class="metric">
              <span class="metric-label">Active Policies</span>
              <span class="metric-value">\${analytics.activePolicies}</span>
            </div>
            <div class="metric">
              <span class="metric-label">Proposed Policies</span>
              <span class="metric-value">\${analytics.proposedPolicies}</span>
            </div>
            <div class="metric">
              <span class="metric-label">Inactive Policies</span>
              <span class="metric-value">\${analytics.inactivePolicies}</span>
            </div>
            <div class="metric">
              <span class="metric-label">Active Modifiers</span>
              <span class="metric-value">\${analytics.activeModifiers}</span>
            </div>
          </div>

          <div class="card">
            <h3>📈 Category Breakdown</h3>
            \${Object.entries(analytics.categoryBreakdown).map(([category, count]) => \`
              <div class="metric">
                <span class="metric-label">\${category.charAt(0).toUpperCase() + category.slice(1)}</span>
                <span class="metric-value">\${count}</span>
              </div>
            \`).join('')}
          </div>

          <div class="card">
            <h3>📋 Recent Activity</h3>
            \${analytics.recentActivity.length > 0 ? analytics.recentActivity.map(activity => \`
              <div class="metric">
                <span class="metric-label">\${activity.action}: \${activity.policyTitle}</span>
                <span class="metric-value">\${new Date(activity.timestamp).toLocaleDateString()}</span>
              </div>
            \`).join('') : '<p style="color: #a0a0a0;">No recent activity</p>'}
          </div>
        </div>

        <div class="controls" style="justify-content: center; margin-top: 20px;">
          <button class="btn secondary" onclick="loadPolicies()">View All Policies</button>
          <button class="btn secondary" onclick="loadPolicies('active')">Active Policies</button>
          <button class="btn secondary" onclick="loadPolicies('proposed')">Proposed Policies</button>
        </div>
      \`;
    }

    function displayPolicies() {
      const content = document.getElementById('content');
      content.innerHTML = \`
        <div class="card">
          <h3>📋 Policies (\${policiesData.length} policies)</h3>
          <div class="policies-grid">
            \${policiesData.map(policy => \`
              <div class="policy-card">
                <div class="policy-header">
                  <div class="policy-title">\${policy.title}</div>
                  <div class="policy-status">
                    <span class="status-badge status-\${policy.status}">\${policy.status.toUpperCase()}</span>
                    <span class="category-badge">\${policy.category}</span>
                  </div>
                </div>
                
                <div class="policy-body">\${policy.body}</div>
                
                <div class="policy-meta">
                  <div class="metric">
                    <span class="metric-label">Author</span>
                    <span class="metric-value">\${policy.author}</span>
                  </div>
                  <div class="metric">
                    <span class="metric-label">Scope</span>
                    <span class="metric-value">\${policy.scope}</span>
                  </div>
                  <div class="metric">
                    <span class="metric-label">Created</span>
                    <span class="metric-value">\${new Date(policy.created).toLocaleDateString()}</span>
                  </div>
                  <div class="metric">
                    <span class="metric-label">Priority</span>
                    <span class="metric-value">\${policy.priority || 'medium'}</span>
                  </div>
                </div>

                \${Object.keys(policy.modifiers || {}).length > 0 ? \`
                  <div class="modifiers-list">
                    <strong style="color: #bb86fc;">Policy Modifiers:</strong>
                    \${Object.entries(policy.modifiers).map(([key, value]) => \`
                      <div class="modifier-item">
                        <span class="modifier-key">\${key.replace(/_/g, ' ')}</span>
                        <span class="modifier-value">\${typeof value === 'number' ? (value > 1 ? '+' + ((value - 1) * 100).toFixed(1) + '%' : (value * 100).toFixed(1) + '%') : value}</span>
                      </div>
                    \`).join('')}
                  </div>
                \` : ''}

                <div class="votes-display">
                  <div class="vote-item vote-for">
                    👍 \${policy.votes.for}
                  </div>
                  <div class="vote-item vote-against">
                    👎 \${policy.votes.against}
                  </div>
                  <div class="vote-item vote-abstain">
                    🤷 \${policy.votes.abstain}
                  </div>
                </div>

                <div class="policy-actions">
                  \${policy.status === 'proposed' ? \`
                    <button class="btn btn-small success" onclick="activatePolicy('\${policy.id}')">✅ Activate</button>
                  \` : ''}
                  \${policy.status === 'active' ? \`
                    <button class="btn btn-small danger" onclick="deactivatePolicy('\${policy.id}')">⏸️ Deactivate</button>
                  \` : ''}
                  <button class="btn btn-small secondary" onclick="simulatePolicy('\${policy.id}')">🔬 Simulate</button>
                  <button class="btn btn-small secondary" onclick="voteOnPolicy('\${policy.id}', 'for')">👍 Vote For</button>
                  <button class="btn btn-small secondary" onclick="voteOnPolicy('\${policy.id}', 'against')">👎 Vote Against</button>
                </div>
              </div>
            \`).join('')}
          </div>
        </div>
      \`;
    }

    function displayRecommendations() {
      const content = document.getElementById('content');
      content.innerHTML = \`
        <div class="card">
          <h3>🤖 AI Policy Recommendations</h3>
          \${recommendationsData.length > 0 ? \`
            <div class="policies-grid">
              \${recommendationsData.map(rec => \`
                <div class="policy-card">
                  <div class="policy-header">
                    <div class="policy-title">\${rec.title}</div>
                    <div class="policy-status">
                      <span class="status-badge status-proposed">RECOMMENDED</span>
                      <span class="category-badge">\${rec.category}</span>
                    </div>
                  </div>
                  
                  <div class="policy-body">\${rec.reasoning}</div>
                  
                  <div class="policy-meta">
                    <div class="metric">
                      <span class="metric-label">Priority</span>
                      <span class="metric-value">\${rec.priority}</span>
                    </div>
                  </div>

                  \${rec.suggestedModifiers ? \`
                    <div class="modifiers-list">
                      <strong style="color: #bb86fc;">Suggested Modifiers:</strong>
                      \${Object.entries(rec.suggestedModifiers).map(([key, value]) => \`
                        <div class="modifier-item">
                          <span class="modifier-key">\${key.replace(/_/g, ' ')}</span>
                          <span class="modifier-value">\${typeof value === 'number' ? (value > 1 ? '+' + ((value - 1) * 100).toFixed(1) + '%' : (value * 100).toFixed(1) + '%') : value}</span>
                        </div>
                      \`).join('')}
                    </div>
                  \` : ''}

                  \${rec.estimatedImpact ? \`
                    <div class="modifiers-list">
                      <strong style="color: #03dac6;">Estimated Impact:</strong>
                      \${Object.entries(rec.estimatedImpact).map(([key, value]) => \`
                        <div class="modifier-item">
                          <span class="modifier-key">\${key.replace(/([A-Z])/g, ' $1').toLowerCase()}</span>
                          <span class="modifier-value">\${typeof value === 'number' ? (value > 1 ? value.toLocaleString() : (value * 100).toFixed(1) + '%') : value}</span>
                        </div>
                      \`).join('')}
                    </div>
                  \` : ''}

                  <div class="policy-actions">
                    <button class="btn btn-small success" onclick="implementRecommendation('\${rec.id}')">✅ Implement</button>
                    <button class="btn btn-small secondary" onclick="customizeRecommendation('\${rec.id}')">✏️ Customize</button>
                  </div>
                </div>
              \`).join('')}
            </div>
          \` : '<p style="color: #a0a0a0; text-align: center; padding: 40px;">No recommendations available at this time.</p>'}
        </div>
      \`;
    }

    function displayActiveModifiers() {
      const content = document.getElementById('content');
      content.innerHTML = \`
        <div class="card">
          <h3>⚙️ Active Policy Modifiers</h3>
          \${activeModifiersData.modifiers && activeModifiersData.modifiers.length > 0 ? \`
            <div class="modifiers-list">
              \${activeModifiersData.modifiers.map(modifier => \`
                <div class="modifier-item">
                  <span class="modifier-key">\${modifier.key.replace(/_/g, ' ')} (from \${modifier.policyTitle})</span>
                  <span class="modifier-value">\${typeof modifier.value === 'number' ? (modifier.value > 1 ? '+' + ((modifier.value - 1) * 100).toFixed(1) + '%' : (modifier.value * 100).toFixed(1) + '%') : modifier.value}</span>
                </div>
              \`).join('')}
            </div>
            
            <div class="dashboard" style="margin-top: 20px;">
              <div class="card">
                <h3>📊 Active Policies</h3>
                \${activeModifiersData.activePolicies.map(policy => \`
                  <div class="metric">
                    <span class="metric-label">\${policy.title}</span>
                    <span class="metric-value">\${policy.category}</span>
                  </div>
                \`).join('')}
              </div>
            </div>
          \` : '<p style="color: #a0a0a0; text-align: center; padding: 40px;">No active modifiers currently in effect.</p>'}
        </div>
      \`;
    }

    async function activatePolicy(policyId) {
      try {
        const response = await fetch(\`/api/policies/\${policyId}/activate\`, { method: 'POST' });
        const result = await response.json();
        if (result.policy) {
          showMessage(\`Policy "\${result.policy.title}" activated successfully!\`, 'success');
          loadPolicies(); // Refresh the display
        } else {
          showMessage('Failed to activate policy', 'error');
        }
      } catch (error) {
        showMessage('Error activating policy: ' + error.message, 'error');
      }
    }

    async function deactivatePolicy(policyId) {
      try {
        const response = await fetch(\`/api/policies/\${policyId}/deactivate\`, { method: 'POST' });
        const result = await response.json();
        if (result.policy) {
          showMessage(\`Policy "\${result.policy.title}" deactivated successfully!\`, 'success');
          loadPolicies(); // Refresh the display
        } else {
          showMessage('Failed to deactivate policy', 'error');
        }
      } catch (error) {
        showMessage('Error deactivating policy: ' + error.message, 'error');
      }
    }

    async function simulatePolicy(policyId) {
      try {
        const response = await fetch(\`/api/policies/\${policyId}/simulate\`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            gameState: {
              economicOutput: 750000,
              approvalRating: 65,
              researchOutput: 8500,
              militaryStrength: 1200
            }
          })
        });
        const result = await response.json();
        
        let impactText = 'Simulation Results:\\n';
        Object.entries(result.simulatedImpact).forEach(([key, value]) => {
          impactText += \`• \${key.replace(/([A-Z])/g, ' $1')}: \${typeof value === 'number' ? (value > 1 ? value.toLocaleString() : (value * 100).toFixed(1) + '%') : value}\\n\`;
        });
        
        alert(impactText);
      } catch (error) {
        showMessage('Error simulating policy: ' + error.message, 'error');
      }
    }

    async function voteOnPolicy(policyId, vote) {
      try {
        const response = await fetch(\`/api/policies/\${policyId}/vote\`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ vote, voter: 'Demo User' })
        });
        const result = await response.json();
        if (result.policy) {
          showMessage(\`Vote "\${vote}" recorded for "\${result.policy.title}"!\`, 'success');
          loadPolicies(); // Refresh the display
        } else {
          showMessage('Failed to record vote', 'error');
        }
      } catch (error) {
        showMessage('Error recording vote: ' + error.message, 'error');
      }
    }

    function showCreatePolicyModal() {
      document.getElementById('createPolicyModal').style.display = 'block';
    }

    function closeModal(modalId) {
      document.getElementById(modalId).style.display = 'none';
    }

    // Handle create policy form submission
    document.getElementById('createPolicyForm').addEventListener('submit', async function(e) {
      e.preventDefault();
      
      try {
        const formData = {
          title: document.getElementById('policyTitle').value,
          body: document.getElementById('policyBody').value,
          category: document.getElementById('policyCategory').value,
          scope: document.getElementById('policyScope').value,
          author: document.getElementById('policyAuthor').value
        };
        
        const response = await fetch('/api/policies', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData)
        });
        
        const result = await response.json();
        if (result.policy) {
          showMessage(\`Policy "\${result.policy.title}" created successfully!\`, 'success');
          closeModal('createPolicyModal');
          document.getElementById('createPolicyForm').reset();
          loadPolicies(); // Refresh the display
        } else {
          showMessage('Failed to create policy', 'error');
        }
      } catch (error) {
        showMessage('Error creating policy: ' + error.message, 'error');
      }
    });

    function showLoading(message) {
      document.getElementById('content').innerHTML = \`
        <div class="loading">
          <p>🏛️ \${message}</p>
        </div>
      \`;
    }

    function showError(message) {
      document.getElementById('content').innerHTML = \`
        <div class="error">
          <p>❌ \${message}</p>
        </div>
      \`;
    }

    function showMessage(message, type) {
      const messageDiv = document.createElement('div');
      messageDiv.className = type;
      messageDiv.innerHTML = \`<p>\${message}</p>\`;
      
      const container = document.querySelector('.container');
      container.insertBefore(messageDiv, container.firstChild);
      
      setTimeout(() => {
        messageDiv.remove();
      }, 5000);
    }
  </script>
</body>
</html>`;
}

module.exports = { getPolicyDemo };

