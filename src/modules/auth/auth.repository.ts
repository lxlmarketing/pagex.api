import { EntityRepository, Repository } from 'typeorm';
import { RegisterCredentialsDto } from './dtos/register-credentials.dto';
import * as bcrypt from 'bcryptjs';
import {
  BadRequestException,
  ConflictException,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { LoginCredentialsDto } from './dtos/login-credentials.dto';
import { User } from '../user/user.entity';

@EntityRepository(User)
export class AuthRepository extends Repository<User> {
  async registerUser(
    registerCredentialsDto: RegisterCredentialsDto,
  ): Promise<any> {
    const user = this.create(registerCredentialsDto);

    user.password = user.hashPassword(user.password);
    
    try {
      await this.save(user);
    } catch (error) {
      if (error.code === '23505') {
        throw new ConflictException('User already exists');
      } else {
        throw new InternalServerErrorException();
      }
    }
  }
  async validateUserPassword(
    loginCredentialsDto: LoginCredentialsDto,
  ): Promise<any> {
    const { username, password } = loginCredentialsDto;

    const user = await this.findOne({ username });
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid || !user) {
      throw new BadRequestException('Invalid credentials');
    }

    return user;
  }
  async getByToken(token: string): Promise<User> {
    const user = await this.findOne({ resetToken: token });

    if (!user) {
      throw new NotFoundException('Token is invalid');
    }
    return user;
  }
  async getByEmail(email: string): Promise<User> {
    const user = await this.findOne({ email });

    if (!user) {
      throw new NotFoundException('Email is invalid');
    }
    return user;
  }
}
