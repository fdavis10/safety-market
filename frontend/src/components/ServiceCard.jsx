import { useState } from 'react'
import { useCart } from '../CartContext'
import { serviceImage } from '../data/serviceImages'
import { useLocale } from '../i18n/LocaleContext'

const PAYMENT_IDS = ['50', '90', 'post']

export default function ServiceCard({ service }) {
  const { addService, cart, servicePayment, setServicePayment, setToast } = useCart()
  const { t, money } = useLocale()
  const cover = serviceImage(service.slug)
  const [localPayment, setLocalPayment] = useState(null)

  const servicesInCart = cart.items.filter((item) => item.kind === 'service').length
  const unlocked = Boolean(localPayment)
  const displayPrice = unlocked
    ? Number((service.prices && service.prices[localPayment]) ?? service.price)
    : null

  async function handleAdd() {
    if (!localPayment) return

    if (servicesInCart >= 1 && servicePayment && localPayment !== servicePayment) {
      setToast(t('pay.unified'))
      return
    }

    if (!servicePayment) setServicePayment(localPayment)
    await addService(service, localPayment)
  }

  return (
    <article className={`service-card ${cover ? 'has-cover' : ''}`}>
      {cover && <img className="cover" src={cover} alt="" />}
      <div className="service-body">
        <h3>{service.name}</h3>
        <p>{service.description}</p>
        <p className="service-pay-label">{t('pay.label')}</p>
        <div
          className={`service-pay-switch ${unlocked ? `is-${localPayment}` : 'is-empty'}${servicePayment ? ' is-locked' : ''}`}
          role="group"
          aria-label={t('pay.label')}
        >
          <span className="service-pay-thumb" aria-hidden="true" />
          {PAYMENT_IDS.map((id) => (
            <button
              key={id}
              type="button"
              className={unlocked && localPayment === id ? 'on' : ''}
              onClick={() => setLocalPayment(id)}
            >
              <span className="service-pay-title">{t(`pay.${id}`)}</span>
              <span className="service-pay-hint">{t(`pay.${id}.hint`)}</span>
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
            {t('cart.addService')}
          </button>
        </div>
      </div>
    </article>
  )
}
