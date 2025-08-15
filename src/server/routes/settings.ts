import { Router } from 'express'
import { getSettings, setSettings } from '../storage/db.js'

export const settingsRouter = Router()

settingsRouter.get('/', async (_req, res) => {
  const s = await getSettings()
  res.json(s)
})

settingsRouter.post('/', async (req, res) => {
  const s = req.body ?? {}
  const saved = await setSettings({
    resolutionMode: s.resolutionMode,
    revialPolicy: s.revialPolicy ?? s.revivalPolicy, // accept legacy key typo
    gameMode: s.gameMode,
    backstory: s.backstory,
    winCriteria: s.winCriteria,
    visualLevel: s.visualLevel
  })
  res.json(saved)
})


