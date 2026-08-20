import { useMemo, useState } from 'react'
import { useCart } from '../CartContext'
import { packageImage } from '../data/packageImages'
import { useLocale } from '../i18n/LocaleContext'

export default function PackageCard({ pack }) {
  const { addPackage } = useCart()
  const { t, money } = useLocale()
  const cover = packageImage(pack.slug)
  const [route, setRoute] = useState('standard')

  const upgrade = Number(pack.logistics_upgrade || 0)
  const base = Number(pack.price)
  const complex = pack.price_complex != null ? Number(pack.price_complex) : base + upgrade
  const price = useMemo(
    () => (route === 'multimodal' ? complex : base),
    [base, complex, route],
  )

  const services = useMemo(() => {
    const list = pack.services.filter((service) => service.slug !== 'logistics-multimodal')
    return list.map((service) => {
      if (service.slug !== 'logistics-standard') return service
      return {
        ...service,
        name: route === 'multimodal' ? t('logistics.complex') : t('logistics.standard'),
      }
    })
  }, [pack.services, route, t])

  return (
    <article className="package-card">
      {pack.payment_terms && <div className="package-payment-note">{pack.payment_terms}</div>}
      <h3>{pack.name}</h3>
      {cover && <img className="package-cover" src={cover} alt="" />}
      <p>{pack.description}</p>
      <ul>
        {services.map((service) => (
          <li key={service.id}>{service.name}</li>
        ))}
      </ul>
      <p className="package-route-label">{t('route.label')}</p>
      <div
        className={`package-route-switch ${route === 'multimodal' ? 'is-multimodal' : 'is-standard'}`}
        role="group"
        aria-label={t('route.label')}
      >
        <span className="package-route-thumb" aria-hidden="true" />
        <button
          type="button"
          className={route === 'standard' ? 'on' : ''}
          onClick={() => setRoute('standard')}
        >
          <span className="package-route-title">{t('route.standard')}</span>
          <span className="package-route-hint">{t('route.standard.hint')}</span>
        </button>
        <button
          type="button"
          className={route === 'multimodal' ? 'on' : ''}
          onClick={() => setRoute('multimodal')}
        >
          <span className="package-route-title">{t('route.complex')}</span>
          <span className="package-route-hint">{t('route.complex.hint')}</span>
        </button>
      </div>
      <div className="card-footer">
        <strong>{money(price)}</strong>
        <button type="button" className="btn btn-gold" onClick={() => addPackage(pack.id, route)}>
          {t('cart.addPackage')}
        </button>
      </div>
    </article>
  )
}
