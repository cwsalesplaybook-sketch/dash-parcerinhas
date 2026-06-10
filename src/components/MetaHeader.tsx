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
  if (hoje > FIM_MES) return 0
  let dias = 0
  const cur = new Date(hoje)
  while (cur <= FIM_MES) {
    const dow = cur.getDay()
    if (dow !== 0 && dow !== 6) dias++
    cur.setDate(cur.getDate() + 1)
  }
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

  const hoje = new Date()
  hoje.setHours(0, 0, 0, 0)
  const diasPassados = Math.max(1, Math.floor((hoje.getTime() - INICIO_MES.getTime()) / 86400000))
  const ritmoAtual = (total / diasPassados).toFixed(1)

  function handleSave() {
    onSave(draft)
    setEditing(false)
  }

  const progressColor = pct >= 80 ? '#10b981' : pct >= 50 ? '#f59e0b' : '#7C3AED'

  return (
    <div className="space-y-5">

      {/* Hero da meta */}
      <div className="card p-6 overflow-hidden relative">
        {/* Background glow */}
        <div className="absolute -top-10 -right-10 w-48 h-48 rounded-full opacity-10 blur-3xl" style={{ background: '#7C3AED' }} />

        <div className="relative">
          <div className="flex items-start justify-between mb-5">
            <div>
              <p className="text-[10px] font-black uppercase tracking-widest text-purple-400 mb-1">Meta Junho 2026</p>
              <div className="flex items-baseline gap-2">
                <span className="text-5xl font-black text-white">{total}</span>
                <span className="text-xl text-purple-300/60 font-bold">/ {META_JUNHO}</span>
                <span className="text-sm text-purple-300/60">EQLs</span>
              </div>
            </div>
            <div className="text-right">
              <div className={`text-4xl font-black`} style={{ color: progressColor }}>{pct}%</div>
              <p className="text-[10px] text-purple-300/50 uppercase tracking-wider font-bold mt-1">da meta</p>
            </div>
          </div>

          {/* Barra de progresso */}
          <div className="h-3 bg-[#2E2550] rounded-full overflow-hidden mb-5">
            <div
              className="h-full rounded-full transition-all duration-1000"
              style={{ width: `${pct}%`, background: `linear-gradient(90deg, #7C3AED, ${progressColor})` }}
            />
          </div>

          {/* Cards de ritmo */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <MiniStat icon={<Target className="h-3.5 w-3.5" />} label="Faltam" value={faltam.toString()} sub="EQLs" color="#A78BFA" />
            <MiniStat icon={<Calendar className="h-3.5 w-3.5" />} label="Dias úteis" value={diasFaltando.toString()} sub="restantes" color="#60A5FA" />
            <MiniStat
              icon={<TrendingUp className="h-3.5 w-3.5" />}
              label="Ritmo necessário"
              value={`${oppsPorDia}/dia`}
              sub="até fim do mês"
              color={oppsPorDia <= 12 ? '#34D399' : '#FB923C'}
              highlight={oppsPorDia > 12}
            />
            <MiniStat icon={<TrendingUp className="h-3.5 w-3.5" />} label="Ritmo atual" value={`${ritmoAtual}/dia`} sub="média do mês" color="#F4F1FF" />
          </div>
        </div>
      </div>

      {/* Cards das SDRs */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <SdrCard
          nome="Gabrielly"
          foto="/gabrielly.jpg"
          eqls={eqlsGabrielly}
          editVal={draft.eqlsGabrielly}
          editing={editing}
          onChange={v => setDraft(d => ({ ...d, eqlsGabrielly: v }))}
          color="#A78BFA"
          metaIndividual={Math.round(META_JUNHO / 2)}
        />
        <SdrCard
          nome="Thais"
          foto="/thais.jpg"
          eqls={eqlsThais}
          editVal={draft.eqlsThais}
          editing={editing}
          onChange={v => setDraft(d => ({ ...d, eqlsThais: v }))}
          color="#818CF8"
          metaIndividual={Math.round(META_JUNHO / 2)}
        />
      </div>

      {/* Botões de edição */}
      <div className="flex justify-end gap-2">
        {editing ? (
          <>
            <button onClick={() => setEditing(false)} className="flex items-center gap-1.5 text-xs px-3 py-2 rounded-xl border border-[#2E2550] text-purple-300/60 hover:text-purple-200 transition-colors">
              <X className="h-3 w-3" /> Cancelar
            </button>
            <button onClick={handleSave} className="flex items-center gap-1.5 text-xs px-3 py-2 rounded-xl font-bold text-white transition-all" style={{ background: 'linear-gradient(135deg,#7C3AED,#9333EA)' }}>
              <Check className="h-3 w-3" /> Salvar
            </button>
          </>
        ) : (
          <button onClick={() => { setDraft({ ...meta }); setEditing(true) }} className="flex items-center gap-1.5 text-xs px-3 py-2 rounded-xl border border-[#2E2550] text-purple-300/50 hover:text-purple-200 transition-colors">
            <Pencil className="h-3 w-3" /> Editar EQLs confirmados
          </button>
        )}
      </div>
    </div>
  )
}

function MiniStat({ icon, label, value, sub, color, highlight }: {
  icon: React.ReactNode; label: string; value: string; sub: string; color: string; highlight?: boolean
}) {
  return (
    <div className={`card p-3.5 ${highlight ? 'border-orange-500/40' : ''}`}>
      <div className="mb-1.5" style={{ color }}>{icon}</div>
      <p className="text-[9px] uppercase tracking-widest text-purple-300/50 font-bold mb-0.5">{label}</p>
      <p className="text-lg font-black" style={{ color }}>{value}</p>
      <p className="text-[10px] text-purple-300/40">{sub}</p>
    </div>
  )
}

function SdrCard({ nome, foto, eqls, editVal, editing, onChange, color, metaIndividual }: {
  nome: string; foto: string; eqls: number; editVal: number; editing: boolean;
  onChange: (v: number) => void; color: string; metaIndividual: number
}) {
  const pct = Math.min(100, Math.round((eqls / metaIndividual) * 100))
  return (
    <div className="card p-5 overflow-hidden relative">
      <div className="absolute -bottom-6 -right-6 w-24 h-24 rounded-full opacity-10 blur-2xl" style={{ background: color }} />
      <div className="relative flex items-center gap-4 mb-4">
        <div className="relative shrink-0">
          <img
            src={foto}
            alt={nome}
            className="h-16 w-16 rounded-2xl object-cover object-top shadow-lg"
            style={{ boxShadow: `0 4px 20px ${color}40` }}
          />
          <div className="absolute -bottom-1 -right-1 h-5 w-5 rounded-full flex items-center justify-center text-[9px] font-black text-white" style={{ background: color }}>
            SDR
          </div>
        </div>
        <div className="flex-1">
          <p className="font-black text-white text-lg leading-none mb-1">{nome}</p>
          <p className="text-[10px] text-purple-300/50 uppercase tracking-wider font-bold">Tier Agência</p>
          <div className="flex items-baseline gap-1.5 mt-2">
            {editing ? (
              <input
                type="number"
                value={editVal}
                onChange={e => onChange(Number(e.target.value))}
                className="w-20 bg-[#120E1E] border border-[#2E2550] rounded-lg px-2 py-1 text-right text-xl font-black focus:outline-none focus:border-purple-500"
                style={{ color }}
                min={0}
              />
            ) : (
              <span className="text-3xl font-black" style={{ color }}>{eqls}</span>
            )}
            <span className="text-sm text-purple-300/40 font-bold">/ {metaIndividual} EQLs</span>
          </div>
        </div>
      </div>
      <div className="h-2 bg-[#2E2550] rounded-full overflow-hidden">
        <div className="h-full rounded-full transition-all duration-700" style={{ width: `${pct}%`, background: color }} />
      </div>
      <p className="text-[10px] text-purple-300/40 mt-1.5">{pct}% da meta individual</p>
    </div>
  )
}
