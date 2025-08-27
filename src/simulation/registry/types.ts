export type SimulationProviderName = string;

export interface SimulationStartOptions {
  campaignId: string;
  sessionId: string;
  seed: string;
  stepBudgetPerBeat?: number; // max steps allowed per narrative beat
  metadata?: Record<string, unknown>;
}

export interface SimulationStateHandle {
  campaignId: string;
  sessionId: string;
  provider: SimulationProviderName;
  seed: string;
  currentStep: number;
}

export interface SimulationStepInput {
  handle: SimulationStateHandle;
  maxSteps: number; // hard cap for this call
  timeDeltaMs?: number; // optional wall-clock advancement
  directives?: Record<string, unknown>; // hints from mission/director/rules
}

export interface SimulationStepOutput {
  handle: SimulationStateHandle;
  stepsApplied: number;
  events: Array<Record<string, unknown>>; // sim-produced events/observations
  frame?: {
    // Optional lightweight reference to a visual frame; actual pixels are produced elsewhere
    id: string;
    width: number;
    height: number;
    mimeType?: string;
  };
}

export interface SimulationSnapshotInfo {
  handle: SimulationStateHandle;
  snapshotId: string;
  storagePath: string;
}

export interface SimulationProviderCapabilities {
  readonly deterministicSeeds: boolean;
  readonly supportsFrames: boolean;
  readonly maxRecommendedStepsPerSecond?: number;
}

export interface SimulationProvider {
  readonly name: SimulationProviderName;
  readonly capabilities: SimulationProviderCapabilities;
  start(options: SimulationStartOptions): Promise<SimulationStateHandle>;
  step(input: SimulationStepInput): Promise<SimulationStepOutput>;
  stop(handle: SimulationStateHandle): Promise<void>;
  exportSnapshot(handle: SimulationStateHandle): Promise<SimulationSnapshotInfo>;
  importSnapshot(snapshotPath: string, into: SimulationStartOptions): Promise<SimulationStateHandle>;
  /** Optional: return a stable hash summarizing provider state for drift detection */
  getStateHash?(handle: SimulationStateHandle): Promise<string>;
}


