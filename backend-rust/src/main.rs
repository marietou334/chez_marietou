use actix_web::{web, App, HttpServer, HttpResponse, middleware};
use actix_cors::Cors;

mod auth;
mod models;
mod security;

#[actix_web::main]
async fn main() -> std::io::Result<()> {
    dotenv::dotenv().ok();
    println!("🔐 Serveur sécurité Chez Mariétou démarré sur port 8080");

    HttpServer::new(|| {
        let cors = Cors::default()
            .allow_any_origin()
            .allow_any_method()
            .allow_any_header();

        App::new()
            .wrap(cors)
            .route("/auth/inscription", web::post().to(auth::inscription))
            .route("/auth/connexion", web::post().to(auth::connexion))
            .route("/auth/recuperation", web::post().to(auth::recuperation))
            .route("/auth/verifier", web::get().to(auth::verifier_token))
            .route("/health", web::get().to(health_check))
    })
    .bind("0.0.0.0:8080")?
    .run()
    .await
}

async fn health_check() -> HttpResponse {
    HttpResponse::Ok().json(serde_json::json!({
        "status": "ok",
        "service": "Chez Mariétou - Auth"
    }))
}
