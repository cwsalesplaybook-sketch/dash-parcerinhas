import { useState } from 'react'
import { X } from 'lucide-react'
import type { Lead, SDR } from '../types'

interface Props {
  sdr: SDR
  onClose: () => void
  onAdd: (lead: Omit<Lead, 'id'>) => Promise<void>
}

export default function AddLeadModal({ sdr, onClose, onAdd }: Props) {
  const [form, setForm] = useState({ nome: '', empresa: '', parceiro: '', telefone: '', observacao: '' })
  const [saving, setSaving] = useState(false)

  const today = new Date().toISOString().slice(0, 10)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!form.nome.trim()) return
    setSaving(true)
    try {
      await onAdd({ ...form, sdr, status: 'dia1', dataEntrada: today, dataUltimoContato: today })
      onClose()
    } finally {
      setSaving(false)
    }
  }

  function field(key: keyof typeof form, label: string, placeholder: string, required = false) {
    return (
      <div>
        <label className="text-[10px] font-bold uppercase tracking-widest text-purple-300/50 block mb-1.5">{label}{required && ' *'}</label>
        <input
          className="w-full bg-[#120E1E] border border-[#2E2550] rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:border-purple-500 placeholder:text-purple-300/25 transition-colors"
          placeholder={placeholder}
          value={form[key]}
          onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))}
          required={required}
        />
      </div>
    )
  }

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="card w-full max-w-md p-6 shadow-2xl" style={{ boxShadow: '0 25px 60px rgba(124,58,237,0.3)' }}>
        <div className="flex items-center justify-between mb-5">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-purple-400 mb-0.5">Carteira de {sdr}</p>
            <h2 className="text-lg font-black text-white">Adicionar Lead</h2>
          </div>
          <button onClick={onClose} className="h-8 w-8 rounded-lg hover:bg-[#2E2550] flex items-center justify-center transition-colors text-purple-300/50">
            <X className="h-4 w-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3.5">
          {field('nome', 'Nome do lead', 'Ex: João Silva', true)}
          {field('empresa', 'Estabelecimento', 'Ex: Burguer House')}
          {field('parceiro', 'Parceiro (indicação)', 'Ex: Agência X')}
          {field('telefone', 'WhatsApp', '(11) 99999-0000')}
          <div>
            <label className="text-[10px] font-bold uppercase tracking-widest text-purple-300/50 block mb-1.5">Observação</label>
            <textarea
              className="w-full bg-[#120E1E] border border-[#2E2550] rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:border-purple-500 placeholder:text-purple-300/25 resize-none transition-colors"
              placeholder="Anotações..."
              rows={3}
              value={form.observacao}
              onChange={e => setForm(f => ({ ...f, observacao: e.target.value }))}
            />
          </div>
          <div className="pt-2 flex gap-3">
            <button type="button" onClick={onClose} className="flex-1 py-2.5 rounded-xl border border-[#2E2550] text-sm text-purple-300/50 hover:text-purple-200 transition-colors">
              Cancelar
            </button>
            <button
              type="submit"
              disabled={saving || !form.nome.trim()}
              className="flex-1 py-2.5 rounded-xl text-white text-sm font-bold disabled:opacity-50 transition-all"
              style={{ background: 'linear-gradient(135deg,#7C3AED,#9333EA)' }}
            >
              {saving ? 'Salvando...' : 'Adicionar no Dia 1'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
