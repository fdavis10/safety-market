import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { api } from '../api'
import Logo from '../components/Logo'
import logoMark from '../assets/logo.png'
import searchImg from '../assets/activity/searching.png'
import auditImg from '../assets/activity/auditdocuments.png'
import logisticImg from '../assets/activity/world_logistic.png'
import adaptImg from '../assets/activity/adaptaion.png'

const ACTIVITY_IMAGES = [searchImg, auditImg, logisticImg, adaptImg]

export default function Home() {
  const [site, setSite] = useState(null)

  useEffect(() => {
    api('/api/site/').then(setSite)
  }, [])

  if (!site) return <div className="container section">Загружаем агентство…</div>

  return (
    <>
      <section className="hero">
        <div className="container hero-grid">
          <div>
            <p className="eyebrow">Кадровое агентство</p>
            <h1>
              {site.name}: {site.tagline.toLowerCase()}
            </h1>
            <p className="lead">{site.description}</p>
            <div className="hero-actions">
              <Link to="/services" className="btn btn-gold" viewTransition>
                Заказать услугу
              </Link>
              <Link to="/packages" className="btn btn-ghost" viewTransition>
                Пакеты под ключ
              </Link>
            </div>
          </div>
          <div className="hero-panel">
            <Logo />
            <blockquote>{site.mission}</blockquote>
            <div className="hero-stats">
              <div>
                <b>12</b>
                <span>услуг в каталоге</span>
              </div>
              <div>
                <b>3</b>
                <span>пакета под ключ</span>
              </div>
              <div>
                <b>24/7</b>
                <span>консьерж после въезда</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <h2>Чем занимается агентство</h2>
          <div className="activity-grid">
            {site.activity.map((item, index) => (
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

      <section className="section alt">
        <div className="container split">
          <div>
            <h2>Три контура сопровождения</h2>
            <p>
              От допуска документов до адаптации на объекте: закрываем юридический, логистический и бытовой контур,
              чтобы работодатель получил готового сотрудника.
            </p>
          </div>
          <ol className="steps">
            <li>
              <strong>Документы, визы и гарантии</strong>
              <span className="step-desc">Аудит, легализация, приглашение и страхование рисков.</span>
            </li>
            <li>
              <strong>Международная логистика</strong>
              <span className="step-desc">Стандартный или мультимодальный маршрут и обеспечение в пути.</span>
            </li>
            <li>
              <strong>Сопровождение в РФ</strong>
              <span className="step-desc">Жильё, миграция, язык, экипировка и консьерж.</span>
            </li>
          </ol>
        </div>
      </section>
    </>
  )
}
