import { IsNumber, IsOptional, IsString, Min } from 'class-validator';

export class UpdateUnitDto {
  @IsOptional()
  @IsString()
  unit_name?: string;

  @IsOptional()
  @IsNumber()
  @Min(0)
  monthly_rent?: number;
}
