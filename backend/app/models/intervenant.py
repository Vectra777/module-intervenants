from __future__ import annotations

import enum
from typing import TYPE_CHECKING

from sqlalchemy import CheckConstraint, Enum, Float, Index, Integer, String, text
from sqlalchemy.dialects.postgresql import ARRAY
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.models.base import Base, TimestampMixin

if TYPE_CHECKING:
    from app.models.affectation import Affectation


class DisponibiliteEnum(str, enum.Enum):
    disponible = "Disponible"
    indisponible = "Indisponible"
    occupe = "Occupé"


class Intervenant(Base, TimestampMixin):
    __tablename__ = "intervenants"
    __table_args__ = (
        CheckConstraint("nb_jours_disponibles >= 0 AND nb_jours_disponibles <= 7", name="ck_intervenants_nb_jours"),
        CheckConstraint("tjm > 0", name="ck_intervenants_tjm"),
        Index("ix_intervenants_nom", "nom"),
    )

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    nom: Mapped[str] = mapped_column(String(255), nullable=False)
    email: Mapped[str | None] = mapped_column(String(255), nullable=True)
    telephone: Mapped[str | None] = mapped_column(String(32), nullable=True)
    competences: Mapped[list[str]] = mapped_column(
        ARRAY(String()),
        nullable=False,
        default=list,
        server_default=text("'{}'"),
    )
    disponibilite: Mapped[DisponibiliteEnum] = mapped_column(
        Enum(
            DisponibiliteEnum,
            name="disponibilite_enum",
            values_callable=lambda enum_cls: [member.value for member in enum_cls],
            validate_strings=True,
        ),
        nullable=False,
    )
    nb_jours_disponibles: Mapped[int] = mapped_column(Integer, nullable=False, default=5)
    tjm: Mapped[float] = mapped_column(Float, nullable=False)

    affectations: Mapped[list["Affectation"]] = relationship(
        back_populates="intervenant", cascade="all, delete-orphan", passive_deletes=True
    )
