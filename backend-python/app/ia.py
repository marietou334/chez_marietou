from fastapi import APIRouter, Request, HTTPException
from slowapi import Limiter
from slowapi.util import get_remote_address
from pydantic import BaseModel
from typing import Optional
import anthropic
import groq
import os
from dotenv import load_dotenv

load_dotenv()

limiter = Limiter(key_func=get_remote_address)
router = APIRouter(prefix="/ia", tags=["Intelligence Artificielle"])

client_groq = groq.Groq(api_key=os.getenv("GROQ_API_KEY"))
client_claude = anthropic.Anthropic(api_key=os.getenv("ANTHROPIC_API_KEY"))

CONTEXTE_BOUTIQUE = """
Tu es l'assistante virtuelle de 'Chez Mariétou', une boutique en ligne au Burkina Faso.
Tu parles français et tu es chaleureuse, professionnelle et serviable.
Tu connais tous les produits, commandes et informations de la boutique.
Les paiements se font en FCFA via Orange Money, Moov Money et Wave.
Tu peux aider les clients à trouver des produits, suivre leurs commandes et répondre à leurs questions.
"""

CONTEXTE_MARIETOU = """
Tu es Claude, l'assistante personnelle et administrative de Mariétou, propriétaire de 'Chez Mariétou'.
Tu es puissante, fiable et confidentielle.
Tu peux gérer la boutique, analyser les ventes, rédiger des messages, créer des promotions.
Tu donnes des conseils business adaptés au marché burkinabè.
Tu parles à Mariétou comme une associée de confiance.
"""

class MessageClient(BaseModel):
    message: str
    historique: Optional[list] = []

class MessageMarietou(BaseModel):
    message: str
    utiliser_claude: bool = True
    historique: Optional[list] = []

@router.post("/client")
@limiter.limit("30/minute")
async def ia_client(request: Request, data: MessageClient):
    try:
        messages = [{"role": "system", "content": CONTEXTE_BOUTIQUE}]
        for msg in data.historique:
            messages.append(msg)
        messages.append({"role": "user", "content": data.message})

        reponse = client_groq.chat.completions.create(
            model="llama-3.3-70b-versatile",
            messages=messages,
            max_tokens=500,
            temperature=0.7
        )
        return {
            "reponse": reponse.choices[0].message.content,
            "modele": "LLaMA 3.3 70B",
            "source": "Groq"
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Erreur IA: {str(e)}")

@router.post("/marietou")
@limiter.limit("20/minute")
async def ia_marietou(request: Request, data: MessageMarietou):
    try:
        if data.utiliser_claude:
            messages = []
            for msg in data.historique:
                messages.append(msg)
            messages.append({"role": "user", "content": data.message})

            reponse = client_claude.messages.create(
                model="claude-sonnet-4-6",
                max_tokens=1000,
                system=CONTEXTE_MARIETOU,
                messages=messages
            )
            return {
                "reponse": reponse.content[0].text,
                "modele": "Claude Sonnet",
                "source": "Anthropic"
            }
        else:
            messages = [{"role": "system", "content": CONTEXTE_MARIETOU}]
            for msg in data.historique:
                messages.append(msg)
            messages.append({"role": "user", "content": data.message})

            reponse = client_groq.chat.completions.create(
                model="llama-3.3-70b-versatile",
                messages=messages,
                max_tokens=1000,
                temperature=0.7
            )
            return {
                "reponse": reponse.choices[0].message.content,
                "modele": "LLaMA 3.3 70B",
                "source": "Groq (mode gratuit)"
            }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Erreur IA: {str(e)}")

@router.get("/status")
@limiter.limit("30/minute")
async def status_ia(request: Request):
    return {
        "ia_clients": "Groq LLaMA 3.3 — gratuit 24h/24",
        "ia_marietou_payant": "Claude Sonnet — puissant",
        "ia_marietou_gratuit": "Groq LLaMA 3.3 — secours gratuit",
        "statut": "operationnel"
    }
