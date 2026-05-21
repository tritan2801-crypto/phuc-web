# Khang Phuc — Design System & Visual Identity

This document defines the comprehensive design system, color palettes, typography, spacing, and micro-interactions for the Khang Phuc Industrial Flooring Web Portal.

---

## 1. Color Palette (Curated HSL & Hex Tokens)

Our theme combines the reliability of slate navy (heavy machinery), the cleanliness of bright teal (professional hygiene), and high-contrast gold (abrasive diamond grinding & premium quality).

```css
:root {
  /* Brand Primary - Deep Heavy Industrial Navy */
  --color-primary-50: #f4f6fa;
  --color-primary-100: #e7ebf4;
  --color-primary-500: #1e3a8a; /* Slate Navy Primary */
  --color-primary-600: #172a6b;
  --color-primary-900: #0b132b; /* Extremely dark slate */

  /* Brand Secondary - Cleaning & Epoxy Clean Teal */
  --color-secondary-500: #00a896; /* Clean Teal */
  --color-secondary-600: #028090;

  /* Accent - Grinding Spark & Premium Gold */
  --color-accent-500: #f5a623; /* Bright Gold */
  --color-accent-600: #d97706; /* Warm Amber */

  /* Status Colors */
  --color-success: #10b981;
  --color-warning: #f59e0b;
  --color-error: #ef4444;

  /* Neutral Backgrounds & Texts */
  --color-bg-base: #ffffff;
  --color-bg-alt: #f8fafc;
  --color-bg-dark: #0f172a;
  
  --color-text-main: #1e293b;
  --color-text-muted: #64748b;
  --color-text-light: #94a3b8;
}
```

---

## 2. Typography

We use Google Fonts **Outfit** for all geometric modern headings and **Inter** for reading-optimized, high-legibility interface text.

- **Primary Font Family**: `Inter, sans-serif`
- **Headings Font Family**: `Outfit, sans-serif`
- **Sizes**:
  - `h1`: 2.5rem (40px) | Bold (700) | Tracking `-0.02em`
  - `h2`: 1.875rem (30px) | SemiBold (600) | Tracking `-0.015em`
  - `h3`: 1.5rem (24px) | Medium (500)
  - `body-lg`: 1.125rem (18px)
  - `body`: 1rem (16px) | Regular (400)
  - `caption`: 0.875rem (14px) | Regular (400) | Text Muted

---

## 3. Cards & Container Visuals

To capture the "Wow" factor and premium feel, we will use modern design elements:
- **Glassmorphism**: Soft background blur with thin border overlay for floating headers, megamenu dropdowns, and dashboard components.
- **Borders**: Thin `1px` borders with low-opacity gray (`rgba(226, 232, 240, 0.6)`) to keep elements clean, sharp, and structured.
- **Shadows**: Premium soft drop-shadows instead of flat solid box shadows:
  - `shadow-premium`: `0 10px 30px -10px rgba(11, 19, 43, 0.08)`
  - `shadow-glow`: `0 0 20px rgba(245, 166, 35, 0.15)` (specifically for gold buttons and deals of the month)

---

## 4. Micro-Animations & Transitions

A dynamic interface feels alive. We will implement these interactive effects:
- **Smooth Hover Scale**: Scale cards up by `1.02` with cubic-bezier transition (`transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1)`).
- **Interactive Buttons**: Slide background colors or create glow outlines on hover.
- **Active State Indicators**: Underlines in navigation menu expand smoothly from the center outwards on hover.
- **Filtered Tabs Transition**: Clean fade-in for product cards when switching tabs (using standard CSS classes or simple transition hooks).

---

## 5. Responsive Breakpoints

We adopt standard Tailwind breakpoints:
- `sm`: `640px` (mobile landscape)
- `md`: `768px` (tablets portrait)
- `lg`: `1024px` (tablets landscape / small laptops)
- `xl`: `1280px` (desktop standard)
- `2xl`: `1536px` (large screens)
