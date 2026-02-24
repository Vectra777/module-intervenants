import type { Intervenant } from '../types/types'

interface IntervenantsTableProps {
  intervenants: Intervenant[]
  getJehByIntervenant: (intervenantId: number) => number
  getTauxHoraireMoyen: (intervenantId: number) => number
  onEditIntervenant: (intervenant: Intervenant) => void
  onDeleteIntervenant: (intervenantId: number) => void
}

export function IntervenantsTable({
  intervenants,
  getJehByIntervenant,
  getTauxHoraireMoyen,
  onEditIntervenant,
  onDeleteIntervenant,
}: IntervenantsTableProps) {
  return (
    <article className="border-2 border-[#174421] bg-[#fffdf7] p-4 lg:col-span-2">
      <h2 className="mb-3 text-lg font-bold">Liste des intervenants</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full border-collapse">
          <thead>
            <tr className="text-left text-sm">
              <th className="border-b-2 border-[#174421] py-2 pr-3">Nom</th>
              <th className="border-b-2 border-[#174421] py-2 pr-3">Jours dispo</th>
              <th className="border-b-2 border-[#174421] py-2 pr-3">Disponibilité</th>
              <th className="border-b-2 border-[#174421] py-2 pr-3">Compétences</th>
              <th className="border-b-2 border-[#174421] py-2 pr-3">TJM</th>
              <th className="border-b-2 border-[#174421] py-2 pr-3">JEH affecté</th>
              <th className="border-b-2 border-[#174421] py-2">Taux horaire moyen</th>
              <th className="border-b-2 border-[#174421] py-2 pl-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {intervenants.map((intervenant) => {
              const jehIntervenant = getJehByIntervenant(intervenant.id)
              const tauxHoraireMoyen = getTauxHoraireMoyen(intervenant.id)

              return (
                <tr key={intervenant.id} className="text-sm">
                  <td className="border-b border-[#174421]/30 py-2 pr-3 font-semibold">{intervenant.nom}</td>
                  <td className="border-b border-[#174421]/30 py-2 pr-3">{intervenant.nbJoursDisponibles}</td>
                  <td className="border-b border-[#174421]/30 py-2 pr-3">{intervenant.disponibilite}</td>
                  <td className="border-b border-[#174421]/30 py-2 pr-3">{intervenant.competences.join(', ') || '-'}</td>
                  <td className="border-b border-[#174421]/30 py-2 pr-3">{intervenant.tjm.toFixed(2)} €</td>
                  <td className="border-b border-[#174421]/30 py-2 pr-3">{jehIntervenant} JEH</td>
                  <td className="border-b border-[#174421]/30 py-2">
                    {tauxHoraireMoyen > 0 ? `${tauxHoraireMoyen.toFixed(2)} €/h` : '-'}
                  </td>
                  <td className="border-b border-[#174421]/30 py-2 pl-3">
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => onEditIntervenant(intervenant)}
                        className="border border-[#174421] px-2 py-1 text-xs font-semibold"
                      >
                        Modifier
                      </button>
                      <button
                        type="button"
                        onClick={() => onDeleteIntervenant(intervenant.id)}
                        className="border border-red-700 px-2 py-1 text-xs font-semibold text-red-700"
                      >
                        Supprimer
                      </button>
                    </div>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </article>
  )
}
