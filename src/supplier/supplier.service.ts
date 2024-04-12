import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { SupplierDto } from './dto';
import { Supplier } from '@prisma/client';

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

  async getSupplier(id: number) {
    try {
      const supplier = await this.prisma.supplier.findUnique({
        where: {
          id: Number(id),
        },
      });

      return supplier;
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        throw error;
      }
    }
  }

  async getAllSuppliers() {
    try {
      const suppliers = await this.prisma.supplier.findMany();
      return { data: suppliers, total: suppliers.length };
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        throw error;
      }
    }
  }

  async editSupplier(id: number, dto: SupplierDto): Promise<Supplier> {
    try {
      const supplier = await this.prisma.supplier.update({
        where: {
          id: Number(id),
        },
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
