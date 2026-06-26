# 🛡️ JWT Analyzer

Outil d'analyse de secrets JWT (et autres secrets `.env`) : détecte les faiblesses, calcule un score de sécurité et donne des recommandations concrètes.

## Fonctionnalités

- **Analyse de secret brut** : longueur, entropie, charset, détection de secrets par défaut / patterns prévisibles.
- **Analyse de JWT complet** : décodage header/payload, vérification des claims (`exp`, `iat`, `aud`, `iss`), détection de l'algorithme `none`, détection de données sensibles dans le payload, score combiné avec la force du secret de signature.
- **Analyse de fichier `.env`** : scan automatique de toutes les variables ressemblant à des secrets (JWT_SECRET, API_KEY, DB_PASSWORD...) avec score individuel.
- **Dashboard React responsive** : jauge de score, liste des problèmes par sévérité (Critique/Élevé/Moyen/Faible/Info), recommandations actionnables.
- **Sécurité** : rien n'est stocké ni journalisé côté serveur. Tout est traité en mémoire pour la durée de la requête.

## Structure

```
jwt-analyzer/
├── backend/        # API Node.js / Express
│   └── src/
│       ├── server.js
│       ├── routes/analyze.js
│       ├── services/
│       │   ├── secretStrength.js   # Analyse de force d'un secret
│       │   ├── jwtAnalyzer.js      # Décodage + analyse JWT
│       │   └── envAnalyzer.js      # Scan de fichier .env
│       └── utils/knownWeakSecrets.js
└── frontend/        # Dashboard React (Vite + Tailwind)
    └── src/
        ├── App.jsx
        ├── api.js
        ├── components/   # ScoreGauge, IssueList, RecommendationList, MetaInfo, ResultPanel, Tabs
        └── pages/        # SecretAnalyzerPage, JwtAnalyzerPage, EnvAnalyzerPage
```

## Installation & lancement

### 1. Backend

```bash
cd backend
npm install
npm run dev      # démarre sur http://localhost:4000
```

### 2. Frontend

Dans un autre terminal :

```bash
cd frontend
npm install
npm run dev      # démarre sur http://localhost:5173
```

Le frontend appelle l'API via un proxy Vite (`/api` → `http://localhost:4000`), donc tout fonctionne directement en local sans config CORS supplémentaire.

## API

| Méthode | Route | Body | Description |
|---|---|---|---|
| POST | `/api/analyze/secret` | `{ secret, label? }` | Analyse la force d'un secret brut |
| POST | `/api/analyze/jwt` | `{ token, secret? }` | Décode et analyse un JWT complet |
| POST | `/api/analyze/env` | `{ content }` | Analyse le contenu d'un fichier `.env` |
| GET | `/api/health` | - | Vérifie que l'API tourne |

## Règles de scoring (résumé)

- **Longueur** (30 pts) : <16 = 0, 16-31 = 15, 32-63 = 25, ≥64 = 30
- **Charset/complexité** (25 pts) : nombre de catégories de caractères utilisées (maj/min/chiffres/symboles)
- **Pas de secret connu/par défaut** (20 pts)
- **Entropie de Shannon** (15 pts) : pénalise les répétitions
- **Aléatoire global** (10 pts) : pénalise les mots/phrases reconnaissables

Le score final est **plafonné par la pire sévérité détectée** :
- Critique → max 30/100
- Élevé → max 50/100
- Moyen → max 70/100
- Faible → max 90/100

Pour un JWT complet, le score intègre aussi : présence de `exp`/`iat`/`aud`/`iss`, durée de vie du token, présence de données sensibles dans le payload, et force du secret de signature (si fourni, pour HS256/384/512).

## Prochaines améliorations possibles

- Authentification + historique d'analyses (hashé, jamais en clair)
- Export PDF du rapport
- Vérification contre une base de leaks publics plus large (ex: HaveIBeenPwned-style)
- Support de vérification de signature réelle (avec clé publique pour RS/ES)
- Dockerfile + docker-compose pour déploiement en un clic
