import { Controller, Post, Get, Body, Req, Headers, Query, ForbiddenException, Res, HttpStatus } from '@nestjs/common';
import { Request, Response } from 'express';
import { AnalyticsService } from './analytics.service';
import { CreateBehaviorDto } from './dto/create-behavior.dto';

@Controller('analytics')
export class AnalyticsController {
  constructor(private readonly analyticsService: AnalyticsService) {}

  private isAdmin(cookieHeader?: string): boolean {
    if (!cookieHeader) return false;
    try {
      const cookies = cookieHeader.split(';').reduce((acc, c) => {
        if (!c.includes('=')) return acc;
        const [key, val] = c.trim().split('=');
        acc[key] = val;
        return acc;
      }, {} as Record<string, string>);

      const sessionCookie = cookies['session_token'];
      if (!sessionCookie) return false;

      const decodedString = Buffer.from(sessionCookie, 'base64').toString('utf-8');
      const user = JSON.parse(decodedString);
      return user.role === 'ADMIN';
    } catch {
      return false;
    }
  }

  @Post('track')
  async track(
    @Body() dto: CreateBehaviorDto,
    @Req() req: Request,
    @Headers('user-agent') userAgent: string = '',
  ) {
    const ip = (req.headers['x-forwarded-for'] as string) || req.ip || req.socket.remoteAddress || '';
    return this.analyticsService.create(dto, ip, userAgent);
  }

  @Get('logs')
  async getLogs(
    @Headers('cookie') cookieHeader: string = '',
    @Query('eventType') eventType?: string,
    @Query('page') page?: string,
    @Query('section') section?: string,
    @Query('limit') limit?: string,
    @Query('pageIndex') pageIndex?: string,
  ) {
    if (!this.isAdmin(cookieHeader)) {
      throw new ForbiddenException('Không có quyền truy cập');
    }

    return this.analyticsService.getLogs({
      eventType,
      page,
      section,
      limit: limit ? Number(limit) : undefined,
      pageIndex: pageIndex ? Number(pageIndex) : undefined,
    });
  }

  @Get('export')
  async export(
    @Headers('cookie') cookieHeader: string = '',
    @Res() res: Response,
  ) {
    if (!this.isAdmin(cookieHeader)) {
      throw new ForbiddenException('Không có quyền truy cập');
    }

    const csvContent = await this.analyticsService.exportCsv();
    
    res.setHeader('Content-Type', 'text/csv; charset=utf-8');
    res.setHeader('Content-Disposition', 'attachment; filename=user_behavior_logs.csv');
    
    return res.status(HttpStatus.OK).send(csvContent);
  }
}
