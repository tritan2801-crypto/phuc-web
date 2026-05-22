import { db } from '@core/database/prisma.client'
import { NextResponse } from 'next/server'
import { DeliveryType } from '@core/database/enums'
import { MOCK_PRODUCTS } from '@core/constants/mock-data'


export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { cartItems, chosenTruckType } = body

    if (!cartItems || !Array.isArray(cartItems)) {
      return NextResponse.json({ error: 'Invalid cartItems' }, { status: 400 })
    }

    const TRUCK_LIMITS: { [key: string]: number } = {
      'TRUCK_1_5T': 1500, // kg
      'TRUCK_5T': 5000,   // kg
    }

    const maxCapacity = TRUCK_LIMITS[chosenTruckType]
    if (!maxCapacity) {
      return NextResponse.json({
        status: 'NO_TRUCK',
        message: 'No truck selected. Standard lightweight shipping rules apply.',
        suggestions: []
      })
    }

    // Map IDs as strings matching the schema and frontend keys
    const productIds = cartItems.map((item: any) => item.id).filter((id: any) => typeof id === 'string')

    let dbProducts: any[] = []
    let accessories: any[] = []

    try {
      // Fetch product details from DB to get accurate weights
      dbProducts = await db.product.findMany({
        where: { id: { in: productIds } }
      })

      // Fetch possible accessories to suggest
      accessories = await db.product.findMany({
        where: {
          deliveryType: DeliveryType.LIGHT,
          id: { notIn: productIds }
        }
      })
    } catch (dbError) {
      console.warn('Prisma database offline, falling back to mock products logic:', dbError)
      // Fallback in-memory dataset mapping weights from string tags (e.g. '48 kg' -> 48.0)
      const fallbackProducts = MOCK_PRODUCTS.map(p => ({
        id: p.id,
        sku: p.specs['Mã sản phẩm'] || `SKU-${p.id.toUpperCase()}`,
        name: p.name,
        weight: p.weight ? parseFloat(p.weight.replace(/[^\d.]/g, '')) : 0.1,
        deliveryType: (p.category === 'may-moc' || p.id === 'chat-tang-cung-lithium' || p.id === 'son-epoxy-tu-san') ? DeliveryType.HEAVY : DeliveryType.LIGHT,
        price: p.price,
        agentPrice: p.agentPrice
      }))

      dbProducts = fallbackProducts.filter(p => productIds.includes(p.id))
      accessories = fallbackProducts.filter(p => p.deliveryType === DeliveryType.LIGHT && !productIds.includes(p.id))
    }

    // Calculate current cart weight
    let currentWeight = 0
    for (const item of cartItems) {
      const dbProd = dbProducts.find((p) => p.id === item.id)
      const weight = dbProd ? dbProd.weight : (item.weight || 0.1)
      currentWeight += weight * item.quantity
    }

    const remainingCapacity = maxCapacity - currentWeight

    // Case 1: Overloaded
    if (remainingCapacity < 0) {
      if (chosenTruckType === 'TRUCK_1_5T') {
        return NextResponse.json({
          status: 'OVERLOADED',
          currentWeight,
          maxCapacity,
          remainingCapacity,
          message: `Khối lượng hàng (${currentWeight.toFixed(1)}kg) đã vượt quá tải trọng xe 1.5 Tấn (${maxCapacity}kg). Đề xuất đổi lên xe tải 5 Tấn để vận chuyển an toàn.`,
          suggestUpgrade: true,
          suggestions: []
        })
      } else {
        return NextResponse.json({
          status: 'OVERLOADED',
          currentWeight,
          maxCapacity,
          remainingCapacity,
          message: `Khối lượng hàng (${currentWeight.toFixed(1)}kg) đã vượt quá tải trọng tối đa của xe 5 Tấn (${maxCapacity}kg). Vui lòng tách đơn hàng hoặc liên hệ Sale để thuê xe chuyên dụng.`,
          suggestUpgrade: false,
          suggestions: []
        })
      }
    }

    // Case 2: Within capacity limits -> Suggest light accessories to optimize capacity
    // Filter and build suggestion list
    const validAccessories = accessories.filter(acc => acc.weight <= remainingCapacity)
    
    // Sort accessories: lightweight but valuable first
    validAccessories.sort((a, b) => b.weight - a.weight)

    const suggestions = []
    let currentRemaining = remainingCapacity

    for (const acc of validAccessories) {
      if (currentRemaining <= 0.05) break;

      const maxQtyPossible = Math.floor(currentRemaining / acc.weight)
      if (maxQtyPossible > 0) {
        // Recommend up to 10 units or max possible
        const recommendedQty = Math.min(maxQtyPossible, 10)
        if (recommendedQty > 0) {
          suggestions.push({
            id: acc.id,
            sku: acc.sku,
            name: acc.name,
            weight: acc.weight,
            price: acc.price || (acc.weight * 300000 + 50000), // Dynamic pricing fallback
            recommendedQty,
            itemTotalWeight: acc.weight * recommendedQty
          })
          currentRemaining -= acc.weight * recommendedQty
        }
      }
    }

    return NextResponse.json({
      status: 'OPTIMIZED',
      currentWeight,
      maxCapacity,
      remainingCapacity,
      suggestions
    })

  } catch (error: any) {
    console.error('Error in cargo-optimize API:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
