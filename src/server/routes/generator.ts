import { Router } from 'express'

export const generatorRouter = Router()

const civPersonalities = [
  { name: 'Qel’Nari', traits: ['Stoic', 'Scientific', 'Treaty-bound'] },
  { name: 'Fyr’Kesh', traits: ['Honor-bound', 'Competitive', 'Martial'] },
  { name: 'Lumi’tha', traits: ['Curious', 'Humorous', 'Whimsical'] },
  { name: 'Tal’Vor', traits: ['Diplomatic', 'Mercantile', 'Inspirational'] },
]

function pick<T>(arr: T[]): T { return arr[Math.floor(Math.random()*arr.length)] }

const biomes = ['Desert','Oceanic','Jungle','Temperate','Arctic','Volcanic','Barren','Swamp','Savanna']
const resources = ['Alloys','Fuel','Rare Crystals','Food','Water','Biotech','Exotic Gas','Relic Sites']
const governments = ['Republic','Technocracy','Council','Hegemony','Guild Union','Cult Dominion']

export function generatePlanetData() {
  const civ = pick(civPersonalities)
  return {
    name: `Vez-${Math.floor(Math.random()*900+100)}`,
    biome: pick(biomes),
    gravity: +(Math.random()*0.8 + 0.6).toFixed(2),
    resources: Array.from(new Set(Array.from({length:3}, ()=>pick(resources)))).slice(0,3),
    civilization: {
      name: civ.name,
      personality: civ.traits,
      government: pick(governments),
      populationMillions: Math.floor(Math.random()*900 + 10)
    }
  }
}

generatorRouter.get('/planet', (_req, res) => {
  const planet = generatePlanetData()
  res.json(planet)
})


