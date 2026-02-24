# Frontend Module ERP Intervenants et disponibilités 

### Module Intervenants et disponibilités

- CRUD intervenants (nom, compétences, disponibilité, jours disponibles) ;
- association d’un intervenant à une étude via des affectations (JEH + phases) ;
- recherche d’intervenants par nom, disponibilité et compétence ;
- calculs de synthèse (JEH, coût journalier, taux horaire moyen).
## 3) Périmètre fonctionnel livré

### Intervenants

- affichage de la liste ;
- création d’un intervenant ;
- modification d’un intervenant ;
- suppression d’un intervenant ;
- recherche multicritère.

### Affectations (intervenant ↔ étude)

- création d’une affectation avec contrôle anti-doublon (même intervenant + même étude) ;
- édition/suppression d’une affectation ;
- phases de mission par affectation (ex: conception backend, création front).

### Études en cours

- affichage des études en cours selon la période `dateDebut/dateFin` de l’étude ;
- affichage des intervenants affectés, JEH, phases, taux horaire, taux journalier ;
- conservation de l’étude même si aucun intervenant n’est affecté.

## 4) Stack technique

- React 19
- TypeScript
- Vite
- Tailwind CSS

Organisation principale :

- `src/App.tsx` : orchestration état + logique métier UI
- `src/components/` : composants de présentation
- `src/types/types.ts` : modèle de types métier
- `src/api/api.ts` : couche d’accès API (prête pour intégration backend)

## 5) Instructions d’exécution

## Prérequis

- Node.js >= 20 ou Bun >= 1.0

## Installation

```bash
cd frontend
npm install
```

ou

```bash
cd frontend
bun install
```

## Lancement en développement

```bash
npm run dev
```

ou

```bash
bun run dev
```

## Build production

```bash
npm run build
```

## Preview production

```bash
npm run preview
```

## Lint

```bash
npm run lint
```

## 6) Justification des choix techniques

- **React + TypeScript**: rapidité d’itération + sécurité de typage sur les modèles métier.
- **Vite**: démarrage instantané et build rapide pour un prototype.
- **Tailwind**: mise en forme rapide et cohérence visuelle sans dette CSS lourde.
- **Découpage en composants**: meilleure maintenabilité, testabilité, réutilisation.
- **Couche API séparée**: facilite le passage des données mock vers backend réel.
