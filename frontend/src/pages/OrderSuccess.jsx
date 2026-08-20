import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { api } from '../api'
import { useLocale } from '../i18n/LocaleContext'

export default function OrderSuccess() {
  const { id } = useParams()
  const [order, setOrder] = useState(null)
  const [error, setError] = useState('')
  const { t, money } = useLocale()

  useEffect(() => {
    api(`/api/orders/${id}/`)
      .then(setOrder)
      .catch((err) => setError(err.message))
  }, [id])

  if (error) return <section className="section container">{error}</section>
  if (!order) return <section className="section container">{t('order.checking')}</section>

  return (
    <section className="section">
      <div className="container success">
        <p className="eyebrow">
          {t('cart.eyebrow')} №{order.id}
        </p>
        <h1>{t('order.paid')}</h1>
        <p>
          {t('order.meta', {
            name: order.full_name,
            citizenship: order.citizenship,
            brand: order.card_brand,
            last4: order.card_last4,
          })}
        </p>
        <ul>
          {order.items.map((item) => (
            <li key={item.name}>
              {item.name} × {item.quantity} — {money(item.price)}
            </li>
          ))}
        </ul>
        <p className="total">{money(order.total)}</p>
        <Link to="/" className="btn btn-navy" viewTransition>
          {t('order.home')}
        </Link>
      </div>
    </section>
  )
}
