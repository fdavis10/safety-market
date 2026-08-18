import { Link } from 'react-router-dom'
import { money } from '../api'
import { useCart } from '../CartContext'

export default function Cart() {
  const { cart, updateItem, removeItem, clear } = useCart()

  return (
    <section className="section">
      <div className="container cart-layout">
        <div>
          <p className="eyebrow">Заказ</p>
          <h1>Корзина</h1>
          {!cart.items.length && <p className="lead">Корзина пуста. Добавьте услуги из каталога или пакет под ключ.</p>}
          <ul className="cart-list">
            {cart.items.map((item) => (
              <li key={item.id}>
                <div>
                  <strong>{item.item_name}</strong>
                  {item.kind === 'package' && <span>Пакет под ключ</span>}
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
                  Удалить
                </button>
              </li>
            ))}
          </ul>
        </div>
        <aside className="summary">
          <h3>Итого</h3>
          <p className="total">
            {money(cart.total)} <span aria-hidden="true">*</span>
          </p>
          <p className="muted">
            * Оплата принимается только по безналичному расчёту. Продолжая оформление, вы подтверждаете согласие с этим условием.
          </p>
          <Link to="/checkout" className={`btn btn-gold ${cart.items.length ? '' : 'disabled'}`} viewTransition>
            Оформить заказ
          </Link>
          {cart.items.length > 0 && (
            <button type="button" className="btn btn-ghost" onClick={clear}>
              Очистить корзину
            </button>
          )}
        </aside>
      </div>
    </section>
  )
}
