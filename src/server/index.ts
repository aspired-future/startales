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
import { initDb, getPool } from './storage/db.js';
import { analyticsRouter } from './routes/analytics.js';
import policiesRouter from './routes/policies.js';
import advisorsRouter from './routes/advisors.js';
import civilizationAnalyticsRouter from './routes/civilizationAnalytics.js';
import providersRouter from './routes/providers.js';
import { initializeRegistry } from './registry/AdapterRegistry.js';
import treasuryRouter from './treasury/treasuryRoutes.js';
import defenseRouter from './defense/defenseRoutes.js';
import inflationRouter from './economics/inflationRoutes.js';
import stateRouter from './state/stateRoutes.js';
import interiorRouter from './interior/interiorRoutes.js';
import justiceRouter from './justice/justiceRoutes.js';
import commerceRouter from './commerce/commerceRoutes.js';
import workflowRouter from './cabinet/workflowRoutes.js';
import scienceRouter from './science/scienceRoutes.js';
import communicationsRouter from './communications/communicationsRoutes.js';
import centralBankRouter from './central-bank/centralBankRoutes.js';
import { createCentralBankEnhancementsRoutes } from './central-bank/centralBankEnhancementsRoutes.js';
import { createSovereignWealthFundRoutes } from './sovereign-wealth-fund/sovereignWealthFundRoutes.js';
import legislatureRouter from './legislature/legislatureRoutes.js';
import supremeCourtRouter from './supreme-court/supremeCourtRoutes.js';
import politicalPartyRouter from './political-parties/politicalPartyRoutes.js';
import jointChiefsRouter from './joint-chiefs/jointChiefsRoutes.js';
import intelligenceDirectorsRouter from './intelligence/intelligenceRoutes.js';
import currencyExchangeRouter from './currency-exchange/currencyExchangeRoutes.js';
import fiscalSimulationRouter from './fiscal-simulation/fiscalSimulationRoutes.js';
import financialMarketsRouter from './financial-markets/financialMarketsRoutes.js';
import economicEcosystemRouter from './economic-ecosystem/economicEcosystemRoutes.js';
import healthRouter from './health/healthRoutes.js';
import cityEmergenceRouter from './cities/cityEmergenceRoutes.js';
import characterRouter from './characters/characterRoutes.js';
import smallBusinessRouter from './small-business/smallBusinessRoutes.js';
import economicTierRouter from './economic-tiers/economicTierRoutes.js';
import educationRouter from './education/educationRoutes.js';
import conquestRouter from './conquest/conquestRoutes.js';
import tradeRoutesRouter from './trade/tradeRoutes.js';
import witterRouter from './witter/witterRoutes.js';
import memoryRouter from './memory/memoryRoutes.js';
import whoseappRouter from './whoseapp/whoseappRoutes.js';
import galaxyRouter from './galaxy/galaxyRoutes.js';
import campaignRoutesRouter from './campaigns/campaignRoutes.js';
import scheduleRoutesRouter from './schedules/scheduleRoutes.js';
import { createGovernmentTypesRoutes } from './governance/governmentTypesRoutes.js';
import { createConstitutionRoutes } from './governance/constitutionRoutes.js';
import { createGovernmentContractsRoutes } from './governance/governmentContractsRoutes.js';
import { createMissionsRoutes } from './missions/missionsRoutes.js';
import { initializeMissionsSchema } from './missions/missionsSchema.js';
import { createExportControlsRoutes } from './export-controls/exportControlsRoutes.js';
import { createGameMasterVideoRoutes } from './gamemaster/GameMasterVideoAPI.js';
import { gameMasterWebSocketService } from './gamemaster/GameMasterWebSocket.js';
import { gameMasterTriggerService } from './gamemaster/GameMasterTriggers.js';
import { createGameMasterTestRoutes } from './gamemaster/GameMasterTestRoutes.js';
import { initializeExportControlsSchema } from './export-controls/exportControlsSchema.js';
import { SimEngineOrchestrator } from './sim-engine/SimEngineOrchestrator.js';
import { WebSocketManager } from './sim-engine/WebSocketManager.js';
import { TelemetrySystem } from './sim-engine/TelemetrySystem.js';
import { AILearningLoop } from './sim-engine/AILearningLoop.js';
import { initializeSimEngineSchema } from './sim-engine/simEngineSchema.js';
import { createSimEngineRoutes } from './sim-engine/simEngineRoutes.js';
import { WhoseAppWebSocketService } from './whoseapp/WhoseAppWebSocketService.js';
import { initializeWhoseAppSchema } from './whoseapp/whoseAppSchema.js';
import { createGovernmentBondsRoutes } from './government-bonds/governmentBondsRoutes.js';
import { createPlanetaryGovernmentRoutes } from './planetary-government/planetaryGovernmentRoutes.js';
import { createInstitutionalOverrideRoutes } from './institutional-override/institutionalOverrideRoutes.js';
import { createMediaControlRoutes } from './media-control/mediaControlRoutes.js';
import galaxyRoutes from './galaxy/galaxyRoutes.js';
import spatialIntelligenceRoutes from './characters/spatialIntelligenceRoutes.js';
import { createEntertainmentTourismRoutes } from './entertainment-tourism/entertainmentTourismRoutes.js';
import imagenRoutes from './routes/imagenRoutes.js';

const app = express();
app.use(cors());
app.use(express.json());

// Removed duplicate campaigns and schedules - using new enhanced versions below
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
// Removed duplicate trade - using new enhanced version below
app.use('/api/analytics', analyticsRouter);
app.use('/api/policies', policiesRouter);
app.use('/api/advisors', advisorsRouter);
app.use('/api/civilization-analytics', civilizationAnalyticsRouter);
app.use('/api/providers', providersRouter);
app.use('/api/treasury', treasuryRouter);
app.use('/api/defense', defenseRouter);
app.use('/api/inflation', inflationRouter);
app.use('/api/state', stateRouter);
app.use('/api/interior', interiorRouter);
app.use('/api/justice', justiceRouter);
app.use('/api/commerce', commerceRouter);
app.use('/api/cabinet', workflowRouter);
app.use('/api/science', scienceRouter);
app.use('/api/communications', communicationsRouter);
app.use('/api/central-bank', centralBankRouter);
app.use('/api/central-bank-enhanced', createCentralBankEnhancementsRoutes(getPool()));
app.use('/api/sovereign-wealth-fund', createSovereignWealthFundRoutes(getPool()));
app.use('/api/government-bonds', createGovernmentBondsRoutes(getPool()));
app.use('/api/planetary-government', createPlanetaryGovernmentRoutes(getPool()));
app.use('/api/institutional-override', createInstitutionalOverrideRoutes(getPool()));
app.use('/api/media-control', createMediaControlRoutes(getPool()));
  app.use('/api/galaxy', galaxyRoutes);
  app.use('/api/characters', spatialIntelligenceRoutes);
  app.use('/api/entertainment-tourism', createEntertainmentTourismRoutes(getPool()));
app.use('/api/legislature', legislatureRouter);
app.use('/api/supreme-court', supremeCourtRouter);
app.use('/api/political-parties', politicalPartyRouter);
app.use('/api/joint-chiefs', jointChiefsRouter);
app.use('/api/intelligence', intelligenceDirectorsRouter);
app.use('/api/currency-exchange', currencyExchangeRouter);
app.use('/api/fiscal-simulation', fiscalSimulationRouter);
app.use('/api/financial-markets', financialMarketsRouter);
app.use('/api/economic-ecosystem', economicEcosystemRouter);
app.use('/api/health', healthRouter);
app.use('/api/city-emergence', cityEmergenceRouter);
app.use('/api/characters', characterRouter);
app.use('/api/small-business', smallBusinessRouter);
app.use('/api/economic-tiers', economicTierRouter);
app.use('/api/education', educationRouter);
app.use('/api/conquest', conquestRouter);
app.use('/api/trade', tradeRoutesRouter);
app.use('/api/witter', witterRouter);
app.use('/api/memory', memoryRouter);
app.use('/api/whoseapp', whoseappRouter);
app.use('/api/galaxy', galaxyRouter);
app.use('/api/campaigns', campaignRoutesRouter);
app.use('/api/schedules', scheduleRoutesRouter);
app.use('/api/government-types', createGovernmentTypesRoutes(getPool()));
app.use('/api/constitution', createConstitutionRoutes(getPool()));
app.use('/api/government-contracts', createGovernmentContractsRoutes(getPool()));
app.use('/api/missions', createMissionsRoutes(getPool()));
app.use('/api/export-controls', createExportControlsRoutes(getPool()));
app.use('/api/imagen', imagenRoutes);
app.use('/api/gamemaster', createGameMasterVideoRoutes());
app.use('/api/gamemaster', createGameMasterTestRoutes());
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

// Initialize Sim Engine Systems
let simEngine: SimEngineOrchestrator;
let webSocketManager: WebSocketManager;
let whoseAppWebSocket: WhoseAppWebSocketService;
let telemetrySystem: TelemetrySystem;
let aiLearningLoop: AILearningLoop;

try {
  console.log('🤖 Initializing AI Simulation Engine...');
  
  // Initialize sim engine schema
  await initializeSimEngineSchema(getPool());
  
  // Initialize missions schema
  await initializeMissionsSchema(getPool());
  
  // Initialize export controls schema
  await initializeExportControlsSchema(getPool());
  
  // Create sim engine components
  simEngine = new SimEngineOrchestrator(getPool());
  telemetrySystem = new TelemetrySystem(getPool());
  aiLearningLoop = new AILearningLoop(getPool(), simEngine, telemetrySystem);
  
  console.log('✅ AI Simulation Engine initialized successfully');
  
  // Register sim engine routes after initialization
  app.use('/api/sim-engine', createSimEngineRoutes(getPool(), simEngine, telemetrySystem, aiLearningLoop, webSocketManager));
  console.log('🔗 Sim Engine API routes registered');
} catch (error) {
  console.error('❌ Sim Engine initialization failed:', error);
  
  // Register sim engine routes without the systems (will return 503 errors)
  app.use('/api/sim-engine', createSimEngineRoutes(getPool()));
  console.log('🔗 Sim Engine API routes registered (limited functionality)');
}

// Initialize services
try {
  const { initializeJointChiefsService } = await import('./joint-chiefs/JointChiefsService.js');
  const { initializeIntelligenceDirectorsService } = await import('./intelligence/IntelligenceDirectorsService.js');
  const { initializeCurrencyExchangeService } = await import('./currency-exchange/CurrencyExchangeService.js');
  const { initializeFiscalSimulationService } = await import('./fiscal-simulation/FiscalSimulationService.js');
  const { initializeFinancialMarketsService } = await import('./financial-markets/FinancialMarketsService.js');
  const { initializeEconomicEcosystemService } = await import('./economic-ecosystem/EconomicEcosystemService.js');
  const { initializeProceduralCorporationGenerator } = await import('./economic-ecosystem/ProceduralCorporationGenerator.js');
  const { initializeDynamicCityGenerator } = await import('./economic-ecosystem/DynamicCityGenerator.js');
        const { initializeTradePactsService } = await import('./economic-ecosystem/TradePactsService.js');
          const { initializeHealthService } = await import('./health/HealthService.js');
    const { initializeBusinessNewsService } = await import('./witter/BusinessNewsService.js');
    const { initializeSportsNewsService } = await import('./witter/SportsNewsService.js');
    const { initializeCityEmergenceService } = await import('./cities/cityEmergenceRoutes.js');
    const { initializeCorporateLifecycleService } = await import('./economic-ecosystem/corporateLifecycleRoutes.js');
    const { initializeCharacterService } = await import('./characters/characterRoutes.js');
    const { initializeSmallBusinessService } = await import('./small-business/smallBusinessRoutes.js');
    const { initializeEconomicTierService } = await import('./economic-tiers/economicTierRoutes.js');
    const { initializeEducationService } = await import('./education/EducationService.js');
      const { getPool } = await import('./storage/db.js');
  initializeJointChiefsService(getPool());
  initializeIntelligenceDirectorsService(getPool());
  initializeCurrencyExchangeService(getPool());
  initializeFiscalSimulationService(getPool());
  initializeFinancialMarketsService(getPool());
  initializeEconomicEcosystemService(getPool());
  initializeProceduralCorporationGenerator(getPool());
  initializeDynamicCityGenerator(getPool());
  initializeTradePactsService(getPool());
  initializeHealthService(getPool());
  initializeBusinessNewsService(getPool());
  initializeSportsNewsService(getPool());
  
  // Initialize enhanced Witter services
const { initializeWitterServices } = await import('./witter/witterRoutes.js');
initializeWitterServices(getPool());

// Initialize Story system
const { default: storyRoutes, initializeStoryRoutes } = await import('./story/storyRoutes.js');
initializeStoryRoutes(getPool());
app.use('/api/story', storyRoutes);

// Initialize Game Setup system
const { default: gameSetupRoutes, initializeGameSetupRoutes } = await import('./game/gameSetupRoutes.js');
initializeGameSetupRoutes(getPool());
app.use('/api/game', gameSetupRoutes);
  initializeCityEmergenceService(getPool());
  initializeCorporateLifecycleService(getPool());
      initializeCharacterService(getPool());
    initializeSmallBusinessService(getPool());
    initializeEconomicTierService(getPool());
  initializeEducationService(getPool());
} catch (error) {
  console.error('Service initialization failed:', error);
}

// Initialize the adapter registry
initializeRegistry();

const port = process.env.PORT ? Number(process.env.PORT) : 4000;
const server = http.createServer(app);
const wss = createGateway(server, { heartbeatMs: 15000, ratePerSec: 10 });

// Initialize WebSocket Manager for Sim Engine (if sim engine was initialized)
if (simEngine && telemetrySystem) {
  try {
    webSocketManager = new WebSocketManager(server, simEngine);
    console.log('🔌 Sim Engine WebSocket Manager initialized');
  } catch (error) {
    console.error('❌ WebSocket Manager initialization failed:', error);
  }
}

// Initialize WhoseApp WebSocket Service
try {
  whoseAppWebSocket = new WhoseAppWebSocketService(server, getPool());
  console.log('💬 WhoseApp WebSocket Service initialized');
} catch (error) {
  console.error('❌ WhoseApp WebSocket Service initialization failed:', error);
}

// Initialize Game Master WebSocket Service
try {
  gameMasterWebSocketService.initialize(server);
  console.log('🎬 Game Master WebSocket Service initialized');
} catch (error) {
  console.error('❌ Game Master WebSocket Service initialization failed:', error);
}
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


