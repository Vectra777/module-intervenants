from __future__ import annotations

from typing import Self

from pydantic import Field, field_validator, model_validator

from app.models.intervenant import DisponibiliteEnum
from app.schemas.common import ApiSchema


class IntervenantBase(ApiSchema):
    nom: str = Field(min_length=1, max_length=255)
    email: str | None = Field(default=None, max_length=255)
    telephone: str | None = Field(default=None, max_length=32)
    competences: list[str] = Field(default_factory=list)
    disponibilite: DisponibiliteEnum
    nb_jours_disponibles: int = Field(ge=0, le=7)
    tjm: float = Field(gt=0)

    @field_validator("nom")
    @classmethod
    def strip_nom(cls, value: str) -> str:
        value = value.strip()
        if not value:
            raise ValueError("Le nom est obligatoire")
        return value

    @field_validator("email", "telephone")
    @classmethod
    def blank_to_none(cls, value: str | None) -> str | None:
        if value is None:
            return None
        value = value.strip()
        return value or None

    @field_validator("competences")
    @classmethod
    def normalize_competences(cls, value: list[str]) -> list[str]:
        normalized: list[str] = []
        for item in value:
            item = item.strip()
            if item:
                normalized.append(item)
        return normalized


class IntervenantCreate(IntervenantBase):
    pass


class IntervenantUpdate(ApiSchema):
    nom: str | None = Field(default=None, min_length=1, max_length=255)
    email: str | None = Field(default=None, max_length=255)
    telephone: str | None = Field(default=None, max_length=32)
    competences: list[str] | None = None
    disponibilite: DisponibiliteEnum | None = None
    nb_jours_disponibles: int | None = Field(default=None, ge=0, le=7)
    tjm: float | None = Field(default=None, gt=0)

    @field_validator("nom")
    @classmethod
    def strip_optional_nom(cls, value: str | None) -> str | None:
        if value is None:
            return None
        value = value.strip()
        if not value:
            raise ValueError("Le nom ne peut pas etre vide")
        return value

    @field_validator("email", "telephone")
    @classmethod
    def blank_to_none(cls, value: str | None) -> str | None:
        if value is None:
            return None
        value = value.strip()
        return value or None

    @field_validator("competences")
    @classmethod
    def normalize_competences(cls, value: list[str] | None) -> list[str] | None:
        if value is None:
            return None
        normalized: list[str] = []
        for item in value:
            item = item.strip()
            if item:
                normalized.append(item)
        return normalized


class IntervenantRead(IntervenantBase):
    id: int
