from __future__ import annotations

from typing import Annotated

from fastapi import APIRouter, Depends, Response, status
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.schemas.affectation import AffectationCreate, AffectationRead, AffectationUpdate
from app.services import affectations as affectation_service

router = APIRouter(prefix="/affectations", tags=["affectations"])
DbSession = Annotated[Session, Depends(get_db)]


@router.get("", response_model=list[AffectationRead])
def list_affectations(db: DbSession):
    return affectation_service.list_affectations(db)


@router.get("/{affectation_id}", response_model=AffectationRead)
def get_affectation(affectation_id: int, db: DbSession):
    return affectation_service.get_affectation_or_404(db, affectation_id)


@router.post("", response_model=AffectationRead, status_code=status.HTTP_201_CREATED)
def create_affectation(payload: AffectationCreate, db: DbSession):
    return affectation_service.create_affectation(db, payload.model_dump(by_alias=False))


@router.put("/{affectation_id}", response_model=AffectationRead)
def update_affectation(affectation_id: int, payload: AffectationUpdate, db: DbSession):
    return affectation_service.update_affectation(
        db,
        affectation_id,
        payload.model_dump(exclude_unset=True, by_alias=False),
    )


@router.delete("/{affectation_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_affectation(affectation_id: int, db: DbSession) -> Response:
    affectation_service.delete_affectation(db, affectation_id)
    return Response(status_code=status.HTTP_204_NO_CONTENT)
