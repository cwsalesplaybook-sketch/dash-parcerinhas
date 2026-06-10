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
    <div className="min-h-screen bg-cw-bg">
      {/* Header */}
      <header className="bg-cw-sidebar border-b border-[#3A1F52] sticky top-0 z-20">
        <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-xl gradient-primary flex items-center justify-center shadow-lg">
              <BarChart3 className="h-4 w-4 text-white" />
            </div>
            <div>
              <p className="text-[11px] font-black text-white leading-none tracking-widest uppercase">Cardápio Web</p>
              <p className="text-[10px] text-purple-300/60 font-medium mt-0.5">Dashboard Parcerias · Tier Agência</p>
            </div>
          </div>
          <button
            onClick={reload}
            disabled={loading}
            className="flex items-center gap-1.5 text-xs text-purple-300/50 hover:text-purple-200 transition-colors disabled:opacity-40"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${loading ? 'animate-spin' : ''}`} />
            {loading ? 'Carregando...' : 'Atualizar'}
          </button>
        </div>

        {/* Tabs — dark sidebar style */}
        <div className="max-w-5xl mx-auto px-4 flex overflow-x-auto">
          <NavTab active={tab === 'meta'} onClick={() => setTab('meta')}>
            <BarChart3 className="h-3.5 w-3.5" /> Meta Junho
          </NavTab>
          <NavTab active={tab === 'gabrielly'} onClick={() => setTab('gabrielly')}>
            <img src="/gabrielly.jpg" alt="Gabrielly" className="h-5 w-5 rounded-full object-cover object-top ring-1 ring-cw-purple/60" />
            Gabrielly
            <span className="bg-cw-purple/30 text-purple-200 text-[9px] font-black px-1.5 py-0.5 rounded-full">{eqlsOf('Gabrielly')}</span>
          </NavTab>
          <NavTab active={tab === 'thais'} onClick={() => setTab('thais')}>
            <img src="/thais.jpg" alt="Thais" className="h-5 w-5 rounded-full object-cover object-top ring-1 ring-cw-purple/60" />
            Thais
            <span className="bg-cw-purple/30 text-purple-200 text-[9px] font-black px-1.5 py-0.5 rounded-full">{eqlsOf('Thais')}</span>
          </NavTab>
          <NavTab active={tab === 'mensagens'} onClick={() => setTab('mensagens')}>
            <MessageSquare className="h-3.5 w-3.5" /> Mensagens
          </NavTab>
          <NavTab active={tab === 'descontos'} onClick={() => setTab('descontos')}>
            <Tag className="h-3.5 w-3.5" /> Descontos
          </NavTab>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-6">
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

        {tab === 'meta'       && <MetaHeader meta={meta} eqlsGabrielly={eqlsOf('Gabrielly')} eqlsThais={eqlsOf('Thais')} onSave={saveMeta} />}
        {tab === 'gabrielly'  && <CarteiraSdr sdr="Gabrielly" leads={leadsOf('Gabrielly')} onAdd={addNewLead} onMove={moveLead} onEdit={editLead} onDelete={removeLead} />}
        {tab === 'thais'      && <CarteiraSdr sdr="Thais"     leads={leadsOf('Thais')}     onAdd={addNewLead} onMove={moveLead} onEdit={editLead} onDelete={removeLead} />}
        {tab === 'mensagens'  && <MensagensSequencia />}
        {tab === 'descontos'  && <TabelaDescontos />}
      </main>
    </div>
  )
}

function NavTab({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-1.5 px-4 py-2.5 text-xs font-bold border-b-2 transition-all whitespace-nowrap ${
        active ? 'border-cw-purple text-white' : 'border-transparent text-purple-300/40 hover:text-purple-200'
      }`}
    >
      {children}
    </button>
  )
}
