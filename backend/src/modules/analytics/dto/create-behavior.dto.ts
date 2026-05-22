import { IsString, IsOptional, IsInt, IsNotEmpty } from 'class-validator';

export class CreateBehaviorDto {
  @IsString()
  @IsOptional()
  userId?: string;

  @IsString()
  @IsNotEmpty()
  eventType: string;

  @IsString()
  @IsNotEmpty()
  page: string;

  @IsString()
  @IsOptional()
  section?: string;

  @IsString()
  @IsOptional()
  elementId?: string;

  @IsInt()
  @IsOptional()
  timeSpent?: number;

  @IsString()
  @IsOptional()
  metadata?: string;
}
