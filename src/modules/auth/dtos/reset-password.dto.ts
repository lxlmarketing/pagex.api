import { Matches } from 'class-validator';

export class ResetPasswordDto {
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/, {
    message: 'invalid password',
  })
  password: string;
}
