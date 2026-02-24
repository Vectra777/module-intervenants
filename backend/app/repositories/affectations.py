from __future__ import annotations

from sqlalchemy import func, select
from sqlalchemy.orm import Session

from app.models import Affectation, Intervenant


def list_affectations(db: Session) -> list[Affectation]:
    return list(db.scalars(select(Affectation).order_by(Affectation.id.desc())))


def get_affectation(db: Session, affectation_id: int) -> Affectation | None:
    return db.get(Affectation, affectation_id)


def get_affectation_by_pair(db: Session, etude_id: int, intervenant_id: int) -> Affectation | None:
    stmt = select(Affectation).where(
        Affectation.etude_id == etude_id,
        Affectation.intervenant_id == intervenant_id,
    )
    return db.scalar(stmt)


def create_affectation(db: Session, payload: dict) -> Affectation:
    affectation = Affectation(**payload)
    db.add(affectation)
    db.commit()
    db.refresh(affectation)
    return affectation


def update_affectation(db: Session, affectation: Affectation, payload: dict) -> Affectation:
    for key, value in payload.items():
        setattr(affectation, key, value)
    db.commit()
    db.refresh(affectation)
    return affectation


def delete_affectation(db: Session, affectation: Affectation) -> None:
    db.delete(affectation)
    db.commit()


def etude_cost_totals(db: Session, etude_id: int) -> tuple[float, float]:
    stmt = (
        select(
            func.coalesce(func.sum(Affectation.jeh), 0.0),
            func.coalesce(func.sum(Affectation.jeh * Intervenant.tjm), 0.0),
        )
        .join(Intervenant, Intervenant.id == Affectation.intervenant_id)
        .where(Affectation.etude_id == etude_id)
    )
    total_jeh, cout_total = db.execute(stmt).one()
    return float(total_jeh or 0.0), float(cout_total or 0.0)
