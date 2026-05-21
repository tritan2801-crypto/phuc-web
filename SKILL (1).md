---
name: web-builder
description: Build full-stack websites from design.md and sitemap.md specifications using Next.js (App Router) + React frontend and MySQL backend. Triggers when user provides design.md, sitemap.md, or asks to build/scaffold a website project. Also triggers when user mentions "build site", "tạo web", "code web", "scaffold project", "setup project", or references design specs and sitemap files. Use this skill for ANY web development task that involves translating design documents into working code. Always read this skill before writing any project code.
---

# Web Builder Skill

Build production-ready full-stack websites from `design.md` and `sitemap.md` specs.

## Tech Stack

| Layer        | Tech                                      |
|--------------|-------------------------------------------|
| Framework    | Next.js 14+ (App Router)                  |
| UI           | React 18+ / TypeScript                    |
| Styling      | Tailwind CSS 3+                           |
| Database     | MySQL 8+ via Prisma ORM                   |
| Images       | Pexels API (runtime fetch, NOT hardcoded) |
| Auth         | NextAuth.js (if needed)                   |
| Deployment   | Vercel / Docker                           |

---

## Workflow — Read Before Coding

### Step 0: Read Input Files

Before writing ANY code, ALWAYS read these files in order:

1. **`design.md`** — Extract: color palette (CSS vars), typography (font families, sizes, weights), spacing system, component styles, animations, responsive breakpoints, UI patterns.
2. **`sitemap.md`** — Extract: page list, section hierarchy per page, navigation flow, component placement, content structure.
3. **`plan.md`** (if exists) — Extract: current phase (BE or FE), task breakdown, priorities.

```
CRITICAL: Do NOT start coding until you have read and understood ALL input files.
Parse design tokens from design.md into tailwind.config.ts and globals.css FIRST.
```

### Step 1: Project Structure — Feature-Based / OOP

```
CRITICAL ARCHITECTURE RULE:
- Tổ chức theo FEATURE (hướng đối tượng), KHÔNG theo layer flat.
- Mỗi feature là 1 module độc lập chứa đủ BE + FE của nó.
- File nhỏ, tên rõ ràng → AI quét nhanh, dev đọc nhanh.
- Mỗi file tối đa ~80-120 dòng. Nếu dài hơn → tách.
```

Generate this structure:

```
project-root/
│
├── prisma/
│   ├── schema.prisma                    # MySQL schema (chia model theo comment block)
│   ├── seed.ts                          # Seed data
│   └── migrations/                      # Auto-generated
│
├── src/
│   │
│   ├── @core/                           # ========== SHARED CORE (BE + FE) ==========
│   │   │
│   │   ├── database/
│   │   │   ├── prisma.client.ts         # Prisma singleton
│   │   │   └── prisma.helpers.ts        # Pagination, filter, sort helpers
│   │   │
│   │   ├── services/
│   │   │   └── pexels/
│   │   │       ├── pexels.client.ts     # Pexels API wrapper
│   │   │       ├── pexels.types.ts      # PexelsPhoto, PexelsResponse interfaces
│   │   │       └── pexels.queries.ts    # Query builder theo theme website
│   │   │
│   │   ├── ui/                          # Atomic design components (Button, Input, Card, Modal...)
│   │   │   ├── Button.tsx
│   │   │   ├── Input.tsx
│   │   │   ├── Card.tsx
│   │   │   ├── Modal.tsx
│   │   │   ├── Skeleton.tsx
│   │   │   ├── PexelsImage.tsx          # Reusable Pexels image component
│   │   │   └── index.ts                # Barrel export
│   │   │
│   │   ├── layout/                      # Shell components
│   │   │   ├── Header.tsx
│   │   │   ├── Footer.tsx
│   │   │   ├── Sidebar.tsx
│   │   │   ├── MobileNav.tsx
│   │   │   └── index.ts
│   │   │
│   │   ├── hooks/                       # Shared hooks
│   │   │   ├── useMediaQuery.ts
│   │   │   ├── useDebounce.ts
│   │   │   ├── usePexelsImage.ts
│   │   │   └── index.ts
│   │   │
│   │   ├── utils/
│   │   │   ├── cn.ts                    # clsx + twMerge
│   │   │   ├── format.ts               # Date, currency, number formatters
│   │   │   ├── validation.ts           # Zod schemas dùng chung
│   │   │   └── api-response.ts         # Chuẩn hóa { data, error, meta }
│   │   │
│   │   ├── types/
│   │   │   ├── api.types.ts            # ApiResponse<T>, PaginatedResponse<T>
│   │   │   └── common.types.ts         # Shared interfaces
│   │   │
│   │   └── config/
│   │       ├── site.ts                  # Site metadata, SEO defaults
│   │       └── nav.ts                   # Navigation links from sitemap
│   │
│   │
│   ├── features/                        # ========== FEATURE MODULES ==========
│   │   │
│   │   ├── home/                        # ---- Feature: Homepage ----
│   │   │   ├── components/
│   │   │   │   ├── HeroSection.tsx
│   │   │   │   ├── FeaturesSection.tsx
│   │   │   │   ├── CTASection.tsx
│   │   │   │   └── index.ts
│   │   │   ├── hooks/
│   │   │   │   └── useHomeData.ts
│   │   │   └── home.types.ts
│   │   │
│   │   ├── blog/                        # ---- Feature: Blog ----
│   │   │   ├── components/
│   │   │   │   ├── PostCard.tsx
│   │   │   │   ├── PostList.tsx
│   │   │   │   ├── PostDetail.tsx
│   │   │   │   ├── CategoryFilter.tsx
│   │   │   │   └── index.ts
│   │   │   ├── hooks/
│   │   │   │   └── usePosts.ts
│   │   │   ├── services/
│   │   │   │   ├── blog.service.ts      # BE: CRUD logic (Prisma queries)
│   │   │   │   ├── blog.validation.ts   # Zod schemas cho blog
│   │   │   │   └── blog.dto.ts          # Data Transfer Objects
│   │   │   ├── blog.types.ts            # Post, Category, Tag interfaces
│   │   │   └── blog.constants.ts        # POSTS_PER_PAGE, etc.
│   │   │
│   │   ├── products/                    # ---- Feature: Products ----
│   │   │   ├── components/
│   │   │   │   ├── ProductCard.tsx
│   │   │   │   ├── ProductGrid.tsx
│   │   │   │   ├── ProductDetail.tsx
│   │   │   │   ├── ProductFilter.tsx
│   │   │   │   └── index.ts
│   │   │   ├── hooks/
│   │   │   │   ├── useProducts.ts
│   │   │   │   └── useProductFilter.ts
│   │   │   ├── services/
│   │   │   │   ├── product.service.ts
│   │   │   │   ├── product.validation.ts
│   │   │   │   └── product.dto.ts
│   │   │   ├── products.types.ts
│   │   │   └── products.constants.ts
│   │   │
│   │   ├── contact/                     # ---- Feature: Contact ----
│   │   │   ├── components/
│   │   │   │   ├── ContactForm.tsx
│   │   │   │   ├── ContactInfo.tsx
│   │   │   │   ├── MapEmbed.tsx
│   │   │   │   └── index.ts
│   │   │   ├── services/
│   │   │   │   ├── contact.service.ts
│   │   │   │   └── contact.validation.ts
│   │   │   └── contact.types.ts
│   │   │
│   │   └── auth/                        # ---- Feature: Auth (if needed) ----
│   │       ├── components/
│   │       │   ├── LoginForm.tsx
│   │       │   ├── RegisterForm.tsx
│   │       │   └── index.ts
│   │       ├── services/
│   │       │   ├── auth.service.ts
│   │       │   └── auth.validation.ts
│   │       └── auth.types.ts
│   │
│   │
│   ├── app/                             # ========== NEXT.JS APP ROUTER ==========
│   │   │                                # (Thin layer — chỉ import từ features + core)
│   │   ├── layout.tsx                   # Root layout → import từ @core/layout
│   │   ├── page.tsx                     # Homepage → import từ features/home
│   │   ├── globals.css                  # CSS variables from design.md
│   │   │
│   │   ├── (pages)/                     # Route groups from sitemap.md
│   │   │   ├── blog/
│   │   │   │   ├── page.tsx             # → import PostList from features/blog
│   │   │   │   ├── [slug]/
│   │   │   │   │   └── page.tsx         # → import PostDetail from features/blog
│   │   │   │   ├── loading.tsx
│   │   │   │   └── error.tsx
│   │   │   ├── products/
│   │   │   │   ├── page.tsx             # → import ProductGrid from features/products
│   │   │   │   ├── [id]/
│   │   │   │   │   └── page.tsx
│   │   │   │   ├── loading.tsx
│   │   │   │   └── error.tsx
│   │   │   └── contact/
│   │   │       └── page.tsx             # → import ContactForm from features/contact
│   │   │
│   │   └── api/                         # ========== API ROUTES (BE) ==========
│   │       │                            # (Thin layer — delegate to feature services)
│   │       ├── images/
│   │       │   └── route.ts             # Pexels proxy → @core/services/pexels
│   │       ├── blog/
│   │       │   ├── route.ts             # GET list + POST → features/blog/services
│   │       │   └── [slug]/
│   │       │       └── route.ts         # GET + PUT + DELETE
│   │       ├── products/
│   │       │   ├── route.ts
│   │       │   └── [id]/
│   │       │       └── route.ts
│   │       └── contact/
│   │           └── route.ts             # POST → features/contact/services
│   │
│   └── middleware.ts                    # Auth, rate limiting, etc.
│
├── public/
│   └── fonts/                           # Custom fonts from design.md
│
├── tailwind.config.ts
├── next.config.js
├── tsconfig.json                        # Path aliases: @core/*, @features/*
├── package.json
├── .env.example
├── .env.local
└── docker-compose.yml                   # MySQL container
```

### Architecture Rules

```
1. FEATURE MODULE = 1 đối tượng nghiệp vụ (blog, products, auth, contact...)
   Mỗi module TỰ CHỨA: components, hooks, services, types, constants.
   Không bao giờ feature A import trực tiếp từ feature B → dùng @core làm trung gian.

2. LAYERS TRONG MỖI FEATURE:
   ┌─────────────────────────────────────────────┐
   │  components/  (FE) — React components        │
   │  hooks/       (FE) — React hooks              │
   │  services/    (BE) — Business logic + Prisma  │
   │  *.types.ts   — Shared interfaces             │
   │  *.constants.ts — Magic numbers, config        │
   │  *.validation.ts — Zod schemas (BE + FE)      │
   │  *.dto.ts     — Data Transfer Objects          │
   └─────────────────────────────────────────────┘

3. APP ROUTER = THIN LAYER
   - Page files chỉ import và compose từ features
   - API routes chỉ validate request → gọi service → trả response
   - KHÔNG chứa business logic trong app/

4. FILE SIZE RULE:
   - Mỗi file tối đa 80-120 dòng
   - 1 component = 1 file
   - 1 service method quá 40 dòng → tách thành helper
   - Nếu types file > 50 dòng → tách theo domain

5. IMPORT PATHS (tsconfig.json):
   {
     "paths": {
       "@core/*": ["./src/@core/*"],
       "@features/*": ["./src/features/*"],
       "@/*": ["./src/*"]
     }
   }

6. NAMING CONVENTION:
   - Components: PascalCase.tsx (PostCard.tsx)
   - Services: kebab-case.service.ts (blog.service.ts)
   - Types: kebab-case.types.ts (blog.types.ts)
   - Hooks: camelCase with use prefix (usePosts.ts)
   - Constants: kebab-case.constants.ts
   - Barrel exports: index.ts trong mỗi folder components/
```

### How to Add a New Feature

```
Khi sitemap.md có 1 page/section mới, tạo feature module theo template:

mkdir -p src/features/{feature-name}/{components,hooks,services}

Tạo files:
  {feature-name}/
  ├── components/
  │   ├── {Component1}.tsx
  │   ├── {Component2}.tsx
  │   └── index.ts
  ├── hooks/
  │   └── use{Feature}.ts
  ├── services/
  │   ├── {feature}.service.ts
  │   ├── {feature}.validation.ts
  │   └── {feature}.dto.ts
  ├── {feature}.types.ts
  └── {feature}.constants.ts

Rồi wire vào:
  1. app/(pages)/{feature}/page.tsx → import components
  2. app/api/{feature}/route.ts → import services
  3. prisma/schema.prisma → thêm model nếu cần
```

### Step 2: Design Token Setup

From `design.md`, generate these files FIRST before any components:

**tailwind.config.ts:**
```typescript
// Map ALL design.md tokens here
// Colors → theme.extend.colors
// Typography → theme.extend.fontFamily, fontSize
// Spacing → theme.extend.spacing
// Breakpoints → theme.extend.screens
// Border radius → theme.extend.borderRadius
// Shadows → theme.extend.boxShadow
```

**globals.css:**
```css
/* Map design.md color palette to CSS variables */
:root {
  --color-primary: /* from design.md */;
  --color-secondary: /* from design.md */;
  --color-accent: /* from design.md */;
  --color-background: /* from design.md */;
  --color-foreground: /* from design.md */;
  /* ... all design tokens */
}

.dark {
  /* Dark mode variants if specified */
}
```

### Step 3: Database (MySQL + Prisma)

**prisma/schema.prisma:**
```prisma
datasource db {
  provider = "mysql"
  url      = env("DATABASE_URL")
}

generator client {
  provider = "prisma-client-js"
}

// Generate models based on sitemap.md content requirements
// Group by feature module with comment blocks:

// ========== BLOG ==========
// model Post { ... }
// model Category { ... }
// model Tag { ... }

// ========== PRODUCTS ==========
// model Product { ... }
// model ProductCategory { ... }

// ========== CONTACT ==========
// model ContactMessage { ... }
```

**docker-compose.yml for local dev:**
```yaml
services:
  mysql:
    image: mysql:8
    environment:
      MYSQL_ROOT_PASSWORD: root
      MYSQL_DATABASE: webdb
    ports:
      - "3306:3306"
    volumes:
      - mysql_data:/var/lib/mysql
volumes:
  mysql_data:
```

**@core/database/prisma.client.ts — Singleton:**
```typescript
import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient }

export const db = globalForPrisma.prisma || new PrismaClient()

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = db
```

**@core/database/prisma.helpers.ts — Pagination helper:**
```typescript
export interface PaginationParams {
  page?: number
  perPage?: number
}

export function paginate({ page = 1, perPage = 10 }: PaginationParams) {
  return { skip: (page - 1) * perPage, take: perPage }
}
```

### Step 4: Pexels API Integration

```
CRITICAL RULES:
- NEVER hardcode image URLs. ALWAYS fetch from Pexels at runtime or build time.
- Proxy through API route to hide API key from client.
- Cache responses to reduce API calls.
- Use relevant search queries based on the website's THEME and CONTENT.
- Always provide alt text from Pexels photographer attribution.
- Handle loading states and fallbacks gracefully.
```

**@core/services/pexels/pexels.client.ts:**
```typescript
const PEXELS_BASE = 'https://api.pexels.com/v1'

interface PexelsPhoto {
  id: number
  width: number
  height: number
  url: string
  photographer: string
  photographer_url: string
  src: {
    original: string
    large2x: string
    large: string
    medium: string
    small: string
    portrait: string
    landscape: string
    tiny: string
  }
  alt: string
}

interface PexelsResponse {
  total_results: number
  page: number
  per_page: number
  photos: PexelsPhoto[]
}

export async function searchPhotos(
  query: string,
  options: { perPage?: number; page?: number; orientation?: 'landscape' | 'portrait' | 'square' } = {}
): Promise<PexelsResponse> {
  const { perPage = 10, page = 1, orientation } = options
  const params = new URLSearchParams({
    query,
    per_page: String(perPage),
    page: String(page),
    ...(orientation && { orientation }),
  })

  const res = await fetch(`${PEXELS_BASE}/search?${params}`, {
    headers: { Authorization: process.env.PEXELS_API_KEY! },
    next: { revalidate: 3600 }, // Cache 1 hour
  })

  if (!res.ok) throw new Error(`Pexels API error: ${res.status}`)
  return res.json()
}

export async function getCuratedPhotos(perPage = 10, page = 1): Promise<PexelsResponse> {
  const res = await fetch(`${PEXELS_BASE}/curated?per_page=${perPage}&page=${page}`, {
    headers: { Authorization: process.env.PEXELS_API_KEY! },
    next: { revalidate: 3600 },
  })

  if (!res.ok) throw new Error(`Pexels API error: ${res.status}`)
  return res.json()
}
```

**API Route — src/app/api/images/route.ts:**
```typescript
import { searchPhotos } from '@core/services/pexels/pexels.client'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(req: NextRequest) {
  const query = req.nextUrl.searchParams.get('q')
  const orientation = req.nextUrl.searchParams.get('orientation') as 'landscape' | 'portrait' | 'square' | undefined
  const perPage = Number(req.nextUrl.searchParams.get('per_page')) || 10

  if (!query) return NextResponse.json({ error: 'Missing query' }, { status: 400 })

  try {
    const data = await searchPhotos(query, { perPage, orientation })
    return NextResponse.json(data)
  } catch (err) {
    return NextResponse.json({ error: 'Failed to fetch images' }, { status: 500 })
  }
}
```

**Reusable Image Component:**
```typescript
// src/@core/ui/PexelsImage.tsx
'use client'
import Image from 'next/image'
import { useState, useEffect } from 'react'

interface Props {
  query: string
  orientation?: 'landscape' | 'portrait' | 'square'
  className?: string
  index?: number // Pick nth result (0-based)
  sizes?: string
  priority?: boolean
}

export function PexelsImage({ query, orientation = 'landscape', className, index = 0, sizes, priority = false }: Props) {
  const [photo, setPhoto] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch(`/api/images?q=${encodeURIComponent(query)}&orientation=${orientation}&per_page=${index + 1}`)
      .then(r => r.json())
      .then(data => {
        if (data.photos?.[index]) setPhoto(data.photos[index])
      })
      .finally(() => setLoading(false))
  }, [query, orientation, index])

  if (loading) return <div className={`animate-pulse bg-gray-200 ${className}`} />
  if (!photo) return <div className={`bg-gray-100 ${className}`} />

  return (
    <Image
      src={photo.src.large2x}
      alt={photo.alt || `Photo by ${photo.photographer}`}
      width={photo.width}
      height={photo.height}
      className={className}
      sizes={sizes || '100vw'}
      priority={priority}
    />
  )
}
```

### Step 5: Build Pages from Sitemap

For EACH page in `sitemap.md`:

1. Create `src/app/[page-name]/page.tsx`
2. Map each section from sitemap to a component in `src/components/sections/`
3. Assemble sections in page order as defined in sitemap
4. Apply design tokens from design.md to each component
5. Use `PexelsImage` component with search queries matching the section's CONTENT THEME

**Page = Thin Composition Layer:**
```typescript
// src/app/page.tsx (homepage example)
import { HeroSection, FeaturesSection, CTASection } from '@features/home/components'

// Page file chỉ COMPOSE components, không chứa logic
export default function HomePage() {
  return (
    <main>
      {/* Order matches sitemap.md exactly */}
      <HeroSection />
      <FeaturesSection />
      <CTASection />
    </main>
  )
}
```

```typescript
// src/app/(pages)/blog/page.tsx
import { PostList } from '@features/blog/components'

export default function BlogPage() {
  return <PostList />
}
```

### Step 6: Responsive & Animation

- Implement ALL breakpoints from design.md using Tailwind responsive prefixes
- Add animations specified in design.md using:
  - CSS transitions for simple hover/focus states
  - Framer Motion for complex animations (page transitions, scroll reveals, stagger)
  - `next/image` blur placeholder for image loading

---

## Pexels Image Query Strategy

When building sections, choose Pexels search queries that match the website's THEME:

| Website Type     | Example Queries                                          |
|------------------|----------------------------------------------------------|
| Restaurant       | "restaurant interior", "food plating", "chef cooking"    |
| Tech/SaaS        | "modern office", "technology abstract", "team meeting"   |
| E-commerce       | "product photography", "shopping lifestyle", "packaging" |
| Portfolio        | "creative workspace", "design studio", "art gallery"     |
| Travel           | "landscape travel", "beach sunset", "mountain adventure" |
| Real Estate      | "modern house interior", "luxury apartment", "garden"    |
| Education        | "students studying", "classroom", "library books"        |
| Healthcare       | "medical office", "wellness nature", "healthy lifestyle" |

```
RULE: Match query to SPECIFIC section content, not generic keywords.
Hero section about coffee shop → "artisan coffee brewing" NOT "coffee"
About section with team → "diverse team collaboration" NOT "people"
```

---

## API Route Pattern (BE — Thin Controller)

```
RULE: API route = controller. Không chứa logic.
Validate → gọi service → format response → return.
```

```typescript
// src/app/api/blog/route.ts — EXAMPLE
import { NextRequest, NextResponse } from 'next/server'
import { BlogService } from '@features/blog/services/blog.service'
import { createPostSchema } from '@features/blog/services/blog.validation'
import { apiSuccess, apiError } from '@core/utils/api-response'

export async function GET(req: NextRequest) {
  try {
    const page = Number(req.nextUrl.searchParams.get('page')) || 1
    const data = await BlogService.list({ page })
    return NextResponse.json(apiSuccess(data))
  } catch (err) {
    return NextResponse.json(apiError(err), { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const validated = createPostSchema.parse(body)
    const post = await BlogService.create(validated)
    return NextResponse.json(apiSuccess(post), { status: 201 })
  } catch (err) {
    return NextResponse.json(apiError(err), { status: 400 })
  }
}
```

```typescript
// src/features/blog/services/blog.service.ts — EXAMPLE
import { db } from '@core/database/prisma.client'
import { CreatePostDto, UpdatePostDto } from './blog.dto'

export class BlogService {
  static async list({ page = 1, perPage = 10 }) {
    const [posts, total] = await Promise.all([
      db.post.findMany({
        skip: (page - 1) * perPage,
        take: perPage,
        orderBy: { createdAt: 'desc' },
        include: { category: true },
      }),
      db.post.count(),
    ])
    return { posts, total, page, perPage }
  }

  static async create(dto: CreatePostDto) {
    return db.post.create({ data: dto })
  }

  static async getBySlug(slug: string) {
    return db.post.findUnique({ where: { slug }, include: { category: true } })
  }

  static async update(id: string, dto: UpdatePostDto) {
    return db.post.update({ where: { id }, data: dto })
  }

  static async delete(id: string) {
    return db.post.delete({ where: { id } })
  }
}
```

---

## Environment Variables

**.env.example:**
```
# Database
DATABASE_URL="mysql://root:root@localhost:3306/webdb"

# Pexels
PEXELS_API_KEY="your_pexels_api_key_here"

# NextAuth (if needed)
NEXTAUTH_SECRET=""
NEXTAUTH_URL="http://localhost:3000"
```

---

## Code Quality Rules

1. **TypeScript strict mode** — No `any` types. Define interfaces for all data shapes.
2. **Server Components by default** — Use `'use client'` only when needed (interactivity, hooks).
3. **Loading/Error states** — Every page has `loading.tsx` and `error.tsx`.
4. **SEO** — Every page exports `metadata` with title, description, og:image.
5. **Accessibility** — Semantic HTML, ARIA labels, keyboard navigation, color contrast.
6. **Performance** — `next/image` for all images, dynamic imports for heavy components, ISR where applicable.

---

## Build Checklist

Before delivering code, verify:

- [ ] All design tokens from design.md are in tailwind.config.ts and globals.css
- [ ] All pages from sitemap.md exist with correct routes in app/(pages)/
- [ ] Each page in sitemap.md has a matching feature module in src/features/
- [ ] All sections per page match sitemap.md order and hierarchy
- [ ] Feature modules contain: components/, services/, types, validation
- [ ] No business logic in app/ layer (pages + API routes are thin)
- [ ] No cross-feature imports (feature A never imports from feature B)
- [ ] Each file ≤ 120 lines
- [ ] Pexels images use contextual queries matching content theme
- [ ] Prisma schema covers all data models needed by features
- [ ] API routes delegate to feature services
- [ ] Responsive breakpoints match design.md
- [ ] Navigation matches sitemap.md flow
- [ ] tsconfig.json has @core/* and @features/* path aliases
- [ ] .env.example has all required variables documented
- [ ] docker-compose.yml works for local MySQL
- [ ] `npm run build` passes with no errors
