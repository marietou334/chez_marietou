import { useEffect, useState, useRef } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'
import CarteProduit from '../components/CarteProduit'

const CATEGORIES = [
  { icone: '👗', nom: 'Mode', couleur: '#FF6B9D' },
  { icone: '💄', nom: 'Beauté', couleur: '#FF8C69' },
  { icone: '🏠', nom: 'Maison', couleur: '#4ECDC4' },
  { icone: '📱', nom: 'Électronique', couleur: '#45B7D1' },
  { icone: '🍎', nom: 'Alimentation', couleur: '#96CEB4' },
  { icone: '🧸', nom: 'Jouets', couleur: '#FFEAA7' },
  { icone: '⚽', nom: 'Sport', couleur: '#DDA0DD' },
  { icone: '💊', nom: 'Santé', couleur: '#98FB98' },
]

const BANNIERES = [
  {
    titre: 'Nouveautés Mode',
    sous_titre: 'Les dernières tendances africaines',
    couleur: 'linear-gradient(135deg, #C45C26 0%, #E07030 50%, #D4AF37 100%)',
    emoji: '👗✨',
  },
  {
    titre: 'Offre Flash !',
    sous_titre: 'Jusqu\'à -50% sur la beauté',
    couleur: 'linear-gradient(135deg, #2D6A4F 0%, #40916C 50%, #D4AF37 100%)',
    emoji: '💄🔥',
  },
  {
    titre: 'Électronique',
    sous_titre: 'Smartphones, TV, accessoires',
    couleur: 'linear-gradient(135deg, #1A0A00 0%, #3D1F00 50%, #C45C26 100%)',
    emoji: '📱💻',
  },
]

export default function Accueil({ avisClients }: { avisClients?: React.ReactNode }) {
  const [produits, setProduits] = useState([])
  const [banniere, setBanniere] = useState(0)
  const [messageIA, setMessageIA] = useState('')
  const [inputIA, setInputIA] = useState('')
  const [chargement, setChargement] = useState(false)
  const [panier, setPanier] = useState<string[]>([])
  const [offreFlash, setOffreFlash] = useState({ h: 2, m: 45, s: 30 })

  useEffect(() => {
    axios.get('http://localhost:8000/catalogue/')
      .then(res => setProduits(res.data.produits))
      .catch(() => {})
  }, [])

  // Défilement bannières
  useEffect(() => {
    const timer = setInterval(() => {
      setBanniere(prev => (prev + 1) % BANNIERES.length)
    }, 4000)
    return () => clearInterval(timer)
  }, [])

  // Compte à rebours offre flash
  useEffect(() => {
    const timer = setInterval(() => {
      setOffreFlash(prev => {
        if (prev.s > 0) return { ...prev, s: prev.s - 1 }
        if (prev.m > 0) return { ...prev, m: prev.m - 1, s: 59 }
        if (prev.h > 0) return { h: prev.h - 1, m: 59, s: 59 }
        return { h: 3, m: 0, s: 0 }
      })
    }, 1000)
    return () => clearInterval(timer)
  }, [])

  const parlerIA = async () => {
    if (!inputIA.trim()) return
    setChargement(true)
    try {
      const res = await axios.post('http://localhost:8000/ia/client', { message: inputIA })
      setMessageIA(res.data.reponse)
    } catch {
      setMessageIA("Désolée, je suis momentanément indisponible. Contactez-nous sur WhatsApp !")
    }
    setChargement(false)
    setInputIA('')
  }

  const pad = (n: number) => String(n).padStart(2, '0')

  return (
    <div style={{ paddingTop: '130px' }}>

      {/* HERO BANNIÈRE */}
      <section style={{ position: 'relative', overflow: 'hidden', height: '420px' }}>
        {BANNIERES.map((b, i) => (
          <div key={i} style={{
            position: 'absolute', inset: 0,
            background: b.couleur,
            opacity: i === banniere ? 1 : 0,
            transition: 'opacity 0.8s ease',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '0 80px',
          }}>
            <div>
              <p style={{
                fontSize: '13px', fontWeight: 700,
                letterSpacing: '0.15em', color: 'rgba(255,255,255,0.7)',
                marginBottom: '12px', textTransform: 'uppercase',
              }}>Chez Mariétou — Exclusivité</p>
              <h1 style={{
                fontFamily: 'Playfair Display, serif',
                fontSize: 'clamp(36px, 6vw, 72px)',
                fontWeight: 700, color: 'white',
                lineHeight: 1.1, marginBottom: '16px',
              }}>{b.titre}</h1>
              <p style={{
                fontSize: '18px', color: 'rgba(255,255,255,0.8)',
                marginBottom: '32px',
              }}>{b.sous_titre}</p>
              <Link to="/boutique" style={{
                background: 'white',
                color: '#C45C26',
                padding: '14px 32px',
                borderRadius: '50px',
                textDecoration: 'none',
                fontWeight: 700,
                fontSize: '15px',
                display: 'inline-block',
                boxShadow: '0 8px 30px rgba(0,0,0,0.2)',
              }}>
                Découvrir →
              </Link>
            </div>
            <div style={{
              fontSize: 'clamp(80px, 15vw, 160px)',
              animation: 'flottant 3s ease-in-out infinite',
              filter: 'drop-shadow(0 20px 40px rgba(0,0,0,0.3))',
            }}>{b.emoji}</div>
          </div>
        ))}

        {/* Points navigation */}
        <div style={{
          position: 'absolute', bottom: '20px', left: '50%',
          transform: 'translateX(-50%)',
          display: 'flex', gap: '8px',
        }}>
          {BANNIERES.map((_, i) => (
            <button key={i} onClick={() => setBanniere(i)} style={{
              width: i === banniere ? '24px' : '8px',
              height: '8px',
              borderRadius: '50px',
              background: i === banniere ? 'white' : 'rgba(255,255,255,0.4)',
              border: 'none', cursor: 'pointer',
              transition: 'all 0.3s ease',
            }} />
          ))}
        </div>
      </section>

      {/* OFFRE FLASH */}
      <section style={{
        background: 'linear-gradient(135deg, #1A0A00, #3D1F00)',
        padding: '20px 40px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '16px',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <span style={{ fontSize: '32px' }}>⚡</span>
          <div>
            <p style={{ color: 'var(--or)', fontWeight: 700, fontSize: '16px' }}>OFFRE FLASH</p>
            <p style={{ color: 'rgba(255,248,240,0.6)', fontSize: '13px' }}>Se termine dans :</p>
          </div>
          <div style={{ display: 'flex', gap: '8px' }}>
            {[
              { val: pad(offreFlash.h), label: 'h' },
              { val: pad(offreFlash.m), label: 'm' },
              { val: pad(offreFlash.s), label: 's' },
            ].map((t, i) => (
              <div key={i} style={{ textAlign: 'center' }}>
                <div style={{
                  background: 'var(--or)',
                  color: 'var(--sombre)',
                  fontWeight: 800,
                  fontSize: '22px',
                  padding: '8px 12px',
                  borderRadius: '8px',
                  fontFamily: 'monospace',
                  minWidth: '44px',
                }}>{t.val}</div>
                <div style={{ color: 'rgba(255,248,240,0.5)', fontSize: '10px', marginTop: '4px' }}>{t.label}</div>
              </div>
            ))}
          </div>
        </div>
        <Link to="/boutique?offre=flash" className="btn-or">
          Voir les offres flash ⚡
        </Link>
      </section>

      {/* CATÉGORIES */}
      <section style={{ padding: '60px 40px', background: 'white' }}>
        <h2 style={{
          fontFamily: 'Playfair Display, serif',
          fontSize: '32px', fontWeight: 700,
          color: 'var(--terracotta)',
          marginBottom: '8px',
        }}>Nos catégories</h2>
        <p style={{ color: '#888', marginBottom: '36px', fontSize: '15px' }}>
          Trouvez exactement ce que vous cherchez
        </p>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))',
          gap: '16px',
        }}>
          {CATEGORIES.map(cat => (
            <Link key={cat.nom} to={`/boutique?cat=${cat.nom}`} style={{
              textDecoration: 'none',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '10px',
              padding: '20px 12px',
              borderRadius: '20px',
              background: `${cat.couleur}15`,
              border: `1px solid ${cat.couleur}30`,
              transition: 'all 0.3s ease',
              cursor: 'pointer',
            }}
              onMouseEnter={e => {
                (e.currentTarget as HTMLAnchorElement).style.transform = 'translateY(-8px)'
                ;(e.currentTarget as HTMLAnchorElement).style.boxShadow = `0 16px 32px ${cat.couleur}30`
                ;(e.currentTarget as HTMLAnchorElement).style.background = `${cat.couleur}25`
              }}
              onMouseLeave={e => {
                (e.currentTarget as HTMLAnchorElement).style.transform = 'translateY(0)'
                ;(e.currentTarget as HTMLAnchorElement).style.boxShadow = 'none'
                ;(e.currentTarget as HTMLAnchorElement).style.background = `${cat.couleur}15`
              }}
            >
              <span style={{ fontSize: '40px' }}>{cat.icone}</span>
              <span style={{
                fontSize: '13px', fontWeight: 600,
                color: 'var(--sombre)', textAlign: 'center',
              }}>{cat.nom}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* PRODUITS TENDANCES */}
      <section style={{ padding: '60px 40px', background: 'var(--creme)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '36px' }}>
          <div>
            <p style={{
              fontSize: '12px', fontWeight: 700,
              letterSpacing: '0.15em', color: 'var(--or)',
              marginBottom: '6px', textTransform: 'uppercase',
            }}>Cette semaine</p>
            <h2 style={{
              fontFamily: 'Playfair Display, serif',
              fontSize: '32px', fontWeight: 700,
              color: 'var(--terracotta)',
            }}>🔥 Tendances du moment</h2>
          </div>
          <Link to="/boutique" className="btn-or" style={{ fontSize: '13px', padding: '10px 24px' }}>
            Voir tout →
          </Link>
        </div>

        {produits.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px' }}>
            <div style={{ fontSize: '80px', marginBottom: '20px' }} className="animate-brillant">🛍️</div>
            <p style={{ fontSize: '20px', color: '#888' }}>Produits bientôt disponibles !</p>
            <p style={{ color: '#aaa', marginTop: '8px' }}>Mariétou prépare de belles surprises pour vous</p>
          </div>
        ) : (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
            gap: '24px',
          }}>
            {produits.slice(0, 8).map((p: any) => (
              <CarteProduit key={p.id} produit={p} onAjouter={(id) => setPanier(prev => [...prev, id])} />
            ))}
          </div>
        )}
      </section>

      {/* PAIEMENTS */}
      <section style={{
        padding: '60px 40px',
        background: 'white',
        textAlign: 'center',
      }}>
        <h2 style={{
          fontFamily: 'Playfair Display, serif',
          fontSize: '28px', fontWeight: 700,
          color: 'var(--terracotta)', marginBottom: '8px',
        }}>Modes de paiement acceptés</h2>
        <p style={{ color: '#888', marginBottom: '36px' }}>Simple, rapide et sécurisé</p>
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          gap: '24px',
          flexWrap: 'wrap',
        }}>
          {[
            { icone: '🟠', nom: 'Orange Money', dispo: true },
            { icone: '🌊', nom: 'Wave', dispo: true },
            { icone: '🔵', nom: 'Moov Money', dispo: true },
            { icone: '💳', nom: 'Carte Bancaire', dispo: false, delai: '29 jours' },
          ].map(p => (
            <div key={p.nom} style={{
              padding: '20px 28px',
              borderRadius: '20px',
              border: `2px solid ${p.dispo ? 'rgba(212,175,55,0.3)' : 'rgba(0,0,0,0.1)'}`,
              background: p.dispo ? 'rgba(212,175,55,0.05)' : '#f9f9f9',
              minWidth: '160px',
              opacity: p.dispo ? 1 : 0.6,
            }}>
              <div style={{ fontSize: '36px', marginBottom: '8px' }}>{p.icone}</div>
              <div style={{ fontWeight: 700, fontSize: '14px', marginBottom: '4px' }}>{p.nom}</div>
              <div style={{
                fontSize: '12px',
                color: p.dispo ? '#2D6A4F' : '#888',
                fontWeight: 500,
              }}>
                {p.dispo ? '✅ Disponible' : `⏳ Dans ${p.delai}`}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* IA */}
      <section style={{
        padding: '80px 40px',
        background: 'linear-gradient(135deg, #1A3A2A 0%, #2D6A4F 100%)',
        textAlign: 'center',
      }}>
        <div style={{ fontSize: '56px', marginBottom: '20px' }} className="animate-flottant">🤖</div>
        <p style={{
          fontSize: '11px', fontWeight: 700, letterSpacing: '0.2em',
          color: 'rgba(212,175,55,0.8)', marginBottom: '10px', textTransform: 'uppercase',
        }}>Powered by Groq AI</p>
        <h2 style={{
          fontFamily: 'Playfair Display, serif',
          fontSize: 'clamp(28px, 5vw, 44px)',
          fontWeight: 700, color: 'white', marginBottom: '14px',
        }}>Notre assistante est là pour vous</h2>
        <p style={{
          color: 'rgba(255,255,255,0.6)',
          marginBottom: '40px', fontSize: '16px',
          maxWidth: '500px', margin: '0 auto 40px',
        }}>
          Posez vos questions sur les produits, la livraison ou le paiement — réponse instantanée !
        </p>

        {messageIA && (
          <div style={{
            background: 'rgba(255,255,255,0.1)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(255,255,255,0.15)',
            borderRadius: '20px',
            padding: '20px 24px',
            marginBottom: '20px',
            maxWidth: '600px',
            margin: '0 auto 20px',
            color: 'white',
            textAlign: 'left',
            lineHeight: 1.7,
            fontSize: '15px',
          }}>
            <span style={{ color: 'var(--or)', fontWeight: 700 }}>🤖 </span>{messageIA}
          </div>
        )}

        <div style={{
          display: 'flex', gap: '12px',
          maxWidth: '600px', margin: '0 auto',
        }}>
          <input
            type="text"
            value={inputIA}
            onChange={e => setInputIA(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && parlerIA()}
            placeholder="Ex: Avez-vous des chaussures taille 42 ?"
            style={{
              flex: 1,
              padding: '16px 24px',
              borderRadius: '50px',
              border: '2px solid rgba(212,175,55,0.3)',
              background: 'rgba(255,255,255,0.95)',
              fontSize: '15px',
              outline: 'none',
            }}
          />
          <button onClick={parlerIA} disabled={chargement} className="btn-or">
            {chargement ? '⏳' : '✉️'}
          </button>
        </div>
      </section>

      {avisClients}{/* FOOTER */}
      <footer style={{
        background: 'var(--sombre)',
        padding: '60px 40px 32px',
        color: 'var(--creme)',
      }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
          gap: '40px',
          marginBottom: '48px',
          maxWidth: '1100px',
          margin: '0 auto 48px',
        }}>
          <div>
            <p style={{
              fontFamily: 'Playfair Display, serif',
              fontSize: '24px', color: 'var(--or)',
              marginBottom: '12px',
            }}>✨ Chez Mariétou</p>
            <p style={{ color: 'rgba(255,248,240,0.5)', fontSize: '14px', lineHeight: 1.7 }}>
              Votre boutique de confiance au Burkina Faso. Qualité, rapidité et sourire garanti.
            </p>
          </div>
          <div>
            <p style={{ fontWeight: 700, marginBottom: '16px', color: 'var(--or)' }}>Navigation</p>
            {['Accueil', 'Boutique', 'Tendances', 'Contact'].map(l => (
              <Link key={l} to="/" style={{
                display: 'block', color: 'rgba(255,248,240,0.5)',
                textDecoration: 'none', fontSize: '14px',
                marginBottom: '8px', transition: 'color 0.2s',
              }}
                onMouseEnter={e => (e.currentTarget as HTMLAnchorElement).style.color = 'var(--or)'}
                onMouseLeave={e => (e.currentTarget as HTMLAnchorElement).style.color = 'rgba(255,248,240,0.5)'}
              >{l}</Link>
            ))}
          </div>
          <div>
            <p style={{ fontWeight: 700, marginBottom: '16px', color: 'var(--or)' }}>Paiement</p>
            {['Orange Money', 'Wave', 'Moov Money', 'Carte (bientôt)'].map(p => (
              <p key={p} style={{
                color: 'rgba(255,248,240,0.5)',
                fontSize: '14px', marginBottom: '8px',
              }}>{p}</p>
            ))}
          </div>
          <div>
            <p style={{ fontWeight: 700, marginBottom: '16px', color: 'var(--or)' }}>Contact</p>
            <p style={{ color: 'rgba(255,248,240,0.5)', fontSize: '14px', marginBottom: '8px' }}>
              📍 Ouagadougou, Burkina Faso
            </p>
            <p style={{ color: 'rgba(255,248,240,0.5)', fontSize: '14px', marginBottom: '8px' }}>
              📧 chezmarietou@gmail.com
            </p>
            <a href="https://wa.me/22600000000" style={{
              color: '#25D366', fontSize: '14px',
              textDecoration: 'none', display: 'block',
            }}>📱 WhatsApp</a>
          </div>
        </div>
        <div style={{
          borderTop: '1px solid rgba(255,248,240,0.08)',
          paddingTop: '24px',
          textAlign: 'center',
          fontSize: '12px',
          color: 'rgba(255,248,240,0.25)',
        }}>
          © 2026 Chez Mariétou — Tous droits réservés | Burkina Faso 🇧🇫
        </div>
      </footer>
    </div>
  )
}
// Export déjà fait — fichier mis à jour via App.tsx
