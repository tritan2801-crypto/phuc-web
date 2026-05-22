import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateBehaviorDto } from './dto/create-behavior.dto';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class AnalyticsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly httpService: HttpService,
  ) {}

  async create(dto: CreateBehaviorDto, ip: string, userAgent: string) {
    const data = {
      userId: dto.userId || null,
      eventType: dto.eventType,
      page: dto.page,
      section: dto.section || null,
      elementId: dto.elementId || null,
      timeSpent: dto.timeSpent !== undefined && dto.timeSpent !== null ? Number(dto.timeSpent) : null,
      metadata: dto.metadata || null,
      ip,
      userAgent,
    };

    // 1. Save to local SQLite
    let savedLog = null;
    try {
      savedLog = await this.prisma.userBehavior.create({ data });
    } catch (e) {
      console.error('Error saving user behavior to DB:', e);
    }

    // 2. Forward to n8n webhook asynchronously if configured
    const webhookUrl = process.env.N8N_ANALYTICS_WEBHOOK_URL;
    if (webhookUrl) {
      try {
        // Run asynchronously without waiting to avoid blocking client response
        firstValueFrom(this.httpService.post(webhookUrl, {
          ...data,
          id: savedLog?.id || null,
          createdAt: savedLog?.createdAt || new Date(),
        })).catch(err => {
          console.error('Failed to forward analytics to n8n webhook:', err.message);
        });
      } catch (err) {
        console.error('Error initiating n8n webhook post:', err);
      }
    }

    return savedLog || { success: true, ...data };
  }

  async getLogs(query: {
    eventType?: string;
    page?: string;
    section?: string;
    limit?: number;
    pageIndex?: number;
  }) {
    const limit = query.limit ? Number(query.limit) : 20;
    const pageIndex = query.pageIndex ? Number(query.pageIndex) : 0;
    const skip = pageIndex * limit;

    const where: any = {};
    if (query.eventType) where.eventType = query.eventType;
    if (query.page) where.page = query.page;
    if (query.section) where.section = query.section;

    try {
      const [logs, total] = await Promise.all([
        this.prisma.userBehavior.findMany({
          where,
          orderBy: { createdAt: 'desc' },
          skip,
          take: limit,
        }),
        this.prisma.userBehavior.count({ where }),
      ]);

      // Calculate aggregate stats for dashboard representation
      const [sectionViews, clickCounts, totalUniqueUsers] = await Promise.all([
        this.prisma.userBehavior.groupBy({
          by: ['section'],
          _count: { id: true },
          where: { eventType: 'SECTION_VIEW', section: { not: null } },
          orderBy: { _count: { id: 'desc' } },
          take: 5,
        }),
        this.prisma.userBehavior.groupBy({
          by: ['elementId'],
          _count: { id: true },
          where: { eventType: 'CLICK', elementId: { not: null } },
          orderBy: { _count: { id: 'desc' } },
          take: 5,
        }),
        this.prisma.userBehavior.groupBy({
          by: ['ip'],
          _count: { id: true },
        }),
      ]);

      return {
        logs,
        total,
        stats: {
          sectionViews: sectionViews.map(sv => ({ section: sv.section, count: sv._count.id })),
          clickCounts: clickCounts.map(cc => ({ elementId: cc.elementId, count: cc._count.id })),
          uniqueVisitors: totalUniqueUsers.length,
        },
      };
    } catch (e) {
      console.warn('Prisma database error in getLogs, using fallback empty state:', e);
      return {
        logs: [],
        total: 0,
        stats: {
          sectionViews: [],
          clickCounts: [],
          uniqueVisitors: 0,
        },
      };
    }
  }

  async exportCsv(): Promise<string> {
    try {
      const logs = await this.prisma.userBehavior.findMany({
        orderBy: { createdAt: 'desc' },
      });

      // Excel UTF-8 BOM
      let csvContent = '\ufeff';
      
      // Header row
      const headers = [
        'ID',
        'User ID',
        'IP Address',
        'User Agent',
        'Event Type',
        'Page',
        'Section',
        'Element ID',
        'Time Spent (ms)',
        'Metadata',
        'Created At'
      ];
      csvContent += headers.map(h => `"${h}"`).join(',') + '\n';

      // Data rows
      for (const log of logs) {
        const row = [
          log.id,
          log.userId || '',
          log.ip || '',
          log.userAgent || '',
          log.eventType,
          log.page,
          log.section || '',
          log.elementId || '',
          log.timeSpent !== null ? String(log.timeSpent) : '',
          log.metadata || '',
          log.createdAt.toISOString(),
        ];
        csvContent += row.map(val => {
          // Escape quotes
          const escaped = String(val).replace(/"/g, '""');
          return `"${escaped}"`;
        }).join(',') + '\n';
      }

      return csvContent;
    } catch (e) {
      console.error('Failed to export analytics CSV:', e);
      return '\ufeff"Error exporting data"';
    }
  }
}
