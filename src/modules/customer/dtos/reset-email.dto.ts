import { IsNotEmpty, IsString } from 'class-validator';

export class ResetEmailDto {
  @IsNotEmpty()
  @IsString()
  email: string;

  @IsNotEmpty()
  @IsString()
  token: string;
}
