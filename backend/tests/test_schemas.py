from __future__ import annotations

import pytest
from pydantic import ValidationError

from app.schemas.etude import EtudeCreate
from app.schemas.intervenant import IntervenantCreate


def test_intervenant_create_normalizes_competences_and_blank_fields() -> None:
    payload = IntervenantCreate(
        nom='  Ines Martin  ',
        email=' ',
        telephone='  ',
        competences=[' React ', '', ' FastAPI '],
        tjm=450,
        disponibilite='Disponible',
        nbJoursDisponibles=4,
    )

    assert payload.nom == 'Ines Martin'
    assert payload.email is None
    assert payload.telephone is None
    assert payload.competences == ['React', 'FastAPI']


def test_intervenant_create_rejects_invalid_tjm() -> None:
    with pytest.raises(ValidationError):
        IntervenantCreate(
            nom='Test',
            email=None,
            telephone=None,
            competences=[],
            tjm=0,
            disponibilite='Disponible',
            nbJoursDisponibles=1,
        )


def test_etude_create_rejects_invalid_date_range() -> None:
    with pytest.raises(ValidationError):
        EtudeCreate(
            nom='Etude invalide',
            description='test',
            dateDebut='2026-03-10',
            dateFin='2026-03-01',
        )
