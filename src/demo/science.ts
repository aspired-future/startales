import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = express.Router();

router.get('/science', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Science Secretary - Research Command Center</title>
        <style>
            * {
                margin: 0;
                padding: 0;
                box-sizing: border-box;
            }
            
            body {
                font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                background: linear-gradient(135deg, #1e3c72 0%, #2a5298 100%);
                color: #ffffff;
                min-height: 100vh;
                overflow-x: hidden;
            }
            
            .header {
                background: rgba(0, 0, 0, 0.3);
                padding: 1rem 2rem;
                border-bottom: 2px solid #4a90e2;
                backdrop-filter: blur(10px);
            }
            
            .header h1 {
                font-size: 2.5rem;
                font-weight: 300;
                margin-bottom: 0.5rem;
                text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
            }
            
            .header .subtitle {
                font-size: 1.1rem;
                opacity: 0.9;
                font-weight: 300;
            }
            
            .dashboard {
                display: grid;
                grid-template-columns: 1fr 1fr 1fr;
                gap: 2rem;
                padding: 2rem;
                max-width: 1400px;
                margin: 0 auto;
            }
            
            .panel {
                background: rgba(255, 255, 255, 0.1);
                border-radius: 12px;
                padding: 1.5rem;
                backdrop-filter: blur(10px);
                border: 1px solid rgba(255, 255, 255, 0.2);
                box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
                transition: all 0.3s ease;
            }
            
            .panel:hover {
                transform: translateY(-5px);
                box-shadow: 0 12px 40px rgba(0, 0, 0, 0.2);
                border-color: #4a90e2;
            }
            
            .panel h2 {
                font-size: 1.3rem;
                margin-bottom: 1rem;
                color: #4a90e2;
                border-bottom: 2px solid #4a90e2;
                padding-bottom: 0.5rem;
            }
            
            .metric {
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin: 0.8rem 0;
                padding: 0.5rem;
                background: rgba(255, 255, 255, 0.05);
                border-radius: 6px;
            }
            
            .metric-value {
                font-weight: bold;
                font-size: 1.1rem;
                color: #4a90e2;
            }
            
            .status-indicator {
                display: inline-block;
                width: 12px;
                height: 12px;
                border-radius: 50%;
                margin-right: 8px;
            }
            
            .status-active { background-color: #4CAF50; }
            .status-pending { background-color: #FF9800; }
            .status-completed { background-color: #2196F3; }
            
            .action-buttons {
                display: flex;
                gap: 1rem;
                margin-top: 1rem;
                flex-wrap: wrap;
            }
            
            .btn {
                padding: 0.7rem 1.2rem;
                border: none;
                border-radius: 6px;
                background: linear-gradient(135deg, #4a90e2, #357abd);
                color: white;
                cursor: pointer;
                font-size: 0.9rem;
                transition: all 0.3s ease;
                text-decoration: none;
                display: inline-block;
                text-align: center;
            }
            
            .btn:hover {
                transform: translateY(-2px);
                box-shadow: 0 4px 12px rgba(74, 144, 226, 0.3);
                background: linear-gradient(135deg, #357abd, #2968a3);
            }
            
            .btn-secondary {
                background: linear-gradient(135deg, #6c757d, #5a6268);
            }
            
            .btn-secondary:hover {
                background: linear-gradient(135deg, #5a6268, #495057);
            }
            
            .priority-list {
                list-style: none;
            }
            
            .priority-item {
                background: rgba(255, 255, 255, 0.05);
                margin: 0.5rem 0;
                padding: 0.8rem;
                border-radius: 6px;
                border-left: 4px solid #4a90e2;
            }
            
            .priority-high { border-left-color: #f44336; }
            .priority-medium { border-left-color: #ff9800; }
            .priority-low { border-left-color: #4caf50; }
            
            .program-item {
                background: rgba(255, 255, 255, 0.05);
                margin: 0.5rem 0;
                padding: 0.8rem;
                border-radius: 6px;
                display: flex;
                justify-content: space-between;
                align-items: center;
            }
            
            .progress-bar {
                width: 100%;
                height: 8px;
                background: rgba(255, 255, 255, 0.1);
                border-radius: 4px;
                margin: 0.5rem 0;
                overflow: hidden;
            }
            
            .progress-fill {
                height: 100%;
                background: linear-gradient(90deg, #4a90e2, #357abd);
                transition: width 0.3s ease;
            }
            
            .full-width {
                grid-column: 1 / -1;
            }
            
            .two-column {
                grid-column: span 2;
            }
            
            .api-endpoint {
                font-family: 'Courier New', monospace;
                background: rgba(0, 0, 0, 0.3);
                padding: 0.5rem;
                border-radius: 4px;
                font-size: 0.9rem;
                margin: 0.5rem 0;
                border-left: 3px solid #4a90e2;
            }
            
            .integration-note {
                background: rgba(255, 193, 7, 0.1);
                border: 1px solid rgba(255, 193, 7, 0.3);
                padding: 1rem;
                border-radius: 6px;
                margin: 1rem 0;
            }
            
            @media (max-width: 1200px) {
                .dashboard {
                    grid-template-columns: 1fr 1fr;
                }
            }
            
            @media (max-width: 768px) {
                .dashboard {
                    grid-template-columns: 1fr;
                    padding: 1rem;
                }
                
                .header {
                    padding: 1rem;
                }
                
                .header h1 {
                    font-size: 2rem;
                }
            }
        </style>
    </head>
    <body>
        <div class="header">
            <h1>🔬 Science Secretary</h1>
            <p class="subtitle">Research Command Center - Innovation & Technology Oversight</p>
        </div>
        
        <div class="dashboard">
            <!-- Research Overview -->
            <div class="panel">
                <h2>📊 Research Overview</h2>
                <div class="metric">
                    <span>Total R&D Budget</span>
                    <span class="metric-value">$2.4B</span>
                </div>
                <div class="metric">
                    <span>Active Projects</span>
                    <span class="metric-value">47</span>
                </div>
                <div class="metric">
                    <span>Completed Projects</span>
                    <span class="metric-value">23</span>
                </div>
                <div class="metric">
                    <span>Research Institutions</span>
                    <span class="metric-value">12</span>
                </div>
                <div class="metric">
                    <span>Budget Utilization</span>
                    <span class="metric-value">78%</span>
                </div>
                <div class="progress-bar">
                    <div class="progress-fill" style="width: 78%"></div>
                </div>
            </div>
            
            <!-- Current Research Priorities -->
            <div class="panel">
                <h2>🎯 Research Priorities</h2>
                <ul class="priority-list">
                    <li class="priority-item priority-high">
                        <strong>Quantum Computing</strong><br>
                        <small>Strategic Importance: 10/10</small>
                    </li>
                    <li class="priority-item priority-high">
                        <strong>AI & Machine Learning</strong><br>
                        <small>Strategic Importance: 9/10</small>
                    </li>
                    <li class="priority-item priority-medium">
                        <strong>Renewable Energy</strong><br>
                        <small>Strategic Importance: 8/10</small>
                    </li>
                    <li class="priority-item priority-medium">
                        <strong>Biotechnology</strong><br>
                        <small>Strategic Importance: 7/10</small>
                    </li>
                </ul>
                <div class="action-buttons">
                    <button class="btn" onclick="setPriorities()">Set Priorities</button>
                    <button class="btn btn-secondary" onclick="viewAllPriorities()">View All</button>
                </div>
            </div>
            
            <!-- Innovation Programs -->
            <div class="panel">
                <h2>💡 Innovation Programs</h2>
                <div class="program-item">
                    <div>
                        <strong>Tech Startup Incubator</strong><br>
                        <small>25/50 participants</small>
                    </div>
                    <span class="status-indicator status-active"></span>
                </div>
                <div class="program-item">
                    <div>
                        <strong>University Research Grants</strong><br>
                        <small>$150M allocated</small>
                    </div>
                    <span class="status-indicator status-active"></span>
                </div>
                <div class="program-item">
                    <div>
                        <strong>Public-Private Partnership</strong><br>
                        <small>8 active collaborations</small>
                    </div>
                    <span class="status-indicator status-pending"></span>
                </div>
                <div class="action-buttons">
                    <button class="btn" onclick="createProgram()">New Program</button>
                    <button class="btn btn-secondary" onclick="managePrograms()">Manage</button>
                </div>
            </div>
            
            <!-- Recent Operations -->
            <div class="panel">
                <h2>⚡ Recent Operations</h2>
                <div class="program-item">
                    <div>
                        <strong>Quantum Lab Expansion</strong><br>
                        <small>Budget: $50M - In Progress</small>
                    </div>
                    <span class="status-indicator status-pending"></span>
                </div>
                <div class="program-item">
                    <div>
                        <strong>AI Ethics Policy Review</strong><br>
                        <small>Policy Implementation</small>
                    </div>
                    <span class="status-indicator status-completed"></span>
                </div>
                <div class="program-item">
                    <div>
                        <strong>International Collaboration</strong><br>
                        <small>Space Research Agreement</small>
                    </div>
                    <span class="status-indicator status-active"></span>
                </div>
                <div class="action-buttons">
                    <button class="btn" onclick="newOperation()">New Operation</button>
                    <button class="btn btn-secondary" onclick="viewOperations()">View All</button>
                </div>
            </div>
            
            <!-- Scientific Policies -->
            <div class="panel">
                <h2>📋 Scientific Policies</h2>
                <div class="metric">
                    <span>Active Policies</span>
                    <span class="metric-value">15</span>
                </div>
                <div class="program-item">
                    <div>
                        <strong>Research Ethics Guidelines</strong><br>
                        <small>Compliance: 95%</small>
                    </div>
                    <span class="status-indicator status-active"></span>
                </div>
                <div class="program-item">
                    <div>
                        <strong>Technology Export Controls</strong><br>
                        <small>Under Review</small>
                    </div>
                    <span class="status-indicator status-pending"></span>
                </div>
                <div class="action-buttons">
                    <button class="btn" onclick="createPolicy()">New Policy</button>
                    <button class="btn btn-secondary" onclick="managePolicies()">Manage</button>
                </div>
            </div>
            
            <!-- Performance Metrics -->
            <div class="panel">
                <h2>📈 Performance Metrics</h2>
                <div class="metric">
                    <span>Research Output Score</span>
                    <span class="metric-value">8.2/10</span>
                </div>
                <div class="metric">
                    <span>Innovation Impact</span>
                    <span class="metric-value">7.8/10</span>
                </div>
                <div class="metric">
                    <span>Collaboration Effectiveness</span>
                    <span class="metric-value">8.5/10</span>
                </div>
                <div class="metric">
                    <span>Patents Filed (YTD)</span>
                    <span class="metric-value">127</span>
                </div>
                <div class="metric">
                    <span>Technology Transfers</span>
                    <span class="metric-value">34</span>
                </div>
            </div>
            
            <!-- Technology Integration -->
            <div class="panel full-width">
                <h2>🔬 Technology Engine Integration</h2>
                <div class="integration-note">
                    <strong>🔗 Integration with Existing Technology System</strong><br>
                    The Science Secretary integrates with the comprehensive Technology Engine to provide governmental oversight of research and development activities.
                </div>
                
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; margin-top: 1rem;">
                    <div>
                        <h3>🎯 Government Oversight</h3>
                        <ul style="list-style: none; padding: 0;">
                            <li>• Research Priority Setting</li>
                            <li>• R&D Budget Allocation</li>
                            <li>• Policy Implementation</li>
                            <li>• Innovation Program Management</li>
                        </ul>
                    </div>
                    <div>
                        <h3>⚙️ Technology Engine</h3>
                        <ul style="list-style: none; padding: 0;">
                            <li>• Research Project Management</li>
                            <li>• Innovation Breakthrough Tracking</li>
                            <li>• Technology Tree Progression</li>
                            <li>• Cyber Warfare & Espionage</li>
                        </ul>
                    </div>
                </div>
                
                <div class="action-buttons" style="margin-top: 1rem;">
                    <button class="btn" onclick="viewTechnologies()">View Technologies</button>
                    <button class="btn" onclick="setTechPriorities()">Set Tech Priorities</button>
                    <button class="btn btn-secondary" onclick="viewResearchProjects()">Research Projects</button>
                </div>
            </div>
            
            <!-- API Endpoints -->
            <div class="panel full-width">
                <h2>🔌 API Endpoints</h2>
                <div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 1rem;">
                    <div>
                        <h4>Research Operations</h4>
                        <div class="api-endpoint">POST /api/science/operations</div>
                        <div class="api-endpoint">GET /api/science/operations</div>
                        <div class="api-endpoint">PUT /api/science/operations/:id</div>
                    </div>
                    <div>
                        <h4>Budget Management</h4>
                        <div class="api-endpoint">POST /api/science/budgets</div>
                        <div class="api-endpoint">GET /api/science/budgets</div>
                        <div class="api-endpoint">GET /api/science/analytics</div>
                    </div>
                    <div>
                        <h4>Innovation Programs</h4>
                        <div class="api-endpoint">POST /api/science/programs</div>
                        <div class="api-endpoint">GET /api/science/programs</div>
                        <div class="api-endpoint">GET /api/science/dashboard</div>
                    </div>
                </div>
            </div>
        </div>
        
        <script>
            // Demo functions for interactive elements
            function setPriorities() {
                alert('Research Priority Setting Interface\\n\\nThis would open a detailed interface for setting national research priorities, allocating budget percentages, and defining strategic importance levels.');
            }
            
            function viewAllPriorities() {
                alert('Research Priorities Overview\\n\\nShowing all current research priorities with their strategic importance, budget allocation, timeline, and expected outcomes.');
            }
            
            function createProgram() {
                alert('Create Innovation Program\\n\\nLaunching program creation wizard for:\\n• Incubators & Accelerators\\n• Grant Programs\\n• Public-Private Partnerships\\n• Technology Transfer Initiatives');
            }
            
            function managePrograms() {
                alert('Innovation Program Management\\n\\nManaging active programs:\\n• Performance tracking\\n• Participant management\\n• Budget monitoring\\n• Success metrics analysis');
            }
            
            function newOperation() {
                alert('New Science Operation\\n\\nCreating new research operation:\\n• Policy Implementation\\n• Budget Allocation\\n• Strategic Planning\\n• International Collaboration');
            }
            
            function viewOperations() {
                alert('Science Operations Dashboard\\n\\nViewing all operations with status tracking, timeline management, and performance metrics.');
            }
            
            function createPolicy() {
                alert('Scientific Policy Creation\\n\\nCreating new policy for:\\n• Research Ethics\\n• Technology Export Controls\\n• International Collaboration\\n• Safety Standards');
            }
            
            function managePolicies() {
                alert('Policy Management System\\n\\nManaging scientific policies:\\n• Compliance monitoring\\n• Review scheduling\\n• Implementation tracking\\n• Violation management');
            }
            
            function viewTechnologies() {
                alert('Technology Overview\\n\\nIntegrating with Technology Engine:\\n• Current research projects\\n• Technology tree progression\\n• Innovation breakthroughs\\n• Competitive analysis');
            }
            
            function setTechPriorities() {
                alert('Technology Priority Setting\\n\\nSetting government research priorities:\\n• Strategic technology focus\\n• Budget allocation by category\\n• Timeline and milestones\\n• Expected impact assessment');
            }
            
            function viewResearchProjects() {
                alert('Research Projects Dashboard\\n\\nViewing active research projects:\\n• Progress tracking\\n• Milestone management\\n• Resource allocation\\n• Performance metrics');
            }
            
            // Simulate real-time updates
            setInterval(() => {
                const metrics = document.querySelectorAll('.metric-value');
                metrics.forEach(metric => {
                    if (Math.random() > 0.95) {
                        metric.style.color = '#4CAF50';
                        setTimeout(() => {
                            metric.style.color = '#4a90e2';
                        }, 1000);
                    }
                });
            }, 2000);
            
            // Add some dynamic behavior to progress bars
            setInterval(() => {
                const progressBars = document.querySelectorAll('.progress-fill');
                progressBars.forEach(bar => {
                    const currentWidth = parseInt(bar.style.width);
                    if (Math.random() > 0.9) {
                        const newWidth = Math.min(100, currentWidth + Math.floor(Math.random() * 3));
                        bar.style.width = newWidth + '%';
                    }
                });
            }, 5000);
        </script>
    </body>
    </html>
  `);
});

export default router;
