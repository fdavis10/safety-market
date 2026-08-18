import { Link } from 'react-router-dom'
import Logo from './Logo'

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="container footer-grid">
        <div>
          <Logo />
          <p>Кадровое агентство международного подбора.</p>
        </div>
        <div>
          <h4>Разделы</h4>
          <Link to="/services" viewTransition>
            Каталог услуг
          </Link>
          <Link to="/packages" viewTransition>
            Пакеты под ключ
          </Link>
          <Link to="/cart" viewTransition>
            Корзина
          </Link>
        </div>
        <div>
          <h4>Документы</h4>
          <Link to="/rules" viewTransition>
            Правила
          </Link>
          <Link to="/offer" viewTransition>
            Публичная оферта
          </Link>
        </div>
      </div>
    </footer>
  )
}
