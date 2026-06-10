import { useState } from 'react'
import { X, Copy, Check, ChevronRight, Trash2 } from 'lucide-react'
import type { Lead, LeadStatus } from '../types'
import { STATUS_LABEL, STATUS_COLOR, STATUS_ORDER, NEXT_STATUS } from '../types'
import { SEQUENCIA } from '../data/mensagens'

interface Props {
  lead: Lead
  onClose: () => void
  onMove: (id: string, status: LeadStatus) => Promise<void>
  onEdit: (lead: Lead) => Promise<void>
  onDelete: (id: string) => Promise<void>
}

function applyVars(text: string, lead: Lead, salesman: string) {
  return text
    .replace(/\{\{firstName\}\}/g, lead.nome.split(' ')[0])
    .replace(/\{\{salesman\}\}/g, salesman)
    .replace(/\{\{onParceiro\}\}/g, lead.parceiro || 'nosso parceiro')
}

export default function LeadDetailModal({ lead, onClose, onMove, onEdit, onDelete }: Props) {
  const [copied, setCopied] = useState<string | null>(null)
  const [editObs, setEditObs] = useState(lead.observacao)
  const [savingObs, setSavingObs] = useState(false)
  const [confirmDel, setConfirmDel] = useState(false)

  const diaNum = lead.status.startsWith('dia') ? parseInt(lead.status.replace('dia', '')) : null
  const msgData = diaNum ? SEQUENCIA[diaNum - 1] : null
  const salesman = lead.sdr

  async function copy(text: string, key: string) {
    await navigator.clipboard.writeText(text)
    setCopied(key)
    setTimeout(() => setCopied(null), 2000)
  }

  async function handleMove(status: LeadStatus) {
    await onMove(lead.id, status)
    onClose()
  }

  async function saveObs() {
    setSavingObs(true)
    await onEdit({ ...lead, observacao: editObs })
    setSavingObs(false)
  }

  async function handleDelete() {
    await onDelete(lead.id)
    onClose()
  }

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="card w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl">
        {/* Header */}
        <div className="p-6 border-b border-[#2D2A45] flex items-start justify-between sticky top-0 bg-[#1A1828] z-10">
          <div>
            <p className="text-xs text-text-muted">{lead.empresa} · {lead.parceiro}</p>
            <h2 className="text-xl font-black text-text-primary">{lead.nome}</h2>
            <div className="flex items-center gap-2 mt-1.5">
              <span className={`badge-dia ${STATUS_COLOR[lead.status]}`}>{STATUS_LABEL[lead.status]}</span>
              {lead.telefone && <span className="text-xs text-text-muted">{lead.telefone}</span>}
            </div>
          </div>
          <button onClick={onClose} className="h-8 w-8 rounded-lg hover:bg-[#2D2A45] flex items-center justify-center shrink-0">
            <X className="h-4 w-4 text-text-muted" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Mover status */}
          <div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-text-muted mb-3">Atualizar status</p>
            <div className="flex flex-wrap gap-2">
              {STATUS_ORDER.filter(s => s !== lead.status).map(s => (
                <button
                  key={s}
                  onClick={() => handleMove(s)}
                  className={`badge-dia ${STATUS_COLOR[s]} hover:opacity-80 cursor-pointer transition-opacity`}
                >
                  {STATUS_LABEL[s]}
                </button>
              ))}
            </div>
            {NEXT_STATUS[lead.status] && (
              <button
                onClick={() => handleMove(NEXT_STATUS[lead.status]!)}
                className="mt-3 w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-purple-DEFAULT text-white text-sm font-bold hover:bg-purple-dark transition-colors"
              >
                Avançar para {STATUS_LABEL[NEXT_STATUS[lead.status]!]}
                <ChevronRight className="h-4 w-4" />
              </button>
            )}
          </div>

          {/* Mensagens do dia */}
          {msgData && (
            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-text-muted mb-3">
                Mensagens — {msgData.titulo}
              </p>
              <div className="rounded-xl bg-[#0F0E17] border border-[#2D2A45] p-3 mb-2">
                <p className="text-[10px] text-text-muted font-bold uppercase tracking-wider mb-1">Atividades do dia</p>
                <p className="text-xs text-text-primary">{msgData.atividades}</p>
              </div>
              <div className="rounded-xl bg-amber-500/5 border border-amber-500/20 p-3 mb-3">
                <p className="text-[10px] text-amber-400 font-bold uppercase tracking-wider mb-1">Task</p>
                <p className="text-xs text-amber-200">{msgData.task}</p>
              </div>
              {[
                { key: 'comoEsta', label: 'Versão "Como está"', text: msgData.msgComoEsta },
                { key: 'atualizacao', label: 'Versão "Atualização"', text: msgData.msgAtualizacao },
              ].filter(v => v.text).map(({ key, label, text }) => {
                const filled = applyVars(text, lead, salesman)
                return (
                  <div key={key} className="mb-3">
                    <div className="flex items-center justify-between mb-1.5">
                      <p className="text-[10px] font-bold uppercase tracking-widest text-text-muted">{label}</p>
                      <button
                        onClick={() => copy(filled, key)}
                        className="flex items-center gap-1 text-[10px] text-purple-light hover:text-purple-DEFAULT transition-colors"
                      >
                        {copied === key ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
                        {copied === key ? 'Copiado!' : 'Copiar'}
                      </button>
                    </div>
                    <div className="bg-[#0F0E17] border border-[#2D2A45] rounded-xl p-3">
                      <p className="text-xs text-text-primary whitespace-pre-wrap leading-relaxed">{filled}</p>
                    </div>
                  </div>
                )
              })}
            </div>
          )}

          {/* Observação */}
          <div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-text-muted mb-2">Observação</p>
            <textarea
              className="w-full bg-[#0F0E17] border border-[#2D2A45] rounded-xl px-3 py-2.5 text-sm text-text-primary focus:outline-none focus:border-purple-DEFAULT resize-none placeholder:text-text-muted/50 transition-colors"
              rows={3}
              value={editObs}
              onChange={e => setEditObs(e.target.value)}
              placeholder="Anotações sobre o lead..."
            />
            {editObs !== lead.observacao && (
              <button
                onClick={saveObs}
                disabled={savingObs}
                className="mt-2 text-xs px-3 py-1.5 rounded-lg bg-purple-DEFAULT text-white hover:bg-purple-dark transition-colors disabled:opacity-50"
              >
                {savingObs ? 'Salvando...' : 'Salvar observação'}
              </button>
            )}
          </div>

          {/* Info */}
          <div className="grid grid-cols-2 gap-3 text-xs text-text-muted">
            <div><span className="font-bold">Entrada:</span> {lead.dataEntrada}</div>
            <div><span className="font-bold">Último contato:</span> {lead.dataUltimoContato}</div>
            <div><span className="font-bold">SDR:</span> {lead.sdr}</div>
            <div><span className="font-bold">Parceiro:</span> {lead.parceiro || '—'}</div>
          </div>

          {/* Delete */}
          <div className="pt-2 border-t border-[#2D2A45]">
            {confirmDel ? (
              <div className="flex items-center gap-3">
                <p className="text-xs text-red-400 flex-1">Confirmar exclusão de {lead.nome}?</p>
                <button onClick={() => setConfirmDel(false)} className="text-xs px-3 py-1.5 rounded-lg border border-[#2D2A45] text-text-muted">Cancelar</button>
                <button onClick={handleDelete} className="text-xs px-3 py-1.5 rounded-lg bg-red-500/20 text-red-400 hover:bg-red-500/30 transition-colors">Excluir</button>
              </div>
            ) : (
              <button onClick={() => setConfirmDel(true)} className="flex items-center gap-1.5 text-xs text-text-muted hover:text-red-400 transition-colors">
                <Trash2 className="h-3.5 w-3.5" /> Excluir lead
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
