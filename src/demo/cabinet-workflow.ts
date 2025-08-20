import express from 'express';

const router = express.Router();

router.get('/cabinet-workflow', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html>
    <head>
      <title>Cabinet Workflow Automation - Demo</title>
      <style>
        body { 
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; 
          margin: 0; 
          padding: 20px; 
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          min-height: 100vh;
        }
        .container { 
          max-width: 1400px; 
          margin: 0 auto; 
          background: white; 
          border-radius: 12px; 
          box-shadow: 0 20px 40px rgba(0,0,0,0.1);
          overflow: hidden;
        }
        .header { 
          background: linear-gradient(135deg, #2c3e50 0%, #34495e 100%); 
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
        }
        .nav-tab {
          padding: 15px 25px;
          cursor: pointer;
          border: none;
          background: none;
          font-size: 16px;
          color: #495057;
          border-bottom: 3px solid transparent;
          transition: all 0.3s;
        }
        .nav-tab:hover {
          background: #e9ecef;
          color: #2c3e50;
        }
        .nav-tab.active {
          color: #2c3e50;
          border-bottom-color: #667eea;
          background: white;
        }
        .tab-content {
          display: none;
          padding: 30px;
        }
        .tab-content.active {
          display: block;
        }
        .workflow-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
          gap: 20px;
          margin-bottom: 30px;
        }
        .workflow-card {
          background: #f8f9fa;
          border-radius: 8px;
          padding: 20px;
          border-left: 4px solid #667eea;
        }
        .workflow-card h3 {
          margin: 0 0 10px 0;
          color: #2c3e50;
        }
        .workflow-card .status {
          display: inline-block;
          padding: 4px 12px;
          border-radius: 20px;
          font-size: 12px;
          font-weight: 600;
          text-transform: uppercase;
          margin-bottom: 10px;
        }
        .status.active { background: #d4edda; color: #155724; }
        .status.running { background: #fff3cd; color: #856404; }
        .status.completed { background: #cce7ff; color: #004085; }
        .status.failed { background: #f8d7da; color: #721c24; }
        .controls {
          display: flex;
          gap: 10px;
          margin: 20px 0;
          flex-wrap: wrap;
        }
        .btn {
          padding: 10px 20px;
          border: none;
          border-radius: 6px;
          cursor: pointer;
          font-size: 14px;
          font-weight: 500;
          transition: all 0.3s;
          text-decoration: none;
          display: inline-block;
        }
        .btn-primary {
          background: #667eea;
          color: white;
        }
        .btn-primary:hover {
          background: #5a6fd8;
          transform: translateY(-1px);
        }
        .btn-success {
          background: #28a745;
          color: white;
        }
        .btn-success:hover {
          background: #218838;
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
        .form-group {
          margin-bottom: 20px;
        }
        .form-group label {
          display: block;
          margin-bottom: 5px;
          font-weight: 500;
          color: #2c3e50;
        }
        .form-group input, .form-group select, .form-group textarea {
          width: 100%;
          padding: 10px;
          border: 1px solid #ced4da;
          border-radius: 4px;
          font-size: 14px;
        }
        .form-group textarea {
          height: 100px;
          resize: vertical;
        }
        .message-thread {
          background: #f8f9fa;
          border-radius: 8px;
          padding: 20px;
          margin-bottom: 20px;
        }
        .message {
          background: white;
          border-radius: 6px;
          padding: 15px;
          margin-bottom: 10px;
          border-left: 4px solid #667eea;
        }
        .message-header {
          font-weight: 600;
          color: #2c3e50;
          margin-bottom: 5px;
        }
        .coordination-item {
          background: white;
          border-radius: 8px;
          padding: 20px;
          margin-bottom: 15px;
          border: 1px solid #dee2e6;
          box-shadow: 0 2px 4px rgba(0,0,0,0.05);
        }
        .coordination-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 15px;
        }
        .coordination-title {
          font-weight: 600;
          color: #2c3e50;
          margin: 0;
        }
        .priority {
          padding: 4px 8px;
          border-radius: 12px;
          font-size: 11px;
          font-weight: 600;
          text-transform: uppercase;
        }
        .priority.high { background: #f8d7da; color: #721c24; }
        .priority.medium { background: #fff3cd; color: #856404; }
        .priority.low { background: #d4edda; color: #155724; }
        .priority.critical { background: #d1ecf1; color: #0c5460; }
        .response-list {
          margin-top: 15px;
        }
        .response-item {
          background: #f8f9fa;
          border-radius: 4px;
          padding: 10px;
          margin-bottom: 8px;
          border-left: 3px solid #28a745;
        }
        .response-header {
          font-weight: 500;
          color: #2c3e50;
          margin-bottom: 5px;
        }
        .step-timeline {
          position: relative;
          padding-left: 30px;
        }
        .step-timeline::before {
          content: '';
          position: absolute;
          left: 15px;
          top: 0;
          bottom: 0;
          width: 2px;
          background: #dee2e6;
        }
        .timeline-item {
          position: relative;
          margin-bottom: 20px;
          background: white;
          border-radius: 8px;
          padding: 15px;
          box-shadow: 0 2px 4px rgba(0,0,0,0.05);
        }
        .timeline-item::before {
          content: '';
          position: absolute;
          left: -22px;
          top: 20px;
          width: 12px;
          height: 12px;
          border-radius: 50%;
          background: #667eea;
          border: 3px solid white;
          box-shadow: 0 0 0 2px #667eea;
        }
        .timeline-item.completed::before {
          background: #28a745;
          box-shadow: 0 0 0 2px #28a745;
        }
        .timeline-item.failed::before {
          background: #dc3545;
          box-shadow: 0 0 0 2px #dc3545;
        }
        .step-header {
          font-weight: 600;
          color: #2c3e50;
          margin-bottom: 8px;
        }
        .step-meta {
          font-size: 12px;
          color: #6c757d;
          margin-bottom: 10px;
        }
        .api-endpoint {
          background: #f8f9fa;
          border: 1px solid #dee2e6;
          border-radius: 4px;
          padding: 15px;
          margin: 10px 0;
          font-family: 'Monaco', 'Menlo', monospace;
          font-size: 13px;
        }
        .method {
          display: inline-block;
          padding: 2px 6px;
          border-radius: 3px;
          font-weight: 600;
          font-size: 11px;
          margin-right: 8px;
        }
        .method.get { background: #d4edda; color: #155724; }
        .method.post { background: #cce7ff; color: #004085; }
        .method.put { background: #fff3cd; color: #856404; }
        .method.delete { background: #f8d7da; color: #721c24; }
        .stats-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 20px;
          margin-bottom: 30px;
        }
        .stat-card {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          padding: 20px;
          border-radius: 8px;
          text-align: center;
        }
        .stat-value {
          font-size: 2.5em;
          font-weight: 300;
          margin-bottom: 5px;
        }
        .stat-label {
          font-size: 0.9em;
          opacity: 0.9;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>🤖 Cabinet Workflow Automation</h1>
          <p>Automated decision-making, policy implementation, and inter-department coordination</p>
        </div>

        <div class="nav-tabs">
          <button class="nav-tab active" onclick="showTab('overview')">Overview</button>
          <button class="nav-tab" onclick="showTab('workflows')">Active Workflows</button>
          <button class="nav-tab" onclick="showTab('coordination')">Department Coordination</button>
          <button class="nav-tab" onclick="showTab('messages')">Inter-Department Messages</button>
          <button class="nav-tab" onclick="showTab('templates')">Workflow Templates</button>
          <button class="nav-tab" onclick="showTab('api')">API Reference</button>
        </div>

        <div id="overview" class="tab-content active">
          <h2>🎯 System Overview</h2>
          
          <div class="stats-grid">
            <div class="stat-card">
              <div class="stat-value">12</div>
              <div class="stat-label">Active Workflows</div>
            </div>
            <div class="stat-card">
              <div class="stat-value">47</div>
              <div class="stat-label">Completed Today</div>
            </div>
            <div class="stat-card">
              <div class="stat-value">6</div>
              <div class="stat-label">Departments Coordinated</div>
            </div>
            <div class="stat-card">
              <div class="stat-value">98.5%</div>
              <div class="stat-label">Success Rate</div>
            </div>
          </div>

          <h3>🔄 Recent Workflow Activity</h3>
          <div class="workflow-grid">
            <div class="workflow-card">
              <div class="status running">Running</div>
              <h3>Budget Coordination FY2157</h3>
              <p><strong>Progress:</strong> Step 2/4 - Analyzing Budget Requests</p>
              <p><strong>Departments:</strong> Treasury, Defense, State, Interior, Justice, Commerce, Science, Communications</p>
              <p><strong>ETA:</strong> 45 minutes remaining</p>
            </div>
            
            <div class="workflow-card">
              <div class="status completed">Completed</div>
              <h3>Policy Implementation: Trade Regulations</h3>
              <p><strong>Duration:</strong> 2h 15m</p>
              <p><strong>Departments:</strong> Commerce, State, Treasury, Science</p>
              <p><strong>Result:</strong> Successfully implemented across all systems</p>
            </div>
            
            <div class="workflow-card">
              <div class="status active">Ready</div>
              <h3>Crisis Response: Asteroid Mining Dispute</h3>
              <p><strong>Trigger:</strong> Diplomatic incident detected</p>
              <p><strong>Priority:</strong> High</p>
              <p><strong>Departments:</strong> Defense, State, Interior, Communications</p>
            </div>
          </div>

          <h3>🏛️ Department Coordination Status</h3>
          <div class="coordination-item">
            <div class="coordination-header">
              <h4 class="coordination-title">Defense-Treasury Budget Sync</h4>
              <span class="priority high">High Priority</span>
            </div>
            <p>Coordinating military procurement budget with Treasury oversight requirements.</p>
            <div class="response-list">
              <div class="response-item">
                <div class="response-header">Defense Secretary Response</div>
                <p>Submitted Q2 procurement requirements: 2.4B credits for fleet modernization</p>
              </div>
              <div class="response-item">
                <div class="response-header">Treasury Secretary Response</div>
                <p>Budget analysis complete. Recommending phased implementation over 18 months</p>
              </div>
            </div>
          </div>
        </div>

        <div id="workflows" class="tab-content">
          <h2>⚙️ Active Workflow Instances</h2>
          
          <div class="controls">
            <button class="btn btn-primary" onclick="startWorkflow()">Start New Workflow</button>
            <button class="btn btn-success" onclick="refreshWorkflows()">Refresh Status</button>
          </div>

          <div class="workflow-card">
            <div class="status running">Running</div>
            <h3>Budget Coordination FY2157</h3>
            <p><strong>Instance ID:</strong> wf-budget-2157-001</p>
            <p><strong>Started:</strong> 2157-03-15 14:30:00</p>
            <p><strong>Priority:</strong> High</p>
            
            <div class="step-timeline">
              <div class="timeline-item completed">
                <div class="step-header">1. Collect Budget Requests</div>
                <div class="step-meta">Completed in 45 minutes • Automated</div>
                <p>Successfully collected budget requests from all 6 departments</p>
              </div>
              
              <div class="timeline-item">
                <div class="step-header">2. Analyze Budget Requests</div>
                <div class="step-meta">In Progress • Automated • Treasury</div>
                <p>Analyzing and prioritizing budget requests. Current progress: 67%</p>
              </div>
              
              <div class="timeline-item">
                <div class="step-header">3. Budget Approval</div>
                <div class="step-meta">Pending • Manual Approval • Treasury Secretary</div>
                <p>Awaiting Treasury Secretary review and approval</p>
              </div>
              
              <div class="timeline-item">
                <div class="step-header">4. Distribute Budget</div>
                <div class="step-meta">Queued • Automated • Treasury</div>
                <p>Will distribute approved budget to all departments</p>
              </div>
            </div>
            
            <div class="controls">
              <button class="btn btn-warning" onclick="pauseWorkflow('wf-budget-2157-001')">Pause</button>
              <button class="btn btn-danger" onclick="cancelWorkflow('wf-budget-2157-001')">Cancel</button>
            </div>
          </div>
        </div>

        <div id="coordination" class="tab-content">
          <h2>🤝 Department Coordination</h2>
          
          <div class="controls">
            <button class="btn btn-primary" onclick="initiateCoordination()">Initiate Coordination</button>
            <button class="btn btn-success" onclick="refreshCoordination()">Refresh</button>
          </div>

          <div class="coordination-item">
            <div class="coordination-header">
              <h4 class="coordination-title">Military Readiness Assessment</h4>
              <span class="priority critical">Critical</span>
            </div>
            <p><strong>Initiated by:</strong> Defense Secretary</p>
            <p><strong>Target Departments:</strong> Treasury, Interior, State, Communications</p>
            <p><strong>Deadline:</strong> 2157-03-16 18:00:00</p>
            <p>Coordinating assessment of military readiness across all sectors following recent intelligence reports.</p>
            
            <div class="response-list">
              <div class="response-item">
                <div class="response-header">Treasury - Responded</div>
                <p>Budget allocation for emergency military preparations: 500M credits approved</p>
              </div>
              <div class="response-item">
                <div class="response-header">Interior - Pending</div>
                <p>Awaiting infrastructure security assessment</p>
              </div>
              <div class="response-item">
                <div class="response-header">State - Responded</div>
                <p>Diplomatic channels secured. No immediate external threats detected</p>
              </div>
              
              <div class="response-item">
                <div class="response-header">Science - Responded</div>
                <p>Research facilities secured. Critical experiments protected. Technology assets inventoried.</p>
              </div>
            </div>
            
            <div class="controls">
              <button class="btn btn-primary" onclick="respondToCoordination('coord-001')">Add Response</button>
              <button class="btn btn-warning" onclick="escalateCoordination('coord-001')">Escalate</button>
            </div>
          </div>
        </div>

        <div id="messages" class="tab-content">
          <h2>📨 Inter-Department Messages</h2>
          
          <div class="controls">
            <button class="btn btn-primary" onclick="composeMessage()">Compose Message</button>
            <button class="btn btn-success" onclick="refreshMessages()">Refresh</button>
          </div>

          <div class="message-thread">
            <h3>Trade Policy Update - Urgent</h3>
            <p><strong>Thread ID:</strong> msg-thread-001</p>
            
            <div class="message">
              <div class="message-header">Commerce Secretary → State, Treasury</div>
              <p><strong>Subject:</strong> New Interstellar Trade Regulations</p>
              <p>Colleagues, we need to implement new trade regulations following the Galactic Trade Council's latest directive. This affects tariff structures and diplomatic trade agreements.</p>
              <p><strong>Requires Response by:</strong> 2157-03-16 12:00:00</p>
            </div>
            
            <div class="message">
              <div class="message-header">State Secretary → Commerce, Treasury</div>
              <p><strong>Re:</strong> New Interstellar Trade Regulations</p>
              <p>Commerce team, I've reviewed the diplomatic implications. We'll need to renegotiate 3 existing trade agreements. Treasury, please assess the revenue impact.</p>
            </div>
            
            <div class="message">
              <div class="message-header">Treasury Secretary → Commerce, State</div>
              <p><strong>Re:</strong> New Interstellar Trade Regulations</p>
              <p>Initial analysis shows 12% reduction in tariff revenue, but increased trade volume should offset this within 6 months. Recommend proceeding with implementation.</p>
            </div>
            
            <div class="message">
              <div class="message-header">Communications Secretary → All Departments</div>
              <p><strong>Re:</strong> Media Strategy Coordination</p>
              <p>Press conference scheduled for tomorrow 14:00 regarding trade policy changes. All departments should prepare talking points for potential media inquiries. Science and Commerce departments should coordinate on technology transfer implications.</p>
            </div>
          </div>

          <div class="form-group">
            <label>Compose New Message</label>
            <select>
              <option>Select Sender Department</option>
              <option>Treasury</option>
              <option>Defense</option>
              <option>State</option>
              <option>Interior</option>
              <option>Justice</option>
              <option>Commerce</option>
              <option>Science</option>
              <option>Communications</option>
            </select>
          </div>
          
          <div class="form-group">
            <label>Recipients</label>
            <select multiple>
              <option>Treasury</option>
              <option>Defense</option>
              <option>State</option>
              <option>Interior</option>
              <option>Justice</option>
              <option>Commerce</option>
              <option>Science</option>
              <option>Communications</option>
            </select>
          </div>
          
          <div class="form-group">
            <label>Subject</label>
            <input type="text" placeholder="Message subject">
          </div>
          
          <div class="form-group">
            <label>Message</label>
            <textarea placeholder="Type your message here..."></textarea>
          </div>
          
          <div class="controls">
            <button class="btn btn-primary">Send Message</button>
            <button class="btn btn-warning">Save Draft</button>
          </div>
        </div>

        <div id="templates" class="tab-content">
          <h2>📋 Workflow Templates</h2>
          
          <div class="workflow-grid">
            <div class="workflow-card">
              <h3>🚨 Crisis Response</h3>
              <p>Automated crisis response workflow for emergency situations</p>
              <p><strong>Steps:</strong> 4 • <strong>Duration:</strong> ~2 hours</p>
              <p><strong>Departments:</strong> Defense, Treasury, Interior, Justice, State, Commerce, Science, Communications</p>
              <div class="controls">
                <button class="btn btn-danger" onclick="startCrisisResponse()">Start Crisis Response</button>
              </div>
            </div>
            
            <div class="workflow-card">
              <h3>🔬 Research Project Coordination</h3>
              <p>Multi-department research initiatives with budget and security oversight</p>
              <p><strong>Steps:</strong> 4 • <strong>Duration:</strong> ~5 hours</p>
              <p><strong>Departments:</strong> Science, Treasury, Defense, Communications</p>
              <div class="controls">
                <button class="btn btn-primary" onclick="startResearchCoordination()">Start Research Project</button>
              </div>
            </div>
            
            <div class="workflow-card">
              <h3>📡 Crisis Communication Response</h3>
              <p>Government-wide crisis communication across all departments</p>
              <p><strong>Steps:</strong> 6 • <strong>Duration:</strong> ~2.25 hours</p>
              <p><strong>Departments:</strong> Communications, Defense, State, Interior, Science</p>
              <div class="controls">
                <button class="btn btn-warning" onclick="startCrisisCommunication()">Start Crisis Communication</button>
              </div>
            </div>
            
            <div class="workflow-card">
              <h3>🎯 Scientific Discovery Announcement</h3>
              <p>Coordinate announcement of major scientific discoveries with appropriate messaging</p>
              <p><strong>Steps:</strong> 4 • <strong>Duration:</strong> ~7.5 hours</p>
              <p><strong>Departments:</strong> Science, Communications, State, Commerce</p>
              <div class="controls">
                <button class="btn btn-success" onclick="startDiscoveryAnnouncement()">Start Discovery Process</button>
              </div>
            </div>
            
            <div class="workflow-card">
              <h3>📜 Policy Implementation</h3>
              <p>Systematic policy rollout across all affected departments</p>
              <p><strong>Steps:</strong> 4 • <strong>Duration:</strong> ~3 hours</p>
              <p><strong>Departments:</strong> Variable based on policy scope</p>
              <div class="controls">
                <button class="btn btn-primary" onclick="startPolicyImplementation()">Start Implementation</button>
              </div>
            </div>
            
            <div class="workflow-card">
              <h3>💰 Budget Coordination</h3>
              <p>Annual budget planning and allocation workflow</p>
              <p><strong>Steps:</strong> 4 • <strong>Duration:</strong> ~2.5 hours</p>
              <p><strong>Departments:</strong> Treasury, Defense, State, Interior, Justice, Commerce, Science, Communications</p>
              <div class="controls">
                <button class="btn btn-success" onclick="startBudgetCoordination()">Start Budget Cycle</button>
              </div>
            </div>
          </div>

          <h3>🔧 Template Configuration</h3>
          <div class="form-group">
            <label>Crisis Type</label>
            <select id="crisisType">
              <option>Natural Disaster</option>
              <option>Security Threat</option>
              <option>Economic Crisis</option>
              <option>Diplomatic Incident</option>
              <option>Infrastructure Failure</option>
            </select>
          </div>
          
          <div class="form-group">
            <label>Severity Level</label>
            <select id="severityLevel">
              <option>Low</option>
              <option>Medium</option>
              <option>High</option>
              <option>Critical</option>
            </select>
          </div>
          
          <div class="form-group">
            <label>Affected Areas</label>
            <input type="text" id="affectedAreas" placeholder="e.g., Mining Sector, Trade Routes, Outer Colonies">
          </div>
        </div>

        <div id="api" class="tab-content">
          <h2>🔌 API Reference</h2>
          
          <h3>Workflow Management</h3>
          <div class="api-endpoint">
            <span class="method post">POST</span>/api/cabinet/workflows/definitions
            <br>Create a new workflow definition
          </div>
          
          <div class="api-endpoint">
            <span class="method get">GET</span>/api/cabinet/workflows/definitions
            <br>List all workflow definitions with optional filtering
          </div>
          
          <div class="api-endpoint">
            <span class="method post">POST</span>/api/cabinet/workflows/instances
            <br>Start a new workflow instance
          </div>
          
          <div class="api-endpoint">
            <span class="method put">PUT</span>/api/cabinet/workflows/instances/:id/step
            <br>Execute the next step in a workflow instance
          </div>

          <h3>Department Coordination</h3>
          <div class="api-endpoint">
            <span class="method post">POST</span>/api/cabinet/coordination
            <br>Initiate department coordination request
          </div>
          
          <div class="api-endpoint">
            <span class="method put">PUT</span>/api/cabinet/coordination/:id/respond
            <br>Respond to a coordination request
          </div>

          <h3>Inter-Department Messaging</h3>
          <div class="api-endpoint">
            <span class="method post">POST</span>/api/cabinet/messages
            <br>Send message between departments
          </div>

          <h3>Workflow Templates</h3>
          <div class="api-endpoint">
            <span class="method post">POST</span>/api/cabinet/workflows/templates/crisis-response
            <br>Create and start crisis response workflow
          </div>
          
          <div class="api-endpoint">
            <span class="method post">POST</span>/api/cabinet/workflows/templates/policy-implementation
            <br>Create and start policy implementation workflow
          </div>
          
          <div class="api-endpoint">
            <span class="method post">POST</span>/api/cabinet/workflows/templates/budget-coordination
            <br>Create and start budget coordination workflow
          </div>

          <h3>Example Usage</h3>
          <div class="api-endpoint">
            <strong>Start Crisis Response:</strong><br>
            POST /api/cabinet/workflows/templates/crisis-response<br>
            {<br>
            &nbsp;&nbsp;"campaignId": 1,<br>
            &nbsp;&nbsp;"crisisType": "Security Threat",<br>
            &nbsp;&nbsp;"severity": "High",<br>
            &nbsp;&nbsp;"affectedAreas": ["Mining Sector", "Trade Routes"]<br>
            }
          </div>
        </div>
      </div>

      <script>
        function showTab(tabName) {
          // Hide all tab contents
          const contents = document.querySelectorAll('.tab-content');
          contents.forEach(content => content.classList.remove('active'));
          
          // Remove active class from all tabs
          const tabs = document.querySelectorAll('.nav-tab');
          tabs.forEach(tab => tab.classList.remove('active'));
          
          // Show selected tab content
          document.getElementById(tabName).classList.add('active');
          
          // Add active class to clicked tab
          event.target.classList.add('active');
        }

        // Mock functions for demo interactivity
        function startWorkflow() {
          alert('Starting new workflow... (This would open a workflow creation form)');
        }

        function refreshWorkflows() {
          alert('Refreshing workflow status... (This would fetch latest data from API)');
        }

        function pauseWorkflow(id) {
          alert(\`Pausing workflow \${id}... (This would call PUT /api/cabinet/workflows/instances/\${id}/pause)\`);
        }

        function cancelWorkflow(id) {
          if (confirm(\`Are you sure you want to cancel workflow \${id}?\`)) {
            alert(\`Cancelling workflow \${id}... (This would call DELETE /api/cabinet/workflows/instances/\${id})\`);
          }
        }

        function initiateCoordination() {
          alert('Initiating department coordination... (This would open coordination form)');
        }

        function refreshCoordination() {
          alert('Refreshing coordination status... (This would fetch latest coordination data)');
        }

        function respondToCoordination(id) {
          alert(\`Adding response to coordination \${id}... (This would open response form)\`);
        }

        function escalateCoordination(id) {
          alert(\`Escalating coordination \${id}... (This would notify senior officials)\`);
        }

        function composeMessage() {
          alert('Opening message composer... (This would open a detailed message form)');
        }

        function refreshMessages() {
          alert('Refreshing messages... (This would fetch latest message threads)');
        }

        function startCrisisResponse() {
          const crisisType = document.getElementById('crisisType')?.value || 'Security Threat';
          const severity = document.getElementById('severityLevel')?.value || 'High';
          const affectedAreas = document.getElementById('affectedAreas')?.value || 'Multiple Sectors';
          
          alert(\`Starting Crisis Response Workflow:
Crisis Type: \${crisisType}
Severity: \${severity}
Affected Areas: \${affectedAreas}

(This would call POST /api/cabinet/workflows/templates/crisis-response)\`);
        }

        function startPolicyImplementation() {
          alert('Starting Policy Implementation Workflow... (This would open policy selection form)');
        }

        function startBudgetCoordination() {
          alert('Starting Budget Coordination Workflow... (This would initiate the annual budget cycle)');
        }

        function startResearchCoordination() {
          alert('🔬 Research Project Coordination Started\\n\\nCoordinating multi-department research initiative:\\n\\nStep 1: Science Secretary - Research proposal review (2 hours)\\nStep 2: Treasury Secretary - Budget allocation (1 hour)\\nStep 3: Defense Secretary - Security clearance (30 min)\\nStep 4: Communications Secretary - Public messaging strategy (1.5 hours)\\n\\nEstimated completion: 5 hours\\n\\n(This would call POST /api/cabinet/workflows/instances with research-coordination template)');
        }

        function startCrisisCommunication() {
          alert('📡 Crisis Communication Response Started\\n\\nActivating government-wide crisis communication:\\n\\nStep 1: Communications - Crisis assessment (15 min)\\nStep 2: Defense - Security briefing (10 min)\\nStep 3: State - Diplomatic coordination (30 min)\\nStep 4: Interior - Public safety messaging (20 min)\\nStep 5: Science - Technical information release (45 min)\\nStep 6: Communications - Unified message deployment (15 min)\\n\\nTotal duration: 2.25 hours\\n\\n(This would call POST /api/cabinet/workflows/instances with crisis-communication template)');
        }

        function startDiscoveryAnnouncement() {
          alert('🎯 Scientific Discovery Announcement Started\\n\\nCoordinating major discovery announcement:\\n\\nStep 1: Science - Discovery validation (3 hours)\\nStep 2: Commerce - Commercial impact assessment (1 hour)\\nStep 3: State - International coordination (2 hours)\\nStep 4: Communications - Public announcement strategy (1.5 hours)\\n\\nTotal duration: 7.5 hours\\n\\nThis workflow ensures proper validation, impact assessment, and strategic communication of breakthrough discoveries.\\n\\n(This would call POST /api/cabinet/workflows/instances with discovery-announcement template)');
        }

        // Auto-refresh demo data every 30 seconds
        setInterval(() => {
          console.log('Auto-refreshing workflow data...');
          // In a real implementation, this would fetch fresh data from the API
        }, 30000);
      </script>
    </body>
    </html>
  `);
});

export default router;
