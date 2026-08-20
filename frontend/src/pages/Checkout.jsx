import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { api } from '../api'
import { useCart } from '../CartContext'
import BankCard from '../components/BankCard'
import PhoneField from '../components/PhoneField'
import { useLocale } from '../i18n/LocaleContext'
import { localizeCartItemName } from '../i18n/content'

const initial = {
  full_name: '',
  email: '',
  phone: '',
  citizenship: 'Россия',
  decline_receipts: false,
  decline_marketing: false,
  consent_personal_data: false,
  consent_user_agreement: false,
  consent_offer: false,
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
  const { cart, refresh, servicesById } = useCart()
  const { t, money, lang } = useLocale()
  const navigate = useNavigate()
  const [form, setForm] = useState(initial)
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)
  const [phoneOk, setPhoneOk] = useState(false)

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
    if (!phoneOk) {
      setError(t('checkout.err.phone'))
      return
    }
    const offer_accepted =
      form.consent_personal_data && form.consent_user_agreement && form.consent_offer
    if (!offer_accepted) {
      setError(t('checkout.err.consents'))
      return
    }
    const pan = form.card_number.replace(/\D/g, '')
    if (pan.length < 13) {
      setError(t('checkout.err.card'))
      return
    }
    if (!form.card_cvv) {
      setError(t('checkout.err.cvv'))
      return
    }
    setBusy(true)
    try {
      const {
        decline_receipts,
        decline_marketing,
        consent_personal_data,
        consent_user_agreement,
        consent_offer,
        ...payload
      } = form
      const order = await api('/api/orders/', {
        method: 'POST',
        body: {
          ...payload,
          offer_accepted,
          comment: '',
          card_number: payload.card_number.replace(/\s/g, ''),
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
        <h1>{t('checkout.title')}</h1>
        <p>{t('checkout.empty')}</p>
        <Link to="/services" className="btn btn-gold" viewTransition>
          {t('checkout.toCatalog')}
        </Link>
      </section>
    )
  }

  return (
    <section className="section">
      <div className="container checkout-grid checkout-grid-stack">
        <aside className="summary">
          <h3>{t('checkout.summary')}</h3>
          <ul>
            {cart.items.map((item) => (
              <li key={item.id}>
                <span className="summary-item-label">
                  <svg className="summary-item-icon" viewBox="0 0 24 24" aria-hidden="true">
                    <path
                      d="M5 7.5h14M7.5 4h9a1.5 1.5 0 0 1 1.5 1.5v13A1.5 1.5 0 0 1 16.5 20h-9A1.5 1.5 0 0 1 6 18.5v-13A1.5 1.5 0 0 1 7.5 4Z"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.8"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M9 11h6M9 15h4"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.8"
                      strokeLinecap="round"
                    />
                  </svg>
                  {localizeCartItemName(item, lang, t, servicesById)} × {item.quantity}
                </span>
                <b>{money(item.line_total)}</b>
              </li>
            ))}
          </ul>
          <p className="total">{t('checkout.total', { amount: money(cart.total) })}</p>
        </aside>

        <form className="order-form" onSubmit={submit}>
          <div className="order-form-panel">
            <h1>{t('checkout.title')}</h1>
            <label>
              {t('checkout.fullName')}
              <input required value={form.full_name} onChange={(e) => setField('full_name', e.target.value)} />
            </label>
            <div className="two">
              <label>
                {t('checkout.email')}
                <input type="email" required value={form.email} onChange={(e) => setField('email', e.target.value)} />
                <span className="check check-inline">
                  <input
                    type="checkbox"
                    checked={form.decline_receipts}
                    onChange={(e) => {
                      const checked = e.target.checked
                      setField('decline_receipts', checked)
                      setField('decline_marketing', checked)
                    }}
                  />
                  <span>{t('checkout.declineMail')}</span>
                </span>
              </label>
              <label>
                {t('checkout.phone')}
                <PhoneField
                  value={form.phone}
                  onChange={(phone) => setField('phone', phone)}
                  onValidity={setPhoneOk}
                />
              </label>
            </div>
          </div>

          <div className="card-box">
            <div className="card-box-title">{t('checkout.payment')}</div>
            <BankCard form={form} setField={setField} />
            <label className="check">
              <input
                type="checkbox"
                checked={form.consent_personal_data}
                onChange={(e) => setField('consent_personal_data', e.target.checked)}
              />
              <span>
                {t('checkout.consent.pdPrefix')}{' '}
                <a
                  href="https://www.consultant.ru/document/cons_doc_LAW_61801/"
                  target="_blank"
                  rel="noreferrer"
                >
                  {t('checkout.consent.pd')}
                </a>
              </span>
            </label>
            <label className="check">
              <input
                type="checkbox"
                checked={form.consent_user_agreement}
                onChange={(e) => setField('consent_user_agreement', e.target.checked)}
              />
              <span>
                {t('checkout.consent.rulesPrefix')}{' '}
                <Link to="/rules" viewTransition>
                  {t('checkout.consent.rules')}
                </Link>
              </span>
            </label>
            <label className="check">
              <input
                type="checkbox"
                checked={form.consent_offer}
                onChange={(e) => setField('consent_offer', e.target.checked)}
              />
              <span>
                {t('checkout.consent.offerPrefix')}{' '}
                <Link to="/offer" viewTransition>
                  {t('checkout.consent.offer')}
                </Link>
              </span>
            </label>
          </div>

          {error && <p className="form-error">{error}</p>}
          <button type="submit" className="btn btn-gold" disabled={busy}>
            {busy ? t('checkout.paying') : t('checkout.pay', { amount: money(cart.total) })}
          </button>
        </form>
      </div>
    </section>
  )
}
