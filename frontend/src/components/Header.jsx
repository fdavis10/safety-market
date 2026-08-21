import { useState } from 'react'
import { NavLink, Link, useLocation } from 'react-router-dom'
import Logo from './Logo'
import { useCart } from '../CartContext'
import { useLocale } from '../i18n/LocaleContext'

function LangSwitch({ className = '' }) {
  const { lang, setLang, t } = useLocale()
  return (
    <div className={`lang-switch ${className}`} role="group" aria-label={t('nav.lang')}>
      <button type="button" className={lang === 'ru' ? 'on' : ''} onClick={() => setLang('ru')}>
        RU
      </button>
      <span className="lang-switch-sep" aria-hidden="true">
        /
      </span>
      <button type="button" className={lang === 'en' ? 'on' : ''} onClick={() => setLang('en')}>
        EN
      </button>
    </div>
  )
}

export default function Header() {
  const { cart } = useCart()
  const { t } = useLocale()
  const [open, setOpen] = useState(false)
  const location = useLocation()
  const hideCart = location.pathname === '/cart'

  function close() {
    setOpen(false)
  }

  return (
    <>
      <header className="site-header">
        <div className={`container header-inner ${open ? 'open' : ''}`}>
          <Link to="/" className="header-logo" viewTransition onClick={close}>
            <Logo />
          </Link>
          <div className="header-mobile-tools">
            <LangSwitch />
            <button
              className="nav-toggle"
              type="button"
              aria-label={t('nav.menu')}
              onClick={() => setOpen((v) => !v)}
            >
              <span />
              <span />
              <span />
            </button>
          </div>
          <nav className={`nav ${open ? 'open' : ''}`}>
            <NavLink to="/" end viewTransition onClick={close} className="nav-home">
              {t('nav.home')}
            </NavLink>
            <NavLink to="/services" viewTransition onClick={close}>
              {t('nav.services')}
            </NavLink>
            <NavLink to="/packages" viewTransition onClick={close}>
              {t('nav.packages')}
            </NavLink>
            <NavLink to="/rules" viewTransition onClick={close}>
              {t('nav.rules')}
            </NavLink>
            <NavLink to="/offer" viewTransition onClick={close}>
              {t('nav.offer')}
            </NavLink>
            <NavLink to="/privacy" viewTransition onClick={close}>
              {t('nav.privacy')}
            </NavLink>
          </nav>
          <div className="header-actions">
            <LangSwitch className="lang-switch-desktop" />
            {!hideCart && (
              <Link to="/cart" className="cart-link" viewTransition onClick={close}>
                <svg className="cart-icon" viewBox="0 0 24 24" aria-hidden="true">
                  <path
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6.4 7.2h11.2l-.8 10.2H7.2L6.4 7.2Z"
                  />
                  <path
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    d="M9 7.2V6.4a3 3 0 0 1 6 0v.8"
                  />
                </svg>
                <span className="cart-text">{t('nav.cart')}</span>
                {cart.count > 0 && <span className="cart-count">{cart.count}</span>}
              </Link>
            )}
            <Link to="/services" className="btn btn-gold" viewTransition onClick={close}>
              {t('nav.orderService')}
            </Link>
          </div>
        </div>
      </header>
      {!hideCart && (
        <Link to="/cart" className="cart-fab" viewTransition onClick={close} aria-label={t('nav.cart')}>
          <svg className="cart-fab-icon" viewBox="0 0 24 24" aria-hidden="true">
            <path
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M6.4 7.2h11.2l-.8 10.2H7.2L6.4 7.2Z"
            />
            <path
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              d="M9 7.2V6.4a3 3 0 0 1 6 0v.8"
            />
          </svg>
          {cart.count > 0 && <span className="cart-count cart-fab-count">{cart.count}</span>}
        </Link>
      )}
    </>
  )
}
