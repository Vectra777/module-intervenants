from __future__ import annotations

from datetime import date

from sqlalchemy import select

from app.core.database import SessionLocal
from app.models import Affectation, Etude, Intervenant
from app.models.intervenant import DisponibiliteEnum


def main() -> None:
    with SessionLocal() as db:
        has_etudes = db.scalar(select(Etude.id).limit(1)) is not None
        has_intervenants = db.scalar(select(Intervenant.id).limit(1)) is not None

        if has_etudes and has_intervenants:
            print("Seed ignoree: des donnees existent deja.")
            return

        created_demo_intervenants = False
        demo_intervenants: dict[str, Intervenant] = {}

        if not has_intervenants:
            demo_rows = [
                (
                    "ines",
                    Intervenant(
                        nom="Ines Martin",
                        email="ines.martin@sepefrei.fr",
                        telephone="0601020304",
                        competences=["React", "TypeScript", "UI"],
                        disponibilite=DisponibiliteEnum.disponible,
                        nb_jours_disponibles=4,
                        tjm=450,
                    ),
                ),
                (
                    "yanis",
                    Intervenant(
                        nom="Yanis Diallo",
                        email="yanis.diallo@sepefrei.fr",
                        telephone="0605060708",
                        competences=["Python", "FastAPI", "SQL"],
                        disponibilite=DisponibiliteEnum.occupe,
                        nb_jours_disponibles=1,
                        tjm=520,
                    ),
                ),
                (
                    "sarah",
                    Intervenant(
                        nom="Sarah Benali",
                        email="sarah.benali@sepefrei.fr",
                        telephone="0611121314",
                        competences=["Data", "Power BI", "Excel"],
                        disponibilite=DisponibiliteEnum.indisponible,
                        nb_jours_disponibles=0,
                        tjm=480,
                    ),
                ),
                (
                    "mehdi",
                    Intervenant(
                        nom="Mehdi Khelifi",
                        email="mehdi.khelifi@sepefrei.fr",
                        telephone="0615151515",
                        competences=["DevOps", "Docker", "CI/CD"],
                        disponibilite=DisponibiliteEnum.disponible,
                        nb_jours_disponibles=5,
                        tjm=600,
                    ),
                ),
                (
                    "clara",
                    Intervenant(
                        nom="Clara Moreau",
                        email="clara.moreau@sepefrei.fr",
                        telephone="0620202020",
                        competences=["Product", "Recueil besoin", "UX"],
                        disponibilite=DisponibiliteEnum.disponible,
                        nb_jours_disponibles=3,
                        tjm=430,
                    ),
                ),
                (
                    "amine",
                    Intervenant(
                        nom="Amine Bensaid",
                        email="amine.bensaid@sepefrei.fr",
                        telephone="0630303030",
                        competences=["Java", "Spring", "PostgreSQL"],
                        disponibilite=DisponibiliteEnum.occupe,
                        nb_jours_disponibles=2,
                        tjm=540,
                    ),
                ),
                (
                    "lea",
                    Intervenant(
                        nom="Lea Garnier",
                        email="lea.garnier@sepefrei.fr",
                        telephone="0640404040",
                        competences=["QA", "Tests API", "Cypress"],
                        disponibilite=DisponibiliteEnum.disponible,
                        nb_jours_disponibles=4,
                        tjm=410,
                    ),
                ),
                (
                    "hugo",
                    Intervenant(
                        nom="Hugo Perrin",
                        email="hugo.perrin@sepefrei.fr",
                        telephone="0650505050",
                        competences=["Node.js", "React", "SQL"],
                        disponibilite=DisponibiliteEnum.indisponible,
                        nb_jours_disponibles=0,
                        tjm=470,
                    ),
                ),
            ]
            for key, item in demo_rows:
                demo_intervenants[key] = item
            db.add_all(list(demo_intervenants.values()))
            db.flush()
            created_demo_intervenants = True

        if not has_etudes:
            demo_etudes = {
                "audit_crm": Etude(
                    nom="Audit CRM",
                    description="Refonte du suivi client et process commercial.",
                    date_debut=date(2026, 2, 1),
                    date_fin=date(2026, 4, 15),
                ),
                "dashboard_rh": Etude(
                    nom="Dashboard RH",
                    description="Tableau de bord RH et indicateurs staffing.",
                    date_debut=date(2026, 2, 10),
                    date_fin=date(2026, 3, 30),
                ),
                "bi_finance": Etude(
                    nom="BI Finance",
                    description="Consolidation KPI finance et reporting automatisé.",
                    date_debut=date(2026, 2, 15),
                    date_fin=date(2026, 5, 31),
                ),
                "portail_alumni": Etude(
                    nom="Portail Alumni",
                    description="Prototype d'espace alumni avec annuaire et actualités.",
                    date_debut=date(2026, 3, 10),
                    date_fin=date(2026, 5, 10),
                ),
                "facturation_auto": Etude(
                    nom="Automatisation Facturation",
                    description="Automatisation des exports et contrôles de facturation interne.",
                    date_debut=date(2026, 1, 20),
                    date_fin=date(2026, 3, 20),
                ),
                "refonte_intranet": Etude(
                    nom="Refonte Intranet",
                    description="Modernisation UI et simplification des accès internes.",
                    date_debut=date(2025, 12, 1),
                    date_fin=date(2026, 2, 5),
                ),
            }
            db.add_all(list(demo_etudes.values()))
            db.flush()

            if created_demo_intervenants:
                db.add_all(
                    [
                        Affectation(
                            intervenant_id=demo_intervenants["ines"].id,
                            etude_id=demo_etudes["audit_crm"].id,
                            jeh=5,
                            phases=["Conception backend", "API CRUD"],
                        ),
                        Affectation(
                            intervenant_id=demo_intervenants["yanis"].id,
                            etude_id=demo_etudes["audit_crm"].id,
                            jeh=4,
                            phases=["Modelisation base de donnees", "Optimisation SQL"],
                        ),
                        Affectation(
                            intervenant_id=demo_intervenants["clara"].id,
                            etude_id=demo_etudes["audit_crm"].id,
                            jeh=2,
                            phases=["Ateliers besoins", "Recette fonctionnelle"],
                        ),
                        Affectation(
                            intervenant_id=demo_intervenants["ines"].id,
                            etude_id=demo_etudes["dashboard_rh"].id,
                            jeh=3,
                            phases=["Creation front", "Composants UI"],
                        ),
                        Affectation(
                            intervenant_id=demo_intervenants["lea"].id,
                            etude_id=demo_etudes["dashboard_rh"].id,
                            jeh=2,
                            phases=["Tests UI", "Recette"],
                        ),
                        Affectation(
                            intervenant_id=demo_intervenants["sarah"].id,
                            etude_id=demo_etudes["bi_finance"].id,
                            jeh=6,
                            phases=["Data prep", "Dashboard KPI"],
                        ),
                        Affectation(
                            intervenant_id=demo_intervenants["amine"].id,
                            etude_id=demo_etudes["bi_finance"].id,
                            jeh=4,
                            phases=["API integration", "Batch exports"],
                        ),
                        Affectation(
                            intervenant_id=demo_intervenants["mehdi"].id,
                            etude_id=demo_etudes["facturation_auto"].id,
                            jeh=4,
                            phases=["Dockerisation", "CI pipeline"],
                        ),
                        Affectation(
                            intervenant_id=demo_intervenants["hugo"].id,
                            etude_id=demo_etudes["portail_alumni"].id,
                            jeh=3,
                            phases=["Prototype React", "Navigation"],
                        ),
                    ]
                )

        db.commit()
        print("Seed terminee.")


if __name__ == "__main__":
    main()
