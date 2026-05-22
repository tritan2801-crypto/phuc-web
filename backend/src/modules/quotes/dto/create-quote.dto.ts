import { IsString, IsEmail, IsOptional, IsArray, IsBoolean } from 'class-validator';

export class CreateQuoteDto {
  @IsString()
  fullName: string;

  @IsString()
  phone: string;

  @IsEmail()
  email: string;

  @IsOptional()
  @IsString()
  companyName?: string;

  @IsOptional()
  @IsString()
  address?: string;

  @IsOptional()
  @IsString()
  notes?: string;

  @IsArray()
  items: any[];

  @IsOptional()
  @IsBoolean()
  isB2b?: boolean;

  @IsOptional()
  projectArea?: string | number;

  @IsOptional()
  @IsString()
  flooringType?: string;
}
