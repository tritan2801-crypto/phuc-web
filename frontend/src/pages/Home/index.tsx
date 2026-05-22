import React from 'react'
import HeroSection from './HeroSection'
import NewArrivalsSlider from './NewArrivalsSlider'
import QuickCategories from './QuickCategories'
import ComboDeals from './ComboDeals'
import CategoryProductBlock from './CategoryProductBlock'
import IndustrySolutions from './IndustrySolutions'
import VideoCaseStudies from './VideoCaseStudies'
import HomeNews from './HomeNews'
import CustomerReviews from './CustomerReviews'
import useBehaviorTracker from '../../hooks/useBehaviorTracker'

export default function Home() {
  // Initialize automatic viewport section view and click tracking
  useBehaviorTracker()

  return (
    <main className="min-h-screen pb-12">
      {/* 1. HERO CAROUSEL BANNER SECTION */}
      <div data-track-section="HeroBanner">
        <HeroSection />
      </div>

      {/* 1.5. NEW ARRIVALS SLIDER CAROUSEL */}
      <div data-track-section="NewArrivals">
        <NewArrivalsSlider />
      </div>

      {/* 2. QUICK GRID CATEGORIES ICON */}
      <div data-track-section="QuickCategories">
        <QuickCategories />
      </div>

      {/* 3. FLUID VERTICAL MAPPED COMBO DEALS */}
      <div data-track-section="ComboDeals">
        <ComboDeals />
      </div>

      {/* 4. CHANNELS TAB-FILTER PRODUCT SHIELD */}
      <div data-track-section="CategoryProducts">
        <CategoryProductBlock />
      </div>

      {/* 5. SECTOR-WISE INTEGRATION DESIGNS */}
      <div data-track-section="SectorSolutions">
        <IndustrySolutions />
      </div>

      {/* 6. BEFORE-AFTER COMPARISONS & CLIPS */}
      <div data-track-section="VideoStudies">
        <VideoCaseStudies />
      </div>

      {/* 7. SEO NEWS GUIDES SLIDERS */}
      <div data-track-section="HomeNews">
        <HomeNews />
      </div>

      {/* 8. AUDIENCE REVIEWS TESTIMONIAL TICKERS */}
      <div data-track-section="CustomerReviews">
        <CustomerReviews />
      </div>
    </main>
  )
}
