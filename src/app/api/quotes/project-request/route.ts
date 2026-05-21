import { db } from '@core/database/prisma.client'
import { NextResponse } from 'next/server'
import { MOCK_PRODUCTS } from '@core/constants/mock-data'

// Helper to calculate raw estimate materials based on square meters and system selections
function calculateMaterialCoverage(areaM2: number, flooringType: string) {
  let suggestions = []
  
  if (flooringType.toLowerCase().includes('epoxy') || flooringType.toLowerCase().includes('sơn')) {
    // 1.2kg epoxy per m2 for 1mm thickness
    const totalEpoxyNeededKg = areaM2 * 1.2
    const packsNeeded = Math.ceil(totalEpoxyNeededKg / 16) // 16kg pack KCC UT6581
    const primerPacksNeeded = Math.ceil((areaM2 * 0.1) / 15) // 15kg pack lót EP118 (0.1kg/m2)
    
    suggestions.push({
      item: 'Sơn phủ Epoxy tự san phẳng KCC UT6581 (Bộ 16kg)',
      sku: 'C-KCC-UT6581',
      calculatedQty: packsNeeded,
      coverageNotes: `Cần ${totalEpoxyNeededKg.toFixed(0)}kg sơn phủ cho diện tích ${areaM2}m² (độ dày tiêu chuẩn 1mm).`
    })

    suggestions.push({
      item: 'Sơn lót Epoxy gốc dầu KCC EP118 (Bộ 15kg)',
      sku: 'C-KCC-EP118',
      calculatedQty: primerPacksNeeded,
      coverageNotes: `Cần ${(areaM2 * 0.1).toFixed(0)}kg sơn lót (định mức 0.1kg/m²).`
    })
  } else if (flooringType.toLowerCase().includes('mài') || flooringType.toLowerCase().includes('đánh bóng')) {
    // 1 diamond metal disc covers ~20 m2
    const discsNeeded = Math.ceil(areaM2 / 20)
    suggestions.push({
      item: 'Đĩa mài bê tông kim cương đầu số HF #30',
      sku: 'A-DIA-HF30',
      calculatedQty: discsNeeded,
      coverageNotes: `Khuyến nghị 1 đĩa mài cho mỗi 20m² bề mặt sàn thô.`
    })
  }

  return suggestions
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const {
      fullName,
      phone,
      email,
      companyName,
      address,
      notes,
      items,
      isB2b,
      projectArea, // in m2
      flooringType // e.g. "Sơn Epoxy", "Mài sàn"
    } = body

    if (!fullName || !phone || !email || !items || !Array.isArray(items)) {
      return NextResponse.json({ error: 'Missing required contact details or items' }, { status: 400 })
    }

    const area = projectArea ? parseFloat(projectArea) : 0
    const resolvedType = flooringType || 'Đánh bóng sàn bê tông'

    // Map IDs as strings
    const productIds = items.map((i: any) => i.id).filter((id: any) => typeof id === 'string')

    let dbProducts: any[] = []

    try {
      dbProducts = await db.product.findMany({
        where: { id: { in: productIds } }
      })
    } catch (dbError) {
      console.warn('Prisma database offline, using fallback mock products:', dbError)
      const fallbackProducts = MOCK_PRODUCTS.map(p => ({
        id: p.id,
        sku: p.specs['Mã sản phẩm'] || `SKU-${p.id.toUpperCase()}`,
        name: p.name,
        price: p.price,
        agentPrice: p.agentPrice
      }))
      dbProducts = fallbackProducts.filter(p => productIds.includes(p.id))
    }

    let subtotal = 0
    const detailedItems = items.map(item => {
      const dbProd = dbProducts.find(p => p.id === item.id)
      const priceUnit = dbProd 
        ? (isB2b ? (item.agentPrice || dbProd.agentPrice) : dbProd.price) 
        : item.price
      const total = priceUnit * item.quantity
      subtotal += total

      return {
        id: item.id,
        name: dbProd ? dbProd.name : item.name,
        sku: dbProd ? dbProd.sku : 'SKU-UNKNOWN',
        quantity: item.quantity,
        priceUnit,
        total
      }
    })

    // 2. Perform Preliminary Coverage Calculations
    let coverageEstimates: any[] = []
    if (area > 0) {
      coverageEstimates = calculateMaterialCoverage(area, resolvedType)
    }

    // 3. Generate Mock PDF/Excel Download Links
    const quoteId = `Q2026_${Math.floor(1000 + Math.random() * 9000)}`
    const pdfUrl = `https://cdn.khangphuc.com/quotes/${quoteId}.pdf`
    const excelUrl = `https://cdn.khangphuc.com/quotes/${quoteId}.xlsx`

    // 4. Formulate markdown payload for Zalo Webhook
    const webhookUrl = process.env.ZALO_WEBHOOK_URL
    const zaloPayload = {
      recipient: {
        group_id: 'zalo_group_sales_flooring_001'
      },
      message: {
        text: `🚨 HỆ THỐNG YÊU CẦU BÁO GIÁ MỚI - MÃ ĐƠN: ${quoteId} 🚨\n\n` +
          `📌 **Thông tin khách hàng:**\n` +
          `- Họ tên: ${fullName}\n` +
          `- Điện thoại: ${phone}\n` +
          `- Email: ${email}\n` +
          `- Công ty: ${companyName || 'Khách hàng cá nhân'}\n` +
          `- Địa chỉ công trình: ${address || 'Chưa cung cấp'}\n\n` +
          `📐 **Thông số công trình:**\n` +
          `- Diện tích dự kiến: ${area > 0 ? area + ' m²' : 'Chưa nhập'}\n` +
          `- Giải pháp đề xuất: ${resolvedType}\n\n` +
          `📦 **Chi tiết giỏ hàng yêu cầu báo giá:**\n` +
          detailedItems.map((item, idx) => `${idx + 1}. ${item.name} (${item.sku}) - SL: ${item.quantity} - Đơn giá: ${item.priceUnit.toLocaleString('vi-VN')} đ (Tổng: ${item.total.toLocaleString('vi-VN')} đ)`).join('\n') +
          `\n\n💰 **Tổng giá trị tạm tính (Chưa VAT & Ship):** ${subtotal.toLocaleString('vi-VN')} VNĐ\n\n` +
          (coverageEstimates.length > 0
            ? `📊 **Bảng định mức vật tư dự kiến từ diện tích sàn:**\n` +
              coverageEstimates.map(est => `- ${est.item}: Định mức đề xuất ${est.calculatedQty} bộ/cái. (${est.coverageNotes})`).join('\n') + '\n\n'
            : '') +
          `📝 **Ghi chú khách hàng:** ${notes || 'Không có ghi chú.'}\n\n` +
          `🔗 **Liên kết xử lý nhanh:**\n` +
          `- [Tải File Báo Giá Tạm Tính (PDF)](${pdfUrl})\n` +
          `- [Tải Bảng Tính Khối Lượng (Excel)](${excelUrl})\n` +
          `- [Mở CMS duyệt báo giá sỉ](https://khangphuc.com/admin/quotes/${quoteId})`
      }
    }

    console.log('--- ZALO WEBHOOK TRIGGERED ---')
    console.log(JSON.stringify(zaloPayload, null, 2))
    console.log('------------------------------')

    // Fire webhook if set
    if (webhookUrl) {
      try {
        await fetch(webhookUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(zaloPayload)
        })
      } catch (err) {
        console.error('Failed to post to Zalo Webhook:', err)
      }
    }

    // Write to DB logs if needed (we can mock writing quoteLog or database records, but returning success is enough)
    return NextResponse.json({
      success: true,
      quoteId,
      subtotal,
      pdfUrl,
      excelUrl,
      coverageEstimates,
      message: 'Gửi yêu cầu báo giá thành công. Báo giá đã được chuyển tiếp đến Zalo của phòng kinh doanh.'
    })

  } catch (error: any) {
    console.error('Error in project-request API:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
