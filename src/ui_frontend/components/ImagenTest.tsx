import React, { useState } from 'react';
import './ImagenTest.css';

interface ImageGenerationResult {
  success: boolean;
  imageUrl?: string;
  imageData?: string;
  error?: string;
  metadata?: {
    prompt: string;
    model: string;
    timestamp: string;
    aspectRatio: string;
    style: string;
  };
}

interface ServiceStatus {
  success: boolean;
  service: string;
  registry: {
    totalProviders: number;
    availableProviders: string[];
    primaryProvider: string | null;
    fallbackProviders: string[];
    loadBalancingEnabled: boolean;
  };
  providers: Record<string, {
    isAvailable: boolean;
    isConfigured: boolean;
    apiKeyPresent: boolean;
    model: string;
    version?: string;
    capabilities: any;
  }>;
  endpoints: string[];
}

export const ImagenTest: React.FC = () => {
  const [prompt, setPrompt] = useState('A futuristic galactic civilization with advanced technology and beautiful architecture');
  const [aspectRatio, setAspectRatio] = useState<'1:1' | '9:16' | '16:9' | '4:3' | '3:4'>('16:9');
  const [style, setStyle] = useState<'photographic' | 'digital-art' | 'illustration' | 'anime' | 'concept-art'>('digital-art');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ImageGenerationResult | null>(null);
  const [status, setStatus] = useState<ServiceStatus | null>(null);
  const [activeTab, setActiveTab] = useState<'generate' | 'entity' | 'variations' | 'status'>('generate');

  // Entity generation state
  const [entityType, setEntityType] = useState<'planet' | 'character' | 'species' | 'civilization' | 'city' | 'logo'>('planet');
  const [entityName, setEntityName] = useState('Kepler-442b');
  const [entityDescription, setEntityDescription] = useState('A lush, Earth-like exoplanet with blue oceans, green continents, and swirling white clouds');

  // Variations state
  const [variations, setVariations] = useState<ImageGenerationResult[]>([]);
  const [variationCount, setVariationCount] = useState(3);
  const [selectedProvider, setSelectedProvider] = useState<string>('');

  const generateImage = async () => {
    setLoading(true);
    setResult(null);

    try {
      const response = await fetch('/api/imagen/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt,
          aspectRatio,
          style,
          quality: 'hd',
          provider: selectedProvider || undefined
        }),
      });

      const data = await response.json();
      setResult(data);
    } catch (error) {
      setResult({
        success: false,
        error: error instanceof Error ? error.message : 'Network error'
      });
    } finally {
      setLoading(false);
    }
  };

  const generateEntityImage = async () => {
    setLoading(true);
    setResult(null);

    try {
      const response = await fetch('/api/imagen/generate-entity', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          entityType,
          entityName,
          description: entityDescription,
          style,
          provider: selectedProvider || undefined
        }),
      });

      const data = await response.json();
      setResult(data);
    } catch (error) {
      setResult({
        success: false,
        error: error instanceof Error ? error.message : 'Network error'
      });
    } finally {
      setLoading(false);
    }
  };

  const generateVariations = async () => {
    setLoading(true);
    setVariations([]);

    try {
      const response = await fetch('/api/imagen/generate-variations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt,
          aspectRatio,
          style,
          count: variationCount,
          provider: selectedProvider || undefined
        }),
      });

      const data = await response.json();
      if (data.success) {
        setVariations(data.variations);
      } else {
        setResult({
          success: false,
          error: data.error || 'Failed to generate variations'
        });
      }
    } catch (error) {
      setResult({
        success: false,
        error: error instanceof Error ? error.message : 'Network error'
      });
    } finally {
      setLoading(false);
    }
  };

  const checkStatus = async () => {
    try {
      const response = await fetch('/api/imagen/status');
      const data = await response.json();
      setStatus(data);
    } catch (error) {
      setStatus({
        success: false,
        service: 'Google Imagen',
        configured: false,
        model: 'Unknown',
        apiKeyPresent: false,
        endpoints: []
      });
    }
  };

  const runTest = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/imagen/test');
      const data = await response.json();
      setResult(data.testResult);
      setStatus(data.serviceStatus);
    } catch (error) {
      setResult({
        success: false,
        error: error instanceof Error ? error.message : 'Test failed'
      });
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    checkStatus();
  }, []);

  return (
    <div className="imagen-test">
      <div className="test-header">
        <h1>🎨 Google Imagen Test Interface</h1>
        <p>Test Google Imagen integration for generating game graphics</p>
      </div>

      <div className="test-tabs">
        <button 
          className={`tab ${activeTab === 'generate' ? 'active' : ''}`}
          onClick={() => setActiveTab('generate')}
        >
          🖼️ Generate Image
        </button>
        <button 
          className={`tab ${activeTab === 'entity' ? 'active' : ''}`}
          onClick={() => setActiveTab('entity')}
        >
          🌍 Game Entity
        </button>
        <button 
          className={`tab ${activeTab === 'variations' ? 'active' : ''}`}
          onClick={() => setActiveTab('variations')}
        >
          🔄 Variations
        </button>
        <button 
          className={`tab ${activeTab === 'status' ? 'active' : ''}`}
          onClick={() => setActiveTab('status')}
        >
          ⚙️ Status
        </button>
      </div>

      <div className="test-content">
        {activeTab === 'generate' && (
          <div className="generate-tab">
            <div className="form-group">
              <label>Prompt:</label>
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Describe the image you want to generate..."
                rows={3}
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Aspect Ratio:</label>
                <select value={aspectRatio} onChange={(e) => setAspectRatio(e.target.value as any)}>
                  <option value="1:1">1:1 (Square)</option>
                  <option value="16:9">16:9 (Widescreen)</option>
                  <option value="9:16">9:16 (Portrait)</option>
                  <option value="4:3">4:3 (Standard)</option>
                  <option value="3:4">3:4 (Portrait)</option>
                </select>
              </div>

              <div className="form-group">
                <label>Style:</label>
                <select value={style} onChange={(e) => setStyle(e.target.value as any)}>
                  <option value="digital-art">Digital Art</option>
                  <option value="photographic">Photographic</option>
                  <option value="illustration">Illustration</option>
                  <option value="anime">Anime</option>
                  <option value="concept-art">Concept Art</option>
                </select>
              </div>
            </div>

            <div className="form-group">
              <label>Provider (Optional):</label>
              <select value={selectedProvider} onChange={(e) => setSelectedProvider(e.target.value)}>
                <option value="">Auto (Best Available)</option>
                <option value="google-imagen">Google Imagen</option>
                <option value="dall-e">OpenAI DALL-E</option>
                <option value="stable-diffusion">Stable Diffusion</option>
              </select>
            </div>

            <button 
              className="generate-btn" 
              onClick={generateImage} 
              disabled={loading || !prompt.trim()}
            >
              {loading ? '🔄 Generating...' : '🎨 Generate Image'}
            </button>
          </div>
        )}

        {activeTab === 'entity' && (
          <div className="entity-tab">
            <div className="form-row">
              <div className="form-group">
                <label>Entity Type:</label>
                <select value={entityType} onChange={(e) => setEntityType(e.target.value as any)}>
                  <option value="planet">🌍 Planet</option>
                  <option value="character">👤 Character</option>
                  <option value="species">👽 Species</option>
                  <option value="civilization">🏛️ Civilization</option>
                  <option value="city">🌆 City</option>
                  <option value="logo">🎯 Logo</option>
                </select>
              </div>

              <div className="form-group">
                <label>Entity Name:</label>
                <input
                  type="text"
                  value={entityName}
                  onChange={(e) => setEntityName(e.target.value)}
                  placeholder="Name of the entity..."
                />
              </div>
            </div>

            <div className="form-group">
              <label>Description:</label>
              <textarea
                value={entityDescription}
                onChange={(e) => setEntityDescription(e.target.value)}
                placeholder="Detailed description of the entity..."
                rows={3}
              />
            </div>

            <div className="form-group">
              <label>Style:</label>
              <select value={style} onChange={(e) => setStyle(e.target.value as any)}>
                <option value="digital-art">Digital Art</option>
                <option value="concept-art">Concept Art</option>
                <option value="photographic">Photographic</option>
                <option value="illustration">Illustration</option>
              </select>
            </div>

            <button 
              className="generate-btn" 
              onClick={generateEntityImage} 
              disabled={loading || !entityName.trim() || !entityDescription.trim()}
            >
              {loading ? '🔄 Generating...' : `🎨 Generate ${entityType}`}
            </button>
          </div>
        )}

        {activeTab === 'variations' && (
          <div className="variations-tab">
            <div className="form-group">
              <label>Base Prompt:</label>
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Base prompt for variations..."
                rows={2}
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Number of Variations:</label>
                <select value={variationCount} onChange={(e) => setVariationCount(Number(e.target.value))}>
                  <option value={2}>2 Variations</option>
                  <option value={3}>3 Variations</option>
                  <option value={4}>4 Variations</option>
                  <option value={5}>5 Variations</option>
                </select>
              </div>

              <div className="form-group">
                <label>Style:</label>
                <select value={style} onChange={(e) => setStyle(e.target.value as any)}>
                  <option value="digital-art">Digital Art</option>
                  <option value="concept-art">Concept Art</option>
                  <option value="illustration">Illustration</option>
                  <option value="photographic">Photographic</option>
                </select>
              </div>
            </div>

            <button 
              className="generate-btn" 
              onClick={generateVariations} 
              disabled={loading || !prompt.trim()}
            >
              {loading ? '🔄 Generating...' : `🎨 Generate ${variationCount} Variations`}
            </button>

            {variations.length > 0 && (
              <div className="variations-grid">
                {variations.map((variation, index) => (
                  <div key={index} className="variation-item">
                    <h4>Variation {index + 1}</h4>
                    {variation.success ? (
                      <div className="image-result">
                        <img src={variation.imageUrl} alt={`Variation ${index + 1}`} />
                        {variation.metadata && (
                          <div className="image-metadata">
                            <p><strong>Model:</strong> {variation.metadata.model}</p>
                            <p><strong>Style:</strong> {variation.metadata.style}</p>
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="error-result">
                        <p>❌ Error: {variation.error}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'status' && (
          <div className="status-tab">
            <div className="status-actions">
              <button onClick={checkStatus} className="status-btn">
                🔄 Refresh Status
              </button>
              <button onClick={runTest} className="test-btn" disabled={loading}>
                {loading ? '🔄 Testing...' : '🧪 Run Test'}
              </button>
            </div>

            {status && (
              <div className="status-info">
                <h3>Service Status</h3>
                <div className="status-grid">
                  <div className="status-item">
                    <span className="status-label">Service:</span>
                    <span className="status-value">{status.service}</span>
                  </div>
                  <div className="status-item">
                    <span className="status-label">Total Providers:</span>
                    <span className="status-value">{status.registry?.totalProviders || 0}</span>
                  </div>
                  <div className="status-item">
                    <span className="status-label">Primary Provider:</span>
                    <span className="status-value">{status.registry?.primaryProvider || 'None'}</span>
                  </div>
                  <div className="status-item">
                    <span className="status-label">Load Balancing:</span>
                    <span className={`status-value ${status.registry?.loadBalancingEnabled ? 'success' : 'error'}`}>
                      {status.registry?.loadBalancingEnabled ? '✅ Enabled' : '❌ Disabled'}
                    </span>
                  </div>
                </div>

                {status.providers && Object.keys(status.providers).length > 0 && (
                  <div className="providers-info">
                    <h4>Available Providers:</h4>
                    {Object.entries(status.providers).map(([name, provider]) => (
                      <div key={name} className="provider-item">
                        <h5>{name}</h5>
                        <div className="provider-details">
                          <div className="provider-detail">
                            <span>Available:</span>
                            <span className={`status-value ${provider.isAvailable ? 'success' : 'error'}`}>
                              {provider.isAvailable ? '✅ Yes' : '❌ No'}
                            </span>
                          </div>
                          <div className="provider-detail">
                            <span>Configured:</span>
                            <span className={`status-value ${provider.isConfigured ? 'success' : 'error'}`}>
                              {provider.isConfigured ? '✅ Yes' : '❌ No'}
                            </span>
                          </div>
                          <div className="provider-detail">
                            <span>API Key:</span>
                            <span className={`status-value ${provider.apiKeyPresent ? 'success' : 'error'}`}>
                              {provider.apiKeyPresent ? '✅ Present' : '❌ Missing'}
                            </span>
                          </div>
                          <div className="provider-detail">
                            <span>Model:</span>
                            <span className="status-value">{provider.model}</span>
                          </div>
                          {provider.version && (
                            <div className="provider-detail">
                              <span>Version:</span>
                              <span className="status-value">{provider.version}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {status.endpoints && status.endpoints.length > 0 && (
                  <div className="endpoints-info">
                    <h4>Available Endpoints:</h4>
                    <ul>
                      {status.endpoints.map((endpoint, index) => (
                        <li key={index}><code>{endpoint}</code></li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Results Section */}
      {result && (
        <div className="result-section">
          <h3>Generation Result</h3>
          {result.success ? (
            <div className="success-result">
              <div className="image-container">
                <img src={result.imageUrl} alt="Generated image" />
              </div>
              {result.metadata && (
                <div className="result-metadata">
                  <h4>Metadata</h4>
                  <div className="metadata-grid">
                    <div><strong>Prompt:</strong> {result.metadata.prompt}</div>
                    <div><strong>Model:</strong> {result.metadata.model}</div>
                    <div><strong>Style:</strong> {result.metadata.style}</div>
                    <div><strong>Aspect Ratio:</strong> {result.metadata.aspectRatio}</div>
                    <div><strong>Generated:</strong> {new Date(result.metadata.timestamp).toLocaleString()}</div>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="error-result">
              <p>❌ <strong>Error:</strong> {result.error}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
