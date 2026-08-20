import { useState } from 'react'
import { money } from '../api'
import { useCart } from '../CartContext'
import { serviceImage } from '../data/serviceImages'

const PAYMENT_OPTIONS = [
  { id: '50', title: '50%', hint: 'предоплата' },
  { id: '90', title: '90%', hint: 'предоплата' },
  { id: 'post', title: 'Постоплата', hint: 'без аванса' },
]

const UNIFIED_PAYMENT_TOAST = 'Выберите единый тип оплаты на всех услугах'

function priceForPayment(service, paymentType) {
  const prices = service.prices || {}
  const value = prices[paymentType]
  if (value != null && value !== '') return Number(value)
  return Number(service.price)
}

export default function ServiceCard({ service }) {
  const { addService, cart, servicePayment, setServicePayment, setToast } = useCart()
  const cover = serviceImage(service.slug)
  const [localPayment, setLocalPayment] = useState(null)

  const servicesInCart = cart.items.filter((item) => item.kind === 'service').length
  const unlocked = Boolean(localPayment)
  const displayPrice = unlocked ? priceForPayment(service, localPayment) : null

  async function handleAdd() {
    if (!localPayment) return

    if (servicesInCart >= 1 && servicePayment && localPayment !== servicePayment) {
      setToast(UNIFIED_PAYMENT_TOAST)
      return
    }

    if (!servicePayment) setServicePayment(localPayment)
    await addService(service, localPayment)
  }

  return (
    <article className={`service-card ${cover ? 'has-cover' : ''}`}>
      {cover && <img className="cover" src={cover} alt="" />}
      <div className="service-body">
        <div className="card-kicker">{service.short_label || service.category_label}</div>
        <h3>{service.name}</h3>
        <p>{service.description}</p>
        <p className="service-pay-label">Выберите тип оплаты</p>
        <div
          className={`service-pay-switch ${unlocked ? `is-${localPayment}` : 'is-empty'}${servicePayment ? ' is-locked' : ''}`}
          role="group"
          aria-label="Тип оплаты"
        >
          <span className="service-pay-thumb" aria-hidden="true" />
          {PAYMENT_OPTIONS.map((option) => (
            <button
              key={option.id}
              type="button"
              className={unlocked && localPayment === option.id ? 'on' : ''}
              onClick={() => setLocalPayment(option.id)}
            >
              <span className="service-pay-title">{option.title}</span>
              <span className="service-pay-hint">{option.hint}</span>
            </button>
          ))}
        </div>
        <div className="card-footer">
          <strong className={unlocked ? '' : 'is-hidden-price'}>
            {unlocked ? money(displayPrice) : '—'}
          </strong>
          <button
            type="button"
            className="btn btn-navy"
            disabled={!unlocked}
            onClick={handleAdd}
          >
            В корзину
          </button>
        </div>
      </div>
    </article>
  )
}
