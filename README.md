JWT Analyzer

JWT Analyzer est une application permettant d'évaluer la sécurité des secrets JWT, des tokens JWT et des fichiers `.env`.

Fonctionnalités

-  Analyse de la force d'un secret (longueur, complexité, entropie, secrets faibles).
-  Analyse d'un JWT (header, payload, expiration, algorithme, données sensibles).
-  Analyse d'un fichier `.env` pour détecter les secrets et évaluer leur sécurité.
-  Tableau de bord avec score, problèmes détectés et recommandations.

Technologies

- Frontend : React, Vite, Tailwind CSS
- Backend :Node.js, Express
 Structure du projet


jwt-analyzer/
├── backend/
│   ├── controllers/
│   ├── routes/
│   ├── services/
│   └── utils/
└── frontend/
    ├── components/
    ├── pages/
    └── api.js

Scoring

Le score est calculé selon plusieurs critères :

- Longueur du secret
- Complexité des caractères
- Entropie
- Détection de secrets connus
- Détection de motifs prévisibles

Pour les JWT, l'analyse vérifie également :

- l'algorithme utilisé ;
- les claims (`exp`, `iat`, `aud`, `iss`) ;
- la présence de données sensibles dans le payload ;
- la force du secret de signature (pour les algorithmes HS*).