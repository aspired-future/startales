import React from 'react'
import { createRoot } from 'react-dom/client'

function App(){
	return <main role="main"><h1>Startales UI</h1></main>
}

const root = createRoot(document.getElementById('root')!)
root.render(<App />)

