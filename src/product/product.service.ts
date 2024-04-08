import { ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { ProductDto } from './dto';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { Product } from '@prisma/client';

@Injectable({})
export class ProductService {
  constructor(private prisma: PrismaService) {}

  async createProduct(dto: ProductDto): Promise<Product> {
    try {
      const product = await this.prisma.product.create({
        data: {
          name: dto.name,
          costPrice: dto.costPrice,
          sellingPrice: dto.sellingPrice,
          quantity: dto.quantity,
          userId: dto.userId,
        },
      });

      return product;
    } catch (error) {
      console.log(error);

      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          throw new ForbiddenException('Product already exists');
        }
        throw error;
      }
    }
  }

  async getProduct(id: number): Promise<Product> {
    try {
      const product = await this.prisma.product.findUnique({
        where: {
          id: Number(id),
        },
      });

      return product;
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        throw error;
      }
    }
  }

  async getAllProducts(): Promise<{ data: Product[]; total: number }> {
    try {
      const products = await this.prisma.product.findMany();
      return { data: products, total: products.length };
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        throw error;
      }
    }
  }

  async editProduct(id: number, dto: ProductDto): Promise<Product> {
    try {
      const product = await this.prisma.product.update({
        where: {
          id: Number(id),
        },
        data: {
          name: dto.name,
          costPrice: dto.costPrice,
          sellingPrice: dto.sellingPrice,
          quantity: dto.quantity,
          userId: dto.userId,
        },
      });

      return product;
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        throw error;
      }
    }
  }

  async deleteProducts(ids: string[]): Promise<number> {
    const convertedIds: number[] = [];
    ids.map((id) => {
      convertedIds.push(Number(id));
    });

    try {
      const deletedProductCount = await this.prisma.product.deleteMany({
        where: {
          id: {
            in: convertedIds,
          },
        },
      });

      return deletedProductCount.count;
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        throw error;
      }
    }
  }
}
