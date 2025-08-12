import express from 'express';
import cors from 'cors';
import { campaignsRouter } from './routes/campaigns.js';
import { schedulesRouter } from './routes/schedules.js';
import { audioRouter } from './routes/audio.js';
import { personalitiesRouter } from './routes/personalities.js';
import { outcomeRouter } from './routes/outcome.js';
import { registerProvider, registerSTTProvider, registerTTSProvider } from './llm/factory.js';
import { OllamaProvider } from './llm/providers/ollama.js';
import http from 'http';
import { createGateway } from './ws/gateway.js';
import { wsHub } from './ws/hub.js';
import { WhisperSTTProvider } from './llm/providers/whisper.js';
import { XTTSProvider } from './llm/providers/xtts.js';
import { demoRouter } from './routes/demo.js';
import { settingsRouter } from './routes/settings.js';
import { encounterRouter } from './routes/encounter.js';

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/campaigns', campaignsRouter);
app.use('/api/schedules', schedulesRouter);
app.use('/api/audio', audioRouter);
app.use('/api/personalities', personalitiesRouter);
app.use('/api/outcome', outcomeRouter);
app.use('/demo', demoRouter);
app.use('/api/settings', settingsRouter);
app.use('/api/encounter', encounterRouter);
// Serve built UI (run: npm run ui -- --build)
app.use('/app', express.static('dist/ui'));
app.get('/app/*', (_req, res) => res.sendFile('dist/ui/index.html', { root: process.cwd() }));

app.get('/api/health', (_req, res) => res.json({ ok: true }));

// Register default open-source audio providers for Sprint 1 testing
registerSTTProvider(new WhisperSTTProvider());
registerTTSProvider(new XTTSProvider());
// Register Ollama as default local LLM
registerProvider(new OllamaProvider());

const port = process.env.PORT ? Number(process.env.PORT) : 4000;
const server = http.createServer(app);
const wss = createGateway(server, { heartbeatMs: 15000, ratePerSec: 10 });
// Register server-initiated broadcast function
wsHub.setBroadcaster((campaignId, message) => {
  // Broadcast to all clients in gateway that belong to campaign
  // We reuse gateway by sending a special envelope
  const payload = JSON.stringify({ type: 'server-broadcast', campaignId, payload: message })
  for (const client of wss.clients as any as Set<any>) {
    try {
      // Best effort broadcast; client-side filters by campaign
      client.send(payload)
    } catch {/* noop */}
  }
});
server.listen(port, '0.0.0.0', () => console.log(`Server listening on http://localhost:${port}`));


