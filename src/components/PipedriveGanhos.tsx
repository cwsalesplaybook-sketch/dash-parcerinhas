import { RefreshCw, ExternalLink, Trophy, Star, AlertCircle } from 'lucide-react'
import { usePipedriveGanhos } from '../hooks/usePipedrive'
import type { PipedriveDeal } from '../lib/pipedrive'

function fmt(v: number) {
  return v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
}

function fmtDate(s: string) {
  return new Date(s).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' })
}

export default function PipedriveGanhos() {
  const { loading, error, reload, hasToken, deGabrielly, deThais, receitaGabrielly, receitaThais, receitaTotal, total, totalParceria } = usePipedriveGanhos()

  if (!hasToken) {
    return (
      <div className="cw-card p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="h-9 w-9 rounded-xl flex items-center justify-center shrink-0" style={{ background: 'linear-gradient(135deg,#FF6B35,#F7931E)' }}>
            <Trophy className="h-4 w-4 text-white" />
          </div>
          <div>
            <p className="font-black text-cw-text">Ganhos do Pipeline · Pipedrive</p>
            <p className="text-[10px] text-cw-muted">Funil de Vendas — Junho 2026</p>
          </div>
        </div>
        <div className="flex items-start gap-2 rounded-xl bg-amber-50 border border-amber-200 px-4 py-3">
          <AlertCircle className="h-4 w-4 text-amber-600 shrink-0 mt-0.5" />
          <div>
            <p className="text-xs font-bold text-amber-800 mb-0.5">Configure a chave do Pipedrive</p>
            <p className="text-xs text-amber-700">
              Adicione <code className="bg-amber-100 px-1 rounded font-bold">VITE_PIPEDRIVE_TOKEN</code> nas variáveis de ambiente da Vercel para conectar ao pipeline.
            </p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="cw-card p-6 space-y-5">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-xl flex items-center justify-center shrink-0" style={{ background: 'linear-gradient(135deg,#FF6B35,#F7931E)' }}>
            <Trophy className="h-4 w-4 text-white" />
          </div>
          <div>
            <p className="font-black text-cw-text">Ganhos do Pipeline · Pipedrive</p>
            <p className="text-[10px] text-cw-muted">Funil de Vendas — Junho 2026 · SDR Tier Agência</p>
          </div>
        </div>
        <button onClick={reload} disabled={loading} className="flex items-center gap-1.5 text-xs text-cw-muted hover:text-cw-purple transition-colors disabled:opacity-40">
          <RefreshCw className={`h-3.5 w-3.5 ${loading ? 'animate-spin' : ''}`} />
        </button>
      </div>

      {error && (
        <div className="flex items-center gap-2 rounded-xl bg-red-50 border border-red-200 px-3 py-2">
          <AlertCircle className="h-3.5 w-3.5 text-red-500 shrink-0" />
          <p className="text-xs text-red-700">{error}</p>
        </div>
      )}

      {/* Stats totais */}
      <div className="grid grid-cols-3 gap-3">
        <div className="rounded-2xl p-4 text-center" style={{ background: 'linear-gradient(135deg,rgba(255,107,53,0.08),rgba(247,147,30,0.08))', border: '1px solid rgba(255,107,53,0.2)' }}>
          <p className="text-3xl font-black text-orange-500">{total}</p>
          <p className="text-[9px] font-black uppercase tracking-widest text-cw-muted mt-0.5">Ganhos totais</p>
        </div>
        <div className="rounded-2xl p-4 text-center" style={{ background: 'linear-gradient(135deg,rgba(165,67,250,0.08),rgba(165,67,250,0.04))', border: '1px solid rgba(165,67,250,0.2)' }}>
          <p className="text-3xl font-black text-cw-purple">{totalParceria}</p>
          <p className="text-[9px] font-black uppercase tracking-widest text-cw-muted mt-0.5">Via parceria</p>
        </div>
        <div className="rounded-2xl p-4 text-center bg-cw-elevated border border-cw-border">
          <p className="text-lg font-black text-green-600">{receitaTotal > 0 ? fmt(receitaTotal) : '—'}</p>
          <p className="text-[9px] font-black uppercase tracking-widest text-cw-muted mt-0.5">Receita total</p>
        </div>
      </div>

      {/* SDR breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <SdrGanhosCard
          nome="Gabrielly"
          foto="/gabrielly.jpg"
          deals={deGabrielly}
          receita={receitaGabrielly}
          loading={loading}
        />
        <SdrGanhosCard
          nome="Thais"
          foto="/thais.jpg"
          deals={deThais}
          receita={receitaThais}
          loading={loading}
        />
      </div>
    </div>
  )
}

function SdrGanhosCard({ nome, foto, deals, receita, loading }: {
  nome: string; foto: string; deals: PipedriveDeal[]; receita: number; loading: boolean
}) {
  const parceria = deals.filter(d => d.isIndicacaoParceria)

  return (
    <div className="rounded-2xl border border-cw-border bg-cw-elevated overflow-hidden">
      {/* Header do card */}
      <div className="flex items-center gap-3 p-4 border-b border-cw-border">
        <img src={foto} alt={nome} className="h-10 w-10 rounded-xl object-cover object-top shrink-0" />
        <div className="flex-1 min-w-0">
          <p className="font-black text-cw-text text-sm">{nome}</p>
          <p className="text-[9px] text-cw-muted uppercase tracking-wider">SDR · Tier Agência</p>
        </div>
        <div className="text-right">
          <p className="text-2xl font-black text-orange-500">{loading ? '…' : deals.length}</p>
          <p className="text-[9px] text-cw-muted">ganhos</p>
        </div>
      </div>

      {/* Mini stats */}
      <div className="grid grid-cols-2 divide-x divide-cw-border border-b border-cw-border">
        <div className="p-3 text-center">
          <p className="text-xs font-black text-green-600">{receita > 0 ? fmt(receita) : '—'}</p>
          <p className="text-[8px] text-cw-muted uppercase tracking-wider mt-0.5">Receita</p>
        </div>
        <div className="p-3 text-center">
          <div className="flex items-center justify-center gap-1">
            <Star className="h-3 w-3 text-cw-purple" />
            <p className="text-xs font-black text-cw-purple">{parceria.length}</p>
          </div>
          <p className="text-[8px] text-cw-muted uppercase tracking-wider mt-0.5">Via parceria</p>
        </div>
      </div>

      {/* Lista de deals */}
      <div className="divide-y divide-cw-border max-h-56 overflow-y-auto">
        {loading && (
          <div className="p-4 text-center">
            <RefreshCw className="h-4 w-4 animate-spin text-cw-muted mx-auto" />
          </div>
        )}
        {!loading && deals.length === 0 && (
          <p className="p-4 text-xs text-cw-muted text-center">Nenhum ganho este mês</p>
        )}
        {!loading && deals.map(d => (
          <div key={d.id} className="flex items-center gap-3 px-4 py-2.5 hover:bg-cw-bg transition-colors">
            <div className="flex-1 min-w-0">
              <p className="text-xs font-bold text-cw-text truncate">{d.org_name || d.person_name || d.title}</p>
              <div className="flex items-center gap-1.5 mt-0.5">
                <p className="text-[9px] text-cw-muted">{fmtDate(d.won_time)}</p>
                {d.isIndicacaoParceria && (
                  <span className="text-[8px] font-black px-1.5 py-0.5 rounded-full" style={{ background: 'rgba(165,67,250,0.12)', color: '#A543FA' }}>
                    parceria
                  </span>
                )}
              </div>
            </div>
            <div className="text-right shrink-0">
              <p className="text-xs font-black text-green-600">{d.value > 0 ? fmt(d.value) : '—'}</p>
            </div>
            <a
              href={`https://cardapioweb.pipedrive.com/deal/${d.id}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-cw-muted hover:text-cw-purple transition-colors shrink-0"
            >
              <ExternalLink className="h-3 w-3" />
            </a>
          </div>
        ))}
      </div>
    </div>
  )
}
