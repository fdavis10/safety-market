import logo from '../assets/logo.png'
import { useLocale } from '../i18n/LocaleContext'

export default function Logo() {
  const { t } = useLocale()
  return (
    <span className="brand">
      <span className="brand-mark">
        <img src={logo} alt="Р ПЛЮС" />
      </span>
      <span className="brand-copy">
        <strong>Р ПЛЮС</strong>
        <small>{t('logo.subtitle')}</small>
      </span>
    </span>
  )
}
