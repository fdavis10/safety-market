import { useMemo, useState } from 'react'
import { money } from '../api'
import { useCart } from '../CartContext'
import { packageImage } from '../data/packageImages'

export default function PackageCard({ pack }) {
  const { addPackage } = useCart()
  const cover = packageImage(pack.slug)
  const [route, setRoute] = useState('standard')

  const upgrade = Number(pack.logistics_upgrade || 0)
  const base = Number(pack.price)
  const complex = pack.price_complex != null ? Number(pack.price_complex) : base + upgrade
  const price = useMemo(
    () => (route === 'multimodal' ? complex : base),
    [base, complex, route],
  )

  const services = useMemo(() => {
    const list = pack.services.filter((service) => service.slug !== 'logistics-multimodal')
    return list.map((service) => {
      if (service.slug !== 'logistics-standard') return service
      return {
        ...service,
        name:
          route === 'multimodal'
            ? 'Логистика: Сложный мультимодальный маршрут'
            : 'Логистика: Стандартный маршрут (Прямой или 1 пересадка)',
      }
    })
  }, [pack.services, route])

  return (
    <article className="package-card">
      {pack.payment_terms && <div className="package-payment-note">{pack.payment_terms}</div>}
      <h3>{pack.name}</h3>
      {cover && <img className="package-cover" src={cover} alt="" />}
      <p>{pack.description}</p>
      <ul>
        {services.map((service) => (
          <li key={service.id}>{service.name}</li>
        ))}
      </ul>
      <p className="package-route-label">Выберите тип маршрута</p>
      <div
        className={`package-route-switch ${route === 'multimodal' ? 'is-multimodal' : 'is-standard'}`}
        role="group"
        aria-label="Тип маршрута"
      >
        <span className="package-route-thumb" aria-hidden="true" />
        <button
          type="button"
          className={route === 'standard' ? 'on' : ''}
          onClick={() => setRoute('standard')}
        >
          <span className="package-route-title">Стандартный</span>
          <span className="package-route-hint">прямой / 1 пересадка</span>
        </button>
        <button
          type="button"
          className={route === 'multimodal' ? 'on' : ''}
          onClick={() => setRoute('multimodal')}
        >
          <span className="package-route-title">Сложный</span>
          <span className="package-route-hint">мультимодальный</span>
        </button>
      </div>
      <div className="card-footer">
        <strong>{money(price)}</strong>
        <button type="button" className="btn btn-gold" onClick={() => addPackage(pack.id, route)}>
          В корзину
        </button>
      </div>
    </article>
  )
}
