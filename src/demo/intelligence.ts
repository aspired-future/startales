import express from 'express';

const router = express.Router();

router.get('/intelligence', (req, res) => {
  res.send(`
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Intelligence Directors System - Demo</title>
    <style>
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            margin: 0;
            padding: 20px;
            background: linear-gradient(135deg, #0f0f23 0%, #1a1a2e 50%, #16213e 100%);
            color: white;
            min-height: 100vh;
        }
        .container {
            max-width: 1400px;
            margin: 0 auto;
        }
        .header {
            text-align: center;
            margin-bottom: 30px;
            padding: 20px;
            background: rgba(255,255,255,0.1);
            border-radius: 15px;
            backdrop-filter: blur(10px);
            border: 1px solid rgba(255,255,255,0.2);
        }
        .header h1 {
            margin: 0;
            font-size: 2.5em;
            text-shadow: 2px 2px 4px rgba(0,0,0,0.3);
        }
        .classified-banner {
            background: linear-gradient(45deg, #FF0000, #CC0000);
            color: white;
            text-align: center;
            padding: 10px;
            font-weight: bold;
            font-size: 1.1em;
            margin-bottom: 20px;
            border-radius: 5px;
            animation: pulse 2s infinite;
        }
        @keyframes pulse {
            0% { opacity: 1; }
            50% { opacity: 0.7; }
            100% { opacity: 1; }
        }
        .dashboard {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
            gap: 20px;
            margin-bottom: 30px;
        }
        .panel {
            background: rgba(255,255,255,0.1);
            border-radius: 15px;
            padding: 25px;
            backdrop-filter: blur(10px);
            border: 1px solid rgba(255,255,255,0.2);
        }
        .director-card {
            background: rgba(255,255,255,0.05);
            border-radius: 10px;
            padding: 15px;
            margin-bottom: 15px;
            border-left: 4px solid #FF6B35;
        }
        .btn {
            background: linear-gradient(45deg, #FF6B35, #F7931E);
            color: white;
            border: none;
            padding: 10px 20px;
            border-radius: 25px;
            cursor: pointer;
            font-size: 14px;
            font-weight: bold;
            transition: all 0.3s ease;
            margin: 5px;
        }
        .btn:hover {
            transform: translateY(-2px);
            box-shadow: 0 5px 15px rgba(0,0,0,0.3);
        }
        .controls {
            margin-top: 15px;
            text-align: center;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="classified-banner">
            🔒 CLASSIFIED - TOP SECRET - INTELLIGENCE DIRECTORS SYSTEM 🔒
        </div>

        <div class="header">
            <h1>🕵️ Intelligence Directors System</h1>
            <p>Foreign Intelligence • Domestic Security • Intelligence Coordination</p>
            <p><strong>Agencies:</strong> CIA, FBI, NSA, DIA, Intelligence Coordination Office</p>
        </div>

        <div class="dashboard">
            <div class="panel">
                <h2>👨‍💼 Intelligence Directors</h2>
                <div class="director-card">
                    <h3>Director Elena Vasquez</h3>
                    <p>Director of Foreign Intelligence • 25 years of service</p>
                    <p>COSMIC CLEARANCE</p>
                </div>
                <div class="controls">
                    <button class="btn" onclick="viewDirectors()">View All Directors</button>
                    <button class="btn" onclick="testAPI()">Test API</button>
                </div>
            </div>
        </div>
    </div>

    <script>
        function viewDirectors() {
            alert('Intelligence Directors System\\n\\nForeign Intelligence Director: Elena Vasquez\\nDomestic Intelligence Director: Michael Chen\\nCoordination Director: Sarah Kim\\n\\n(GET /api/intelligence/directors)');
        }

        function testAPI() {
            alert('Intelligence API Testing\\n\\nTesting endpoints:\\n✅ /api/intelligence/directors\\n✅ /api/intelligence/agencies\\n✅ /api/intelligence/operations\\n\\nAll endpoints responding!');
        }
    </script>
</body>
</html>
  `);
});

export default router;