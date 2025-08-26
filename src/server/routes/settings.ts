import { Router } from 'express'
import { getSettings, setSettings } from '../storage/db.js'

export const settingsRouter = Router()

settingsRouter.get('/', async (_req, res) => {
  try {
    const s = await getSettings()
    res.json(s)
  } catch (error) {
    console.log('⚠️ Database unavailable, returning mock settings')
    // Return mock settings when database is unavailable
    res.json({
      resolutionMode: 'standard',
      revivalPolicy: 'moderate',
      gameMode: 'campaign',
      backstory: 'A thriving interstellar civilization faces new challenges.',
      winCriteria: 'Achieve sustainable prosperity and diplomatic stability.',
      visualLevel: 'high'
    })
  }
})

settingsRouter.post('/', async (req, res) => {
  try {
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
  } catch (error) {
    console.log('⚠️ Database unavailable, returning submitted settings as-is')
    // Return the submitted settings when database is unavailable
    const s = req.body ?? {}
    res.json({
      resolutionMode: s.resolutionMode || 'standard',
      revialPolicy: s.revialPolicy ?? s.revivalPolicy ?? 'moderate',
      gameMode: s.gameMode || 'campaign',
      backstory: s.backstory || 'A thriving interstellar civilization faces new challenges.',
      winCriteria: s.winCriteria || 'Achieve sustainable prosperity and diplomatic stability.',
      visualLevel: s.visualLevel || 'high'
    })
  }
})


