import { useState } from 'react'

interface Props {
  produit: {
    id: string
    nom: string
    description: string
    prix_fcfa: number
    categorie: string
    stock: number
    en_promotion: boolean
    prix_promotion_fcfa?: number
  }
  onAjouter: (id: string) => void
}

export default function CarteProduit({ produit, onAjouter }: Props) {
  const [survol, setSurvol] = useState(false)
  const [ajoute, setAjoute] = useState(false)

  const handleAjouter = () => {
    onAjouter(produit.id)
    setAjoute(true)
    setTimeout(() => setAjoute(false), 2000)
  }

  const partagerWhatsApp = () => {
    const msg = `Bonjour ! Je suis intéressé(e) par *${produit.nom}* à ${produit.prix_fcfa.toLocaleString()} FCFA sur Chez Mariétou 🛍️`
    window.open(`https://wa.me/22600000000?text=${encodeURIComponent(msg)}`, '_blank')
  }

  const emojis: Record<string, string> = {
    Vetements: '👗', Accessoires: '💍', Beauté: '💄',
    Maison: '🏠', Electronique: '📱', Alimentation: '🍎',
    Jouets: '🧸', Sport: '⚽', default: '🛍️'
  }
  const emoji = emojis[produit.categorie] || emojis.default

  const stockFaible = produit.stock > 0 && produit.stock <= 5

  return (
    <div
      className="carte-produit"
      onMouseEnter={() => setSurvol(true)}
      onMouseLeave={() => setSurvol(false)}
      style={{
        transform: survol ? 'translateY(-12px)' : 'translateY(0)',
        boxShadow: survol
          ? '0 24px 48px rgba(212,175,55,0.2)'
          : '0 4px 24px rgba(0,0,0,0.07)',
        transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
      }}
    >
      {/* Image */}
      <div style={{
        height: '200px',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: '72px',
        background: 'linear-gradient(135deg, #FFF8F0, #FFE8C0)',
        position: 'relative', overflow: 'hidden',
      }}>
        <span style={{
          transform: survol ? 'scale(1.15) rotate(5deg)' : 'scale(1)',
          transition: 'transform 0.4s ease', display: 'block',
        }}>{emoji}</span>

        {produit.en_promotion && (
          <div style={{
            position: 'absolute', top: 10, left: 10,
            background: 'linear-gradient(135deg, #C45C26, #E07030)',
            color: 'white', padding: '4px 10px',
            borderRadius: '50px', fontSize: '11px', fontWeight: 700,
          }}>🔥 PROMO</div>
        )}

        {/* Bouton WhatsApp au survol */}
        {survol && (
          <button onClick={partagerWhatsApp} style={{
            position: 'absolute', top: 10, right: 10,
            background: '#25D366', color: 'white',
            border: 'none', padding: '6px 12px',
            borderRadius: '50px', fontSize: '11px',
            fontWeight: 700, cursor: 'pointer',
            display: 'flex', alignItems: 'center', gap: '4px',
            animation: 'glisser-haut 0.2s ease',
          }}>
            📱 WhatsApp
          </button>
        )}

        {produit.stock === 0 && (
          <div style={{
            position: 'absolute', inset: 0,
            background: 'rgba(0,0,0,0.45)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: 'white', fontWeight: 700, fontSize: '16px',
          }}>Épuisé</div>
        )}
      </div>

      {/* Contenu */}
      <div style={{ padding: '18px' }}>
        <span style={{
          fontSize: '10px', fontWeight: 700,
          padding: '3px 10px', borderRadius: '50px',
          background: 'rgba(212,175,55,0.12)',
          color: 'var(--terracotta)',
          marginBottom: '8px', display: 'inline-block',
          letterSpacing: '0.08em', textTransform: 'uppercase',
        }}>{produit.categorie}</span>

        <h3 style={{
          fontFamily: 'Playfair Display, serif',
          fontSize: '17px', fontWeight: 700,
          marginBottom: '6px', color: 'var(--sombre)', lineHeight: 1.3,
        }}>{produit.nom}</h3>

        <p style={{
          fontSize: '13px', color: '#888',
          marginBottom: '12px', lineHeight: 1.5,
          display: '-webkit-box',
          WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden',
        }}>{produit.description}</p>

        {/* Barre de stock */}
        {produit.stock > 0 && (
          <div style={{ marginBottom: '12px' }}>
            {stockFaible && (
              <p style={{ fontSize: '11px', color: '#E07030', fontWeight: 700, marginBottom: '4px' }}>
                ⚠️ Plus que {produit.stock} en stock !
              </p>
            )}
            <div style={{
              height: '4px', background: '#E0E0E0', borderRadius: '2px', overflow: 'hidden',
            }}>
              <div style={{
                height: '100%',
                width: `${Math.min(100, (produit.stock / 20) * 100)}%`,
                background: stockFaible
                  ? 'linear-gradient(90deg, #E07030, #C45C26)'
                  : 'linear-gradient(90deg, #2D6A4F, #40916C)',
                borderRadius: '2px',
                transition: 'width 0.5s ease',
              }} />
            </div>
          </div>
        )}

        {/* Prix */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
          <div>
            {produit.en_promotion && produit.prix_promotion_fcfa ? (
              <>
                <span style={{ textDecoration: 'line-through', color: '#bbb', fontSize: '12px', display: 'block' }}>
                  {produit.prix_fcfa.toLocaleString()} FCFA
                </span>
                <span style={{ fontWeight: 800, fontSize: '20px', color: 'var(--terracotta)' }}>
                  {produit.prix_promotion_fcfa.toLocaleString()} FCFA
                </span>
              </>
            ) : (
              <span style={{ fontWeight: 800, fontSize: '20px', color: 'var(--terracotta)' }}>
                {produit.prix_fcfa.toLocaleString()} FCFA
              </span>
            )}
          </div>
          <div style={{ display: 'flex', gap: '4px' }}>
            {[1,2,3,4,5].map(i => (
              <span key={i} style={{ fontSize: '11px', color: '#D4AF37' }}>★</span>
            ))}
          </div>
        </div>

        <button
          onClick={handleAjouter}
          disabled={produit.stock === 0}
          style={{
            width: '100%', padding: '13px',
            borderRadius: '50px', border: 'none',
            background: ajoute
              ? 'linear-gradient(135deg, #2D6A4F, #40916C)'
              : produit.stock === 0
              ? '#E0E0E0'
              : 'linear-gradient(135deg, #C45C26, #E07030)',
            color: produit.stock === 0 ? '#999' : 'white',
            fontWeight: 700, fontSize: '14px',
            cursor: produit.stock === 0 ? 'not-allowed' : 'pointer',
            transition: 'all 0.3s ease',
            boxShadow: produit.stock > 0 ? '0 4px 16px rgba(196,92,38,0.25)' : 'none',
          }}
        >
          {ajoute ? '✅ Ajouté au panier !' : produit.stock === 0 ? 'Indisponible' : '🛒 Ajouter au panier'}
        </button>
      </div>
    </div>
  )
}
