import { IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { OrderDto } from 'src/order/dto';
import { ProductDto } from 'src/product/dto';

export class SupplierDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsString()
  contactInfo: string;

  @IsOptional()
  products: ProductDto[];

  @IsOptional()
  orders: OrderDto[];
}
