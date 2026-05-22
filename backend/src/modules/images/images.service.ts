import { Injectable, BadRequestException } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class ImagesService {
  constructor(
    private readonly httpService: HttpService,
    private configService: ConfigService,
  ) {}

  async getImages(query: string, perPage: number = 10) {
    if (!query) {
      throw new BadRequestException('Missing query parameters');
    }

    const pexelsKey = this.configService.get<string>('PEXELS_API_KEY');
    if (!pexelsKey) {
      return { photos: [] };
    }

    try {
      const response = await firstValueFrom(
        this.httpService.get(
          `https://api.pexels.com/v1/search?query=${encodeURIComponent(query)}&per_page=${perPage}`,
          {
            headers: {
              Authorization: pexelsKey,
            },
          },
        ),
      );

      return response.data;
    } catch (error) {
      console.error('Failed to query Pexels API proxy:', error);
      return { photos: [] };
    }
  }
}
