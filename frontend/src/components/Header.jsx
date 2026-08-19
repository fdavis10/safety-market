import { useState } from 'react'
import { NavLink, Link, useLocation } from 'react-router-dom'
import Logo from './Logo'
import { useCart } from '../CartContext'

export default function Header() {
  const { cart } = useCart()
  const [open, setOpen] = useState(false)
  const location = useLocation()
  const hideCart = location.pathname === '/cart'

  function close() {
    setOpen(false)
  }

  return (
    <header className="site-header">
      <div className={`container header-inner ${open ? 'open' : ''}`}>
        <Link to="/" className="header-logo" viewTransition onClick={close}>
          <Logo />
        </Link>
        <button className="nav-toggle" type="button" aria-label="Меню" onClick={() => setOpen((v) => !v)}>
          <span />
          <span />
          <span />
        </button>
        <nav className={`nav ${open ? 'open' : ''}`}>
          <NavLink to="/" end viewTransition onClick={close}>
            Главная
          </NavLink>
          <NavLink to="/services" viewTransition onClick={close}>
            Услуги
          </NavLink>
          <NavLink to="/packages" viewTransition onClick={close}>
            Пакеты под ключ
          </NavLink>
          <NavLink to="/rules" viewTransition onClick={close}>
            Правила
          </NavLink>
          <NavLink to="/offer" viewTransition onClick={close}>
            Оферта
          </NavLink>
        </nav>
        <div className="header-actions">
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
              Корзина
              {cart.count > 0 && <span className="cart-count">{cart.count}</span>}
            </Link>
          )}
          <Link to="/services" className="btn btn-gold" viewTransition onClick={close}>
            Заказать услугу
          </Link>
        </div>
      </div>
    </header>
  )
}
