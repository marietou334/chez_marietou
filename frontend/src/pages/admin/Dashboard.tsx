import { useState, useEffect } from 'react'
import axios from 'axios'

const STATS = [
  { icone: '💰', label: 'Revenus aujourd\'hui', valeur: '45 000 FCFA', hausse: '+12%' },
  { icone: '🛒', label: 'Commandes', valeur: '8', hausse: '+3' },
  { icone: '👥', label: 'Clients actifs', valeur: '124', hausse: '+5' },
  { icone: '📦', label: 'Produits en stock', valeur: '47', hausse: '-2' },
]

export default function Dashboard() {
  const [onglet, setOnglet] = useState('accueil')
  const [produits, setProduits] = useState([])
  const [commandes, setCommandes] = useState([
    { id: '#001', client: 'Aminata K.', produit: 'Robe wax', montant: 15000, statut: 'en_attente', paiement: 'Orange Money' },
    { id: '#002', client: 'Fatou B.', produit: 'Kit beauté', montant: 8500, statut: 'confirme', paiement: 'Wave' },
    { id: '#003', client: 'Ibrahim S.', produit: 'Chaussures Nike', montant: 32000, statut: 'livre', paiement: 'Moov Money' },
  ])
  const [messageIA, setMessageIA] = useState('')
  const [inputIA, setInputIA] = useState('')
  const [chargement, setChargement] = useState(false)
  const [nouveauProduit, setNouveauProduit] = useState({
    nom: '', description: '', prix_fcfa: '', categorie: 'Vetements', stock: ''
  })

  useEffect(() => {
    axios.get('http://localhost:8000/catalogue/')
      .then(res => setProduits(res.data.produits))
      .catch(() => {})
  }, [])

  const parlerIA = async () => {
    if (!inputIA.trim()) return
    setChargement(true)
    try {
      const res = await axios.post('http://localhost:8000/ia/marietou', {
        message: inputIA,
        utiliser_claude: false
      })
      setMessageIA(res.data.reponse)
    } catch {
      setMessageIA('Erreur de connexion.')
    }
    setChargement(false)
    setInputIA('')
  }

  const ajouterProduit = async () => {
    try {
      await axios.post('http://localhost:8000/catalogue/ajouter', {
        nom: nouveauProduit.nom,
        description: nouveauProduit.description,
        prix_fcfa: parseFloat(nouveauProduit.prix_fcfa),
        categorie: nouveauProduit.categorie,
        stock: parseInt(nouveauProduit.stock),
      })
      setNouveauProduit({ nom: '', description: '', prix_fcfa: '', categorie: 'Vetements', stock: '' })
      const res = await axios.get('http://localhost:8000/catalogue/')
      setProduits(res.data.produits)
      alert('✅ Produit ajouté avec succès !')
    } catch {
      alert('❌ Erreur lors de l\'ajout')
    }
  }

  const statutCouleur: Record<string, string> = {
    en_attente: '#E07030',
    confirme: '#2D6A4F',
    livre: '#D4AF37',
  }
  const statutLabel: Record<string, string> = {
    en_attente: '⏳ En attente',
    confirme: '✅ Confirmé',
    livre: '🚚 Livré',
  }

  const ONGLETS = [
    { id: 'accueil', icone: '🏠', label: 'Accueil' },
    { id: 'commandes', icone: '📦', label: 'Commandes' },
    { id: 'produits', icone: '🛍️', label: 'Produits' },
    { id: 'ia', icone: '🤖', label: 'Maria IA' },
    { id: 'paiements', icone: '💳', label: 'Paiements' },
  ]

  return (
    <div style={{
      minHeight: '100vh',
      background: '#F4F1EC',
      fontFamily: 'Inter, sans-serif',
    }}>

      {/* Header */}
      <div style={{
        background: 'linear-gradient(135deg, #1A0A00, #3D1F00)',
        padding: '20px 24px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
      }}>
        <div>
          <p style={{ color: 'rgba(212,175,55,0.7)', fontSize: '12px', marginBottom: '4px' }}>
            Tableau de bord
          </p>
          <h1 style={{
            fontFamily: 'Playfair Display, serif',
            color: 'var(--or)', fontSize: '22px', fontWeight: 700,
          }}>✨ Chez Mariétou</h1>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{
            width: '8px', height: '8px', borderRadius: '50%',
            background: '#4ADE80', animation: 'brillant 2s infinite',
          }} />
          <span style={{ color: 'rgba(255,255,255,0.7)', fontSize: '13px' }}>En ligne</span>
          <div style={{
            width: '36px', height: '36px', borderRadius: '50%',
            background: 'linear-gradient(135deg, #D4AF37, #F0C040)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '18px',
          }}>👩🏾</div>
        </div>
      </div>

      {/* Contenu */}
      <div style={{ padding: '24px', maxWidth: '1100px', margin: '0 auto' }}>

        {/* ACCUEIL */}
        {onglet === 'accueil' && (
          <div>
            <p style={{ fontSize: '14px', color: '#888', marginBottom: '20px' }}>
              Bonjour Mariétou 👋 Voici votre boutique aujourd'hui
            </p>

            {/* Stats */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
              gap: '16px', marginBottom: '28px',
            }}>
              {STATS.map(s => (
                <div key={s.label} style={{
                  background: 'white', borderRadius: '20px',
                  padding: '20px', boxShadow: '0 2px 16px rgba(0,0,0,0.06)',
                  border: '1px solid rgba(212,175,55,0.1)',
                }}>
                  <div style={{ fontSize: '32px', marginBottom: '8px' }}>{s.icone}</div>
                  <p style={{ fontSize: '12px', color: '#888', marginBottom: '4px' }}>{s.label}</p>
                  <p style={{ fontSize: '24px', fontWeight: 800, color: 'var(--sombre)', marginBottom: '4px' }}>
                    {s.valeur}
                  </p>
                  <p style={{
                    fontSize: '12px', fontWeight: 600,
                    color: s.hausse.startsWith('+') ? '#2D6A4F' : '#C45C26',
                  }}>{s.hausse} aujourd'hui</p>
                </div>
              ))}
            </div>

            {/* Actions rapides */}
            <h3 style={{ fontWeight: 700, marginBottom: '16px', color: 'var(--sombre)' }}>
              ⚡ Actions rapides
            </h3>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))',
              gap: '12px',
            }}>
              {[
                { icone: '➕', label: 'Ajouter produit', action: () => setOnglet('produits') },
                { icone: '📦', label: 'Voir commandes', action: () => setOnglet('commandes') },
                { icone: '🤖', label: 'Parler à Maria', action: () => setOnglet('ia') },
                { icone: '💳', label: 'Paiements', action: () => setOnglet('paiements') },
              ].map(a => (
                <button key={a.label} onClick={a.action} style={{
                  background: 'white', borderRadius: '16px',
                  padding: '20px 16px', border: '1px solid rgba(212,175,55,0.15)',
                  cursor: 'pointer', textAlign: 'center',
                  transition: 'all 0.2s ease',
                  boxShadow: '0 2px 12px rgba(0,0,0,0.05)',
                }}
                  onMouseEnter={e => {
                    (e.currentTarget as HTMLButtonElement).style.transform = 'translateY(-4px)'
                    ;(e.currentTarget as HTMLButtonElement).style.boxShadow = '0 8px 24px rgba(212,175,55,0.15)'
                  }}
                  onMouseLeave={e => {
                    (e.currentTarget as HTMLButtonElement).style.transform = 'translateY(0)'
                    ;(e.currentTarget as HTMLButtonElement).style.boxShadow = '0 2px 12px rgba(0,0,0,0.05)'
                  }}
                >
                  <div style={{ fontSize: '28px', marginBottom: '8px' }}>{a.icone}</div>
                  <p style={{ fontSize: '13px', fontWeight: 600, color: 'var(--sombre)' }}>{a.label}</p>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* COMMANDES */}
        {onglet === 'commandes' && (
          <div>
            <h2 style={{
              fontFamily: 'Playfair Display, serif',
              fontSize: '24px', fontWeight: 700,
              color: 'var(--terracotta)', marginBottom: '20px',
            }}>📦 Commandes</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {commandes.map(c => (
                <div key={c.id} style={{
                  background: 'white', borderRadius: '16px',
                  padding: '18px 20px',
                  boxShadow: '0 2px 12px rgba(0,0,0,0.05)',
                  border: '1px solid rgba(212,175,55,0.1)',
                  display: 'flex', alignItems: 'center',
                  justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px',
                }}>
                  <div>
                    <p style={{ fontWeight: 700, fontSize: '15px', marginBottom: '4px' }}>
                      {c.id} — {c.client}
                    </p>
                    <p style={{ fontSize: '13px', color: '#888' }}>{c.produit} • {c.paiement}</p>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <p style={{ fontWeight: 800, fontSize: '18px', color: 'var(--terracotta)', marginBottom: '6px' }}>
                      {c.montant.toLocaleString()} FCFA
                    </p>
                    <span style={{
                      padding: '4px 12px', borderRadius: '50px',
                      fontSize: '12px', fontWeight: 700,
                      background: `${statutCouleur[c.statut]}20`,
                      color: statutCouleur[c.statut],
                    }}>{statutLabel[c.statut]}</span>
                  </div>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button onClick={() => {
                      setCommandes(prev => prev.map(cmd =>
                        cmd.id === c.id ? { ...cmd, statut: 'confirme' } : cmd
                      ))
                    }} style={{
                      padding: '8px 16px', borderRadius: '50px',
                      background: 'linear-gradient(135deg, #2D6A4F, #40916C)',
                      color: 'white', border: 'none', cursor: 'pointer',
                      fontSize: '12px', fontWeight: 700,
                    }}>✅ Confirmer</button>
                    <button onClick={() => {
                      setCommandes(prev => prev.map(cmd =>
                        cmd.id === c.id ? { ...cmd, statut: 'livre' } : cmd
                      ))
                    }} style={{
                      padding: '8px 16px', borderRadius: '50px',
                      background: 'linear-gradient(135deg, #D4AF37, #F0C040)',
                      color: 'var(--sombre)', border: 'none', cursor: 'pointer',
                      fontSize: '12px', fontWeight: 700,
                    }}>🚚 Livré</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* PRODUITS */}
        {onglet === 'produits' && (
          <div>
            <h2 style={{
              fontFamily: 'Playfair Display, serif',
              fontSize: '24px', fontWeight: 700,
              color: 'var(--terracotta)', marginBottom: '20px',
            }}>🛍️ Mes produits</h2>

            {/* Formulaire ajout */}
            <div style={{
              background: 'white', borderRadius: '20px',
              padding: '24px', marginBottom: '24px',
              boxShadow: '0 2px 16px rgba(0,0,0,0.06)',
              border: '1px solid rgba(212,175,55,0.15)',
            }}>
              <h3 style={{ fontWeight: 700, marginBottom: '16px', color: 'var(--sombre)' }}>
                ➕ Ajouter un produit
              </h3>
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
                gap: '12px', marginBottom: '16px',
              }}>
                {[
                  { key: 'nom', label: 'Nom du produit', type: 'text' },
                  { key: 'prix_fcfa', label: 'Prix (FCFA)', type: 'number' },
                  { key: 'stock', label: 'Stock disponible', type: 'number' },
                ].map(f => (
                  <div key={f.key}>
                    <label style={{ fontSize: '12px', fontWeight: 600, color: '#888', display: 'block', marginBottom: '6px' }}>
                      {f.label}
                    </label>
                    <input
                      type={f.type}
                      value={(nouveauProduit as any)[f.key]}
                      onChange={e => setNouveauProduit(prev => ({ ...prev, [f.key]: e.target.value }))}
                      style={{
                        width: '100%', padding: '10px 14px',
                        borderRadius: '12px',
                        border: '1.5px solid rgba(212,175,55,0.2)',
                        outline: 'none', fontSize: '14px',
                        background: '#FAFAFA',
                      }}
                    />
                  </div>
                ))}
                <div>
                  <label style={{ fontSize: '12px', fontWeight: 600, color: '#888', display: 'block', marginBottom: '6px' }}>
                    Catégorie
                  </label>
                  <select
                    value={nouveauProduit.categorie}
                    onChange={e => setNouveauProduit(prev => ({ ...prev, categorie: e.target.value }))}
                    style={{
                      width: '100%', padding: '10px 14px',
                      borderRadius: '12px',
                      border: '1.5px solid rgba(212,175,55,0.2)',
                      outline: 'none', fontSize: '14px',
                      background: '#FAFAFA',
                    }}
                  >
                    {['Vetements', 'Beauté', 'Maison', 'Electronique', 'Alimentation', 'Jouets', 'Sport', 'Accessoires'].map(c => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div style={{ marginBottom: '16px' }}>
                <label style={{ fontSize: '12px', fontWeight: 600, color: '#888', display: 'block', marginBottom: '6px' }}>
                  Description
                </label>
                <textarea
                  value={nouveauProduit.description}
                  onChange={e => setNouveauProduit(prev => ({ ...prev, description: e.target.value }))}
                  rows={3}
                  style={{
                    width: '100%', padding: '10px 14px',
                    borderRadius: '12px',
                    border: '1.5px solid rgba(212,175,55,0.2)',
                    outline: 'none', fontSize: '14px',
                    background: '#FAFAFA', resize: 'vertical',
                    fontFamily: 'Inter, sans-serif',
                  }}
                />
              </div>
              <button onClick={ajouterProduit} style={{
                padding: '14px 32px', borderRadius: '50px',
                background: 'linear-gradient(135deg, #C45C26, #E07030)',
                color: 'white', border: 'none', cursor: 'pointer',
                fontWeight: 700, fontSize: '15px',
                boxShadow: '0 4px 16px rgba(196,92,38,0.3)',
              }}>
                ➕ Ajouter le produit
              </button>
            </div>

            {/* Liste produits */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {produits.map((p: any) => (
                <div key={p.id} style={{
                  background: 'white', borderRadius: '16px',
                  padding: '16px 20px',
                  display: 'flex', alignItems: 'center',
                  justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px',
                  boxShadow: '0 2px 12px rgba(0,0,0,0.05)',
                  border: '1px solid rgba(212,175,55,0.1)',
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                    <div style={{
                      width: '48px', height: '48px', borderRadius: '12px',
                      background: 'linear-gradient(135deg, #FFF8F0, #FFE8C0)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: '24px',
                    }}>🛍️</div>
                    <div>
                      <p style={{ fontWeight: 700, fontSize: '15px', marginBottom: '2px' }}>{p.nom}</p>
                      <p style={{ fontSize: '12px', color: '#888' }}>{p.categorie} • Stock: {p.stock}</p>
                    </div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                    <span style={{ fontWeight: 800, fontSize: '18px', color: 'var(--terracotta)' }}>
                      {p.prix_fcfa.toLocaleString()} FCFA
                    </span>
                    <button style={{
                      padding: '8px 16px', borderRadius: '50px',
                      background: 'rgba(196,92,38,0.1)',
                      color: 'var(--terracotta)',
                      border: '1px solid rgba(196,92,38,0.2)',
                      cursor: 'pointer', fontSize: '12px', fontWeight: 700,
                    }}>✏️ Modifier</button>
                  </div>
                </div>
              ))}
              {produits.length === 0 && (
                <div style={{ textAlign: 'center', padding: '40px', color: '#888' }}>
                  <div style={{ fontSize: '48px', marginBottom: '12px' }}>📦</div>
                  <p>Aucun produit. Ajoutez votre premier produit !</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* IA MARIA */}
        {onglet === 'ia' && (
          <div>
            <h2 style={{
              fontFamily: 'Playfair Display, serif',
              fontSize: '24px', fontWeight: 700,
              color: 'var(--terracotta)', marginBottom: '8px',
            }}>🤖 Maria — Votre assistante IA</h2>
            <p style={{ color: '#888', marginBottom: '24px', fontSize: '14px' }}>
              Confiez vos tâches à Maria. Elle gère, analyse et vous conseille.
            </p>

            {/* Suggestions tâches */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
              gap: '12px', marginBottom: '24px',
            }}>
              {[
                '📊 Analyse mes ventes d\'aujourd\'hui',
                '📢 Rédige une promo pour WhatsApp',
                '📦 Quels produits sont en rupture ?',
                '💡 Donne-moi des idées de produits tendance',
                '📱 Rédige un message pour mes clients',
                '🎯 Analyse les produits les plus vendus',
              ].map(t => (
                <button key={t} onClick={() => setInputIA(t)} style={{
                  padding: '12px 16px', borderRadius: '14px',
                  background: 'white', border: '1px solid rgba(212,175,55,0.2)',
                  cursor: 'pointer', textAlign: 'left', fontSize: '13px',
                  fontWeight: 500, color: 'var(--sombre)',
                  transition: 'all 0.2s',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
                }}
                  onMouseEnter={e => {
                    (e.currentTarget as HTMLButtonElement).style.background = 'rgba(212,175,55,0.08)'
                    ;(e.currentTarget as HTMLButtonElement).style.transform = 'translateY(-2px)'
                  }}
                  onMouseLeave={e => {
                    (e.currentTarget as HTMLButtonElement).style.background = 'white'
                    ;(e.currentTarget as HTMLButtonElement).style.transform = 'translateY(0)'
                  }}
                >{t}</button>
              ))}
            </div>

            {messageIA && (
              <div style={{
                background: 'white', borderRadius: '20px',
                padding: '20px 24px', marginBottom: '16px',
                border: '1px solid rgba(212,175,55,0.2)',
                boxShadow: '0 4px 16px rgba(0,0,0,0.06)',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
                  <div style={{
                    width: '32px', height: '32px', borderRadius: '50%',
                    background: 'linear-gradient(135deg, #D4AF37, #F0C040)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '16px',
                  }}>🤖</div>
                  <span style={{ fontWeight: 700, color: 'var(--sombre)' }}>Maria</span>
                </div>
                <p style={{ fontSize: '14px', color: '#555', lineHeight: 1.7 }}>{messageIA}</p>
              </div>
            )}

            <div style={{ display: 'flex', gap: '12px' }}>
              <input
                type="text"
                value={inputIA}
                onChange={e => setInputIA(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && parlerIA()}
                placeholder="Demandez quelque chose à Maria..."
                style={{
                  flex: 1, padding: '14px 20px',
                  borderRadius: '50px',
                  border: '2px solid rgba(212,175,55,0.25)',
                  outline: 'none', fontSize: '14px',
                  background: 'white',
                }}
              />
              <button onClick={parlerIA} disabled={chargement} style={{
                padding: '14px 28px', borderRadius: '50px',
                background: 'linear-gradient(135deg, #C45C26, #E07030)',
                color: 'white', border: 'none', cursor: 'pointer',
                fontWeight: 700, fontSize: '14px',
              }}>
                {chargement ? '⏳' : '✉️ Envoyer'}
              </button>
            </div>
          </div>
        )}

        {/* PAIEMENTS */}
        {onglet === 'paiements' && (
          <div>
            <h2 style={{
              fontFamily: 'Playfair Display, serif',
              fontSize: '24px', fontWeight: 700,
              color: 'var(--terracotta)', marginBottom: '20px',
            }}>💳 Paiements reçus</h2>

            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
              gap: '16px', marginBottom: '28px',
            }}>
              {[
                { icone: '🟠', nom: 'Orange Money', montant: '28 500', nb: 4 },
                { icone: '🌊', nom: 'Wave', montant: '15 000', nb: 2 },
                { icone: '🔵', nom: 'Moov Money', montant: '8 500', nb: 1 },
                { icone: '💳', nom: 'Carte', montant: '0', nb: 0, bientot: true },
              ].map(p => (
                <div key={p.nom} style={{
                  background: 'white', borderRadius: '20px',
                  padding: '20px',
                  boxShadow: '0 2px 12px rgba(0,0,0,0.05)',
                  border: '1px solid rgba(212,175,55,0.1)',
                  opacity: p.bientot ? 0.6 : 1,
                }}>
                  <div style={{ fontSize: '32px', marginBottom: '8px' }}>{p.icone}</div>
                  <p style={{ fontSize: '13px', color: '#888', marginBottom: '4px' }}>{p.nom}</p>
                  <p style={{ fontSize: '22px', fontWeight: 800, color: 'var(--terracotta)', marginBottom: '4px' }}>
                    {p.montant} FCFA
                  </p>
                  <p style={{ fontSize: '12px', color: '#aaa' }}>
                    {p.bientot ? '⏳ Bientôt disponible' : `${p.nb} transaction${p.nb > 1 ? 's' : ''}`}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Navigation bas (mobile) */}
      <div style={{
        position: 'fixed', bottom: 0, left: 0, right: 0,
        background: 'white',
        borderTop: '1px solid rgba(212,175,55,0.15)',
        display: 'flex', justifyContent: 'space-around',
        padding: '10px 0', zIndex: 1000,
        boxShadow: '0 -4px 20px rgba(0,0,0,0.08)',
      }}>
        {ONGLETS.map(o => (
          <button key={o.id} onClick={() => setOnglet(o.id)} style={{
            display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px',
            background: 'none', border: 'none', cursor: 'pointer',
            padding: '4px 12px',
            color: onglet === o.id ? 'var(--terracotta)' : '#aaa',
            transition: 'color 0.2s',
          }}>
            <span style={{
              fontSize: '22px',
              transform: onglet === o.id ? 'scale(1.2)' : 'scale(1)',
              transition: 'transform 0.2s',
            }}>{o.icone}</span>
            <span style={{ fontSize: '10px', fontWeight: onglet === o.id ? 700 : 400 }}>
              {o.label}
            </span>
          </button>
        ))}
      </div>

      <div style={{ height: '80px' }} />
    </div>
  )
}
