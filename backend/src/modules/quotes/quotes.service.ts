import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { CreateQuoteDto } from './dto/create-quote.dto';
import { MOCK_PRODUCTS } from '../../constants/mock-data';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class QuotesService {
  constructor(
    private prisma: PrismaService,
    private readonly httpService: HttpService,
    private configService: ConfigService,
  ) {}

  private calculateMaterialCoverage(areaM2: number, flooringType: string) {
    const suggestions = [];

    if (flooringType.toLowerCase().includes('epoxy') || flooringType.toLowerCase().includes('sơn')) {
      const totalEpoxyNeededKg = areaM2 * 1.2;
      const packsNeeded = Math.ceil(totalEpoxyNeededKg / 16);
      const primerPacksNeeded = Math.ceil((areaM2 * 0.1) / 15);

      suggestions.push({
        item: 'Sơn phủ Epoxy tự san phẳng KCC UT6581 (Bộ 16kg)',
        sku: 'C-KCC-UT6581',
        calculatedQty: packsNeeded,
        coverageNotes: `Cần ${totalEpoxyNeededKg.toFixed(0)}kg sơn phủ cho diện tích ${areaM2}m² (độ dày tiêu chuẩn 1mm).`,
      });

      suggestions.push({
        item: 'Sơn lót Epoxy gốc dầu KCC EP118 (Bộ 15kg)',
        sku: 'C-KCC-EP118',
        calculatedQty: primerPacksNeeded,
        coverageNotes: `Cần ${(areaM2 * 0.1).toFixed(0)}kg sơn lót (định mức 0.1kg/m²).`,
      });
    } else if (flooringType.toLowerCase().includes('mài') || flooringType.toLowerCase().includes('đánh bóng')) {
      const discsNeeded = Math.ceil(areaM2 / 20);
      suggestions.push({
        item: 'Đĩa mài bê tông kim cương đầu số HF #30',
        sku: 'A-DIA-HF30',
        calculatedQty: discsNeeded,
        coverageNotes: `Khuyến nghị 1 đĩa mài cho mỗi 20m² bề mặt sàn thô.`,
      });
    }

    return suggestions;
  }

  async createQuote(dto: CreateQuoteDto) {
    const {
      fullName,
      phone,
      email,
      companyName,
      address,
      notes,
      items,
      isB2b,
      projectArea,
      flooringType,
    } = dto;

    const area = projectArea ? (typeof projectArea === 'string' ? parseFloat(projectArea) : projectArea) : 0;
    const resolvedType = flooringType || 'Đánh bóng sàn bê tông';

    const productIds = items.map((i: any) => i.id).filter((id: any) => typeof id === 'string');

    let dbProducts: any[] = [];

    try {
      dbProducts = await this.prisma.product.findMany({
        where: { id: { in: productIds } },
      });
    } catch (dbError) {
      console.warn('Prisma database offline, using fallback mock products:', dbError);
      const fallbackProducts = MOCK_PRODUCTS.map((p) => ({
        id: p.id,
        sku: p.specs['Mã sản phẩm'] || `SKU-${p.id.toUpperCase()}`,
        name: p.name,
        price: p.price,
        agentPrice: p.agentPrice,
      }));
      dbProducts = fallbackProducts.filter((p) => productIds.includes(p.id));
    }

    let subtotal = 0;
    const detailedItems = items.map((item) => {
      const dbProd = dbProducts.find((p) => p.id === item.id);
      const priceUnit = dbProd
        ? isB2b
          ? item.agentPrice || dbProd.agentPrice
          : dbProd.price
        : item.price;
      const total = priceUnit * item.quantity;
      subtotal += total;

      return {
        id: item.id,
        name: dbProd ? dbProd.name : item.name,
        sku: dbProd ? dbProd.sku : 'SKU-UNKNOWN',
        quantity: item.quantity,
        priceUnit,
        total,
      };
    });

    let coverageEstimates: any[] = [];
    if (area > 0) {
      coverageEstimates = this.calculateMaterialCoverage(area, resolvedType);
    }

    const quoteId = `Q2026_${Math.floor(1000 + Math.random() * 9000)}`;
    const pdfUrl = `https://cdn.khangphuc.com/quotes/${quoteId}.pdf`;
    const excelUrl = `https://cdn.khangphuc.com/quotes/${quoteId}.xlsx`;

    const webhookUrl = this.configService.get<string>('ZALO_WEBHOOK_URL');
    const zaloPayload = {
      recipient: {
        group_id: 'zalo_group_sales_flooring_001',
      },
      message: {
        text:
          `🚨 HỆ THỐNG YÊU CẦU BÁO GIÁ MỚI - MÃ ĐƠN: ${quoteId} 🚨\n\n` +
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
          detailedItems
            .map(
              (item, idx) =>
                `${idx + 1}. ${item.name} (${item.sku}) - SL: ${item.quantity} - Đơn giá: ${item.priceUnit.toLocaleString(
                  'vi-VN',
                )} đ (Tổng: ${item.total.toLocaleString('vi-VN')} đ)`,
            )
            .join('\n') +
          `\n\n💰 **Tổng giá trị tạm tính (Chưa VAT & Ship):** ${subtotal.toLocaleString('vi-VN')} VNĐ\n\n` +
          (coverageEstimates.length > 0
            ? `📊 **Bảng định mức vật tư dự kiến từ diện tích sàn:**\n` +
              coverageEstimates
                .map((est) => `- ${est.item}: Định mức đề xuất ${est.calculatedQty} bộ/cái. (${est.coverageNotes})`)
                .join('\n') +
              '\n\n'
            : '') +
          `📝 **Ghi chú khách hàng:** ${notes || 'Không có ghi chú.'}\n\n` +
          `🔗 **Liên kết xử lý nhanh:**\n` +
          `- [Tải File Báo Giá Tạm Tính (PDF)](${pdfUrl})\n` +
          `- [Tải Bảng Tính Khối Lượng (Excel)](${excelUrl})\n` +
          `- [Mở CMS duyệt báo giá sỉ](https://khangphuc.com/admin/quotes/${quoteId})`,
      },
    };

    console.log('--- ZALO WEBHOOK TRIGGERED ---');
    console.log(JSON.stringify(zaloPayload, null, 2));
    console.log('------------------------------');

    if (webhookUrl) {
      try {
        await firstValueFrom(
          this.httpService.post(webhookUrl, zaloPayload, {
            headers: { 'Content-Type': 'application/json' },
          }),
        );
      } catch (err) {
        console.error('Failed to post to Zalo Webhook:', err);
      }
    }

    return {
      success: true,
      quoteId,
      subtotal,
      pdfUrl,
      excelUrl,
      coverageEstimates,
      message: 'Gửi yêu cầu báo giá thành công. Báo giá đã được chuyển tiếp đến Zalo của phòng kinh doanh.',
    };
  }
}
