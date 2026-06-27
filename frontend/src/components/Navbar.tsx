import { useState } from 'react'
import { Link } from 'react-router-dom'

interface Props {
  panier: number
}

export default function Navbar({ panier }: Props) {
  const [recherche, setRecherche] = useState('')
  const [menuOuvert, setMenuOuvert] = useState(false)

  const categories = ['Mode', 'Beauté', 'Maison', 'Électronique', 'Alimentation', 'Jouets', 'Sport', 'Tout']

  return (
    <header style={{ position: 'fixed', top: 0, width: '100%', zIndex: 1000 }}>

      {/* Barre promo */}
      <div style={{
        background: 'linear-gradient(90deg, #C45C26, #D4AF37, #C45C26)',
        backgroundSize: '200% 100%',
        animation: 'gradient-slide 3s ease infinite',
        padding: '8px',
        textAlign: 'center',
        fontSize: '13px',
        fontWeight: 600,
        color: 'white',
        letterSpacing: '0.05em',
      }}>
        🎉 Livraison gratuite à Ouagadougou pour toute commande supérieure à 10 000 FCFA !
      </div>

      {/* Navbar principale */}
      <nav style={{
        background: 'rgba(255,248,240,0.98)',
        backdropFilter: 'blur(20px)',
        borderBottom: '1px solid rgba(212,175,55,0.15)',
        padding: '12px 32px',
        display: 'flex',
        alignItems: 'center',
        gap: '24px',
      }}>

        {/* Logo */}
        <Link to="/" style={{
          fontFamily: 'Playfair Display, serif',
          fontSize: '24px',
          fontWeight: 700,
          color: 'var(--terracotta)',
          textDecoration: 'none',
          whiteSpace: 'nowrap',
          flexShrink: 0,
        }}>
          ✨ Chez Mariétou
        </Link>

        {/* Barre de recherche */}
        <div style={{
          flex: 1,
          display: 'flex',
          alignItems: 'center',
          background: 'white',
          border: '2px solid rgba(212,175,55,0.3)',
          borderRadius: '50px',
          overflow: 'hidden',
          transition: 'border-color 0.2s',
          maxWidth: '600px',
        }}>
          <input
            type="text"
            value={recherche}
            onChange={e => setRecherche(e.target.value)}
            placeholder="Rechercher un produit..."
            style={{
              flex: 1,
              padding: '12px 20px',
              border: 'none',
              outline: 'none',
              fontSize: '14px',
              background: 'transparent',
            }}
          />
          <button style={{
            padding: '12px 20px',
            background: 'linear-gradient(135deg, #D4AF37, #F0C040)',
            border: 'none',
            cursor: 'pointer',
            fontSize: '18px',
          }}>🔍</button>
        </div>

        {/* Actions */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flexShrink: 0 }}>
          <Link to="/connexion" style={{
            display: 'flex', flexDirection: 'column', alignItems: 'center',
            textDecoration: 'none', color: 'var(--sombre)', fontSize: '11px',
          }}>
            <span style={{ fontSize: '22px' }}>👤</span>
            <span>Compte</span>
          </Link>

          <Link to="/panier" style={{
            display: 'flex', flexDirection: 'column', alignItems: 'center',
            textDecoration: 'none', color: 'var(--sombre)', fontSize: '11px',
            position: 'relative',
          }}>
            <span style={{ fontSize: '22px' }}>🛒</span>
            <span>Panier</span>
            {panier > 0 && (
              <span style={{
                position: 'absolute', top: -4, right: -4,
                background: '#C45C26', color: 'white',
                borderRadius: '50%', width: '18px', height: '18px',
                fontSize: '10px', fontWeight: 700,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>{panier}</span>
            )}
          </Link>

          <a href="https://wa.me/22600000000" style={{
            display: 'flex', flexDirection: 'column', alignItems: 'center',
            textDecoration: 'none', color: '#25D366', fontSize: '11px',
          }}>
            <span style={{ fontSize: '22px' }}>📱</span>
            <span>WhatsApp</span>
          </a>
        </div>
      </nav>

      {/* Barre catégories */}
      <div style={{
        background: 'var(--sombre)',
        padding: '10px 32px',
        display: 'flex',
        gap: '8px',
        overflowX: 'auto',
        scrollbarWidth: 'none',
      }}>
        {categories.map(cat => (
          <Link key={cat} to={`/boutique?cat=${cat}`} style={{
            color: 'rgba(255,248,240,0.85)',
            textDecoration: 'none',
            fontSize: '13px',
            fontWeight: 500,
            padding: '6px 16px',
            borderRadius: '50px',
            whiteSpace: 'nowrap',
            border: '1px solid rgba(212,175,55,0.2)',
            transition: 'all 0.2s',
          }}
            onMouseEnter={e => {
              (e.currentTarget as HTMLAnchorElement).style.background = 'var(--or)'
              ;(e.currentTarget as HTMLAnchorElement).style.color = 'var(--sombre)'
            }}
            onMouseLeave={e => {
              (e.currentTarget as HTMLAnchorElement).style.background = 'transparent'
              ;(e.currentTarget as HTMLAnchorElement).style.color = 'rgba(255,248,240,0.85)'
            }}
          >{cat}</Link>
        ))}
      </div>

      <style>{`
        @keyframes gradient-slide {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
      `}</style>
    </header>
  )
}
