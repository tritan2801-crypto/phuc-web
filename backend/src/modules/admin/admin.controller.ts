import { Controller, Get, Put, Body, Headers } from '@nestjs/common';
import { AdminService } from './admin.service';
import { UpdateUserRoleDto } from './dto/update-user-role.dto';

@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Get('users')
  getUsers(@Headers('cookie') cookieHeader?: string) {
    return this.adminService.getUsers(cookieHeader);
  }

  @Put('users')
  updateUserRole(
    @Body() updateUserRoleDto: UpdateUserRoleDto,
    @Headers('cookie') cookieHeader?: string,
  ) {
    return this.adminService.updateUserRole(updateUserRoleDto, cookieHeader);
  }
}
