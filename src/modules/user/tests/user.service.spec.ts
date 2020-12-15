import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { mockUser, mockUserArray } from '../../../common/test/test.util';
import { UserRepository } from '../user.repository';
import { UserService } from '../user.service';

const mockRepository = {
  find: jest.fn().mockReturnValue(mockUserArray),
  findOne: jest.fn().mockReturnValue(mockUser),
  delete: jest.fn().mockReturnValue({ affected: 1 }),
};

describe('UserService', () => {
  let service: UserService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: UserRepository,
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getUsers()', () => {
    it('should return all users', () => {
      const users = service.getUsers();

      expect(users).resolves.toBe(mockUserArray);
      expect(mockRepository.find).toBeCalledTimes(1);
    });
  });

  describe('getById()', () => {
    it('should return a user by id', () => {
      expect(service.getById('1')).resolves.toBe(mockUser);
      expect(mockRepository.findOne).toHaveBeenCalledWith(mockUser.id);
    });

    it('should return a exception when does not found', async () => {
      mockRepository.findOne.mockReturnValue(null);

      expect(service.getById('4')).rejects.toThrow(NotFoundException);
      expect(mockRepository.findOne).toHaveBeenCalledWith('4');
    });
  });
  describe('delete()', () => {
    it('should delete a user', async () => {
      service.getById = jest.fn().mockReturnValueOnce(mockUser);

      expect(mockRepository.delete).not.toHaveBeenCalled();

      await service.delete('1');
      expect(service.getById).toHaveBeenCalledWith('1');
      expect(mockRepository.delete).toHaveBeenCalledWith(mockUser);
    });
  });
  describe('checkUserExits()', () => {
    it('should return a exception when user not exists', async () => {
      mockRepository.findOne.mockReturnValue(null);

      expect(service.checkUserExits).rejects.toThrow()
    })
  })
});
