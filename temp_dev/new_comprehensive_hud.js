// New comprehensive HUD route to replace the existing one
const newHudRoute = `
app.get('/demo/hud', (_req, res) => {
  res.type('html').send(\`<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>StarTales Comprehensive Demo HUD</title>
    <style>
      body { 
        font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; 
        margin: 0; 
        padding: 0; 
        background: linear-gradient(135deg, #0f0f23 0%, #1a1a2e 100%); 
        color: #ffffff; 
        min-height: 100vh; 
      }
      .header { 
        background: linear-gradient(90deg, #4ecdc4 0%, #44a08d 100%); 
        padding: 30px; 
        text-align: center; 
        box-shadow: 0 4px 20px rgba(0,0,0,0.3); 
      }
      .header h1 { 
        margin: 0; 
        font-size: 3em; 
        text-shadow: 2px 2px 4px rgba(0,0,0,0.3); 
        color: white;
      }
      .header p { 
        margin: 15px 0 0 0; 
        font-size: 1.2em; 
        opacity: 0.9; 
        color: white;
      }
      .container { 
        max-width: 1600px; 
        margin: 0 auto; 
        padding: 30px; 
      }
      .category { 
        background: rgba(255,255,255,0.05); 
        border-radius: 15px; 
        padding: 30px; 
        margin-bottom: 30px; 
        backdrop-filter: blur(10px); 
        border: 1px solid rgba(255,255,255,0.1); 
        box-shadow: 0 8px 32px rgba(0,0,0,0.3); 
      }
      .category h2 { 
        color: #4ecdc4; 
        margin-top: 0; 
        font-size: 2em; 
        border-bottom: 3px solid #4ecdc4; 
        padding-bottom: 15px; 
        margin-bottom: 25px;
      }
      .demo-grid { 
        display: grid; 
        grid-template-columns: repeat(auto-fit, minmax(350px, 1fr)); 
        gap: 20px; 
      }
      .demo-card { 
        background: rgba(255,255,255,0.08); 
        border-radius: 12px; 
        padding: 25px; 
        border: 1px solid rgba(78, 205, 196, 0.3); 
        transition: all 0.3s ease; 
        position: relative;
        overflow: hidden;
      }
      .demo-card:hover { 
        transform: translateY(-8px); 
        border-color: #4ecdc4; 
        box-shadow: 0 15px 35px rgba(78, 205, 196, 0.2); 
      }
      .demo-card::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        height: 4px;
        background: linear-gradient(90deg, #4ecdc4, #44a08d);
      }
      .demo-title { 
        color: #4ecdc4; 
        font-size: 1.4em; 
        font-weight: bold; 
        margin-bottom: 15px; 
        display: flex;
        align-items: center;
        gap: 10px;
      }
      .demo-desc { 
        color: #ccc; 
        margin-bottom: 20px; 
        line-height: 1.6; 
        font-size: 1.05em;
      }
      .demo-link { 
        display: inline-block; 
        background: linear-gradient(135deg, #4ecdc4, #44a08d); 
        color: #0f0f23; 
        padding: 12px 24px; 
        border-radius: 25px; 
        text-decoration: none; 
        font-weight: bold; 
        transition: all 0.3s ease; 
        margin-right: 10px;
        margin-bottom: 10px;
      }
      .demo-link:hover { 
        transform: translateY(-2px); 
        box-shadow: 0 8px 20px rgba(78, 205, 196, 0.4); 
      }
      .demo-link.external {
        background: linear-gradient(135deg, #9c27b0, #673ab7);
        color: white;
      }
      .demo-link.external:hover {
        box-shadow: 0 8px 20px rgba(156, 39, 176, 0.4);
      }
      .status-indicator { 
        display: inline-block; 
        width: 12px; 
        height: 12px; 
        border-radius: 50%; 
        margin-right: 8px; 
      }
      .status-active { background: #4ecdc4; }
      .status-beta { background: #fbbf24; }
      .status-new { background: #10b981; }
      .status-coming { background: #6b7280; }
      .demo-meta {
        display: flex;
        gap: 15px;
        margin-top: 15px;
        font-size: 0.9em;
        color: #888;
      }
      .demo-meta span {
        background: rgba(255,255,255,0.1);
        padding: 4px 8px;
        border-radius: 12px;
      }
      .quick-links {
        background: rgba(78, 205, 196, 0.1);
        border: 1px solid rgba(78, 205, 196, 0.3);
        border-radius: 10px;
        padding: 20px;
        margin-bottom: 30px;
        text-align: center;
      }
      .quick-links h3 {
        color: #4ecdc4;
        margin-top: 0;
      }
      .quick-links a {
        display: inline-block;
        margin: 5px 10px;
        padding: 8px 16px;
        background: rgba(78, 205, 196, 0.2);
        color: #4ecdc4;
        text-decoration: none;
        border-radius: 15px;
        border: 1px solid rgba(78, 205, 196, 0.3);
        transition: all 0.3s ease;
      }
      .quick-links a:hover {
        background: rgba(78, 205, 196, 0.3);
        transform: translateY(-2px);
      }
      @media (max-width: 768px) {
        .demo-grid { grid-template-columns: 1fr; }
        .container { padding: 15px; }
        .header h1 { font-size: 2em; }
      }
    </style>
  </head>
  <body>
    <div class="header">
      <h1>🌌 StarTales Comprehensive Demo HUD</h1>
      <p>Explore all available game systems, demos, and features</p>
    </div>

    <div class="container">
      <!-- Quick Links -->
      <div class="quick-links">
        <h3>🚀 Quick Access</h3>
        <a href="http://localhost:5173" target="_blank">🌌 Witter Social Network</a>
        <a href="http://localhost:4010/demo/communication-demo.html" target="_blank">💬 Communication</a>
        <a href="http://localhost:4010/demo/approval-rating-demo.html" target="_blank">📊 Approval Rating</a>
        <a href="http://localhost:4010/demo/policy-advisor-demo.html" target="_blank">🏛️ Policy Advisors</a>
        <a href="/demo/campaign-setup">🎮 Campaign Setup</a>
        <a href="/api/health">🔧 API Health</a>
      </div>

      <!-- Social Network & Communication -->
      <div class="category">
        <h2>🌐 Social Network & Communication</h2>
        <div class="demo-grid">
          <div class="demo-card">
            <div class="demo-title">
              <span class="status-indicator status-active"></span>
              🌌 Witter Social Network
            </div>
            <div class="demo-desc">
              AI-powered galactic social network with dynamic content generation, procedural characters, 
              and real-time feeds. Features civilization-based filtering, infinite scroll, and meme sharing.
            </div>
            <a href="http://localhost:5173" class="demo-link external" target="_blank">Open Witter UI</a>
            <div class="demo-meta">
              <span>Port: 5173</span>
              <span>AI-Powered</span>
              <span>Real-time</span>
            </div>
          </div>
          
          <div class="demo-card">
            <div class="demo-title">
              <span class="status-indicator status-active"></span>
              💬 Player Communication
            </div>
            <div class="demo-desc">
              Real-time voice and text communication system with WebSocket support, voice messages, 
              transcription, and multi-player chat rooms.
            </div>
            <a href="http://localhost:4010/demo/communication-demo.html" class="demo-link external" target="_blank">Communication Demo</a>
            <div class="demo-meta">
              <span>Port: 4003</span>
              <span>WebSocket</span>
              <span>Voice Ready</span>
            </div>
          </div>

          <div class="demo-card">
            <div class="demo-title">
              <span class="status-indicator status-active"></span>
              📢 Leader Communications
            </div>
            <div class="demo-desc">
              Leader speech system for addressing different population cohorts with dynamic opinion tracking 
              and speech effectiveness analysis.
            </div>
            <a href="/demo/leader-communications" class="demo-link">Leader Speech Demo</a>
            <div class="demo-meta">
              <span>STT/TTS</span>
              <span>Opinion Tracking</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Governance & Politics -->
      <div class="category">
        <h2>🏛️ Governance & Politics</h2>
        <div class="demo-grid">
          <div class="demo-card">
            <div class="demo-title">
              <span class="status-indicator status-active"></span>
              🏛️ Policy Advisors & Cabinet
            </div>
            <div class="demo-desc">
              AI-powered policy advisors and cabinet meeting system with expert consultations, 
              real-time meetings, and intelligent policy recommendations.
            </div>
            <a href="http://localhost:4010/demo/policy-advisor-demo.html" class="demo-link external" target="_blank">Policy Advisor Demo</a>
            <div class="demo-meta">
              <span>Port: 4004</span>
              <span>AI Advisors</span>
              <span>Real-time</span>
            </div>
          </div>

          <div class="demo-card">
            <div class="demo-title">
              <span class="status-indicator status-active"></span>
              📋 Policy Management
            </div>
            <div class="demo-desc">
              Create, analyze, and activate policies with AI-driven suggestions, modifier effects, 
              and impact analysis across your galactic empire.
            </div>
            <a href="/demo/policies" class="demo-link">Policy Demo</a>
            <div class="demo-meta">
              <span>AI Suggestions</span>
              <span>Impact Analysis</span>
            </div>
          </div>

          <div class="demo-card">
            <div class="demo-title">
              <span class="status-indicator status-active"></span>
              🏛️ Cabinet Meetings
            </div>
            <div class="demo-desc">
              Simulate cabinet meetings with transcript analysis, coordination efficiency tracking, 
              and multi-advisor participation.
            </div>
            <a href="/demo/cabinet" class="demo-link">Cabinet Demo</a>
            <div class="demo-meta">
              <span>Transcript Analysis</span>
              <span>Multi-participant</span>
            </div>
          </div>

          <div class="demo-card">
            <div class="demo-title">
              <span class="status-indicator status-active"></span>
              📊 Approval Rating System
            </div>
            <div class="demo-desc">
              Real-time citizen feedback and approval rating system with demographic breakdowns, 
              polls, and policy impact simulation.
            </div>
            <a href="http://localhost:4010/demo/approval-rating-demo.html" class="demo-link external" target="_blank">Approval Rating Demo</a>
            <div class="demo-meta">
              <span>Port: 4002</span>
              <span>Real-time</span>
              <span>Demographics</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Economy & Trade -->
      <div class="category">
        <h2>💰 Economy & Trade</h2>
        <div class="demo-grid">
          <div class="demo-card">
            <div class="demo-title">
              <span class="status-indicator status-active"></span>
              💰 Trade & Economy
            </div>
            <div class="demo-desc">
              Manage interstellar trade routes, tariffs, contracts, and economic indices across 
              star systems with dynamic market simulation.
            </div>
            <a href="/demo/trade" class="demo-link">Trade Demo</a>
            <div class="demo-meta">
              <span>Market Simulation</span>
              <span>Multi-system</span>
            </div>
          </div>

          <div class="demo-card">
            <div class="demo-title">
              <span class="status-indicator status-active"></span>
              🏢 Business & Entrepreneurship
            </div>
            <div class="demo-desc">
              Small business and entrepreneurship system with startup creation, business management, 
              and economic impact tracking.
            </div>
            <a href="/demo/businesses" class="demo-link">Business Demo</a>
            <div class="demo-meta">
              <span>Startup System</span>
              <span>Economic Impact</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Simulation & Analytics -->
      <div class="category">
        <h2>🔬 Simulation & Analytics</h2>
        <div class="demo-grid">
          <div class="demo-card">
            <div class="demo-title">
              <span class="status-indicator status-active"></span>
              🚀 Simulation Engine
            </div>
            <div class="demo-desc">
              Deterministic simulation engine with KPI tracking, resource management, 
              and step-by-step progression across multiple game modes.
            </div>
            <a href="/demo/simulation" class="demo-link">Simulation Demo</a>
            <div class="demo-meta">
              <span>Deterministic</span>
              <span>Multi-mode</span>
            </div>
          </div>

          <div class="demo-card">
            <div class="demo-title">
              <span class="status-indicator status-active"></span>
              👥 Population System
            </div>
            <div class="demo-desc">
              Dynamic population management with growth, migration, and demographic tracking 
              across planets and star systems.
            </div>
            <a href="/demo/population" class="demo-link">Population Demo</a>
            <div class="demo-meta">
              <span>Dynamic Growth</span>
              <span>Migration</span>
            </div>
          </div>

          <div class="demo-card">
            <div class="demo-title">
              <span class="status-indicator status-active"></span>
              🔧 Professions & Industries
            </div>
            <div class="demo-desc">
              Manage workforce distribution, skill development, and industrial capacity 
              across your galactic empire.
            </div>
            <a href="/demo/professions" class="demo-link">Professions Demo</a>
            <div class="demo-meta">
              <span>Workforce</span>
              <span>Skill Development</span>
            </div>
          </div>

          <div class="demo-card">
            <div class="demo-title">
              <span class="status-indicator status-active"></span>
              📊 Demographics
            </div>
            <div class="demo-desc">
              Comprehensive demographic analysis and tracking system with population statistics, 
              age distributions, and social metrics.
            </div>
            <a href="/demo/demographics" class="demo-link">Demographics Demo</a>
            <div class="demo-meta">
              <span>Statistics</span>
              <span>Social Metrics</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Infrastructure & Cities -->
      <div class="category">
        <h2>🏙️ Infrastructure & Cities</h2>
        <div class="demo-grid">
          <div class="demo-card">
            <div class="demo-title">
              <span class="status-indicator status-active"></span>
              🏙️ City Specialization
            </div>
            <div class="demo-desc">
              City specialization and geography system with unique city types, 
              specializations, and planetary development.
            </div>
            <a href="/demo/cities" class="demo-link">Cities Demo</a>
            <div class="demo-meta">
              <span>Specialization</span>
              <span>Geography</span>
            </div>
          </div>

          <div class="demo-card">
            <div class="demo-title">
              <span class="status-indicator status-active"></span>
              🚀 Migration System
            </div>
            <div class="demo-desc">
              Population migration system with movement tracking, settlement patterns, 
              and interplanetary population flows.
            </div>
            <a href="/demo/migration" class="demo-link">Migration Demo</a>
            <div class="demo-meta">
              <span>Movement Tracking</span>
              <span>Interplanetary</span>
            </div>
          </div>

          <div class="demo-card">
            <div class="demo-title">
              <span class="status-indicator status-active"></span>
              🔬 Technology System
            </div>
            <div class="demo-desc">
              Technology research and development system with tech trees, 
              research projects, and technological advancement.
            </div>
            <a href="/demo/technology" class="demo-link">Technology Demo</a>
            <div class="demo-meta">
              <span>Tech Trees</span>
              <span>R&D</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Security & Legal -->
      <div class="category">
        <h2>⚖️ Security & Legal</h2>
        <div class="demo-grid">
          <div class="demo-card">
            <div class="demo-title">
              <span class="status-indicator status-active"></span>
              ⚖️ Legal System
            </div>
            <div class="demo-desc">
              Comprehensive legal system with law creation, enforcement, 
              and judicial processes across your galactic empire.
            </div>
            <a href="/demo/legal" class="demo-link">Legal Demo</a>
            <div class="demo-meta">
              <span>Law Creation</span>
              <span>Enforcement</span>
            </div>
          </div>

          <div class="demo-card">
            <div class="demo-title">
              <span class="status-indicator status-active"></span>
              🛡️ Security System
            </div>
            <div class="demo-desc">
              Security and defense management system with threat assessment, 
              security protocols, and defense coordination.
            </div>
            <a href="/demo/security" class="demo-link">Security Demo</a>
            <div class="demo-meta">
              <span>Threat Assessment</span>
              <span>Defense</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Campaign & Game Management -->
      <div class="category">
        <h2>🎮 Campaign & Game Management</h2>
        <div class="demo-grid">
          <div class="demo-card">
            <div class="demo-title">
              <span class="status-indicator status-active"></span>
              🎮 Campaign Setup Wizard
            </div>
            <div class="demo-desc">
              Create custom campaigns with AI assistance, scenario generation, graphics selection, 
              villain configuration, and intelligent scheduling.
            </div>
            <a href="/demo/campaign-setup" class="demo-link">Campaign Wizard</a>
            <div class="demo-meta">
              <span>AI Assistance</span>
              <span>Scenario Generation</span>
            </div>
          </div>

          <div class="demo-card">
            <div class="demo-title">
              <span class="status-indicator status-active"></span>
              🎨 Visual Systems
            </div>
            <div class="demo-desc">
              AI-generated visual content system with character portraits, environments, 
              and cinematic sequences with consistent identity preservation.
            </div>
            <a href="/demo/visual-systems" class="demo-link">Visual Systems Demo</a>
            <div class="demo-meta">
              <span>AI Generated</span>
              <span>Identity Preservation</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Intelligence & News -->
      <div class="category">
        <h2>📰 Intelligence & News</h2>
        <div class="demo-grid">
          <div class="demo-card">
            <div class="demo-title">
              <span class="status-indicator status-active"></span>
              🕵️ Intelligence System
            </div>
            <div class="demo-desc">
              Intelligence gathering and analysis system with espionage, reconnaissance, 
              and strategic intelligence operations.
            </div>
            <a href="/demo/intelligence" class="demo-link">Intelligence Demo</a>
            <div class="demo-meta">
              <span>Espionage</span>
              <span>Analysis</span>
            </div>
          </div>

          <div class="demo-card">
            <div class="demo-title">
              <span class="status-indicator status-active"></span>
              📰 News Generation
            </div>
            <div class="demo-desc">
              Dynamic news generation system with AI-powered articles, breaking news, 
              and galactic event coverage.
            </div>
            <a href="/demo/news" class="demo-link">News Demo</a>
            <div class="demo-meta">
              <span>AI Powered</span>
              <span>Dynamic</span>
            </div>
          </div>
        </div>
      </div>

      <!-- System Status -->
      <div class="category">
        <h2>🔧 System Status & Health</h2>
        <div class="demo-grid">
          <div class="demo-card">
            <div class="demo-title">
              <span class="status-indicator status-active"></span>
              🔧 API Health Monitor
            </div>
            <div class="demo-desc">
              Monitor API endpoints and service health across all game systems with 
              real-time status updates and performance metrics.
            </div>
            <a href="/api/health" class="demo-link">Check API Health</a>
            <div class="demo-meta">
              <span>Real-time</span>
              <span>Performance</span>
            </div>
          </div>

          <div class="demo-card">
            <div class="demo-title">
              <span class="status-indicator status-active"></span>
              📊 Service Ports
            </div>
            <div class="demo-desc">
              Overview of all running services and their ports for development and testing purposes.
            </div>
            <div style="margin-top: 15px; font-family: monospace; font-size: 0.9em; color: #4ecdc4;">
              • Witter API: 4001<br/>
              • Approval Rating: 4002<br/>
              • Communication: 4003<br/>
              • Policy Advisor: 4004<br/>
              • Demo Server: 4010<br/>
              • Main UI: 5173
            </div>
          </div>
        </div>
      </div>

      <!-- Footer -->
      <div style="margin-top: 50px; padding: 30px; background: rgba(78, 205, 196, 0.1); border-radius: 15px; text-align: center;">
        <h3 style="color: #4ecdc4; margin-top: 0;">🌌 Ready to Explore the Galaxy?</h3>
        <p style="color: #ccc; font-size: 1.1em; margin-bottom: 20px;">
          All systems are operational and ready for testing. Choose any demo above to explore different aspects of the StarTales universe!
        </p>
        <div style="margin-top: 20px;">
          <span style="color: #4ecdc4; font-size: 1.1em;">●</span> <span style="color: #ccc;">Active & Ready</span> &nbsp;&nbsp;
          <span style="color: #fbbf24; font-size: 1.1em;">●</span> <span style="color: #ccc;">Beta Testing</span> &nbsp;&nbsp;
          <span style="color: #10b981; font-size: 1.1em;">●</span> <span style="color: #ccc;">Recently Added</span> &nbsp;&nbsp;
          <span style="color: #6b7280; font-size: 1.1em;">●</span> <span style="color: #ccc;">Coming Soon</span>
        </div>
      </div>
    </div>
  </body>
</html>\`);
});
`;

module.exports = newHudRoute;

