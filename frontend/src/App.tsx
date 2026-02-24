import { useEffect, useMemo, useState } from 'react'
import {
  createIntervenant,
  deleteAffectation,
  deleteIntervenant,
  getAffectations,
  getEtudes,
  getIntervenants,
  linkIntervenantToEtude,
  updateAffectation,
  updateIntervenant,
} from './api/api'
import { AffectationForm } from './components/AffectationForm'
import { EtudesEnCoursSection } from './components/EtudesEnCoursSection'
import { IntervenantForm } from './components/IntervenantForm'
import { IntervenantsTable } from './components/IntervenantsTable'
import { PageHeader } from './components/PageHeader'
import { SearchBar } from './components/SearchBar'
import type { Affectation, CreateIntervenantInput, Disponibilite, Etude, Intervenant } from './types/types'
import { computeHourlyRateFromTjm, splitCommaSeparatedValues } from './utils/moduleMetrics'

const HEURES_PAR_JEH = 8

function getErrorMessage(error: unknown, fallback: string): string {
  if (error && typeof error === 'object') {
    const maybeDetails = (error as { details?: unknown }).details
    if (maybeDetails && typeof maybeDetails === 'object' && 'message' in (maybeDetails as Record<string, unknown>)) {
      const message = (maybeDetails as { message?: unknown }).message
      if (typeof message === 'string' && message.trim()) {
        return message
      }
    }

    const message = (error as { message?: unknown }).message
    if (typeof message === 'string' && message.trim()) {
      return message
    }
  }

  return fallback
}

function App() {
  const [intervenants, setIntervenants] = useState<Intervenant[]>([])
  const [etudes, setEtudes] = useState<Etude[]>([])
  const [affectations, setAffectations] = useState<Affectation[]>([])
  const [loading, setLoading] = useState(true)
  const [apiError, setApiError] = useState('')
  const [search, setSearch] = useState('')
  const [editingIntervenantId, setEditingIntervenantId] = useState<number | null>(null)
  const [affectationForm, setAffectationForm] = useState({
    intervenantId: 0,
    etudeId: 0,
    jeh: 1,
    phasesInput: '',
  })
  const [affectationError, setAffectationError] = useState('')
  const [form, setForm] = useState<CreateIntervenantInput>({
    nom: '',
    email: '',
    telephone: '',
    competences: [],
    tjm: 450,
    disponibilite: 'Disponible',
    nbJoursDisponibles: 5,
  })
  const [competencesInput, setCompetencesInput] = useState('')

  const loadData = async () => {
    setApiError('')
    setLoading(true)
    try {
      const [intervenantsData, etudesData, affectationsData] = await Promise.all([
        getIntervenants(),
        getEtudes(),
        getAffectations(),
      ])
      setIntervenants(intervenantsData)
      setEtudes(etudesData)
      setAffectations(affectationsData)
    } catch (error) {
      setApiError(getErrorMessage(error, 'Impossible de charger les données depuis le backend.'))
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    void loadData()
  }, [])

  useEffect(() => {
    setAffectationForm((current) => ({
      ...current,
      intervenantId: intervenants.some((item) => item.id === current.intervenantId)
        ? current.intervenantId
        : (intervenants[0]?.id ?? 0),
      etudeId: etudes.some((item) => item.id === current.etudeId) ? current.etudeId : (etudes[0]?.id ?? 0),
    }))
  }, [intervenants, etudes])

  const filteredIntervenants = useMemo(() => {
    const query = search.trim().toLowerCase()
    if (!query) {
      return intervenants
    }

    return intervenants.filter((intervenant) => {
      const haystack = [intervenant.nom, intervenant.disponibilite, intervenant.competences.join(' ')]
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
    const intervenant = intervenants.find((item) => item.id === intervenantId)
    if (!intervenant) {
      return 0
    }
    return computeHourlyRateFromTjm(intervenant.tjm, HEURES_PAR_JEH)
  }

  const etudesEnCours = useMemo(() => {
    const today = new Date().toISOString().slice(0, 10)
    return etudes.filter((etude) => etude.dateDebut <= today && etude.dateFin >= today)
  }, [etudes])

  const resetForm = () => {
    setEditingIntervenantId(null)
    setForm({
      nom: '',
      email: '',
      telephone: '',
      competences: [],
      tjm: 450,
      disponibilite: 'Disponible',
      nbJoursDisponibles: 5,
    })
    setCompetencesInput('')
  }

  const handleCreateIntervenant = async () => {
    setApiError('')

    if (!form.nom.trim()) {
      return
    }

    const competences = splitCommaSeparatedValues(competencesInput)

    const payload: CreateIntervenantInput = {
      ...form,
      nom: form.nom.trim(),
      competences,
    }

    try {
      if (editingIntervenantId) {
        const updated = await updateIntervenant(editingIntervenantId, payload)
        setIntervenants((current) => current.map((item) => (item.id === updated.id ? updated : item)))
      } else {
        const created = await createIntervenant(payload)
        setIntervenants((current) => [created, ...current])
      }
      resetForm()
    } catch (error) {
      setApiError(getErrorMessage(error, 'Impossible de sauvegarder l’intervenant.'))
    }
  }

  const handleEditIntervenant = (intervenant: Intervenant) => {
    setEditingIntervenantId(intervenant.id)
    setForm({
      nom: intervenant.nom,
      email: intervenant.email ?? '',
      telephone: intervenant.telephone ?? '',
      competences: intervenant.competences,
      tjm: intervenant.tjm,
      disponibilite: intervenant.disponibilite,
      nbJoursDisponibles: intervenant.nbJoursDisponibles,
    })
    setCompetencesInput(intervenant.competences.join(', '))
  }

  const handleDeleteIntervenant = async (intervenantId: number) => {
    setApiError('')
    try {
      await deleteIntervenant(intervenantId)
      setIntervenants((current) => current.filter((item) => item.id !== intervenantId))
      setAffectations((current) => current.filter((item) => item.intervenantId !== intervenantId))
      if (editingIntervenantId === intervenantId) {
        resetForm()
      }
    } catch (error) {
      setApiError(getErrorMessage(error, 'Impossible de supprimer l’intervenant.'))
    }
  }

  const handleEditAffectation = async (affectation: Affectation) => {
    const jehInput = window.prompt('Nouveau JEH pour cette affectation :', String(affectation.jeh))
    if (!jehInput) {
      return
    }

    const newJeh = Number(jehInput)
    if (!Number.isFinite(newJeh) || newJeh <= 0) {
      return
    }

    setApiError('')
    try {
      const updated = await updateAffectation(affectation.id, { jeh: newJeh })
      setAffectations((current) => current.map((item) => (item.id === updated.id ? updated : item)))
    } catch (error) {
      setApiError(getErrorMessage(error, 'Impossible de modifier l’affectation.'))
    }
  }

  const handleDeleteAffectation = async (affectationId: number) => {
    setApiError('')
    try {
      await deleteAffectation(affectationId)
      setAffectations((current) => current.filter((item) => item.id !== affectationId))
    } catch (error) {
      setApiError(getErrorMessage(error, 'Impossible de supprimer l’affectation.'))
    }
  }

  const handleCreateAffectation = async () => {
    setAffectationError('')
    setApiError('')

    if (intervenants.length === 0 || etudes.length === 0) {
      setAffectationError('Ajoute d’abord au moins un intervenant et une étude côté backend (ou lance le seed).')
      return
    }

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

    try {
      const created = await linkIntervenantToEtude({
        intervenantId: affectationForm.intervenantId,
        etudeId: affectationForm.etudeId,
        jeh: affectationForm.jeh,
        phases: splitCommaSeparatedValues(affectationForm.phasesInput),
      })

      setAffectations((current) => [created, ...current])
      setAffectationForm((current) => ({
        ...current,
        jeh: 1,
        phasesInput: '',
      }))
    } catch (error) {
      const message = getErrorMessage(error, 'Impossible de créer l’affectation.')
      setAffectationError(message)
    }
  }

  const disponibiliteOptions: Disponibilite[] = ['Disponible', 'Indisponible', 'Occupé']

  return (
    <main className="min-h-screen bg-[#f5f1e6] px-4 py-6 text-[#174421] md:px-8">
      <div className="mx-auto max-w-7xl space-y-6">
        <PageHeader />

        {apiError ? (
          <section className="border-2 border-red-700 bg-red-50 p-4 text-sm font-semibold text-red-700">
            {apiError}
          </section>
        ) : null}

        {loading ? (
          <section className="border-2 border-[#174421] bg-[#fffdf7] p-4 text-sm font-semibold">
            Chargement des données…
          </section>
        ) : null}

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
            
            onSubmit={() => {
              void handleCreateIntervenant()
            }}
            onFieldChange={(field, value) => setForm((current) => ({ ...current, [field]: value }))}
            onCompetencesChange={setCompetencesInput}
            onTjmChange={(value) => setForm((current) => ({ ...current, tjm: Number.isFinite(value) ? value : 0 }))}
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
          onSubmit={() => {
            void handleCreateAffectation()
          }}
          onIntervenantChange={(intervenantId) => setAffectationForm((current) => ({ ...current, intervenantId }))}
          onEtudeChange={(etudeId) => setAffectationForm((current) => ({ ...current, etudeId }))}
          onJehChange={(jeh) => setAffectationForm((current) => ({ ...current, jeh }))}
          onPhasesChange={(phasesInput) => setAffectationForm((current) => ({ ...current, phasesInput }))}
        />

        <EtudesEnCoursSection
          etudesEnCours={etudesEnCours}
          affectations={affectations}
          intervenants={intervenants}
          heuresParJeh={HEURES_PAR_JEH}
          onEditAffectation={(affectation) => {
            void handleEditAffectation(affectation)
          }}
          onDeleteAffectation={(affectationId) => {
            void handleDeleteAffectation(affectationId)
          }}
        />
      </div>
    </main>
  )
}

export default App
