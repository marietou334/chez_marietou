from fastapi import APIRouter, Request, HTTPException
from slowapi import Limiter
from slowapi.util import get_remote_address
from pydantic import BaseModel
from typing import Optional
import requests
import os
import uuid
from datetime import datetime, timedelta
from dotenv import load_dotenv

load_dotenv()

limiter = Limiter(key_func=get_remote_address)
router = APIRouter(prefix="/paiement", tags=["Paiement"])

CARTE_ACTIVATION_DATE = datetime.now() + timedelta(days=30)

class PaiementMobile(BaseModel):
    montant_fcfa: float
    telephone: str
    operateur: str
    nom_client: str
    commande_id: str

class VerificationCarte(BaseModel):
    demande_par: str

@router.post("/orange-money")
@limiter.limit("10/minute")
async def payer_orange_money(request: Request, data: PaiementMobile):
    if data.operateur not in ["orange", "moov", "wave"]:
        raise HTTPException(
            status_code=400,
            detail="Opérateur non supporté. Choisir: orange, moov ou wave"
        )
    if data.montant_fcfa < 100:
        raise HTTPException(
            status_code=400,
            detail="Montant minimum: 100 FCFA"
        )
    transaction_id = str(uuid.uuid4())
    return {
        "statut": "en_attente",
        "transaction_id": transaction_id,
        "montant_fcfa": data.montant_fcfa,
        "operateur": data.operateur,
        "telephone": data.telephone,
        "message": f"Confirmez le paiement de {data.montant_fcfa} FCFA sur votre {data.operateur.capitalize()} Money",
        "commande_id": data.commande_id,
        "expire_dans": "10 minutes"
    }

@router.get("/methodes")
@limiter.limit("30/minute")
async def methodes_disponibles(request: Request):
    maintenant = datetime.now()
    carte_disponible = maintenant >= CARTE_ACTIVATION_DATE
    jours_restants = (CARTE_ACTIVATION_DATE - maintenant).days

    methodes = [
        {
            "id": "orange_money",
            "nom": "Orange Money",
            "disponible": True,
            "icone": "orange",
            "priorite": 1
        },
        {
            "id": "moov_money",
            "nom": "Moov Money",
            "disponible": True,
            "icone": "moov",
            "priorite": 2
        },
        {
            "id": "wave",
            "nom": "Wave",
            "disponible": True,
            "icone": "wave",
            "priorite": 3
        },
        {
            "id": "carte_bancaire",
            "nom": "Carte Bancaire",
            "disponible": carte_disponible,
            "icone": "carte",
            "priorite": 4,
            "message": None if carte_disponible else f"Disponible dans {jours_restants} jours"
        }
    ]
    return {
        "methodes": methodes,
        "devise": "FCFA",
        "carte_activation": CARTE_ACTIVATION_DATE.strftime("%d/%m/%Y")
    }

@router.get("/statut/{transaction_id}")
@limiter.limit("20/minute")
async def statut_paiement(request: Request, transaction_id: str):
    return {
        "transaction_id": transaction_id,
        "statut": "en_attente",
        "message": "En attente de confirmation client"
    }
