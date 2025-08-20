// Witter APIs - Proxy to main server
const MAIN_SERVER_URL = process.env.MAIN_SERVER_URL || 'http://localhost:4001';

function setupWitterAPIs(app) {
  
  // Proxy to main server's enhanced feed
  app.get('/api/witter/feed', async (req, res) => {
    try {
      const queryString = new URLSearchParams({
        ...req.query,
        includeBusinessNews: 'true',
        includeSportsNews: 'true'
      }).toString();
      
      const response = await fetch(`${MAIN_SERVER_URL}/api/witter/enhanced-feed?${queryString}`);
      
      if (!response.ok) {
        throw new Error(`Server responded with ${response.status}`);
      }
      
      const data = await response.json();
      res.json(data);
    } catch (error) {
      console.error('Error proxying to main server:', error);
      res.status(500).json({ 
        error: 'Main server not available. Please start the main server on port 4001.',
        details: error.message 
      });
    }
  });

  // Proxy filters endpoint
  app.get('/api/witter/filters', async (req, res) => {
    try {
      const response = await fetch(`${MAIN_SERVER_URL}/api/witter/filters`);
      
      if (!response.ok) {
        throw new Error(`Server responded with ${response.status}`);
      }
      
      const data = await response.json();
      res.json(data);
    } catch (error) {
      console.error('Error proxying filters:', error);
      res.status(500).json({ 
        error: 'Main server not available. Please start the main server on port 4001.',
        details: error.message 
      });
    }
  });

  // Legacy posts endpoint
  app.get('/api/witter/posts', (req, res) => {
    res.redirect('/api/witter/feed?' + new URLSearchParams(req.query).toString());
  });
}

module.exports = setupWitterAPIs;
