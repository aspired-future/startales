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

import { audioRouter } from './routes/audio.ts';
import { personalitiesRouter } from './routes/personalities.ts';
import { outcomeRouter } from './routes/outcome.ts';
import { registerProvider, registerSTTProvider, registerTTSProvider } from './llm/factory.ts';
import { OllamaProvider } from './llm/providers/ollama.ts';
import http from 'http';
import { createGateway } from './ws/gateway.ts';
import { wsHub } from './ws/hub.ts';
import { WhisperSTTProvider } from './llm/providers/whisper.ts';
import { XTTSProvider } from './llm/providers/xtts.ts';
// import { demoRouter } from './routes/demo'; // Removed - demo server deleted
import { settingsRouter } from './routes/settings.ts';
import { encounterRouter } from './routes/encounter.ts';
import { vezyRouter } from './routes/vezy.ts';
import { generatorRouter } from './routes/generator.ts';
import { empireRouter } from './routes/empire.ts';
import { mapRouter } from './routes/map.ts';
import tradeRouter from './routes/trade.ts';
import { initDb, getPool } from './storage/db.ts';
import { analyticsRouter } from './routes/analytics.ts';
import policiesRouter from './routes/policies.ts';
import advisorsRouter from './routes/advisors.ts';
import civilizationAnalyticsRouter from './routes/civilizationAnalytics.ts';
import providersRouter from './routes/providers.ts';
import { initializeRegistry } from './registry/AdapterRegistry.ts';
import treasuryRouter from './treasury/treasuryRoutes.ts';
import defenseRouter from './defense/defenseRoutes.ts';
import inflationRouter from './economics/inflationRoutes.ts';
import stateRouter from './state/stateRoutes.ts';
import interiorRouter from './interior/interiorRoutes.ts';
import justiceRouter from './justice/justiceRoutes.ts';
import commerceRouter from './commerce/commerceRoutes.ts';
import workflowRouter from './cabinet/workflowRoutes.ts';
import scienceRouter from './science/scienceRoutes.ts';
import communicationsRouter from './communications/communicationsRoutes.ts';
import centralBankRouter from './central-bank/centralBankRoutes.ts';
import { createCentralBankEnhancementsRoutes } from './central-bank/centralBankEnhancementsRoutes.ts';
import { createSovereignWealthFundRoutes } from './sovereign-wealth-fund/sovereignWealthFundRoutes.ts';
import aiRoutes from './ai/aiRoutes.ts';
import { conversationMemoryService } from './memory/conversationMemoryService';
import legislatureRouter from './legislature/legislatureRoutes.ts';
import supremeCourtRouter from './supreme-court/supremeCourtRoutes.ts';
import politicalPartyRouter from './political-parties/politicalPartyRoutes.ts';
import jointChiefsRouter from './joint-chiefs/jointChiefsRoutes.ts';
import intelligenceDirectorsRouter from './intelligence/intelligenceRoutes.ts';
import currencyExchangeRouter from './currency-exchange/currencyExchangeRoutes.ts';
import fiscalSimulationRouter from './fiscal-simulation/fiscalSimulationRoutes.ts';
import financialMarketsRouter from './financial-markets/financialMarketsRoutes.ts';
import economicEcosystemRouter from './economic-ecosystem/economicEcosystemRoutes.ts';
import healthRouter from './health/healthRoutes.ts';
import cityEmergenceRouter from './cities/cityEmergenceRoutes.ts';
import characterRouter from './characters/characterRoutes.ts';
import gameCharacterRouter from './characters/gameCharacterRoutes.ts';
import speciesRouter from './species/speciesRoutes.ts';
import messageRouter from './whoseapp/messageRoutes.ts';
import smallBusinessRouter from './small-business/smallBusinessRoutes.ts';
import economicTierRouter from './economic-tiers/economicTierRoutes.ts';
import educationRouter from './education/educationRoutes.ts';
import conquestRouter from './conquest/conquestRoutes.ts';
import tradeRoutesRouter from './trade/tradeRoutes.ts';
import witterRouter from './witter/witterRoutes.ts';
import memoryRouter from './memory/memoryRoutes.ts';
import sttRoutes from './routes/sttRoutes.ts';
import aiRoutes from './ai/aiRoutes.ts';
import galaxyRouter from './galaxy/galaxyRoutes.ts';
import campaignRoutesRouter from './campaigns/campaignRoutes.ts';
import scheduleRoutesRouter from './schedules/scheduleRoutes.ts';
import { createGovernmentTypesRoutes } from './governance/governmentTypesRoutes.ts';
import { createConstitutionRoutes } from './governance/constitutionRoutes.ts';
import { createGovernmentContractsRoutes } from './governance/governmentContractsRoutes.ts';
import { createMissionsRoutes } from './missions/missionsRoutes.ts';
import { initializeMissionsSchema } from './missions/missionsSchema.ts';
import { createExportControlsRoutes } from './export-controls/exportControlsRoutes.ts';
import { createGameMasterVideoRoutes } from './gamemaster/GameMasterVideoAPI.ts';
import { gameMasterWebSocketService } from './gamemaster/GameMasterWebSocket.ts';
import { gameMasterTriggerService } from './gamemaster/GameMasterTriggers.ts';
import { createGameMasterTestRoutes } from './gamemaster/GameMasterTestRoutes.ts';
import { initializeExportControlsSchema } from './export-controls/exportControlsSchema.ts';
import { initializeCentralBankSchema } from './central-bank/centralBankSchema.ts';
import { SimEngineOrchestrator } from '../simulation/engine/SimEngineOrchestrator.ts';
import { WebSocketManager } from '../simulation/engine/WebSocketManager.ts';
import { TelemetrySystem } from '../simulation/engine/TelemetrySystem.ts';
import { AILearningLoop } from '../simulation/engine/AILearningLoop.ts';
import { initializeSimEngineSchema } from '../simulation/routes/simEngineSchema.ts';
import { createSimEngineRoutes } from '../simulation/routes/simEngineRoutes.ts';
import { createStepRoutes } from '../simulation/routes/stepRoutes.ts';
import { WhoseAppWebSocketService } from './whoseapp/WhoseAppWebSocketService.ts';
import { initializeWhoseAppSchema } from './whoseapp/whoseAppSchema.ts';
import { createGovernmentBondsRoutes } from './government-bonds/governmentBondsRoutes.ts';
import { createPlanetaryGovernmentRoutes } from './planetary-government/planetaryGovernmentRoutes.ts';
import { createInstitutionalOverrideRoutes } from './institutional-override/institutionalOverrideRoutes.ts';
import { createMediaControlRoutes } from './media-control/mediaControlRoutes.ts';
import galaxyRoutes from './galaxy/galaxyRoutes.ts';
import spatialIntelligenceRoutes from './characters/spatialIntelligenceRoutes.ts';
import { createEntertainmentTourismRoutes } from './entertainment-tourism/entertainmentTourismRoutes.ts';
import imagenRoutes from './routes/imagenRoutes.ts';

const app = express();
app.use(cors());
app.use(express.json());

// Removed duplicate campaigns and schedules - using new enhanced versions below
app.use('/api/audio', audioRouter);
app.use('/api/personalities', personalitiesRouter);
app.use('/api/outcome', outcomeRouter);
// app.use('/demo', demoRouter); // Removed - demo server deleted
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
app.use('/api/game-characters', gameCharacterRouter);
app.use('/api/species', speciesRouter);
app.use('/api/whoseapp', messageRouter);
app.use('/api/small-business', smallBusinessRouter);
app.use('/api/economic-tiers', economicTierRouter);
app.use('/api/education', educationRouter);
app.use('/api/conquest', conquestRouter);
app.use('/api/trade', tradeRoutesRouter);
app.use('/api/witter', witterRouter);
app.use('/api/memory', memoryRouter);
app.use('/api/stt', sttRoutes);
app.use('/api/ai', aiRoutes);
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

// Initialize conversation memory service
try {
  await conversationMemoryService.initialize();
  console.log('✅ Conversation memory service initialized');
} catch (error) {
  console.error('❌ Failed to initialize conversation memory service:', error);
}

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
  
  // Initialize central bank schema
  await initializeCentralBankSchema(getPool());
  
  // Create sim engine components
  simEngine = new SimEngineOrchestrator(getPool());
  telemetrySystem = new TelemetrySystem(getPool());
  aiLearningLoop = new AILearningLoop(getPool(), simEngine, telemetrySystem);
  
  // Inject trade simulation into trade routes
  const { setTradeSimulation } = await import('./trade/tradeRoutes.ts');
  setTradeSimulation((simEngine as any).tradeSimulation);
  
  console.log('✅ AI Simulation Engine initialized successfully');
  
  // Register sim engine routes after initialization
  app.use('/api/sim-engine', createSimEngineRoutes(getPool(), simEngine, telemetrySystem, aiLearningLoop, webSocketManager));
  console.log('🔗 Sim Engine API routes registered');
  
  // Register basic simulation step routes
  app.use('/api/sim', createStepRoutes());
  console.log('🔗 Simulation Step API routes registered');
} catch (error) {
  console.error('❌ Sim Engine initialization failed:', error);
  
  // Register sim engine routes without the systems (will return 503 errors)
  app.use('/api/sim-engine', createSimEngineRoutes(getPool()));
  console.log('🔗 Sim Engine API routes registered (limited functionality)');
  
  // Register basic simulation step routes (these don't depend on sim engine)
  app.use('/api/sim', createStepRoutes());
  console.log('🔗 Simulation Step API routes registered');
}

// Initialize services
try {
  const { initializeJointChiefsService } = await import('./joint-chiefs/JointChiefsService.ts');
  const { initializeIntelligenceDirectorsService } = await import('./intelligence/IntelligenceDirectorsService.ts');
  const { initializeCurrencyExchangeService } = await import('./currency-exchange/CurrencyExchangeService.ts');
  const { initializeFiscalSimulationService } = await import('./fiscal-simulation/FiscalSimulationService.ts');
  const { initializeFinancialMarketsService } = await import('./financial-markets/FinancialMarketsService.ts');
  const { initializeEconomicEcosystemService } = await import('./economic-ecosystem/EconomicEcosystemService.ts');
  const { initializeProceduralCorporationGenerator } = await import('./economic-ecosystem/ProceduralCorporationGenerator.ts');
  const { initializeDynamicCityGenerator } = await import('./economic-ecosystem/DynamicCityGenerator.ts');
        const { initializeTradePactsService } = await import('./economic-ecosystem/TradePactsService.ts');
          const { initializeHealthService } = await import('./health/HealthService.ts');
    const { initializeBusinessNewsService } = await import('./witter/BusinessNewsService.ts');
    const { initializeSportsNewsService } = await import('./witter/SportsNewsService.ts');
    const { initializeCityEmergenceService } = await import('./cities/cityEmergenceRoutes.ts');
    const { initializeCorporateLifecycleService } = await import('./economic-ecosystem/corporateLifecycleRoutes.ts');
    const { initializeCharacterService } = await import('./characters/characterRoutes.ts');
    const { initializeGameCharacterService } = await import('./characters/GameCharacterService.ts');
    const { initializeSpeciesRoutes } = await import('./species/speciesRoutes.ts');
    const { initializeMessageRoutes } = await import('./whoseapp/messageRoutes.ts');
    const { initializeActionRoutes } = await import('./whoseapp/actionRoutes.ts');
    const { initializeSmallBusinessService } = await import('./small-business/smallBusinessRoutes.ts');
    const { initializeEconomicTierService } = await import('./economic-tiers/economicTierRoutes.ts');
    const { initializeEducationService } = await import('./education/EducationService.ts');
      const { getPool } = await import('./storage/db.ts');
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
const { initializeWitterServices } = await import('./witter/witterRoutes.ts');
initializeWitterServices(getPool());

// Initialize Story system
const { default: storyRoutes, initializeStoryRoutes } = await import('./story/storyRoutes.ts');
initializeStoryRoutes(getPool());
app.use('/api/story', storyRoutes);

// Initialize Game Setup system
const { default: gameSetupRoutes, initializeGameSetupRoutes } = await import('./game/gameSetupRoutes.ts');
initializeGameSetupRoutes(getPool());
app.use('/api/game', gameSetupRoutes);
  initializeCityEmergenceService(getPool());
  initializeCorporateLifecycleService(getPool());
      initializeCharacterService(getPool());
    initializeGameCharacterService(getPool());
    initializeSpeciesRoutes(getPool());
    initializeMessageRoutes(getPool());
    app.use('/api/whoseapp', initializeActionRoutes(getPool()));
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


