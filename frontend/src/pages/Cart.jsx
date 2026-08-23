import { Link, useNavigate } from 'react-router-dom'
import { useCart } from '../CartContext'
import { useLocale } from '../i18n/LocaleContext'
import { localizeCartItemName } from '../i18n/content'

export default function Cart() {
  const { cart, updateItem, removeItem, clear, servicesById, hasPackageServiceOverlap, setToast } =
    useCart()
  const { t, money, lang } = useLocale()
  const navigate = useNavigate()

  function handleCheckout(event) {
    event.preventDefault()
    if (!cart.items.length) return
    if (hasPackageServiceOverlap) {
      setToast(t('cart.servicesInPackage'))
      return
    }
    navigate('/checkout', { viewTransition: true })
  }

  return (
    <section className="section">
      <div className="container cart-layout">
        <div>
          <p className="eyebrow">{t('cart.eyebrow')}</p>
          <h1>{t('cart.title')}</h1>
          {!cart.items.length && <p className="lead">{t('cart.empty')}</p>}
          <ul className="cart-list">
            {cart.items.map((item) => (
              <li key={item.id}>
                <div>
                  <strong>{localizeCartItemName(item, lang, t, servicesById)}</strong>
                  {item.kind === 'package' && <span>{t('cart.packageKind')}</span>}
                  <span>{money(item.price)}</span>
                </div>
                <div className="qty">
                  <button type="button" onClick={() => updateItem(item.id, item.quantity - 1)}>
                    −
                  </button>
                  <b>{item.quantity}</b>
                  <button type="button" onClick={() => updateItem(item.id, item.quantity + 1)}>
                    +
                  </button>
                </div>
                <em>{money(item.line_total)}</em>
                <button type="button" className="linkish" onClick={() => removeItem(item.id)}>
                  {t('cart.remove')}
                </button>
              </li>
            ))}
          </ul>
        </div>
        <aside className="summary">
          <h3>{t('cart.total')}</h3>
          <p className="total">
            {money(cart.total)} <span aria-hidden="true">*</span>
          </p>
          <p className="muted">{t('cart.note')}</p>
          {hasPackageServiceOverlap && (
            <p className="cart-conflict">{t('cart.servicesInPackage')}</p>
          )}
          <Link
            to="/checkout"
            className={`btn btn-gold ${cart.items.length ? '' : 'disabled'}`}
            viewTransition
            onClick={handleCheckout}
          >
            {t('cart.checkout')}
          </Link>
          {cart.items.length > 0 && (
            <button type="button" className="btn btn-ghost" onClick={clear}>
              {t('cart.clear')}
            </button>
          )}
        </aside>
      </div>
    </section>
  )
}
