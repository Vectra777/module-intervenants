import type { Affectation, Intervenant } from '../types/types'

export function splitCommaSeparatedValues(input: string): string[] {
  return input
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean)
}

export function computeHourlyRateFromTjm(tjm: number, heuresParJeh: number): number {
  if (!Number.isFinite(tjm) || !Number.isFinite(heuresParJeh) || heuresParJeh <= 0) {
    return 0
  }

  return tjm / heuresParJeh
}

export function computeEtudeCostTotal(
  affectations: Affectation[],
  intervenants: Intervenant[],
  etudeId: number,
): number {
  return affectations
    .filter((affectation) => affectation.etudeId === etudeId)
    .reduce((sum, affectation) => {
      const intervenant = intervenants.find((item) => item.id === affectation.intervenantId)
      return sum + affectation.jeh * (intervenant?.tjm ?? 0)
    }, 0)
}
