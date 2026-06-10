import { useState, useEffect, useCallback } from 'react'
import type { Lead, Meta, SDR, LeadStatus } from '../types'
import {
  fetchLeads, addLead, updateLead, deleteLead, fetchMeta, updateMeta,
  loadLeadsLocal, saveLeadsLocal, loadMetaLocal, saveMetaLocal,
} from '../lib/sheets'

const USE_SHEETS = !!import.meta.env.VITE_SHEETS_URL

function newId() {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`
}

export function useLeads() {
  const [leads, setLeads] = useState<Lead[]>([])
  const [meta, setMeta] = useState<Meta>({ metaTotal: 258, eqlsGabrielly: 0, eqlsThais: 0 })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const reload = useCallback(async () => {
    try {
      setLoading(true)
      if (USE_SHEETS) {
        const [l, m] = await Promise.all([fetchLeads(), fetchMeta()])
        setLeads(l)
        setMeta(m)
      } else {
        setLeads(loadLeadsLocal())
        setMeta(loadMetaLocal())
      }
      setError(null)
    } catch (e) {
      setError((e as Error).message)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { void reload() }, [reload])

  const addNewLead = useCallback(async (data: Omit<Lead, 'id'>) => {
    if (USE_SHEETS) {
      const created = await addLead(data)
      setLeads(prev => [created, ...prev])
    } else {
      const created: Lead = { ...data, id: newId() }
      const next = [created, ...leads]
      setLeads(next)
      saveLeadsLocal(next)
    }
  }, [leads])

  const moveLead = useCallback(async (id: string, status: LeadStatus) => {
    const updated = leads.map(l =>
      l.id === id ? { ...l, status, dataUltimoContato: new Date().toISOString().slice(0, 10) } : l
    )
    setLeads(updated)
    if (USE_SHEETS) {
      const lead = updated.find(l => l.id === id)!
      await updateLead(lead)
    } else {
      saveLeadsLocal(updated)
    }
  }, [leads])

  const editLead = useCallback(async (lead: Lead) => {
    const updated = leads.map(l => l.id === lead.id ? lead : l)
    setLeads(updated)
    if (USE_SHEETS) {
      await updateLead(lead)
    } else {
      saveLeadsLocal(updated)
    }
  }, [leads])

  const removeLead = useCallback(async (id: string) => {
    const updated = leads.filter(l => l.id !== id)
    setLeads(updated)
    if (USE_SHEETS) {
      await deleteLead(id)
    } else {
      saveLeadsLocal(updated)
    }
  }, [leads])

  const saveMeta = useCallback(async (m: Meta) => {
    setMeta(m)
    if (USE_SHEETS) {
      await updateMeta(m)
    } else {
      saveMetaLocal(m)
    }
  }, [])

  const leadsOf = useCallback((sdr: SDR) => leads.filter(l => l.sdr === sdr), [leads])
  const eqlsOf = useCallback((sdr: SDR) => leads.filter(l => l.sdr === sdr && l.status === 'agendado').length, [leads])

  return { leads, meta, loading, error, reload, addNewLead, moveLead, editLead, removeLead, saveMeta, leadsOf, eqlsOf }
}
