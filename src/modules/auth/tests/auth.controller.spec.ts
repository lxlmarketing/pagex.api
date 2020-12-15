import { MailerModule, MailerService } from '@nestjs-modules/mailer';
import { JwtModule } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from '../auth.controller';
import { AuthRepository } from '../auth.repository';
import { AuthService } from '../auth.service';

const mockJwtConfig = {
  secret: 'secret',
  expiresIn: '1d',
};

describe('AuthController', () => {
  let controller: AuthController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        JwtModule.register({
          secret: mockJwtConfig.secret,
          signOptions: {
            expiresIn: mockJwtConfig.expiresIn,
          },
        }),
      ],
      controllers: [AuthController],
      providers: [
        AuthService,
        AuthRepository,
        {
          provide: 'MailerService',
          useValue: {
            sendMail(options) {
              return Promise.resolve(options);
            },
          },
        },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
