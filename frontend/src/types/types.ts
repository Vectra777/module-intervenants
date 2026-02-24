export type Disponibilite = 'Disponible' | 'Indisponible' | 'Occupé'

export type Intervenant = {
    id: number
    nom: string
    email: string
    telephone: string
    competences: string[]
    tjm: number
    disponibilite: Disponibilite
    nbJoursDisponibles: 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7
}

export type Affectation = {
    id: number
    intervenantId: number
    etudeId: number
    jeh: number
    phases: string[]
}

export type Etude = {
    id: number
    nom: string
    description: string
    dateDebut: string
    dateFin: string
}

export type CreateIntervenantInput = Omit<Intervenant, 'id'>
export type UpdateIntervenantInput = Partial<CreateIntervenantInput>

export type CreateEtudeInput = Omit<Etude, 'id'>
export type UpdateEtudeInput = Partial<CreateEtudeInput>

export type CreateAffectationInput = Omit<Affectation, 'id'>
export type UpdateAffectationInput = Partial<CreateAffectationInput>

export type LinkIntervenantEtudeInput = {
    intervenantId: number
    etudeId: number
    jeh: number
    phases: string[]
}

export type ApiData<T> = {
    data: T
}

export type ApiMessage = {
    message: string
}

export type ApiError = {
    message: string
    status: number
    details?: unknown
}
