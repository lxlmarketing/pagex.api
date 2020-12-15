import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from '../user.controller';
import { UserService } from '../user.service';
import { UserRepository } from '../user.repository';
import { mockUserArray } from '../../../common/test/test.util';

const mockService = {
  getUsers: jest.fn().mockReturnValue(mockUserArray),
};

describe('UserController', () => {
  let controller: UserController;
  let service: UserService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [
        UserRepository,
        {
          provide: UserService,
          useValue: mockService,
        },
      ],
    }).compile();

    controller = module.get<UserController>(UserController);
    service = module.get<UserService>(UserService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getUsers()', () => {
    it('should return all users', async () => {
      const users = controller.getUsers();

      expect(users).resolves.not.toThrow();
      expect(users).resolves.toBe(mockUserArray);

      expect(mockService.getUsers).toBeCalledTimes(1);
    });
  });
});
