import { useMemo, useState } from 'react'
import type { Affectation, CreateIntervenantInput, Disponibilite, Etude, Intervenant } from './types/types'
import { AffectationForm } from './components/AffectationForm'
import { EtudesEnCoursSection } from './components/EtudesEnCoursSection'
import { IntervenantForm } from './components/IntervenantForm'
import { IntervenantsTable } from './components/IntervenantsTable'
import { PageHeader } from './components/PageHeader'
import { SearchBar } from './components/SearchBar'

const COUT_JEH = 300
const HEURES_PAR_JEH = 8

const initialIntervenants: Intervenant[] = [
  {
    id: 1,
    nom: 'Ines Martin',
    email: 'ines.martin@sepefrei.fr',
    telephone: '0601020304',
    competences: ['React', 'TypeScript', 'UI'],
    disponibilite: 'Disponible',
    nbJoursDisponibles: 4,
  },
  {
    id: 2,
    nom: 'Yanis Diallo',
    email: 'yanis.diallo@sepefrei.fr',
    telephone: '0605060708',
    competences: ['Python', 'FastAPI', 'SQL'],
    disponibilite: 'Occupé',
    nbJoursDisponibles: 1,
  },
  {
    id: 3,
    nom: 'Sarah Benali',
    email: 'sarah.benali@sepefrei.fr',
    telephone: '0611121314',
    competences: ['Data', 'Power BI', 'Excel'],
    disponibilite: 'Indisponible',
    nbJoursDisponibles: 0,
  },
]

const initialEtudes: Etude[] = [
  {
    id: 1,
    nom: 'Audit CRM',
    description: 'Refonte du suivi client et process commercial.',
    dateDebut: '2026-02-01',
    dateFin: '2026-04-15',
  },
  {
    id: 2,
    nom: 'Dashboard RH',
    description: 'Tableau de bord RH et indicateurs staffing.',
    dateDebut: '2026-02-10',
    dateFin: '2026-03-30',
  },
]

const initialAffectations: Affectation[] = [
  { id: 1, intervenantId: 1, etudeId: 1, jeh: 5, phases: ['Conception backend', 'API CRUD'] },
  { id: 2, intervenantId: 2, etudeId: 1, jeh: 3, phases: ['Modélisation base de données'] },
  { id: 3, intervenantId: 1, etudeId: 2, jeh: 2, phases: ['Création front', 'Tests UI'] },
]

function App() {
  const [intervenants, setIntervenants] = useState<Intervenant[]>(initialIntervenants)
  const [etudes] = useState<Etude[]>(initialEtudes)
  const [affectations, setAffectations] = useState<Affectation[]>(initialAffectations)
  const [search, setSearch] = useState('')
  const [editingIntervenantId, setEditingIntervenantId] = useState<number | null>(null)
  const [affectationForm, setAffectationForm] = useState({
    intervenantId: initialIntervenants[0]?.id ?? 0,
    etudeId: initialEtudes[0]?.id ?? 0,
    jeh: 1,
    phasesInput: '',
  })
  const [affectationError, setAffectationError] = useState('')
  const [form, setForm] = useState<CreateIntervenantInput>({
    nom: '',
    email: '',
    telephone: '',
    competences: [],
    disponibilite: 'Disponible',
    nbJoursDisponibles: 5,
  })
  const [competencesInput, setCompetencesInput] = useState('')

  const filteredIntervenants = useMemo(() => {
    const query = search.trim().toLowerCase()
    if (!query) {
      return intervenants
    }

    return intervenants.filter((intervenant) => {
      const haystack = [
        intervenant.nom,
        intervenant.disponibilite,
        intervenant.competences.join(' '),
      ]
        .join(' ')
        .toLowerCase()
      return haystack.includes(query)
    })
  }, [intervenants, search])

  const getJehByIntervenant = (intervenantId: number) =>
    affectations
      .filter((affectation) => affectation.intervenantId === intervenantId)
      .reduce((sum, affectation) => sum + affectation.jeh, 0)

  const getTauxHoraireMoyen = (intervenantId: number) => {
    const jeh = getJehByIntervenant(intervenantId)
    if (jeh === 0) {
      return 0
    }
    return (jeh * COUT_JEH) / (jeh * HEURES_PAR_JEH)
  }

  const etudesEnCours = useMemo(() => {
    const today = new Date().toISOString().slice(0, 10)
    return etudes.filter((etude) => etude.dateDebut <= today && etude.dateFin >= today)
  }, [etudes])

  const handleCreateIntervenant = () => {
    if (!form.nom.trim()) {
      return
    }

    const competences = competencesInput
      .split(',')
      .map((item) => item.trim())
      .filter(Boolean)

    if (editingIntervenantId) {
      setIntervenants((current) =>
        current.map((item) =>
          item.id === editingIntervenantId
            ? {
                ...item,
                ...form,
                nom: form.nom.trim(),
                competences,
              }
            : item,
        ),
      )
      setEditingIntervenantId(null)
    } else {
      const newIntervenant: Intervenant = {
        id: Date.now(),
        ...form,
        nom: form.nom.trim(),
        competences,
      }
      setIntervenants((current) => [newIntervenant, ...current])
    }

    setForm({
      nom: '',
      email: '',
      telephone: '',
      competences: [],
      disponibilite: 'Disponible',
      nbJoursDisponibles: 5,
    })
    setCompetencesInput('')
  }

  const handleEditIntervenant = (intervenant: Intervenant) => {
    setEditingIntervenantId(intervenant.id)
    setForm({
      nom: intervenant.nom,
      email: intervenant.email,
      telephone: intervenant.telephone,
      competences: intervenant.competences,
      disponibilite: intervenant.disponibilite,
      nbJoursDisponibles: intervenant.nbJoursDisponibles,
    })
    setCompetencesInput(intervenant.competences.join(', '))
  }

  const resetForm = () => {
    setEditingIntervenantId(null)
    setForm({
      nom: '',
      email: '',
      telephone: '',
      competences: [],
      disponibilite: 'Disponible',
      nbJoursDisponibles: 5,
    })
    setCompetencesInput('')
  }

  const handleDeleteIntervenant = (intervenantId: number) => {
    setIntervenants((current) => current.filter((item) => item.id !== intervenantId))
    setAffectations((current) => current.filter((item) => item.intervenantId !== intervenantId))
    if (editingIntervenantId === intervenantId) {
      resetForm()
    }
  }

  const handleEditAffectation = (affectation: Affectation) => {
    const jehInput = window.prompt('Nouveau JEH pour cette affectation :', String(affectation.jeh))
    if (!jehInput) {
      return
    }

    const newJeh = Number(jehInput)
    if (!Number.isFinite(newJeh) || newJeh <= 0) {
      return
    }

    setAffectations((current) =>
      current.map((item) =>
        item.id === affectation.id
          ? {
              ...item,
              jeh: newJeh,
            }
          : item,
      ),
    )
  }

  const handleDeleteAffectation = (affectationId: number) => {
    setAffectations((current) => current.filter((item) => item.id !== affectationId))
  }

  const handleCreateAffectation = () => {
    setAffectationError('')

    if (!affectationForm.intervenantId || !affectationForm.etudeId || affectationForm.jeh <= 0) {
      setAffectationError('Merci de renseigner un intervenant, une étude et un JEH valide.')
      return
    }

    const alreadyAssigned = affectations.some(
      (item) =>
        item.intervenantId === affectationForm.intervenantId && item.etudeId === affectationForm.etudeId,
    )

    if (alreadyAssigned) {
      setAffectationError('Cet intervenant est déjà affecté à cette étude. Modifie l’affectation existante.')
      return
    }

    const newAffectation: Affectation = {
      id: Date.now(),
      intervenantId: affectationForm.intervenantId,
      etudeId: affectationForm.etudeId,
      jeh: affectationForm.jeh,
      phases: affectationForm.phasesInput
        .split(',')
        .map((phase) => phase.trim())
        .filter(Boolean),
    }

    setAffectations((current) => [newAffectation, ...current])
    setAffectationForm((current) => ({
      ...current,
      jeh: 1,
      phasesInput: '',
    }))
  }

  const disponibiliteOptions: Disponibilite[] = ['Disponible', 'Indisponible', 'Occupé']

  return (
    <main className="min-h-screen bg-[#f5f1e6] px-4 py-6 text-[#174421] md:px-8">
      <div className="mx-auto max-w-7xl space-y-6">
        <PageHeader />
        <SearchBar search={search} onChange={setSearch} />

        <section className="grid gap-4 lg:grid-cols-3">
          <IntervenantsTable
            intervenants={filteredIntervenants}
            getJehByIntervenant={getJehByIntervenant}
            getTauxHoraireMoyen={getTauxHoraireMoyen}
            onEditIntervenant={handleEditIntervenant}
            onDeleteIntervenant={handleDeleteIntervenant}
          />

          <IntervenantForm
            editingIntervenantId={editingIntervenantId}
            form={form}
            competencesInput={competencesInput}
            disponibiliteOptions={disponibiliteOptions}
            onSubmit={handleCreateIntervenant}
            onFieldChange={(field, value) => setForm((current) => ({ ...current, [field]: value }))}
            onCompetencesChange={setCompetencesInput}
            onDisponibiliteChange={(value) => setForm((current) => ({ ...current, disponibilite: value }))}
            onNbJoursChange={(value) => setForm((current) => ({ ...current, nbJoursDisponibles: value }))}
            onCancelEdit={resetForm}
          />
        </section>

        <AffectationForm
          intervenants={intervenants}
          etudes={etudes}
          values={affectationForm}
          error={affectationError}
          onSubmit={handleCreateAffectation}
          onIntervenantChange={(intervenantId) =>
            setAffectationForm((current) => ({ ...current, intervenantId }))
          }
          onEtudeChange={(etudeId) => setAffectationForm((current) => ({ ...current, etudeId }))}
          onJehChange={(jeh) => setAffectationForm((current) => ({ ...current, jeh }))}
          onPhasesChange={(phasesInput) =>
            setAffectationForm((current) => ({ ...current, phasesInput }))
          }
        />

        <EtudesEnCoursSection
          etudesEnCours={etudesEnCours}
          affectations={affectations}
          intervenants={intervenants}
          coutJeh={COUT_JEH}
          heuresParJeh={HEURES_PAR_JEH}
          onEditAffectation={handleEditAffectation}
          onDeleteAffectation={handleDeleteAffectation}
        />
      </div>
    </main>
  )
}

export default App
