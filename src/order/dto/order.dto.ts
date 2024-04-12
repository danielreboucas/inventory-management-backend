import {
  IsDateString,
  IsDecimal,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';
import { ProductDto } from 'src/product/dto';

export class OrderDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsDecimal()
  value: number;

  @IsOptional()
  @IsDecimal()
  discountedValue: number;

  @IsNotEmpty()
  @IsDateString()
  date: string;

  @IsNotEmpty()
  products: ProductDto[];

  @IsNotEmpty()
  soldTo: SoldToDTO;
}

export class SoldToDTO {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  contactInfo: string;
}
