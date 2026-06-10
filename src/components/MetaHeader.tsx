import { Target, TrendingUp, Calendar, Pencil, Check, X } from 'lucide-react'
import { useState } from 'react'
import type { Meta } from '../types'

interface Props {
  meta: Meta
  eqlsGabrielly: number
  eqlsThais: number
  onSave: (m: Meta) => void
}

const META_JUNHO = 258
const INICIO_MES = new Date('2026-06-01')
const FIM_MES = new Date('2026-06-30')

function diasUteisFaltando() {
  const hoje = new Date(); hoje.setHours(0,0,0,0)
  if (hoje > FIM_MES) return 0
  let dias = 0; const cur = new Date(hoje)
  while (cur <= FIM_MES) { if (cur.getDay() !== 0 && cur.getDay() !== 6) dias++; cur.setDate(cur.getDate()+1) }
  return dias
}

export default function MetaHeader({ meta, eqlsGabrielly, eqlsThais, onSave }: Props) {
  const [editing, setEditing] = useState(false)
  const [draft, setDraft] = useState({ ...meta })

  const total = eqlsGabrielly + eqlsThais
  const faltam = Math.max(0, META_JUNHO - total)
  const diasFaltando = diasUteisFaltando()
  const oppsPorDia = diasFaltando > 0 ? Math.ceil(faltam / diasFaltando) : 0
  const pct = Math.min(100, Math.round((total / META_JUNHO) * 100))

  const hoje = new Date(); hoje.setHours(0,0,0,0)
  const diasPassados = Math.max(1, Math.floor((hoje.getTime() - INICIO_MES.getTime()) / 86400000))
  const ritmoAtual = (total / diasPassados).toFixed(1)

  const barColor = pct >= 80 ? '#22c55e' : pct >= 50 ? '#eab308' : '#A543FA'

  return (
    <div className="space-y-5">
      {/* Card principal da meta */}
      <div className="cw-card p-6">
        <div className="flex items-start justify-between mb-1">
          <p className="text-[10px] font-black uppercase tracking-widest text-cw-muted">Meta Junho 2026 — Tier Agência</p>
          <span className="text-2xl font-black" style={{ color: barColor }}>{pct}%</span>
        </div>

        <div className="flex items-baseline gap-2 mb-4">
          <span className="text-5xl font-black text-cw-text">{total}</span>
          <span className="text-lg text-cw-muted font-bold">/ {META_JUNHO} EQLs</span>
        </div>

        {/* Barra */}
        <div className="h-3 bg-cw-bg rounded-full overflow-hidden mb-5">
          <div
            className="h-full rounded-full transition-all duration-700"
            style={{ width: `${pct}%`, background: `linear-gradient(90deg, #A543FA, ${barColor})` }}
          />
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { icon: <Target className="h-3.5 w-3.5" />, label: 'Faltam', value: faltam.toString(), sub: 'EQLs', color: '#A543FA' },
            { icon: <Calendar className="h-3.5 w-3.5" />, label: 'Dias úteis', value: diasFaltando.toString(), sub: 'restantes', color: '#59327A' },
            { icon: <TrendingUp className="h-3.5 w-3.5" />, label: 'Ritmo necessário', value: `${oppsPorDia}/dia`, sub: 'até fim do mês', color: oppsPorDia <= 12 ? '#16a34a' : '#ea580c' },
            { icon: <TrendingUp className="h-3.5 w-3.5" />, label: 'Ritmo atual', value: `${ritmoAtual}/dia`, sub: 'média do mês', color: '#1A0A2E' },
          ].map(s => (
            <div key={s.label} className="bg-cw-elevated border border-cw-border rounded-xl p-3.5">
              <div className="mb-1" style={{ color: s.color }}>{s.icon}</div>
              <p className="text-[9px] font-black uppercase tracking-widest text-cw-muted mb-0.5">{s.label}</p>
              <p className="text-lg font-black" style={{ color: s.color }}>{s.value}</p>
              <p className="text-[10px] text-cw-muted">{s.sub}</p>
            </div>
          ))}
        </div>
      </div>

      {/* SDR cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <SdrCard nome="Gabrielly" foto="/gabrielly.jpg" eqls={eqlsGabrielly} editVal={draft.eqlsGabrielly} editing={editing} onChange={v => setDraft(d=>({...d,eqlsGabrielly:v}))} metaIndividual={Math.round(META_JUNHO/2)} />
        <SdrCard nome="Thais"     foto="/thais.jpg"     eqls={eqlsThais}     editVal={draft.eqlsThais}     editing={editing} onChange={v => setDraft(d=>({...d,eqlsThais:v}))}     metaIndividual={Math.round(META_JUNHO/2)} />
      </div>

      <div className="flex justify-end gap-2">
        {editing ? (
          <>
            <button onClick={() => setEditing(false)} className="flex items-center gap-1.5 text-xs px-3 py-2 rounded-xl border border-cw-border text-cw-muted hover:text-cw-text transition-colors">
              <X className="h-3 w-3" /> Cancelar
            </button>
            <button onClick={() => { onSave(draft); setEditing(false) }} className="flex items-center gap-1.5 text-xs px-3 py-2 rounded-xl gradient-primary text-white font-bold">
              <Check className="h-3 w-3" /> Salvar
            </button>
          </>
        ) : (
          <button onClick={() => { setDraft({...meta}); setEditing(true) }} className="flex items-center gap-1.5 text-xs px-3 py-2 rounded-xl border border-cw-border text-cw-muted hover:text-cw-purple transition-colors">
            <Pencil className="h-3 w-3" /> Editar EQLs confirmados
          </button>
        )}
      </div>
    </div>
  )
}

function SdrCard({ nome, foto, eqls, editVal, editing, onChange, metaIndividual }: {
  nome: string; foto: string; eqls: number; editVal: number; editing: boolean; onChange: (v:number)=>void; metaIndividual: number
}) {
  const pct = Math.min(100, Math.round((eqls / metaIndividual) * 100))
  return (
    <div className="cw-card p-5 flex items-center gap-4">
      <img src={foto} alt={nome} className="h-20 w-20 rounded-2xl object-cover object-top shrink-0 shadow-md" />
      <div className="flex-1 min-w-0">
        <p className="text-[10px] font-black uppercase tracking-widest text-cw-muted mb-0.5">SDR · Tier Agência</p>
        <p className="text-xl font-black text-cw-text">{nome}</p>
        <div className="flex items-baseline gap-1.5 mt-1 mb-3">
          {editing ? (
            <input type="number" value={editVal} onChange={e=>onChange(Number(e.target.value))} min={0}
              className="w-20 border border-cw-border rounded-lg px-2 py-1 text-right text-xl font-black text-cw-purple focus:outline-none focus:border-cw-purple bg-cw-bg" />
          ) : (
            <span className="text-3xl font-black text-cw-purple">{eqls}</span>
          )}
          <span className="text-sm text-cw-muted font-bold">/ {metaIndividual} EQLs</span>
        </div>
        <div className="h-2 bg-cw-bg rounded-full overflow-hidden">
          <div className="h-full rounded-full transition-all duration-700 gradient-primary" style={{ width: `${pct}%` }} />
        </div>
        <p className="text-[10px] text-cw-muted mt-1">{pct}% da meta individual</p>
      </div>
    </div>
  )
}
