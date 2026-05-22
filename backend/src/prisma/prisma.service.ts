import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  async onModuleInit() {
    await this.$connect();
    // Optimize SQLite connection performance
    try {
      await this.$executeRawUnsafe(`PRAGMA journal_mode = WAL;`);
      await this.$executeRawUnsafe(`PRAGMA synchronous = NORMAL;`);
      await this.$executeRawUnsafe(`PRAGMA busy_timeout = 5000;`);
      await this.$executeRawUnsafe(`PRAGMA cache_size = -64000;`); // 64MB cache
      await this.$executeRawUnsafe(`PRAGMA temp_store = MEMORY;`);
    } catch (e) {
      console.warn('Failed to apply SQLite PRAGMAs:', e);
    }
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }
}
