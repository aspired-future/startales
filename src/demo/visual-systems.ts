/**
 * Visual Systems Demo Interface
 * 
 * Interactive demonstration of AI-generated graphics and videos with
 * visual consistency management and progressive enhancement features.
 */

import express from 'express';

const router = express.Router();

router.get('/demo/visual-systems', (req, res) => {
  const html = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Visual Systems Integration - StarTales Demo</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            line-height: 1.6;
            color: #333;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh;
        }

        .container {
            max-width: 1400px;
            margin: 0 auto;
            padding: 20px;
        }

        .header {
            text-align: center;
            color: white;
            margin-bottom: 30px;
        }

        .header h1 {
            font-size: 2.5rem;
            margin-bottom: 10px;
            text-shadow: 2px 2px 4px rgba(0,0,0,0.3);
        }

        .header p {
            font-size: 1.2rem;
            opacity: 0.9;
        }

        .demo-container {
            background: white;
            border-radius: 15px;
            box-shadow: 0 20px 40px rgba(0,0,0,0.1);
            overflow: hidden;
        }

        .tabs {
            display: flex;
            background: #f8f9fa;
            border-bottom: 1px solid #dee2e6;
            overflow-x: auto;
        }

        .tab {
            padding: 15px 25px;
            cursor: pointer;
            border: none;
            background: none;
            font-size: 16px;
            font-weight: 500;
            color: #6c757d;
            white-space: nowrap;
            transition: all 0.3s ease;
            border-bottom: 3px solid transparent;
        }

        .tab:hover {
            background: #e9ecef;
            color: #495057;
        }

        .tab.active {
            color: #667eea;
            border-bottom-color: #667eea;
            background: white;
        }

        .tab-content {
            display: none;
            padding: 30px;
        }

        .tab-content.active {
            display: block;
        }

        .section {
            margin-bottom: 30px;
        }

        .section h3 {
            color: #495057;
            margin-bottom: 15px;
            font-size: 1.3rem;
            border-left: 4px solid #667eea;
            padding-left: 15px;
        }

        .form-group {
            margin-bottom: 20px;
        }

        .form-group label {
            display: block;
            margin-bottom: 5px;
            font-weight: 500;
            color: #495057;
        }

        .form-control {
            width: 100%;
            padding: 12px;
            border: 2px solid #e9ecef;
            border-radius: 8px;
            font-size: 14px;
            transition: border-color 0.3s ease;
        }

        .form-control:focus {
            outline: none;
            border-color: #667eea;
            box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
        }

        .form-control.textarea {
            min-height: 100px;
            resize: vertical;
        }

        .form-row {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 20px;
        }

        .form-row-3 {
            display: grid;
            grid-template-columns: 1fr 1fr 1fr;
            gap: 15px;
        }

        .btn {
            padding: 12px 24px;
            border: none;
            border-radius: 8px;
            font-size: 14px;
            font-weight: 500;
            cursor: pointer;
            transition: all 0.3s ease;
            text-decoration: none;
            display: inline-block;
            text-align: center;
        }

        .btn-primary {
            background: #667eea;
            color: white;
        }

        .btn-primary:hover {
            background: #5a6fd8;
            transform: translateY(-2px);
            box-shadow: 0 5px 15px rgba(102, 126, 234, 0.3);
        }

        .btn-secondary {
            background: #6c757d;
            color: white;
        }

        .btn-secondary:hover {
            background: #5a6268;
        }

        .btn-success {
            background: #28a745;
            color: white;
        }

        .btn-success:hover {
            background: #218838;
        }

        .btn-info {
            background: #17a2b8;
            color: white;
        }

        .btn-info:hover {
            background: #138496;
        }

        .btn-warning {
            background: #ffc107;
            color: #212529;
        }

        .btn-warning:hover {
            background: #e0a800;
        }

        .btn-group {
            display: flex;
            gap: 10px;
            flex-wrap: wrap;
            margin-top: 15px;
        }

        .result-container {
            background: #f8f9fa;
            border-radius: 8px;
            padding: 20px;
            margin-top: 20px;
            border-left: 4px solid #667eea;
        }

        .result-container h4 {
            color: #495057;
            margin-bottom: 15px;
        }

        .result-content {
            background: white;
            border-radius: 6px;
            padding: 15px;
            border: 1px solid #dee2e6;
            max-height: 400px;
            overflow-y: auto;
        }

        .loading {
            display: none;
            text-align: center;
            padding: 20px;
            color: #6c757d;
        }

        .loading.show {
            display: block;
        }

        .spinner {
            border: 3px solid #f3f3f3;
            border-top: 3px solid #667eea;
            border-radius: 50%;
            width: 30px;
            height: 30px;
            animation: spin 1s linear infinite;
            margin: 0 auto 10px;
        }

        @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }

        .asset-grid {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
            gap: 20px;
            margin-top: 20px;
        }

        .asset-card {
            background: white;
            border-radius: 8px;
            padding: 15px;
            border: 1px solid #dee2e6;
            transition: transform 0.3s ease, box-shadow 0.3s ease;
        }

        .asset-card:hover {
            transform: translateY(-5px);
            box-shadow: 0 10px 25px rgba(0,0,0,0.1);
        }

        .asset-preview {
            width: 100%;
            height: 150px;
            background: #f8f9fa;
            border-radius: 6px;
            display: flex;
            align-items: center;
            justify-content: center;
            margin-bottom: 10px;
            border: 2px dashed #dee2e6;
        }

        .asset-info h5 {
            color: #495057;
            margin-bottom: 5px;
        }

        .asset-info p {
            color: #6c757d;
            font-size: 0.9rem;
            margin-bottom: 3px;
        }

        .badge {
            display: inline-block;
            padding: 4px 8px;
            font-size: 0.75rem;
            font-weight: 500;
            border-radius: 4px;
            margin-right: 5px;
            margin-bottom: 5px;
        }

        .badge-primary {
            background: #667eea;
            color: white;
        }

        .badge-secondary {
            background: #6c757d;
            color: white;
        }

        .badge-success {
            background: #28a745;
            color: white;
        }

        .badge-info {
            background: #17a2b8;
            color: white;
        }

        .badge-warning {
            background: #ffc107;
            color: #212529;
        }

        .metrics-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 20px;
            margin-top: 20px;
        }

        .metric-card {
            background: white;
            border-radius: 8px;
            padding: 20px;
            text-align: center;
            border: 1px solid #dee2e6;
        }

        .metric-value {
            font-size: 2rem;
            font-weight: bold;
            color: #667eea;
            margin-bottom: 5px;
        }

        .metric-label {
            color: #6c757d;
            font-size: 0.9rem;
        }

        .consistency-profile {
            background: #f8f9fa;
            border-radius: 8px;
            padding: 15px;
            margin-bottom: 15px;
            border-left: 4px solid #28a745;
        }

        .consistency-profile h5 {
            color: #495057;
            margin-bottom: 10px;
        }

        .consistency-rules {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 10px;
        }

        .consistency-rule {
            background: white;
            padding: 10px;
            border-radius: 6px;
            border: 1px solid #dee2e6;
        }

        .rule-name {
            font-weight: 500;
            color: #495057;
            margin-bottom: 5px;
        }

        .rule-description {
            font-size: 0.85rem;
            color: #6c757d;
        }

        .generation-queue {
            max-height: 300px;
            overflow-y: auto;
        }

        .queue-item {
            background: white;
            border-radius: 6px;
            padding: 15px;
            margin-bottom: 10px;
            border-left: 4px solid #17a2b8;
        }

        .queue-item h6 {
            color: #495057;
            margin-bottom: 5px;
        }

        .queue-item p {
            color: #6c757d;
            font-size: 0.9rem;
            margin-bottom: 5px;
        }

        .status-indicator {
            display: inline-block;
            width: 8px;
            height: 8px;
            border-radius: 50%;
            margin-right: 5px;
        }

        .status-queued { background: #ffc107; }
        .status-processing { background: #17a2b8; }
        .status-completed { background: #28a745; }
        .status-failed { background: #dc3545; }

        @media (max-width: 768px) {
            .container {
                padding: 10px;
            }

            .header h1 {
                font-size: 2rem;
            }

            .form-row,
            .form-row-3 {
                grid-template-columns: 1fr;
            }

            .tabs {
                flex-direction: column;
            }

            .tab {
                text-align: left;
            }

            .asset-grid {
                grid-template-columns: 1fr;
            }

            .metrics-grid {
                grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
            }
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🎨 Visual Systems Integration</h1>
            <p>AI-Generated Graphics & Videos with Visual Consistency Management</p>
        </div>

        <div class="demo-container">
            <div class="tabs">
                <button class="tab active" onclick="showTab('generation')">🎨 Asset Generation</button>
                <button class="tab" onclick="showTab('characters')">👥 Characters</button>
                <button class="tab" onclick="showTab('species')">🛸 Species</button>
                <button class="tab" onclick="showTab('environments')">🌍 Environments</button>
                <button class="tab" onclick="showTab('videos')">🎬 Videos</button>
                <button class="tab" onclick="showTab('assets')">📁 Asset Library</button>
                <button class="tab" onclick="showTab('consistency')">🎯 Consistency</button>
                <button class="tab" onclick="showTab('analytics')">📊 Analytics</button>
            </div>

            <!-- Asset Generation Tab -->
            <div id="generation" class="tab-content active">
                <div class="section">
                    <h3>Generate Visual Assets</h3>
                    <div class="form-row">
                        <div class="form-group">
                            <label for="assetType">Asset Type</label>
                            <select id="assetType" class="form-control">
                                <option value="IMAGE">Image</option>
                                <option value="VIDEO">Video</option>
                                <option value="ANIMATION">Animation</option>
                                <option value="SPRITE">Sprite</option>
                                <option value="TEXTURE">Texture</option>
                                <option value="ICON">Icon</option>
                                <option value="BACKGROUND">Background</option>
                                <option value="PORTRAIT">Portrait</option>
                                <option value="LANDSCAPE">Landscape</option>
                            </select>
                        </div>
                        <div class="form-group">
                            <label for="assetCategory">Category</label>
                            <select id="assetCategory" class="form-control">
                                <option value="CHARACTER">Character</option>
                                <option value="SPECIES">Species</option>
                                <option value="PLANET">Planet</option>
                                <option value="CITY">City</option>
                                <option value="SPACESHIP">Spaceship</option>
                                <option value="UNIT">Unit</option>
                                <option value="TOOL">Tool</option>
                                <option value="WEAPON">Weapon</option>
                                <option value="BUILDING">Building</option>
                                <option value="ENVIRONMENT">Environment</option>
                                <option value="EFFECT">Effect</option>
                                <option value="UI">UI</option>
                                <option value="CUTSCENE">Cutscene</option>
                                <option value="EVENT">Event</option>
                            </select>
                        </div>
                    </div>
                    <div class="form-group">
                        <label for="promptText">Generation Prompt</label>
                        <textarea id="promptText" class="form-control textarea" 
                                  placeholder="Describe the visual asset you want to generate...">A futuristic space station orbiting a blue planet, with sleek metallic surfaces and glowing energy conduits</textarea>
                    </div>
                    <div class="form-row-3">
                        <div class="form-group">
                            <label for="artStyle">Art Style</label>
                            <select id="artStyle" class="form-control">
                                <option value="REALISTIC">Realistic</option>
                                <option value="STYLIZED">Stylized</option>
                                <option value="CARTOON">Cartoon</option>
                                <option value="PIXEL_ART">Pixel Art</option>
                                <option value="MINIMALIST">Minimalist</option>
                                <option value="CYBERPUNK">Cyberpunk</option>
                                <option value="SCI_FI" selected>Sci-Fi</option>
                                <option value="FANTASY">Fantasy</option>
                            </select>
                        </div>
                        <div class="form-group">
                            <label for="qualityLevel">Quality Level</label>
                            <select id="qualityLevel" class="form-control">
                                <option value="LOW">Low</option>
                                <option value="MEDIUM">Medium</option>
                                <option value="HIGH" selected>High</option>
                                <option value="ULTRA">Ultra</option>
                            </select>
                        </div>
                        <div class="form-group">
                            <label for="variations">Variations</label>
                            <input type="number" id="variations" class="form-control" value="1" min="1" max="5">
                        </div>
                    </div>
                    <div class="btn-group">
                        <button class="btn btn-primary" onclick="generateAsset()">🎨 Generate Asset</button>
                        <button class="btn btn-secondary" onclick="clearGenerationForm()">🗑️ Clear Form</button>
                    </div>
                </div>

                <div id="generationResult" class="result-container" style="display: none;">
                    <h4>Generation Result</h4>
                    <div class="loading">
                        <div class="spinner"></div>
                        <p>Generating visual asset...</p>
                    </div>
                    <div class="result-content"></div>
                </div>
            </div>

            <!-- Characters Tab -->
            <div id="characters" class="tab-content">
                <div class="section">
                    <h3>Generate Character Assets</h3>
                    <div class="form-row">
                        <div class="form-group">
                            <label for="characterName">Character Name</label>
                            <input type="text" id="characterName" class="form-control" placeholder="Captain Sarah Chen">
                        </div>
                        <div class="form-group">
                            <label for="characterSpecies">Species</label>
                            <input type="text" id="characterSpecies" class="form-control" placeholder="Human">
                        </div>
                    </div>
                    <div class="form-row">
                        <div class="form-group">
                            <label for="characterRole">Role</label>
                            <input type="text" id="characterRole" class="form-control" placeholder="Starship Captain">
                        </div>
                        <div class="form-group">
                            <label for="characterAge">Age</label>
                            <input type="number" id="characterAge" class="form-control" placeholder="35" min="1" max="1000">
                        </div>
                    </div>
                    <div class="form-group">
                        <label for="characterDescription">Character Description</label>
                        <textarea id="characterDescription" class="form-control textarea" 
                                  placeholder="Describe the character's appearance, personality, and background...">A confident starship captain with short brown hair, wearing a blue and silver uniform with command insignia</textarea>
                    </div>
                    <div class="btn-group">
                        <button class="btn btn-primary" onclick="generateCharacter()">👥 Generate Character</button>
                        <button class="btn btn-secondary" onclick="clearCharacterForm()">🗑️ Clear Form</button>
                    </div>
                </div>

                <div id="characterResult" class="result-container" style="display: none;">
                    <h4>Character Generation Result</h4>
                    <div class="loading">
                        <div class="spinner"></div>
                        <p>Generating character asset...</p>
                    </div>
                    <div class="result-content"></div>
                </div>
            </div>

            <!-- Species Tab -->
            <div id="species" class="tab-content">
                <div class="section">
                    <h3>Generate Species Assets</h3>
                    <div class="form-row">
                        <div class="form-group">
                            <label for="speciesName">Species Name</label>
                            <input type="text" id="speciesName" class="form-control" placeholder="Zephyrians">
                        </div>
                        <div class="form-group">
                            <label for="speciesHomeworld">Homeworld</label>
                            <input type="text" id="speciesHomeworld" class="form-control" placeholder="Zephyr Prime">
                        </div>
                    </div>
                    <div class="form-group">
                        <label for="speciesPhysiology">Physiology</label>
                        <textarea id="speciesPhysiology" class="form-control textarea" 
                                  placeholder="Describe the species' physical characteristics...">Tall, slender humanoids with blue-tinted skin, large eyes adapted for low light, and delicate features</textarea>
                    </div>
                    <div class="form-group">
                        <label for="speciesCulture">Culture & Technology</label>
                        <textarea id="speciesCulture" class="form-control textarea" 
                                  placeholder="Describe their culture, technology, and society...">Advanced peaceful civilization focused on harmony with nature and sustainable technology</textarea>
                    </div>
                    <div class="btn-group">
                        <button class="btn btn-primary" onclick="generateSpecies()">🛸 Generate Species</button>
                        <button class="btn btn-secondary" onclick="clearSpeciesForm()">🗑️ Clear Form</button>
                    </div>
                </div>

                <div id="speciesResult" class="result-container" style="display: none;">
                    <h4>Species Generation Result</h4>
                    <div class="loading">
                        <div class="spinner"></div>
                        <p>Generating species asset...</p>
                    </div>
                    <div class="result-content"></div>
                </div>
            </div>

            <!-- Environments Tab -->
            <div id="environments" class="tab-content">
                <div class="section">
                    <h3>Generate Environment Assets</h3>
                    <div class="form-row">
                        <div class="form-group">
                            <label for="environmentName">Environment Name</label>
                            <input type="text" id="environmentName" class="form-control" placeholder="Crystal Caverns of Arcturus">
                        </div>
                        <div class="form-group">
                            <label for="environmentType">Environment Type</label>
                            <select id="environmentType" class="form-control">
                                <option value="PLANET_SURFACE">Planet Surface</option>
                                <option value="SPACE_STATION">Space Station</option>
                                <option value="CITY">City</option>
                                <option value="WILDERNESS">Wilderness</option>
                                <option value="UNDERGROUND">Underground</option>
                                <option value="UNDERWATER">Underwater</option>
                                <option value="AERIAL">Aerial</option>
                            </select>
                        </div>
                    </div>
                    <div class="form-row">
                        <div class="form-group">
                            <label for="environmentBiome">Biome</label>
                            <select id="environmentBiome" class="form-control">
                                <option value="FOREST">Forest</option>
                                <option value="DESERT">Desert</option>
                                <option value="OCEAN">Ocean</option>
                                <option value="MOUNTAIN">Mountain</option>
                                <option value="ARCTIC">Arctic</option>
                                <option value="GRASSLAND">Grassland</option>
                                <option value="SWAMP">Swamp</option>
                                <option value="VOLCANIC">Volcanic</option>
                                <option value="CRYSTALLINE" selected>Crystalline</option>
                                <option value="ARTIFICIAL">Artificial</option>
                            </select>
                        </div>
                        <div class="form-group">
                            <label for="environmentClimate">Climate</label>
                            <input type="text" id="environmentClimate" class="form-control" placeholder="Cool, humid, bioluminescent">
                        </div>
                    </div>
                    <div class="form-group">
                        <label for="environmentDescription">Environment Description</label>
                        <textarea id="environmentDescription" class="form-control textarea" 
                                  placeholder="Describe the environment's appearance, features, and atmosphere...">Vast underground caverns filled with glowing crystals, creating an ethereal blue-green light that illuminates ancient rock formations</textarea>
                    </div>
                    <div class="btn-group">
                        <button class="btn btn-primary" onclick="generateEnvironment()">🌍 Generate Environment</button>
                        <button class="btn btn-secondary" onclick="clearEnvironmentForm()">🗑️ Clear Form</button>
                    </div>
                </div>

                <div id="environmentResult" class="result-container" style="display: none;">
                    <h4>Environment Generation Result</h4>
                    <div class="loading">
                        <div class="spinner"></div>
                        <p>Generating environment asset...</p>
                    </div>
                    <div class="result-content"></div>
                </div>
            </div>

            <!-- Videos Tab -->
            <div id="videos" class="tab-content">
                <div class="section">
                    <h3>Generate Video Assets</h3>
                    <div class="form-row">
                        <div class="form-group">
                            <label for="videoTitle">Video Title</label>
                            <input type="text" id="videoTitle" class="form-control" placeholder="Galactic Alliance Formation">
                        </div>
                        <div class="form-group">
                            <label for="videoDuration">Duration (seconds)</label>
                            <input type="number" id="videoDuration" class="form-control" value="30" min="5" max="300">
                        </div>
                    </div>
                    <div class="form-row">
                        <div class="form-group">
                            <label for="videoStyle">Video Style</label>
                            <select id="videoStyle" class="form-control">
                                <option value="CINEMATIC" selected>Cinematic</option>
                                <option value="DOCUMENTARY">Documentary</option>
                                <option value="ANIMATED">Animated</option>
                                <option value="DRAMATIC">Dramatic</option>
                                <option value="ACTION">Action</option>
                            </select>
                        </div>
                        <div class="form-group">
                            <label for="videoMood">Mood</label>
                            <select id="videoMood" class="form-control">
                                <option value="HEROIC" selected>Heroic</option>
                                <option value="DRAMATIC">Dramatic</option>
                                <option value="MYSTERIOUS">Mysterious</option>
                                <option value="PEACEFUL">Peaceful</option>
                                <option value="INTENSE">Intense</option>
                                <option value="TRIUMPHANT">Triumphant</option>
                            </select>
                        </div>
                    </div>
                    <div class="form-group">
                        <label for="videoDescription">Video Description</label>
                        <textarea id="videoDescription" class="form-control textarea" 
                                  placeholder="Describe the video content, scenes, and narrative...">A sweeping cinematic sequence showing multiple alien fleets converging in space, with dramatic music and inspiring visuals of unity and cooperation</textarea>
                    </div>
                    <div class="btn-group">
                        <button class="btn btn-primary" onclick="generateVideo()">🎬 Generate Video</button>
                        <button class="btn btn-secondary" onclick="clearVideoForm()">🗑️ Clear Form</button>
                    </div>
                </div>

                <div id="videoResult" class="result-container" style="display: none;">
                    <h4>Video Generation Result</h4>
                    <div class="loading">
                        <div class="spinner"></div>
                        <p>Generating video asset...</p>
                    </div>
                    <div class="result-content"></div>
                </div>
            </div>

            <!-- Asset Library Tab -->
            <div id="assets" class="tab-content">
                <div class="section">
                    <h3>Asset Library</h3>
                    <div class="form-row">
                        <div class="form-group">
                            <label for="assetFilter">Filter by Type</label>
                            <select id="assetFilter" class="form-control" onchange="loadAssets()">
                                <option value="">All Types</option>
                                <option value="IMAGE">Images</option>
                                <option value="VIDEO">Videos</option>
                                <option value="ANIMATION">Animations</option>
                                <option value="CHARACTER">Characters</option>
                                <option value="SPECIES">Species</option>
                                <option value="ENVIRONMENT">Environments</option>
                            </select>
                        </div>
                        <div class="form-group">
                            <label for="assetSearch">Search Assets</label>
                            <input type="text" id="assetSearch" class="form-control" placeholder="Search by name or description..." onkeyup="searchAssets()">
                        </div>
                    </div>
                    <div class="btn-group">
                        <button class="btn btn-primary" onclick="loadAssets()">📁 Load Assets</button>
                        <button class="btn btn-secondary" onclick="refreshAssets()">🔄 Refresh</button>
                    </div>
                </div>

                <div id="assetLibrary" class="asset-grid"></div>
            </div>

            <!-- Consistency Tab -->
            <div id="consistency" class="tab-content">
                <div class="section">
                    <h3>Consistency Profiles</h3>
                    <div class="btn-group">
                        <button class="btn btn-primary" onclick="loadConsistencyProfiles()">🎯 Load Profiles</button>
                        <button class="btn btn-success" onclick="createConsistencyProfile()">➕ Create Profile</button>
                        <button class="btn btn-info" onclick="loadStyleGuides()">🎨 Style Guides</button>
                    </div>
                </div>

                <div id="consistencyProfiles"></div>

                <div class="section">
                    <h3>Generation Queue</h3>
                    <div class="btn-group">
                        <button class="btn btn-primary" onclick="loadGenerationQueue()">📋 Load Queue</button>
                        <button class="btn btn-secondary" onclick="loadGenerationHistory()">📜 History</button>
                    </div>
                </div>

                <div id="generationQueue" class="generation-queue"></div>
            </div>

            <!-- Analytics Tab -->
            <div id="analytics" class="tab-content">
                <div class="section">
                    <h3>System Metrics</h3>
                    <div class="btn-group">
                        <button class="btn btn-primary" onclick="loadSystemMetrics()">📊 Load Metrics</button>
                        <button class="btn btn-info" onclick="loadAssetAnalytics()">📈 Asset Analytics</button>
                        <button class="btn btn-success" onclick="checkSystemHealth()">💚 Health Check</button>
                    </div>
                </div>

                <div id="systemMetrics" class="metrics-grid"></div>

                <div class="section">
                    <h3>Asset Analytics</h3>
                </div>

                <div id="assetAnalytics"></div>
            </div>
        </div>
    </div>

    <script>
        // Tab Management
        function showTab(tabName) {
            // Hide all tab contents
            const tabContents = document.querySelectorAll('.tab-content');
            tabContents.forEach(content => content.classList.remove('active'));

            // Remove active class from all tabs
            const tabs = document.querySelectorAll('.tab');
            tabs.forEach(tab => tab.classList.remove('active'));

            // Show selected tab content
            document.getElementById(tabName).classList.add('active');

            // Add active class to clicked tab
            event.target.classList.add('active');
        }

        // Asset Generation Functions
        async function generateAsset() {
            const resultContainer = document.getElementById('generationResult');
            const loading = resultContainer.querySelector('.loading');
            const resultContent = resultContainer.querySelector('.result-content');

            resultContainer.style.display = 'block';
            loading.classList.add('show');
            resultContent.innerHTML = '';

            try {
                const response = await fetch('/api/visual-systems/generate', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        type: document.getElementById('assetType').value,
                        category: document.getElementById('assetCategory').value,
                        prompt: {
                            text: document.getElementById('promptText').value,
                            style: {
                                artistic: document.getElementById('artStyle').value
                            }
                        },
                        options: {
                            variations: parseInt(document.getElementById('variations').value),
                            qualityAssurance: {
                                enabled: true,
                                automaticQC: true
                            }
                        }
                    })
                });

                const data = await response.json();
                loading.classList.remove('show');

                if (data.success) {
                    resultContent.innerHTML = \`
                        <h5>✅ Asset Generated Successfully</h5>
                        <p><strong>Request ID:</strong> \${data.data.requestId}</p>
                        <p><strong>Status:</strong> <span class="badge badge-success">\${data.data.status}</span></p>
                        <p><strong>Generation Time:</strong> \${data.data.metadata.generationTime}ms</p>
                        <p><strong>Quality Score:</strong> \${(data.data.quality.overall * 100).toFixed(1)}%</p>
                        <p><strong>Assets Generated:</strong> \${data.data.assets.length}</p>
                        <div class="asset-grid">
                            \${data.data.assets.map(asset => \`
                                <div class="asset-card">
                                    <div class="asset-preview">
                                        <span>🎨 \${asset.format}</span>
                                    </div>
                                    <div class="asset-info">
                                        <h5>\${asset.id}</h5>
                                        <p><strong>Format:</strong> \${asset.format}</p>
                                        <p><strong>Size:</strong> \${asset.metadata.width}x\${asset.metadata.height}</p>
                                        <p><strong>Quality:</strong> \${(asset.quality.overall * 100).toFixed(1)}%</p>
                                        <p><strong>URL:</strong> <a href="\${asset.url}" target="_blank">\${asset.url}</a></p>
                                    </div>
                                </div>
                            \`).join('')}
                        </div>
                    \`;
                } else {
                    resultContent.innerHTML = \`
                        <h5>❌ Generation Failed</h5>
                        <p>\${data.error}</p>
                        \${data.details ? \`<p><strong>Details:</strong> \${data.details}</p>\` : ''}
                    \`;
                }
            } catch (error) {
                loading.classList.remove('show');
                resultContent.innerHTML = \`
                    <h5>❌ Error</h5>
                    <p>Failed to generate asset: \${error.message}</p>
                \`;
            }
        }

        function clearGenerationForm() {
            document.getElementById('promptText').value = 'A futuristic space station orbiting a blue planet, with sleek metallic surfaces and glowing energy conduits';
            document.getElementById('assetType').value = 'IMAGE';
            document.getElementById('assetCategory').value = 'CHARACTER';
            document.getElementById('artStyle').value = 'SCI_FI';
            document.getElementById('qualityLevel').value = 'HIGH';
            document.getElementById('variations').value = '1';
            document.getElementById('generationResult').style.display = 'none';
        }

        // Character Generation
        async function generateCharacter() {
            const resultContainer = document.getElementById('characterResult');
            const loading = resultContainer.querySelector('.loading');
            const resultContent = resultContainer.querySelector('.result-content');

            resultContainer.style.display = 'block';
            loading.classList.add('show');
            resultContent.innerHTML = '';

            try {
                const characterInfo = {
                    name: document.getElementById('characterName').value || 'Unknown Character',
                    species: document.getElementById('characterSpecies').value || 'Unknown Species',
                    role: document.getElementById('characterRole').value || 'Unknown Role',
                    age: parseInt(document.getElementById('characterAge').value) || 25
                };

                const response = await fetch('/api/visual-systems/generate/character', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        characterInfo,
                        prompt: {
                            text: document.getElementById('characterDescription').value
                        }
                    })
                });

                const data = await response.json();
                loading.classList.remove('show');

                if (data.success) {
                    resultContent.innerHTML = \`
                        <h5>✅ Character Generated Successfully</h5>
                        <div class="asset-card">
                            <div class="asset-preview">
                                <span>👥 CHARACTER</span>
                            </div>
                            <div class="asset-info">
                                <h5>\${data.data.character.name}</h5>
                                <p><strong>Species:</strong> \${data.data.character.species}</p>
                                <p><strong>Role:</strong> \${data.data.character.role}</p>
                                <p><strong>Age:</strong> \${data.data.character.age}</p>
                                <p><strong>Quality:</strong> \${(data.data.quality.overall * 100).toFixed(1)}%</p>
                                <p><strong>URL:</strong> <a href="\${data.data.url}" target="_blank">\${data.data.url}</a></p>
                            </div>
                        </div>
                    \`;
                } else {
                    resultContent.innerHTML = \`
                        <h5>❌ Character Generation Failed</h5>
                        <p>\${data.error}</p>
                    \`;
                }
            } catch (error) {
                loading.classList.remove('show');
                resultContent.innerHTML = \`
                    <h5>❌ Error</h5>
                    <p>Failed to generate character: \${error.message}</p>
                \`;
            }
        }

        function clearCharacterForm() {
            document.getElementById('characterName').value = '';
            document.getElementById('characterSpecies').value = '';
            document.getElementById('characterRole').value = '';
            document.getElementById('characterAge').value = '';
            document.getElementById('characterDescription').value = '';
            document.getElementById('characterResult').style.display = 'none';
        }

        // Species Generation
        async function generateSpecies() {
            const resultContainer = document.getElementById('speciesResult');
            const loading = resultContainer.querySelector('.loading');
            const resultContent = resultContainer.querySelector('.result-content');

            resultContainer.style.display = 'block';
            loading.classList.add('show');
            resultContent.innerHTML = '';

            try {
                const speciesInfo = {
                    name: document.getElementById('speciesName').value || 'Unknown Species',
                    homeworld: document.getElementById('speciesHomeworld').value || 'Unknown World',
                    physiology: document.getElementById('speciesPhysiology').value,
                    culture: document.getElementById('speciesCulture').value
                };

                const response = await fetch('/api/visual-systems/generate/species', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        speciesInfo,
                        prompt: {
                            text: \`\${speciesInfo.physiology} \${speciesInfo.culture}\`
                        }
                    })
                });

                const data = await response.json();
                loading.classList.remove('show');

                if (data.success) {
                    resultContent.innerHTML = \`
                        <h5>✅ Species Generated Successfully</h5>
                        <div class="asset-card">
                            <div class="asset-preview">
                                <span>🛸 SPECIES</span>
                            </div>
                            <div class="asset-info">
                                <h5>\${data.data.species.name}</h5>
                                <p><strong>Homeworld:</strong> \${data.data.species.homeworld}</p>
                                <p><strong>Quality:</strong> \${(data.data.quality.overall * 100).toFixed(1)}%</p>
                                <p><strong>URL:</strong> <a href="\${data.data.url}" target="_blank">\${data.data.url}</a></p>
                            </div>
                        </div>
                    \`;
                } else {
                    resultContent.innerHTML = \`
                        <h5>❌ Species Generation Failed</h5>
                        <p>\${data.error}</p>
                    \`;
                }
            } catch (error) {
                loading.classList.remove('show');
                resultContent.innerHTML = \`
                    <h5>❌ Error</h5>
                    <p>Failed to generate species: \${error.message}</p>
                \`;
            }
        }

        function clearSpeciesForm() {
            document.getElementById('speciesName').value = '';
            document.getElementById('speciesHomeworld').value = '';
            document.getElementById('speciesPhysiology').value = '';
            document.getElementById('speciesCulture').value = '';
            document.getElementById('speciesResult').style.display = 'none';
        }

        // Environment Generation
        async function generateEnvironment() {
            const resultContainer = document.getElementById('environmentResult');
            const loading = resultContainer.querySelector('.loading');
            const resultContent = resultContainer.querySelector('.result-content');

            resultContainer.style.display = 'block';
            loading.classList.add('show');
            resultContent.innerHTML = '';

            try {
                const environmentInfo = {
                    name: document.getElementById('environmentName').value || 'Unknown Environment',
                    type: document.getElementById('environmentType').value,
                    biome: document.getElementById('environmentBiome').value,
                    climate: document.getElementById('environmentClimate').value
                };

                const response = await fetch('/api/visual-systems/generate/environment', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        environmentInfo,
                        prompt: {
                            text: document.getElementById('environmentDescription').value
                        }
                    })
                });

                const data = await response.json();
                loading.classList.remove('show');

                if (data.success) {
                    resultContent.innerHTML = \`
                        <h5>✅ Environment Generated Successfully</h5>
                        <div class="asset-card">
                            <div class="asset-preview">
                                <span>🌍 ENVIRONMENT</span>
                            </div>
                            <div class="asset-info">
                                <h5>\${data.data.environment.name}</h5>
                                <p><strong>Type:</strong> \${data.data.environment.type}</p>
                                <p><strong>Biome:</strong> \${data.data.environment.biome}</p>
                                <p><strong>Quality:</strong> \${(data.data.quality.overall * 100).toFixed(1)}%</p>
                                <p><strong>URL:</strong> <a href="\${data.data.url}" target="_blank">\${data.data.url}</a></p>
                            </div>
                        </div>
                    \`;
                } else {
                    resultContent.innerHTML = \`
                        <h5>❌ Environment Generation Failed</h5>
                        <p>\${data.error}</p>
                    \`;
                }
            } catch (error) {
                loading.classList.remove('show');
                resultContent.innerHTML = \`
                    <h5>❌ Error</h5>
                    <p>Failed to generate environment: \${error.message}</p>
                \`;
            }
        }

        function clearEnvironmentForm() {
            document.getElementById('environmentName').value = '';
            document.getElementById('environmentType').value = 'PLANET_SURFACE';
            document.getElementById('environmentBiome').value = 'FOREST';
            document.getElementById('environmentClimate').value = '';
            document.getElementById('environmentDescription').value = '';
            document.getElementById('environmentResult').style.display = 'none';
        }

        // Video Generation
        async function generateVideo() {
            const resultContainer = document.getElementById('videoResult');
            const loading = resultContainer.querySelector('.loading');
            const resultContent = resultContainer.querySelector('.result-content');

            resultContainer.style.display = 'block';
            loading.classList.add('show');
            resultContent.innerHTML = '';

            try {
                const videoInfo = {
                    title: document.getElementById('videoTitle').value || 'Untitled Video',
                    duration: parseInt(document.getElementById('videoDuration').value) || 30,
                    style: document.getElementById('videoStyle').value,
                    mood: document.getElementById('videoMood').value
                };

                const response = await fetch('/api/visual-systems/generate/video', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        videoInfo,
                        prompt: {
                            text: document.getElementById('videoDescription').value
                        }
                    })
                });

                const data = await response.json();
                loading.classList.remove('show');

                if (data.success) {
                    resultContent.innerHTML = \`
                        <h5>✅ Video Generated Successfully</h5>
                        <div class="asset-card">
                            <div class="asset-preview">
                                <span>🎬 VIDEO</span>
                            </div>
                            <div class="asset-info">
                                <h5>\${data.data.video.title || data.data.name}</h5>
                                <p><strong>Duration:</strong> \${data.data.video.duration}s</p>
                                <p><strong>Resolution:</strong> \${data.data.video.resolution.width}x\${data.data.video.resolution.height}</p>
                                <p><strong>Quality:</strong> \${(data.data.quality.overall * 100).toFixed(1)}%</p>
                                <p><strong>URL:</strong> <a href="\${data.data.url}" target="_blank">\${data.data.url}</a></p>
                            </div>
                        </div>
                    \`;
                } else {
                    resultContent.innerHTML = \`
                        <h5>❌ Video Generation Failed</h5>
                        <p>\${data.error}</p>
                    \`;
                }
            } catch (error) {
                loading.classList.remove('show');
                resultContent.innerHTML = \`
                    <h5>❌ Error</h5>
                    <p>Failed to generate video: \${error.message}</p>
                \`;
            }
        }

        function clearVideoForm() {
            document.getElementById('videoTitle').value = '';
            document.getElementById('videoDuration').value = '30';
            document.getElementById('videoStyle').value = 'CINEMATIC';
            document.getElementById('videoMood').value = 'HEROIC';
            document.getElementById('videoDescription').value = '';
            document.getElementById('videoResult').style.display = 'none';
        }

        // Asset Library Functions
        async function loadAssets() {
            const assetLibrary = document.getElementById('assetLibrary');
            const filter = document.getElementById('assetFilter').value;
            
            assetLibrary.innerHTML = '<div class="loading show"><div class="spinner"></div><p>Loading assets...</p></div>';

            try {
                let url = '/api/visual-systems/assets';
                if (filter) {
                    url += \`?type=\${filter}\`;
                }

                const response = await fetch(url);
                const data = await response.json();

                if (data.success) {
                    if (data.data.assets.length === 0) {
                        assetLibrary.innerHTML = '<p>No assets found. Generate some assets first!</p>';
                        return;
                    }

                    assetLibrary.innerHTML = data.data.assets.map(asset => \`
                        <div class="asset-card">
                            <div class="asset-preview">
                                <span>\${getAssetIcon(asset.type)} \${asset.type}</span>
                            </div>
                            <div class="asset-info">
                                <h5>\${asset.name}</h5>
                                <p><strong>Category:</strong> \${asset.category}</p>
                                <p><strong>Format:</strong> \${asset.format}</p>
                                <p><strong>Size:</strong> \${asset.metadata.width}x\${asset.metadata.height}</p>
                                <p><strong>Quality:</strong> \${(asset.quality.overall * 100).toFixed(1)}%</p>
                                <div>
                                    \${asset.metadata.tags.map(tag => \`<span class="badge badge-secondary">\${tag}</span>\`).join('')}
                                </div>
                            </div>
                        </div>
                    \`).join('');
                } else {
                    assetLibrary.innerHTML = \`<p>Failed to load assets: \${data.error}</p>\`;
                }
            } catch (error) {
                assetLibrary.innerHTML = \`<p>Error loading assets: \${error.message}</p>\`;
            }
        }

        function getAssetIcon(type) {
            const icons = {
                'IMAGE': '🖼️',
                'VIDEO': '🎬',
                'ANIMATION': '🎞️',
                'CHARACTER': '👥',
                'SPECIES': '🛸',
                'ENVIRONMENT': '🌍',
                'SPACESHIP': '🚀',
                'WEAPON': '⚔️',
                'TOOL': '🔧',
                'BUILDING': '🏢'
            };
            return icons[type] || '📄';
        }

        function refreshAssets() {
            loadAssets();
        }

        function searchAssets() {
            const searchTerm = document.getElementById('assetSearch').value;
            if (searchTerm.length > 2) {
                // Implement search functionality
                loadAssets();
            }
        }

        // Consistency Functions
        async function loadConsistencyProfiles() {
            const profilesContainer = document.getElementById('consistencyProfiles');
            profilesContainer.innerHTML = '<div class="loading show"><div class="spinner"></div><p>Loading consistency profiles...</p></div>';

            try {
                const response = await fetch('/api/visual-systems/consistency-profiles');
                const data = await response.json();

                if (data.success) {
                    profilesContainer.innerHTML = data.data.map(profile => \`
                        <div class="consistency-profile">
                            <h5>\${profile.name}</h5>
                            <p><strong>Type:</strong> \${profile.type}</p>
                            <p><strong>Enforcement:</strong> \${profile.enforcement.strictness}</p>
                            <div class="consistency-rules">
                                \${profile.rules.map(rule => \`
                                    <div class="consistency-rule">
                                        <div class="rule-name">\${rule.name}</div>
                                        <div class="rule-description">\${rule.description}</div>
                                        <span class="badge badge-info">\${rule.enforcement}</span>
                                    </div>
                                \`).join('')}
                            </div>
                        </div>
                    \`).join('');
                } else {
                    profilesContainer.innerHTML = \`<p>Failed to load consistency profiles: \${data.error}</p>\`;
                }
            } catch (error) {
                profilesContainer.innerHTML = \`<p>Error loading consistency profiles: \${error.message}</p>\`;
            }
        }

        function createConsistencyProfile() {
            alert('Consistency profile creation interface would be implemented here');
        }

        function loadStyleGuides() {
            alert('Style guides interface would be implemented here');
        }

        async function loadGenerationQueue() {
            const queueContainer = document.getElementById('generationQueue');
            queueContainer.innerHTML = '<div class="loading show"><div class="spinner"></div><p>Loading generation queue...</p></div>';

            try {
                const response = await fetch('/api/visual-systems/generation/queue');
                const data = await response.json();

                if (data.success) {
                    if (data.data.length === 0) {
                        queueContainer.innerHTML = '<p>Generation queue is empty.</p>';
                        return;
                    }

                    queueContainer.innerHTML = data.data.map(item => \`
                        <div class="queue-item">
                            <h6>
                                <span class="status-indicator status-\${item.status || 'queued'}"></span>
                                \${item.type} - \${item.category}
                            </h6>
                            <p><strong>Prompt:</strong> \${item.prompt.text.substring(0, 100)}...</p>
                            <p><strong>Priority:</strong> \${item.priority}</p>
                            <p><strong>Requested:</strong> \${new Date(item.timestamp).toLocaleString()}</p>
                        </div>
                    \`).join('');
                } else {
                    queueContainer.innerHTML = \`<p>Failed to load generation queue: \${data.error}</p>\`;
                }
            } catch (error) {
                queueContainer.innerHTML = \`<p>Error loading generation queue: \${error.message}</p>\`;
            }
        }

        function loadGenerationHistory() {
            alert('Generation history interface would be implemented here');
        }

        // Analytics Functions
        async function loadSystemMetrics() {
            const metricsContainer = document.getElementById('systemMetrics');
            metricsContainer.innerHTML = '<div class="loading show"><div class="spinner"></div><p>Loading system metrics...</p></div>';

            try {
                const response = await fetch('/api/visual-systems/metrics/system');
                const data = await response.json();

                if (data.success) {
                    metricsContainer.innerHTML = \`
                        <div class="metric-card">
                            <div class="metric-value">\${data.data.assets}</div>
                            <div class="metric-label">Total Assets</div>
                        </div>
                        <div class="metric-card">
                            <div class="metric-value">\${data.data.profiles}</div>
                            <div class="metric-label">Consistency Profiles</div>
                        </div>
                        <div class="metric-card">
                            <div class="metric-value">\${data.data.styleGuides}</div>
                            <div class="metric-label">Style Guides</div>
                        </div>
                        <div class="metric-card">
                            <div class="metric-value">\${data.data.queueSize}</div>
                            <div class="metric-label">Queue Size</div>
                        </div>
                        <div class="metric-card">
                            <div class="metric-value">\${data.data.performance.loadTime.toFixed(0)}ms</div>
                            <div class="metric-label">Avg Load Time</div>
                        </div>
                        <div class="metric-card">
                            <div class="metric-value">\${data.data.performance.memoryUsage.toFixed(1)}MB</div>
                            <div class="metric-label">Memory Usage</div>
                        </div>
                    \`;
                } else {
                    metricsContainer.innerHTML = \`<p>Failed to load system metrics: \${data.error}</p>\`;
                }
            } catch (error) {
                metricsContainer.innerHTML = \`<p>Error loading system metrics: \${error.message}</p>\`;
            }
        }

        async function loadAssetAnalytics() {
            const analyticsContainer = document.getElementById('assetAnalytics');
            analyticsContainer.innerHTML = '<div class="loading show"><div class="spinner"></div><p>Loading asset analytics...</p></div>';

            try {
                const response = await fetch('/api/visual-systems/metrics/assets');
                const data = await response.json();

                if (data.success) {
                    const typeChart = Object.entries(data.data.byType).map(([type, count]) => 
                        \`<div class="metric-card">
                            <div class="metric-value">\${count}</div>
                            <div class="metric-label">\${type}</div>
                        </div>\`
                    ).join('');

                    analyticsContainer.innerHTML = \`
                        <div class="metrics-grid">
                            \${typeChart}
                        </div>
                        <div class="result-container">
                            <h4>Summary</h4>
                            <div class="result-content">
                                <p><strong>Total Storage:</strong> \${(data.data.totalSize / 1024 / 1024).toFixed(2)} MB</p>
                                <p><strong>Average Quality:</strong> \${(data.data.averageQuality * 100).toFixed(1)}%</p>
                            </div>
                        </div>
                    \`;
                } else {
                    analyticsContainer.innerHTML = \`<p>Failed to load asset analytics: \${data.error}</p>\`;
                }
            } catch (error) {
                analyticsContainer.innerHTML = \`<p>Error loading asset analytics: \${error.message}</p>\`;
            }
        }

        async function checkSystemHealth() {
            try {
                const response = await fetch('/api/visual-systems/health');
                const data = await response.json();

                if (data.success) {
                    alert(\`System Status: \${data.data.status.toUpperCase()}\\nUptime: \${Math.floor(data.data.uptime / 60)} minutes\\nAssets: \${data.data.metrics.assets}\`);
                } else {
                    alert(\`Health check failed: \${data.error}\`);
                }
            } catch (error) {
                alert(\`Health check error: \${error.message}\`);
            }
        }

        // Initialize demo
        document.addEventListener('DOMContentLoaded', function() {
            console.log('Visual Systems Demo initialized');
        });
    </script>
</body>
</html>
  `;

  res.send(html);
});

export default router;
