import { IsString, IsIn } from 'class-validator';

export class UpdateUserRoleDto {
  @IsString()
  userId: string;

  @IsIn(['USER', 'ADMIN'])
  role: string;
}
