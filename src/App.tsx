import { useState } from 'react'
import { BarChart3, MessageSquare, Tag, RefreshCw, AlertCircle, Trophy, TrendingUp, ChevronLeft, ChevronRight } from 'lucide-react'
import { useLeads } from './hooks/useLeads'
import MetaHeader from './components/MetaHeader'
import CarteiraSdr from './components/CarteiraSdr'
import MensagensSequencia from './components/MensagensSequencia'
import TabelaDescontos from './components/TabelaDescontos'

type Tab = 'meta' | 'gabrielly' | 'thais' | 'mensagens' | 'descontos'

export default function App() {
  const [tab, setTab] = useState<Tab>('meta')
  const [collapsed, setCollapsed] = useState(false)
  const { meta, loading, error, reload, addNewLead, moveLead, editLead, removeLead, saveMeta, leadsOf, eqlsOf } = useLeads()

  const oppsOf = (sdr: 'Gabrielly' | 'Thais') =>
    leadsOf(sdr).filter(l => l.status === 'opp' || l.status === 'ganho').length
  const ganhosOf = (sdr: 'Gabrielly' | 'Thais') =>
    leadsOf(sdr).filter(l => l.status === 'ganho').length
  const receitaOf = (sdr: 'Gabrielly' | 'Thais') =>
    leadsOf(sdr).filter(l => l.status === 'ganho').reduce((s, l) => s + (l.valor ?? 0), 0)

  const totalOpps = oppsOf('Gabrielly') + oppsOf('Thais')
  const totalGanhos = ganhosOf('Gabrielly') + ganhosOf('Thais')
  const totalReceita = receitaOf('Gabrielly') + receitaOf('Thais')

  return (
    <div className="flex h-screen bg-cw-bg overflow-hidden">
      {/* Sidebar */}
      <aside
        className="flex flex-col shrink-0 transition-all duration-300 overflow-hidden"
        style={{ width: collapsed ? 64 : 220, background: '#20092F', borderRight: '1px solid #3A1F52' }}
      >
        {/* Logo */}
        <div className="flex items-center gap-2.5 px-4 py-4 border-b border-[#3A1F52]">
          <div className="h-8 w-8 rounded-xl gradient-primary flex items-center justify-center shrink-0">
            <BarChart3 className="h-4 w-4 text-white" />
          </div>
          {!collapsed && (
            <div className="overflow-hidden">
              <p className="text-[10px] font-black text-white uppercase tracking-widest leading-none">Cardápio Web</p>
              <p className="text-[9px] text-purple-300/50 mt-0.5">Parcerias · Tier Agência</p>
            </div>
          )}
        </div>

        {/* Nav items */}
        <nav className="flex-1 py-3 space-y-0.5 px-2">
          <NavItem icon={<BarChart3 className="h-4 w-4" />} label="Meta Junho" active={tab==='meta'} collapsed={collapsed} onClick={() => setTab('meta')} />

          <div className={`${!collapsed ? 'px-2 pt-3 pb-1' : 'py-2'}`}>
            {!collapsed && <p className="text-[9px] font-black uppercase tracking-widest text-purple-300/30">SDRs</p>}
            {collapsed && <div className="h-px bg-[#3A1F52]" />}
          </div>

          <NavItem
            icon={<img src="/gabrielly.jpg" alt="G" className="h-5 w-5 rounded-full object-cover object-top" />}
            label="Gabrielly"
            active={tab==='gabrielly'}
            collapsed={collapsed}
            onClick={() => setTab('gabrielly')}
            badge={eqlsOf('Gabrielly')}
          />
          <NavItem
            icon={<img src="/thais.jpg" alt="T" className="h-5 w-5 rounded-full object-cover object-top" />}
            label="Thais"
            active={tab==='thais'}
            collapsed={collapsed}
            onClick={() => setTab('thais')}
            badge={eqlsOf('Thais')}
          />

          <div className={`${!collapsed ? 'px-2 pt-3 pb-1' : 'py-2'}`}>
            {!collapsed && <p className="text-[9px] font-black uppercase tracking-widest text-purple-300/30">Recursos</p>}
            {collapsed && <div className="h-px bg-[#3A1F52]" />}
          </div>

          <NavItem icon={<MessageSquare className="h-4 w-4" />} label="Mensagens" active={tab==='mensagens'} collapsed={collapsed} onClick={() => setTab('mensagens')} />
          <NavItem icon={<Tag className="h-4 w-4" />} label="Descontos" active={tab==='descontos'} collapsed={collapsed} onClick={() => setTab('descontos')} />
        </nav>

        {/* Mini stats no rodapé da sidebar */}
        {!collapsed && (
          <div className="px-3 py-3 border-t border-[#3A1F52] space-y-2">
            <MiniStat icon={<TrendingUp className="h-3 w-3" />} label="Opps abertas" value={totalOpps} color="#A543FA" />
            <MiniStat icon={<Trophy className="h-3 w-3" />} label="Ganhos" value={totalGanhos} color="#FFB600" />
            {totalReceita > 0 && (
              <MiniStat icon={<Trophy className="h-3 w-3" />} label="Receita" value={totalReceita.toLocaleString('pt-BR',{style:'currency',currency:'BRL'})} color="#22c55e" isText />
            )}
          </div>
        )}

        {/* Collapse toggle */}
        <button
          onClick={() => setCollapsed(v => !v)}
          className="flex items-center justify-center py-3 border-t border-[#3A1F52] text-purple-300/40 hover:text-purple-200 transition-colors"
        >
          {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
        </button>
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Topbar */}
        <div className="bg-cw-surface border-b border-cw-border px-6 py-3 flex items-center justify-between shrink-0">
          <h1 className="text-sm font-black text-cw-text">
            {tab === 'meta' && 'Meta Junho 2026'}
            {tab === 'gabrielly' && 'Carteira · Gabrielly'}
            {tab === 'thais' && 'Carteira · Thais'}
            {tab === 'mensagens' && 'Mensagens da Sequência'}
            {tab === 'descontos' && 'Tabela de Descontos'}
          </h1>
          <button onClick={reload} disabled={loading} className="flex items-center gap-1.5 text-xs text-cw-muted hover:text-cw-purple transition-colors disabled:opacity-40">
            <RefreshCw className={`h-3.5 w-3.5 ${loading ? 'animate-spin' : ''}`} />
            {loading ? 'Carregando...' : 'Atualizar'}
          </button>
        </div>

        {/* Content */}
        <main className="flex-1 overflow-y-auto p-6">
          {error && (
            <div className="mb-4 flex items-center gap-2 rounded-xl bg-red-50 border border-red-200 px-4 py-3">
              <AlertCircle className="h-4 w-4 text-red-500 shrink-0" />
              <p className="text-xs text-red-700">{error}</p>
            </div>
          )}
          {!import.meta.env.VITE_SHEETS_URL && (
            <div className="mb-4 flex items-center gap-2 rounded-xl bg-cw-elevated border border-cw-border px-4 py-3">
              <AlertCircle className="h-4 w-4 text-cw-muted shrink-0" />
              <p className="text-xs text-cw-muted">
                Modo offline — dados salvos no navegador. Configure <code className="bg-cw-bg px-1 rounded text-cw-purple font-bold">VITE_SHEETS_URL</code> para sincronizar com Google Sheets.
              </p>
            </div>
          )}

          <div className="max-w-5xl">
            {tab === 'meta'      && <MetaHeader meta={meta} eqlsGabrielly={eqlsOf('Gabrielly')} eqlsThais={eqlsOf('Thais')} oppsGabrielly={oppsOf('Gabrielly')} oppsThais={oppsOf('Thais')} ganhosGabrielly={ganhosOf('Gabrielly')} ganhosThais={ganhosOf('Thais')} receitaGabrielly={receitaOf('Gabrielly')} receitaThais={receitaOf('Thais')} onSave={saveMeta} />}
            {tab === 'gabrielly' && <CarteiraSdr sdr="Gabrielly" leads={leadsOf('Gabrielly')} onAdd={addNewLead} onMove={moveLead} onEdit={editLead} onDelete={removeLead} />}
            {tab === 'thais'     && <CarteiraSdr sdr="Thais"     leads={leadsOf('Thais')}     onAdd={addNewLead} onMove={moveLead} onEdit={editLead} onDelete={removeLead} />}
            {tab === 'mensagens' && <MensagensSequencia />}
            {tab === 'descontos' && <TabelaDescontos />}
          </div>
        </main>
      </div>
    </div>
  )
}

function NavItem({ icon, label, active, collapsed, onClick, badge }: {
  icon: React.ReactNode; label: string; active: boolean; collapsed: boolean; onClick: () => void; badge?: number
}) {
  return (
    <button
      onClick={onClick}
      title={collapsed ? label : undefined}
      className={`w-full flex items-center gap-2.5 px-2.5 py-2 rounded-xl text-xs font-bold transition-all ${
        active ? 'bg-cw-purple/20 text-white' : 'text-purple-300/50 hover:text-purple-200 hover:bg-white/5'
      }`}
    >
      <span className="shrink-0">{icon}</span>
      {!collapsed && <span className="flex-1 text-left">{label}</span>}
      {!collapsed && badge !== undefined && badge > 0 && (
        <span className="bg-cw-purple/30 text-purple-200 text-[9px] font-black px-1.5 py-0.5 rounded-full">{badge}</span>
      )}
    </button>
  )
}

function MiniStat({ icon, label, value, color, isText }: {
  icon: React.ReactNode; label: string; value: number | string; color: string; isText?: boolean
}) {
  return (
    <div className="flex items-center gap-2">
      <span style={{ color }}>{icon}</span>
      <div className="flex-1 min-w-0">
        <p className="text-[9px] text-purple-300/40 uppercase tracking-wider font-bold truncate">{label}</p>
        <p className="text-xs font-black" style={{ color }}>
          {isText ? value : value}
        </p>
      </div>
    </div>
  )
}
