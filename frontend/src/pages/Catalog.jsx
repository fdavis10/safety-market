import { useEffect, useState } from 'react'
import { api } from '../api'
import ServiceCard from '../components/ServiceCard'
import { useLocale } from '../i18n/LocaleContext'

export default function Catalog() {
  const [services, setServices] = useState([])
  const { t, localizeService } = useLocale()

  useEffect(() => {
    api('/api/services/').then(setServices)
  }, [])

  return (
    <section className="section">
      <div className="container">
        <p className="eyebrow">{t('catalog.eyebrow')}</p>
        <h1>{t('catalog.title')}</h1>
        <div className="cards-3">
          {services.map((service) => (
            <ServiceCard key={service.id} service={localizeService(service)} />
          ))}
        </div>
      </div>
    </section>
  )
}
