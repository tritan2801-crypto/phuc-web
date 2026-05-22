import { Controller, Post, Body, HttpCode, HttpStatus, Headers } from '@nestjs/common';
import { CartService } from './cart.service';
import { CargoOptimizeDto } from './dto/cargo-optimize.dto';

@Controller('cart')
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Post('cargo-optimize')
  @HttpCode(HttpStatus.OK)
  optimize(
    @Body() cargoOptimizeDto: CargoOptimizeDto,
    @Headers('x-posthog-distinct-id') distinctId?: string,
    @Headers('x-posthog-session-id') sessionId?: string,
  ) {
    return this.cartService.optimize(cargoOptimizeDto, { distinctId, sessionId });
  }
}
