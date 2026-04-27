import { IsNumber, IsOptional, Min } from 'class-validator';

export class UpdateBillDto {
  @IsOptional()
  @IsNumber()
  @Min(0)
  current_kwh?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  previous_kwh?: number;
}
