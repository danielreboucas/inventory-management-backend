import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { SupplierService } from './supplier.service';
import { SupplierDto } from './dto';
import { IsPublic } from 'src/auth/decorator';

@IsPublic()
@Controller('supplier')
export class SupplierController {
  constructor(private supplierService: SupplierService) {}

  @Post()
  createSupplier(@Body() dto: SupplierDto) {
    return this.supplierService.createSupplier(dto);
  }

  @Get(':id')
  getSupplier(@Param('id') id: number) {
    return this.supplierService.getSupplier(id);
  }

  @Get()
  getAllSuppliers() {
    return this.supplierService.getAllSuppliers();
  }

  @Patch(':id')
  editSupplier(@Param('id') id: number, @Body() dto: SupplierDto) {
    return this.supplierService.editSupplier(id, dto);
  }

  @Delete()
  deleteSuppliers(@Body() data: { ids: string[] }) {
    return this.supplierService.deleteSuppliers(data.ids);
  }
}
