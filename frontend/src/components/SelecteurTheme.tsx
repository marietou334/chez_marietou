import { useState } from 'react'

const THEMES = [
  { nom: 'Afrique', primaire: '#D4AF37', secondaire: '#C45C26', label: '🟠' },
  { nom: 'Passion', primaire: '#E63946', secondaire: '#FF6B9D', label: '🔴' },
  { nom: 'Océan', primaire: '#0077B6', secondaire: '#00B4D8', label: '💙' },
  { nom: 'Douceur', primaire: '#C77DFF', secondaire: '#FF6B9D', label: '💗' },
  { nom: 'Nature', primaire: '#2D6A4F', secondaire: '#95D5B2', label: '💚' },
  { nom: 'Luxe', primaire: '#D4AF37', secondaire: '#1A1A1A', label: '🖤' },
]

export default function SelecteurTheme() {
  const [ouvert, setOuvert] = useState(false)
  const [actif, setActif] = useState(0)

  const appliquerTheme = (i: number) => {
    const t = THEMES[i]
    document.documentElement.style.setProperty('--or', t.primaire)
    document.documentElement.style.setProperty('--terracotta', t.secondaire)
    setActif(i)
    setOuvert(false)
  }

  return (
    <div style={{ position: 'fixed', bottom: '104px', left: '24px', zIndex: 9999 }}>
      <button
        onClick={() => setOuvert(!ouvert)}
        style={{
          width: '48px', height: '48px',
          borderRadius: '50%',
          background: 'white',
          border: '2px solid rgba(212,175,55,0.3)',
          cursor: 'pointer',
          fontSize: '20px',
          boxShadow: '0 4px 20px rgba(0,0,0,0.12)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
        title="Changer le thème"
      >🎨</button>

      {ouvert && (
        <div style={{
          position: 'absolute',
          bottom: '56px',
          left: '0',
          background: 'white',
          borderRadius: '16px',
          padding: '12px',
          boxShadow: '0 8px 32px rgba(0,0,0,0.15)',
          border: '1px solid rgba(212,175,55,0.2)',
          animation: 'glisser-haut 0.3s ease',
          minWidth: '160px',
        }}>
          <p style={{
            fontSize: '11px', fontWeight: 700,
            letterSpacing: '0.1em', color: '#888',
            marginBottom: '10px', textTransform: 'uppercase',
          }}>Thème</p>
          {THEMES.map((t, i) => (
            <button
              key={t.nom}
              onClick={() => appliquerTheme(i)}
              style={{
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                padding: '8px 10px',
                borderRadius: '10px',
                border: 'none',
                background: i === actif ? 'rgba(212,175,55,0.1)' : 'transparent',
                cursor: 'pointer',
                fontSize: '14px',
                transition: 'background 0.2s',
              }}
              onMouseEnter={e => (e.currentTarget.style.background = 'rgba(212,175,55,0.1)')}
              onMouseLeave={e => (e.currentTarget.style.background = i === actif ? 'rgba(212,175,55,0.1)' : 'transparent')}
            >
              <div style={{
                width: '24px', height: '24px',
                borderRadius: '50%',
                background: `linear-gradient(135deg, ${t.primaire}, ${t.secondaire})`,
                flexShrink: 0,
              }} />
              <span style={{ fontWeight: i === actif ? 700 : 400 }}>{t.nom}</span>
              {i === actif && <span style={{ marginLeft: 'auto', color: 'var(--or)' }}>✓</span>}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
