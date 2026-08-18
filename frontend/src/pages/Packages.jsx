import { useEffect, useState } from 'react'
import { api } from '../api'
import PackageCard from '../components/PackageCard'

export default function Packages() {
  const [packages, setPackages] = useState([])

  useEffect(() => {
    api('/api/packages/').then(setPackages)
  }, [])

  return (
    <section className="section">
      <div className="container">
        <p className="eyebrow">Готовые решения</p>
        <h1>Пакеты под ключ</h1>
        <p className="lead narrow">
          Собрали маршруты под разные задачи работодателя. Ярлыки показывают условия оплаты: только карта, предоплата
          или рассрочка платежами.
        </p>
        <div className="cards-3 packages">
          {packages.map((pack) => (
            <PackageCard key={pack.id} pack={pack} />
          ))}
        </div>
      </div>
    </section>
  )
}
