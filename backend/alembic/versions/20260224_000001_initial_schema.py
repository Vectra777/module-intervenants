"""Initial schema for intervenants module."""

from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

# revision identifiers, used by Alembic.
revision: str = "20260224_000001"
down_revision: Union[str, Sequence[str], None] = None
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    disponibilite_enum = postgresql.ENUM(
        "Disponible",
        "Indisponible",
        "Occupé",
        name="disponibilite_enum",
        create_type=False,
    )
    disponibilite_enum.create(op.get_bind(), checkfirst=True)

    op.create_table(
        "intervenants",
        sa.Column("id", sa.Integer(), primary_key=True),
        sa.Column("nom", sa.String(length=255), nullable=False),
        sa.Column("email", sa.String(length=255), nullable=True),
        sa.Column("telephone", sa.String(length=32), nullable=True),
        sa.Column("competences", postgresql.ARRAY(sa.String()), nullable=False, server_default=sa.text("'{}'")),
        sa.Column("disponibilite", disponibilite_enum, nullable=False),
        sa.Column("nb_jours_disponibles", sa.Integer(), nullable=False),
        sa.Column("tjm", sa.Float(), nullable=False),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.text("now()"), nullable=False),
        sa.Column("updated_at", sa.DateTime(timezone=True), server_default=sa.text("now()"), nullable=False),
        sa.CheckConstraint("nb_jours_disponibles >= 0 AND nb_jours_disponibles <= 7", name="ck_intervenants_nb_jours"),
        sa.CheckConstraint("tjm > 0", name="ck_intervenants_tjm"),
    )
    op.create_index("ix_intervenants_nom", "intervenants", ["nom"], unique=False)

    op.create_table(
        "etudes",
        sa.Column("id", sa.Integer(), primary_key=True),
        sa.Column("nom", sa.String(length=255), nullable=False),
        sa.Column("description", sa.Text(), nullable=True),
        sa.Column("date_debut", sa.Date(), nullable=False),
        sa.Column("date_fin", sa.Date(), nullable=False),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.text("now()"), nullable=False),
        sa.Column("updated_at", sa.DateTime(timezone=True), server_default=sa.text("now()"), nullable=False),
        sa.CheckConstraint("date_fin >= date_debut", name="ck_etudes_date_range"),
    )

    op.create_table(
        "affectations",
        sa.Column("id", sa.Integer(), primary_key=True),
        sa.Column("intervenant_id", sa.Integer(), nullable=False),
        sa.Column("etude_id", sa.Integer(), nullable=False),
        sa.Column("jeh", sa.Float(), nullable=False),
        sa.Column("phases", postgresql.ARRAY(sa.String()), nullable=False, server_default=sa.text("'{}'")),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.text("now()"), nullable=False),
        sa.Column("updated_at", sa.DateTime(timezone=True), server_default=sa.text("now()"), nullable=False),
        sa.CheckConstraint("jeh > 0", name="ck_affectations_jeh"),
        sa.ForeignKeyConstraint(["intervenant_id"], ["intervenants.id"], ondelete="CASCADE"),
        sa.ForeignKeyConstraint(["etude_id"], ["etudes.id"], ondelete="CASCADE"),
        sa.UniqueConstraint("intervenant_id", "etude_id", name="uq_affectations_intervenant_etude"),
    )


def downgrade() -> None:
    op.drop_table("affectations")
    op.drop_table("etudes")
    op.drop_index("ix_intervenants_nom", table_name="intervenants")
    op.drop_table("intervenants")
    postgresql.ENUM(
        "Disponible",
        "Indisponible",
        "Occupé",
        name="disponibilite_enum",
        create_type=False,
    ).drop(op.get_bind(), checkfirst=True)
