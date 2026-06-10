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
  const hoje = new Date()
  hoje.setHours(0, 0, 0, 0)
  let dias = 0
  const cur = new Date(hoje)
  while (cur <= FIM_MES) {
    const dow = cur.getDay()
    if (dow !== 0 && dow !== 6) dias++
    cur.setDate(cur.getDate() + 1)
  }
  return dias
}

function totalEQLsFeitos(eqlsG: number, eqlsT: number) {
  return eqlsG + eqlsT
}

export default function MetaHeader({ meta, eqlsGabrielly, eqlsThais, onSave }: Props) {
  const [editing, setEditing] = useState(false)
  const [draft, setDraft] = useState({ ...meta })

  const total = totalEQLsFeitos(eqlsGabrielly, eqlsThais)
  const faltam = META_JUNHO - total
  const diasFaltando = diasUteisFaltando()
  const oppsPorDia = diasFaltando > 0 ? Math.ceil(faltam / diasFaltando) : 0
  const pct = Math.min(100, Math.round((total / META_JUNHO) * 100))

  const hoje = new Date()
  hoje.setHours(0, 0, 0, 0)
  const diasPassados = Math.max(0, Math.floor((hoje.getTime() - INICIO_MES.getTime()) / 86400000))
  const ritmoAtual = diasPassados > 0 ? (total / diasPassados).toFixed(1) : '—'

  function handleSave() {
    onSave(draft)
    setEditing(false)
  }

  return (
    <div className="space-y-4">
      {/* Barra de meta */}
      <div className="card p-5">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-xl bg-purple-DEFAULT/20 flex items-center justify-center">
              <Target className="h-4 w-4 text-purple-light" />
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-text-muted">Meta Junho — Tier Agência</p>
              <p className="text-sm font-black text-text-primary">{total} <span className="text-text-muted font-normal">/ {META_JUNHO} EQLs</span></p>
            </div>
          </div>
          <span className={`text-2xl font-black ${pct >= 80 ? 'text-emerald-400' : pct >= 50 ? 'text-yellow-400' : 'text-red-400'}`}>
            {pct}%
          </span>
        </div>
        <div className="h-3 bg-[#2D2A45] rounded-full overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-700"
            style={{
              width: `${pct}%`,
              background: pct >= 80 ? 'linear-gradient(90deg,#10b981,#34d399)' : pct >= 50 ? 'linear-gradient(90deg,#f59e0b,#fbbf24)' : 'linear-gradient(90deg,#7C3AED,#A855F7)',
            }}
          />
        </div>
      </div>

      {/* Cards de ritmo */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <StatCard icon={<TrendingUp className="h-4 w-4" />} label="Faltam" value={faltam.toString()} sub="EQLs" color="text-purple-light" />
        <StatCard icon={<Calendar className="h-4 w-4" />} label="Dias úteis restantes" value={diasFaltando.toString()} sub="dias" color="text-blue-400" />
        <StatCard icon={<Target className="h-4 w-4" />} label="Ritmo necessário" value={`${oppsPorDia}/dia`} sub="até fim do mês" color={oppsPorDia <= 12 ? 'text-emerald-400' : 'text-orange-400'} />
        <StatCard icon={<TrendingUp className="h-4 w-4" />} label="Ritmo atual" value={`${ritmoAtual}/dia`} sub="média do mês" color="text-text-primary" />
      </div>

      {/* Progresso por SDR */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <SdrCard
          nome="Gabrielly"
          eqls={eqlsGabrielly}
          editVal={draft.eqlsGabrielly}
          editing={editing}
          onChange={v => setDraft(d => ({ ...d, eqlsGabrielly: v }))}
          color="#A855F7"
        />
        <SdrCard
          nome="Thais"
          eqls={eqlsThais}
          editVal={draft.eqlsThais}
          editing={editing}
          onChange={v => setDraft(d => ({ ...d, eqlsThais: v }))}
          color="#60A5FA"
        />
      </div>

      <div className="flex justify-end gap-2">
        {editing ? (
          <>
            <button onClick={() => setEditing(false)} className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg border border-[#2D2A45] text-text-muted hover:text-text-primary transition-colors">
              <X className="h-3 w-3" /> Cancelar
            </button>
            <button onClick={handleSave} className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg bg-purple-DEFAULT text-white hover:bg-purple-dark transition-colors">
              <Check className="h-3 w-3" /> Salvar meta
            </button>
          </>
        ) : (
          <button onClick={() => { setDraft({ ...meta }); setEditing(true) }} className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg border border-[#2D2A45] text-text-muted hover:text-text-primary transition-colors">
            <Pencil className="h-3 w-3" /> Editar EQLs confirmados
          </button>
        )}
      </div>
    </div>
  )
}

function StatCard({ icon, label, value, sub, color }: { icon: React.ReactNode; label: string; value: string; sub: string; color: string }) {
  return (
    <div className="card p-4">
      <div className={`${color} mb-2`}>{icon}</div>
      <p className="text-[10px] uppercase tracking-widest text-text-muted font-bold mb-1">{label}</p>
      <p className={`text-xl font-black ${color}`}>{value}</p>
      <p className="text-[11px] text-text-muted">{sub}</p>
    </div>
  )
}

function SdrCard({ nome, eqls, editVal, editing, onChange, color }: {
  nome: string; eqls: number; editVal: number; editing: boolean; onChange: (v: number) => void; color: string
}) {
  const pct = Math.min(100, Math.round((eqls / (META_JUNHO / 2)) * 100))
  return (
    <div className="card p-4">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-full flex items-center justify-center font-black text-sm" style={{ background: color + '33', color }}>
            {nome[0]}
          </div>
          <span className="font-bold text-text-primary">{nome}</span>
        </div>
        {editing ? (
          <input
            type="number"
            value={editVal}
            onChange={e => onChange(Number(e.target.value))}
            className="w-20 bg-[#0F0E17] border border-[#2D2A45] rounded-lg px-2 py-1 text-right text-sm font-black text-text-primary focus:outline-none focus:border-purple-DEFAULT"
            min={0}
          />
        ) : (
          <span className="text-2xl font-black" style={{ color }}>{eqls}</span>
        )}
      </div>
      <div className="h-2 bg-[#2D2A45] rounded-full overflow-hidden">
        <div className="h-full rounded-full transition-all duration-700" style={{ width: `${pct}%`, background: color }} />
      </div>
      <p className="text-[11px] text-text-muted mt-1">{pct}% da meta individual ({Math.round(META_JUNHO / 2)} EQLs)</p>
    </div>
  )
}
