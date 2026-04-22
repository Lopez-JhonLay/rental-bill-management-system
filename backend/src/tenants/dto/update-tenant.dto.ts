import { IsInt, IsOptional, IsString, Min } from 'class-validator';

export class UpdateTenantDto {
  @IsOptional()
  @IsString()
  tenant_name?: string;

  @IsOptional()
  @IsInt()
  @Min(1)
  person_count?: number;
}
