/**
 * Small Business Ecosystem Demo
 *
 * Interactive demo for the small business ecosystem system
 */

import express from 'express';

const router = express.Router();

router.get('/demo/small-business', (req, res) => {
  const html = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Small Business Ecosystem Demo</title>
      <style>
        body {
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          margin: 0;
          padding: 20px;
          background: linear-gradient(135deg, #2c5aa0 0%, #1e3a8a 100%);
          color: #333;
          min-height: 100vh;
        }
        .container {
          max-width: 1400px;
          margin: 0 auto;
          background: rgba(255, 255, 255, 0.95);
          border-radius: 15px;
          padding: 30px;
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
        }
        h1 {
          color: #1e3a8a;
          text-align: center;
          margin-bottom: 10px;
          font-size: 2.5em;
        }
        .subtitle {
          text-align: center;
          color: #64748b;
          margin-bottom: 30px;
          font-size: 1.1em;
        }
        .section {
          background: white;
          border-radius: 10px;
          padding: 25px;
          margin-bottom: 25px;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.07);
          border-left: 4px solid #2c5aa0;
        }
        .section h2 {
          color: #1e3a8a;
          margin-top: 0;
          display: flex;
          align-items: center;
          gap: 10px;
        }
        .controls {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 20px;
          margin-bottom: 20px;
        }
        .control-group {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }
        label {
          font-weight: 600;
          color: #374151;
        }
        input, select, button {
          padding: 12px;
          border: 2px solid #e5e7eb;
          border-radius: 8px;
          font-size: 14px;
          transition: all 0.2s;
        }
        input:focus, select:focus {
          outline: none;
          border-color: #2c5aa0;
          box-shadow: 0 0 0 3px rgba(44, 90, 160, 0.1);
        }
        button {
          background: linear-gradient(135deg, #2c5aa0 0%, #1e3a8a 100%);
          color: white;
          border: none;
          cursor: pointer;
          font-weight: 600;
          transition: transform 0.2s, box-shadow 0.2s;
        }
        button:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(44, 90, 160, 0.3);
        }
        button:disabled {
          opacity: 0.6;
          cursor: not-allowed;
          transform: none;
        }
        .business-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(380px, 1fr));
          gap: 20px;
          margin-top: 20px;
        }
        .business-card {
          background: white;
          border-radius: 12px;
          padding: 20px;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
          border: 1px solid #e5e7eb;
          transition: transform 0.2s, box-shadow 0.2s;
        }
        .business-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
        }
        .business-header {
          display: flex;
          align-items: center;
          gap: 15px;
          margin-bottom: 15px;
        }
        .business-icon {
          width: 50px;
          height: 50px;
          border-radius: 8px;
          background: linear-gradient(135deg, #2c5aa0 0%, #1e3a8a 100%);
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-size: 20px;
        }
        .business-info h3 {
          margin: 0;
          color: #1f2937;
          font-size: 1.2em;
        }
        .business-info p {
          margin: 5px 0 0 0;
          color: #6b7280;
          font-size: 0.9em;
        }
        .business-details {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 10px;
          margin-bottom: 15px;
        }
        .detail-item {
          display: flex;
          justify-content: space-between;
          padding: 8px 12px;
          background: #f9fafb;
          border-radius: 6px;
          font-size: 0.85em;
        }
        .detail-label {
          font-weight: 600;
          color: #374151;
        }
        .detail-value {
          color: #1f2937;
        }
        .health-indicator {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-top: 10px;
        }
        .health-bar {
          flex: 1;
          height: 8px;
          background: #e5e7eb;
          border-radius: 4px;
          overflow: hidden;
        }
        .health-fill {
          height: 100%;
          transition: width 0.3s ease;
        }
        .health-excellent { background: #10b981; }
        .health-good { background: #3b82f6; }
        .health-fair { background: #f59e0b; }
        .health-poor { background: #ef4444; }
        .stats-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 20px;
          margin-top: 20px;
        }
        .stat-card {
          background: white;
          border-radius: 10px;
          padding: 20px;
          text-align: center;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        }
        .stat-number {
          font-size: 2em;
          font-weight: bold;
          color: #1e3a8a;
          margin-bottom: 5px;
        }
        .stat-label {
          color: #64748b;
          font-size: 0.9em;
        }
        .loading {
          text-align: center;
          padding: 40px;
          color: #64748b;
        }
        .error {
          background: #fef2f2;
          color: #dc2626;
          padding: 15px;
          border-radius: 8px;
          margin: 10px 0;
          border: 1px solid #fecaca;
        }
        .success {
          background: #f0fdf4;
          color: #16a34a;
          padding: 15px;
          border-radius: 8px;
          margin: 10px 0;
          border: 1px solid #bbf7d0;
        }
        .category-badge {
          display: inline-block;
          padding: 4px 8px;
          border-radius: 12px;
          font-size: 0.75em;
          font-weight: 500;
          text-transform: uppercase;
          margin-right: 8px;
        }
        .category-retail { background: #dbeafe; color: #1d4ed8; }
        .category-food_service { background: #fef3c7; color: #d97706; }
        .category-professional_services { background: #e0e7ff; color: #5b21b6; }
        .category-personal_services { background: #fce7f3; color: #be185d; }
        .category-technology { background: #d1fae5; color: #047857; }
        .category-manufacturing { background: #f3e8ff; color: #7c2d12; }
      </style>
    </head>
    <body>
      <div class="container">
        <h1>🏪 Small Business Ecosystem Demo</h1>
        <p class="subtitle">Comprehensive small business management with local retailers, service providers, and distribution networks</p>

        <!-- Business Generation Section -->
        <div class="section">
          <h2>🌟 Generate Business Ecosystem</h2>
          <div class="controls">
            <div class="control-group">
              <label for="civilizationId">Civilization ID:</label>
              <input type="number" id="civilizationId" value="1" min="1" max="5">
            </div>
            <div class="control-group">
              <label for="planetId">Planet ID:</label>
              <input type="number" id="planetId" value="1" min="1" max="10">
            </div>
            <div class="control-group">
              <label for="cityId">City ID:</label>
              <input type="number" id="cityId" value="1" min="1" max="50">
            </div>
            <div class="control-group">
              <label for="businessCount">Number of Businesses:</label>
              <input type="number" id="businessCount" value="50" min="10" max="500">
            </div>
            <div class="control-group">
              <label for="economicClimate">Economic Climate:</label>
              <select id="economicClimate">
                <option value="recession">📉 Recession</option>
                <option value="stable" selected>📊 Stable</option>
                <option value="growth">📈 Growth</option>
                <option value="boom">🚀 Boom</option>
              </select>
            </div>
          </div>
          <button onclick="generateEcosystem()">Generate Business Ecosystem</button>
          <div id="generationResult"></div>
        </div>

        <!-- Business Statistics Section -->
        <div class="section">
          <h2>📊 Business Statistics</h2>
          <div class="controls">
            <div class="control-group">
              <label for="statsCivilizationId">Civilization ID:</label>
              <input type="number" id="statsCivilizationId" value="1" min="1" max="5">
            </div>
          </div>
          <button onclick="loadStatistics()">Load Statistics</button>
          <div id="statisticsContainer"></div>
        </div>

        <!-- Business Directory Section -->
        <div class="section">
          <h2>🏢 Business Directory</h2>
          <div class="controls">
            <div class="control-group">
              <label for="directoryCityId">City ID:</label>
              <input type="number" id="directoryCityId" value="1" min="1" max="50">
            </div>
            <div class="control-group">
              <label for="categoryFilter">Category Filter:</label>
              <select id="categoryFilter">
                <option value="">All Categories</option>
                <option value="retail">🛒 Retail</option>
                <option value="food_service">🍽️ Food Service</option>
                <option value="professional_services">💼 Professional Services</option>
                <option value="personal_services">💅 Personal Services</option>
                <option value="technology">💻 Technology</option>
                <option value="manufacturing">🏭 Manufacturing</option>
                <option value="healthcare">🏥 Healthcare</option>
                <option value="education">📚 Education</option>
              </select>
            </div>
            <div class="control-group">
              <label for="businessLimit">Limit:</label>
              <input type="number" id="businessLimit" value="20" min="5" max="100">
            </div>
          </div>
          <button onclick="loadBusinessDirectory()">Load Business Directory</button>
          <div id="businessDirectoryContainer"></div>
        </div>

        <!-- Market Trends Section -->
        <div class="section">
          <h2>📈 Market Trends</h2>
          <div class="controls">
            <div class="control-group">
              <label for="trendsCivilizationId">Civilization ID:</label>
              <input type="number" id="trendsCivilizationId" value="1" min="1" max="5">
            </div>
            <div class="control-group">
              <label for="industryCategory">Industry Category:</label>
              <select id="industryCategory">
                <option value="">All Industries</option>
                <option value="retail">Retail</option>
                <option value="food_service">Food Service</option>
                <option value="professional_services">Professional Services</option>
                <option value="technology">Technology</option>
                <option value="manufacturing">Manufacturing</option>
              </select>
            </div>
          </div>
          <button onclick="loadMarketTrends()">Load Market Trends</button>
          <div id="trendsContainer"></div>
        </div>
      </div>

      <script>
        async function generateEcosystem() {
          const civilizationId = document.getElementById('civilizationId').value;
          const planetId = document.getElementById('planetId').value;
          const cityId = document.getElementById('cityId').value;
          const businessCount = document.getElementById('businessCount').value;
          const economicClimate = document.getElementById('economicClimate').value;

          const resultDiv = document.getElementById('generationResult');
          resultDiv.innerHTML = '<div class="loading">🏪 Generating business ecosystem...</div>';

          try {
            const response = await fetch('/api/small-business/generate-ecosystem', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                civilizationId: parseInt(civilizationId),
                planetId: parseInt(planetId),
                cityId: parseInt(cityId),
                targetBusinessCount: parseInt(businessCount),
                economicClimate: economicClimate
              })
            });

            const data = await response.json();

            if (data.success) {
              const distribution = data.ecosystem.category_distribution;
              resultDiv.innerHTML = \`
                <div class="success">
                  ✅ Successfully generated \${data.ecosystem.total_businesses} businesses!
                  <br><strong>Distribution:</strong>
                  <br>🛒 Retail: \${distribution.retail || 0}
                  <br>🍽️ Food Service: \${distribution.food_service || 0}
                  <br>💼 Professional: \${distribution.professional_services || 0}
                  <br>💅 Personal Services: \${distribution.personal_services || 0}
                  <br>💻 Technology: \${distribution.technology || 0}
                  <br>🏭 Manufacturing: \${distribution.manufacturing || 0}
                  <br>📦 Distribution Networks: \${data.ecosystem.distribution_networks}
                </div>
              \`;
            } else {
              resultDiv.innerHTML = \`<div class="error">❌ Error: \${data.error}</div>\`;
            }
          } catch (error) {
            resultDiv.innerHTML = \`<div class="error">❌ Network error: \${error.message}</div>\`;
          }
        }

        async function loadStatistics() {
          const civilizationId = document.getElementById('statsCivilizationId').value;
          const container = document.getElementById('statisticsContainer');
          
          container.innerHTML = '<div class="loading">📊 Loading statistics...</div>';

          try {
            const response = await fetch(\`/api/small-business/statistics/\${civilizationId}\`);
            const data = await response.json();

            if (data.success) {
              const stats = data.statistics;
              container.innerHTML = \`
                <div class="stats-grid">
                  <div class="stat-card">
                    <div class="stat-number">\${stats.total_businesses.toLocaleString()}</div>
                    <div class="stat-label">Total Businesses</div>
                  </div>
                  <div class="stat-card">
                    <div class="stat-number">\${stats.health_metrics.average_business_health}</div>
                    <div class="stat-label">Avg Health Score</div>
                  </div>
                  <div class="stat-card">
                    <div class="stat-number">$\${(stats.health_metrics.average_monthly_revenue / 1000).toFixed(1)}K</div>
                    <div class="stat-label">Avg Monthly Revenue</div>
                  </div>
                  <div class="stat-card">
                    <div class="stat-number">\${stats.category_breakdown.retail}</div>
                    <div class="stat-label">Retail Businesses</div>
                  </div>
                  <div class="stat-card">
                    <div class="stat-number">\${stats.category_breakdown.food_service}</div>
                    <div class="stat-label">Food Service</div>
                  </div>
                  <div class="stat-card">
                    <div class="stat-number">\${stats.category_breakdown.technology}</div>
                    <div class="stat-label">Technology</div>
                  </div>
                  <div class="stat-card">
                    <div class="stat-number">\${stats.lifecycle_distribution.startup}</div>
                    <div class="stat-label">Startups</div>
                  </div>
                  <div class="stat-card">
                    <div class="stat-number">\${stats.lifecycle_distribution.growth}</div>
                    <div class="stat-label">Growth Stage</div>
                  </div>
                </div>
              \`;
            } else {
              container.innerHTML = \`<div class="error">❌ Error loading statistics: \${data.error}</div>\`;
            }
          } catch (error) {
            container.innerHTML = \`<div class="error">❌ Network error: \${error.message}</div>\`;
          }
        }

        async function loadBusinessDirectory() {
          const cityId = document.getElementById('directoryCityId').value;
          const category = document.getElementById('categoryFilter').value;
          const limit = document.getElementById('businessLimit').value;
          const container = document.getElementById('businessDirectoryContainer');
          
          container.innerHTML = '<div class="loading">🏢 Loading business directory...</div>';

          try {
            let url = \`/api/small-business/city/\${cityId}?limit=\${limit}\`;
            if (category) {
              url += \`&category=\${category}\`;
            }

            const response = await fetch(url);
            const data = await response.json();

            if (data.success) {
              if (data.businesses.length === 0) {
                container.innerHTML = '<div class="loading">No businesses found. Try generating an ecosystem first!</div>';
                return;
              }

              container.innerHTML = \`
                <div class="business-grid">
                  \${data.businesses.map(business => \`
                    <div class="business-card">
                      <div class="business-header">
                        <div class="business-icon">
                          \${getCategoryIcon(business.category)}
                        </div>
                        <div class="business-info">
                          <h3>\${business.name}</h3>
                          <p>
                            <span class="category-badge category-\${business.category}">\${business.category}</span>
                            \${business.subcategory}
                          </p>
                        </div>
                      </div>
                      <div class="business-details">
                        <div class="detail-item">
                          <span class="detail-label">Type:</span>
                          <span class="detail-value">\${business.business_type.replace('_', ' ')}</span>
                        </div>
                        <div class="detail-item">
                          <span class="detail-label">Owner:</span>
                          <span class="detail-value">\${business.owner.name}</span>
                        </div>
                        <div class="detail-item">
                          <span class="detail-label">Revenue:</span>
                          <span class="detail-value">$\${(business.financial_info.monthly_revenue / 1000).toFixed(1)}K/mo</span>
                        </div>
                        <div class="detail-item">
                          <span class="detail-label">Profit:</span>
                          <span class="detail-value">$\${(business.financial_info.monthly_profit / 1000).toFixed(1)}K/mo</span>
                        </div>
                        <div class="detail-item">
                          <span class="detail-label">Employees:</span>
                          <span class="detail-value">\${business.employees_count}</span>
                        </div>
                        <div class="detail-item">
                          <span class="detail-label">Products:</span>
                          <span class="detail-value">\${business.products_services_count}</span>
                        </div>
                      </div>
                      <div class="health-indicator">
                        <span class="detail-label">Business Health:</span>
                        <div class="health-bar">
                          <div class="health-fill \${getHealthClass(business.business_health.overall_score)}" 
                               style="width: \${business.business_health.overall_score}%"></div>
                        </div>
                        <span class="detail-value">\${business.business_health.overall_score}/100</span>
                      </div>
                    </div>
                  \`).join('')}
                </div>
              \`;
            } else {
              container.innerHTML = \`<div class="error">❌ Error loading businesses: \${data.error}</div>\`;
            }
          } catch (error) {
            container.innerHTML = \`<div class="error">❌ Network error: \${error.message}</div>\`;
          }
        }

        async function loadMarketTrends() {
          const civilizationId = document.getElementById('trendsCivilizationId').value;
          const industryCategory = document.getElementById('industryCategory').value;
          const container = document.getElementById('trendsContainer');
          
          container.innerHTML = '<div class="loading">📈 Loading market trends...</div>';

          try {
            let url = \`/api/small-business/market-trends/\${civilizationId}\`;
            if (industryCategory) {
              url += \`?industryCategory=\${industryCategory}\`;
            }

            const response = await fetch(url);
            const data = await response.json();

            if (data.success) {
              container.innerHTML = \`
                <div class="business-grid">
                  \${data.trends.map(trend => \`
                    <div class="business-card">
                      <div class="business-header">
                        <div class="business-icon">📈</div>
                        <div class="business-info">
                          <h3>\${trend.trend_name}</h3>
                          <p>\${trend.impact_level} impact</p>
                        </div>
                      </div>
                      <div class="business-details">
                        <div class="detail-item">
                          <span class="detail-label">Market Impact:</span>
                          <span class="detail-value">\${trend.market_impact_percentage}%</span>
                        </div>
                        <div class="detail-item">
                          <span class="detail-label">Confidence:</span>
                          <span class="detail-value">\${trend.confidence_score}%</span>
                        </div>
                        <div class="detail-item">
                          <span class="detail-label">Start Date:</span>
                          <span class="detail-value">\${new Date(trend.start_date).toLocaleDateString()}</span>
                        </div>
                      </div>
                      <p style="margin-top: 15px; color: #4b5563; font-size: 0.9em;">
                        \${trend.description}
                      </p>
                    </div>
                  \`).join('')}
                </div>
              \`;
            } else {
              container.innerHTML = \`<div class="error">❌ Error loading trends: \${data.error}</div>\`;
            }
          } catch (error) {
            container.innerHTML = \`<div class="error">❌ Network error: \${error.message}</div>\`;
          }
        }

        function getCategoryIcon(category) {
          const icons = {
            retail: '🛒',
            food_service: '🍽️',
            professional_services: '💼',
            personal_services: '💅',
            technology: '💻',
            manufacturing: '🏭',
            healthcare: '🏥',
            education: '📚'
          };
          return icons[category] || '🏢';
        }

        function getHealthClass(score) {
          if (score >= 80) return 'health-excellent';
          if (score >= 60) return 'health-good';
          if (score >= 40) return 'health-fair';
          return 'health-poor';
        }

        // Load statistics on page load
        document.addEventListener('DOMContentLoaded', function() {
          loadStatistics();
        });
      </script>
    </body>
    </html>
  `;
  res.send(html);
});

export default router;
