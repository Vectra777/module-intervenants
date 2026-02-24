import { describe, expect, it } from 'vitest'

import { computeEtudeCostTotal, computeHourlyRateFromTjm, splitCommaSeparatedValues } from '../src/utils/moduleMetrics'
import type { Affectation, Intervenant } from '../src/types/types'

describe('moduleMetrics', () => {
  it('splitCommaSeparatedValues nettoie les espaces et ignore les valeurs vides', () => {
    expect(splitCommaSeparatedValues(' React,  FastAPI ,, SQL  ')).toEqual(['React', 'FastAPI', 'SQL'])
  })

  it('computeHourlyRateFromTjm calcule un taux horaire simple', () => {
    expect(computeHourlyRateFromTjm(480, 8)).toBe(60)
    expect(computeHourlyRateFromTjm(480, 0)).toBe(0)
  })

  it('computeEtudeCostTotal somme jeh * tjm pour une étude', () => {
    const intervenants: Intervenant[] = [
      {
        id: 1,
        nom: 'Ines',
        email: '',
        telephone: '',
        competences: ['React'],
        tjm: 450,
        disponibilite: 'Disponible',
        nbJoursDisponibles: 4,
      },
      {
        id: 2,
        nom: 'Yanis',
        email: '',
        telephone: '',
        competences: ['Python'],
        tjm: 500,
        disponibilite: 'Occupé',
        nbJoursDisponibles: 1,
      },
    ]

    const affectations: Affectation[] = [
      { id: 1, intervenantId: 1, etudeId: 10, jeh: 2, phases: [] },
      { id: 2, intervenantId: 2, etudeId: 10, jeh: 3, phases: [] },
      { id: 3, intervenantId: 1, etudeId: 11, jeh: 1, phases: [] },
    ]

    expect(computeEtudeCostTotal(affectations, intervenants, 10)).toBe(2400)
  })
})
