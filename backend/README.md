# Backend FastAPI - Module Intervenants & disponibilités

Backend du prototype MES N°2 (SEPEFREI) pour le module **"Intervenants et disponibilités"**.

Stack :

- `FastAPI`
- `SQLAlchemy 2`
- `Alembic`
- `PostgreSQL` (requis par les types `ARRAY` et enum PostgreSQL)
- `uv` (gestion dépendances / exécution)

## Ce que couvre l'API

### Intervenants

- CRUD complet
- recherche/filtrage via query params :
  - `search`
  - `competence`
  - `disponibilite`
- récupération des études associées à un intervenant

Champs principaux :

- `nom`
- `email` (optionnel)
- `telephone` (optionnel)
- `competences[]`
- `disponibilite` (`Disponible`, `Indisponible`, `Occupé`)
- `nbJoursDisponibles` (0 à 7)
- `tjm` (> 0)

### Études

- CRUD complet
- récupération des intervenants d'une étude
- calcul du coût total et total JEH : `GET /etudes/{id}/cout-total`

Champs :

- `nom`
- `description` (optionnel)
- `dateDebut`
- `dateFin`

### Affectations (association intervenant ↔ étude)

- CRUD complet (`/affectations`)
- routes de liaison orientées métier :
  - `POST /etudes/{etude_id}/intervenants/{intervenant_id}`
  - `DELETE /etudes/{etude_id}/intervenants/{intervenant_id}`

Règles métier :

- une paire `(intervenant, étude)` est unique
- `jeh > 0`
- validation d'existence des références

## Architecture

Le backend suit une séparation claire :

- `app/api/routes/` : exposition HTTP
- `app/services/` : règles métier et orchestration
- `app/repositories/` : accès aux données SQLAlchemy
- `app/models/` : modèles ORM + contraintes DB
- `app/schemas/` : validation/serialization Pydantic
- `app/core/` : config, DB, erreurs

## Prérequis

- Python `3.14+` (selon `pyproject.toml`)
- `uv`
- PostgreSQL accessible localement ou à distance

## Configuration

Créer/adapter le fichier `.env` (un `.env.example` est fourni) :

```env
APP_ENV=dev
APP_HOST=0.0.0.0
APP_PORT=8000
DATABASE_URL=postgresql+psycopg://postgres:postgres@localhost:5432/intervenants_db
CORS_ORIGINS=http://localhost:5173
```

## Lancement (local)

```bash
cd backend
uv sync --extra dev
uv run alembic upgrade head
uv run seed-data
uv run uvicorn app.main:app --reload
```

API :

- `http://localhost:8000`
- Swagger : `http://localhost:8000/docs`

## Exécution Docker (backend utilisé par `docker compose`)

Le dépôt racine fournit une orchestration complète (`db` + `backend` + `frontend`).

Depuis la racine :

```bash
docker compose up --build
```

Comportement du conteneur backend :

- attend PostgreSQL
- exécute `alembic upgrade head`
- exécute `seed-data`
- démarre `uvicorn` sur `0.0.0.0:8000`

Variables injectées par `docker-compose.yml` (prioritaires sur `.env`) :

- `DATABASE_URL=...@db:5432/intervenants_db`
- `CORS_ORIGINS` incluant `http://localhost:8080`

## Migrations & seed

```bash
uv run alembic upgrade head
uv run alembic downgrade -1
uv run seed-data
```

Le seed crée des données de démonstration (intervenants, études, affectations) si les tables sont vides.

## Tests

Tests présents :

- `tests/test_health.py`
- `tests/test_schemas.py`

Commande recommandée :

```bash
PYTHONPATH=. uv run pytest -q
```

Note :

- dans un environnement vierge, il faut d'abord installer les dépendances (`uv sync --extra dev`)
- les tests n'utilisent pas de base PostgreSQL pour la partie actuelle (health + schémas)

## Gestion des erreurs

Erreurs métier unifiées via `app/core/errors.py` :

- `404` `not_found`
- `409` `conflict`
- `400` `business_rule`

Réponse type :

```json
{
  "message": "Intervenant introuvable",
  "code": "not_found"
}
```

## Limites actuelles

- pas de pagination
- filtrage intervenants en mémoire (MVP)
- pas d'authentification / autorisation
