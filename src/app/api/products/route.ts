import { db } from '@core/database/prisma.client'
import { MOCK_PRODUCTS } from '@core/constants/mock-data'
import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'

// Helper function to decode session token and check if Admin
async function isAdminRequest(): Promise<boolean> {
  try {
    const cookieStore = await cookies()
    const sessionCookie = cookieStore.get('session_token')
    if (!sessionCookie || !sessionCookie.value) return false
    const decodedString = Buffer.from(sessionCookie.value, 'base64').toString('utf-8')
    const user = JSON.parse(decodedString)
    return user.role === 'ADMIN'
  } catch {
    return false
  }
}

export async function GET() {
  try {
    let mergedProducts = [...MOCK_PRODUCTS]

    try {
      const dbProducts = await db.product.findMany()
      
      if (dbProducts.length > 0) {
        dbProducts.forEach((dbProd: any) => {
          let parsedFeatures: string[] = []
          let parsedSpecs: Record<string, string> = {}
          
          try {
            parsedFeatures = dbProd.features ? JSON.parse(dbProd.features) : []
            parsedSpecs = dbProd.specs ? JSON.parse(dbProd.specs) : {}
          } catch (e) {
            // Ignore parse errors
          }

          const mapped = {
            id: dbProd.id,
            name: dbProd.name,
            category: dbProd.category,
            subCategory: dbProd.subCategory || undefined,
            brand: dbProd.brand || 'Khang Phúc',
            price: dbProd.price,
            agentPrice: dbProd.agentPrice,
            weight: dbProd.weight ? `${dbProd.weight} kg` : undefined,
            image: dbProd.image || 'construction floor grinder machinery',
            description: dbProd.description || '',
            features: parsedFeatures,
            specs: parsedSpecs,
            stock: 10,
            inStock: true,
            warehouse: ['Hà Nội', 'TP. HCM']
          }

          const index = mergedProducts.findIndex((p) => p.id === dbProd.id)
          if (index > -1) {
            mergedProducts[index] = mapped
          } else {
            // Put custom products at the beginning so the admin sees them instantly
            mergedProducts.unshift(mapped)
          }
        })
      }
    } catch (dbError) {
      console.warn('Prisma database offline during GET /api/products, falling back to mock products:', dbError)
      
      // Merge in-memory simulated products
      const globalForSimulated = globalThis as any
      const offlineProds = globalForSimulated.simulatedProducts || []
      offlineProds.forEach((offlineProd: any) => {
        const index = mergedProducts.findIndex((p) => p.id === offlineProd.id)
        if (index > -1) {
          mergedProducts[index] = offlineProd
        } else {
          mergedProducts.unshift(offlineProd)
        }
      })
    }

    return NextResponse.json({ products: mergedProducts })
  } catch (error) {
    return NextResponse.json({ error: 'Đã xảy ra lỗi hệ thống' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    // 1. Authenticate Admin
    const isAuthorized = await isAdminRequest()
    if (!isAuthorized) {
      return NextResponse.json({ error: 'Không có quyền truy cập' }, { status: 403 })
    }

    const body = await request.json()
    const {
      name,
      sku,
      price,
      agentPrice,
      weight,
      category,
      subCategory,
      brand,
      image,
      description,
      features,
      specs
    } = body

    if (!name || !price || !category) {
      return NextResponse.json({ error: 'Tên, giá và danh mục là bắt buộc' }, { status: 400 })
    }

    const cleanId = name.toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/đ/g, 'd')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '')

    const productSku = sku || `SKU-${cleanId.toUpperCase()}-${Date.now().toString().slice(-4)}`
    const parsedWeight = parseFloat(weight) || 0.1
    const deliveryType = (category === 'may-moc' || cleanId.includes('may') || parsedWeight >= 15.0) ? 'HEAVY' : 'LIGHT'

    const featuresString = Array.isArray(features) ? JSON.stringify(features) : JSON.stringify([])
    const specsString = typeof specs === 'object' ? JSON.stringify(specs) : JSON.stringify({})

    let productData = {
      id: cleanId,
      sku: productSku,
      name,
      weight: parsedWeight,
      deliveryType: deliveryType as any,
      price: parseFloat(price) || 0,
      agentPrice: parseFloat(agentPrice) || parseFloat(price) || 0,
      category,
      subCategory: subCategory || null,
      brand: brand || 'Khang Phúc',
      image: image || 'construction floor grinder machinery',
      description: description || '',
      features: featuresString,
      specs: specsString
    }

    try {
      const created = await db.product.create({
        data: productData
      })

      // Try creating inventory levels if possible
      try {
        await db.inventoryLevel.createMany({
          data: [
            { productId: created.id, warehouseId: 'KHO_HCM', stockQty: 10, reservedQty: 0 },
            { productId: created.id, warehouseId: 'KHO_HN', stockQty: 8, reservedQty: 0 }
          ]
        })
      } catch (e) {
        console.warn('Could not create default inventory levels during product creation', e)
      }

      return NextResponse.json({
        message: 'Thêm sản phẩm thành công',
        product: created
      })
    } catch (dbError) {
      console.warn('Prisma database offline during product creation, simulating success:', dbError)
      
      // Save to global simulated products
      const globalForSimulated = globalThis as any
      if (!globalForSimulated.simulatedProducts) {
        globalForSimulated.simulatedProducts = []
      }
      
      const mappedSimulated = {
        id: cleanId,
        sku: productSku,
        name,
        category,
        subCategory: subCategory || undefined,
        brand: brand || 'Khang Phúc',
        price: parseFloat(price) || 0,
        agentPrice: parseFloat(agentPrice) || parseFloat(price) || 0,
        weight: parsedWeight ? `${parsedWeight} kg` : undefined,
        image: image || 'construction floor grinder machinery',
        description: description || '',
        features: Array.isArray(features) ? features : [],
        specs: typeof specs === 'object' ? specs : {},
        stock: 10,
        inStock: true,
        warehouse: ['Hà Nội', 'TP. HCM']
      }

      // Check if it already exists to overwrite or push
      const index = globalForSimulated.simulatedProducts.findIndex((p: any) => p.id === cleanId)
      if (index > -1) {
        globalForSimulated.simulatedProducts[index] = mappedSimulated
      } else {
        globalForSimulated.simulatedProducts.push(mappedSimulated)
      }

      return NextResponse.json({
        message: 'Thêm sản phẩm thành công (Chế độ Demo - Database Offline)',
        product: mappedSimulated
      })
    }

  } catch (error) {
    return NextResponse.json({ error: 'Đã xảy ra lỗi máy chủ' }, { status: 500 })
  }
}
