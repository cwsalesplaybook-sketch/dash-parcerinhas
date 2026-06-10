import { useState } from 'react'
import { BarChart3, MessageSquare, Tag, AlertCircle, Trophy, TrendingUp, Zap } from 'lucide-react'
import { useLeads } from './hooks/useLeads'
import MetaHeader from './components/MetaHeader'
import CarteiraSdr from './components/CarteiraSdr'
import MensagensSequencia from './components/MensagensSequencia'
import TabelaDescontos from './components/TabelaDescontos'
import { usePipedriveGanhos } from './hooks/usePipedrive'

type Tab = 'meta' | 'gabrielly' | 'thais' | 'mensagens' | 'descontos'

const META_JUNHO = 258

export default function App() {
  const [tab, setTab] = useState<Tab>('meta')
  const { meta, error, addNewLead, moveLead, editLead, removeLead, saveMeta, leadsOf, eqlsOf } = useLeads()

  const oppsOf = (sdr: 'Gabrielly' | 'Thais') =>
    leadsOf(sdr).filter(l => l.status === 'opp' || l.status === 'ganho').length
  const ganhosOf = (sdr: 'Gabrielly' | 'Thais') =>
    leadsOf(sdr).filter(l => l.status === 'ganho').length
  const receitaOf = (sdr: 'Gabrielly' | 'Thais') =>
    leadsOf(sdr).filter(l => l.status === 'ganho').reduce((s, l) => s + (l.valor ?? 0), 0)

  const totalEqls = eqlsOf('Gabrielly') + eqlsOf('Thais')
  const totalOpps = oppsOf('Gabrielly') + oppsOf('Thais')

  // Ganhos do Pipedrive
  const pipedrive = usePipedriveGanhos()
  const totalGanhos = pipedrive.hasToken ? pipedrive.total : ganhosOf('Gabrielly') + ganhosOf('Thais')
  const totalReceita = pipedrive.hasToken ? pipedrive.receitaTotal : receitaOf('Gabrielly') + receitaOf('Thais')
  const pct = Math.min(100, Math.round((totalEqls / META_JUNHO) * 100))

  return (
    <div className="flex h-screen bg-cw-bg overflow-hidden">
      {/* Sidebar */}
      <aside
        className="w-64 flex flex-col shrink-0 overflow-hidden"
        style={{ background: 'linear-gradient(180deg, #1A0828 0%, #20092F 60%, #16061F 100%)' }}
      >
        {/* Brand */}
        <div className="px-5 pt-6 pb-5">
          <div className="flex items-center gap-3 mb-1">
            <div className="h-9 w-9 rounded-xl gradient-primary flex items-center justify-center shadow-lg shrink-0">
              <BarChart3 className="h-4.5 w-4.5 text-white" />
            </div>
            <div>
              <p className="text-xs font-black text-white tracking-tight leading-none">Cardápio Web</p>
              <p className="text-[9px] text-purple-400/50 mt-0.5 tracking-widest uppercase">Tier Agência</p>
            </div>
          </div>
        </div>

        {/* Meta EQL mini progress */}
        <div className="mx-4 mb-4 rounded-2xl overflow-hidden" style={{ background: 'rgba(165,67,250,0.12)', border: '1px solid rgba(165,67,250,0.2)' }}>
          <div className="px-4 pt-3.5 pb-1">
            <div className="flex items-center justify-between mb-1">
              <p className="text-[9px] font-black uppercase tracking-widest text-purple-300/60">Meta EQL Junho</p>
              <p className="text-[10px] font-black text-cw-purple">{pct}%</p>
            </div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-2xl font-black text-white">{totalEqls}</span>
              <span className="text-xs text-purple-300/50 font-bold">/ {META_JUNHO}</span>
            </div>
          </div>
          <div className="h-1.5 bg-[#3A1F52]/60 mx-4 mb-3.5 rounded-full overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-700"
              style={{ width: `${pct}%`, background: 'linear-gradient(90deg,#A543FA,#D48AFC)' }}
            />
          </div>
        </div>

        {/* Nav principal */}
        <nav className="flex-1 px-3 space-y-0.5 overflow-y-auto">
          <NavItem
            icon={<BarChart3 className="h-4 w-4" />}
            label="Visão Geral"
            active={tab === 'meta'}
            onClick={() => setTab('meta')}
          />

          <div className="pt-4 pb-1.5 px-2">
            <p className="text-[8px] font-black uppercase tracking-[0.15em] text-purple-400/35">Carteiras SDR</p>
          </div>

          {/* SDR card — Gabrielly */}
          <SdrNavCard
            nome="Gabrielly"
            foto="/gabrielly.jpg"
            eqls={eqlsOf('Gabrielly')}
            opps={oppsOf('Gabrielly')}
            ganhos={ganhosOf('Gabrielly')}
            metaInd={Math.round(META_JUNHO / 2)}
            active={tab === 'gabrielly'}
            onClick={() => setTab('gabrielly')}
          />

          {/* SDR card — Thais */}
          <SdrNavCard
            nome="Thais"
            foto="/thais.jpg"
            eqls={eqlsOf('Thais')}
            opps={oppsOf('Thais')}
            ganhos={ganhosOf('Thais')}
            metaInd={Math.round(META_JUNHO / 2)}
            active={tab === 'thais'}
            onClick={() => setTab('thais')}
          />

          <div className="pt-4 pb-1.5 px-2">
            <p className="text-[8px] font-black uppercase tracking-[0.15em] text-purple-400/35">Recursos</p>
          </div>

          <NavItem
            icon={<MessageSquare className="h-4 w-4" />}
            label="Mensagens"
            active={tab === 'mensagens'}
            onClick={() => setTab('mensagens')}
          />
          <NavItem
            icon={<Tag className="h-4 w-4" />}
            label="Descontos"
            active={tab === 'descontos'}
            onClick={() => setTab('descontos')}
          />
        </nav>

        {/* Footer stats */}
        <div className="mx-3 mb-4 rounded-2xl p-3.5 space-y-2.5" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)' }}>
          <FooterStat
            icon={<TrendingUp className="h-3 w-3" />}
            label="Opps abertas"
            value={String(totalOpps)}
            color="#A543FA"
          />
          <div className="h-px bg-white/5" />
          <FooterStat
            icon={<Trophy className="h-3 w-3" />}
            label="Ganhos no mês"
            value={String(totalGanhos)}
            color="#FFB600"
          />
          {totalReceita > 0 && (
            <>
              <div className="h-px bg-white/5" />
              <FooterStat
                icon={<Zap className="h-3 w-3" />}
                label="Receita gerada"
                value={totalReceita.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                color="#22c55e"
              />
            </>
          )}
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Content */}
        <main className="flex-1 overflow-y-auto p-6">
          {error && (
            <div className="mb-4 flex items-center gap-2 rounded-xl bg-red-50 border border-red-200 px-4 py-3">
              <AlertCircle className="h-4 w-4 text-red-500 shrink-0" />
              <p className="text-xs text-red-700">{error}</p>
            </div>
          )}

          <div className="w-full">
            {tab === 'meta' && (
              <MetaHeader
                meta={meta}
                eqlsGabrielly={eqlsOf('Gabrielly')} eqlsThais={eqlsOf('Thais')}
                oppsGabrielly={oppsOf('Gabrielly')} oppsThais={oppsOf('Thais')}
                ganhosGabrielly={pipedrive.hasToken ? pipedrive.deGabrielly.length : ganhosOf('Gabrielly')}
                ganhosThais={pipedrive.hasToken ? pipedrive.deThais.length : ganhosOf('Thais')}
                receitaGabrielly={pipedrive.hasToken ? pipedrive.receitaGabrielly : receitaOf('Gabrielly')}
                receitaThais={pipedrive.hasToken ? pipedrive.receitaThais : receitaOf('Thais')}
                pipedriveDealsGabrielly={pipedrive.deGabrielly}
                pipedriveDealsThais={pipedrive.deThais}
                pipedriveLoading={pipedrive.loading}
                onSave={saveMeta}
              />
            )}
            {tab === 'gabrielly' && (
              <CarteiraSdr sdr="Gabrielly" leads={leadsOf('Gabrielly')} onAdd={addNewLead} onMove={moveLead} onEdit={editLead} onDelete={removeLead} />
            )}
            {tab === 'thais' && (
              <CarteiraSdr sdr="Thais" leads={leadsOf('Thais')} onAdd={addNewLead} onMove={moveLead} onEdit={editLead} onDelete={removeLead} />
            )}
            {tab === 'mensagens' && <MensagensSequencia />}
            {tab === 'descontos' && <TabelaDescontos />}
          </div>
        </main>
      </div>
    </div>
  )
}

function NavItem({ icon, label, active, onClick }: {
  icon: React.ReactNode; label: string; active: boolean; onClick: () => void
}) {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold transition-all ${
        active
          ? 'text-white shadow-lg'
          : 'text-purple-300/50 hover:text-purple-200 hover:bg-white/5'
      }`}
      style={active ? { background: 'linear-gradient(135deg,rgba(165,67,250,0.35),rgba(165,67,250,0.15))', border: '1px solid rgba(165,67,250,0.3)' } : {}}
    >
      <span className={active ? 'text-cw-purple' : ''}>{icon}</span>
      <span>{label}</span>
      {active && <span className="ml-auto h-1.5 w-1.5 rounded-full bg-cw-purple" />}
    </button>
  )
}

function SdrNavCard({ nome, foto, eqls, opps, ganhos, metaInd, active, onClick }: {
  nome: string; foto: string; eqls: number; opps: number; ganhos: number
  metaInd: number; active: boolean; onClick: () => void
}) {
  const pct = Math.min(100, Math.round((eqls / metaInd) * 100))
  return (
    <button
      onClick={onClick}
      className={`w-full text-left rounded-2xl p-3 transition-all mb-1 ${active ? '' : 'hover:bg-white/5'}`}
      style={active ? { background: 'linear-gradient(135deg,rgba(165,67,250,0.3),rgba(165,67,250,0.1))', border: '1px solid rgba(165,67,250,0.35)' } : { border: '1px solid transparent' }}
    >
      <div className="flex items-center gap-3 mb-2.5">
        <div className="relative shrink-0">
          <img src={foto} alt={nome} className="h-9 w-9 rounded-xl object-cover" style={{ objectPosition: nome === 'Thais' ? 'center 20%' : 'center top' }} />
          {active && (
            <span className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full bg-cw-purple border-2 border-[#20092F]" />
          )}
        </div>
        <div className="flex-1 min-w-0">
          <p className={`text-xs font-black truncate ${active ? 'text-white' : 'text-purple-200/70'}`}>{nome}</p>
          <p className="text-[9px] text-purple-400/50 uppercase tracking-wider">SDR · Agência</p>
        </div>
        <span
          className="text-[10px] font-black px-2 py-0.5 rounded-full shrink-0"
          style={{ background: 'rgba(165,67,250,0.2)', color: '#D48AFC' }}
        >
          {eqls} EQL
        </span>
      </div>
      <div className="h-1 bg-[#3A1F52]/80 rounded-full overflow-hidden mb-2">
        <div
          className="h-full rounded-full transition-all duration-700"
          style={{ width: `${pct}%`, background: active ? 'linear-gradient(90deg,#A543FA,#D48AFC)' : 'rgba(165,67,250,0.5)' }}
        />
      </div>
      <div className="flex gap-3">
        <span className="text-[9px] text-purple-400/60 font-bold">
          <span className="text-purple-300/80">{opps}</span> opps
        </span>
        <span className="text-[9px] text-purple-400/60 font-bold">
          <span className="text-yellow-400/80">{ganhos}</span> ganhos
        </span>
        <span className="text-[9px] text-purple-400/50 ml-auto">{pct}%</span>
      </div>
    </button>
  )
}

function FooterStat({ icon, label, value, color }: {
  icon: React.ReactNode; label: string; value: string; color: string
}) {
  return (
    <div className="flex items-center gap-2.5">
      <span style={{ color }} className="opacity-80">{icon}</span>
      <div className="flex-1 min-w-0">
        <p className="text-[8px] text-white/25 uppercase tracking-[0.12em] font-bold truncate">{label}</p>
        <p className="text-xs font-black truncate" style={{ color }}>{value}</p>
      </div>
    </div>
  )
}
