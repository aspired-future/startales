import React from 'react'
import { createRoot } from 'react-dom/client'
import { CampaignBrowser } from './modules/campaigns/CampaignBrowser'

function App() {
  return <CampaignBrowser />
}

createRoot(document.getElementById('root')!).render(<App />)


