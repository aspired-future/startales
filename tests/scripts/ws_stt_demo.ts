import WebSocket from 'ws'

async function run() {
  const ws = new WebSocket('ws://localhost:4000/ws')
  ws.on('message', (data) => {
    console.log('WS:', data.toString())
  })
  ws.on('open', () => {
    ws.send(JSON.stringify({ type: 'join', campaignId: 'demo' }))
  })
}

run()


