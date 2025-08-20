/**
 * Character System Demo
 *
 * Interactive demo for the dynamic character generation system
 */

import express from 'express';

const router = express.Router();

router.get('/demo/character-system', (req, res) => {
  const html = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Character System Demo</title>
      <style>
        body {
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          margin: 0;
          padding: 20px;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: #333;
          min-height: 100vh;
        }
        .container {
          max-width: 1200px;
          margin: 0 auto;
          background: rgba(255, 255, 255, 0.95);
          border-radius: 15px;
          padding: 30px;
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
        }
        h1 {
          color: #4a5568;
          text-align: center;
          margin-bottom: 10px;
          font-size: 2.5em;
        }
        .subtitle {
          text-align: center;
          color: #718096;
          margin-bottom: 30px;
          font-size: 1.1em;
        }
        .section {
          background: white;
          border-radius: 10px;
          padding: 25px;
          margin-bottom: 25px;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.07);
          border-left: 4px solid #667eea;
        }
        .section h2 {
          color: #2d3748;
          margin-top: 0;
          display: flex;
          align-items: center;
          gap: 10px;
        }
        .controls {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
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
          color: #4a5568;
        }
        input, select, button {
          padding: 12px;
          border: 2px solid #e2e8f0;
          border-radius: 8px;
          font-size: 14px;
          transition: all 0.2s;
        }
        input:focus, select:focus {
          outline: none;
          border-color: #667eea;
          box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
        }
        button {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          border: none;
          cursor: pointer;
          font-weight: 600;
          transition: transform 0.2s, box-shadow 0.2s;
        }
        button:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
        }
        button:disabled {
          opacity: 0.6;
          cursor: not-allowed;
          transform: none;
        }
        .character-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
          gap: 20px;
          margin-top: 20px;
        }
        .character-card {
          background: white;
          border-radius: 12px;
          padding: 20px;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
          border: 1px solid #e2e8f0;
          transition: transform 0.2s, box-shadow 0.2s;
        }
        .character-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
        }
        .character-header {
          display: flex;
          align-items: center;
          gap: 15px;
          margin-bottom: 15px;
        }
        .character-avatar {
          width: 60px;
          height: 60px;
          border-radius: 50%;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-size: 24px;
          font-weight: bold;
        }
        .character-info h3 {
          margin: 0;
          color: #2d3748;
          font-size: 1.2em;
        }
        .character-info p {
          margin: 5px 0 0 0;
          color: #718096;
          font-size: 0.9em;
        }
        .character-details {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 10px;
          margin-bottom: 15px;
        }
        .detail-item {
          display: flex;
          justify-content: space-between;
          padding: 8px 12px;
          background: #f7fafc;
          border-radius: 6px;
          font-size: 0.85em;
        }
        .detail-label {
          font-weight: 600;
          color: #4a5568;
        }
        .detail-value {
          color: #2d3748;
        }
        .character-traits {
          display: flex;
          flex-wrap: wrap;
          gap: 6px;
          margin-top: 10px;
        }
        .trait-tag {
          background: #667eea;
          color: white;
          padding: 4px 8px;
          border-radius: 12px;
          font-size: 0.75em;
          font-weight: 500;
        }
        .loading {
          text-align: center;
          padding: 40px;
          color: #718096;
        }
        .error {
          background: #fed7d7;
          color: #c53030;
          padding: 15px;
          border-radius: 8px;
          margin: 10px 0;
        }
        .success {
          background: #c6f6d5;
          color: #2f855a;
          padding: 15px;
          border-radius: 8px;
          margin: 10px 0;
        }
        .templates-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
          gap: 15px;
          margin-top: 20px;
        }
        .template-card {
          background: white;
          border: 2px solid #e2e8f0;
          border-radius: 10px;
          padding: 15px;
          cursor: pointer;
          transition: all 0.2s;
        }
        .template-card:hover, .template-card.selected {
          border-color: #667eea;
          background: #f7fafc;
        }
        .template-card h4 {
          margin: 0 0 8px 0;
          color: #2d3748;
        }
        .template-card p {
          margin: 0;
          color: #718096;
          font-size: 0.9em;
        }
        .rarity-badge {
          display: inline-block;
          padding: 2px 8px;
          border-radius: 12px;
          font-size: 0.7em;
          font-weight: bold;
          text-transform: uppercase;
          margin-top: 8px;
        }
        .rarity-common { background: #e2e8f0; color: #4a5568; }
        .rarity-uncommon { background: #c6f6d5; color: #2f855a; }
        .rarity-rare { background: #bee3f8; color: #2b6cb0; }
        .rarity-legendary { background: #fbb6ce; color: #b83280; }
      </style>
    </head>
    <body>
      <div class="container">
        <h1>🎭 Character System Demo</h1>
        <p class="subtitle">Dynamic character generation with AI-powered personalities, backstories, and relationships</p>

        <!-- Character Generation Section -->
        <div class="section">
          <h2>🌟 Generate Characters</h2>
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
              <label for="cityId">City ID (Optional):</label>
              <input type="number" id="cityId" value="" min="1">
            </div>
            <div class="control-group">
              <label for="characterCount">Number of Characters:</label>
              <input type="number" id="characterCount" value="5" min="1" max="20">
            </div>
          </div>
          <button onclick="generatePopulation()">Generate Population</button>
          <div id="generationResult"></div>
        </div>

        <!-- Character Templates Section -->
        <div class="section">
          <h2>📋 Character Templates</h2>
          <button onclick="loadTemplates()">Load Templates</button>
          <div id="templatesContainer"></div>
        </div>

        <!-- Generated Characters Section -->
        <div class="section">
          <h2>👥 Generated Characters</h2>
          <div class="controls">
            <div class="control-group">
              <label for="filterCivilization">Filter by Civilization:</label>
              <select id="filterCivilization">
                <option value="">All Civilizations</option>
                <option value="1">Civilization 1</option>
                <option value="2">Civilization 2</option>
                <option value="3">Civilization 3</option>
                <option value="4">Civilization 4</option>
                <option value="5">Civilization 5</option>
              </select>
            </div>
            <div class="control-group">
              <label for="filterCategory">Filter by Category:</label>
              <select id="filterCategory">
                <option value="">All Categories</option>
                <option value="citizen">Citizens</option>
                <option value="media">Media</option>
                <option value="official">Officials</option>
                <option value="business">Business</option>
                <option value="military">Military</option>
                <option value="academic">Academic</option>
              </select>
            </div>
          </div>
          <button onclick="loadCharacters()">Load Characters</button>
          <div id="charactersContainer"></div>
        </div>

        <!-- Character Analytics Section -->
        <div class="section">
          <h2>📊 Character Analytics</h2>
          <div class="controls">
            <div class="control-group">
              <label for="analyticsCharacterId">Character ID:</label>
              <input type="text" id="analyticsCharacterId" placeholder="Enter character ID">
            </div>
            <div class="control-group">
              <label for="analyticsDays">Days to Analyze:</label>
              <input type="number" id="analyticsDays" value="30" min="1" max="365">
            </div>
          </div>
          <button onclick="loadAnalytics()">Load Analytics</button>
          <div id="analyticsContainer"></div>
        </div>
      </div>

      <script>
        let selectedTemplate = null;
        let allCharacters = [];

        async function generatePopulation() {
          const civilizationId = document.getElementById('civilizationId').value;
          const planetId = document.getElementById('planetId').value;
          const cityId = document.getElementById('cityId').value || null;
          const count = document.getElementById('characterCount').value;

          const resultDiv = document.getElementById('generationResult');
          resultDiv.innerHTML = '<div class="loading">🎭 Generating characters...</div>';

          try {
            const response = await fetch('/api/characters/generate-population', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                civilizationId: parseInt(civilizationId),
                planetId: parseInt(planetId),
                cityId: cityId ? parseInt(cityId) : null,
                count: parseInt(count)
              })
            });

            const data = await response.json();

            if (data.success) {
              resultDiv.innerHTML = \`
                <div class="success">
                  ✅ Successfully generated \${data.generated_count} characters!
                  <br>Character IDs: \${data.character_ids.slice(0, 5).join(', ')}\${data.character_ids.length > 5 ? '...' : ''}
                </div>
              \`;
              // Refresh the characters list
              loadCharacters();
            } else {
              resultDiv.innerHTML = \`<div class="error">❌ Error: \${data.error}</div>\`;
            }
          } catch (error) {
            resultDiv.innerHTML = \`<div class="error">❌ Network error: \${error.message}</div>\`;
          }
        }

        async function loadTemplates() {
          const container = document.getElementById('templatesContainer');
          container.innerHTML = '<div class="loading">📋 Loading templates...</div>';

          try {
            const response = await fetch('/api/characters/templates/list');
            const data = await response.json();

            if (data.success) {
              container.innerHTML = \`
                <div class="templates-grid">
                  \${data.templates.map(template => \`
                    <div class="template-card" onclick="selectTemplate('\${template.id}')">
                      <h4>\${template.name}</h4>
                      <p>\${template.category} - \${template.subcategory}</p>
                      <span class="rarity-badge rarity-\${template.rarity}">\${template.rarity}</span>
                    </div>
                  \`).join('')}
                </div>
              \`;
            } else {
              container.innerHTML = \`<div class="error">❌ Error loading templates: \${data.error}</div>\`;
            }
          } catch (error) {
            container.innerHTML = \`<div class="error">❌ Network error: \${error.message}</div>\`;
          }
        }

        function selectTemplate(templateId) {
          selectedTemplate = templateId;
          document.querySelectorAll('.template-card').forEach(card => {
            card.classList.remove('selected');
          });
          event.target.closest('.template-card').classList.add('selected');
        }

        async function loadCharacters() {
          const container = document.getElementById('charactersContainer');
          const civilizationFilter = document.getElementById('filterCivilization').value;
          const categoryFilter = document.getElementById('filterCategory').value;
          
          container.innerHTML = '<div class="loading">👥 Loading characters...</div>';

          try {
            let url = '/api/characters/civilization/1'; // Default to civilization 1
            if (civilizationFilter) {
              url = \`/api/characters/civilization/\${civilizationFilter}\`;
            }
            
            const params = new URLSearchParams();
            if (categoryFilter) params.append('category', categoryFilter);
            params.append('limit', '20');
            
            if (params.toString()) {
              url += '?' + params.toString();
            }

            const response = await fetch(url);
            const data = await response.json();

            if (data.success) {
              allCharacters = data.characters;
              displayCharacters(data.characters);
            } else {
              container.innerHTML = \`<div class="error">❌ Error loading characters: \${data.error}</div>\`;
            }
          } catch (error) {
            container.innerHTML = \`<div class="error">❌ Network error: \${error.message}</div>\`;
          }
        }

        function displayCharacters(characters) {
          const container = document.getElementById('charactersContainer');
          
          if (characters.length === 0) {
            container.innerHTML = '<div class="loading">No characters found. Try generating some first!</div>';
            return;
          }

          container.innerHTML = \`
            <div class="character-grid">
              \${characters.map(character => \`
                <div class="character-card">
                  <div class="character-header">
                    <div class="character-avatar">
                      \${character.name.full_display.charAt(0)}
                    </div>
                    <div class="character-info">
                      <h3>\${character.name.full_display}</h3>
                      <p>\${character.category} - \${character.subcategory}</p>
                    </div>
                  </div>
                  <div class="character-details">
                    <div class="detail-item">
                      <span class="detail-label">Intelligence:</span>
                      <span class="detail-value">\${character.attributes.intelligence}</span>
                    </div>
                    <div class="detail-item">
                      <span class="detail-label">Charisma:</span>
                      <span class="detail-value">\${character.attributes.charisma}</span>
                    </div>
                    <div class="detail-item">
                      <span class="detail-label">Job:</span>
                      <span class="detail-value">\${character.profession.current_job}</span>
                    </div>
                    <div class="detail-item">
                      <span class="detail-label">Followers:</span>
                      <span class="detail-value">\${character.social_media.follower_count.toLocaleString()}</span>
                    </div>
                  </div>
                  <div class="character-traits">
                    \${(character.attributes.leadership > 70 ? ['Leader'] : [])
                      .concat(character.attributes.creativity > 70 ? ['Creative'] : [])
                      .concat(character.attributes.integrity > 80 ? ['Honest'] : [])
                      .concat(character.attributes.social_influence > 60 ? ['Influential'] : [])
                      .map(trait => \`<span class="trait-tag">\${trait}</span>\`).join('')}
                  </div>
                </div>
              \`).join('')}
            </div>
          \`;
        }

        async function loadAnalytics() {
          const characterId = document.getElementById('analyticsCharacterId').value;
          const days = document.getElementById('analyticsDays').value;
          const container = document.getElementById('analyticsContainer');

          if (!characterId) {
            container.innerHTML = '<div class="error">❌ Please enter a character ID</div>';
            return;
          }

          container.innerHTML = '<div class="loading">📊 Loading analytics...</div>';

          try {
            const response = await fetch(\`/api/characters/\${characterId}/analytics?days=\${days}\`);
            const data = await response.json();

            if (data.success) {
              container.innerHTML = \`
                <div class="character-card">
                  <h3>Analytics for Character: \${characterId}</h3>
                  <div class="character-details">
                    <div class="detail-item">
                      <span class="detail-label">Social Influence Trend:</span>
                      <span class="detail-value">\${data.analytics.social_influence_trend.length} data points</span>
                    </div>
                    <div class="detail-item">
                      <span class="detail-label">Interaction Frequency:</span>
                      <span class="detail-value">\${data.analytics.interaction_frequency}</span>
                    </div>
                    <div class="detail-item">
                      <span class="detail-label">Reputation Changes:</span>
                      <span class="detail-value">\${data.analytics.reputation_changes.length} changes</span>
                    </div>
                    <div class="detail-item">
                      <span class="detail-label">Network Growth:</span>
                      <span class="detail-value">+\${data.analytics.relationship_network_growth} connections</span>
                    </div>
                    <div class="detail-item">
                      <span class="detail-label">Behavioral Consistency:</span>
                      <span class="detail-value">\${data.analytics.behavioral_consistency}%</span>
                    </div>
                  </div>
                </div>
              \`;
            } else {
              container.innerHTML = \`<div class="error">❌ Error loading analytics: \${data.error}</div>\`;
            }
          } catch (error) {
            container.innerHTML = \`<div class="error">❌ Network error: \${error.message}</div>\`;
          }
        }

        // Load templates on page load
        document.addEventListener('DOMContentLoaded', function() {
          loadTemplates();
        });
      </script>
    </body>
    </html>
  `;
  res.send(html);
});

export default router;
