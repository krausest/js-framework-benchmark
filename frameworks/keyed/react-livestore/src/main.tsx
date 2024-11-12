import 'todomvc-app-css/index.css'

import React from 'react'
import ReactDOM from 'react-dom/client'
import { registerSW } from 'virtual:pwa-register'

import { App } from './Root.jsx'

if (import.meta.env.PROD) {
  registerSW()
}

ReactDOM.createRoot(document.getElementById('react-app')!).render(<App />)

// ReactDOM.createRoot(document.getElementById('react-app')!).render(
//   <React.StrictMode>
//     <App />
//   </React.StrictMode>,
// )
