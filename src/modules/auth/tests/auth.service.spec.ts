import { JwtModule } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import { AuthRepository } from '../auth.repository';
import { AuthService } from '../auth.service';

const mockJwtConfig = {
  secret: 'secret',
  expiresIn: '1d',
};

describe('AuthService', () => {
  let service: AuthService;

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

    service = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
