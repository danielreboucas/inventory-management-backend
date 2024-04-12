import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { OrderDto } from './dto';
import { Order } from '@prisma/client';

@Injectable({})
export class OrderService {
  constructor(private prisma: PrismaService) {}

  async createOrder(dto: OrderDto): Promise<Order> {
    try {
      const order = await this.prisma.order.create({
        data: {
          name: dto.name,
          value: Number(dto.value),
          discountedValue: Number(dto.discountedValue),
          date: dto.date,
          products: {
            connect: JSON.parse(JSON.stringify(dto.products)).map((product) => {
              return { name: product.name };
            }),
          },
          contactId: dto.contactId,
          supplierId: dto.supplierId,
        },
      });

      return order;
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          throw new ForbiddenException('Order already exists');
        }
        if (error.code === 'P2003') {
          throw new BadRequestException('Contact or Supplier does not exist');
        }
        if (error.code === 'P2025' || error.code === 'P2018') {
          throw new NotFoundException(
            'Product does not exist. Please create it before linking to the Order',
          );
        }

        throw error;
      }
    }
  }

  async getOrder(id: number): Promise<Order> {
    try {
      const order = await this.prisma.order.findUnique({
        where: {
          id: Number(id),
        },
      });

      return order;
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        throw error;
      }
    }
  }

  async getAllOrders(): Promise<{ data: Order[]; total: number }> {
    try {
      const orders = await this.prisma.order.findMany();
      return { data: orders, total: orders.length };
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        throw error;
      }
    }
  }

  async editOrder(id: number, dto: OrderDto): Promise<Order> {
    try {
      const order = await this.prisma.order.update({
        where: {
          id: Number(id),
        },
        data: {
          name: dto.name,
          value: dto.value,
          discountedValue: dto.discountedValue,
          date: dto.date,
          products: {
            connect: JSON.parse(JSON.stringify(dto.products)).map((product) => {
              return { name: product.name };
            }),
          },
          contactId: dto.contactId,
          supplierId: dto.supplierId,
        },
      });

      return order;
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          throw new ForbiddenException('Order already exists');
        }
        if (error.code === 'P2003') {
          throw new BadRequestException('Contact or Supplier does not exist');
        }
        if (error.code === 'P2025' || error.code === 'P2018') {
          throw new NotFoundException(
            'Product does not exist. Please create it before linking to the Order',
          );
        }
        throw error;
      }
    }
  }

  async deleteOrders(ids: string[]): Promise<number> {
    const convertedIds: number[] = [];
    ids.map((id) => {
      convertedIds.push(Number(id));
    });

    try {
      const deletedOrdersCount = await this.prisma.order.deleteMany({
        where: {
          id: {
            in: convertedIds,
          },
        },
      });

      return deletedOrdersCount.count;
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        throw error;
      }
    }
  }
}
