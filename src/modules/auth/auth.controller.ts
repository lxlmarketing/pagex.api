/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Get,
  Post,
  Query,
  UseGuards,
  UseInterceptors,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { LoginCredentialsDto } from './dtos/login-credentials.dto';
import { RegisterCredentialsDto } from './dtos/register-credentials.dto';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './guards/jwt.guard';
import { CurrentUser } from './decorators/current-user.decorator';
import { ResetPasswordDto } from './dtos/reset-password.dto';

@Controller('auth')
@UseInterceptors(ClassSerializerInterceptor)
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/register')
  @UsePipes(ValidationPipe)
  async register(
    @Body() registerCredentialsDto: RegisterCredentialsDto,
  ): Promise<any> {
    return await this.authService.register(registerCredentialsDto);
  }

  @Post('/login')
  @UsePipes(ValidationPipe)
  async login(@Body() loginCredentialsDto: LoginCredentialsDto): Promise<any> {
    return this.authService.login(loginCredentialsDto);
  }

  @Get('/profile')
  @UseGuards(JwtAuthGuard)
  profile(@CurrentUser() user): any {
    return user;
  }

  @Post('/change-password')
  @UsePipes(ValidationPipe)
  async changePassword(
    @Query('token') token: string,
    @Body() resetPasswordDto: ResetPasswordDto,
  ): Promise<any> {
    return this.authService.changePassword(token, resetPasswordDto.password);
  }

  @Post('/forgot-password')
  async forgotPassword(@Body('email') email: string): Promise<any> {
    return this.authService.forgotPassword(email);
  }
}
