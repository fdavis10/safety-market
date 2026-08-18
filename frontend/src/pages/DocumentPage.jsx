import { useEffect, useState } from 'react'
import { api } from '../api'

export default function DocumentPage({ kind }) {
  const [site, setSite] = useState(null)

  useEffect(() => {
    api('/api/site/').then(setSite)
  }, [])

  const title = kind === 'rules' ? 'Правила' : 'Публичная оферта'
  const text = site ? (kind === 'rules' ? site.rules : site.offer) : ''

  return (
    <section className="section">
      <div className="container document">
        <p className="eyebrow">Документы</p>
        <h1>{title}</h1>
        <pre>{text || 'Загрузка…'}</pre>
      </div>
    </section>
  )
}
