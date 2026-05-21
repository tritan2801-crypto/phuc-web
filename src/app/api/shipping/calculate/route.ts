import { db } from '@core/database/prisma.client'
import { NextResponse } from 'next/server'
import { DeliveryType, VehicleType } from '@prisma/client'
import { MOCK_PRODUCTS } from '@core/constants/mock-data'

// Helper to determine closest warehouse and distance based on Vietnamese address keywords
function geocodeAddress(address: string) {
  const normalized = address.toLowerCase()
  let warehouseCode = 'KHO_HCM' // default
  let distance = 25.0 // default km

  if (
    normalized.includes('hà nội') ||
    normalized.includes('ha noi') ||
    normalized.includes('thanh xuân') ||
    normalized.includes('mỹ đình') ||
    normalized.includes('cầu giấy') ||
    normalized.includes('hải phòng') ||
    normalized.includes('bắc ninh') ||
    normalized.includes('quảng ninh')
  ) {
    warehouseCode = 'KHO_HN'
    if (normalized.includes('hà nội') || normalized.includes('ha noi')) {
      distance = normalized.includes('thanh xuân') ? 3.5 : 12.0
    } else if (normalized.includes('hải phòng')) {
      distance = 105.0
    } else if (normalized.includes('bắc ninh')) {
      distance = 45.0
    } else if (normalized.includes('quảng ninh')) {
      distance = 155.0
    }
  } else {
    warehouseCode = 'KHO_HCM'
    if (normalized.includes('hồ chí minh') || normalized.includes('hcm') || normalized.includes('sài gòn')) {
      distance = normalized.includes('tân phú') ? 2.0 : 15.0
    } else if (normalized.includes('bình dương')) {
      distance = normalized.includes('dĩ an') ? 25.0 : 45.0
    } else if (normalized.includes('đồng nai') || normalized.includes('biên hòa')) {
      distance = 38.0
    } else if (normalized.includes('long an')) {
      distance = 55.0
    }
  }

  return { warehouseCode, distance }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { cartItems, destinationAddress, chosenTruckType } = body

    if (!cartItems || !Array.isArray(cartItems) || !destinationAddress) {
      return NextResponse.json({ error: 'Missing cartItems or destinationAddress' }, { status: 400 })
    }

    // Map IDs as strings
    const productIds = cartItems.map((item: any) => item.id).filter((id: any) => typeof id === 'string')

    let dbProducts: any[] = []
    let isDbOnline = true
    let warehouse: any = null

    const { warehouseCode, distance } = geocodeAddress(destinationAddress)

    try {
      dbProducts = await db.product.findMany({
        where: { id: { in: productIds } }
      })
      warehouse = await db.warehouse.findUnique({
        where: { code: warehouseCode }
      })
    } catch (dbError) {
      console.warn('Prisma database offline, using fallback mock products:', dbError)
      isDbOnline = false
      
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
    }

    const heavyItems: any[] = []
    const lightItems: any[] = []

    for (const item of cartItems) {
      const dbProd = dbProducts.find((p) => p.id === item.id)
      const resolvedItem = {
        id: item.id,
        name: dbProd ? dbProd.name : item.name,
        sku: dbProd ? dbProd.sku : 'SKU-UNKNOWN',
        weight: dbProd ? dbProd.weight : (item.weight || 0.2),
        price: item.price || 0,
        quantity: item.quantity,
        deliveryType: dbProd ? dbProd.deliveryType : DeliveryType.LIGHT
      }

      if (resolvedItem.deliveryType === DeliveryType.HEAVY) {
        heavyItems.push(resolvedItem)
      } else {
        lightItems.push(resolvedItem)
      }
    }

    const warehouseId = warehouse ? warehouse.id : warehouseCode
    const warehouseName = warehouse ? warehouse.name : (warehouseCode === 'KHO_HN' ? 'Kho Khang Phúc Hà Nội' : 'Kho Khang Phúc TP. Hồ Chí Minh')

    let result: any = {
      splitApplied: false,
      warehouseName,
      distanceKm: distance,
      lightShipment: null,
      heavyShipment: null,
      totalShippingFee: 0
    }

    // 2. Scenario A: Light items only -> 3PL (e.g. GHTK)
    if (heavyItems.length === 0) {
      const totalWeight = lightItems.reduce((sum, item) => sum + (item.weight * item.quantity), 0)
      // Mock GHTK formula: 30,000 VND base + 5,000 VND per kg
      const lightFee = 30000 + Math.ceil(totalWeight) * 5000
      
      result.lightShipment = {
        items: lightItems,
        weight: totalWeight,
        fee: lightFee,
        provider: 'Giao Hàng Tiết Kiệm (GHTK)'
      }
      result.totalShippingFee = lightFee
      return NextResponse.json(result)
    }

    // 3. Scenario B: Heavy items present -> Local truck calculation
    const totalHeavyWeight = heavyItems.reduce((sum, item) => sum + (item.weight * item.quantity), 0)
    
    // Select vehicle type
    let vehicleType: VehicleType = VehicleType.TRUCK_1_5T
    let maxWeight = 1500.0

    if (chosenTruckType === 'TRUCK_5T' || totalHeavyWeight > 1500) {
      vehicleType = VehicleType.TRUCK_5T
      maxWeight = 5000.0
    }

    if (totalHeavyWeight > 5000) {
      return NextResponse.json({
        error: `Tổng trọng lượng hàng nặng (${totalHeavyWeight.toFixed(1)}kg) vượt quá tải trọng xe lớn nhất 5 Tấn. Vui lòng tách đơn hàng hoặc liên hệ Sale để thương lượng xe chuyên dụng.`
      }, { status: 400 })
    }

    // Query truck pricing rule
    let shipRule: any = null
    if (isDbOnline) {
      try {
        shipRule = await db.heavyShippingRule.findFirst({
          where: {
            warehouseId,
            vehicleType
          }
        })
      } catch (err) {
        console.warn('Failed to query heavy shipping rule, using static fallback:', err)
      }
    }

    if (!shipRule) {
      // Mock heavy shipping rule fallback matching seed rules
      const mockRules = [
        { warehouseId: 'KHO_HCM', vehicleType: VehicleType.TRUCK_1_5T, baseFare: 500000.0, perKmRate: 20000.0, minDistanceKm: 5.0 },
        { warehouseId: 'KHO_HCM', vehicleType: VehicleType.TRUCK_5T, baseFare: 1200000.0, perKmRate: 35000.0, minDistanceKm: 5.0 },
        { warehouseId: 'KHO_HN', vehicleType: VehicleType.TRUCK_1_5T, baseFare: 450000.0, perKmRate: 18000.0, minDistanceKm: 5.0 },
        { warehouseId: 'KHO_HN', vehicleType: VehicleType.TRUCK_5T, baseFare: 1100000.0, perKmRate: 32000.0, minDistanceKm: 5.0 }
      ]
      shipRule = mockRules.find(r => r.warehouseId === warehouseId && r.vehicleType === vehicleType)
    }

    const baseFare = shipRule ? shipRule.baseFare : (vehicleType === VehicleType.TRUCK_1_5T ? 500000 : 1200000)
    const perKmRate = shipRule ? shipRule.perKmRate : (vehicleType === VehicleType.TRUCK_1_5T ? 20000 : 35000)
    const minDistance = shipRule ? shipRule.minDistanceKm : 5.0

    // Compute truck fare
    let heavyFee = baseFare
    if (distance > minDistance) {
      heavyFee += (distance - minDistance) * perKmRate
    }

    // Check if we have light items to consolidate
    if (lightItems.length === 0) {
      result.heavyShipment = {
        items: heavyItems,
        weight: totalHeavyWeight,
        fee: heavyFee,
        vehicleType,
        distance
      }
      result.totalShippingFee = heavyFee
      return NextResponse.json(result)
    }

    // Mixed items consolidation logic
    const totalLightWeight = lightItems.reduce((sum, item) => sum + (item.weight * item.quantity), 0)
    const totalMixedWeight = totalHeavyWeight + totalLightWeight

    if (totalMixedWeight <= maxWeight) {
      // Free consolidation inside the truck since capacity allows
      result.heavyShipment = {
        items: [...heavyItems, ...lightItems],
        weight: totalMixedWeight,
        fee: heavyFee,
        vehicleType,
        distance,
        notes: 'Hàng nhẹ được xếp gộp vào thùng xe tải chở hàng nặng miễn phí.'
      }
      result.totalShippingFee = heavyFee
    } else {
      // Truck capacity exceeded. Must split!
      const lightFee = 30000 + Math.ceil(totalLightWeight) * 5000
      result.splitApplied = true
      result.heavyShipment = {
        items: heavyItems,
        weight: totalHeavyWeight,
        fee: heavyFee,
        vehicleType,
        distance
      }
      result.lightShipment = {
        items: lightItems,
        weight: totalLightWeight,
        fee: lightFee,
        provider: 'Viettel Post (Hàng nhẹ tách riêng)'
      }
      result.totalShippingFee = heavyFee + lightFee
    }

    return NextResponse.json(result)

  } catch (error: any) {
    console.error('Error in shipping calculate API:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
