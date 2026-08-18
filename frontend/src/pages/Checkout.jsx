import { useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { api, money } from '../api'
import { useCart } from '../CartContext'
import BankCard from '../components/BankCard'
import CountrySelect from '../components/CountrySelect'
import PhoneField from '../components/PhoneField'
import { citizenshipCountries } from '../data/countries'

const COUNTRIES = citizenshipCountries()

const initial = {
  full_name: '',
  email: '',
  phone: '',
  citizenship: '',
  comment: '',
  offer_accepted: false,
  payment_method: 'card',
  card_number: '',
  card_holder: '',
  card_expiry: '',
  card_cvv: '',
}

function formatCard(value) {
  return value.replace(/\D/g, '').slice(0, 19).replace(/(\d{4})(?=\d)/g, '$1 ')
}

function formatExpiry(value) {
  const digits = value.replace(/\D/g, '').slice(0, 4)
  if (digits.length < 3) return digits
  return `${digits.slice(0, 2)}/${digits.slice(2)}`
}

export default function Checkout() {
  const { cart, refresh } = useCart()
  const navigate = useNavigate()
  const [form, setForm] = useState(initial)
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)
  const [flipped, setFlipped] = useState(false)
  const [phoneOk, setPhoneOk] = useState(false)
  const [citizenshipCode, setCitizenshipCode] = useState('')

  const selectedCitizenship = useMemo(
    () => COUNTRIES.find((item) => item.code === citizenshipCode),
    [citizenshipCode],
  )

  function setField(name, value) {
    if (name === 'card_number') value = formatCard(value)
    if (name === 'card_holder') value = value.toUpperCase()
    if (name === 'card_expiry') value = formatExpiry(value)
    if (name === 'card_cvv') value = value.replace(/\D/g, '').slice(0, 4)
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  async function submit(event) {
    event.preventDefault()
    setError('')
    if (!form.citizenship.trim()) {
      setError('Выберите гражданство.')
      return
    }
    if (!phoneOk) {
      setError('Введите действующий телефон выбранной страны.')
      return
    }
    const pan = form.card_number.replace(/\D/g, '')
    if (pan.length < 13) {
      setFlipped(false)
      setError('Введите номер карты полностью.')
      return
    }
    if (!form.card_cvv) {
      setFlipped(true)
      setError('Переверните карту и укажите CVV.')
      return
    }
    setBusy(true)
    try {
      const order = await api('/api/orders/', {
        method: 'POST',
        body: {
          ...form,
          card_number: form.card_number.replace(/\s/g, ''),
        },
      })
      await refresh()
      navigate(`/order/${order.id}`, { viewTransition: true })
    } catch (err) {
      setError(err.message)
    } finally {
      setBusy(false)
    }
  }

  if (!cart.items.length) {
    return (
      <section className="section container">
        <h1>Оформление заказа</h1>
        <p>Сначала добавьте услуги в корзину.</p>
        <Link to="/services" className="btn btn-gold" viewTransition>
          К каталогу
        </Link>
      </section>
    )
  }

  return (
    <section className="section">
      <div className="container checkout-grid">
        <form className="order-form" onSubmit={submit}>
          <p className="eyebrow">Оплата</p>
          <h1>Оформление заказа</h1>
          <label>
            ФИО
            <input required value={form.full_name} onChange={(e) => setField('full_name', e.target.value)} />
          </label>
          <div className="two">
            <label>
              Email
              <input type="email" required value={form.email} onChange={(e) => setField('email', e.target.value)} />
            </label>
            <label>
              Телефон
              <PhoneField
                value={form.phone}
                onChange={(phone) => setField('phone', phone)}
                onValidity={setPhoneOk}
              />
            </label>
          </div>
          <label>
            Гражданство <span className="req">*</span>
            <CountrySelect
              countries={COUNTRIES}
              value={selectedCitizenship?.code}
              required
              placeholder="Выберите страну"
              onChange={(country) => {
                setCitizenshipCode(country.code)
                setField('citizenship', country.name)
              }}
            />
          </label>
          <label>
            Комментарий
            <textarea rows="3" value={form.comment} onChange={(e) => setField('comment', e.target.value)} />
          </label>

          <fieldset className="card-box">
            <legend>Оплата картой</legend>
            <BankCard form={form} setField={setField} flipped={flipped} setFlipped={setFlipped} />
          </fieldset>

          <label className="check">
            <input
              type="checkbox"
              checked={form.offer_accepted}
              onChange={(e) => setField('offer_accepted', e.target.checked)}
            />
            <span>
              Принимаю{' '}
              <Link to="/offer" viewTransition>
                публичную оферту
              </Link>{' '}
              и{' '}
              <Link to="/rules" viewTransition>
                правила
              </Link>
            </span>
          </label>

          {error && <p className="form-error">{error}</p>}
          <button type="submit" className="btn btn-gold" disabled={busy}>
            {busy ? 'Обрабатываем платёж…' : `Оплатить ${money(cart.total)}`}
          </button>
        </form>

        <aside className="summary">
          <h3>Состав заказа</h3>
          <ul>
            {cart.items.map((item) => (
              <li key={item.id}>
                {item.service_name} × {item.quantity}
                <b>{money(item.line_total)}</b>
              </li>
            ))}
          </ul>
          <p className="total">{money(cart.total)}</p>
        </aside>
      </div>
    </section>
  )
}
