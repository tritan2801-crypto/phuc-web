import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CargoOptimizeDto } from './dto/cargo-optimize.dto';
import { DeliveryType } from '../../enums/database.enums';
import { MOCK_PRODUCTS } from '../../constants/mock-data';
import { PostHogService } from '../posthog/posthog.service';

@Injectable()
export class CartService {
  constructor(
    private prisma: PrismaService,
    private posthog: PostHogService,
  ) { }

  async optimize(dto: CargoOptimizeDto, posthogCtx?: { distinctId?: string; sessionId?: string }) {
    const { cartItems, chosenTruckType } = dto;

    if (!cartItems || !Array.isArray(cartItems)) {
      throw new BadRequestException('Invalid cartItems');
    }

    const TRUCK_LIMITS: { [key: string]: number } = {
      TRUCK_1_5T: 1500, // kg
      TRUCK_5T: 5000, // kg
    };

    const maxCapacity = TRUCK_LIMITS[chosenTruckType];
    if (!maxCapacity) {
      return {
        status: 'NO_TRUCK',
        message: 'No truck selected. Standard lightweight shipping rules apply.',
        suggestions: [],
      };
    }

    const productIds = cartItems.map((item: any) => item.id).filter((id: any) => typeof id === 'string');

    let dbProducts: any[] = [];
    let accessories: any[] = [];

    try {
      dbProducts = await this.prisma.product.findMany({
        where: { id: { in: productIds } },
      });

      accessories = await this.prisma.product.findMany({
        where: {
          deliveryType: DeliveryType.LIGHT,
          id: { notIn: productIds },
        },
      });
    } catch (dbError) {
      console.warn('Prisma database offline, falling back to mock products logic:', dbError);
      this.posthog.captureException(dbError, posthogCtx?.distinctId || 'anonymous_user', { context: 'cart_db_error' });

      const fallbackProducts = MOCK_PRODUCTS.map((p) => ({
        id: p.id,
        sku: p.specs['Mã sản phẩm'] || `SKU-${p.id.toUpperCase()}`,
        name: p.name,
        weight: p.weight ? parseFloat(p.weight.replace(/[^\d.]/g, '')) : 0.1,
        deliveryType:
          p.category === 'may-moc' || p.id === 'chat-tang-cung-lithium' || p.id === 'son-epoxy-tu-san'
            ? DeliveryType.HEAVY
            : DeliveryType.LIGHT,
        price: p.price,
        agentPrice: p.agentPrice,
      }));

      dbProducts = fallbackProducts.filter((p) => productIds.includes(p.id));
      accessories = fallbackProducts.filter((p) => p.deliveryType === DeliveryType.LIGHT && !productIds.includes(p.id));
    }

    let currentWeight = 0;
    for (const item of cartItems) {
      const dbProd = dbProducts.find((p) => p.id === item.id);
      const weight = dbProd ? dbProd.weight : item.weight || 0.1;
      currentWeight += weight * item.quantity;
    }

    const remainingCapacity = maxCapacity - currentWeight;

    // Case 1: Overloaded
    if (remainingCapacity < 0) {
      let result;
      if (chosenTruckType === 'TRUCK_1_5T') {
        result = {
          status: 'OVERLOADED',
          currentWeight,
          maxCapacity,
          remainingCapacity,
          message: `Khối lượng hàng (${currentWeight.toFixed(1)}kg) đã vượt quá tải trọng xe 1.5 Tấn (${maxCapacity}kg). Đề xuất đổi lên xe tải 5 Tấn để vận chuyển an toàn.`,
          suggestUpgrade: true,
          suggestions: [] as any[],
        };
      } else {
        result = {
          status: 'OVERLOADED',
          currentWeight,
          maxCapacity,
          remainingCapacity,
          message: `Khối lượng hàng (${currentWeight.toFixed(1)}kg) đã vượt quá tải trọng tối đa của xe 5 Tấn (${maxCapacity}kg). Vui lòng tách đơn hàng hoặc liên hệ Sale để thuê xe chuyên dụng.`,
          suggestUpgrade: false,
          suggestions: [] as any[],
        };
      }

      this.posthog.capture({
        distinctId: posthogCtx?.distinctId || 'anonymous_user',
        event: 'cargo_optimized',
        properties: {
          status: result.status,
          chosenTruckType,
          currentWeight,
          maxCapacity,
          remainingCapacity,
          suggestUpgrade: result.suggestUpgrade,
          $session_id: posthogCtx?.sessionId,
        },
      });

      return result;
    }

    // Case 2: Within capacity limits -> Suggest light accessories to optimize capacity
    const validAccessories = accessories.filter((acc) => acc.weight <= remainingCapacity);

    // Sort accessories: heavy but fit in first to fill up the truck
    validAccessories.sort((a, b) => b.weight - a.weight);

    const suggestions = [];
    let currentRemaining = remainingCapacity;

    for (const acc of validAccessories) {
      if (currentRemaining <= 0.05) break;

      const maxQtyPossible = Math.floor(currentRemaining / acc.weight);
      if (maxQtyPossible > 0) {
        const recommendedQty = Math.min(maxQtyPossible, 10);
        if (recommendedQty > 0) {
          suggestions.push({
            id: acc.id,
            sku: acc.sku,
            name: acc.name,
            weight: acc.weight,
            price: acc.price || acc.weight * 300000 + 50000,
            recommendedQty,
            itemTotalWeight: acc.weight * recommendedQty,
          });
          currentRemaining -= acc.weight * recommendedQty;
        }
      }
    }

    const result = {
      status: 'OPTIMIZED',
      currentWeight,
      maxCapacity,
      remainingCapacity,
      suggestions,
    };

    this.posthog.capture({
      distinctId: posthogCtx?.distinctId || 'anonymous_user',
      event: 'cargo_optimized',
      properties: {
        status: result.status,
        chosenTruckType,
        currentWeight,
        maxCapacity,
        remainingCapacity,
        suggestionCount: suggestions.length,
        $session_id: posthogCtx?.sessionId,
      },
    });

    return result;
  }
}
