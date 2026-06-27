from fastapi import FastAPI, Request, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from slowapi import Limiter, _rate_limit_exceeded_handler
from slowapi.util import get_remote_address
from slowapi.errors import RateLimitExceeded
from catalogue import router as catalogue_router
from ia import router as ia_router
import uvicorn

limiter = Limiter(key_func=get_remote_address)

app = FastAPI(
    title="Chez Mariétou API",
    description="Backend boutique en ligne — Burkina Faso",
    version="1.0.0"
)

app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

blocked_ips = set()

@app.middleware("http")
async def protection_ddos(request: Request, call_next):
    ip = get_remote_address(request)
    if ip in blocked_ips:
        raise HTTPException(status_code=403, detail="Accès bloqué — IP bannie")
    response = await call_next(request)
    return response

app.include_router(catalogue_router)
app.include_router(ia_router)

@app.get("/health")
@limiter.limit("30/minute")
async def health(request: Request):
    return {
        "status": "ok",
        "service": "Chez Mariétou — Python",
        "protection": "DDoS activée"
    }

@app.get("/")
@limiter.limit("60/minute")
async def accueil(request: Request):
    return {
        "message": "Bienvenue chez Mariétou !",
        "version": "1.0.0"
    }

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000, reload=True)
