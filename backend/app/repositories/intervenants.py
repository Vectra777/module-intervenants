from __future__ import annotations

from sqlalchemy import select
from sqlalchemy.orm import Session

from app.models import Affectation, Etude, Intervenant


def list_intervenants(db: Session) -> list[Intervenant]:
    return list(db.scalars(select(Intervenant).order_by(Intervenant.id.desc())))


def get_intervenant(db: Session, intervenant_id: int) -> Intervenant | None:
    return db.get(Intervenant, intervenant_id)


def create_intervenant(db: Session, payload: dict) -> Intervenant:
    intervenant = Intervenant(**payload)
    db.add(intervenant)
    db.commit()
    db.refresh(intervenant)
    return intervenant


def update_intervenant(db: Session, intervenant: Intervenant, payload: dict) -> Intervenant:
    for key, value in payload.items():
        setattr(intervenant, key, value)
    db.commit()
    db.refresh(intervenant)
    return intervenant


def delete_intervenant(db: Session, intervenant: Intervenant) -> None:
    db.delete(intervenant)
    db.commit()


def list_etudes_for_intervenant(db: Session, intervenant_id: int) -> list[Etude]:
    stmt = (
        select(Etude)
        .join(Affectation, Affectation.etude_id == Etude.id)
        .where(Affectation.intervenant_id == intervenant_id)
        .order_by(Etude.id.desc())
    )
    return list(db.scalars(stmt))
