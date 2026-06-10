import { useState } from 'react'
import { BarChart3, Users, MessageSquare, Tag, RefreshCw, AlertCircle } from 'lucide-react'
import { useLeads } from './hooks/useLeads'
import MetaHeader from './components/MetaHeader'
import CarteiraSdr from './components/CarteiraSdr'
import MensagensSequencia from './components/MensagensSequencia'
import TabelaDescontos from './components/TabelaDescontos'

type Tab = 'meta' | 'gabrielly' | 'thais' | 'mensagens' | 'descontos'

const TABS: { id: Tab; label: string; icon: React.ReactNode }[] = [
  { id: 'meta', label: 'Meta Junho', icon: <BarChart3 className="h-4 w-4" /> },
  { id: 'gabrielly', label: 'Gabrielly', icon: <Users className="h-4 w-4" /> },
  { id: 'thais', label: 'Thais', icon: <Users className="h-4 w-4" /> },
  { id: 'mensagens', label: 'Mensagens', icon: <MessageSquare className="h-4 w-4" /> },
  { id: 'descontos', label: 'Descontos', icon: <Tag className="h-4 w-4" /> },
]

export default function App() {
  const [tab, setTab] = useState<Tab>('meta')
  const { leads, meta, loading, error, reload, addNewLead, moveLead, editLead, removeLead, saveMeta, leadsOf, eqlsOf } = useLeads()

  return (
    <div className="min-h-screen bg-[#0F0E17]">
      {/* Top bar */}
      <header className="border-b border-[#2D2A45] bg-[#1A1828] sticky top-0 z-20">
        <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-xl bg-purple-DEFAULT flex items-center justify-center">
              <BarChart3 className="h-4 w-4 text-white" />
            </div>
            <div>
              <p className="text-xs font-black text-text-primary leading-none">Parcerias</p>
              <p className="text-[10px] text-text-muted">Tier Agência · Cardápio Web</p>
            </div>
          </div>
          <button
            onClick={reload}
            disabled={loading}
            className="flex items-center gap-1.5 text-xs text-text-muted hover:text-text-primary transition-colors disabled:opacity-50"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${loading ? 'animate-spin' : ''}`} />
            {loading ? 'Carregando...' : 'Atualizar'}
          </button>
        </div>

        {/* Tabs */}
        <div className="max-w-5xl mx-auto px-4 flex gap-1 overflow-x-auto pb-0">
          {TABS.map(t => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`flex items-center gap-1.5 px-4 py-2.5 text-xs font-bold border-b-2 transition-all whitespace-nowrap ${
                tab === t.id
                  ? 'border-purple-DEFAULT text-text-primary'
                  : 'border-transparent text-text-muted hover:text-text-primary'
              }`}
            >
              {t.icon}
              {t.label}
              {(t.id === 'gabrielly' || t.id === 'thais') && (
                <span className="bg-purple-DEFAULT/20 text-purple-light text-[9px] font-black px-1.5 py-0.5 rounded-full">
                  {eqlsOf(t.id === 'gabrielly' ? 'Gabrielly' : 'Thais')}
                </span>
              )}
            </button>
          ))}
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
          <div className="mb-4 flex items-center gap-2 rounded-xl bg-amber-500/10 border border-amber-500/20 px-4 py-3">
            <AlertCircle className="h-4 w-4 text-amber-400 shrink-0" />
            <p className="text-xs text-amber-200">
              Modo offline — dados salvos no navegador. Configure <code className="bg-amber-500/20 px-1 rounded">VITE_SHEETS_URL</code> para sincronizar com Google Sheets.
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
          <CarteiraSdr
            sdr="Gabrielly"
            leads={leadsOf('Gabrielly')}
            onAdd={addNewLead}
            onMove={moveLead}
            onEdit={editLead}
            onDelete={removeLead}
          />
        )}

        {tab === 'thais' && (
          <CarteiraSdr
            sdr="Thais"
            leads={leadsOf('Thais')}
            onAdd={addNewLead}
            onMove={moveLead}
            onEdit={editLead}
            onDelete={removeLead}
          />
        )}

        {tab === 'mensagens' && <MensagensSequencia />}
        {tab === 'descontos' && <TabelaDescontos />}
      </main>
    </div>
  )
}
