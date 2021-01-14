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
  
  @IsNotEmpty()
  @IsString()
  phone_local_code: string;
  
  @IsNotEmpty()
  @IsString()
  phone_number: string;
}
