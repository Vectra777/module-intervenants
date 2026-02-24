import type {
	Affectation,
	ApiData,
	ApiError,
	ApiMessage,
	CreateAffectationInput,
	CreateEtudeInput,
	CreateIntervenantInput,
	Etude,
	Intervenant,
	LinkIntervenantEtudeInput,
	UpdateAffectationInput,
	UpdateEtudeInput,
	UpdateIntervenantInput,
} from '../types/types'

const API_BASE_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:8000'

function buildUrl(path: string): string {
	return `${API_BASE_URL}${path}`
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
	const response = await fetch(buildUrl(path), {
		...init,
		headers: {
			'Content-Type': 'application/json',
			...(init?.headers ?? {}),
		},
	})

	if (!response.ok) {
		let details: unknown
		try {
			details = await response.json()
		} catch {
			details = await response.text()
		}

		const apiError: ApiError = {
			message: `API error (${response.status})`,
			status: response.status,
			details,
		}
		throw apiError
	}

	if (response.status === 204) {
		return undefined as T
	}

	return (await response.json()) as T
}

function unwrapData<T>(payload: T | ApiData<T>): T {
	if (payload && typeof payload === 'object' && 'data' in payload) {
		return (payload as ApiData<T>).data
	}
	return payload as T
}

export async function getIntervenants(): Promise<Intervenant[]> {
	const payload = await request<Intervenant[] | ApiData<Intervenant[]>>('/intervenants')
	return unwrapData(payload)
}

export async function getIntervenantById(id: number): Promise<Intervenant> {
	const payload = await request<Intervenant | ApiData<Intervenant>>(`/intervenants/${id}`)
	return unwrapData(payload)
}

export async function createIntervenant(input: CreateIntervenantInput): Promise<Intervenant> {
	const payload = await request<Intervenant | ApiData<Intervenant>>('/intervenants', {
		method: 'POST',
		body: JSON.stringify(input),
	})
	return unwrapData(payload)
}

export async function updateIntervenant(
	id: number,
	input: UpdateIntervenantInput,
): Promise<Intervenant> {
	const payload = await request<Intervenant | ApiData<Intervenant>>(`/intervenants/${id}`, {
		method: 'PUT',
		body: JSON.stringify(input),
	})
	return unwrapData(payload)
}

export async function deleteIntervenant(id: number): Promise<void> {
	await request<void>(`/intervenants/${id}`, { method: 'DELETE' })
}

export async function getEtudes(): Promise<Etude[]> {
	const payload = await request<Etude[] | ApiData<Etude[]>>('/etudes')
	return unwrapData(payload)
}

export async function getEtudeById(id: number): Promise<Etude> {
	const payload = await request<Etude | ApiData<Etude>>(`/etudes/${id}`)
	return unwrapData(payload)
}

export async function createEtude(input: CreateEtudeInput): Promise<Etude> {
	const payload = await request<Etude | ApiData<Etude>>('/etudes', {
		method: 'POST',
		body: JSON.stringify(input),
	})
	return unwrapData(payload)
}

export async function updateEtude(id: number, input: UpdateEtudeInput): Promise<Etude> {
	const payload = await request<Etude | ApiData<Etude>>(`/etudes/${id}`, {
		method: 'PUT',
		body: JSON.stringify(input),
	})
	return unwrapData(payload)
}

export async function deleteEtude(id: number): Promise<void> {
	await request<void>(`/etudes/${id}`, { method: 'DELETE' })
}

export async function getAffectations(): Promise<Affectation[]> {
	const payload = await request<Affectation[] | ApiData<Affectation[]>>('/affectations')
	return unwrapData(payload)
}

export async function createAffectation(input: CreateAffectationInput): Promise<Affectation> {
	const payload = await request<Affectation | ApiData<Affectation>>('/affectations', {
		method: 'POST',
		body: JSON.stringify(input),
	})
	return unwrapData(payload)
}

export async function updateAffectation(
	id: number,
	input: UpdateAffectationInput,
): Promise<Affectation> {
	const payload = await request<Affectation | ApiData<Affectation>>(`/affectations/${id}`, {
		method: 'PUT',
		body: JSON.stringify(input),
	})
	return unwrapData(payload)
}

export async function deleteAffectation(id: number): Promise<void> {
	await request<void>(`/affectations/${id}`, { method: 'DELETE' })
}

export async function linkIntervenantToEtude(input: LinkIntervenantEtudeInput): Promise<Affectation> {
	const { etudeId, intervenantId, ...payloadBody } = input
	const payload = await request<Affectation | ApiData<Affectation>>(
		`/etudes/${etudeId}/intervenants/${intervenantId}`,
		{
			method: 'POST',
			body: JSON.stringify(payloadBody),
		},
	)
	return unwrapData(payload)
}

export async function unlinkIntervenantFromEtude(
	etudeId: number,
	intervenantId: number,
): Promise<void> {
	await request<void>(`/etudes/${etudeId}/intervenants/${intervenantId}`, {
		method: 'DELETE',
	})
}

export async function getIntervenantsByEtude(etudeId: number): Promise<Intervenant[]> {
	const payload = await request<Intervenant[] | ApiData<Intervenant[]>>(`/etudes/${etudeId}/intervenants`)
	return unwrapData(payload)
}

export async function getEtudesByIntervenant(intervenantId: number): Promise<Etude[]> {
	const payload = await request<Etude[] | ApiData<Etude[]>>(`/intervenants/${intervenantId}/etudes`)
	return unwrapData(payload)
}

export async function healthcheck(): Promise<ApiMessage> {
	return request<ApiMessage>('/health')
}
