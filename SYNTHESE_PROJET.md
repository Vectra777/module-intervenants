# SYNTHÈSE PROJET - MES N°2 (SEPEFREI)

## Contexte

Prototype réalisé pour la mise en situation "Développement et conception d'un module applicatif interne" (mandat 2025-2026), sur le module :

- **Intervenants et disponibilités**

## Ce que j'ai livré

### 1. Backend (FastAPI)

- API structurée en couches :
  - `routes`
  - `services`
  - `repositories`
  - `models`
  - `schemas`
- CRUD complets pour :
  - `intervenants`
  - `etudes`
  - `affectations`
- Association intervenant ↔ étude via routes métier dédiées
- Validation des données (Pydantic) + contraintes base de données (SQL)
- Gestion d'erreurs métier homogène (`404`, `409`, `400`)
- Endpoint de bonus :
  - recherche/filtrage des intervenants (nom / compétence / disponibilité)
  - calcul du coût total d'une étude (`/etudes/{id}/cout-total`)
- Migrations Alembic
- Script de seed de données de démonstration
- Tests backend (healthcheck + schémas)

### 2. Frontend (React)

- Interface web fonctionnelle pour :
  - lister les intervenants
  - rechercher des intervenants
  - créer / modifier / supprimer des intervenants
  - créer / modifier / supprimer des affectations
  - visualiser les études en cours et leurs coûts/JEH
- Intégration API complète pour les fonctionnalités exposées dans l'UI
- Typage TypeScript des objets métier
- Tests unitaires frontend sur les fonctions de calcul

### 3. Documentation

- `README.md` global (présentation, analyse, conformité)
- `backend/README.md` (installation, lancement, endpoints, tests)
- `frontend/README.md` (installation, scripts, limites)
- `SYNTHESE_PROJET.md` (ce document)
- documentation d'exécution Docker (compose + services)

### 4. Industrialisation / conteneurisation livrée

- `docker-compose.yml` multi-service :
  - `postgres`
  - `backend`
  - `frontend`
- `backend/Dockerfile`
- `frontend/Dockerfile` (multi-stage)
- `frontend/nginx.conf` avec proxy `/api` -> backend
- migrations + seed automatiques au démarrage du backend

### 5. Écarts actuels par rapport au cahier des charges

- pas de pipeline CI/CD versionné
- pas de CRUD des études côté frontend (présent côté backend uniquement)

## Ce que j'aurais ajouté avec une semaine supplémentaire

### Priorité produit (MVP+)

- CRUD des études dans le frontend (création, édition, suppression)
- édition des affectations via modal dédiée (au lieu de `prompt`)
- dashboard de synthèse (stats par disponibilité, charge, coût par étude)
- filtres avancés (compétence multiple, disponibilité minimale en jours)

### Priorité qualité / robustesse

- tests d'intégration backend (API + DB de test)
- tests de composants frontend (React Testing Library)
- fixtures de test et seed de test distincts
- logging structuré + tracing basique
- validation plus fine des emails/téléphones

### Priorité architecture

- pagination / tri serveur pour la liste des intervenants
- recherche filtrée côté SQL (au lieu du filtrage en mémoire)
- centralisation des calculs de coût côté backend (source de vérité unique)
- DTO/contrats OpenAPI générés côté frontend

### Priorité sécurité / exploitation

- authentification (JWT/session) + rôles (admin/chef de projet)
- audit trail (qui a modifié quoi)
- configuration par environnements (`dev`, `staging`, `prod`)

## Comment je le déploierais chez SEPEFREI (Docker, CI/CD, etc.)

### 1. Conteneurisation (cible)

Je livrerais :

- `Dockerfile` backend (image Python slim, `uv`, migration au démarrage via job/entrypoint)
- `Dockerfile` frontend (build Vite puis serving statique via Nginx)
- `docker-compose.yml` pour environnement local / recette :
  - `postgres`
  - `backend`
  - `frontend`

### 2. Pipeline CI/CD (GitHub Actions / GitLab CI)

Étapes recommandées :

1. `lint` frontend + backend
2. `tests` frontend + backend
3. build images Docker
4. scan sécurité (SCA + image scan)
5. push registry (tag `commit-sha`, `staging`, `prod`)
6. déploiement sur environnement cible

### 3. Stratégie de déploiement

- **Recette** : déploiement automatique sur push `main` (ou merge vers `develop`)
- **Production** : déploiement validé manuellement après recette
- migrations Alembic exécutées via job dédié avant rollout applicatif

### 4. Hébergement SEPEFREI (proposition pragmatique)

Option simple (adaptée à un module interne prototype) :

- VM Linux interne + Docker Compose
- reverse proxy Nginx
- PostgreSQL persistant (volume + sauvegardes)

Option cible (si ERP s'étend) :

- orchestration (Kubernetes / OpenShift)
- secrets manager
- monitoring (Prometheus/Grafana) + logs centralisés

### 5. Exploitation / bonnes pratiques

- variables d'environnement externalisées
- sauvegardes PostgreSQL planifiées
- versionnage des migrations
- observabilité minimale (healthcheck + logs)
- stratégie de rollback (image précédente + downgrade si nécessaire)

## Message de restitution (10-15 min)

Si je présente ce projet à l'oral, j'insisterai sur :

- la **bonne séparation des couches backend**
- le **prototype fonctionnel démontrable rapidement**
- les **règles métier couvertes** (doublons, validations, calculs)
- les **écarts assumés** (Docker/CI, CRUD études frontend) et le plan d'industrialisation
