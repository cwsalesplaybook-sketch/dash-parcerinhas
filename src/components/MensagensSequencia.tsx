import { useState } from 'react'
import { Copy, Check } from 'lucide-react'
import { SEQUENCIA } from '../data/mensagens'

export default function MensagensSequencia() {
  const [copied, setCopied] = useState<string|null>(null)
  const [active, setActive] = useState(0)
  const [nome, setNome] = useState('')
  const [salesman, setSalesman] = useState('')
  const [parceiro, setParceiro] = useState('')

  function fill(text: string) {
    return text
      .replace(/\{\{firstName\}\}/g, nome || '{{firstName}}')
      .replace(/\{\{salesman\}\}/g, salesman || '{{salesman}}')
      .replace(/\{\{onParceiro\}\}/g, parceiro || '{{onParceiro}}')
  }

  async function copy(text: string, key: string) {
    await navigator.clipboard.writeText(fill(text))
    setCopied(key); setTimeout(() => setCopied(null), 2000)
  }

  const msg = SEQUENCIA[active]

  return (
    <div className="space-y-4">
      {/* Personalizar variáveis */}
      <div className="cw-card p-5">
        <p className="text-[10px] font-bold uppercase tracking-widest text-cw-muted mb-3">Personalizar mensagem (opcional)</p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {[
            { key: 'nome', label: 'Nome do lead', val: nome, set: setNome, ph: 'Ex: João' },
            { key: 'salesman', label: 'Seu nome', val: salesman, set: setSalesman, ph: 'Ex: Gabrielly' },
            { key: 'parceiro', label: 'Parceiro', val: parceiro, set: setParceiro, ph: 'Ex: Agência X' },
          ].map(({ key, label, val, set, ph }) => (
            <div key={key}>
              <label className="text-[10px] font-bold uppercase tracking-widest text-cw-muted block mb-1">{label}</label>
              <input
                className="w-full bg-cw-bg border border-cw-border rounded-xl px-3 py-2 text-sm text-cw-text focus:outline-none focus:border-cw-purple placeholder:text-cw-muted/40 transition-colors"
                placeholder={ph} value={val} onChange={e => set(e.target.value)}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Tabs de dias */}
      <div className="flex gap-1.5 flex-wrap">
        {SEQUENCIA.map((s, i) => (
          <button key={i} onClick={() => setActive(i)}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${active === i ? 'gradient-primary text-white shadow-md' : 'bg-cw-surface border border-cw-border text-cw-muted hover:text-cw-purple hover:border-cw-purple'}`}>
            Dia {s.dia}
          </button>
        ))}
      </div>

      {/* Conteúdo */}
      <div className="cw-card p-5 space-y-4">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl gradient-primary flex items-center justify-center shrink-0">
            <span className="text-lg font-black text-white">{msg.dia}</span>
          </div>
          <div>
            <p className="font-black text-cw-text">{msg.titulo}</p>
            <p className="text-xs text-cw-muted">{msg.atividades}</p>
          </div>
        </div>

        <div className="rounded-xl bg-amber-50 border border-amber-200 p-4">
          <p className="text-[10px] text-amber-700 font-black uppercase tracking-widest mb-1">Task / Feedback</p>
          <p className="text-sm text-amber-800 leading-relaxed">{msg.task}</p>
        </div>

        {[
          { key: 'comoEsta', label: 'Versão "Como está"', text: msg.msgComoEsta },
          { key: 'atualizacao', label: 'Versão "Atualização"', text: msg.msgAtualizacao },
        ].filter(v => v.text).map(({ key, label, text }) => (
          <div key={key}>
            <div className="flex items-center justify-between mb-2">
              <p className="text-[10px] font-black uppercase tracking-widest text-cw-muted">{label}</p>
              <button onClick={() => copy(text, key)} className="flex items-center gap-1 text-xs text-cw-purple hover:text-cw-purple-dark transition-colors font-bold">
                {copied === key ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                {copied === key ? 'Copiado!' : 'Copiar'}
              </button>
            </div>
            <div className="bg-cw-elevated border border-cw-border rounded-xl p-4">
              <p className="text-sm text-cw-text whitespace-pre-wrap leading-relaxed">{fill(text)}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
