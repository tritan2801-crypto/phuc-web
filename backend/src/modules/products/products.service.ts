import { Injectable, NotFoundException, ForbiddenException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateProductDto } from './dto/create-product.dto';
import { MOCK_PRODUCTS } from '../../constants/mock-data';

@Injectable()
export class ProductsService {
  // In-memory simulation fallback if Prisma is offline
  private simulatedProducts: any[] = [];
  private deletedMockProductIds = new Set<string>();

  constructor(private prisma: PrismaService) {}

  async isAdmin(cookieHeader?: string): Promise<boolean> {
    if (!cookieHeader) return false;
    try {
      const cookies = cookieHeader.split(';').reduce((acc, c) => {
        const [key, val] = c.trim().split('=');
        acc[key] = val;
        return acc;
      }, {} as Record<string, string>);

      const sessionCookie = cookies['session_token'];
      if (!sessionCookie) return false;

      const decodedString = Buffer.from(sessionCookie, 'base64').toString('utf-8');
      const user = JSON.parse(decodedString);
      return user.role === 'ADMIN';
    } catch {
      return false;
    }
  }

  async findAll() {
    let mergedProducts = [...MOCK_PRODUCTS];

    try {
      const dbProducts = await this.prisma.product.findMany();
      if (dbProducts.length > 0) {
        dbProducts.forEach((dbProd) => {
          let parsedFeatures: string[] = [];
          let parsedSpecs: Record<string, string> = {};

          try {
            parsedFeatures = dbProd.features ? JSON.parse(dbProd.features) : [];
            parsedSpecs = dbProd.specs ? JSON.parse(dbProd.specs) : {};
          } catch {}

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
            warehouse: ['Hà Nội', 'TP. HCM'],
          };

          const index = mergedProducts.findIndex((p) => p.id === dbProd.id);
          if (index > -1) {
            mergedProducts[index] = mapped;
          } else {
            mergedProducts.unshift(mapped);
          }
        });
      }
    } catch (error) {
      console.warn('Prisma database offline during findAll, falling back to mock & simulated products:', error);
      
      this.simulatedProducts.forEach((offlineProd) => {
        const index = mergedProducts.findIndex((p) => p.id === offlineProd.id);
        if (index > -1) {
          mergedProducts[index] = offlineProd;
        } else {
          mergedProducts.unshift(offlineProd);
        }
      });
    }

    const productsWithSku = mergedProducts.map((p) => ({
      ...p,
      sku: (p as any).sku || `SKU-${p.id.toUpperCase().replace(/[^A-Z0-9]/g, '')}`,
    }));

    return { products: productsWithSku };
  }

  async findOne(id: string) {
    if (this.deletedMockProductIds.has(id)) {
      throw new NotFoundException('Không tìm thấy sản phẩm (Đã xóa ở chế độ Offline)');
    }

    try {
      const dbProd = await this.prisma.product.findUnique({ where: { id } });
      if (dbProd) {
        let parsedFeatures: string[] = [];
        let parsedSpecs: Record<string, string> = {};

        try {
          parsedFeatures = dbProd.features ? JSON.parse(dbProd.features) : [];
          parsedSpecs = dbProd.specs ? JSON.parse(dbProd.specs) : {};
        } catch {}

        return {
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
            specs: parsedSpecs,
          },
        };
      }
    } catch (error) {
      console.warn('Prisma database offline during findOne, using simulated fallback:', error);
      const offlineProd = this.simulatedProducts.find((p) => p.id === id);
      if (offlineProd) {
        return { product: offlineProd };
      }
    }

    const mockProd = MOCK_PRODUCTS.find((p) => p.id === id);
    if (mockProd) {
      return { product: mockProd };
    }

    throw new NotFoundException('Không tìm thấy sản phẩm');
  }

  async create(dto: CreateProductDto, cookieHeader?: string) {
    const isAuthorized = await this.isAdmin(cookieHeader);
    if (!isAuthorized) {
      throw new ForbiddenException('Không có quyền truy cập');
    }

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
      specs,
    } = dto;

    if (!name || !price || !category) {
      throw new BadRequestException('Tên, giá và danh mục là bắt buộc');
    }

    const cleanId = name
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/đ/g, 'd')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '');

    const productSku = sku || `SKU-${cleanId.toUpperCase()}-${Date.now().toString().slice(-4)}`;
    const parsedWeight = typeof weight === 'string' ? parseFloat(weight) : (weight || 0.1);
    const deliveryType =
      category === 'may-moc' || cleanId.includes('may') || parsedWeight >= 15.0 ? 'HEAVY' : 'LIGHT';

    const featuresString = Array.isArray(features) ? JSON.stringify(features) : JSON.stringify([]);
    const specsString = typeof specs === 'object' ? JSON.stringify(specs) : JSON.stringify({});

    const productData = {
      id: cleanId,
      sku: productSku,
      name,
      weight: parsedWeight,
      deliveryType: deliveryType as any,
      price: price || 0,
      agentPrice: agentPrice || price || 0,
      category,
      subCategory: subCategory || null,
      brand: brand || 'Khang Phúc',
      image: image || 'construction floor grinder machinery',
      description: description || '',
      features: featuresString,
      specs: specsString,
    };

    try {
      const created = await this.prisma.product.create({ data: productData });

      try {
        await this.prisma.inventoryLevel.createMany({
          data: [
            { productId: created.id, warehouseId: 'KHO_HCM', stockQty: 10, reservedQty: 0 },
            { productId: created.id, warehouseId: 'KHO_HN', stockQty: 8, reservedQty: 0 },
          ],
        });
      } catch (e) {
        console.warn('Could not create default inventory levels during product creation', e);
      }

      return {
        message: 'Thêm sản phẩm thành công',
        product: created,
      };
    } catch (dbError) {
      console.warn('Prisma database offline during product creation, simulating success:', dbError);

      const mappedSimulated = {
        id: cleanId,
        sku: productSku,
        name,
        category,
        subCategory: subCategory || undefined,
        brand: brand || 'Khang Phúc',
        price: price || 0,
        agentPrice: agentPrice || price || 0,
        weight: parsedWeight ? `${parsedWeight} kg` : undefined,
        image: image || 'construction floor grinder machinery',
        description: description || '',
        features: Array.isArray(features) ? features : [],
        specs: typeof specs === 'object' ? specs : {},
        stock: 10,
        inStock: true,
        warehouse: ['Hà Nội', 'TP. HCM'],
      };

      const index = this.simulatedProducts.findIndex((p) => p.id === cleanId);
      if (index > -1) {
        this.simulatedProducts[index] = mappedSimulated;
      } else {
        this.simulatedProducts.push(mappedSimulated);
      }

      return {
        message: 'Thêm sản phẩm thành công (Chế độ Demo - Database Offline)',
        product: mappedSimulated,
      };
    }
  }

  async update(id: string, dto: CreateProductDto, cookieHeader?: string) {
    const isAuthorized = await this.isAdmin(cookieHeader);
    if (!isAuthorized) {
      throw new ForbiddenException('Không có quyền truy cập');
    }

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
      specs,
    } = dto;

    if (!name || !price || !category) {
      throw new BadRequestException('Tên, giá và danh mục là bắt buộc');
    }

    const parsedWeight = typeof weight === 'string' ? parseFloat(weight) : (weight || 0.1);
    const deliveryType =
      category === 'may-moc' || id.includes('may') || parsedWeight >= 15.0 ? 'HEAVY' : 'LIGHT';

    const featuresString = Array.isArray(features) ? JSON.stringify(features) : JSON.stringify([]);
    const specsString = typeof specs === 'object' ? JSON.stringify(specs) : JSON.stringify({});

    const updateData = {
      sku: sku || `SKU-${id.toUpperCase()}`,
      name,
      weight: parsedWeight,
      deliveryType: deliveryType as any,
      price: price || 0,
      agentPrice: agentPrice || price || 0,
      category,
      subCategory: subCategory || null,
      brand: brand || 'Khang Phúc',
      image: image || 'construction floor grinder machinery',
      description: description || '',
      features: featuresString,
      specs: specsString,
    };

    try {
      const updated = await this.prisma.product.update({
        where: { id },
        data: updateData,
      });

      return {
        message: 'Cập nhật sản phẩm thành công',
        product: updated,
      };
    } catch (dbError) {
      console.warn('Prisma database offline during product update, simulating success:', dbError);

      const mappedSimulated = {
        id,
        sku: sku || `SKU-${id.toUpperCase()}`,
        name,
        category,
        subCategory: subCategory || undefined,
        brand: brand || 'Khang Phúc',
        price: price || 0,
        agentPrice: agentPrice || price || 0,
        weight: parsedWeight ? `${parsedWeight} kg` : undefined,
        image: image || 'construction floor grinder machinery',
        description: description || '',
        features: Array.isArray(features) ? features : [],
        specs: typeof specs === 'object' ? specs : {},
        stock: 10,
        inStock: true,
        warehouse: ['Hà Nội', 'TP. HCM'],
      };

      const index = this.simulatedProducts.findIndex((p) => p.id === id);
      if (index > -1) {
        this.simulatedProducts[index] = mappedSimulated;
      } else {
        this.simulatedProducts.push(mappedSimulated);
      }

      return {
        message: 'Cập nhật sản phẩm thành công (Chế độ Demo - Database Offline)',
        product: mappedSimulated,
      };
    }
  }

  async remove(id: string, cookieHeader?: string) {
    const isAuthorized = await this.isAdmin(cookieHeader);
    if (!isAuthorized) {
      throw new ForbiddenException('Không có quyền truy cập');
    }

    try {
      await this.prisma.product.delete({ where: { id } });
      return { message: 'Xóa sản phẩm thành công' };
    } catch (dbError) {
      console.warn('Prisma database offline during product deletion, simulating success:', dbError);

      this.simulatedProducts = this.simulatedProducts.filter((p) => p.id !== id);
      this.deletedMockProductIds.add(id);

      return {
        message: 'Xóa sản phẩm thành công (Chế độ Demo - Database Offline)',
      };
    }
  }
}
