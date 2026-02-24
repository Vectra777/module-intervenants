from __future__ import annotations

from datetime import date
from typing import TYPE_CHECKING

from sqlalchemy import CheckConstraint, Date, Integer, String, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.models.base import Base, TimestampMixin

if TYPE_CHECKING:
    from app.models.affectation import Affectation


class Etude(Base, TimestampMixin):
    __tablename__ = "etudes"
    __table_args__ = (CheckConstraint("date_fin >= date_debut", name="ck_etudes_date_range"),)

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    nom: Mapped[str] = mapped_column(String(255), nullable=False)
    description: Mapped[str | None] = mapped_column(Text, nullable=True)
    date_debut: Mapped[date] = mapped_column(Date, nullable=False)
    date_fin: Mapped[date] = mapped_column(Date, nullable=False)

    affectations: Mapped[list["Affectation"]] = relationship(
        back_populates="etude", cascade="all, delete-orphan", passive_deletes=True
    )
