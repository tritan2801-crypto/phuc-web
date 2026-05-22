import React, { useState, useEffect } from 'react'

const API_BASE_URL = import.meta.env.VITE_API_URL || ''

interface Props {
  query: string
  orientation?: 'landscape' | 'portrait' | 'square'
  className?: string
  index?: number
}

// Map common flooring keywords to high-quality, stable public Unsplash images to guarantee premium aesthetics instantly
const STATIC_FALLBACKS: Record<string, string> = {
  'construction floor grinder machinery': 'https://images.unsplash.com/photo-1621905252507-b354bc25edac?auto=format&fit=crop&w=800&q=80',
  'industrial concrete floor grinding machine': 'https://images.unsplash.com/photo-1581094288338-2314dddb7eed?auto=format&fit=crop&w=800&q=80',
  'large industrial floor grinder heavy machinery': 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=800&q=80',
  'ride-on industrial floor grinder machine logistics': 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=800&q=80',
  'wet dry industrial vacuum cleaner stainless steel tank': 'https://images.unsplash.com/photo-1558317374-067fb5f30001?auto=format&fit=crop&w=800&q=80',
  'walk-behind industrial floor scrubber dryer blue': 'https://images.unsplash.com/photo-1563453392212-326f5e854473?auto=format&fit=crop&w=800&q=80',
  'metal diamond grinding segment shoe concrete': 'https://images.unsplash.com/photo-1534224039826-c7a0eda0e6b3?auto=format&fit=crop&w=800&q=80',
  'resin bond concrete floor polishing pad diamond': 'https://images.unsplash.com/photo-1572981779307-38b8cabb2407?auto=format&fit=crop&w=800&q=80',
  'liquid concrete hardener chemical jug': 'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?auto=format&fit=crop&w=800&q=80',
  'epoxy resin floor paint self leveling chemical': 'https://images.unsplash.com/photo-1541888946425-d81bb19240f5?auto=format&fit=crop&w=800&q=80',
  'notched trowel steel tool tile flooring': 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80',
  'epoxy floor application kit machinery paint roller': 'https://images.unsplash.com/photo-1562259949-e8e7689d7828?auto=format&fit=crop&w=800&q=80',
  'concrete floor polishing package grinder vacuum diamond pads': 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80',
  'professional applying self leveling epoxy paint on factory floor': 'https://images.unsplash.com/photo-1581094794329-c8112a89af12?auto=format&fit=crop&w=800&q=80',
  'warehouse worker concrete floor shine logistics center': 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=800&q=80',
  'factory-solution': 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=800&q=80',
  'hospital-solution': 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=800&q=80',
  'logistics-solution': 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=800&q=80',
  'food-solution': 'https://images.unsplash.com/photo-1556910103-1c02745aae4d?auto=format&fit=crop&w=800&q=80',
  'commercial-solution': 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=800&q=80',
  'hero-banner-1': 'https://images.unsplash.com/photo-1581092921461-eab62e97a780?auto=format&fit=crop&w=1600&q=80',
  'hero-banner-2': 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=1600&q=80',
  'deal-month-1': 'https://images.unsplash.com/photo-1621905252507-b354bc25edac?auto=format&fit=crop&w=600&q=80',
  'deal-month-2': 'https://images.unsplash.com/photo-1563453392212-326f5e854473?auto=format&fit=crop&w=600&q=80',
}

export function PexelsImage({ query, className = '', index = 0 }: Props) {
  const [imgSrc, setImgSrc] = useState<string>('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Check if we have a direct static premium fallback mapped to the query
    if (STATIC_FALLBACKS[query]) {
      setImgSrc(STATIC_FALLBACKS[query])
      setLoading(false)
      return
    }

    // Otherwise, attempt dynamic fetch through API route
    setLoading(true)
    fetch(`${API_BASE_URL}/api/images?q=${encodeURIComponent(query)}&per_page=${index + 1}`)
      .then((res) => {
        if (!res.ok) throw new Error()
        return res.json()
      })
      .then((data) => {
        if (data.photos && data.photos[index]) {
          setImgSrc(data.photos[index].src.large2x || data.photos[index].src.large)
        } else {
          // General generic flooring fallback
          setImgSrc('https://images.unsplash.com/photo-1581094288338-2314dddb7eed?auto=format&fit=crop&w=800&q=80')
        }
      })
      .catch(() => {
        // Safe general concrete floor styling fallback
        setImgSrc('https://images.unsplash.com/photo-1581094288338-2314dddb7eed?auto=format&fit=crop&w=800&q=80')
      })
      .finally(() => {
        setLoading(false)
      })
  }, [query, index])

  return (
    <div className={`relative overflow-hidden bg-slate-100 ${className}`}>
      {loading && (
        <div className="absolute inset-0 animate-pulse bg-gradient-to-r from-slate-200 via-slate-100 to-slate-200" />
      )}
      <img
        src={imgSrc}
        alt={query}
        className={`h-full w-full object-cover transition-all duration-700 ease-out ${
          loading ? 'opacity-0 scale-95' : 'opacity-100 scale-100'
        }`}
        loading="lazy"
        onError={() => {
          // If all else fails, use a beautiful slate background color fallback
          setImgSrc('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="800" height="600" viewBox="0 0 800 600"><rect width="800" height="600" fill="%230f172a"/><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" font-family="Outfit, sans-serif" font-size="28" fill="%23f5a623" font-weight="bold">KHANG PHÚC FLOORING</text></svg>')
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-slate-950/20 via-transparent to-transparent opacity-60" />
    </div>
  )
}

export default PexelsImage
