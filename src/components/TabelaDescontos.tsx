import { Tag, AlertCircle } from 'lucide-react'
import { DESCONTOS } from '../data/mensagens'

const PERIODO_COLOR: Record<string, string> = {
  Mensal: 'text-orange-400 bg-orange-400/10',
  Trimestral: 'text-blue-400 bg-blue-400/10',
  Semestral: 'text-purple-light bg-purple-DEFAULT/10',
  Anual: 'text-emerald-400 bg-emerald-400/10',
}

export default function TabelaDescontos() {
  return (
    <div className="space-y-4">
      <div className="card p-5">
        <div className="flex items-center gap-2 mb-4">
          <Tag className="h-4 w-4 text-purple-light" />
          <p className="font-black text-text-primary">Descontos por Fidelidade</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {DESCONTOS.map(d => (
            <div key={d.periodo} className="rounded-2xl border border-[#2D2A45] p-4 text-center">
              <p className="text-[10px] font-black uppercase tracking-widest text-text-muted mb-2">{d.periodo}</p>
              <p className={`text-3xl font-black ${PERIODO_COLOR[d.periodo]?.split(' ')[0]}`}>{d.desconto.split(' ')[0]}</p>
              {d.desconto.includes(' ') && (
                <p className="text-xs text-text-muted mt-0.5">{d.desconto.split(' ').slice(1).join(' ')}</p>
              )}
              {d.obs && <p className="text-[10px] text-text-muted mt-2 italic">{d.obs}</p>}
            </div>
          ))}
        </div>

        <div className="mt-4 flex items-start gap-2 rounded-xl bg-amber-500/5 border border-amber-500/20 p-3">
          <AlertCircle className="h-4 w-4 text-amber-400 shrink-0 mt-0.5" />
          <p className="text-xs text-amber-200 leading-relaxed">
            <strong>Atenção:</strong> O desconto se aplica <strong>somente ao plano</strong>, não é válido para módulos adicionais.
          </p>
        </div>
      </div>

      {/* Referência rápida de objeção */}
      <div className="card p-5">
        <p className="text-[10px] font-black uppercase tracking-widest text-text-muted mb-3">Argumento de fechamento (Dia 6)</p>
        <div className="bg-[#0F0E17] border border-[#2D2A45] rounded-xl p-4">
          <p className="text-sm text-text-primary leading-relaxed italic">
            "…saiba que você tem até <strong className="text-purple-light">15% de desconto</strong> na contratação de qualquer plano da Cardápio Web
            por ter sido indicado por nosso parceiro <strong className="text-purple-light">{'{{onParceiro}}'}</strong>!"
          </p>
        </div>
        <p className="text-[11px] text-text-muted mt-2">* Usar este argumento a partir do Dia 5 quando necessário</p>
      </div>
    </div>
  )
}
