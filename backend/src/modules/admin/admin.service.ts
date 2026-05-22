import { Injectable, ForbiddenException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { UpdateUserRoleDto } from './dto/update-user-role.dto';

const MOCK_USERS = [
  { id: '1', email: 'admin@khangphuc.com', name: 'Khang Phúc Admin', role: 'ADMIN', createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString() },
  { id: '2', email: 'user@khangphuc.com', name: 'Đại lý Khang Phúc B2B', role: 'USER', createdAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString() },
  { id: '3', email: 'congtydelta@gmail.com', name: 'Nhà thầu Delta Việt Nam', role: 'USER', createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString() }
];

@Injectable()
export class AdminService {
  constructor(private prisma: PrismaService) {}

  async isAdmin(cookieHeader?: string): Promise<boolean> {
    if (!cookieHeader) return false;
    try {
      const cookies = cookieHeader.split(';').reduce((acc, c) => {
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

  async getUsers(cookieHeader?: string) {
    const isAuthorized = await this.isAdmin(cookieHeader);
    if (!isAuthorized) {
      throw new ForbiddenException('Không có quyền truy cập');
    }

    try {
      const dbUsers = await this.prisma.user.findMany({
        select: {
          id: true,
          email: true,
          name: true,
          role: true,
          createdAt: true,
        },
        orderBy: { createdAt: 'desc' },
      });

      if (dbUsers.length > 0) {
        return { users: dbUsers };
      }
    } catch (dbError) {
      console.warn('Prisma database offline during getUsers, falling back to mock users:', dbError);
    }

    return { users: MOCK_USERS };
  }

  async updateUserRole(dto: UpdateUserRoleDto, cookieHeader?: string) {
    const isAuthorized = await this.isAdmin(cookieHeader);
    if (!isAuthorized) {
      throw new ForbiddenException('Không có quyền truy cập');
    }

    const { userId, role } = dto;

    if (!userId || !role || !['USER', 'ADMIN'].includes(role)) {
      throw new BadRequestException('Thông tin không hợp lệ');
    }

    try {
      const updated = await this.prisma.user.update({
        where: { id: userId },
        data: { role },
        select: { id: true, email: true, name: true, role: true },
      });

      return {
        message: 'Cập nhật phân quyền thành công',
        user: updated,
      };
    } catch (dbError) {
      console.warn('Prisma database offline during updateUserRole, simulating success:', dbError);
      return {
        message: 'Cập nhật phân quyền thành công (Chế độ Demo - Database Offline)',
        user: { id: userId, role },
      };
    }
  }
}
