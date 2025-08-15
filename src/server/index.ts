// This file contains the main server for the full app (not used for demo).
// The demo server lives in src/demo/index.ts. Keep this stub minimal to satisfy imports.
import express from 'express';
import cors from 'cors';
// Optional .env loader without hard dependency
try {
  const { createRequire } = await import('module');
  const req = createRequire(import.meta.url);
  const dotenv = req('dotenv');
  if (dotenv?.config) dotenv.config();
} catch {}
import campaignsRouter from './routes/campaigns.js';
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
import { vezyRouter } from './routes/vezy.js';
import { generatorRouter } from './routes/generator.js';
import { empireRouter } from './routes/empire.js';
import { mapRouter } from './routes/map.js';
import tradeRouter from './routes/trade.js';
import { initDb } from './storage/db.js';
import { analyticsRouter } from './routes/analytics.js';
import policiesRouter from './routes/policies.js';
import advisorsRouter from './routes/advisors.js';

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
app.use('/api/vezy', vezyRouter);
app.use('/api/generator', generatorRouter);
app.use('/api/empire', empireRouter);
app.use('/api/map', mapRouter);
app.use('/api/trade', tradeRouter);
app.use('/api/analytics', analyticsRouter);
app.use('/api/policies', policiesRouter);
app.use('/api/advisors', advisorsRouter);
// Serve built UI (run: npm run ui -- --build)
app.use('/app', express.static('dist/ui'));
app.get('/app/*', (_req, res) => res.sendFile('dist/ui/index.html', { root: process.cwd() }));

app.get('/api/health', (_req, res) => res.json({ ok: true }));

// Register default open-source audio providers for Sprint 1 testing
registerSTTProvider(new WhisperSTTProvider());
registerTTSProvider(new XTTSProvider());
// Register Ollama as default local LLM
registerProvider(new OllamaProvider());

await initDb();
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


