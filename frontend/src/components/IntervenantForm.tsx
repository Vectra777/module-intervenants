import type { CreateIntervenantInput, Disponibilite, Intervenant } from '../types/types'

interface IntervenantFormProps {
  editingIntervenantId: number | null
  form: CreateIntervenantInput
  competencesInput: string
  disponibiliteOptions: Disponibilite[]
  onSubmit: () => void
  onFieldChange: (field: 'nom' | 'email' | 'telephone', value: string) => void
  onCompetencesChange: (value: string) => void
  onTjmChange: (value: number) => void
  onDisponibiliteChange: (value: Disponibilite) => void
  onNbJoursChange: (value: Intervenant['nbJoursDisponibles']) => void
  onCancelEdit: () => void
}

export function IntervenantForm({
  editingIntervenantId,
  form,
  competencesInput,
  disponibiliteOptions,
  onSubmit,
  onFieldChange,
  onCompetencesChange,
  onTjmChange,
  onDisponibiliteChange,
  onNbJoursChange,
  onCancelEdit,
}: IntervenantFormProps) {
  return (
    <article className="border-2 border-[#174421] bg-[#fffdf7] p-4">
      <h2 className="mb-3 text-lg font-bold">
        {editingIntervenantId ? 'Modifier un intervenant' : 'Créer un intervenant'}
      </h2>
      <form
        className="space-y-3"
        onSubmit={(event) => {
          event.preventDefault()
          onSubmit()
        }}
      >
        <input
          required
          value={form.nom}
          onChange={(event) => onFieldChange('nom', event.target.value)}
          placeholder="Nom"
          className="w-full border-2 border-[#174421] bg-white px-3 py-2"
        />
        <input
          type="email"
          value={form.email}
          onChange={(event) => onFieldChange('email', event.target.value)}
          placeholder="Email"
          className="w-full border-2 border-[#174421] bg-white px-3 py-2"
        />
        <input
          value={form.telephone}
          onChange={(event) => onFieldChange('telephone', event.target.value)}
          placeholder="Téléphone"
          className="w-full border-2 border-[#174421] bg-white px-3 py-2"
        />
        <input
          value={competencesInput}
          onChange={(event) => onCompetencesChange(event.target.value)}
          placeholder="Compétences (séparées par virgule)"
          className="w-full border-2 border-[#174421] bg-white px-3 py-2"
        />
        <input
          type="number"
          min={1}
          step="0.01"
          value={form.tjm}
          onChange={(event) => onTjmChange(Number(event.target.value))}
          placeholder="TJM (€)"
          className="w-full border-2 border-[#174421] bg-white px-3 py-2"
        />
        <div className="grid grid-cols-2 gap-3">
          <select
            value={form.disponibilite}
            onChange={(event) => onDisponibiliteChange(event.target.value as Disponibilite)}
            className="w-full border-2 border-[#174421] bg-white px-3 py-2"
          >
            {disponibiliteOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
          <input
            type="number"
            min={0}
            max={7}
            value={form.nbJoursDisponibles}
            onChange={(event) => onNbJoursChange(Number(event.target.value) as Intervenant['nbJoursDisponibles'])}
            className="w-full border-2 border-[#174421] bg-white px-3 py-2"
          />
        </div>
        <button
          type="submit"
          className="w-full border-2 border-[#174421] bg-[#174421] px-3 py-2 font-semibold text-[#fffdf7]"
        >
          {editingIntervenantId ? 'Enregistrer les modifications' : 'Ajouter l’intervenant'}
        </button>
        {editingIntervenantId ? (
          <button
            type="button"
            onClick={onCancelEdit}
            className="w-full border-2 border-[#174421] bg-white px-3 py-2 font-semibold"
          >
            Annuler la modification
          </button>
        ) : null}
      </form>
    </article>
  )
}
