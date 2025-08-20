import React, { useState, useEffect } from 'react';

// Types for the provider configuration
interface ProviderInfo {
  id: string;
  name: string;
  type: string;
  description?: string;
  isActive: boolean;
  successCount: number;
  errorCount: number;
  lastUsed?: string;
  configSchema?: ProviderConfigSchema;
  currentConfig?: Record<string, any>;
}

interface ProviderConfigSchema {
  type: string;
  required: string[];
  optional: string[];
  fields: Record<string, FieldSchema>;
}

interface FieldSchema {
  type: 'string' | 'number' | 'boolean' | 'select' | 'secret';
  description?: string;
  options?: string[];
  placeholder?: string;
  validation?: {
    pattern?: string;
    min?: number;
    max?: number;
  };
}

interface ProvidersResponse {
  providers: Record<string, ProviderInfo[]>;
  stats: Record<string, any>;
  config: {
    providers: Record<string, {
      default?: string;
      perCampaign?: Record<string, string>;
      perSession?: Record<string, string>;
    }>;
    providerConfigs: Record<string, any>;
  };
}

interface ConfigScope {
  type: 'global' | 'campaign' | 'session';
  id?: string;
}

interface ProvidersPageProps {
  onBack: () => void;
}

export function ProvidersPage({ onBack }: ProvidersPageProps) {
  const [providers, setProviders] = useState<ProvidersResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedType, setSelectedType] = useState<string>('llm');
  const [selectedProvider, setSelectedProvider] = useState<string | null>(null);
  const [configScope, setConfigScope] = useState<ConfigScope>({ type: 'global' });
  const [testResults, setTestResults] = useState<Record<string, { success: boolean; message: string }>>({});
  const [configForm, setConfigForm] = useState<Record<string, any>>({});
  const [saving, setSaving] = useState(false);

  // Load providers and configuration
  async function loadProviders() {
    try {
      setLoading(true);
      const response = await fetch('/api/providers');
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      const data = await response.json();
      
      // Load configuration schemas for each provider
      const providersWithSchemas = { ...data };
      for (const [type, providerList] of Object.entries(data.providers)) {
        for (let i = 0; i < (providerList as ProviderInfo[]).length; i++) {
          const provider = (providerList as ProviderInfo[])[i];
          try {
            const schemaResponse = await fetch(`/api/providers/${type}/${provider.id}/schema`);
            if (schemaResponse.ok) {
              const schema = await schemaResponse.json();
              (providersWithSchemas.providers[type] as ProviderInfo[])[i].configSchema = schema;
            }
          } catch (err) {
            console.warn(`Failed to load schema for ${type}:${provider.id}:`, err);
          }
        }
      }
      
      setProviders(providersWithSchemas);
      setError(null);
    } catch (err) {
      setError((err as Error).message);
      console.error('Failed to load providers:', err);
    } finally {
      setLoading(false);
    }
  }

  // Test provider connection
  async function testProvider(type: string, id: string) {
    try {
      const response = await fetch(`/api/providers/${type}/${id}/test`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({})
      });
      const result = await response.json();
      setTestResults(prev => ({
        ...prev,
        [`${type}:${id}`]: {
          success: result.success,
          message: result.message || (result.success ? 'Connection successful' : 'Connection failed')
        }
      }));
    } catch (err) {
      setTestResults(prev => ({
        ...prev,
        [`${type}:${id}`]: {
          success: false,
          message: (err as Error).message
        }
      }));
    }
  }

  // Save provider configuration
  async function saveConfiguration() {
    if (!selectedProvider || !providers) return;

    try {
      setSaving(true);
      
      // Prepare configuration update
      const currentConfig = providers.config;
      const newConfig = { ...currentConfig };

      // Update provider selection based on scope
      if (!newConfig.providers[selectedType]) {
        newConfig.providers[selectedType] = {};
      }

      if (configScope.type === 'global') {
        newConfig.providers[selectedType].default = selectedProvider;
      } else if (configScope.type === 'campaign' && configScope.id) {
        if (!newConfig.providers[selectedType].perCampaign) {
          newConfig.providers[selectedType].perCampaign = {};
        }
        newConfig.providers[selectedType].perCampaign[configScope.id] = selectedProvider;
      } else if (configScope.type === 'session' && configScope.id) {
        if (!newConfig.providers[selectedType].perSession) {
          newConfig.providers[selectedType].perSession = {};
        }
        newConfig.providers[selectedType].perSession[configScope.id] = selectedProvider;
      }

      // Update provider configuration with secret references
      if (Object.keys(configForm).length > 0) {
        if (!newConfig.providerConfigs) {
          newConfig.providerConfigs = {};
        }
        
        // Convert sensitive fields to secret references
        const processedConfig = { ...configForm };
        Object.entries(configForm).forEach(([key, value]) => {
          if (key.toLowerCase().includes('key') || key.toLowerCase().includes('secret') || key.toLowerCase().includes('token')) {
            if (value && typeof value === 'string' && !value.startsWith('secret://')) {
              processedConfig[`${key}Ref`] = `secret://${selectedProvider}/${key}`;
              delete processedConfig[key];
            }
          }
        });

        newConfig.providerConfigs[selectedProvider] = {
          ...newConfig.providerConfigs[selectedProvider],
          ...processedConfig
        };
      }

      // Send configuration update
      const response = await fetch('/api/providers/config', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newConfig)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to save configuration');
      }

      // Reload providers to reflect changes
      await loadProviders();
      setConfigForm({});
      alert('Configuration saved successfully!');
    } catch (err) {
      alert(`Failed to save configuration: ${(err as Error).message}`);
    } finally {
      setSaving(false);
    }
  }

  // Handle form field changes
  function handleConfigChange(field: string, value: any) {
    setConfigForm(prev => ({
      ...prev,
      [field]: value
    }));
  }

  useEffect(() => {
    loadProviders();
  }, []);

  if (loading) {
    return (
      <div style={{ fontFamily: 'system-ui,Segoe UI,Arial', margin: 24 }}>
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: 24 }}>
          <button onClick={onBack} style={{ marginRight: 16, padding: '8px 16px' }}>← Back</button>
          <h1>Provider Settings</h1>
        </div>
        <div>Loading providers...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ fontFamily: 'system-ui,Segoe UI,Arial', margin: 24 }}>
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: 24 }}>
          <button onClick={onBack} style={{ marginRight: 16, padding: '8px 16px' }}>← Back</button>
          <h1>Provider Settings</h1>
        </div>
        <div style={{ color: 'red', marginBottom: 16 }}>Error: {error}</div>
        <button onClick={loadProviders}>Retry</button>
      </div>
    );
  }

  const adapterTypes = Object.keys(providers?.providers || {});
  const currentProviders = providers?.providers[selectedType] || [];
  const selectedProviderInfo = currentProviders.find(p => p.id === selectedProvider);

  return (
    <div style={{ fontFamily: 'system-ui,Segoe UI,Arial', margin: 24 }}>
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: 24 }}>
        <button onClick={onBack} style={{ marginRight: 16, padding: '8px 16px' }}>← Back</button>
        <h1>Provider Settings</h1>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '300px 1fr', gap: 24 }}>
        {/* Left Panel - Provider Selection */}
        <div>
          {/* Adapter Type Selector */}
          <div style={{ marginBottom: 24 }}>
            <label style={{ display: 'block', marginBottom: 8, fontWeight: 'bold' }}>Adapter Type:</label>
            <select 
              value={selectedType} 
              onChange={e => {
                setSelectedType(e.target.value);
                setSelectedProvider(null);
                setConfigForm({});
              }}
              style={{ padding: '8px 12px', fontSize: 14, width: '100%' }}
            >
              {adapterTypes.map(type => (
                <option key={type} value={type}>{type.toUpperCase()}</option>
              ))}
            </select>
          </div>

          {/* Configuration Scope */}
          <div style={{ marginBottom: 24 }}>
            <label style={{ display: 'block', marginBottom: 8, fontWeight: 'bold' }}>Configuration Scope:</label>
            <select 
              value={configScope.type} 
              onChange={e => setConfigScope({ type: e.target.value as any })}
              style={{ padding: '8px 12px', fontSize: 14, width: '100%', marginBottom: 8 }}
            >
              <option value="global">Global (Default)</option>
              <option value="campaign">Per Campaign</option>
              <option value="session">Per Session</option>
            </select>
            
            {(configScope.type === 'campaign' || configScope.type === 'session') && (
              <input
                type="text"
                placeholder={`Enter ${configScope.type} ID`}
                value={configScope.id || ''}
                onChange={e => setConfigScope(prev => ({ ...prev, id: e.target.value }))}
                style={{ padding: '8px 12px', fontSize: 14, width: '100%' }}
              />
            )}
          </div>

          {/* Provider List */}
          <div>
            <h3>Available Providers</h3>
            {currentProviders.length === 0 ? (
              <div style={{ color: '#666', fontStyle: 'italic' }}>No providers registered for {selectedType}</div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {currentProviders.map(provider => {
                  const testKey = `${selectedType}:${provider.id}`;
                  const testResult = testResults[testKey];
                  const isSelected = selectedProvider === provider.id;
                  
                  return (
                    <div 
                      key={provider.id}
                      onClick={() => {
                        setSelectedProvider(provider.id);
                        setConfigForm(provider.currentConfig || {});
                      }}
                      style={{ 
                        border: `2px solid ${isSelected ? '#2196f3' : '#ddd'}`, 
                        borderRadius: 8, 
                        padding: 12,
                        backgroundColor: provider.isActive ? '#f0f8ff' : '#fff',
                        cursor: 'pointer',
                        transition: 'all 0.2s'
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div>
                          <div style={{ fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: 8 }}>
                            {provider.name}
                            {provider.isActive && (
                              <span style={{ 
                                background: '#4caf50', 
                                color: 'white', 
                                padding: '2px 6px', 
                                borderRadius: 10, 
                                fontSize: 10 
                              }}>
                                ACTIVE
                              </span>
                            )}
                          </div>
                          <div style={{ fontSize: 11, color: '#666' }}>ID: {provider.id}</div>
                        </div>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            testProvider(selectedType, provider.id);
                          }}
                          style={{ 
                            padding: '4px 8px', 
                            background: '#2196f3', 
                            color: 'white', 
                            border: 'none', 
                            borderRadius: 4,
                            cursor: 'pointer',
                            fontSize: 10
                          }}
                        >
                          Test
                        </button>
                      </div>

                      {testResult && (
                        <div style={{ 
                          padding: 6, 
                          borderRadius: 4, 
                          backgroundColor: testResult.success ? '#d4edda' : '#f8d7da',
                          color: testResult.success ? '#155724' : '#721c24',
                          fontSize: 10,
                          marginTop: 6
                        }}>
                          {testResult.success ? '✓' : '✗'} {testResult.message}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Right Panel - Configuration Form */}
        <div>
          {selectedProviderInfo ? (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
                <h2>Configure {selectedProviderInfo.name}</h2>
                <button
                  onClick={saveConfiguration}
                  disabled={saving}
                  style={{ 
                    padding: '12px 24px', 
                    background: saving ? '#ccc' : '#4caf50', 
                    color: 'white', 
                    border: 'none', 
                    borderRadius: 6,
                    cursor: saving ? 'not-allowed' : 'pointer',
                    fontSize: 14,
                    fontWeight: 'bold'
                  }}
                >
                  {saving ? 'Saving...' : 'Save Configuration'}
                </button>
              </div>

              {selectedProviderInfo.description && (
                <div style={{ 
                  padding: 16, 
                  backgroundColor: '#f5f5f5', 
                  borderRadius: 8, 
                  marginBottom: 24,
                  fontSize: 14,
                  color: '#666'
                }}>
                  {selectedProviderInfo.description}
                </div>
              )}

              {/* Configuration Form */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                {selectedProviderInfo.configSchema ? (
                  // Dynamic form based on schema
                  Object.entries(selectedProviderInfo.configSchema.fields).map(([fieldName, fieldSchema]) => (
                    <div key={fieldName}>
                      <label style={{ display: 'block', marginBottom: 6, fontWeight: 'bold' }}>
                        {fieldName}
                        {selectedProviderInfo.configSchema!.required.includes(fieldName) && (
                          <span style={{ color: 'red' }}> *</span>
                        )}
                      </label>
                      
                      {fieldSchema.description && (
                        <div style={{ fontSize: 12, color: '#666', marginBottom: 6 }}>
                          {fieldSchema.description}
                        </div>
                      )}

                      {fieldSchema.type === 'select' ? (
                        <select
                          value={configForm[fieldName] || ''}
                          onChange={e => handleConfigChange(fieldName, e.target.value)}
                          style={{ padding: '8px 12px', fontSize: 14, width: '100%' }}
                        >
                          <option value="">Select...</option>
                          {fieldSchema.options?.map(option => (
                            <option key={option} value={option}>{option}</option>
                          ))}
                        </select>
                      ) : fieldSchema.type === 'boolean' ? (
                        <label style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                          <input
                            type="checkbox"
                            checked={configForm[fieldName] || false}
                            onChange={e => handleConfigChange(fieldName, e.target.checked)}
                          />
                          Enable
                        </label>
                      ) : fieldSchema.type === 'secret' ? (
                        <div>
                          <input
                            type="password"
                            placeholder={fieldSchema.placeholder || `Enter ${fieldName}`}
                            value={configForm[fieldName] || ''}
                            onChange={e => handleConfigChange(fieldName, e.target.value)}
                            style={{ padding: '8px 12px', fontSize: 14, width: '100%' }}
                          />
                          <div style={{ fontSize: 11, color: '#666', marginTop: 4 }}>
                            This will be stored as a secure reference (secret://)
                          </div>
                        </div>
                      ) : (
                        <input
                          type={fieldSchema.type === 'number' ? 'number' : 'text'}
                          placeholder={fieldSchema.placeholder || `Enter ${fieldName}`}
                          value={configForm[fieldName] || ''}
                          onChange={e => handleConfigChange(fieldName, fieldSchema.type === 'number' ? Number(e.target.value) : e.target.value)}
                          style={{ padding: '8px 12px', fontSize: 14, width: '100%' }}
                          min={fieldSchema.validation?.min}
                          max={fieldSchema.validation?.max}
                        />
                      )}
                    </div>
                  ))
                ) : (
                  // Fallback form for providers without schema
                  <div>
                    <div style={{ color: '#666', fontStyle: 'italic', marginBottom: 16 }}>
                      No configuration schema available for this provider. 
                      You can still switch to it using the provider list.
                    </div>
                  </div>
                )}
              </div>

              {/* Current Configuration Display */}
              {providers?.config && (
                <div style={{ marginTop: 32, padding: 16, backgroundColor: '#f5f5f5', borderRadius: 8 }}>
                  <h3>Current Configuration</h3>
                  <div style={{ fontSize: 12, fontFamily: 'monospace' }}>
                    <div><strong>Default {selectedType} provider:</strong> {providers.config.providers[selectedType]?.default || 'None'}</div>
                    {providers.config.providers[selectedType]?.perCampaign && Object.keys(providers.config.providers[selectedType].perCampaign).length > 0 && (
                      <div style={{ marginTop: 8 }}>
                        <strong>Campaign overrides:</strong>
                        <ul style={{ margin: '4px 0', paddingLeft: 20 }}>
                          {Object.entries(providers.config.providers[selectedType].perCampaign).map(([campaignId, providerId]) => (
                            <li key={campaignId}>{campaignId}: {providerId}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                    {providers.config.providers[selectedType]?.perSession && Object.keys(providers.config.providers[selectedType].perSession).length > 0 && (
                      <div style={{ marginTop: 8 }}>
                        <strong>Session overrides:</strong>
                        <ul style={{ margin: '4px 0', paddingLeft: 20 }}>
                          {Object.entries(providers.config.providers[selectedType].perSession).map(([sessionId, providerId]) => (
                            <li key={sessionId}>{sessionId}: {providerId}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center', 
              height: 200, 
              color: '#666',
              fontSize: 16
            }}>
              Select a provider from the list to configure it
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
