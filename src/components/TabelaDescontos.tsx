import { Tag, AlertCircle } from 'lucide-react'
import { DESCONTOS } from '../data/mensagens'

const PERIODO_COLOR: Record<string, string> = {
  Mensal: 'text-orange-600', Trimestral: 'text-blue-600', Semestral: 'text-cw-purple', Anual: 'text-green-600',
}
const PERIODO_BG: Record<string, string> = {
  Mensal: 'bg-orange-50 border-orange-200', Trimestral: 'bg-blue-50 border-blue-200',
  Semestral: 'bg-purple-50 border-purple-200', Anual: 'bg-green-50 border-green-200',
}

export default function TabelaDescontos() {
  return (
    <div className="space-y-4">
      <div className="cw-card p-6">
        <div className="flex items-center gap-2 mb-5">
          <div className="h-8 w-8 rounded-xl gradient-primary flex items-center justify-center">
            <Tag className="h-4 w-4 text-white" />
          </div>
          <div>
            <p className="font-black text-cw-text">Descontos por Fidelidade</p>
            <p className="text-[10px] text-cw-muted">Válido apenas no plano — módulos não entram no desconto</p>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {DESCONTOS.map(d => (
            <div key={d.periodo} className={`rounded-2xl border p-5 text-center ${PERIODO_BG[d.periodo] ?? 'bg-cw-elevated border-cw-border'}`}>
              <p className="text-[10px] font-black uppercase tracking-widest text-cw-muted mb-2">{d.periodo}</p>
              <p className={`text-4xl font-black ${PERIODO_COLOR[d.periodo] ?? 'text-cw-purple'}`}>{d.desconto.split(' ')[0]}</p>
              {d.desconto.includes(' ') && <p className="text-xs text-cw-muted mt-1">{d.desconto.split(' ').slice(1).join(' ')}</p>}
              {d.obs && <p className="text-[10px] text-cw-muted mt-2 italic">{d.obs}</p>}
            </div>
          ))}
        </div>

        <div className="mt-4 flex items-start gap-2 rounded-xl bg-amber-50 border border-amber-200 px-4 py-3">
          <AlertCircle className="h-4 w-4 text-amber-600 shrink-0 mt-0.5" />
          <p className="text-xs text-amber-800 leading-relaxed">
            <strong>Atenção:</strong> O desconto se aplica <strong>somente ao plano</strong>. Módulos adicionais não entram no desconto.
          </p>
        </div>
      </div>

      <div className="cw-card p-5">
        <p className="text-[10px] font-black uppercase tracking-widest text-cw-muted mb-3">Argumento de fechamento — Dia 6</p>
        <div className="bg-cw-elevated border border-cw-border rounded-xl p-4">
          <p className="text-sm text-cw-text leading-relaxed italic">
            "…saiba que você tem até <strong className="text-cw-purple">15% de desconto</strong> na contratação de qualquer plano da Cardápio Web
            por ter sido indicado por nosso parceiro <strong className="text-cw-purple">{'{{onParceiro}}'}</strong>!"
          </p>
        </div>
        <p className="text-[11px] text-cw-muted mt-2">* Usar este argumento a partir do Dia 5 quando necessário</p>
      </div>
    </div>
  )
}
