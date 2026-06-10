/**
 * Google Apps Script — Backend para o Dashboard de Parcerias
 *
 * Como configurar:
 * 1. Abra sua planilha Google Sheets
 * 2. Extensions > Apps Script
 * 3. Cole este código substituindo o conteúdo atual
 * 4. Salve (Ctrl+S)
 * 5. Clique em "Deploy" > "New deployment"
 * 6. Tipo: Web app
 * 7. Execute as: Me
 * 8. Who has access: Anyone
 * 9. Clique Deploy e copie a URL gerada
 * 10. Cole em .env como VITE_SHEETS_URL=<url>
 *
 * Estrutura da planilha:
 * - Aba "Leads": ID | Nome | Empresa | Parceiro | Telefone | SDR | Status | DataEntrada | DataUltimoContato | Observacao
 * - Aba "Meta": Chave | Valor (linhas: metaTotal | eqlsGabrielly | eqlsThais)
 */

const SHEET_LEADS = 'Leads'
const SHEET_META = 'Meta'
const HEADERS = ['id','nome','empresa','parceiro','telefone','sdr','status','dataEntrada','dataUltimoContato','observacao']

function getSpreadsheet() {
  return SpreadsheetApp.getActiveSpreadsheet()
}

function getLeadsSheet() {
  const ss = getSpreadsheet()
  let sheet = ss.getSheetByName(SHEET_LEADS)
  if (!sheet) {
    sheet = ss.insertSheet(SHEET_LEADS)
    sheet.appendRow(HEADERS)
  }
  return sheet
}

function getMetaSheet() {
  const ss = getSpreadsheet()
  let sheet = ss.getSheetByName(SHEET_META)
  if (!sheet) {
    sheet = ss.insertSheet(SHEET_META)
    sheet.appendRow(['metaTotal', 258])
    sheet.appendRow(['eqlsGabrielly', 0])
    sheet.appendRow(['eqlsThais', 0])
  }
  return sheet
}

function rowToLead(row) {
  return {
    id: String(row[0]),
    nome: String(row[1] || ''),
    empresa: String(row[2] || ''),
    parceiro: String(row[3] || ''),
    telefone: String(row[4] || ''),
    sdr: String(row[5] || ''),
    status: String(row[6] || 'dia1'),
    dataEntrada: String(row[7] || ''),
    dataUltimoContato: String(row[8] || ''),
    observacao: String(row[9] || ''),
  }
}

function doGet(e) {
  const action = e.parameter.action
  const data = e.parameter.data ? JSON.parse(e.parameter.data) : {}
  let result

  try {
    switch (action) {
      case 'getLeads':    result = getLeads(); break
      case 'addLead':     result = addLead(data); break
      case 'updateLead':  result = updateLead(data); break
      case 'deleteLead':  result = deleteLead(data.id); break
      case 'getMeta':     result = getMeta(); break
      case 'updateMeta':  result = updateMeta(data); break
      default:            result = { error: 'Unknown action' }
    }
  } catch(err) {
    result = { error: err.message }
  }

  return ContentService
    .createTextOutput(JSON.stringify(result))
    .setMimeType(ContentService.MimeType.JSON)
}

function getLeads() {
  const sheet = getLeadsSheet()
  const data = sheet.getDataRange().getValues()
  if (data.length <= 1) return []
  return data.slice(1).filter(r => r[0]).map(rowToLead)
}

function addLead(lead) {
  const sheet = getLeadsSheet()
  const id = Date.now() + '-' + Math.random().toString(36).slice(2,7)
  const row = [id, lead.nome, lead.empresa, lead.parceiro, lead.telefone, lead.sdr, lead.status, lead.dataEntrada, lead.dataUltimoContato, lead.observacao]
  sheet.appendRow(row)
  return { ...lead, id }
}

function updateLead(lead) {
  const sheet = getLeadsSheet()
  const data = sheet.getDataRange().getValues()
  for (let i = 1; i < data.length; i++) {
    if (String(data[i][0]) === String(lead.id)) {
      sheet.getRange(i + 1, 1, 1, HEADERS.length).setValues([[
        lead.id, lead.nome, lead.empresa, lead.parceiro, lead.telefone,
        lead.sdr, lead.status, lead.dataEntrada, lead.dataUltimoContato, lead.observacao,
      ]])
      return { ok: true }
    }
  }
  return { error: 'Lead not found' }
}

function deleteLead(id) {
  const sheet = getLeadsSheet()
  const data = sheet.getDataRange().getValues()
  for (let i = 1; i < data.length; i++) {
    if (String(data[i][0]) === String(id)) {
      sheet.deleteRow(i + 1)
      return { ok: true }
    }
  }
  return { error: 'Lead not found' }
}

function getMeta() {
  const sheet = getMetaSheet()
  const data = sheet.getDataRange().getValues()
  const obj = {}
  data.forEach(r => { obj[r[0]] = Number(r[1]) || 0 })
  return {
    metaTotal: obj.metaTotal || 258,
    eqlsGabrielly: obj.eqlsGabrielly || 0,
    eqlsThais: obj.eqlsThais || 0,
  }
}

function updateMeta(meta) {
  const sheet = getMetaSheet()
  const keys = ['metaTotal','eqlsGabrielly','eqlsThais']
  const data = sheet.getDataRange().getValues()
  keys.forEach(key => {
    const idx = data.findIndex(r => r[0] === key)
    if (idx >= 0) {
      sheet.getRange(idx + 1, 2).setValue(meta[key])
    } else {
      sheet.appendRow([key, meta[key]])
    }
  })
  return { ok: true }
}
