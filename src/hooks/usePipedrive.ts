import { useState, useEffect } from 'react'
import { fetchWonDeals, PIPEDRIVE_TOKEN } from '../lib/pipedrive'
import type { PipedriveDeal } from '../lib/pipedrive'

export function usePipedriveGanhos() {
  const [deals, setDeals] = useState<PipedriveDeal[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const hoje = new Date()
  const year = hoje.getFullYear()
  const month = hoje.getMonth() + 1

  async function load() {
    if (!PIPEDRIVE_TOKEN) return
    setLoading(true)
    setError(null)
    try {
      const data = await fetchWonDeals(year, month)
      setDeals(data)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Erro ao buscar Pipedrive')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [])

  const deGabrielly = deals.filter(d => d.sdr === 'Gabrielly')
  const deThais = deals.filter(d => d.sdr === 'Thais')

  return {
    deals,
    loading,
    error,
    reload: load,
    hasToken: !!PIPEDRIVE_TOKEN,
    deGabrielly,
    deThais,
    receitaGabrielly: deGabrielly.reduce((s, d) => s + d.value, 0),
    receitaThais: deThais.reduce((s, d) => s + d.value, 0),
    total: deals.length,
    receitaTotal: deals.reduce((s, d) => s + d.value, 0),
    totalParceria: deals.filter(d => d.isIndicacaoParceria).length,
  }
}
