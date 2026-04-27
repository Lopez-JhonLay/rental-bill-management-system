import { IsString, IsNumber, Min, Matches } from 'class-validator';

export class CreateBillDto {
  @IsString()
  unit_id: string;

  @IsString()
  @Matches(/^\d{4}-(0[1-9]|1[0-2])$/, {
    message: 'billing_month must be in YYYY-MM format e.g. 2026-04',
  })
  billing_month: string;

  @IsNumber()
  @Min(0)
  current_kwh: number;
}
