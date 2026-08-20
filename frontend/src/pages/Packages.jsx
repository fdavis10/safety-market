import PackageCard from '../components/PackageCard'
import { useCart } from '../CartContext'
import { useLocale } from '../i18n/LocaleContext'

export default function Packages() {
  const { packages } = useCart()
  const { t, localizePackage } = useLocale()

  return (
    <section className="section">
      <div className="container">
        <p className="eyebrow">{t('packages.eyebrow')}</p>
        <h1>{t('packages.title')}</h1>
        <div className="cards-3 packages">
          {(packages || []).map((pack) => (
            <PackageCard key={pack.id} pack={localizePackage(pack)} />
          ))}
        </div>
      </div>
    </section>
  )
}
