import { useEffect, useState } from 'react'
import { api } from '../api'
import ServiceCard from '../components/ServiceCard'

export default function Catalog() {
  const [services, setServices] = useState([])

  useEffect(() => {
    api('/api/services/').then(setServices)
  }, [])

  return (
    <section className="section">
      <div className="container">
        <p className="eyebrow">Каталог</p>
        <h1>Услуги агентства</h1>
        <div className="cards-3">
          {services.map((service) => (
            <ServiceCard key={service.id} service={service} />
          ))}
        </div>
      </div>
    </section>
  )
}
