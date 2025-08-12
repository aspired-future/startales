import WebSocket from 'ws'

const BASE = process.env.BASE_URL || 'http://localhost:4000'
const WS_URL = BASE.replace('http', 'ws') + '/ws'
const CAMPAIGN = process.env.CAMPAIGN_ID || 'demo'

function waitFor(ms) {
  return new Promise((r) => setTimeout(r, ms))
}

async function main() {
  const ws = new WebSocket(WS_URL)
  let got = null

  const recv = new Promise((resolve, reject) => {
    const to = setTimeout(() => reject(new Error('timeout waiting for caption')), 5000)
    ws.on('open', () => {
      ws.send(JSON.stringify({ type: 'join', campaignId: CAMPAIGN }))
    })
    ws.on('message', (data) => {
      try {
        const msg = JSON.parse(data.toString())
        // Expect server-broadcast envelope
        if (msg?.type === 'server-broadcast' && msg?.campaignId === CAMPAIGN && msg?.payload?.type === 'caption') {
          clearTimeout(to)
          got = msg.payload
          resolve(got)
        }
      } catch {}
    })
  })

  // Give WS a moment to connect
  await waitFor(150)

  // Send 10KB of fake audio to trigger a final STT segment
  const body = Buffer.alloc(10_000, 0)
  const res = await fetch(`${BASE}/api/audio/stt?campaignId=${encodeURIComponent(CAMPAIGN)}`, {
    method: 'POST',
    headers: { 'Content-Type': 'audio/wav' },
    body,
  })
  if (!res.ok) {
    console.error('STT request failed', res.status)
    process.exit(1)
  }

  await recv
  console.log('Received WS caption:', got)
  ws.close()
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})


