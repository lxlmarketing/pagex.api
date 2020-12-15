import { IsEmail, IsNotEmpty, IsNumber, IsString, MaxLength, MinLength } from 'class-validator'

export class CreateSubaccountDto {
  @IsNotEmpty()
  @IsEmail()
  email: string

  @IsNotEmpty()
  @IsString()
  name: string

  @IsNotEmpty()
  @IsString()
  password: string

  @IsNotEmpty()
  @MaxLength(2)
  @MinLength(2)
  @IsString()
  language: string

  @IsNotEmpty()
  editor: string

  @IsNotEmpty()
  active: string
}