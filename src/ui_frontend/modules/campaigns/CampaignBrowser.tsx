import React, { useEffect, useState } from 'react'

type Campaign = {
  id: string
  title: string
  description?: string
  createdAt: string
  archived?: boolean
}

type Schedule = {
  id: string
  campaignId: string
  title: string
  startsAt: string
  durationMin: number
  rrule?: string
}

export function CampaignBrowser() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([])
  const [title, setTitle] = useState('')
  const [selected, setSelected] = useState<Campaign | null>(null)
  const [schedules, setSchedules] = useState<Schedule[]>([])

  const loadCampaigns = async () => {
    const resp = await fetch('http://localhost:4000/api/campaigns')
    setCampaigns(await resp.json())
  }
  const loadSchedules = async (campaignId: string) => {
    const resp = await fetch(`http://localhost:4000/api/schedules?campaignId=${campaignId}`)
    setSchedules(await resp.json())
  }

  useEffect(() => {
    loadCampaigns()
  }, [])

  useEffect(() => {
    if (selected) loadSchedules(selected.id)
    else setSchedules([])
  }, [selected?.id])

  const createCampaign = async () => {
    const resp = await fetch('http://localhost:4000/api/campaigns', {
      method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ title })
    })
    if (resp.ok) { setTitle(''); await loadCampaigns() }
  }

  const createSchedule = async (form: { title: string, startsAt: string, durationMin: number, rrule?: string }) => {
    if (!selected) return
    const resp = await fetch('http://localhost:4000/api/schedules', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ campaignId: selected.id, ...form })
    })
    if (resp.ok) await loadSchedules(selected.id)
  }

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: 16, padding: 16 }}>
      <section>
        <h2>Campaigns</h2>
        <div>
          <input placeholder="New campaign title" value={title} onChange={e => setTitle(e.target.value)} />
          <button onClick={createCampaign} disabled={!title.trim()}>Create</button>
        </div>
        <ul>
          {campaigns.map(c => (
            <li key={c.id}>
              <button onClick={() => setSelected(c)} style={{ fontWeight: selected?.id === c.id ? 'bold' : undefined }}>
                {c.title}
              </button>
            </li>
          ))}
        </ul>
      </section>
      <section>
        <h2>Campaign Details</h2>
        {selected ? (
          <div>
            <h3>{selected.title}</h3>
            <ScheduleEditor onSubmit={createSchedule} />
            <h4>Upcoming Sessions</h4>
            <ul>
              {schedules.map(s => (
                <li key={s.id}>{new Date(s.startsAt).toLocaleString()} — {s.title} ({s.durationMin}m){s.rrule ? ` [${s.rrule}]` : ''}</li>
              ))}
            </ul>
          </div>
        ) : <div>Select a campaign</div>}
      </section>
    </div>
  )
}

function ScheduleEditor({ onSubmit }: { onSubmit: (s: { title: string, startsAt: string, durationMin: number, rrule?: string }) => void }) {
  const [title, setTitle] = useState('Session')
  const [startsAt, setStartsAt] = useState<string>(new Date(Date.now() + 3600_000).toISOString().slice(0, 16))
  const [duration, setDuration] = useState(120)
  const [rrule, setRrule] = useState('')

  return (
    <div style={{ display: 'grid', gap: 8, maxWidth: 480 }}>
      <h4>Schedule Session</h4>
      <label>Title <input value={title} onChange={e => setTitle(e.target.value)} /></label>
      <label>Start <input type="datetime-local" value={startsAt} onChange={e => setStartsAt(e.target.value)} /></label>
      <label>Duration (min) <input type="number" value={duration} onChange={e => setDuration(parseInt(e.target.value || '0', 10))} /></label>
      <label>RRULE (optional) <input value={rrule} onChange={e => setRrule(e.target.value)} placeholder="FREQ=WEEKLY;BYDAY=FR" /></label>
      <button onClick={() => onSubmit({ title, startsAt: toIso(startsAt), durationMin: duration, rrule: rrule || undefined })}>Add</button>
    </div>
  )
}

function toIso(local: string) {
  // local datetime-local → ISO
  const dt = new Date(local)
  return new Date(dt.getTime() - dt.getTimezoneOffset() * 60000).toISOString()
}


