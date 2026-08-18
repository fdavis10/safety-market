import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { api } from './api'

const CartContext = createContext(null)

export function CartProvider({ children }) {
  const [cart, setCart] = useState({ items: [], total: 0, count: 0 })
  const [toast, setToast] = useState('')

  async function refresh() {
    const data = await api('/api/cart/')
    setCart(data)
    return data
  }

  useEffect(() => {
    refresh().catch(() => {})
  }, [])

  useEffect(() => {
    if (!toast) return undefined
    const timer = setTimeout(() => setToast(''), 2200)
    return () => clearTimeout(timer)
  }, [toast])

  const value = useMemo(
    () => ({
      cart,
      toast,
      refresh,
      async addService(serviceId) {
        const data = await api('/api/cart/', { method: 'POST', body: { service: serviceId, quantity: 1 } })
        setCart(data)
        setToast('Услуга добавлена в корзину')
        return data
      },
      async addPackage(packageId) {
        const data = await api(`/api/cart/packages/${packageId}/`, { method: 'POST' })
        setCart(data)
        setToast('Пакет добавлен в корзину')
        return data
      },
      async updateItem(id, quantity) {
        const data = await api(`/api/cart/items/${id}/`, { method: 'PATCH', body: { quantity } })
        setCart(data)
        return data
      },
      async removeItem(id) {
        const data = await api(`/api/cart/items/${id}/`, { method: 'DELETE' })
        setCart(data)
        return data
      },
      async clear() {
        const data = await api('/api/cart/', { method: 'DELETE' })
        setCart(data)
        return data
      },
    }),
    [cart, toast],
  )

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

export function useCart() {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('CartProvider is required')
  return ctx
}
