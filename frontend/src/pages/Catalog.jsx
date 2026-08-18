import { useEffect, useMemo, useState } from 'react'
import { api } from '../api'
import ServiceCard from '../components/ServiceCard'

export default function Catalog() {
  const [categories, setCategories] = useState([])
  const [services, setServices] = useState([])
  const [active, setActive] = useState('all')

  useEffect(() => {
    api('/api/categories/').then(setCategories)
    api('/api/services/').then(setServices)
  }, [])

  const visible = useMemo(
    () => (active === 'all' ? services : services.filter((item) => item.category === active)),
    [services, active],
  )

  const grouped = useMemo(() => {
    return categories
      .map((category) => ({
        ...category,
        items: visible.filter((item) => item.category === category.id),
      }))
      .filter((category) => category.items.length)
  }, [categories, visible])

  return (
    <section className="section">
      <div className="container">
        <p className="eyebrow">Каталог</p>
        <h1>Услуги агентства</h1>
        <p className="lead narrow">
          Каждая услуга — отдельная карточка с описанием и стоимостью. Добавляйте нужные позиции в корзину и оформляйте
          заказ с оплатой картой.
        </p>
        <div className="filters">
          <button type="button" className={active === 'all' ? 'chip on' : 'chip'} onClick={() => setActive('all')}>
            Все
          </button>
          {categories.map((category) => (
            <button
              key={category.id}
              type="button"
              className={active === category.id ? 'chip on' : 'chip'}
              onClick={() => setActive(category.id)}
            >
              {category.label}
            </button>
          ))}
        </div>
        {grouped.map((category) => (
          <div key={category.id} className="category-block">
            <h2>{category.label}</h2>
            <div className="cards-3">
              {category.items.map((service) => (
                <ServiceCard key={service.id} service={service} />
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
