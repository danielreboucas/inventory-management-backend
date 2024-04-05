import { Type } from 'class-transformer';
import { IsDecimal, IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class ProductDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsDecimal()
  costPrice: number;

  @IsNotEmpty()
  @IsDecimal()
  sellingPrice: number;

  @IsNotEmpty()
  @Type(() => Number)
  @IsNumber()
  quantity: number;

  @IsNotEmpty()
  @Type(() => Number)
  @IsNumber()
  userId: number;
}
