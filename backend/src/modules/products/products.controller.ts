import { Controller, Get, Post, Put, Delete, Body, Param, Headers } from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Get()
  findAll() {
    return this.productsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.productsService.findOne(id);
  }

  @Post()
  create(
    @Body() createProductDto: CreateProductDto,
    @Headers('cookie') cookieHeader?: string,
  ) {
    return this.productsService.create(createProductDto, cookieHeader);
  }

  @Put(':id')
  update(
    @Param('id') id: string,
    @Body() createProductDto: CreateProductDto,
    @Headers('cookie') cookieHeader?: string,
  ) {
    return this.productsService.update(id, createProductDto, cookieHeader);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @Headers('cookie') cookieHeader?: string) {
    return this.productsService.remove(id, cookieHeader);
  }
}
