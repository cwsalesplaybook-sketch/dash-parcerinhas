import { useState } from 'react'
import { BarChart3, Users, MessageSquare, Tag, RefreshCw, AlertCircle } from 'lucide-react'
import { useLeads } from './hooks/useLeads'
import MetaHeader from './components/MetaHeader'
import CarteiraSdr from './components/CarteiraSdr'
import MensagensSequencia from './components/MensagensSequencia'
import TabelaDescontos from './components/TabelaDescontos'

type Tab = 'meta' | 'gabrielly' | 'thais' | 'mensagens' | 'descontos'

export default function App() {
  const [tab, setTab] = useState<Tab>('meta')
  const { meta, loading, error, reload, addNewLead, moveLead, editLead, removeLead, saveMeta, leadsOf, eqlsOf } = useLeads()

  return (
    <div className="min-h-screen" style={{ background: '#120E1E' }}>
      {/* Top bar */}
      <header className="border-b border-[#2E2550] sticky top-0 z-20" style={{ background: '#1C1630' }}>
        <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
          {/* Logo area */}
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-xl gradient-cw flex items-center justify-center shadow-lg shadow-purple-900/50">
              <BarChart3 className="h-4 w-4 text-white" />
            </div>
            <div>
              <p className="text-[11px] font-black text-white leading-none tracking-wide">CARDÁPIO WEB</p>
              <p className="text-[10px] text-purple-300/70 font-medium">Dashboard Parcerias · Tier Agência</p>
            </div>
          </div>

          <button
            onClick={reload}
            disabled={loading}
            className="flex items-center gap-1.5 text-xs text-purple-300/60 hover:text-purple-200 transition-colors disabled:opacity-50"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${loading ? 'animate-spin' : ''}`} />
            {loading ? 'Carregando...' : 'Atualizar'}
          </button>
        </div>

        {/* Tabs */}
        <div className="max-w-5xl mx-auto px-4 flex gap-0 overflow-x-auto">
          {/* Meta tab */}
          <TabButton active={tab === 'meta'} onClick={() => setTab('meta')}>
            <BarChart3 className="h-3.5 w-3.5" />
            Meta Junho
          </TabButton>

          {/* SDR tabs com foto */}
          <TabButton active={tab === 'gabrielly'} onClick={() => setTab('gabrielly')}>
            <img src="/gabrielly.jpg" alt="Gabrielly" className="h-5 w-5 rounded-full object-cover object-top ring-1 ring-purple-500/50" />
            Gabrielly
            <EqlBadge count={eqlsOf('Gabrielly')} />
          </TabButton>

          <TabButton active={tab === 'thais'} onClick={() => setTab('thais')}>
            <img src="/thais.jpg" alt="Thais" className="h-5 w-5 rounded-full object-cover object-top ring-1 ring-purple-500/50" />
            Thais
            <EqlBadge count={eqlsOf('Thais')} />
          </TabButton>

          <TabButton active={tab === 'mensagens'} onClick={() => setTab('mensagens')}>
            <MessageSquare className="h-3.5 w-3.5" />
            Mensagens
          </TabButton>

          <TabButton active={tab === 'descontos'} onClick={() => setTab('descontos')}>
            <Tag className="h-3.5 w-3.5" />
            Descontos
          </TabButton>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-5xl mx-auto px-4 py-6">
        {error && (
          <div className="mb-4 flex items-center gap-2 rounded-xl bg-red-500/10 border border-red-500/20 px-4 py-3">
            <AlertCircle className="h-4 w-4 text-red-400 shrink-0" />
            <p className="text-xs text-red-300">{error}</p>
          </div>
        )}

        {!import.meta.env.VITE_SHEETS_URL && (
          <div className="mb-4 flex items-center gap-2 rounded-xl bg-purple-500/10 border border-purple-500/20 px-4 py-3">
            <AlertCircle className="h-4 w-4 text-purple-400 shrink-0" />
            <p className="text-xs text-purple-200">
              Modo offline — dados salvos no navegador. Configure <code className="bg-purple-500/20 px-1 rounded">VITE_SHEETS_URL</code> para sincronizar com Google Sheets.
            </p>
          </div>
        )}

        {tab === 'meta' && (
          <MetaHeader
            meta={meta}
            eqlsGabrielly={eqlsOf('Gabrielly')}
            eqlsThais={eqlsOf('Thais')}
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
      </main>
    </div>
  )
}

function TabButton({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-1.5 px-4 py-2.5 text-xs font-bold border-b-2 transition-all whitespace-nowrap ${
        active
          ? 'border-purple-500 text-white'
          : 'border-transparent text-purple-300/50 hover:text-purple-200'
      }`}
    >
      {children}
    </button>
  )
}

function EqlBadge({ count }: { count: number }) {
  return (
    <span className="bg-purple-500/25 text-purple-300 text-[9px] font-black px-1.5 py-0.5 rounded-full min-w-[18px] text-center">
      {count}
    </span>
  )
}
