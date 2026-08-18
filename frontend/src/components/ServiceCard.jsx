import { money } from '../api'
import { useCart } from '../CartContext'
import { serviceImage } from '../data/serviceImages'

export default function ServiceCard({ service }) {
  const { addService } = useCart()
  const cover = serviceImage(service.slug)

  return (
    <article className={`service-card ${cover ? 'has-cover' : ''}`}>
      {cover && <img className="cover" src={cover} alt="" />}
      <div className="service-body">
        <div className="card-kicker">{service.short_label || service.category_label}</div>
        <h3>{service.name}</h3>
        <p>{service.description}</p>
        <div className="card-footer">
          <strong>{money(service.price)}</strong>
          <button type="button" className="btn btn-navy" onClick={() => addService(service.id)}>
            В корзину
          </button>
        </div>
      </div>
    </article>
  )
}
