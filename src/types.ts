export type SDR = 'Gabrielly' | 'Thais'

export type LeadStatus =
  | 'dia1' | 'dia2' | 'dia3' | 'dia4' | 'dia5' | 'dia6' | 'dia7'
  | 'agendado'
  | 'opp'
  | 'ganho'
  | 'perdido'

export interface Lead {
  id: string
  nome: string
  empresa: string
  parceiro: string
  telefone: string
  sdr: SDR
  status: LeadStatus
  dataEntrada: string
  dataUltimoContato: string
  observacao: string
  valor?: number        // preenchido quando status = ganho
  plano?: string        // plano contratado
  periodo?: string      // periodicidade
}

export interface Meta {
  metaTotal: number
  eqlsGabrielly: number
  eqlsThais: number
}

export const STATUS_LABEL: Record<LeadStatus, string> = {
  dia1: 'Dia 1', dia2: 'Dia 2', dia3: 'Dia 3', dia4: 'Dia 4',
  dia5: 'Dia 5', dia6: 'Dia 6', dia7: 'Dia 7',
  agendado: 'Agendado (EQL)',
  opp: 'Opp',
  ganho: 'Ganho',
  perdido: 'Perdido',
}

export const STATUS_COLOR: Record<LeadStatus, string> = {
  dia1: 'bg-blue-100 text-blue-700',
  dia2: 'bg-blue-100 text-blue-700',
  dia3: 'bg-indigo-100 text-indigo-700',
  dia4: 'bg-indigo-100 text-indigo-700',
  dia5: 'bg-violet-100 text-violet-700',
  dia6: 'bg-orange-100 text-orange-700',
  dia7: 'bg-red-100 text-red-700',
  agendado: 'bg-emerald-100 text-emerald-700',
  opp: 'bg-purple-100 text-purple-700',
  ganho: 'bg-yellow-100 text-yellow-700',
  perdido: 'bg-zinc-100 text-zinc-500',
}

export const STATUS_ORDER: LeadStatus[] = ['dia1','dia2','dia3','dia4','dia5','dia6','dia7','agendado','opp','ganho','perdido']

export const NEXT_STATUS: Partial<Record<LeadStatus, LeadStatus>> = {
  dia1: 'dia2', dia2: 'dia3', dia3: 'dia4',
  dia4: 'dia5', dia5: 'dia6', dia6: 'dia7',
  agendado: 'opp', opp: 'ganho',
}
