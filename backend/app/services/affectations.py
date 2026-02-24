from __future__ import annotations

from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session

from app.core.errors import ConflictError, NotFoundError
from app.models import Affectation
from app.repositories import affectations as affectation_repo
from app.services.etudes import get_etude_or_404
from app.services.intervenants import get_intervenant_or_404


def list_affectations(db: Session) -> list[Affectation]:
    return affectation_repo.list_affectations(db)


def get_affectation_or_404(db: Session, affectation_id: int) -> Affectation:
    affectation = affectation_repo.get_affectation(db, affectation_id)
    if affectation is None:
        raise NotFoundError("Affectation introuvable")
    return affectation


def _ensure_refs_exist(db: Session, *, intervenant_id: int, etude_id: int) -> None:
    get_intervenant_or_404(db, intervenant_id)
    get_etude_or_404(db, etude_id)


def create_affectation(db: Session, payload: dict) -> Affectation:
    _ensure_refs_exist(db, intervenant_id=payload["intervenant_id"], etude_id=payload["etude_id"])
    existing = affectation_repo.get_affectation_by_pair(db, payload["etude_id"], payload["intervenant_id"])
    if existing is not None:
        raise ConflictError("Cet intervenant est deja affecte a cette etude")

    try:
        return affectation_repo.create_affectation(db, payload)
    except IntegrityError as exc:
        db.rollback()
        raise ConflictError("Impossible de creer l'affectation (doublon ou contrainte)") from exc


def update_affectation(db: Session, affectation_id: int, payload: dict) -> Affectation:
    affectation = get_affectation_or_404(db, affectation_id)

    next_intervenant_id = payload.get("intervenant_id", affectation.intervenant_id)
    next_etude_id = payload.get("etude_id", affectation.etude_id)
    _ensure_refs_exist(db, intervenant_id=next_intervenant_id, etude_id=next_etude_id)

    if next_intervenant_id != affectation.intervenant_id or next_etude_id != affectation.etude_id:
        existing = affectation_repo.get_affectation_by_pair(db, next_etude_id, next_intervenant_id)
        if existing is not None and existing.id != affectation.id:
            raise ConflictError("Cet intervenant est deja affecte a cette etude")

    try:
        return affectation_repo.update_affectation(db, affectation, payload)
    except IntegrityError as exc:
        db.rollback()
        raise ConflictError("Impossible de modifier l'affectation (doublon ou contrainte)") from exc


def delete_affectation(db: Session, affectation_id: int) -> None:
    affectation = get_affectation_or_404(db, affectation_id)
    affectation_repo.delete_affectation(db, affectation)


def create_affectation_link(db: Session, *, etude_id: int, intervenant_id: int, payload: dict) -> Affectation:
    return create_affectation(
        db,
        {
            "etude_id": etude_id,
            "intervenant_id": intervenant_id,
            **payload,
        },
    )


def delete_affectation_link(db: Session, *, etude_id: int, intervenant_id: int) -> None:
    affectation = affectation_repo.get_affectation_by_pair(db, etude_id=etude_id, intervenant_id=intervenant_id)
    if affectation is None:
        raise NotFoundError("Affectation introuvable pour ce couple etude/intervenant")
    affectation_repo.delete_affectation(db, affectation)
