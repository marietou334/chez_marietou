import { useState, useEffect } from 'react'

const NOTIFICATIONS = [
  { nom: 'Aminata K.', action: 'vient d\'acheter', produit: 'une robe wax dorée', emoji: '👗' },
  { nom: 'Fatou B.', action: 'vient d\'acheter', produit: 'un kit beauté', emoji: '💄' },
  { nom: 'Ibrahim S.', action: 'vient d\'acheter', produit: 'des chaussures Nike', emoji: '👟' },
  { nom: 'Mariam O.', action: 'vient d\'acheter', produit: 'un sac à main', emoji: '👜' },
  { nom: 'Sali T.', action: 'vient de commander', produit: 'un téléphone Samsung', emoji: '📱' },
  { nom: 'Awa D.', action: 'vient d\'acheter', produit: 'des bijoux en or', emoji: '💍' },
]

export default function Notifications() {
  const [visible, setVisible] = useState(false)
  const [notif, setNotif] = useState(NOTIFICATIONS[0])
  const [index, setIndex] = useState(0)

  useEffect(() => {
    const afficher = () => {
      setNotif(NOTIFICATIONS[index % NOTIFICATIONS.length])
      setVisible(true)
      setTimeout(() => setVisible(false), 4000)
      setIndex(prev => prev + 1)
    }

    const timer = setTimeout(afficher, 3000)
    const interval = setInterval(afficher, 12000)
    return () => { clearTimeout(timer); clearInterval(interval) }
  }, [index])

  return (
    <div style={{
      position: 'fixed', bottom: '24px', left: '24px',
      zIndex: 9997,
      transform: visible ? 'translateY(0)' : 'translateY(120px)',
      opacity: visible ? 1 : 0,
      transition: 'all 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
    }}>
      <div style={{
        background: 'white',
        borderRadius: '16px',
        padding: '12px 16px',
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        boxShadow: '0 8px 32px rgba(0,0,0,0.12)',
        border: '1px solid rgba(212,175,55,0.2)',
        maxWidth: '280px',
      }}>
        <div style={{
          width: '40px', height: '40px', borderRadius: '50%',
          background: 'linear-gradient(135deg, #D4AF37, #F0C040)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: '20px', flexShrink: 0,
        }}>{notif.emoji}</div>
        <div>
          <p style={{ fontSize: '13px', fontWeight: 700, color: 'var(--sombre)', marginBottom: '2px' }}>
            {notif.nom}
          </p>
          <p style={{ fontSize: '12px', color: '#888', lineHeight: 1.4 }}>
            {notif.action} <span style={{ color: 'var(--terracotta)', fontWeight: 600 }}>{notif.produit}</span>
          </p>
        </div>
        <div style={{
          width: '8px', height: '8px', borderRadius: '50%',
          background: '#4ADE80', flexShrink: 0,
          animation: 'brillant 2s infinite',
        }} />
      </div>
    </div>
  )
}
