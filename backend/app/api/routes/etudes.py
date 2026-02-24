from __future__ import annotations

from typing import Annotated

from fastapi import APIRouter, Depends, Response, status
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.schemas.affectation import AffectationLinkCreate, AffectationRead
from app.schemas.etude import EtudeCoutTotalResponse, EtudeCreate, EtudeRead, EtudeUpdate
from app.schemas.intervenant import IntervenantRead
from app.services import affectations as affectation_service
from app.services import etudes as etude_service

router = APIRouter(prefix="/etudes", tags=["etudes"])
DbSession = Annotated[Session, Depends(get_db)]


@router.get("", response_model=list[EtudeRead])
def list_etudes(db: DbSession):
    return etude_service.list_etudes(db)


@router.get("/{etude_id}", response_model=EtudeRead)
def get_etude(etude_id: int, db: DbSession):
    return etude_service.get_etude_or_404(db, etude_id)


@router.post("", response_model=EtudeRead, status_code=status.HTTP_201_CREATED)
def create_etude(payload: EtudeCreate, db: DbSession):
    return etude_service.create_etude(db, payload.model_dump(by_alias=False))


@router.put("/{etude_id}", response_model=EtudeRead)
def update_etude(etude_id: int, payload: EtudeUpdate, db: DbSession):
    return etude_service.update_etude(db, etude_id, payload.model_dump(exclude_unset=True, by_alias=False))


@router.delete("/{etude_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_etude(etude_id: int, db: DbSession) -> Response:
    etude_service.delete_etude(db, etude_id)
    return Response(status_code=status.HTTP_204_NO_CONTENT)


@router.get("/{etude_id}/intervenants", response_model=list[IntervenantRead])
def get_intervenants_by_etude(etude_id: int, db: DbSession):
    return etude_service.list_intervenants_for_etude(db, etude_id)


@router.post("/{etude_id}/intervenants/{intervenant_id}", response_model=AffectationRead, status_code=status.HTTP_201_CREATED)
def link_intervenant_to_etude(etude_id: int, intervenant_id: int, payload: AffectationLinkCreate, db: DbSession):
    return affectation_service.create_affectation_link(
        db,
        etude_id=etude_id,
        intervenant_id=intervenant_id,
        payload=payload.model_dump(by_alias=False),
    )


@router.delete("/{etude_id}/intervenants/{intervenant_id}", status_code=status.HTTP_204_NO_CONTENT)
def unlink_intervenant_from_etude(etude_id: int, intervenant_id: int, db: DbSession) -> Response:
    affectation_service.delete_affectation_link(db, etude_id=etude_id, intervenant_id=intervenant_id)
    return Response(status_code=status.HTTP_204_NO_CONTENT)


@router.get("/{etude_id}/cout-total", response_model=EtudeCoutTotalResponse)
def etude_cout_total(etude_id: int, db: DbSession):
    total_jeh, cout_total = etude_service.compute_etude_cost(db, etude_id)
    return EtudeCoutTotalResponse(etude_id=etude_id, total_jeh=round(total_jeh, 2), cout_total=round(cout_total, 2))
