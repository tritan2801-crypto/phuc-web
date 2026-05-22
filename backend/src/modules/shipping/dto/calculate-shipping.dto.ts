import { IsArray, IsString, IsOptional } from 'class-validator';

export class CalculateShippingDto {
  @IsArray()
  cartItems: any[];

  @IsString()
  destinationAddress: string;

  @IsOptional()
  @IsString()
  chosenTruckType?: string;
}
