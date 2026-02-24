from __future__ import annotations

from sqlalchemy import select
from sqlalchemy.orm import Session

from app.models import Affectation, Etude, Intervenant


def list_etudes(db: Session) -> list[Etude]:
    return list(db.scalars(select(Etude).order_by(Etude.id.desc())))


def get_etude(db: Session, etude_id: int) -> Etude | None:
    return db.get(Etude, etude_id)


def create_etude(db: Session, payload: dict) -> Etude:
    etude = Etude(**payload)
    db.add(etude)
    db.commit()
    db.refresh(etude)
    return etude


def update_etude(db: Session, etude: Etude, payload: dict) -> Etude:
    for key, value in payload.items():
        setattr(etude, key, value)
    db.commit()
    db.refresh(etude)
    return etude


def delete_etude(db: Session, etude: Etude) -> None:
    db.delete(etude)
    db.commit()


def list_intervenants_for_etude(db: Session, etude_id: int) -> list[Intervenant]:
    stmt = (
        select(Intervenant)
        .join(Affectation, Affectation.intervenant_id == Intervenant.id)
        .where(Affectation.etude_id == etude_id)
        .order_by(Intervenant.id.desc())
    )
    return list(db.scalars(stmt))
