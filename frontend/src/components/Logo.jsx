import logo from '../assets/logo.png'
import { useLocale } from '../i18n/LocaleContext'

export default function Logo() {
  const { t } = useLocale()
  const name = t('logo.name')
  return (
    <span className="brand">
      <span className="brand-mark">
        <img src={logo} alt={name} />
      </span>
      <span className="brand-copy">
        <strong>{name}</strong>
        <small>{t('logo.subtitle')}</small>
      </span>
    </span>
  )
}
