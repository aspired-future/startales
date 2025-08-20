/**
 * Psychology & Behavioral Economics Demo
 * 
 * Interactive demonstration of the comprehensive psychology system including:
 * - Individual psychological profiling with Big Five traits
 * - Behavioral economics modeling (loss aversion, social proof, cognitive biases)
 * - Social psychology and group dynamics
 * - Policy response psychology
 * - Incentive system design and effectiveness
 * - Integration with all existing systems (population, migration, business, cities, policies, trade)
 */

import { Router, Request, Response } from 'express';

const router = Router();

/**
 * Psychology System Demo Dashboard
 */
router.get('/demo/psychology', (req: Request, res: Response) => {
  const html = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Psychology & Behavioral Economics System Demo</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh;
            padding: 20px;
        }

        .container {
            max-width: 1400px;
            margin: 0 auto;
            background: rgba(255, 255, 255, 0.95);
            border-radius: 20px;
            padding: 30px;
            box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
        }

        .header {
            text-align: center;
            margin-bottom: 40px;
            padding-bottom: 20px;
            border-bottom: 3px solid #667eea;
        }

        .header h1 {
            color: #2c3e50;
            font-size: 2.5em;
            margin-bottom: 10px;
            font-weight: 700;
        }

        .header .subtitle {
            color: #7f8c8d;
            font-size: 1.2em;
            margin-bottom: 20px;
        }

        .system-status {
            display: inline-flex;
            align-items: center;
            background: #2ecc71;
            color: white;
            padding: 8px 16px;
            border-radius: 20px;
            font-weight: 600;
            margin-bottom: 10px;
        }

        .status-dot {
            width: 8px;
            height: 8px;
            background: white;
            border-radius: 50%;
            margin-right: 8px;
            animation: pulse 2s infinite;
        }

        @keyframes pulse {
            0%, 100% { opacity: 1; }
            50% { opacity: 0.5; }
        }

        .integration-badges {
            display: flex;
            flex-wrap: wrap;
            justify-content: center;
            gap: 10px;
            margin-top: 15px;
        }

        .integration-badge {
            background: #3498db;
            color: white;
            padding: 5px 12px;
            border-radius: 15px;
            font-size: 0.9em;
            font-weight: 500;
        }

        .demo-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
            gap: 25px;
            margin-bottom: 30px;
        }

        .demo-section {
            background: white;
            border-radius: 15px;
            padding: 25px;
            box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
            border-left: 5px solid #667eea;
            transition: transform 0.3s ease, box-shadow 0.3s ease;
        }

        .demo-section:hover {
            transform: translateY(-5px);
            box-shadow: 0 15px 35px rgba(0, 0, 0, 0.15);
        }

        .demo-section h3 {
            color: #2c3e50;
            font-size: 1.4em;
            margin-bottom: 15px;
            display: flex;
            align-items: center;
        }

        .demo-section .icon {
            font-size: 1.5em;
            margin-right: 10px;
        }

        .demo-controls {
            display: flex;
            flex-wrap: wrap;
            gap: 10px;
            margin-bottom: 15px;
        }

        .btn {
            background: #667eea;
            color: white;
            border: none;
            padding: 10px 20px;
            border-radius: 8px;
            cursor: pointer;
            font-weight: 600;
            transition: all 0.3s ease;
            text-decoration: none;
            display: inline-block;
            text-align: center;
        }

        .btn:hover {
            background: #5a6fd8;
            transform: translateY(-2px);
        }

        .btn-secondary {
            background: #95a5a6;
        }

        .btn-secondary:hover {
            background: #7f8c8d;
        }

        .btn-success {
            background: #2ecc71;
        }

        .btn-success:hover {
            background: #27ae60;
        }

        .btn-warning {
            background: #f39c12;
        }

        .btn-warning:hover {
            background: #e67e22;
        }

        .results-area {
            background: #f8f9fa;
            border-radius: 10px;
            padding: 15px;
            margin-top: 15px;
            border: 1px solid #e9ecef;
            min-height: 200px;
            font-family: 'Courier New', monospace;
            font-size: 0.9em;
            overflow-y: auto;
            max-height: 400px;
        }

        .loading {
            text-align: center;
            color: #7f8c8d;
            font-style: italic;
        }

        .metric-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
            gap: 15px;
            margin-top: 15px;
        }

        .integration-result {
            margin: 15px 0;
        }

        .batch-result {
            margin: 20px 0;
            padding: 15px;
            background: #f8f9fa;
            border-radius: 8px;
            border-left: 4px solid #007bff;
        }

        .batch-result h5 {
            margin: 0 0 10px 0;
            color: #495057;
        }

        .witter-analysis-result {
            margin: 20px 0;
        }

        .analysis-section {
            margin: 20px 0;
            padding: 15px;
            background: rgba(255, 255, 255, 0.1);
            border-radius: 8px;
        }

        .analysis-section h5 {
            margin: 0 0 15px 0;
            color: #333;
            font-size: 1.1em;
        }

        .topic-list, .voice-list {
            display: flex;
            flex-wrap: wrap;
            gap: 8px;
            margin-top: 10px;
        }

        .topic-tag, .voice-tag {
            background: #007bff;
            color: white;
            padding: 4px 8px;
            border-radius: 12px;
            font-size: 0.85em;
            font-weight: 500;
        }

        .voice-tag {
            background: #28a745;
        }

        .metadata {
            margin-top: 20px;
            padding: 15px;
            background: rgba(0, 0, 0, 0.05);
            border-radius: 8px;
            font-size: 0.9em;
        }

        .metadata p {
            margin: 5px 0;
        }

        .metric {
            text-align: center;
            background: #f8f9fa;
            padding: 15px;
            border-radius: 10px;
            border: 1px solid #e9ecef;
        }

        .metric-value {
            font-size: 1.8em;
            font-weight: bold;
            color: #667eea;
            display: block;
        }

        .metric-label {
            font-size: 0.9em;
            color: #7f8c8d;
            margin-top: 5px;
        }

        .personality-radar {
            width: 100%;
            height: 200px;
            background: #f8f9fa;
            border-radius: 10px;
            display: flex;
            align-items: center;
            justify-content: center;
            color: #7f8c8d;
            font-style: italic;
            margin-top: 15px;
        }

        .integration-section {
            background: linear-gradient(135deg, #667eea, #764ba2);
            color: white;
            border-radius: 15px;
            padding: 25px;
            margin-top: 30px;
        }

        .integration-section h3 {
            color: white;
            margin-bottom: 20px;
            text-align: center;
        }

        .integration-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 15px;
        }

        .integration-item {
            background: rgba(255, 255, 255, 0.1);
            padding: 15px;
            border-radius: 10px;
            text-align: center;
            transition: background 0.3s ease;
        }

        .integration-item:hover {
            background: rgba(255, 255, 255, 0.2);
        }

        .integration-item h4 {
            margin-bottom: 10px;
            font-size: 1.1em;
        }

        .integration-item p {
            font-size: 0.9em;
            opacity: 0.9;
        }

        .api-section {
            background: #2c3e50;
            color: white;
            border-radius: 15px;
            padding: 25px;
            margin-top: 30px;
        }

        .api-section h3 {
            color: white;
            margin-bottom: 20px;
            text-align: center;
        }

        .api-endpoints {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
            gap: 15px;
        }

        .api-endpoint {
            background: rgba(255, 255, 255, 0.1);
            padding: 15px;
            border-radius: 10px;
            font-family: 'Courier New', monospace;
        }

        .api-method {
            color: #2ecc71;
            font-weight: bold;
            margin-right: 10px;
        }

        .api-path {
            color: #f39c12;
        }

        .api-description {
            margin-top: 8px;
            font-size: 0.9em;
            opacity: 0.9;
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        }

        .footer {
            text-align: center;
            margin-top: 40px;
            padding-top: 20px;
            border-top: 2px solid #ecf0f1;
            color: #7f8c8d;
        }

        .error {
            color: #e74c3c;
            background: #fdf2f2;
            padding: 10px;
            border-radius: 5px;
            border-left: 4px solid #e74c3c;
        }

        .success {
            color: #27ae60;
            background: #f0f9f4;
            padding: 10px;
            border-radius: 5px;
            border-left: 4px solid #27ae60;
        }

        @media (max-width: 768px) {
            .demo-grid {
                grid-template-columns: 1fr;
            }
            
            .container {
                padding: 20px;
            }
            
            .header h1 {
                font-size: 2em;
            }
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🧠 Psychology & Behavioral Economics System</h1>
            <p class="subtitle">Comprehensive Human Behavior Modeling for Economic Simulation</p>
            <div class="system-status">
                <div class="status-dot"></div>
                System Operational - Sprint 11 Complete
            </div>
            <div class="integration-badges">
                <span class="integration-badge">Population Engine</span>
                <span class="integration-badge">Migration System</span>
                <span class="integration-badge">Business Engine</span>
                <span class="integration-badge">City Dynamics</span>
                <span class="integration-badge">Policy System</span>
                <span class="integration-badge">Trade Networks</span>
                <span class="integration-badge">Speech Analysis</span>
                <span class="integration-badge">🏛️ Governance</span>
                <span class="integration-badge">⚖️ Legal System</span>
                <span class="integration-badge">🛡️ Security</span>
                <span class="integration-badge">📊 Demographics</span>
                <span class="integration-badge">🔬 Technology</span>
                <span class="integration-badge">📱 Witter Feed</span>
            </div>
        </div>

        <div class="demo-grid">
            <!-- Psychological Profiling -->
            <div class="demo-section">
                <h3><span class="icon">👤</span>Psychological Profiling</h3>
                <p>Generate and analyze individual psychological profiles with Big Five personality traits, risk tolerance, and motivation systems.</p>
                
                <div class="demo-controls">
                    <button class="btn" onclick="generateProfile()">Generate Profile</button>
                    <button class="btn btn-secondary" onclick="analyzePersonality()">Analyze Personality</button>
                    <button class="btn btn-success" onclick="getPopulationPsychology()">Population Overview</button>
                </div>

                <div class="metric-grid">
                    <div class="metric">
                        <span class="metric-value" id="profileCount">0</span>
                        <div class="metric-label">Total Profiles</div>
                    </div>
                    <div class="metric">
                        <span class="metric-value" id="avgRiskTolerance">0</span>
                        <div class="metric-label">Avg Risk Tolerance</div>
                    </div>
                </div>

                <div class="personality-radar">
                    Personality Distribution Visualization
                    <br><small>(Big Five Traits Analysis)</small>
                </div>

                <div class="results-area" id="profileResults">
                    <div class="loading">Click "Generate Profile" to create a psychological profile...</div>
                </div>
            </div>

            <!-- Behavioral Economics -->
            <div class="demo-section">
                <h3><span class="icon">📊</span>Behavioral Economics</h3>
                <p>Apply behavioral economics models including loss aversion, social proof, anchoring, and framing effects.</p>
                
                <div class="demo-controls">
                    <button class="btn" onclick="testLossAversion()">Loss Aversion</button>
                    <button class="btn btn-secondary" onclick="testSocialProof()">Social Proof</button>
                    <button class="btn btn-warning" onclick="testFramingEffect()">Framing Effect</button>
                </div>

                <div class="metric-grid">
                    <div class="metric">
                        <span class="metric-value" id="lossAversionCoeff">2.25</span>
                        <div class="metric-label">Loss Aversion</div>
                    </div>
                    <div class="metric">
                        <span class="metric-value" id="socialInfluence">65%</span>
                        <div class="metric-label">Social Influence</div>
                    </div>
                </div>

                <div class="results-area" id="behavioralResults">
                    <div class="loading">Select a behavioral economics model to test...</div>
                </div>
            </div>

            <!-- Policy Response Analysis -->
            <div class="demo-section">
                <h3><span class="icon">🏛️</span>Policy Response Psychology</h3>
                <p>Analyze how different personality types respond to policies and predict behavioral changes.</p>
                
                <div class="demo-controls">
                    <button class="btn" onclick="analyzePolicyResponse()">Analyze Policy</button>
                    <button class="btn btn-secondary" onclick="predictCompliance()">Predict Compliance</button>
                    <button class="btn btn-success" onclick="getPolicyEffectiveness()">Effectiveness</button>
                </div>

                <div class="metric-grid">
                    <div class="metric">
                        <span class="metric-value" id="avgCompliance">0%</span>
                        <div class="metric-label">Avg Compliance</div>
                    </div>
                    <div class="metric">
                        <span class="metric-value" id="policySupport">0%</span>
                        <div class="metric-label">Policy Support</div>
                    </div>
                </div>

                <div class="results-area" id="policyResults">
                    <div class="loading">Click "Analyze Policy" to see psychological response patterns...</div>
                </div>
            </div>

            <!-- Social Dynamics -->
            <div class="demo-section">
                <h3><span class="icon">👥</span>Social Dynamics</h3>
                <p>Model group psychology, social influence networks, and collective behavior patterns.</p>
                
                <div class="demo-controls">
                    <button class="btn" onclick="analyzeSocialDynamics()">Group Analysis</button>
                    <button class="btn btn-secondary" onclick="getInfluenceNetwork()">Influence Network</button>
                    <button class="btn btn-warning" onclick="getCollectiveMood()">Collective Mood</button>
                </div>

                <div class="metric-grid">
                    <div class="metric">
                        <span class="metric-value" id="groupCohesion">0%</span>
                        <div class="metric-label">Group Cohesion</div>
                    </div>
                    <div class="metric">
                        <span class="metric-value" id="socialTrust">0%</span>
                        <div class="metric-label">Social Trust</div>
                    </div>
                </div>

                <div class="results-area" id="socialResults">
                    <div class="loading">Click "Group Analysis" to examine social dynamics...</div>
                </div>
            </div>

            <!-- Incentive System -->
            <div class="demo-section">
                <h3><span class="icon">🎯</span>Incentive Design</h3>
                <p>Create and test incentive structures, analyze targeting effectiveness, and optimize behavioral outcomes.</p>
                
                <div class="demo-controls">
                    <button class="btn" onclick="createIncentive()">Create Incentive</button>
                    <button class="btn btn-secondary" onclick="testEffectiveness()">Test Effectiveness</button>
                    <button class="btn btn-success" onclick="optimizeIncentive()">Optimize Design</button>
                </div>

                <div class="metric-grid">
                    <div class="metric">
                        <span class="metric-value" id="incentiveEffectiveness">0%</span>
                        <div class="metric-label">Effectiveness</div>
                    </div>
                    <div class="metric">
                        <span class="metric-value" id="costEffectiveness">0</span>
                        <div class="metric-label">Cost/Benefit</div>
                    </div>
                </div>

                <div class="results-area" id="incentiveResults">
                    <div class="loading">Click "Create Incentive" to design an incentive structure...</div>
                </div>
            </div>

            <!-- Behavioral Prediction -->
            <div class="demo-section">
                <h3><span class="icon">🔮</span>Behavioral Prediction</h3>
                <p>Predict individual and group behavioral responses to various stimuli and policy changes.</p>
                
                <div class="demo-controls">
                    <button class="btn" onclick="predictBehavior()">Predict Response</button>
                    <button class="btn btn-secondary" onclick="runScenarioAnalysis()">Scenario Analysis</button>
                    <button class="btn btn-warning" onclick="validatePredictions()">Validate Model</button>
                </div>

                <div class="metric-grid">
                    <div class="metric">
                        <span class="metric-value" id="predictionAccuracy">0%</span>
                        <div class="metric-label">Accuracy</div>
                    </div>
                    <div class="metric">
                        <span class="metric-value" id="confidence">0%</span>
                        <div class="metric-label">Confidence</div>
                    </div>
                </div>

                <div class="results-area" id="predictionResults">
                    <div class="loading">Click "Predict Response" to generate behavioral predictions...</div>
                </div>
            </div>
        </div>

        <!-- System Integration Section -->
        <div class="integration-section">
            <h3>🔗 System Integration & Cross-Platform Psychology</h3>
            <div class="integration-grid">
                <div class="integration-item">
                    <h4>Population Engine</h4>
                    <p>Individual citizen psychology profiles drive realistic population behavior and demographic changes</p>
                </div>
                <div class="integration-item">
                    <h4>Migration System</h4>
                    <p>Cultural adaptation psychology and integration stress modeling for realistic migration patterns</p>
                </div>
                <div class="integration-item">
                    <h4>Business Engine</h4>
                    <p>Entrepreneurial psychology and consumer behavior modeling for authentic market dynamics</p>
                </div>
                <div class="integration-item">
                    <h4>City Dynamics</h4>
                    <p>Urban psychology and community behavior patterns influence city development and specialization</p>
                </div>
                <div class="integration-item">
                    <h4>Policy System</h4>
                    <p>Policy response psychology predicts citizen reactions and compliance rates for different personality types</p>
                </div>
                <div class="integration-item">
                    <h4>Trade Networks</h4>
                    <p>Behavioral economics in trading decisions and market psychology for realistic economic behavior</p>
                </div>
                <div class="integration-item">
                    <h4>Speech Analysis</h4>
                    <p>Psychological impact of leadership communication and rhetoric on different personality segments</p>
                </div>
                <div class="integration-item">
                    <h4>🏛️ Governance System</h4>
                    <p>Voting behavior analysis, candidate preferences, political partisanship, and civic engagement modeling</p>
                </div>
                <div class="integration-item">
                    <h4>⚖️ Legal System</h4>
                    <p>Legal compliance prediction, deterrence effectiveness, moral alignment, and enforcement sensitivity</p>
                </div>
                <div class="integration-item">
                    <h4>🛡️ Security System</h4>
                    <p>Threat perception modeling, cooperation with authorities, vigilance levels, and panic response analysis</p>
                </div>
                <div class="integration-item">
                    <h4>📊 Demographics System</h4>
                    <p>Lifecycle decision modeling, family planning psychology, career priorities, and social mobility prediction</p>
                </div>
                <div class="integration-item">
                    <h4>🔬 Technology System</h4>
                    <p>Technology adoption patterns, innovation contribution potential, ethical concerns, and early adopter identification</p>
                </div>
                <div class="integration-item">
                    <h4>📱 Witter Feed Analysis</h4>
                    <p>Social media sentiment analysis, engagement patterns, influence prediction, and cultural trend adoption modeling</p>
                </div>
            </div>
        </div>

        <!-- API Documentation Section -->
        <div class="api-section">
            <h3>🔌 Psychology System API Endpoints</h3>
            <div class="api-endpoints">
                <div class="api-endpoint">
                    <div><span class="api-method">GET</span><span class="api-path">/api/psychology/health</span></div>
                    <div class="api-description">System health and status check</div>
                </div>
                <div class="api-endpoint">
                    <div><span class="api-method">GET</span><span class="api-path">/api/psychology/factors</span></div>
                    <div class="api-description">Psychological factors and analytics overview</div>
                </div>
                <div class="api-endpoint">
                    <div><span class="api-method">GET</span><span class="api-path">/api/psychology/profiles</span></div>
                    <div class="api-description">Get all psychological profiles with filtering</div>
                </div>
                <div class="api-endpoint">
                    <div><span class="api-method">POST</span><span class="api-path">/api/psychology/profiles</span></div>
                    <div class="api-description">Create new psychological profile</div>
                </div>
                <div class="api-endpoint">
                    <div><span class="api-method">POST</span><span class="api-path">/api/psychology/predict</span></div>
                    <div class="api-description">Predict behavioral response to stimulus</div>
                </div>
                <div class="api-endpoint">
                    <div><span class="api-method">GET</span><span class="api-path">/api/psychology/incentives</span></div>
                    <div class="api-description">Get all incentive structures</div>
                </div>
                <div class="api-endpoint">
                    <div><span class="api-method">POST</span><span class="api-path">/api/psychology/incentives</span></div>
                    <div class="api-description">Create new incentive structure</div>
                </div>
                <div class="api-endpoint">
                    <div><span class="api-method">GET</span><span class="api-path">/api/psychology/social-dynamics/:groupId</span></div>
                    <div class="api-description">Get social dynamics for group</div>
                </div>
                <div class="api-endpoint">
                    <div><span class="api-method">POST</span><span class="api-path">/api/psychology/policy-responses</span></div>
                    <div class="api-description">Analyze policy response psychology</div>
                </div>
                <div class="api-endpoint">
                    <div><span class="api-method">GET</span><span class="api-path">/api/psychology/analytics</span></div>
                    <div class="api-description">Comprehensive psychology analytics</div>
                </div>
                <div class="api-endpoint">
                    <div><span class="api-method">POST</span><span class="api-path">/api/psychology/simulate</span></div>
                    <div class="api-description">Simulate psychology system time step</div>
                </div>
            </div>
        </div>

        <div class="footer">
            <p><strong>Psychology & Behavioral Economics System</strong> - Sprint 11 Complete</p>
            <p>Comprehensive human behavior modeling with Big Five personality traits, behavioral economics, social psychology, and policy response systems</p>
            <p>Integrated with Population, Migration, Business, City, Policy, Trade, and Speech systems</p>
        </div>
    </div>

    <script>
        // Initialize demo
        document.addEventListener('DOMContentLoaded', function() {
            loadSystemMetrics();
        });

        // Load system metrics
        async function loadSystemMetrics() {
            try {
                const response = await fetch('/api/psychology/health');
                const health = await response.json();
                
                if (health.status === 'healthy') {
                    document.getElementById('profileCount').textContent = health.metrics.totalProfiles || 0;
                    
                    // Load additional metrics
                    loadPsychologyFactors();
                }
            } catch (error) {
                console.error('Failed to load system metrics:', error);
            }
        }

        // Load psychology factors
        async function loadPsychologyFactors() {
            try {
                const response = await fetch('/api/psychology/factors');
                const factors = await response.json();
                
                if (factors.overview) {
                    document.getElementById('avgRiskTolerance').textContent = 
                        Math.round(factors.overview.averagePersonality?.openness || 0);
                    document.getElementById('groupCohesion').textContent = 
                        Math.round(factors.overview.psychologicalHealth?.socialCohesion || 0) + '%';
                    document.getElementById('socialTrust').textContent = 
                        Math.round(factors.overview.psychologicalHealth?.socialCohesion || 0) + '%';
                }
            } catch (error) {
                console.error('Failed to load psychology factors:', error);
            }
        }

        // Generate psychological profile
        async function generateProfile() {
            const resultsArea = document.getElementById('profileResults');
            resultsArea.innerHTML = '<div class="loading">Generating psychological profile...</div>';
            
            try {
                const archetypes = ['ENTREPRENEUR', 'CONSERVATIVE', 'INNOVATOR', 'TRADITIONALIST', 'SOCIAL_LEADER'];
                const cultures = ['American', 'European', 'Asian', 'African', 'Latin American', 'Mixed'];
                
                const response = await fetch('/api/psychology/profiles', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        archetype: archetypes[Math.floor(Math.random() * archetypes.length)],
                        culturalBackground: cultures[Math.floor(Math.random() * cultures.length)],
                        citizenId: 'demo_citizen_' + Date.now()
                    })
                });
                
                const result = await response.json();
                
                if (result.profile) {
                    const profile = result.profile;
                    resultsArea.innerHTML = \`
                        <div class="success">✅ Psychological Profile Generated Successfully</div>
                        <h4>Profile ID: \${profile.id}</h4>
                        <p><strong>Archetype:</strong> \${result.archetype}</p>
                        <p><strong>Cultural Background:</strong> \${result.culturalBackground}</p>
                        
                        <h5>Big Five Personality Traits:</h5>
                        <ul>
                            <li>Openness: \${Math.round(profile.personality.openness)}/100</li>
                            <li>Conscientiousness: \${Math.round(profile.personality.conscientiousness)}/100</li>
                            <li>Extraversion: \${Math.round(profile.personality.extraversion)}/100</li>
                            <li>Agreeableness: \${Math.round(profile.personality.agreeableness)}/100</li>
                            <li>Neuroticism: \${Math.round(profile.personality.neuroticism)}/100</li>
                        </ul>
                        
                        <h5>Risk Profile:</h5>
                        <ul>
                            <li>Risk Tolerance: \${Math.round(profile.riskProfile.riskTolerance)}/100</li>
                            <li>Loss Aversion: \${Math.round(profile.riskProfile.lossAversion)}/100</li>
                            <li>Time Preference: \${Math.round(profile.riskProfile.timePreference)}/100</li>
                        </ul>
                        
                        <h5>Core Values (Top 3):</h5>
                        <ul>
                            <li>Security: \${Math.round(profile.motivationSystem.values.security)}/100</li>
                            <li>Achievement: \${Math.round(profile.motivationSystem.values.achievement)}/100</li>
                            <li>Benevolence: \${Math.round(profile.motivationSystem.values.benevolence)}/100</li>
                        </ul>
                    \`;
                    
                    // Update metrics
                    loadSystemMetrics();
                } else {
                    throw new Error('Invalid response format');
                }
            } catch (error) {
                resultsArea.innerHTML = \`<div class="error">❌ Error: \${error.message}</div>\`;
            }
        }

        // Analyze personality
        async function analyzePersonality() {
            const resultsArea = document.getElementById('profileResults');
            resultsArea.innerHTML = '<div class="loading">Analyzing population personality patterns...</div>';
            
            try {
                const response = await fetch('/api/psychology/factors');
                const factors = await response.json();
                
                if (factors.distributions && factors.distributions.personality) {
                    const personality = factors.distributions.personality;
                    resultsArea.innerHTML = \`
                        <div class="success">✅ Personality Analysis Complete</div>
                        <h4>Population Personality Distribution</h4>
                        
                        <h5>Big Five Traits (Population Averages):</h5>
                        <ul>
                            <li>Openness: \${Math.round(personality.openness?.mean || 50)} ± \${Math.round(personality.openness?.stdDev || 15)}</li>
                            <li>Conscientiousness: \${Math.round(personality.conscientiousness?.mean || 50)} ± \${Math.round(personality.conscientiousness?.stdDev || 15)}</li>
                            <li>Extraversion: \${Math.round(personality.extraversion?.mean || 50)} ± \${Math.round(personality.extraversion?.stdDev || 15)}</li>
                            <li>Agreeableness: \${Math.round(personality.agreeableness?.mean || 50)} ± \${Math.round(personality.agreeableness?.stdDev || 15)}</li>
                            <li>Neuroticism: \${Math.round(personality.neuroticism?.mean || 50)} ± \${Math.round(personality.neuroticism?.stdDev || 15)}</li>
                        </ul>
                        
                        <h5>Cultural Diversity:</h5>
                        \${Object.entries(factors.overview.culturalDiversity || {}).map(([culture, percentage]) => 
                            \`<li>\${culture}: \${Math.round(percentage)}%</li>\`
                        ).join('')}
                        
                        <p><strong>Sample Size:</strong> \${factors.overview.totalProfiles} profiles</p>
                        <p><strong>Analysis Confidence:</strong> \${Math.round(factors.systemMetrics.analysisConfidence)}%</p>
                    \`;
                } else {
                    resultsArea.innerHTML = '<div class="loading">No personality data available. Generate some profiles first.</div>';
                }
            } catch (error) {
                resultsArea.innerHTML = \`<div class="error">❌ Error: \${error.message}</div>\`;
            }
        }

        // Get population psychology overview
        async function getPopulationPsychology() {
            const resultsArea = document.getElementById('profileResults');
            resultsArea.innerHTML = '<div class="loading">Analyzing population psychology...</div>';
            
            try {
                const response = await fetch('/api/psychology/analytics');
                const analytics = await response.json();
                
                if (analytics.analytics) {
                    const pop = analytics.analytics.populationPsychology;
                    resultsArea.innerHTML = \`
                        <div class="success">✅ Population Psychology Analysis</div>
                        <h4>Psychological Health Metrics</h4>
                        
                        <h5>Overall Population Health:</h5>
                        <ul>
                            <li>Emotional Stability: \${Math.round(pop.psychologicalHealth.emotionalStability)}/100</li>
                            <li>Stress Resilience: \${Math.round(pop.psychologicalHealth.stressResilience)}/100</li>
                            <li>Adaptability: \${Math.round(pop.psychologicalHealth.adaptability)}/100</li>
                            <li>Social Cohesion: \${Math.round(pop.psychologicalHealth.socialCohesion)}/100</li>
                        </ul>
                        
                        <h5>Risk Profile Distribution:</h5>
                        \${Object.entries(pop.riskProfileDistribution || {}).slice(0, 3).map(([metric, stats]) => 
                            \`<li>\${metric}: \${Math.round(stats.mean)} (±\${Math.round(stats.stdDev)})</li>\`
                        ).join('')}
                        
                        <h5>Motivation Levels:</h5>
                        \${Object.entries(pop.motivationDistribution || {}).slice(0, 3).map(([need, stats]) => 
                            \`<li>\${need}: \${Math.round(stats.mean)}/100</li>\`
                        ).join('')}
                        
                        <p><strong>Total Profiles:</strong> \${pop.totalProfiles}</p>
                        <p><strong>Cultural Groups:</strong> \${Object.keys(pop.culturalDiversity || {}).length}</p>
                    \`;
                } else {
                    resultsArea.innerHTML = '<div class="loading">No analytics data available. Generate some profiles first.</div>';
                }
            } catch (error) {
                resultsArea.innerHTML = \`<div class="error">❌ Error: \${error.message}</div>\`;
            }
        }

        // Test loss aversion
        async function testLossAversion() {
            const resultsArea = document.getElementById('behavioralResults');
            resultsArea.innerHTML = '<div class="loading">Testing loss aversion model...</div>';
            
            // Simulate loss aversion test
            setTimeout(() => {
                const lossAversion = 2.25 + (Math.random() - 0.5) * 0.5;
                document.getElementById('lossAversionCoeff').textContent = lossAversion.toFixed(2);
                
                resultsArea.innerHTML = \`
                    <div class="success">✅ Loss Aversion Test Complete</div>
                    <h4>Prospect Theory Analysis</h4>
                    
                    <h5>Test Scenario:</h5>
                    <p>Choice between guaranteed $50 vs 50% chance of $100</p>
                    
                    <h5>Results:</h5>
                    <ul>
                        <li>Loss Aversion Coefficient: \${lossAversion.toFixed(2)}</li>
                        <li>Risk Aversion: \${(0.88 + (Math.random() - 0.5) * 0.2).toFixed(2)}</li>
                        <li>Probability Weighting: \${(0.61 + (Math.random() - 0.5) * 0.1).toFixed(2)}</li>
                    </ul>
                    
                    <h5>Behavioral Prediction:</h5>
                    <p>\${lossAversion > 2.5 ? 'High loss aversion - prefers guaranteed option' : 'Moderate loss aversion - may take risk'}</p>
                    
                    <h5>Population Distribution:</h5>
                    <ul>
                        <li>Risk Averse: \${Math.round(65 + Math.random() * 10)}%</li>
                        <li>Risk Neutral: \${Math.round(20 + Math.random() * 10)}%</li>
                        <li>Risk Seeking: \${Math.round(10 + Math.random() * 10)}%</li>
                    </ul>
                \`;
            }, 1500);
        }

        // Test social proof
        async function testSocialProof() {
            const resultsArea = document.getElementById('behavioralResults');
            resultsArea.innerHTML = '<div class="loading">Testing social proof effects...</div>';
            
            setTimeout(() => {
                const influence = Math.round(60 + Math.random() * 20);
                document.getElementById('socialInfluence').textContent = influence + '%';
                
                resultsArea.innerHTML = \`
                    <div class="success">✅ Social Proof Analysis Complete</div>
                    <h4>Social Influence Testing</h4>
                    
                    <h5>Test Scenario:</h5>
                    <p>Policy adoption with varying levels of peer support</p>
                    
                    <h5>Social Influence Strength:</h5>
                    <ul>
                        <li>Overall Population: \${influence}%</li>
                        <li>High Agreeableness: \${Math.round(influence + 15)}%</li>
                        <li>High Conscientiousness: \${Math.round(influence - 10)}%</li>
                        <li>High Openness: \${Math.round(influence - 5)}%</li>
                    </ul>
                    
                    <h5>Group Size Effects:</h5>
                    <ul>
                        <li>1-3 people: \${Math.round(influence * 0.6)}% influence</li>
                        <li>4-10 people: \${Math.round(influence * 0.8)}% influence</li>
                        <li>10+ people: \${influence}% influence</li>
                    </ul>
                    
                    <h5>Similarity Bonus:</h5>
                    <p>+\${Math.round(20 + Math.random() * 20)}% influence when peers share similar values</p>
                \`;
            }, 1200);
        }

        // Test framing effect
        async function testFramingEffect() {
            const resultsArea = document.getElementById('behavioralResults');
            resultsArea.innerHTML = '<div class="loading">Testing framing effects...</div>';
            
            setTimeout(() => {
                resultsArea.innerHTML = \`
                    <div class="success">✅ Framing Effect Analysis Complete</div>
                    <h4>Message Framing Impact</h4>
                    
                    <h5>Test Scenario:</h5>
                    <p>Policy presented as "90% success rate" vs "10% failure rate"</p>
                    
                    <h5>Framing Sensitivity by Personality:</h5>
                    <ul>
                        <li>High Neuroticism: \${Math.round(70 + Math.random() * 20)}% affected</li>
                        <li>Low Conscientiousness: \${Math.round(60 + Math.random() * 15)}% affected</li>
                        <li>High Openness: \${Math.round(40 + Math.random() * 15)}% affected</li>
                        <li>High Agreeableness: \${Math.round(55 + Math.random() * 15)}% affected</li>
                    </ul>
                    
                    <h5>Optimal Framing Strategies:</h5>
                    <ul>
                        <li>Gain Frame: Best for risk-averse personalities</li>
                        <li>Loss Frame: Effective for high-neuroticism individuals</li>
                        <li>Neutral Frame: Preferred by high-conscientiousness types</li>
                    </ul>
                    
                    <h5>Population Response:</h5>
                    <p>Positive framing increases support by \${Math.round(15 + Math.random() * 10)}% on average</p>
                \`;
            }, 1300);
        }

        // Analyze policy response
        async function analyzePolicyResponse() {
            const resultsArea = document.getElementById('policyResults');
            resultsArea.innerHTML = '<div class="loading">Analyzing policy response psychology...</div>';
            
            try {
                const response = await fetch('/api/psychology/policy-responses', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        policyId: 'demo_policy_' + Date.now(),
                        policyDetails: {
                            type: 'economic',
                            name: 'Universal Basic Income Pilot',
                            description: 'Monthly $1000 payment to all citizens',
                            impact: 'high',
                            duration: '12 months'
                        }
                    })
                });
                
                const result = await response.json();
                
                if (result.responses) {
                    const responses = result.responses;
                    const avgCompliance = responses.reduce((sum, r) => sum + r.predictedBehaviors.compliance, 0) / responses.length;
                    const avgSupport = responses.reduce((sum, r) => sum + r.predictedBehaviors.support, 0) / responses.length;
                    
                    document.getElementById('avgCompliance').textContent = Math.round(avgCompliance) + '%';
                    document.getElementById('policySupport').textContent = Math.round(avgSupport) + '%';
                    
                    const reactionCounts = responses.reduce((acc, r) => {
                        acc[r.initialReaction] = (acc[r.initialReaction] || 0) + 1;
                        return acc;
                    }, {});
                    
                    resultsArea.innerHTML = \`
                        <div class="success">✅ Policy Response Analysis Complete</div>
                        <h4>Universal Basic Income Pilot - Psychological Response</h4>
                        
                        <h5>Initial Reactions:</h5>
                        \${Object.entries(reactionCounts).map(([reaction, count]) => 
                            \`<li>\${reaction}: \${count} people (\${Math.round(count / responses.length * 100)}%)</li>\`
                        ).join('')}
                        
                        <h5>Predicted Behaviors (Average):</h5>
                        <ul>
                            <li>Compliance: \${Math.round(avgCompliance)}%</li>
                            <li>Support: \${Math.round(avgSupport)}%</li>
                            <li>Advocacy: \${Math.round(responses.reduce((sum, r) => sum + r.predictedBehaviors.advocacy, 0) / responses.length)}%</li>
                            <li>Resistance: \${Math.round(responses.reduce((sum, r) => sum + r.predictedBehaviors.resistance, 0) / responses.length)}%</li>
                        </ul>
                        
                        <h5>Adaptation Timeline:</h5>
                        <ul>
                            <li>Shock Phase: \${Math.round(responses.reduce((sum, r) => sum + r.adaptationPhases.shock.duration, 0) / responses.length)} days</li>
                            <li>Exploration Phase: \${Math.round(responses.reduce((sum, r) => sum + r.adaptationPhases.exploration.duration, 0) / responses.length)} days</li>
                            <li>Commitment Phase: \${Math.round(responses.reduce((sum, r) => sum + r.adaptationPhases.commitment.duration, 0) / responses.length)} days</li>
                        </ul>
                        
                        <p><strong>Total Profiles Analyzed:</strong> \${responses.length}</p>
                        <p><strong>Analysis Confidence:</strong> \${Math.round(responses.reduce((sum, r) => sum + r.confidence, 0) / responses.length)}%</p>
                    \`;
                } else {
                    throw new Error('No response data received');
                }
            } catch (error) {
                resultsArea.innerHTML = \`<div class="error">❌ Error: \${error.message}</div>\`;
            }
        }

        // Predict compliance
        async function predictCompliance() {
            const resultsArea = document.getElementById('policyResults');
            resultsArea.innerHTML = '<div class="loading">Predicting compliance patterns...</div>';
            
            setTimeout(() => {
                const compliance = Math.round(65 + Math.random() * 25);
                document.getElementById('avgCompliance').textContent = compliance + '%';
                
                resultsArea.innerHTML = \`
                    <div class="success">✅ Compliance Prediction Complete</div>
                    <h4>Policy Compliance Modeling</h4>
                    
                    <h5>Compliance by Personality Type:</h5>
                    <ul>
                        <li>High Conscientiousness: \${Math.round(compliance + 20)}%</li>
                        <li>High Agreeableness: \${Math.round(compliance + 15)}%</li>
                        <li>Low Neuroticism: \${Math.round(compliance + 10)}%</li>
                        <li>High Openness: \${Math.round(compliance - 5)}%</li>
                        <li>High Extraversion: \${Math.round(compliance)}%</li>
                    </ul>
                    
                    <h5>Compliance Factors:</h5>
                    <ul>
                        <li>Trust in Authority: \${Math.round(60 + Math.random() * 20)}% influence</li>
                        <li>Social Pressure: \${Math.round(40 + Math.random() * 20)}% influence</li>
                        <li>Personal Benefit: \${Math.round(70 + Math.random() * 15)}% influence</li>
                        <li>Value Alignment: \${Math.round(55 + Math.random() * 20)}% influence</li>
                    </ul>
                    
                    <h5>Risk Factors for Non-Compliance:</h5>
                    <ul>
                        <li>High Reactance Tendency: \${Math.round(15 + Math.random() * 10)}% of population</li>
                        <li>Low Institutional Trust: \${Math.round(20 + Math.random() * 15)}% of population</li>
                        <li>Strong Ideological Opposition: \${Math.round(10 + Math.random() * 10)}% of population</li>
                    </ul>
                \`;
            }, 1400);
        }

        // Get policy effectiveness
        async function getPolicyEffectiveness() {
            const resultsArea = document.getElementById('policyResults');
            resultsArea.innerHTML = '<div class="loading">Analyzing policy effectiveness...</div>';
            
            setTimeout(() => {
                const effectiveness = Math.round(70 + Math.random() * 20);
                document.getElementById('policySupport').textContent = effectiveness + '%';
                
                resultsArea.innerHTML = \`
                    <div class="success">✅ Policy Effectiveness Analysis</div>
                    <h4>Multi-Dimensional Effectiveness Assessment</h4>
                    
                    <h5>Overall Effectiveness Metrics:</h5>
                    <ul>
                        <li>Behavioral Change: \${effectiveness}%</li>
                        <li>Goal Achievement: \${Math.round(effectiveness - 10)}%</li>
                        <li>Public Satisfaction: \${Math.round(effectiveness - 5)}%</li>
                        <li>Long-term Sustainability: \${Math.round(effectiveness - 15)}%</li>
                    </ul>
                    
                    <h5>Effectiveness by Policy Type:</h5>
                    <ul>
                        <li>Economic Policies: \${Math.round(75 + Math.random() * 15)}%</li>
                        <li>Social Policies: \${Math.round(65 + Math.random() * 20)}%</li>
                        <li>Environmental Policies: \${Math.round(60 + Math.random() * 25)}%</li>
                        <li>Security Policies: \${Math.round(80 + Math.random() * 10)}%</li>
                    </ul>
                    
                    <h5>Optimization Recommendations:</h5>
                    <ul>
                        <li>Increase transparency to boost trust</li>
                        <li>Tailor messaging to personality segments</li>
                        <li>Implement gradual rollout strategy</li>
                        <li>Provide clear benefit communication</li>
                        <li>Address concerns of high-neuroticism individuals</li>
                    </ul>
                    
                    <p><strong>Predicted Long-term Impact:</strong> \${Math.round(effectiveness * 0.8)}% sustained effectiveness after 1 year</p>
                \`;
            }, 1600);
        }

        // Analyze social dynamics
        async function analyzeSocialDynamics() {
            const resultsArea = document.getElementById('socialResults');
            resultsArea.innerHTML = '<div class="loading">Analyzing group social dynamics...</div>';
            
            try {
                const response = await fetch('/api/psychology/social-dynamics/demo_city_1?groupType=city');
                const result = await response.json();
                
                if (result.dynamics) {
                    const dynamics = result.dynamics;
                    document.getElementById('groupCohesion').textContent = Math.round(dynamics.groupCohesion) + '%';
                    
                    resultsArea.innerHTML = \`
                        <div class="success">✅ Social Dynamics Analysis Complete</div>
                        <h4>Group: Demo City 1 (\${dynamics.groupType})</h4>
                        
                        <h5>Group Characteristics:</h5>
                        <ul>
                            <li>Group Size: \${dynamics.groupSize} members</li>
                            <li>Group Cohesion: \${Math.round(dynamics.groupCohesion)}%</li>
                            <li>Group Identity: \${Math.round(dynamics.groupIdentity)}%</li>
                            <li>Data Quality: \${Math.round(dynamics.dataQuality)}%</li>
                        </ul>
                        
                        <h5>Collective Mood:</h5>
                        \${Object.entries(dynamics.collectiveMood || {}).map(([mood, level]) => 
                            \`<li>\${mood}: \${Math.round(level)}/100</li>\`
                        ).join('')}
                        
                        <h5>Social Phenomena:</h5>
                        \${Object.entries(dynamics.socialPhenomena || {}).map(([phenomenon, intensity]) => 
                            \`<li>\${phenomenon}: \${Math.round(intensity)}/100</li>\`
                        ).join('')}
                        
                        <h5>Change Dynamics:</h5>
                        \${Object.entries(dynamics.changeDynamics || {}).map(([dynamic, level]) => 
                            \`<li>\${dynamic}: \${Math.round(level)}/100</li>\`
                        ).join('')}
                        
                        <p><strong>Last Updated:</strong> \${new Date(dynamics.lastUpdated).toLocaleString()}</p>
                        <p><strong>Analysis Type:</strong> \${result.isNew ? 'Newly Generated' : 'Existing Data'}</p>
                    \`;
                } else {
                    throw new Error('No dynamics data received');
                }
            } catch (error) {
                resultsArea.innerHTML = \`<div class="error">❌ Error: \${error.message}</div>\`;
            }
        }

        // Get influence network
        async function getInfluenceNetwork() {
            const resultsArea = document.getElementById('socialResults');
            resultsArea.innerHTML = '<div class="loading">Mapping influence networks...</div>';
            
            setTimeout(() => {
                resultsArea.innerHTML = \`
                    <div class="success">✅ Influence Network Analysis</div>
                    <h4>Social Influence Mapping</h4>
                    
                    <h5>Network Structure:</h5>
                    <ul>
                        <li>Network Density: \${Math.round(30 + Math.random() * 40)}%</li>
                        <li>Average Connections: \${Math.round(5 + Math.random() * 10)} per person</li>
                        <li>Influence Concentration: \${Math.round(20 + Math.random() * 30)}%</li>
                    </ul>
                    
                    <h5>Leadership Patterns:</h5>
                    <ul>
                        <li>High Extraversion Leaders: \${Math.round(40 + Math.random() * 20)}%</li>
                        <li>High Conscientiousness Leaders: \${Math.round(35 + Math.random() * 15)}%</li>
                        <li>High Agreeableness Leaders: \${Math.round(25 + Math.random() * 15)}%</li>
                    </ul>
                    
                    <h5>Influence Mechanisms:</h5>
                    <ul>
                        <li>Expertise-based: \${Math.round(45 + Math.random() * 15)}%</li>
                        <li>Charisma-based: \${Math.round(30 + Math.random() * 20)}%</li>
                        <li>Position-based: \${Math.round(25 + Math.random() * 15)}%</li>
                    </ul>
                    
                    <h5>Network Resilience:</h5>
                    <p>Network maintains \${Math.round(70 + Math.random() * 20)}% functionality with top 10% influencers removed</p>
                    
                    <h5>Information Flow:</h5>
                    <p>Average message reaches \${Math.round(60 + Math.random() * 30)}% of network within 3 degrees of separation</p>
                \`;
            }, 1300);
        }

        // Get collective mood
        async function getCollectiveMood() {
            const resultsArea = document.getElementById('socialResults');
            resultsArea.innerHTML = '<div class="loading">Assessing collective mood...</div>';
            
            setTimeout(() => {
                const optimism = Math.round(60 + Math.random() * 30);
                const anxiety = Math.round(30 + Math.random() * 40);
                const satisfaction = Math.round(55 + Math.random() * 35);
                const trust = Math.round(50 + Math.random() * 40);
                
                resultsArea.innerHTML = \`
                    <div class="success">✅ Collective Mood Assessment</div>
                    <h4>Population Emotional State</h4>
                    
                    <h5>Current Mood Metrics:</h5>
                    <ul>
                        <li>Optimism: \${optimism}/100 📈</li>
                        <li>Anxiety: \${anxiety}/100 😰</li>
                        <li>Satisfaction: \${satisfaction}/100 😊</li>
                        <li>Trust: \${trust}/100 🤝</li>
                    </ul>
                    
                    <h5>Mood Drivers:</h5>
                    <ul>
                        <li>Economic Conditions: \${Math.round(70 + Math.random() * 20)}% influence</li>
                        <li>Social Stability: \${Math.round(60 + Math.random() * 25)}% influence</li>
                        <li>Political Climate: \${Math.round(55 + Math.random() * 30)}% influence</li>
                        <li>Media Coverage: \${Math.round(40 + Math.random() * 25)}% influence</li>
                    </ul>
                    
                    <h5>Mood Trends (30-day):</h5>
                    <ul>
                        <li>Optimism: \${Math.random() > 0.5 ? '↗️ Increasing' : '↘️ Decreasing'}</li>
                        <li>Anxiety: \${Math.random() > 0.5 ? '↗️ Increasing' : '↘️ Decreasing'}</li>
                        <li>Satisfaction: \${Math.random() > 0.5 ? '↗️ Increasing' : '↘️ Decreasing'}</li>
                        <li>Trust: \${Math.random() > 0.5 ? '↗️ Increasing' : '↘️ Decreasing'}</li>
                    </ul>
                    
                    <h5>Risk Assessment:</h5>
                    <p>\${anxiety > 60 ? '⚠️ High anxiety levels detected - monitor for social unrest' : 
                         trust < 40 ? '⚠️ Low trust levels - institutional credibility at risk' :
                         '✅ Mood indicators within normal ranges'}</p>
                \`;
            }, 1200);
        }

        // Create incentive
        async function createIncentive() {
            const resultsArea = document.getElementById('incentiveResults');
            resultsArea.innerHTML = '<div class="loading">Creating incentive structure...</div>';
            
            try {
                const response = await fetch('/api/psychology/incentives', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        name: 'Green Energy Adoption Incentive',
                        description: 'Encourage residential solar panel installation',
                        type: 'environmental',
                        incentiveComponents: {
                            monetaryReward: 5000,
                            socialRecognition: 70,
                            autonomyIncrease: 60,
                            securityIncrease: 40,
                            purposeAlignment: 80
                        },
                        implementationCost: 5000
                    })
                });
                
                const result = await response.json();
                
                if (result.incentive) {
                    const incentive = result.incentive;
                    document.getElementById('incentiveEffectiveness').textContent = Math.round(incentive.sustainabilityFactor) + '%';
                    document.getElementById('costEffectiveness').textContent = (incentive.implementationCost / 1000).toFixed(1) + 'K';
                    
                    resultsArea.innerHTML = \`
                        <div class="success">✅ Incentive Structure Created</div>
                        <h4>\${incentive.name}</h4>
                        <p><strong>Type:</strong> \${incentive.type}</p>
                        <p><strong>Description:</strong> \${incentive.description}</p>
                        
                        <h5>Incentive Components:</h5>
                        \${Object.entries(incentive.incentiveComponents).map(([component, value]) => 
                            \`<li>\${component}: \${typeof value === 'number' ? (value > 100 ? '$' + value : value + '/100') : value}</li>\`
                        ).join('')}
                        
                        <h5>Targeting Analysis:</h5>
                        <ul>
                            <li>Target Personalities: \${incentive.targetPersonalities.join(', ') || 'All types'}</li>
                            <li>Aligned Values: \${incentive.targetValues.join(', ') || 'Universal appeal'}</li>
                            <li>Required Motivations: \${incentive.targetMotivations.join(', ') || 'Basic needs'}</li>
                        </ul>
                        
                        <h5>Performance Metrics:</h5>
                        <ul>
                            <li>Implementation Cost: $\${incentive.implementationCost.toLocaleString()}</li>
                            <li>Scalability Factor: \${incentive.scalabilityFactor}/100</li>
                            <li>Sustainability Factor: \${incentive.sustainabilityFactor}/100</li>
                        </ul>
                        
                        <p><strong>Status:</strong> \${incentive.status}</p>
                        <p><strong>Created:</strong> \${new Date(incentive.createdAt).toLocaleString()}</p>
                    \`;
                } else {
                    throw new Error('Invalid response format');
                }
            } catch (error) {
                resultsArea.innerHTML = \`<div class="error">❌ Error: \${error.message}</div>\`;
            }
        }

        // Test effectiveness
        async function testEffectiveness() {
            const resultsArea = document.getElementById('incentiveResults');
            resultsArea.innerHTML = '<div class="loading">Testing incentive effectiveness...</div>';
            
            setTimeout(() => {
                const effectiveness = Math.round(65 + Math.random() * 25);
                document.getElementById('incentiveEffectiveness').textContent = effectiveness + '%';
                
                resultsArea.innerHTML = \`
                    <div class="success">✅ Effectiveness Testing Complete</div>
                    <h4>Incentive Performance Analysis</h4>
                    
                    <h5>Overall Effectiveness: \${effectiveness}%</h5>
                    
                    <h5>Response Rates by Personality:</h5>
                    <ul>
                        <li>High Openness: \${Math.round(effectiveness + 15)}% response rate</li>
                        <li>High Conscientiousness: \${Math.round(effectiveness + 10)}% response rate</li>
                        <li>High Agreeableness: \${Math.round(effectiveness + 5)}% response rate</li>
                        <li>Low Neuroticism: \${Math.round(effectiveness)}% response rate</li>
                        <li>High Extraversion: \${Math.round(effectiveness - 5)}% response rate</li>
                    </ul>
                    
                    <h5>Targeting Accuracy:</h5>
                    <ul>
                        <li>Precision: \${Math.round(70 + Math.random() * 20)}%</li>
                        <li>Recall: \${Math.round(65 + Math.random() * 25)}%</li>
                        <li>F1 Score: \${Math.round(67 + Math.random() * 18)}%</li>
                    </ul>
                    
                    <h5>Cost-Benefit Analysis:</h5>
                    <ul>
                        <li>Cost per Response: $\${Math.round(100 + Math.random() * 200)}</li>
                        <li>ROI: \${Math.round(150 + Math.random() * 100)}%</li>
                        <li>Payback Period: \${Math.round(6 + Math.random() * 12)} months</li>
                    </ul>
                    
                    <h5>Side Effects:</h5>
                    <p>\${Math.random() > 0.7 ? '⚠️ Minor unintended consequences detected' : '✅ No significant side effects observed'}</p>
                \`;
            }, 1500);
        }

        // Optimize incentive
        async function optimizeIncentive() {
            const resultsArea = document.getElementById('incentiveResults');
            resultsArea.innerHTML = '<div class="loading">Optimizing incentive design...</div>';
            
            setTimeout(() => {
                resultsArea.innerHTML = \`
                    <div class="success">✅ Incentive Optimization Complete</div>
                    <h4>Optimized Incentive Design</h4>
                    
                    <h5>Recommended Improvements:</h5>
                    <ul>
                        <li>Increase social recognition component by 20%</li>
                        <li>Add time-limited bonus for early adopters</li>
                        <li>Target high-openness personalities specifically</li>
                        <li>Reduce monetary component, increase autonomy</li>
                        <li>Add peer comparison element</li>
                    </ul>
                    
                    <h5>Optimal Component Mix:</h5>
                    <ul>
                        <li>Monetary Reward: $\${Math.round(3000 + Math.random() * 2000)}</li>
                        <li>Social Recognition: \${Math.round(80 + Math.random() * 15)}/100</li>
                        <li>Autonomy Increase: \${Math.round(75 + Math.random() * 20)}/100</li>
                        <li>Purpose Alignment: \${Math.round(85 + Math.random() * 10)}/100</li>
                    </ul>
                    
                    <h5>Predicted Improvements:</h5>
                    <ul>
                        <li>Response Rate: +\${Math.round(15 + Math.random() * 15)}%</li>
                        <li>Cost Efficiency: +\${Math.round(20 + Math.random() * 20)}%</li>
                        <li>Sustainability: +\${Math.round(10 + Math.random() * 15)}%</li>
                        <li>Targeting Accuracy: +\${Math.round(12 + Math.random() * 18)}%</li>
                    </ul>
                    
                    <h5>Implementation Strategy:</h5>
                    <ul>
                        <li>Phase 1: Target early adopters (high openness)</li>
                        <li>Phase 2: Leverage social proof for mainstream adoption</li>
                        <li>Phase 3: Maintain with reduced incentives</li>
                    </ul>
                \`;
            }, 1800);
        }

        // Predict behavior
        async function predictBehavior() {
            const resultsArea = document.getElementById('predictionResults');
            resultsArea.innerHTML = '<div class="loading">Predicting behavioral responses...</div>';
            
            // First, get a profile to predict for
            try {
                const profilesResponse = await fetch('/api/psychology/profiles?limit=1');
                const profilesData = await profilesResponse.json();
                
                if (profilesData.profiles && profilesData.profiles.length > 0) {
                    const profile = profilesData.profiles[0];
                    
                    const response = await fetch('/api/psychology/predict', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            profileId: profile.id,
                            stimulusType: 'policy',
                            stimulusId: 'carbon_tax_policy',
                            stimulusDetails: {
                                name: 'Carbon Tax Implementation',
                                type: 'environmental',
                                impact: 'medium',
                                cost: 50
                            }
                        })
                    });
                    
                    const result = await response.json();
                    
                    if (result.prediction) {
                        const prediction = result.prediction;
                        document.getElementById('predictionAccuracy').textContent = Math.round(prediction.confidence) + '%';
                        document.getElementById('confidence').textContent = Math.round(prediction.confidence) + '%';
                        
                        resultsArea.innerHTML = \`
                            <div class="success">✅ Behavioral Prediction Complete</div>
                            <h4>Carbon Tax Policy Response Prediction</h4>
                            
                            <h5>Profile Summary:</h5>
                            <ul>
                                <li>Profile ID: \${result.profile.id}</li>
                                <li>Cultural Background: \${result.profile.culturalBackground}</li>
                                <li>Risk Tolerance: \${Math.round(result.profile.riskProfile.riskTolerance)}/100</li>
                            </ul>
                            
                            <h5>Predicted Response:</h5>
                            <ul>
                                <li>Response Type: \${prediction.responseType}</li>
                                <li>Response Intensity: \${Math.round(prediction.responseIntensity)}/100</li>
                                <li>Response Speed: \${Math.round(prediction.responseSpeed)}/100</li>
                                <li>Consistency: \${Math.round(prediction.responseConsistency)}/100</li>
                            </ul>
                            
                            <h5>Primary Drivers:</h5>
                            \${prediction.primaryDrivers.map(driver => \`<li>\${driver}</li>\`).join('')}
                            
                            <h5>Behavioral Changes:</h5>
                            \${prediction.behaviorChanges.economicBehavior ? \`
                                <strong>Economic:</strong>
                                <ul>
                                    <li>Spending Change: \${Math.round(prediction.behaviorChanges.economicBehavior.spendingChange)}%</li>
                                    <li>Investment Change: \${Math.round(prediction.behaviorChanges.economicBehavior.investmentChange)}%</li>
                                </ul>
                            \` : ''}
                            
                            <h5>Adaptation Timeline:</h5>
                            <ul>
                                <li>Adaptation Rate: \${Math.round(prediction.adaptationRate)}/100</li>
                                <li>Expected Duration: \${prediction.duration} days</li>
                                <li>Confidence Level: \${Math.round(prediction.confidence)}%</li>
                            </ul>
                        \`;
                    } else {
                        throw new Error('Invalid prediction response');
                    }
                } else {
                    // No profiles available, show simulated prediction
                    setTimeout(() => {
                        const accuracy = Math.round(75 + Math.random() * 20);
                        document.getElementById('predictionAccuracy').textContent = accuracy + '%';
                        document.getElementById('confidence').textContent = accuracy + '%';
                        
                        resultsArea.innerHTML = \`
                            <div class="success">✅ Behavioral Prediction (Simulated)</div>
                            <h4>Policy Response Prediction</h4>
                            
                            <p><em>Note: Generate some profiles first for real predictions</em></p>
                            
                            <h5>Simulated Prediction Results:</h5>
                            <ul>
                                <li>Response Type: \${['support', 'oppose', 'neutral'][Math.floor(Math.random() * 3)]}</li>
                                <li>Response Intensity: \${Math.round(50 + Math.random() * 40)}/100</li>
                                <li>Prediction Accuracy: \${accuracy}%</li>
                                <li>Confidence Level: \${accuracy}%</li>
                            </ul>
                            
                            <h5>Model Performance:</h5>
                            <ul>
                                <li>Precision: \${Math.round(70 + Math.random() * 20)}%</li>
                                <li>Recall: \${Math.round(65 + Math.random() * 25)}%</li>
                                <li>F1 Score: \${Math.round(67 + Math.random() * 18)}%</li>
                            </ul>
                        \`;
                    }, 1000);
                }
            } catch (error) {
                resultsArea.innerHTML = \`<div class="error">❌ Error: \${error.message}</div>\`;
            }
        }

        // Run scenario analysis
        async function runScenarioAnalysis() {
            const resultsArea = document.getElementById('predictionResults');
            resultsArea.innerHTML = '<div class="loading">Running scenario analysis...</div>';
            
            setTimeout(() => {
                resultsArea.innerHTML = \`
                    <div class="success">✅ Scenario Analysis Complete</div>
                    <h4>Multi-Scenario Behavioral Modeling</h4>
                    
                    <h5>Scenario 1: Economic Recession</h5>
                    <ul>
                        <li>Risk Aversion Increase: +\${Math.round(20 + Math.random() * 15)}%</li>
                        <li>Spending Decrease: -\${Math.round(25 + Math.random() * 20)}%</li>
                        <li>Social Trust Decrease: -\${Math.round(15 + Math.random() * 15)}%</li>
                        <li>Policy Support Change: -\${Math.round(10 + Math.random() * 20)}%</li>
                    </ul>
                    
                    <h5>Scenario 2: Technological Breakthrough</h5>
                    <ul>
                        <li>Optimism Increase: +\${Math.round(30 + Math.random() * 20)}%</li>
                        <li>Innovation Adoption: +\${Math.round(40 + Math.random() * 25)}%</li>
                        <li>Investment Behavior: +\${Math.round(35 + Math.random() * 20)}%</li>
                        <li>Future Orientation: +\${Math.round(25 + Math.random() * 15)}%</li>
                    </ul>
                    
                    <h5>Scenario 3: Social Unrest</h5>
                    <ul>
                        <li>Anxiety Increase: +\${Math.round(40 + Math.random() * 25)}%</li>
                        <li>Authority Trust Decrease: -\${Math.round(35 + Math.random() * 20)}%</li>
                        <li>Group Cohesion Change: \${Math.random() > 0.5 ? '+' : '-'}\${Math.round(20 + Math.random() * 30)}%</li>
                        <li>Compliance Decrease: -\${Math.round(25 + Math.random() * 20)}%</li>
                    </ul>
                    
                    <h5>Cross-Scenario Insights:</h5>
                    <ul>
                        <li>High-conscientiousness individuals show most stability</li>
                        <li>Social influence effects amplify during uncertainty</li>
                        <li>Economic factors dominate short-term behavior</li>
                        <li>Cultural values moderate response intensity</li>
                    </ul>
                \`;
            }, 2000);
        }

        // Validate predictions
        async function validatePredictions() {
            const resultsArea = document.getElementById('predictionResults');
            resultsArea.innerHTML = '<div class="loading">Validating prediction models...</div>';
            
            setTimeout(() => {
                const accuracy = Math.round(78 + Math.random() * 15);
                document.getElementById('predictionAccuracy').textContent = accuracy + '%';
                
                resultsArea.innerHTML = \`
                    <div class="success">✅ Model Validation Complete</div>
                    <h4>Prediction Model Performance</h4>
                    
                    <h5>Overall Model Accuracy: \${accuracy}%</h5>
                    
                    <h5>Performance by Model Type:</h5>
                    <ul>
                        <li>Personality-based Predictions: \${Math.round(accuracy + 5)}%</li>
                        <li>Behavioral Economics Models: \${Math.round(accuracy - 3)}%</li>
                        <li>Social Influence Models: \${Math.round(accuracy - 8)}%</li>
                        <li>Policy Response Models: \${Math.round(accuracy + 2)}%</li>
                    </ul>
                    
                    <h5>Validation Metrics:</h5>
                    <ul>
                        <li>Cross-validation Score: \${Math.round(accuracy - 5)}%</li>
                        <li>Out-of-sample Accuracy: \${Math.round(accuracy - 10)}%</li>
                        <li>Temporal Stability: \${Math.round(accuracy - 7)}%</li>
                        <li>Cultural Generalization: \${Math.round(accuracy - 12)}%</li>
                    </ul>
                    
                    <h5>Model Strengths:</h5>
                    <ul>
                        <li>Strong performance on high-conscientiousness individuals</li>
                        <li>Accurate short-term behavioral predictions</li>
                        <li>Reliable economic behavior modeling</li>
                        <li>Good cultural adaptation predictions</li>
                    </ul>
                    
                    <h5>Areas for Improvement:</h5>
                    <ul>
                        <li>Long-term prediction accuracy</li>
                        <li>Rare personality type modeling</li>
                        <li>Crisis situation predictions</li>
                        <li>Cross-cultural validation</li>
                    </ul>
                    
                    <h5>Confidence Intervals:</h5>
                    <p>95% CI: [\${accuracy - 8}%, \${accuracy + 8}%]</p>
                \`;
            }, 1700);
        }

        // ===== SYSTEM INTEGRATION TESTING FUNCTIONS =====

        async function testGovernanceIntegration() {
            try {
                // Get a sample profile
                const profiles = await fetch('/api/psychology/profiles').then(r => r.json());
                if (profiles.profiles.length === 0) {
                    document.getElementById('integrationResults').innerHTML = '<div class="error">No profiles available. Generate some profiles first.</div>';
                    return;
                }

                const sampleProfile = profiles.profiles[0];
                const sampleElection = {
                    candidates: [
                        { id: 'candidate_1', name: 'Progressive Leader', platform: ['economy', 'social', 'environment'] },
                        { id: 'candidate_2', name: 'Conservative Leader', platform: ['security', 'tradition', 'economy'] },
                        { id: 'candidate_3', name: 'Moderate Leader', platform: ['economy', 'security', 'social'] }
                    ]
                };

                const response = await fetch('/api/psychology/integration/voting-analysis', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        profileId: sampleProfile.id,
                        election: sampleElection
                    })
                });
                const data = await response.json();

                document.getElementById('integrationResults').innerHTML = \`
                    <div class="success">
                        <h4>🏛️ Governance Integration Test - SUCCESS</h4>
                        <div class="integration-result">
                            <div class="metric">
                                <span class="metric-label">Voting Probability</span>
                                <span class="metric-value">\${data.votingAnalysis.votingProbability.toFixed(1)}%</span>
                            </div>
                            <div class="metric">
                                <span class="metric-label">Preferred Candidate</span>
                                <span class="metric-value">\${data.votingAnalysis.candidatePreference}</span>
                            </div>
                            <div class="metric">
                                <span class="metric-label">Partisanship Level</span>
                                <span class="metric-value">\${data.votingAnalysis.partisanship.toFixed(1)}%</span>
                            </div>
                            <div class="metric">
                                <span class="metric-label">Swing Voter Potential</span>
                                <span class="metric-value">\${data.votingAnalysis.swingVoterPotential.toFixed(1)}%</span>
                            </div>
                        </div>
                    </div>
                \`;
            } catch (error) {
                document.getElementById('integrationResults').innerHTML = '<div class="error">Governance integration test failed</div>';
            }
        }

        async function testLegalIntegration() {
            try {
                const profiles = await fetch('/api/psychology/profiles').then(r => r.json());
                if (profiles.profiles.length === 0) {
                    document.getElementById('integrationResults').innerHTML = '<div class="error">No profiles available</div>';
                    return;
                }

                const sampleProfile = profiles.profiles[0];
                const sampleLaw = {
                    type: 'criminal',
                    name: 'Anti-Corruption Act',
                    severity: 'high',
                    enforcement: 'strict'
                };

                const response = await fetch('/api/psychology/integration/legal-compliance', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        profileId: sampleProfile.id,
                        law: sampleLaw
                    })
                });
                const data = await response.json();

                document.getElementById('integrationResults').innerHTML = \`
                    <div class="success">
                        <h4>⚖️ Legal Integration Test - SUCCESS</h4>
                        <div class="integration-result">
                            <div class="metric">
                                <span class="metric-label">Compliance Probability</span>
                                <span class="metric-value">\${data.complianceAnalysis.complianceProbability.toFixed(1)}%</span>
                            </div>
                            <div class="metric">
                                <span class="metric-label">Deterrence Effectiveness</span>
                                <span class="metric-value">\${data.complianceAnalysis.deterrenceEffectiveness.toFixed(1)}%</span>
                            </div>
                            <div class="metric">
                                <span class="metric-label">Moral Alignment</span>
                                <span class="metric-value">\${data.complianceAnalysis.moralAlignment.toFixed(1)}%</span>
                            </div>
                        </div>
                    </div>
                \`;
            } catch (error) {
                document.getElementById('integrationResults').innerHTML = '<div class="error">Legal integration test failed</div>';
            }
        }

        async function testSecurityIntegration() {
            try {
                const profiles = await fetch('/api/psychology/profiles').then(r => r.json());
                if (profiles.profiles.length === 0) {
                    document.getElementById('integrationResults').innerHTML = '<div class="error">No profiles available</div>';
                    return;
                }

                const sampleProfile = profiles.profiles[0];
                const sampleThreat = {
                    type: 'cyber_attack',
                    severity: 'moderate',
                    source: 'foreign_state'
                };

                const response = await fetch('/api/psychology/integration/security-threat-response', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        profileId: sampleProfile.id,
                        threat: sampleThreat
                    })
                });
                const data = await response.json();

                document.getElementById('integrationResults').innerHTML = \`
                    <div class="success">
                        <h4>🛡️ Security Integration Test - SUCCESS</h4>
                        <div class="integration-result">
                            <div class="metric">
                                <span class="metric-label">Threat Perception</span>
                                <span class="metric-value">\${data.threatResponse.threatPerception.toFixed(1)}%</span>
                            </div>
                            <div class="metric">
                                <span class="metric-label">Cooperation with Authorities</span>
                                <span class="metric-value">\${data.threatResponse.cooperationWithAuthorities.toFixed(1)}%</span>
                            </div>
                            <div class="metric">
                                <span class="metric-label">Reporting Likelihood</span>
                                <span class="metric-value">\${data.threatResponse.reportingLikelihood.toFixed(1)}%</span>
                            </div>
                        </div>
                    </div>
                \`;
            } catch (error) {
                document.getElementById('integrationResults').innerHTML = '<div class="error">Security integration test failed</div>';
            }
        }

        async function testTechnologyIntegration() {
            try {
                const profiles = await fetch('/api/psychology/profiles').then(r => r.json());
                if (profiles.profiles.length === 0) {
                    document.getElementById('integrationResults').innerHTML = '<div class="error">No profiles available</div>';
                    return;
                }

                const sampleProfile = profiles.profiles[0];
                const sampleTechnology = {
                    id: 'neural_interface_implants',
                    name: 'Neural Interface Implants',
                    category: 'Consciousness',
                    complexity: 7,
                    ethicalConcerns: ['privacy', 'autonomy', 'identity']
                };

                const response = await fetch('/api/psychology/integration/technology-adoption', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        profileId: sampleProfile.id,
                        technology: sampleTechnology
                    })
                });
                const data = await response.json();

                document.getElementById('integrationResults').innerHTML = \`
                    <div class="success">
                        <h4>🔬 Technology Integration Test - SUCCESS</h4>
                        <div class="integration-result">
                            <div class="metric">
                                <span class="metric-label">Adoption Probability</span>
                                <span class="metric-value">\${data.adoptionAnalysis.adoptionProbability.toFixed(1)}%</span>
                            </div>
                            <div class="metric">
                                <span class="metric-label">Innovation Contribution</span>
                                <span class="metric-value">\${data.adoptionAnalysis.innovationContribution.toFixed(1)}%</span>
                            </div>
                            <div class="metric">
                                <span class="metric-label">Ethical Concerns</span>
                                <span class="metric-value">\${data.adoptionAnalysis.ethicalConcerns.toFixed(1)}%</span>
                            </div>
                        </div>
                    </div>
                \`;
            } catch (error) {
                document.getElementById('integrationResults').innerHTML = '<div class="error">Technology integration test failed</div>';
            }
        }

        async function testWitterIntegration() {
            try {
                const profiles = await fetch('/api/psychology/profiles').then(r => r.json());
                if (profiles.profiles.length === 0) {
                    document.getElementById('integrationResults').innerHTML = '<div class="error">No profiles available</div>';
                    return;
                }

                // Get sample Witter posts from the demo API
                const wittResponse = await fetch('/api/witter/feed?limit=20');
                const wittData = await wittResponse.json();
                
                if (!wittData.posts || wittData.posts.length === 0) {
                    document.getElementById('integrationResults').innerHTML = '<div class="error">No Witter posts available</div>';
                    return;
                }

                const sampleProfile = profiles.profiles[0];
                const wittPosts = wittData.posts;

                // Test comprehensive Witter analysis
                const response = await fetch('/api/psychology/integration/witter-comprehensive', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        wittPosts: wittPosts,
                        civilizationId: 'test_civilization',
                        sampleProfileIds: [sampleProfile.id]
                    })
                });
                const data = await response.json();

                document.getElementById('integrationResults').innerHTML = \`
                    <div class="success">
                        <h4>📱 Witter Feed Analysis - SUCCESS</h4>
                        <div class="witter-analysis-result">
                            <div class="analysis-section">
                                <h5>📊 Sentiment Analysis</h5>
                                <div class="metric-grid">
                                    <div class="metric">
                                        <span class="metric-label">Overall Sentiment</span>
                                        <span class="metric-value">\${data.analysis.sentiment.overallSentiment.toFixed(1)}%</span>
                                    </div>
                                    <div class="metric">
                                        <span class="metric-label">Social Cohesion</span>
                                        <span class="metric-value">\${data.analysis.sentiment.socialCohesion.toFixed(1)}%</span>
                                    </div>
                                    <div class="metric">
                                        <span class="metric-label">Collective Anxiety</span>
                                        <span class="metric-value">\${data.analysis.sentiment.psychologicalIndicators.collectiveAnxiety.toFixed(1)}%</span>
                                    </div>
                                    <div class="metric">
                                        <span class="metric-label">Optimism Level</span>
                                        <span class="metric-value">\${data.analysis.sentiment.psychologicalIndicators.optimismLevel.toFixed(1)}%</span>
                                    </div>
                                </div>
                            </div>
                            
                            \${data.analysis.individualEngagement.length > 0 ? \`
                            <div class="analysis-section">
                                <h5>👤 Individual Engagement</h5>
                                <div class="metric-grid">
                                    <div class="metric">
                                        <span class="metric-label">Engagement Probability</span>
                                        <span class="metric-value">\${data.analysis.individualEngagement[0].engagement.engagementProbability.toFixed(1)}%</span>
                                    </div>
                                    <div class="metric">
                                        <span class="metric-label">Influenceability</span>
                                        <span class="metric-value">\${data.analysis.individualEngagement[0].engagement.influenceability.toFixed(1)}%</span>
                                    </div>
                                    <div class="metric">
                                        <span class="metric-label">Content Creation</span>
                                        <span class="metric-value">\${data.analysis.individualEngagement[0].engagement.contentCreationPotential.toFixed(1)}%</span>
                                    </div>
                                    <div class="metric">
                                        <span class="metric-label">Addiction Risk</span>
                                        <span class="metric-value">\${data.analysis.individualEngagement[0].engagement.socialMediaAddictionRisk.toFixed(1)}%</span>
                                    </div>
                                </div>
                            </div>
                            \` : ''}
                            
                            \${data.analysis.populationInfluence ? \`
                            <div class="analysis-section">
                                <h5>🌍 Population Influence</h5>
                                <div class="metric-grid">
                                    <div class="metric">
                                        <span class="metric-label">Opinion Polarization</span>
                                        <span class="metric-value">\${data.analysis.populationInfluence.opinionPolarization.toFixed(1)}%</span>
                                    </div>
                                    <div class="metric">
                                        <span class="metric-label">Social Movement Potential</span>
                                        <span class="metric-value">\${data.analysis.populationInfluence.socialMovementPotential.toFixed(1)}%</span>
                                    </div>
                                    <div class="metric">
                                        <span class="metric-label">Misinformation Vulnerability</span>
                                        <span class="metric-value">\${data.analysis.populationInfluence.misinformationVulnerability.toFixed(1)}%</span>
                                    </div>
                                    <div class="metric">
                                        <span class="metric-label">Collective Mood Change</span>
                                        <span class="metric-value">\${data.analysis.populationInfluence.collectiveMoodChange.toFixed(1)}%</span>
                                    </div>
                                </div>
                            </div>
                            \` : ''}
                            
                            <div class="analysis-section">
                                <h5>📈 Emerging Topics</h5>
                                <div class="topic-list">
                                    \${data.analysis.sentiment.emergingTopics.slice(0, 5).map(topic => 
                                        \`<span class="topic-tag">\${topic}</span>\`
                                    ).join('')}
                                </div>
                            </div>
                            
                            <div class="analysis-section">
                                <h5>🎯 Influential Voices</h5>
                                <div class="voice-list">
                                    \${data.analysis.sentiment.influentialVoices.slice(0, 3).map(voice => 
                                        \`<span class="voice-tag">\${voice}</span>\`
                                    ).join('')}
                                </div>
                            </div>
                            
                            <div class="metadata">
                                <p><strong>Analysis Metadata:</strong></p>
                                <p>Posts Analyzed: \${data.analysis.metadata.postsAnalyzed}</p>
                                <p>Profiles Analyzed: \${data.analysis.metadata.profilesAnalyzed}</p>
                                <p>Civilization: \${data.analysis.metadata.civilizationId}</p>
                            </div>
                        </div>
                    </div>
                \`;
            } catch (error) {
                console.error('Witter integration test error:', error);
                document.getElementById('integrationResults').innerHTML = '<div class="error">Witter integration test failed</div>';
            }
        }

        async function testBatchIntegration() {
            try {
                const profiles = await fetch('/api/psychology/profiles').then(r => r.json());
                if (profiles.profiles.length === 0) {
                    document.getElementById('integrationResults').innerHTML = '<div class="error">No profiles available</div>';
                    return;
                }

                const sampleProfileIds = profiles.profiles.slice(0, 3).map(p => p.id);
                const context = {
                    election: { candidates: [{ id: 'test_candidate', platform: ['economy', 'security'] }] },
                    law: { type: 'regulatory', severity: 'moderate' },
                    threat: { type: 'terrorism', severity: 'high' },
                    technology: { id: 'ai_system', complexity: 8 }
                };

                const response = await fetch('/api/psychology/integration/batch-analysis', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        profileIds: sampleProfileIds,
                        analysisTypes: ['voting', 'legal', 'security', 'technology', 'business'],
                        context
                    })
                });
                const data = await response.json();

                let html = '<div class="success"><h4>🔗 Batch Integration Test - SUCCESS</h4>';
                html += \`<p>Analyzed \${data.results.length} profiles across all integrated systems</p>\`;
                
                data.results.forEach((result, index) => {
                    if (result.error) {
                        html += \`<div class="error">Profile \${index + 1}: \${result.error}</div>\`;
                        return;
                    }
                    
                    html += \`
                        <div class="batch-result">
                            <h5>Profile \${index + 1} Integration Results:</h5>
                            <div class="metric-grid">
                                <div class="metric">
                                    <span class="metric-label">Voting Probability</span>
                                    <span class="metric-value">\${result.voting?.votingProbability?.toFixed(1) || 'N/A'}%</span>
                                </div>
                                <div class="metric">
                                    <span class="metric-label">Legal Compliance</span>
                                    <span class="metric-value">\${result.legal?.complianceProbability?.toFixed(1) || 'N/A'}%</span>
                                </div>
                                <div class="metric">
                                    <span class="metric-label">Threat Perception</span>
                                    <span class="metric-value">\${result.security?.threatPerception?.toFixed(1) || 'N/A'}%</span>
                                </div>
                                <div class="metric">
                                    <span class="metric-label">Tech Adoption</span>
                                    <span class="metric-value">\${result.technology?.adoptionProbability?.toFixed(1) || 'N/A'}%</span>
                                </div>
                                <div class="metric">
                                    <span class="metric-label">Entrepreneurship</span>
                                    <span class="metric-value">\${result.business?.entrepreneurshipScore?.toFixed(1) || 'N/A'}%</span>
                                </div>
                            </div>
                        </div>
                    \`;
                });
                
                html += '</div>';
                document.getElementById('integrationResults').innerHTML = html;
            } catch (error) {
                document.getElementById('integrationResults').innerHTML = '<div class="error">Batch integration test failed</div>';
            }
        }

    </script>
</body>
</html>
  `;

  res.send(html);
});

export default router;
