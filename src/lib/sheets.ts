import type { Lead, Meta } from '../types'

const SHEETS_URL = import.meta.env.VITE_SHEETS_URL as string | undefined

// ─── helpers ─────────────────────────────────────────────────────────────────

async function call<T>(action: string, payload?: object): Promise<T> {
  if (!SHEETS_URL) throw new Error('VITE_SHEETS_URL não configurado')
  const url = new URL(SHEETS_URL)
  url.searchParams.set('action', action)
  if (payload) url.searchParams.set('data', JSON.stringify(payload))
  const res = await fetch(url.toString())
  if (!res.ok) throw new Error(`Sheets API error: ${res.status}`)
  return res.json() as Promise<T>
}

// ─── public API ──────────────────────────────────────────────────────────────

export async function fetchLeads(): Promise<Lead[]> {
  return call<Lead[]>('getLeads')
}

export async function addLead(lead: Omit<Lead, 'id'>): Promise<Lead> {
  return call<Lead>('addLead', lead)
}

export async function updateLead(lead: Lead): Promise<void> {
  return call<void>('updateLead', lead)
}

export async function deleteLead(id: string): Promise<void> {
  return call<void>('deleteLead', { id })
}

export async function fetchMeta(): Promise<Meta> {
  return call<Meta>('getMeta')
}

export async function updateMeta(meta: Meta): Promise<void> {
  return call<void>('updateMeta', meta)
}

// ─── LOCAL STORAGE FALLBACK (usado quando VITE_SHEETS_URL não está configurado) ─

const LS_KEY = 'parcerias_leads'
const LS_META = 'parcerias_meta'

export function loadLeadsLocal(): Lead[] {
  try {
    return JSON.parse(localStorage.getItem(LS_KEY) ?? '[]') as Lead[]
  } catch {
    return []
  }
}

export function saveLeadsLocal(leads: Lead[]): void {
  localStorage.setItem(LS_KEY, JSON.stringify(leads))
}

export function loadMetaLocal(): Meta {
  try {
    return JSON.parse(localStorage.getItem(LS_META) ?? 'null') as Meta ?? defaultMeta()
  } catch {
    return defaultMeta()
  }
}

export function saveMetaLocal(meta: Meta): void {
  localStorage.setItem(LS_META, JSON.stringify(meta))
}

function defaultMeta(): Meta {
  return { metaTotal: 258, eqlsGabrielly: 0, eqlsThais: 0 }
}
