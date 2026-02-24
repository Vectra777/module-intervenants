from __future__ import annotations

from pydantic import Field, field_validator

from app.schemas.common import ApiSchema


class AffectationBase(ApiSchema):
    intervenant_id: int = Field(gt=0)
    etude_id: int = Field(gt=0)
    jeh: float = Field(gt=0)
    phases: list[str] = Field(default_factory=list)

    @field_validator("phases")
    @classmethod
    def normalize_phases(cls, value: list[str]) -> list[str]:
        normalized: list[str] = []
        for item in value:
            item = item.strip()
            if item:
                normalized.append(item)
        return normalized


class AffectationCreate(AffectationBase):
    pass


class AffectationUpdate(ApiSchema):
    intervenant_id: int | None = Field(default=None, gt=0)
    etude_id: int | None = Field(default=None, gt=0)
    jeh: float | None = Field(default=None, gt=0)
    phases: list[str] | None = None

    @field_validator("phases")
    @classmethod
    def normalize_phases(cls, value: list[str] | None) -> list[str] | None:
        if value is None:
            return None
        normalized: list[str] = []
        for item in value:
            item = item.strip()
            if item:
                normalized.append(item)
        return normalized


class AffectationLinkCreate(ApiSchema):
    jeh: float = Field(gt=0)
    phases: list[str] = Field(default_factory=list)

    @field_validator("phases")
    @classmethod
    def normalize_phases(cls, value: list[str]) -> list[str]:
        normalized: list[str] = []
        for item in value:
            item = item.strip()
            if item:
                normalized.append(item)
        return normalized


class AffectationRead(AffectationBase):
    id: int
