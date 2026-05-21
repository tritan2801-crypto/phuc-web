import { PrismaClient, DeliveryType, CustomerType, InvoiceStatus, VehicleType } from '@prisma/client'
import { MOCK_PRODUCTS } from '../src/@core/constants/mock-data'
import crypto from 'crypto'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Starting database seeding with String IDs...')

  // 1. CLEAR EXISTING DATA (Reverse dependency order)
  await prisma.heavyShippingRule.deleteMany()
  await prisma.invoice.deleteMany()
  await prisma.wholesaleProfile.deleteMany()
  await prisma.customer.deleteMany()
  await prisma.comboItem.deleteMany()
  await prisma.combo.deleteMany()
  await prisma.inventoryLevel.deleteMany()
  await prisma.product.deleteMany()
  await prisma.warehouse.deleteMany()
  await prisma.user.deleteMany()

  console.log('🗑️  Cleared existing database records.')

  // 2. SEED USERS
  const adminPasswordHash = crypto.createHash('sha256').update('admin123').digest('hex')
  const userPasswordHash = crypto.createHash('sha256').update('user123').digest('hex')

  await prisma.user.createMany({
    data: [
      {
        email: 'admin@khangphuc.com',
        password: adminPasswordHash,
        name: 'Khang Phúc Admin',
        role: 'ADMIN',
      },
      {
        email: 'user@khangphuc.com',
        password: userPasswordHash,
        name: 'Đại lý Khang Phúc B2B',
        role: 'USER',
      },
    ],
  })
  console.log('👤 Seeded 2 users (admin@khangphuc.com / admin123, user@khangphuc.com / user123).')

  // 3. SEED WAREHOUSES
  const hcmWarehouse = await prisma.warehouse.create({
    data: {
      id: 'KHO_HCM',
      name: 'Kho Khang Phúc TP. Hồ Chí Minh',
      code: 'KHO_HCM',
      address: '124 Lũy Bán Bích, Tân Thới Hòa, Tân Phú, TP. HCM',
      city: 'Ho Chi Minh',
      isActive: true,
    },
  })

  const hnWarehouse = await prisma.warehouse.create({
    data: {
      id: 'KHO_HN',
      name: 'Kho Khang Phúc Hà Nội',
      code: 'KHO_HN',
      address: 'Ngõ 286 Nguyễn Xiển, Thanh Xuân, Hà Nội',
      city: 'Ha Noi',
      isActive: true,
    },
  })

  console.log('🏢 Seeded 2 warehouses (HCM, Hanoi).')

  // 4. SEED PRODUCTS FROM MOCK_PRODUCTS
  const seededProducts: { [key: string]: any } = {}
  for (const item of MOCK_PRODUCTS) {
    // Parse weight from string like "48 kg"
    let parsedWeight = 0.1
    if (item.weight) {
      const match = item.weight.match(/[\d.]+/)
      if (match) {
        parsedWeight = parseFloat(match[0])
      }
    }
    // Determine delivery type
    const isHeavy = item.category === 'may-moc' || item.id === 'chat-tang-cung-lithium' || item.id === 'son-epoxy-tu-san' || item.subCategory === 'son-pu'
    const deliveryType = isHeavy ? DeliveryType.HEAVY : DeliveryType.LIGHT

    const product = await prisma.product.create({
      data: {
        id: item.id,
        sku: item.specs && item.specs['Mã sản phẩm'] ? item.specs['Mã sản phẩm'] : `SKU-${item.id.toUpperCase()}`,
        name: item.name,
        weight: parsedWeight,
        deliveryType: deliveryType,
        price: item.price,
        agentPrice: item.agentPrice,
        category: item.category,
        subCategory: item.subCategory || null,
        brand: item.brand,
        image: item.image,
        description: item.description,
        features: JSON.stringify(item.features),
        specs: JSON.stringify(item.specs),
      },
    })
    seededProducts[item.id] = product
  }

  console.log(`📦 Seeded ${MOCK_PRODUCTS.length} products dynamically.`)

  // 5. SEED INVENTORY LEVELS
  for (const product of Object.values(seededProducts)) {
    const isHeavy = product.deliveryType === DeliveryType.HEAVY
    
    // HCM Warehouse Stock
    await prisma.inventoryLevel.create({
      data: {
        productId: product.id,
        warehouseId: hcmWarehouse.id,
        stockQty: isHeavy ? 15 : 450,
        reservedQty: 1,
      },
    })

    // Hanoi Warehouse Stock
    await prisma.inventoryLevel.create({
      data: {
        productId: product.id,
        warehouseId: hnWarehouse.id,
        stockQty: isHeavy ? 9 : 320,
        reservedQty: 0,
      },
    })
  }

  console.log('📊 Seeded inventory stock levels for all warehouses.')

  // 6. SEED HEAVY SHIPPING RULES
  await prisma.heavyShippingRule.createMany({
    data: [
      // HCM Warehouse Shipping Rules
      {
        id: 'RULE_HCM_1_5T',
        warehouseId: hcmWarehouse.id,
        vehicleType: VehicleType.TRUCK_1_5T,
        maxWeightKg: 1500.0,
        baseFare: 500000.0,
        perKmRate: 20000.0,
        minDistanceKm: 5.0,
      },
      {
        id: 'RULE_HCM_5T',
        warehouseId: hcmWarehouse.id,
        vehicleType: VehicleType.TRUCK_5T,
        maxWeightKg: 5000.0,
        baseFare: 1200000.0,
        perKmRate: 35000.0,
        minDistanceKm: 5.0,
      },
      // Hanoi Warehouse Shipping Rules
      {
        id: 'RULE_HN_1_5T',
        warehouseId: hnWarehouse.id,
        vehicleType: VehicleType.TRUCK_1_5T,
        maxWeightKg: 1500.0,
        baseFare: 450000.0,
        perKmRate: 18000.0,
        minDistanceKm: 5.0,
      },
      {
        id: 'RULE_HN_5T',
        warehouseId: hnWarehouse.id,
        vehicleType: VehicleType.TRUCK_5T,
        maxWeightKg: 5000.0,
        baseFare: 1100000.0,
        perKmRate: 32000.0,
        minDistanceKm: 5.0,
      },
    ],
  })

  console.log('🚚 Seeded heavy shipping truck fare rules.')

  // 7. SEED COMBOS (Matching frontend keys)
  const grinderCombo = await prisma.combo.create({
    data: {
      id: 'combo-setup-xuong-mai',
      name: 'Combo Setup Xưởng Mài & Đánh Bóng Bê Tông Toàn Diện',
      slug: 'combo-setup-xuong-mai',
      discountPercentage: 15.00,
      description: 'Trang bị tối tân nhất cho các công ty bắt đầu dịch vụ mài tăng cứng bóng sàn, setup chuẩn mực 1 mài hành tinh lớn 3 pha + 1 hút bụi công nghiệp lốc xoáy + bộ đĩa mài phủ đầy đủ các grit.',
    },
  })

  await prisma.comboItem.createMany({
    data: [
      { comboId: grinderCombo.id, productId: 'may-mai-asl-600', quantity: 1, isOptional: false },
      { comboId: grinderCombo.id, productId: 'may-hut-bui-kms-80', quantity: 2, isOptional: false },
      { comboId: grinderCombo.id, productId: 'chat-tang-cung-lithium', quantity: 5, isOptional: false },
      { comboId: grinderCombo.id, productId: 'dia-mai-kim-cuong-30', quantity: 50, isOptional: true },
    ],
  })

  const epoxyCombo = await prisma.combo.create({
    data: {
      id: 'combo-thi-cong-epoxy',
      name: 'Combo Thi Công Sơn Epoxy Nhà Xưởng Chuyên Nghiệp',
      slug: 'combo-thi-cong-epoxy',
      discountPercentage: 12.00,
      description: 'Giải pháp trọn gói đồng bộ cho nhà thầu thi công sơn Epoxy hệ lăn 3 lớp cho diện tích từ 500 - 800m2. Gồm máy mài chuẩn bị bề mặt, máy hút bụi công suất lớn và hóa chất sơn nền chính hãng.',
    },
  })

  await prisma.comboItem.createMany({
    data: [
      { comboId: epoxyCombo.id, productId: 'may-mai-kms-250', quantity: 1, isOptional: false },
      { comboId: epoxyCombo.id, productId: 'may-hut-bui-kms-80', quantity: 1, isOptional: false },
      { comboId: epoxyCombo.id, productId: 'dia-mai-kim-cuong-30', quantity: 18, isOptional: false },
      { comboId: epoxyCombo.id, productId: 'son-epoxy-tu-san', quantity: 6, isOptional: false },
    ],
  })

  console.log('🎁 Seeded 2 Solution Combo packages.')

  // 8. SEED B2B CUSTOMERS & WHOLESALE CREDIT
  const b2bCustomer = await prisma.customer.create({
    data: {
      id: 'cust_wholesale_01',
      email: 'agency@khangphuc.com',
      companyName: 'Tổng Công Ty Xây Dựng & Thi Công Sàn Delta Việt Nam',
      taxCode: '0102030405',
      customerType: CustomerType.WHOLESALE,
    },
  })

  await prisma.wholesaleProfile.create({
    data: {
      customerId: b2bCustomer.id,
      creditLimit: 500000000.0,
      outstandingBalance: 120000000.0,
      paymentTermsDays: 30,
      approvedAt: new Date(),
    },
  })

  // Create an unpaid invoice for this B2B client
  await prisma.invoice.create({
    data: {
      id: 'INV_2026_0001',
      orderId: '10452',
      customerId: b2bCustomer.id,
      invoiceAmount: 120000000.0,
      dueDate: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000),
      status: InvoiceStatus.UNPAID,
      paidAmount: 0.0,
    },
  })

  // Retail Customer
  await prisma.customer.create({
    data: {
      id: 'cust_retail_01',
      email: 'khachle@gmail.com',
      companyName: 'Cơ sở Thi công Nhà xưởng Bình Dương',
      customerType: CustomerType.RETAIL,
    },
  })

  console.log('👤 Seeded Wholesale agent customer accounts & initial credit lines.')
  console.log('🏁 Database seeding finished successfully!')
}

main()
  .catch((e) => {
    console.error('❌ Error during seeding:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
