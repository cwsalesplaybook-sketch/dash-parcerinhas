export type SDR = 'Gabrielly' | 'Thais'

export type LeadStatus =
  | 'dia1' | 'dia2' | 'dia3' | 'dia4' | 'dia5' | 'dia6' | 'dia7'
  | 'agendado'
  | 'perdido'

export interface Lead {
  id: string
  nome: string
  empresa: string
  parceiro: string
  telefone: string
  sdr: SDR
  status: LeadStatus
  dataEntrada: string      // ISO date
  dataUltimoContato: string
  observacao: string
}

export interface Meta {
  metaTotal: number
  eqlsGabrielly: number
  eqlsThais: number
}

export const STATUS_LABEL: Record<LeadStatus, string> = {
  dia1: 'Dia 1',
  dia2: 'Dia 2',
  dia3: 'Dia 3',
  dia4: 'Dia 4',
  dia5: 'Dia 5',
  dia6: 'Dia 6',
  dia7: 'Dia 7',
  agendado: 'Agendado',
  perdido: 'Perdido',
}

export const STATUS_COLOR: Record<LeadStatus, string> = {
  dia1: 'bg-blue-500/20 text-blue-300',
  dia2: 'bg-blue-500/20 text-blue-300',
  dia3: 'bg-indigo-500/20 text-indigo-300',
  dia4: 'bg-indigo-500/20 text-indigo-300',
  dia5: 'bg-violet-500/20 text-violet-300',
  dia6: 'bg-orange-500/20 text-orange-300',
  dia7: 'bg-red-500/20 text-red-300',
  agendado: 'bg-emerald-500/20 text-emerald-300',
  perdido: 'bg-zinc-500/20 text-zinc-400',
}

export const STATUS_ORDER: LeadStatus[] = ['dia1','dia2','dia3','dia4','dia5','dia6','dia7','agendado','perdido']

export const NEXT_STATUS: Partial<Record<LeadStatus, LeadStatus>> = {
  dia1: 'dia2',
  dia2: 'dia3',
  dia3: 'dia4',
  dia4: 'dia5',
  dia5: 'dia6',
  dia6: 'dia7',
}
