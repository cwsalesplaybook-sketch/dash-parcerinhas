import { TrendingUp, Trophy, ExternalLink, Target } from 'lucide-react'
import type { Meta } from '../types'
import type { PipedriveDeal } from '../lib/pipedrive'

interface Props {
  meta: Meta
  eqlsGabrielly: number; eqlsThais: number
  oppsGabrielly: number; oppsThais: number
  ganhosGabrielly: number; ganhosThais: number
  pipedriveDealsGabrielly: PipedriveDeal[]
  pipedriveDealsThais: PipedriveDeal[]
  pipedriveLoading: boolean
  onSave: (m: Meta) => void
}

const META_JUNHO = 258
const INICIO_MES = new Date('2026-06-01')
const FIM_MES   = new Date('2026-06-30')

function fmt(v: number) { return v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }) }
function fmtDate(s: string) { return new Date(s).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' }) }

function diasUteisFaltando() {
  const hoje = new Date(); hoje.setHours(0,0,0,0)
  if (hoje > FIM_MES) return 0
  let dias = 0; const cur = new Date(hoje)
  while (cur <= FIM_MES) { if (cur.getDay() !== 0 && cur.getDay() !== 6) dias++; cur.setDate(cur.getDate()+1) }
  return dias
}

function CircularProgress({ pct, size = 140, stroke = 12 }: { pct: number; size?: number; stroke?: number }) {
  const r = (size - stroke * 2) / 2
  const circ = 2 * Math.PI * r
  const offset = circ - (pct / 100) * circ
  const color = pct >= 80 ? '#22c55e' : pct >= 50 ? '#eab308' : '#A543FA'
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="shrink-0">
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="#E9DDF2" strokeWidth={stroke} />
      <circle
        cx={size/2} cy={size/2} r={r} fill="none"
        stroke={color} strokeWidth={stroke}
        strokeDasharray={circ} strokeDashoffset={offset}
        strokeLinecap="round"
        transform={`rotate(-90 ${size/2} ${size/2})`}
        style={{ transition: 'stroke-dashoffset 0.7s ease' }}
      />
      <text x={size/2} y={size/2 - 6} textAnchor="middle" dominantBaseline="middle"
        fill={color} fontSize="22" fontWeight="900" fontFamily="Inter,sans-serif">{pct}%</text>
      <text x={size/2} y={size/2 + 14} textAnchor="middle" dominantBaseline="middle"
        fill="#7B5EA7" fontSize="9" fontWeight="700" fontFamily="Inter,sans-serif">DA META</text>
    </svg>
  )
}

export default function MetaHeader({ meta: _meta, eqlsGabrielly, eqlsThais, oppsGabrielly, oppsThais, ganhosGabrielly, ganhosThais, pipedriveDealsGabrielly, pipedriveDealsThais, pipedriveLoading }: Props) {
  const totalEqls = eqlsGabrielly + eqlsThais
  const totalOpps = oppsGabrielly + oppsThais
  const totalGanhos = ganhosGabrielly + ganhosThais

  const faltam = Math.max(0, META_JUNHO - totalEqls)
  const diasFaltando = diasUteisFaltando()
  const oppsPorDia = diasFaltando > 0 ? Math.ceil(faltam / diasFaltando) : 0
  const pct = Math.min(100, Math.round((totalEqls / META_JUNHO) * 100))

  const hoje = new Date(); hoje.setHours(0,0,0,0)
  const diasPassados = Math.max(1, Math.floor((hoje.getTime() - INICIO_MES.getTime()) / 86400000))
  const ritmoAtual = (totalEqls / diasPassados).toFixed(1)

  const projecao = Math.round(parseFloat(ritmoAtual) * 22) // ~22 dias úteis em junho

  return (
    <div className="space-y-5">

      {/* Hero card — Meta EQL */}
      <div className="cw-card p-6">
        <div className="flex flex-col md:flex-row gap-6">
          {/* Circular progress */}
          <div className="flex items-center justify-center md:justify-start shrink-0">
            <CircularProgress pct={pct} size={140} />
          </div>

          {/* Meta info */}
          <div className="flex-1">
            <p className="text-[10px] font-black uppercase tracking-widest text-cw-muted mb-1">Meta EQL — Junho 2026</p>
            <div className="flex items-baseline gap-2 mb-1">
              <span className="text-6xl font-black text-cw-text">{totalEqls}</span>
              <span className="text-xl text-cw-muted font-bold">/ {META_JUNHO} EQLs</span>
            </div>
            <p className="text-xs text-cw-muted mb-4">Meta mensal</p>

            {/* Barra */}
            <div className="h-2.5 bg-cw-bg rounded-full overflow-hidden mb-5">
              <div className="h-full rounded-full transition-all duration-700"
                style={{ width:`${pct}%`, background:'linear-gradient(90deg,#A543FA,#22c55e)' }} />
            </div>

            {/* Stats row */}
            <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
              {[
                { label: 'EQLs atuais', value: String(totalEqls), sub: 'Total', color: '#A543FA' },
                { label: 'Dias úteis', value: String(diasFaltando), sub: 'Restantes', color: '#59327A' },
                { label: 'Ritmo necessário', value: `${oppsPorDia}/dia`, sub: 'Para bater a meta', color: oppsPorDia <= 12 ? '#16a34a' : '#ea580c' },
                { label: 'Ritmo atual', value: `${ritmoAtual}/dia`, sub: 'Média do mês', color: '#1A0A2E' },
                { label: 'Projeção', value: `${projecao} EQLs`, sub: 'Até fim do mês', color: projecao >= META_JUNHO ? '#16a34a' : '#ea580c' },
              ].map(s => (
                <div key={s.label} className="bg-cw-bg rounded-xl p-3">
                  <p className="text-[8px] font-black uppercase tracking-widest text-cw-muted mb-0.5">{s.label}</p>
                  <p className="text-base font-black" style={{ color: s.color }}>{s.value}</p>
                  <p className="text-[9px] text-cw-muted">{s.sub}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Faltam badge */}
          <div className="shrink-0 flex flex-col items-center justify-center bg-cw-bg rounded-2xl px-5 py-4 text-center">
            <Target className="h-5 w-5 text-cw-purple mb-1" />
            <p className="text-3xl font-black text-cw-purple">{faltam}</p>
            <p className="text-[9px] font-black text-cw-muted uppercase tracking-wider mt-0.5">EQLs para</p>
            <p className="text-[9px] font-black text-cw-muted uppercase tracking-wider">100% da meta</p>
          </div>
        </div>
      </div>

      {/* Opps / Ganhos / Receita */}
      <div className="grid grid-cols-3 gap-4">
        <StatCard
          icon={<TrendingUp className="h-5 w-5" />}
          label="Opps abertas"
          value={String(totalOpps)}
          sub={totalOpps > 0 ? `+${totalOpps} no mês` : 'Nenhuma ainda'}
          color="#A543FA"
          bg="bg-purple-50"
        />
        <StatCard
          icon={<Trophy className="h-5 w-5" />}
          label="Ganhos"
          value={pipedriveLoading ? '…' : String(totalGanhos)}
          sub={totalGanhos > 0 ? 'Este mês' : 'Nenhum ainda'}
          color="#D97706"
          bg="bg-yellow-50"
        />
      </div>

      {/* SDR Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <SdrCard
          nome="Gabrielly" foto="/gabrielly.jpg"
          eqls={eqlsGabrielly} opps={oppsGabrielly}
          ganhos={ganhosGabrielly}
          metaInd={Math.round(META_JUNHO/2)}
          pipedriveDeals={pipedriveDealsGabrielly}
          pipedriveLoading={pipedriveLoading}
        />
        <SdrCard
          nome="Thais" foto="/thais.jpg"
          eqls={eqlsThais} opps={oppsThais}
          ganhos={ganhosThais}
          metaInd={Math.round(META_JUNHO/2)}
          pipedriveDeals={pipedriveDealsThais}
          pipedriveLoading={pipedriveLoading}
        />
      </div>
    </div>
  )
}

function StatCard({ icon, label, value, sub, color, bg }: {
  icon: React.ReactNode; label: string; value: string; sub: string; color: string; bg: string
}) {
  return (
    <div className="cw-card p-5">
      <div className="flex items-start justify-between mb-3">
        <div className={`h-10 w-10 rounded-xl ${bg} flex items-center justify-center`} style={{ color }}>
          {icon}
        </div>
      </div>
      <p className="text-2xl font-black" style={{ color }}>{value}</p>
      <p className="text-xs font-black text-cw-text mt-0.5">{label}</p>
      <p className="text-[10px] text-cw-muted mt-0.5">{sub}</p>
    </div>
  )
}

function SdrCard({ nome, foto, eqls, opps, ganhos, metaInd, pipedriveDeals, pipedriveLoading }: {
  nome: string; foto: string; eqls: number; opps: number; ganhos: number
  metaInd: number; pipedriveDeals: PipedriveDeal[]; pipedriveLoading: boolean
}) {
  const pct = Math.min(100, Math.round((eqls / metaInd) * 100))
  const parceria = pipedriveDeals.filter(d => d.isIndicacaoParceria)
  const atendeMeta = pct >= 100

  return (
    <div className="cw-card overflow-hidden">
      {/* Topo colorido */}
      <div className="h-1.5 w-full" style={{ background: 'linear-gradient(90deg,#A543FA,#7C3AED)' }} />

      <div className="p-5">
        {/* Header */}
        <div className="flex items-center gap-4 mb-4">
          <div className="relative shrink-0">
            <img
              src={foto} alt={nome}
              className="h-14 w-14 rounded-2xl object-cover shadow-md"
              style={{ objectPosition: nome === 'Thais' ? 'center 20%' : 'center top' }}
            />
            {/* Status badge */}
            <span className={`absolute -bottom-1 -right-1 text-[8px] font-black px-1.5 py-0.5 rounded-full ${atendeMeta ? 'bg-green-500 text-white' : 'bg-cw-purple text-white'}`}>
              {atendeMeta ? '100%' : 'OPEN'}
            </span>
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <p className="text-lg font-black text-cw-text">{nome}</p>
            </div>
            <p className="text-[9px] text-cw-muted uppercase tracking-widest">SDR · Tier Agência</p>
            <div className="flex items-baseline gap-1 mt-1">
              <span className="text-2xl font-black text-cw-purple">{eqls}</span>
              <span className="text-xs text-cw-muted font-bold">EQLs / {metaInd}</span>
              <span className="text-xs font-black ml-1" style={{ color: pct >= 80 ? '#16a34a' : '#A543FA' }}>{pct}%</span>
            </div>
          </div>
        </div>

        {/* Barra de progresso */}
        <div className="h-2 bg-cw-bg rounded-full overflow-hidden mb-4">
          <div
            className="h-full rounded-full transition-all duration-700"
            style={{ width:`${pct}%`, background: pct >= 100 ? '#22c55e' : 'linear-gradient(90deg,#A543FA,#7C3AED)' }}
          />
        </div>
        <p className="text-[9px] text-cw-muted mb-4">Meta: {metaInd} EQLs</p>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-2 text-center mb-4">
          <div className="bg-cw-bg rounded-xl p-2.5">
            <p className="text-lg font-black text-cw-purple">{opps}</p>
            <p className="text-[8px] text-cw-muted font-bold uppercase tracking-wider">Opps</p>
          </div>
          <div className="bg-cw-bg rounded-xl p-2.5">
            <p className="text-lg font-black text-yellow-600">{pipedriveLoading ? '…' : ganhos}</p>
            <p className="text-[8px] text-cw-muted font-bold uppercase tracking-wider">Ganhos</p>
          </div>
        </div>

        {/* Ganhos do Pipedrive */}
        {(pipedriveDeals.length > 0 || pipedriveLoading) && (
          <div>
            <div className="flex items-center justify-between mb-2">
              <p className="text-[9px] font-black uppercase tracking-widest text-cw-muted">Ganhos do mês · Pipedrive</p>
              {parceria.length > 0 && (
                <span className="text-[8px] font-black px-2 py-0.5 rounded-full" style={{ background:'rgba(165,67,250,0.12)', color:'#A543FA' }}>
                  {parceria.length} via parceria
                </span>
              )}
            </div>
            <div className="space-y-1 max-h-44 overflow-y-auto">
              {pipedriveLoading && <p className="text-[10px] text-cw-muted text-center py-2">Carregando...</p>}
              {!pipedriveLoading && pipedriveDeals.map(d => (
                <div key={d.id} className="flex items-center gap-2 rounded-lg bg-cw-bg px-3 py-1.5">
                  <div className="flex-1 min-w-0">
                    <p className="text-[10px] font-bold text-cw-text truncate">{d.org_name || d.person_name || d.title}</p>
                    <p className="text-[9px] text-cw-muted">{fmtDate(d.won_time)}</p>
                  </div>
                  {d.isIndicacaoParceria && (
                    <span className="text-[8px] font-black px-1.5 py-0.5 rounded-full shrink-0" style={{ background:'rgba(165,67,250,0.1)', color:'#A543FA' }}>parceria</span>
                  )}
                  <p className="text-[10px] font-black text-green-600 shrink-0">{d.value > 0 ? fmt(d.value) : '—'}</p>
                  <a href={`https://cardapioweb.pipedrive.com/deal/${d.id}`} target="_blank" rel="noopener noreferrer" className="text-cw-muted hover:text-cw-purple transition-colors shrink-0">
                    <ExternalLink className="h-2.5 w-2.5" />
                  </a>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
