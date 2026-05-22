import { IsArray, IsString } from 'class-validator';

export class CargoOptimizeDto {
  @IsArray()
  cartItems: any[];

  @IsString()
  chosenTruckType: string;
}
