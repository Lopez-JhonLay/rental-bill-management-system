import { IsNumber, IsString, Min } from 'class-validator';

export class CreateUnitDto {
  @IsString()
  unit_name: string;

  @IsNumber()
  @Min(0)
  monthly_rent: number;
}
