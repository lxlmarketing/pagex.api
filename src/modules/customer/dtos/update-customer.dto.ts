import { IsBoolean, IsEmail, IsOptional, IsString } from 'class-validator';

export class UpdateCustomerDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  password?: string;

  @IsOptional()
  @IsEmail()
  hotmartEmail?: string;

  @IsEmail()
  @IsOptional()
  pagexEmail?: string;

  @IsOptional()
  @IsString()
  pagexId?: string;

  @IsOptional()
  @IsBoolean()
  active?: boolean;
}
