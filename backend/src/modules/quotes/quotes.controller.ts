import { Controller, Post, Body, HttpCode, HttpStatus, Headers } from '@nestjs/common';
import { QuotesService } from './quotes.service';
import { CreateQuoteDto } from './dto/create-quote.dto';

@Controller('quotes')
export class QuotesController {
  constructor(private readonly quotesService: QuotesService) {}

  @Post('project-request')
  @HttpCode(HttpStatus.OK)
  createQuote(
    @Body() createQuoteDto: CreateQuoteDto,
    @Headers('x-posthog-distinct-id') distinctId?: string,
    @Headers('x-posthog-session-id') sessionId?: string,
  ) {
    return this.quotesService.createQuote(createQuoteDto, { distinctId, sessionId });
  }
}
