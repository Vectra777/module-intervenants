from __future__ import annotations

from typing import Annotated

from fastapi import APIRouter, Depends, Query, Response, status
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.schemas.etude import EtudeRead
from app.schemas.intervenant import IntervenantCreate, IntervenantRead, IntervenantUpdate
from app.services import intervenants as intervenant_service

router = APIRouter(prefix="/intervenants", tags=["intervenants"])
DbSession = Annotated[Session, Depends(get_db)]


@router.get("", response_model=list[IntervenantRead])
def list_intervenants(
    db: DbSession,
    search: Annotated[str | None, Query()] = None,
    competence: Annotated[str | None, Query()] = None,
    disponibilite: Annotated[str | None, Query()] = None,
):
    return intervenant_service.list_intervenants(
        db,
        search=search,
        competence=competence,
        disponibilite=disponibilite,
    )


@router.get("/{intervenant_id}", response_model=IntervenantRead)
def get_intervenant(intervenant_id: int, db: DbSession):
    return intervenant_service.get_intervenant_or_404(db, intervenant_id)


@router.post("", response_model=IntervenantRead, status_code=status.HTTP_201_CREATED)
def create_intervenant(payload: IntervenantCreate, db: DbSession):
    return intervenant_service.create_intervenant(db, payload.model_dump(by_alias=False))


@router.put("/{intervenant_id}", response_model=IntervenantRead)
def update_intervenant(intervenant_id: int, payload: IntervenantUpdate, db: DbSession):
    return intervenant_service.update_intervenant(
        db,
        intervenant_id,
        payload.model_dump(exclude_unset=True, by_alias=False),
    )


@router.delete("/{intervenant_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_intervenant(intervenant_id: int, db: DbSession) -> Response:
    intervenant_service.delete_intervenant(db, intervenant_id)
    return Response(status_code=status.HTTP_204_NO_CONTENT)


@router.get("/{intervenant_id}/etudes", response_model=list[EtudeRead])
def get_etudes_by_intervenant(intervenant_id: int, db: DbSession):
    return intervenant_service.list_etudes_for_intervenant(db, intervenant_id)
