import { Router } from 'express'

type Settings = {
  resolutionMode: 'outcome' | 'classic'
  revialPolicy: 'story' | 'standard' | 'hardcore'
  winCriteria?: string
  visualLevel?: 'off' | 'characters' | 'worlds' | 'everything'
}

const memory: { settings: Settings } = {
  settings: { resolutionMode: 'outcome', revialPolicy: 'standard' }
}

export const settingsRouter = Router()

settingsRouter.get('/', (_req, res) => {
  res.json(memory.settings)
})

settingsRouter.post('/', (req, res) => {
  const s = req.body ?? {}
  memory.settings = {
    resolutionMode: s.resolutionMode === 'classic' ? 'classic' : 'outcome',
    revialPolicy: s.revivalPolicy === 'story' ? 'story' : s.revivalPolicy === 'hardcore' ? 'hardcore' : 'standard',
    winCriteria: typeof s.winCriteria === 'string' ? s.winCriteria : memory.settings.winCriteria,
    visualLevel: ['off','characters','worlds','everything'].includes(s.visualLevel) ? s.visualLevel : memory.settings.visualLevel
  } as Settings
  res.json(memory.settings)
})


