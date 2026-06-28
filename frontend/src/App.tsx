import { useState } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Accueil from './pages/Accueil'
import Boutique from './pages/Boutique'
import Dashboard from './pages/admin/Dashboard'
import Particules from './components/Particules'
import ChatIA from './components/ChatIA'
import SelecteurTheme from './components/SelecteurTheme'
import Notifications from './components/Notifications'
import ModeNuit from './components/ModNuit'
import AvisClients from './components/AvisClients'
import './index.css'

function App() {
  const [panier, setPanier] = useState<string[]>([])

  return (
    <Router>
      <Routes>
        <Route path="/admin" element={<Dashboard />} />
        <Route path="/*" element={
          <>
            <Particules />
            <Navbar panier={panier.length} />
            <Routes>
              <Route path="/" element={<Accueil avisClients={<AvisClients />} />} />
              <Route path="/boutique" element={<Boutique />} />
            </Routes>
            <ChatIA />
            <SelecteurTheme />
            <Notifications />
            <ModeNuit />
          </>
        } />
      </Routes>
    </Router>
  )
}

export default App
