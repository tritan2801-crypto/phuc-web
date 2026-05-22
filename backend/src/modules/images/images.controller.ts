import { Controller, Get, Query } from '@nestjs/common';
import { ImagesService } from './images.service';

@Controller('images')
export class ImagesController {
  constructor(private readonly imagesService: ImagesService) {}

  @Get()
  getImages(@Query('q') query: string, @Query('per_page') perPage?: number) {
    const parsedPerPage = perPage ? Number(perPage) : 10;
    return this.imagesService.getImages(query, parsedPerPage);
  }
}
