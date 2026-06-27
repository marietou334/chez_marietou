import { useState } from 'react'

const AVIS = [
  { nom: 'Jeanneta K.', note: 5, commentaire: 'Livraison super rapide ! La robe est magnifique, exactement comme sur la photo. Je recommande vraiment !', produit: 'Robe Wax', date: 'Il y a 2 jours' },
  { nom: 'Fatou B.', note: 5, commentaire: 'Le paiement Orange Money est trop simple. Les produits sont de qualité. Chez Mariétou c\'est ma boutique préférée !', produit: 'Kit Beauté', date: 'Il y a 5 jours' },
  { nom: 'Ibrahim S.', note: 4, commentaire: 'Très bon service. L\'assistante Jeanne m\'a bien guidé pour choisir ma taille. Chaussures parfaites !', produit: 'Chaussures Nike', date: 'Il y a 1 semaine' },
  { nom: 'Mariam O.', note: 5, commentaire: 'J\'adore ! Commande reçue en moins de 24h à Ouagadougou. Le sac est encore plus beau en vrai !', produit: 'Sac à Main', date: 'Il y a 2 semaines' },
]

function Etoiles({ note }: { note: number }) {
  return (
    <div style={{ display: 'flex', gap: '2px' }}>
      {[1,2,3,4,5].map(i => (
        <span key={i} style={{
          fontSize: '14px',
          color: i <= note ? '#D4AF37' : '#E0E0E0',
        }}>★</span>
      ))}
    </div>
  )
}

export default function AvisClients() {
  const [actif, setActif] = useState(0)

  return (
    <section style={{ padding: '60px 40px', background: 'white' }}>
      <p style={{
        textAlign: 'center', fontSize: '12px', fontWeight: 700,
        letterSpacing: '0.15em', color: 'var(--or)',
        marginBottom: '8px', textTransform: 'uppercase',
      }}>Témoignages</p>
      <h2 style={{
        fontFamily: 'Playfair Display, serif',
        fontSize: '32px', fontWeight: 700,
        color: 'var(--terracotta)',
        textAlign: 'center', marginBottom: '8px',
      }}>⭐ Ce que disent nos clients</h2>
      <p style={{ textAlign: 'center', color: '#888', marginBottom: '40px' }}>
        Plus de 500 clients satisfaits au Burkina Faso
      </p>

      {/* Note globale */}
      <div style={{
        display: 'flex', justifyContent: 'center',
        gap: '40px', marginBottom: '40px', flexWrap: 'wrap',
      }}>
        {[
          { chiffre: '4.9', label: 'Note moyenne' },
          { chiffre: '500+', label: 'Avis clients' },
          { chiffre: '98%', label: 'Satisfaits' },
        ].map(s => (
          <div key={s.label} style={{ textAlign: 'center' }}>
            <div style={{
              fontFamily: 'Playfair Display, serif',
              fontSize: '36px', fontWeight: 700,
              color: 'var(--terracotta)',
            }}>{s.chiffre}</div>
            <div style={{ fontSize: '13px', color: '#888' }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Avis */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
        gap: '20px', maxWidth: '1100px', margin: '0 auto',
      }}>
        {AVIS.map((avis, i) => (
          <div key={i} style={{
            background: i === actif ? 'linear-gradient(135deg, #FFF8F0, #FFE8C0)' : '#FAFAFA',
            borderRadius: '20px',
            padding: '24px',
            border: i === actif ? '2px solid rgba(212,175,55,0.4)' : '1px solid rgba(0,0,0,0.06)',
            transition: 'all 0.3s ease',
            cursor: 'pointer',
          }} onClick={() => setActif(i)}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
              <Etoiles note={avis.note} />
              <span style={{ fontSize: '11px', color: '#aaa' }}>{avis.date}</span>
            </div>
            <p style={{
              fontSize: '14px', color: '#555',
              lineHeight: 1.7, marginBottom: '16px',
              fontStyle: 'italic',
            }}>"{avis.commentaire}"</p>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{
                width: '36px', height: '36px', borderRadius: '50%',
                background: 'linear-gradient(135deg, #D4AF37, #C45C26)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: 'white', fontWeight: 700, fontSize: '14px',
              }}>{avis.nom[0]}</div>
              <div>
                <p style={{ fontWeight: 700, fontSize: '13px', color: 'var(--sombre)' }}>{avis.nom}</p>
                <p style={{ fontSize: '11px', color: '#aaa' }}>A acheté : {avis.produit}</p>
              </div>
              <span style={{
                marginLeft: 'auto', fontSize: '11px',
                color: '#2D6A4F', fontWeight: 600,
              }}>✅ Achat vérifié</span>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
