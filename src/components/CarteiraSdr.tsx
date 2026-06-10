import { useState } from 'react'
import { Plus, Search, ChevronDown } from 'lucide-react'
import type { Lead, SDR, LeadStatus } from '../types'
import { STATUS_LABEL, STATUS_COLOR, STATUS_ORDER } from '../types'
import AddLeadModal from './AddLeadModal'
import LeadDetailModal from './LeadDetailModal'

interface Props {
  sdr: SDR; leads: Lead[]
  onAdd: (lead: Omit<Lead,'id'>) => Promise<void>
  onMove: (id: string, status: LeadStatus) => Promise<void>
  onEdit: (lead: Lead) => Promise<void>
  onDelete: (id: string) => Promise<void>
}

const SDR_FOTO: Record<SDR, string> = { Gabrielly: '/gabrielly.jpg', Thais: '/thais.jpg' }
const STATUS_GROUPS: LeadStatus[] = ['dia1','dia2','dia3','dia4','dia5','dia6','dia7','agendado','perdido']

export default function CarteiraSdr({ sdr, leads, onAdd, onMove, onEdit, onDelete }: Props) {
  const [showAdd, setShowAdd] = useState(false)
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null)
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState<LeadStatus | 'todos'>('todos')
  const [collapsed, setCollapsed] = useState<Set<LeadStatus>>(new Set(['perdido']))

  const filtered = leads.filter(l => {
    const q = search.toLowerCase()
    return (!q || l.nome.toLowerCase().includes(q) || l.empresa.toLowerCase().includes(q) || l.parceiro.toLowerCase().includes(q))
      && (filter === 'todos' || l.status === filter)
  })

  const grouped = STATUS_GROUPS.reduce<Record<LeadStatus,Lead[]>>((acc,s) => {
    acc[s] = filtered.filter(l => l.status === s); return acc
  }, {} as Record<LeadStatus,Lead[]>)

  const agendados = leads.filter(l => l.status === 'agendado').length
  const ativos = leads.filter(l => l.status !== 'perdido' && l.status !== 'agendado').length

  function toggleCollapse(s: LeadStatus) {
    setCollapsed(prev => { const n = new Set(prev); n.has(s) ? n.delete(s) : n.add(s); return n })
  }

  return (
    <div className="space-y-4">
      {/* Header da SDR */}
      <div className="cw-card p-5 flex items-center gap-4">
        <img src={SDR_FOTO[sdr]} alt={sdr} className="h-20 w-20 rounded-2xl object-cover object-top shadow-md shrink-0" />
        <div className="flex-1">
          <p className="text-[10px] font-black uppercase tracking-widest text-cw-muted mb-0.5">SDR · Tier Agência</p>
          <p className="text-2xl font-black text-cw-text">{sdr}</p>
          <div className="flex items-center gap-5 mt-2">
            <Stat value={leads.length} label="Total" color="text-cw-text" />
            <div className="w-px h-7 bg-cw-border" />
            <Stat value={ativos} label="Em sequência" color="text-cw-purple" />
            <div className="w-px h-7 bg-cw-border" />
            <Stat value={agendados} label="EQLs" color="text-green-600" />
          </div>
        </div>
        <button onClick={() => setShowAdd(true)} className="gradient-primary text-white flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-sm font-bold shrink-0 shadow-md hover:opacity-90 transition-opacity">
          <Plus className="h-4 w-4" /> Adicionar lead
        </button>
      </div>

      {/* Filtros */}
      <div className="flex gap-2 flex-wrap">
        <div className="flex-1 min-w-[200px] relative">
          <Search className="h-3.5 w-3.5 text-cw-muted absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            className="w-full bg-cw-surface border border-cw-border rounded-xl pl-8 pr-3 py-2 text-sm text-cw-text focus:outline-none focus:border-cw-purple placeholder:text-cw-muted/50 transition-colors"
            placeholder="Buscar lead, empresa, parceiro..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
        <select
          value={filter}
          onChange={e => setFilter(e.target.value as LeadStatus | 'todos')}
          className="bg-cw-surface border border-cw-border rounded-xl px-3 py-2 text-sm text-cw-text focus:outline-none focus:border-cw-purple cursor-pointer"
        >
          <option value="todos">Todos os status</option>
          {STATUS_ORDER.map(s => <option key={s} value={s}>{STATUS_LABEL[s]}</option>)}
        </select>
      </div>

      {/* Grupos */}
      <div className="space-y-2">
        {STATUS_GROUPS.map(s => {
          const group = grouped[s]
          if (group.length === 0 && filter !== 'todos' && filter !== s) return null
          const isCollapsed = collapsed.has(s)
          return (
            <div key={s} className="cw-card overflow-hidden">
              <button onClick={() => toggleCollapse(s)} className="w-full flex items-center justify-between px-4 py-3 hover:bg-cw-elevated transition-colors">
                <div className="flex items-center gap-2">
                  <span className={`badge-dia ${STATUS_COLOR[s]}`}>{STATUS_LABEL[s]}</span>
                  <span className="text-xs text-cw-muted font-semibold">{group.length} {group.length === 1 ? 'lead' : 'leads'}</span>
                </div>
                <ChevronDown className={`h-4 w-4 text-cw-muted transition-transform duration-200 ${isCollapsed ? '' : 'rotate-180'}`} />
              </button>
              {!isCollapsed && (
                <div className="border-t border-cw-border">
                  {group.length === 0
                    ? <p className="px-4 py-3 text-xs text-cw-muted italic">Nenhum lead neste estágio</p>
                    : <div className="divide-y divide-cw-border">{group.map(l => <LeadRow key={l.id} lead={l} onClick={() => setSelectedLead(l)} />)}</div>
                  }
                </div>
              )}
            </div>
          )
        })}
      </div>

      {showAdd && <AddLeadModal sdr={sdr} onClose={() => setShowAdd(false)} onAdd={onAdd} />}
      {selectedLead && <LeadDetailModal lead={selectedLead} onClose={() => setSelectedLead(null)} onMove={onMove} onEdit={onEdit} onDelete={onDelete} />}
    </div>
  )
}

function Stat({ value, label, color }: { value: number; label: string; color: string }) {
  return (
    <div>
      <p className={`text-xl font-black ${color}`}>{value}</p>
      <p className="text-[9px] text-cw-muted uppercase tracking-wider font-bold">{label}</p>
    </div>
  )
}

function LeadRow({ lead, onClick }: { lead: Lead; onClick: () => void }) {
  return (
    <button onClick={onClick} className="w-full flex items-center gap-3 px-4 py-3 hover:bg-cw-elevated transition-colors text-left group">
      <div className="h-8 w-8 rounded-full bg-cw-purple/10 flex items-center justify-center shrink-0">
        <span className="text-xs font-black text-cw-purple">{lead.nome[0]?.toUpperCase()}</span>
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-bold text-cw-text truncate group-hover:text-cw-purple transition-colors">{lead.nome}</p>
        <p className="text-xs text-cw-muted truncate">{lead.empresa}{lead.parceiro ? ` · via ${lead.parceiro}` : ''}</p>
      </div>
      <div className="text-right shrink-0">
        <p className="text-[10px] text-cw-muted">{lead.dataUltimoContato}</p>
        {lead.observacao && <p className="text-[10px] text-cw-muted/60 max-w-[120px] truncate">{lead.observacao}</p>}
      </div>
    </button>
  )
}
