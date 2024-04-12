import {
  IsDecimal,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsDateString,
} from 'class-validator';
import { OrderDto } from 'src/order/dto';
import { ProductDto } from 'src/product/dto';

export class SaleDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsDecimal()
  value: number;

  @IsNotEmpty()
  @IsDecimal()
  discountedValue: number;

  @IsNotEmpty()
  @IsDateString()
  data: string;

  @IsOptional()
  products: ProductDto[];

  @IsOptional()
  @IsNotEmpty()
  soldTo: OrderDto[];
}
