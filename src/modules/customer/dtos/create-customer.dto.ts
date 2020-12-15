import {
  IsBoolean,
  IsDateString,
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateCustomerDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsString()
  password: string;

  @IsEmail()
  hotmartEmail: string;

  @IsEmail()
  @IsOptional()
  pagexEmail?: string;

  @IsOptional()
  @IsString()
  pagexId?: string;

  @IsNotEmpty()
  @IsBoolean()
  active: any;

  @IsOptional()
  @IsString()
  resetToken?: string;
}
