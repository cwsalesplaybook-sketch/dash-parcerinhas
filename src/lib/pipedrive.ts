export const PIPEDRIVE_TOKEN = import.meta.env.VITE_PIPEDRIVE_TOKEN as string | undefined

// Campo [QUAL] SDR/BDR
const SDR_FIELD = 'ce39d035fad6c74095053ffe04bdb9bbc9ae2a53'
// Campo [QUAL] Como conheceu a Cardápio Web? (interno)
const COMO_CONHECEU_FIELD = 'd99e4d95cb8baef612eacfe88ae62f0f133becf9'

export const SDR_IDS = { Gabrielly: 1445, Thais: 1556 } as const
export const INDICACAO_PARCERIA_ID = 1212 // "Indicação do Ag. de Parcerias"

export interface PipedriveDeal {
  id: number
  title: string
  value: number
  currency: string
  won_time: string
  owner_name: string
  org_name: string | null
  person_name: string | null
  sdr: 'Gabrielly' | 'Thais' | null
  isIndicacaoParceria: boolean
}

function toNum(v: unknown): number | null {
  if (v === null || v === undefined) return null
  const n = typeof v === 'string' ? parseInt(v, 10) : Number(v)
  return isNaN(n) ? null : n
}

function parseSdr(deal: Record<string, unknown>): 'Gabrielly' | 'Thais' | null {
  const v = toNum(deal[SDR_FIELD])
  if (v === SDR_IDS.Gabrielly) return 'Gabrielly'
  if (v === SDR_IDS.Thais) return 'Thais'
  return null
}

function parseIsIndicacao(deal: Record<string, unknown>): boolean {
  const v = deal[COMO_CONHECEU_FIELD]
  if (Array.isArray(v)) return v.map(toNum).includes(INDICACAO_PARCERIA_ID)
  return toNum(v) === INDICACAO_PARCERIA_ID
}

function mapDeal(d: Record<string, unknown>): PipedriveDeal {
  return {
    id: d.id as number,
    title: d.title as string,
    value: (d.value as number) ?? 0,
    currency: (d.currency as string) ?? 'BRL',
    won_time: d.won_time as string,
    owner_name: (d.user_id as Record<string, unknown>)?.name as string ?? '',
    org_name: (d.org_id as Record<string, unknown> | null)?.name as string ?? null,
    person_name: (d.person_id as Record<string, unknown> | null)?.name as string ?? null,
    sdr: parseSdr(d),
    isIndicacaoParceria: parseIsIndicacao(d),
  }
}

export async function fetchWonDeals(year: number, month: number): Promise<PipedriveDeal[]> {
  if (!PIPEDRIVE_TOKEN) return []

  const monthStr = String(month).padStart(2, '0')
  const targetMonth = `${year}-${monthStr}` // "2026-06"

  const allDeals: Record<string, unknown>[] = []
  let start = 0
  const limit = 500

  // Paginação — busca até não ter mais resultados no mês
  while (true) {
    const url = new URL('https://api.pipedrive.com/v1/deals')
    url.searchParams.set('api_token', PIPEDRIVE_TOKEN)
    url.searchParams.set('pipeline_id', '2')
    url.searchParams.set('status', 'won')
    url.searchParams.set('limit', String(limit))
    url.searchParams.set('start', String(start))
    url.searchParams.set('sort', 'won_time DESC')

    const res = await fetch(url.toString())
    if (!res.ok) throw new Error(`Pipedrive API error: ${res.status}`)
    const json = await res.json() as {
      success: boolean
      data: Record<string, unknown>[] | null
      additional_data?: { pagination?: { more_items_in_collection: boolean } }
    }
    if (!json.success || !json.data || json.data.length === 0) break

    // Verifica se os deals ainda são do mês alvo
    const inMonth = json.data.filter(d => {
      const won = (d.won_time as string | null)?.slice(0, 7)
      return won === targetMonth
    })

    allDeals.push(...inMonth)

    // Se algum deal já saiu do mês ou não há mais páginas, para
    const hasOutOfMonth = json.data.some(d => {
      const won = (d.won_time as string | null)?.slice(0, 7)
      return won !== targetMonth
    })
    const hasMore = json.additional_data?.pagination?.more_items_in_collection ?? false

    if (hasOutOfMonth || !hasMore) break
    start += limit
  }

  // Filtra apenas Gabrielly e Thais
  return allDeals
    .filter(d => parseSdr(d) !== null)
    .map(mapDeal)
}
