import { useEffect, useState } from 'react'
import { api } from '../api'
import { useLocale } from '../i18n/LocaleContext'

export default function DocumentPage({ kind }) {
  const [site, setSite] = useState(null)
  const { t, localizeSite } = useLocale()

  useEffect(() => {
    api('/api/site/').then(setSite)
  }, [])

  const localized = localizeSite(site)
  const title = kind === 'rules' ? t('docs.rules') : t('docs.offer')
  const text = localized ? (kind === 'rules' ? localized.rules : localized.offer) : ''

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
