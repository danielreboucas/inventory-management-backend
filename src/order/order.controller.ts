import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { OrderService } from './order.service';
import { OrderDto } from './dto';
import { IsPublic } from 'src/auth/decorator';

@IsPublic()
@Controller('order')
export class OrderController {
  constructor(private orderService: OrderService) {}

  @Post()
  createOrder(@Body() dto: OrderDto) {
    return this.orderService.createOrder(dto);
  }

  @Get(':id')
  getOrder(@Param('id') id: number) {
    return this.orderService.getOrder(id);
  }

  @Get()
  getAllOrders() {
    return this.orderService.getAllOrders();
  }

  @Patch(':id')
  editOrder(@Param('id') id: number, @Body() dto: OrderDto) {
    return this.orderService.editOrder(id, dto);
  }

  @Delete()
  deleteOrders(@Body() data: { ids: string[] }) {
    return this.orderService.deleteOrders(data.ids);
  }
}
