import { useState } from 'react'
import { Plus, Search, ChevronDown } from 'lucide-react'
import type { Lead, SDR, LeadStatus } from '../types'
import { STATUS_LABEL, STATUS_COLOR, STATUS_ORDER } from '../types'
import AddLeadModal from './AddLeadModal'
import LeadDetailModal from './LeadDetailModal'

interface Props {
  sdr: SDR
  leads: Lead[]
  onAdd: (lead: Omit<Lead, 'id'>) => Promise<void>
  onMove: (id: string, status: LeadStatus) => Promise<void>
  onEdit: (lead: Lead) => Promise<void>
  onDelete: (id: string) => Promise<void>
}

const STATUS_GROUPS: LeadStatus[] = ['dia1','dia2','dia3','dia4','dia5','dia6','dia7','agendado','perdido']

export default function CarteiraSdr({ sdr, leads, onAdd, onMove, onEdit, onDelete }: Props) {
  const [showAdd, setShowAdd] = useState(false)
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null)
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState<LeadStatus | 'todos'>('todos')
  const [collapsed, setCollapsed] = useState<Set<LeadStatus>>(new Set(['perdido']))

  const filtered = leads.filter(l => {
    const matchSearch = !search || l.nome.toLowerCase().includes(search.toLowerCase()) || l.empresa.toLowerCase().includes(search.toLowerCase()) || l.parceiro.toLowerCase().includes(search.toLowerCase())
    const matchFilter = filter === 'todos' || l.status === filter
    return matchSearch && matchFilter
  })

  const grouped = STATUS_GROUPS.reduce<Record<LeadStatus, Lead[]>>((acc, s) => {
    acc[s] = filtered.filter(l => l.status === s)
    return acc
  }, {} as Record<LeadStatus, Lead[]>)

  const total = leads.length
  const ativos = leads.filter(l => l.status !== 'perdido' && l.status !== 'agendado').length
  const agendados = leads.filter(l => l.status === 'agendado').length

  function toggleCollapse(s: LeadStatus) {
    setCollapsed(prev => {
      const next = new Set(prev)
      next.has(s) ? next.delete(s) : next.add(s)
      return next
    })
  }

  return (
    <div className="space-y-4">
      {/* Resumo rápido */}
      <div className="grid grid-cols-3 gap-3">
        <div className="card p-3 text-center">
          <p className="text-2xl font-black text-text-primary">{total}</p>
          <p className="text-[10px] text-text-muted uppercase tracking-wider font-bold">Total</p>
        </div>
        <div className="card p-3 text-center">
          <p className="text-2xl font-black text-purple-light">{ativos}</p>
          <p className="text-[10px] text-text-muted uppercase tracking-wider font-bold">Em sequência</p>
        </div>
        <div className="card p-3 text-center">
          <p className="text-2xl font-black text-emerald-400">{agendados}</p>
          <p className="text-[10px] text-text-muted uppercase tracking-wider font-bold">EQLs</p>
        </div>
      </div>

      {/* Toolbar */}
      <div className="flex gap-2 flex-wrap">
        <div className="flex-1 min-w-[180px] relative">
          <Search className="h-3.5 w-3.5 text-text-muted absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            className="w-full bg-[#1A1828] border border-[#2D2A45] rounded-xl pl-8 pr-3 py-2 text-sm text-text-primary focus:outline-none focus:border-purple-DEFAULT placeholder:text-text-muted/50 transition-colors"
            placeholder="Buscar lead, empresa, parceiro..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
        <select
          value={filter}
          onChange={e => setFilter(e.target.value as LeadStatus | 'todos')}
          className="bg-[#1A1828] border border-[#2D2A45] rounded-xl px-3 py-2 text-sm text-text-primary focus:outline-none focus:border-purple-DEFAULT cursor-pointer"
        >
          <option value="todos">Todos os status</option>
          {STATUS_ORDER.map(s => <option key={s} value={s}>{STATUS_LABEL[s]}</option>)}
        </select>
        <button
          onClick={() => setShowAdd(true)}
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-purple-DEFAULT text-white text-sm font-bold hover:bg-purple-dark transition-colors"
        >
          <Plus className="h-4 w-4" /> Adicionar lead
        </button>
      </div>

      {/* Grupos por status */}
      <div className="space-y-3">
        {STATUS_GROUPS.map(s => {
          const group = grouped[s]
          if (group.length === 0 && filter !== 'todos' && filter !== s) return null
          const isCollapsed = collapsed.has(s)
          return (
            <div key={s} className="card overflow-hidden">
              <button
                onClick={() => toggleCollapse(s)}
                className="w-full flex items-center justify-between px-4 py-3 hover:bg-white/5 transition-colors"
              >
                <div className="flex items-center gap-2">
                  <span className={`badge-dia ${STATUS_COLOR[s]}`}>{STATUS_LABEL[s]}</span>
                  <span className="text-xs text-text-muted font-bold">{group.length} {group.length === 1 ? 'lead' : 'leads'}</span>
                </div>
                <ChevronDown className={`h-4 w-4 text-text-muted transition-transform ${isCollapsed ? '' : 'rotate-180'}`} />
              </button>
              {!isCollapsed && (
                <div className="border-t border-[#2D2A45]">
                  {group.length === 0 ? (
                    <p className="px-4 py-3 text-xs text-text-muted italic">Nenhum lead neste estágio</p>
                  ) : (
                    <div className="divide-y divide-[#2D2A45]">
                      {group.map(lead => (
                        <LeadRow key={lead.id} lead={lead} onClick={() => setSelectedLead(lead)} />
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          )
        })}
      </div>

      {showAdd && <AddLeadModal sdr={sdr} onClose={() => setShowAdd(false)} onAdd={onAdd} />}
      {selectedLead && (
        <LeadDetailModal
          lead={selectedLead}
          onClose={() => setSelectedLead(null)}
          onMove={onMove}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      )}
    </div>
  )
}

function LeadRow({ lead, onClick }: { lead: Lead; onClick: () => void }) {
  return (
    <button onClick={onClick} className="w-full flex items-center gap-3 px-4 py-3 hover:bg-white/5 transition-colors text-left">
      <div className="h-8 w-8 rounded-full bg-purple-DEFAULT/20 flex items-center justify-center shrink-0">
        <span className="text-xs font-black text-purple-light">{lead.nome[0]?.toUpperCase()}</span>
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-bold text-text-primary truncate">{lead.nome}</p>
        <p className="text-xs text-text-muted truncate">{lead.empresa}{lead.parceiro ? ` · ${lead.parceiro}` : ''}</p>
      </div>
      <div className="text-right shrink-0">
        <p className="text-xs text-text-muted">{lead.dataUltimoContato}</p>
        {lead.observacao && <p className="text-[10px] text-text-muted/60 max-w-[120px] truncate">{lead.observacao}</p>}
      </div>
    </button>
  )
}
