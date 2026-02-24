import type { Affectation, Etude, Intervenant } from '../types/types'
import { computeEtudeCostTotal, computeHourlyRateFromTjm } from '../utils/moduleMetrics'

interface EtudesEnCoursSectionProps {
  etudesEnCours: Etude[]
  affectations: Affectation[]
  intervenants: Intervenant[]
  heuresParJeh: number
  onEditAffectation: (affectation: Affectation) => void
  onDeleteAffectation: (affectationId: number) => void
}

export function EtudesEnCoursSection({
  etudesEnCours,
  affectations,
  intervenants,
  heuresParJeh,
  onEditAffectation,
  onDeleteAffectation,
}: EtudesEnCoursSectionProps) {
  return (
    <section className="border-2 border-[#174421] bg-[#fffdf7] p-4">
      <h2 className="mb-3 text-lg font-bold">Études en cours</h2>
      <div className="space-y-4">
        {etudesEnCours.map((etude) => {
          const affectationsEtude = affectations.filter((affectation) => affectation.etudeId === etude.id)
          const totalJehEtude = affectationsEtude.reduce((sum, affectation) => sum + affectation.jeh, 0)
          const coutTotalEtude = computeEtudeCostTotal(affectations, intervenants, etude.id)

          return (
            <article key={etude.id} className="border-2 border-[#174421] bg-white p-3">
              <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
                <h3 className="font-bold">{etude.nom}</h3>
                <span className="border border-[#174421] px-2 py-1 text-xs font-semibold">
                  Total JEH étude: {totalJehEtude}
                </span>
                <span className="border border-[#174421] px-2 py-1 text-xs font-semibold">
                  Coût total: {coutTotalEtude.toFixed(2)} €
                </span>
              </div>
              <p className="mb-3 text-sm">{etude.description}</p>
              <p className="mb-3 text-xs font-medium">
                Période: {etude.dateDebut} → {etude.dateFin}
              </p>
              <div className="overflow-x-auto">
                <table className="min-w-full border-collapse text-sm">
                  <thead>
                    <tr className="text-left">
                      <th className="border-b-2 border-[#174421] py-2 pr-3">Intervenant affecté</th>
                      <th className="border-b-2 border-[#174421] py-2 pr-3">JEH</th>
                      <th className="border-b-2 border-[#174421] py-2 pr-3">Phases</th>
                      <th className="border-b-2 border-[#174421] py-2 pr-3">Taux horaire</th>
                      <th className="border-b-2 border-[#174421] py-2">Taux journalier (JEH)</th>
                      <th className="border-b-2 border-[#174421] py-2 pl-3">Actions association</th>
                    </tr>
                  </thead>
                  <tbody>
                    {affectationsEtude.length === 0 ? (
                      <tr>
                        <td className="border-b border-[#174421]/30 py-3 text-sm italic text-[#174421]/70" colSpan={6}>
                          Aucun intervenant affecté à cette étude.
                        </td>
                      </tr>
                    ) : (
                      affectationsEtude.map((affectation) => {
                        const intervenant = intervenants.find((item) => item.id === affectation.intervenantId)
                        return (
                          <tr key={affectation.id}>
                            <td className="border-b border-[#174421]/30 py-2 pr-3">{intervenant?.nom ?? 'Inconnu'}</td>
                            <td className="border-b border-[#174421]/30 py-2 pr-3">{affectation.jeh}</td>
                            <td className="border-b border-[#174421]/30 py-2 pr-3">
                              {affectation.phases.length > 0 ? affectation.phases.join(', ') : '-'}
                            </td>
                            <td className="border-b border-[#174421]/30 py-2 pr-3">
                              {intervenant ? computeHourlyRateFromTjm(intervenant.tjm, heuresParJeh).toFixed(2) : '-'} €/h
                            </td>
                            <td className="border-b border-[#174421]/30 py-2">
                              {intervenant ? `${intervenant.tjm.toFixed(2)} € / JEH` : '-'}
                            </td>
                            <td className="border-b border-[#174421]/30 py-2 pl-3">
                              <div className="flex gap-2">
                                <button
                                  type="button"
                                  onClick={() => onEditAffectation(affectation)}
                                  className="border border-[#174421] px-2 py-1 text-xs font-semibold"
                                >
                                  Modifier
                                </button>
                                <button
                                  type="button"
                                  onClick={() => onDeleteAffectation(affectation.id)}
                                  className="border border-red-700 px-2 py-1 text-xs font-semibold text-red-700"
                                >
                                  Supprimer
                                </button>
                              </div>
                            </td>
                          </tr>
                        )
                      })
                    )}
                  </tbody>
                </table>
              </div>
            </article>
          )
        })}
      </div>
    </section>
  )
}
