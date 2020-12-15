import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class PagexUpdateDto {
  @IsNotEmpty()
  @IsEmail()
  pagexEmail: string;

  @IsNotEmpty()
  @IsString()
  pagexId: string;

  @IsNotEmpty()
  @IsString()
  resetToken: string;
}
