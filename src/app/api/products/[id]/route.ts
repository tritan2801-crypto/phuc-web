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

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    // Check if product was deleted in offline simulation mode
    const globalForSimulated = globalThis as any
    const deletedIds = globalForSimulated.deletedMockProductIds || new Set()
    if (deletedIds.has(id)) {
      return NextResponse.json({ error: 'Không tìm thấy sản phẩm (Đã xóa ở chế độ Offline)' }, { status: 404 })
    }

    try {
      const dbProd = await db.product.findUnique({
        where: { id }
      })

      if (dbProd) {
        let parsedFeatures: string[] = []
        let parsedSpecs: Record<string, string> = {}
        
        try {
          parsedFeatures = dbProd.features ? JSON.parse(dbProd.features) : []
          parsedSpecs = dbProd.specs ? JSON.parse(dbProd.specs) : {}
        } catch (e) {
          // Ignore
        }

        return NextResponse.json({
          product: {
            id: dbProd.id,
            sku: dbProd.sku,
            name: dbProd.name,
            weight: dbProd.weight ? `${dbProd.weight} kg` : undefined,
            deliveryType: dbProd.deliveryType,
            price: dbProd.price,
            agentPrice: dbProd.agentPrice,
            category: dbProd.category,
            subCategory: dbProd.subCategory || undefined,
            brand: dbProd.brand || 'Khang Phúc',
            image: dbProd.image || 'construction floor grinder machinery',
            description: dbProd.description || '',
            features: parsedFeatures,
            specs: parsedSpecs
          }
        })
      }
    } catch (dbError) {
      console.warn('Prisma database offline during GET product details:', dbError)
      
      const offlineProds = globalForSimulated.simulatedProducts || []
      const offlineProd = offlineProds.find((p: any) => p.id === id)
      if (offlineProd) {
        return NextResponse.json({ product: offlineProd })
      }
    }

    // Fallback search in mock data
    const mockProd = MOCK_PRODUCTS.find((p) => p.id === id)
    if (mockProd) {
      return NextResponse.json({ product: mockProd })
    }

    return NextResponse.json({ error: 'Không tìm thấy sản phẩm' }, { status: 404 })
  } catch (error) {
    return NextResponse.json({ error: 'Đã xảy ra lỗi hệ thống' }, { status: 500 })
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // 1. Authenticate Admin
    const isAuthorized = await isAdminRequest()
    if (!isAuthorized) {
      return NextResponse.json({ error: 'Không có quyền truy cập' }, { status: 403 })
    }

    const { id } = await params
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

    const parsedWeight = parseFloat(weight) || 0.1
    const deliveryType = (category === 'may-moc' || id.includes('may') || parsedWeight >= 15.0) ? 'HEAVY' : 'LIGHT'

    const featuresString = Array.isArray(features) ? JSON.stringify(features) : JSON.stringify([])
    const specsString = typeof specs === 'object' ? JSON.stringify(specs) : JSON.stringify({})

    const updateData = {
      sku: sku || `SKU-${id.toUpperCase()}`,
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
      const updated = await db.product.update({
        where: { id },
        data: updateData
      })

      return NextResponse.json({
        message: 'Cập nhật sản phẩm thành công',
        product: updated
      })
    } catch (dbError) {
      console.warn('Prisma database offline during product update, simulating success:', dbError)
      
      const globalForSimulated = globalThis as any
      if (!globalForSimulated.simulatedProducts) {
        globalForSimulated.simulatedProducts = []
      }

      const mappedSimulated = {
        id,
        sku: sku || `SKU-${id.toUpperCase()}`,
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

      const index = globalForSimulated.simulatedProducts.findIndex((p: any) => p.id === id)
      if (index > -1) {
        globalForSimulated.simulatedProducts[index] = mappedSimulated
      } else {
        globalForSimulated.simulatedProducts.push(mappedSimulated)
      }
      
      return NextResponse.json({
        message: 'Cập nhật sản phẩm thành công (Chế độ Demo - Database Offline)',
        product: mappedSimulated
      })
    }

  } catch (error) {
    return NextResponse.json({ error: 'Đã xảy ra lỗi hệ thống' }, { status: 500 })
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // 1. Authenticate Admin
    const isAuthorized = await isAdminRequest()
    if (!isAuthorized) {
      return NextResponse.json({ error: 'Không có quyền truy cập' }, { status: 403 })
    }

    const { id } = await params

    try {
      await db.product.delete({
        where: { id }
      })

      return NextResponse.json({ message: 'Xóa sản phẩm thành công' })
    } catch (dbError) {
      console.warn('Prisma database offline during product deletion, simulating success:', dbError)
      
      const globalForSimulated = globalThis as any
      if (!globalForSimulated.simulatedProducts) {
        globalForSimulated.simulatedProducts = []
      }
      globalForSimulated.simulatedProducts = globalForSimulated.simulatedProducts.filter((p: any) => p.id !== id)
      
      if (!globalForSimulated.deletedMockProductIds) {
        globalForSimulated.deletedMockProductIds = new Set()
      }
      globalForSimulated.deletedMockProductIds.add(id)

      return NextResponse.json({
        message: 'Xóa sản phẩm thành công (Chế độ Demo - Database Offline)'
      })
    }

  } catch (error) {
    return NextResponse.json({ error: 'Đã xảy ra lỗi hệ thống' }, { status: 500 })
  }
}
