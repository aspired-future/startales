/**
 * Delegation & Authority Management Demo
 * 
 * Interactive demo interface for testing and demonstrating the
 * delegation and authority management system functionality.
 */

import { Router, Request, Response } from 'express';

const router = Router();

router.get('/demo/delegation', (req: Request, res: Response) => {
  const html = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Delegation & Authority Management Demo</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            background: linear-gradient(135deg, #0a0a0f 0%, #1a1a2e 100%);
            color: #e0e6ed;
            min-height: 100vh;
            padding: 20px;
        }

        .container {
            max-width: 1400px;
            margin: 0 auto;
        }

        .header {
            text-align: center;
            margin-bottom: 30px;
            padding: 20px;
            background: rgba(26, 26, 46, 0.8);
            border-radius: 12px;
            border: 1px solid rgba(0, 217, 255, 0.3);
        }

        .header h1 {
            font-size: 2.5rem;
            color: #00d9ff;
            margin-bottom: 10px;
            text-shadow: 0 0 20px rgba(0, 217, 255, 0.5);
        }

        .header p {
            font-size: 1.1rem;
            color: #a0b3c8;
        }

        .dashboard {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 20px;
            margin-bottom: 30px;
        }

        .panel {
            background: rgba(22, 33, 62, 0.9);
            border-radius: 12px;
            padding: 20px;
            border: 1px solid rgba(0, 217, 255, 0.2);
            backdrop-filter: blur(10px);
        }

        .panel h2 {
            color: #00d9ff;
            margin-bottom: 15px;
            font-size: 1.4rem;
            display: flex;
            align-items: center;
            gap: 10px;
        }

        .tabs {
            display: flex;
            margin-bottom: 20px;
            border-bottom: 1px solid rgba(0, 217, 255, 0.3);
        }

        .tab {
            padding: 10px 20px;
            background: none;
            border: none;
            color: #a0b3c8;
            cursor: pointer;
            transition: all 0.3s ease;
            border-bottom: 2px solid transparent;
        }

        .tab.active {
            color: #00d9ff;
            border-bottom-color: #00d9ff;
        }

        .tab:hover {
            color: #00d9ff;
            background: rgba(0, 217, 255, 0.1);
        }

        .tab-content {
            display: none;
        }

        .tab-content.active {
            display: block;
        }

        .form-group {
            margin-bottom: 15px;
        }

        .form-group label {
            display: block;
            margin-bottom: 5px;
            color: #00d9ff;
            font-weight: 500;
        }

        .form-group input,
        .form-group select,
        .form-group textarea {
            width: 100%;
            padding: 10px;
            background: rgba(10, 10, 15, 0.8);
            border: 1px solid rgba(0, 217, 255, 0.3);
            border-radius: 6px;
            color: #e0e6ed;
            font-size: 14px;
        }

        .form-group input:focus,
        .form-group select:focus,
        .form-group textarea:focus {
            outline: none;
            border-color: #00d9ff;
            box-shadow: 0 0 10px rgba(0, 217, 255, 0.3);
        }

        .btn {
            padding: 10px 20px;
            background: linear-gradient(135deg, #00d9ff 0%, #0099cc 100%);
            color: #0a0a0f;
            border: none;
            border-radius: 6px;
            cursor: pointer;
            font-weight: 600;
            transition: all 0.3s ease;
            margin-right: 10px;
            margin-bottom: 10px;
        }

        .btn:hover {
            transform: translateY(-2px);
            box-shadow: 0 5px 15px rgba(0, 217, 255, 0.4);
        }

        .btn-secondary {
            background: linear-gradient(135deg, #ff9500 0%, #cc7700 100%);
        }

        .btn-danger {
            background: linear-gradient(135deg, #ff3366 0%, #cc1144 100%);
        }

        .results {
            margin-top: 20px;
            padding: 15px;
            background: rgba(10, 10, 15, 0.6);
            border-radius: 8px;
            border-left: 4px solid #00d9ff;
            max-height: 400px;
            overflow-y: auto;
        }

        .results h3 {
            color: #00d9ff;
            margin-bottom: 10px;
        }

        .results pre {
            color: #a0b3c8;
            font-size: 12px;
            line-height: 1.4;
            white-space: pre-wrap;
        }

        .role-card, .delegation-card, .decision-card {
            background: rgba(10, 10, 15, 0.6);
            border: 1px solid rgba(0, 217, 255, 0.2);
            border-radius: 8px;
            padding: 15px;
            margin-bottom: 10px;
        }

        .role-card h4, .delegation-card h4, .decision-card h4 {
            color: #00d9ff;
            margin-bottom: 8px;
        }

        .role-card p, .delegation-card p, .decision-card p {
            color: #a0b3c8;
            font-size: 14px;
            margin-bottom: 5px;
        }

        .authority-level {
            display: inline-block;
            padding: 4px 8px;
            border-radius: 4px;
            font-size: 12px;
            font-weight: 600;
        }

        .authority-0 { background: #666; color: #fff; }
        .authority-1 { background: #ff3366; color: #fff; }
        .authority-2 { background: #ff9500; color: #fff; }
        .authority-3 { background: #ffdd00; color: #000; }
        .authority-4 { background: #00ff88; color: #000; }
        .authority-5 { background: #00d9ff; color: #000; }

        .status {
            display: inline-block;
            padding: 4px 8px;
            border-radius: 4px;
            font-size: 12px;
            font-weight: 600;
        }

        .status-active { background: #00ff88; color: #000; }
        .status-inactive { background: #666; color: #fff; }
        .status-pending { background: #ffdd00; color: #000; }
        .status-approved { background: #00ff88; color: #000; }
        .status-rejected { background: #ff3366; color: #fff; }

        .summary-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 15px;
            margin-bottom: 20px;
        }

        .summary-card {
            background: rgba(10, 10, 15, 0.6);
            border: 1px solid rgba(0, 217, 255, 0.2);
            border-radius: 8px;
            padding: 15px;
            text-align: center;
        }

        .summary-card h3 {
            color: #00d9ff;
            font-size: 2rem;
            margin-bottom: 5px;
        }

        .summary-card p {
            color: #a0b3c8;
            font-size: 14px;
        }

        .loading {
            text-align: center;
            color: #00d9ff;
            padding: 20px;
        }

        .error {
            background: rgba(255, 51, 102, 0.1);
            border: 1px solid #ff3366;
            color: #ff3366;
            padding: 10px;
            border-radius: 6px;
            margin-bottom: 15px;
        }

        .success {
            background: rgba(0, 255, 136, 0.1);
            border: 1px solid #00ff88;
            color: #00ff88;
            padding: 10px;
            border-radius: 6px;
            margin-bottom: 15px;
        }

        @media (max-width: 768px) {
            .dashboard {
                grid-template-columns: 1fr;
            }
            
            .header h1 {
                font-size: 2rem;
            }
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🏛️ Delegation & Authority Management</h1>
            <p>Comprehensive system for managing government roles, permissions, and decision-making authority</p>
        </div>

        <div class="dashboard">
            <!-- System Overview Panel -->
            <div class="panel">
                <h2>📊 System Overview</h2>
                <div id="systemSummary" class="loading">Loading system summary...</div>
            </div>

            <!-- Quick Actions Panel -->
            <div class="panel">
                <h2>⚡ Quick Actions</h2>
                <button class="btn" onclick="initializeSystem()">Initialize Default Roles</button>
                <button class="btn btn-secondary" onclick="refreshData()">Refresh All Data</button>
                <button class="btn" onclick="checkAuthority()">Check Authority</button>
                <button class="btn btn-secondary" onclick="generateTestData()">Generate Test Data</button>
            </div>
        </div>

        <!-- Main Content Tabs -->
        <div class="panel">
            <div class="tabs">
                <button class="tab active" onclick="showTab('roles')">Government Roles</button>
                <button class="tab" onclick="showTab('permissions')">Permissions</button>
                <button class="tab" onclick="showTab('delegations')">Delegations</button>
                <button class="tab" onclick="showTab('decisions')">Decisions</button>
                <button class="tab" onclick="showTab('authority')">Authority Check</button>
            </div>

            <!-- Government Roles Tab -->
            <div id="roles-tab" class="tab-content active">
                <h3>Government Roles Management</h3>
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px;">
                    <div>
                        <h4>Create New Role</h4>
                        <div class="form-group">
                            <label>Role Name:</label>
                            <input type="text" id="roleName" placeholder="e.g., Secretary of Defense">
                        </div>
                        <div class="form-group">
                            <label>Title:</label>
                            <input type="text" id="roleTitle" placeholder="e.g., Secretary of Defense">
                        </div>
                        <div class="form-group">
                            <label>Department:</label>
                            <select id="roleDepartment">
                                <option value="Defense">Defense</option>
                                <option value="State">State</option>
                                <option value="Treasury">Treasury</option>
                                <option value="Interior">Interior</option>
                                <option value="Science">Science</option>
                                <option value="Justice">Justice</option>
                                <option value="Intelligence">Intelligence</option>
                                <option value="Administration">Administration</option>
                            </select>
                        </div>
                        <div class="form-group">
                            <label>Authority Level (0-5):</label>
                            <input type="number" id="roleAuthority" min="0" max="5" value="3">
                        </div>
                        <div class="form-group">
                            <label>Description:</label>
                            <textarea id="roleDescription" rows="3" placeholder="Role responsibilities and scope"></textarea>
                        </div>
                        <button class="btn" onclick="createRole()">Create Role</button>
                    </div>
                    <div>
                        <h4>Existing Roles</h4>
                        <div id="rolesList" class="loading">Loading roles...</div>
                    </div>
                </div>
            </div>

            <!-- Permissions Tab -->
            <div id="permissions-tab" class="tab-content">
                <h3>Permissions Management</h3>
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px;">
                    <div>
                        <h4>Create New Permission</h4>
                        <div class="form-group">
                            <label>Permission Name:</label>
                            <input type="text" id="permissionName" placeholder="e.g., military-operations">
                        </div>
                        <div class="form-group">
                            <label>Category:</label>
                            <select id="permissionCategory">
                                <option value="military">Military</option>
                                <option value="diplomatic">Diplomatic</option>
                                <option value="economic">Economic</option>
                                <option value="domestic">Domestic</option>
                                <option value="scientific">Scientific</option>
                                <option value="legal">Legal</option>
                                <option value="intelligence">Intelligence</option>
                                <option value="administrative">Administrative</option>
                            </select>
                        </div>
                        <div class="form-group">
                            <label>Required Authority Level (0-5):</label>
                            <input type="number" id="permissionAuthority" min="0" max="5" value="2">
                        </div>
                        <div class="form-group">
                            <label>Description:</label>
                            <textarea id="permissionDescription" rows="3" placeholder="Permission scope and limitations"></textarea>
                        </div>
                        <button class="btn" onclick="createPermission()">Create Permission</button>
                    </div>
                    <div>
                        <h4>Existing Permissions</h4>
                        <div id="permissionsList" class="loading">Loading permissions...</div>
                    </div>
                </div>
            </div>

            <!-- Delegations Tab -->
            <div id="delegations-tab" class="tab-content">
                <h3>Authority Delegations</h3>
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px;">
                    <div>
                        <h4>Create New Delegation</h4>
                        <div class="form-group">
                            <label>Delegator ID:</label>
                            <input type="text" id="delegatorId" placeholder="e.g., player-1">
                        </div>
                        <div class="form-group">
                            <label>Delegatee ID:</label>
                            <input type="text" id="delegateeId" placeholder="e.g., cabinet-member-1">
                        </div>
                        <div class="form-group">
                            <label>Role:</label>
                            <select id="delegationRole">
                                <option value="secretary-defense">Secretary of Defense</option>
                                <option value="secretary-state">Secretary of State</option>
                                <option value="secretary-treasury">Secretary of Treasury</option>
                                <option value="secretary-interior">Secretary of Interior</option>
                                <option value="secretary-science">Secretary of Science</option>
                                <option value="attorney-general">Attorney General</option>
                                <option value="intelligence-director">Intelligence Director</option>
                                <option value="chief-of-staff">Chief of Staff</option>
                            </select>
                        </div>
                        <div class="form-group">
                            <label>Delegation Scope:</label>
                            <select id="delegationScope">
                                <option value="full">Full Authority</option>
                                <option value="limited">Limited Authority</option>
                                <option value="approval-required">Approval Required</option>
                                <option value="advisory-only">Advisory Only</option>
                                <option value="emergency-only">Emergency Only</option>
                            </select>
                        </div>
                        <div class="form-group">
                            <label>Campaign ID:</label>
                            <input type="number" id="delegationCampaign" value="1">
                        </div>
                        <button class="btn" onclick="createDelegation()">Create Delegation</button>
                    </div>
                    <div>
                        <h4>Active Delegations</h4>
                        <div id="delegationsList" class="loading">Loading delegations...</div>
                    </div>
                </div>
            </div>

            <!-- Decisions Tab -->
            <div id="decisions-tab" class="tab-content">
                <h3>Decision Management</h3>
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px;">
                    <div>
                        <h4>Create New Decision</h4>
                        <div class="form-group">
                            <label>Decision Title:</label>
                            <input type="text" id="decisionTitle" placeholder="e.g., Increase Defense Spending">
                        </div>
                        <div class="form-group">
                            <label>Category:</label>
                            <select id="decisionCategory">
                                <option value="military">Military</option>
                                <option value="diplomatic">Diplomatic</option>
                                <option value="economic">Economic</option>
                                <option value="domestic">Domestic</option>
                                <option value="scientific">Scientific</option>
                                <option value="legal">Legal</option>
                                <option value="intelligence">Intelligence</option>
                                <option value="administrative">Administrative</option>
                            </select>
                        </div>
                        <div class="form-group">
                            <label>Impact Level:</label>
                            <select id="decisionImpact">
                                <option value="low">Low</option>
                                <option value="medium">Medium</option>
                                <option value="high">High</option>
                                <option value="critical">Critical</option>
                            </select>
                        </div>
                        <div class="form-group">
                            <label>Urgency:</label>
                            <select id="decisionUrgency">
                                <option value="low">Low</option>
                                <option value="medium">Medium</option>
                                <option value="high">High</option>
                                <option value="critical">Critical</option>
                            </select>
                        </div>
                        <div class="form-group">
                            <label>Description:</label>
                            <textarea id="decisionDescription" rows="3" placeholder="Decision details and context"></textarea>
                        </div>
                        <div class="form-group">
                            <label>Campaign ID:</label>
                            <input type="number" id="decisionCampaign" value="1">
                        </div>
                        <button class="btn" onclick="createDecision()">Create Decision</button>
                    </div>
                    <div>
                        <h4>Pending Decisions</h4>
                        <div id="decisionsList" class="loading">Loading decisions...</div>
                    </div>
                </div>
            </div>

            <!-- Authority Check Tab -->
            <div id="authority-tab" class="tab-content">
                <h3>Authority Verification</h3>
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px;">
                    <div>
                        <h4>Check User Authority</h4>
                        <div class="form-group">
                            <label>User ID:</label>
                            <input type="text" id="checkUserId" placeholder="e.g., cabinet-member-1">
                        </div>
                        <div class="form-group">
                            <label>Required Permissions (comma-separated):</label>
                            <input type="text" id="checkPermissions" placeholder="e.g., military-operations,troop-movement">
                        </div>
                        <div class="form-group">
                            <label>Campaign ID:</label>
                            <input type="number" id="checkCampaign" value="1">
                        </div>
                        <button class="btn" onclick="performAuthorityCheck()">Check Authority</button>
                    </div>
                    <div>
                        <h4>Authority Check Results</h4>
                        <div id="authorityResults">
                            <p style="color: #a0b3c8;">Enter user details and click "Check Authority" to verify permissions and authority levels.</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Results Panel -->
        <div class="results" id="results" style="display: none;">
            <h3>API Response</h3>
            <pre id="resultsContent"></pre>
        </div>
    </div>

    <script>
        let currentCampaignId = 1;

        // Tab Management
        function showTab(tabName) {
            // Hide all tab contents
            document.querySelectorAll('.tab-content').forEach(tab => {
                tab.classList.remove('active');
            });
            
            // Remove active class from all tabs
            document.querySelectorAll('.tab').forEach(tab => {
                tab.classList.remove('active');
            });
            
            // Show selected tab content
            document.getElementById(tabName + '-tab').classList.add('active');
            
            // Add active class to clicked tab
            event.target.classList.add('active');
        }

        // API Helper Functions
        async function apiCall(endpoint, method = 'GET', data = null) {
            try {
                const options = {
                    method: method,
                    headers: {
                        'Content-Type': 'application/json',
                    }
                };
                
                if (data) {
                    options.body = JSON.stringify(data);
                }
                
                const response = await fetch('/api/delegation' + endpoint, options);
                const result = await response.json();
                
                showResults(result);
                return result;
            } catch (error) {
                console.error('API call failed:', error);
                showResults({ success: false, error: error.message });
                return { success: false, error: error.message };
            }
        }

        function showResults(data) {
            const resultsDiv = document.getElementById('results');
            const resultsContent = document.getElementById('resultsContent');
            
            resultsContent.textContent = JSON.stringify(data, null, 2);
            resultsDiv.style.display = 'block';
        }

        // System Initialization
        async function initializeSystem() {
            const result = await apiCall('/initialize', 'POST', { campaignId: currentCampaignId });
            if (result.success) {
                showSuccess('System initialized successfully!');
                refreshData();
            } else {
                showError('Failed to initialize system: ' + result.error);
            }
        }

        // Data Loading Functions
        async function loadSystemSummary() {
            const result = await apiCall('/summary?campaignId=' + currentCampaignId);
            const summaryDiv = document.getElementById('systemSummary');
            
            if (result.success) {
                const data = result.data;
                summaryDiv.innerHTML = \`
                    <div class="summary-grid">
                        <div class="summary-card">
                            <h3>\${data.totalDelegations}</h3>
                            <p>Total Delegations</p>
                        </div>
                        <div class="summary-card">
                            <h3>\${data.activeDelegations}</h3>
                            <p>Active Delegations</p>
                        </div>
                        <div class="summary-card">
                            <h3>\${data.pendingApprovals}</h3>
                            <p>Pending Approvals</p>
                        </div>
                        <div class="summary-card">
                            <h3>\${data.emergencyPowersActive ? 'YES' : 'NO'}</h3>
                            <p>Emergency Powers</p>
                        </div>
                    </div>
                \`;
            } else {
                summaryDiv.innerHTML = '<div class="error">Failed to load system summary</div>';
            }
        }

        async function loadRoles() {
            const result = await apiCall('/roles');
            const rolesDiv = document.getElementById('rolesList');
            
            if (result.success && result.data) {
                rolesDiv.innerHTML = result.data.map(role => \`
                    <div class="role-card">
                        <h4>\${role.title}</h4>
                        <p><strong>Department:</strong> \${role.department}</p>
                        <p><strong>Authority Level:</strong> <span class="authority-level authority-\${role.baseAuthorityLevel}">\${role.baseAuthorityLevel}</span></p>
                        <p><strong>Can Delegate:</strong> \${role.canDelegate ? 'Yes' : 'No'}</p>
                        <p><strong>Status:</strong> <span class="status status-\${role.isActive ? 'active' : 'inactive'}">\${role.isActive ? 'Active' : 'Inactive'}</span></p>
                        <p>\${role.description}</p>
                    </div>
                \`).join('');
            } else {
                rolesDiv.innerHTML = '<div class="error">Failed to load roles</div>';
            }
        }

        async function loadPermissions() {
            const result = await apiCall('/permissions');
            const permissionsDiv = document.getElementById('permissionsList');
            
            if (result.success && result.data) {
                permissionsDiv.innerHTML = result.data.map(permission => \`
                    <div class="role-card">
                        <h4>\${permission.name}</h4>
                        <p><strong>Category:</strong> \${permission.category}</p>
                        <p><strong>Required Authority:</strong> <span class="authority-level authority-\${permission.requiredAuthorityLevel}">\${permission.requiredAuthorityLevel}</span></p>
                        <p><strong>Revocable:</strong> \${permission.isRevocable ? 'Yes' : 'No'}</p>
                        <p>\${permission.description}</p>
                    </div>
                \`).join('');
            } else {
                permissionsDiv.innerHTML = '<div class="error">Failed to load permissions</div>';
            }
        }

        async function loadDelegations() {
            const result = await apiCall('/delegations?campaignId=' + currentCampaignId + '&active=true');
            const delegationsDiv = document.getElementById('delegationsList');
            
            if (result.success && result.data) {
                delegationsDiv.innerHTML = result.data.map(delegation => \`
                    <div class="delegation-card">
                        <h4>Delegation to \${delegation.delegateeId}</h4>
                        <p><strong>Role:</strong> \${delegation.roleId}</p>
                        <p><strong>Scope:</strong> \${delegation.scope}</p>
                        <p><strong>Status:</strong> <span class="status status-\${delegation.isActive ? 'active' : 'inactive'}">\${delegation.isActive ? 'Active' : 'Inactive'}</span></p>
                        <p><strong>Start Date:</strong> \${new Date(delegation.startDate).toLocaleDateString()}</p>
                        <button class="btn btn-danger btn-sm" onclick="revokeDelegation('\${delegation.id}')">Revoke</button>
                    </div>
                \`).join('');
            } else {
                delegationsDiv.innerHTML = '<div class="error">Failed to load delegations</div>';
            }
        }

        async function loadDecisions() {
            const result = await apiCall('/decisions?campaignId=' + currentCampaignId + '&status=pending');
            const decisionsDiv = document.getElementById('decisionsList');
            
            if (result.success && result.data) {
                decisionsDiv.innerHTML = result.data.map(decision => \`
                    <div class="decision-card">
                        <h4>\${decision.title}</h4>
                        <p><strong>Category:</strong> \${decision.category}</p>
                        <p><strong>Impact:</strong> \${decision.impact}</p>
                        <p><strong>Urgency:</strong> \${decision.urgency}</p>
                        <p><strong>Status:</strong> <span class="status status-\${decision.status}">\${decision.status}</span></p>
                        <p><strong>Deadline:</strong> \${new Date(decision.deadline).toLocaleDateString()}</p>
                        <p>\${decision.description}</p>
                    </div>
                \`).join('');
            } else {
                decisionsDiv.innerHTML = '<div class="error">Failed to load decisions</div>';
            }
        }

        // CRUD Operations
        async function createRole() {
            const roleData = {
                name: document.getElementById('roleName').value,
                title: document.getElementById('roleTitle').value,
                department: document.getElementById('roleDepartment').value,
                description: document.getElementById('roleDescription').value,
                baseAuthorityLevel: parseInt(document.getElementById('roleAuthority').value)
            };

            if (!roleData.name || !roleData.title || !roleData.description) {
                showError('Please fill in all required fields');
                return;
            }

            const result = await apiCall('/roles', 'POST', roleData);
            if (result.success) {
                showSuccess('Role created successfully!');
                clearRoleForm();
                loadRoles();
            } else {
                showError('Failed to create role: ' + result.error);
            }
        }

        async function createPermission() {
            const permissionData = {
                name: document.getElementById('permissionName').value,
                category: document.getElementById('permissionCategory').value,
                description: document.getElementById('permissionDescription').value,
                requiredAuthorityLevel: parseInt(document.getElementById('permissionAuthority').value)
            };

            if (!permissionData.name || !permissionData.description) {
                showError('Please fill in all required fields');
                return;
            }

            const result = await apiCall('/permissions', 'POST', permissionData);
            if (result.success) {
                showSuccess('Permission created successfully!');
                clearPermissionForm();
                loadPermissions();
            } else {
                showError('Failed to create permission: ' + result.error);
            }
        }

        async function createDelegation() {
            const delegationData = {
                delegatorId: document.getElementById('delegatorId').value,
                delegateeId: document.getElementById('delegateeId').value,
                roleId: document.getElementById('delegationRole').value,
                scope: document.getElementById('delegationScope').value,
                campaignId: parseInt(document.getElementById('delegationCampaign').value)
            };

            if (!delegationData.delegatorId || !delegationData.delegateeId) {
                showError('Please fill in all required fields');
                return;
            }

            const result = await apiCall('/delegations', 'POST', delegationData);
            if (result.success) {
                showSuccess('Delegation created successfully!');
                clearDelegationForm();
                loadDelegations();
            } else {
                showError('Failed to create delegation: ' + result.error);
            }
        }

        async function createDecision() {
            const decisionData = {
                title: document.getElementById('decisionTitle').value,
                description: document.getElementById('decisionDescription').value,
                category: document.getElementById('decisionCategory').value,
                impact: document.getElementById('decisionImpact').value,
                urgency: document.getElementById('decisionUrgency').value,
                campaignId: parseInt(document.getElementById('decisionCampaign').value),
                initiatorId: 'demo-user',
                deadline: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString() // 24 hours from now
            };

            if (!decisionData.title || !decisionData.description) {
                showError('Please fill in all required fields');
                return;
            }

            const result = await apiCall('/decisions', 'POST', decisionData);
            if (result.success) {
                showSuccess('Decision created successfully!');
                clearDecisionForm();
                loadDecisions();
            } else {
                showError('Failed to create decision: ' + result.error);
            }
        }

        async function performAuthorityCheck() {
            const checkData = {
                userId: document.getElementById('checkUserId').value,
                requiredPermissions: document.getElementById('checkPermissions').value.split(',').map(p => p.trim()),
                campaignId: parseInt(document.getElementById('checkCampaign').value)
            };

            if (!checkData.userId || !checkData.requiredPermissions[0]) {
                showError('Please fill in all required fields');
                return;
            }

            const result = await apiCall('/check-authority', 'POST', checkData);
            const resultsDiv = document.getElementById('authorityResults');
            
            if (result.success) {
                const data = result.data;
                resultsDiv.innerHTML = \`
                    <div class="role-card">
                        <h4>Authority Check Results</h4>
                        <p><strong>Has Authority:</strong> <span class="status status-\${data.hasAuthority ? 'active' : 'inactive'}">\${data.hasAuthority ? 'YES' : 'NO'}</span></p>
                        <p><strong>Authority Level:</strong> <span class="authority-level authority-\${data.authorityLevel}">\${data.authorityLevel}</span></p>
                        <p><strong>Requires Approval:</strong> \${data.requiresApproval ? 'Yes' : 'No'}</p>
                        \${data.missingPermissions.length > 0 ? \`<p><strong>Missing Permissions:</strong> \${data.missingPermissions.join(', ')}</p>\` : ''}
                        \${data.limitations.length > 0 ? \`<p><strong>Limitations:</strong> \${data.limitations.length} active</p>\` : ''}
                    </div>
                \`;
            } else {
                resultsDiv.innerHTML = '<div class="error">Failed to check authority: ' + result.error + '</div>';
            }
        }

        async function revokeDelegation(delegationId) {
            if (!confirm('Are you sure you want to revoke this delegation?')) return;
            
            const result = await apiCall('/delegations/' + delegationId, 'DELETE', {
                reason: 'Revoked via demo interface',
                revokedBy: 'demo-user'
            });
            
            if (result.success) {
                showSuccess('Delegation revoked successfully!');
                loadDelegations();
            } else {
                showError('Failed to revoke delegation: ' + result.error);
            }
        }

        // Utility Functions
        function clearRoleForm() {
            document.getElementById('roleName').value = '';
            document.getElementById('roleTitle').value = '';
            document.getElementById('roleDescription').value = '';
            document.getElementById('roleAuthority').value = '3';
        }

        function clearPermissionForm() {
            document.getElementById('permissionName').value = '';
            document.getElementById('permissionDescription').value = '';
            document.getElementById('permissionAuthority').value = '2';
        }

        function clearDelegationForm() {
            document.getElementById('delegatorId').value = '';
            document.getElementById('delegateeId').value = '';
        }

        function clearDecisionForm() {
            document.getElementById('decisionTitle').value = '';
            document.getElementById('decisionDescription').value = '';
        }

        function showSuccess(message) {
            const alertDiv = document.createElement('div');
            alertDiv.className = 'success';
            alertDiv.textContent = message;
            document.querySelector('.container').insertBefore(alertDiv, document.querySelector('.dashboard'));
            setTimeout(() => alertDiv.remove(), 5000);
        }

        function showError(message) {
            const alertDiv = document.createElement('div');
            alertDiv.className = 'error';
            alertDiv.textContent = message;
            document.querySelector('.container').insertBefore(alertDiv, document.querySelector('.dashboard'));
            setTimeout(() => alertDiv.remove(), 5000);
        }

        function refreshData() {
            loadSystemSummary();
            loadRoles();
            loadPermissions();
            loadDelegations();
            loadDecisions();
        }

        function generateTestData() {
            // This would create some test delegations and decisions
            showSuccess('Test data generation not implemented in demo');
        }

        function checkAuthority() {
            showTab('authority');
        }

        // Initialize the demo
        document.addEventListener('DOMContentLoaded', function() {
            refreshData();
        });
    </script>
</body>
</html>`;

  res.type('html').send(html);
});

export default router;
