use actix_web::{web, HttpResponse, HttpRequest};
use crate::models::*;
use crate::security::*;
use uuid::Uuid;

pub async fn inscription(data: web::Json<InscriptionData>) -> HttpResponse {
    if data.mot_de_passe.len() < 8 {
        return HttpResponse::BadRequest().json(serde_json::json!({
            "erreur": "Le mot de passe doit avoir minimum 8 caractères"
        }));
    }
    let hash = hacher_mot_de_passe(&data.mot_de_passe);
    let user_id = Uuid::new_v4().to_string();
    let token = generer_token(&user_id, &data.role);
    HttpResponse::Ok().json(serde_json::json!({
        "message": "Inscription réussie",
        "token": token,
        "user_id": user_id,
        "premiere_connexion": data.role == "Proprietaire"
    }))
}

pub async fn connexion(data: web::Json<ConnexionData>) -> HttpResponse {
    HttpResponse::Ok().json(serde_json::json!({
        "message": "Connexion réussie",
        "email": data.email
    }))
}

pub async fn recuperation(data: web::Json<RecuperationData>) -> HttpResponse {
    HttpResponse::Ok().json(serde_json::json!({
        "message": "Vérification en cours",
        "indice": "Entrez votre date de naissance"
    }))
}

pub async fn verifier_token(req: HttpRequest) -> HttpResponse {
    let auth_header = req.headers().get("Authorization");
    match auth_header {
        Some(header) => {
            let token = header.to_str().unwrap_or("").replace("Bearer ", "");
            match valider_token(&token) {
                Some(claims) => HttpResponse::Ok().json(serde_json::json!({
                    "valide": true,
                    "role": claims.role,
                    "user_id": claims.sub
                })),
                None => HttpResponse::Unauthorized().json(serde_json::json!({
                    "valide": false,
                    "erreur": "Token invalide"
                }))
            }
        },
        None => HttpResponse::Unauthorized().json(serde_json::json!({
            "valide": false,
            "erreur": "Token manquant"
        }))
    }
}
