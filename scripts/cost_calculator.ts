/*
 Configurable cost calculator for session estimates.
 Usage examples:
   - npm run cost -- --players=50 --hours=2 --profile=standard
   - npm run cost -- --players=10 --hours=3 --inTokensPerHour=6000 --outTokensPerHour=6000 --imagePerHour=30
 Output: JSON to stdout
*/

type Profile = 'local' | 'standard' | 'premium';

interface CostInputs {
  players: number;
  hours: number;
  profile?: Profile;
  // Token consumption per player-hour (before batching effects). These are heuristics.
  inTokensPerHour?: number; // input tokens
  outTokensPerHour?: number; // output tokens
  // Media/session-wide (shared) per hour
  imagesPerHour?: number;
  sttMinsPerPlayerHour?: number; // minutes of speech per player-hour
  ttsCharsPerHour?: number; // GM/NPC chars per session-hour
  // Unit costs
  costPerMTokensIn?: number; // $ per 1M input tokens
  costPerMTokensOut?: number; // $ per 1M output tokens
  costPerImage?: number; // $ per image
  costPerSttMinute?: number; // $ per minute of audio
  costPerMTtsChars?: number; // $ per 1M chars
  videoClipsPerHour?: number; // optional video
  costPerVideoClip?: number;
  // Batching multiplier to reduce per-player token use in Stage Mode
  batchingFactor?: number; // 0.4 means 60% reduction
}

function parseArgs(): Partial<CostInputs> {
  const args = process.argv.slice(2);
  const out: Record<string, string> = {};
  for (const a of args) {
    const m = a.match(/^--([^=]+)=(.*)$/);
    if (m) out[m[1]] = m[2];
  }
  return {
    players: out.players ? Number(out.players) : undefined,
    hours: out.hours ? Number(out.hours) : undefined,
    profile: (out.profile as Profile) || undefined,
    inTokensPerHour: out.inTokensPerHour ? Number(out.inTokensPerHour) : undefined,
    outTokensPerHour: out.outTokensPerHour ? Number(out.outTokensPerHour) : undefined,
    imagesPerHour: out.imagePerHour ? Number(out.imagePerHour) : undefined,
    sttMinsPerPlayerHour: out.sttMinsPerPlayerHour ? Number(out.sttMinsPerPlayerHour) : undefined,
    ttsCharsPerHour: out.ttsCharsPerHour ? Number(out.ttsCharsPerHour) : undefined,
    costPerMTokensIn: out.costPerMTokensIn ? Number(out.costPerMTokensIn) : undefined,
    costPerMTokensOut: out.costPerMTokensOut ? Number(out.costPerMTokensOut) : undefined,
    costPerImage: out.costPerImage ? Number(out.costPerImage) : undefined,
    costPerSttMinute: out.costPerSttMinute ? Number(out.costPerSttMinute) : undefined,
    costPerMTtsChars: out.costPerMTtsChars ? Number(out.costPerMTtsChars) : undefined,
    videoClipsPerHour: out.videoClipsPerHour ? Number(out.videoClipsPerHour) : undefined,
    costPerVideoClip: out.costPerVideoClip ? Number(out.costPerVideoClip) : undefined,
    batchingFactor: out.batchingFactor ? Number(out.batchingFactor) : undefined,
  };
}

function defaultsForProfile(profile: Profile): Required<Omit<CostInputs, 'profile'>> {
  // Reasonable heuristics derived from design doc; "standard" assumes cloud LLM mini + local media.
  if (profile === 'local') {
    return {
      players: 6,
      hours: 2,
      inTokensPerHour: 6000,
      outTokensPerHour: 6000,
      imagesPerHour: 20,
      sttMinsPerPlayerHour: 10,
      ttsCharsPerHour: 30000,
      costPerMTokensIn: 0, // local
      costPerMTokensOut: 0,
      costPerImage: 0,
      costPerSttMinute: 0,
      costPerMTtsChars: 0,
      videoClipsPerHour: 0,
      costPerVideoClip: 0,
      batchingFactor: 0.4,
    };
  }
  if (profile === 'premium') {
    return {
      players: 6,
      hours: 2,
      inTokensPerHour: 10000,
      outTokensPerHour: 10000,
      imagesPerHour: 30,
      sttMinsPerPlayerHour: 10,
      ttsCharsPerHour: 50000,
      costPerMTokensIn: 3.0,
      costPerMTokensOut: 15.0,
      costPerImage: 0.06,
      costPerSttMinute: 0.006,
      costPerMTtsChars: 15.0,
      videoClipsPerHour: 2,
      costPerVideoClip: 2.0,
      batchingFactor: 0.4,
    };
  }
  // standard
  return {
    players: 6,
    hours: 2,
    inTokensPerHour: 8000,
    outTokensPerHour: 8000,
    imagesPerHour: 25,
    sttMinsPerPlayerHour: 10,
    ttsCharsPerHour: 40000,
    costPerMTokensIn: 5.0,
    costPerMTokensOut: 15.0,
    costPerImage: 0.05,
    costPerSttMinute: 0.006,
    costPerMTtsChars: 15.0,
    videoClipsPerHour: 0,
    costPerVideoClip: 0,
    batchingFactor: 0.4,
  };
}

function calc(inputs: Required<Omit<CostInputs, 'profile'>> & { profile: Profile }) {
  const playerHours = inputs.players * inputs.hours;
  const batchedIn = inputs.inTokensPerHour * inputs.batchingFactor * playerHours;
  const batchedOut = inputs.outTokensPerHour * inputs.batchingFactor * playerHours;
  const llmCost = (batchedIn / 1_000_000) * inputs.costPerMTokensIn + (batchedOut / 1_000_000) * inputs.costPerMTokensOut;
  const sttCost = inputs.players * inputs.hours * inputs.sttMinsPerPlayerHour * inputs.costPerSttMinute;
  const ttsCost = (inputs.ttsCharsPerHour * inputs.hours / 1_000_000) * inputs.costPerMTtsChars;
  const imageCost = inputs.imagesPerHour * inputs.hours * inputs.costPerImage;
  const videoCost = inputs.videoClipsPerHour * inputs.hours * inputs.costPerVideoClip;
  const total = llmCost + sttCost + ttsCost + imageCost + videoCost;
  return {
    profile: inputs.profile,
    players: inputs.players,
    hours: inputs.hours,
    assumptions: {
      batchingFactor: inputs.batchingFactor,
      inTokensPerHour: inputs.inTokensPerHour,
      outTokensPerHour: inputs.outTokensPerHour,
      imagesPerHour: inputs.imagesPerHour,
      sttMinsPerPlayerHour: inputs.sttMinsPerPlayerHour,
      ttsCharsPerHour: inputs.ttsCharsPerHour,
      unitCosts: {
        costPerMTokensIn: inputs.costPerMTokensIn,
        costPerMTokensOut: inputs.costPerMTokensOut,
        costPerImage: inputs.costPerImage,
        costPerSttMinute: inputs.costPerSttMinute,
        costPerMTtsChars: inputs.costPerMTtsChars,
        costPerVideoClip: inputs.costPerVideoClip,
      },
    },
    breakdown: { llmCost, sttCost, ttsCost, imageCost, videoCost },
    total,
    perPlayerHour: total / playerHours,
  };
}

function main() {
  const cli = parseArgs();
  const profile: Profile = cli.profile || 'standard';
  const d = defaultsForProfile(profile);
  const merged: Required<Omit<CostInputs, 'profile'>> = {
    players: cli.players ?? d.players,
    hours: cli.hours ?? d.hours,
    inTokensPerHour: cli.inTokensPerHour ?? d.inTokensPerHour,
    outTokensPerHour: cli.outTokensPerHour ?? d.outTokensPerHour,
    imagesPerHour: cli.imagesPerHour ?? d.imagesPerHour,
    sttMinsPerPlayerHour: cli.sttMinsPerPlayerHour ?? d.sttMinsPerPlayerHour,
    ttsCharsPerHour: cli.ttsCharsPerHour ?? d.ttsCharsPerHour,
    costPerMTokensIn: cli.costPerMTokensIn ?? d.costPerMTokensIn,
    costPerMTokensOut: cli.costPerMTokensOut ?? d.costPerMTokensOut,
    costPerImage: cli.costPerImage ?? d.costPerImage,
    costPerSttMinute: cli.costPerSttMinute ?? d.costPerSttMinute,
    costPerMTtsChars: cli.costPerMTtsChars ?? d.costPerMTtsChars,
    videoClipsPerHour: cli.videoClipsPerHour ?? d.videoClipsPerHour,
    costPerVideoClip: cli.costPerVideoClip ?? d.costPerVideoClip,
    batchingFactor: cli.batchingFactor ?? d.batchingFactor,
  };
  const result = calc({ ...merged, profile });
  process.stdout.write(JSON.stringify(result, null, 2));
}

main();


