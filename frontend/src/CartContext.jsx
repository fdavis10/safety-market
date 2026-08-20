import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { api } from './api'

const CartContext = createContext(null)

export function CartProvider({ children }) {
  const [cart, setCart] = useState({ items: [], total: 0, count: 0 })
  const [packages, setPackages] = useState([])
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

  useEffect(() => {
    refresh().catch(() => {})
    loadPackages().catch(() => {})
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

  const value = useMemo(
    () => ({
      cart,
      toast,
      setToast,
      servicePayment,
      setServicePayment,
      refresh,
      async addService(service, paymentType = '50') {
        const serviceId = typeof service === 'object' ? service.id : service
        const existingPackage = packages.find((pack) => {
          if (!cart.items.some((item) => item.kind === 'package' && item.package === pack.id)) return false
          return pack.services.some((item) => item.id === serviceId)
        })
        if (existingPackage) {
          const serviceName = typeof service === 'object' ? service.name : 'Эта услуга'
          setToast(`${serviceName} уже входит в пакет «${existingPackage.name}» в корзине`)
          return cart
        }
        const data = await api('/api/cart/', {
          method: 'POST',
          body: { service: serviceId, quantity: 1, payment_type: paymentType },
        })
        setCart(data)
        setToast('Услуга добавлена в корзину')
        return data
      },
      async addPackage(packageId, logisticsRoute = 'standard') {
        try {
          const data = await api(`/api/cart/packages/${packageId}/`, {
            method: 'POST',
            body: { logistics_route: logisticsRoute },
          })
          setCart(data)
          setToast('Пакет добавлен в корзину')
          return data
        } catch (err) {
          // Например, пакет содержит услуги, которые уже добавлены отдельно в корзину.
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
    [cart, packages, toast, servicePayment],
  )

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

export function useCart() {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('CartProvider is required')
  return ctx
}
