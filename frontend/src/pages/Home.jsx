import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { api } from '../api'
import Logo from '../components/Logo'
import logoMark from '../assets/logo.png'
import searchImg from '../assets/activity/searching.png'
import auditImg from '../assets/activity/auditdocuments.png'
import logisticImg from '../assets/activity/world_logistic.png'
import adaptImg from '../assets/activity/adaptaion.png'
import { useLocale } from '../i18n/LocaleContext'

const ACTIVITY_IMAGES = [searchImg, auditImg, logisticImg, adaptImg]

export default function Home() {
  const [site, setSite] = useState(null)
  const { t, localizeSite } = useLocale()

  useEffect(() => {
    api('/api/site/').then(setSite)
  }, [])

  if (!site) return <div className="container section">{t('home.loading')}</div>

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
              <article key={item} className={`activity-card ${ACTIVITY_IMAGES[index] ? 'has-cover' : ''}`}>
                {ACTIVITY_IMAGES[index] ? (
                  <img className="cover" src={ACTIVITY_IMAGES[index]} alt="" />
                ) : (
                  <img className="mark" src={logoMark} alt="" />
                )}
                <p>{item}</p>
              </article>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
