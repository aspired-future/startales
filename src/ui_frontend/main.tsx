import React from 'react'
import { createRoot } from 'react-dom/client'

function App() {
  const [mode, setMode] = React.useState<'outcome'|'classic'>('outcome')
  const [clock, setClock] = React.useState(0)
  const [success, setSuccess] = React.useState(0)

  async function load() {
    const s = await fetch('/api/settings').then(r=>r.json())
    setMode(s.resolutionMode)
  }
  React.useEffect(() => { load() }, [])

  async function save() {
    await fetch('/api/settings', { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ resolutionMode: mode }) })
  }
  async function tick() {
    await fetch('/api/encounter/start', { method:'POST' })
    const r = await fetch('/api/encounter/tick', { method:'POST' }).then(r=>r.json())
    setClock(r.clock)
  }
  async function preview() {
    const body = { dc: 12, attribute: 3, skill: 2, modifiers: 1, momentum: 1, attempts: 0 }
    const r = await fetch('/api/outcome/preview', { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify(body) }).then(r=>r.json())
    setSuccess(Math.round(r.chance.success*100))
  }

  return (
    <div style={{ fontFamily: 'system-ui,Segoe UI,Arial', margin: 24 }}>
      <h1>Startales HUD</h1>
      <div style={{ margin: '12px 0' }}>
        <label>Resolution Mode </label>
        <select value={mode} onChange={e=>setMode(e.target.value as any)}>
          <option value="outcome">Outcome</option>
          <option value="classic">Classic</option>
        </select>
        <button onClick={save} style={{ marginLeft: 8 }}>Save</button>
      </div>
      <div style={{ margin: '12px 0' }}>
        <button onClick={tick}>Encounter Tick</button>
        <div style={{ width: 320, height: 16, background: '#eee', borderRadius: 8 }}>
          <div style={{ width: `${clock}%`, height: 16, background: '#4caf50' }} />
        </div>
      </div>
      <div style={{ margin: '12px 0' }}>
        <button onClick={preview}>Preview Outcome</button>
        <div style={{ width: 320, height: 16, background: '#eee', borderRadius: 8 }}>
          <div style={{ width: `${success}%`, height: 16, background: '#2196f3' }} />
        </div>
      </div>
    </div>
  )
}

createRoot(document.getElementById('root')!).render(<App />)


