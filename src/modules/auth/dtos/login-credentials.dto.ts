import { IsNotEmpty, IsString, Matches } from 'class-validator';

export class LoginCredentialsDto {
  @IsString()
  @IsNotEmpty()
  username: string;

  /*
    - Minimum 8 characters 
    - one uppercase letter 
    - one lowercase letter 
    - one number
   */
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/, {
    message: 'invalid password',
  })
  password: string;
}
