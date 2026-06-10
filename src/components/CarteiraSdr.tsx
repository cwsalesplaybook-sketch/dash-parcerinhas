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

const SDR_META: Record<SDR, { foto: string; cor: string }> = {
  Gabrielly: { foto: '/gabrielly.jpg', cor: '#A78BFA' },
  Thais: { foto: '/thais.jpg', cor: '#818CF8' },
}

const STATUS_GROUPS: LeadStatus[] = ['dia1','dia2','dia3','dia4','dia5','dia6','dia7','agendado','perdido']

export default function CarteiraSdr({ sdr, leads, onAdd, onMove, onEdit, onDelete }: Props) {
  const [showAdd, setShowAdd] = useState(false)
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null)
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState<LeadStatus | 'todos'>('todos')
  const [collapsed, setCollapsed] = useState<Set<LeadStatus>>(new Set(['perdido']))

  const { foto, cor } = SDR_META[sdr]

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
      {/* Header da SDR */}
      <div className="card p-5 overflow-hidden relative">
        <div className="absolute -top-8 -right-8 w-32 h-32 rounded-full blur-3xl opacity-15" style={{ background: cor }} />
        <div className="relative flex items-center gap-4">
          <img
            src={foto}
            alt={sdr}
            className="h-20 w-20 rounded-2xl object-cover object-top shadow-xl shrink-0"
            style={{ boxShadow: `0 8px 30px ${cor}50` }}
          />
          <div className="flex-1">
            <p className="text-[10px] font-black uppercase tracking-widest mb-1" style={{ color: cor }}>SDR · Tier Agência</p>
            <p className="text-2xl font-black text-white">{sdr}</p>
            <div className="flex items-center gap-4 mt-3">
              <div className="text-center">
                <p className="text-xl font-black text-white">{total}</p>
                <p className="text-[9px] text-purple-300/50 uppercase tracking-wider font-bold">Total</p>
              </div>
              <div className="w-px h-8 bg-[#2E2550]" />
              <div className="text-center">
                <p className="text-xl font-black" style={{ color: cor }}>{ativos}</p>
                <p className="text-[9px] text-purple-300/50 uppercase tracking-wider font-bold">Em sequência</p>
              </div>
              <div className="w-px h-8 bg-[#2E2550]" />
              <div className="text-center">
                <p className="text-xl font-black text-emerald-400">{agendados}</p>
                <p className="text-[9px] text-purple-300/50 uppercase tracking-wider font-bold">EQLs</p>
              </div>
            </div>
          </div>
          <button
            onClick={() => setShowAdd(true)}
            className="btn-primary shrink-0"
          >
            <Plus className="h-4 w-4" /> Adicionar lead
          </button>
        </div>
      </div>

      {/* Toolbar de busca */}
      <div className="flex gap-2 flex-wrap">
        <div className="flex-1 min-w-[180px] relative">
          <Search className="h-3.5 w-3.5 text-purple-400/50 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            className="w-full bg-[#1C1630] border border-[#2E2550] rounded-xl pl-8 pr-3 py-2 text-sm text-white focus:outline-none focus:border-purple-500 placeholder:text-purple-300/30 transition-colors"
            placeholder="Buscar lead, empresa, parceiro..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
        <select
          value={filter}
          onChange={e => setFilter(e.target.value as LeadStatus | 'todos')}
          className="bg-[#1C1630] border border-[#2E2550] rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-purple-500 cursor-pointer"
        >
          <option value="todos">Todos os status</option>
          {STATUS_ORDER.map(s => <option key={s} value={s}>{STATUS_LABEL[s]}</option>)}
        </select>
      </div>

      {/* Grupos por status */}
      <div className="space-y-2">
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
                  <span className="text-xs text-purple-300/40 font-bold">{group.length} {group.length === 1 ? 'lead' : 'leads'}</span>
                </div>
                <ChevronDown className={`h-4 w-4 text-purple-400/40 transition-transform duration-200 ${isCollapsed ? '' : 'rotate-180'}`} />
              </button>
              {!isCollapsed && (
                <div className="border-t border-[#2E2550]">
                  {group.length === 0 ? (
                    <p className="px-4 py-3 text-xs text-purple-300/30 italic">Nenhum lead neste estágio</p>
                  ) : (
                    <div className="divide-y divide-[#2E2550]/50">
                      {group.map(lead => (
                        <LeadRow key={lead.id} lead={lead} cor={cor} onClick={() => setSelectedLead(lead)} />
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

function LeadRow({ lead, cor, onClick }: { lead: Lead; cor: string; onClick: () => void }) {
  return (
    <button onClick={onClick} className="w-full flex items-center gap-3 px-4 py-3 hover:bg-white/5 transition-colors text-left group">
      <div className="h-8 w-8 rounded-full flex items-center justify-center shrink-0 font-black text-sm text-white" style={{ background: cor + '30', color: cor }}>
        {lead.nome[0]?.toUpperCase()}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-bold text-white truncate group-hover:text-purple-200 transition-colors">{lead.nome}</p>
        <p className="text-xs text-purple-300/40 truncate">{lead.empresa}{lead.parceiro ? ` · via ${lead.parceiro}` : ''}</p>
      </div>
      <div className="text-right shrink-0">
        <p className="text-[10px] text-purple-300/30">{lead.dataUltimoContato}</p>
        {lead.observacao && <p className="text-[9px] text-purple-300/25 max-w-[120px] truncate">{lead.observacao}</p>}
      </div>
    </button>
  )
}
