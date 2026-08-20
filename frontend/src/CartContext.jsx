import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { api, ensureCsrf } from './api'
import { useLocale } from './i18n/LocaleContext'

const CartContext = createContext(null)

export function CartProvider({ children }) {
  const { t } = useLocale()
  const [cart, setCart] = useState({ items: [], total: 0, count: 0 })
  const [packages, setPackages] = useState([])
  const [services, setServices] = useState([])
  const [toast, setToast] = useState('')
  const [servicePayment, setServicePayment] = useState(null)

  async function refresh() {
    const data = await api('/api/cart/')
    setCart(data)
    return data
  }

  async function loadPackages() {
    const data = await api('/api/packages/')
    setPackages(data)
    return data
  }

  async function loadServices() {
    const data = await api('/api/services/')
    setServices(data)
    return data
  }

  useEffect(() => {
    ensureCsrf()
      .then(() =>
        Promise.all([refresh(), loadPackages(), loadServices()]).catch(() => {}),
      )
      .catch(() => {})
  }, [])

  useEffect(() => {
    if (!toast) return undefined
    const timer = setTimeout(() => setToast(''), 2200)
    return () => clearTimeout(timer)
  }, [toast])

  useEffect(() => {
    if (!cart.items.some((item) => item.kind === 'service')) {
      setServicePayment(null)
    }
  }, [cart])

  const servicesById = useMemo(
    () => Object.fromEntries(services.map((service) => [service.id, service])),
    [services],
  )

  const value = useMemo(
    () => ({
      cart,
      toast,
      setToast,
      servicePayment,
      setServicePayment,
      services,
      packages,
      servicesById,
      refresh,
      async addService(service, paymentType = '50') {
        const serviceId = typeof service === 'object' ? service.id : service
        const existingPackage = packages.find((pack) => {
          if (!cart.items.some((item) => item.kind === 'package' && item.package === pack.id)) return false
          return pack.services.some((item) => item.id === serviceId)
        })
        if (existingPackage) {
          const serviceName = typeof service === 'object' ? service.name : t('nav.services')
          setToast(
            t('cart.inPackage', {
              name: serviceName,
              pack: existingPackage.name,
            }),
          )
          return cart
        }
        const data = await api('/api/cart/', {
          method: 'POST',
          body: { service: serviceId, quantity: 1, payment_type: paymentType },
        })
        setCart(data)
        setToast(t('cart.addedService'))
        return data
      },
      async addPackage(packageId, logisticsRoute = 'standard') {
        try {
          const data = await api(`/api/cart/packages/${packageId}/`, {
            method: 'POST',
            body: { logistics_route: logisticsRoute },
          })
          setCart(data)
          setToast(t('cart.addedPackage'))
          return data
        } catch (err) {
          setToast(err.message)
          return cart
        }
      },
      async updateItem(id, quantity) {
        const data = await api(`/api/cart/items/${id}/`, { method: 'PATCH', body: { quantity } })
        setCart(data)
        if (!data.items.some((item) => item.kind === 'service')) {
          setServicePayment(null)
        }
        return data
      },
      async removeItem(id) {
        const data = await api(`/api/cart/items/${id}/`, { method: 'DELETE' })
        setCart(data)
        if (!data.items.some((item) => item.kind === 'service')) {
          setServicePayment(null)
        }
        return data
      },
      async clear() {
        const data = await api('/api/cart/', { method: 'DELETE' })
        setCart(data)
        setServicePayment(null)
        return data
      },
    }),
    [cart, packages, services, servicesById, toast, servicePayment, t],
  )

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

export function useCart() {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('CartProvider is required')
  return ctx
}
