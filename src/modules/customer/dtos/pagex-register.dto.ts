import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class PagexRegisterDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsString()
  password: string;

  @IsNotEmpty()
  @IsString()
  language: string;

  @IsNotEmpty()
  @IsString()
  editor: string;

  @IsNotEmpty()
  @IsString()
  active: string;
}
