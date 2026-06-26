use argon2::{Argon2, PasswordHash, PasswordHasher, PasswordVerifier};
use argon2::password_hash::SaltString;
use rand::rngs::OsRng;
use jsonwebtoken::{encode, decode, Header, Validation, EncodingKey, DecodingKey};
use crate::models::Claims;
use chrono::Utc;

pub fn hacher_mot_de_passe(mot_de_passe: &str) -> String {
    let salt = SaltString::generate(&mut OsRng);
    let argon2 = Argon2::default();
    argon2.hash_password(mot_de_passe.as_bytes(), &salt)
        .unwrap()
        .to_string()
}

pub fn verifier_mot_de_passe(mot_de_passe: &str, hash: &str) -> bool {
    let parsed_hash = PasswordHash::new(hash).unwrap();
    Argon2::default()
        .verify_password(mot_de_passe.as_bytes(), &parsed_hash)
        .is_ok()
}

pub fn generer_token(user_id: &str, role: &str) -> String {
    let secret = std::env::var("JWT_SECRET")
        .unwrap_or_else(|_| "chez_marietou_secret_2024".to_string());
    let expiration = Utc::now().timestamp() as usize + 86400 * 7;
    let claims = Claims {
        sub: user_id.to_string(),
        role: role.to_string(),
        exp: expiration,
    };
    encode(
        &Header::default(),
        &claims,
        &EncodingKey::from_secret(secret.as_bytes()),
    ).unwrap()
}

pub fn valider_token(token: &str) -> Option<Claims> {
    let secret = std::env::var("JWT_SECRET")
        .unwrap_or_else(|_| "chez_marietou_secret_2024".to_string());
    decode::<Claims>(
        token,
        &DecodingKey::from_secret(secret.as_bytes()),
        &Validation::default(),
    ).ok().map(|data| data.claims)
}
