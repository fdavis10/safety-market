import { money } from '../api'
import { useCart } from '../CartContext'
import { packageImage } from '../data/packageImages'

export default function PackageCard({ pack }) {
  const { addPackage } = useCart()
  const cover = packageImage(pack.slug)

  return (
    <article className={`package-card ${pack.is_featured ? 'featured' : ''}`}>
      <div className="badge-row">
        {pack.payment_badges.map((badge) => (
          <span key={badge.label} className={`pay-badge ${badge.tone}`}>
            {badge.label}
          </span>
        ))}
      </div>
      <h3>{pack.name}</h3>
      {cover && <img className="package-cover" src={cover} alt="" />}
      <p>{pack.description}</p>
      <ul>
        {pack.services.map((service) => (
          <li key={service.id}>{service.name}</li>
        ))}
      </ul>
      <div className="payment-terms">{pack.payment_terms}</div>
      <div className="card-footer">
        <strong>{money(pack.price)}</strong>
        <button type="button" className="btn btn-gold" onClick={() => addPackage(pack.id)}>
          В корзину
        </button>
      </div>
    </article>
  )
}
