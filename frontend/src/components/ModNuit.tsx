import { useState, useEffect } from 'react'

export default function ModeNuit() {
  const [nuit, setNuit] = useState(false)

  useEffect(() => {
    if (nuit) {
      document.documentElement.style.setProperty('--creme', '#1A1A2E')
      document.documentElement.style.setProperty('--sombre', '#E8E8F0')
      document.body.style.background = '#1A1A2E'
      document.body.style.color = '#E8E8F0'
    } else {
      document.documentElement.style.setProperty('--creme', '#FFF8F0')
      document.documentElement.style.setProperty('--sombre', '#1A0A00')
      document.body.style.background = '#FFF8F0'
      document.body.style.color = '#1A0A00'
    }
  }, [nuit])

  return (
    <button
      onClick={() => setNuit(!nuit)}
      title={nuit ? 'Mode jour' : 'Mode nuit'}
      style={{
        position: 'fixed', bottom: '164px', left: '24px',
        width: '48px', height: '48px', borderRadius: '50%',
        background: nuit
          ? 'linear-gradient(135deg, #D4AF37, #F0C040)'
          : 'linear-gradient(135deg, #1A1A2E, #2D2D4E)',
        border: 'none', cursor: 'pointer',
        fontSize: '20px', zIndex: 9999,
        boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        transition: 'all 0.3s ease',
      }}
    >
      {nuit ? '☀️' : '🌙'}
    </button>
  )
}
