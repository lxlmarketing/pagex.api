import { IsEmail, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class HotmartHookDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsOptional()
  @IsString()
  status: string;

  phone_checkout_local_code: string;

  phone_local_code: string;

  phone_checkout_number: string;

  phone_number: string;
}
