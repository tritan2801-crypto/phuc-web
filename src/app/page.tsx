import React from 'react'
import {
  HeroSection,
  QuickCategories,
  ComboDeals,
  CategoryProductBlock,
  IndustrySolutions,
  VideoCaseStudies,
  HomeNews,
  CustomerReviews,
  NewArrivalsSlider
} from '@features/home/components'

export default function HomePage() {
  return (
    <main className="min-h-screen pb-12">
      {/* 1. HERO CAROUSEL BANNER SECTION */}
      <HeroSection />

      {/* 1.5. NEW ARRIVALS SLIDER CAROUSEL */}
      <NewArrivalsSlider />

      {/* 2. QUICK GRID CATEGORIES ICON */}
      <QuickCategories />

      {/* 3. FLUID VERTICAL MAPPED COMBO DEALS */}
      <ComboDeals />

      {/* 4. CHANNELS TAB-FILTER PRODUCT SHIELD */}
      <CategoryProductBlock />

      {/* 5. SECTOR-WISE INTEGRATION DESIGNS */}
      <IndustrySolutions />

      {/* 6. BEFORE-AFTER COMPARISONS & CLIPS */}
      <VideoCaseStudies />

      {/* 7. SEO NEWS GUIDES SLIDERS */}
      <HomeNews />

      {/* 8. AUDIENCE REVIEWS TESTIMONIAL TICKERS */}
      <CustomerReviews />
    </main>
  )
}
