# Frontend React - Module Intervenants & Études

Frontend du prototype SEPEFREI (MES N°2) pour visualiser et manipuler le module **Intervenants & disponibilités** via l'API backend.

Stack :

- `React 19`
- `TypeScript`
- `Vite`
- `Tailwind CSS v4`
- `Vitest` (tests unitaires)

## Fonctionnalités UI livrées

- affichage de la liste des intervenants
- recherche instantanée (nom, disponibilité, compétences)
- création / modification / suppression d'intervenants
- création d'affectation (intervenant ↔ étude) avec `JEH` et `phases`
- modification/suppression d'affectation
- vue "Études en cours" (filtre par dates)
- calculs affichés :
  - JEH total par intervenant
  - taux horaire estimé à partir du TJM
  - coût total par étude (calculé côté frontend)

## Limites actuelles

- pas de CRUD des études dans l'interface (les études doivent exister côté backend / seed)
- édition d'affectation via `prompt()` (UX basique mais fonctionnelle)
- pas de routing multi-pages malgré la dépendance `react-router`

## Prérequis

- Node.js `>=20` (22 recommandé)
- backend FastAPI lancé et accessible

## Configuration

Variable optionnelle :

- `VITE_API_URL` (par défaut : `http://localhost:8000`)

Exemple (`.env.local`) :

```env
VITE_API_URL=http://localhost:8000
```

## Lancement local

```bash
cd frontend
npm install
npm run dev
```

Application :

- `http://localhost:5173`

## Exécution Docker (frontend Nginx)

Le frontend est conteneurisé en mode production statique :

- build Vite dans un conteneur Node
- service des fichiers via Nginx
- proxy `/api` vers le backend FastAPI

Depuis la racine :

```bash
docker compose up --build
```

Accès :

- `http://localhost:8080`

En mode Docker, `VITE_API_URL` est injecté au build avec la valeur `/api`.

## Scripts utiles

```bash
npm run dev
npm run build
npm run preview
npm run lint
npm test
```

## Tests

Test présent :

- `tests/moduleMetrics.test.ts`

Couverture visée actuellement :

- fonctions utilitaires de calcul et parsing (`splitCommaSeparatedValues`, taux horaire, coût étude)

## Structure

```text
src/
  api/           # client HTTP vers le backend
  components/    # composants UI
  types/         # contrats TypeScript (alignés avec l'API camelCase)
  utils/         # calculs métier côté front
```

## Choix techniques (justification)

- **React + Vite** : rapidité de mise en place pour une semaine de prototype
- **TypeScript** : sécurise les contrats API et les formulaires
- **Tailwind** : itérations UI rapides sans dette CSS lourde
- **Composants séparés** : facilite la maintenabilité et la démonstration orale

## Améliorations prioritaires

- formulaire CRUD des études côté frontend
- modal d'édition d'affectation (au lieu de `prompt`)
- synchronisation du calcul de coût avec l'endpoint backend `/etudes/{id}/cout-total`
- tests de composants / tests d'intégration (React Testing Library)
