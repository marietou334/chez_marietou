use serde::{Deserialize, Serialize};

#[derive(Serialize, Deserialize, Clone)]
pub enum Role {
    Proprietaire,
    Client,
}

#[derive(Serialize, Deserialize, Clone)]
pub struct Utilisateur {
    pub id: String,
    pub nom: String,
    pub email: String,
    pub mot_de_passe: String,
    pub role: Role,
    pub gmail_recuperation: Option<String>,
    pub mot_secret: Option<String>,
    pub premiere_connexion: bool,
    pub carte_active: bool,
    pub carte_activation_date: Option<String>,
}

#[derive(Serialize, Deserialize)]
pub struct InscriptionData {
    pub nom: String,
    pub email: String,
    pub mot_de_passe: String,
    pub role: String,
}

#[derive(Serialize, Deserialize)]
pub struct ConnexionData {
    pub email: String,
    pub mot_de_passe: String,
}

#[derive(Serialize, Deserialize)]
pub struct ConfigProprietaire {
    pub gmail_recuperation: String,
    pub mot_secret: String,
}

#[derive(Serialize, Deserialize)]
pub struct RecuperationData {
    pub email: String,
    pub reponse_secrete: String,
}

#[derive(Serialize, Deserialize)]
pub struct Claims {
    pub sub: String,
    pub role: String,
    pub exp: usize,
}
