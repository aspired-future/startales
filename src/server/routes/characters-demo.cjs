/**
 * Characters Demo Page - Interactive Character Management Interface
 */

function generateCharactersDemo() {
    return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Startales - Character Management System</title>
        <style>
            * {
                margin: 0;
                padding: 0;
                box-sizing: border-box;
            }

            body {
                font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                background: linear-gradient(135deg, #0c0c0c 0%, #1a1a2e 50%, #16213e 100%);
                color: #e0e0e0;
                min-height: 100vh;
                overflow-x: hidden;
            }

            .container {
                max-width: 1400px;
                margin: 0 auto;
                padding: 20px;
            }

            .header {
                text-align: center;
                margin-bottom: 30px;
                padding: 20px;
                background: rgba(255, 255, 255, 0.05);
                border-radius: 15px;
                backdrop-filter: blur(10px);
                border: 1px solid rgba(255, 255, 255, 0.1);
            }

            .header h1 {
                font-size: 2.5em;
                margin-bottom: 10px;
                background: linear-gradient(45deg, #64b5f6, #42a5f5, #2196f3);
                -webkit-background-clip: text;
                -webkit-text-fill-color: transparent;
                background-clip: text;
            }

            .header p {
                font-size: 1.1em;
                opacity: 0.8;
                margin-bottom: 20px;
            }

            .controls {
                display: flex;
                gap: 15px;
                justify-content: center;
                flex-wrap: wrap;
                margin-bottom: 30px;
            }

            .control-group {
                display: flex;
                align-items: center;
                gap: 10px;
                background: rgba(255, 255, 255, 0.05);
                padding: 10px 15px;
                border-radius: 8px;
                border: 1px solid rgba(255, 255, 255, 0.1);
            }

            .control-group label {
                font-weight: 500;
                min-width: 80px;
            }

            .control-group select,
            .control-group input {
                background: rgba(255, 255, 255, 0.1);
                border: 1px solid rgba(255, 255, 255, 0.2);
                border-radius: 5px;
                padding: 8px 12px;
                color: #e0e0e0;
                font-size: 14px;
            }

            .control-group select:focus,
            .control-group input:focus {
                outline: none;
                border-color: #2196f3;
                box-shadow: 0 0 0 2px rgba(33, 150, 243, 0.2);
            }

            .btn {
                background: linear-gradient(45deg, #2196f3, #1976d2);
                color: white;
                border: none;
                padding: 10px 20px;
                border-radius: 8px;
                cursor: pointer;
                font-size: 14px;
                font-weight: 500;
                transition: all 0.3s ease;
                text-decoration: none;
                display: inline-block;
                text-align: center;
            }

            .btn:hover {
                transform: translateY(-2px);
                box-shadow: 0 5px 15px rgba(33, 150, 243, 0.3);
            }

            .btn.btn-success {
                background: linear-gradient(45deg, #4caf50, #388e3c);
            }

            .btn.btn-warning {
                background: linear-gradient(45deg, #ff9800, #f57c00);
            }

            .btn.btn-danger {
                background: linear-gradient(45deg, #f44336, #d32f2f);
            }

            .btn.btn-secondary {
                background: linear-gradient(45deg, #607d8b, #455a64);
            }

            .stats-grid {
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
                gap: 20px;
                margin-bottom: 30px;
            }

            .stat-card {
                background: rgba(255, 255, 255, 0.05);
                border-radius: 12px;
                padding: 20px;
                border: 1px solid rgba(255, 255, 255, 0.1);
                backdrop-filter: blur(10px);
                transition: all 0.3s ease;
            }

            .stat-card:hover {
                transform: translateY(-5px);
                box-shadow: 0 10px 25px rgba(0, 0, 0, 0.3);
                border-color: rgba(33, 150, 243, 0.3);
            }

            .stat-card h3 {
                color: #64b5f6;
                margin-bottom: 15px;
                font-size: 1.2em;
            }

            .stat-value {
                font-size: 2em;
                font-weight: bold;
                margin-bottom: 10px;
                color: #fff;
            }

            .stat-description {
                opacity: 0.7;
                font-size: 0.9em;
            }

            .characters-grid {
                display: grid;
                grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
                gap: 20px;
                margin-bottom: 30px;
            }

            .character-card {
                background: rgba(255, 255, 255, 0.05);
                border-radius: 15px;
                padding: 20px;
                border: 1px solid rgba(255, 255, 255, 0.1);
                backdrop-filter: blur(10px);
                transition: all 0.3s ease;
                position: relative;
                overflow: hidden;
            }

            .character-card:hover {
                transform: translateY(-5px);
                box-shadow: 0 15px 30px rgba(0, 0, 0, 0.3);
                border-color: rgba(33, 150, 243, 0.5);
            }

            .character-card::before {
                content: '';
                position: absolute;
                top: 0;
                left: 0;
                right: 0;
                height: 4px;
                background: linear-gradient(90deg, #2196f3, #64b5f6);
            }

            .character-header {
                display: flex;
                justify-content: space-between;
                align-items: flex-start;
                margin-bottom: 15px;
            }

            .character-name {
                font-size: 1.3em;
                font-weight: bold;
                color: #fff;
                margin-bottom: 5px;
            }

            .character-role {
                color: #64b5f6;
                font-size: 0.9em;
                margin-bottom: 5px;
            }

            .character-civilization {
                color: #81c784;
                font-size: 0.8em;
                opacity: 0.8;
            }

            .character-status {
                padding: 4px 12px;
                border-radius: 20px;
                font-size: 0.8em;
                font-weight: 500;
                text-transform: uppercase;
            }

            .status-active {
                background: rgba(76, 175, 80, 0.2);
                color: #4caf50;
                border: 1px solid rgba(76, 175, 80, 0.3);
            }

            .status-inactive {
                background: rgba(158, 158, 158, 0.2);
                color: #9e9e9e;
                border: 1px solid rgba(158, 158, 158, 0.3);
            }

            .character-traits {
                margin: 15px 0;
            }

            .trait-tag {
                display: inline-block;
                background: rgba(33, 150, 243, 0.2);
                color: #64b5f6;
                padding: 4px 8px;
                border-radius: 12px;
                font-size: 0.7em;
                margin: 2px;
                border: 1px solid rgba(33, 150, 243, 0.3);
            }

            .character-reputation {
                display: grid;
                grid-template-columns: repeat(2, 1fr);
                gap: 10px;
                margin: 15px 0;
            }

            .reputation-item {
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding: 5px 0;
                font-size: 0.8em;
            }

            .reputation-bar {
                width: 60px;
                height: 6px;
                background: rgba(255, 255, 255, 0.1);
                border-radius: 3px;
                overflow: hidden;
            }

            .reputation-fill {
                height: 100%;
                background: linear-gradient(90deg, #f44336, #ff9800, #4caf50);
                transition: width 0.3s ease;
            }

            .character-actions {
                display: flex;
                gap: 8px;
                flex-wrap: wrap;
                margin-top: 15px;
            }

            .character-actions .btn {
                padding: 6px 12px;
                font-size: 0.8em;
            }

            .character-background {
                margin: 10px 0;
                padding: 10px;
                background: rgba(255, 255, 255, 0.02);
                border-radius: 8px;
                font-size: 0.85em;
                line-height: 1.4;
                opacity: 0.8;
                border-left: 3px solid rgba(33, 150, 243, 0.3);
            }

            .modal {
                display: none;
                position: fixed;
                z-index: 1000;
                left: 0;
                top: 0;
                width: 100%;
                height: 100%;
                background-color: rgba(0, 0, 0, 0.8);
                backdrop-filter: blur(5px);
            }

            .modal-content {
                background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
                margin: 5% auto;
                padding: 30px;
                border-radius: 15px;
                width: 90%;
                max-width: 600px;
                border: 1px solid rgba(255, 255, 255, 0.1);
                box-shadow: 0 20px 40px rgba(0, 0, 0, 0.5);
            }

            .close {
                color: #aaa;
                float: right;
                font-size: 28px;
                font-weight: bold;
                cursor: pointer;
                transition: color 0.3s ease;
            }

            .close:hover {
                color: #fff;
            }

            .form-group {
                margin-bottom: 20px;
            }

            .form-group label {
                display: block;
                margin-bottom: 8px;
                font-weight: 500;
                color: #64b5f6;
            }

            .form-group input,
            .form-group select,
            .form-group textarea {
                width: 100%;
                background: rgba(255, 255, 255, 0.1);
                border: 1px solid rgba(255, 255, 255, 0.2);
                border-radius: 8px;
                padding: 12px;
                color: #e0e0e0;
                font-size: 14px;
                resize: vertical;
            }

            .form-group textarea {
                min-height: 80px;
            }

            .loading {
                text-align: center;
                padding: 40px;
                opacity: 0.7;
            }

            .loading::after {
                content: '';
                display: inline-block;
                width: 20px;
                height: 20px;
                border: 2px solid rgba(33, 150, 243, 0.3);
                border-radius: 50%;
                border-top-color: #2196f3;
                animation: spin 1s ease-in-out infinite;
                margin-left: 10px;
            }

            @keyframes spin {
                to { transform: rotate(360deg); }
            }

            .error {
                background: rgba(244, 67, 54, 0.1);
                border: 1px solid rgba(244, 67, 54, 0.3);
                color: #f44336;
                padding: 15px;
                border-radius: 8px;
                margin: 20px 0;
            }

            .success {
                background: rgba(76, 175, 80, 0.1);
                border: 1px solid rgba(76, 175, 80, 0.3);
                color: #4caf50;
                padding: 15px;
                border-radius: 8px;
                margin: 20px 0;
            }

            @media (max-width: 768px) {
                .container {
                    padding: 10px;
                }
                
                .controls {
                    flex-direction: column;
                }
                
                .characters-grid {
                    grid-template-columns: 1fr;
                }
                
                .stats-grid {
                    grid-template-columns: 1fr;
                }
            }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h1>🎭 Character Management System</h1>
                <p>Strategic AI-driven character simulation for galactic civilizations</p>
                <div class="controls">
                    <div class="control-group">
                        <label for="categoryFilter">Category:</label>
                        <select id="categoryFilter">
                            <option value="">All Categories</option>
                            <option value="leaders">Leaders</option>
                            <option value="diplomats">Diplomats</option>
                            <option value="businessLeaders">Business Leaders</option>
                            <option value="military">Military</option>
                            <option value="scientists">Scientists</option>
                            <option value="citizens">Citizens</option>
                            <option value="minorCharacters">Minor Characters</option>
                        </select>
                    </div>
                    <div class="control-group">
                        <label for="activeFilter">Status:</label>
                        <select id="activeFilter">
                            <option value="">All Status</option>
                            <option value="true">Active</option>
                            <option value="false">Inactive</option>
                        </select>
                    </div>
                    <div class="control-group">
                        <label for="searchFilter">Search:</label>
                        <input type="text" id="searchFilter" placeholder="Name, role, or background...">
                    </div>
                    <button class="btn btn-success" onclick="openCreateModal()">+ Create Character</button>
                    <button class="btn btn-warning" onclick="optimizeSimulation()">⚡ Optimize Simulation</button>
                    <button class="btn btn-secondary" onclick="refreshData()">🔄 Refresh</button>
                </div>
            </div>

            <div class="stats-grid" id="statsGrid">
                <!-- Stats will be populated here -->
            </div>

            <div class="characters-grid" id="charactersGrid">
                <!-- Characters will be populated here -->
            </div>
        </div>

        <!-- Create/Edit Character Modal -->
        <div id="characterModal" class="modal">
            <div class="modal-content">
                <span class="close" onclick="closeModal()">&times;</span>
                <h2 id="modalTitle">Create New Character</h2>
                <form id="characterForm">
                    <div class="form-group">
                        <label for="characterName">Name:</label>
                        <input type="text" id="characterName" required>
                    </div>
                    <div class="form-group">
                        <label for="characterCategory">Category:</label>
                        <select id="characterCategory" required>
                            <option value="leaders">Leaders</option>
                            <option value="diplomats">Diplomats</option>
                            <option value="businessLeaders">Business Leaders</option>
                            <option value="military">Military</option>
                            <option value="scientists">Scientists</option>
                            <option value="citizens">Citizens</option>
                            <option value="minorCharacters">Minor Characters</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label for="characterRole">Role:</label>
                        <input type="text" id="characterRole" required>
                    </div>
                    <div class="form-group">
                        <label for="characterCivilization">Civilization:</label>
                        <input type="text" id="characterCivilization" required>
                    </div>
                    <div class="form-group">
                        <label for="characterBackground">Background:</label>
                        <textarea id="characterBackground" placeholder="Character's background story..."></textarea>
                    </div>
                    <div class="form-group">
                        <label for="characterTraits">Traits (comma-separated):</label>
                        <input type="text" id="characterTraits" placeholder="ambitious, diplomatic, strategic...">
                    </div>
                    <div class="form-group">
                        <label>
                            <input type="checkbox" id="characterActive"> Active in Simulation
                        </label>
                    </div>
                    <div style="text-align: right; margin-top: 30px;">
                        <button type="button" class="btn btn-secondary" onclick="closeModal()">Cancel</button>
                        <button type="submit" class="btn btn-success">Save Character</button>
                    </div>
                </form>
            </div>
        </div>

        <script>
            let characters = [];
            let stats = {};
            let currentEditingId = null;

            // Initialize the page
            document.addEventListener('DOMContentLoaded', function() {
                loadData();
                setupEventListeners();
            });

            function setupEventListeners() {
                document.getElementById('categoryFilter').addEventListener('change', applyFilters);
                document.getElementById('activeFilter').addEventListener('change', applyFilters);
                document.getElementById('searchFilter').addEventListener('input', applyFilters);
                document.getElementById('characterForm').addEventListener('submit', saveCharacter);
            }

            async function loadData() {
                try {
                    showLoading();
                    
                    // Load characters
                    const charactersResponse = await fetch('/api/characters');
                    const charactersData = await charactersResponse.json();
                    
                    if (charactersData.success) {
                        characters = charactersData.characters;
                    }
                    
                    // Load stats
                    const statsResponse = await fetch('/api/characters/active/summary');
                    const statsData = await statsResponse.json();
                    
                    if (statsData.success) {
                        stats = statsData.summary;
                    }
                    
                    renderStats();
                    renderCharacters();
                    
                } catch (error) {
                    console.error('Error loading data:', error);
                    showError('Failed to load character data');
                }
            }

            function showLoading() {
                document.getElementById('charactersGrid').innerHTML = '<div class="loading">Loading characters...</div>';
            }

            function showError(message) {
                document.getElementById('charactersGrid').innerHTML = '<div class="error">' + message + '</div>';
            }

            function showSuccess(message) {
                const successDiv = document.createElement('div');
                successDiv.className = 'success';
                successDiv.textContent = message;
                document.querySelector('.container').insertBefore(successDiv, document.getElementById('statsGrid'));
                
                setTimeout(() => {
                    successDiv.remove();
                }, 3000);
            }

            function renderStats() {
                const statsGrid = document.getElementById('statsGrid');
                
                statsGrid.innerHTML = \`
                    <div class="stat-card">
                        <h3>Total Characters</h3>
                        <div class="stat-value">\${stats.totalActive || 0}</div>
                        <div class="stat-description">Currently active in simulation</div>
                    </div>
                    <div class="stat-card">
                        <h3>Recent Actions</h3>
                        <div class="stat-value">\${stats.recentActions || 0}</div>
                        <div class="stat-description">Actions in the last hour</div>
                    </div>
                    <div class="stat-card">
                        <h3>Average Reputation</h3>
                        <div class="stat-value">\${stats.averageReputation ? Math.round((stats.averageReputation.diplomatic + stats.averageReputation.economic + stats.averageReputation.military + stats.averageReputation.social) / 4) : 0}</div>
                        <div class="stat-description">Across all active characters</div>
                    </div>
                    <div class="stat-card">
                        <h3>Categories Active</h3>
                        <div class="stat-value">\${stats.byCategory ? Object.keys(stats.byCategory).length : 0}</div>
                        <div class="stat-description">Different character types</div>
                    </div>
                \`;
            }

            function renderCharacters() {
                const grid = document.getElementById('charactersGrid');
                
                if (characters.length === 0) {
                    grid.innerHTML = '<div class="loading">No characters found</div>';
                    return;
                }
                
                grid.innerHTML = characters.map(character => \`
                    <div class="character-card">
                        <div class="character-header">
                            <div>
                                <div class="character-name">\${character.name}</div>
                                <div class="character-role">\${character.role}</div>
                                <div class="character-civilization">\${character.civilization}</div>
                            </div>
                            <div class="character-status \${character.isActive ? 'status-active' : 'status-inactive'}">
                                \${character.isActive ? 'Active' : 'Inactive'}
                            </div>
                        </div>
                        
                        <div class="character-background">
                            \${character.background}
                        </div>
                        
                        <div class="character-traits">
                            \${character.traits.map(trait => \`<span class="trait-tag">\${trait}</span>\`).join('')}
                        </div>
                        
                        <div class="character-reputation">
                            <div class="reputation-item">
                                <span>Diplomatic:</span>
                                <div class="reputation-bar">
                                    <div class="reputation-fill" style="width: \${character.reputation.diplomatic * 10}%"></div>
                                </div>
                            </div>
                            <div class="reputation-item">
                                <span>Economic:</span>
                                <div class="reputation-bar">
                                    <div class="reputation-fill" style="width: \${character.reputation.economic * 10}%"></div>
                                </div>
                            </div>
                            <div class="reputation-item">
                                <span>Military:</span>
                                <div class="reputation-bar">
                                    <div class="reputation-fill" style="width: \${character.reputation.military * 10}%"></div>
                                </div>
                            </div>
                            <div class="reputation-item">
                                <span>Social:</span>
                                <div class="reputation-bar">
                                    <div class="reputation-fill" style="width: \${character.reputation.social * 10}%"></div>
                                </div>
                            </div>
                        </div>
                        
                        <div class="character-actions">
                            <button class="btn" onclick="editCharacter('\${character.id}')">✏️ Edit</button>
                            <button class="btn \${character.isActive ? 'btn-warning' : 'btn-success'}" onclick="toggleCharacterStatus('\${character.id}', \${!character.isActive})">
                                \${character.isActive ? '⏸️ Deactivate' : '▶️ Activate'}
                            </button>
                            <button class="btn btn-secondary" onclick="viewCharacterActions('\${character.id}')">📋 Actions</button>
                            <button class="btn btn-danger" onclick="deleteCharacter('\${character.id}')">🗑️ Delete</button>
                        </div>
                    </div>
                \`).join('');
            }

            function applyFilters() {
                const categoryFilter = document.getElementById('categoryFilter').value;
                const activeFilter = document.getElementById('activeFilter').value;
                const searchFilter = document.getElementById('searchFilter').value.toLowerCase();
                
                const filteredCharacters = characters.filter(character => {
                    if (categoryFilter && character.category !== categoryFilter) return false;
                    if (activeFilter !== '' && character.isActive.toString() !== activeFilter) return false;
                    if (searchFilter && !character.name.toLowerCase().includes(searchFilter) && 
                        !character.role.toLowerCase().includes(searchFilter) && 
                        !character.background.toLowerCase().includes(searchFilter)) return false;
                    return true;
                });
                
                // Temporarily replace characters for rendering
                const originalCharacters = characters;
                characters = filteredCharacters;
                renderCharacters();
                characters = originalCharacters;
            }

            function openCreateModal() {
                currentEditingId = null;
                document.getElementById('modalTitle').textContent = 'Create New Character';
                document.getElementById('characterForm').reset();
                document.getElementById('characterModal').style.display = 'block';
            }

            function editCharacter(characterId) {
                const character = characters.find(c => c.id === characterId);
                if (!character) return;
                
                currentEditingId = characterId;
                document.getElementById('modalTitle').textContent = 'Edit Character';
                document.getElementById('characterName').value = character.name;
                document.getElementById('characterCategory').value = character.category;
                document.getElementById('characterRole').value = character.role;
                document.getElementById('characterCivilization').value = character.civilization;
                document.getElementById('characterBackground').value = character.background;
                document.getElementById('characterTraits').value = character.traits.join(', ');
                document.getElementById('characterActive').checked = character.isActive;
                
                document.getElementById('characterModal').style.display = 'block';
            }

            function closeModal() {
                document.getElementById('characterModal').style.display = 'none';
                currentEditingId = null;
            }

            async function saveCharacter(event) {
                event.preventDefault();
                
                const characterData = {
                    name: document.getElementById('characterName').value,
                    category: document.getElementById('characterCategory').value,
                    role: document.getElementById('characterRole').value,
                    civilization: document.getElementById('characterCivilization').value,
                    background: document.getElementById('characterBackground').value,
                    traits: document.getElementById('characterTraits').value.split(',').map(t => t.trim()).filter(t => t),
                    isActive: document.getElementById('characterActive').checked
                };
                
                try {
                    let response;
                    if (currentEditingId) {
                        response = await fetch(\`/api/characters/\${currentEditingId}\`, {
                            method: 'PUT',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify(characterData)
                        });
                    } else {
                        response = await fetch('/api/characters', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify(characterData)
                        });
                    }
                    
                    const result = await response.json();
                    
                    if (result.success) {
                        closeModal();
                        showSuccess(currentEditingId ? 'Character updated successfully' : 'Character created successfully');
                        loadData();
                    } else {
                        showError(result.error || 'Failed to save character');
                    }
                } catch (error) {
                    console.error('Error saving character:', error);
                    showError('Failed to save character');
                }
            }

            async function toggleCharacterStatus(characterId, activate) {
                try {
                    const endpoint = activate ? 'activate' : 'deactivate';
                    const response = await fetch(\`/api/characters/\${characterId}/\${endpoint}\`, {
                        method: 'POST'
                    });
                    
                    const result = await response.json();
                    
                    if (result.success) {
                        showSuccess(\`Character \${activate ? 'activated' : 'deactivated'} successfully\`);
                        loadData();
                    } else {
                        showError(result.error || 'Failed to update character status');
                    }
                } catch (error) {
                    console.error('Error updating character status:', error);
                    showError('Failed to update character status');
                }
            }

            async function deleteCharacter(characterId) {
                if (!confirm('Are you sure you want to delete this character? This action cannot be undone.')) {
                    return;
                }
                
                try {
                    const response = await fetch(\`/api/characters/\${characterId}\`, {
                        method: 'DELETE'
                    });
                    
                    const result = await response.json();
                    
                    if (result.success) {
                        showSuccess('Character deleted successfully');
                        loadData();
                    } else {
                        showError(result.error || 'Failed to delete character');
                    }
                } catch (error) {
                    console.error('Error deleting character:', error);
                    showError('Failed to delete character');
                }
            }

            async function viewCharacterActions(characterId) {
                try {
                    const response = await fetch(\`/api/characters/\${characterId}/actions\`);
                    const result = await response.json();
                    
                    if (result.success) {
                        const actions = result.actions;
                        let actionsHtml = actions.length > 0 ? 
                            actions.map(action => \`
                                <div style="margin-bottom: 10px; padding: 10px; background: rgba(255,255,255,0.05); border-radius: 5px;">
                                    <strong>\${action.actionType}</strong> - \${action.result ? action.result.description : 'No description'}
                                    <br><small>\${new Date(action.timestamp).toLocaleString()}</small>
                                </div>
                            \`).join('') : 
                            '<p>No actions recorded for this character.</p>';
                        
                        alert('Character Actions:\\n\\n' + actions.map(a => \`\${a.actionType} - \${new Date(a.timestamp).toLocaleString()}\`).join('\\n'));
                    } else {
                        showError('Failed to load character actions');
                    }
                } catch (error) {
                    console.error('Error loading character actions:', error);
                    showError('Failed to load character actions');
                }
            }

            async function optimizeSimulation() {
                try {
                    const response = await fetch('/api/characters/simulation/optimize', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            budget: 1000,
                            priorities: {
                                leaders: 1.0,
                                diplomats: 0.8,
                                businessLeaders: 0.7,
                                military: 0.6,
                                scientists: 0.5,
                                citizens: 0.3,
                                minorCharacters: 0.2
                            }
                        })
                    });
                    
                    const result = await response.json();
                    
                    if (result.success) {
                        showSuccess(\`Simulation optimized: \${result.optimization.deactivatedCharacters} characters deactivated, \${result.optimization.activeCharacters} remain active\`);
                        loadData();
                    } else {
                        showError('Failed to optimize simulation');
                    }
                } catch (error) {
                    console.error('Error optimizing simulation:', error);
                    showError('Failed to optimize simulation');
                }
            }

            function refreshData() {
                loadData();
            }

            // Close modal when clicking outside
            window.onclick = function(event) {
                const modal = document.getElementById('characterModal');
                if (event.target === modal) {
                    closeModal();
                }
            }
        </script>
    </body>
    </html>
    `;
}

module.exports = { generateCharactersDemo };
