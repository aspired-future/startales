// New Demographics Deep Dive Demo - to replace the existing one

const newDemographicsDemo = `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Demographics Deep Dive System</title>
    <style>
      body { font-family: system-ui, sans-serif; padding: 20px; background: #0a0a0a; color: #e0e0e0; margin: 0; }
      .container { max-width: 1400px; margin: 0 auto; }
      .header { text-align: center; margin-bottom: 30px; }
      .demo-card { background: #1a1a1a; padding: 20px; border-radius: 8px; border: 1px solid #333; margin-bottom: 20px; }
      .btn { background: #4ecdc4; color: #0a0a0a; padding: 10px 20px; border: none; border-radius: 4px; cursor: pointer; margin: 5px; }
      .btn:hover { background: #44a08d; }
      .btn.secondary { background: #fbbf24; }
      .btn.secondary:hover { background: #f59e0b; }
      .chart-container { background: #2a2a2a; padding: 20px; border-radius: 6px; margin: 15px 0; }
      .demographic-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 15px; }
      .demographic-stat { background: #2a2a2a; padding: 15px; border-radius: 6px; text-align: center; }
      .stat-value { font-size: 1.5em; color: #4ecdc4; font-weight: bold; }
      .stat-label { color: #ccc; font-size: 0.9em; }
      .city-selector { margin: 20px 0; }
      .city-selector select { background: #2a2a2a; color: #e0e0e0; border: 1px solid #444; padding: 10px; border-radius: 4px; }
      .tabs { display: flex; margin-bottom: 20px; border-bottom: 1px solid #333; }
      .tab { padding: 10px 20px; cursor: pointer; border-bottom: 2px solid transparent; }
      .tab.active { border-bottom-color: #4ecdc4; color: #4ecdc4; }
      .tab-content { display: none; }
      .tab-content.active { display: block; }
      .progress-bar { background: #444; height: 20px; border-radius: 10px; margin: 10px 0; overflow: hidden; }
      .progress-fill { background: linear-gradient(90deg, #4ecdc4, #44a08d); height: 100%; transition: width 0.3s; }
      .mobility-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 20px; }
      .projection-chart { background: #2a2a2a; padding: 15px; border-radius: 6px; margin: 10px 0; }
      .projection-line { display: flex; justify-content: space-between; padding: 5px 0; border-bottom: 1px solid #333; }
      .comparison-table { width: 100%; border-collapse: collapse; }
      .comparison-table th, .comparison-table td { padding: 10px; text-align: left; border-bottom: 1px solid #333; }
      .comparison-table th { background: #2a2a2a; color: #4ecdc4; }
      .loading { text-align: center; color: #fbbf24; padding: 20px; }
      h1 { color: #4ecdc4; }
      h2 { color: #fbbf24; }
      h3 { color: #e0e0e0; }
    </style>
  </head>
  <body>
    <div class="container">
      <div class="header">
        <h1>📊 Demographics Deep Dive System</h1>
        <p>Advanced population analytics, demographic trends, social mobility tracking, and population projection modeling</p>
      </div>

      <div class="city-selector">
        <label for="citySelect">Select City: </label>
        <select id="citySelect" onchange="loadCityData()">
          <option value="">Loading cities...</option>
        </select>
        <button class="btn secondary" onclick="loadComparativeData()">📈 Compare All Cities</button>
        <button class="btn secondary" onclick="simulateDemographics()">⏭️ Simulate 5 Years</button>
      </div>

      <div class="tabs">
        <div class="tab active" onclick="showTab('overview')">📊 Overview</div>
        <div class="tab" onclick="showTab('trends')">📈 Trends</div>
        <div class="tab" onclick="showTab('mobility')">🚀 Social Mobility</div>
        <div class="tab" onclick="showTab('projections')">🔮 Projections</div>
        <div class="tab" onclick="showTab('comparative')">⚖️ Comparative</div>
      </div>

      <!-- Overview Tab -->
      <div id="overview" class="tab-content active">
        <div class="demo-card">
          <h2>Population Overview</h2>
          <div class="demographic-grid" id="populationStats">
            <div class="loading">Loading population data...</div>
          </div>
        </div>

        <div class="demo-card">
          <h2>Age Distribution</h2>
          <div class="chart-container" id="ageChart">
            <div class="loading">Loading age distribution...</div>
          </div>
        </div>

        <div class="demo-card">
          <h2>Education & Income Distribution</h2>
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px;">
            <div class="chart-container" id="educationChart">
              <div class="loading">Loading education data...</div>
            </div>
            <div class="chart-container" id="incomeChart">
              <div class="loading">Loading income data...</div>
            </div>
          </div>
        </div>
      </div>

      <!-- Trends Tab -->
      <div id="trends" class="tab-content">
        <div class="demo-card">
          <h2>Demographic Trends Analysis</h2>
          <div class="demographic-grid" id="trendsStats">
            <div class="loading">Loading trends data...</div>
          </div>
        </div>

        <div class="demo-card">
          <h2>Historical Data & Projections</h2>
          <div class="chart-container" id="historicalChart">
            <div class="loading">Loading historical data...</div>
          </div>
        </div>
      </div>

      <!-- Social Mobility Tab -->
      <div id="mobility" class="tab-content">
        <div class="demo-card">
          <h2>Social Mobility Analysis</h2>
          <div class="mobility-grid" id="mobilityStats">
            <div class="loading">Loading mobility data...</div>
          </div>
        </div>

        <div class="demo-card">
          <h2>Mobility Barriers & Opportunities</h2>
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px;">
            <div class="chart-container" id="mobilityBarriers">
              <div class="loading">Loading barriers data...</div>
            </div>
            <div class="chart-container" id="mobilityOpportunities">
              <div class="loading">Loading opportunities data...</div>
            </div>
          </div>
        </div>
      </div>

      <!-- Projections Tab -->
      <div id="projections" class="tab-content">
        <div class="demo-card">
          <h2>Population Projection Models</h2>
          <div class="demographic-grid" id="projectionModels">
            <div class="loading">Loading projection models...</div>
          </div>
        </div>

        <div class="demo-card">
          <h2>Scenario Analysis</h2>
          <div class="chart-container" id="scenarioChart">
            <div class="loading">Loading scenario analysis...</div>
          </div>
        </div>
      </div>

      <!-- Comparative Tab -->
      <div id="comparative" class="tab-content">
        <div class="demo-card">
          <h2>City Comparison</h2>
          <div class="chart-container" id="comparativeTable">
            <div class="loading">Loading comparative data...</div>
          </div>
        </div>
      </div>

      <div style="margin-top: 40px; text-align: center;">
        <a href="/demo/hud" class="btn">← Back to Demo Hub</a>
      </div>
    </div>

    <script>
      let currentCityId = null;
      let cities = [];
      let currentAnalytics = null;

      // Tab management
      function showTab(tabName) {
        document.querySelectorAll('.tab').forEach(tab => tab.classList.remove('active'));
        document.querySelectorAll('.tab-content').forEach(content => content.classList.remove('active'));
        
        document.querySelector(\`[onclick="showTab('\${tabName}')"]\`).classList.add('active');
        document.getElementById(tabName).classList.add('active');
        
        // Load data for the active tab
        if (currentCityId) {
          switch(tabName) {
            case 'trends':
              loadTrendsData();
              break;
            case 'mobility':
              loadMobilityData();
              break;
            case 'projections':
              loadProjectionsData();
              break;
            case 'comparative':
              loadComparativeData();
              break;
          }
        }
      }

      // Load cities list
      async function loadCities() {
        try {
          const response = await fetch('/api/demographics/population');
          const data = await response.json();
          cities = data.cities;
          
          const select = document.getElementById('citySelect');
          select.innerHTML = cities.map(city => 
            \`<option value="\${city.cityId}">\${city.cityName} (\${(city.totalPopulation/1000000).toFixed(1)}M)</option>\`
          ).join('');
          
          if (cities.length > 0) {
            currentCityId = cities[0].cityId;
            loadCityData();
          }
        } catch (error) {
          console.error('Error loading cities:', error);
        }
      }

      // Load city analytics data
      async function loadCityData() {
        const select = document.getElementById('citySelect');
        currentCityId = select.value;
        
        if (!currentCityId) return;
        
        try {
          const response = await fetch(\`/api/demographics/analytics/\${currentCityId}\`);
          currentAnalytics = await response.json();
          
          renderOverviewData();
        } catch (error) {
          console.error('Error loading city data:', error);
        }
      }

      // Render overview data
      function renderOverviewData() {
        if (!currentAnalytics) return;
        
        const { populationOverview, ageStructure, educationProfile, economicProfile, qualityOfLife } = currentAnalytics;
        
        // Population stats
        const populationStats = [
          { label: 'Total Population', value: (populationOverview.totalPopulation/1000000).toFixed(1) + 'M' },
          { label: 'Population Density', value: Math.round(populationOverview.populationDensity) + '/km²' },
          { label: 'Growth Rate', value: (populationOverview.growthRate * 100).toFixed(2) + '%' },
          { label: 'Growth Trend', value: populationOverview.growthTrend.replace('_', ' ') },
          { label: 'Median Age', value: ageStructure.medianAge.toFixed(1) + ' years' },
          { label: 'Life Expectancy', value: qualityOfLife.lifeExpectancy.toFixed(1) + ' years' },
          { label: 'Birth Rate', value: qualityOfLife.birthRate.toFixed(1) + '‰' },
          { label: 'Death Rate', value: qualityOfLife.deathRate.toFixed(1) + '‰' },
          { label: 'Fertility Rate', value: qualityOfLife.fertilityRate.toFixed(2) + ' children/woman' },
          { label: 'Literacy Rate', value: (educationProfile.literacyRate * 100).toFixed(1) + '%' },
          { label: 'Quality of Life', value: qualityOfLife.index.toFixed(1) + '/100' },
          { label: 'HDI', value: qualityOfLife.humanDevelopmentIndex.toFixed(3) }
        ];
        
        document.getElementById('populationStats').innerHTML = populationStats.map(stat => \`
          <div class="demographic-stat">
            <div class="stat-value">\${stat.value}</div>
            <div class="stat-label">\${stat.label}</div>
          </div>
        \`).join('');
        
        // Age distribution
        renderDistributionChart('ageChart', 'Age Distribution', ageStructure.distribution);
        
        // Education distribution
        renderDistributionChart('educationChart', 'Education Levels', educationProfile.distribution);
        
        // Income distribution
        renderDistributionChart('incomeChart', 'Income Brackets', economicProfile.incomeDistribution);
      }

      // Render distribution charts
      function renderDistributionChart(containerId, title, distribution) {
        const maxValue = Math.max(...Object.values(distribution));
        
        document.getElementById(containerId).innerHTML = \`
          <h3>\${title}</h3>
          \${Object.entries(distribution).map(([key, value]) => \`
            <div style="margin: 10px 0;">
              <div style="display: flex; justify-content: space-between; margin-bottom: 5px;">
                <span>\${key.replace('_', ' ')}</span>
                <span>\${typeof value === 'number' ? (value > 1 ? value.toLocaleString() : (value * 100).toFixed(1) + '%') : value}</span>
              </div>
              <div class="progress-bar">
                <div class="progress-fill" style="width: \${(value / maxValue) * 100}%;"></div>
              </div>
            </div>
          \`).join('')}
        \`;
      }

      // Load trends data
      async function loadTrendsData() {
        if (!currentCityId) return;
        
        try {
          const response = await fetch(\`/api/demographics/trends/\${currentCityId}\`);
          const trends = await response.json();
          
          const trendsStats = [
            { label: 'Population Growth', value: trends.populationGrowthTrend.trend },
            { label: 'Growth Rate', value: (trends.populationGrowthTrend.rate * 100).toFixed(2) + '%' },
            { label: 'Aging Trend', value: trends.agingTrend.trend.replace('_', ' ') },
            { label: 'Education Trend', value: trends.educationTrend.trend.replace('_', ' ') },
            { label: 'Income Trend', value: trends.incomeTrend.trend.replace('_', ' ') },
            { label: 'Migration Trend', value: trends.migrationTrend.trend.replace('_', ' ') },
            { label: 'Urbanization', value: trends.urbanizationTrend.trend.replace('_', ' ') },
            { label: 'Volatility', value: trends.populationGrowthTrend.volatility?.toFixed(3) || 'N/A' }
          ];
          
          document.getElementById('trendsStats').innerHTML = trendsStats.map(stat => \`
            <div class="demographic-stat">
              <div class="stat-value">\${stat.value}</div>
              <div class="stat-label">\${stat.label}</div>
            </div>
          \`).join('');
          
          // Historical chart
          if (currentAnalytics?.populationOverview) {
            const projections = trends.trendProjections;
            document.getElementById('historicalChart').innerHTML = \`
              <h3>Future Projections</h3>
              \${Object.entries(projections).map(([year, data]) => \`
                <div class="projection-line">
                  <span>\${year.replace('_', ' ')}</span>
                  <span>Population: \${(data.population/1000000).toFixed(1)}M</span>
                  <span>Median Age: \${data.medianAge.toFixed(1)}</span>
                  <span>Life Expectancy: \${data.lifeExpectancy.toFixed(1)}</span>
                </div>
              \`).join('')}
            \`;
          }
        } catch (error) {
          console.error('Error loading trends data:', error);
        }
      }

      // Load mobility data
      async function loadMobilityData() {
        if (!currentCityId) return;
        
        try {
          const response = await fetch(\`/api/demographics/mobility/\${currentCityId}\`);
          const mobility = await response.json();
          
          const mobilityStats = [
            { label: 'Overall Mobility Score', value: mobility.overallMobilityScore.toFixed(1) + '/100' },
            { label: 'Education Access', value: mobility.educationMobility.educationAccessScore.toFixed(1) + '/100' },
            { label: 'Income Growth Rate', value: (mobility.incomeMobility.incomeGrowthRate * 100).toFixed(1) + '%' },
            { label: 'Job Change Frequency', value: (mobility.occupationMobility.jobChangeFrequency * 100).toFixed(1) + '%' },
            { label: 'Migration Rate', value: (mobility.geographicMobility.migrationRate * 1000).toFixed(1) + '‰' },
            { label: 'Social Connectedness', value: (mobility.socialCapital.socialConnectedness * 100).toFixed(1) + '%' }
          ];
          
          document.getElementById('mobilityStats').innerHTML = mobilityStats.map(stat => \`
            <div class="demographic-stat">
              <div class="stat-value">\${stat.value}</div>
              <div class="stat-label">\${stat.label}</div>
            </div>
          \`).join('');
          
          // Barriers and opportunities
          document.getElementById('mobilityBarriers').innerHTML = \`
            <h3>Mobility Barriers</h3>
            \${mobility.mobilityBarriers.map(barrier => \`
              <div style="padding: 8px; background: #3a1a1a; margin: 5px 0; border-radius: 4px; border-left: 3px solid #ef4444;">
                🚫 \${barrier.replace('_', ' ')}
              </div>
            \`).join('')}
          \`;
          
          document.getElementById('mobilityOpportunities').innerHTML = \`
            <h3>Mobility Opportunities</h3>
            \${mobility.mobilityOpportunities.map(opportunity => \`
              <div style="padding: 8px; background: #1a3a1a; margin: 5px 0; border-radius: 4px; border-left: 3px solid #22c55e;">
                ✅ \${opportunity.replace('_', ' ')}
              </div>
            \`).join('')}
          \`;
        } catch (error) {
          console.error('Error loading mobility data:', error);
        }
      }

      // Load projections data
      async function loadProjectionsData() {
        if (!currentCityId) return;
        
        try {
          const response = await fetch(\`/api/demographics/projections/\${currentCityId}\`);
          const projections = await response.json();
          
          const models = Object.entries(projections.projectionModels);
          
          document.getElementById('projectionModels').innerHTML = models.map(([modelName, model]) => \`
            <div class="demographic-stat">
              <div class="stat-value">\${modelName}</div>
              <div class="stat-label">25-year projection</div>
              <div style="margin-top: 10px; font-size: 0.9em;">
                Year 10: \${(model.projections.year_10/1000000).toFixed(1)}M<br>
                Year 25: \${(model.projections.year_25/1000000).toFixed(1)}M
              </div>
            </div>
          \`).join('');
          
          // Scenario analysis
          const scenarios = projections.scenarioAnalysis;
          document.getElementById('scenarioChart').innerHTML = \`
            <h3>Scenario Analysis (20-year projections)</h3>
            \${Object.entries(scenarios).map(([scenario, data]) => \`
              <div class="projection-chart">
                <h4>\${scenario.charAt(0).toUpperCase() + scenario.slice(1)} Scenario</h4>
                <div class="projection-line">
                  <span>Growth Rate:</span>
                  <span>\${(data.populationGrowthRate * 100).toFixed(2)}%</span>
                </div>
                <div class="projection-line">
                  <span>Year 10:</span>
                  <span>\${(data.projectedPopulation.year_10/1000000).toFixed(1)}M</span>
                </div>
                <div class="projection-line">
                  <span>Year 20:</span>
                  <span>\${(data.projectedPopulation.year_20/1000000).toFixed(1)}M</span>
                </div>
              </div>
            \`).join('')}
          \`;
        } catch (error) {
          console.error('Error loading projections data:', error);
        }
      }

      // Load comparative data
      async function loadComparativeData() {
        try {
          const response = await fetch('/api/demographics/comparative?metric=quality');
          const comparison = await response.json();
          
          document.getElementById('comparativeTable').innerHTML = \`
            <h3>City Comparison (sorted by Quality of Life)</h3>
            <table class="comparison-table">
              <thead>
                <tr>
                  <th>City</th>
                  <th>Population</th>
                  <th>Growth Rate</th>
                  <th>Quality of Life</th>
                  <th>HDI</th>
                  <th>Mobility Score</th>
                  <th>Transition Stage</th>
                </tr>
              </thead>
              <tbody>
                \${comparison.data.map(city => \`
                  <tr>
                    <td>\${city.cityName}</td>
                    <td>\${(city.totalPopulation/1000000).toFixed(1)}M</td>
                    <td>\${(city.growthRate * 100).toFixed(2)}%</td>
                    <td>\${city.qualityOfLifeIndex.toFixed(1)}/100</td>
                    <td>\${city.humanDevelopmentIndex.toFixed(3)}</td>
                    <td>\${city.mobilityScore.toFixed(1)}/100</td>
                    <td>\${city.transitionStage.replace('_', ' ')}</td>
                  </tr>
                \`).join('')}
              </tbody>
            </table>
          \`;
        } catch (error) {
          console.error('Error loading comparative data:', error);
        }
      }

      // Simulate demographics
      async function simulateDemographics() {
        if (!currentCityId) return;
        
        try {
          const response = await fetch('/api/demographics/simulate', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ cityId: currentCityId, years: 5 })
          });
          const result = await response.json();
          
          if (result.success) {
            alert(\`🎯 Simulation Complete!\\n\\nPopulation Change: \${result.results[0].changes.populationChange.toLocaleString()}\\nMedian Age Change: +\${result.results[0].changes.medianAgeChange} years\\nLife Expectancy: +\${result.results[0].changes.lifeExpectancyChange} years\\n\\nNew Population: \${(result.results[0].newMetrics.population/1000000).toFixed(1)}M\`);
            
            // Reload current data
            loadCityData();
          }
        } catch (error) {
          console.error('Error simulating demographics:', error);
        }
      }

      // Initialize
      loadCities();
    </script>
  </body>
</html>`;

module.exports = newDemographicsDemo;

