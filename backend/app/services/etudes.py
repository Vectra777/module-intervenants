from __future__ import annotations

from sqlalchemy.orm import Session

from app.core.errors import BusinessRuleError, NotFoundError
from app.models import Etude
from app.repositories import affectations as affectation_repo
from app.repositories import etudes as etude_repo


def list_etudes(db: Session) -> list[Etude]:
    return etude_repo.list_etudes(db)


def get_etude_or_404(db: Session, etude_id: int) -> Etude:
    etude = etude_repo.get_etude(db, etude_id)
    if etude is None:
        raise NotFoundError("Etude introuvable")
    return etude


def create_etude(db: Session, payload: dict) -> Etude:
    return etude_repo.create_etude(db, payload)


def update_etude(db: Session, etude_id: int, payload: dict) -> Etude:
    etude = get_etude_or_404(db, etude_id)
    next_date_debut = payload.get("date_debut", etude.date_debut)
    next_date_fin = payload.get("date_fin", etude.date_fin)
    if next_date_fin < next_date_debut:
        raise BusinessRuleError("dateFin doit etre superieure ou egale a dateDebut")
    return etude_repo.update_etude(db, etude, payload)


def delete_etude(db: Session, etude_id: int) -> None:
    etude = get_etude_or_404(db, etude_id)
    etude_repo.delete_etude(db, etude)


def list_intervenants_for_etude(db: Session, etude_id: int):
    get_etude_or_404(db, etude_id)
    return etude_repo.list_intervenants_for_etude(db, etude_id)


def compute_etude_cost(db: Session, etude_id: int) -> tuple[float, float]:
    get_etude_or_404(db, etude_id)
    return affectation_repo.etude_cost_totals(db, etude_id)
