import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { ProductDto } from './dto';
import { ProductService } from './product.service';

@Controller('product')
export class ProductController {
  constructor(private productService: ProductService) {}

  @Post()
  createProduct(@Body() dto: ProductDto) {
    return this.productService.createProduct(dto);
  }

  @Get(':id')
  getProduct(@Param('id') id: number) {
    return this.productService.getProduct(id);
  }

  @Get()
  getAllProducts() {
    return this.productService.getAllProducts();
  }

  @Patch(':id')
  editProduct(@Param('id') id: number, @Body() dto: ProductDto) {
    return this.productService.editProduct(id, dto);
  }

  @Delete(':id')
  deleteProduct(@Param('id') id: number) {
    return this.productService.deleteProduct(id);
  }
}
