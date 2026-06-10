import { useState } from 'react'
import { Check, Tag, Zap } from 'lucide-react'

const PLANOS = [
  { id: 'delivery',  nome: 'Delivery',                preco: 209.99, cor: '#A543FA' },
  { id: 'mesas',     nome: 'Mesas',                   preco: 169.99, cor: '#7C3AED' },
  { id: 'premium',   nome: 'Premium',                  preco: 269.99, cor: '#6D28D9' },
  { id: 'totem',     nome: 'Totem de Auto Atendimento', preco: 99.99,  cor: '#8B5CF6' },
]

const ADDONS = [
  { id: 'ifood',    nome: 'iFood',             preco: 29.99 },
  { id: 'estoque',  nome: 'Estoque Avançado',  preco: 29.99 },
  { id: 'roteir',   nome: 'Roteirização',      preco: 54.99 },
  { id: 'financ',   nome: 'Financeiro',        preco: 69.99 },
  { id: 'fiscal',   nome: 'Fiscal',            preco: 69.99 },
]

type Periodo = 'mensal' | 'trimestral' | 'semestral' | 'anual'

const PERIODOS: { id: Periodo; label: string; meses: number; descontoMes: number; descontoParceiro: number }[] = [
  { id: 'mensal',     label: 'Mensal',     meses: 1,  descontoMes: 0,  descontoParceiro: 15 },
  { id: 'trimestral', label: 'Trimestral', meses: 3,  descontoMes: 10, descontoParceiro: 9 },
  { id: 'semestral',  label: 'Semestral',  meses: 6,  descontoMes: 20, descontoParceiro: 7 },
  { id: 'anual',      label: 'Anual',      meses: 12, descontoMes: 30, descontoParceiro: 5 },
]

function fmt(v: number) { return v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }) }
function fmtM(v: number) { return v.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) }

export default function CalculadoraPlanos() {
  const [planoSel, setPlanoSel] = useState<string | null>(null)
  const [addonsSel, setAddonsSel] = useState<Set<string>>(new Set())
  const [periodo, setPeriodo] = useState<Periodo>('mensal')
  const [parceiro, setParceiro] = useState(true)

  const per = PERIODOS.find(p => p.id === periodo)!
  const plano = PLANOS.find(p => p.id === planoSel)

  function toggleAddon(id: string) {
    setAddonsSel(prev => {
      const next = new Set(prev)
      next.has(id) ? next.delete(id) : next.add(id)
      return next
    })
  }

  // Cálculo
  const precoPlanoMes = plano ? Math.max(0, plano.preco - per.descontoMes) : 0
  const precoPlanoTotal = precoPlanoMes * per.meses
  const precoPlanoComDesconto = parceiro && plano
    ? precoPlanoTotal * (1 - per.descontoParceiro / 100)
    : precoPlanoTotal

  const addonsTotal = Array.from(addonsSel).reduce((s, id) => {
    const a = ADDONS.find(a => a.id === id)
    return s + (a ? a.preco * per.meses : 0)
  }, 0)

  const totalGeral = precoPlanoComDesconto + addonsTotal
  const equivalenteMes = totalGeral / per.meses
  const economiaVsMensal = plano
    ? (plano.preco * per.meses) - totalGeral
    : 0

  const descParceiro = parceiro && plano ? precoPlanoTotal * (per.descontoParceiro / 100) : 0

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="cw-card p-6">
        <div className="flex items-center gap-3 mb-1">
          <div className="h-9 w-9 rounded-xl gradient-primary flex items-center justify-center">
            <Tag className="h-4 w-4 text-white" />
          </div>
          <div>
            <p className="font-black text-cw-text text-lg">Calculadora de Planos</p>
            <p className="text-xs text-cw-muted">Simule o valor total para o lead com desconto de parceiro</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Coluna principal */}
        <div className="lg:col-span-2 space-y-4">

          {/* Seletor de período */}
          <div className="cw-card p-5">
            <p className="text-[10px] font-black uppercase tracking-widest text-cw-muted mb-3">Período de contratação</p>
            <div className="grid grid-cols-4 gap-2">
              {PERIODOS.map(p => (
                <button
                  key={p.id}
                  onClick={() => setPeriodo(p.id)}
                  className={`rounded-2xl p-3 text-center border-2 transition-all ${
                    periodo === p.id
                      ? 'border-cw-purple'
                      : 'border-cw-border hover:border-cw-purple/30'
                  }`}
                  style={periodo === p.id ? { background: 'rgba(165,67,250,0.08)' } : { background: 'transparent' }}
                >
                  <p className={`text-xs font-black ${periodo === p.id ? 'text-cw-purple' : 'text-cw-text'}`}>{p.label}</p>
                  {p.descontoMes > 0 ? (
                    <p className="text-[9px] text-green-600 font-bold mt-0.5">-R${p.descontoMes}/mês</p>
                  ) : (
                    <p className="text-[9px] text-cw-muted mt-0.5">sem desconto</p>
                  )}
                  {p.descontoParceiro > 0 && (
                    <p className="text-[9px] text-cw-purple font-bold mt-0.5">+{p.descontoParceiro}% parceiro</p>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Planos */}
          <div className="cw-card p-5">
            <p className="text-[10px] font-black uppercase tracking-widest text-cw-muted mb-3">Plano</p>
            <div className="space-y-2">
              {PLANOS.map(p => {
                const precoMes = Math.max(0, p.preco - per.descontoMes)
                const precoTotal = precoMes * per.meses
                const precoComDesc = parceiro ? precoTotal * (1 - per.descontoParceiro / 100) : precoTotal
                const sel = planoSel === p.id
                return (
                  <button
                    key={p.id}
                    onClick={() => setPlanoSel(sel ? null : p.id)}
                    className={`w-full flex items-center gap-4 rounded-2xl px-4 py-3.5 border-2 text-left transition-all ${
                      sel ? 'border-cw-purple' : 'border-cw-border hover:border-cw-purple/30'
                    }`}
                    style={sel ? { background: 'rgba(165,67,250,0.06)' } : {}}
                  >
                    {/* Checkbox visual */}
                    <div className={`h-5 w-5 rounded-md border-2 flex items-center justify-center shrink-0 transition-all ${
                      sel ? 'bg-cw-purple border-cw-purple' : 'border-cw-border'
                    }`}>
                      {sel && <Check className="h-3 w-3 text-white" />}
                    </div>
                    {/* Dot color */}
                    <div className="h-2.5 w-2.5 rounded-full shrink-0" style={{ background: p.cor }} />
                    {/* Nome */}
                    <p className={`text-sm font-bold flex-1 ${sel ? 'text-cw-purple' : 'text-cw-text'}`}>{p.nome}</p>
                    {/* Preços */}
                    <div className="text-right shrink-0">
                      <p className={`text-sm font-black ${sel ? 'text-cw-purple' : 'text-cw-text'}`}>
                        {per.meses === 1 ? fmt(p.preco) : fmt(precoComDesc)}
                      </p>
                      {per.meses > 1 && (
                        <p className="text-[9px] text-cw-muted">{fmt(precoMes)}/mês</p>
                      )}
                    </div>
                    {per.meses === 1 && (
                      <div className="text-right shrink-0 w-20">
                        <p className="text-[9px] text-cw-muted">mensal</p>
                      </div>
                    )}
                    {per.meses > 1 && (
                      <div className="text-right shrink-0 w-28">
                        <p className="text-[9px] text-cw-muted">total {per.meses} meses</p>
                        {parceiro && <p className="text-[9px] text-green-600 font-bold">c/ desconto parceiro</p>}
                      </div>
                    )}
                  </button>
                )
              })}
            </div>
          </div>

          {/* Add-ons */}
          <div className="cw-card p-5">
            <p className="text-[10px] font-black uppercase tracking-widest text-cw-muted mb-3">Módulos adicionais <span className="text-[9px] normal-case font-normal">(sem desconto de fidelidade)</span></p>
            <div className="space-y-2">
              {ADDONS.map(a => {
                const total = a.preco * per.meses
                const sel = addonsSel.has(a.id)
                return (
                  <button
                    key={a.id}
                    onClick={() => toggleAddon(a.id)}
                    className={`w-full flex items-center gap-4 rounded-2xl px-4 py-3 border-2 text-left transition-all ${
                      sel ? 'border-cw-purple/60' : 'border-cw-border hover:border-cw-purple/20'
                    }`}
                    style={sel ? { background: 'rgba(165,67,250,0.04)' } : {}}
                  >
                    <div className={`h-5 w-5 rounded-md border-2 flex items-center justify-center shrink-0 transition-all ${
                      sel ? 'bg-cw-purple border-cw-purple' : 'border-cw-border'
                    }`}>
                      {sel && <Check className="h-3 w-3 text-white" />}
                    </div>
                    <p className="text-[10px] font-bold text-cw-muted">+</p>
                    <p className={`text-sm font-bold flex-1 ${sel ? 'text-cw-purple' : 'text-cw-muted'}`}>{a.nome}</p>
                    <p className={`text-sm font-black shrink-0 ${sel ? 'text-cw-purple' : 'text-cw-text'}`}>
                      {per.meses === 1 ? fmt(a.preco) : fmt(total)}
                    </p>
                    <div className="text-right shrink-0 w-28">
                      {per.meses > 1 && <p className="text-[9px] text-cw-muted">{fmt(a.preco)}/mês</p>}
                    </div>
                  </button>
                )
              })}
            </div>
          </div>
        </div>

        {/* Coluna lateral — Resultado */}
        <div className="space-y-4">

          {/* Toggle parceiro */}
          <div className="cw-card p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-black text-cw-text">Desconto de parceiro</p>
                <p className="text-[9px] text-cw-muted mt-0.5">{per.descontoParceiro}% off no plano</p>
              </div>
              <button
                onClick={() => setParceiro(v => !v)}
                className={`relative h-6 w-11 rounded-full transition-colors ${parceiro ? 'bg-cw-purple' : 'bg-cw-border'}`}
              >
                <span className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform ${parceiro ? 'translate-x-5' : 'translate-x-0.5'}`} />
              </button>
            </div>
          </div>

          {/* Total card */}
          <div className="cw-card p-5 space-y-4">
            <p className="text-[10px] font-black uppercase tracking-widest text-cw-muted">Total {per.label}</p>

            {totalGeral === 0 ? (
              <div className="text-center py-6">
                <p className="text-4xl font-black text-cw-border">R$ 0,00</p>
                <p className="text-xs text-cw-muted mt-2">Selecione um plano</p>
              </div>
            ) : (
              <>
                <div className="rounded-2xl p-4 text-center" style={{ background: 'linear-gradient(135deg,#A543FA,#7C3AED)' }}>
                  <p className="text-[9px] font-black uppercase tracking-widest text-white/60 mb-1">Total {per.label}</p>
                  <p className="text-4xl font-black text-white">{fmt(totalGeral)}</p>
                </div>

                <div className="rounded-2xl bg-cw-elevated border border-cw-border p-4 text-center">
                  <p className="text-[9px] font-black uppercase tracking-widest text-cw-muted mb-1">Equivalente / mês</p>
                  <p className="text-2xl font-black text-cw-text">{fmt(equivalenteMes)}</p>
                  <p className="text-[9px] text-cw-muted">por mês</p>
                </div>

                {/* Breakdown */}
                <div className="space-y-2 pt-2 border-t border-cw-border">
                  {plano && (
                    <div className="flex justify-between text-xs">
                      <span className="text-cw-muted">{plano.nome}</span>
                      <span className="font-bold text-cw-text">{fmt(precoPlanoComDesconto)}</span>
                    </div>
                  )}
                  {Array.from(addonsSel).map(id => {
                    const a = ADDONS.find(a => a.id === id)!
                    return (
                      <div key={id} className="flex justify-between text-xs">
                        <span className="text-cw-muted">+ {a.nome}</span>
                        <span className="font-bold text-cw-text">{fmt(a.preco * per.meses)}</span>
                      </div>
                    )
                  })}
                  {descParceiro > 0 && (
                    <div className="flex justify-between text-xs pt-1 border-t border-cw-border">
                      <span className="text-green-600 font-bold">Desconto parceiro ({per.descontoParceiro}%)</span>
                      <span className="font-bold text-green-600">-{fmt(descParceiro)}</span>
                    </div>
                  )}
                  {per.descontoMes > 0 && plano && (
                    <div className="flex justify-between text-xs">
                      <span className="text-green-600 font-bold">Desconto fidelidade</span>
                      <span className="font-bold text-green-600">-{fmt(per.descontoMes * per.meses)}</span>
                    </div>
                  )}
                </div>

                {/* Economia */}
                {economiaVsMensal > 0 && (
                  <div className="rounded-xl bg-green-50 border border-green-200 p-3 flex items-center gap-2">
                    <Zap className="h-4 w-4 text-green-600 shrink-0" />
                    <div>
                      <p className="text-[10px] font-black text-green-700">Economia vs mensal</p>
                      <p className="text-sm font-black text-green-600">{fmt(economiaVsMensal)}</p>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>

          {/* Argumento de fechamento */}
          {plano && (
            <div className="cw-card p-4">
              <p className="text-[9px] font-black uppercase tracking-widest text-cw-muted mb-2">💬 Argumento de fechamento</p>
              <p className="text-xs text-cw-text leading-relaxed">
                "No plano <strong className="text-cw-purple">{per.label.toLowerCase()}</strong> você paga{' '}
                <strong className="text-cw-purple">{fmt(equivalenteMes)}/mês</strong>,
                {economiaVsMensal > 0 && ` economizando ${fmt(economiaVsMensal)} no período,`}
                {descParceiro > 0 && ` com ${per.descontoParceiro}% de desconto por ser indicado pelo parceiro,`}
                {' '}podendo pagar no Pix, boleto ou cartão de crédito."
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
