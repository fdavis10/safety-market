import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { api, money } from '../api'

export default function OrderSuccess() {
  const { id } = useParams()
  const [order, setOrder] = useState(null)
  const [error, setError] = useState('')

  useEffect(() => {
    api(`/api/orders/${id}/`)
      .then(setOrder)
      .catch((err) => setError(err.message))
  }, [id])

  if (error) return <section className="section container">{error}</section>
  if (!order) return <section className="section container">Проверяем оплату…</section>

  return (
    <section className="section">
      <div className="container success">
        <p className="eyebrow">Заказ №{order.id}</p>
        <h1>Оплата прошла</h1>
        <p>
          {order.full_name}, гражданство: {order.citizenship}. Списано с {order.card_brand} •••• {order.card_last4}.
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
          На главную
        </Link>
      </div>
    </section>
  )
}
