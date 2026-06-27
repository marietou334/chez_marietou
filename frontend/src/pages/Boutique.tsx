import { useEffect, useState } from 'react'
import axios from 'axios'

export default function Boutique() {
  const [produits, setProduits] = useState([])
  const [filtre, setFiltre] = useState('Tous')
  const categories = ['Tous', 'Vetements', 'Accessoires', 'Beauté', 'Maison']

  useEffect(() => {
    axios.get('http://localhost:8000/catalogue/')
      .then(res => setProduits(res.data.produits))
      .catch(() => {})
  }, [])

  const produitsFiltres = filtre === 'Tous'
    ? produits
    : produits.filter((p: any) => p.categorie === filtre)

  return (
    <div className="pt-24 min-h-screen px-6 pb-20" style={{background: 'var(--creme)'}}>
      <h1 className="titre-elegant text-4xl font-bold text-center mb-4" style={{color: 'var(--terracotta)'}}>
        🛍️ Notre Boutique
      </h1>
      <p className="text-center text-gray-500 mb-10">Tous nos produits sélectionnés avec soin</p>

      {/* Filtres */}
      <div className="flex gap-3 justify-center flex-wrap mb-12">
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => setFiltre(cat)}
            className={`px-6 py-2 rounded-full font-medium transition-all ${
              filtre === cat ? 'btn-or' : 'glass'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Produits */}
      {produitsFiltres.length === 0 ? (
        <div className="text-center py-20">
          <div className="text-7xl mb-6 animate-brillant">🛍️</div>
          <p className="text-gray-500 text-lg">Aucun produit pour l'instant</p>
          <p className="text-gray-400">Revenez bientôt !</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 max-w-7xl mx-auto">
          {produitsFiltres.map((p: any) => (
            <div key={p.id} className="carte-produit">
              <div className="h-48 flex items-center justify-center text-7xl"
                style={{background: 'linear-gradient(135deg, #FFF0DC, #FFE0B0)'}}>
                🛍️
              </div>
              <div className="p-5">
                <span className="text-xs px-3 py-1 rounded-full font-medium mb-3 inline-block"
                  style={{background: 'rgba(212,175,55,0.15)', color: 'var(--terracotta)'}}>
                  {p.categorie}
                </span>
                <h3 className="font-bold text-lg mb-2">{p.nom}</h3>
                <p className="text-gray-500 text-sm mb-4 line-clamp-2">{p.description}</p>
                <div className="flex justify-between items-center">
                  <span className="font-bold text-xl" style={{color: 'var(--terracotta)'}}>
                    {p.prix_fcfa.toLocaleString()} FCFA
                  </span>
                  {p.stock > 0
                    ? <span className="text-xs text-green-600">✅ En stock</span>
                    : <span className="text-xs text-red-500">❌ Épuisé</span>
                  }
                </div>
                <button className="btn-terracotta w-full mt-4 text-sm">
                  🛒 Ajouter au panier
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
