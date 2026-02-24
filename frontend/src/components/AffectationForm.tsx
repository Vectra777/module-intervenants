import type { Etude, Intervenant } from '../types/types'

interface AffectationFormValues {
  intervenantId: number
  etudeId: number
  jeh: number
  phasesInput: string
}

interface AffectationFormProps {
  intervenants: Intervenant[]
  etudes: Etude[]
  values: AffectationFormValues
  error: string
  onSubmit: () => void
  onIntervenantChange: (intervenantId: number) => void
  onEtudeChange: (etudeId: number) => void
  onJehChange: (jeh: number) => void
  onPhasesChange: (phasesInput: string) => void
}

export function AffectationForm({
  intervenants,
  etudes,
  values,
  error,
  onSubmit,
  onIntervenantChange,
  onEtudeChange,
  onJehChange,
  onPhasesChange,
}: AffectationFormProps) {
  return (
    <section className="border-2 border-[#174421] bg-[#fffdf7] p-4">
      <h2 className="mb-3 text-lg font-bold">Nouvelle affectation (intervenant ↔ étude)</h2>
      <form
        className="grid gap-3 md:grid-cols-4"
        onSubmit={(event) => {
          event.preventDefault()
          onSubmit()
        }}
      >
        <select
          value={values.intervenantId}
          onChange={(event) => onIntervenantChange(Number(event.target.value))}
          className="border-2 border-[#174421] bg-white px-3 py-2"
        >
          {intervenants.map((intervenant) => (
            <option key={intervenant.id} value={intervenant.id}>
              {intervenant.nom}
            </option>
          ))}
        </select>

        <select
          value={values.etudeId}
          onChange={(event) => onEtudeChange(Number(event.target.value))}
          className="border-2 border-[#174421] bg-white px-3 py-2"
        >
          {etudes.map((etude) => (
            <option key={etude.id} value={etude.id}>
              {etude.nom}
            </option>
          ))}
        </select>

        <input
          type="number"
          min={1}
          value={values.jeh}
          onChange={(event) => onJehChange(Number(event.target.value))}
          placeholder="JEH"
          className="border-2 border-[#174421] bg-white px-3 py-2"
        />

        <input
          value={values.phasesInput}
          onChange={(event) => onPhasesChange(event.target.value)}
          placeholder="Phases (ex: conception backend, création front)"
          className="border-2 border-[#174421] bg-white px-3 py-2 md:col-span-4"
        />

        <button
          type="submit"
          className="md:col-span-4 border-2 border-[#174421] bg-[#174421] px-3 py-2 font-semibold text-[#fffdf7]"
        >
          Créer l’affectation
        </button>
        {error ? (
          <p className="md:col-span-4 border border-red-700 bg-red-50 px-3 py-2 text-sm font-medium text-red-700">
            {error}
          </p>
        ) : null}
      </form>
    </section>
  )
}
