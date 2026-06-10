import { useState } from 'react'
import { X, Copy, Check, ChevronRight, Trash2 } from 'lucide-react'
import type { Lead, LeadStatus } from '../types'
import { STATUS_LABEL, STATUS_COLOR, STATUS_ORDER, NEXT_STATUS } from '../types'
import { SEQUENCIA } from '../data/mensagens'

interface Props {
  lead: Lead; onClose: () => void
  onMove: (id: string, status: LeadStatus) => Promise<void>
  onEdit: (lead: Lead) => Promise<void>
  onDelete: (id: string) => Promise<void>
}

function applyVars(text: string, lead: Lead) {
  return text
    .replace(/\{\{firstName\}\}/g, lead.nome.split(' ')[0])
    .replace(/\{\{salesman\}\}/g, lead.sdr)
    .replace(/\{\{onParceiro\}\}/g, lead.parceiro || 'nosso parceiro')
}

export default function LeadDetailModal({ lead, onClose, onMove, onEdit, onDelete }: Props) {
  const [copied, setCopied] = useState<string|null>(null)
  const [editObs, setEditObs] = useState(lead.observacao)
  const [savingObs, setSavingObs] = useState(false)
  const [confirmDel, setConfirmDel] = useState(false)

  const diaNum = lead.status.startsWith('dia') ? parseInt(lead.status.replace('dia','')) : null
  const msgData = diaNum ? SEQUENCIA[diaNum-1] : null

  async function copy(text: string, key: string) {
    await navigator.clipboard.writeText(applyVars(text, lead))
    setCopied(key); setTimeout(() => setCopied(null), 2000)
  }
  async function handleMove(status: LeadStatus) { await onMove(lead.id, status); onClose() }
  async function saveObs() { setSavingObs(true); await onEdit({...lead, observacao: editObs}); setSavingObs(false) }
  async function handleDelete() { await onDelete(lead.id); onClose() }

  return (
    <div className="fixed inset-0 bg-cw-text/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="cw-card w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="p-6 border-b border-cw-border flex items-start justify-between sticky top-0 bg-white z-10">
          <div>
            <p className="text-xs text-cw-muted">{lead.empresa}{lead.parceiro ? ` · via ${lead.parceiro}` : ''}</p>
            <h2 className="text-xl font-black text-cw-text">{lead.nome}</h2>
            <div className="flex items-center gap-2 mt-1.5">
              <span className={`badge-dia ${STATUS_COLOR[lead.status]}`}>{STATUS_LABEL[lead.status]}</span>
              {lead.telefone && <span className="text-xs text-cw-muted">{lead.telefone}</span>}
            </div>
          </div>
          <button onClick={onClose} className="h-8 w-8 rounded-lg hover:bg-cw-elevated flex items-center justify-center text-cw-muted shrink-0">
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Mover status */}
          <div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-cw-muted mb-3">Atualizar status</p>
            <div className="flex flex-wrap gap-2">
              {STATUS_ORDER.filter(s => s !== lead.status).map(s => (
                <button key={s} onClick={() => handleMove(s)} className={`badge-dia ${STATUS_COLOR[s]} hover:opacity-80 cursor-pointer transition-opacity`}>
                  {STATUS_LABEL[s]}
                </button>
              ))}
            </div>
            {NEXT_STATUS[lead.status] && (
              <button onClick={() => handleMove(NEXT_STATUS[lead.status]!)}
                className="mt-3 w-full flex items-center justify-center gap-2 py-2.5 rounded-xl gradient-primary text-white text-sm font-bold hover:opacity-90 transition-opacity">
                Avançar para {STATUS_LABEL[NEXT_STATUS[lead.status]!]} <ChevronRight className="h-4 w-4" />
              </button>
            )}
          </div>

          {/* Mensagens do dia */}
          {msgData && (
            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-cw-muted mb-3">Mensagens — {msgData.titulo}</p>
              <div className="rounded-xl bg-cw-elevated border border-cw-border p-3 mb-2">
                <p className="text-[10px] text-cw-muted font-bold uppercase tracking-wider mb-1">Atividades</p>
                <p className="text-xs text-cw-text">{msgData.atividades}</p>
              </div>
              <div className="rounded-xl bg-amber-50 border border-amber-200 p-3 mb-3">
                <p className="text-[10px] text-amber-700 font-bold uppercase tracking-wider mb-1">Task</p>
                <p className="text-xs text-amber-800">{msgData.task}</p>
              </div>
              {[
                { key: 'comoEsta', label: 'Versão "Como está"', text: msgData.msgComoEsta },
                { key: 'atualizacao', label: 'Versão "Atualização"', text: msgData.msgAtualizacao },
              ].filter(v => v.text).map(({ key, label, text }) => (
                <div key={key} className="mb-3">
                  <div className="flex items-center justify-between mb-1.5">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-cw-muted">{label}</p>
                    <button onClick={() => copy(text, key)} className="flex items-center gap-1 text-[10px] text-cw-purple hover:text-cw-purple-dark transition-colors font-bold">
                      {copied === key ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
                      {copied === key ? 'Copiado!' : 'Copiar'}
                    </button>
                  </div>
                  <div className="bg-cw-elevated border border-cw-border rounded-xl p-3">
                    <p className="text-xs text-cw-text whitespace-pre-wrap leading-relaxed">{applyVars(text, lead)}</p>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Observação */}
          <div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-cw-muted mb-2">Observação</p>
            <textarea
              className="w-full bg-cw-bg border border-cw-border rounded-xl px-3 py-2.5 text-sm text-cw-text focus:outline-none focus:border-cw-purple resize-none placeholder:text-cw-muted/40 transition-colors"
              rows={3} value={editObs} onChange={e => setEditObs(e.target.value)} placeholder="Anotações..."
            />
            {editObs !== lead.observacao && (
              <button onClick={saveObs} disabled={savingObs}
                className="mt-2 text-xs px-3 py-1.5 rounded-lg gradient-primary text-white font-bold disabled:opacity-50">
                {savingObs ? 'Salvando...' : 'Salvar observação'}
              </button>
            )}
          </div>

          {/* Info */}
          <div className="grid grid-cols-2 gap-3 text-xs text-cw-muted bg-cw-elevated rounded-xl p-4">
            <div><span className="font-bold text-cw-text">Entrada:</span> {lead.dataEntrada}</div>
            <div><span className="font-bold text-cw-text">Último contato:</span> {lead.dataUltimoContato}</div>
            <div><span className="font-bold text-cw-text">SDR:</span> {lead.sdr}</div>
            <div><span className="font-bold text-cw-text">Parceiro:</span> {lead.parceiro || '—'}</div>
          </div>

          {/* Delete */}
          <div className="pt-2 border-t border-cw-border">
            {confirmDel ? (
              <div className="flex items-center gap-3">
                <p className="text-xs text-red-600 flex-1">Confirmar exclusão de {lead.nome}?</p>
                <button onClick={() => setConfirmDel(false)} className="text-xs px-3 py-1.5 rounded-lg border border-cw-border text-cw-muted">Cancelar</button>
                <button onClick={handleDelete} className="text-xs px-3 py-1.5 rounded-lg bg-red-50 text-red-600 border border-red-200 hover:bg-red-100 transition-colors">Excluir</button>
              </div>
            ) : (
              <button onClick={() => setConfirmDel(true)} className="flex items-center gap-1.5 text-xs text-cw-muted hover:text-red-500 transition-colors">
                <Trash2 className="h-3.5 w-3.5" /> Excluir lead
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
