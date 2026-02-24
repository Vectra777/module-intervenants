from __future__ import annotations

from datetime import date

from pydantic import Field, field_validator, model_validator

from app.schemas.common import ApiSchema


class EtudeBase(ApiSchema):
    nom: str = Field(min_length=1, max_length=255)
    description: str | None = None
    date_debut: date
    date_fin: date

    @field_validator("nom")
    @classmethod
    def strip_nom(cls, value: str) -> str:
        value = value.strip()
        if not value:
            raise ValueError("Le nom est obligatoire")
        return value

    @field_validator("description")
    @classmethod
    def blank_desc_to_none(cls, value: str | None) -> str | None:
        if value is None:
            return None
        value = value.strip()
        return value or None

    @model_validator(mode="after")
    def validate_dates(self):
        if self.date_fin < self.date_debut:
            raise ValueError("dateFin doit etre superieure ou egale a dateDebut")
        return self


class EtudeCreate(EtudeBase):
    pass


class EtudeUpdate(ApiSchema):
    nom: str | None = Field(default=None, min_length=1, max_length=255)
    description: str | None = None
    date_debut: date | None = None
    date_fin: date | None = None

    @field_validator("nom")
    @classmethod
    def strip_optional_nom(cls, value: str | None) -> str | None:
        if value is None:
            return None
        value = value.strip()
        if not value:
            raise ValueError("Le nom ne peut pas etre vide")
        return value

    @field_validator("description")
    @classmethod
    def blank_desc_to_none(cls, value: str | None) -> str | None:
        if value is None:
            return None
        value = value.strip()
        return value or None


class EtudeRead(EtudeBase):
    id: int


class EtudeCoutTotalResponse(ApiSchema):
    etude_id: int
    total_jeh: float
    cout_total: float
    devise: str = "EUR"
