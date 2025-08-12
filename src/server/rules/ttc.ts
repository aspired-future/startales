export interface TTCInput {
  baseTimeSec: number
  difficultyFactor: number // 0.5 easy .. 2.0 hard
  skillRank: number // 0..5
  expertiseRank?: number // 0..3
  toolQuality?: number // -1 bad, 0 none, 1 good, 2 excellent
  situational?: number // multiplier 0.8..1.5
}

export interface TTCPreview {
  ttcSec: number
  breakdown: Record<string, number>
}

export function previewTTC(input: TTCInput): TTCPreview {
  const expertise = input.expertiseRank ?? 0
  const tool = input.toolQuality ?? 0
  const situ = input.situational ?? 1

  // Factors: higher skill/expertise/tool reduce time up to caps
  const skillFactor = Math.min(0.35, 0.06 * input.skillRank)
  const expertiseFactor = Math.min(0.2, 0.07 * expertise)
  const toolFactor = Math.min(0.2, 0.08 * Math.max(0, tool)) - Math.max(0, -tool) * 0.05

  const reduction = Math.max(0, skillFactor + expertiseFactor + toolFactor)
  const ttc = input.baseTimeSec * input.difficultyFactor * (1 - reduction) * situ

  return {
    ttcSec: Number(ttc.toFixed(2)),
    breakdown: {
      base: input.baseTimeSec,
      difficulty: input.difficultyFactor,
      reduction: Number(reduction.toFixed(3)),
      situational: situ,
    },
  }
}


