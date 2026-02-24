from __future__ import annotations

from sqlalchemy import CheckConstraint, Float, ForeignKey, Integer, String, UniqueConstraint, text
from sqlalchemy.dialects.postgresql import ARRAY
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.models.base import Base, TimestampMixin


class Affectation(Base, TimestampMixin):
    __tablename__ = "affectations"
    __table_args__ = (
        UniqueConstraint("intervenant_id", "etude_id", name="uq_affectations_intervenant_etude"),
        CheckConstraint("jeh > 0", name="ck_affectations_jeh"),
    )

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    intervenant_id: Mapped[int] = mapped_column(ForeignKey("intervenants.id", ondelete="CASCADE"), nullable=False)
    etude_id: Mapped[int] = mapped_column(ForeignKey("etudes.id", ondelete="CASCADE"), nullable=False)
    jeh: Mapped[float] = mapped_column(Float, nullable=False)
    phases: Mapped[list[str]] = mapped_column(
        ARRAY(String()),
        nullable=False,
        default=list,
        server_default=text("'{}'"),
    )

    intervenant = relationship("Intervenant", back_populates="affectations")
    etude = relationship("Etude", back_populates="affectations")
