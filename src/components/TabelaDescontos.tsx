import { Tag, AlertCircle } from 'lucide-react'
import { DESCONTOS } from '../data/mensagens'

const PERIODO_STYLE: Record<string, { color: string; bg: string }> = {
  Mensal:      { color: '#FB923C', bg: 'rgba(251,146,60,0.1)' },
  Trimestral:  { color: '#60A5FA', bg: 'rgba(96,165,250,0.1)' },
  Semestral:   { color: '#A78BFA', bg: 'rgba(167,139,250,0.1)' },
  Anual:       { color: '#34D399', bg: 'rgba(52,211,153,0.1)' },
}

export default function TabelaDescontos() {
  return (
    <div className="space-y-4">
      <div className="card p-6">
        <div className="flex items-center gap-2 mb-5">
          <div className="h-8 w-8 rounded-xl gradient-cw flex items-center justify-center">
            <Tag className="h-4 w-4 text-white" />
          </div>
          <div>
            <p className="font-black text-white">Descontos por Fidelidade</p>
            <p className="text-[10px] text-purple-300/50">Válido apenas no plano, não inclui módulos</p>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {DESCONTOS.map(d => {
            const style = PERIODO_STYLE[d.periodo] ?? { color: '#A78BFA', bg: 'rgba(167,139,250,0.1)' }
            return (
              <div key={d.periodo} className="rounded-2xl border border-[#2E2550] p-5 text-center relative overflow-hidden">
                <div className="absolute inset-0 opacity-30" style={{ background: style.bg }} />
                <div className="relative">
                  <p className="text-[10px] font-black uppercase tracking-widest text-purple-300/50 mb-2">{d.periodo}</p>
                  <p className="text-4xl font-black" style={{ color: style.color }}>{d.desconto.split(' ')[0]}</p>
                  {d.desconto.includes(' ') && (
                    <p className="text-[10px] text-purple-300/40 mt-1">{d.desconto.split(' ').slice(1).join(' ')}</p>
                  )}
                  {d.obs && <p className="text-[10px] mt-2 italic" style={{ color: style.color + 'AA' }}>{d.obs}</p>}
                </div>
              </div>
            )
          })}
        </div>

        <div className="mt-4 flex items-start gap-2 rounded-xl px-4 py-3 border" style={{ background: 'rgba(251,146,60,0.05)', borderColor: 'rgba(251,146,60,0.2)' }}>
          <AlertCircle className="h-4 w-4 text-orange-400 shrink-0 mt-0.5" />
          <p className="text-xs text-orange-200/80 leading-relaxed">
            <strong>Atenção:</strong> O desconto se aplica <strong>somente ao plano</strong>. Módulos adicionais não entram no desconto.
          </p>
        </div>
      </div>

      <div className="card p-5">
        <p className="text-[10px] font-black uppercase tracking-widest text-purple-400 mb-3">Argumento de fechamento — Dia 6</p>
        <div className="bg-[#120E1E] border border-[#2E2550] rounded-xl p-4">
          <p className="text-sm text-white/80 leading-relaxed italic">
            "…saiba que você tem até <strong className="text-purple-300">15% de desconto</strong> na contratação de qualquer plano da Cardápio Web
            por ter sido indicado por nosso parceiro <strong className="text-purple-300">{'{{onParceiro}}'}</strong>!"
          </p>
        </div>
        <p className="text-[11px] text-purple-300/30 mt-2">* Usar este argumento a partir do Dia 5 quando necessário</p>
      </div>
    </div>
  )
}
