let csrf = ''
let csrfPromise = null

export function ensureCsrf() {
  if (csrf) return Promise.resolve(csrf)
  if (!csrfPromise) {
    csrfPromise = fetch('/api/csrf/', { credentials: 'include' })
      .then(() => {
        const match = document.cookie.match(/csrftoken=([^;]+)/)
        csrf = match ? decodeURIComponent(match[1]) : ''
        return csrf
      })
      .finally(() => {
        csrfPromise = null
      })
  }
  return csrfPromise
}

function flattenError(data) {
  if (!data) return 'Не удалось выполнить запрос.'
  if (typeof data.detail === 'string') return data.detail
  if (Array.isArray(data.detail)) return data.detail.join(' ')
  const parts = Object.entries(data)
    .filter(([key]) => key !== 'detail')
    .flatMap(([, value]) => (Array.isArray(value) ? value : [value]))
    .map(String)
  return parts.join(' ') || 'Проверьте форму и попробуйте снова.'
}

export async function api(path, { method = 'GET', body } = {}) {
  const isSafe = method === 'GET' || method === 'HEAD' || method === 'OPTIONS'
  if (!isSafe || !csrf) await ensureCsrf()
  const headers = {
    'Content-Type': 'application/json',
  }
  if (csrf) headers['X-CSRFToken'] = csrf
  const response = await fetch(path, {
    method,
    credentials: 'include',
    headers,
    body: body ? JSON.stringify(body) : undefined,
  })
  const data = await response.json().catch(() => ({}))
  if (!response.ok) {
    throw new Error(flattenError(data))
  }
  return data
}

export const money = (value) =>
  new Intl.NumberFormat('ru-RU', {
    style: 'currency',
    currency: 'RUB',
    maximumFractionDigits: 0,
  }).format(Number(value || 0))
