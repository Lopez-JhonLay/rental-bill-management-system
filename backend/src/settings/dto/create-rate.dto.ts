import { IsNumber, IsDateString, Min } from 'class-validator';

export class CreateRateDto {
  @IsNumber()
  @Min(0)
  electricity_rate: number;

  @IsNumber()
  @Min(0)
  water_rate: number;

  @IsDateString()
  effective_from: string;
}
