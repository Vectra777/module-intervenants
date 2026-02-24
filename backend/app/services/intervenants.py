from __future__ import annotations

from sqlalchemy.orm import Session

from app.core.errors import NotFoundError
from app.models import Intervenant
from app.repositories import intervenants as intervenant_repo


def list_intervenants(
    db: Session,
    *,
    search: str | None = None,
    competence: str | None = None,
    disponibilite: str | None = None,
) -> list[Intervenant]:
    items = intervenant_repo.list_intervenants(db)

    search_value = (search or "").strip().lower()
    competence_value = (competence or "").strip().lower()
    disponibilite_value = (disponibilite or "").strip().lower()

    if not any([search_value, competence_value, disponibilite_value]):
        return items

    def matches(item: Intervenant) -> bool:
        if disponibilite_value and item.disponibilite.value.lower() != disponibilite_value:
            return False

        if competence_value and not any(competence_value in c.lower() for c in item.competences):
            return False

        if search_value:
            haystack = " ".join([item.nom, item.disponibilite.value, *item.competences]).lower()
            if search_value not in haystack:
                return False

        return True

    return [item for item in items if matches(item)]


def get_intervenant_or_404(db: Session, intervenant_id: int) -> Intervenant:
    intervenant = intervenant_repo.get_intervenant(db, intervenant_id)
    if intervenant is None:
        raise NotFoundError("Intervenant introuvable")
    return intervenant


def create_intervenant(db: Session, payload: dict) -> Intervenant:
    return intervenant_repo.create_intervenant(db, payload)


def update_intervenant(db: Session, intervenant_id: int, payload: dict) -> Intervenant:
    intervenant = get_intervenant_or_404(db, intervenant_id)
    return intervenant_repo.update_intervenant(db, intervenant, payload)


def delete_intervenant(db: Session, intervenant_id: int) -> None:
    intervenant = get_intervenant_or_404(db, intervenant_id)
    intervenant_repo.delete_intervenant(db, intervenant)


def list_etudes_for_intervenant(db: Session, intervenant_id: int):
    get_intervenant_or_404(db, intervenant_id)
    return intervenant_repo.list_etudes_for_intervenant(db, intervenant_id)
