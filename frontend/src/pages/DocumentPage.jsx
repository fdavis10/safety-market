import { useEffect, useState } from 'react'
import { api } from '../api'
import { getDefaultSite } from '../i18n/content'
import { useLocale } from '../i18n/LocaleContext'

const TITLES = {
  rules: 'docs.rules',
  offer: 'docs.offer',
  privacy: 'docs.privacy',
}

export default function DocumentPage({ kind }) {
  const { t, lang, localizeSite } = useLocale()
  const [site, setSite] = useState(() => getDefaultSite(lang))

  useEffect(() => {
    setSite(getDefaultSite(lang))
    api('/api/site/')
      .then(setSite)
      .catch(() => {})
  }, [lang])

  const localized = localizeSite(site)
  const title = t(TITLES[kind] || 'docs.rules')
  const text = localized?.[kind] || ''

  return (
    <section className="section">
      <div className="container document">
        <p className="eyebrow">{t('docs.eyebrow')}</p>
        <h1>{title}</h1>
        <pre>{text}</pre>
      </div>
    </section>
  )
}
