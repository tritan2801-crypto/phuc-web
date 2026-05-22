import { IsString, IsNumber, IsOptional, IsArray, IsObject } from 'class-validator';

export class CreateProductDto {
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  sku?: string;

  @IsNumber()
  price: number;

  @IsOptional()
  @IsNumber()
  agentPrice?: number;

  @IsOptional()
  weight?: string | number;

  @IsString()
  category: string;

  @IsOptional()
  @IsString()
  subCategory?: string;

  @IsOptional()
  @IsString()
  brand?: string;

  @IsOptional()
  @IsString()
  image?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsArray()
  features?: string[];

  @IsOptional()
  @IsObject()
  specs?: Record<string, string>;
}
