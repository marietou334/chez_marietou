from fastapi import APIRouter, Request, HTTPException
from slowapi import Limiter
from slowapi.util import get_remote_address
from pydantic import BaseModel
from typing import Optional
import uuid
from datetime import datetime

limiter = Limiter(key_func=get_remote_address)
router = APIRouter(prefix="/catalogue", tags=["Catalogue"])

class Produit(BaseModel):
    nom: str
    description: str
    prix_fcfa: float
    categorie: str
    stock: int
    image_url: Optional[str] = None
    en_promotion: bool = False
    prix_promotion_fcfa: Optional[float] = None

produits_db = []

@router.get("/")
@limiter.limit("60/minute")
async def liste_produits(request: Request):
    return {
        "produits": produits_db,
        "total": len(produits_db)
    }

@router.get("/tendances")
@limiter.limit("60/minute")
async def tendances(request: Request):
    tendances = sorted(produits_db, key=lambda x: x.get("vues", 0), reverse=True)[:5]
    return {"tendances": tendances}

@router.get("/top-ventes")
@limiter.limit("60/minute")
async def top_ventes(request: Request):
    top = sorted(produits_db, key=lambda x: x.get("achats", 0), reverse=True)[:5]
    return {"top_ventes": top}

@router.post("/ajouter")
@limiter.limit("20/minute")
async def ajouter_produit(request: Request, produit: Produit):
    nouveau = {
        "id": str(uuid.uuid4()),
        "nom": produit.nom,
        "description": produit.description,
        "prix_fcfa": produit.prix_fcfa,
        "categorie": produit.categorie,
        "stock": produit.stock,
        "image_url": produit.image_url,
        "en_promotion": produit.en_promotion,
        "prix_promotion_fcfa": produit.prix_promotion_fcfa,
        "vues": 0,
        "achats": 0,
        "date_ajout": datetime.now().isoformat()
    }
    produits_db.append(nouveau)
    return {
        "message": "Produit ajouté avec succès",
        "produit": nouveau
    }

@router.get("/produit/{produit_id}")
@limiter.limit("60/minute")
async def detail_produit(request: Request, produit_id: str):
    for produit in produits_db:
        if produit["id"] == produit_id:
            produit["vues"] += 1
            return produit
    raise HTTPException(status_code=404, detail="Produit non trouvé")

@router.delete("/supprimer/{produit_id}")
@limiter.limit("20/minute")
async def supprimer_produit(request: Request, produit_id: str):
    global produits_db
    produits_db = [p for p in produits_db if p["id"] != produit_id]
    return {"message": "Produit supprimé"}
