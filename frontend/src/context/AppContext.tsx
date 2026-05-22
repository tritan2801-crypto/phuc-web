import React, { createContext, useContext, useState, useEffect } from 'react'
import posthog from 'posthog-js'

export interface CartItem {
  id: string
  name: string
  price: number
  agentPrice: number
  quantity: number
  image?: string
}

export interface QuoteRequest {
  fullName: string
  phone: string
  email: string
  companyName?: string
  address?: string
  notes?: string
  items: CartItem[]
}

interface AppContextType {
  isB2b: boolean
  toggleB2b: () => void
  cart: CartItem[]
  addToCart: (item: Omit<CartItem, 'quantity'>, quantity?: number) => void
  removeFromCart: (id: string) => void
  updateQuantity: (id: string, quantity: number) => void
  clearCart: () => void
  isCartOpen: boolean
  setIsCartOpen: (isOpen: boolean) => void
  activeBranch: string
  setActiveBranch: (branch: string) => void
  quotesLog: QuoteRequest[]
  submitQuoteRequest: (contact: Omit<QuoteRequest, 'items'>) => boolean
}

const AppContext = createContext<AppContextType | undefined>(undefined)

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [isB2b, setIsB2b] = useState(false)
  const [cart, setCart] = useState<CartItem[]>([])
  const [isCartOpen, setIsCartOpen] = useState(false)
  const [activeBranch, setActiveBranch] = useState('Hà Nội')
  const [quotesLog, setQuotesLog] = useState<QuoteRequest[]>([])

  // Load state from localStorage on mount
  useEffect(() => {
    const localB2b = localStorage.getItem('khangphuc_isB2b')
    if (localB2b === 'true') setIsB2b(true)

    const localCart = localStorage.getItem('khangphuc_cart')
    if (localCart) {
      try {
        setCart(JSON.parse(localCart))
      } catch (e) {
        console.error(e)
      }
    }
  }, [])

  const toggleB2b = () => {
    setIsB2b(prev => {
      const next = !prev
      localStorage.setItem('khangphuc_isB2b', String(next))
      posthog.capture('b2b_mode_toggled', { enabled: next })
      return next
    })
  }

  const addToCart = (product: Omit<CartItem, 'quantity'>, quantity = 1) => {
    posthog.capture('cart_item_added', {
      id: product.id,
      name: product.name,
      price: product.price,
      agentPrice: product.agentPrice,
      quantity,
    })
    setCart(prev => {
      const existing = prev.find(i => i.id === product.id)
      let updated
      if (existing) {
        updated = prev.map(i => i.id === product.id ? { ...i, quantity: i.quantity + quantity } : i)
      } else {
        updated = [...prev, { ...product, quantity }]
      }
      localStorage.setItem('khangphuc_cart', JSON.stringify(updated))
      return updated
    })
  }

  const removeFromCart = (id: string) => {
    posthog.capture('cart_item_removed', { id })
    setCart(prev => {
      const updated = prev.filter(i => i.id !== id)
      localStorage.setItem('khangphuc_cart', JSON.stringify(updated))
      return updated
    })
  }

  const updateQuantity = (id: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(id)
      return
    }
    setCart(prev => {
      const updated = prev.map(i => i.id === id ? { ...i, quantity } : i)
      localStorage.setItem('khangphuc_cart', JSON.stringify(updated))
      return updated
    })
  }

  const clearCart = () => {
    setCart([])
    localStorage.removeItem('khangphuc_cart')
  }

  const submitQuoteRequest = (contact: Omit<QuoteRequest, 'items'>) => {
    const newRequest: QuoteRequest = {
      ...contact,
      items: cart
    }
    setQuotesLog(prev => [...prev, newRequest])
    clearCart()
    return true
  }

  return (
    <AppContext.Provider
      value={{
        isB2b,
        toggleB2b,
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        isCartOpen,
        setIsCartOpen,
        activeBranch,
        setActiveBranch,
        quotesLog,
        submitQuoteRequest
      }}
    >
      {children}
    </AppContext.Provider>
  )
}

export function useApp() {
  const context = useContext(AppContext)
  if (!context) throw new Error('useApp must be used within an AppProvider')
  return context
}
