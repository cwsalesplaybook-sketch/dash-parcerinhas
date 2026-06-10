import { Target, TrendingUp, Calendar, Pencil, Check, X, Trophy } from 'lucide-react'
import { useState } from 'react'
import type { Meta } from '../types'

interface Props {
  meta: Meta
  eqlsGabrielly: number; eqlsThais: number
  oppsGabrielly: number; oppsThais: number
  ganhosGabrielly: number; ganhosThais: number
  receitaGabrielly: number; receitaThais: number
  onSave: (m: Meta) => void
}

const META_JUNHO = 258
const INICIO_MES = new Date('2026-06-01')
const FIM_MES   = new Date('2026-06-30')

function fmt(v: number) { return v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }) }

function diasUteisFaltando() {
  const hoje = new Date(); hoje.setHours(0,0,0,0)
  if (hoje > FIM_MES) return 0
  let dias = 0; const cur = new Date(hoje)
  while (cur <= FIM_MES) { if (cur.getDay() !== 0 && cur.getDay() !== 6) dias++; cur.setDate(cur.getDate()+1) }
  return dias
}

export default function MetaHeader({ meta, eqlsGabrielly, eqlsThais, oppsGabrielly, oppsThais, ganhosGabrielly, ganhosThais, receitaGabrielly, receitaThais, onSave }: Props) {
  const [editing, setEditing] = useState(false)
  const [draft, setDraft] = useState({ ...meta })

  const totalEqls = eqlsGabrielly + eqlsThais
  const totalOpps = oppsGabrielly + oppsThais
  const totalGanhos = ganhosGabrielly + ganhosThais
  const totalReceita = receitaGabrielly + receitaThais

  const faltam = Math.max(0, META_JUNHO - totalEqls)
  const diasFaltando = diasUteisFaltando()
  const oppsPorDia = diasFaltando > 0 ? Math.ceil(faltam / diasFaltando) : 0
  const pct = Math.min(100, Math.round((totalEqls / META_JUNHO) * 100))

  const hoje = new Date(); hoje.setHours(0,0,0,0)
  const diasPassados = Math.max(1, Math.floor((hoje.getTime() - INICIO_MES.getTime()) / 86400000))
  const ritmoAtual = (totalEqls / diasPassados).toFixed(1)
  const barColor = pct >= 80 ? '#22c55e' : pct >= 50 ? '#eab308' : '#A543FA'

  return (
    <div className="space-y-5">
      {/* Meta EQL */}
      <div className="cw-card p-6">
        <div className="flex items-start justify-between mb-1">
          <p className="text-[10px] font-black uppercase tracking-widest text-cw-muted">Meta EQL — Junho 2026</p>
          <span className="text-2xl font-black" style={{ color: barColor }}>{pct}%</span>
        </div>
        <div className="flex items-baseline gap-2 mb-4">
          <span className="text-5xl font-black text-cw-text">{totalEqls}</span>
          <span className="text-lg text-cw-muted font-bold">/ {META_JUNHO} EQLs</span>
        </div>
        <div className="h-3 bg-cw-bg rounded-full overflow-hidden mb-5">
          <div className="h-full rounded-full transition-all duration-700" style={{ width:`${pct}%`, background:`linear-gradient(90deg,#A543FA,${barColor})` }} />
        </div>
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

      {/* Opps & Ganhos */}
      <div className="grid grid-cols-3 gap-4">
        <div className="cw-card p-5 text-center">
          <div className="h-10 w-10 rounded-xl bg-purple-100 flex items-center justify-center mx-auto mb-3">
            <TrendingUp className="h-5 w-5 text-cw-purple" />
          </div>
          <p className="text-3xl font-black text-cw-purple">{totalOpps}</p>
          <p className="text-xs text-cw-muted font-bold uppercase tracking-wider mt-1">Opps abertas</p>
        </div>
        <div className="cw-card p-5 text-center">
          <div className="h-10 w-10 rounded-xl bg-yellow-100 flex items-center justify-center mx-auto mb-3">
            <Trophy className="h-5 w-5 text-yellow-600" />
          </div>
          <p className="text-3xl font-black text-yellow-600">{totalGanhos}</p>
          <p className="text-xs text-cw-muted font-bold uppercase tracking-wider mt-1">Ganhos</p>
        </div>
        <div className="cw-card p-5 text-center">
          <div className="h-10 w-10 rounded-xl bg-green-100 flex items-center justify-center mx-auto mb-3">
            <Trophy className="h-5 w-5 text-green-600" />
          </div>
          <p className="text-2xl font-black text-green-600">{totalReceita > 0 ? fmt(totalReceita) : '—'}</p>
          <p className="text-xs text-cw-muted font-bold uppercase tracking-wider mt-1">Receita gerada</p>
        </div>
      </div>

      {/* SDR cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <SdrCard nome="Gabrielly" foto="/gabrielly.jpg" eqls={eqlsGabrielly} opps={oppsGabrielly} ganhos={ganhosGabrielly} receita={receitaGabrielly} editVal={draft.eqlsGabrielly} editing={editing} onChange={v => setDraft(d=>({...d,eqlsGabrielly:v}))} metaInd={Math.round(META_JUNHO/2)} />
        <SdrCard nome="Thais"     foto="/thais.jpg"     eqls={eqlsThais}     opps={oppsThais}     ganhos={ganhosThais}     receita={receitaThais}     editVal={draft.eqlsThais}     editing={editing} onChange={v => setDraft(d=>({...d,eqlsThais:v}))}     metaInd={Math.round(META_JUNHO/2)} />
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

function SdrCard({ nome, foto, eqls, opps, ganhos, receita, editVal, editing, onChange, metaInd }: {
  nome: string; foto: string; eqls: number; opps: number; ganhos: number; receita: number;
  editVal: number; editing: boolean; onChange: (v:number) => void; metaInd: number
}) {
  const pct = Math.min(100, Math.round((eqls / metaInd) * 100))
  return (
    <div className="cw-card p-5">
      <div className="flex items-center gap-4 mb-4">
        <img src={foto} alt={nome} className="h-16 w-16 rounded-2xl object-cover object-top shadow-md shrink-0" />
        <div className="flex-1">
          <p className="text-[10px] font-black uppercase tracking-widest text-cw-muted mb-0.5">SDR · Tier Agência</p>
          <p className="text-xl font-black text-cw-text">{nome}</p>
          <div className="flex items-baseline gap-1.5 mt-1">
            {editing ? (
              <input type="number" value={editVal} onChange={e=>onChange(Number(e.target.value))} min={0}
                className="w-20 border border-cw-border rounded-lg px-2 py-1 text-right text-xl font-black text-cw-purple focus:outline-none focus:border-cw-purple bg-cw-bg" />
            ) : (
              <span className="text-2xl font-black text-cw-purple">{eqls}</span>
            )}
            <span className="text-sm text-cw-muted font-bold">EQLs / {metaInd}</span>
          </div>
        </div>
      </div>
      <div className="h-2 bg-cw-bg rounded-full overflow-hidden mb-3">
        <div className="h-full rounded-full transition-all duration-700 gradient-primary" style={{ width:`${pct}%` }} />
      </div>
      <div className="grid grid-cols-3 gap-2 text-center">
        <div className="bg-cw-elevated rounded-xl p-2">
          <p className="text-lg font-black text-cw-purple">{opps}</p>
          <p className="text-[9px] text-cw-muted font-bold uppercase tracking-wider">Opps</p>
        </div>
        <div className="bg-cw-elevated rounded-xl p-2">
          <p className="text-lg font-black text-yellow-600">{ganhos}</p>
          <p className="text-[9px] text-cw-muted font-bold uppercase tracking-wider">Ganhos</p>
        </div>
        <div className="bg-cw-elevated rounded-xl p-2">
          <p className="text-sm font-black text-green-600">{receita > 0 ? receita.toLocaleString('pt-BR',{style:'currency',currency:'BRL'}) : '—'}</p>
          <p className="text-[9px] text-cw-muted font-bold uppercase tracking-wider">Receita</p>
        </div>
      </div>
    </div>
  )
}
