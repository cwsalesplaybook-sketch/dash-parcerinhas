import { useState } from 'react'
import { Copy, Check } from 'lucide-react'
import { SEQUENCIA } from '../data/mensagens'

export default function MensagensSequencia() {
  const [copied, setCopied] = useState<string | null>(null)
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
    setCopied(key)
    setTimeout(() => setCopied(null), 2000)
  }

  const msg = SEQUENCIA[active]

  return (
    <div className="space-y-4">
      {/* Preenchimento de variáveis */}
      <div className="card p-5">
        <p className="text-[10px] font-bold uppercase tracking-widest text-text-muted mb-3">Personalizar mensagem (opcional)</p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {[
            { key: 'nome', label: 'Nome do lead', val: nome, set: setNome, ph: 'Ex: João' },
            { key: 'salesman', label: 'Seu nome (SDR)', val: salesman, set: setSalesman, ph: 'Ex: Gabrielly' },
            { key: 'parceiro', label: 'Parceiro', val: parceiro, set: setParceiro, ph: 'Ex: Agência X' },
          ].map(({ key, label, val, set, ph }) => (
            <div key={key}>
              <label className="text-[10px] font-bold uppercase tracking-widest text-text-muted block mb-1">{label}</label>
              <input
                className="w-full bg-[#0F0E17] border border-[#2D2A45] rounded-xl px-3 py-2 text-sm text-text-primary focus:outline-none focus:border-purple-DEFAULT placeholder:text-text-muted/50 transition-colors"
                placeholder={ph}
                value={val}
                onChange={e => set(e.target.value)}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Tabs de dias */}
      <div className="flex gap-1.5 flex-wrap">
        {SEQUENCIA.map((s, i) => (
          <button
            key={i}
            onClick={() => setActive(i)}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${active === i ? 'bg-purple-DEFAULT text-white' : 'bg-[#1A1828] border border-[#2D2A45] text-text-muted hover:text-text-primary'}`}
          >
            Dia {s.dia}
          </button>
        ))}
      </div>

      {/* Conteúdo do dia */}
      <div className="card p-5 space-y-4">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-purple-DEFAULT/20 flex items-center justify-center">
            <span className="text-lg font-black text-purple-light">{msg.dia}</span>
          </div>
          <div>
            <p className="font-black text-text-primary">{msg.titulo}</p>
            <p className="text-xs text-text-muted">{msg.atividades}</p>
          </div>
        </div>

        {/* Task */}
        <div className="rounded-xl bg-amber-500/5 border border-amber-500/20 p-4">
          <p className="text-[10px] text-amber-400 font-black uppercase tracking-widest mb-1">Task / Feedback</p>
          <p className="text-sm text-amber-200 leading-relaxed">{msg.task}</p>
        </div>

        {/* Mensagens */}
        {[
          { key: 'comoEsta', label: 'Versão "Como está"', text: msg.msgComoEsta },
          { key: 'atualizacao', label: 'Versão "Atualização"', text: msg.msgAtualizacao },
        ].filter(v => v.text).map(({ key, label, text }) => (
          <div key={key}>
            <div className="flex items-center justify-between mb-2">
              <p className="text-[10px] font-black uppercase tracking-widest text-text-muted">{label}</p>
              <button
                onClick={() => copy(text, key)}
                className="flex items-center gap-1 text-xs text-purple-light hover:text-purple-DEFAULT transition-colors font-bold"
              >
                {copied === key ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                {copied === key ? 'Copiado!' : 'Copiar'}
              </button>
            </div>
            <div className="bg-[#0F0E17] border border-[#2D2A45] rounded-xl p-4">
              <p className="text-sm text-text-primary whitespace-pre-wrap leading-relaxed">{fill(text)}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
