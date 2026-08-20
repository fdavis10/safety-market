import { Link } from 'react-router-dom'
import Logo from './Logo'
import { useLocale } from '../i18n/LocaleContext'

export default function Footer() {
  const { t } = useLocale()
  return (
    <footer className="site-footer">
      <div className="container footer-grid">
        <div>
          <Logo />
          <p>{t('footer.tagline')}</p>
        </div>
        <div>
          <h4>{t('footer.sections')}</h4>
          <Link to="/services" viewTransition>
            {t('catalog.title')}
          </Link>
          <Link to="/packages" viewTransition>
            {t('nav.packages')}
          </Link>
          <Link to="/cart" viewTransition>
            {t('nav.cart')}
          </Link>
        </div>
        <div>
          <h4>{t('footer.docs')}</h4>
          <Link to="/rules" viewTransition>
            {t('nav.rules')}
          </Link>
          <Link to="/offer" viewTransition>
            {t('docs.offer')}
          </Link>
        </div>
      </div>
      <div className="container footer-copy">{t('footer.copy')}</div>
    </footer>
  )
}
