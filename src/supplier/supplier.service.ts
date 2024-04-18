import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { SupplierDto } from './dto';
import { Supplier } from '@prisma/client';
import { ProductDto } from 'src/product/dto';
import { OrderDto } from 'src/order/dto';

@Injectable({})
export class SupplierService {
  constructor(private prisma: PrismaService) {}

  async createSupplier(dto: SupplierDto): Promise<Supplier> {
    try {
      const supplier = await this.prisma.supplier.create({
        data: {
          name: dto.name,
          contactInfo: dto.contactInfo,
          products: {
            connect: JSON.parse(JSON.stringify(dto.products)).map((product) => {
              return { name: product.name };
            }),
          },
          orders: {
            connect: JSON.parse(JSON.stringify(dto.orders)).map((order) => {
              return {
                name: order.name,
              };
            }),
          },
        },
      });

      return supplier;
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === 'P2025' || error.code === 'P2018') {
          throw new NotFoundException(
            'Product or order does not exist. Please create it before linking to the Supplier',
          );
        }
        if (error.code === 'P2002') {
          throw new ForbiddenException('Supplier already exists');
        }
        throw error;
      }
    }
  }

  async getSupplier(id: number): Promise<Supplier> {
    try {
      const supplier = await this.prisma.supplier.findUnique({
        where: {
          id: Number(id),
        },
        include: {
          products: true,
          orders: true,
        },
      });

      return supplier;
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        throw error;
      }
    }
  }

  async getAllSuppliers(): Promise<{ data: Supplier[]; total: number }> {
    try {
      const suppliers = await this.prisma.supplier.findMany({
        include: {
          products: true,
          orders: true,
        },
      });
      return { data: suppliers, total: suppliers.length };
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        throw error;
      }
    }
  }

  async editSupplier(id: number, dto: SupplierDto): Promise<Supplier> {
    const formattedProducts: ProductDto[] = [];
    const formattedOrders: OrderDto[] = [];
    dto.products.forEach((product) => {
      formattedProducts.push({
        name: product.name,
        costPrice: Number(product.costPrice),
        sellingPrice: Number(product.sellingPrice),
        quantity: Number(product.quantity),
        userId: Number(product.userId),
      });
    });
    dto.orders.forEach((order) => {
      formattedOrders.push({
        name: order.name,
        value: order.value,
        discountedValue: Number(order.discountedValue),
        date: order.date,
        products: formattedProducts,
        contactId: Number(order.contactId),
        supplierId: Number(order.supplierId),
      });
    });
    try {
      const supplier = await this.prisma.supplier.update({
        where: {
          id: Number(id),
        },
        data: {
          name: dto.name,
          contactInfo: dto.contactInfo,
          products: {
            set: formattedProducts,
          },
          orders: {
            set: JSON.parse(JSON.stringify(dto.orders)),
          },
        },
        include: { products: true, orders: true },
      });

      return supplier;
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === 'P2025' || error.code === 'P2018') {
          throw new NotFoundException(
            'Product or order does not exist. Please create it before linking to the Supplier',
          );
        }
        if (error.code === 'P2002') {
          throw new ForbiddenException('Supplier already exists');
        }
        throw error;
      }
    }
  }

  async deleteSuppliers(ids: string[]): Promise<number> {
    const convertedIds: number[] = [];
    ids.map((id) => {
      convertedIds.push(Number(id));
    });

    try {
      const deletedSuppliersCount = await this.prisma.supplier.deleteMany({
        where: {
          id: {
            in: convertedIds,
          },
        },
      });

      return deletedSuppliersCount.count;
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        throw error;
      }
    }
  }
}
