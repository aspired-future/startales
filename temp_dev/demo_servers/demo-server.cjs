const express = require('express');
const path = require('path');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 4010;

// Enable CORS
app.use(cors());

// Serve static files from src/demo directory
app.use('/demo', express.static(path.join(__dirname, 'src/demo'), {
  extensions: ['html'],
  index: false
}));

// Health check
app.get('/health', (req, res) => {
  res.json({ 
    status: 'healthy', 
    service: 'demo-server',
    timestamp: new Date().toISOString()
  });
});

// Demo index page
app.get('/', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html>
    <head>
        <title>StarTales Demo Server</title>
        <style>
            body { font-family: Arial, sans-serif; margin: 40px; background: #0f0f23; color: #fff; }
            h1 { color: #4ecdc4; }
            .demo-list { list-style: none; padding: 0; }
            .demo-item { margin: 10px 0; }
            .demo-link { 
                display: inline-block; 
                padding: 10px 20px; 
                background: #4ecdc4; 
                color: #0f0f23; 
                text-decoration: none; 
                border-radius: 5px; 
                font-weight: bold;
            }
            .demo-link:hover { background: #45b7aa; }
            .description { color: #888; margin-left: 10px; }
        </style>
    </head>
    <body>
        <h1>🌌 StarTales Demo Server</h1>
        <p>Available demos:</p>
        <ul class="demo-list">
            <li class="demo-item">
                <a href="/demo/communication-demo.html" class="demo-link">💬 Communication System</a>
                <span class="description">Real-time voice and text communication</span>
            </li>
            <li class="demo-item">
                <a href="/demo/approval-rating-demo.html" class="demo-link">📊 Approval Rating System</a>
                <span class="description">Citizen feedback and approval ratings</span>
            </li>
            <li class="demo-item">
                <a href="/demo/policy-advisor-demo.html" class="demo-link">🏛️ Policy Advisor & Cabinet</a>
                <span class="description">AI-powered policy advisors and cabinet meetings</span>
            </li>
        </ul>
        <p style="margin-top: 40px; color: #888;">
            Server running on port ${PORT} | 
            <a href="/health" style="color: #4ecdc4;">Health Check</a>
        </p>
    </body>
    </html>
  `);
});

// 404 handler
app.use((req, res) => {
  res.status(404).send(`
    <!DOCTYPE html>
    <html>
    <head>
        <title>404 - Not Found</title>
        <style>
            body { font-family: Arial, sans-serif; margin: 40px; background: #0f0f23; color: #fff; text-align: center; }
            h1 { color: #f44336; }
            a { color: #4ecdc4; }
        </style>
    </head>
    <body>
        <h1>404 - Page Not Found</h1>
        <p>The requested page could not be found.</p>
        <p><a href="/">← Back to Demo Index</a></p>
    </body>
    </html>
  `);
});

app.listen(PORT, () => {
  console.log(`🌌 StarTales Demo Server running on http://localhost:${PORT}`);
  console.log(`📡 Health check: http://localhost:${PORT}/health`);
  console.log(`💬 Communication Demo: http://localhost:${PORT}/demo/communication-demo.html`);
  console.log(`📊 Approval Rating Demo: http://localhost:${PORT}/demo/approval-rating-demo.html`);
});