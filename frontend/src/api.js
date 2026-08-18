let csrf = ''

export async function ensureCsrf() {
  await fetch('/api/csrf/', { credentials: 'include' })
  const match = document.cookie.match(/csrftoken=([^;]+)/)
  csrf = match ? decodeURIComponent(match[1]) : ''
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
  if (!csrf) await ensureCsrf()
  const response = await fetch(path, {
    method,
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      'X-CSRFToken': csrf,
    },
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
