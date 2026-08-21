import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { api } from '../api'
import Logo from '../components/Logo'
import { activityImages } from '../data/activityImages'
import { useLocale } from '../i18n/LocaleContext'
import { getDefaultSite } from '../i18n/content'

export default function Home() {
  const { t, lang, localizeSite } = useLocale()
  const [site, setSite] = useState(() => getDefaultSite(lang))
  const covers = activityImages(lang)

  useEffect(() => {
    setSite(getDefaultSite(lang))
    api('/api/site/')
      .then((data) => setSite(data))
      .catch(() => {})
  }, [lang])

  const localized = localizeSite(site)

  return (
    <>
      <section className="hero">
        <div className="container hero-grid">
          <div>
            <h1>{localized.tagline}</h1>
            <p className="lead">{localized.description}</p>
            <div className="hero-actions">
              <Link to="/services" className="btn btn-gold" viewTransition>
                {t('home.orderService')}
              </Link>
              <Link to="/packages" className="btn btn-ghost" viewTransition>
                {t('home.packages')}
              </Link>
            </div>
          </div>
          <div className="hero-panel">
            <Logo />
            <blockquote>{localized.mission}</blockquote>
            <div className="hero-stats">
              <div>
                <b>13</b>
                <span>{t('home.stats.services')}</span>
              </div>
              <div>
                <b>3</b>
                <span>{t('home.stats.packages')}</span>
              </div>
              <div>
                <b>24/7</b>
                <span>{t('home.stats.concierge')}</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <h2>{t('home.activityTitle')}</h2>
          <div className="activity-grid">
            {localized.activity.map((item, index) => (
              <article key={item} className={`activity-card ${covers[index] ? 'has-cover' : ''}`}>
                {covers[index] ? (
                  <img
                    className="cover"
                    src={covers[index]}
                    alt=""
                    loading={index === 0 ? 'eager' : 'lazy'}
                    decoding="async"
                    fetchPriority={index === 0 ? 'high' : 'auto'}
                  />
                ) : null}
                <p>{item}</p>
              </article>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
