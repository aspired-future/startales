import React from 'react'
import { createRoot } from 'react-dom/client'
import { ProvidersPage } from './components/ProvidersPage'
import SimpleGameHUD from './components/GameHUD/SimpleGameHUD'
import { GameHUD } from './components/GameHUD/GameHUD'
import { ComprehensiveHUD } from './components/GameHUD/ComprehensiveHUD'
import { LiveGameHUD } from './components/GameHUD/LiveGameHUD'
import ModernWitterFeed from './components/Witter/ModernWitterFeed'
import ApprovalDashboard from './components/ApprovalRating/ApprovalDashboard'
import { TestComponent } from './TestComponent'
import { ImagenTest } from './components/ImagenTest'

// Types for provider configuration
interface AdapterInfo {
  id: string
  type: string
  name: string
  description?: string
  isActive: boolean
  errorCount: number
  successCount: number
  lastUsed?: string
}

interface ProviderConfig {
  apiKeyRef?: string
  baseUrl?: string
  host?: string
  timeout?: number
  [key: string]: any
}

interface ProvidersResponse {
  providers: Record<string, AdapterInfo[]>
  stats: Record<string, any>
  config: {
    providers: Record<string, any>
    providerConfigs: Record<string, ProviderConfig>
  }
}

// The ProvidersPage component is now imported from ./components/ProvidersPage

function App() {
  const [currentPage, setCurrentPage] = React.useState<'witter'|'providers'|'approval'|'gamehud'|'comprehensive'|'livehud'|'test'|'imagen'>('comprehensive')
  const [mode, setMode] = React.useState<'outcome'|'classic'>('outcome')
  const [clock, setClock] = React.useState(0)
  const [success, setSuccess] = React.useState(0)

  async function load() {
    try {
      const s = await fetch('/api/settings').then(r=>r.json())
      setMode(s.resolutionMode)
    } catch (err) {
      console.log('Settings API not available, using defaults')
    }
  }
  React.useEffect(() => { load() }, [])

  async function save() {
    try {
      await fetch('/api/settings', { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ resolutionMode: mode }) })
    } catch (err) {
      console.log('Settings API not available')
    }
  }
  async function tick() {
    try {
      await fetch('/api/encounter/start', { method:'POST' })
      const r = await fetch('/api/encounter/tick', { method:'POST' }).then(r=>r.json())
      setClock(r.clock)
    } catch (err) {
      console.log('Encounter API not available')
    }
  }
  async function preview() {
    try {
      const body = { dc: 12, attribute: 3, skill: 2, modifiers: 1, momentum: 1, attempts: 0 }
      const r = await fetch('/api/outcome/preview', { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify(body) }).then(r=>r.json())
      setSuccess(Math.round(r.chance.success*100))
    } catch (err) {
      console.log('Outcome API not available')
    }
  }

  if (currentPage === 'test') {
    return <TestComponent />
  }

  if (currentPage === 'imagen') {
    return <ImagenTest />
  }

  if (currentPage === 'providers') {
    return <ProvidersPage onBack={() => setCurrentPage('witter')} />
  }

    if (currentPage === 'comprehensive') {
    return (
      <div style={{ height: '100vh', background: '#0f0f23' }}>
        <div style={{ position: 'absolute', top: '10px', right: '10px', zIndex: 1000 }}>
          <button
            onClick={() => setCurrentPage('imagen')}
            style={{
              padding: '8px 16px',
              background: '#8b5cf6',
              color: 'white',
              border: 'none',
              borderRadius: 4,
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: '600'
            }}
          >
            🎨 Imagen Test
          </button>
        </div>
        <ComprehensiveHUD
          playerId="Commander_Alpha"
          gameContext={{
            currentLocation: 'Sol System',
            currentActivity: 'Managing Galactic Civilization',
            recentEvents: ['Ancient artifact discovered', 'Economic boom in manufacturing', 'Diplomatic tension with Vega Federation']
          }}
        />
      </div>
    )
  }

  if (currentPage === 'livehud') {
    return (
      <div style={{ height: '100vh', background: '#0f0f23' }}>
        <div style={{ padding: '20px', background: '#1a1a2e', borderBottom: '1px solid #4ecdc4', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <span style={{ color: '#22c55e', fontSize: '24px', fontWeight: 'bold' }}>
              🎯 StarTales Live HUD
            </span>
            <div style={{ color: '#888', fontSize: '14px', marginTop: '4px' }}>
              Real-time HUD with Live Missions API integration
            </div>
          </div>
          <div style={{ display: 'flex', gap: '10px' }}>
            <button
              onClick={() => setCurrentPage('comprehensive')}
              style={{
                padding: '8px 16px',
                background: '#4ecdc4',
                color: '#0f0f23',
                border: 'none',
                borderRadius: 4,
                cursor: 'pointer'
              }}
            >
              🌌 Comprehensive HUD
            </button>
            <button
              onClick={() => setCurrentPage('gamehud')}
              style={{
                padding: '8px 16px',
                background: '#6366f1',
                color: 'white',
                border: 'none',
                borderRadius: 4,
                cursor: 'pointer'
              }}
            >
              🌌 Basic HUD
            </button>
            <button
              onClick={() => setCurrentPage('witter')}
              style={{
                padding: '8px 16px',
                background: '#9c27b0',
                color: 'white',
                border: 'none',
                borderRadius: 4,
                cursor: 'pointer'
              }}
            >
              📱 Witter
            </button>
            <button
              onClick={() => setCurrentPage('imagen')}
              style={{
                padding: '8px 16px',
                background: '#8b5cf6',
                color: 'white',
                border: 'none',
                borderRadius: 4,
                cursor: 'pointer'
              }}
            >
              🎨 Imagen Test
            </button>
          </div>
        </div>
        <LiveGameHUD
          playerId="Commander_Alpha"
          campaignId="default_campaign"
        />
      </div>
    )
  }

  if (currentPage === 'gamehud') {
    return (
      <div style={{ height: '100vh', background: '#0f0f23' }}>
        <div style={{ padding: '20px', background: '#1a1a2e', borderBottom: '1px solid #4ecdc4', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <span style={{ color: '#4ecdc4', fontSize: '24px', fontWeight: 'bold' }}>
              🌌 StarTales Game HUD
            </span>
            <div style={{ color: '#888', fontSize: '14px', marginTop: '4px' }}>
              Complete galactic civilization management interface with Trade & Economics
            </div>
          </div>
          <div style={{ display: 'flex', gap: '10px' }}>
            <button
              onClick={() => setCurrentPage('comprehensive')}
              style={{
                padding: '8px 16px',
                background: '#4ecdc4',
                color: '#0f0f23',
                border: 'none',
                borderRadius: 4,
                cursor: 'pointer',
                fontWeight: 'bold'
              }}
            >
              🌌 Comprehensive HUD
            </button>
            <button
              onClick={() => setCurrentPage('witter')}
              style={{
                padding: '8px 16px',
                background: '#9c27b0',
                color: 'white',
                border: 'none',
                borderRadius: 4,
                cursor: 'pointer'
              }}
            >
              📱 Witter
            </button>
            <button
              onClick={() => setCurrentPage('approval')}
              style={{
                padding: '8px 16px',
                background: '#ff9800',
                color: 'white',
                border: 'none',
                borderRadius: 4,
                cursor: 'pointer'
              }}
            >
              📊 Approval
            </button>
            <button
              onClick={() => setCurrentPage('providers')}
              style={{
                padding: '8px 16px',
                background: '#2196f3',
                color: 'white',
                border: 'none',
                borderRadius: 4,
                cursor: 'pointer'
              }}
            >
              ⚙️ Settings
            </button>
          </div>
        </div>
        <GameHUD
          playerId="Commander_Alpha"
          gameContext={{
            currentLocation: 'Sol System',
            currentActivity: 'Managing Trade Routes',
            recentEvents: ['New trade agreement signed', 'Market volatility detected', 'Resource shortage alert']
          }}
        />
      </div>
    )
  }

  if (currentPage === 'approval') {
    return (
      <div style={{ height: '100vh', background: '#0f0f23' }}>
        <div style={{ padding: '20px', background: '#1a1a2e', borderBottom: '1px solid #4ecdc4', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <span style={{ color: '#4ecdc4', fontSize: '24px', fontWeight: 'bold' }}>
              📊 StarTales Approval Dashboard
            </span>
            <div style={{ color: '#888', fontSize: '14px', marginTop: '4px' }}>
              Real-time citizen feedback and approval ratings from across the galaxy
            </div>
          </div>
          <div style={{ display: 'flex', gap: '10px' }}>
            <button 
              onClick={() => setCurrentPage('gamehud')}
              style={{ 
                padding: '8px 16px', 
                background: '#4ecdc4', 
                color: 'black', 
                border: 'none', 
                borderRadius: 4, 
                cursor: 'pointer'
              }}
            >
              🌌 Game HUD
            </button>
            <button 
              onClick={() => setCurrentPage('witter')}
              style={{ 
                padding: '8px 16px', 
                background: '#9c27b0', 
                color: 'white', 
                border: 'none', 
                borderRadius: 4, 
                cursor: 'pointer'
              }}
            >
              📱 Witter
            </button>
            <button 
              onClick={() => setCurrentPage('providers')}
              style={{ 
                padding: '8px 16px', 
                background: '#2196f3', 
                color: 'white', 
                border: 'none', 
                borderRadius: 4, 
                cursor: 'pointer'
              }}
            >
              ⚙️ Settings
            </button>
          </div>
        </div>
        <ApprovalDashboard playerId="Commander_Alpha" />
      </div>
    )
  }

  if (currentPage === 'witter') {
    return (
      <div style={{ height: '100vh', background: '#0f0f23' }}>
        <div style={{ padding: '20px', background: '#1a1a2e', borderBottom: '1px solid #4ecdc4', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <span style={{ color: '#4ecdc4', fontSize: '24px', fontWeight: 'bold' }}>
              🌌 StarTales Witter - AI-Powered Galactic Social Network
            </span>
            <div style={{ color: '#888', fontSize: '14px', marginTop: '4px' }}>
              ✨ Everything is AI-generated: Posts, Comments, Characters, Names, Personalities, Locations!
            </div>
          </div>
          <div style={{ display: 'flex', gap: '10px' }}>
            <button 
              onClick={() => setCurrentPage('gamehud')}
              style={{ 
                padding: '8px 16px', 
                background: '#4ecdc4', 
                color: 'black', 
                border: 'none', 
                borderRadius: 4, 
                cursor: 'pointer'
              }}
            >
              🌌 Game HUD
            </button>
            <button 
              onClick={() => setCurrentPage('approval')}
              style={{ 
                padding: '8px 16px', 
                background: '#ff9800', 
                color: 'white', 
                border: 'none', 
                borderRadius: 4, 
                cursor: 'pointer'
              }}
            >
              📊 Approval
            </button>
            <button 
              onClick={() => setCurrentPage('providers')}
              style={{ 
                padding: '8px 16px', 
                background: '#2196f3', 
                color: 'white', 
                border: 'none', 
                borderRadius: 4, 
                cursor: 'pointer'
              }}
            >
              ⚙️ Settings
            </button>
          </div>
        </div>
        <ModernWitterFeed 
          playerId="Commander_Alpha"
        />
      </div>
    )
  }

  // Default to Witter page
  return (
    <div style={{ height: '100vh', background: '#0f0f23' }}>
      <div style={{ padding: '20px', background: '#1a1a2e', borderBottom: '1px solid #4ecdc4', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <span style={{ color: '#4ecdc4', fontSize: '24px', fontWeight: 'bold' }}>
            🌌 StarTales Witter - AI-Powered Galactic Social Network
          </span>
          <div style={{ color: '#888', fontSize: '14px', marginTop: '4px' }}>
            ✨ Everything is AI-generated: Posts, Comments, Characters, Names, Personalities, Locations!
          </div>
        </div>
        <button 
          onClick={() => setCurrentPage('providers')}
          style={{ 
            padding: '8px 16px', 
            background: '#2196f3', 
            color: 'white', 
            border: 'none', 
            borderRadius: 4, 
            cursor: 'pointer'
          }}
        >
          ⚙️ Settings
        </button>
      </div>
      <ModernWitterFeed 
        playerId="Commander_Alpha"
      />
    </div>
  )
}

console.log('🎭 StarTales: Starting React app...');

const rootElement = document.getElementById('root');
console.log('🎭 StarTales: Root element found:', !!rootElement);

if (rootElement) {
  console.log('🎭 StarTales: Root element has children:', rootElement.hasChildNodes());
  if (!rootElement.hasChildNodes()) {
    console.log('🎭 StarTales: Creating React root and rendering App...');
    const root = createRoot(rootElement);
    root.render(<App />);
    console.log('🎭 StarTales: App rendered successfully!');
  } else {
    console.log('🎭 StarTales: Root already has children, skipping render');
  }
} else {
  console.error('🎭 StarTales: Root element not found!');
}


