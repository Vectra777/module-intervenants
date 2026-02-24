# Module ERP Interne - Intervenants & disponibilités (SEPEFREI)

Prototype réalisé dans le cadre de la MES N°2 (mandat 2025-2026, cahier des charges du 23/10/2025) pour le module **"Intervenants et disponibilités"**.

Ce dépôt contient :

- `backend/` : API FastAPI + SQLAlchemy + Alembic (PostgreSQL)
- `frontend/` : interface React/Vite/Tailwind pour gérer les intervenants et les affectations
- `docker-compose.yml` : orchestration Docker (PostgreSQL + backend + frontend Nginx)
- `SYNTHESE_PROJET.md` : synthèse attendue pour la restitution

## Résumé fonctionnel

Le prototype couvre le **module 3** du cahier des charges avec un périmètre supérieur au minimum :

- CRUD des intervenants
- association intervenant ↔ étude (affectations)
- recherche par nom / disponibilité / compétence (bonus)
- calculs de charge (JEH) et de coût total d'une étude (bonus étendu)
- CRUD backend des études et des affectations

Limite actuelle côté UI :

- le frontend ne propose pas de CRUD des études (les études sont lues depuis l'API / seed)

## Analyse approfondie (par rapport au cahier des charges)

### 1. Architecture et conception

Points forts :

- séparation claire `routes -> services -> repositories -> models/schemas`
- validations à plusieurs niveaux (Pydantic + contraintes SQL + règles métier)
- gestion d'erreurs métier homogène (`404`, `409`, `business_rule`)
- migrations Alembic versionnées

Points de vigilance :

- backend couplé à **PostgreSQL** (types `ARRAY`, enum PostgreSQL) : pas facilement portable vers SQLite sans adaptation
- filtrage des intervenants réalisé en mémoire dans le service (acceptable MVP, moins scalable)
- pas de logs structurés / observabilité

### 2. Backend et logique métier

Couverture notable :

- CRUD `intervenants`, `etudes`, `affectations`
- endpoints de liaison métier `/etudes/{etude_id}/intervenants/{intervenant_id}`
- contrôle anti-doublon sur affectation (contrainte unique + garde applicative)
- calcul de coût total d'étude via requête SQL agrégée
- validation des dates d'étude et JEH > 0

Écart / amélioration :

- tests backend présents mais l'exécution nécessite un environnement Python avec dépendances installées et un `PYTHONPATH` configuré

### 3. Frontend / UX

Points forts :

- interface claire et exploitable pour démontrer le module
- recherche instantanée côté client
- affichage des études en cours avec coût total et détail des affectations
- workflows CRUD intervenants + création/modification/suppression d'affectations

Limites :

- pas de formulaire d'études côté frontend (dépendance au seed / backend)
- édition d'affectation via `prompt()` (fonctionnel mais UX basique)
- logique de coût dupliquée côté frontend alors qu'un endpoint backend existe déjà

### 4. Qualité / tests

Présent :

- tests backend (healthcheck + validations de schémas)
- tests frontend (utils métier)

État vérifié dans cet environnement :

- `frontend`: tests OK (`3/3`)
- `backend`: tests non exécutables en l'état local sans installation des dépendances Python (`sqlalchemy`, etc.)

### 5. Industrialisation / DevOps

Présent :

- `alembic` (migrations DB)
- `uv.lock` (verrouillage dépendances Python)
- scripts npm/uv clairs
- conteneurisation multi-service (`docker-compose.yml`, Dockerfiles backend/frontend, Nginx)

Écarts au cahier des charges :

- pas de pipeline CI/CD fourni

## Démarrage rapide (local)

### Backend

Voir `backend/README.md` (configuration PostgreSQL, migrations, seed, lancement API).

### Frontend

Voir `frontend/README.md` (Vite + variable `VITE_API_URL`).

## Exécution Docker (recommandé pour la démo)

```bash
docker compose up --build
```

Accès :

- Frontend (Nginx + proxy API) : `http://localhost:8080`
- Backend direct (debug/docs) : `http://localhost:8000/docs`

Notes :

- le backend applique automatiquement les migrations Alembic au démarrage
- le backend lance automatiquement le seed (idempotent)
- le frontend appelle l'API via `/api` (proxy Nginx), ce qui réduit les problèmes CORS

## Conformité (synthèse rapide)

- Module choisi (Intervenants & disponibilités) : `OK`
- CRUD intervenants : `OK`
- Association intervenant à une étude : `OK`
- Bonus recherche compétence : `OK`
- Bonus coût d'étude (JEH / coût) : `OK` (coût EUR + JEH)
- Backend structuré : `OK`
- Frontend React : `OK`
- Au moins un test : `OK`
- Dockerfile fonctionnel : `OK`
- `docker-compose.yml` multi-service : `OK`
- README global + justification + améliorations : `OK` (après cette mise à jour)
- `SYNTHÈSE_PROJET.md` : `OK` (après cette mise à jour)

## Arborescence utile

```text
backend/
  app/
    api/routes/
    services/
    repositories/
    models/
    schemas/
  alembic/
  tests/
frontend/
  src/components/
  src/api/
  src/utils/
  tests/
README.md
SYNTHESE_PROJET.md
docker-compose.yml
```
