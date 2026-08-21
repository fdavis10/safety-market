import { useEffect, useState } from 'react'
import { api } from '../api'
import { useLocale } from '../i18n/LocaleContext'

const TITLES = {
  rules: 'docs.rules',
  offer: 'docs.offer',
  privacy: 'docs.privacy',
}

export default function DocumentPage({ kind }) {
  const [site, setSite] = useState(null)
  const { t, localizeSite } = useLocale()

  useEffect(() => {
    api('/api/site/').then(setSite)
  }, [])

  const localized = localizeSite(site)
  const title = t(TITLES[kind] || 'docs.rules')
  const text = localized?.[kind] || ''

  return (
    <section className="section">
      <div className="container document">
        <p className="eyebrow">{t('docs.eyebrow')}</p>
        <h1>{title}</h1>
        <pre>{text || t('docs.loading')}</pre>
      </div>
    </section>
  )
}
