import { BadRequestException, ConflictException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { LoginCredentialsDto } from './dtos/login-credentials.dto';
import { RegisterCredentialsDto } from './dtos/register-credentials.dto';
import { AuthRepository } from './auth.repository';
import { isAfter, addHours } from 'date-fns';
import { MailerService } from '@nestjs-modules/mailer';
import * as bcrypt from 'bcryptjs'

import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(AuthRepository)
    private readonly authRepository: AuthRepository,

    private readonly mailerService: MailerService,
    private readonly jwtService: JwtService,
  ) {}

  async register(registerCredentialsDto: RegisterCredentialsDto): Promise<any> {
    return await this.authRepository.registerUser(registerCredentialsDto);
  }

  async login(loginCredentialsDto: LoginCredentialsDto): Promise<any> {
    const user = await this.authRepository.validateUserPassword(
      loginCredentialsDto,
    );

    return {
      token: this.jwtService.sign({ user }),
    };
  }
  async changePassword(token: string, password: string): Promise<any> {
    const user = await this.authRepository.getByToken(token);

    const expiresToken = user.expiresToken;
    const compareDate = addHours(expiresToken, 2); // Expires in two hours

    if (isAfter(Date.now(), compareDate)) {
      throw new BadRequestException('Token expired');
    }

    if(bcrypt.compareSync(password, user.password)) {
      throw new ConflictException('Use a different password than the previous one')
    }
    user.password = user.hashPassword(password);

    user.resetToken = '';
    user.expiresToken = new Date(0);

    await this.authRepository.save(user);
  }

  async forgotPassword(email: string): Promise<any> {
    const user = await this.authRepository.getByEmail(email);

    const firstName = user.name.split(" ")[0]

    user.resetToken = uuidv4()
    user.expiresToken = new Date();

    await this.authRepository.save(user);

    await this.mailerService.sendMail({
      from: 'contato@pagex.com.br',
      to: user.email,
      subject: 'Redefina sua senha',
      template: 'forgot_password',
      context: { token: user.resetToken, name: firstName }
    })
  }
}
