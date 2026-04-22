import { IsInt, IsString, IsUUID, Min } from 'class-validator';

export class CreateTenantDto {
  @IsUUID()
  unit_id: string;

  @IsString()
  tenant_name: string;

  @IsInt()
  @Min(1)
  person_count: number;
}
